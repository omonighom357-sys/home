import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { RESORT_PHOTOS, RoomCategory } from '../data/resortData';
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
  checkIn: string;
  checkOut: string;
  onDatesChange: (checkIn: string, checkOut: string) => void;
  onClose: () => void;
  onBookRoom: (room: RoomCategory) => void;
}

export function RoomDetailsModal({
  room,
  checkIn,
  checkOut,
  onDatesChange,
  onClose,
  onBookRoom,
}: RoomDetailsModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const galleryPhotos = useMemo(() => {
    if (!room) return [];
    const primary = getRoomPhoto(room.id, RESORT_PHOTOS);
    const companionSpaces = RESORT_PHOTOS.filter(
      (p) =>
        p.id !== primary.id &&
        (p.category === 'Interiors' || p.category === 'Rooms & Suites')
    ).slice(0, 3);
    return [primary, ...companionSpaces];
  }, [room]);

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
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#000000]/80 backdrop-blur-sm overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#F9F6F0] text-[#000000] border border-[#C9A227]/45 shadow-2xl"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close room details"
            className="absolute top-4 right-4 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#FFFFFF] text-[#000000] border border-[#000000]/15 hover:border-[#C9A227] transition-colors shadow-sm"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left: Suite Gallery */}
            <div className="lg:col-span-7 bg-[#000000] p-4 sm:p-6 flex flex-col justify-between text-[#F9F6F0]">
              <div
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#000000] flex items-center justify-center"
              >
                {activePhoto && (
                  <img
                    src={activePhoto.src}
                    alt={`${room.name} — ${activePhoto.title}`}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-contain bg-[#000000]"
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
                      className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#000000]/75 border border-[#C9A227]/40 text-[#FFFFFF] hover:bg-[#C9A227] hover:text-[#000000] transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveIndex((prev) => (prev + 1) % galleryPhotos.length)
                      }
                      aria-label="Next room photo"
                      className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#000000]/75 border border-[#C9A227]/40 text-[#FFFFFF] hover:bg-[#C9A227] hover:text-[#000000] transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => setIsFullscreen(true)}
                  aria-label="Open full-screen room photo"
                  className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-[#000000]/80 border border-[#C9A227]/40 px-3.5 py-1.5 text-xs font-semibold text-[#F9F6F0] hover:border-[#D4AF37] transition-colors"
                >
                  <Maximize2 className="h-3.5 w-3.5 text-[#D4AF37]" />
                  <span>See More Photos</span>
                </button>
              </div>

              {/* Thumbnail Strip */}
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
                        ? 'border-[#C9A227] opacity-100'
                        : 'border-transparent opacity-60 hover:opacity-95'
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
                <p className="mt-2 text-xs text-[#F9F6F0]/70">
                  Photo {activeIndex + 1} of {galleryPhotos.length} · {activePhoto.title}
                </p>
              )}
            </div>

            {/* Right: Suite Details & Direct Stay Preview */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div>
                <p className="text-xs font-semibold tracking-[0.22em] uppercase text-[#C9A227] mb-2">
                  Tier {room.tierCode} · {room.subtitle}
                </p>
                <h2
                  id="room-modal-title"
                  className="font-serif text-3xl sm:text-4xl font-medium text-[#000000]"
                >
                  {room.name}
                </h2>
                <p className="mt-2 text-2xl font-serif font-semibold text-[#C9A227] tabular-nums">
                  {formatNaira(room.nightlyRate)}{' '}
                  <span className="font-sans text-xs font-normal uppercase tracking-wider text-[#000000]/60">
                    per night
                  </span>
                </p>

                <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#000000]/80">
                  {room.description}
                </p>

                <div className="mt-6 pt-5 border-t border-[#000000]/10">
                  <h3 className="text-xs font-semibold tracking-[0.18em] uppercase text-[#000000]/75 mb-3">
                    Suite Finishes &amp; Appointments
                  </h3>

                  <ul className="space-y-2">
                    {room.observedHighlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-[#000000]/85"
                      >
                        <Check className="h-4 w-4 shrink-0 text-[#C9A227] mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stay Dates Preview */}
                <div className="mt-6 pt-5 border-t border-[#000000]/10">
                  <h3 className="text-xs font-semibold tracking-[0.18em] uppercase text-[#000000]/75 mb-3">
                    Stay Dates Preview
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="modal-checkin"
                        className="block text-xs font-medium text-[#000000]/75 mb-1"
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
                        className="w-full rounded-md border border-[#000000]/20 bg-[#FFFFFF] px-3 py-2 text-xs sm:text-sm text-[#000000] focus:border-[#C9A227] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="modal-checkout"
                        className="block text-xs font-medium text-[#000000]/75 mb-1"
                      >
                        Check-out
                      </label>
                      <input
                        id="modal-checkout"
                        type="date"
                        min={minCheckOut}
                        value={checkOut}
                        onChange={(e) => onDatesChange(checkIn, e.target.value)}
                        className="w-full rounded-md border border-[#000000]/20 bg-[#FFFFFF] px-3 py-2 text-xs sm:text-sm text-[#000000] focus:border-[#C9A227] focus:outline-none"
                      />
                    </div>
                  </div>

                  {nights && totalEstimate !== null ? (
                    <div className="mt-3 flex items-center justify-between rounded-lg bg-[#FFFFFF] border border-[#C9A227]/35 px-3.5 py-2.5 text-sm">
                      <span className="text-[#000000]/80 tabular-nums">
                        {nights} {nights === 1 ? 'night' : 'nights'} estimate
                      </span>
                      <span className="font-semibold text-[#000000] tabular-nums">
                        {formatNaira(totalEstimate)}
                      </span>
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-red-700">
                      Select a check-out date after check-in to calculate your stay total.
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onBookRoom(room)}
                  className="group w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#C9A227] hover:bg-[#D4AF37] px-6 py-3.5 text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase text-[#000000] transition-all"
                >
                  <span>Book This Room</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Full-Screen Room Photo Viewer */}
        {isFullscreen && activePhoto && (
          <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#000000]/96 p-4">
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              aria-label="Exit full-screen room view"
              className="absolute top-5 right-5 inline-flex items-center gap-2 rounded-full border border-[#C9A227]/45 bg-[#000000] px-4 py-2 text-xs font-semibold text-[#F9F6F0] hover:border-[#D4AF37]"
            >
              <Minimize2 className="h-4 w-4 text-[#C9A227]" />
              <span>Close Full View</span>
            </button>

            <img
              src={activePhoto.src}
              alt={activePhoto.title}
              referrerPolicy="no-referrer"
              className="max-h-[82vh] max-w-[92vw] object-contain rounded-lg"
            />
            <p className="mt-4 text-sm text-[#F9F6F0]/80">{activePhoto.title}</p>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
}
