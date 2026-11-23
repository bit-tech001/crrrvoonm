import { ArrowRight, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  activeBookingsCount: number;
  onOpenBookings: () => void;
  onStartBooking: () => void;
}

export function Navbar({
  activeBookingsCount,
  onOpenBookings,
  onStartBooking,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F6C992]/90 backdrop-blur-md border-b border-black/5">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element geometric wordmark */}
        <a
          href="#top"
          className="font-display text-2xl font-extrabold tracking-tight text-[#111111] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F95B2B] rounded"
        >
          VROMON
        </a>

        {/* Zone 2: 4-5 concise single-line navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#111111]/80"
        >
          <a
            href="#benefits"
            className="hover:text-[#111111] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Why Vromon
          </a>
          <a
            href="#fleet"
            className="hover:text-[#111111] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Explore Fleet
          </a>
          <a
            href="#experience"
            className="hover:text-[#111111] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Experience
          </a>
          <a
            href="#reviews"
            className="hover:text-[#111111] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Reviews
          </a>
          <button
            type="button"
            onClick={onOpenBookings}
            className="hover:text-[#111111] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums"
          >
            My Bookings ({activeBookingsCount})
          </button>
        </nav>

        {/* Zone 3: Single primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onStartBooking}
            className="inline-flex items-center gap-2.5 bg-white hover:bg-[#111111] text-[#111111] hover:text-white text-xs font-semibold uppercase tracking-wider pl-4 pr-1.5 py-1.5 rounded-full shadow-sm transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
          >
            <span>Book Now</span>
            <span className="w-7 h-7 rounded-full bg-[#F95B2B] text-white flex items-center justify-center">
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-[#111111] hover:bg-black/5 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile collapsible navigation drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden bg-white border-t border-neutral-200 px-6 py-4 flex flex-col gap-3 text-sm font-medium text-[#111111]"
        >
          <a
            href="#benefits"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 border-b border-neutral-100"
          >
            Why Vromon
          </a>
          <a
            href="#fleet"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 border-b border-neutral-100"
          >
            Explore Fleet
          </a>
          <a
            href="#experience"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 border-b border-neutral-100"
          >
            Experience
          </a>
          <a
            href="#reviews"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 border-b border-neutral-100"
          >
            Reviews
          </a>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenBookings();
            }}
            className="py-2 text-left font-semibold text-[#F95B2B] tabular-nums cursor-pointer"
          >
            My Bookings ({activeBookingsCount})
          </button>
        </nav>
      )}
    </header>
  );
}
