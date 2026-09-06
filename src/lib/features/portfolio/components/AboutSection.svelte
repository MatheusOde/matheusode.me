<script lang="ts">
  import { site } from '$lib/config/site';
</script>

<section id="about" class="section single-page-section" aria-labelledby="about-title">
  <header class="section-heading"><div><p class="eyebrow">About / Perspective</p><h2 id="about-title">Software is never just software.</h2></div></header>
  <article class="prose">
    <p>I work at the intersection of applications, data, operations, and the people responsible for making a process run.</p>
    <p>My work is grounded in full-stack engineering and systems integration: understanding a business need, making system boundaries explicit, and delivering software that fits the surrounding operation.</p>
    <h3>Working principles</h3>
    <ul>
      <li>Make the problem and its constraints visible before choosing a solution.</li>
      <li>Treat interfaces and data as products that deserve care.</li>
      <li>Prefer clear, maintainable delivery over impressive complexity.</li>
    </ul>
    <p><a class="text-link" href={site.linkedin} data-event="linkedin_clicked">Connect on LinkedIn <span aria-hidden="true">↗</span></a></p>
  </article>
</section>

<style>
  section { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
  .section-heading h2 { max-width: 22rem; font-size: clamp(2rem, 3vw, 3.5rem); }
  li { padding-bottom: .5rem; }
  ul { padding-left: 1.25rem; }
  @media (max-width: 1100px) { section { grid-template-columns: 1fr; gap: 1rem; } }
</style>
