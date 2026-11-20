import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PhotoCategory, RESORT_PHOTOS, ResortPhoto } from '../data/resortData';
import { filterGalleryPhotos, getAvailableGalleryCategories } from '../utils/resortConfig';

export function GallerySection() {
  const categories = useMemo(() => getAvailableGalleryCategories(RESORT_PHOTOS), []);
  const [activeCategory, setActiveCategory] = useState<'All' | PhotoCategory>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const visiblePhotos = useMemo(
    () => filterGalleryPhotos(RESORT_PHOTOS, activeCategory),
    [activeCategory]
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % visiblePhotos.length
        );
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev - 1 + visiblePhotos.length) % visiblePhotos.length
        );
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex, visiblePhotos.length]);

  const activeLightboxPhoto: ResortPhoto | null =
    lightboxIndex !== null ? visiblePhotos[lightboxIndex] ?? null : null;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || visiblePhotos.length <= 1) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    if (Math.abs(delta) > 45) {
      if (delta < 0) {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % visiblePhotos.length
        );
      } else {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev - 1 + visiblePhotos.length) % visiblePhotos.length
        );
      }
    }
    touchStartX.current = null;
  };

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="scroll-mt-20 py-20 sm:py-28 lg:py-32 bg-[#F9F6F0] text-[#000000]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header & Editorial Category Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-xl">
            <div className="flex items-center gap-4 mb-4">
              <span className="h-px w-10 bg-[#C9A227]" aria-hidden="true" />
              <span className="font-sans text-xs font-semibold tracking-[0.26em] uppercase text-[#C9A227]">
                — Photographic Essay
              </span>
            </div>

            <h2
              id="gallery-heading"
              className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-[#000000]"
            >
              Inside Home Sweet{' '}
              <span className="font-editorial italic text-[#C9A227]">Home</span>
            </h2>

            <p className="mt-4 text-sm sm:text-base text-[#000000]/75 leading-relaxed">
              Every corner photographed on-property—from sunlit stairwells and marble corridors to
              our four distinct room categories.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Gallery photo categories"
            className="inline-flex flex-wrap items-center gap-1.5 rounded-full bg-[#FFFFFF] p-1.5 border border-[#C9A227]/30 self-start md:self-auto"
          >
            {(['All', ...categories] as const).map((cat) => {
              const selected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => {
                    setActiveCategory(cat);
                    setLightboxIndex(null);
                  }}
                  className={`relative rounded-full px-4 py-2 text-xs font-semibold tracking-[0.12em] uppercase transition-colors whitespace-nowrap ${
                    selected
                      ? 'text-[#000000]'
                      : 'text-[#000000]/65 hover:text-[#000000]'
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="gallery-filter-pill"
                      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-[#C9A227]"
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Asymmetrical Editorial Gallery Layout (Desktop Staggered Pairs / Mobile Rail) */}
        <div className="no-scrollbar flex md:grid md:grid-cols-12 gap-6 sm:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 items-start">
          {visiblePhotos.map((photo, index) => {
            const isLandscape = photo.orientation === 'landscape';
            const spanClass =
              visiblePhotos.length === 1
                ? 'md:col-span-12'
                : isLandscape
                ? 'md:col-span-7'
                : index % 3 === 1
                ? 'md:col-span-5 md:mt-12'
                : 'md:col-span-6';

            return (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, clipPath: 'inset(8% 0% 0% 0%)', y: 18 }}
                whileInView={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.65, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className={`w-[82vw] max-w-sm md:max-w-none md:w-auto shrink-0 snap-center ${spanClass} group relative overflow-hidden rounded-2xl bg-[#FFFFFF] border border-[#000000]/10 hover:border-[#C9A227] transition-colors shadow-sm`}
              >
                <button
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  aria-label={`Open ${photo.title} in full-screen gallery`}
                  className="flex flex-col justify-between w-full text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A227]"
                >
                  <div
                    className={`w-full overflow-hidden bg-[#000000] ${
                      isLandscape ? 'aspect-[16/10]' : 'aspect-[4/5]'
                    }`}
                  >
                    <img
                      src={photo.src}
                      alt={photo.title}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>

                  <div className="p-5 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-sans text-[11px] text-[#C9A227] font-semibold tracking-[0.22em] uppercase">
                        0{index + 1} · {photo.category}
                      </p>
                      <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#000000] mt-0.5 truncate">
                        {photo.title}
                      </h3>
                    </div>

                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#000000]/15 text-[#000000] group-hover:bg-[#C9A227] group-hover:border-[#C9A227] transition-colors">
                      <Expand className="h-4 w-4" />
                    </span>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Full-Screen Obsidian Lightbox */}
      <AnimatePresence>
        {activeLightboxPhoto && lightboxIndex !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Gallery viewer: ${activeLightboxPhoto.title}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="fixed inset-0 z-50 flex flex-col justify-between bg-[#000000]/96 p-4 sm:p-6 text-[#F9F6F0]"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="text-xs sm:text-sm text-[#C9A227] font-semibold tracking-[0.18em] uppercase tabular-nums">
                {lightboxIndex + 1} / {visiblePhotos.length} · {activeLightboxPhoto.category}
              </div>

              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                aria-label="Close gallery lightbox"
                className="inline-flex items-center gap-2 rounded-full border border-[#C9A227]/45 bg-[#000000] px-4 py-2 text-xs font-semibold tracking-[0.14em] uppercase text-[#F9F6F0] hover:bg-[#C9A227] hover:text-[#000000] transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Close</span>
              </button>
            </div>

            <div className="relative flex-1 flex items-center justify-center my-4">
              {visiblePhotos.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex(
                      (lightboxIndex - 1 + visiblePhotos.length) % visiblePhotos.length
                    )
                  }
                  aria-label="Previous gallery photo"
                  className="absolute left-1 sm:left-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#000000]/80 border border-[#C9A227]/45 text-[#F9F6F0] hover:bg-[#C9A227] hover:text-[#000000] transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}

              <motion.img
                key={activeLightboxPhoto.id}
                initial={{ opacity: 0.35, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                src={activeLightboxPhoto.src}
                alt={activeLightboxPhoto.title}
                referrerPolicy="no-referrer"
                className="max-h-[72vh] max-w-[90vw] object-contain rounded-lg"
              />

              {visiblePhotos.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex((lightboxIndex + 1) % visiblePhotos.length)
                  }
                  aria-label="Next gallery photo"
                  className="absolute right-1 sm:right-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#000000]/80 border border-[#C9A227]/45 text-[#F9F6F0] hover:bg-[#C9A227] hover:text-[#000000] transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="flex flex-col items-center gap-3 text-center">
              <div>
                <h3 className="font-serif text-xl font-medium text-[#FFFFFF]">
                  {activeLightboxPhoto.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#F9F6F0]/75 mt-1 max-w-xl">
                  {activeLightboxPhoto.caption}
                </p>
              </div>

              <div className="no-scrollbar flex items-center gap-2 overflow-x-auto max-w-full pb-1">
                {visiblePhotos.map((photo, idx) => (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => setLightboxIndex(idx)}
                    aria-label={`Select ${photo.title}`}
                    className={`h-12 w-16 shrink-0 overflow-hidden rounded border-2 transition-all ${
                      idx === lightboxIndex
                        ? 'border-[#C9A227] opacity-100'
                        : 'border-transparent opacity-50 hover:opacity-90'
                    }`}
                  >
                    <img
                      src={photo.src}
                      alt={photo.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
