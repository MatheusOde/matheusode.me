# Website improvement ideas

## Direction

Make the site feel like the portfolio of someone who understands both software and the people using it. Retain the navy background, pale blue accents, portrait, and spacious single-page composition. Add specific evidence and varied editorial layouts instead of more generic claims.

## Prioritized backlog

Effort estimates are relative: S is a focused change, M spans several components or assets, L requires a feature or editorial workflow. They are not delivery promises.

| Priority / ID | Idea | Why it helps | Effort | Acceptance |
| --- | --- | --- | --- | --- |
| P0 / W01 | Publish one substantial case study | Work currently shows an approach illustration without a real case | M plus editorial input | Reader sees problem, role, constraints, decisions, and an evidenced outcome; confidentiality review recorded |
| P0 / W02 | Publish one useful technical article | Writing is currently empty | M plus authoring | A complete original article with a clear takeaway, date, and stable URL |
| P0 / W03 | Give the hero a concrete evidence path | The abstract headline needs a specific next step | S | “View selected work” leads to a real case when available; retain honest approach wording while none exist |
| P0 / W04 | Optimize and art-direct the portrait | It is the main human anchor and a likely major loading asset | S | Responsive image variants, deliberate mobile crop, declared dimensions, no visible layout jump |
| P1 / W05 | Add case-specific visuals | The generic systems graphic cannot explain every project | M | Each published case has an approved screenshot, annotated diagram, or relevant artifact with caption |
| P1 / W06 | Improve page rhythm | Repeated bordered cards can make different sections feel interchangeable | M | Featured split-layout case, compact article rows, and quieter About section follow one grid |
| P1 / W07 | Strengthen article reading | Technical writing needs code, diagrams, and navigation | M | Readable line length, heading anchors, optional contents list, keyboard code-copy control, sensible mobile layout |
| P1 / W08 | Refine navigation and icon consistency | Current navigation uses assorted Unicode symbols | S | Consistent SVG icon treatment, visible current section, functional anchor history and focus behavior |
| P1 / W09 | Make contact easier to act on | Visitors need to know what context to send | S | Email and profile links plus a short prompt asking about the problem and systems involved; optional copy-email feedback |
| P1 / W10 | Design meaningful social previews | Shared articles should look authored and recognizable | M | Each article gets a title-led branded image with legible text and correct metadata |
| P2 / W11 | Add a small “Now” note | A personal detail can make the site feel current | S | Owner-maintained dated note with no automated claims of availability |
| P2 / W12 | Add tag filtering when the archive grows | Helps retrieval once there is enough to browse | M | At roughly 8–10 posts, useful tags and URL-based filters; keep all results discoverable through normal links |
| P2 / W13 | Add a Portuguese edition | Could serve a broader audience | L | Original/translated pairs, language metadata, and complete navigation; no partially translated UI |
| P2 / W14 | Consider light theme | Gives readers a preference without changing the identity | M | Both palettes independently pass contrast and image checks; no flash before preference is applied |

## Proposed homepage composition

1. Hero: identity, concrete supporting sentence, portrait, Work action, Contact action.
2. Featured work: one substantial case with a relevant visual and a short result statement. Keep the approach section if there is not yet an approved case.
3. Approach: three compact steps grounded in an actual example, avoiding another large block of repeated marketing copy.
4. Writing: latest three articles with title, summary, topic, and publication date; link to the archive only when useful.
5. About: a concise personal narrative, approved experience details, and optional dated “Now” note.
6. Contact: direct email, GitHub/LinkedIn, and a useful opening prompt.

Retain the existing section IDs `home`, `work`, `writing`, `about`, and `contact`. The approach section can sit between Work and Writing without adding another navigation item. On mobile, use a compact header and native section links; avoid a sticky overlay that covers content.

## Content and imagery briefs

Case structure: situation → constraints → responsibility → alternatives considered → solution → outcome → lessons. Quantified results require evidence; otherwise describe verified qualitative outcomes. An anonymized system diagram is a valid illustration when client screenshots cannot be shared.

Article candidates, subject to your experience and authorship:

- Designing an integration that can safely retry requests.
- How to map a business process before implementing it.
- A worked example of handling partial failure across systems.
- A documented migration decision with actual tradeoffs and measured results.

Use the real portrait for identity. Use screenshots and authored diagrams as evidence. Abstract illustrations can introduce a topic, but should not masquerade as real product screenshots or imply client relationships. Record asset ownership and publication permission. Never display a stock portrait as the author.

## Interaction and measurement

Use subtle hover and focus changes, short transitions, and optional in-page reading progress only if it remains unobtrusive. Avoid scroll hijacking, automatic carousels, essential content hidden until animation, and decorative 3D scenes in the initial release.

Validate improvement with five-second comprehension, keyboard navigation, 320px reflow, and article reading on a phone. If analytics is later configured, measure case opens and contact actions without capturing messages or personal data; the existing disabled analytics setting remains the baseline.

Proposed performance goals: p75 LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 once enough field traffic exists. Before then, record reproducible lab results on representative pages and preserve or improve the current baseline. These are project targets, not claims of current performance.

## Completion checks

- No invented project results, endorsements, clients, or publication dates.
- Empty content and backend failure have different copy.
- Work, Contact, and article links are usable without client JavaScript.
- Portrait and diagrams retain meaning at narrow widths.
- Confirm new copy and visuals against `../content-evidence.md` and `../confidentiality-checklist.md` before publication.
