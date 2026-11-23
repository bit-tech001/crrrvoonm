import { ArrowRight, Calendar, Car, MapPin } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { BRANCH_LOCATIONS } from '../data/fleetData';
import { BookingSearchState } from '../types/rental';
import {
  calculateRentalDays,
  formatINR,
  ONE_WAY_FLAT_FEE,
  validateBookingDates,
} from '../utils/bookingMath';

interface HeroSectionProps {
  search: BookingSearchState;
  onUpdateSearch: (patch: Partial<BookingSearchState>) => void;
  onSearchSubmit: () => void;
}

export function HeroSection({
  search,
  onUpdateSearch,
  onSearchSubmit,
}: HeroSectionProps) {
  const [dateError, setDateError] = useState<string | null>(null);
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  const rentalDays = calculateRentalDays(
    search.pickupDate,
    search.pickupTime,
    search.dropoffDate,
    search.dropoffTime
  );
  const freeDays = Math.floor(rentalDays / 4);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validation = validateBookingDates(
      search.pickupDate,
      search.pickupTime,
      search.dropoffDate,
      search.dropoffTime
    );
    if (!validation.valid) {
      setDateError(validation.error ?? 'Please check your trip dates.');
      return;
    }
    setDateError(null);
    onSearchSubmit();
  };

  return (
    <section id="top" className="vromon-hero-wash pt-10 pb-14 md:pt-14 md:pb-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Centered Reference Hero Copy */}
        <div className="max-w-3xl mx-auto text-center">
          <h1
            className="font-display font-bold tracking-tight text-[#111111] leading-[1.08]"
            style={{
              fontSize: 'clamp(2.25rem, 4.4vw, 3.75rem)',
              textWrap: 'balance',
            }}
          >
            Experience the smooth drives of{' '}
            <span className="text-[#F95B2B]">premium rentals</span>
          </h1>
        </div>

        {/* Centered Studio Hero Vehicle */}
        <div className="max-w-3xl mx-auto mt-6 md:mt-8 relative">
          {heroImgFailed ? (
            <div className="w-full aspect-[16/9] rounded-2xl bg-gradient-to-br from-[#FBE0BD] to-[#FFF4E6] border border-black/5 flex flex-col items-center justify-center text-[#111111]">
              <Car className="w-16 h-16 text-[#F95B2B] mb-2" aria-hidden="true" />
              <p className="font-display font-semibold text-lg">Vromon Flagship SUV</p>
            </div>
          ) : (
            <div className="relative flex justify-center">
              <img
                src="/src/assets/images/regenerated_image_1795460862011.png"
                alt="Pearl-white Vromon flagship luxury SUV in studio lighting"
                referrerPolicy="no-referrer"
                onError={() => setHeroImgFailed(true)}
                className="w-full max-w-2xl max-h-[360px] object-contain object-center"
              />
            </div>
          )}

          {/* Primary CTA directly below Hero SUV */}
          <div className="mt-4 flex flex-col items-center gap-3">
            <a
              href="#fleet"
              className="inline-flex items-center gap-3 bg-[#F95B2B] hover:bg-[#E24A1D] text-white font-semibold text-xs uppercase tracking-wider pl-6 pr-2 py-2 rounded-full shadow-md shadow-[#F95B2B]/25 transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
            >
              <span>See All Fleet</span>
              <span className="w-7 h-7 rounded-full bg-white text-[#F95B2B] flex items-center justify-center">
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
            </a>

            <p className="text-sm text-[#111111]/85 text-center">
              <span className="font-semibold text-[#111111]">Weekend Getaway:</span>{' '}
              Rent for 3 days and get the 4th day free!
            </p>
          </div>
        </div>

        {/* Full-width Quick Booking Bar anchored under Hero */}
        <form
          onSubmit={handleSubmit}
          aria-label="Quick trip search and availability"
          className="mt-10 max-w-5xl mx-auto bg-white border border-neutral-200/90 rounded-2xl shadow-lg shadow-neutral-900/5 p-5 md:p-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.45fr_1.45fr_auto] gap-3.5 items-end">
            {/* Pick-up Location */}
            <div className="flex flex-col gap-1.5 min-w-0">
              <label
                htmlFor="hero-pickup-branch"
                className="text-xs font-semibold text-neutral-600 flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5 text-[#F95B2B]" aria-hidden="true" />
                <span>Pick-up Hub</span>
              </label>
              <select
                id="hero-pickup-branch"
                value={search.pickupBranchId}
                onChange={(e) => {
                  const nextId = e.target.value;
                  onUpdateSearch({
                    pickupBranchId: nextId,
                    dropoffBranchId: search.sameDropoff ? nextId : search.dropoffBranchId,
                  });
                }}
                className="w-full h-11 px-3 rounded-xl border border-neutral-200 bg-neutral-50/70 text-sm font-medium text-[#111111] focus:outline-none focus:border-[#F95B2B] focus:bg-white transition-colors"
              >
                {BRANCH_LOCATIONS.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Pick-up Date & Time */}
            <div className="flex flex-col gap-1.5 min-w-0">
              <label
                htmlFor="hero-pickup-date"
                className="text-xs font-semibold text-neutral-600 flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-[#F95B2B]" aria-hidden="true" />
                <span>Pick-up Date &amp; Time</span>
              </label>
              <div className="flex gap-1.5">
                <input
                  id="hero-pickup-date"
                  type="date"
                  value={search.pickupDate}
                  onChange={(e) => {
                    setDateError(null);
                    onUpdateSearch({ pickupDate: e.target.value });
                  }}
                  className="flex-1 min-w-0 h-11 px-2.5 rounded-xl border border-neutral-200 bg-neutral-50/70 text-xs font-medium text-[#111111] tabular-nums focus:outline-none focus:border-[#F95B2B] focus:bg-white"
                />
                <input
                  id="hero-pickup-time"
                  aria-label="Pick-up time"
                  type="time"
                  value={search.pickupTime}
                  onChange={(e) => {
                    setDateError(null);
                    onUpdateSearch({ pickupTime: e.target.value });
                  }}
                  className="w-[116px] shrink-0 h-11 px-2.5 rounded-xl border border-neutral-200 bg-neutral-50/70 text-xs font-medium text-[#111111] tabular-nums focus:outline-none focus:border-[#F95B2B] focus:bg-white"
                />
              </div>
            </div>

            {/* Return Date & Time */}
            <div className="flex flex-col gap-1.5 min-w-0">
              <label
                htmlFor="hero-dropoff-date"
                className="text-xs font-semibold text-neutral-600 flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-neutral-400" aria-hidden="true" />
                <span>Return Date &amp; Time</span>
              </label>
              <div className="flex gap-1.5">
                <input
                  id="hero-dropoff-date"
                  type="date"
                  value={search.dropoffDate}
                  onChange={(e) => {
                    setDateError(null);
                    onUpdateSearch({ dropoffDate: e.target.value });
                  }}
                  className="flex-1 min-w-0 h-11 px-2.5 rounded-xl border border-neutral-200 bg-neutral-50/70 text-xs font-medium text-[#111111] tabular-nums focus:outline-none focus:border-[#F95B2B] focus:bg-white"
                />
                <input
                  id="hero-dropoff-time"
                  aria-label="Return time"
                  type="time"
                  value={search.dropoffTime}
                  onChange={(e) => {
                    setDateError(null);
                    onUpdateSearch({ dropoffTime: e.target.value });
                  }}
                  className="w-[116px] shrink-0 h-11 px-2.5 rounded-xl border border-neutral-200 bg-neutral-50/70 text-xs font-medium text-[#111111] tabular-nums focus:outline-none focus:border-[#F95B2B] focus:bg-white"
                />
              </div>
            </div>

            {/* Submit Search */}
            <div>
              <button
                type="submit"
                className="w-full lg:w-auto h-11 px-6 rounded-xl bg-[#111111] hover:bg-[#F95B2B] text-white text-sm font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F95B2B]"
              >
                Search Fleet
              </button>
            </div>
          </div>

          {/* Secondary Bar Row: One-way option + live rental duration preview */}
          <div className="mt-4 pt-3.5 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <label className="inline-flex items-center gap-2 text-neutral-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={!search.sameDropoff}
                  onChange={(e) => {
                    const isDifferent = e.target.checked;
                    onUpdateSearch({
                      sameDropoff: !isDifferent,
                      dropoffBranchId: isDifferent
                        ? BRANCH_LOCATIONS.find((b) => b.id !== search.pickupBranchId)?.id ??
                          search.pickupBranchId
                        : search.pickupBranchId,
                    });
                  }}
                  className="w-4 h-4 rounded border-neutral-300 accent-[#F95B2B]"
                />
                <span>Return to a different hub (+{formatINR(ONE_WAY_FLAT_FEE)} one-way)</span>
              </label>

              {!search.sameDropoff && (
                <div className="flex items-center gap-2">
                  <label htmlFor="hero-dropoff-branch" className="text-neutral-500 font-medium">
                    Drop-off:
                  </label>
                  <select
                    id="hero-dropoff-branch"
                    value={search.dropoffBranchId}
                    onChange={(e) => onUpdateSearch({ dropoffBranchId: e.target.value })}
                    className="h-8 px-2.5 rounded-lg border border-neutral-200 bg-neutral-50 text-xs font-medium text-[#111111] focus:outline-none focus:border-[#F95B2B]"
                  >
                    {BRANCH_LOCATIONS.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-neutral-600 tabular-nums">
              <span className="font-semibold text-[#111111]">
                {rentalDays} {rentalDays === 1 ? 'Day' : 'Days'} selected
              </span>
              {freeDays > 0 ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-emerald-700">
                    Weekend Getaway: {freeDays} Free {freeDays === 1 ? 'Day' : 'Days'} Applied
                  </span>
                </>
              ) : rentalDays === 3 ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#F95B2B] font-medium">
                    Add 1 more day to get the 4th day free
                  </span>
                </>
              ) : null}
            </div>
          </div>

          {dateError && (
            <p
              role="alert"
              className="mt-3 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
            >
              {dateError}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
