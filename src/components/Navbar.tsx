import { useEffect, useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { RESORT_LOCATION, RESORT_NAME } from '../data/resortData';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  onBookNow: () => void;
  onNavigateSection: (sectionId: string) => void;
}

const TOP_LINKS = [
  { label: 'About', target: 'about' },
  { label: 'Rooms', target: 'rooms' },
  { label: 'Gallery', target: 'gallery' },
  { label: 'Location', target: 'contact' },
];

const FULLSCREEN_MENU_ITEMS = [
  { number: '01', label: 'Home', target: 'home' },
  { number: '02', label: 'About', target: 'about' },
  { number: '03', label: 'Rooms', target: 'rooms' },
  { number: '04', label: 'Gallery', target: 'gallery' },
  { number: '05', label: 'Reviews', target: 'reviews' },
  { number: '06', label: 'Location', target: 'contact' },
  { number: '07', label: 'Reservations', target: 'booking' },
];

export function Navbar({ onBookNow, onNavigateSection }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  const handleSelectNavItem = (target: string) => {
    setMenuOpen(false);
    window.setTimeout(() => {
      onNavigateSection(target);
    }, 180);
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'h-16 bg-[#000000]/92 backdrop-blur-md border-b border-[#C9A227]/25 shadow-md'
            : 'h-16 sm:h-20 bg-gradient-to-b from-[#000000]/80 via-[#000000]/35 to-transparent border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 lg:px-8">
          {/* Zone 1: Original HSH Crest + Wordmark */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              onNavigateSection('home');
            }}
            aria-label="Home Sweet Home Resort — Back to top"
            className="flex items-center gap-3 shrink-0 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9A227]"
          >
            <BrandLogo variant="header" />
            <span className="hidden sm:inline font-serif text-lg font-medium tracking-tight text-[#FFFFFF] whitespace-nowrap">
              {RESORT_NAME}
            </span>
          </a>

          {/* Zone 2: Clean Single-Line Quick Anchors */}
          <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-8">
            {TOP_LINKS.map((link) => (
              <a
                key={link.target}
                href={`#${link.target}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateSection(link.target);
                }}
                className="relative py-1 text-xs font-medium tracking-[0.16em] uppercase text-[#F9F6F0]/90 hover:text-[#D4AF37] transition-colors whitespace-nowrap shrink-0 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#D4AF37] hover:after:w-full after:transition-all after:duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Gold Pill Book Now + Full-Screen Menu Trigger */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={onBookNow}
              className="group inline-flex items-center gap-1.5 rounded-full bg-[#C9A227] hover:bg-[#D4AF37] px-4 sm:px-5 py-2 text-[11px] sm:text-xs font-semibold tracking-[0.14em] uppercase text-[#000000] transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-[0_0_20px_rgba(201,162,39,0.25)] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
            >
              <span>Book Now</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="fullscreen-navigation-drawer"
              aria-label="Open full-screen navigation menu"
              className="inline-flex items-center gap-2 rounded-full border border-[#F9F6F0]/35 bg-[#000000]/45 px-3.5 sm:px-4 py-2 text-[11px] sm:text-xs font-medium tracking-[0.16em] uppercase text-[#FFFFFF] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A227]"
            >
              <Menu className="h-3.5 w-3.5" />
              <span>Menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Obsidian Overlay Navigation (Slides Smoothly From Right) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="fullscreen-navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Full-screen resort navigation"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex flex-col justify-between bg-[#000000] text-[#F9F6F0] px-5 sm:px-10 lg:px-16 py-6 sm:py-8 overflow-y-auto"
          >
            {/* Top Bar inside Overlay */}
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 pb-5 border-b border-[#C9A227]/20">
              <div className="flex items-center gap-3">
                <BrandLogo variant="header" />
                <span className="font-serif text-lg sm:text-xl font-medium text-[#FFFFFF]">
                  {RESORT_NAME}
                </span>
              </div>

              <motion.button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close navigation menu"
                initial={{ opacity: 0, rotate: -45, scale: 0.9 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 45, scale: 0.9 }}
                transition={{ duration: 0.35, delay: 0.15 }}
                className="group inline-flex items-center gap-2.5 rounded-full border border-[#C9A227]/55 bg-[#000000] px-4 py-2 text-xs font-semibold tracking-[0.18em] uppercase text-[#D4AF37] hover:bg-[#C9A227] hover:text-[#000000] transition-colors"
              >
                <span>Close</span>
                <X className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
              </motion.button>
            </div>

            {/* Center Split: Sequential Gold-Numbered Navigation + Property Note */}
            <div className="mx-auto w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-10 py-8 sm:py-10 items-center">
              <nav aria-label="Full-screen menu links" className="lg:col-span-8 flex flex-col gap-2 sm:gap-3">
                {FULLSCREEN_MENU_ITEMS.map((item, idx) => (
                  <div key={item.target} className="overflow-hidden">
                    <motion.button
                      type="button"
                      onClick={() => handleSelectNavItem(item.target)}
                      initial={{ opacity: 0, y: 36 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.14 + idx * 0.055,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="group flex w-full items-baseline gap-5 sm:gap-7 py-2 text-left transition-colors"
                    >
                      <span className="font-sans text-xs sm:text-sm font-semibold tracking-[0.22em] text-[#C9A227] tabular-nums">
                        {item.number}
                      </span>
                      <span
                        aria-hidden="true"
                        className="h-px w-6 sm:w-10 bg-[#C9A227]/45 transition-all duration-300 group-hover:w-14 group-hover:bg-[#D4AF37]"
                      />
                      <span className="font-serif text-3xl sm:text-5xl lg:text-[3.25rem] font-medium text-[#F9F6F0] group-hover:text-[#D4AF37] group-hover:italic transition-all duration-200 leading-none">
                        {item.label}
                      </span>
                    </motion.button>
                  </div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-4 rounded-2xl border border-[#C9A227]/25 bg-[#FFFFFF]/[0.03] p-6 sm:p-8 space-y-5"
              >
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#C9A227] mb-2">
                    Location
                  </p>
                  <p className="text-sm leading-relaxed text-[#F9F6F0]/85">
                    {RESORT_LOCATION.streetLine} {RESORT_LOCATION.roadLine}{' '}
                    {RESORT_LOCATION.landmarkLine} {RESORT_LOCATION.cityPostalLine}{' '}
                    {RESORT_LOCATION.stateCountryLine}
                  </p>
                  <p className="mt-1.5 text-xs text-[#C9A227]/85">
                    {RESORT_LOCATION.lga}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F9F6F0]/12">
                  <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#C9A227] mb-3">
                    Suites &amp; Nightly Rates
                  </p>
                  <p className="text-xs sm:text-sm text-[#F9F6F0]/80 tabular-nums leading-relaxed">
                    Deluxe ₦35,000 · Super Deluxe ₦40,000 · Elite ₦45,000 · Super Elite ₦50,000
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectNavItem('booking')}
                  className="group w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#C9A227] hover:bg-[#D4AF37] px-6 py-3 text-xs font-semibold tracking-[0.16em] uppercase text-[#000000] transition-all"
                >
                  <span>Reserve a Room</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </motion.div>
            </div>

            {/* Bottom Tagline */}
            <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 pt-5 border-t border-[#C9A227]/20 text-xs text-[#F9F6F0]/55">
              <span>UDU • DELTA STATE • NIGERIA</span>
              <span>Home Sweet Home Resort</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
