# Migration baseline — 2026-09-05

Started from local `refactor` at `5a40cc6` (not the older main commit audited in the plan). Branch: `astro-professional-site`; the suggested `refactor/astro-professional-site` name conflicts with existing branch `refactor`.

Existing user changes: modified package-lock.json and untracked pnpm-lock.yaml/pnpm-workspace.yaml. Their exact pre-migration copies are preserved in `/tmp/matheusode-baseline/`. The existing package-lock is retained but pnpm is the authoritative installer and lockfile for this migration.

Baseline build passed: Vite 7.3.6, 245.05 kB client JS (78.39 kB gzip). Baseline lint failed on 3 missing rules in tracked `.vite/deps/react-router.js`. Removed generated Vite caches and build output from version control. Retired the SPA and unused public student-project/skill-logo/photo assets; these remain recoverable in Git history.

GitHub Pages inspected via API: legacy deployment from `gh-pages`, path `/`, custom URL `https://matheusode.me/`. No Pages or DNS setting changed. Cutover requires editorial readiness and Pages build source migration.

Correct current LinkedIn profile verified via indexed public profile: https://www.linkedin.com/in/matheus-odebrecht . Original source supplies matheusode@gmail.com. Verify current contact details during editorial review.

No baseline screenshots were captured before source migration. Do not claim a visual baseline comparison or a production deployment occurred.
