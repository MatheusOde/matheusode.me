# Verification — 2026-09-05

Implementation branch: `astro-professional-site`, based on `5a40cc6`.

## Passed

- Astro type check: no errors, warnings, or hints.
- ESLint and `git diff --check`.
- Eight Vitest tests covering publication rules, dates, confidentiality/factual approval, quantified outcomes, fixed analytics payloads and token contrast.
- Static build: Home, Work, Writing, About, Contact and custom 404; correct canonical sitemap, robots and custom-domain CNAME.
- 66 Playwright checks across Chromium, Firefox and WebKit: direct routes, metadata, accessible navigation, axe WCAG scans, local links, 320/390/768/1280/1440px overflow, reduced motion and disabled analytics. All pass against the fixed production output.
- Additional mobile navigation check with JavaScript disabled.
- Desktop and mobile production output visually inspected.
- Frozen pnpm installation and peer dependency check.
- Production dependency audit: no known vulnerabilities.
- Original user-modified package-lock.json matches its pre-migration backup exactly.

Lighthouse CI passed all budgets in nine runs (three each of Home, Work, Contact): Performance 100, Accessibility 100, Best Practices 100 and SEO 100 in every run; cumulative layout shift 0. The default Lighthouse simulated mobile profile was used with headless Chromium. These are laboratory results, not field Core Web Vitals measurements. Test reports are generated under `.lighthouseci/reports/` and CI retains reports as artifacts.

## Environment details

Node 24.11.0, pnpm 12.3.4, Astro 7.3.1. Browser tests use the Astro preview API, because Astro CLI preview automatically backgrounds itself inside this agent environment. Linux WebKit required Ubuntu libavif16, libgav1 and libyuv libraries placed in its local test-browser bundle; CI uses Playwright’s standard `--with-deps` installer.

The initial Lighthouse run identified a 0.264 mobile layout shift from navigation enhancement. A synchronous capability class now selects the menu layout before paint while retaining the no-JavaScript fallback.

## Not represented as complete

No approved public case or article has been supplied. Generated detail routes and RSS remain absent until reviewed entries are added. The case/article templates still need review with real editorial material. No professional portrait or current résumé PDF was supplied. No analytics provider was provisioned. No live deployment, GitHub Pages source change, production rollback rehearsal, editorial acceptance, screen-reader user test or field Core Web Vitals assessment occurred. Follow `launch-readiness.md` before production cutover.
