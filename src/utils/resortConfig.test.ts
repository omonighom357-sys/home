import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterGalleryPhotos,
  getAvailableGalleryCategories,
  getRoomPhoto,
  mergeResortConfig,
} from './resortConfig';
import { DEFAULT_RESORT_CONFIG, RESORT_PHOTOS } from '../data/resortData';

test('getAvailableGalleryCategories excludes categories without genuine photos', () => {
  const categories = getAvailableGalleryCategories(RESORT_PHOTOS);
  assert.equal(categories.includes('Exterior'), true);
  assert.equal(categories.includes('Rooms & Suites'), true);
  assert.equal(categories.includes('Interiors'), true);
  assert.equal(categories.includes('Facilities'), false);
});

test('filterGalleryPhotos filters by selected category accurately', () => {
  assert.equal(filterGalleryPhotos(RESORT_PHOTOS, 'All').length, RESORT_PHOTOS.length);
  const exterior = filterGalleryPhotos(RESORT_PHOTOS, 'Exterior');
  assert.equal(exterior.length, 1);
  assert.equal(exterior[0].id, 'exterior-facade');
});

test('mergeResortConfig preserves valid editable room mapping and rejects unknown photo ids', () => {
  const merged = mergeResortConfig({
    whatsappNumber: '+2348000000000',
    roomImageMapping: {
      deluxe: 'room-green-tufted',
      executive: 'nonexistent-photo-id',
      presidential: 'room-warm-wardrobe',
    },
    amenities: [{ id: 'wifi', confirmed: true, note: 'Guest Wi-Fi confirmed' }],
  });

  assert.equal(merged.whatsappNumber, '+2348000000000');
  assert.equal(merged.roomImageMapping.deluxe, 'room-green-tufted');
  assert.equal(merged.roomImageMapping.executive, DEFAULT_RESORT_CONFIG.roomImageMapping.executive);
  assert.equal(merged.roomImageMapping.presidential, 'room-warm-wardrobe');

  const wifi = merged.amenities.find((a) => a.id === 'wifi');
  assert.equal(wifi?.confirmed, true);
  assert.equal(wifi?.note, 'Guest Wi-Fi confirmed');

  const roomPhoto = getRoomPhoto('deluxe', merged);
  assert.equal(roomPhoto.id, 'room-green-tufted');
});
