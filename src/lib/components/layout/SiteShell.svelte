<script lang="ts">
  import { onMount } from 'svelte';
  import SiteFooter from './SiteFooter.svelte';
  import SiteHeader from './SiteHeader.svelte';
  import SiteSidebar from './SiteSidebar.svelte';
  import '../../../styles/global.css';

  import type { Snippet } from 'svelte';
  type Props = { children: Snippet };
  let props: Props = $props();
  let currentSection = $state('home');

  onMount(() => {
    const sectionLinks = [...document.querySelectorAll<HTMLAnchorElement>('[data-section-link]')];
    const sections = sectionLinks
      .map((link) => document.getElementById(link.dataset.sectionLink ?? ''))
      .filter((section): section is HTMLElement => Boolean(section));
    if (!sections.length) return;

    function setCurrentSection(id: string) {
      currentSection = id;
    }

    function updateCurrentSection() {
      const reached = sections.filter((section) => section.getBoundingClientRect().top <= window.innerHeight * 0.35);
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      const activeSection = atBottom ? sections.at(-1) : reached.at(-1) || sections[0];
      if (activeSection) setCurrentSection(activeSection.id);
    }

    let scrollPending = false;
    let hashLock = false;
    let hashTimer: ReturnType<typeof setTimeout> | undefined;
    const handleScroll = () => {
      if (hashLock) return;
      if (scrollPending) return;
      scrollPending = true;
      requestAnimationFrame(() => {
        updateCurrentSection();
        scrollPending = false;
      });
    };
    const handleHashChange = () => {
      const id = location.hash.slice(1) || 'home';
      hashLock = true;
      setCurrentSection(id);
      if (hashTimer) clearTimeout(hashTimer);
      hashTimer = setTimeout(() => {
        hashLock = false;
        updateCurrentSection();
      }, 800);
    };
    const initialHash = location.hash.slice(1);
    if (initialHash) {
      hashLock = true;
      setCurrentSection(initialHash);
      hashTimer = setTimeout(() => {
        hashLock = false;
        updateCurrentSection();
      }, 800);
    } else {
      setCurrentSection('home');
      updateCurrentSection();
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateCurrentSection);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateCurrentSection);
      window.removeEventListener('hashchange', handleHashChange);
      if (hashTimer) clearTimeout(hashTimer);
    };
  });
</script>

<svelte:head>
  <meta name="theme-color" content="#111a24" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
</svelte:head>

<a class="skip-link" href="#main-content">Skip to content</a>
<SiteSidebar {currentSection} />
<div class="site-canvas">
  <SiteHeader {currentSection} />
  <main id="main-content" class="document" tabindex="-1">
    {@render props.children()}
  </main>
  <SiteFooter />
</div>

<style>
  :global(html) { background: var(--background); }
  :global(body) { margin: 0; color: var(--text); }
  :global(.site-canvas) { margin-left: var(--sidebar-width); min-height: 100vh; }
  :global(.document) { width: min(100%, var(--content-width)); margin: 0 auto; padding: 4rem clamp(1.5rem, 4vw, 4.5rem) 2rem; min-height: calc(100vh - 8rem); }
  .skip-link { position: fixed; top: .8rem; left: 1rem; transform: translateY(-200%); background: var(--text); color: var(--background); padding: .65rem 1rem; z-index: 100; border-radius: var(--radius); }
  .skip-link:focus { transform: none; }
  @media (max-width: 767px) {
    :global(.site-canvas) { margin-left: 0; }
    :global(.document) { padding: 3rem 1.25rem 1rem; }
  }
</style>
