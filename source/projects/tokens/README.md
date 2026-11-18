# Tokens

Imported from https://toddzhaoxy.github.io/bing-design-skill-homepage/ on 2026-11-18.
The original response SHA-256 is recorded in `content.json`; `UPSTREAM.json` records
source asset names and hashes. Content is a local snapshot, not fetched at runtime.

## Content

- 426 unique tokens: Color 285, Typography 23, Radius 31, Spacing 48,
  Elevation 20, Motion 16, Effects 3. The source's 12 semantic categories are
  retained separately in the catalog overview.
- 120 explicit Light/Dark color pairs and 165 reference-mapped colors.
  Mapping descriptions are preserved verbatim; no missing colors are invented.
- Modes, namespaces, lookup catalogs, reference architecture, principles,
  scenarios, both case studies, workflow comparison, tips, links and future directions.
- Nine local images for authors and case studies, lazy-loaded in the page.
- The requested Legacy v1.2 Card Showcase block/link/image is excluded.
  The source's already-hidden `whats-inside-legacy` section is not imported.

## Presentation

The shared `library-chrome.mjs` inserts Tokens before Image, AIGC, Video and Algo.
`tokens-library.mjs` generates static HTML, using the existing documentation theme,
header and library rail. `tokens.css` styles only this standalone document.
`tokens.js` adds hash navigation, collapsible menus, filtering, copy feedback,
case tabs and user-triggered motion previews. No React bootstrap or iframe is needed.
The original English content is preserved in `content.json` independently of layout.

Light/Dark pairs are displayed side by side. Responsive geometry/type pairs remain
Desktop / Mobile; previews use desktop values and the specified default font family.
Motion previews respect reduced motion. Copy falls back to selecting the token text
with an explanatory message when the clipboard is unavailable.

## Build and verification

Run from the repository root:

```sh
npm --prefix source run build:reuse
node scripts/publish-site.mjs
npm --prefix source test
npm --prefix source run test:compat
npm run verify
```

`build:reuse` is appropriate when changing only this static section and shared chrome;
use `npm run build` when editing the existing React applications.

Verified on 2026-11-18:
- Source tests: 43 passing, including unique-token counts, 120/165 color coverage,
  all navigation destinations and absence of the excluded content.
- Compatibility tests: 9 passing; all flat resources resolve at root and nested paths
  with frames and base URLs forbidden.
- Browser: desktop and 390px mobile layouts, route navigation, search/empty/reset,
  exact clipboard contents, case switching, Light/Dark values and local images.
- Mobile tables scroll inside their panel, without widening the document.

The repository-root build is ready for local review. No commit, push or live deployment
was performed for this addition. Existing release ZIPs predate Tokens.
