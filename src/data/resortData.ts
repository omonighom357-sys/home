export type RoomCategoryId = 'deluxe' | 'super-deluxe' | 'elite' | 'super-elite';

export type AtmosphereMode = 'daylight' | 'evening';

export type PhotoCategory = 'Exterior' | 'Rooms & Suites' | 'Interiors';

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
  tierCode: string;
  name: string;
  subtitle: string;
  nightlyRate: number;
  photoId: string;
  description: string;
  observedHighlights: string[];
}

export interface PropertyHighlight {
  id: string;
  index: string;
  title: string;
  description: string;
  photoId?: string;
}

export interface ResortStat {
  id: string;
  target: number;
  prefix?: string;
  formatNumber: boolean;
  label: string;
}

export interface ApprovedReview {
  id: string;
  guestName: string;
  roomName: string;
  rating: number;
  quote: string;
  stayLabel: string;
}

export interface HospitalityStandard {
  id: string;
  pillar: string;
  headline: string;
  summary: string;
}

export interface ResortProfile {
  hotelName: string;
  tagline: string;
  whatsappNumber: string;
  contactPhone: string;
  contactEmail: string;
  resortAddress: string;
  localGovernmentArea: string;
  googleMapsQuery: string;
}

export const RESORT_NAME = 'Home Sweet Home Resort';

export const RESORT_LOCATION = {
  propertyName: 'HOME SWEET HOME RESORT',
  streetLine: 'No. 4 Onosuru Street,',
  roadLine: 'Udu Road,',
  landmarkLine: 'Opposite Williams Street,',
  cityPostalLine: 'Udu, 330103,',
  stateCountryLine: 'Delta State, Nigeria.',
  lga: 'Udu Local Government Area',
  fullAddress:
    'No. 4 Onosuru Street, Udu Road, Opposite Williams Street, Udu, 330103, Delta State, Nigeria',
  geocodeQuery:
    'Home Sweet Home Resort, No. 4 Onosuru Street, Udu Road, Udu, Delta State, Nigeria',
} as const;

export const RESORT_STATS: ResortStat[] = [
  {
    id: 'categories',
    target: 4,
    formatNumber: false,
    label: 'ROOM CATEGORIES',
  },
  {
    id: 'rate-from',
    target: 35000,
    prefix: '₦',
    formatNumber: true,
    label: 'RATES FROM',
  },
  {
    id: 'signature-stay',
    target: 50000,
    prefix: '₦',
    formatNumber: true,
    label: 'SIGNATURE STAY',
  },
];

export const APPROVED_REVIEWS: ApprovedReview[] = [];

export const RESORT_LOGO_SRC =
  '/assets/aistudio/file_0000000086f881f4ac77b7bdbf8a3cb3_f95b97c2.png';

export const RESORT_EXTERIOR_SRC =
  '/assets/aistudio/file_00000000c81c81f491dc1c16c4128cb0_d25f8c0b.png';

