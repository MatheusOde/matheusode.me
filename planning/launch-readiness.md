# Launch readiness and rollback

Technical readiness and evidence readiness are separate. This refactor supplies publishing infrastructure; it cannot truthfully claim completion of the case-led launch without approved content. This document records remaining human/external gates, not a claim that they passed.

## Outstanding inputs

- Matheus’s final headline, supporting line, contact prompt and full editorial approval.
- Approved Softable, SAP, and research evidence worksheets; at least one case for a case-led launch.
- One real, positioning-relevant article. Empty collections intentionally publish no placeholder articles or RSS feed.
- Approved professional portrait and current résumé PDF, including dates and intended public contact data. Do not create a résumé or substitute a generic portrait as if supplied.
- Current role, academic status, employer/institution references, and contact URLs verified by Matheus.
- Privacy-friendly analytics provider, deployment endpoint, retention/cookie policy and staging event validation. Leave analytics disabled without configuration.
- Visual approval of homepage, work-card composition and case-study section on desktop/mobile. Empty case collections do not constitute review of a real case.

## Pre-launch checklist

- [ ] Editorial and confidentiality gates above complete.
- [ ] Homepage five-second review; desktop/mobile visual acceptance.
- [ ] Keyboard, screen-reader landmarks/headings, reduced motion, contrast and 320–1440px layouts reviewed.
- [ ] Build, types, unit/content tests, lint, Playwright/axe and broken-link checks pass.
- [ ] Chromium, Firefox and WebKit navigation checks pass; direct static routes work without JavaScript.
- [ ] Lighthouse targets: performance ≥95, accessibility 100, best practices ≥95, SEO 100 under documented profile.
- [ ] Production dependency audit reviewed; any high-severity exception documented with owner and rationale.
- [ ] Canonical, social preview, structured data, robots, sitemap and custom 404 inspected.
- [ ] Staging/branch artifact validated; GitHub Pages environment and custom domain verified.
- [ ] Rollback rehearsed and known-good deployment identified.
- [ ] Deployment reviewed by Matheus; live TLS, exact routes and metadata read back after cutover.

## Rollback procedure

Before production cutover record the current successful Pages deployment URL, commit SHA, workflow run/artifact, custom domain setting, and Pages source mode in the baseline record. The supplied historical audit commit is not proof of the current deployed version.

For a bad new release, redeploy the recorded known-good static artifact using the Pages workflow. If an artifact has expired, check out its recorded source revision in an isolated checkout, use its lockfile/toolchain, rebuild and deploy that artifact. If moving from branch-based publishing to Actions, record the previous branch/path and retain that branch; restore the recorded Pages source if reverting the migration itself. Keep `matheusode.me` and CNAME intact; avoid DNS changes unless a verified hosting issue requires them. Do not force-push or erase development changes to roll back.

Verify root, Work, Writing, About, Contact, custom 404 behavior, robots/sitemap and HTTPS after rollback. A written procedure is not a rehearsal: mark the checklist only after staging rollback succeeds. After launch, inspect failed builds/404s and real-user performance; assess contact/work engagement at 30 and 90 days. No monitoring service or scheduled action is implied by this document.
