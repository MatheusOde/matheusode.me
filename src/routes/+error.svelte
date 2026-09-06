<script lang="ts">
  import { page } from '$app/state';
  import SeoHead from '$lib/components/SeoHead.svelte';
</script>

<SeoHead title="Page not found" noindex />
<div class="page-header">
  <p class="eyebrow">404 / Not found</p>
  <h1>This page is not part of the system.</h1>
  <p class="lead">The address may have changed, or the page may never have existed.</p>
  <p><a class="button primary" href="/">Return home <span aria-hidden="true">↗</span></a></p>
  <p class="metadata">Requested path: {page.url.pathname}</p>
</div>
