# FY25 Image cards — verified delivery

Date: 2026-10-29. Target: the supplied `2216:1178` desktop frame in
`9yILIRLGDWRBLMqbs5hkoZ`. All 49 source examples are represented exactly once in
13 size choices under one Image cards component, placed last in Molecules.
MM Image now registers 18 components (17 previous + one unified Image cards).

## Passed

- All 49 source nodes have high-fidelity design context and visual reference evidence.
- Shared-image crop checks confirmed native center-cover for resting slots;
  extra zoom is used only for explicitly oversized source hover slots. See the
  per-group crop and geometry evidence; imageTransform was not guessed into CSS.
- 49 selectable configurations render the same public JSX as their workbench.
- All 49 component SDL exports and the combined 49-card SDL page validate
  without omitted blocks. Regression coverage checks inherited action contrast.
- 142 integrated tests pass: Portal 29, compatibility 8, Image 8, AIGC 40, Video 57.
- Full TypeScript/Vite build and flat compatibility publication complete.
- Static verifier: 259 files, four entries, 172 root/subpath resource references.
- Final Chrome run: 49 variants, 265 image/icon placements loaded, no JavaScript
  errors, no failed HTTP asset responses, no nested buttons.
- Native gallery opens and closes with Escape. Horizontal scrolling works.
- Mixed SERP + new carousel HTML export: all 44 images/icons embedded and load
  with network requests blocked. Original 204px scroll offset restores to 204px.
- Final 390px viewport has 390px document width; wide cards fit without page overflow.
- Source provenance verifies 362 initial-import files and 366 baseline files,
  including ten explicitly recorded Image source updates. Original ledgers remain unchanged.
- `git diff --check` passes.

## Consolidation and UI normalization

- One navigation/palette entry: Image cards, last under Molecules.
- Size selects one of 13 dimensions; layout options follow that size. Invalid
  combinations reset to an available layout in both component and page editors.
- All 49 configurations use the public ImageCards(size, variant) API. Legacy
  size-specific public exports remain available.
- All 13 former size routes redirect to the unified page with the matching
  size; previously saved blocks migrate while retaining their layout.
- Property controls share the existing Image style. Fit/100% toolbar markup,
  borders, radii, font and colors match Video. Source links are reduced to the
  active configuration in the panel; common section/table styles are reused.
- Browser evidence for this revision uses isolated, network-disabled fixtures
  built from production components, MemoryRouter and the generated CSS. It
  does not read or control the user's existing browser tab. See
  `qa/normalized/report.json` and the corresponding screenshots.
- The existing in-app browser's origin access was denied by automatic approval;
  the current user tab was not inspected or refreshed.

## Evidence and reproduction

`qa/browser-report.json` records the original import verification before
consolidation. `qa/normalized/report.json` records the current 49 layout checks,
dependent fields, navigation placement, style comparisons and legacy restore.
`qa/library-preview.png`, `qa/wide-desktop.png`, `qa/wide-mobile.png` and
`qa/offline-mixed-export.png` show the integrated page and offline snapshot.
`context-small-qa.md`, `context-tall-validation.md` and `context-wide-*` hold
per-group source comparisons.

From the repository root:

```sh
npm run build
npm run test:source
npm run verify
npm --prefix source run verify:sources
npm --prefix source run verify:baseline
npm run preview
```

Optional browser check: install Playwright in a temporary folder, then run
`site/qa/image-cards.mjs` with `PLAYWRIGHT_MODULE` pointing to its `index.mjs`.
The script uses installed Google Chrome and defaults to the 5198 project-path
preview. Override `QA_URL` when testing another host.

## Boundaries

Mosaic adapters are partial: source overlays, exact crop masks, typography and
product actions still depend on the target renderer/host. Local image URLs
must be hosted or replaced for Mosaic. Catalog success does not claim target
Mosaic visual parity. Figma only supplies first-page pagination content;
additional results belong to the host callback. Standalone HTML preserves the
visual snapshot and native scroll position, not React action handlers.

The rebuilt static files are present in the local repository root. This task
has not pushed or deployed them to GitHub Pages. The Figma file was read only.
