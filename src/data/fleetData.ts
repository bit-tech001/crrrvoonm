import {
  BranchLocation,
  ExtraAddon,
  ProtectionPlan,
  Reservation,
  Vehicle,
} from '../types/rental';

export const BRANCH_LOCATIONS: BranchLocation[] = [
  {
    id: 'dhk-airport',
    name: 'Dhaka Airport (HSIA) Terminal 2',
    city: 'Dhaka',
    address: 'Arrival Concourse Bay 4, Hazrat Shahjalal Intl Airport',
    hours: '24/7 Express Desk',
    isAirport: true,
  },
  {
    id: 'gulshan-hub',
    name: 'Gulshan Avenue Flagship Hub',
    city: 'Dhaka',
    address: 'Plot 42, Gulshan Avenue, Circle 2',
    hours: '07:00 – 23:00 Daily',
  },
  {
    id: 'banani-lounge',
    name: 'Banani Executive Lounge',
    city: 'Dhaka',
    address: 'Road 11, Block F, Banani',
    hours: '08:00 – 22:00 Daily',
  },
  {
    id: 'ctg-city',
    name: 'Chattogram Port & City Hub',
    city: 'Chattogram',
    address: '108 Agrabad Commercial Area',
    hours: '08:00 – 21:00 Daily',
  },
  {
    id: 'syl-airport',
    name: 'Sylhet Osmani Airport Desk',
    city: 'Sylhet',
    address: 'Terminal Forecourt, Osmani Intl Airport',
    hours: '06:00 – 22:00 Daily',
    isAirport: true,
  },
];

