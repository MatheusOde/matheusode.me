<script lang="ts">
  import { navigation } from '$lib/config/site';

  type Props = {
    currentSection?: string;
    onNavigate?: () => void;
  };
  let props: Props = $props();
  let currentSection = $derived(props.currentSection ?? 'home');

  function handleNavigate() {
    props.onNavigate?.();
  }
</script>

<ul class="nav-links">
  {#each navigation as item (item.section)}
    <li>
      <a
        href={item.href}
        data-section-link={item.section}
        aria-label={item.label}
        title={item.label}
        aria-current={currentSection === item.section ? 'page' : undefined}
        onclick={handleNavigate}
      >
        <span class="nav-icon" aria-hidden="true">{item.icon}</span>
        <span class="nav-label">{item.label}</span>
      </a>
    </li>
  {/each}
</ul>

<style>
  .nav-links { list-style: none; padding: 0; margin: 0; display: grid; gap: .3rem; }
  a { display: flex; gap: .9rem; align-items: center; min-height: 44px; padding: .55rem .8rem; text-decoration: none; color: var(--text-secondary); border-radius: .35rem; font-size: .9rem; }
  a:hover { background: var(--surface-raised); color: var(--text); }
  a[aria-current='page'] { color: var(--accent); background: var(--accent-surface); font-weight: 600; }
  .nav-icon { width: 1.1rem; text-align: center; font-size: 1.2rem; line-height: 1; flex-shrink: 0; }
  :global(.sidebar-collapsed .site-sidebar .nav-label) { display: none; }
</style>
