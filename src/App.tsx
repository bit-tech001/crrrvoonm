import { useEffect, useState } from 'react';
import { BookingModal } from './components/BookingModal';
import { FleetBookingSection } from './components/FleetBookingSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { LifestyleBannerSection } from './components/LifestyleBannerSection';
import { MyBookingsDrawer } from './components/MyBookingsDrawer';
import { Navbar } from './components/Navbar';
import { SmartExperienceSection } from './components/SmartExperienceSection';
import { TestimonialsAndFaqSection } from './components/TestimonialsAndFaqSection';
import { ValuePropositionSection } from './components/ValuePropositionSection';
import { WhatsAppButton } from './components/WhatsAppButton';
import { FLEET_VEHICLES, SEED_RESERVATION } from './data/fleetData';
import { BookingSearchState, Reservation, Vehicle, VehicleCategory } from './types/rental';
import { getDefaultSearchDates } from './utils/bookingMath';

const STORAGE_KEY = 'vromon_reservations_inr_v1';

function loadInitialReservations(): Reservation[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [SEED_RESERVATION];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [SEED_RESERVATION];
  } catch {
    return [SEED_RESERVATION];
  }
}

export default function App() {
  const defaultDates = getDefaultSearchDates();
  const [search, setSearch] = useState<BookingSearchState>({
    pickupBranchId: 'dhk-airport',
    dropoffBranchId: 'dhk-airport',
    sameDropoff: true,
    pickupDate: defaultDates.pickupDate,
    pickupTime: defaultDates.pickupTime,
    dropoffDate: defaultDates.dropoffDate,
    dropoffTime: defaultDates.dropoffTime,
    categoryFilter: 'All',
    searchQuery: '',
    sortBy: 'recommended',
  });

  const [reservations, setReservations] = useState<Reservation[]>(loadInitialReservations);
  const [bookingVehicle, setBookingVehicle] = useState<Vehicle | null>(null);
  const [isBookingsDrawerOpen, setIsBookingsDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
    } catch {
      // Ignore storage quota issues in private mode
    }
  }, [reservations]);

  const handleUpdateSearch = (patch: Partial<BookingSearchState>) => {
    setSearch((prev) => ({ ...prev, ...patch }));
  };

  const scrollToFleet = () => {
    const el = document.getElementById('fleet');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCategoryAndScroll = (category: 'All' | VehicleCategory) => {
    handleUpdateSearch({ categoryFilter: category });
    scrollToFleet();
  };

  const handleConfirmReservation = (reservation: Reservation) => {
    setReservations((prev) => [reservation, ...prev]);
  };

  const handleCancelReservation = (id: string) => {
    setReservations((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'Cancelled' } : item
      )
    );
  };

  const activeBookingsCount = reservations.filter(
    (r) => r.status === 'Confirmed'
  ).length;

  return (
    <div className="min-h-screen bg-white text-[#111111]">
      <Navbar
        activeBookingsCount={activeBookingsCount}
        onOpenBookings={() => setIsBookingsDrawerOpen(true)}
        onStartBooking={() => setBookingVehicle(FLEET_VEHICLES[0])}
      />

      <main>
        <HeroSection
          search={search}
          onUpdateSearch={handleUpdateSearch}
          onSearchSubmit={scrollToFleet}
        />

        <ValuePropositionSection
          onSelectCategoryAndScroll={handleSelectCategoryAndScroll}
        />

        <FleetBookingSection
          search={search}
          onUpdateSearch={handleUpdateSearch}
          onSelectVehicleForBooking={(vehicle) => setBookingVehicle(vehicle)}
        />

        <LifestyleBannerSection
          onStartBooking={() => setBookingVehicle(FLEET_VEHICLES[0])}
        />

        <SmartExperienceSection
          onStartBooking={() => setBookingVehicle(FLEET_VEHICLES[0])}
        />

        <TestimonialsAndFaqSection />
      </main>

      <Footer
        onOpenBookings={() => setIsBookingsDrawerOpen(true)}
        onStartBooking={() => setBookingVehicle(FLEET_VEHICLES[0])}
      />

      <BookingModal
        isOpen={Boolean(bookingVehicle)}
        initialVehicle={bookingVehicle ?? FLEET_VEHICLES[0]}
        search={search}
        onClose={() => setBookingVehicle(null)}
        onConfirmReservation={handleConfirmReservation}
        onOpenMyBookings={() => setIsBookingsDrawerOpen(true)}
      />

      <MyBookingsDrawer
        isOpen={isBookingsDrawerOpen}
        reservations={reservations}
        onClose={() => setIsBookingsDrawerOpen(false)}
        onCancelReservation={handleCancelReservation}
        onBrowseFleet={scrollToFleet}
      />

      <WhatsAppButton />
    </div>
  );
}
