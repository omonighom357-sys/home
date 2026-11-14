import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildFormattedContactInquiry,
  buildGoogleMapsDirectionsUrl,
  buildGoogleMapsEmbedUrl,
  buildMailtoHref,
  getLocationQuery,
  normalizeExternalUrl,
  validateContactForm,
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

test('Google Maps helpers return null when unconfigured and valid URLs when configured', () => {
  assert.equal(getLocationQuery('', ''), null);
  assert.equal(buildGoogleMapsEmbedUrl(''), null);
  assert.equal(buildGoogleMapsDirectionsUrl(''), null);

  const query = getLocationQuery('12 Palm Avenue, Victoria Island', '');
  assert.equal(query, '12 Palm Avenue, Victoria Island');
  assert.equal(
    buildGoogleMapsEmbedUrl(query!),
    'https://maps.google.com/maps?q=12%20Palm%20Avenue%2C%20Victoria%20Island&output=embed'
  );
  assert.equal(
    buildGoogleMapsDirectionsUrl(query!),
    'https://www.google.com/maps/search/?api=1&query=12%20Palm%20Avenue%2C%20Victoria%20Island'
  );
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
