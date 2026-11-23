import { BRANCH_LOCATIONS } from '../data/fleetData';
import { WhatsAppIcon } from './WhatsAppButton';

interface FooterProps {
  onOpenBookings: () => void;
  onStartBooking: () => void;
}

export function Footer({ onOpenBookings, onStartBooking }: FooterProps) {
  return (
    <footer className="bg-[#111111] text-white py-14 border-t border-neutral-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          <div className="md:col-span-4">
            <span className="font-display text-2xl font-extrabold tracking-tight text-white">
              VROMON
            </span>
            <p className="mt-3 text-sm text-neutral-400 leading-relaxed max-w-xs">
              Curated SUVs, executive sedans, and electric grand tourers with
              transparent pricing and 24/7 roadside assistance.
            </p>
            <p className="mt-4 text-xs text-[#F95B2B] font-medium">
              Use promo code VROMON10 for 10% off base rates.
            </p>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Navigation
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-neutral-300">
              <li>
                <a href="#benefits" className="hover:text-white transition-colors">
                  Why Vromon
                </a>
              </li>
              <li>
                <a href="#fleet" className="hover:text-white transition-colors">
                  Explore Fleet
                </a>
              </li>
              <li>
                <a href="#experience" className="hover:text-white transition-colors">
                  Digital Experience
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-white transition-colors">
                  Customer Reviews
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenBookings}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  My Bookings
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Rental Hubs
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-neutral-300">
              {BRANCH_LOCATIONS.map((branch) => (
                <li key={branch.id} className="truncate">
                  {branch.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 flex flex-col justify-between items-start md:items-end">
            <button
              type="button"
              onClick={onStartBooking}
              className="px-5 py-2.5 rounded-full bg-[#F95B2B] hover:bg-[#E24A1D] text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Reserve a Car
            </button>
            <div className="mt-6 md:mt-0 text-left md:text-right text-xs text-neutral-400">
              <p>24/7 Dispatch Desk</p>
              <p className="text-white font-medium mt-0.5 tabular-nums">+880 1700 876666</p>
              <p className="mt-0.5">concierge@vromonrentals.com</p>
              <a
                href="https://wa.me/8801700876666?text=Hi%20Vromon%20Car%20Rental%2C%20I%20would%20like%20to%20inquire%20about%20booking%20a%20vehicle."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2.5 inline-flex items-center gap-1.5 text-[#25D366] hover:text-white font-semibold transition-colors whitespace-nowrap"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>WhatsApp Support</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>&copy; 2026 Vromon Car Rental. All rights reserved.</p>
          <p>Transparent Pricing · Free 12h Cancellation · 24/7 Roadside Support</p>
        </div>
      </div>
    </footer>
  );
}
