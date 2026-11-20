import { ArrowUp, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import {
  RESORT_LOCATION,
  RESORT_NAME,
  ROOM_CATEGORIES,
  ResortProfile,
  RoomCategory,
} from '../data/resortData';
import { formatNaira } from '../utils/booking';
import { buildGoogleMapsDirectionsUrl, getLocationQuery } from '../utils/contact';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  profile: ResortProfile;
  onReplayIntro: () => void;
  onSelectRoomForBooking: (room: RoomCategory) => void;
}

export function Footer({
  profile,
  onReplayIntro,
  onSelectRoomForBooking,
}: FooterProps) {
  const locationQuery =
    getLocationQuery(profile.resortAddress, profile.googleMapsQuery) ||
    RESORT_LOCATION.geocodeQuery;
  const directionsUrl = buildGoogleMapsDirectionsUrl(locationQuery);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#000000] text-[#F9F6F0] border-t border-[#C9A227]/35 pt-16 sm:pt-24 pb-20 sm:pb-14 overflow-x-clip">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* SECTION 15 — OVERSIZED GOLD "HOME SWEET HOME" SLIDE-IN FROM LEFT */}
        <div className="pb-12 sm:pb-16 border-b border-[#C9A227]/25 overflow-hidden">
          <motion.p
            initial={{ opacity: 0, x: -72 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-medium uppercase tracking-[0.06em] text-[#C9A227] text-[clamp(2rem,6.4vw,5.75rem)] leading-[0.98] sm:whitespace-nowrap select-none"
          >
            HOME SWEET HOME
          </motion.p>
          <p className="mt-4 font-editorial italic text-lg sm:text-2xl text-[#F9F6F0]/80">
            &ldquo;A place where luxury feels like home.&rdquo;
          </p>
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 py-12 border-b border-[#F9F6F0]/12">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-4">
            <BrandLogo variant="footer" />
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#FFFFFF]">
              {RESORT_NAME}
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-[#F9F6F0]/70 max-w-sm">
              Contemporary hospitality crafted for quiet rest, luminous interiors, and personal
              care in {RESORT_LOCATION.lga}.
            </p>
          </div>

          {/* Explore Links */}
          <div className="md:col-span-2">
            <h3 className="font-sans text-xs font-semibold tracking-[0.22em] uppercase text-[#C9A227] mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm text-[#F9F6F0]/80">
              <li>
                <a href="#home" className="hover:text-[#D4AF37] transition-colors">
                  01 · Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#D4AF37] transition-colors">
                  02 · About
                </a>
              </li>
              <li>
                <a href="#rooms" className="hover:text-[#D4AF37] transition-colors">
                  03 · Rooms
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-[#D4AF37] transition-colors">
                  04 · Gallery
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-[#D4AF37] transition-colors">
                  05 · Reviews
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#D4AF37] transition-colors">
                  06 · Location
                </a>
              </li>
              <li>
                <a href="#booking" className="hover:text-[#D4AF37] transition-colors">
                  07 · Reservations
                </a>
              </li>
            </ul>
          </div>

          {/* Four Official Room Categories */}
          <div className="md:col-span-3">
            <h3 className="font-sans text-xs font-semibold tracking-[0.22em] uppercase text-[#C9A227] mb-4">
              Rooms &amp; Rates
            </h3>
            <ul className="space-y-3 text-sm">
              {ROOM_CATEGORIES.map((room) => (
                <li key={room.id}>
                  <button
                    type="button"
                    onClick={() => onSelectRoomForBooking(room)}
                    className="group flex w-full items-baseline justify-between gap-3 text-left text-[#F9F6F0]/85 hover:text-[#D4AF37] transition-colors"
                  >
                    <span>{room.name}</span>
                    <span className="text-xs text-[#D4AF37] tabular-nums shrink-0">
                      {formatNaira(room.nightlyRate)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Verified Address & Actions */}
          <div className="md:col-span-3">
            <h3 className="font-sans text-xs font-semibold tracking-[0.22em] uppercase text-[#C9A227] mb-4">
              Property Address
            </h3>

            <address className="not-italic text-xs sm:text-sm leading-relaxed text-[#F9F6F0]/85 space-y-1">
              <p className="font-semibold text-[#FFFFFF]">{RESORT_LOCATION.propertyName}</p>
              <p>
                {RESORT_LOCATION.streetLine} {RESORT_LOCATION.roadLine}
              </p>
              <p>
                {RESORT_LOCATION.landmarkLine} {RESORT_LOCATION.cityPostalLine}{' '}
                {RESORT_LOCATION.stateCountryLine}
              </p>
              <p className="text-xs text-[#C9A227] pt-1">{RESORT_LOCATION.lga}</p>
            </address>

            <div className="mt-5 flex flex-wrap gap-2.5">
              {directionsUrl && (
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#C9A227]/45 px-4 py-2 text-xs font-semibold text-[#F9F6F0] hover:bg-[#C9A227] hover:text-[#000000] transition-colors"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Directions</span>
                </a>
              )}

              <button
                type="button"
                onClick={onReplayIntro}
                className="inline-flex items-center rounded-full border border-[#F9F6F0]/25 px-4 py-2 text-xs font-medium text-[#F9F6F0]/80 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
              >
                Replay Opening
              </button>
            </div>
          </div>
        </div>

        {/* Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F9F6F0]/60">
          <p>&copy; {new Date().getFullYear()} {RESORT_NAME}. All rights reserved.</p>

          <button
            type="button"
            onClick={handleBackToTop}
            className="inline-flex items-center gap-2 rounded-full border border-[#C9A227]/45 px-4 py-2 text-xs font-semibold text-[#D4AF37] hover:bg-[#C9A227] hover:text-[#000000] transition-colors"
          >
            <span>Back to Top</span>
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
