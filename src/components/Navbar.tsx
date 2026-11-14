import { useEffect, useState } from 'react';
import { Moon, SlidersHorizontal, Sun } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { AtmosphereMode } from '../data/resortData';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  atmosphere: AtmosphereMode;
  onToggleAtmosphere: () => void;
  onBookNow: () => void;
  onOpenConfig: () => void;
}

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Rooms & Suites', href: '#rooms' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Experiences', href: '#experiences' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar({
  atmosphere,
  onToggleAtmosphere,
  onBookNow,
  onOpenConfig,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 36);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  const overHero = !scrolled && !mobileOpen;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        overHero
          ? 'h-14 sm:h-16 lg:h-18 bg-gradient-to-b from-[#181715]/60 via-[#181715]/25 to-transparent border-b border-transparent'
          : 'h-14 sm:h-16 lg:h-18 bg-[#F8F5EF]/95 dark:bg-[#181715]/95 backdrop-blur-md border-b border-[#242424]/10 dark:border-[#F8F5EF]/10 shadow-sm'
      }`}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Original Logo & Balanced Brand Title */}
        <a
          href="#home"
          onClick={closeMobile}
          aria-label="Home Sweet Home Resort — Back to top"
          className="flex items-center gap-2.5 sm:gap-3 shrink-0 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C5A46D]"
        >
          <div
            className={`inline-flex items-center justify-center rounded-md transition-all duration-300 ${
              overHero
                ? 'bg-[#F8F5EF]/95 px-2 py-0.5 shadow-sm border border-[#C5A46D]/30'
                : 'dark:bg-[#F8F5EF]/95 dark:px-2 dark:py-0.5 dark:border dark:border-[#C5A46D]/30'
            }`}
          >
            <BrandLogo variant="header" className="!p-0 !bg-transparent !border-0 !shadow-none" />
          </div>
          <span
            className={`hidden sm:inline font-serif text-lg lg:text-xl font-semibold tracking-tight whitespace-nowrap transition-colors duration-300 ${
              overHero
                ? 'text-[#FFFFFF] drop-shadow-sm'
                : 'text-[#242424] dark:text-[#F8F5EF]'
            }`}
          >
            Home Sweet Home Resort
          </span>
        </a>

        {/* Zone 2: Desktop Navigation Links */}
        <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`relative py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#C5A46D] hover:after:w-full after:transition-all after:duration-200 ${
                overHero
                  ? 'text-[#F8F5EF]/95 hover:text-[#FFFFFF]'
                  : 'text-[#242424]/80 dark:text-[#F8F5EF]/85 hover:text-[#242424] dark:hover:text-[#F8F5EF]'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Book Now CTA + Animated Mobile Hamburger */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onBookNow}
            className={`inline-flex items-center justify-center rounded-md px-3.5 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold tracking-wider uppercase transition-all duration-200 active:scale-[0.98] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A46D] ${
              overHero
                ? 'bg-[#C5A46D] text-[#181715] hover:bg-[#d4b680] shadow-sm'
                : 'bg-[#242424] dark:bg-[#C5A46D] text-[#F8F5EF] dark:text-[#181715] hover:bg-[#3a3834] dark:hover:bg-[#d4b680]'
            }`}
          >
            Book Now
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation-menu"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className={`inline-flex lg:hidden h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-md border transition-colors ${
              overHero
                ? 'border-[#F8F5EF]/35 bg-[#181715]/35 backdrop-blur-sm text-[#FFFFFF]'
                : 'border-[#242424]/15 dark:border-[#F8F5EF]/15 text-[#242424] dark:text-[#F8F5EF]'
            }`}
          >
            <span
              className={`block h-0.5 w-4 rounded-full bg-current transition-transform duration-200 ${
                mobileOpen ? 'translate-y-1 rotate-45' : ''
              }`}
            />
            <span
              className={`block h-0.5 w-4 rounded-full bg-current transition-transform duration-200 ${
                mobileOpen ? '-translate-y-1 -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Animated Mobile Navigation Panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-navigation-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden border-b border-[#242424]/10 dark:border-[#F8F5EF]/10 bg-[#F8F5EF]/98 dark:bg-[#181715]/98 backdrop-blur-lg px-5 py-6 shadow-xl"
          >
            <nav aria-label="Mobile navigation" className="flex flex-col divide-y divide-[#242424]/8 dark:divide-[#F8F5EF]/8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMobile}
                  className="py-3.5 text-base font-medium text-[#242424] dark:text-[#F8F5EF] hover:text-[#A4834C] dark:hover:text-[#C5A46D] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="mt-5 pt-4 border-t border-[#242424]/10 dark:border-[#F8F5EF]/10 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  closeMobile();
                  onBookNow();
                }}
                className="w-full rounded-md bg-[#242424] dark:bg-[#C5A46D] px-5 py-3 text-xs font-semibold tracking-wider uppercase text-[#F8F5EF] dark:text-[#181715] transition-colors"
              >
                Book Now
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={onToggleAtmosphere}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-[#242424]/15 dark:border-[#F8F5EF]/15 px-3 py-2.5 text-xs font-medium text-[#242424] dark:text-[#F8F5EF]"
                >
                  {atmosphere === 'daylight' ? (
                    <>
                      <Moon className="h-3.5 w-3.5 text-[#C5A46D]" />
                      <span>Evening Mode</span>
                    </>
                  ) : (
                    <>
                      <Sun className="h-3.5 w-3.5 text-[#C5A46D]" />
                      <span>Daylight Mode</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    closeMobile();
                    onOpenConfig();
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-[#242424]/15 dark:border-[#F8F5EF]/15 px-3 py-2.5 text-xs font-medium text-[#242424] dark:text-[#F8F5EF]"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 text-[#C5A46D]" />
                  <span>Property Setup</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
