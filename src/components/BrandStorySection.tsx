import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { RESORT_PHOTOS } from '../data/resortData';

interface BrandStorySectionProps {
  onExploreGallery: () => void;
}

export function BrandStorySection({ onExploreGallery }: BrandStorySectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const secondaryParallaxY = useTransform(scrollYProgress, [0, 1], [18, -18]);

  const interiorPhoto =
    RESORT_PHOTOS.find((p) => p.id === 'room-green-tufted') ?? RESORT_PHOTOS[1];
  const executivePhoto =
    RESORT_PHOTOS.find((p) => p.id === 'room-executive-wood') ?? RESORT_PHOTOS[2];

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby="brand-story-heading"
      className="scroll-mt-20 py-20 sm:py-28 lg:py-32 bg-[#F8F5EF] dark:bg-[#181715] transition-colors duration-300"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Asymmetrical Left Editorial Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="flex items-center gap-4 mb-5">
              <span className="h-px w-10 bg-[#C5A46D]" aria-hidden="true" />
              <span className="text-xs font-semibold tracking-[0.24em] uppercase text-[#A4834C] dark:text-[#C5A46D]">
                Our Philosophy
              </span>
            </div>

            <h2
              id="brand-story-heading"
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight leading-[1.12] text-[#242424] dark:text-[#F8F5EF] mb-6"
            >
              More Than a Stay. A Feeling of Home.
            </h2>

            <p className="font-sans text-base sm:text-lg leading-relaxed text-[#242424]/80 dark:text-[#F8F5EF]/80 mb-8">
              At Home Sweet Home Resort, every detail is thoughtfully designed to create moments of
              comfort, relaxation, and lasting memories.
            </p>

            {/* Quiet unboxed pillars separated by hairline rules */}
            <div className="border-t border-[#242424]/10 dark:border-[#F8F5EF]/10 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="font-serif text-xl font-medium text-[#242424] dark:text-[#F8F5EF] mb-1.5">
                  Warm Contemporary Calm
                </h3>
                <p className="text-sm leading-relaxed text-[#242424]/70 dark:text-[#F8F5EF]/70">
                  Soft architectural textures, natural warmth, and serene private rooms crafted for
                  unhurried rest.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl font-medium text-[#242424] dark:text-[#F8F5EF] mb-1.5">
                  Attentive Hospitality
                </h3>
                <p className="text-sm leading-relaxed text-[#242424]/70 dark:text-[#F8F5EF]/70">
                  Gracious, personal care from your first inquiry through every quiet morning of your
                  stay.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onExploreGallery}
              className="inline-flex items-center gap-3 text-sm font-semibold text-[#242424] dark:text-[#F8F5EF] hover:text-[#A4834C] dark:hover:text-[#C5A46D] transition-colors group"
            >
              <span className="border-b border-[#C5A46D] pb-0.5">
                View the Property Collection
              </span>
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-1 text-[#C5A46D]"
              >
                &rarr;
              </span>
            </button>
          </motion.div>

          {/* Asymmetrical Right Photography Composition with Subtle Scroll Parallax */}
          <div className="lg:col-span-7 grid grid-cols-12 gap-5 items-end">
            <motion.figure
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="col-span-12 sm:col-span-7 overflow-hidden rounded-xl bg-[#E8D9BD]/35 dark:bg-[#242424] border border-[#242424]/8 dark:border-[#F8F5EF]/10 shadow-sm"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={interiorPhoto.src}
                  alt={interiorPhoto.caption}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-[1.03]"
                />
              </div>
            </motion.figure>

            <motion.div
              style={{ y: secondaryParallaxY }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="col-span-12 sm:col-span-5 flex flex-col gap-5"
            >
              <div className="rounded-xl bg-[#FFFFFF] dark:bg-[#242424] p-6 border border-[#242424]/8 dark:border-[#F8F5EF]/10 shadow-sm">
                <p className="font-serif italic text-xl leading-snug text-[#242424] dark:text-[#F8F5EF]">
                  &ldquo;A place where luxury feels like home.&rdquo;
                </p>
                <div className="mt-4 h-px w-12 bg-[#C5A46D]" aria-hidden="true" />
              </div>

              <figure className="overflow-hidden rounded-xl bg-[#E8D9BD]/35 dark:bg-[#242424] border border-[#242424]/8 dark:border-[#F8F5EF]/10 shadow-sm">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={executivePhoto.src}
                    alt={executivePhoto.caption}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-[1.03]"
                  />
                </div>
              </figure>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
