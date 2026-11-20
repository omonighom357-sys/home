import { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  Check,
  Copy,
  ShieldCheck,
} from 'lucide-react';
import { ROOM_CATEGORIES, ResortProfile, RoomCategoryId } from '../data/resortData';
import {
  addDaysToDateString,
  BookingFormInput,
  buildWhatsAppBookingMessage,
  buildWhatsAppShareUrl,
  calculateNights,
  calculateTotalPrice,
  formatNaira,
  getTodayDateString,
  validateBookingRequest,
} from '../utils/booking';

interface BookingSectionProps {
  form: BookingFormInput;
  onChangeForm: (updater: (prev: BookingFormInput) => BookingFormInput) => void;
  profile: ResortProfile;
}

export function BookingSection({ form, onChangeForm, profile }: BookingSectionProps) {
  const [submittedAttempt, setSubmittedAttempt] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [bookingNotice, setBookingNotice] = useState<string | null>(null);

  const today = getTodayDateString();
  const minCheckOut = form.checkIn
    ? addDaysToDateString(form.checkIn, 1)
    : addDaysToDateString(today, 1);

  const selectedRoom =
    ROOM_CATEGORIES.find((r) => r.id === form.roomId) ?? ROOM_CATEGORIES[0];

  const validation = validateBookingRequest(form, today);
  const nights = calculateNights(form.checkIn, form.checkOut);
  const totalAmount = nights ? calculateTotalPrice(selectedRoom.nightlyRate, nights) : 0;

  const previewMessage =
    nights !== null
      ? buildWhatsAppBookingMessage(
          {
            ...form,
            fullName: form.fullName.trim() || '[Guest Full Name]',
            phoneNumber: form.phoneNumber.trim() || '[Guest Phone Number]',
          },
          selectedRoom,
          nights,
          totalAmount
        )
      : '';

  const validRequestMessage =
    validation.isValid && nights !== null
      ? buildWhatsAppBookingMessage(form, selectedRoom, nights, totalAmount)
      : '';

  const handleSubmitReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedAttempt(true);
    setBookingNotice(null);

    if (!validation.isValid || nights === null || !validRequestMessage) {
      setBookingNotice('Please review the highlighted booking fields above before submitting.');
      return;
    }

    const reservationDispatchUrl = buildWhatsAppShareUrl(
      profile.whatsappNumber,
      validRequestMessage
    );

    const anchor = document.createElement('a');
    anchor.href = reservationDispatchUrl;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.click();

    setBookingNotice(
      'Your direct reservation request has been prepared and dispatched to our reservations desk for confirmation.'
    );
  };

  const handleCopyMessage = async () => {
    if (!previewMessage) return;
    try {
      await navigator.clipboard.writeText(previewMessage);
      setCopiedMessage(true);
      window.setTimeout(() => setCopiedMessage(false), 2500);
    } catch {
      setBookingNotice('Copy unavailable in this browser; please select the summary text below.');
    }
  };

  return (
    <section
      id="booking"
      aria-labelledby="booking-heading"
      className="scroll-mt-20 py-20 sm:py-28 lg:py-32 bg-[#F9F6F0] text-[#000000] border-t border-[#C9A227]/25"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12 sm:mb-14">
          <div className="flex items-center gap-4 mb-4">
            <span className="h-px w-10 bg-[#C9A227]" aria-hidden="true" />
            <span className="font-sans text-xs font-semibold tracking-[0.26em] uppercase text-[#C9A227]">
              — Reservations
            </span>
          </div>

          <h2
            id="booking-heading"
            className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-[#000000]"
          >
            Your Stay Begins{' '}
            <span className="font-editorial italic text-[#C9A227]">With a Message.</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-[#000000]/75 leading-relaxed">
            Select your room tier and travel dates below for an instant rate calculation across our
            four official categories and send your reservation request directly to our team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left: Reservation Form */}
          <form
            onSubmit={handleSubmitReservation}
            noValidate
            className="lg:col-span-7 rounded-2xl bg-[#FFFFFF] border border-[#C9A227]/35 p-6 sm:p-8 shadow-sm"
          >
            {/* Room Tier Selector Pills */}
            <div className="mb-6">
              <p className="text-xs font-semibold tracking-wider uppercase text-[#000000]/80 mb-2.5">
                Choose Suite Tier
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {ROOM_CATEGORIES.map((room) => {
                  const isSelected = form.roomId === room.id;
                  return (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() =>
                        onChangeForm((prev) => ({
                          ...prev,
                          roomId: room.id,
                        }))
                      }
                      aria-pressed={isSelected}
                      className={`rounded-xl border px-3.5 py-2.5 text-left transition-all ${
                        isSelected
                          ? 'border-[#C9A227] bg-[#000000] text-[#FFFFFF] shadow-sm'
                          : 'border-[#000000]/15 bg-[#F9F6F0] text-[#000000] hover:border-[#C9A227]'
                      }`}
                    >
                      <span className="block font-serif text-sm font-medium truncate">
                        {room.name}
                      </span>
                      <span
                        className={`block text-xs font-semibold tabular-nums mt-0.5 ${
                          isSelected ? 'text-[#D4AF37]' : 'text-[#C9A227]'
                        }`}
                      >
                        {formatNaira(room.nightlyRate)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="booking-fullname"
                  className="block text-xs font-semibold tracking-wider uppercase text-[#000000]/80 mb-2"
                >
                  Full Name <span className="text-[#C9A227]">*</span>
                </label>
                <input
                  id="booking-fullname"
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={form.fullName}
                  onChange={(e) =>
                    onChangeForm((prev) => ({ ...prev, fullName: e.target.value }))
                  }
                  aria-invalid={Boolean(submittedAttempt && validation.errors.fullName)}
                  className="w-full rounded-md border border-[#000000]/20 bg-[#F9F6F0]/60 px-4 py-3 text-sm text-[#000000] placeholder:text-[#000000]/40 focus:border-[#C9A227] focus:outline-none"
                />
                {submittedAttempt && validation.errors.fullName && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-700">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{validation.errors.fullName}</span>
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="booking-phone"
                  className="block text-xs font-semibold tracking-wider uppercase text-[#000000]/80 mb-2"
                >
                  Phone Number <span className="text-[#C9A227]">*</span>
                </label>
                <input
                  id="booking-phone"
                  type="tel"
                  required
                  placeholder="e.g. +234 803 000 0000"
                  value={form.phoneNumber}
                  onChange={(e) =>
                    onChangeForm((prev) => ({ ...prev, phoneNumber: e.target.value }))
                  }
                  aria-invalid={Boolean(submittedAttempt && validation.errors.phoneNumber)}
                  className="w-full rounded-md border border-[#000000]/20 bg-[#F9F6F0]/60 px-4 py-3 text-sm text-[#000000] placeholder:text-[#000000]/40 focus:border-[#C9A227] focus:outline-none"
                />
                {submittedAttempt && validation.errors.phoneNumber && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-700">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{validation.errors.phoneNumber}</span>
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="booking-email"
                  className="block text-xs font-semibold tracking-wider uppercase text-[#000000]/80 mb-2"
                >
                  Email Address{' '}
                  <span className="font-normal normal-case text-[#000000]/50">(Optional)</span>
                </label>
                <input
                  id="booking-email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) =>
                    onChangeForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  aria-invalid={Boolean(submittedAttempt && validation.errors.email)}
                  className="w-full rounded-md border border-[#000000]/20 bg-[#F9F6F0]/60 px-4 py-3 text-sm text-[#000000] placeholder:text-[#000000]/40 focus:border-[#C9A227] focus:outline-none"
                />
                {submittedAttempt && validation.errors.email && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-700">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{validation.errors.email}</span>
                  </p>
                )}
              </div>

              {/* Room Category Select */}
              <div>
                <label
                  htmlFor="booking-room"
                  className="block text-xs font-semibold tracking-wider uppercase text-[#000000]/80 mb-2"
                >
                  Room Category
                </label>
                <select
                  id="booking-room"
                  value={form.roomId}
                  onChange={(e) =>
                    onChangeForm((prev) => ({
                      ...prev,
                      roomId: e.target.value as RoomCategoryId,
                    }))
                  }
                  className="w-full rounded-md border border-[#000000]/20 bg-[#F9F6F0]/60 px-4 py-3 text-sm text-[#000000] focus:border-[#C9A227] focus:outline-none"
                >
                  {ROOM_CATEGORIES.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} ({formatNaira(room.nightlyRate)}/night)
                    </option>
                  ))}
                </select>
              </div>

              {/* Check-in Date */}
              <div>
                <label
                  htmlFor="booking-checkin"
                  className="block text-xs font-semibold tracking-wider uppercase text-[#000000]/80 mb-2"
                >
                  Check-in Date <span className="text-[#C9A227]">*</span>
                </label>
                <input
                  id="booking-checkin"
                  type="date"
                  min={today}
                  value={form.checkIn}
                  onChange={(e) => {
                    const nextIn = e.target.value;
                    onChangeForm((prev) => ({
                      ...prev,
                      checkIn: nextIn,
                      checkOut:
                        prev.checkOut && prev.checkOut > nextIn
                          ? prev.checkOut
                          : addDaysToDateString(nextIn, 1),
                    }));
                  }}
                  aria-invalid={Boolean(
                    (submittedAttempt || form.checkIn) && validation.errors.checkIn
                  )}
                  className="w-full rounded-md border border-[#000000]/20 bg-[#F9F6F0]/60 px-4 py-3 text-sm text-[#000000] focus:border-[#C9A227] focus:outline-none"
                />
                {validation.errors.checkIn && (submittedAttempt || form.checkIn) && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-700">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{validation.errors.checkIn}</span>
                  </p>
                )}
              </div>

              {/* Check-out Date */}
              <div>
                <label
                  htmlFor="booking-checkout"
                  className="block text-xs font-semibold tracking-wider uppercase text-[#000000]/80 mb-2"
                >
                  Check-out Date <span className="text-[#C9A227]">*</span>
                </label>
                <input
                  id="booking-checkout"
                  type="date"
                  min={minCheckOut}
                  value={form.checkOut}
                  onChange={(e) =>
                    onChangeForm((prev) => ({ ...prev, checkOut: e.target.value }))
                  }
                  aria-invalid={Boolean(
                    (submittedAttempt || form.checkOut) && validation.errors.checkOut
                  )}
                  className="w-full rounded-md border border-[#000000]/20 bg-[#F9F6F0]/60 px-4 py-3 text-sm text-[#000000] focus:border-[#C9A227] focus:outline-none"
                />
                {validation.errors.checkOut && (submittedAttempt || form.checkOut) && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-700">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{validation.errors.checkOut}</span>
                  </p>
                )}
              </div>

              {/* Guests */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="booking-guests"
                  className="block text-xs font-semibold tracking-wider uppercase text-[#000000]/80 mb-2"
                >
                  Number of Guests
                </label>
                <input
                  id="booking-guests"
                  type="number"
                  min={1}
                  max={20}
                  value={Number.isNaN(form.guests) ? '' : form.guests}
                  onChange={(e) =>
                    onChangeForm((prev) => ({
                      ...prev,
                      guests: e.target.value === '' ? 0 : Number(e.target.value),
                    }))
                  }
                  aria-invalid={Boolean(validation.errors.guests)}
                  className="w-full sm:w-44 rounded-md border border-[#000000]/20 bg-[#F9F6F0]/60 px-4 py-3 text-sm text-[#000000] tabular-nums focus:border-[#C9A227] focus:outline-none"
                />
                {validation.errors.guests && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-700">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{validation.errors.guests}</span>
                  </p>
                )}
              </div>

              {/* Special Requests */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="booking-requests"
                  className="block text-xs font-semibold tracking-wider uppercase text-[#000000]/80 mb-2"
                >
                  Special Requests
                </label>
                <textarea
                  id="booking-requests"
                  rows={3}
                  placeholder="Preferred arrival time or notes for our hospitality team"
                  value={form.specialRequests}
                  onChange={(e) =>
                    onChangeForm((prev) => ({ ...prev, specialRequests: e.target.value }))
                  }
                  className="w-full rounded-md border border-[#000000]/20 bg-[#F9F6F0]/60 px-4 py-3 text-sm text-[#000000] placeholder:text-[#000000]/40 focus:border-[#C9A227] focus:outline-none"
                />
              </div>
            </div>

            {bookingNotice && (
              <div
                role="status"
                className="mt-5 rounded-xl border border-[#C9A227] bg-[#F9F6F0] px-4 py-3 text-xs sm:text-sm text-[#000000]"
              >
                {bookingNotice}
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="group flex-1 inline-flex items-center justify-center gap-2.5 rounded-full bg-[#C9A227] hover:bg-[#D4AF37] px-7 py-4 text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase text-[#000000] transition-all hover:scale-[1.01] active:scale-[0.98]"
              >
                <span>Complete Reservation</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              {previewMessage && (
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#000000]/20 hover:border-[#C9A227] px-5 py-4 text-xs font-semibold tracking-[0.12em] uppercase text-[#000000] transition-colors whitespace-nowrap"
                >
                  {copiedMessage ? (
                    <>
                      <Check className="h-4 w-4 text-[#C9A227]" />
                      <span>Copied Summary</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 text-[#C9A227]" />
                      <span>Copy Summary</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Right: Stay Price Breakdown & Prepared Summary */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="rounded-2xl bg-[#000000] text-[#F9F6F0] border border-[#C9A227]/40 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#F9F6F0]/15">
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#C9A227]">
                    Stay Summary
                  </p>
                  <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#FFFFFF] mt-1">
                    {selectedRoom.name}
                  </h3>
                </div>
                <Calendar className="h-5 w-5 text-[#D4AF37]" />
              </div>

              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-[#F9F6F0]/70">Nightly Rate</dt>
                  <dd className="font-medium text-[#FFFFFF] tabular-nums">
                    {formatNaira(selectedRoom.nightlyRate)}
                  </dd>
                </div>

                <div className="flex items-center justify-between">
                  <dt className="text-[#F9F6F0]/70">Duration</dt>
                  <dd className="font-medium text-[#FFFFFF] tabular-nums">
                    {nights !== null
                      ? `${nights} ${nights === 1 ? 'night' : 'nights'}`
                      : 'Select valid dates'}
                  </dd>
                </div>

                <div className="flex items-center justify-between">
                  <dt className="text-[#F9F6F0]/70">Guests</dt>
                  <dd className="font-medium text-[#FFFFFF] tabular-nums">
                    {form.guests > 0 ? form.guests : '—'}
                  </dd>
                </div>

                <div className="pt-4 border-t border-[#F9F6F0]/15 flex items-baseline justify-between">
                  <dt className="font-medium text-[#F9F6F0]">
                    Estimated Total
                  </dt>
                  <dd className="font-serif text-3xl font-semibold text-[#D4AF37] tabular-nums">
                    {nights !== null ? formatNaira(totalAmount) : '—'}
                  </dd>
                </div>
              </dl>

              <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-[#F9F6F0]/65">
                <ShieldCheck className="h-4 w-4 text-[#C9A227] shrink-0 mt-0.5" />
                <span>
                  Calculated strictly from official nightly suite rates. Submitting prepares a direct
                  reservation request for confirmation by our guest desk.
                </span>
              </p>
            </div>

            {previewMessage && (
              <div className="rounded-2xl bg-[#FFFFFF] border border-[#C9A227]/35 p-6">
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C9A227] mb-3">
                  Reservation Summary Preview
                </p>

                <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-[#000000]/80 rounded-lg bg-[#F9F6F0] p-4 border border-[#000000]/10">
                  {previewMessage}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
