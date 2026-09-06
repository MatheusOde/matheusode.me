# Design system: blue editorial portfolio

## Principles

Use calm navy surfaces, clear pale-blue accents, readable typography, and authored imagery. Give evidence more visual weight than decorative UI. The public site should feel personal and editorial; the private editor should use the same foundations with denser, task-oriented layouts.

This is a specification for future implementation, not a shipped component library. The existing CSS tokens provide the starting palette. New token pairings still need measured contrast checks.

## Color tokens

| Semantic token | Proposed value | Use |
| --- | --- | --- |
| `--color-bg` | `#111a24` | Page background; maps from `--background` |
| `--color-surface` | `#182534` | Sidebar and subtle panels |
| `--color-surface-raised` | `#223449` | Hover surfaces and elevated controls |
| `--color-text` | `#eef4fb` | Headings and primary body text |
| `--color-text-muted` | `#b9c8d8` | Supporting copy and metadata |
| `--color-accent` | `#a6cdf4` | Links, emphasis, primary button fill |
| `--color-on-accent` | `#111a24` | Text and icons on accent fill |
| `--color-accent-subtle` | `#27415d` | Selected navigation background |
| `--color-border-subtle` | `#3d5870` | Decorative separators; not sufficient by default for required control boundaries |
| `--color-border-control` | `#8aa7c4` | Candidate input/control outline; verify adjacent-surface contrast |
| `--color-focus` | `#a6cdf4` | Visible focus ring with background offset |
| `--color-success` | `#9bd9b4` | Success text/icon on dark surfaces |
| `--color-warning` | `#f0cc85` | Warning text/icon on dark surfaces |
| `--color-danger` | `#f2a4ac` | Error text/icon on dark surfaces |

Use role-based tokens in components rather than literal hex values. Status hues always accompany text or an icon with a name. Do not use white text on a pale-blue primary button. The faint border is decorative; input boundaries and selected states need independently sufficient visual contrast.

