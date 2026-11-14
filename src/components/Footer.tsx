import { ArrowUp, ExternalLink, SlidersHorizontal } from 'lucide-react';
import { motion } from 'motion/react';
import { ROOM_CATEGORIES, ResortConfig, RoomCategory } from '../data/resortData';
import { formatNaira } from '../utils/booking';
import { normalizeExternalUrl } from '../utils/contact';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  config: ResortConfig;
  onOpenConfig: () => void;
  onReplayIntro: () => void;
  onSelectRoomForBooking: (room: RoomCategory) => void;
}

export function Footer({
  config,
  onOpenConfig,
  onReplayIntro,
  onSelectRoomForBooking,
}: FooterProps) {
  const configuredSocials = [
    { label: 'Instagram', url: normalizeExternalUrl(config.socialLinks.instagram) },
    { label: 'Facebook', url: normalizeExternalUrl(config.socialLinks.facebook) },
    { label: 'X', url: normalizeExternalUrl(config.socialLinks.x) },
    { label: 'TikTok', url: normalizeExternalUrl(config.socialLinks.tiktok) },
  ].filter((item): item is { label: string; url: string } => item.url !== null);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#242424] dark:bg-[#141311] text-[#F8F5EF] border-t border-[#C5A46D]/25 pt-16 sm:pt-20 pb-24 sm:pb-14">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#F8F5EF]/12">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-4">
            <BrandLogo variant="footer" />
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#FFFFFF]">
              Home Sweet Home Resort
            </h2>
            <p className="font-serif italic text-lg text-[#E8D9BD]">
              &ldquo;Where comfort meets elegance, and every stay feels like home.&rdquo;
            </p>
            <p className="text-xs sm:text-sm leading-relaxed text-[#F8F5EF]/70 max-w-sm">
              Warm contemporary hospitality crafted for quiet rest, thoughtful service, and lasting
              memories.
            </p>
          </div>

          {/* Navigation Column */}
          <div className="md:col-span-2">
            <h3 className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-[#C5A46D] mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm text-[#F8F5EF]/80">
              <li>
                <a href="#home" className="hover:text-[#C5A46D] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#C5A46D] transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#rooms" className="hover:text-[#C5A46D] transition-colors">
                  Rooms &amp; Suites
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-[#C5A46D] transition-colors">
                  Gallery
                </a>
              </li>
              <li>
                <a href="#experiences" className="hover:text-[#C5A46D] transition-colors">
                  Experiences
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#C5A46D] transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Room Categories Column */}
          <div className="md:col-span-3">
            <h3 className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-[#C5A46D] mb-4">
              Rooms &amp; Suites
            </h3>
            <ul className="space-y-3 text-sm">
              {ROOM_CATEGORIES.map((room) => (
                <li key={room.id}>
                  <button
                    type="button"
                    onClick={() => onSelectRoomForBooking(room)}
                    className="group flex w-full items-baseline justify-between gap-3 text-left text-[#F8F5EF]/85 hover:text-[#C5A46D] transition-colors"
                  >
                    <span>{room.name}</span>
                    <span className="text-xs text-[#E8D9BD] tabular-nums shrink-0">
                      {formatNaira(room.nightlyRate)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Controls Column */}
          <div className="md:col-span-3">
            <h3 className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-[#C5A46D] mb-4">
              Resort Desk
            </h3>

            <dl className="space-y-2.5 text-sm text-[#F8F5EF]/80">
              <div>
                <dt className="text-xs text-[#F8F5EF]/50">WhatsApp Desk</dt>
                <dd className="tabular-nums font-medium text-[#FFFFFF]">
                  {config.whatsappNumber || 'Awaiting configuration'}
                </dd>
              </div>
              {config.contactPhone && (
                <div>
                  <dt className="text-xs text-[#F8F5EF]/50">Telephone</dt>
                  <dd className="tabular-nums font-medium">{config.contactPhone}</dd>
                </div>
              )}
              {config.contactEmail && (
                <div>
                  <dt className="text-xs text-[#F8F5EF]/50">Email</dt>
                  <dd className="font-medium break-all">{config.contactEmail}</dd>
                </div>
              )}
              {config.resortAddress && (
                <div>
                  <dt className="text-xs text-[#F8F5EF]/50">Location</dt>
                  <dd className="font-medium">{config.resortAddress}</dd>
                </div>
              )}
            </dl>

            {configuredSocials.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {configuredSocials.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#E8D9BD] hover:text-[#C5A46D] transition-colors"
                  >
                    <span>{social.label}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ))}
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={onOpenConfig}
                className="inline-flex items-center gap-1.5 rounded-md border border-[#F8F5EF]/20 px-3 py-2 text-xs font-medium text-[#F8F5EF] hover:border-[#C5A46D] transition-colors"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-[#C5A46D]" />
                <span>Property Setup</span>
              </button>

              <button
                type="button"
                onClick={onReplayIntro}
                className="inline-flex items-center rounded-md border border-[#F8F5EF]/20 px-3 py-2 text-xs font-medium text-[#F8F5EF]/80 hover:border-[#C5A46D] hover:text-[#FFFFFF] transition-colors"
              >
                Replay Opening
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F8F5EF]/60">
          <p>&copy; {new Date().getFullYear()} Home Sweet Home Resort. All rights reserved.</p>

          <button
            type="button"
            onClick={handleBackToTop}
            className="inline-flex items-center gap-2 rounded-md border border-[#F8F5EF]/20 px-3.5 py-2 text-xs font-medium text-[#E8D9BD] hover:border-[#C5A46D] hover:text-[#FFFFFF] transition-colors"
          >
            <span>Back to Top</span>
            <ArrowUp className="h-3.5 w-3.5 text-[#C5A46D]" />
          </button>
        </div>
      </motion.div>
    </footer>
  );
}
