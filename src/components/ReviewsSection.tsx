import { useState } from 'react';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Star } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  APPROVED_REVIEWS,
  HOSPITALITY_STANDARDS,
  ROOM_CATEGORIES,
  RoomCategoryId,
} from '../data/resortData';
import { ReviewSubmissionInput, validateReviewSubmission } from '../utils/contact';

interface PendingGuestReview extends ReviewSubmissionInput {
  id: string;
  roomName: string;
}

const INITIAL_REVIEW_FORM: ReviewSubmissionInput = {
  guestName: '',
  roomId: 'deluxe',
  rating: 5,
  title: '',
  experience: '',
};

export function ReviewsSection() {
  const [activeStandardIdx, setActiveStandardIdx] = useState(0);
  const [form, setForm] = useState<ReviewSubmissionInput>(INITIAL_REVIEW_FORM);
  const [submittedAttempt, setSubmittedAttempt] = useState(false);
  const [submittedReviews, setSubmittedReviews] = useState<PendingGuestReview[]>([]);
  const [confirmationNote, setConfirmationNote] = useState<string | null>(null);

  const totalStandards = HOSPITALITY_STANDARDS.length;
  const activeStandard = HOSPITALITY_STANDARDS[activeStandardIdx] ?? HOSPITALITY_STANDARDS[0];
  const validation = validateReviewSubmission(form);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedAttempt(true);
    setConfirmationNote(null);

    if (!validation.isValid) return;

    const chosenRoom = ROOM_CATEGORIES.find((r) => r.id === form.roomId) ?? ROOM_CATEGORIES[0];
    const nextPending: PendingGuestReview = {
      ...form,
      guestName: form.guestName.trim(),
      title: form.title.trim(),
      experience: form.experience.trim(),
      id: `pending-${Date.now()}`,
      roomName: chosenRoom.name,
    };

    setSubmittedReviews((prev) => [nextPending, ...prev]);
    setForm(INITIAL_REVIEW_FORM);
    setSubmittedAttempt(false);
    setConfirmationNote(
      'Thank you for sharing your stay notes. Your experience has been recorded for on-site resort moderation before publication.'
    );
  };

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      className="scroll-mt-20 py-20 sm:py-28 lg:py-32 bg-[#FFFFFF] text-[#000000] border-t border-[#C9A227]/25"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-14">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-4">
              <span className="h-px w-10 bg-[#C9A227]" aria-hidden="true" />
              <span className="font-sans text-xs font-semibold tracking-[0.26em] uppercase text-[#C9A227]">
                — Guest Reflections
              </span>
            </div>

            <h2
              id="reviews-heading"
              className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-[#000000]"
            >
              On-Site Guest{' '}
              <span className="font-editorial italic text-[#C9A227]">Experiences</span>
            </h2>
          </div>

          <p className="text-sm text-[#000000]/70 max-w-md leading-relaxed">
            Reviews at Home Sweet Home Resort remain exclusively on-site and moderated—no third-party
            redirects, and never fabricated ratings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 7 Cols: Hospitality Standards Carousel & Verified On-Site Submissions */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="rounded-2xl bg-[#F9F6F0] border border-[#C9A227]/35 p-7 sm:p-10">
              <div className="flex items-center justify-between gap-4 pb-5 border-b border-[#000000]/10">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-[#C9A227] tabular-nums">
                  <span>0{activeStandardIdx + 1} / 0{totalStandards}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeStandard.pillar}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveStandardIdx((prev) => (prev - 1 + totalStandards) % totalStandards)
                    }
                    aria-label="Previous hospitality standard"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#000000]/15 text-[#000000] hover:bg-[#C9A227] hover:border-[#C9A227] transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStandardIdx((prev) => (prev + 1) % totalStandards)}
                    aria-label="Next hospitality standard"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#000000]/15 text-[#000000] hover:bg-[#C9A227] hover:border-[#C9A227] transition-colors"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="py-7 min-h-[160px] flex items-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStandard.id}
                    initial={{ opacity: 0, x: 14 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -14 }}
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#000000] leading-[1.18]">
                      {activeStandard.headline}
                    </h3>
                    <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#000000]/75 max-w-xl">
                      {activeStandard.summary}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div
                role="tablist"
                aria-label="Hospitality standards selector"
                className="flex flex-wrap items-center gap-2 pt-5 border-t border-[#000000]/10"
              >
                {HOSPITALITY_STANDARDS.map((item, idx) => {
                  const selected = idx === activeStandardIdx;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setActiveStandardIdx(idx)}
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-[0.1em] uppercase transition-colors whitespace-nowrap ${
                        selected
                          ? 'bg-[#000000] text-[#D4AF37]'
                          : 'bg-[#FFFFFF] text-[#000000]/70 hover:text-[#000000]'
                      }`}
                    >
                      0{idx + 1} · {item.pillar}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Verified Guest Impressions Area (Honest Empty State or Approved / Pending Submissions) */}
            <div className="rounded-2xl bg-[#000000] text-[#F9F6F0] border border-[#C9A227]/35 p-7 sm:p-9">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#F9F6F0]/15">
                <p className="font-sans text-[11px] font-semibold tracking-[0.24em] uppercase text-[#C9A227]">
                  Verified Stay Book
                </p>
                <span className="text-xs text-[#F9F6F0]/60">On-Site Moderated Archive</span>
              </div>

              {APPROVED_REVIEWS.length === 0 && submittedReviews.length === 0 ? (
                <div className="pt-5">
                  <p className="font-serif text-xl sm:text-2xl text-[#FFFFFF]">
                    Awaiting Your First Verified Stay Impression
                  </p>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#F9F6F0]/75">
                    Home Sweet Home Resort publishes only authenticated guest reflections after stay
                    verification. Guests who have stayed with us may submit their review directly
                    using the on-site card alongside.
                  </p>
                </div>
              ) : (
                <div className="pt-5 space-y-4">
                  {submittedReviews.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-xl border border-[#C9A227]/40 bg-[#FFFFFF]/[0.04] p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1 text-[#D4AF37]" aria-label={`${item.rating} out of 5 stars`}>
                          {Array.from({ length: item.rating }).map((_, starIdx) => (
                            <Star key={starIdx} className="h-3.5 w-3.5 fill-current" />
                          ))}
                        </div>
                        <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#C9A227]">
                          Pending Moderation · {item.roomName}
                        </span>
                      </div>
                      <h4 className="font-serif text-xl text-[#FFFFFF]">{item.title}</h4>
                      <p className="mt-1.5 text-sm text-[#F9F6F0]/80 leading-relaxed">
                        &ldquo;{item.experience}&rdquo;
                      </p>
                      <p className="mt-2 text-xs text-[#C9A227]">— {item.guestName}</p>
                    </article>
                  ))}

                  {APPROVED_REVIEWS.map((review) => (
                    <article
                      key={review.id}
                      className="rounded-xl border border-[#F9F6F0]/15 bg-[#FFFFFF]/[0.03] p-5"
                    >
                      <h4 className="font-serif text-xl text-[#FFFFFF]">{review.guestName}</h4>
                      <p className="mt-1.5 text-sm text-[#F9F6F0]/80">&ldquo;{review.quote}&rdquo;</p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right 5 Cols: Functional On-Site Guest Experience Submission Form */}
          <form
            onSubmit={handleSubmitReview}
            noValidate
            className="lg:col-span-5 rounded-2xl bg-[#F9F6F0] border border-[#C9A227]/35 p-6 sm:p-8"
          >
            <p className="font-sans text-[11px] font-semibold tracking-[0.24em] uppercase text-[#C9A227] mb-2">
              Guestbook Submission
            </p>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#000000]">
              Share Your Stay Experience
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#000000]/70 mb-6">
              Stayed in Deluxe, Super Deluxe, Elite, or Super Elite? Leave verified feedback for
              our front desk.
            </p>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="review-guest-name"
                  className="block text-xs font-semibold tracking-wider uppercase text-[#000000]/80 mb-1.5"
                >
                  Guest Name <span className="text-[#C9A227]">*</span>
                </label>
                <input
                  id="review-guest-name"
                  type="text"
                  required
                  placeholder="Your name"
                  value={form.guestName}
                  onChange={(e) => setForm((prev) => ({ ...prev, guestName: e.target.value }))}
                  aria-invalid={Boolean(submittedAttempt && validation.errors.guestName)}
                  className="w-full rounded-md border border-[#000000]/20 bg-[#FFFFFF] px-4 py-2.5 text-sm text-[#000000] focus:border-[#C9A227] focus:outline-none"
                />
                {submittedAttempt && validation.errors.guestName && (
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-red-700">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{validation.errors.guestName}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="review-room-tier"
                    className="block text-xs font-semibold tracking-wider uppercase text-[#000000]/80 mb-1.5"
                  >
                    Room Category
                  </label>
                  <select
                    id="review-room-tier"
                    value={form.roomId}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        roomId: e.target.value as RoomCategoryId,
                      }))
                    }
                    className="w-full rounded-md border border-[#000000]/20 bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#000000] focus:border-[#C9A227] focus:outline-none"
                  >
                    {ROOM_CATEGORIES.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="block text-xs font-semibold tracking-wider uppercase text-[#000000]/80 mb-1.5">
                    Stay Rating
                  </span>
                  <div className="flex items-center gap-1 py-1.5" role="group" aria-label="Select star rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, rating: star }))}
                        aria-label={`${star} star${star === 1 ? '' : 's'}`}
                        aria-pressed={form.rating === star}
                        className="p-1 rounded transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-5 w-5 ${
                            star <= form.rating
                              ? 'text-[#C9A227] fill-[#C9A227]'
                              : 'text-[#000000]/20'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="review-title"
                  className="block text-xs font-semibold tracking-wider uppercase text-[#000000]/80 mb-1.5"
                >
                  Headline <span className="text-[#C9A227]">*</span>
                </label>
                <input
                  id="review-title"
                  type="text"
                  required
                  placeholder="Summary of your stay"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  aria-invalid={Boolean(submittedAttempt && validation.errors.title)}
                  className="w-full rounded-md border border-[#000000]/20 bg-[#FFFFFF] px-4 py-2.5 text-sm text-[#000000] focus:border-[#C9A227] focus:outline-none"
                />
                {submittedAttempt && validation.errors.title && (
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-red-700">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{validation.errors.title}</span>
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="review-experience"
                  className="block text-xs font-semibold tracking-wider uppercase text-[#000000]/80 mb-1.5"
                >
                  Your Experience <span className="text-[#C9A227]">*</span>
                </label>
                <textarea
                  id="review-experience"
                  rows={3}
                  required
                  placeholder="Share thoughts on the suite, cleanliness, or hospitality..."
                  value={form.experience}
                  onChange={(e) => setForm((prev) => ({ ...prev, experience: e.target.value }))}
                  aria-invalid={Boolean(submittedAttempt && validation.errors.experience)}
                  className="w-full rounded-md border border-[#000000]/20 bg-[#FFFFFF] px-4 py-2.5 text-sm text-[#000000] focus:border-[#C9A227] focus:outline-none"
                />
                {submittedAttempt && validation.errors.experience && (
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-red-700">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{validation.errors.experience}</span>
                  </p>
                )}
              </div>
            </div>

            {confirmationNote && (
              <div
                role="status"
                className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#C9A227] bg-[#FFFFFF] p-3.5 text-xs text-[#000000]"
              >
                <CheckCircle2 className="h-4 w-4 text-[#C9A227] shrink-0 mt-0.5" />
                <span>{confirmationNote}</span>
              </div>
            )}

            <button
              type="submit"
              className="group mt-5 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#C9A227] hover:bg-[#D4AF37] px-6 py-3.5 text-xs font-semibold tracking-[0.16em] uppercase text-[#000000] transition-all"
            >
              <span>Submit On-Site Review</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
