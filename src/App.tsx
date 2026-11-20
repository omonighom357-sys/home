import { useCallback, useEffect, useMemo, useState } from 'react';
import { MotionConfig, motion, useScroll, useSpring } from 'motion/react';
import { BookingSection } from './components/BookingSection';
import { BrandStorySection } from './components/BrandStorySection';
import { CinematicIntro } from './components/CinematicIntro';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { GallerySection } from './components/GallerySection';
import { HeroSection } from './components/HeroSection';
import { MarqueeStrip } from './components/MarqueeStrip';
import { Navbar } from './components/Navbar';
import { ReviewsSection } from './components/ReviewsSection';
import { RoomDetailsModal } from './components/RoomDetailsModal';
import { RoomsSection } from './components/RoomsSection';
import { VirtualConcierge } from './components/VirtualConcierge';
import { getResortProfile, RoomCategory } from './data/resortData';
import {
  addDaysToDateString,
  BookingFormInput,
  getTodayDateString,
} from './utils/booking';

const INTRO_SESSION_KEY = 'hsh_intro_seen_v3';

function shouldShowIntroInitially(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  if (params.get('autostart') === '1') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    return window.sessionStorage.getItem(INTRO_SESSION_KEY) !== '1';
  } catch {
    return false;
  }
}

export default function App() {
  const [showIntro, setShowIntro] = useState<boolean>(() => shouldShowIntroInitially());
  const [selectedRoomModal, setSelectedRoomModal] = useState<RoomCategory | null>(null);
  const profile = useMemo(() => getResortProfile(), []);

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  });

  const today = getTodayDateString();
  const [bookingForm, setBookingForm] = useState<BookingFormInput>({
    fullName: '',
    phoneNumber: '',
    email: '',
    roomId: 'deluxe',
    checkIn: today,
    checkOut: addDaysToDateString(today, 1),
    guests: 1,
    specialRequests: '',
  });

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const canonicalHref = window.location.origin + window.location.pathname;
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalHref;
  }, []);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
    try {
      window.sessionStorage.setItem(INTRO_SESSION_KEY, '1');
    } catch {
      // Ignore storage errors cleanly
    }
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleBookRoom = useCallback(
    (room: RoomCategory) => {
      setBookingForm((prev) => ({
        ...prev,
        roomId: room.id,
      }));
      setSelectedRoomModal(null);
      scrollToSection('booking');
    },
    [scrollToSection]
  );

  const handleReplayIntro = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setShowIntro(true);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#F9F6F0] text-[#000000]">
        {/* Gold Scroll Progress Indicator */}
        <motion.div
          aria-hidden="true"
          style={{ scaleX: smoothProgress }}
          className="fixed top-0 inset-x-0 z-50 h-0.5 origin-left bg-[#D4AF37] pointer-events-none"
        />

        {showIntro && <CinematicIntro onComplete={handleIntroComplete} />}

        <Navbar
          onBookNow={() => scrollToSection('booking')}
          onNavigateSection={scrollToSection}
        />

        <main>
          <HeroSection
            onExploreRooms={() => scrollToSection('rooms')}
            heroReady={!showIntro}
          />

          <MarqueeStrip />

          <BrandStorySection
            onExploreGallery={() => scrollToSection('gallery')}
            onExploreRooms={() => scrollToSection('rooms')}
            onExploreLocation={() => scrollToSection('contact')}
          />

          <RoomsSection
            onViewDetails={(room) => setSelectedRoomModal(room)}
            onBookRoom={handleBookRoom}
          />

          <GallerySection />

          <ReviewsSection />

          <BookingSection
            form={bookingForm}
            onChangeForm={setBookingForm}
            profile={profile}
          />

          <ContactSection profile={profile} />
        </main>

        <Footer
          profile={profile}
          onReplayIntro={handleReplayIntro}
          onSelectRoomForBooking={handleBookRoom}
        />

        <VirtualConcierge
          profile={profile}
          onExploreRooms={() => scrollToSection('rooms')}
          onMakeReservation={() => scrollToSection('booking')}
          onContactResort={() => scrollToSection('contact')}
        />

        <RoomDetailsModal
          room={selectedRoomModal}
          checkIn={bookingForm.checkIn}
          checkOut={bookingForm.checkOut}
          onDatesChange={(checkIn, checkOut) =>
            setBookingForm((prev) => ({ ...prev, checkIn, checkOut }))
          }
          onClose={() => setSelectedRoomModal(null)}
          onBookRoom={handleBookRoom}
        />
      </div>
    </MotionConfig>
  );
}
