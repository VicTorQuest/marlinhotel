import type { APIRoute } from 'astro';
import { rooms, roomHref } from '../data/rooms';
import { absoluteSiteURL } from '../data/seo';
const escapeXML = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
export const GET: APIRoute = () => {
  if (!absoluteSiteURL('/')) return new Response('Set PUBLIC_SITE_URL before publishing a sitemap.', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  const paths = ['/', '/rooms/', ...rooms.map(roomHref), '/privacy-policy/', '/terms-and-conditions/'];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${escapeXML(absoluteSiteURL(path)!)}</loc></url>`).join('')}</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