export const RESORT_PHOTOS: ResortPhoto[] = [
  {
    id: 'exterior-facade',
    src: RESORT_EXTERIOR_SRC,
    title: 'Contemporary Architectural Facade',
    caption:
      'Two-story crisp white and charcoal exterior wings framed by landscaped greenery and paved arrival forecourt on No. 4 Onosuru Street, Udu.',
    category: 'Exterior',
    orientation: 'landscape',
  },
  {
    id: 'interior-chandelier-staircase',
    src: '/assets/aistudio/IMG-20261120-WA0085_f4bc2a66.jpg',
    title: 'The Stairwell',
    caption:
      'Double-height foyer featuring a tiered crystal-and-gold chandelier, smoked glass balustrade, and tall louvered daylight window.',
    category: 'Interiors',
    orientation: 'portrait',
  },
  {
    id: 'interior-marble-corridor',
    src: '/assets/aistudio/IMG-20261120-WA0086_8b959114.jpg',
    title: 'Private Guest Wing Corridor',
    caption:
      'Polished veined marble corridor leading to private guest suites with recessed ceiling lighting and dark timber door frames.',
    category: 'Interiors',
    orientation: 'portrait',
  },
  {
    id: 'interior-gallery-artwork',
    src: '/assets/aistudio/IMG-20261120-WA0088_ffbf3060.jpg',
    title: 'Curated Corridor Artwork',
    caption:
      'Expressive contemporary canvas artwork displayed above marble flooring along the guest residential corridor.',
    category: 'Interiors',
    orientation: 'portrait',
  },
  {
    id: 'room-deluxe',
    src: '/assets/aistudio/unnamed__23__87d93cd5.webp',
    title: 'Deluxe Guest Room',
    caption:
      'Warm wood flooring, tufted brown headboard with matching bench ottoman, fitted wardrobe, and corner lounge armchair.',
    category: 'Rooms & Suites',
    orientation: 'portrait',
  },
  {
    id: 'room-super-deluxe',
    src: '/assets/aistudio/IMG-20261120-WA0084_288ba561.jpg',
    title: 'Super Deluxe Suite',
    caption:
      'Bright ivory architectural paneled headboard with gold-framed accent trim, champagne drapes, and gold-edged marble side table.',
    category: 'Rooms & Suites',
    orientation: 'portrait',
  },
  {
    id: 'room-elite',
    src: '/assets/aistudio/IMG-20261120-WA0089_7e88a33b.jpg',
    title: 'Elite Paneled Suite',
    caption:
      'Full-height walnut and leather-paneled wall feature, warm brass wall sconce, speckled black terrazzo flooring, and draped daylight window.',
    category: 'Rooms & Suites',
    orientation: 'portrait',
  },
  {
    id: 'room-super-elite',
    src: '/assets/aistudio/inpaint_text_10_54ed33a5.jpg',
    title: 'Super Elite Flagship Suite',
    caption:
      'Floor-to-ceiling olive tufted headboard, sculptural mirror set against fluted timber paneling, cove-lit tray ceiling, and private lounge seating.',
    category: 'Rooms & Suites',
    orientation: 'portrait',
  },
];

export const ROOM_CATEGORIES: RoomCategory[] = [
  {
    id: 'deluxe',
    tierCode: '01',
    name: 'Deluxe',
    subtitle: 'Intimate Warmth & Tailored Comfort',
    nightlyRate: 35000,
    photoId: 'room-deluxe',
    description:
      'A serene private sanctuary appointed with rich wood flooring, a tailored tufted bed with matching upholstered bench, full-height fitted wardrobe, and an intimate corner reading seat.',
    observedHighlights: [
      'Upholstered tufted bed with matching bench',
      'Fitted full-height storage wardrobe',
      'Corner lounge chair & marble-top side table',
      'Split air-conditioning & warm pendant lighting',
    ],
  },
  {
    id: 'super-deluxe',
    tierCode: '02',
    name: 'Super Deluxe',
    subtitle: 'Luminous Ivory & Champagne Trim',
    nightlyRate: 40000,
    photoId: 'room-super-deluxe',
    description:
      'Bathed in soft natural light with polished marble floors, an architectural white-paneled headboard framed in gold trim, floor-to-ceiling champagne drapes, and plush bedside accents.',
    observedHighlights: [
      'Ivory architectural paneled headboard with gold trim',
      'Polished marble flooring & textured bedside rug',
      'Gold-rimmed marble accent table',
      'Split air-conditioning & brass bedside sconce',
    ],
  },
  {
    id: 'elite',
    tierCode: '03',
    name: 'Elite',
    subtitle: 'Architectural Timber & Terrazzo Poise',
    nightlyRate: 45000,
    photoId: 'room-elite',
    description:
      'Elevated spatial character defined by bespoke walnut-and-leather wall paneling behind the bed, warm brass sconce lighting, wide draped views, and dark speckled terrazzo flooring.',
    observedHighlights: [
      'Floor-to-ceiling walnut & leather feature wall',
      'Speckled black terrazzo floors & woven area rug',
      'Champagne window drapes with natural daylight views',
      'Warm brass wall sconce & split air-conditioning',
    ],
  },
  {
    id: 'super-elite',
    tierCode: '04',
    name: 'Super Elite',
    subtitle: 'Our Pinnacle Residential Suite',
    nightlyRate: 50000,
    photoId: 'room-super-elite',
    description:
      'Our most distinguished suite—featuring a commanding olive tufted headboard, fluted wood accent wall with a sculptural organic mirror, warm cove-lit tray ceiling, and private lounge seating.',
    observedHighlights: [
      'Floor-to-ceiling deep olive tufted headboard',
      'Fluted timber paneling & sculptural mirror alcove',
      'Recessed warm LED tray ceiling & pendant chandelier',
      'Private burnt-terracotta velvet armchair & sofa seating',
    ],
  },
];

