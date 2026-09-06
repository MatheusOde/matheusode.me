<script lang="ts">
  import SeoHead from '$lib/components/SeoHead.svelte';
  import AboutSection from '$lib/features/portfolio/components/AboutSection.svelte';
  import ContactSection from '$lib/features/portfolio/components/ContactSection.svelte';
  import HeroSection from '$lib/features/portfolio/components/HeroSection.svelte';
  import PrinciplesSection from '$lib/features/portfolio/components/PrinciplesSection.svelte';
  import WorkSection from '$lib/features/portfolio/components/WorkSection.svelte';
  import WritingSection from '$lib/features/portfolio/components/WritingSection.svelte';
  import { site } from '$lib/config/site';
</script>

<SeoHead title="Home" description={site.description} />
<HeroSection />
<PrinciplesSection />
<WorkSection />
<WritingSection />
<AboutSection />
<ContactSection />
