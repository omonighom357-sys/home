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
      className="scroll-mt-20 py-20 sm:py-28 bg-[#FFFFFF] dark:bg-[#242424] border-y border-[#242424]/8 dark:border-[#F8F5EF]/10 transition-colors duration-300"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header & Category Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <div className="flex items-center gap-4 mb-4">
              <span className="h-px w-10 bg-[#C5A46D]" aria-hidden="true" />
              <span className="text-xs font-semibold tracking-[0.24em] uppercase text-[#A4834C] dark:text-[#C5A46D]">
                Photography Collection
              </span>
            </div>

            <h2
              id="gallery-heading"
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#242424] dark:text-[#F8F5EF]"
            >
              Inside Home Sweet Home
            </h2>
          </div>

          {/* Interactive Category Filter Buttons (Only genuine supplied categories) */}
          <div
            role="tablist"
            aria-label="Gallery photo categories"
            className="inline-flex flex-wrap items-center gap-1.5 rounded-lg bg-[#F8F5EF] dark:bg-[#181715] p-1 border border-[#242424]/10 dark:border-[#F8F5EF]/10 self-start md:self-auto"
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
                  className={`rounded-md px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
                    selected
                      ? 'bg-[#242424] dark:bg-[#C5A46D] text-[#F8F5EF] dark:text-[#181715] shadow-sm'
                      : 'text-[#242424]/75 dark:text-[#F8F5EF]/75 hover:text-[#242424] dark:hover:text-[#F8F5EF]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Editorial Grid respecting authentic orientations */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {visiblePhotos.map((photo, index) => {
            const isLandscape = photo.orientation === 'landscape';
            const colSpan =
              visiblePhotos.length === 1
                ? 'md:col-span-12'
                : isLandscape
                ? 'md:col-span-7'
                : 'md:col-span-5';

            return (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className={`${colSpan} group relative overflow-hidden rounded-xl bg-[#F8F5EF] dark:bg-[#181715] border border-[#242424]/10 dark:border-[#F8F5EF]/10`}
              >
                <button
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  aria-label={`Open ${photo.title} in full-screen gallery`}
                  className="block w-full h-full text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A46D]"
                >
                  <div
                    className={`w-full overflow-hidden ${
                      isLandscape ? 'aspect-[16/10]' : 'aspect-[4/5] md:aspect-[4/4]'
                    }`}
                  >
                    <img
                      src={photo.src}
                      alt={photo.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Measured bottom scrim & editorial caption */}
                  <div className="p-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-[#A4834C] dark:text-[#C5A46D] font-medium tracking-wider uppercase">
                        {photo.category}
                      </p>
                      <h3 className="font-serif text-xl font-medium text-[#242424] dark:text-[#F8F5EF] mt-0.5">
                        {photo.title}
                      </h3>
                    </div>

                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#242424]/15 dark:border-[#F8F5EF]/15 text-[#242424]/70 dark:text-[#F8F5EF]/70 group-hover:border-[#C5A46D] group-hover:text-[#C5A46D] transition-colors">
                      <Expand className="h-4 w-4" />
                    </span>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Full-Screen Lightbox */}
      <AnimatePresence>
        {activeLightboxPhoto && lightboxIndex !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Gallery viewer: ${activeLightboxPhoto.title}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="fixed inset-0 z-50 flex flex-col justify-between bg-[#181715]/95 p-4 sm:p-6 text-[#F8F5EF]"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between gap-4">
              <div className="text-xs sm:text-sm text-[#F8F5EF]/75 tabular-nums">
                {lightboxIndex + 1} / {visiblePhotos.length} · {activeLightboxPhoto.category}
              </div>

              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                aria-label="Close gallery lightbox"
                className="inline-flex items-center gap-2 rounded-md border border-[#F8F5EF]/25 bg-[#242424] px-4 py-2 text-xs font-medium text-[#F8F5EF] hover:border-[#C5A46D] transition-colors"
              >
                <X className="h-4 w-4 text-[#C5A46D]" />
                <span>Close</span>
              </button>
            </div>

            {/* Center Image */}
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
                  className="absolute left-1 sm:left-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#242424]/85 border border-[#F8F5EF]/20 text-[#F8F5EF] hover:border-[#C5A46D] transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}

              <motion.img
                key={activeLightboxPhoto.id}
                initial={{ opacity: 0.4, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                src={activeLightboxPhoto.src}
                alt={activeLightboxPhoto.title}
                referrerPolicy="no-referrer"
                className="max-h-[74vh] max-w-[90vw] object-contain rounded-lg"
              />

              {visiblePhotos.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex((lightboxIndex + 1) % visiblePhotos.length)
                  }
                  aria-label="Next gallery photo"
                  className="absolute right-1 sm:right-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#242424]/85 border border-[#F8F5EF]/20 text-[#F8F5EF] hover:border-[#C5A46D] transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Caption & Thumbnail Strip */}
            <div className="flex flex-col items-center gap-3 text-center">
              <div>
                <h3 className="font-serif text-xl font-medium text-[#F8F5EF]">
                  {activeLightboxPhoto.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#F8F5EF]/70 mt-1 max-w-xl">
                  {activeLightboxPhoto.caption}
                </p>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
                {visiblePhotos.map((photo, idx) => (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => setLightboxIndex(idx)}
                    aria-label={`Select ${photo.title}`}
                    className={`h-12 w-16 shrink-0 overflow-hidden rounded border-2 transition-all ${
                      idx === lightboxIndex
                        ? 'border-[#C5A46D] opacity-100'
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
