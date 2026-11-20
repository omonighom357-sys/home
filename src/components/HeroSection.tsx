import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { RESORT_EXTERIOR_SRC } from '../data/resortData';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onExploreRooms: () => void;
  heroReady: boolean;
}

export function HeroSection({ onExploreRooms, heroReady }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement | null>(null);
  const bgParallaxRef = useRef<HTMLDivElement | null>(null);
  const foregroundRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const heroEl = heroRef.current;
    const bgEl = bgParallaxRef.current;
    const fgEl = foregroundRef.current;
    if (!heroEl || !bgEl || !fgEl) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.to(bgEl, {
        yPercent: 14,
        ease: 'none',
        scrollTrigger: {
          trigger: heroEl,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to(fgEl, {
        yPercent: -8,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: {
          trigger: heroEl,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, heroEl);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="home"
      aria-label="Home Sweet Home Resort Hero"
      className="relative min-h-[94svh] sm:min-h-[100svh] flex flex-col justify-between overflow-hidden bg-[#000000]"
    >
      {/* Full-Screen Authentic Building Facade with Slow Ken Burns + GSAP Parallax */}
      <div
        ref={bgParallaxRef}
        className="absolute inset-0 overflow-hidden will-change-transform"
      >
        <img
          src={RESORT_EXTERIOR_SRC}
          alt="Exterior facade of Home Sweet Home Resort at No. 4 Onosuru Street, Udu, Delta State"
          fetchPriority="high"
          decoding="async"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center animate-ken-burns"
        />

        {/* Subtle Cinematic Dark Gradient Overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-[#000000]/65 via-[#000000]/42 to-[#000000]/92"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 78% 64% at 22% 68%, rgba(0,0,0,0.84) 0%, rgba(0,0,0,0) 76%)',
          }}
        />
      </div>

      {/* Top Spacer for Fixed Header */}
      <div className="h-20 sm:h-24 shrink-0" aria-hidden="true" />

      {/* Center/Lower Editorial Content — Sequential Staggered Reveals */}
      <div
        ref={foregroundRef}
        className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 my-auto"
      >
        <div className="max-w-3xl">
          {/* Small Gold Location Label */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={heroReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.65, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-[11px] sm:text-xs font-semibold tracking-[0.28em] uppercase text-[#C9A227] mb-5"
          >
            UDU • DELTA STATE
          </motion.p>

          {/* Main Layered Headline */}
          <h1 className="font-serif text-[clamp(2.55rem,6.4vw,5.25rem)] font-medium tracking-tight leading-[1.04]">
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={heroReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.75, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="block text-[#FFFFFF]"
            >
              Feel at Home.
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 26 }}
              animate={heroReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
              transition={{ duration: 0.85, delay: 0.52, ease: [0.16, 1, 0.3, 1] }}
              className="block font-editorial italic font-normal text-[#D4AF37] mt-1 sm:mt-2"
            >
              Experience Something Special.
            </motion.span>
          </h1>

          {/* Supporting Text */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={heroReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ duration: 0.75, delay: 0.76, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 sm:mt-6 font-sans text-sm sm:text-base lg:text-lg leading-relaxed text-[#F9F6F0]/90 max-w-xl"
          >
            Discover comfort, relaxation and warm hospitality at Home Sweet Home Resort.
          </motion.p>

          {/* Primary Gold Pill CTA */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={heroReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ duration: 0.75, delay: 0.98, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 sm:mt-10"
          >
            <button
              type="button"
              onClick={onExploreRooms}
              className="group inline-flex items-center gap-3 rounded-full bg-[#C9A227] hover:bg-[#D4AF37] px-7 sm:px-8 py-4 text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase text-[#000000] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-[0_0_32px_rgba(201,162,39,0.38)] hover:shadow-[0_0_44px_rgba(212,175,55,0.6)] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
            >
              <span>Explore Our Rooms</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Bottom Animated Discovery Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={heroReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.7, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 flex items-center justify-between"
      >
        <a
          href="#about"
          className="group inline-flex items-center gap-3.5 text-[11px] font-semibold tracking-[0.26em] uppercase text-[#F9F6F0]/85 hover:text-[#D4AF37] transition-colors"
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#C9A227]/60 bg-[#000000]/45">
            <motion.span
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowDown className="h-3.5 w-3.5 text-[#D4AF37]" />
            </motion.span>
          </span>
          <span>Discover Home Sweet Home</span>
        </a>
      </motion.div>
    </section>
  );
}
