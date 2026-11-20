import {
  PhotoCategory,
  RESORT_PHOTOS,
  ResortPhoto,
  ROOM_CATEGORIES,
  RoomCategory,
  RoomCategoryId,
} from '../data/resortData';

export function getPhotoById(
  photoId: string,
  photos: ResortPhoto[] = RESORT_PHOTOS
): ResortPhoto {
  return photos.find((p) => p.id === photoId) ?? photos[0];
}

export function getRoomPhoto(
  roomId: RoomCategoryId,
  photos: ResortPhoto[] = RESORT_PHOTOS,
  rooms: RoomCategory[] = ROOM_CATEGORIES
): ResortPhoto {
  const room = rooms.find((r) => r.id === roomId) ?? rooms[0];
  return getPhotoById(room.photoId, photos);
}

export function getAvailableGalleryCategories(
  photos: ResortPhoto[] = RESORT_PHOTOS
): PhotoCategory[] {
  const ordered: PhotoCategory[] = ['Exterior', 'Rooms & Suites', 'Interiors'];
  return ordered.filter((cat) => photos.some((p) => p.category === cat));
}

export function filterGalleryPhotos(
  photos: ResortPhoto[],
  category: 'All' | PhotoCategory
): ResortPhoto[] {
  if (category === 'All') return photos;
  return photos.filter((p) => p.category === category);
}
