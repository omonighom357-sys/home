import {
  DEFAULT_AMENITIES,
  DEFAULT_RESORT_CONFIG,
  PhotoCategory,
  RESORT_NAME,
  RESORT_PHOTOS,
  ResortConfig,
  ResortPhoto,
  RoomCategoryId,
  SocialLinksConfig,
} from '../data/resortData';

export const RESORT_CONFIG_STORAGE_KEY = 'hsh_resort_config_v1';

export function getPhotoById(photoId: string, photos: ResortPhoto[] = RESORT_PHOTOS): ResortPhoto {
  return photos.find((p) => p.id === photoId) ?? photos[0];
}

export function getRoomPhoto(
  roomId: RoomCategoryId,
  config: ResortConfig,
  photos: ResortPhoto[] = RESORT_PHOTOS
): ResortPhoto {
  const mappedId = config.roomImageMapping[roomId];
  return getPhotoById(mappedId, photos);
}

export function getAvailableGalleryCategories(photos: ResortPhoto[] = RESORT_PHOTOS): PhotoCategory[] {
  const ordered: PhotoCategory[] = ['Exterior', 'Rooms & Suites', 'Interiors', 'Facilities'];
  return ordered.filter((cat) => photos.some((p) => p.category === cat));
}

export function filterGalleryPhotos(
  photos: ResortPhoto[],
  category: 'All' | PhotoCategory
): ResortPhoto[] {
  if (category === 'All') return photos;
  return photos.filter((p) => p.category === category);
}

export function mergeResortConfig(raw: unknown): ResortConfig {
  if (!raw || typeof raw !== 'object') {
    return structuredClone(DEFAULT_RESORT_CONFIG);
  }
  const candidate = raw as Partial<ResortConfig>;

  const validPhotoIds = new Set(RESORT_PHOTOS.map((p) => p.id));
  const safeMapping: Record<RoomCategoryId, string> = {
    deluxe:
      candidate.roomImageMapping?.deluxe && validPhotoIds.has(candidate.roomImageMapping.deluxe)
        ? candidate.roomImageMapping.deluxe
        : DEFAULT_RESORT_CONFIG.roomImageMapping.deluxe,
    executive:
      candidate.roomImageMapping?.executive &&
      validPhotoIds.has(candidate.roomImageMapping.executive)
        ? candidate.roomImageMapping.executive
        : DEFAULT_RESORT_CONFIG.roomImageMapping.executive,
    presidential:
      candidate.roomImageMapping?.presidential &&
      validPhotoIds.has(candidate.roomImageMapping.presidential)
        ? candidate.roomImageMapping.presidential
        : DEFAULT_RESORT_CONFIG.roomImageMapping.presidential,
  };

  const safeRoomAmenities: Record<RoomCategoryId, string[]> = {
    deluxe: Array.isArray(candidate.roomVerifiedAmenities?.deluxe)
      ? candidate.roomVerifiedAmenities.deluxe.filter((s): s is string => typeof s === 'string')
      : [],
    executive: Array.isArray(candidate.roomVerifiedAmenities?.executive)
      ? candidate.roomVerifiedAmenities.executive.filter((s): s is string => typeof s === 'string')
      : [],
    presidential: Array.isArray(candidate.roomVerifiedAmenities?.presidential)
      ? candidate.roomVerifiedAmenities.presidential.filter((s): s is string => typeof s === 'string')
      : [],
  };

  const mergedAmenities = DEFAULT_AMENITIES.map((defItem) => {
    const saved = Array.isArray(candidate.amenities)
      ? candidate.amenities.find((a) => a && a.id === defItem.id)
      : undefined;
    if (!saved) return { ...defItem };
    return {
      ...defItem,
      confirmed: Boolean(saved.confirmed),
      note: typeof saved.note === 'string' ? saved.note : '',
    };
  });

  const safeSocials: SocialLinksConfig = {
    instagram:
      typeof candidate.socialLinks?.instagram === 'string' ? candidate.socialLinks.instagram : '',
    facebook:
      typeof candidate.socialLinks?.facebook === 'string' ? candidate.socialLinks.facebook : '',
    x: typeof candidate.socialLinks?.x === 'string' ? candidate.socialLinks.x : '',
    tiktok: typeof candidate.socialLinks?.tiktok === 'string' ? candidate.socialLinks.tiktok : '',
  };

  return {
    hotelName: RESORT_NAME,
    whatsappNumber: typeof candidate.whatsappNumber === 'string' ? candidate.whatsappNumber : '',
    contactPhone: typeof candidate.contactPhone === 'string' ? candidate.contactPhone : '',
    contactEmail: typeof candidate.contactEmail === 'string' ? candidate.contactEmail : '',
    resortAddress: typeof candidate.resortAddress === 'string' ? candidate.resortAddress : '',
    googleMapsQuery:
      typeof candidate.googleMapsQuery === 'string' ? candidate.googleMapsQuery : '',
    socialLinks: safeSocials,
    roomImageMapping: safeMapping,
    roomVerifiedAmenities: safeRoomAmenities,
    amenities: mergedAmenities,
  };
}

export function loadResortConfig(): ResortConfig {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return structuredClone(DEFAULT_RESORT_CONFIG);
    }
    const raw = window.localStorage.getItem(RESORT_CONFIG_STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_RESORT_CONFIG);
    return mergeResortConfig(JSON.parse(raw));
  } catch {
    return structuredClone(DEFAULT_RESORT_CONFIG);
  }
}

export function saveResortConfig(config: ResortConfig): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(RESORT_CONFIG_STORAGE_KEY, JSON.stringify(config));
    }
  } catch {
    // Ignore storage quota or private mode failures gracefully
  }
}
