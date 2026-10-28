# Video ACF implementation work log

## Shell, 2026-10-16

The independent site reuses the tested MM_ACF / AIGC workbench conventions. The original AIGC and MM files were read but not modified.

Prepared in `site/`:

- React, TypeScript, Vite, HashRouter, local Roboto fonts and the font license.
- Registry-driven navigation, component documentation, property controls, fit / 100% previews, live values and safe JSX serialization.
- Mainline, Go-wide, Magazine, VRP and Blank page-assembly surfaces; registry-based palette, ordering, deletion, undo, strict JSON import/export and AI assembly prompt.
- Copyable JSX and SDL, local Mosaic catalog validator, portable static HTML export with same-origin asset/font embedding and explicit export warnings.
- Source-catalog and Foundations routes, driven by compact provenance JSON supplied by extraction.
- Production relative base (`./`), runtime Figma assets and license copying. Raw `public/figma/export` and `public/figma/images` folders are excluded from the build.

The Video Answer Go-wide source page is empty and marked in progress in the library and preset. No expanded mainline composition is presented as that source design.

Shell verification: 30 tests passed, covering state contracts, serialization, catalog validation and HTML asset/font embedding. Full integration typecheck and browser verification follow once the registry, component renderers, source data and SDL adapters are available.

Development dependencies currently use a local `site/node_modules` symlink to the existing AIGC installation. Exclude `node_modules` from delivery; the copied lockfile and renamed package allow a normal `npm ci` installation.

## Integrated delivery, 2026-10-16

All implementation modules and registry are now integrated. There are 17 actual
components and two source-gap entries. Final checks: 57 tests passed, 15,413
catalog-valid SDL combinations, 277 copied-JSX parity cases, successful production
build, source comparisons and browser interaction/state/export checks. All 19
production routes loaded without image failures or console errors. Full records
are in design/VERIFICATION.md; original shell-stage limitations above are historical.
