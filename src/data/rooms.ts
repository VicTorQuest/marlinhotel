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

// These are photographic views, not four confirmed room types or units.
// Retain stable slugs when management supplies the official category mapping.
export const rooms: readonly Room[] = [
  {
    id: 'classic', slug: 'blue-accent-room', title: 'Blue-accent room',
    description: 'Blue cushions, a bed beside the window and circular ceiling lighting give this photographed interior its character.',
    highlight: 'Blue accents · Window-side bed', style: 'Blue accents',
    gallery: [photos.guestRoomClassic, photos.guestRoomClassicAngle],
    availability: 'reception-confirmation',
  },
  {
    id: 'wide', slug: 'room-with-desk', title: 'Room with a desk',
    description: 'Take a closer look at the blue bedding, seating, television and white desk in these room photographs.',
    highlight: 'Blue bedding · Seating and desk', style: 'Blue accents',
    gallery: [photos.guestRoomWide, photos.guestRoomDetail],
    availability: 'reception-confirmation',
  },
  {
    id: 'green', slug: 'green-accent-room', title: 'Green-accent room',
    description: 'Green accent lighting and a patterned carpet are visible in this photographed guest room.',
    highlight: 'Green lighting · Patterned carpet', style: 'Green accents',
    gallery: [photos.guestRoomGreen],
    availability: 'reception-confirmation',
  },
  {
    id: 'ambient', slug: 'warm-lit-room', title: 'Warm-lit room',
    description: 'Warm pendant lighting and a seating area give this guest room photograph a welcoming atmosphere.',
    highlight: 'Warm lighting · Seating area', style: 'Warm lighting',
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
