import { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { ROOM_CATEGORIES, ResortConfig } from '../data/resortData';
import { formatNaira } from '../utils/booking';

interface VirtualConciergeProps {
  config: ResortConfig;
  onExploreRooms: () => void;
  onMakeReservation: () => void;
  onContactResort: () => void;
}

type ConciergeView = 'greeting' | 'prices' | 'contact';

export function VirtualConcierge({
  config,
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
            aria-label="Home Sweet Home Resort Virtual Concierge"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3 w-[calc(100vw-2rem)] max-w-sm rounded-2xl bg-[#FFFFFF] dark:bg-[#242424] border border-[#C5A46D]/35 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 bg-[#242424] dark:bg-[#181715] px-5 py-4 text-[#F8F5EF]">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#C5A46D]">
                  Resort Concierge
                </p>
                <p className="font-serif text-lg font-medium">Home Sweet Home Resort</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close concierge"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#F8F5EF]/80 hover:text-[#F8F5EF] hover:bg-[#F8F5EF]/10 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              <p className="text-sm leading-relaxed text-[#242424] dark:text-[#F8F5EF]">
                Welcome to Home Sweet Home Resort. How may we make your stay exceptional?
              </p>

              {view === 'prices' && (
                <div className="rounded-xl bg-[#F8F5EF] dark:bg-[#181715] border border-[#242424]/10 dark:border-[#F8F5EF]/10 p-4 space-y-2.5">
                  <p className="text-xs font-semibold tracking-wider uppercase text-[#A4834C] dark:text-[#C5A46D]">
                    Confirmed Nightly Rates
                  </p>
                  {ROOM_CATEGORIES.map((room) => (
                    <div
                      key={room.id}
                      className="flex items-center justify-between gap-3 text-xs sm:text-sm"
                    >
                      <span className="text-[#242424] dark:text-[#F8F5EF] font-medium">
                        {room.name}
                      </span>
                      <span className="text-[#A4834C] dark:text-[#C5A46D] font-semibold tabular-nums">
                        {formatNaira(room.nightlyRate)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {view === 'contact' && (
                <div className="rounded-xl bg-[#F8F5EF] dark:bg-[#181715] border border-[#242424]/10 dark:border-[#F8F5EF]/10 p-4 space-y-1.5 text-xs text-[#242424]/85 dark:text-[#F8F5EF]/85">
                  <p className="font-semibold tracking-wider uppercase text-[#A4834C] dark:text-[#C5A46D] mb-1">
                    Configured Resort Contact
                  </p>
                  <p>
                    WhatsApp Desk:{' '}
                    <span className="font-medium tabular-nums">
                      {config.whatsappNumber || 'Not yet configured'}
                    </span>
                  </p>
                  {config.contactPhone && (
                    <p>
                      Telephone:{' '}
                      <span className="font-medium tabular-nums">{config.contactPhone}</span>
                    </p>
                  )}
                  {config.contactEmail && (
                    <p>
                      Email: <span className="font-medium">{config.contactEmail}</span>
                    </p>
                  )}
                  {config.resortAddress && (
                    <p>
                      Address: <span className="font-medium">{config.resortAddress}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleAction('rooms')}
                  className="rounded-md border border-[#242424]/15 dark:border-[#F8F5EF]/15 px-3 py-2.5 text-xs font-medium text-[#242424] dark:text-[#F8F5EF] hover:border-[#C5A46D] hover:bg-[#F8F5EF] dark:hover:bg-[#181715] transition-colors text-left"
                >
                  Explore Rooms
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('prices')}
                  className="rounded-md border border-[#242424]/15 dark:border-[#F8F5EF]/15 px-3 py-2.5 text-xs font-medium text-[#242424] dark:text-[#F8F5EF] hover:border-[#C5A46D] hover:bg-[#F8F5EF] dark:hover:bg-[#181715] transition-colors text-left"
                >
                  View Prices
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('reserve')}
                  className="rounded-md bg-[#C5A46D] px-3 py-2.5 text-xs font-semibold text-[#181715] hover:bg-[#d4b680] transition-colors text-left"
                >
                  Make a Reservation
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('contact')}
                  className="rounded-md border border-[#242424]/15 dark:border-[#F8F5EF]/15 px-3 py-2.5 text-xs font-medium text-[#242424] dark:text-[#F8F5EF] hover:border-[#C5A46D] hover:bg-[#F8F5EF] dark:hover:bg-[#181715] transition-colors text-left"
                >
                  Contact the Resort
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compact Circular Concierge Icon Button */}
      <button
        type="button"
        onClick={() => {
          setOpen((prev) => !prev);
          setView('greeting');
        }}
        aria-expanded={open}
        aria-label={open ? 'Close Virtual Concierge' : 'Open Virtual Concierge'}
        title="Virtual Concierge"
        className="inline-flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#242424] dark:bg-[#C5A46D] text-[#C5A46D] dark:text-[#181715] shadow-lg border border-[#C5A46D]/45 hover:scale-105 active:scale-95 transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A46D]"
      >
        {open ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />}
      </button>
    </div>
  );
}
