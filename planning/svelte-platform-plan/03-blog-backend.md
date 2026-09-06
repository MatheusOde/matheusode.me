# Blog backend and authoring plan

## Scope and stack

Store your posts in PostgreSQL and serve them through a SvelteKit backend. Use Drizzle for typed database access and reviewed SQL migrations, a private Markdown editor, and object storage for images. Start with one owner and explicit publication. Scheduling, collaboration, comments, and external feed ingestion are deferred.

Use an established authentication integration rather than writing OAuth or password handling from scratch. Proposed default: Better Auth with GitHub login and one immutable GitHub account ID allowlisted as owner. Confirm the intended account during setup; do not infer it from whichever CLI account is active. [SvelteKit's auth documentation](https://svelte.dev/docs/kit/auth) identifies server hooks and request-local session data as integration points and links to Better Auth setup.

## Content lifecycle

Draft → preview → publish → edit new draft → publish revision → unpublish → archive.

Saving changes to a live article must not replace its public revision. Public reads use only the explicitly published revision. Unpublishing removes that pointer; archiving hides the record from the normal editor list and is recoverable. Hard deletion is not a first-release editor action.

Publication requires title, summary, unique canonical slug, body, SEO description, valid referenced media, and a publication timestamp no later than now. Use UTC instants internally. Preserve the first publication date across revisions and record the last public update separately. Future publication dates are rejected until scheduling is implemented.

## Logical data model

These are proposed entities, not executed SQL. Auth tables follow the selected library's supported schema rather than a parallel custom implementation.

| Entity | Main fields and constraints |
| --- | --- |
| `posts` | UUID `id`; unique `slug`; nullable `publishedRevisionId`; `publishedAt`; `publicUpdatedAt`; integer `version`; `archivedAt`; created/updated timestamps |
| `post_revisions` | UUID `id`; `postId`; title; summary; Markdown body; SEO title/description; optional cover-media ID; immutable revision number; author ID; created timestamp; unique `(postId, revisionNumber)` |
| `tags` | UUID `id`; unique slug; display name |
| `revision_tags` | Composite key `(revisionId, tagId)` so editing draft tags cannot change a live article |
| `media` | UUID; private original key; immutable public derivative key when published; MIME; bytes; dimensions; processing status; created timestamp |
| `revision_media` | Revision and media IDs; alt text; caption; usage role; keeps text alternatives attached to the relevant revision |
| `post_slug_history` | Unique old slug reserved to a post ID; no redirect chains or reuse by another post |
| `audit_events` | Actor, action, post ID, revision ID, timestamp, request ID; no body, credentials, or session tokens |
| `write_operations` | Unique `(actorId, operationId)`; action, request fingerprint, result reference; transactionally records successful mutations; reject reuse with different input |
| Auth-owned tables | User/account/session records with library migrations; application-level owner allowlist |

The published-revision foreign key must refer to a revision belonging to the same post, enforced through a composite constraint or equivalent database invariant. Use transactions for pointer changes, dates, slug history, and audit events. Add an index supporting `(publishedAt DESC, id DESC)` for published, non-archived records; confirm the actual plan with `EXPLAIN` against representative data.

## Public contract

| Request | Response |
| --- | --- |
| `GET /api/v1/posts/?limit=12&cursor=...&tag=...` | `{ posts: PostSummary[], nextCursor: string | null }` |
| `GET /api/v1/posts/[...slug]/` | Published `PostDetail`, permanent canonical redirect for a historical slug, or 404 |
| `GET /rss.xml` | Latest 20 published entries with canonical URLs; valid empty feed when none exist |
| `GET /sitemap.xml` | Canonical public pages and published content only |

`PostSummary`: ID, slug, title, summary, first publication date, last public update date, tags, optional cover `{ url, width, height, alt }`, and derived reading minutes.

`PostDetail`: summary fields plus sanitized rendered body. No draft Markdown, author-login details, private object keys, audit fields, or unpublished revision metadata. Build DTOs with an explicit field allowlist; never serialize a raw database row.

Use a base64url cursor containing a validated date and ID; it is a pagination position, not authorization. Order by publication date descending and ID descending to break ties. Default limit 12, maximum 50. Reject invalid cursors, unknown parameter shapes, or oversized values with 400. Concurrent publications can change a browsing session's result set; a snapshot guarantee is outside first-release scope.

Errors use `{ error: { code, message, requestId } }`: 400 for invalid queries, 404 for missing or unpublished posts, 429 for limits, 503 for unavailable storage. Never expose SQL, stack traces, or credentials. Public metadata must use the same published-only policy as article bodies.

## Private write surface

Use authenticated form actions on `/admin/posts/new/` and `/admin/posts/[id]/`: `saveDraft`, `publish`, `unpublish`, and `archive`. The editor posts the expected `version`; a stale version returns 409 and keeps the user's text available for comparison. Use a client-generated operation ID with server-side deduplication for creates/publishes so retries after a lost response do not create duplicate posts or revisions.

Every action independently checks session and owner authorization; layout visibility is not protection. Validate inputs and same-origin mutation requests. Keep the framework's CSRF protections and configure trusted deployment origins. Sessions use secure, HttpOnly cookies with explicit expiry and logout revocation. Public signup and arbitrary account linking are disabled. Establish a documented owner recovery path through deployment configuration, not a public bypass endpoint.

First release uses explicit Save with pending/saved/failed feedback, a dirty-state indicator, and unsaved-navigation protection. Autosave is deferred to avoid hidden races. On a failed save, preserve the body in the open editor. Do not promise cross-device or crash recovery for unsaved text.

## Rendering and preview

Use Markdown rather than executable remote MDX. A proposed server pipeline is remark parsing → GFM support → HTML tree → syntax highlighting → allowlist sanitization → serialization. Configure the sanitizer to allow only the intended highlighting classes and article elements. Raw HTML, scripts, inline handlers, unapproved iframes, and unsafe URL schemes are rejected or removed. [rehype-sanitize](https://github.com/rehypejs/rehype-sanitize) provides schema-based HTML sanitization; the final configured pipeline still needs adversarial tests.

Only one reviewed article-rendering component may use Svelte `{@html}`, and only with the server-sanitized result. Escape structured data and XML separately; HTML sanitization does not secure those output formats.

Preview requires an owner session, including all media requests, and returns `Cache-Control: private, no-store` plus `X-Robots-Tag: noindex`. Do not include preview content in feeds, sitemap, public JSON, logs, or build artifacts. Owner-authenticated preview avoids share-token complexity; shareable previews can be designed later if needed.

## Media workflow

Upload → validate → decode/re-encode → save private original and derivatives → attach to draft → promote required derivatives on publication.

- Initial policy: JPEG, PNG, WebP, and AVIF raster uploads, at most 5 MiB and 20 megapixels. Verify file signatures and successful decoding, not only extension or browser MIME. Reject SVG/HTML uploads in the editor initially.
- Strip metadata, bound processing time/memory, generate responsive sizes, and store width/height. Keep repository-authored SVG diagrams separate from editor uploads.
- Author adds alt text or explicitly marks an image decorative. Covers require meaningful alternatives where they convey content.
- Store originals privately. Public derivatives use immutable keys and a configured trusted media origin. No arbitrary server-side fetching of author-provided remote URLs.
- Finish promoting media before committing the publication pointer. Failed promotion leaves the draft unpublished; retry is safe. Orphaned objects are reconciled later with a grace period.
- On unpublish, remove the article from public reads immediately. Previously public media cannot be guaranteed secret; purge/remove unused derivatives as an operational action. Never reuse a published asset for material that must remain confidential.

## Import strategy

There are no article files to import now. At implementation time, inventory again. For any new MDX files, preserve slug, title, summary, dates, tags, and SEO fields. Flag JSX/imports/custom components for manual conversion to safe Markdown or supported article blocks; never execute uploaded MDX.

Provide a dry-run report and repeatable import identity (source path plus content hash). Import as drafts, compare rendered output, and publish only intended records. Keep source copies until migration acceptance. Existing Work evidence validation stays in place while Work remains local content.

## Build order and tests

1. Schema and reviewed migrations; separate migration and runtime database credentials. [Drizzle migrations](https://orm.drizzle.team/docs/migrations) inform the tooling, but production changes require reviewed generated SQL and a backup.
2. Published queries and DTO mapping; test filtering, stable pagination, nested slugs, and date rules.
3. Login and owner enforcement; test anonymous and authenticated-but-non-owner access to every write and preview surface.
4. Draft/revision actions; test editing a live article does not alter it, transaction rollback, retry deduplication, and concurrent saves.
5. Markdown and media pipeline; test XSS inputs, unsafe links, oversized/invalid files, missing images, and failed promotion.
6. SSR archive/articles/API/feed; test publish visibility without rebuild, unpublish, errors, and empty results separately.
7. Export/restore rehearsal for database and media before production use.
