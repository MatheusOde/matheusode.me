<script lang="ts">
  import { site } from '$lib/config/site';
</script>

<header id="home" class="hero-header single-page-section">
  <div class="hero-copy">
    <p class="eyebrow">Matheus Odebrecht / Software engineer</p>
    <h1>Complex systems.<br /><span>Human solutions.</span></h1>
    <p class="lead">I build full-stack applications and connect business systems—turning complicated processes into software that makes sense.</p>
    <div class="actions">
      <a class="button primary" href="#work">Explore my approach <span aria-hidden="true">↗</span></a>
      <a class="text-link" href="#contact">Let’s talk <span aria-hidden="true">→</span></a>
    </div>
    <p class="hero-specialties">Full-stack development <span aria-hidden="true">/</span> Systems integration</p>
  </div>
  <figure class="hero-portrait">
    <img src="/images/matheus.jpeg" alt={site.name} width="1098" height="1280" fetchpriority="high" />
    <figcaption><span>Behind the code</span><strong>Matheus Odebrecht <span aria-hidden="true">↗</span></strong></figcaption>
  </figure>
</header>

<style>
  .hero-header { display: grid; grid-template-columns: 1.3fr 1fr; gap: clamp(2rem, 4vw, 4rem); align-items: center; padding: 1rem 0 4.5rem; }
  .hero-copy { min-width: 0; }
  h1 { font-size: clamp(2.8rem, 4.5vw, 5.3rem); line-height: 1.04; letter-spacing: -.065em; }
  h1 span { color: var(--accent); }
  .lead { font-size: 1.08rem; max-width: 32rem; }
  .eyebrow { margin-bottom: 2rem; }
  .hero-specialties { margin: 2.5rem 0 0; font-family: var(--font-mono); font-size: .68rem; color: var(--text-secondary); }
  .hero-specialties span { margin-inline: .5rem; color: var(--accent); }
  .hero-portrait { position: relative; margin: 0; border-radius: 9rem 9rem .8rem .8rem; overflow: hidden; background: var(--surface); aspect-ratio: 4 / 5; }
  .hero-portrait img { display: block; width: 100%; height: 100%; object-fit: cover; }
  figcaption { position: absolute; bottom: 0; inset-inline: 0; padding: 3.5rem 1.5rem 1.5rem; background: linear-gradient(transparent, rgb(10 17 25 / .95)); color: #fff; }
  figcaption > span { display: block; font: .65rem var(--font-mono); text-transform: uppercase; letter-spacing: .15em; margin-bottom: .4rem; }
  figcaption strong { display: flex; justify-content: space-between; font-size: .95rem; font-weight: 500; }
  @media (min-width: 768px) and (max-width: 1100px) { .hero-header { grid-template-columns: 1fr; } .hero-portrait { max-width: 28rem; width: 100%; aspect-ratio: 5 / 4; border-radius: 1rem; } }
  @media (max-width: 767px) { .hero-header { grid-template-columns: 1fr; padding-bottom: 3rem; gap: 2.5rem; } h1 { font-size: clamp(2.65rem, 10vw, 4.5rem); } .hero-portrait { max-width: 30rem; width: 100%; aspect-ratio: 1; border-radius: 7rem 7rem .8rem .8rem; } .hero-specialties { margin-top: 1.5rem; } }
</style>
