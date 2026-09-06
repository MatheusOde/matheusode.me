<script lang="ts">
  import { page } from '$app/state';
  import { site } from '$lib/config/site';

  type Props = {
    title: string;
    description?: string;
    image?: string;
    type?: 'website' | 'article';
    publishedTime?: string;
    modifiedTime?: string;
    noindex?: boolean;
  };
  let props: Props = $props();
  let title = $derived(props.title);
  let description = $derived(props.description ?? site.description);
  let image = $derived(props.image ?? site.socialImage);
  let type = $derived(props.type ?? 'website');
  let publishedTime = $derived(props.publishedTime);
  let modifiedTime = $derived(props.modifiedTime);
  let noindex = $derived(props.noindex ?? false);

  let fullTitle = $derived(`${title} | ${site.name}`);
  let canonical = $derived(new URL(page.url.pathname, site.url).href);
  let socialImage = $derived(new URL(image, site.url).href);
</script>

<svelte:head>
  <title>{fullTitle}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />
  <meta property="og:type" content={type} />
  <meta property="og:site_name" content={site.name} />
  <meta property="og:title" content={fullTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonical} />
  <meta property="og:image" content={socialImage} />
  <meta property="og:image:alt" content={`${site.name} — applications, data, and systems integration`} />
  <meta property="og:locale" content="en_US" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={fullTitle} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={socialImage} />
  {#if publishedTime}<meta property="article:published_time" content={publishedTime} />{/if}
  {#if modifiedTime}<meta property="article:modified_time" content={modifiedTime} />{/if}
  {#if noindex}<meta name="robots" content="noindex" />{/if}
  <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@type': 'Person', name: site.name, url: site.url, sameAs: [site.github, site.linkedin] }).replace(/</g, '\\u003c')}</script>
</svelte:head>
