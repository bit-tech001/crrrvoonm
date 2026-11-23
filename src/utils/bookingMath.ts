import {
  BookingSearchState,
  DriverDetails,
  ExtraAddon,
  PriceBreakdown,
  Vehicle,
} from '../types/rental';

export const ONE_WAY_FLAT_FEE = 2500;
export const TAX_RATE = 0.12; // 12% GST & municipal road fee

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

const PROMO_CODES: Record<string, { rate: number; label: string }> = {
  VROMON10: { rate: 0.1, label: 'VROMON10 (10% off base)' },
  WEEKEND15: { rate: 0.15, label: 'WEEKEND15 (15% off base)' },
};

export function parseDateTime(dateStr: string, timeStr: string): Date | null {
  if (!dateStr || !timeStr) return null;
  const iso = `${dateStr}T${timeStr}:00`;
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function validateBookingDates(
  pickupDate: string,
  pickupTime: string,
  dropoffDate: string,
  dropoffTime: string
): { valid: boolean; error?: string } {
  const start = parseDateTime(pickupDate, pickupTime);
  const end = parseDateTime(dropoffDate, dropoffTime);

  if (!start || !end) {
    return { valid: false, error: 'Please select valid pick-up and return dates and times.' };
  }

  if (end.getTime() <= start.getTime()) {
    return {
      valid: false,
      error: 'Return date & time must be after pick-up date & time.',
    };
  }

  const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  if (diffHours < 4) {
    return {
      valid: false,
      error: 'Minimum rental duration is 4 hours.',
    };
  }

  return { valid: true };
}

export function calculateRentalDays(
  pickupDate: string,
  pickupTime: string,
  dropoffDate: string,
  dropoffTime: string
): number {
  const start = parseDateTime(pickupDate, pickupTime);
  const end = parseDateTime(dropoffDate, dropoffTime);
  if (!start || !end || end.getTime() <= start.getTime()) {
    return 1;
  }
  const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  const fullDays = Math.floor(diffHours / 24);
  const remainderHours = diffHours - fullDays * 24;
  // 2-hour grace window before billing an extra day
  const totalDays = fullDays + (remainderHours > 2 ? 1 : 0);
  return Math.max(1, totalDays);
}

export function calculatePriceBreakdown(params: {
  dailyRate: number;
  rentalDays: number;
  protectionDailyRate: number;
  selectedAddons: ExtraAddon[];
  promoCode: string;
  isOneWay: boolean;
}): PriceBreakdown {
  const {
    dailyRate,
    rentalDays,
    protectionDailyRate,
    selectedAddons,
    promoCode,
    isOneWay,
  } = params;

  const safeDays = Math.max(1, Math.round(rentalDays));
  // Weekend Getaway: Rent 3 paid days, get every 4th day free!
  const freeDaysApplied = Math.floor(safeDays / 4);
  const billableDays = safeDays - freeDaysApplied;
  const weekendSavings = freeDaysApplied * dailyRate;
  const baseSubtotal = billableDays * dailyRate;

  const protectionTotal = protectionDailyRate * safeDays;
  const addonsTotal = selectedAddons.reduce((sum, addon) => {
    return sum + (addon.pricingType === 'per_day' ? addon.price * safeDays : addon.price);
  }, 0);

  const oneWayFee = isOneWay ? ONE_WAY_FLAT_FEE : 0;

  const normalizedPromo = promoCode.trim().toUpperCase();
  const matchedPromo = PROMO_CODES[normalizedPromo] ?? null;
  const promoDiscount = matchedPromo ? Math.round(baseSubtotal * matchedPromo.rate) : 0;

  const taxableAmount = Math.max(
    0,
    baseSubtotal - promoDiscount + protectionTotal + addonsTotal + oneWayFee
  );
  const taxesAndFees = Math.round(taxableAmount * TAX_RATE);
  const totalAmount = taxableAmount + taxesAndFees;

  return {
    rentalDays: safeDays,
    freeDaysApplied,
    billableDays,
    baseSubtotal,
    weekendSavings,
    protectionTotal,
    addonsTotal,
    oneWayFee,
    promoDiscount,
    promoLabel: matchedPromo ? matchedPromo.label : null,
    taxesAndFees,
    totalAmount,
  };
}

export function isPromoValid(code: string): boolean {
  const normalized = code.trim().toUpperCase();
  return Boolean(PROMO_CODES[normalized]);
}

export interface DriverValidationErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  licenseNumber?: string;
}

export function validateDriverDetails(details: DriverDetails): {
  valid: boolean;
  errors: DriverValidationErrors;
} {
  const errors: DriverValidationErrors = {};

  if (!details.fullName || details.fullName.trim().length < 2) {
    errors.fullName = 'Enter the primary driver full name.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!details.email || !emailRegex.test(details.email.trim())) {
    errors.email = 'Enter a valid email address for your booking pass.';
  }

  const phoneDigits = details.phone.replace(/\D/g, '');
  if (phoneDigits.length < 7) {
    errors.phone = 'Enter a valid phone number (at least 7 digits).';
  }

  if (!details.licenseNumber || details.licenseNumber.trim().length < 5) {
    errors.licenseNumber = 'Enter a valid driver license number (min 5 characters).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function filterAndSortVehicles(
  vehicles: Vehicle[],
  search: Pick<BookingSearchState, 'categoryFilter' | 'pickupBranchId' | 'searchQuery' | 'sortBy'>
): Vehicle[] {
  const q = search.searchQuery.trim().toLowerCase();

  const filtered = vehicles.filter((v) => {
    if (search.categoryFilter !== 'All' && v.category !== search.categoryFilter) {
      return false;
    }
    if (search.pickupBranchId && !v.availableBranchIds.includes(search.pickupBranchId)) {
      return false;
    }
    if (q) {
      const haystack = `${v.name} ${v.brand} ${v.category} ${v.fuelType} ${v.transmission}`.toLowerCase();
      if (!haystack.includes(q)) {
        return false;
      }
    }
    return true;
  });

  const sorted = [...filtered];
  if (search.sortBy === 'price-asc') {
    sorted.sort((a, b) => a.dailyRate - b.dailyRate);
  } else if (search.sortBy === 'price-desc') {
    sorted.sort((a, b) => b.dailyRate - a.dailyRate);
  } else if (search.sortBy === 'seats-desc') {
    sorted.sort((a, b) => b.seats - a.seats || a.dailyRate - b.dailyRate);
  }

  return sorted;
}

export function generateBookingCode(seed = Math.random()): string {
  const numeric = Math.floor(1000 + seed * 9000);
  return `VRM-${numeric}`;
}

export function getDefaultSearchDates(): {
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
} {
  // Deterministic upcoming 4-day trip relative to standard reference date
  const now = new Date();
  const pickup = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
  const dropoff = new Date(pickup.getTime() + 4 * 24 * 60 * 60 * 1000);

  const fmt = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  return {
    pickupDate: fmt(pickup),
    pickupTime: '10:00',
    dropoffDate: fmt(dropoff),
    dropoffTime: '10:00',
  };
}
