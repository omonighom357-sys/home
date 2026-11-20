const MARQUEE_PHRASE =
  'LUXURY • COMFORT • HOSPITALITY • HOME SWEET HOME • UDU • DELTA • ';

export function MarqueeStrip() {
  return (
    <div
      aria-label="Home Sweet Home Resort philosophy banner"
      className="relative overflow-hidden bg-[#000000] border-y border-[#C9A227]/30 py-4 sm:py-5 select-none"
    >
      <div className="flex w-max animate-marquee-infinite">
        <div className="flex shrink-0 items-center whitespace-nowrap">
          <span className="font-serif text-sm sm:text-base tracking-[0.28em] uppercase text-[#C9A227] px-3">
            {MARQUEE_PHRASE}
          </span>
          <span className="font-serif text-sm sm:text-base tracking-[0.28em] uppercase text-[#D4AF37] px-3">
            {MARQUEE_PHRASE}
          </span>
          <span className="font-serif text-sm sm:text-base tracking-[0.28em] uppercase text-[#C9A227] px-3">
            {MARQUEE_PHRASE}
          </span>
        </div>
        <div className="flex shrink-0 items-center whitespace-nowrap" aria-hidden="true">
          <span className="font-serif text-sm sm:text-base tracking-[0.28em] uppercase text-[#C9A227] px-3">
            {MARQUEE_PHRASE}
          </span>
          <span className="font-serif text-sm sm:text-base tracking-[0.28em] uppercase text-[#D4AF37] px-3">
            {MARQUEE_PHRASE}
          </span>
          <span className="font-serif text-sm sm:text-base tracking-[0.28em] uppercase text-[#C9A227] px-3">
            {MARQUEE_PHRASE}
          </span>
        </div>
      </div>
    </div>
  );
}