export const FLEET_VEHICLES: Vehicle[] = [
  {
    id: 'tiguan-r-line',
    name: 'Volkswagen Tiguan R-Line',
    brand: 'Volkswagen',
    category: 'SUV & Crossover',
    year: 2026,
    dailyRate: 5499,
    seats: 5,
    luggage: 4,
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    efficiencyLabel: '38 MPG combined',
    image: '/src/assets/images/hero_white_suv_1795456196354.jpg',
    highlightNote: 'Most Booked',
    description:
      'Refined urban crossover with adaptive chassis control, panoramic glass roof, and effortless highway composure for coastal or city escapes.',
    specs: {
      power: '245 HP eHybrid',
      drivetrain: '4Motion All-Wheel Drive',
      mileagePolicy: '300 km / day included',
    },
    availableBranchIds: ['dhk-airport', 'gulshan-hub', 'banani-lounge', 'ctg-city', 'syl-airport'],
  },
  {
    id: 'panamera-4s',
    name: 'Porsche Panamera 4S',
    brand: 'Porsche',
    category: 'Sports Coupe',
    year: 2026,
    dailyRate: 14500,
    seats: 4,
    luggage: 3,
    transmission: 'PDK Auto',
    fuelType: 'Petrol',
    efficiencyLabel: '2.9L Twin-Turbo V6',
    image: '/src/assets/images/car_slate_fastback_1795456196924.jpg',
    highlightNote: 'Flagship Grand Tourer',
    description:
      'Executive four-door fastback pairing twin-turbocharged grand touring pace with ventilated leather seating and active air suspension.',
    specs: {
      power: '443 HP Twin-Turbo',
      drivetrain: 'Active All-Wheel Drive',
      mileagePolicy: '250 km / day included',
    },
    availableBranchIds: ['dhk-airport', 'gulshan-hub', 'banani-lounge'],
  },
  {
    id: 'range-rover-autobiography',
    name: 'Range Rover Autobiography',
    brand: 'Land Rover',
    category: 'SUV & Crossover',
    year: 2026,
    dailyRate: 18900,
    seats: 7,
    luggage: 6,
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    efficiencyLabel: '7-Seat Executive',
    image: '/src/assets/images/car_black_suv_1795456196336.jpg',
    highlightNote: 'Executive 7-Seater',
    description:
      'Whisper-quiet flagship cabin with acoustic laminated glass, three-zone climate control, and commanding road presence for family or VIP travel.',
    specs: {
      power: '395 HP Mild Hybrid',
      drivetrain: 'Terrain Response AWD',
      mileagePolicy: '300 km / day included',
    },
    availableBranchIds: ['dhk-airport', 'gulshan-hub', 'ctg-city', 'syl-airport'],
  },
  {
    id: 'taycan-cross-ev',
    name: 'Porsche Taycan 4 Cross',
    brand: 'Porsche',
    category: 'Electric & Hybrid',
    year: 2026,
    dailyRate: 12900,
    seats: 4,
    luggage: 3,
    transmission: 'Single-Speed EV',
    fuelType: 'Electric',
    efficiencyLabel: '510 km WLTP Range',
    image: '/src/assets/images/car_silver_ev_1795456196370.jpg',
    highlightNote: 'Zero-Emission Fast Charge',
    description:
      'Instantaneous dual-motor electric torque with complimentary hub fast-charging passes and a serene, zero-vibration cabin.',
    specs: {
      power: '469 HP Dual Motor',
      drivetrain: 'Electric AWD',
      mileagePolicy: 'Unlimited km included',
    },
    availableBranchIds: ['dhk-airport', 'gulshan-hub', 'banani-lounge'],
  },
  {
    id: 'tiguan-allspace',
    name: 'Tiguan Allspace Touring',
    brand: 'Volkswagen',
    category: 'SUV & Crossover',
    year: 2025,
    dailyRate: 6500,
    seats: 7,
    luggage: 5,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    efficiencyLabel: '32 MPG highway',
    image: '/src/assets/images/hero_white_suv_1795456196354.jpg',
    description:
      'Extended-wheelbase family SUV offering flexible third-row seating, wireless CarPlay, and generous cargo capacity for weekend road trips.',
    specs: {
      power: '210 HP TSI',
      drivetrain: 'Front-Wheel / AWD',
      mileagePolicy: '350 km / day included',
    },
    availableBranchIds: ['dhk-airport', 'gulshan-hub', 'ctg-city', 'syl-airport'],
  },
  {
    id: 'taycan-executive-gt',
    name: 'Vromon EV Executive GT',
    brand: 'Porsche',
    category: 'Executive Sedan',
    year: 2026,
    dailyRate: 9800,
    seats: 5,
    luggage: 4,
    transmission: 'Single-Speed EV',
    fuelType: 'Electric',
    efficiencyLabel: '485 km WLTP Range',
    image: '/src/assets/images/car_silver_ev_1795456196370.jpg',
    description:
      'Tailored for corporate airport transfers and intercity boardroom runs with rear executive legroom and high-speed cabin Wi-Fi readiness.',
    specs: {
      power: '402 HP Electric',
      drivetrain: 'Rear-Biased AWD',
      mileagePolicy: 'Unlimited km included',
    },
    availableBranchIds: ['dhk-airport', 'gulshan-hub', 'banani-lounge', 'ctg-city'],
  },
];

export const PROTECTION_PLANS: ProtectionPlan[] = [
  {
    id: 'basic',
    name: 'Standard Cover',
    dailyPrice: 0,
    deductible: '₹50,000 excess',
    summary: 'Included collision damage waiver and third-party liability.',
  },
  {
    id: 'shield',
    name: 'Zero-Excess Shield',
    dailyPrice: 1200,
    deductible: '₹0 excess',
    summary: 'Full glass, tire, and bodywork protection with zero security deposit hold.',
  },
  {
    id: 'concierge',
    name: 'VIP Chauffeur & Shield',
    dailyPrice: 3200,
    deductible: '₹0 excess',
    summary: 'Zero-excess protection plus optional uniformed Vromon chauffeur service.',
  },
];

