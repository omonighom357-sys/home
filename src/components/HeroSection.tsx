import { ArrowDown, Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { AtmosphereMode, RESORT_EXTERIOR_SRC } from '../data/resortData';

interface HeroSectionProps {
  atmosphere: AtmosphereMode;
  onSetAtmosphere: (mode: AtmosphereMode) => void;
  onExploreRooms: () => void;
  onBookStay: () => void;
  heroReady: boolean;
}

export function HeroSection({
  atmosphere,
  onSetAtmosphere,
  onExploreRooms,
  onBookStay,
  heroReady,
}: HeroSectionProps) {
  return (
    <section
      id="home"
      aria-label="Home Sweet Home Resort Hero"
      className="relative min-h-[88svh] sm:min-h-[92svh] lg:min-h-[96svh] flex flex-col justify-end overflow-hidden bg-[#181715]"
    >
      {/* Unified Full-Bleed Architectural Background Layer */}
      <motion.div
        initial={{ scale: 1.04, opacity: 0.9 }}
        animate={heroReady ? { scale: 1, opacity: 1 } : { scale: 1.04, opacity: 0.9 }}
        transition={{ duration: 1.35, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 overflow-hidden"
      >
        {/* Mobile extended atmospheric backdrop derived strictly from the original photograph */}
        <img
          src={RESORT_EXTERIOR_SRC}
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          className="md:hidden absolute inset-0 h-full w-full object-cover object-center scale-110 blur-xl opacity-75"
        />

        {/* Mobile crisp primary architectural image blended seamlessly into the unified hero */}
        <img
          src={RESORT_EXTERIOR_SRC}
          alt="Exterior facade of Home Sweet Home Resort showing its contemporary white and charcoal architectural wings"
          fetchPriority="high"
          decoding="async"
          referrerPolicy="no-referrer"
          style={{
            WebkitMaskImage:
              'linear-gradient(to bottom, rgba(0,0,0,1) 58%, rgba(0,0,0,0.65) 78%, rgba(0,0,0,0) 100%)',
            maskImage:
              'linear-gradient(to bottom, rgba(0,0,0,1) 58%, rgba(0,0,0,0.65) 78%, rgba(0,0,0,0) 100%)',
          }}
          className="md:hidden absolute inset-x-0 top-10 h-[66%] w-full object-cover object-[50%_20%]"
        />

        {/* Desktop & Tablet full-bleed architectural exterior */}
        <img
          src={RESORT_EXTERIOR_SRC}
          alt="Exterior facade of Home Sweet Home Resort showing its contemporary white and charcoal architectural wings"
          fetchPriority="high"
          decoding="async"
          referrerPolicy="no-referrer"
          className="hidden md:block h-full w-full object-cover object-center animate-hero-drift"
        />

        {/* Sophisticated warm dark-to-transparent gradient overlay for WCAG AA typography over the building */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#181715]/96 via-[#181715]/68 via-50% to-[#181715]/20 md:via-[#181715]/52 md:to-[#181715]/15"
        />
        <div
          aria-hidden="true"
          className="hidden md:block absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 68% 58% at 16% 86%, rgba(24,23,21,0.78) 0%, rgba(24,23,21,0) 76%)',
          }}
        />
      </motion.div>

      {/* Unified Foreground Editorial Typography, CTAs, Atmosphere Switch & Scroll Indicator */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-9 sm:pb-12 lg:pb-16">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-7 lg:gap-10">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={heroReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.65, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans text-[11px] sm:text-xs font-semibold tracking-[0.22em] sm:tracking-[0.26em] uppercase text-[#F8F5EF] md:text-[#E8D9BD] drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)] mb-3"
            >
              WELCOME TO HOME SWEET HOME RESORT
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={heroReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.75, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(2.25rem,6vw,4.25rem)] font-medium tracking-tight leading-[1.05] text-[#FFFFFF] drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] mb-4 sm:mb-5"
            >
              Where Every Stay Feels Like Home.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={heroReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ duration: 0.75, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans text-sm sm:text-base lg:text-lg leading-relaxed text-[#F8F5EF]/95 max-w-xl mb-7 sm:mb-8"
            >
              Discover an exceptional blend of comfort, elegance, and warm hospitality. Your
              perfect escape begins here.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={heroReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ duration: 0.7, delay: 0.52, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <button
                type="button"
                onClick={onExploreRooms}
                className="inline-flex items-center justify-center rounded-md bg-[#C5A46D] px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold tracking-wide text-[#181715] hover:bg-[#d4b680] active:scale-[0.98] transition-all duration-200 whitespace-nowrap shrink-0 shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A46D]"
              >
                Explore Our Rooms
              </button>

              <button
                type="button"
                onClick={onBookStay}
                className="inline-flex items-center justify-center rounded-md border border-[#F8F5EF]/50 bg-[#181715]/45 backdrop-blur-sm px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold tracking-wide text-[#FFFFFF] hover:border-[#C5A46D] hover:bg-[#181715]/75 active:scale-[0.98] transition-all duration-200 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A46D]"
              >
                Book Your Stay
              </button>
            </motion.div>
          </div>

          {/* Atmosphere Switch + Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={heroReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.7, delay: 0.68, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-4 pt-2 lg:pt-0 pr-14 sm:pr-0"
          >
            <div
              role="group"
              aria-label="Visual atmosphere mode"
              className="inline-flex items-center rounded-lg border border-[#F8F5EF]/25 bg-[#181715]/70 backdrop-blur-md p-1 shadow-sm"
            >
              <button
                type="button"
                onClick={() => onSetAtmosphere('daylight')}
                aria-pressed={atmosphere === 'daylight'}
                className={`inline-flex items-center gap-1.5 sm:gap-2 rounded-md px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-medium transition-colors whitespace-nowrap ${
                  atmosphere === 'daylight'
                    ? 'bg-[#F8F5EF] text-[#242424] shadow-sm'
                    : 'text-[#F8F5EF]/80 hover:text-[#FFFFFF]'
                }`}
              >
                <Sun className="h-3.5 w-3.5 text-[#C5A46D]" />
                <span>Golden Daylight</span>
              </button>

              <button
                type="button"
                onClick={() => onSetAtmosphere('evening')}
                aria-pressed={atmosphere === 'evening'}
                className={`inline-flex items-center gap-1.5 sm:gap-2 rounded-md px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-medium transition-colors whitespace-nowrap ${
                  atmosphere === 'evening'
                    ? 'bg-[#242424] text-[#F8F5EF] shadow-sm border border-[#C5A46D]/45'
                    : 'text-[#F8F5EF]/80 hover:text-[#FFFFFF]'
                }`}
              >
                <Moon className="h-3.5 w-3.5 text-[#C5A46D]" />
                <span>Evening Elegance</span>
              </button>
            </div>

            <a
              href="#about"
              aria-label="Scroll to explore Brand Story"
              className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] uppercase text-[#F8F5EF]/85 hover:text-[#C5A46D] transition-colors whitespace-nowrap"
            >
              <span className="hidden sm:inline">Scroll to Explore</span>
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ArrowDown className="h-3.5 w-3.5 text-[#C5A46D]" />
              </motion.span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
