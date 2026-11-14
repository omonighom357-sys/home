import { useState } from 'react';
import {
  AlertCircle,
  Check,
  Copy,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  SlidersHorizontal,
} from 'lucide-react';
import { motion } from 'motion/react';
import { ResortConfig } from '../data/resortData';
import { buildWhatsAppUrl } from '../utils/booking';
import {
  buildFormattedContactInquiry,
  buildGoogleMapsDirectionsUrl,
  buildGoogleMapsEmbedUrl,
  buildMailtoHref,
  ContactFormInput,
  getLocationQuery,
  normalizeExternalUrl,
  validateContactForm,
} from '../utils/contact';

interface ContactSectionProps {
  config: ResortConfig;
  onOpenConfig: () => void;
}

const INITIAL_CONTACT_FORM: ContactFormInput = {
  fullName: '',
  email: '',
  phoneNumber: '',
  subject: '',
  message: '',
};

export function ContactSection({ config, onOpenConfig }: ContactSectionProps) {
  const [form, setForm] = useState<ContactFormInput>(INITIAL_CONTACT_FORM);
  const [submittedAttempt, setSubmittedAttempt] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [preparedInquiry, setPreparedInquiry] = useState<string | null>(null);
  const [copiedInquiry, setCopiedInquiry] = useState(false);

  const validation = validateContactForm(form);
  const locationQuery = getLocationQuery(config.resortAddress, config.googleMapsQuery);
  const mapEmbedUrl = locationQuery ? buildGoogleMapsEmbedUrl(locationQuery) : null;
  const directionsUrl = locationQuery ? buildGoogleMapsDirectionsUrl(locationQuery) : null;

  const configuredSocials = [
    { label: 'Instagram', url: normalizeExternalUrl(config.socialLinks.instagram) },
    { label: 'Facebook', url: normalizeExternalUrl(config.socialLinks.facebook) },
    { label: 'X', url: normalizeExternalUrl(config.socialLinks.x) },
    { label: 'TikTok', url: normalizeExternalUrl(config.socialLinks.tiktok) },
  ].filter((item): item is { label: string; url: string } => item.url !== null);

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
    }, 280);
  };

  const handleCopyInquiry = async () => {
    if (!preparedInquiry) return;
    try {
      await navigator.clipboard.writeText(preparedInquiry);
      setCopiedInquiry(true);
      window.setTimeout(() => setCopiedInquiry(false), 2500);
    } catch {
      // Clipboard blocked in restricted context; text stays selectable
    }
  };

  const mailtoHref = preparedInquiry ? buildMailtoHref(config.contactEmail, form) : null;
  const whatsappHref = preparedInquiry
    ? buildWhatsAppUrl(config.whatsappNumber, preparedInquiry)
    : null;

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-20 py-20 sm:py-28 bg-[#FFFFFF] dark:bg-[#242424] border-t border-[#242424]/8 dark:border-[#F8F5EF]/10 transition-colors duration-300"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-4">
              <span className="h-px w-10 bg-[#C5A46D]" aria-hidden="true" />
              <span className="text-xs font-semibold tracking-[0.24em] uppercase text-[#A4834C] dark:text-[#C5A46D]">
                Location &amp; Inquiries
              </span>
            </div>

            <h2
              id="contact-heading"
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#242424] dark:text-[#F8F5EF]"
            >
              Contact &amp; Directions
            </h2>

            <p className="mt-4 text-base text-[#242424]/75 dark:text-[#F8F5EF]/75 leading-relaxed">
              Reach our hospitality team directly or configure verified resort coordinates and
              contact channels in Property Setup.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenConfig}
            className="inline-flex items-center gap-2 self-start md:self-auto rounded-md border border-[#242424]/15 dark:border-[#F8F5EF]/15 px-4 py-2.5 text-xs font-medium text-[#242424]/80 dark:text-[#F8F5EF]/80 hover:border-[#C5A46D] hover:text-[#242424] dark:hover:text-[#F8F5EF] transition-colors whitespace-nowrap shrink-0"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#C5A46D]" />
            <span>Configure Contact &amp; Map</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left: Configured Details + Google Map */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            <div className="rounded-2xl bg-[#F8F5EF] dark:bg-[#181715] border border-[#242424]/10 dark:border-[#F8F5EF]/10 p-6 sm:p-8 space-y-5">
              <h3 className="font-serif text-2xl font-medium text-[#242424] dark:text-[#F8F5EF]">
                Resort Desk Directory
              </h3>

              <dl className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-[#C5A46D] mt-1 shrink-0" />
                  <div>
                    <dt className="text-xs font-semibold tracking-wider uppercase text-[#242424]/60 dark:text-[#F8F5EF]/60">
                      Hotel Address
                    </dt>
                    <dd className="mt-0.5 text-[#242424] dark:text-[#F8F5EF]">
                      {config.resortAddress.trim() || 'Awaiting verified resort address'}
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-[#C5A46D] mt-1 shrink-0" />
                  <div>
                    <dt className="text-xs font-semibold tracking-wider uppercase text-[#242424]/60 dark:text-[#F8F5EF]/60">
                      Official Phone
                    </dt>
                    <dd className="mt-0.5 text-[#242424] dark:text-[#F8F5EF] tabular-nums">
                      {config.contactPhone.trim() || 'Awaiting verified phone number'}
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageCircle className="h-4 w-4 text-[#C5A46D] mt-1 shrink-0" />
                  <div>
                    <dt className="text-xs font-semibold tracking-wider uppercase text-[#242424]/60 dark:text-[#F8F5EF]/60">
                      WhatsApp Desk
                    </dt>
                    <dd className="mt-0.5 text-[#242424] dark:text-[#F8F5EF] tabular-nums">
                      {config.whatsappNumber.trim() || 'Awaiting verified WhatsApp number'}
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-[#C5A46D] mt-1 shrink-0" />
                  <div>
                    <dt className="text-xs font-semibold tracking-wider uppercase text-[#242424]/60 dark:text-[#F8F5EF]/60">
                      Email Address
                    </dt>
                    <dd className="mt-0.5 text-[#242424] dark:text-[#F8F5EF]">
                      {config.contactEmail.trim() || 'Awaiting verified reservations email'}
                    </dd>
                  </div>
                </div>
              </dl>

              {configuredSocials.length > 0 && (
                <div className="pt-4 border-t border-[#242424]/10 dark:border-[#F8F5EF]/10">
                  <p className="text-xs font-semibold tracking-wider uppercase text-[#242424]/60 dark:text-[#F8F5EF]/60 mb-2.5">
                    Social Channels
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {configuredSocials.map((social) => (
                      <a
                        key={social.label}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#A4834C] dark:text-[#C5A46D] hover:underline"
                      >
                        <span>{social.label}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Google Map & Get Directions */}
            <div className="rounded-2xl bg-[#F8F5EF] dark:bg-[#181715] border border-[#242424]/10 dark:border-[#F8F5EF]/10 overflow-hidden">
              {mapEmbedUrl && directionsUrl ? (
                <div>
                  <div className="aspect-[16/10] w-full bg-[#E8D9BD]/40">
                    <iframe
                      title="Home Sweet Home Resort Google Map"
                      src={mapEmbedUrl}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="h-full w-full border-0"
                    />
                  </div>
                  <div className="p-4 flex items-center justify-between gap-4">
                    <p className="text-xs text-[#242424]/75 dark:text-[#F8F5EF]/75 truncate">
                      {locationQuery}
                    </p>
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-md bg-[#242424] dark:bg-[#C5A46D] px-3.5 py-2 text-xs font-semibold text-[#F8F5EF] dark:text-[#181715] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
                    >
                      <span>Get Directions</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-6 sm:p-7">
                  <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#84917A] mb-2">
                    Map Ready
                  </p>
                  <h3 className="font-serif text-xl font-medium text-[#242424] dark:text-[#F8F5EF] mb-2">
                    Interactive Google Map Awaits Verified Address
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-[#242424]/70 dark:text-[#F8F5EF]/70 mb-4">
                    To avoid displaying unverified coordinates, the live map and Get Directions
                    button activate automatically as soon as the resort&apos;s verified address is
                    entered in Property Setup.
                  </p>
                  <button
                    type="button"
                    onClick={onOpenConfig}
                    className="inline-flex items-center gap-2 rounded-md border border-[#242424]/20 dark:border-[#F8F5EF]/20 px-4 py-2 text-xs font-semibold text-[#242424] dark:text-[#F8F5EF] hover:border-[#C5A46D] transition-colors"
                  >
                    <MapPin className="h-3.5 w-3.5 text-[#C5A46D]" />
                    <span>Enter Verified Address</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right: Validated Contact Inquiry Form */}
          <motion.form
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={handleSubmit}
            noValidate
            className="lg:col-span-7 rounded-2xl bg-[#F8F5EF] dark:bg-[#181715] border border-[#242424]/10 dark:border-[#F8F5EF]/10 p-6 sm:p-8"
          >
            <h3 className="font-serif text-2xl font-medium text-[#242424] dark:text-[#F8F5EF] mb-2">
              Send an Inquiry
            </h3>
            <p className="text-sm text-[#242424]/70 dark:text-[#F8F5EF]/70 mb-6">
              Complete the form below to prepare a verified guest inquiry for our hospitality desk.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="contact-fullname"
                  className="block text-xs font-semibold tracking-wider uppercase text-[#242424]/80 dark:text-[#F8F5EF]/80 mb-2"
                >
                  Full Name <span className="text-[#A4834C]">*</span>
                </label>
                <input
                  id="contact-fullname"
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={form.fullName}
                  onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                  aria-invalid={Boolean(submittedAttempt && validation.errors.fullName)}
                  className="w-full rounded-md border border-[#242424]/20 dark:border-[#F8F5EF]/20 bg-[#FFFFFF] dark:bg-[#242424] px-4 py-3 text-sm text-[#242424] dark:text-[#F8F5EF] placeholder:text-[#242424]/40 dark:placeholder:text-[#F8F5EF]/40 focus:border-[#C5A46D] focus:outline-none"
                />
                {submittedAttempt && validation.errors.fullName && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-700 dark:text-red-300">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{validation.errors.fullName}</span>
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-xs font-semibold tracking-wider uppercase text-[#242424]/80 dark:text-[#F8F5EF]/80 mb-2"
                >
                  Email Address <span className="text-[#A4834C]">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  aria-invalid={Boolean(submittedAttempt && validation.errors.email)}
                  className="w-full rounded-md border border-[#242424]/20 dark:border-[#F8F5EF]/20 bg-[#FFFFFF] dark:bg-[#242424] px-4 py-3 text-sm text-[#242424] dark:text-[#F8F5EF] placeholder:text-[#242424]/40 dark:placeholder:text-[#F8F5EF]/40 focus:border-[#C5A46D] focus:outline-none"
                />
                {submittedAttempt && validation.errors.email && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-700 dark:text-red-300">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{validation.errors.email}</span>
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-phone"
                  className="block text-xs font-semibold tracking-wider uppercase text-[#242424]/80 dark:text-[#F8F5EF]/80 mb-2"
                >
                  Phone Number <span className="text-[#A4834C]">*</span>
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  required
                  placeholder="e.g. +234 803 000 0000"
                  value={form.phoneNumber}
                  onChange={(e) => setForm((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                  aria-invalid={Boolean(submittedAttempt && validation.errors.phoneNumber)}
                  className="w-full rounded-md border border-[#242424]/20 dark:border-[#F8F5EF]/20 bg-[#FFFFFF] dark:bg-[#242424] px-4 py-3 text-sm text-[#242424] dark:text-[#F8F5EF] placeholder:text-[#242424]/40 dark:placeholder:text-[#F8F5EF]/40 focus:border-[#C5A46D] focus:outline-none"
                />
                {submittedAttempt && validation.errors.phoneNumber && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-700 dark:text-red-300">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{validation.errors.phoneNumber}</span>
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="block text-xs font-semibold tracking-wider uppercase text-[#242424]/80 dark:text-[#F8F5EF]/80 mb-2"
                >
                  Subject <span className="text-[#A4834C]">*</span>
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  required
                  placeholder="Stay inquiry, group request, or question"
                  value={form.subject}
                  onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
                  aria-invalid={Boolean(submittedAttempt && validation.errors.subject)}
                  className="w-full rounded-md border border-[#242424]/20 dark:border-[#F8F5EF]/20 bg-[#FFFFFF] dark:bg-[#242424] px-4 py-3 text-sm text-[#242424] dark:text-[#F8F5EF] placeholder:text-[#242424]/40 dark:placeholder:text-[#F8F5EF]/40 focus:border-[#C5A46D] focus:outline-none"
                />
                {submittedAttempt && validation.errors.subject && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-700 dark:text-red-300">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{validation.errors.subject}</span>
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-semibold tracking-wider uppercase text-[#242424]/80 dark:text-[#F8F5EF]/80 mb-2"
                >
                  Message <span className="text-[#A4834C]">*</span>
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  required
                  placeholder="Share your dates, questions, or hospitality preferences"
                  value={form.message}
                  onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                  aria-invalid={Boolean(submittedAttempt && validation.errors.message)}
                  className="w-full rounded-md border border-[#242424]/20 dark:border-[#F8F5EF]/20 bg-[#FFFFFF] dark:bg-[#242424] px-4 py-3 text-sm text-[#242424] dark:text-[#F8F5EF] placeholder:text-[#242424]/40 dark:placeholder:text-[#F8F5EF]/40 focus:border-[#C5A46D] focus:outline-none"
                />
                {submittedAttempt && validation.errors.message && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-700 dark:text-red-300">
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
                className="inline-flex items-center justify-center rounded-md bg-[#242424] dark:bg-[#C5A46D] px-6 py-3.5 text-xs sm:text-sm font-semibold tracking-wide text-[#F8F5EF] dark:text-[#181715] hover:bg-[#3a3834] dark:hover:bg-[#d4b680] active:scale-[0.98] disabled:opacity-60 transition-all"
              >
                {isPreparing ? 'Preparing Inquiry...' : 'Prepare Inquiry'}
              </button>
            </div>

            {preparedInquiry && (
              <div
                role="status"
                className="mt-6 rounded-xl border border-[#C5A46D]/45 bg-[#FFFFFF] dark:bg-[#242424] p-5 space-y-3"
              >
                <p className="text-xs font-semibold tracking-wider uppercase text-[#A4834C] dark:text-[#C5A46D]">
                  Inquiry Ready — Manual Send Required
                </p>
                <p className="text-xs leading-relaxed text-[#242424]/75 dark:text-[#F8F5EF]/75">
                  No automated email server is connected to this site, so your message has not been
                  transmitted automatically. Use one of the verified channels below or copy your
                  formatted inquiry:
                </p>

                <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-[#242424]/85 dark:text-[#F8F5EF]/85 rounded-lg bg-[#F8F5EF] dark:bg-[#181715] p-3.5 border border-[#242424]/10 dark:border-[#F8F5EF]/10">
                  {preparedInquiry}
                </pre>

                <div className="flex flex-wrap gap-2.5 pt-1">
                  {mailtoHref && (
                    <a
                      href={mailtoHref}
                      className="inline-flex items-center gap-1.5 rounded-md bg-[#242424] dark:bg-[#C5A46D] px-4 py-2 text-xs font-semibold text-[#F8F5EF] dark:text-[#181715]"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      <span>Open Email Client</span>
                    </a>
                  )}
                  {whatsappHref && (
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-md border border-[#C5A46D] px-4 py-2 text-xs font-semibold text-[#A4834C] dark:text-[#C5A46D]"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>Send via WhatsApp</span>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={handleCopyInquiry}
                    className="inline-flex items-center gap-1.5 rounded-md border border-[#242424]/20 dark:border-[#F8F5EF]/20 px-4 py-2 text-xs font-semibold text-[#242424] dark:text-[#F8F5EF]"
                  >
                    {copiedInquiry ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[#84917A]" />
                        <span>Copied Inquiry</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-[#C5A46D]" />
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