export const EXTRA_ADDONS: ExtraAddon[] = [
  {
    id: 'unlimited-miles',
    name: 'Unlimited Mileage Boost',
    pricingType: 'per_day',
    price: 950,
    description: 'Drive across regions with zero per-kilometer overage charges.',
  },
  {
    id: 'child-seat',
    name: 'ISOFIX Child Safety Seat',
    pricingType: 'per_day',
    price: 500,
    description: 'Sanitized, safety-certified rear or forward-facing seat.',
  },
  {
    id: 'wifi-5g',
    name: 'In-Car 5G Wi-Fi Hotspot',
    pricingType: 'per_day',
    price: 400,
    description: 'Connect up to 6 laptops and phones on the road.',
  },
  {
    id: 'airport-greet',
    name: 'Airport Express Meet & Greet',
    pricingType: 'flat',
    price: 1100,
    description: 'Flight-tracked terminal handover with priority exit.',
  },
];

export interface ValueBenefit {
  id: string;
  title: string;
  headline: string;
  description: string;
  statLabel: string;
  recommendedCategory: 'All' | 'SUV & Crossover' | 'Executive Sedan' | 'Sports Coupe' | 'Electric & Hybrid';
}

export const KEY_BENEFITS: ValueBenefit[] = [
  {
    id: 'flexible-booking',
    title: 'Flexible Booking Options.',
    headline: 'Modify pickup times or swap vehicle class in seconds.',
    description:
      'Plans shift. With Vromon, reschedule dates, switch drop-off hubs, or cancel free of charge up to 12 hours before pickup with zero penalty.',
    statLabel: 'Free cancellation up to 12h prior',
    recommendedCategory: 'All',
  },
  {
    id: 'luxury-comfort',
    title: 'Luxury and Comfort.',
    headline: '2025–2026 late-model vehicles inspected on a 42-point checklist.',
    description:
      'Discover the freedom to travel on your terms with our meticulously maintained SUVs, executive sedans, and grand tourers prepared before every handover.',
    statLabel: '42-point pre-delivery safety check',
    recommendedCategory: 'Sports Coupe',
  },
  {
    id: 'roadside-assistance',
    title: '24/7 Roadside Assistance.',
    headline: 'Live dispatch coverage on every highway and urban corridor.',
    description:
      'Flat tire, battery jump, or sudden route change—our rapid response fleet reaches major metro routes in under 35 minutes or swaps your car on-site.',
    statLabel: 'Under 35 min metro dispatch response',
    recommendedCategory: 'SUV & Crossover',
  },
  {
    id: 'affordable-pricing',
    title: 'Affordable Pricing.',
    headline: 'Upfront itemized rates with our 3+1 Weekend Getaway deal.',
    description:
      'No counter surprises or hidden airport surcharges. Book 4 days and your 4th rental day is automatically complimentary, plus use code VROMON10 for 10% off.',
    statLabel: '4th day free on 4+ day bookings',
    recommendedCategory: 'All',
  },
  {
    id: 'loyalty-rewards',
    title: 'Loyalty Rewards Program.',
    headline: 'Earn Vromon Miles on every trip toward complimentary upgrades.',
    description:
      'Frequent drivers automatically unlock priority bay access, complimentary Zero-Excess Shield days, and instant cabin-class upgrades.',
    statLabel: '10% reward credit on repeat rentals',
    recommendedCategory: 'Executive Sedan',
  },
  {
    id: 'one-way-rentals',
    title: 'One-Way Rentals.',
    headline: 'Pick up at Dhaka Airport, drop off in Chattogram or Sylhet.',
    description:
      'Fly one direction and drive back on your own timetable. Leave your vehicle at any of Vromon’s five city or airport hubs across the network.',
    statLabel: '5 intercity & airport drop-off hubs',
    recommendedCategory: 'Electric & Hybrid',
  },
];

export interface ExperienceTab {
  id: 'payments' | 'tracking' | 'personalized' | 'assistance';
  label: string;
  title: string;
  description: string;
  highlights: string[];
  appCardTitle: string;
  appCardMetric: string;
  appRouteLabel: string;
}

