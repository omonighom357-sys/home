import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import {
  RESORT_EXTERIOR_SRC,
  RESORT_LOCATION,
  RESORT_PHOTOS,
  RESORT_STATS,
  ResortStat,
} from '../data/resortData';

gsap.registerPlugin(ScrollTrigger);

interface BrandStorySectionProps {
  onExploreGallery: () => void;
  onExploreRooms: () => void;
  onExploreLocation: () => void;
}

const WELCOME_STATEMENT =
  'A place where comfort feels familiar and every stay feels like coming home.';

function StatCounter({ stat }: { stat: ResortStat }) {
  const [displayValue, setDisplayValue] = useState<number>(stat.target);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el || hasAnimated) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setDisplayValue(stat.target);
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setHasAnimated(true);
        observer.disconnect();

        const counterObj = { val: 0 };
        setDisplayValue(0);
        gsap.to(counterObj, {
          val: stat.target,
          duration: 1.45,
          ease: 'power2.out',
          onUpdate: () => {
            setDisplayValue(Math.round(counterObj.val));
          },
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasAnimated, stat.target]);

  const formatted = stat.formatNumber ? displayValue.toLocaleString('en-NG') : String(displayValue);

  return (
    <div
      ref={elRef}
      className="border-t border-[#C9A227]/35 pt-5 flex flex-col justify-between"
    >
      <p className="font-serif text-3xl sm:text-4xl lg:text-[2.65rem] font-medium text-[#000000] tabular-nums leading-none">
        {stat.prefix ?? ''}
        {formatted}
      </p>
      <p className="mt-2.5 font-sans text-[11px] font-semibold tracking-[0.22em] uppercase text-[#C9A227]">
        {stat.label}
      </p>
    </div>
  );
}

