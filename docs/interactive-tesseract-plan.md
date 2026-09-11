# Interactive homepage tesseract

## Goal and scope

Bring the original four-dimensional cube back as an interactive homepage feature. Preserve the existing dark blue palette, typography, headline, contact links, and supplied profile photo. This document plans the cube; it does not implement it.

The current repository uses SvelteKit, Svelte 5, and TypeScript. Older React paths in AGENTS.md and project-overview.md do not describe the current application. The homepage hero lives in `src/lib/features/portfolio/components/HeroSection.svelte`.

The supplied photo is already present at `static/images/matheus.jpeg`, byte-for-byte identical to the attachment. The hero uses its 1280 × 1280 dimensions and a square frame.

## Proposed experience

- Add a compact, full-width interactive panel beneath the hero copy and portrait, before the principles section. Keep the portrait in its current position.
- Render a slowly rotating wireframe tesseract in the existing accent color, with restrained depth shading. Caption: “A different perspective.” Hint: “Drag to rotate. Explore the fourth dimension.”
- Drag to change the spatial view. A labeled “4D rotation” slider changes rotation through the fourth dimension. Pause/Play and Reset buttons make the experience controllable and easy to recover.
- On phones, keep the panel compact and preserve vertical page scrolling: horizontal dragging rotates the view; the slider provides the fourth-dimensional control.
- Reduced-motion users start with a static view and can explicitly start animation. All controls work with keyboard input; the canvas has a readable description.

## Implementation tasks

### 1. Render a correct static tesseract

Create a small TypeScript geometry module and a Svelte canvas component. Generate the 16 vertices from four coordinates in {-1, +1}; connect vertices differing in exactly one coordinate to obtain 32 edges. Rotate in 4D, project to 3D, then project to the canvas. Keep projection distances safely outside the rotated geometry.

**Likely files:** `src/lib/features/portfolio/tesseract.ts`, `src/lib/features/portfolio/tesseract.test.ts`, `src/lib/features/portfolio/components/Tesseract.svelte`.

**Acceptance:** 16 unique vertices, 32 unique edges, four edges per vertex; projection remains finite at supported angles; centered geometry fits narrow and wide containers.

**Verification:** Unit tests for geometry and projection invariants; `npm run check`; `npm run test`.

**Dependencies:** None. **Scope:** Medium, three files.

### 2. Add interaction and animation lifecycle

Add pointer rotation, native range input for 4D rotation, Pause/Play, and Reset. Use elapsed time for consistent animation speed. Reset restores the initial view and slider position while preserving the user's paused state. Initialize browser APIs only after mounting.

Respect reduced motion, stop animation when the panel is offscreen or the document is hidden, and resume only when the user's play state permits it. Resize with the container, cap pixel density at 2, and clean up animation frames, observers, pointer capture, and event listeners on unmount.

**Likely files:** `Tesseract.svelte`, `tests/e2e/site.spec.ts`.

**Acceptance:** Drag and slider visibly change orientation; Pause freezes automatic rotation; Reset restores orientation; keyboard controls work; repeated navigation does not accumulate animation loops; touch scrolling remains usable.

**Verification:** Browser tests for controls and reduced motion; manual pointer/touch checks; `npm run check` and `npm run lint`.

**Dependencies:** Task 1. **Scope:** Small, two files.

### Checkpoint: working component

Confirm correct geometry, safe projection, usable controls, and complete lifecycle cleanup before integrating the panel into the hero.

### 3. Integrate and visually tune the homepage

Mount the component beneath the existing hero columns. Use current CSS tokens from `src/styles/tokens.css`; only add shared tokens there if necessary. Reserve panel height to prevent layout shifts. Preserve the profile photo's square proportions and ensure the panel does not obscure copy or navigation.

**Likely files:** `HeroSection.svelte`, `Tesseract.svelte`; `src/styles/tokens.css` only if necessary.

**Acceptance:** Balanced desktop composition; no horizontal overflow at 320px; readable controls and focus indicators; portrait remains visible and undistorted; homepage text remains available without JavaScript and canvas failure has a textual fallback.

**Verification:** Desktop and mobile screenshots; keyboard walkthrough; reduced-motion check; browser console inspection. Run `npm run check`, `npm run lint`, `npm run test`, `npm run build`, and `npm run test:e2e`.

**Dependencies:** Task 2. **Scope:** Medium, two or three files.

## Completion criteria

The homepage contains a recognizable, controllable tesseract and the supplied portrait. Existing navigation works. Automated checks pass; desktop, mobile, reduced-motion, and keyboard behavior are verified in a real browser.

## Constraints and risks

- Use Canvas 2D and native controls; no new runtime dependency needed for 16 vertices and 32 edges.
- Keep interaction local to the panel so animation cannot interfere with page navigation or scroll.
- A below-hero panel may sit below the initial viewport on smaller screens. Preserve readable copy and portrait sizing instead of compressing the hero to force all content above the fold.
- Browser animation and resize work must remain client-only to preserve SvelteKit prerendering.
