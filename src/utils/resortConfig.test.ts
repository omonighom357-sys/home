import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterGalleryPhotos,
  getAvailableGalleryCategories,
  getRoomPhoto,
} from './resortConfig';
import { RESORT_PHOTOS, ROOM_CATEGORIES } from '../data/resortData';

test('ROOM_CATEGORIES contains exact four official rooms in ascending tier order', () => {
  assert.equal(ROOM_CATEGORIES.length, 4);
  assert.deepEqual(
    ROOM_CATEGORIES.map((r) => ({ id: r.id, name: r.name, nightlyRate: r.nightlyRate })),
    [
      { id: 'deluxe', name: 'Deluxe', nightlyRate: 35000 },
      { id: 'super-deluxe', name: 'Super Deluxe', nightlyRate: 40000 },
      { id: 'elite', name: 'Elite', nightlyRate: 45000 },
      { id: 'super-elite', name: 'Super Elite', nightlyRate: 50000 },
    ]
  );
});

test('All four room categories map to unique valid photographs and remove outdated assets', () => {
  const mappedPhotos = ROOM_CATEGORIES.map((r) => getRoomPhoto(r.id));
  const uniqueIds = new Set(mappedPhotos.map((p) => p.id));
  assert.equal(uniqueIds.size, 4);

  for (const photo of RESORT_PHOTOS) {
    assert.equal(photo.src.includes('hotel-gold-ice-warri'), false);
  }

  assert.equal(
    getRoomPhoto('super-elite').src,
    '/assets/aistudio/inpaint_text_10_54ed33a5.jpg'
  );
});

test('getAvailableGalleryCategories returns verified photo categories', () => {
  const categories = getAvailableGalleryCategories(RESORT_PHOTOS);
  assert.deepEqual(categories, ['Exterior', 'Rooms & Suites', 'Interiors']);
});

test('filterGalleryPhotos filters by selected category accurately', () => {
  assert.equal(filterGalleryPhotos(RESORT_PHOTOS, 'All').length, RESORT_PHOTOS.length);
  assert.equal(filterGalleryPhotos(RESORT_PHOTOS, 'Rooms & Suites').length, 4);
  assert.equal(filterGalleryPhotos(RESORT_PHOTOS, 'Interiors').length, 3);
  const exterior = filterGalleryPhotos(RESORT_PHOTOS, 'Exterior');
  assert.equal(exterior.length, 1);
  assert.equal(exterior[0].id, 'exterior-facade');
});
