<script lang="ts">
  import { publishedWork } from '$lib/features/writing/post.types';
</script>

<header class="page-header">
  <a href="/#work">← Home / Work</a>
  <p class="eyebrow">Work / Systems in context</p>
  <h1>Software is part of a bigger system.</h1>
  <p class="lead">Selected work will appear here with the problem, constraints, role, decisions, and approved evidence.</p>
</header>

{#if publishedWork.length}
  <div class="card-grid">
    {#each publishedWork as entry (entry.id)}
      <article class="card">
        <p class="eyebrow">{entry.data.problemDomain}</p>
        <h2><a href={`/work/${entry.id}/`}>{entry.data.title}</a></h2>
        <p>{entry.data.summary}</p>
      </article>
    {/each}
  </div>
{:else}
  <section class="work-feature">
    <img src="/images/connected-systems.svg" alt="Applications, data, people, and operations connected through integration." width="800" height="560" />
    <div class="prose">
      <p class="eyebrow">A connected approach</p>
      <h2>Start with the problem. See the whole picture.</h2>
      <p>Approved case studies will be added when their evidence and confidentiality reviews are complete.</p>
      <a class="text-link" href="/#contact">Talk through your system <span aria-hidden="true">↗</span></a>
    </div>
  </section>
{/if}

<style>
  .work-feature { display: grid; grid-template-columns: 1.2fr 1fr; align-items: center; gap: 2.5rem; }
  img { width: 100%; height: auto; border: 1px solid var(--border); border-radius: .8rem; }
  @media (max-width: 1100px) { .work-feature { grid-template-columns: 1fr; gap: 1.5rem; } }
</style>
