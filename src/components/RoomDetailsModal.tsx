import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  RESORT_PHOTOS,
  ResortConfig,
  RoomCategory,
} from '../data/resortData';
import {
  addDaysToDateString,
  calculateNights,
  calculateTotalPrice,
  formatNaira,
  getTodayDateString,
} from '../utils/booking';
import { getRoomPhoto } from '../utils/resortConfig';

interface RoomDetailsModalProps {
  room: RoomCategory | null;
  config: ResortConfig;
  checkIn: string;
  checkOut: string;
  onDatesChange: (checkIn: string, checkOut: string) => void;
  onClose: () => void;
  onBookRoom: (room: RoomCategory) => void;
  onOpenConfig: () => void;
}

export function RoomDetailsModal({
  room,
  config,
  checkIn,
  checkOut,
  onDatesChange,
  onClose,
  onBookRoom,
  onOpenConfig,
}: RoomDetailsModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const galleryPhotos = useMemo(() => {
    if (!room) return [];
    const primary = getRoomPhoto(room.id, config, RESORT_PHOTOS);
    const others = RESORT_PHOTOS.filter(
      (p) => p.id !== primary.id && p.category !== 'Exterior'
    );
    return [primary, ...others];
  }, [room, config]);

  useEffect(() => {
    setActiveIndex(0);
    setIsFullscreen(false);
  }, [room?.id]);

  useEffect(() => {
    if (!room) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowRight' && galleryPhotos.length > 1) {
        setActiveIndex((prev) => (prev + 1) % galleryPhotos.length);
      } else if (e.key === 'ArrowLeft' && galleryPhotos.length > 1) {
        setActiveIndex((prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [room, isFullscreen, galleryPhotos.length, onClose]);

  if (!room) return null;

  const today = getTodayDateString();
  const minCheckOut = checkIn ? addDaysToDateString(checkIn, 1) : addDaysToDateString(today, 1);
  const nights = calculateNights(checkIn, checkOut);
  const totalEstimate = nights ? calculateTotalPrice(room.nightlyRate, nights) : null;
  const verifiedAmenities = config.roomVerifiedAmenities[room.id] ?? [];
  const activePhoto = galleryPhotos[activeIndex] ?? galleryPhotos[0];

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || galleryPhotos.length <= 1) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    if (Math.abs(delta) > 45) {
      if (delta < 0) {
        setActiveIndex((prev) => (prev + 1) % galleryPhotos.length);
      } else {
        setActiveIndex((prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length);
      }
    }
    touchStartX.current = null;
  };

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="room-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#181715]/75 backdrop-blur-sm overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#F8F5EF] dark:bg-[#181715] border border-[#C5A46D]/30 shadow-2xl"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close room details"
            className="absolute top-4 right-4 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#FFFFFF]/90 dark:bg-[#242424]/90 text-[#242424] dark:text-[#F8F5EF] border border-[#242424]/15 dark:border-[#F8F5EF]/20 hover:border-[#C5A46D] transition-colors shadow-sm"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left: Immersive Gallery */}
            <div className="lg:col-span-7 bg-[#E8D9BD]/30 dark:bg-[#242424] p-4 sm:p-6 flex flex-col justify-between">
              <div
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#242424] flex items-center justify-center"
              >
                {activePhoto && (
                  <img
                    src={activePhoto.src}
                    alt={`${room.name} — ${activePhoto.title}`}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-contain bg-[#181715]"
                  />
                )}

                {galleryPhotos.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveIndex(
                          (prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length
                        )
                      }
                      aria-label="Previous room photo"
                      className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#181715]/70 text-[#F8F5EF] hover:bg-[#181715] transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveIndex((prev) => (prev + 1) % galleryPhotos.length)
                      }
                      aria-label="Next room photo"
                      className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#181715]/70 text-[#F8F5EF] hover:bg-[#181715] transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => setIsFullscreen(true)}
                  aria-label="Open full-screen room photo"
                  className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-md bg-[#181715]/80 px-3 py-1.5 text-xs font-medium text-[#F8F5EF] hover:bg-[#181715] transition-colors"
                >
                  <Maximize2 className="h-3.5 w-3.5 text-[#C5A46D]" />
                  <span>Full View</span>
                </button>
              </div>

              {/* Thumbnail Navigation */}
              <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-1">
                {galleryPhotos.map((photo, idx) => (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`View ${photo.title}`}
                    aria-current={idx === activeIndex ? 'true' : undefined}
                    className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                      idx === activeIndex
                        ? 'border-[#C5A46D] opacity-100'
                        : 'border-transparent opacity-65 hover:opacity-95'
                    }`}
                  >
                    <img
                      src={photo.src}
                      alt={photo.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
              {activePhoto && (
                <p className="mt-2 text-xs text-[#242424]/70 dark:text-[#F8F5EF]/70">
                  {idxLabel(activeIndex, galleryPhotos.length)} · {activePhoto.title}
                </p>
              )}
            </div>

            {/* Right: Room Info, Verified Amenities & Date Selection */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#A4834C] dark:text-[#C5A46D] mb-2">
                  Room Specification
                </p>
                <h2
                  id="room-modal-title"
                  className="font-serif text-3xl sm:text-4xl font-medium text-[#242424] dark:text-[#F8F5EF]"
                >
                  {room.name}
                </h2>
                <p className="mt-2 text-xl font-semibold text-[#A4834C] dark:text-[#C5A46D] tabular-nums">
                  {formatNaira(room.nightlyRate)}{' '}
                  <span className="text-xs font-normal text-[#242424]/65 dark:text-[#F8F5EF]/65">
                    per night
                  </span>
                </p>

                <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#242424]/80 dark:text-[#F8F5EF]/80">
                  {room.description}
                </p>

                {/* Verified Room Amenities */}
                <div className="mt-6 pt-5 border-t border-[#242424]/10 dark:border-[#F8F5EF]/10">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="text-xs font-semibold tracking-[0.18em] uppercase text-[#242424]/75 dark:text-[#F8F5EF]/75">
                      Verified Room Amenities
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenConfig();
                      }}
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#A4834C] dark:text-[#C5A46D] hover:underline"
                    >
                      <SlidersHorizontal className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                  </div>

                  {verifiedAmenities.length > 0 ? (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {verifiedAmenities.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-2 text-sm text-[#242424]/85 dark:text-[#F8F5EF]/85"
                        >
                          <Check className="h-4 w-4 shrink-0 text-[#84917A]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs leading-relaxed text-[#242424]/65 dark:text-[#F8F5EF]/65">
                      Confirmed room-specific amenities have not yet been published. Use Property
                      Setup to record verified inclusions without unconfirmed claims.
                    </p>
                  )}
                </div>

                {/* Check-in / Check-out selection */}
                <div className="mt-6 pt-5 border-t border-[#242424]/10 dark:border-[#F8F5EF]/10">
                  <h3 className="text-xs font-semibold tracking-[0.18em] uppercase text-[#242424]/75 dark:text-[#F8F5EF]/75 mb-3">
                    Select Stay Dates
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="modal-checkin"
                        className="block text-xs font-medium text-[#242424]/75 dark:text-[#F8F5EF]/75 mb-1"
                      >
                        Check-in
                      </label>
                      <input
                        id="modal-checkin"
                        type="date"
                        min={today}
                        value={checkIn}
                        onChange={(e) => {
                          const nextIn = e.target.value;
                          const nextOut =
                            checkOut && checkOut > nextIn
                              ? checkOut
                              : addDaysToDateString(nextIn, 1);
                          onDatesChange(nextIn, nextOut);
                        }}
                        className="w-full rounded-md border border-[#242424]/20 dark:border-[#F8F5EF]/20 bg-[#FFFFFF] dark:bg-[#242424] px-3 py-2 text-xs sm:text-sm text-[#242424] dark:text-[#F8F5EF] focus:border-[#C5A46D] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="modal-checkout"
                        className="block text-xs font-medium text-[#242424]/75 dark:text-[#F8F5EF]/75 mb-1"
                      >
                        Check-out
                      </label>
                      <input
                        id="modal-checkout"
                        type="date"
                        min={minCheckOut}
                        value={checkOut}
                        onChange={(e) => onDatesChange(checkIn, e.target.value)}
                        className="w-full rounded-md border border-[#242424]/20 dark:border-[#F8F5EF]/20 bg-[#FFFFFF] dark:bg-[#242424] px-3 py-2 text-xs sm:text-sm text-[#242424] dark:text-[#F8F5EF] focus:border-[#C5A46D] focus:outline-none"
                      />
                    </div>
                  </div>

                  {nights && totalEstimate !== null ? (
                    <div className="mt-3 flex items-center justify-between rounded-lg bg-[#E8D9BD]/40 dark:bg-[#242424] px-3.5 py-2.5 text-sm">
                      <span className="text-[#242424]/80 dark:text-[#F8F5EF]/80 tabular-nums">
                        {nights} {nights === 1 ? 'night' : 'nights'} estimate
                      </span>
                      <span className="font-semibold text-[#242424] dark:text-[#F8F5EF] tabular-nums">
                        {formatNaira(totalEstimate)}
                      </span>
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">
                      Select a valid check-out date after check-in to preview total.
                    </p>
                  )}
                </div>
              </div>

              {/* Modal Booking Action */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onBookRoom(room)}
                  className="w-full rounded-md bg-[#242424] dark:bg-[#C5A46D] px-6 py-3.5 text-sm font-semibold tracking-wide text-[#F8F5EF] dark:text-[#181715] hover:bg-[#3a3834] dark:hover:bg-[#d4b680] transition-colors"
                >
                  Book This Room
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Full-Screen Room Photo Viewer */}
        {isFullscreen && activePhoto && (
          <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#181715]/95 p-4">
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              aria-label="Exit full-screen room view"
              className="absolute top-5 right-5 inline-flex items-center gap-2 rounded-md border border-[#F8F5EF]/25 bg-[#242424] px-4 py-2 text-xs font-medium text-[#F8F5EF] hover:border-[#C5A46D]"
            >
              <Minimize2 className="h-4 w-4 text-[#C5A46D]" />
              <span>Close Full View</span>
            </button>

            <img
              src={activePhoto.src}
              alt={activePhoto.title}
              referrerPolicy="no-referrer"
              className="max-h-[82vh] max-w-[92vw] object-contain rounded-lg"
            />
            <p className="mt-4 text-sm text-[#F8F5EF]/80">{activePhoto.title}</p>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
}

function idxLabel(index: number, total: number): string {
  return `Photo ${index + 1} of ${total}`;
}
