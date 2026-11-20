import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { AnimatedText } from './AnimatedText';
import { BrandLogo } from './BrandLogo';

interface CinematicIntroProps {
  onComplete: () => void;
}

export function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      const quickTimer = window.setTimeout(() => onComplete(), 120);
      return () => window.clearTimeout(quickTimer);
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setExiting(true);
        window.setTimeout(() => onComplete(), 280);
      }
    };
    window.addEventListener('keydown', onKeyDown);

    const exitTimer = window.setTimeout(() => {
      setExiting(true);
    }, 2800);

    const completeTimer = window.setTimeout(() => {
      onComplete();
    }, 3450);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.clearTimeout(exitTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setExiting(true);
    window.setTimeout(() => {
      onComplete();
    }, 240);
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Home Sweet Home Resort Grand Opening"
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#000000] px-5 sm:px-8 text-[#F9F6F0]"
    >
      {/* Subtle warm radial gold shimmer on obsidian canvas */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 44%, rgba(201,162,39,0.14) 0%, rgba(0,0,0,0) 62%)',
        }}
      />

      {/* Non-blocking Skip Control */}
      <div className="absolute top-5 right-5 sm:top-7 sm:right-8 z-20">
        <button
          type="button"
          onClick={handleSkip}
          className="rounded-full border border-[#C9A227]/45 bg-[#000000]/80 px-4 py-1.5 text-[11px] font-medium tracking-[0.2em] uppercase text-[#F9F6F0]/80 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A227]"
        >
          Skip
        </button>
      </div>

      {/* Step 1: Scaled Gold HSH Crest */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.78 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <BrandLogo variant="intro" />
        </motion.div>

        {/* Step 2: Thin Gold Horizontal Line Draw */}
        <motion.div
          aria-hidden="true"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.75, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
          className="mb-7 h-px w-full max-w-md origin-center bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
        />

        {/* Step 3: Letter-by-Letter Brand Typography Reveal */}
        <AnimatedText
          as="h1"
          text="HOME SWEET HOME RESORT"
          baseDelay={0.85}
          charStep={0.036}
          duration={0.42}
          className="w-full font-serif font-medium tracking-[0.14em] text-[#D4AF37] text-[clamp(1.15rem,3.6vw,2.35rem)]"
        />
      </div>
    </motion.div>
  );
}
