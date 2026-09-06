# SvelteKit implementation plan

## Target

Use SvelteKit, TypeScript, and Svelte's current stable component APIs. Keep server rendering enabled. The completed frontend phase uses `adapter-static` and remains compatible with the current GitHub Pages workflow. The later publishing phase will switch to `adapter-node` (or another server-capable adapter) when the backend is authorized. Confirm compatible versions and the Node engine requirement at implementation time; do not assume the current Astro dependency versions map directly.

SvelteKit supports server-side page data loading through `+page.server.ts`, which fits database-backed writing. Only return public display data from public loads. See [loading data](https://svelte.dev/docs/kit/load).

## File and capability mapping

| Current | Proposed destination / behavior |
| --- | --- |
| `src/pages/index.astro` | `src/routes/+page.svelte` composed from portfolio sections |
| `src/layouts/BaseLayout.astro` | `src/routes/+layout.svelte` plus shared shell and metadata components |
| `src/components/HeroSection.astro` and other sections | `src/lib/features/portfolio/components/*.svelte` |
| Sidebar, header, navigation, footer | `src/lib/components/layout/*.svelte` |
| `src/components/SeoHead.astro` | Shared `SeoHead.svelte` using `<svelte:head>` |
| `src/config/site.ts` | `src/lib/config/site.ts`; retain identity and analytics defaults |
| `src/styles/*.css` | Shared token/base/prose styles; use component-scoped CSS for local layout |
| `public/images/` | `static/images/` for owned fixed assets; CMS media uses controlled storage |
| `src/content.config.ts` and writing MDX | Backend post schemas and imported revisions; see backend plan |
| Work collection and publication checks | Framework-neutral local content module initially; keep all existing evidence checks |
| RSS and sitemap integrations | Explicit server endpoints using the published-post service |
| Astro scripts and ESLint integration | SvelteKit build/check, Svelte lint configuration, existing Vitest/Playwright tools adapted |

Move work validation away from `astro/zod` to a directly declared compatible validation dependency. Do not weaken confidentiality or publication rules during the port.

## Route contract

| URL | Target behavior |
| --- | --- |
| `/` and its five existing anchors | SSR homepage with latest three published articles; stable section IDs |
| `/writing/` | SSR archive, cursor pagination, later optional tag filter |
| `/writing/[...slug]/` | Reserved for the backend phase; no published article slugs exist in the current content set |
| `/work/` | Permanent redirect to `/#work` after verifying the actual old page has no unique content |
| `/work/[...slug]/` | Reserved for approved case-study content; no published case slugs exist in the current content set |
| `/about/`, `/contact/` | Permanent redirects to corresponding homepage anchors after content comparison |
| `/rss.xml`, `/sitemap.xml`, `/robots.txt` | Server routes; well-formed output even with zero articles |
| `/admin/`, `/admin/posts/new/`, `/admin/posts/[id]/` | Authenticated editor routes; never index or publicly cache |
| `/preview/posts/[id]/` | Owner-authenticated draft rendering, `noindex`, `private, no-store` |
| `/api/v1/posts/`, `/api/v1/posts/[...slug]/` | Public read endpoints defined in backend plan |
| Unknown URL | Real 404 with navigation recovery, not a 200 SPA fallback |

Use a single trailing-slash policy matching existing public URLs. Keep XML/text endpoint names literal. Record actual existing URLs from source and deployed sitemap before creating redirects; do not invent a historical URL list.

## Migration sequence

### 1. Establish an accepted baseline

Inventory tracked and untracked work, routes, metadata, assets, redirects, tests, and deployment settings. Preserve user changes, including the existing lockfile discrepancy. Capture homepage/article/case and mobile screenshots using representative test content that cannot be published accidentally.

### 2. Build the Svelte foundation

On a future implementation branch or isolated checkout, create the SvelteKit shell, port blue tokens and static assets, and establish type/lint/test scripts. Keep package management on pnpm. Resolve the old npm lockfile deliberately during implementation, not as incidental cleanup.

### 3. Port the portfolio at visual parity

Translate components by responsibility rather than copying all Astro inline scripts. Use Svelte state for sidebar expansion and an observer for current-section tracking. Initialize browser APIs after mount and clean them up. Test direct hash navigation, back/forward, collapsed navigation, and reduced motion.

Native anchors remain the baseline. CSS offsets prevent sticky navigation from covering section headings. Do not let scroll observers overwrite browser history on every intersection.

### 4. Implement static reading views

Build the frontend archive and empty states against the typed static post contract. The database schema, public queries, API routes, and server loads belong to the deferred backend phase and are not part of this branch.

Port title, canonical, Open Graph, dates, article structured data, RSS, sitemap, and not-found behavior. Empty archives remain honest. A database outage must not be presented as “no posts yet.”

### 5. Defer private authoring

Do not implement owner login, Markdown draft/save/preview/publish, revisions, media processing, or conflict handling yet. Those requirements remain specified in [the backend plan](03-blog-backend.md).

### 6. Apply visual improvements

Once functional parity is verified, apply W01–W10 in small reviewable batches using the design system. This sequencing makes migration regressions distinguishable from intentional layout changes.

### 7. Stage and cut over

Deploy to a server-capable staging environment with an isolated database and no indexing. Confirm environment variables, proxy origin handling, assets, health checks, backups, and OAuth callbacks. The [Node adapter](https://svelte.dev/docs/kit/adapter-node) produces a standalone server; runtime operation and proxy configuration are deployment responsibilities.

GitHub Pages cannot host this Node backend. A static alternative is possible using [adapter-static](https://svelte.dev/docs/kit/adapter-static) plus an external CMS and rebuilds, but that is a different publishing design. Do not silently retain the Pages upload workflow for the SSR application.

## Acceptance and rollback

- All retained links and old URLs resolve as specified; titles, canonicals, feeds, and status codes match their purpose.
- No authentication code, editor bundle, credentials, or unpublished fields in public payloads.
- Full content renders on direct requests and without JavaScript.
- Equivalent navigation and accessibility coverage passes in Chromium, Firefox, and WebKit.
- Compare lab performance with the accepted Astro baseline; investigate regressions before cutover.
- Export posts/media and record the known-good deployment before changing production.
- Keep additive database migrations compatible with the previous Svelte release. Roll back the app artifact without discarding new posts.
- Retain the Astro artifact as an emergency static fallback. It will not contain new backend posts unless an export is prepared; document that limitation rather than silently losing published URLs.
- Production hosting and DNS changes are future execution steps, not part of these plans.
