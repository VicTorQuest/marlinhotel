import type { ImageMetadata } from 'astro';
import { photos } from './site';

export interface RoomPhoto { src: ImageMetadata; alt: string }
export interface VerifiedRate { amount: number; currency: 'NGN'; verified: boolean; conditions?: string }
export interface Room {
  id: string;
  slug: string;
  title: string;
  description: string;
  highlight: string;
  gallery: readonly [RoomPhoto, ...RoomPhoto[]];
  style: string;
  // Populate only after management confirms the category and individual facts.
  verifiedCategory?: string;
  verifiedCapacity?: number;
  verifiedBed?: string;
  verifiedAmenities?: readonly string[];
  rate?: VerifiedRate;
  verifiedCheckIn?: string;
  verifiedCheckOut?: string;
  availability: 'reception-confirmation';
}

// Categories and nightly rates are taken from the hotel’s supplied rate card.
// The photo-to-category mapping has not been confirmed. Galleries show general hotel room photography.
export const roomPhotoNote = "Photos show Marlin’s guest rooms; the exact layout and décor for each category may vary. Confirm your room with reception.";
export const legacyRoomSlugs = ['blue-accent-room', 'room-with-desk', 'green-accent-room', 'warm-lit-room'] as const;
export const rooms: readonly Room[] = [
  {
    id: 'classic', slug: 'standard-room', title: 'Standard Room',
    description: 'Choose a Standard Room for your next overnight stay in Lagos.',
    highlight: 'Marlin Hotel & Suites · Lagos', style: 'Standard Room',
    verifiedCategory: 'Standard Room',
    rate: { amount: 35000, currency: 'NGN', verified: true },
    gallery: [photos.guestRoomClassic, photos.guestRoomClassicAngle],
    availability: 'reception-confirmation',
  },
  {
    id: 'wide', slug: 'suite', title: 'Suite',
    description: 'Enquire about a Suite for your preferred dates at Marlin Hotel.',
    highlight: 'Marlin Hotel & Suites · Lagos', style: 'Suite',
    verifiedCategory: 'Suite',
    rate: { amount: 40000, currency: 'NGN', verified: true },
    gallery: [photos.guestRoomWide, photos.guestRoomDetail],
    availability: 'reception-confirmation',
  },
  {
    id: 'green', slug: 'executive-suite', title: 'Executive Suite',
    description: 'Plan your stay in an Executive Suite and confirm your room requirements with reception.',
    highlight: 'Marlin Hotel & Suites · Lagos', style: 'Executive Suite',
    verifiedCategory: 'Executive Suite',
    rate: { amount: 50000, currency: 'NGN', verified: true },
    gallery: [photos.guestRoomGreen],
    availability: 'reception-confirmation',
  },
  {
    id: 'ambient', slug: 'presidential-suite', title: 'Presidential Suite',
    description: 'Explore Marlin’s highest-priced room category and enquire about availability for your stay.',
    highlight: 'Marlin Hotel & Suites · Lagos', style: 'Presidential Suite',
    verifiedCategory: 'Presidential Suite',
    rate: { amount: 60000, currency: 'NGN', verified: true },
    gallery: [photos.guestRoomAmbient],
    availability: 'reception-confirmation',
  },
];

export const roomName = (room: Room) => room.verifiedCategory?.trim() || room.title;
export const roomHref = (room: Room) => `/rooms/${room.slug}/`;
export const bookingHref = (room?: Room) => room ? `/rooms/book/?room=${encodeURIComponent(room.slug)}` : '/rooms/book/';
export const hasVerifiedRate = (room: Room) => !!room.rate?.verified && Number.isFinite(room.rate.amount) && room.rate.amount > 0;
export const rateLabel = (room: Room) => hasVerifiedRate(room) && room.rate
  ? new Intl.NumberFormat('en-NG', { style: 'currency', currency: room.rate.currency, maximumFractionDigits: 2, minimumFractionDigits: 0 }).format(room.rate.amount)
  : 'Enquire for rates';
export const roomFilter = (room: Room) => room.verifiedCategory?.trim() || room.style;
