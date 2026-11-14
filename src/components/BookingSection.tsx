import { useState } from 'react';
import {
  AlertCircle,
  Calendar,
  Check,
  Copy,
  MessageCircle,
  Phone,
  SlidersHorizontal,
} from 'lucide-react';
import { ROOM_CATEGORIES, ResortConfig, RoomCategoryId } from '../data/resortData';
import {
  addDaysToDateString,
  BookingFormInput,
  buildWhatsAppBookingMessage,
  buildWhatsAppUrl,
  calculateNights,
  calculateTotalPrice,
  formatNaira,
  getTodayDateString,
  validateBookingRequest,
} from '../utils/booking';

interface BookingSectionProps {
  form: BookingFormInput;
  onChangeForm: (updater: (prev: BookingFormInput) => BookingFormInput) => void;
  config: ResortConfig;
  onUpdateWhatsAppNumber: (phone: string) => void;
  onOpenConfig: () => void;
}

export function BookingSection({
  form,
  onChangeForm,
  config,
  onUpdateWhatsAppNumber,
  onOpenConfig,
}: BookingSectionProps) {
  const [submittedAttempt, setSubmittedAttempt] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [whatsappNotice, setWhatsappNotice] = useState<string | null>(null);
  const [editingNumber, setEditingNumber] = useState(false);

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

  const whatsappUrl =
    validation.isValid && nights !== null
      ? buildWhatsAppUrl(
          config.whatsappNumber,
          buildWhatsAppBookingMessage(form, selectedRoom, nights, totalAmount)
        )
      : null;

  const handleContinueWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedAttempt(true);
    setWhatsappNotice(null);

    if (!validation.isValid || nights === null) {
      setWhatsappNotice('Please review the highlighted booking fields above before continuing.');
      return;
    }

    const url = buildWhatsAppUrl(
      config.whatsappNumber,
      buildWhatsAppBookingMessage(form, selectedRoom, nights, totalAmount)
    );

    if (!url) {
      setEditingNumber(true);
      setWhatsappNotice(
        'Please enter the resort WhatsApp number below to launch WhatsApp with your reservation request.'
      );
      return;
    }

    // Open WhatsApp reservation request link cleanly without window.open popup blocking surprises
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.click();
    setWhatsappNotice(
      'Your WhatsApp reservation request draft is ready. Remember: availability is only confirmed once verified by our desk.'
    );
  };

  const handleCopyMessage = async () => {
    if (!previewMessage) return;
    try {
      await navigator.clipboard.writeText(previewMessage);
      setCopiedMessage(true);
      window.setTimeout(() => setCopiedMessage(false), 2500);
    } catch {
      setWhatsappNotice('Copy unavailable in this browser; please select the preview text directly.');
    }
  };

  return (
    <section
      id="booking"
      aria-labelledby="booking-heading"
      className="scroll-mt-20 py-20 sm:py-28 bg-[#F8F5EF] dark:bg-[#181715] transition-colors duration-300"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="h-px w-10 bg-[#C5A46D]" aria-hidden="true" />
            <span className="text-xs font-semibold tracking-[0.24em] uppercase text-[#A4834C] dark:text-[#C5A46D]">
              Reservations
            </span>
          </div>

          <h2
            id="booking-heading"
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#242424] dark:text-[#F8F5EF]"
          >
            Request Your Stay
          </h2>

          <p className="mt-4 text-base text-[#242424]/75 dark:text-[#F8F5EF]/75 leading-relaxed">
            Select your preferred room category and dates to calculate your accommodation total and
            send a direct reservation request to our front desk.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left: Functional Booking Form */}
          <form
            onSubmit={handleContinueWhatsApp}
            noValidate
            className="lg:col-span-7 rounded-2xl bg-[#FFFFFF] dark:bg-[#242424] border border-[#242424]/10 dark:border-[#F8F5EF]/10 p-6 sm:p-8 shadow-sm"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="sm:col-span-1">
                <label
                  htmlFor="booking-fullname"
                  className="block text-xs font-semibold tracking-wider uppercase text-[#242424]/80 dark:text-[#F8F5EF]/80 mb-2"
                >
                  Full Name <span className="text-[#A4834C]">*</span>
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
                  className="w-full rounded-md border border-[#242424]/20 dark:border-[#F8F5EF]/20 bg-[#F8F5EF]/50 dark:bg-[#181715] px-4 py-3 text-sm text-[#242424] dark:text-[#F8F5EF] placeholder:text-[#242424]/40 dark:placeholder:text-[#F8F5EF]/40 focus:border-[#C5A46D] focus:outline-none"
                />
                {submittedAttempt && validation.errors.fullName && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-700 dark:text-red-300">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{validation.errors.fullName}</span>
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="sm:col-span-1">
                <label
                  htmlFor="booking-phone"
                  className="block text-xs font-semibold tracking-wider uppercase text-[#242424]/80 dark:text-[#F8F5EF]/80 mb-2"
                >
                  Phone Number <span className="text-[#A4834C]">*</span>
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
                  className="w-full rounded-md border border-[#242424]/20 dark:border-[#F8F5EF]/20 bg-[#F8F5EF]/50 dark:bg-[#181715] px-4 py-3 text-sm text-[#242424] dark:text-[#F8F5EF] placeholder:text-[#242424]/40 dark:placeholder:text-[#F8F5EF]/40 focus:border-[#C5A46D] focus:outline-none"
                />
                {submittedAttempt && validation.errors.phoneNumber && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-700 dark:text-red-300">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{validation.errors.phoneNumber}</span>
                  </p>
                )}
              </div>

              {/* Email (optional) */}
              <div className="sm:col-span-1">
                <label
                  htmlFor="booking-email"
                  className="block text-xs font-semibold tracking-wider uppercase text-[#242424]/80 dark:text-[#F8F5EF]/80 mb-2"
                >
                  Email Address{' '}
                  <span className="font-normal normal-case text-[#242424]/50 dark:text-[#F8F5EF]/50">
                    (Optional)
                  </span>
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
                  className="w-full rounded-md border border-[#242424]/20 dark:border-[#F8F5EF]/20 bg-[#F8F5EF]/50 dark:bg-[#181715] px-4 py-3 text-sm text-[#242424] dark:text-[#F8F5EF] placeholder:text-[#242424]/40 dark:placeholder:text-[#F8F5EF]/40 focus:border-[#C5A46D] focus:outline-none"
                />
                {submittedAttempt && validation.errors.email && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-700 dark:text-red-300">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{validation.errors.email}</span>
                  </p>
                )}
              </div>

              {/* Room Category */}
              <div className="sm:col-span-1">
                <label
                  htmlFor="booking-room"
                  className="block text-xs font-semibold tracking-wider uppercase text-[#242424]/80 dark:text-[#F8F5EF]/80 mb-2"
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
                  className="w-full rounded-md border border-[#242424]/20 dark:border-[#F8F5EF]/20 bg-[#F8F5EF]/50 dark:bg-[#181715] px-4 py-3 text-sm text-[#242424] dark:text-[#F8F5EF] focus:border-[#C5A46D] focus:outline-none"
                >
                  {ROOM_CATEGORIES.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} ({formatNaira(room.nightlyRate)}/nt)
                    </option>
                  ))}
                </select>
              </div>

              {/* Check-in Date */}
              <div>
                <label
                  htmlFor="booking-checkin"
                  className="block text-xs font-semibold tracking-wider uppercase text-[#242424]/80 dark:text-[#F8F5EF]/80 mb-2"
                >
                  Check-in Date <span className="text-[#A4834C]">*</span>
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
                  className="w-full rounded-md border border-[#242424]/20 dark:border-[#F8F5EF]/20 bg-[#F8F5EF]/50 dark:bg-[#181715] px-4 py-3 text-sm text-[#242424] dark:text-[#F8F5EF] focus:border-[#C5A46D] focus:outline-none"
                />
                {validation.errors.checkIn && (submittedAttempt || form.checkIn) && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-700 dark:text-red-300">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{validation.errors.checkIn}</span>
                  </p>
                )}
              </div>

              {/* Check-out Date */}
              <div>
                <label
                  htmlFor="booking-checkout"
                  className="block text-xs font-semibold tracking-wider uppercase text-[#242424]/80 dark:text-[#F8F5EF]/80 mb-2"
                >
                  Check-out Date <span className="text-[#A4834C]">*</span>
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
                  className="w-full rounded-md border border-[#242424]/20 dark:border-[#F8F5EF]/20 bg-[#F8F5EF]/50 dark:bg-[#181715] px-4 py-3 text-sm text-[#242424] dark:text-[#F8F5EF] focus:border-[#C5A46D] focus:outline-none"
                />
                {validation.errors.checkOut && (submittedAttempt || form.checkOut) && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-700 dark:text-red-300">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{validation.errors.checkOut}</span>
                  </p>
                )}
              </div>

              {/* Guests */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="booking-guests"
                  className="block text-xs font-semibold tracking-wider uppercase text-[#242424]/80 dark:text-[#F8F5EF]/80 mb-2"
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
                  className="w-full sm:w-44 rounded-md border border-[#242424]/20 dark:border-[#F8F5EF]/20 bg-[#F8F5EF]/50 dark:bg-[#181715] px-4 py-3 text-sm text-[#242424] dark:text-[#F8F5EF] tabular-nums focus:border-[#C5A46D] focus:outline-none"
                />
                {validation.errors.guests && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-700 dark:text-red-300">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{validation.errors.guests}</span>
                  </p>
                )}
              </div>

              {/* Special Requests */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="booking-requests"
                  className="block text-xs font-semibold tracking-wider uppercase text-[#242424]/80 dark:text-[#F8F5EF]/80 mb-2"
                >
                  Special Requests
                </label>
                <textarea
                  id="booking-requests"
                  rows={3}
                  placeholder="Preferred arrival time or special notes for our hospitality desk"
                  value={form.specialRequests}
                  onChange={(e) =>
                    onChangeForm((prev) => ({ ...prev, specialRequests: e.target.value }))
                  }
                  className="w-full rounded-md border border-[#242424]/20 dark:border-[#F8F5EF]/20 bg-[#F8F5EF]/50 dark:bg-[#181715] px-4 py-3 text-sm text-[#242424] dark:text-[#F8F5EF] placeholder:text-[#242424]/40 dark:placeholder:text-[#F8F5EF]/40 focus:border-[#C5A46D] focus:outline-none"
                />
              </div>
            </div>

            {whatsappNotice && (
              <div
                role="status"
                className="mt-5 rounded-lg border border-[#C5A46D]/40 bg-[#E8D9BD]/35 dark:bg-[#181715] px-4 py-3 text-xs sm:text-sm text-[#242424] dark:text-[#F8F5EF]"
              >
                {whatsappNotice}
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="flex-1 inline-flex items-center justify-center gap-2.5 rounded-md bg-[#242424] dark:bg-[#C5A46D] px-6 py-3.5 text-sm font-semibold tracking-wide text-[#F8F5EF] dark:text-[#181715] hover:bg-[#3a3834] dark:hover:bg-[#d4b680] transition-colors"
              >
                <MessageCircle className="h-4 w-4 text-[#C5A46D] dark:text-[#181715]" />
                <span>Continue on WhatsApp</span>
              </button>

              {previewMessage && (
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-[#242424]/20 dark:border-[#F8F5EF]/20 px-5 py-3.5 text-xs font-semibold text-[#242424] dark:text-[#F8F5EF] hover:border-[#C5A46D] transition-colors whitespace-nowrap"
                >
                  {copiedMessage ? (
                    <>
                      <Check className="h-4 w-4 text-[#84917A]" />
                      <span>Copied Summary</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 text-[#C5A46D]" />
                      <span>Copy Summary</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Right: Live Price Breakdown & WhatsApp Destination Configuration */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="rounded-2xl bg-[#FFFFFF] dark:bg-[#242424] border border-[#242424]/10 dark:border-[#F8F5EF]/10 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#242424]/10 dark:border-[#F8F5EF]/10">
                <div>
                  <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#A4834C] dark:text-[#C5A46D]">
                    Stay Summary
                  </p>
                  <h3 className="font-serif text-2xl font-medium text-[#242424] dark:text-[#F8F5EF] mt-1">
                    {selectedRoom.name}
                  </h3>
                </div>
                <Calendar className="h-5 w-5 text-[#C5A46D]" />
              </div>

              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-[#242424]/70 dark:text-[#F8F5EF]/70">Nightly Rate</dt>
                  <dd className="font-medium text-[#242424] dark:text-[#F8F5EF] tabular-nums">
                    {formatNaira(selectedRoom.nightlyRate)}
                  </dd>
                </div>

                <div className="flex items-center justify-between">
                  <dt className="text-[#242424]/70 dark:text-[#F8F5EF]/70">Duration</dt>
                  <dd className="font-medium text-[#242424] dark:text-[#F8F5EF] tabular-nums">
                    {nights !== null
                      ? `${nights} ${nights === 1 ? 'night' : 'nights'}`
                      : 'Select valid dates'}
                  </dd>
                </div>

                <div className="flex items-center justify-between">
                  <dt className="text-[#242424]/70 dark:text-[#F8F5EF]/70">Guests</dt>
                  <dd className="font-medium text-[#242424] dark:text-[#F8F5EF] tabular-nums">
                    {form.guests > 0 ? form.guests : '—'}
                  </dd>
                </div>

                <div className="pt-4 border-t border-[#242424]/10 dark:border-[#F8F5EF]/10 flex items-baseline justify-between">
                  <dt className="font-medium text-[#242424] dark:text-[#F8F5EF]">
                    Estimated Accommodation Total
                  </dt>
                  <dd className="font-serif text-3xl font-semibold text-[#A4834C] dark:text-[#C5A46D] tabular-nums">
                    {nights !== null ? formatNaira(totalAmount) : '—'}
                  </dd>
                </div>
              </dl>

              <p className="mt-4 text-xs leading-relaxed text-[#242424]/65 dark:text-[#F8F5EF]/65">
                Calculated solely from confirmed nightly room rates. Generating a WhatsApp inquiry
                submits a reservation request and does not constitute a confirmed booking until
                confirmed by the resort.
              </p>
            </div>

            {/* Editable WhatsApp Configuration Card */}
            <div className="rounded-2xl bg-[#E8D9BD]/35 dark:bg-[#242424] border border-[#C5A46D]/30 p-6">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#A4834C] dark:text-[#C5A46D]" />
                  <h3 className="font-sans text-xs font-semibold tracking-[0.18em] uppercase text-[#242424] dark:text-[#F8F5EF]">
                    Resort WhatsApp Desk
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingNumber((prev) => !prev)}
                  className="text-xs font-medium text-[#A4834C] dark:text-[#C5A46D] hover:underline"
                >
                  {editingNumber ? 'Done' : config.whatsappNumber ? 'Edit Number' : 'Configure'}
                </button>
              </div>

              {editingNumber || !config.whatsappNumber ? (
                <div className="mt-3 space-y-2.5">
                  <label
                    htmlFor="resort-whatsapp-config"
                    className="block text-xs text-[#242424]/75 dark:text-[#F8F5EF]/75 leading-relaxed"
                  >
                    Enter the resort&apos;s official WhatsApp number (with country code, e.g.
                    +234...) to enable direct launch:
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="resort-whatsapp-config"
                      type="tel"
                      placeholder="+234 ..."
                      value={config.whatsappNumber}
                      onChange={(e) => onUpdateWhatsAppNumber(e.target.value)}
                      className="flex-1 rounded-md border border-[#242424]/20 dark:border-[#F8F5EF]/20 bg-[#FFFFFF] dark:bg-[#181715] px-3 py-2 text-sm text-[#242424] dark:text-[#F8F5EF] focus:border-[#C5A46D] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={onOpenConfig}
                      aria-label="Open full Property Setup"
                      className="inline-flex items-center gap-1 rounded-md border border-[#242424]/20 dark:border-[#F8F5EF]/20 bg-[#FFFFFF] dark:bg-[#181715] px-3 py-2 text-xs font-medium text-[#242424] dark:text-[#F8F5EF] hover:border-[#C5A46D]"
                    >
                      <SlidersHorizontal className="h-3.5 w-3.5 text-[#C5A46D]" />
                      <span>All Settings</span>
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[#242424]/80 dark:text-[#F8F5EF]/80 tabular-nums">
                  Configured destination: <span className="font-semibold">{config.whatsappNumber}</span>
                </p>
              )}

              {previewMessage && (
                <div className="mt-4 pt-4 border-t border-[#242424]/10 dark:border-[#F8F5EF]/10">
                  <p className="text-xs font-semibold tracking-wider uppercase text-[#242424]/65 dark:text-[#F8F5EF]/65 mb-2">
                    WhatsApp Message Preview
                  </p>
                  <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-[#242424]/80 dark:text-[#F8F5EF]/80 rounded-lg bg-[#FFFFFF]/80 dark:bg-[#181715]/80 p-3.5 border border-[#242424]/8 dark:border-[#F8F5EF]/10">
                    {previewMessage}
                  </pre>
                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#A4834C] dark:text-[#C5A46D] hover:underline"
                    >
                      <span>Open direct WhatsApp link</span>
                      <span aria-hidden="true">&rarr;</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