export const EXPERIENCE_TABS: ExperienceTab[] = [
  {
    id: 'payments',
    label: 'Secure Payments',
    title: 'Transparent checkout with UPI, cards, or pay-at-hub.',
    description:
      'View full itemized daily rates, insurance coverage, and GST upfront. Redeem promo codes like VROMON10 directly in your reservation summary with zero hidden fees.',
    highlights: [
      'UPI, Visa, Mastercard, NetBanking & Pay-at-Pickup',
      'Instant digital GST invoice & itemized booking pass',
      'Zero security deposit hold on Zero-Excess Shield bookings',
    ],
    appCardTitle: 'Checkout Summary',
    appCardMetric: 'Instant Receipt · ₹0 Deposit Hold',
    appRouteLabel: 'Dhaka Airport → Gulshan Hub',
  },
  {
    id: 'tracking',
    label: 'Advanced Tracking',
    title: 'Live vehicle dispatch status and smart route telemetry.',
    description:
      'Know exactly which bay your vehicle is staged in before you land. Track curbside delivery arrival, fuel level, and return-hub routing right from your booking pass.',
    highlights: [
      'Real-time curbside vehicle arrival countdown',
      'Turn-by-turn navigation to nearest EV fast charger or fuel bay',
      'Automated flight delay sync for airport arrivals',
    ],
    appCardTitle: 'Live Dispatch Bay 04',
    appCardMetric: 'Staged & Ready · 98% Charge',
    appRouteLabel: 'HSIA Terminal 2 → Banani Lounge',
  },
  {
    id: 'personalized',
    label: 'Personalized Experience',
    title: 'Cabin presets, preferred extras, and instant class matching.',
    description:
      'Save your preferred seat setup, child seat requirements, and protection tier once. Every future Vromon reservation pre-fills your preferences in one tap.',
    highlights: [
      'Saved driver license & express 90-second key handover',
      'Custom cabin climate and complimentary bottled water',
      'Loyalty discount stacking with Weekend Getaway free days',
    ],
    appCardTitle: 'Vromon Member Pass',
    appCardMetric: 'Tier: Priority · 2,400 Miles',
    appRouteLabel: 'Gulshan Flagship → Sylhet Hub',
  },
  {
    id: 'assistance',
    label: 'Real-Time Assistance',
    title: 'Direct 24/7 concierge and one-tap roadside dispatch.',
    description:
      'Speak directly with a local Vromon fleet coordinator—never an automated script. Extend your trip mid-journey or summon roadside support in one tap.',
    highlights: [
      '24/7 direct hotline & instant WhatsApp concierge',
      'On-the-fly trip extension directly from My Bookings',
      'Immediate replacement vehicle guarantee in metro zones',
    ],
    appCardTitle: 'Concierge Active',
    appCardMetric: 'Avg Response: 42 sec',
    appRouteLabel: 'Chattogram Highway Support',
  },
];

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  rating: string;
  quote: string;
  image: string;
  vehicleRented: string;
}

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't1',
    name: 'Tariq Rahman',
    role: 'Managing Director, Apex Logistics',
    rating: '5.0',
    quote:
      'I had a seamless experience with Vromon Car Rental. Our flight into Dhaka landed two hours late, yet our Tiguan R-Line was waiting right at Terminal 2 with zero extra wait fees. The itemized invoice made corporate reimbursement effortless.',
    image: '/src/assets/images/customer_portrait_male_1795456197353.jpg',
    vehicleRented: 'Volkswagen Tiguan R-Line',
  },
  {
    id: 't2',
    name: 'Nadia Chowdhury',
    role: 'Principal Architect, Studio K',
    rating: '5.0',
    quote:
      'Booking a 4-day Sylhet site trip gave us the 4th day free automatically, and switching our drop-off to the airport hub took less than a minute. Every car feels showroom-fresh and the team is genuinely attentive.',
    image: '/src/assets/images/customer_portrait_female_1795456196754.jpg',
    vehicleRented: 'Porsche Panamera 4S',
  },
  {
    id: 't3',
    name: 'Farhan Kabir',
    role: 'VP of Operations, Bengal Solar',
    rating: '5.0',
    quote:
      'We switched our executive guest transfers to Vromon six months ago. Having transparent pricing with Zero-Excess Shield and reliable Range Rover availability on short notice has saved our team hours every week.',
    image: '/src/assets/images/customer_portrait_male_1795456197353.jpg',
    vehicleRented: 'Range Rover Autobiography',
  },
];

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-docs',
    question: 'What documents do I need to rent a car with Vromon?',
    answer:
      'You need a valid national or international driving license (held for at least 1 year), a government-issued photo ID or passport, and the booking confirmation code (VRM-XXXX) generated upon checkout.',
  },
  {
    id: 'faq-weekend',
    question: 'How does the "Weekend Getaway: Rent 3 days, get 1 day free" offer work?',
    answer:
      'When you book a trip of 4 days or longer, Vromon automatically waives the base daily rate for every 4th day (so a 4-day trip is billed for 3 base days, and an 8-day trip is billed for 6 base days). It stacks seamlessly with promo code VROMON10.',
  },
  {
    id: 'faq-deposit',
    question: 'Is a security deposit required at pickup?',
    answer:
      'Standard Cover rentals require a refundable card authorization at pickup. Choosing our Zero-Excess Shield (₹1,200/day) or VIP Chauffeur tier waives the security deposit hold entirely and covers tires, glass, and bodywork with ₹0 deductible.',
  },
  {
    id: 'faq-oneway',
    question: 'Can I pick up at Dhaka Airport and return the car in another city?',
    answer:
      'Yes. Select a different drop-off hub in the booking bar or modal to enable one-way rentals between Dhaka Airport, Gulshan, Banani, Chattogram, and Sylhet Airport for a transparent flat transfer fee of ₹2,500.',
  },
  {
    id: 'faq-cancel',
    question: 'Can I modify or cancel my booking after confirming?',
    answer:
      'Yes. Open "My Bookings" from the top navigation at any time to review your reservation details, print your boarding-style vehicle pass, or cancel free of charge up to 12 hours before pickup.',
  },
];

