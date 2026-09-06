<script lang="ts">
  import { publishedWriting } from '$lib/features/writing/post.types';
</script>

<section id="writing" class="section single-page-section" aria-labelledby="writing-title">
  <header class="section-heading"><div><p class="eyebrow">Writing / Ideas in practice</p><h2 id="writing-title">Good questions. Better systems.</h2></div></header>
  {#if publishedWriting.length > 0}
    <div class="card-grid">
      {#each publishedWriting.slice(0, 3) as entry (entry.id)}
        <article class="card">
          <p class="eyebrow">{entry.data.tags.join(' · ')}</p>
          <h3><a href={`/writing/${entry.id}/`} data-event="article_opened">{entry.data.title}</a></h3>
          <p>{entry.data.summary}</p>
        </article>
      {/each}
    </div>
  {:else}
    <div class="prose empty-state">
      <h3>A space for considered ideas.</h3>
      <p>There are no published articles here yet.</p>
      <p>Have a question about an integration or an engineering decision? <a href="#contact">I would be glad to hear it.</a></p>
    </div>
  {/if}
</section>

<style>
  section { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: start; }
  .empty-state { background: transparent; border: 0; border-left: 2px solid var(--accent); border-radius: 0; padding: .25rem 0 .25rem 2rem; }
  .empty-state h3 { margin-top: 0; }
  .empty-state p:last-child { margin-bottom: 0; }
  @media (max-width: 1100px) { section { grid-template-columns: 1fr; gap: 1rem; } }
</style>
