# Unified sidebar verification

Date: 2026-10-29. Scope: MM Image, AIGC and Video navigation only.

- One canonical component (`source/ui/LibraryNav.tsx`), copied into standalone
  libraries by `sync-navigation.mjs`; copies are checked for drift.
- Four collapsible sections per library. Parent component links and child
  disclosure buttons have independent click targets.
- 11px category labels, 14px primary component links and 13px child links.
  Child indentation, guide line and lighter text establish hierarchy; only the
  actual current link receives blue text and selection background.
- Parent-child relationships follow `partOf`, including AIGC cross-tier parts.
  Image cards remains the last Molecules root link.
- Active ancestors open on navigation and remain manually collapsible.
- Enter/Space disclosure, full-rail toggle, hidden-link keyboard exclusion,
  aria-expanded/aria-controls, reduced motion and 44px touch controls pass.
- All original overview/source links and all component routes are preserved.
- Source tests: 144 passing (Portal/navigation 31, compatibility 8, Image 8,
  AIGC 40, Video 57).
- Full three-library TypeScript/Vite build and static publication validation pass.
- Isolated browser fixtures run production components with MemoryRouter and
  generated styles. They have no network access and do not read or control any
  existing browser tab or localhost origin. Evidence: `report.json`, three
  sidebar screenshots, and desktop/mobile screenshots in this directory.
- Deployment files are rebuilt locally; no GitHub Pages push is performed.

Run from repository root:

```sh
npm run build
npm run test:source
npm run verify
```

Optional isolated browser check, with Playwright installed in a temporary folder:

```sh
PLAYWRIGHT_MODULE=/tmp/mm-image-qa/node_modules/playwright/index.mjs node source/qa/sidebar.mjs
```
