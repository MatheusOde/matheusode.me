<script lang="ts">
  import { publishedWriting } from '$lib/features/writing/post.types';
</script>

<header class="page-header">
  <a href="/#writing">← Home / Writing</a>
  <p class="eyebrow">Writing / Ideas in practice</p>
  <h1>Good questions. Better systems.</h1>
  <p class="lead">Notes on full-stack development, systems integration, and the decisions that make software fit its context.</p>
</header>

{#if publishedWriting.length}
  <div class="card-grid">
    {#each publishedWriting as entry (entry.id)}
      <article class="card">
        <p class="eyebrow">{entry.data.tags.join(' · ')}</p>
        <h2><a href={`/writing/${entry.id}/`}>{entry.data.title}</a></h2>
        <p>{entry.data.summary}</p>
      </article>
    {/each}
  </div>
{:else}
  <section class="empty-state prose" aria-labelledby="writing-empty-title">
    <h2 id="writing-empty-title">A space for considered ideas.</h2>
    <p>There are no published articles here yet.</p>
    <p>Have a question about an integration or an engineering decision? <a href="/#contact">I would be glad to hear it.</a></p>
  </section>
{/if}
