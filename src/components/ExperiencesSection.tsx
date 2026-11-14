import {
  BedDouble,
  Car,
  CheckCircle2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
  Utensils,
  Wifi,
  Wine,
} from 'lucide-react';
import { motion } from 'motion/react';
import { AmenityItem, ResortConfig } from '../data/resortData';

interface ExperiencesSectionProps {
  config: ResortConfig;
  onOpenConfig: () => void;
}

const CATEGORY_ICONS: Record<AmenityItem['category'], typeof Utensils> = {
  Restaurant: Utensils,
  'Bar & Lounge': Wine,
  'Wi-Fi': Wifi,
  Parking: Car,
  Security: ShieldCheck,
  'Room Service': BedDouble,
  'Event Spaces': Users,
  'Leisure Facilities': Sparkles,
};

export function ExperiencesSection({ config, onOpenConfig }: ExperiencesSectionProps) {
  const confirmedAmenities = config.amenities.filter((a) => a.confirmed);

  return (
    <section
      id="experiences"
      aria-labelledby="experiences-heading"
      className="scroll-mt-20 py-20 sm:py-28 bg-[#F8F5EF] dark:bg-[#181715] transition-colors duration-300"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-4">
              <span className="h-px w-10 bg-[#C5A46D]" aria-hidden="true" />
              <span className="text-xs font-semibold tracking-[0.24em] uppercase text-[#A4834C] dark:text-[#C5A46D]">
                Guest Services &amp; Amenities
              </span>
            </div>

            <h2
              id="experiences-heading"
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#242424] dark:text-[#F8F5EF]"
            >
              Experiences &amp; Amenities
            </h2>

            <p className="mt-4 text-base text-[#242424]/75 dark:text-[#F8F5EF]/75 leading-relaxed">
              We publish only confirmed property facilities and hospitality services so every guest
              receives accurate, dependable information.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenConfig}
            className="inline-flex items-center gap-2 self-start md:self-auto rounded-md border border-[#242424]/15 dark:border-[#F8F5EF]/15 px-4 py-2.5 text-xs font-medium text-[#242424]/80 dark:text-[#F8F5EF]/80 hover:border-[#C5A46D] hover:text-[#242424] dark:hover:text-[#F8F5EF] transition-colors whitespace-nowrap shrink-0"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#C5A46D]" />
            <span>Manage Verified Amenities</span>
          </button>
        </div>

        {confirmedAmenities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {confirmedAmenities.map((item, idx) => {
              const Icon = CATEGORY_ICONS[item.category] ?? CheckCircle2;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.55, delay: idx * 0.05 }}
                  className="rounded-xl bg-[#FFFFFF] dark:bg-[#242424] border border-[#242424]/10 dark:border-[#F8F5EF]/10 p-6"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#E8D9BD]/45 dark:bg-[#181715] text-[#A4834C] dark:text-[#C5A46D] mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif text-xl font-medium text-[#242424] dark:text-[#F8F5EF]">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#242424]/75 dark:text-[#F8F5EF]/75">
                    {item.note.trim() || 'Confirmed on-property hospitality service.'}
                  </p>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl bg-[#FFFFFF] dark:bg-[#242424] border border-[#242424]/10 dark:border-[#F8F5EF]/10 p-8 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6">
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#84917A] mb-2">
                  Directory Ready for Confirmation
                </p>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#242424] dark:text-[#F8F5EF] mb-3">
                  Verified Amenities Awaiting Final Property Schedule
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-[#242424]/75 dark:text-[#F8F5EF]/75 mb-6">
                  To uphold complete transparency, Home Sweet Home Resort only showcases facilities
                  once their operating details are formally confirmed by management. Authorized staff
                  can enable confirmed amenities anytime via Property Setup.
                </p>
                <button
                  type="button"
                  onClick={onOpenConfig}
                  className="inline-flex items-center gap-2 rounded-md bg-[#242424] dark:bg-[#C5A46D] px-5 py-2.5 text-xs font-semibold tracking-wider uppercase text-[#F8F5EF] dark:text-[#181715] hover:bg-[#3a3834] dark:hover:bg-[#d4b680] transition-colors"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span>Confirm Amenities</span>
                </button>
              </div>

              <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {config.amenities.map((item) => {
                  const Icon = CATEGORY_ICONS[item.category];
                  return (
                    <div
                      key={item.id}
                      className="rounded-lg border border-dashed border-[#242424]/15 dark:border-[#F8F5EF]/15 bg-[#F8F5EF]/60 dark:bg-[#181715]/60 p-3.5 flex flex-col items-start gap-2"
                    >
                      <Icon className="h-4 w-4 text-[#C5A46D]" />
                      <span className="text-xs font-medium text-[#242424]/80 dark:text-[#F8F5EF]/80">
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
