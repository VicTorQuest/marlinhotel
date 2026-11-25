// Business contact and location originate from public listings. Confirm with management before launch.
export const site = {
  name: 'Marlin Hotel & Suites',
  fullName: 'Marlin Hotel & Suites',
  location: 'Abule Ado, Lagos',
  neighborhood: 'Festac Town, Phase 2 Extension',
  address: '2145/2146, 91 Road, Phase 2 Extension, Abule Ado, Festac Town, Lagos, Nigeria',
  phoneDisplay: '+234 916 455 6280',
  phoneE164: '+2349164556280',
  maps: 'https://www.google.com/maps/search/?api=1&query=Marlin%20Hotel%20and%20Suit%20Abule%20Ado%20Lagos&query_place_id=ChIJEzBYp6uJOxARlq-bBVSdpDY',
  directions: 'https://www.google.com/maps/dir/?api=1&destination=Marlin%20Hotel%20and%20Suit%20Abule%20Ado%20Lagos&destination_place_id=ChIJEzBYp6uJOxARlq-bBVSdpDY',
  mapsEmbed: 'https://www.google.com/maps?q=Marlin%20Hotel%20and%20Suit%20Abule%20Ado%20Festac%20Lagos&output=embed',
  googleReviews: 'https://www.google.com/maps/search/?api=1&query=Marlin%20Hotel%20and%20Suit%20Abule%20Ado%20Lagos&query_place_id=ChIJEzBYp6uJOxARlq-bBVSdpDY',
} as const;

// Hotel imagery supplied by Marlin with ChatGPT enhancements.
export const photos = {
  exterior: { src: exterior, mobile: exteriorMobile, alt: 'Marlin Hotel entrance and street-facing façade' },
  receptionWide: { src: receptionWide, mobile: receptionMobile, alt: 'Reception desk and seating beneath circular lights' },
  receptionPortrait: { src: receptionPortrait, alt: 'Marlin reception with a dark tiled floor and circular ceiling lights' },
  loungePanorama: { src: loungePanorama, alt: 'Window-lined lounge with a long purple sofa' },
  loungeColor: { src: loungeColor, alt: 'Lounge with green and cream armchairs and coloured ceiling lights' },
  guestRoomClassic: { src: guestRoomClassic, alt: 'Guest room with blue cushions and a bed beside the window' },
  guestRoomClassicAngle: { src: guestRoomClassicAngle, alt: 'Blue-accent guest room with a circular ceiling light above the bed' },
  guestRoomWide: { src: guestRoomWide, mobile: guestRoomMobile, alt: 'Guest room with blue bedding, a side table and a wall-mounted television' },
  guestRoomDetail: { src: guestRoomDetail, alt: 'Guest room with blue bedding, an armchair and a long white desk' },
  guestRoomGreen: { src: guestRoomGreen, alt: 'Guest room with green accent lighting and patterned carpet' },
  guestRoomAmbient: { src: guestRoomAmbient, alt: 'Guest room with a seating area and warm pendant lighting' },
  gym: { src: gym, alt: 'Exercise bikes and a treadmill beside windows overlooking the pool' },
  poolCourtyard: { src: poolCourtyard, alt: 'Marlin courtyard with an outdoor pool and wooden seating' },
} as const;

// Existing non-room stock imagery is unchanged.
const unsplash = 'https://images.unsplash.com/';
export const stockBreakfast = `${unsplash}photo-1533089860892-a7c6f0a88666`;
export const photoURL = (base: string, width: number) =>
  `${base}?auto=format&fit=crop&w=${width}&q=80`;
export const photoSrcset = (base: string, widths: number[]) =>
  widths.map((width) => `${photoURL(base, width)} ${width}w`).join(', ');

export const faqs = [
  {
    question: 'Where exactly is Marlin Hotel located?',
    answer: 'The public business listing places Marlin Hotel at 2145/2146, 91 Road, Phase 2 Extension, Abule Ado, Festac Town, Lagos. Open the directions link to navigate, and call reception to confirm the best entrance or a nearby landmark.',
  },
  {
    question: 'How do I check the current price of a room?',
    answer: 'View our Rooms page for published nightly rates, and contact reception to confirm availability and what is included in your stay.',
  },
  {
    question: 'Can I book a room directly from this website?',
    answer: 'Use the booking enquiry form to prepare your stay details, or call reception directly. A reservation is only confirmed when the hotel accepts your enquiry.',
  },
  {
    question: 'What facilities and room amenities are available?',
    answer: 'Facilities and room features vary by property and room type. Please ask reception about the amenities that matter to you. We will display confirmed information here when the hotel supplies it.',
  },
  {
    question: 'What are the check-in and check-out times?',
    answer: 'Check-in and check-out times have not yet been verified. Contact the hotel to confirm its current arrival and departure policy.',
  },
  {
    question: 'Can I get directions before travelling?',
    answer: 'Yes. Use the Get Directions button to open the publicly listed hotel location in Google Maps. If the route is unclear, call reception for the best approach and nearest landmark.',
  },
] as const;
import exterior from '../assets/marlin/marlin-exterior.webp';
import exteriorMobile from '../assets/marlin/marlin-exterior-mobile.webp';
import receptionWide from '../assets/marlin/marlin-reception-wide.webp';
import receptionMobile from '../assets/marlin/marlin-reception-wide-mobile.webp';
import receptionPortrait from '../assets/marlin/marlin-reception-portrait.webp';
import loungePanorama from '../assets/marlin/marlin-lounge-panorama.webp';
import loungeColor from '../assets/marlin/marlin-lounge-colorful.webp';
import guestRoomClassic from '../assets/marlin/marlin-guest-room-classic.webp';
import guestRoomClassicAngle from '../assets/marlin/marlin-guest-room-classic-angle.webp';
import guestRoomWide from '../assets/marlin/marlin-guest-room-wide.webp';
import guestRoomMobile from '../assets/marlin/marlin-guest-room-wide-mobile.webp';
import guestRoomDetail from '../assets/marlin/marlin-guest-room-detail.webp';
import guestRoomGreen from '../assets/marlin/marlin-guest-room-green.webp';
import guestRoomAmbient from '../assets/marlin/marlin-guest-room-ambient.webp';
import gym from '../assets/marlin/marlin-gym.webp';
import poolCourtyard from '../assets/marlin/marlin-pool-courtyard.webp';

