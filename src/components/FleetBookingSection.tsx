import { ArrowRight, Car, Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { BRANCH_LOCATIONS, FLEET_VEHICLES } from '../data/fleetData';
import { BookingSearchState, Vehicle, VehicleCategory } from '../types/rental';
import {
  calculatePriceBreakdown,
  calculateRentalDays,
  filterAndSortVehicles,
  formatINR,
} from '../utils/bookingMath';

interface FleetBookingSectionProps {
  search: BookingSearchState;
  onUpdateSearch: (patch: Partial<BookingSearchState>) => void;
  onSelectVehicleForBooking: (vehicle: Vehicle) => void;
}

const CATEGORIES: Array<'All' | VehicleCategory> = [
  'All',
  'SUV & Crossover',
  'Executive Sedan',
  'Sports Coupe',
  'Electric & Hybrid',
];

export function FleetBookingSection({
  search,
  onUpdateSearch,
  onSelectVehicleForBooking,
}: FleetBookingSectionProps) {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [expandedSpecId, setExpandedSpecId] = useState<string | null>(null);

  const rentalDays = calculateRentalDays(
    search.pickupDate,
    search.pickupTime,
    search.dropoffDate,
    search.dropoffTime
  );

  const filteredVehicles = filterAndSortVehicles(FLEET_VEHICLES, search);
  const pickupBranch = BRANCH_LOCATIONS.find((b) => b.id === search.pickupBranchId);

  const resetFilters = () => {
    onUpdateSearch({
      categoryFilter: 'All',
      searchQuery: '',
      sortBy: 'recommended',
    });
  };

  return (
    <section id="fleet" className="py-16 md:py-24 bg-[#FAFAFA] border-y border-neutral-200/70">
      <div className="max-w-6xl mx-auto px-6">
        {/* Centered Header */}
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="font-display font-bold text-[#111111] tracking-tight"
            style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              textWrap: 'balance',
            }}
          >
            Explore Vromon fleet
          </h2>
          <p className="mt-3 text-sm md:text-base text-neutral-600">
            Showing available vehicles at{' '}
            <span className="font-semibold text-[#111111]">
              {pickupBranch?.name ?? 'Dhaka Airport'}
            </span>{' '}
            for{' '}
            <span className="font-semibold text-[#111111] tabular-nums">
              {rentalDays} {rentalDays === 1 ? 'day' : 'days'}
            </span>
            .
          </p>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="mt-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Category Segmented Tabs */}
          <div
            role="tablist"
            aria-label="Filter fleet by vehicle category"
            className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-neutral-200 rounded-xl"
          >
            {CATEGORIES.map((category) => {
              const isActive = search.categoryFilter === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onUpdateSearch({ categoryFilter: category })}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#F95B2B] ${
                    isActive
                      ? 'bg-[#111111] text-white'
                      : 'text-neutral-600 hover:text-[#111111] hover:bg-neutral-50'
                  }`}
                >
                  {category === 'All' ? 'All Vehicles' : category}
                </button>
              );
            })}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search
                className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                aria-label="Search fleet by model or fuel"
                placeholder="Search model or fuel..."
                value={search.searchQuery}
                onChange={(e) => onUpdateSearch({ searchQuery: e.target.value })}
                className="w-full sm:w-52 h-10 pl-9 pr-3 rounded-xl border border-neutral-200 bg-white text-sm text-[#111111] placeholder:text-neutral-400 focus:outline-none focus:border-[#F95B2B]"
              />
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-neutral-400 shrink-0" aria-hidden="true" />
              <select
                aria-label="Sort vehicles"
                value={search.sortBy}
                onChange={(e) =>
                  onUpdateSearch({
                    sortBy: e.target.value as BookingSearchState['sortBy'],
                  })
                }
                className="h-10 px-3 rounded-xl border border-neutral-200 bg-white text-xs font-semibold text-[#111111] focus:outline-none focus:border-[#F95B2B]"
              >
                <option value="recommended">Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="seats-desc">Most Seats</option>
              </select>
            </div>
          </div>
        </div>

        {/* Fleet Grid */}
        {filteredVehicles.length === 0 ? (
          <div className="mt-12 bg-white border border-neutral-200 rounded-2xl p-10 text-center max-w-lg mx-auto">
            <Car className="w-10 h-10 text-neutral-300 mx-auto mb-3" aria-hidden="true" />
            <h3 className="font-display text-lg font-bold text-[#111111]">
              No vehicles match your filter
            </h3>
            <p className="mt-1.5 text-sm text-neutral-500">
              Try clearing your search term or switching to another vehicle category at this hub.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 px-5 py-2.5 rounded-xl bg-[#111111] hover:bg-[#F95B2B] text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            data-testid="fleet-grid"
            className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredVehicles.map((vehicle) => {
              const tripEstimate = calculatePriceBreakdown({
                dailyRate: vehicle.dailyRate,
                rentalDays,
                protectionDailyRate: 0,
                selectedAddons: [],
                promoCode: '',
                isOneWay: !search.sameDropoff && search.pickupBranchId !== search.dropoffBranchId,
              });
              const isSpecOpen = expandedSpecId === vehicle.id;

              return (
                <article
                  key={vehicle.id}
                  className="bg-white border border-neutral-200/90 rounded-2xl overflow-hidden flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-md hover:shadow-neutral-900/5"
                >
                  <div>
                    {/* Studio Image */}
                    <div className="bg-[#F8F9FA] aspect-[4/3] overflow-hidden relative">
                      {failedImages[vehicle.id] ? (
                        <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400">
                          <Car className="w-10 h-10 text-[#F95B2B] mb-1" aria-hidden="true" />
                          <span className="text-xs font-medium">{vehicle.name}</span>
                        </div>
                      ) : (
                        <img
                          src={vehicle.image}
                          alt={`${vehicle.year} ${vehicle.name}`}
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setFailedImages((prev) => ({ ...prev, [vehicle.id]: true }))
                          }
                          className="w-full h-full object-cover object-center"
                        />
                      )}
                    </div>

                    {/* Card Details */}
                    <div className="p-6">
                      {/* Zero-pill unboxed metadata with middle-dot separators */}
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-500">
                        <span className="font-medium text-[#F95B2B]">{vehicle.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{vehicle.transmission}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{vehicle.seats} Seats</span>
                        <span aria-hidden="true">·</span>
                        <span>{vehicle.fuelType}</span>
                      </div>

                      <h3 className="mt-2 font-display text-lg font-bold text-[#111111]">
                        {vehicle.name}
                      </h3>
                      <p className="mt-1.5 text-sm text-neutral-600 line-clamp-2 leading-relaxed">
                        {vehicle.description}
                      </p>

                      {/* Expandable Specs Disclosure */}
                      <button
                        type="button"
                        aria-expanded={isSpecOpen}
                        onClick={() =>
                          setExpandedSpecId(isSpecOpen ? null : vehicle.id)
                        }
                        className="mt-3 text-xs font-semibold text-neutral-500 hover:text-[#111111] underline underline-offset-4 cursor-pointer"
                      >
                        {isSpecOpen ? 'Hide technical specs' : 'View technical specs'}
                      </button>

                      {isSpecOpen && (
                        <dl className="mt-3 pt-3 border-t border-neutral-100 grid grid-cols-1 gap-1.5 text-xs">
                          <div className="flex justify-between gap-2">
                            <dt className="text-neutral-500">Powertrain</dt>
                            <dd className="font-medium text-[#111111]">{vehicle.specs.power}</dd>
                          </div>
                          <div className="flex justify-between gap-2">
                            <dt className="text-neutral-500">Drivetrain</dt>
                            <dd className="font-medium text-[#111111]">{vehicle.specs.drivetrain}</dd>
                          </div>
                          <div className="flex justify-between gap-2">
                            <dt className="text-neutral-500">Mileage</dt>
                            <dd className="font-medium text-[#111111]">{vehicle.specs.mileagePolicy}</dd>
                          </div>
                          <div className="flex justify-between gap-2">
                            <dt className="text-neutral-500">Luggage</dt>
                            <dd className="font-medium text-[#111111] tabular-nums">
                              {vehicle.luggage} suitcases
                            </dd>
                          </div>
                        </dl>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: Price + Reserve Action */}
                  <div className="px-6 pb-6 pt-4 border-t border-neutral-100 flex items-end justify-between gap-3">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="font-display text-2xl font-bold text-[#111111] tabular-nums">
                          {formatINR(vehicle.dailyRate)}
                        </span>
                        <span className="text-xs text-neutral-500">/ day</span>
                      </div>
                      <p className="mt-0.5 text-xs text-neutral-500 tabular-nums">
                        Est. {formatINR(tripEstimate.baseSubtotal)} base for {rentalDays}{' '}
                        {rentalDays === 1 ? 'day' : 'days'}
                        {tripEstimate.freeDaysApplied > 0 && (
                          <span className="text-emerald-700 font-semibold">
                            {' '}
                            ({tripEstimate.freeDaysApplied} free)
                          </span>
                        )}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectVehicleForBooking(vehicle)}
                      aria-label={`Reserve ${vehicle.name}`}
                      className="inline-flex items-center gap-2 bg-[#F95B2B] hover:bg-[#E24A1D] text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
                    >
                      <span>Reserve Now</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
