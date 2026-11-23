import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculatePriceBreakdown,
  calculateRentalDays,
  filterAndSortVehicles,
  formatINR,
  generateBookingCode,
  isPromoValid,
  validateBookingDates,
  validateDriverDetails,
} from './bookingMath';
import { EXTRA_ADDONS, FLEET_VEHICLES } from '../data/fleetData';

test('formatINR formats Indian Rupee currency with en-IN grouping', () => {
  assert.equal(formatINR(5499), '₹5,499');
  assert.equal(formatINR(125000), '₹1,25,000');
  assert.equal(formatINR(0), '₹0');
});

test('validateBookingDates rejects reversed dates and short durations', () => {
  const reversed = validateBookingDates('2026-12-05', '10:00', '2026-12-03', '10:00');
  assert.equal(reversed.valid, false);

  const tooShort = validateBookingDates('2026-12-05', '10:00', '2026-12-05', '12:00');
  assert.equal(tooShort.valid, false);

  const ok = validateBookingDates('2026-12-05', '10:00', '2026-12-09', '10:00');
  assert.equal(ok.valid, true);
});

test('calculateRentalDays applies 2-hour grace window accurately', () => {
  // Exact 4 days
  assert.equal(calculateRentalDays('2026-12-01', '10:00', '2026-12-05', '10:00'), 4);
  // 4 days + 1.5 hours -> still 4 days
  assert.equal(calculateRentalDays('2026-12-01', '10:00', '2026-12-05', '11:30'), 4);
  // 4 days + 3 hours -> rounds up to 5 days
  assert.equal(calculateRentalDays('2026-12-01', '10:00', '2026-12-05', '13:00'), 5);
});

test('calculatePriceBreakdown applies 3+1 Weekend Getaway free day, promo, and INR one-way fee', () => {
  const addons = [EXTRA_ADDONS[0], EXTRA_ADDONS[3]]; // ₹950/day + ₹1,100 flat
  const breakdown = calculatePriceBreakdown({
    dailyRate: 5000,
    rentalDays: 4,
    protectionDailyRate: 1200,
    selectedAddons: addons,
    promoCode: 'vromon10',
    isOneWay: true,
  });

  // 4 days -> 1 free day -> 3 billable base days = ₹15,000
  assert.equal(breakdown.freeDaysApplied, 1);
  assert.equal(breakdown.billableDays, 3);
  assert.equal(breakdown.baseSubtotal, 15000);
  assert.equal(breakdown.weekendSavings, 5000);
  // Protection applies to all 4 physical days: 1200 * 4 = 4800
  assert.equal(breakdown.protectionTotal, 4800);
  // Addons: 950*4 + 1100 = 4900
  assert.equal(breakdown.addonsTotal, 4900);
  // One-way = 2500
  assert.equal(breakdown.oneWayFee, 2500);
  // Promo VROMON10 = 10% of 15000 = 1500
  assert.equal(breakdown.promoDiscount, 1500);
  // Taxable = 15000 - 1500 + 4800 + 4900 + 2500 = 25700; GST 12% = 3084; Total = 28784
  assert.equal(breakdown.taxesAndFees, 3084);
  assert.equal(breakdown.totalAmount, 28784);
});

test('isPromoValid matches valid promo codes case-insensitively', () => {
  assert.equal(isPromoValid('VROMON10'), true);
  assert.equal(isPromoValid(' weekend15 '), true);
  assert.equal(isPromoValid('INVALID99'), false);
});

test('validateDriverDetails flags missing or invalid fields without bypassing', () => {
  const invalid = validateDriverDetails({
    fullName: 'A',
    email: 'not-an-email',
    phone: '123',
    licenseNumber: '12',
    flightNumber: '',
    paymentMethod: 'card',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.fullName);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.phone);
  assert.ok(invalid.errors.licenseNumber);

  const valid = validateDriverDetails({
    fullName: 'Nadia Chowdhury',
    email: 'nadia@studiok.com',
    phone: '+880 1711 998877',
    licenseNumber: 'DL-998821',
    flightNumber: 'BG 102',
    paymentMethod: 'wallet',
  });
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.errors, {});
});

test('filterAndSortVehicles filters by category, branch, query and sorts by price', () => {
  const suvs = filterAndSortVehicles(FLEET_VEHICLES, {
    categoryFilter: 'SUV & Crossover',
    pickupBranchId: 'dhk-airport',
    searchQuery: '',
    sortBy: 'price-asc',
  });
  assert.ok(suvs.length >= 2);
  assert.ok(suvs[0].dailyRate <= suvs[1].dailyRate);

  const none = filterAndSortVehicles(FLEET_VEHICLES, {
    categoryFilter: 'All',
    pickupBranchId: 'dhk-airport',
    searchQuery: 'Helicopter',
    sortBy: 'recommended',
  });
  assert.equal(none.length, 0);
});

test('generateBookingCode formats deterministic VRM-XXXX code', () => {
  assert.equal(generateBookingCode(0), 'VRM-1000');
  assert.equal(generateBookingCode(0.5), 'VRM-5500');
});
