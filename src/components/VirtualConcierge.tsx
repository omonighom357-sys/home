import { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { RESORT_LOCATION, ROOM_CATEGORIES, ResortProfile } from '../data/resortData';
import { formatNaira } from '../utils/booking';

interface VirtualConciergeProps {
  profile: ResortProfile;
  onExploreRooms: () => void;
  onMakeReservation: () => void;
  onContactResort: () => void;
}

type ConciergeView = 'greeting' | 'prices' | 'contact';

export function VirtualConcierge({
  profile,
  onExploreRooms,
  onMakeReservation,
  onContactResort,
}: VirtualConciergeProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<ConciergeView>('greeting');

  const handleAction = (action: 'rooms' | 'prices' | 'reserve' | 'contact') => {
    if (action === 'rooms') {
      setOpen(false);
      onExploreRooms();
    } else if (action === 'prices') {
      setView('prices');
    } else if (action === 'reserve') {
      setOpen(false);
      onMakeReservation();
    } else if (action === 'contact') {
      setView('contact');
      onContactResort();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 flex flex-col items-end">
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Home Sweet Home Resort Concierge"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3 w-[calc(100vw-2rem)] max-w-sm rounded-2xl bg-[#FFFFFF] border border-[#C9A227]/45 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 bg-[#000000] px-5 py-4 text-[#F9F6F0]">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#C9A227]">
                  Guest Concierge
                </p>
                <p className="font-serif text-lg font-medium text-[#FFFFFF]">
                  Home Sweet Home Resort
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close concierge"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#F9F6F0]/80 hover:text-[#D4AF37] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              <p className="text-sm leading-relaxed text-[#000000]">
                Welcome to Home Sweet Home Resort. How may we assist with your stay?
              </p>

              {view === 'prices' && (
                <div className="rounded-xl bg-[#F9F6F0] border border-[#C9A227]/30 p-4 space-y-2.5">
                  <p className="text-xs font-semibold tracking-wider uppercase text-[#C9A227]">
                    Official Nightly Suite Rates
                  </p>
                  {ROOM_CATEGORIES.map((room) => (
                    <div
                      key={room.id}
                      className="flex items-center justify-between gap-3 text-xs sm:text-sm"
                    >
                      <span className="text-[#000000] font-medium">{room.name}</span>
                      <span className="text-[#C9A227] font-semibold tabular-nums">
                        {formatNaira(room.nightlyRate)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {view === 'contact' && (
                <div className="rounded-xl bg-[#F9F6F0] border border-[#C9A227]/30 p-4 space-y-1.5 text-xs text-[#000000]/85">
                  <p className="font-semibold tracking-wider uppercase text-[#C9A227] mb-1">
                    Location &amp; Hospitality Desk
                  </p>
                  <p>
                    Address: <span className="font-medium">{profile.resortAddress}</span>
                  </p>
                  <p className="text-[11px] font-medium text-[#000000]/70">
                    {RESORT_LOCATION.lga}
                  </p>
                  {profile.contactPhone && (
                    <p>
                      Telephone:{' '}
                      <span className="font-medium tabular-nums">{profile.contactPhone}</span>
                    </p>
                  )}
                  {profile.contactEmail && (
                    <p>
                      Email: <span className="font-medium">{profile.contactEmail}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleAction('rooms')}
                  className="rounded-full border border-[#000000]/15 px-3.5 py-2 text-xs font-medium text-[#000000] hover:border-[#C9A227] hover:bg-[#F9F6F0] transition-colors text-center"
                >
                  Explore Rooms
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('prices')}
                  className="rounded-full border border-[#000000]/15 px-3.5 py-2 text-xs font-medium text-[#000000] hover:border-[#C9A227] hover:bg-[#F9F6F0] transition-colors text-center"
                >
                  View Rates
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('reserve')}
                  className="rounded-full bg-[#C9A227] hover:bg-[#D4AF37] px-3.5 py-2 text-xs font-semibold text-[#000000] transition-colors text-center"
                >
                  Book Now
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('contact')}
                  className="rounded-full border border-[#000000]/15 px-3.5 py-2 text-xs font-medium text-[#000000] hover:border-[#C9A227] hover:bg-[#F9F6F0] transition-colors text-center"
                >
                  Location &amp; Map
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Circular Black & Gold Concierge Button */}
      <button
        type="button"
        onClick={() => {
          setOpen((prev) => !prev);
          setView('greeting');
        }}
        aria-expanded={open}
        aria-label={open ? 'Close Guest Concierge' : 'Open Guest Concierge'}
        title="Guest Concierge"
        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#000000] text-[#D4AF37] shadow-lg border border-[#C9A227] hover:scale-105 active:scale-95 transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A227]"
      >
        {open ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
      </button>
    </div>
  );
}
