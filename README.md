# matheusode.me

The personal site of Matheus Odebrecht, built as a statically generated Astro site. It presents full-stack application and systems-integration work for complex business needs, with English as the launch language.

## Local development

Requirements: Node.js 24 and pnpm 12.3.4.

```bash
pnpm install
pnpm dev
```

Useful checks:

```bash
pnpm build       # generate dist/
pnpm check       # Astro and TypeScript checks
pnpm lint        # ESLint
pnpm test        # Vitest
pnpm test:e2e    # Playwright: Chromium, Firefox, and WebKit
pnpm audit:prod  # production dependency audit
```

The end-to-end suite starts the built site through Astro’s preview API on isolated port 4347; install the browsers locally with `pnpm exec playwright install --with-deps chromium firefox webkit` when needed. Lighthouse CI is available through `pnpm test:performance` after a build (Chrome/Chromium must be installed or supplied via `CHROME_PATH`).

Use pnpm and its frozen lockfile for reproducible installation. The pre-existing, locally modified `package-lock.json` has been preserved and is not the migration’s dependency source; do not run `npm ci` against it.

## Content and publication status

Work and Writing are backed by Astro content collections. No case study or article is published until its frontmatter passes collection validation and the content is reviewed for confidentiality and factual accuracy. The empty Work and Writing states are intentional while editorial material is pending.

The site currently has no portrait asset or résumé download configured. Analytics are disabled until a privacy-friendly provider and conversion-event policy are approved. These are explicit launch TODOs, not implied claims.

## Deployment

Deployment is intentionally manual. The **Deploy to GitHub Pages** workflow is started with `workflow_dispatch` and runs the same build, type, lint, unit-test, cross-browser e2e, production-audit and Lighthouse gates before uploading `dist/` with the official GitHub Pages actions. The existing Pages setup uses the legacy `gh-pages` branch; switch the repository Pages source to GitHub Actions and obtain editorial approval before using this workflow for production.

Evidence worksheets, copy decisions, localization, privacy choices and rollout/rollback requirements are in `planning/`. Empty MDX collections produce expected Astro warnings; they intentionally generate no case/article routes or RSS until approved content exists.

There is no `deploy.sh`; do not use the old Vite-era deployment instructions.
