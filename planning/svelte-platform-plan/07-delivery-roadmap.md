# Delivery roadmap and acceptance gates

Status: every item is future work. Plans being present does not mean implementation has started.

## Work packages

| Phase | Deliverable | Depends on | Acceptance gate |
| --- | --- | --- | --- |
| 0 | Accepted current baseline, route list, content/asset inventory | None | Existing local work preserved; URLs, screenshots, and reproducible checks recorded |
| 1 | SvelteKit shell and initial design tokens | 0 | Builds, typechecks, SSR renders, pnpm lockfile is consistent |
| 2 | Portfolio parity and route compatibility | 1 | Five homepage anchors, portrait, responsive shell, old URLs, metadata, and keyboard navigation verified |
| 3 | PostgreSQL schema and public read contract | 1 | Integration tests cover revisions, publication filtering, pagination, and failure behavior |
| 4 | Owner login, private editor, Markdown/media pipeline | 3 | No anonymous/non-owner access; safe preview; save conflicts and upload failures recover cleanly |
| 5 | Database-backed public writing, feed, sitemap | 2, 3, 4 | Publish/edit/unpublish works without rebuild; draft revisions never leak |
| 6 | Visual improvements and real content | 2; publication requires 5 | W01–W10 assessed, approved case/article renders, component states and image budgets reviewed |
| 7 | Staging, restore rehearsal, runtime deployment workflow | 5, 6 | End-to-end checks, backup restore, health/error behavior, and rollback artifact verified |
| 8 | Production cutover and verification | 7 and deployment direction | Real domain, TLS, deep links, auth, metadata, content, and monitoring verified |

Case/article drafting and asset preparation can run alongside technical work, but do not publish incomplete fixtures to satisfy a gate. The framework port and backend can be developed independently against the agreed post contract, then integrated.

## First implementation slice

Create the SvelteKit shell and one representative article route using a local test fixture. Demonstrate blue styling, responsive navigation, SSR, and URL preservation. Then replace the fixture boundary with a tested PostgreSQL read path and build authoring. This provides an early reviewable result without making a custom CMS the first visible deliverable.

## Decisions still open

These are choices for implementation; they do not block writing the plans.

| Decision | Proposed default | What could change it |
| --- | --- | --- |
| Server hosting and monthly budget | Small Node-capable service, managed PostgreSQL, object storage | Existing infrastructure or strict cost ceiling |
| Author identity | Single GitHub account ID chosen by owner | Additional editors or a different identity provider |
| Editor | Markdown with preview and explicit Save | Strong need for rich editing may favor a CMS |
| Backend source | Your own database | An explicit requirement to import third-party articles |
| Public language | English initially | Confirmed Portuguese content and maintenance capacity |
| Case-study assets | Approved original screenshots or diagrams | Confidentiality constraints require anonymization |
| Publishing scope | Blog in database, Work content local initially | A requirement to author case studies through the editor |

## Release checklist

- [ ] No user changes lost; old routes and canonical URLs checked against real inventory.
- [ ] CI checks pass on the production build, with representative published and unpublished content.
- [ ] Keyboard, narrow-screen, zoom, reduced motion, and article typography reviewed.
- [ ] Anonymous and non-owner attempts cannot read drafts, preview media, or write content.
- [ ] A live article retains its published revision while a new draft is edited.
- [ ] Create/publish retries and concurrent saves are safe.
- [ ] Database outages produce explicit errors, not false empty states.
- [ ] Feeds, sitemap, public API, and page loads agree about publication state.
- [ ] Actual performance compared with baseline; no unreviewed regression.
- [ ] Backup and restore rehearsed, with previous deployment retained.
- [ ] Hosting configuration, costs, owner identity, and production cutover direction resolved.

## Implementation handoff

Read this directory in the README order, then inspect the current repository again. Plans are a dated proposal and may need adjustment if the site changes. Implement in small coherent slices, record deviations with a reason, and keep content approval separate from technical readiness. Do not treat this roadmap as authorization to deploy today.
