import { RoomCategory, RoomCategoryId } from '../data/resortData';

export interface BookingFormInput {
  fullName: string;
  phoneNumber: string;
  email: string;
  roomId: RoomCategoryId;
  checkIn: string;
  checkOut: string;
  guests: number;
  specialRequests: string;
}

export interface BookingFieldErrors {
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  roomId?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: string;
}

export interface BookingValidationResult {
  isValid: boolean;
  nights: number | null;
  errors: BookingFieldErrors;
}

export function formatNaira(amount: number): string {
  const safeAmount = Number.isFinite(amount) ? Math.max(0, Math.round(amount)) : 0;
  return `₦${safeAmount.toLocaleString('en-NG')}`;
}

export function getTodayDateString(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDaysToDateString(dateStr: string, days: number): string {
  const parsed = parseIsoDateLocal(dateStr);
  if (!parsed) return '';
  parsed.setDate(parsed.getDate() + days);
  return getTodayDateString(parsed);
}

function parseIsoDateLocal(dateStr: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return null;
  }
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  date.setHours(0, 0, 0, 0);
  return date;
}

export function calculateNights(checkIn: string, checkOut: string): number | null {
  const start = parseIsoDateLocal(checkIn);
  const end = parseIsoDateLocal(checkOut);
  if (!start || !end) return null;

  const diffMs = end.getTime() - start.getTime();
  const nights = Math.round(diffMs / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : null;
}

export function calculateTotalPrice(nightlyRate: number, nights: number): number {
  if (!Number.isFinite(nightlyRate) || !Number.isFinite(nights) || nights <= 0 || nightlyRate < 0) {
    return 0;
  }
  return Math.round(nightlyRate * nights);
}

export function sanitizePhoneDigits(rawPhone: string): string {
  return rawPhone.replace(/[^\d]/g, '');
}

export function validateBookingRequest(
  input: BookingFormInput,
  referenceDate: string = getTodayDateString()
): BookingValidationResult {
  const errors: BookingFieldErrors = {};

  if (!input.fullName.trim() || input.fullName.trim().length < 2) {
    errors.fullName = 'Please enter the guest full name (at least 2 characters).';
  }

  const phoneDigits = sanitizePhoneDigits(input.phoneNumber);
  if (!phoneDigits || phoneDigits.length < 7 || phoneDigits.length > 15) {
    errors.phoneNumber = 'Please enter a valid contact phone number (7–15 digits).';
  }

  if (input.email.trim()) {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim());
    if (!emailValid) {
      errors.email = 'Please enter a valid email address or leave this field blank.';
    }
  }

  const todayDate = parseIsoDateLocal(referenceDate);
  const checkInDate = parseIsoDateLocal(input.checkIn);
  const checkOutDate = parseIsoDateLocal(input.checkOut);

  if (!checkInDate) {
    errors.checkIn = 'Please select a valid check-in date.';
  } else if (todayDate && checkInDate.getTime() < todayDate.getTime()) {
    errors.checkIn = 'Check-in date cannot be in the past.';
  }

  if (!checkOutDate) {
    errors.checkOut = 'Please select a valid check-out date.';
  } else if (checkInDate && checkOutDate.getTime() <= checkInDate.getTime()) {
    errors.checkOut = 'Check-out date must be at least one night after check-in.';
  }

  if (!Number.isInteger(input.guests) || input.guests < 1 || input.guests > 20) {
    errors.guests = 'Number of guests must be between 1 and 20.';
  }

  const nights =
    !errors.checkIn && !errors.checkOut ? calculateNights(input.checkIn, input.checkOut) : null;

  return {
    isValid: Object.keys(errors).length === 0 && nights !== null,
    nights,
    errors,
  };
}

export function buildWhatsAppBookingMessage(
  input: BookingFormInput,
  room: RoomCategory,
  nights: number,
  total: number
): string {
  const lines = [
    'RESERVATION REQUEST — HOME SWEET HOME RESORT',
    '',
    `Guest Name: ${input.fullName.trim()}`,
    `Phone: ${input.phoneNumber.trim()}`,
    ...(input.email.trim() ? [`Email: ${input.email.trim()}`] : []),
    `Room Category: ${room.name} (${formatNaira(room.nightlyRate)} per night)`,
    `Check-in Date: ${input.checkIn}`,
    `Check-out Date: ${input.checkOut}`,
    `Duration: ${nights} ${nights === 1 ? 'night' : 'nights'}`,
    `Guests: ${input.guests}`,
    `Estimated Accommodation Total: ${formatNaira(total)}`,
    ...(input.specialRequests.trim()
      ? [`Special Requests: ${input.specialRequests.trim()}`]
      : []),
    '',
    'Note: This is a reservation request awaiting confirmation from Home Sweet Home Resort.',
  ];

  return lines.join('\n');
}

export function buildWhatsAppUrl(rawPhone: string, message: string): string | null {
  const digits = sanitizePhoneDigits(rawPhone);
  if (digits.length < 7) {
    return null;
  }
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${encoded}`;
}

export function buildWhatsAppShareUrl(rawPhone: string, message: string): string {
  const direct = buildWhatsAppUrl(rawPhone, message);
  if (direct) return direct;
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
