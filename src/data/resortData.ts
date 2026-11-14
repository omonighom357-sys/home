export type RoomCategoryId = 'deluxe' | 'executive' | 'presidential';

export type AtmosphereMode = 'daylight' | 'evening';

export type PhotoCategory = 'Exterior' | 'Rooms & Suites' | 'Interiors' | 'Facilities';

export interface ResortPhoto {
  id: string;
  src: string;
  title: string;
  caption: string;
  category: PhotoCategory;
  orientation: 'landscape' | 'portrait';
}

export interface RoomCategory {
  id: RoomCategoryId;
  name: string;
  nightlyRate: number;
  description: string;
}

export interface AmenityItem {
  id: string;
  name: string;
  category:
    | 'Restaurant'
    | 'Bar & Lounge'
    | 'Wi-Fi'
    | 'Parking'
    | 'Security'
    | 'Room Service'
    | 'Event Spaces'
    | 'Leisure Facilities';
  confirmed: boolean;
  note: string;
}

export interface SocialLinksConfig {
  instagram: string;
  facebook: string;
  x: string;
  tiktok: string;
}

export interface ResortConfig {
  hotelName: string;
  whatsappNumber: string;
  contactPhone: string;
  contactEmail: string;
  resortAddress: string;
  googleMapsQuery: string;
  socialLinks: SocialLinksConfig;
  roomImageMapping: Record<RoomCategoryId, string>;
  roomVerifiedAmenities: Record<RoomCategoryId, string[]>;
  amenities: AmenityItem[];
}

export const RESORT_NAME = 'Home Sweet Home Resort';

export const RESORT_LOGO_SRC = '/assets/aistudio/file_0000000086f881f4ac77b7bdbf8a3cb3_f95b97c2.png';

export const RESORT_EXTERIOR_SRC = '/assets/aistudio/file_00000000c81c81f491dc1c16c4128cb0_d25f8c0b.png';

export const RESORT_PHOTOS: ResortPhoto[] = [
  {
    id: 'exterior-facade',
    src: RESORT_EXTERIOR_SRC,
    title: 'Resort Exterior Facade',
    caption: 'Contemporary two-story exterior with contrasting ivory and deep charcoal architectural wings.',
    category: 'Exterior',
    orientation: 'landscape',
  },
  {
    id: 'room-warm-wardrobe',
    src: '/assets/aistudio/unnamed__23__87d93cd5.webp',
    title: 'Warm Neutral Guest Room',
    caption: 'Tufted upholstered headboard, warm wood flooring, fitted wardrobe, and corner lounge seating.',
    category: 'Rooms & Suites',
    orientation: 'portrait',
  },
  {
    id: 'room-executive-wood',
    src: '/assets/aistudio/hotel-gold-ice-warri-20240806195052860700_7a7a581a.webp',
    title: 'Wood-Paneled Suite & Workspace',
    caption: 'Backlit timber feature wall, dedicated desk seating, lounge chairs, and warm golden cove lighting.',
    category: 'Rooms & Suites',
    orientation: 'landscape',
  },
  {
    id: 'room-green-tufted',
    src: '/assets/aistudio/inpaint_text_10_54ed33a5.jpg',
    title: 'Sculptural Mirror & Olive Suite',
    caption: 'Floor-to-ceiling olive tufted headboard, fluted wood paneling, organic mirror, and lounge chair.',
    category: 'Interiors',
    orientation: 'portrait',
  },
];

export const ROOM_CATEGORIES: RoomCategory[] = [
  {
    id: 'deluxe',
    name: 'Deluxe Room',
    nightlyRate: 30000,
    description:
      'A welcoming retreat thoughtfully presented for comfort, relaxation, and a restful stay.',
  },
  {
    id: 'executive',
    name: 'Deluxe Executive Room',
    nightlyRate: 40000,
    description:
      'An elevated accommodation experience combining contemporary elegance with the warmth of home.',
  },
  {
    id: 'presidential',
    name: 'Deluxe Presidential Room',
    nightlyRate: 50000,
    description:
      'A distinguished stay designed to deliver an exceptional sense of refinement and comfort.',
  },
];

export const DEFAULT_AMENITIES: AmenityItem[] = [
  {
    id: 'restaurant',
    name: 'Restaurant',
    category: 'Restaurant',
    confirmed: false,
    note: '',
  },
  {
    id: 'bar-lounge',
    name: 'Bar & Lounge',
    category: 'Bar & Lounge',
    confirmed: false,
    note: '',
  },
  {
    id: 'wifi',
    name: 'Wi-Fi',
    category: 'Wi-Fi',
    confirmed: false,
    note: '',
  },
  {
    id: 'parking',
    name: 'Parking',
    category: 'Parking',
    confirmed: false,
    note: '',
  },
  {
    id: 'security',
    name: 'Security',
    category: 'Security',
    confirmed: false,
    note: '',
  },
  {
    id: 'room-service',
    name: 'Room Service',
    category: 'Room Service',
    confirmed: false,
    note: '',
  },
  {
    id: 'event-spaces',
    name: 'Event Spaces',
    category: 'Event Spaces',
    confirmed: false,
    note: '',
  },
  {
    id: 'leisure',
    name: 'Leisure Facilities',
    category: 'Leisure Facilities',
    confirmed: false,
    note: '',
  },
];

export const DEFAULT_RESORT_CONFIG: ResortConfig = {
  hotelName: RESORT_NAME,
  whatsappNumber: '',
  contactPhone: '',
  contactEmail: '',
  resortAddress: '',
  googleMapsQuery: '',
  socialLinks: {
    instagram: '',
    facebook: '',
    x: '',
    tiktok: '',
  },
  roomImageMapping: {
    deluxe: 'room-warm-wardrobe',
    executive: 'room-executive-wood',
    presidential: 'room-green-tufted',
  },
  roomVerifiedAmenities: {
    deluxe: [],
    executive: [],
    presidential: [],
  },
  amenities: DEFAULT_AMENITIES,
};
