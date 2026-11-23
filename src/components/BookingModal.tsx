import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Car,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  Printer,
  ShieldCheck,
  Tag,
  X,
} from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import {
  BRANCH_LOCATIONS,
  EXTRA_ADDONS,
  FLEET_VEHICLES,
  PROTECTION_PLANS,
} from '../data/fleetData';
import {
  BookingSearchState,
  DriverDetails,
  PaymentMethod,
  Reservation,
  Vehicle,
} from '../types/rental';
import {
  calculatePriceBreakdown,
  calculateRentalDays,
  DriverValidationErrors,
  formatINR,
  generateBookingCode,
  isPromoValid,
  validateBookingDates,
  validateDriverDetails,
} from '../utils/bookingMath';

interface BookingModalProps {
  isOpen: boolean;
  initialVehicle: Vehicle;
  search: BookingSearchState;
  onClose: () => void;
  onConfirmReservation: (reservation: Reservation) => void;
  onOpenMyBookings: () => void;
}

export function BookingModal({
  isOpen,
  initialVehicle,
  search,
  onClose,
  onConfirmReservation,
  onOpenMyBookings,
}: BookingModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedVehicleId, setSelectedVehicleId] = useState(initialVehicle.id);
  const [pickupBranchId, setPickupBranchId] = useState(search.pickupBranchId);
  const [dropoffBranchId, setDropoffBranchId] = useState(
    search.sameDropoff ? search.pickupBranchId : search.dropoffBranchId
  );
  const [pickupDate, setPickupDate] = useState(search.pickupDate);
  const [pickupTime, setPickupTime] = useState(search.pickupTime);
  const [dropoffDate, setDropoffDate] = useState(search.dropoffDate);
  const [dropoffTime, setDropoffTime] = useState(search.dropoffTime);
  const [protectionId, setProtectionId] = useState('shield');
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);

  const [driver, setDriver] = useState<DriverDetails>({
    fullName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    flightNumber: '',
    paymentMethod: 'card',
  });
  const [driverErrors, setDriverErrors] = useState<DriverValidationErrors>({});
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(
    null
  );
  const [copiedCode, setCopiedCode] = useState(false);

  // Sync modal state whenever opened for a vehicle
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedVehicleId(initialVehicle.id);
      setPickupBranchId(search.pickupBranchId);
      setDropoffBranchId(
        search.sameDropoff ? search.pickupBranchId : search.dropoffBranchId
      );
      setPickupDate(search.pickupDate);
      setPickupTime(search.pickupTime);
      setDropoffDate(search.dropoffDate);
      setDropoffTime(search.dropoffTime);
      setProtectionId('shield');
      setAddonIds([]);
      setPromoInput('');
      setAppliedPromo('');
      setPromoFeedback(null);
      setDateError(null);
      setDriverErrors({});
      setConfirmedReservation(null);
      setCopiedCode(false);
    }
  }, [isOpen, initialVehicle.id, search]);

  if (!isOpen) return null;

  const selectedVehicle =
    FLEET_VEHICLES.find((v) => v.id === selectedVehicleId) ?? initialVehicle;
  const selectedProtection =
    PROTECTION_PLANS.find((p) => p.id === protectionId) ?? PROTECTION_PLANS[0];
  const selectedAddons = EXTRA_ADDONS.filter((a) => addonIds.includes(a.id));

  const rentalDays = calculateRentalDays(
    pickupDate,
    pickupTime,
    dropoffDate,
    dropoffTime
  );
  const isOneWay = pickupBranchId !== dropoffBranchId;

  const pricing = calculatePriceBreakdown({
    dailyRate: selectedVehicle.dailyRate,
    rentalDays,
    protectionDailyRate: selectedProtection.dailyPrice,
    selectedAddons,
    promoCode: appliedPromo,
    isOneWay,
  });

  const pickupBranch = BRANCH_LOCATIONS.find((b) => b.id === pickupBranchId);
  const dropoffBranch = BRANCH_LOCATIONS.find((b) => b.id === dropoffBranchId);

  const toggleAddon = (id: string) => {
    setAddonIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleApplyPromo = () => {
    const trimmed = promoInput.trim().toUpperCase();
    if (!trimmed) {
      setAppliedPromo('');
      setPromoFeedback({ type: 'error', message: 'Enter a promo code first.' });
      return;
    }
    if (isPromoValid(trimmed)) {
      setAppliedPromo(trimmed);
      setPromoFeedback({
        type: 'success',
        message: `Code ${trimmed} applied to base rental rate.`,
      });
    } else {
      setAppliedPromo('');
      setPromoFeedback({
        type: 'error',
        message: 'Code not recognized. Try VROMON10 or WEEKEND15.',
      });
    }
  };

  const handleContinueToDriver = () => {
    const check = validateBookingDates(
      pickupDate,
      pickupTime,
      dropoffDate,
      dropoffTime
    );
    if (!check.valid) {
      setDateError(check.error ?? 'Invalid rental dates.');
      return;
    }
    setDateError(null);
    setStep(2);
  };

  const handleConfirmSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validation = validateDriverDetails(driver);
    if (!validation.valid) {
      setDriverErrors(validation.errors);
      return;
    }
    setDriverErrors({});

    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      code: generateBookingCode(),
      vehicleId: selectedVehicle.id,
      vehicleName: selectedVehicle.name,
      vehicleCategory: selectedVehicle.category,
      vehicleImage: selectedVehicle.image,
      pickupBranchId,
      dropoffBranchId,
      pickupDate,
      pickupTime,
      dropoffDate,
      dropoffTime,
      protectionId: selectedProtection.id,
      addonIds,
      promoCode: appliedPromo,
      driver: {
        ...driver,
        fullName: driver.fullName.trim(),
        email: driver.email.trim(),
        phone: driver.phone.trim(),
        licenseNumber: driver.licenseNumber.trim(),
        flightNumber: driver.flightNumber.trim(),
      },
      pricing,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };

    onConfirmReservation(newReservation);
    setConfirmedReservation(newReservation);
    setStep(3);
  };

  const handleCopyCode = async () => {
    if (!confirmedReservation) return;
    try {
      await navigator.clipboard.writeText(confirmedReservation.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      setCopiedCode(true);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 md:p-6 overflow-y-auto"
    >
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between gap-4 bg-[#FAFAFA] shrink-0">
          <div>
            <h2
              id="booking-modal-title"
              className="font-display text-lg md:text-xl font-bold text-[#111111]"
            >
              Vromon Instant Booking
            </h2>
            <p className="text-xs text-neutral-500">
              {step === 1 && '01. Trip Dates, Protection & Extras'}
              {step === 2 && '02. Driver Details & Payment Method'}
              {step === 3 && '03. Confirmed Vehicle Pass'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close booking dialog"
            className="w-9 h-9 rounded-full bg-white border border-neutral-200 hover:bg-neutral-100 flex items-center justify-center text-[#111111] cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6">
          {step === 3 && confirmedReservation ? (
            /* Step 3: Confirmed Booking Pass */
            <div className="max-w-2xl mx-auto py-4">
              <div className="flex items-center gap-3 text-emerald-700">
                <CheckCircle2 className="w-7 h-7 shrink-0" aria-hidden="true" />
                <div>
                  <h3 className="font-display text-2xl font-bold text-[#111111]">
                    Reservation Confirmed
                  </h3>
                  <p className="text-sm text-neutral-600">
                    Your vehicle pass has been saved to My Bookings and sent to{' '}
                    <span className="font-medium text-[#111111]">
                      {confirmedReservation.driver.email}
                    </span>
                    .
                  </p>
                </div>
              </div>

              {/* Boarding Pass Card */}
              <div className="mt-6 rounded-2xl border border-neutral-200 overflow-hidden bg-[#FAFAFA]">
                <div className="bg-[#111111] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-neutral-400">
                      Booking Confirmation Code
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        data-testid="confirmed-booking-code"
                        className="font-mono text-2xl font-bold tracking-wider text-[#F95B2B]"
                      >
                        {confirmedReservation.code}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" aria-hidden="true" />
                        <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[11px] uppercase tracking-wider text-neutral-400">
                      Total Amount
                    </span>
                    <p className="font-display text-2xl font-bold tabular-nums">
                      {formatINR(confirmedReservation.pricing.totalAmount)}
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-white grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      Vehicle
                    </p>
                    <p className="mt-1 font-display font-bold text-base text-[#111111]">
                      {confirmedReservation.vehicleName}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {confirmedReservation.vehicleCategory} ·{' '}
                      {confirmedReservation.pricing.rentalDays} Days
                      {confirmedReservation.pricing.freeDaysApplied > 0 &&
                        ` (${confirmedReservation.pricing.freeDaysApplied} Free Day Applied)`}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      Primary Driver
                    </p>
                    <p className="mt-1 font-semibold text-[#111111]">
                      {confirmedReservation.driver.fullName}
                    </p>
                    <p className="text-xs text-neutral-500">
                      License: {confirmedReservation.driver.licenseNumber}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      Pick-up
                    </p>
                    <p className="mt-1 font-medium text-[#111111]">
                      {pickupBranch?.name}
                    </p>
                    <p className="text-xs text-neutral-500 tabular-nums">
                      {confirmedReservation.pickupDate} at {confirmedReservation.pickupTime}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      Return
                    </p>
                    <p className="mt-1 font-medium text-[#111111]">
                      {dropoffBranch?.name}
                    </p>
                    <p className="text-xs text-neutral-500 tabular-nums">
                      {confirmedReservation.dropoffDate} at {confirmedReservation.dropoffTime}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-[#111111] cursor-pointer"
                >
                  <Printer className="w-4 h-4" aria-hidden="true" />
                  <span>Print Vehicle Pass</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-[#111111] cursor-pointer"
                  >
                    Back to Fleet
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenMyBookings();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#F95B2B] hover:bg-[#E24A1D] text-white text-xs font-semibold cursor-pointer"
                  >
                    View in My Bookings
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Steps 1 & 2 Grid with Sticky Receipt */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Configurator Form */}
              <div className="lg:col-span-7 space-y-6">
                {step === 1 ? (
                  <>
                    {/* Vehicle Selector */}
                    <div>
                      <label
                        htmlFor="modal-vehicle-select"
                        className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2"
                      >
                        Selected Vehicle
                      </label>
                      <select
                        id="modal-vehicle-select"
                        value={selectedVehicle.id}
                        onChange={(e) => setSelectedVehicleId(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 bg-white text-sm font-semibold text-[#111111] focus:outline-none focus:border-[#F95B2B]"
                      >
                        {FLEET_VEHICLES.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.name} — {formatINR(v.dailyRate)}/day ({v.category})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Hubs & Dates */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="modal-pickup-branch"
                          className="block text-xs font-semibold text-neutral-600 mb-1.5"
                        >
                          Pick-up Hub
                        </label>
                        <select
                          id="modal-pickup-branch"
                          value={pickupBranchId}
                          onChange={(e) => setPickupBranchId(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl border border-neutral-200 bg-neutral-50 text-sm text-[#111111] focus:outline-none focus:border-[#F95B2B]"
                        >
                          {BRANCH_LOCATIONS.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="modal-dropoff-branch"
                          className="block text-xs font-semibold text-neutral-600 mb-1.5"
                        >
                          Return Hub
                        </label>
                        <select
                          id="modal-dropoff-branch"
                          value={dropoffBranchId}
                          onChange={(e) => setDropoffBranchId(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl border border-neutral-200 bg-neutral-50 text-sm text-[#111111] focus:outline-none focus:border-[#F95B2B]"
                        >
                          {BRANCH_LOCATIONS.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="modal-pickup-date"
                          className="block text-xs font-semibold text-neutral-600 mb-1.5"
                        >
                          Pick-up Date &amp; Time
                        </label>
                        <div className="grid grid-cols-5 gap-1.5">
                          <input
                            id="modal-pickup-date"
                            type="date"
                            value={pickupDate}
                            onChange={(e) => {
                              setDateError(null);
                              setPickupDate(e.target.value);
                            }}
                            className="col-span-3 h-10 px-2.5 rounded-xl border border-neutral-200 text-xs tabular-nums focus:outline-none focus:border-[#F95B2B]"
                          />
                          <input
                            type="time"
                            aria-label="Modal pick-up time"
                            value={pickupTime}
                            onChange={(e) => {
                              setDateError(null);
                              setPickupTime(e.target.value);
                            }}
                            className="col-span-2 h-10 px-2 rounded-xl border border-neutral-200 text-xs tabular-nums focus:outline-none focus:border-[#F95B2B]"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="modal-dropoff-date"
                          className="block text-xs font-semibold text-neutral-600 mb-1.5"
                        >
                          Return Date &amp; Time
                        </label>
                        <div className="grid grid-cols-5 gap-1.5">
                          <input
                            id="modal-dropoff-date"
                            type="date"
                            value={dropoffDate}
                            onChange={(e) => {
                              setDateError(null);
                              setDropoffDate(e.target.value);
                            }}
                            className="col-span-3 h-10 px-2.5 rounded-xl border border-neutral-200 text-xs tabular-nums focus:outline-none focus:border-[#F95B2B]"
                          />
                          <input
                            type="time"
                            aria-label="Modal return time"
                            value={dropoffTime}
                            onChange={(e) => {
                              setDateError(null);
                              setDropoffTime(e.target.value);
                            }}
                            className="col-span-2 h-10 px-2 rounded-xl border border-neutral-200 text-xs tabular-nums focus:outline-none focus:border-[#F95B2B]"
                          />
                        </div>
                      </div>
                    </div>

                    {dateError && (
                      <p
                        role="alert"
                        className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
                      >
                        {dateError}
                      </p>
                    )}

                    {/* Protection Plans */}
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2.5 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#F95B2B]" aria-hidden="true" />
                        <span>Protection Coverage</span>
                      </h3>
                      <div className="space-y-2.5">
                        {PROTECTION_PLANS.map((plan) => {
                          const isSelected = plan.id === protectionId;
                          return (
                            <label
                              key={plan.id}
                              className={`flex items-start justify-between gap-4 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                                isSelected
                                  ? 'border-[#F95B2B] bg-[#FFF8F4]'
                                  : 'border-neutral-200 hover:border-neutral-300'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <input
                                  type="radio"
                                  name="protection-plan"
                                  value={plan.id}
                                  checked={isSelected}
                                  onChange={() => setProtectionId(plan.id)}
                                  className="mt-1 accent-[#F95B2B]"
                                />
                                <div>
                                  <p className="text-sm font-semibold text-[#111111]">
                                    {plan.name}{' '}
                                    <span className="text-xs font-normal text-neutral-500">
                                      · {plan.deductible}
                                    </span>
                                  </p>
                                  <p className="text-xs text-neutral-600 mt-0.5">
                                    {plan.summary}
                                  </p>
                                </div>
                              </div>
                              <span className="text-sm font-bold text-[#111111] tabular-nums shrink-0">
                                {plan.dailyPrice === 0
                                  ? 'Included'
                                  : `+${formatINR(plan.dailyPrice)}/day`}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Optional Extras */}
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2.5">
                        Optional Trip Extras
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {EXTRA_ADDONS.map((addon) => {
                          const checked = addonIds.includes(addon.id);
                          return (
                            <label
                              key={addon.id}
                              className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${
                                checked
                                  ? 'border-[#111111] bg-neutral-50'
                                  : 'border-neutral-200 hover:border-neutral-300'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleAddon(addon.id)}
                                className="mt-0.5 accent-[#F95B2B]"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs font-semibold text-[#111111]">
                                    {addon.name}
                                  </span>
                                  <span className="text-xs font-bold text-[#111111] tabular-nums shrink-0">
                                    +{formatINR(addon.price)}
                                    {addon.pricingType === 'per_day' ? '/d' : ''}
                                  </span>
                                </div>
                                <p className="text-[11px] text-neutral-500 mt-0.5">
                                  {addon.description}
                                </p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Promo Code */}
                    <div>
                      <label
                        htmlFor="modal-promo-input"
                        className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2"
                      >
                        Promo Code (Optional)
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Tag
                            className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2"
                            aria-hidden="true"
                          />
                          <input
                            id="modal-promo-input"
                            type="text"
                            placeholder="Try VROMON10"
                            value={promoInput}
                            onChange={(e) => setPromoInput(e.target.value)}
                            className="w-full h-10 pl-9 pr-3 rounded-xl border border-neutral-200 text-sm uppercase focus:outline-none focus:border-[#F95B2B]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleApplyPromo}
                          className="h-10 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold text-[#111111] cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                      {promoFeedback && (
                        <p
                          className={`mt-1.5 text-xs font-medium ${
                            promoFeedback.type === 'success'
                              ? 'text-emerald-700'
                              : 'text-red-600'
                          }`}
                        >
                          {promoFeedback.message}
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  /* Step 2: Driver Details & Payment */
                  <form onSubmit={handleConfirmSubmit} noValidate className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="driver-full-name"
                          className="block text-xs font-semibold text-neutral-700 mb-1"
                        >
                          Full Name *
                        </label>
                        <input
                          id="driver-full-name"
                          type="text"
                          required
                          placeholder="e.g. Nadia Chowdhury"
                          value={driver.fullName}
                          onChange={(e) =>
                            setDriver((prev) => ({ ...prev, fullName: e.target.value }))
                          }
                          className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#F95B2B]"
                        />
                        {driverErrors.fullName && (
                          <p className="mt-1 text-xs text-red-600">
                            {driverErrors.fullName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="driver-email"
                          className="block text-xs font-semibold text-neutral-700 mb-1"
                        >
                          Email Address *
                        </label>
                        <input
                          id="driver-email"
                          type="email"
                          required
                          placeholder="you@company.com"
                          value={driver.email}
                          onChange={(e) =>
                            setDriver((prev) => ({ ...prev, email: e.target.value }))
                          }
                          className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#F95B2B]"
                        />
                        {driverErrors.email && (
                          <p className="mt-1 text-xs text-red-600">{driverErrors.email}</p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="driver-phone"
                          className="block text-xs font-semibold text-neutral-700 mb-1"
                        >
                          Phone Number *
                        </label>
                        <input
                          id="driver-phone"
                          type="tel"
                          required
                          placeholder="+880 1711 000000"
                          value={driver.phone}
                          onChange={(e) =>
                            setDriver((prev) => ({ ...prev, phone: e.target.value }))
                          }
                          className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#F95B2B]"
                        />
                        {driverErrors.phone && (
                          <p className="mt-1 text-xs text-red-600">{driverErrors.phone}</p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="driver-license"
                          className="block text-xs font-semibold text-neutral-700 mb-1"
                        >
                          Driver License Number *
                        </label>
                        <input
                          id="driver-license"
                          type="text"
                          required
                          placeholder="DL-DHK-123456"
                          value={driver.licenseNumber}
                          onChange={(e) =>
                            setDriver((prev) => ({
                              ...prev,
                              licenseNumber: e.target.value,
                            }))
                          }
                          className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#F95B2B]"
                        />
                        {driverErrors.licenseNumber && (
                          <p className="mt-1 text-xs text-red-600">
                            {driverErrors.licenseNumber}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="driver-flight"
                        className="block text-xs font-semibold text-neutral-700 mb-1"
                      >
                        Arrival Flight Number (Optional — for airport delay sync)
                      </label>
                      <input
                        id="driver-flight"
                        type="text"
                        placeholder="e.g. BG 204"
                        value={driver.flightNumber}
                        onChange={(e) =>
                          setDriver((prev) => ({ ...prev, flightNumber: e.target.value }))
                        }
                        className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#F95B2B]"
                      />
                    </div>

                    {/* Payment Method Selector */}
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-[#F95B2B]" aria-hidden="true" />
                        <span>Payment Preference</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {(
                          [
                            { id: 'card', label: 'Credit / Debit Card' },
                            { id: 'wallet', label: 'UPI / Mobile Wallet' },
                            { id: 'pickup', label: 'Pay at Pick-up Hub' },
                          ] as Array<{ id: PaymentMethod; label: string }>
                        ).map((pm) => (
                          <label
                            key={pm.id}
                            className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer text-xs font-semibold ${
                              driver.paymentMethod === pm.id
                                ? 'border-[#F95B2B] bg-[#FFF8F4] text-[#111111]'
                                : 'border-neutral-200 text-neutral-700'
                            }`}
                          >
                            <input
                              type="radio"
                              name="payment-method"
                              value={pm.id}
                              checked={driver.paymentMethod === pm.id}
                              onChange={() =>
                                setDriver((prev) => ({ ...prev, paymentMethod: pm.id }))
                              }
                              className="accent-[#F95B2B]"
                            />
                            <span>{pm.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-[#111111] cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Back to Options</span>
                      </button>

                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 bg-[#F95B2B] hover:bg-[#E24A1D] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors cursor-pointer"
                      >
                        <span>Confirm Booking ({formatINR(pricing.totalAmount)})</span>
                        <Check className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Right Sticky Itemized Summary Panel */}
              <aside className="lg:col-span-5">
                <div className="bg-[#FAFAFA] border border-neutral-200 rounded-2xl p-5 sticky top-0">
                  <div className="flex items-center gap-4 pb-4 border-b border-neutral-200">
                    <div className="w-24 h-16 rounded-xl overflow-hidden bg-white border border-neutral-200 shrink-0">
                      <img
                        src={selectedVehicle.image}
                        alt={selectedVehicle.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#F95B2B]">
                        {selectedVehicle.category}
                      </p>
                      <h3 className="font-display font-bold text-base text-[#111111] truncate">
                        {selectedVehicle.name}
                      </h3>
                      <p className="text-xs text-neutral-500 tabular-nums">
                        {formatINR(selectedVehicle.dailyRate)}/day · {selectedVehicle.seats} Seats
                      </p>
                    </div>
                  </div>

                  {/* Route Summary */}
                  <div className="py-4 border-b border-neutral-200 text-xs space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-neutral-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                        Pick-up
                      </span>
                      <span className="font-medium text-[#111111] text-right tabular-nums">
                        {pickupBranch?.city} · {pickupDate} {pickupTime}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-neutral-500 flex items-center gap-1">
                        <Car className="w-3.5 h-3.5" aria-hidden="true" />
                        Return
                      </span>
                      <span className="font-medium text-[#111111] text-right tabular-nums">
                        {dropoffBranch?.city} · {dropoffDate} {dropoffTime}
                      </span>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <dl className="py-4 space-y-2.5 text-xs tabular-nums">
                    <div className="flex justify-between gap-2">
                      <dt className="text-neutral-600">
                        Base rental ({pricing.billableDays} paid{' '}
                        {pricing.billableDays === 1 ? 'day' : 'days'} ×{' '}
                        {formatINR(selectedVehicle.dailyRate)})
                      </dt>
                      <dd className="font-semibold text-[#111111]">
                        {formatINR(pricing.baseSubtotal)}
                      </dd>
                    </div>

                    {pricing.freeDaysApplied > 0 && (
                      <div className="flex justify-between gap-2 text-emerald-700 font-medium">
                        <dt>
                          Weekend Getaway ({pricing.freeDaysApplied} free{' '}
                          {pricing.freeDaysApplied === 1 ? 'day' : 'days'})
                        </dt>
                        <dd>-{formatINR(pricing.weekendSavings)} saved</dd>
                      </div>
                    )}

                    <div className="flex justify-between gap-2">
                      <dt className="text-neutral-600">
                        {selectedProtection.name} ({pricing.rentalDays}d)
                      </dt>
                      <dd className="font-medium text-[#111111]">
                        {pricing.protectionTotal === 0
                          ? '₹0'
                          : formatINR(pricing.protectionTotal)}
                      </dd>
                    </div>

                    {pricing.addonsTotal > 0 && (
                      <div className="flex justify-between gap-2">
                        <dt className="text-neutral-600">
                          Selected extras ({selectedAddons.length})
                        </dt>
                        <dd className="font-medium text-[#111111]">
                          {formatINR(pricing.addonsTotal)}
                        </dd>
                      </div>
                    )}

                    {pricing.oneWayFee > 0 && (
                      <div className="flex justify-between gap-2">
                        <dt className="text-neutral-600">One-way hub transfer fee</dt>
                        <dd className="font-medium text-[#111111]">
                          {formatINR(pricing.oneWayFee)}
                        </dd>
                      </div>
                    )}

                    {pricing.promoDiscount > 0 && (
                      <div className="flex justify-between gap-2 text-emerald-700 font-medium">
                        <dt>Promo {pricing.promoLabel}</dt>
                        <dd>-{formatINR(pricing.promoDiscount)}</dd>
                      </div>
                    )}

                    <div className="flex justify-between gap-2">
                      <dt className="text-neutral-600">GST &amp; road fees (12%)</dt>
                      <dd className="font-medium text-[#111111]">
                        {formatINR(pricing.taxesAndFees)}
                      </dd>
                    </div>
                  </dl>

                  <div className="pt-4 border-t border-neutral-200 flex items-baseline justify-between">
                    <span className="font-display font-bold text-sm text-[#111111]">
                      Total Due
                    </span>
                    <span
                      data-testid="modal-total-amount"
                      className="font-display text-2xl font-bold text-[#111111] tabular-nums"
                    >
                      {formatINR(pricing.totalAmount)}
                    </span>
                  </div>

                  {step === 1 && (
                    <button
                      type="button"
                      onClick={handleContinueToDriver}
                      className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-[#F95B2B] hover:bg-[#E24A1D] text-white text-sm font-semibold px-5 py-3 rounded-xl transition-colors cursor-pointer"
                    >
                      <span>Continue to Driver Details</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