export function BrandStorySection({
  onExploreGallery,
  onExploreRooms,
  onExploreLocation,
}: BrandStorySectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const statementRef = useRef<HTMLHeadingElement | null>(null);
  const archFrameRef = useRef<HTMLDivElement | null>(null);
  const marbleParallaxRef = useRef<HTMLDivElement | null>(null);

  const staircasePhoto =
    RESORT_PHOTOS.find((p) => p.id === 'interior-chandelier-staircase') ?? RESORT_PHOTOS[1];
  const corridorPhoto =
    RESORT_PHOTOS.find((p) => p.id === 'interior-marble-corridor') ?? RESORT_PHOTOS[2];
  const artworkPhoto =
    RESORT_PHOTOS.find((p) => p.id === 'interior-gallery-artwork') ?? RESORT_PHOTOS[3];

  const statementWords = WELCOME_STATEMENT.split(' ');

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const statementEl = statementRef.current;
    const archEl = archFrameRef.current;
    const marbleEl = marbleParallaxRef.current;

    if (!sectionEl) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      if (statementEl) {
        const wordSpans = statementEl.querySelectorAll<HTMLElement>('[data-word]');
        gsap.fromTo(
          wordSpans,
          { color: '#A39C90' },
          {
            color: '#000000',
            stagger: 0.14,
            ease: 'none',
            scrollTrigger: {
              trigger: statementEl,
              start: 'top 84%',
              end: 'bottom 52%',
              scrub: 0.45,
            },
          }
        );
      }

      if (archEl) {
        gsap.fromTo(
          archEl,
          { scale: 0.9, y: 24 },
          {
            scale: 1,
            y: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: archEl,
              start: 'top 88%',
              end: 'center 52%',
              scrub: 0.6,
            },
          }
        );
      }

      if (marbleEl) {
        gsap.fromTo(
          marbleEl,
          { y: -18 },
          {
            y: 22,
            ease: 'none',
            scrollTrigger: {
              trigger: marbleEl,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }
    }, sectionEl);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby="welcome-heading"
      className="scroll-mt-20 bg-[#F9F6F0] text-[#000000] overflow-x-clip"
    >
      {/* SECTION 4 & 7 & 9 — WELCOME STATEMENT + ANIMATED STATS + ARCHED STAIRWELL */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left 7 Columns: Editorial Scrubbed Reveal & Official Stats */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4 mb-6">
              <span className="h-px w-10 bg-[#C9A227]" aria-hidden="true" />
              <span className="font-sans text-xs font-semibold tracking-[0.26em] uppercase text-[#C9A227]">
                — Welcome
              </span>
            </div>

            <h2
              id="welcome-heading"
              ref={statementRef}
              className="font-serif text-[clamp(2rem,4.5vw,3.6rem)] font-medium tracking-tight leading-[1.12] text-[#000000]"
            >
              {statementWords.map((word, idx) => (
                <span
                  key={`${word}-${idx}`}
                  data-word
                  className={idx < 4 ? 'text-[#000000]' : 'text-[#A39C90]'}
                >
                  {word}{' '}
                </span>
              ))}
            </h2>

            <p className="mt-6 font-sans text-sm sm:text-base lg:text-lg leading-relaxed text-[#000000]/75 max-w-2xl">
              Nestled off Udu Road in {RESORT_LOCATION.lga}, Home Sweet Home Resort composes quiet
              marble corridors, light-filled stairwells, and four distinct room tiers with
              attentive residential care.
            </p>

            {/* Section 7: Exact 3 Animated Resort Counters */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              {RESORT_STATS.map((stat) => (
                <StatCounter key={stat.id} stat={stat} />
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onExploreRooms}
                className="group inline-flex items-center gap-2.5 rounded-full bg-[#C9A227] hover:bg-[#D4AF37] px-7 py-3.5 text-xs font-semibold tracking-[0.16em] uppercase text-[#000000] transition-all hover:scale-[1.03] active:scale-[0.98]"
              >
                <span>View Four Tiers</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={onExploreGallery}
                className="inline-flex items-center gap-2 rounded-full border border-[#000000]/20 hover:border-[#C9A227] px-6 py-3.5 text-xs font-semibold tracking-[0.14em] uppercase text-[#000000] transition-colors"
              >
                <span>Tour Property Spaces</span>
              </button>
            </div>
          </div>

          {/* Right 5 Columns: Section 9 — Arch-Cropped Stairwell Photo */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end">
            <div
              ref={archFrameRef}
              className="w-full max-w-md overflow-hidden will-change-transform"
            >
              <div className="relative rounded-t-full overflow-hidden border border-[#C9A227]/45 bg-[#FFFFFF] p-2.5 shadow-xl">
                <div className="relative aspect-[3/4] rounded-t-full overflow-hidden bg-[#000000]">
                  <img
                    src={staircasePhoto.src}
                    alt={staircasePhoto.caption}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-[1.04]"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#000000]/75 via-[#000000]/25 to-transparent"
                  />
                  <span className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap font-sans text-[11px] font-semibold tracking-[0.26em] uppercase text-[#D4AF37]">
                    THE STAIRWELL
                  </span>
                </div>
              </div>
              <p className="mt-4 text-center font-sans text-xs tracking-wide text-[#000000]/65">
                Tiered crystal chandelier &amp; smoked glass foyer lighting.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 14 (PART A) — LIGHT, MARBLE AND A TOUCH OF COLOUR */}
      <div
        id="experiences"
        aria-labelledby="interiors-editorial-heading"
        className="scroll-mt-20 border-t border-[#C9A227]/25 bg-[#FFFFFF] py-20 sm:py-28 lg:py-32"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
            {/* Sticky Editorial Narrative */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <div className="flex items-center gap-4 mb-5">
                <span className="h-px w-10 bg-[#C9A227]" aria-hidden="true" />
                <span className="font-sans text-xs font-semibold tracking-[0.24em] uppercase text-[#C9A227]">
                  Interior Atmosphere
                </span>
              </div>

              <h2
                id="interiors-editorial-heading"
                className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight leading-[1.08] text-[#000000]"
              >
                Light, Marble and a{' '}
                <span className="font-editorial italic text-[#C9A227]">Touch of Colour.</span>
              </h2>

              <p className="mt-6 font-sans text-sm sm:text-base leading-relaxed text-[#000000]/75">
                Beyond the double-height foyer, guests step into cool veined marble corridors with
                deep timber thresholds and curated modern artwork. Every shared passage maintains a
                calm rhythm between suites.
              </p>

              <div className="mt-8 space-y-4 border-t border-[#000000]/10 pt-6">
                <div className="flex items-start gap-4">
                  <span className="font-sans text-xs font-semibold tracking-[0.2em] text-[#C9A227] tabular-nums mt-1">
                    01
                  </span>
                  <div>
                    <h3 className="font-serif text-xl font-medium text-[#000000]">
                      Polished Veined Marble
                    </h3>
                    <p className="mt-1 text-sm text-[#000000]/70">
                      Reflective stone walkways lit cleanly by recessed architectural ceiling lights.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="font-sans text-xs font-semibold tracking-[0.2em] text-[#C9A227] tabular-nums mt-1">
                    02
                  </span>
                  <div>
                    <h3 className="font-serif text-xl font-medium text-[#000000]">
                      Curated Wall Artistry
                    </h3>
                    <p className="mt-1 text-sm text-[#000000]/70">
                      Bold expressive canvas pieces bringing warmth and contemporary personality to
                      white gallery walls.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Layered Photography Pair */}
            <div className="lg:col-span-7 grid grid-cols-12 gap-5 sm:gap-7 items-center">
              <motion.figure
                initial={{ opacity: 0, clipPath: 'inset(10% 0% 0% 0%)' }}
                whileInView={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                className="col-span-12 sm:col-span-7 overflow-hidden rounded-2xl border border-[#000000]/10 bg-[#F9F6F0]"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={corridorPhoto.src}
                    alt={corridorPhoto.caption}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-[1.04]"
                  />
                </div>
                <figcaption className="px-5 py-3.5 text-xs text-[#000000]/70">
                  <span className="font-semibold text-[#000000]">{corridorPhoto.title}</span> —
                  Residential wing
                </figcaption>
              </motion.figure>

              <div
                ref={marbleParallaxRef}
                className="col-span-12 sm:col-span-5 will-change-transform"
              >
                <figure className="overflow-hidden rounded-2xl border border-[#C9A227]/35 bg-[#F9F6F0] shadow-lg">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={artworkPhoto.src}
                      alt={artworkPhoto.caption}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-[1.04]"
                    />
                  </div>
                  <figcaption className="px-4 py-3 text-xs text-[#000000]/75">
                    {artworkPhoto.title}
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>

          {/* SECTION 14 (PART B) — YOUR ARRIVAL, MADE EASY */}
          <div className="mt-20 sm:mt-28 rounded-3xl bg-[#000000] text-[#F9F6F0] overflow-hidden border border-[#C9A227]/30 grid grid-cols-1 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-6 relative min-h-[260px] sm:min-h-[340px] overflow-hidden">
              <img
                src={RESORT_EXTERIOR_SRC}
                alt="Arrival forecourt at Home Sweet Home Resort, Udu"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-[1.03]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#000000]/70 hidden lg:block"
              />
            </div>

            <div className="lg:col-span-6 p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
              <p className="font-sans text-[11px] font-semibold tracking-[0.26em] uppercase text-[#C9A227] mb-3">
                — Arrival Experience
              </p>
              <h3 className="font-serif text-3xl sm:text-4xl font-medium text-[#FFFFFF] leading-[1.12]">
                Your Arrival,{' '}
                <span className="font-editorial italic text-[#D4AF37]">Made Easy.</span>
              </h3>
              <p className="mt-4 font-sans text-sm sm:text-base leading-relaxed text-[#F9F6F0]/80">
                Situated at {RESORT_LOCATION.fullAddress} in {RESORT_LOCATION.lga}, our crisp
                two-story exterior welcomes guests with clear forecourt access and responsive check-in
                guidance.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={onExploreLocation}
                  className="group inline-flex items-center gap-2.5 rounded-full bg-[#C9A227] hover:bg-[#D4AF37] px-6 py-3 text-xs font-semibold tracking-[0.16em] uppercase text-[#000000] transition-all"
                >
                  <span>Directions &amp; Map</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
