# Clean code patterns and conventions

## Architecture rule

Use a modular application with feature-oriented UI and explicit server boundaries. Keep route modules thin, business rules testable, and database details out of presentation components. Prefer a few clear functions over a framework of generic repositories or base services.

```text
src/
  routes/
    +layout.svelte
    +page.svelte
    +page.server.ts
    writing/+page.svelte
    writing/[...slug]/+page.svelte
    writing/[...slug]/+page.server.ts
    api/v1/posts/+server.ts
    admin/posts/[id]/+page.svelte
    admin/posts/[id]/+page.server.ts
  lib/
    components/
      layout/
      ui/
    features/
      portfolio/components/
      writing/components/
      writing/post.types.ts
      editor/components/
    server/
      auth/
      db/schema/
      posts/post.queries.ts
      posts/post.repository.ts
      posts/post.service.ts
      posts/post.schema.ts
      posts/post.mapper.ts
      content/render-markdown.ts
      media/
    config/site.ts
    styles/
  hooks.server.ts
tests/
  integration/
  e2e/
```

This is an ownership map, not a requirement to create empty directories or one-line wrappers. Private helpers and tests stay beside their owner. Add a module when there is a real responsibility to separate.

## Dependency direction

Public page load / API route → published-post queries → repository → database.

Admin action → authentication and input validation → post service → repository transaction and media adapter.

Page component → feature components → shared UI primitives. Components receive render-ready values and callbacks; they do not import repositories, credentials, or server modules. Public server loads and API handlers share application functions instead of duplicating publication rules.

Store credentials and database access under `$lib/server` or in `.server.ts` modules. [SvelteKit's server-only module rules](https://svelte.dev/docs/kit/server-only-modules) protect import boundaries, but any data returned from a public load must still be deliberately safe to disclose.

## Naming and formatting

| Item | Convention | Example |
| --- | --- | --- |
| Svelte component | PascalCase, one primary UI concern | `ArticleCard.svelte` |
| TS module | Descriptive kebab-case, optional responsibility suffix | `post.mapper.ts`, `render-markdown.ts` |
| Functions/values | camelCase; verb for an action | `publishPost`, `publishedPosts` |
| Types | PascalCase; no `I` prefix | `PostSummary`, `PublishPostInput` |
| Boolean | `is`, `has`, `can`, or `should` when natural | `isSaving`, `canPublish` |
| Callback prop | `on` plus action | `onSave` |
| Local handler | `handle` plus action | `handleSubmit` |
| Semantic constant | Upper snake case | `MAX_UPLOAD_BYTES` |
| Database field | SQL snake_case, TS camelCase mapping | `published_at` ↔ `publishedAt` |
| Public route | Lowercase, preserve established slugs | `/writing/retry-safe-integrations/` |

Keep current TypeScript preferences: single quotes, semicolons, two-space indentation. Add an appropriate Svelte formatter when implementing and use it as the authority. Import external dependencies first, then direct internal modules, then types and styles in consistent groups. Prefer `import type`; avoid convenience barrels that obscure ownership.

Use named function declarations for named operations; arrow callbacks are fine for concise local transformations. Use `map` and `filter` when they express intent clearly. Do not turn readable code into a reducer merely to save an unmeasured pass over a small collection.

## Svelte rules

Use `$props` for component inputs, `$state` for local mutable UI state, and `$derived` for computed values. Use effects only for synchronizing with an external system, with cleanup; do not use an effect to fetch initial article data or copy one state variable into another. [Svelte runes](https://svelte.dev/docs/svelte/what-are-runes) are compiler syntax, not imported React hooks.

```svelte
<script lang="ts">
  import type { PostSummary } from '$lib/features/writing/post.types';

  let { post }: { post: PostSummary } = $props();
</script>

<article>
  <h3><a href={`/writing/${post.slug}/`}>{post.title}</a></h3>
  <p>{post.summary}</p>
</article>
```

The example assumes the server already validated the canonical slug and supplied public fields. Keep meaningful layout in the component; move nontrivial parsing, formatting, mapping, or domain policy into focused modules. Do not extract every tiny expression into a new file.

Use keyed lists with stable IDs. Keep browser APIs out of module-level SSR execution. Do not store per-user or per-request state in server module globals. Prefer URL search parameters for shareable archive filters. Global UI state is justified only by actual cross-component ownership.

## Domain and boundary conventions

- Validate untrusted query/form/body inputs at the boundary with runtime schemas; TypeScript alone is insufficient.
- Keep publication decisions in one service/policy. Tests should make it impossible to expose the newest draft just because it has the largest revision number.
- Repositories own SQL and transaction primitives. Services own workflow and invariants. Mappers select safe public fields.
- Persist UTC timestamps; serialize ISO 8601 strings; format for display at the presentation boundary with explicit timezone rules.
- Distinguish `null` (known absence) from a failed operation. Use explicit result types for expected domain failures and throw unexpected infrastructure failures to a controlled error boundary.
- Use parameterized queries and constrained sorting; never splice user-provided SQL fragments.
- No `any`, unexplained non-null assertions, or casting raw request bodies into trusted domain types. Narrow `unknown` using validation.
- Comments explain rationale, tradeoffs, or non-obvious constraints. Names and small functions explain routine behavior.

## Async, errors, and safety

Disable duplicate submit in the UI and enforce deduplication on the server. Preserve user input on failure. Return version conflicts explicitly and offer comparison/reload rather than silently overwriting. When filters later fetch asynchronously, cancel or identify stale requests so an older response cannot replace newer results.

Translate domain failures to useful messages at the route boundary. Log a request ID and safe error code; never put SQL errors or credentials in user-facing responses. Do not optimistically mark a post published before the transaction succeeds.

Only the reviewed article-body renderer accepts sanitized HTML. No general-purpose `{@html}` in cards, form feedback, excerpts, or metadata. Avoid importing server code through a shared barrel.

## Tests and tooling

- Unit tests: publication/date rules, cursor validation, DTO allowlists, Markdown sanitization, and slug resolution.
- PostgreSQL integration tests: transactions, published-revision ownership, version conflicts, idempotency, and constraints. Do not substitute SQLite for behavior that depends on PostgreSQL.
- Browser tests: navigation, real article reading, owner editing, non-owner rejection, failed save recovery, keyboard use, and relevant axe checks.
- Fixture articles include long headings, code, tables, empty tags, and absent images. Keep fixtures out of the production publication source.
- Keep Vitest, Playwright, axe, and Lighthouse where compatible. Proposed scripts: `check`, `lint`, `test`, `test:integration`, `test:e2e`, `build`. Pin supported versions and keep pnpm authoritative.
- Avoid tests that only assert class names or duplicate a function's implementation. Cover meaningful behavior and security boundaries.

## Review and Git conventions

Future branches use `codex/<short-purpose>`. Commits describe one coherent change, with optional `feat:`, `fix:`, `refactor:`, `test:`, or `docs:` prefixes. Keep schema migrations with their corresponding code and tests. Do not include secrets, production exports, or unrelated lockfile churn.

Review questions: Is ownership clear? Are public data fields explicit? Are drafts still private? Can a retry or concurrent edit corrupt state? Are all UI states usable? Does the change preserve existing links and content rules? Has a dependency earned its maintenance cost?

These are proposed conventions, not new repository-wide agent instructions. No `AGENTS.md`, lint configuration, or application file is changed by this planning work.
