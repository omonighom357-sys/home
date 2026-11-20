import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildFormattedContactInquiry,
  buildGoogleMapsDirectionsUrl,
  buildGoogleMapsEmbedUrl,
  buildGoogleMapsSearchUrl,
  buildMailtoHref,
  getLocationQuery,
  normalizeExternalUrl,
  validateContactForm,
  validateReviewSubmission,
} from './contact';

test('validateContactForm detects missing or invalid fields', () => {
  const res = validateContactForm({
    fullName: 'J',
    email: 'invalid',
    phoneNumber: '12',
    subject: 'Hi',
    message: 'Too short',
  });

  assert.equal(res.isValid, false);
  assert.ok(res.errors.fullName);
  assert.ok(res.errors.email);
  assert.ok(res.errors.phoneNumber);
  assert.ok(res.errors.subject);
  assert.ok(res.errors.message);
});

test('validateContactForm passes on complete valid inquiry', () => {
  const res = validateContactForm({
    fullName: 'Chidi Nwosu',
    email: 'chidi@example.com',
    phoneNumber: '+234 803 111 2222',
    subject: 'Group stay inquiry',
    message: 'We would like to inquire about availability for three rooms next month.',
  });

  assert.equal(res.isValid, true);
  assert.deepEqual(res.errors, {});
});

test('validateReviewSubmission catches missing review fields and accepts valid moderated submissions', () => {
  const bad = validateReviewSubmission({
    guestName: 'A',
    roomId: 'elite',
    rating: 0,
    title: 'Ok',
    experience: 'Short',
  });
  assert.equal(bad.isValid, false);
  assert.ok(bad.errors.guestName);
  assert.ok(bad.errors.rating);
  assert.ok(bad.errors.title);
  assert.ok(bad.errors.experience);

  const ok = validateReviewSubmission({
    guestName: 'Tega',
    roomId: 'super-elite',
    rating: 5,
    title: 'Quiet nights on Udu Road',
    experience: 'Clean marble corridors and very calm suite atmosphere throughout my stay.',
  });
  assert.equal(ok.isValid, true);
  assert.deepEqual(ok.errors, {});
});

test('Google Maps helpers return null when unconfigured and valid URLs when provided', () => {
  assert.equal(getLocationQuery('', ''), null);
  assert.equal(buildGoogleMapsEmbedUrl(''), null);
  assert.equal(buildGoogleMapsDirectionsUrl(''), null);
  assert.equal(buildGoogleMapsSearchUrl(''), null);

  const query = getLocationQuery(
    'No. 4 Onosuru Street, Udu Road, Opposite Williams Street, Udu, 330103, Delta State, Nigeria',
    ''
  );
  assert.equal(
    query,
    'No. 4 Onosuru Street, Udu Road, Opposite Williams Street, Udu, 330103, Delta State, Nigeria'
  );
  assert.ok(buildGoogleMapsEmbedUrl(query!)?.includes('Onosuru'));
  assert.ok(buildGoogleMapsDirectionsUrl(query!)?.includes('Onosuru'));
  assert.ok(buildGoogleMapsSearchUrl(query!)?.includes('Onosuru'));
});

test('buildMailtoHref and buildFormattedContactInquiry format cleanly', () => {
  const input = {
    fullName: 'Chidi Nwosu',
    email: 'chidi@example.com',
    phoneNumber: '+234 803 111 2222',
    subject: 'Event space inquiry',
    message: 'Please share confirmed availability for December.',
  };

  assert.equal(buildMailtoHref('', input), null);
  const href = buildMailtoHref('concierge@homesweethome.test', input);
  assert.ok(href?.startsWith('mailto:concierge@homesweethome.test?subject='));

  const text = buildFormattedContactInquiry(input);
  assert.match(text, /GUEST INQUIRY — HOME SWEET HOME RESORT/);
  assert.match(text, /Chidi Nwosu/);
});

test('normalizeExternalUrl prefixes https cleanly', () => {
  assert.equal(normalizeExternalUrl(''), null);
  assert.equal(normalizeExternalUrl('instagram.com/hshresort'), 'https://instagram.com/hshresort');
  assert.equal(normalizeExternalUrl('https://x.com/hshresort'), 'https://x.com/hshresort');
});
