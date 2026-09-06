import { site } from '$lib/config/site';
import { publishedWriting } from '$lib/features/writing/post.types';

export const prerender = true;

export function GET() {
  const items = publishedWriting.map(({ id, data }) => `<item><title><![CDATA[${data.title}]]></title><description><![CDATA[${data.summary}]]></description><link>${site.url}/writing/${id}/</link><guid>${site.url}/writing/${id}/</guid><pubDate>${data.publishedDate?.toUTCString() ?? ''}</pubDate></item>`).join('');
  const body = `<?xml version="1.0" encoding="UTF-8" ?><rss version="2.0"><channel><title>${site.name} — Writing</title><description>${site.description}</description><link>${site.url}</link>${items}</channel></rss>`;
  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
