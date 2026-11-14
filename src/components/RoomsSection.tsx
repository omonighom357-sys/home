import { ArrowUpRight, SlidersHorizontal } from 'lucide-react';
import { motion } from 'motion/react';
import {
  ROOM_CATEGORIES,
  RESORT_PHOTOS,
  ResortConfig,
  RoomCategory,
} from '../data/resortData';
import { formatNaira } from '../utils/booking';
import { getRoomPhoto } from '../utils/resortConfig';

interface RoomsSectionProps {
  config: ResortConfig;
  onViewDetails: (room: RoomCategory) => void;
  onBookRoom: (room: RoomCategory) => void;
  onOpenConfig: () => void;
}

export function RoomsSection({
  config,
  onViewDetails,
  onBookRoom,
  onOpenConfig,
}: RoomsSectionProps) {
  return (
    <section
      id="rooms"
      aria-labelledby="rooms-heading"
      className="scroll-mt-20 py-20 sm:py-28 bg-[#FFFFFF] dark:bg-[#242424] border-y border-[#242424]/8 dark:border-[#F8F5EF]/10 transition-colors duration-300"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 lg:mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-4">
              <span className="h-px w-10 bg-[#C5A46D]" aria-hidden="true" />
              <span className="text-xs font-semibold tracking-[0.24em] uppercase text-[#A4834C] dark:text-[#C5A46D]">
                Accommodations
              </span>
            </div>

            <h2
              id="rooms-heading"
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#242424] dark:text-[#F8F5EF]"
            >
              Luxury Rooms &amp; Suites
            </h2>

            <p className="mt-4 text-base text-[#242424]/75 dark:text-[#F8F5EF]/75 leading-relaxed">
              Three distinct room tiers designed around serene rest, warm interiors, and transparent
              nightly rates.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenConfig}
            className="inline-flex items-center gap-2 self-start md:self-auto rounded-md border border-[#242424]/15 dark:border-[#F8F5EF]/15 px-4 py-2.5 text-xs font-medium text-[#242424]/80 dark:text-[#F8F5EF]/80 hover:border-[#C5A46D] hover:text-[#242424] dark:hover:text-[#F8F5EF] transition-colors whitespace-nowrap shrink-0"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#C5A46D]" />
            <span>Edit Room Photo Mapping</span>
          </button>
        </div>

        {/* 3-Column Luxury Room Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ROOM_CATEGORIES.map((room, index) => {
            const photo = getRoomPhoto(room.id, config, RESORT_PHOTOS);

            return (
              <motion.article
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.65, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group flex flex-col justify-between rounded-xl bg-[#F8F5EF] dark:bg-[#181715] border border-[#242424]/10 dark:border-[#F8F5EF]/10 overflow-hidden transition-shadow duration-300 hover:shadow-lg"
              >
                <div>
                  {/* Room Photograph */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#E8D9BD]/40 dark:bg-[#242424]">
                    <img
                      src={photo.src}
                      alt={`${room.name} — ${photo.title}`}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>

                  {/* Room Content */}
                  <div className="p-6 sm:p-7">
                    <div className="flex items-baseline justify-between gap-3 text-xs text-[#A4834C] dark:text-[#C5A46D] font-medium tracking-wider uppercase mb-2">
                      <span>0{index + 1} · Suite Tier</span>
                    </div>

                    <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#242424] dark:text-[#F8F5EF] leading-snug">
                      {room.name}
                    </h3>

                    <p className="mt-2 font-sans text-lg font-semibold text-[#A4834C] dark:text-[#C5A46D] tabular-nums">
                      {formatNaira(room.nightlyRate)}{' '}
                      <span className="text-xs font-normal text-[#242424]/65 dark:text-[#F8F5EF]/65">
                        per night
                      </span>
                    </p>

                    <div className="my-4 h-px w-full bg-[#242424]/8 dark:bg-[#F8F5EF]/10" />

                    <p className="text-sm sm:text-base leading-relaxed text-[#242424]/80 dark:text-[#F8F5EF]/80">
                      {room.description}
                    </p>
                  </div>
                </div>

                {/* Room Card Actions */}
                <div className="px-6 sm:px-7 pb-6 sm:pb-7 pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => onViewDetails(room)}
                    aria-label={`View Details for ${room.name}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md border border-[#242424]/20 dark:border-[#F8F5EF]/20 px-4 py-2.5 text-xs font-semibold tracking-wide text-[#242424] dark:text-[#F8F5EF] hover:border-[#C5A46D] hover:bg-[#E8D9BD]/35 dark:hover:bg-[#242424] transition-colors whitespace-nowrap"
                  >
                    <span>View Details</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#C5A46D]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onBookRoom(room)}
                    aria-label={`Book ${room.name}`}
                    className="flex-1 inline-flex items-center justify-center rounded-md bg-[#242424] dark:bg-[#C5A46D] px-4 py-2.5 text-xs font-semibold tracking-wide text-[#F8F5EF] dark:text-[#181715] hover:bg-[#3a3834] dark:hover:bg-[#d4b680] transition-colors whitespace-nowrap"
                  >
                    Book This Room
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