export const SEED_RESERVATION: Reservation = {
  id: 'seed-vrm-8421',
  code: 'VRM-8421',
  vehicleId: 'tiguan-r-line',
  vehicleName: 'Volkswagen Tiguan R-Line',
  vehicleCategory: 'SUV & Crossover',
  vehicleImage: '/src/assets/images/hero_white_suv_1795456196354.jpg',
  pickupBranchId: 'dhk-airport',
  dropoffBranchId: 'gulshan-hub',
  pickupDate: '2026-11-27',
  pickupTime: '10:00',
  dropoffDate: '2026-12-01',
  dropoffTime: '10:00',
  protectionId: 'shield',
  addonIds: ['airport-greet'],
  promoCode: '',
  driver: {
    fullName: 'Tariq Rahman',
    email: 'tariq.rahman@example.com',
    phone: '+880 1711 224499',
    licenseNumber: 'DL-DHK-904821',
    flightNumber: 'BG 204',
    paymentMethod: 'card',
  },
  pricing: {
    rentalDays: 4,
    freeDaysApplied: 1,
    billableDays: 3,
    baseSubtotal: 16497,
    weekendSavings: 5499,
    protectionTotal: 4800,
    addonsTotal: 1100,
    oneWayFee: 2500,
    promoDiscount: 0,
    promoLabel: null,
    taxesAndFees: 2988,
    totalAmount: 27885,
  },
  status: 'Confirmed',
  createdAt: '2026-11-22T14:20:00.000Z',
};
