export type VehicleCategory =
  | 'SUV & Crossover'
  | 'Executive Sedan'
  | 'Sports Coupe'
  | 'Electric & Hybrid';

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  category: VehicleCategory;
  year: number;
  dailyRate: number;
  seats: number;
  luggage: number;
  transmission: 'Automatic' | 'PDK Auto' | 'Single-Speed EV';
  fuelType: 'Petrol' | 'Hybrid' | 'Electric';
  efficiencyLabel: string;
  image: string;
  highlightNote?: string;
  description: string;
  specs: {
    power: string;
    drivetrain: string;
    mileagePolicy: string;
  };
  availableBranchIds: string[];
}

export interface BranchLocation {
  id: string;
  name: string;
  city: string;
  address: string;
  hours: string;
  isAirport?: boolean;
}

export interface ProtectionPlan {
  id: string;
  name: string;
  dailyPrice: number;
  deductible: string;
  summary: string;
}

export interface ExtraAddon {
  id: string;
  name: string;
  pricingType: 'per_day' | 'flat';
  price: number;
  description: string;
}

export interface BookingSearchState {
  pickupBranchId: string;
  dropoffBranchId: string;
  sameDropoff: boolean;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
  categoryFilter: 'All' | VehicleCategory;
  searchQuery: string;
  sortBy: 'recommended' | 'price-asc' | 'price-desc' | 'seats-desc';
}

export interface PriceBreakdown {
  rentalDays: number;
  freeDaysApplied: number;
  billableDays: number;
  baseSubtotal: number;
  weekendSavings: number;
  protectionTotal: number;
  addonsTotal: number;
  oneWayFee: number;
  promoDiscount: number;
  promoLabel: string | null;
  taxesAndFees: number;
  totalAmount: number;
}

export type PaymentMethod = 'card' | 'wallet' | 'pickup';

export interface DriverDetails {
  fullName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  flightNumber: string;
  paymentMethod: PaymentMethod;
}

export interface Reservation {
  id: string;
  code: string;
  vehicleId: string;
  vehicleName: string;
  vehicleCategory: VehicleCategory;
  vehicleImage: string;
  pickupBranchId: string;
  dropoffBranchId: string;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
  protectionId: string;
  addonIds: string[];
  promoCode: string;
  driver: DriverDetails;
  pricing: PriceBreakdown;
  status: 'Confirmed' | 'Cancelled';
  createdAt: string;
}
