# Website evolution and Svelte platform plan

Status: frontend phase implemented on the `svelte-frontend` branch; backend remains proposal only. Prepared 2026-09-06. The documents are retained as the implementation record and future backend specification.

## Read this first

Keep the blue visual identity and one scrollable portfolio homepage. Improve the evidence and reading experience, then migrate to SvelteKit with a small PostgreSQL-backed publishing backend and private editor. Use a single deployable application with clear internal boundaries. Separate services are unnecessary for the initial scope.

| Document | What it defines |
| --- | --- |
| [Website improvements](01-website-improvements.md) | Prioritized ideas, content direction, and visible acceptance criteria |
| [Svelte migration](02-svelte-migration.md) | Current-to-target mapping, routes, migration sequence, and rollback |
| [Blog backend](03-blog-backend.md) | Publishing workflow, data model, API, authentication, and implementation steps |
| [System design](04-system-design.md) | Architecture and sequence diagrams, deployment, failure behavior, and operations |
| [Design system](05-design-system.md) | Blue tokens, typography, spacing, components, imagery, and interaction rules |
| [Code conventions](06-code-conventions.md) | Module boundaries, Svelte patterns, naming, errors, tests, and review checklist |
| [Delivery roadmap](07-delivery-roadmap.md) | Ordered work packages, dependencies, acceptance gates, and open decisions |

## Current evidence

- The application uses Astro, TypeScript, local MDX collections, and static output. Existing CI includes Vitest, Playwright/axe, and Lighthouse.
- The homepage composes Home, Work, Writing, About, and Contact; separate Work and Writing detail routes already exist.
- `src/content/work/` and `src/content/writing/` contain no published content at inspection time. There is no existing blog database or authoring backend.
- Current local changes include a portrait, a systems illustration, blue tokens, navigation fixes, and ignore-file changes. The migration baseline must include accepted local work, not just the last commit.
- Repository deployment configuration targets GitHub Pages. Live account settings were not inspected. The proposed runtime backend needs server-capable hosting.
- The README and older launch checklist still describe a missing portrait, although the current local UI has one. Update those descriptions during implementation, after confirming the intended baseline.

This assessment is based on repository inspection, not a new browser usability study or measured performance audit. Proposed targets below are acceptance goals, not measured results.

## Proposed decisions

1. SvelteKit with TypeScript and current stable Svelte APIs; the frontend phase uses the static adapter and remains GitHub Pages-compatible.
2. One Node deployment using `adapter-node`, PostgreSQL, and private object storage for unpublished media. Public media gets a separate delivery path.
3. A private Svelte editor for one allowlisted owner, Markdown content, explicit save and publish actions, and immutable revisions.
4. The homepage shows the latest three posts. Keep `/writing/` for the archive and `/writing/[...slug]/` for deep links; do not rename the public section to `/blog/` without a reason.
5. SSR for database-backed pages; retain native links and readable HTML without JavaScript. “Single page” describes the homepage layout, not a client-only SPA.
6. No comments, public accounts, newsletter, external blog aggregation, or AI authoring in the first release.

The request is interpreted as retrieving your own posts from your backend. Importing Medium, DEV, Hashnode, or other feeds is a separate optional capability and is not assumed.

## Tradeoffs

Astro remains suitable for the current portfolio; a migration alone will not improve the content or guarantee better performance. SvelteKit was chosen because you requested Svelte and want publishing behavior in the same stack. The implemented frontend uses the static adapter so the current site can keep static hosting; the later database phase will switch to a server-capable adapter and hosting. A custom editor creates maintenance work, but keeps the entire application in Svelte and makes the workflow explicit.

If rich editing, several authors, or complex editorial workflows become immediate requirements, reconsider a headless CMS before building the editor. Payload is one option with [versions](https://payloadcms.com/docs/versions/overview) and [draft access rules](https://payloadcms.com/docs/versions/drafts), but its separate admin stack would add a second framework to operate. These are alternatives, not dependencies to install now.

## Scope of this planning delivery

All tasks in these documents are future work. Do not infer permission to publish content, register services, migrate production, modify DNS, install dependencies, or stage these plans. Existing evidence and confidentiality requirements in the parent `planning/` directory remain applicable.
