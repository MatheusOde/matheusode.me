import { site } from '$lib/config/site';
import { publishedWriting, publishedWork } from '$lib/features/writing/post.types';

export const prerender = true;

export function GET() {
  const urls = ['/', '/writing/', '/work/', '/about/', '/contact/', ...publishedWriting.map(({ id }) => `/writing/${id}/`), ...publishedWork.map(({ id }) => `/work/${id}/`)]
    .map((path) => `<url><loc>${site.url}${path}</loc></url>`)
    .join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
