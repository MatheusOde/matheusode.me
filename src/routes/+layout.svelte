<script lang="ts">
  import type { LayoutProps } from './$types';
  import SiteShell from '$lib/components/layout/SiteShell.svelte';

  let props: LayoutProps = $props();
</script>

<SiteShell>
  {@render props.children()}
</SiteShell>
