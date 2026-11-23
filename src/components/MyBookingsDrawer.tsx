import { Calendar, Car, CheckCircle2, MapPin, X, XCircle } from 'lucide-react';
import { useState } from 'react';
import { BRANCH_LOCATIONS } from '../data/fleetData';
import { Reservation } from '../types/rental';
import { formatINR } from '../utils/bookingMath';

interface MyBookingsDrawerProps {
  isOpen: boolean;
  reservations: Reservation[];
  onClose: () => void;
  onCancelReservation: (id: string) => void;
  onBrowseFleet: () => void;
}

export function MyBookingsDrawer({
  isOpen,
  reservations,
  onClose,
  onCancelReservation,
  onBrowseFleet,
}: MyBookingsDrawerProps) {
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  if (!isOpen) return null;

  const branchName = (id: string) =>
    BRANCH_LOCATIONS.find((b) => b.id === id)?.name ?? id;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="my-bookings-title"
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs"
    >
      <div className="bg-white w-full max-w-lg h-full shadow-2xl border-l border-neutral-200 flex flex-col">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-[#FAFAFA]">
          <div>
            <h2
              id="my-bookings-title"
              className="font-display text-lg font-bold text-[#111111]"
            >
              My Bookings
            </h2>
            <p className="text-xs text-neutral-500 tabular-nums">
              {reservations.filter((r) => r.status === 'Confirmed').length} active{' '}
              {reservations.filter((r) => r.status === 'Confirmed').length === 1
                ? 'reservation'
                : 'reservations'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close My Bookings"
            className="w-9 h-9 rounded-full bg-white border border-neutral-200 hover:bg-neutral-100 flex items-center justify-center text-[#111111] cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {reservations.length === 0 ? (
            <div className="py-16 text-center">
              <Car className="w-10 h-10 text-neutral-300 mx-auto mb-3" aria-hidden="true" />
              <h3 className="font-display text-base font-bold text-[#111111]">
                No reservations yet
              </h3>
              <p className="mt-1 text-sm text-neutral-500 max-w-xs mx-auto">
                Explore the Vromon fleet to lock in transparent daily rates and 4th-day-free weekend trips.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBrowseFleet();
                }}
                className="mt-5 px-5 py-2.5 rounded-full bg-[#F95B2B] text-white text-xs font-semibold cursor-pointer"
              >
                Browse Fleet
              </button>
            </div>
          ) : (
            reservations.map((res) => {
              const isConfirmed = res.status === 'Confirmed';
              const isPromptingCancel = confirmCancelId === res.id;

              return (
                <article
                  key={res.id}
                  data-testid={`booking-card-${res.code}`}
                  className="rounded-2xl border border-neutral-200 p-4 bg-white space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={res.vehicleImage}
                        alt={res.vehicleName}
                        referrerPolicy="no-referrer"
                        className="w-16 h-12 rounded-lg object-cover bg-neutral-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-mono text-xs font-semibold text-[#F95B2B]">
                          {res.code}
                        </p>
                        <h3 className="font-display font-bold text-sm text-[#111111] truncate">
                          {res.vehicleName}
                        </h3>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold shrink-0 ${
                        isConfirmed ? 'text-emerald-700' : 'text-neutral-500'
                      }`}
                    >
                      {isConfirmed ? (
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      )}
                      <span>{res.status}</span>
                    </span>
                  </div>

                  <div className="text-xs text-neutral-600 space-y-1 pt-2 border-t border-neutral-100">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" aria-hidden="true" />
                      <span className="truncate">
                        {branchName(res.pickupBranchId)} → {branchName(res.dropoffBranchId)}
                      </span>
                    </p>
                    <p className="flex items-center gap-1.5 tabular-nums">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" aria-hidden="true" />
                      <span>
                        {res.pickupDate} ({res.pickupTime}) to {res.dropoffDate} ({res.dropoffTime})
                      </span>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] text-neutral-500">
                        Driver: {res.driver.fullName}
                      </span>
                      <p className="font-display font-bold text-base text-[#111111] tabular-nums">
                        {formatINR(res.pricing.totalAmount)}
                      </p>
                    </div>

                    {isConfirmed && !isPromptingCancel && (
                      <button
                        type="button"
                        onClick={() => setConfirmCancelId(res.id)}
                        className="px-3 py-1.5 rounded-lg border border-neutral-200 hover:border-red-300 hover:text-red-600 text-xs font-semibold text-neutral-600 transition-colors cursor-pointer"
                      >
                        Cancel Trip
                      </button>
                    )}
                  </div>

                  {isConfirmed && isPromptingCancel && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between gap-3">
                      <span className="text-xs font-medium text-red-800">
                        Cancel {res.code}? Free cancellation applies.
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setConfirmCancelId(null)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 text-xs font-medium text-neutral-700 cursor-pointer"
                        >
                          Keep
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onCancelReservation(res.id);
                            setConfirmCancelId(null);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-semibold text-white cursor-pointer"
                        >
                          Confirm Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
