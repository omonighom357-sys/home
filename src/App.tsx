import { useCallback, useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { BookingSection } from './components/BookingSection';
import { BrandStorySection } from './components/BrandStorySection';
import { CinematicIntro } from './components/CinematicIntro';
import { ContactSection } from './components/ContactSection';
import { ExperiencesSection } from './components/ExperiencesSection';
import { Footer } from './components/Footer';
import { GallerySection } from './components/GallerySection';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { PropertyConfigDrawer } from './components/PropertyConfigDrawer';
import { RoomDetailsModal } from './components/RoomDetailsModal';
import { RoomsSection } from './components/RoomsSection';
import { VirtualConcierge } from './components/VirtualConcierge';
import { AtmosphereMode, ResortConfig, RoomCategory } from './data/resortData';
import {
  addDaysToDateString,
  BookingFormInput,
  getTodayDateString,
} from './utils/booking';
import { loadResortConfig, saveResortConfig } from './utils/resortConfig';

const INTRO_SESSION_KEY = 'hsh_intro_seen_v1';

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
  const [atmosphere, setAtmosphere] = useState<AtmosphereMode>('daylight');
  const [config, setConfig] = useState<ResortConfig>(() => loadResortConfig());
  const [selectedRoomModal, setSelectedRoomModal] = useState<RoomCategory | null>(null);
  const [configDrawerOpen, setConfigDrawerOpen] = useState(false);

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
    const root = document.documentElement;
    if (atmosphere === 'evening') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [atmosphere]);

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
      // Ignore storage failures gracefully
    }
  }, []);

  const handleUpdateConfig = useCallback((nextConfig: ResortConfig) => {
    setConfig(nextConfig);
    saveResortConfig(nextConfig);
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
      <div className="min-h-screen bg-[#F8F5EF] dark:bg-[#181715] text-[#242424] dark:text-[#F8F5EF] transition-colors duration-300">
        {showIntro && <CinematicIntro onComplete={handleIntroComplete} />}

        <Navbar
          atmosphere={atmosphere}
          onToggleAtmosphere={() =>
            setAtmosphere((prev) => (prev === 'daylight' ? 'evening' : 'daylight'))
          }
          onBookNow={() => scrollToSection('booking')}
          onOpenConfig={() => setConfigDrawerOpen(true)}
        />

        <main>
          <HeroSection
            atmosphere={atmosphere}
            onSetAtmosphere={setAtmosphere}
            onExploreRooms={() => scrollToSection('rooms')}
            onBookStay={() => scrollToSection('booking')}
            heroReady={!showIntro}
          />

          <BrandStorySection onExploreGallery={() => scrollToSection('gallery')} />

          <RoomsSection
            config={config}
            onViewDetails={(room) => setSelectedRoomModal(room)}
            onBookRoom={handleBookRoom}
            onOpenConfig={() => setConfigDrawerOpen(true)}
          />

          <BookingSection
            form={bookingForm}
            onChangeForm={setBookingForm}
            config={config}
            onUpdateWhatsAppNumber={(whatsappNumber) =>
              handleUpdateConfig({ ...config, whatsappNumber })
            }
            onOpenConfig={() => setConfigDrawerOpen(true)}
          />

          <GallerySection />

          <ExperiencesSection
            config={config}
            onOpenConfig={() => setConfigDrawerOpen(true)}
          />

          <ContactSection
            config={config}
            onOpenConfig={() => setConfigDrawerOpen(true)}
          />
        </main>

        <Footer
          config={config}
          onOpenConfig={() => setConfigDrawerOpen(true)}
          onReplayIntro={handleReplayIntro}
          onSelectRoomForBooking={handleBookRoom}
        />

        <VirtualConcierge
          config={config}
          onExploreRooms={() => scrollToSection('rooms')}
          onMakeReservation={() => scrollToSection('booking')}
          onContactResort={() => scrollToSection('contact')}
        />

        <RoomDetailsModal
          room={selectedRoomModal}
          config={config}
          checkIn={bookingForm.checkIn}
          checkOut={bookingForm.checkOut}
          onDatesChange={(checkIn, checkOut) =>
            setBookingForm((prev) => ({ ...prev, checkIn, checkOut }))
          }
          onClose={() => setSelectedRoomModal(null)}
          onBookRoom={handleBookRoom}
          onOpenConfig={() => setConfigDrawerOpen(true)}
        />

        <PropertyConfigDrawer
          open={configDrawerOpen}
          config={config}
          onUpdateConfig={handleUpdateConfig}
          onClose={() => setConfigDrawerOpen(false)}
        />
      </div>
    </MotionConfig>
  );
}
