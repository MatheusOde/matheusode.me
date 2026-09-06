<script lang="ts">
  import { publishedWork } from '$lib/features/writing/post.types';
</script>

<section id="work" class="section single-page-section" aria-labelledby="work-title">
  <header class="section-heading"><div><p class="eyebrow">Work / Systems in context</p><h2 id="work-title">Software is part of a bigger system.</h2></div></header>
  {#if publishedWork.length > 0}
    <div class="card-grid">
      {#each publishedWork as entry (entry.id)}
        <article class="card">
          <p class="eyebrow">{entry.data.problemDomain}</p>
          <h3><a href={`/work/${entry.id}/`} data-event="work_case_opened">{entry.data.title}</a></h3>
          <p>{entry.data.summary}</p>
          <p>{entry.data.role}</p>
        </article>
      {/each}
    </div>
  {:else}
    <div class="work-feature">
      <img src="/images/connected-systems.svg" alt="Applications, data, people, and operations connected through integration." width="800" height="560" loading="lazy" />
      <div class="prose">
        <p class="eyebrow">A connected approach</p>
        <h3>Start with the problem.<br />See the whole picture.</h3>
        <p>If you are evaluating a full-stack application or an integration between business systems, tell me what needs to work together and what is getting in the way.</p>
        <a class="text-link" href="#contact">Talk through your system <span aria-hidden="true">↗</span></a>
      </div>
    </div>
  {/if}
</section>

<style>
  .work-feature { display: grid; grid-template-columns: 1.2fr 1fr; align-items: center; gap: 2.5rem; margin-top: 2.5rem; }
  img { width: 100%; height: auto; border: 1px solid var(--border); border-radius: .8rem; }
  h3 { font-size: 1.8rem; margin-top: 0; }
  .eyebrow { margin-bottom: 1rem; }
  @media (max-width: 1100px) { .work-feature { grid-template-columns: 1fr; gap: 1.5rem; } }
</style>
