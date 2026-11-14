import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildWhatsAppBookingMessage,
  buildWhatsAppUrl,
  calculateNights,
  calculateTotalPrice,
  formatNaira,
  validateBookingRequest,
} from './booking';
import { ROOM_CATEGORIES } from '../data/resortData';

test('formatNaira formats Naira currency cleanly', () => {
  assert.equal(formatNaira(30000), '₦30,000');
  assert.equal(formatNaira(120000), '₦120,000');
  assert.equal(formatNaira(0), '₦0');
});

test('calculateNights computes calendar nights and rejects invalid ranges', () => {
  assert.equal(calculateNights('2026-12-01', '2026-12-04'), 3);
  assert.equal(calculateNights('2026-12-30', '2027-01-02'), 3);
  assert.equal(calculateNights('2026-12-04', '2026-12-04'), null);
  assert.equal(calculateNights('2026-12-05', '2026-12-03'), null);
  assert.equal(calculateNights('2026-02-30', '2026-03-02'), null);
});

test('calculateTotalPrice multiplies nightly rate without fabricated charges', () => {
  assert.equal(calculateTotalPrice(40000, 3), 120000);
  assert.equal(calculateTotalPrice(50000, 2), 100000);
  assert.equal(calculateTotalPrice(30000, 0), 0);
});

test('validateBookingRequest catches empty name, invalid dates, and bad guest count', () => {
  const result = validateBookingRequest(
    {
      fullName: 'A',
      phoneNumber: '123',
      email: 'bad-email',
      roomId: 'executive',
      checkIn: '2026-11-10',
      checkOut: '2026-11-09',
      guests: 0,
      specialRequests: '',
    },
    '2026-11-14'
  );

  assert.equal(result.isValid, false);
  assert.ok(result.errors.fullName);
  assert.ok(result.errors.phoneNumber);
  assert.ok(result.errors.email);
  assert.ok(result.errors.checkIn);
  assert.ok(result.errors.checkOut);
  assert.ok(result.errors.guests);
});

test('validateBookingRequest accepts valid booking input with optional empty email', () => {
  const result = validateBookingRequest(
    {
      fullName: 'Amaka Okafor',
      phoneNumber: '+234 803 123 4567',
      email: '',
      roomId: 'executive',
      checkIn: '2026-11-20',
      checkOut: '2026-11-23',
      guests: 2,
      specialRequests: 'Quiet wing if available',
    },
    '2026-11-14'
  );

  assert.equal(result.isValid, true);
  assert.equal(result.nights, 3);
  assert.deepEqual(result.errors, {});
});

test('buildWhatsAppBookingMessage formats reservation request honestly without claiming confirmation', () => {
  const executive = ROOM_CATEGORIES.find((r) => r.id === 'executive')!;
  const msg = buildWhatsAppBookingMessage(
    {
      fullName: 'Amaka Okafor',
      phoneNumber: '08031234567',
      email: 'amaka@example.com',
      roomId: 'executive',
      checkIn: '2026-11-20',
      checkOut: '2026-11-23',
      guests: 2,
      specialRequests: 'Late arrival',
    },
    executive,
    3,
    120000
  );

  assert.match(msg, /Deluxe Executive Room/);
  assert.match(msg, /3 nights/);
  assert.match(msg, /₦120,000/);
  assert.match(msg, /awaiting confirmation/i);
});

test('buildWhatsAppUrl requires a configured number and encodes message', () => {
  assert.equal(buildWhatsAppUrl('', 'Hello'), null);
  assert.equal(buildWhatsAppUrl('123', 'Hello'), null);
  const url = buildWhatsAppUrl('+234 803 000 1111', 'Booking Request');
  assert.equal(url, 'https://wa.me/2348030001111?text=Booking%20Request');
});
