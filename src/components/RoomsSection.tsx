import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { motion } from 'motion/react';
import {
  RESORT_PHOTOS,
  ROOM_CATEGORIES,
  RoomCategory,
} from '../data/resortData';
import { formatNaira } from '../utils/booking';
import { getRoomPhoto } from '../utils/resortConfig';

interface RoomsSectionProps {
  onViewDetails: (room: RoomCategory) => void;
  onBookRoom: (room: RoomCategory) => void;
}

export function RoomsSection({ onViewDetails, onBookRoom }: RoomsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef<{ isDown: boolean; startX: number; scrollLeft: number }>({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
  });

  const activeRoom = ROOM_CATEGORIES[activeIndex] ?? ROOM_CATEGORIES[0];

  const scrollToCard = (index: number) => {
    const safeIdx = Math.max(0, Math.min(ROOM_CATEGORIES.length - 1, index));
    setActiveIndex(safeIdx);

    const container = carouselRef.current;
    if (!container) return;
    const card = container.querySelector<HTMLElement>(`[data-room-card="${safeIdx}"]`);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  const handleStripSelect = (index: number) => {
    scrollToCard(index);
    const section = document.getElementById('rooms');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCarouselScroll = () => {
    const container = carouselRef.current;
    if (!container) return;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    let closestIdx = 0;
    let closestDist = Infinity;

    ROOM_CATEGORIES.forEach((_, idx) => {
      const card = container.querySelector<HTMLElement>(`[data-room-card="${idx}"]`);
      if (!card) return;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(containerCenter - cardCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = idx;
      }
    });

    if (closestIdx !== activeIndex) {
      setActiveIndex(closestIdx);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) return;
    const container = carouselRef.current;
    if (!container) return;
    dragState.current = {
      isDown: true,
      startX: e.clientX,
      scrollLeft: container.scrollLeft,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.isDown || !carouselRef.current) return;
    const delta = e.clientX - dragState.current.startX;
    carouselRef.current.scrollLeft = dragState.current.scrollLeft - delta * 1.15;
  };

  const handlePointerUp = () => {
    dragState.current.isDown = false;
  };

  return (
    <div id="rooms" className="relative scroll-mt-16">
      {/* SECTION 6 — STICKY ROOM NAVIGATION STRIP */}
      <div
        role="navigation"
        aria-label="Quick room tier selector"
        className="sticky top-16 z-30 bg-[#000000]/95 backdrop-blur-md border-y border-[#C9A227]/30"
      >
        <div className="no-scrollbar mx-auto flex max-w-7xl items-center justify-between gap-2 overflow-x-auto px-4 sm:px-6 lg:px-8 py-3">
          <span className="hidden lg:inline font-sans text-[11px] font-semibold tracking-[0.24em] uppercase text-[#C9A227] whitespace-nowrap shrink-0 pr-4">
            Suites
          </span>

          <div className="flex items-center gap-2 sm:gap-3 w-full lg:w-auto justify-between lg:justify-end">
            {ROOM_CATEGORIES.map((room, index) => {
              const selected = index === activeIndex;
              return (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => handleStripSelect(index)}
                  aria-current={selected ? 'true' : undefined}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-[0.14em] uppercase transition-all whitespace-nowrap shrink-0 ${
                    selected
                      ? 'bg-[#C9A227] text-[#000000] shadow-sm'
                      : 'border border-[#F9F6F0]/15 text-[#F9F6F0]/80 hover:border-[#C9A227]/60 hover:text-[#D4AF37]'
                  }`}
                >
                  <span>{room.name}</span>
                  <span
                    className={`tabular-nums ${
                      selected ? 'text-[#000000]/80' : 'text-[#C9A227]'
                    }`}
                  >
                    {formatNaira(room.nightlyRate)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 5 — BLACK ACCOMMODATION HORIZONTAL CAROUSEL */}
      <section
        aria-labelledby="rooms-heading"
        className="bg-[#000000] text-[#F9F6F0] pt-14 sm:pt-20 pb-20 sm:pb-28 lg:pb-32"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="h-px w-10 bg-[#C9A227]" aria-hidden="true" />
                <span className="font-sans text-xs font-semibold tracking-[0.26em] uppercase text-[#C9A227]">
                  — Accommodation
                </span>
              </div>

              <h2
                id="rooms-heading"
                className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#FFFFFF]"
              >
                Four Ways to{' '}
                <span className="font-editorial italic text-[#D4AF37]">Stay</span>
              </h2>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-5">
              <span className="inline-flex items-center gap-2 font-sans text-[11px] font-semibold tracking-[0.24em] uppercase text-[#C9A227]">
                <span>Swipe to Explore</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    scrollToCard(
                      (activeIndex - 1 + ROOM_CATEGORIES.length) % ROOM_CATEGORIES.length
                    )
                  }
                  aria-label="Previous room category"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#C9A227]/45 text-[#D4AF37] hover:bg-[#C9A227] hover:text-[#000000] transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToCard((activeIndex + 1) % ROOM_CATEGORIES.length)}
                  aria-label="Next room category"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#C9A227]/45 text-[#D4AF37] hover:bg-[#C9A227] hover:text-[#000000] transition-colors"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Horizontal Snap & Drag Room Carousel */}
          <div
            ref={carouselRef}
            onScroll={handleCarouselScroll}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="no-scrollbar flex gap-6 sm:gap-8 overflow-x-auto snap-x snap-mandatory pb-6 cursor-grab active:cursor-grabbing select-none"
          >
            {ROOM_CATEGORIES.map((room, index) => {
              const photo = getRoomPhoto(room.id, RESORT_PHOTOS);
              const isFocused = index === activeIndex;

              return (
                <motion.article
                  key={room.id}
                  data-room-card={index}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.65, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className={`group shrink-0 snap-center w-[84vw] sm:w-[62vw] md:w-[46vw] lg:w-[420px] flex flex-col justify-between rounded-2xl overflow-hidden border transition-all duration-300 ${
                    isFocused
                      ? 'border-[#C9A227] bg-[#FFFFFF]/[0.04]'
                      : 'border-[#F9F6F0]/15 bg-[#FFFFFF]/[0.02] hover:border-[#C9A227]/65'
                  }`}
                >
                  <div>
                    {/* Tall Authentic Suite Photo */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#000000]">
                      <img
                        src={photo.src}
                        alt={`${room.name} — ${photo.title}`}
                        draggable={false}
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                      />

                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#000000] via-[#000000]/45 to-transparent"
                      />

                      <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-[#000000]/80 border border-[#C9A227]/45 px-3.5 py-1 text-[11px] font-semibold tracking-[0.2em] uppercase text-[#D4AF37] tabular-nums">
                        <span>{room.tierCode}</span>
                      </div>

                      <div className="absolute bottom-4 left-5 right-5 flex items-baseline justify-between gap-2">
                        <p className="font-sans text-[11px] font-semibold tracking-[0.2em] uppercase text-[#F9F6F0]/80">
                          {room.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-6 sm:p-7">
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="font-serif text-3xl font-medium text-[#FFFFFF]">
                          {room.name}
                        </h3>
                        <p className="font-serif text-2xl font-semibold text-[#D4AF37] tabular-nums shrink-0">
                          {formatNaira(room.nightlyRate)}
                        </p>
                      </div>

                      <p className="mt-1 text-[11px] tracking-[0.18em] uppercase text-[#F9F6F0]/55">
                        Per Night
                      </p>

                      <p className="mt-4 text-sm leading-relaxed text-[#F9F6F0]/75 line-clamp-3">
                        {room.description}
                      </p>
                    </div>
                  </div>

                  {/* Gold Pill Actions */}
                  <div className="px-6 sm:px-7 pb-6 sm:pb-7 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onViewDetails(room)}
                      aria-label={`Explore ${room.name}`}
                      className="group/btn flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#C9A227] hover:bg-[#D4AF37] px-5 py-3 text-xs font-semibold tracking-[0.16em] uppercase text-[#000000] transition-all"
                    >
                      <span>Explore</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onBookRoom(room)}
                      aria-label={`Book ${room.name}`}
                      className="inline-flex items-center justify-center rounded-full border border-[#F9F6F0]/25 hover:border-[#D4AF37] px-5 py-3 text-xs font-semibold tracking-[0.14em] uppercase text-[#F9F6F0] hover:text-[#D4AF37] transition-colors whitespace-nowrap"
                    >
                      Reserve
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 14 (PART C) — WE'LL HELP YOU CHOOSE (WARM CREAM DECISION BLOCK) */}
      <section
        aria-label="Room tier selector guide"
        className="bg-[#F9F6F0] text-[#000000] py-16 sm:py-24 border-b border-[#C9A227]/25"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center rounded-3xl bg-[#FFFFFF] border border-[#C9A227]/30 p-7 sm:p-11 shadow-sm">
            <div className="lg:col-span-6">
              <p className="font-sans text-[11px] font-semibold tracking-[0.26em] uppercase text-[#C9A227] mb-3">
                — Room Comparison
              </p>
              <h3 className="font-serif text-3xl sm:text-4xl font-medium text-[#000000] leading-[1.12]">
                We&apos;ll Help You{' '}
                <span className="font-editorial italic text-[#C9A227]">Choose.</span>
              </h3>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#000000]/75">
                Every category across Home Sweet Home Resort shares attentive service and calm
                interiors. Select a tier below to inspect photographed finishes before reserving.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {ROOM_CATEGORIES.map((room, idx) => {
                  const selected = idx === activeIndex;
                  return (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      className={`rounded-full px-4 py-2 text-xs font-semibold tracking-[0.12em] uppercase transition-all ${
                        selected
                          ? 'bg-[#000000] text-[#D4AF37]'
                          : 'bg-[#F9F6F0] text-[#000000]/75 hover:text-[#000000]'
                      }`}
                    >
                      {room.name} · {formatNaira(room.nightlyRate)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-6 border-t lg:border-t-0 lg:border-l border-[#000000]/10 pt-6 lg:pt-0 lg:pl-10">
              <div className="flex items-baseline justify-between gap-4 pb-4 border-b border-[#000000]/10">
                <div>
                  <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#C9A227]">
                    Tier {activeRoom.tierCode} Selected
                  </span>
                  <h4 className="font-serif text-3xl font-medium text-[#000000] mt-0.5">
                    {activeRoom.name}
                  </h4>
                </div>
                <p className="font-serif text-2xl sm:text-3xl font-semibold text-[#C9A227] tabular-nums">
                  {formatNaira(activeRoom.nightlyRate)}
                </p>
              </div>

              <ul className="mt-5 space-y-2.5">
                {activeRoom.observedHighlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2.5 text-sm text-[#000000]/80">
                    <Check className="h-4 w-4 text-[#C9A227] mt-0.5 shrink-0" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onBookRoom(activeRoom)}
                  className="group inline-flex items-center gap-2 rounded-full bg-[#C9A227] hover:bg-[#D4AF37] px-6 py-3 text-xs font-semibold tracking-[0.15em] uppercase text-[#000000] transition-all"
                >
                  <span>Book This Room</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </button>

                <button
                  type="button"
                  onClick={() => onViewDetails(activeRoom)}
                  className="inline-flex items-center rounded-full border border-[#000000]/20 hover:border-[#C9A227] px-5 py-3 text-xs font-semibold tracking-[0.14em] uppercase text-[#000000] transition-colors"
                >
                  See More Photos
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
