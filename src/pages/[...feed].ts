import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { isPublishedWriting, sortByPublishedDate } from '../lib/content';
import { site } from '../config/site';
export async function getStaticPaths() {
  const entries = await getCollection('writing', ({data}) => isPublishedWriting(data));
  return entries.length ? [{ params: {feed:'rss.xml'} }] : [];
}
export async function GET() {
  const entries = sortByPublishedDate(await getCollection('writing', ({data}) => isPublishedWriting(data)));
  return rss({title:`${site.name} — Writing`, description:site.description, site:site.url, items:entries.map(({id,data}) => ({title:data.title,description:data.summary,pubDate:data.publishedDate!,link:`/writing/${id}/`}))});
}
