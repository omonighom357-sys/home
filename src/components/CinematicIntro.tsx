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
      const quickTimer = window.setTimeout(() => onComplete(), 150);
      return () => window.clearTimeout(quickTimer);
    }

    const exitTimer = window.setTimeout(() => {
      setExiting(true);
    }, 5100);

    const completeTimer = window.setTimeout(() => {
      onComplete();
    }, 6050);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setExiting(true);
    window.setTimeout(() => {
      onComplete();
    }, 280);
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Home Sweet Home Resort Grand Opening"
      initial={{ opacity: 1 }}
      animate={{
        opacity: exiting ? 0 : 1,
        scale: exiting ? 1.02 : 1,
      }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#F8F5EF] px-5 sm:px-8 text-[#242424]"
    >
      {/* Subtle golden atmospheric light sweep */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="animate-gold-sweep absolute -top-1/3 left-1/4 h-[160%] w-[55%] rounded-full opacity-55 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(197,164,109,0.28) 0%, rgba(232,217,189,0.2) 45%, rgba(248,245,239,0) 75%)',
          }}
        />
      </div>

      {/* Discreet Skip Intro Button */}
      <div className="absolute top-5 right-5 sm:top-7 sm:right-7 z-20">
        <button
          type="button"
          onClick={handleSkip}
          className="px-4 py-2 text-[11px] sm:text-xs font-medium tracking-[0.18em] uppercase text-[#242424]/75 hover:text-[#242424] border border-[#C5A46D]/40 hover:border-[#C5A46D] rounded-md bg-[#F8F5EF]/85 backdrop-blur-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A46D] whitespace-nowrap"
        >
          Skip Intro
        </button>
      </div>

      {/* Centered Logo + Word-Safe Staggered Welcome Composition */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-7 sm:mb-9"
        >
          <BrandLogo variant="intro" className="h-20 sm:h-28 md:h-32" />
        </motion.div>

        <motion.div
          aria-hidden="true"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.85, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 sm:mb-7 h-px w-20 sm:w-24 origin-center bg-[#C5A46D]/75"
        />

        <div className="flex w-full flex-col items-center gap-3 sm:gap-4">
          <AnimatedText
            as="p"
            text="WELCOME TO"
            baseDelay={1.0}
            charStep={0.042}
            className="font-sans text-[11px] sm:text-xs md:text-sm font-medium tracking-[0.32em] text-[#242424]/75"
          />

          <AnimatedText
            as="h1"
            text="HOME SWEET HOME"
            baseDelay={1.55}
            charStep={0.05}
            className="w-full font-serif font-medium tracking-[0.05em] text-[#242424] leading-[1.08] text-[clamp(1.85rem,6.4vw,4.5rem)]"
          />

          <AnimatedText
            as="p"
            text="RESORT"
            baseDelay={2.6}
            charStep={0.065}
            className="font-serif font-medium tracking-[0.38em] text-[#A4834C] text-[clamp(0.95rem,2.4vw,1.5rem)]"
          />
        </div>
      </div>
    </motion.div>
  );
}
