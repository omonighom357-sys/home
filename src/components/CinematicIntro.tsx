import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface CinematicIntroProps {
  onComplete: () => void;
}

export function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ambientGlowRef = useRef<HTMLDivElement | null>(null);
  const frameBorderRef = useRef<HTMLDivElement | null>(null);
  const logoWrapRef = useRef<HTMLDivElement | null>(null);
  const logoHaloRef = useRef<HTMLDivElement | null>(null);
  const shimmerRef = useRef<HTMLDivElement | null>(null);
  const dividerRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const subheadlineRef = useRef<HTMLParagraphElement | null>(null);
  const taglineRef = useRef<HTMLParagraphElement | null>(null);
  const ctaWrapRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  const hasExitedRef = useRef(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const autoExitTimerRef = useRef<number | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  const clearAutoExitTimer = useCallback(() => {
    if (autoExitTimerRef.current !== null) {
      window.clearTimeout(autoExitTimerRef.current);
      autoExitTimerRef.current = null;
    }
  }, []);

  const triggerExit = useCallback(
    (fast = false) => {
      if (hasExitedRef.current) return;
      hasExitedRef.current = true;
      setIsExiting(true);
      clearAutoExitTimer();

      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      const container = containerRef.current;
      const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!container || prefersReduced) {
        document.body.style.overflow = '';
        onComplete();
        return;
      }

      let finished = false;
      const finishExit = () => {
        if (finished) return;
        finished = true;
        document.body.style.overflow = '';
        onComplete();
      };

      const exitMs = fast ? 320 : 680;
      window.setTimeout(finishExit, exitMs + 140);

      gsap.to(container, {
        opacity: 0,
        yPercent: fast ? -4 : -7,
        scale: fast ? 1.01 : 1.025,
        duration: exitMs / 1000,
        ease: 'power3.inOut',
        onComplete: finishExit,
      });
    },
    [clearAutoExitTimer, onComplete]
  );

  useLayoutEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        triggerExit(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);

    const container = containerRef.current;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!container || prefersReduced) {
      return () => {
        clearAutoExitTimer();
        document.body.style.overflow = previousOverflow;
        window.removeEventListener('keydown', onKeyDown);
      };
    }

    const ctx = gsap.context(() => {
      // Stage 1: Gentle ambient breathing halo
      if (ambientGlowRef.current) {
        gsap.fromTo(
          ambientGlowRef.current,
          { opacity: 0.45, scale: 0.92 },
          {
            opacity: 0.9,
            scale: 1.08,
            duration: 3.2,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          }
        );
      }

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          if (hasExitedRef.current) return;
          if (progressBarRef.current) {
            gsap.to(progressBarRef.current, {
              scaleX: 1,
              opacity: 0.85,
              duration: 4.4,
              ease: 'none',
            });
          }
          autoExitTimerRef.current = window.setTimeout(() => {
            triggerExit(false);
          }, 4500);
        },
      });
      timelineRef.current = tl;

      // Stage 1 — Opening obsidian stage & hairline architectural frame
      if (frameBorderRef.current) {
        tl.fromTo(
          frameBorderRef.current,
          { opacity: 0, scale: 0.985 },
          { opacity: 1, scale: 1, duration: 0.55 },
          0.02
        );
      }

      // Stage 2 — Official Home Sweet Home Resort Logo Reveal + Gold Shimmer
      if (logoHaloRef.current) {
        tl.fromTo(
          logoHaloRef.current,
          { opacity: 0, scale: 0.68 },
          { opacity: 1, scale: 1, duration: 0.85, ease: 'power2.out' },
          0.08
        );
      }

      if (logoWrapRef.current) {
        tl.fromTo(
          logoWrapRef.current,
          { opacity: 0, scale: 0.84, y: 16 },
          { opacity: 1, scale: 1, y: 0, duration: 0.78 },
          0.14
        );
      }

      if (shimmerRef.current) {
        tl.fromTo(
          shimmerRef.current,
          { xPercent: -130, opacity: 0 },
          {
            xPercent: 145,
            opacity: 0.8,
            duration: 1.05,
            ease: 'power2.inOut',
          },
          0.75
        );
      }

      // Gold center rule draws smoothly outward
      if (dividerRef.current) {
        tl.fromTo(
          dividerRef.current,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.65 },
          0.48
        );
      }

      // Stage 3 — Layered Luxury Welcome Typography
      if (headlineRef.current) {
        tl.fromTo(
          headlineRef.current,
          { opacity: 0, y: 18, letterSpacing: '0.22em' },
          {
            opacity: 1,
            y: 0,
            letterSpacing: '0.16em',
            duration: 0.75,
          },
          0.68
        );
      }

      if (subheadlineRef.current) {
        tl.fromTo(
          subheadlineRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.65 },
          1.05
        );
      }

      if (taglineRef.current) {
        tl.fromTo(
          taglineRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6 },
          1.35
        );
      }

      // Interactive Enter Experience control
      if (ctaWrapRef.current) {
        tl.fromTo(
          ctaWrapRef.current,
          { opacity: 0, y: 12, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.55 },
          1.6
        );
      }

      // Subtle timeline progress cue during Stages 1-3 before final dwell fill
      if (progressBarRef.current) {
        tl.fromTo(
          progressBarRef.current,
          { scaleX: 0, opacity: 0.65 },
          {
            scaleX: 0.32,
            opacity: 0.75,
            duration: 2.1,
            ease: 'none',
          },
          0.08
        );
      }
    }, container);

    return () => {
      ctx.revert();
      clearAutoExitTimer();
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [clearAutoExitTimer, triggerExit]);

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Home Sweet Home Resort"
      className={`fixed inset-0 z-[60] overflow-y-auto bg-[#000000] text-[#F9F6F0] select-none ${
        isExiting ? 'pointer-events-none' : ''
      }`}
    >
      {/* Subtle Ambient Gold Lighting Field */}
      <div
        ref={ambientGlowRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 42%, rgba(201,162,39,0.2) 0%, rgba(212,175,55,0.06) 34%, rgba(0,0,0,0) 68%)',
        }}
      />

      {/* Architectural Champagne Framing Border */}
      <div
        ref={frameBorderRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-3 sm:inset-5 border border-[#C9A227]/18"
      />

      {/* Always-Accessible Skip Intro Control */}
      <div className="fixed top-5 right-5 sm:top-8 sm:right-8 z-20">
        <button
          type="button"
          onClick={() => triggerExit(true)}
          aria-label="Skip welcome introduction"
          className="min-h-[40px] rounded-full border border-[#C9A227]/45 bg-[#000000]/85 px-4 sm:px-5 py-2 text-[11px] font-medium tracking-[0.2em] uppercase text-[#F9F6F0]/85 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
        >
          Skip Intro
        </button>
      </div>

      {/* Centered Cinematic Stage */}
      <div className="relative z-10 flex min-h-full w-full flex-col items-center justify-center px-5 py-20 sm:px-8 text-center">
        <div className="flex w-full max-w-4xl flex-col items-center">
          {/* Stage 2: Official Logo Medallion with Champagne Halo & Specular Sweep */}
          <div ref={logoWrapRef} className="relative mb-8 sm:mb-9">
            <div
              ref={logoHaloRef}
              aria-hidden="true"
              className="pointer-events-none absolute -inset-4 rounded-full bg-[#C9A227]/15 blur-xl"
            />
            <div className="relative overflow-hidden rounded-full">
              <BrandLogo variant="intro" />
              <div
                ref={shimmerRef}
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-[#FFFFFF]/45 to-transparent"
              />
            </div>
          </div>

          {/* Center Hairline Accent */}
          <div
            ref={dividerRef}
            aria-hidden="true"
            className="mb-7 h-px w-full max-w-sm sm:max-w-md origin-center bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
          />

          {/* Stage 3: Welcome Messages */}
          <h1
            ref={headlineRef}
            className="font-serif font-medium uppercase tracking-[0.16em] text-[#D4AF37] text-[clamp(1.32rem,3.3vw,2.6rem)] leading-[1.18] sm:whitespace-nowrap"
          >
            HOME SWEET HOME RESORT
          </h1>

          <p
            ref={subheadlineRef}
            className="mt-4 font-editorial italic text-[#FFFFFF] text-[clamp(1.2rem,2.4vw,1.8rem)] tracking-[0.02em] leading-[1.35]"
          >
            Your experience begins here.
          </p>

          <p
            ref={taglineRef}
            className="mt-3 max-w-xl font-sans text-sm sm:text-base font-light tracking-[0.04em] leading-relaxed text-[#F9F6F0]/80"
          >
            Discover comfort. Experience luxury. Feel at home.
          </p>

          {/* Interactive Entry Action */}
          <div ref={ctaWrapRef} className="mt-9 sm:mt-10">
            <button
              type="button"
              onClick={() => triggerExit(false)}
              className="group inline-flex min-h-[44px] items-center gap-3 rounded-full bg-[#C9A227] hover:bg-[#D4AF37] px-7 sm:px-8 py-3.5 text-xs sm:text-sm font-semibold tracking-[0.18em] uppercase text-[#000000] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-[0_0_32px_rgba(201,162,39,0.34)] hover:shadow-[0_0_44px_rgba(212,175,55,0.55)] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
            >
              <span>Enter Experience</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Progress Line */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 h-[2px] bg-[#C9A227]/15"
      >
        <div
          ref={progressBarRef}
          className="h-full w-full origin-left bg-gradient-to-r from-[#C9A227] via-[#D4AF37] to-[#C9A227]"
        />
      </div>
    </div>
  );
}