Text contrast targets: 4.5:1 for normal text, 3:1 for large text; necessary control/graphic contrast 3:1. Prefer 44px practical touch areas while meeting applicable WCAG 2.2 AA target-size rules. Verify keyboard focus, reflow, labels, and reduced motion as well as color. [WCAG 2.2](https://www.w3.org/TR/WCAG22/) is the normative reference.

## Typography

| Role | Size / line height | Rules |
| --- | --- | --- |
| Hero | `clamp(2.65rem, 5vw, 5.3rem)` / 1.05 | One dominant statement, restrained negative tracking |
| Section title | `clamp(1.75rem, 3vw, 2.5rem)` / 1.15 | Sentence case |
| Card title | 1.25–1.5rem / 1.3 | Descriptive, naturally wrapping |
| Body | 1rem / 1.7 | Existing sans stack |
| Article body | 1.0625–1.125rem / 1.75 | 60–70ch target reading measure |
| Metadata | 0.875rem / 1.5 | Do not render essential information as tiny labels |
| Eyebrow | 0.75rem / 1.6 | Mono, short, limited use |
| Code | 0.875–0.95rem / 1.6 | Mono, local horizontal scrolling if necessary |

Keep the Inter/system sans and current mono fallbacks initially. A named font in the CSS stack does not prove a font asset is loaded. If Inter is later self-hosted, verify its license, subset/weights, fallback metrics, and loading behavior before adding downloads. Body links stay visibly identifiable outside hover.

## Space, shape, and layout

Adopt a documented scale of 4, 8, 12, 16, 24, 32, 48, 64, and 80px, expressed in rem. Map existing spacing tokens incrementally; do not redefine an existing name with a different value across all consumers accidentally.

- Page gutter: 20px narrow screens, 32px medium, up to 64px wide.
- Content maximum: current 82rem; article column about 42–44rem with a character-based measure inside it.
- Section gaps: 64–80px desktop, 40–48px narrow screens.
- Corner radii: 6px controls, 12px panels/images; reserve the portrait arch for the hero.
- Breakpoints: begin with existing 768px and 1100px boundaries, then adjust for actual content pressure.
- Desktop shell: sidebar and generous main area. Medium/narrow: compact header and stacked sections; do not squeeze two reading columns beside the sidebar.
- Layering: content 0, sticky navigation 10, popover 20, modal 30. A native modal uses the browser top layer.
- Motion: 120–180ms for ordinary feedback; remove nonessential transforms and smooth scrolling under reduced motion.

## Component inventory and contracts

| Component | Responsibility | Required variants / states |
| --- | --- | --- |
| `SiteShell` | Landmarks, skip link, header/sidebar, footer | Narrow/wide, expanded/collapsed navigation |
| `SectionHeading` | Eyebrow, title, optional intro | Long title; optional supporting text |
| `ActionLink` | Navigation styled as primary/secondary/text action | Hover, focus, current where appropriate; always an anchor |
| `Button` | Local action or submit | Primary/secondary/danger, pending, disabled, focus |
| `CaseStudyCard` | Visual, problem, role, outcome, link | Featured/compact, image absent, long copy |
| `ArticleCard` | Title, date, summary, tags, cover | Featured/row, long title, optional cover |
| `ArticleBody` | Approved rendered article content | Headings, lists, tables, code, quotations, diagrams |
| `Figure` | Media with dimensions, alt and caption | Responsive, loading failure, decorative alternative |
| `FormField` | Label, control relationship, hint/error | Required/optional, invalid, disabled |
| `StatusMessage` | Local feedback with recovery | Empty, pending, failure, success; correct announcement behavior |
| `PostEditor` | Draft fields and save/publish controls | Dirty, saving, saved, failed, stale version, session expired |

Use semantic composition rather than a universal component with many booleans. A case card is not a button. Keep a clear title link; avoid nested interactive controls inside a stretched click target. Do not build unused component variants just to fill a catalog.

## Imagery and article layout

Portrait: keep the supplied identity photo, art-direct the crop on mobile, generate responsive derivatives, and declare dimensions. Work images: prefer real approved screenshots or diagrams with clear captions. Article covers: consistent 16:9 crop, navy/blue treatment, and a repeatable title-led motif; avoid generic filler on every paragraph.

Use `srcset`/`sizes` or an appropriate image pipeline. Prioritize only the likely hero image; lazy-load below-fold images. A project budget is ≤200 KiB for the primary mobile portrait derivative and ≤1 MiB initial public-page transfer, subject to measured quality and asset needs. These are targets to validate, not current measurements.

Articles use one reading column with an optional desktop contents sidebar for longer pieces. On mobile, make contents a native disclosure. Heading links retain stable IDs; code-copy controls announce success and handle clipboard failure. Tables and code may scroll locally; prose must reflow.

## State and accessibility matrix

- Empty Writing: honest invitation without placeholder articles. Failed Writing fetch: temporary-unavailability message, no claim that the archive is empty.
- Editor save: button-level pending state, preserve fields on error, explicit saved timestamp after server success.
- Publish/unpublish: state-changing controls with clear text and confirmation when removing a public article.
- Navigation: visible current state, normal link behavior, scroll offsets, keyboard order matching visual order.
- All pages: test 320px, 768px, 1100px, 1440px, 200% text resize, long headings, missing media, reduced motion, and keyboard-only input.

## Implementation and governance

Create tokens first, then shell/actions, then cards/article typography, then editor controls. Maintain a non-production component showcase with realistic long, empty, and error examples. Add new tokens or variants only for a named use case. Review actual foreground/background pairs and interaction states, not a blanket assumption that every color works on every surface.

The frontend UI engineering skill informed the responsibility boundaries, responsive states, and accessibility criteria. This document adapts those principles to Svelte rather than adopting React-specific patterns.
