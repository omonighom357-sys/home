import { sanitizePhoneDigits } from './booking';
import { RoomCategoryId } from '../data/resortData';

export interface ContactFormInput {
  fullName: string;
  email: string;
  phoneNumber: string;
  subject: string;
  message: string;
}

export interface ContactFieldErrors {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  subject?: string;
  message?: string;
}

export interface ContactValidationResult {
  isValid: boolean;
  errors: ContactFieldErrors;
}

export interface ReviewSubmissionInput {
  guestName: string;
  roomId: RoomCategoryId;
  rating: number;
  title: string;
  experience: string;
}

export interface ReviewSubmissionErrors {
  guestName?: string;
  rating?: string;
  title?: string;
  experience?: string;
}

export interface ReviewValidationResult {
  isValid: boolean;
  errors: ReviewSubmissionErrors;
}

export function validateContactForm(input: ContactFormInput): ContactValidationResult {
  const errors: ContactFieldErrors = {};

  if (!input.fullName.trim() || input.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name (at least 2 characters).';
  }

  const trimmedEmail = input.email.trim();
  if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    errors.email = 'Please enter a valid email address.';
  }

  const digits = sanitizePhoneDigits(input.phoneNumber);
  if (!digits || digits.length < 7 || digits.length > 15) {
    errors.phoneNumber = 'Please enter a valid phone number (7–15 digits).';
  }

  if (!input.subject.trim() || input.subject.trim().length < 3) {
    errors.subject = 'Please provide a brief subject for your inquiry.';
  }

  if (!input.message.trim() || input.message.trim().length < 10) {
    errors.message = 'Please enter a message of at least 10 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateReviewSubmission(input: ReviewSubmissionInput): ReviewValidationResult {
  const errors: ReviewSubmissionErrors = {};

  if (!input.guestName.trim() || input.guestName.trim().length < 2) {
    errors.guestName = 'Please share your first name or display name (at least 2 characters).';
  }

  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
    errors.rating = 'Please select a star rating between 1 and 5.';
  }

  if (!input.title.trim() || input.title.trim().length < 3) {
    errors.title = 'Please add a short headline for your stay experience.';
  }

  if (!input.experience.trim() || input.experience.trim().length < 15) {
    errors.experience = 'Please share at least 15 characters describing your stay.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function getLocationQuery(resortAddress: string, googleMapsQuery: string): string | null {
  const preferred = googleMapsQuery.trim() || resortAddress.trim();
  return preferred.length > 0 ? preferred : null;
}

export function buildGoogleMapsEmbedUrl(locationQuery: string): string | null {
  const trimmed = locationQuery.trim();
  if (!trimmed) return null;
  return `https://maps.google.com/maps?q=${encodeURIComponent(trimmed)}&output=embed`;
}

export function buildGoogleMapsDirectionsUrl(locationQuery: string): string | null {
  const trimmed = locationQuery.trim();
  if (!trimmed) return null;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(trimmed)}`;
}

export function buildGoogleMapsSearchUrl(locationQuery: string): string | null {
  const trimmed = locationQuery.trim();
  if (!trimmed) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`;
}

export function buildFormattedContactInquiry(input: ContactFormInput): string {
  return [
    'GUEST INQUIRY — HOME SWEET HOME RESORT',
    '',
    `Name: ${input.fullName.trim()}`,
    `Email: ${input.email.trim()}`,
    `Phone: ${input.phoneNumber.trim()}`,
    `Subject: ${input.subject.trim()}`,
    '',
    'Message:',
    input.message.trim(),
  ].join('\n');
}

export function buildMailtoHref(
  resortEmail: string,
  input: ContactFormInput
): string | null {
  const target = resortEmail.trim();
  if (!target || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(target)) {
    return null;
  }
  const subject = encodeURIComponent(`[Website Inquiry] ${input.subject.trim()}`);
  const body = encodeURIComponent(buildFormattedContactInquiry(input));
  return `mailto:${target}?subject=${subject}&body=${body}`;
}

export function normalizeExternalUrl(rawUrl: string): string | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}
