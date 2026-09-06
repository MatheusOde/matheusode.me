<script lang="ts">
  import { onMount } from 'svelte';
  import { site } from '$lib/config/site';
  import NavLinks from './NavLinks.svelte';

  type Props = {
    currentSection?: string;
    onNavigate?: () => void;
  };
  let props: Props = $props();
  let currentSection = $derived(props.currentSection ?? 'home');

  let isCollapsed = $state(false);

  function toggleSidebar() {
    isCollapsed = !isCollapsed;
    document.body.classList.toggle('sidebar-collapsed', isCollapsed);
  }

  onMount(() => () => document.body.classList.remove('sidebar-collapsed'));
</script>

<aside class="site-sidebar" aria-label="Site sidebar">
  <a class="identity" href="/" aria-label={`${site.name}, home`}>
    <span class="monogram" aria-hidden="true">mo<span>.</span></span>
    <span class="identity-label">Matheus<br />Odebrecht</span>
  </a>
  <nav aria-label="Primary navigation">
    <NavLinks {currentSection} onNavigate={props.onNavigate} />
  </nav>
  <div class="sidebar-bottom">
    <p class="sidebar-note">Software, systems,<br />and the space between.</p>
    <button
      id="sidebar-toggle"
      type="button"
      aria-expanded={!isCollapsed}
      aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      onclick={toggleSidebar}
    >
      <span aria-hidden="true">{isCollapsed ? '⇥' : '⇤'}</span>
      <span class="toggle-label">{isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}</span>
    </button>
  </div>
</aside>

<style>
  .site-sidebar { width: var(--sidebar-width); position: fixed; inset: 0 auto 0 0; background: var(--surface); border-right: 1px solid var(--border); padding: 2rem 1rem 1.25rem; display: flex; flex-direction: column; z-index: 10; transition: width var(--duration); }
  .identity { display: flex; align-items: center; gap: .85rem; padding: .4rem .6rem; text-decoration: none; margin-bottom: 3rem; }
  .monogram { font-size: 1.5rem; font-weight: 650; letter-spacing: -.1em; }
  .monogram span { color: var(--accent); }
  .identity-label { font-size: .84rem; line-height: 1.4; font-weight: 500; }
  .sidebar-bottom { margin-top: auto; padding-top: 3rem; }
  .sidebar-note { color: var(--text-secondary); font-size: .75rem; padding: .5rem .8rem; }
  button { display: flex; gap: .6rem; align-items: center; background: none; color: var(--text-secondary); border: none; padding: .7rem .8rem; min-height: 44px; width: 100%; font-size: .75rem; border-radius: .3rem; }
  button:hover { background: var(--surface-raised); }
  :global(.sidebar-collapsed) .identity-label, :global(.sidebar-collapsed) .sidebar-note, :global(.sidebar-collapsed) .toggle-label { display: none; }
  @media (max-width: 767px) { .site-sidebar { display: none; } }
</style>
