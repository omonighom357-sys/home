import { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import { motion } from 'motion/react';
import { RESORT_LOCATION, RESORT_NAME, ResortProfile } from '../data/resortData';
import {
  buildFormattedContactInquiry,
  buildGoogleMapsDirectionsUrl,
  buildGoogleMapsEmbedUrl,
  buildGoogleMapsSearchUrl,
  buildMailtoHref,
  ContactFormInput,
  getLocationQuery,
  validateContactForm,
} from '../utils/contact';

interface ContactSectionProps {
  profile: ResortProfile;
}

const INITIAL_CONTACT_FORM: ContactFormInput = {
  fullName: '',
  email: '',
  phoneNumber: '',
  subject: '',
  message: '',
};

export function ContactSection({ profile }: ContactSectionProps) {
  const [form, setForm] = useState<ContactFormInput>(INITIAL_CONTACT_FORM);
  const [submittedAttempt, setSubmittedAttempt] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [preparedInquiry, setPreparedInquiry] = useState<string | null>(null);
  const [copiedInquiry, setCopiedInquiry] = useState(false);

  const validation = validateContactForm(form);
  const locationQuery =
    getLocationQuery(profile.resortAddress, profile.googleMapsQuery) ||
    RESORT_LOCATION.geocodeQuery;
  const mapEmbedUrl = buildGoogleMapsEmbedUrl(locationQuery);
  const directionsUrl = buildGoogleMapsDirectionsUrl(locationQuery);
  const mapsSearchUrl = buildGoogleMapsSearchUrl(locationQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedAttempt(true);
    setPreparedInquiry(null);

    if (!validation.isValid) {
      return;
    }

    setIsPreparing(true);
    window.setTimeout(() => {
      setIsPreparing(false);
      setPreparedInquiry(buildFormattedContactInquiry(form));
    }, 220);
  };

  const handleCopyInquiry = async () => {
    if (!preparedInquiry) return;
    try {
      await navigator.clipboard.writeText(preparedInquiry);
      setCopiedInquiry(true);
      window.setTimeout(() => setCopiedInquiry(false), 2500);
    } catch {
      // Clipboard blocked in restricted context; summary stays visible & selectable
    }
  };

  const mailtoHref = preparedInquiry ? buildMailtoHref(profile.contactEmail, form) : null;

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-20 py-20 sm:py-28 lg:py-32 bg-[#FFFFFF] text-[#000000] border-t border-[#C9A227]/25"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12 sm:mb-14">
          <div className="flex items-center gap-4 mb-4">
            <span className="h-px w-10 bg-[#C9A227]" aria-hidden="true" />
            <span className="font-sans text-xs font-semibold tracking-[0.26em] uppercase text-[#C9A227]">
              — Location &amp; Arrival
            </span>
          </div>

          <h2
            id="contact-heading"
            className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-[#000000]"
          >
            Find &amp; Reach{' '}
            <span className="font-editorial italic text-[#C9A227]">Our Resort</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-[#000000]/75 leading-relaxed">
            Explore our exact location in {RESORT_LOCATION.lga}, inspect arrival directions, or send
            an on-site inquiry directly to our guest hospitality desk.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left 5 Cols: Interactive Embedded Map + Verified Official Address */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            <div className="rounded-2xl bg-[#F9F6F0] border border-[#C9A227]/35 overflow-hidden shadow-sm">
              <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-[#000000]/10">
                <div className="flex items-center gap-2.5 min-w-0">
                  <MapPin className="h-4 w-4 text-[#C9A227] shrink-0" />
                  <p className="font-serif text-base font-medium text-[#000000] truncate">
                    {RESORT_LOCATION.propertyName}
                  </p>
                </div>
                {mapsSearchUrl && (
                  <a
                    href={mapsSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#C9A227] hover:underline whitespace-nowrap shrink-0"
                  >
                    <span>Expand Map</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              {mapEmbedUrl && (
                <div className="aspect-[16/11] w-full bg-[#F9F6F0]">
                  <iframe
                    title="Home Sweet Home Resort Udu Location Map"
                    src={mapEmbedUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-full w-full border-0"
                  />
                </div>
              )}

              <div className="p-6 space-y-4">
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#C9A227]">
                    Verified Property Address
                  </p>
                  <address className="not-italic mt-1.5 text-sm leading-relaxed text-[#000000]">
                    <span className="font-semibold block">{RESORT_LOCATION.propertyName}</span>
                    {RESORT_LOCATION.streetLine} {RESORT_LOCATION.roadLine}
                    <br />
                    {RESORT_LOCATION.landmarkLine} {RESORT_LOCATION.cityPostalLine}
                    <br />
                    {RESORT_LOCATION.stateCountryLine}
                  </address>
                  <p className="mt-2.5 border-l-2 border-[#C9A227] pl-3 text-xs font-semibold tracking-[0.14em] uppercase text-[#000000]/85">
                    {RESORT_LOCATION.lga}
                  </p>
                </div>

                {directionsUrl && (
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#C9A227] hover:bg-[#D4AF37] px-6 py-3 text-xs font-semibold tracking-[0.16em] uppercase text-[#000000] transition-all"
                  >
                    <span>Get Directions</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </a>
                )}
              </div>
            </div>

            {/* Hospitality Desk Card */}
            <div className="rounded-2xl bg-[#000000] text-[#F9F6F0] border border-[#C9A227]/35 p-6 sm:p-7 space-y-4">
              <h3 className="font-serif text-2xl font-medium text-[#FFFFFF]">
                Direct Hospitality Desk
              </h3>

              <p className="text-xs sm:text-sm leading-relaxed text-[#F9F6F0]/75">
                Our guest desk provides prompt guidance on room categories across Deluxe, Super
                Deluxe, Elite, and Super Elite stays as well as directions along Udu Road.
              </p>

              <dl className="space-y-3 pt-3 border-t border-[#F9F6F0]/15 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-[#C9A227] mt-1 shrink-0" />
                  <div>
                    <dt className="text-[11px] font-semibold tracking-wider uppercase text-[#C9A227]">
                      Address
                    </dt>
                    <dd className="text-[#F9F6F0]/90">{profile.resortAddress}</dd>
                  </div>
                </div>

                {profile.contactPhone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-[#C9A227] mt-1 shrink-0" />
                    <div>
                      <dt className="text-[11px] font-semibold tracking-wider uppercase text-[#C9A227]">
                        Telephone
                      </dt>
                      <dd className="text-[#F9F6F0]/90 tabular-nums">{profile.contactPhone}</dd>
                    </div>
                  </div>
                )}

                {profile.contactEmail && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 text-[#C9A227] mt-1 shrink-0" />
                    <div>
                      <dt className="text-[11px] font-semibold tracking-wider uppercase text-[#C9A227]">
                        Email
                      </dt>
                      <dd className="text-[#F9F6F0]/90">{profile.contactEmail}</dd>
                    </div>
                  </div>
                )}
              </dl>
            </div>
          </motion.div>

          {/* Right 7 Cols: Validated Direct Inquiry Form */}
          <motion.form
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={handleSubmit}
            noValidate
            className="lg:col-span-7 rounded-2xl bg-[#F9F6F0] border border-[#C9A227]/35 p-6 sm:p-8"
          >
            <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#C9A227] mb-2">
              Guest Assistance
            </p>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#000000] mb-2">
              Send an Inquiry
            </h3>
            <p className="text-sm text-[#000000]/70 mb-6">
              Complete the form below to compose a structured direct inquiry for room stays,
              arrival timing, or group reservations.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="contact-fullname"
                  className="block text-xs font-semibold tracking-wider uppercase text-[#000000]/80 mb-2"
                >
                  Full Name <span className="text-[#C9A227]">*</span>
                </label>
                <input
                  id="contact-fullname"
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={form.fullName}
                  onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                  aria-invalid={Boolean(submittedAttempt && validation.errors.fullName)}
                  className="w-full rounded-md border border-[#000000]/20 bg-[#FFFFFF] px-4 py-3 text-sm text-[#000000] placeholder:text-[#000000]/40 focus:border-[#C9A227] focus:outline-none"
                />
                {submittedAttempt && validation.errors.fullName && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-700">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{validation.errors.fullName}</span>
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-xs font-semibold tracking-wider uppercase text-[#000000]/80 mb-2"
                >
                  Email Address <span className="text-[#C9A227]">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  aria-invalid={Boolean(submittedAttempt && validation.errors.email)}
                  className="w-full rounded-md border border-[#000000]/20 bg-[#FFFFFF] px-4 py-3 text-sm text-[#000000] placeholder:text-[#000000]/40 focus:border-[#C9A227] focus:outline-none"
                />
                {submittedAttempt && validation.errors.email && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-700">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{validation.errors.email}</span>
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-phone"
                  className="block text-xs font-semibold tracking-wider uppercase text-[#000000]/80 mb-2"
                >
                  Phone Number <span className="text-[#C9A227]">*</span>
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  required
                  placeholder="e.g. +234 803 000 0000"
                  value={form.phoneNumber}
                  onChange={(e) => setForm((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                  aria-invalid={Boolean(submittedAttempt && validation.errors.phoneNumber)}
                  className="w-full rounded-md border border-[#000000]/20 bg-[#FFFFFF] px-4 py-3 text-sm text-[#000000] placeholder:text-[#000000]/40 focus:border-[#C9A227] focus:outline-none"
                />
                {submittedAttempt && validation.errors.phoneNumber && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-700">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{validation.errors.phoneNumber}</span>
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="block text-xs font-semibold tracking-wider uppercase text-[#000000]/80 mb-2"
                >
                  Subject <span className="text-[#C9A227]">*</span>
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  required
                  placeholder="Stay inquiry, group request, or arrival question"
                  value={form.subject}
                  onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
                  aria-invalid={Boolean(submittedAttempt && validation.errors.subject)}
                  className="w-full rounded-md border border-[#000000]/20 bg-[#FFFFFF] px-4 py-3 text-sm text-[#000000] placeholder:text-[#000000]/40 focus:border-[#C9A227] focus:outline-none"
                />
                {submittedAttempt && validation.errors.subject && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-700">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{validation.errors.subject}</span>
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-semibold tracking-wider uppercase text-[#000000]/80 mb-2"
                >
                  Message <span className="text-[#C9A227]">*</span>
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  required
                  placeholder="Share your dates, questions, or hospitality preferences"
                  value={form.message}
                  onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                  aria-invalid={Boolean(submittedAttempt && validation.errors.message)}
                  className="w-full rounded-md border border-[#000000]/20 bg-[#FFFFFF] px-4 py-3 text-sm text-[#000000] placeholder:text-[#000000]/40 focus:border-[#C9A227] focus:outline-none"
                />
                {submittedAttempt && validation.errors.message && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-700">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{validation.errors.message}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={isPreparing}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#C9A227] hover:bg-[#D4AF37] px-7 py-3.5 text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase text-[#000000] disabled:opacity-60 transition-all"
              >
                <span>{isPreparing ? 'Preparing Inquiry...' : 'Prepare Inquiry'}</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>

            {preparedInquiry && (
              <div
                role="status"
                className="mt-6 rounded-xl border border-[#C9A227] bg-[#FFFFFF] p-5 space-y-3"
              >
                <p className="text-xs font-semibold tracking-wider uppercase text-[#C9A227]">
                  Inquiry Summary Prepared
                </p>

                <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-[#000000]/85 rounded-lg bg-[#F9F6F0] p-3.5 border border-[#000000]/10">
                  {preparedInquiry}
                </pre>

                <div className="flex flex-wrap gap-2.5 pt-1">
                  {mailtoHref && (
                    <a
                      href={mailtoHref}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#000000] px-5 py-2.5 text-xs font-semibold text-[#D4AF37]"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      <span>Open Email Client</span>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={handleCopyInquiry}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#000000]/20 hover:border-[#C9A227] px-5 py-2.5 text-xs font-semibold text-[#000000]"
                  >
                    {copiedInquiry ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[#C9A227]" />
                        <span>Copied Inquiry</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-[#C9A227]" />
                        <span>Copy Inquiry</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