export const PROPERTY_HIGHLIGHTS: PropertyHighlight[] = [
  {
    id: 'arrival-foyer',
    index: '01',
    title: 'Luminous Staircase Arrival',
    description:
      'Guests enter into a bright double-height stairwell illuminated by a tiered gold crystal chandelier, smoked glass balustrades, and warm architectural sconces.',
    photoId: 'interior-chandelier-staircase',
  },
  {
    id: 'private-corridors',
    index: '02',
    title: 'Calm Residential Wings',
    description:
      'Quiet veined-marble guest corridors with deep timber door frames and recessed ceiling lighting separate every suite for peaceful rest.',
    photoId: 'interior-marble-corridor',
  },
  {
    id: 'curated-art',
    index: '03',
    title: 'Light, Marble & A Touch of Colour',
    description:
      'Intentional art pieces and refined material finishes bring warmth, personality, and contemporary hospitality character to shared walkways.',
    photoId: 'interior-gallery-artwork',
  },
];

export const HOSPITALITY_STANDARDS: HospitalityStandard[] = [
  {
    id: 'craft',
    pillar: 'Architectural Presence',
    headline: 'Designed Around Calm Materials & Quiet Light',
    summary:
      'From veined marble corridors and fluted timber accents to full-height upholstered headboards, every photographed space balances warmth with refined restraint.',
  },
  {
    id: 'transparency',
    pillar: 'Transparent Stays',
    headline: 'Four Clear Tiers from ₦35,000 to ₦50,000',
    summary:
      'Explore Deluxe, Super Deluxe, Elite, and Super Elite accommodations with genuine suite photography and transparent nightly rates.',
  },
  {
    id: 'service',
    pillar: 'Direct Reservations Desk',
    headline: 'Personal Care From Arrival to Check-Out',
    summary:
      'Submit stay dates, guest count, and room preferences directly to our reservations team at No. 4 Onosuru Street, Udu.',
  },
];

function readEnv(key: string): string {
  try {
    const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
    return typeof env?.[key] === 'string' ? env[key]!.trim() : '';
  } catch {
    return '';
  }
}

export function getResortProfile(): ResortProfile {
  const whatsappNumber = readEnv('VITE_RESORT_WHATSAPP');
  const contactPhone = readEnv('VITE_RESORT_PHONE');
  const contactEmail = readEnv('VITE_RESORT_EMAIL');
  const resortAddress = readEnv('VITE_RESORT_ADDRESS') || RESORT_LOCATION.fullAddress;
  const googleMapsQuery = readEnv('VITE_RESORT_MAPS_QUERY') || RESORT_LOCATION.geocodeQuery;

  return {
    hotelName: RESORT_NAME,
    tagline: 'A place where comfort feels familiar and every stay feels like coming home.',
    whatsappNumber,
    contactPhone,
    contactEmail,
    resortAddress,
    localGovernmentArea: RESORT_LOCATION.lga,
    googleMapsQuery,
  };
}
