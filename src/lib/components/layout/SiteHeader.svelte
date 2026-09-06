<script lang="ts">
  import { tick } from 'svelte';
  import { site } from '$lib/config/site';
  import NavLinks from './NavLinks.svelte';

  type Props = { currentSection?: string };
  let props: Props = $props();
  let currentSection = $derived(props.currentSection ?? 'home');

  let dialog: HTMLDialogElement;
  let opener: HTMLButtonElement;
  let isOpen = $state(false);

  async function openMenu() {
    dialog?.showModal();
    isOpen = true;
    await tick();
    dialog?.querySelector<HTMLAnchorElement>('a')?.focus();
  }

  function closeMenu() {
    dialog?.close();
  }

  function handleClose() {
    isOpen = false;
    opener?.focus();
  }
</script>

<header class="mobile-header">
  <div class="mobile-bar">
    <a href="/" class="mobile-identity">{site.name}<span aria-hidden="true">.</span></a>
    <button id="menu-open" bind:this={opener} type="button" aria-expanded={isOpen} aria-controls="mobile-menu" onclick={openMenu}>
      Menu <span aria-hidden="true">☰</span>
    </button>
  </div>
  <nav class="mobile-fallback" aria-label="Mobile navigation">
    <NavLinks {currentSection} />
  </nav>
  <dialog bind:this={dialog} id="mobile-menu" aria-labelledby="menu-title" onclose={handleClose}>
    <div class="drawer-heading">
      <h2 id="menu-title">Navigation</h2>
      <button type="button" aria-label="Close menu" onclick={closeMenu}>Close <span aria-hidden="true">×</span></button>
    </div>
    <nav aria-label="Mobile navigation">
      <NavLinks {currentSection} onNavigate={closeMenu} />
    </nav>
  </dialog>
</header>

<style>
  .mobile-header { display: none; border-bottom: 1px solid var(--border); background: var(--surface); }
  .mobile-bar { display: flex; align-items: center; justify-content: space-between; gap: .6rem; padding: .8rem 1.25rem; }
  .mobile-identity { text-decoration: none; font-size: .85rem; font-weight: 600; }
  .mobile-identity span { color: var(--accent); }
  button { display: flex; gap: .65rem; align-items: center; min-height: 44px; background: transparent; border: 1px solid var(--border); color: var(--text); padding: .45rem .65rem; border-radius: .35rem; font-size: .85rem; }
  .mobile-fallback { padding: 0 1.25rem 1rem; }
  dialog { margin: 0 0 0 auto; width: min(21rem, 100%); height: 100%; max-height: 100%; border: 0; border-left: 1px solid var(--border); background: var(--surface); color: var(--text); padding: 1.5rem; }
  dialog::backdrop { background: rgb(0 0 0 / .65); }
  .drawer-heading { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 2rem; }
  h2 { font-size: 1.1rem; margin: 0; }
  @media (max-width: 767px) { .mobile-header { display: block; } }
</style>
