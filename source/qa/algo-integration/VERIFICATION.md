# AIXA Algo integration verification · 2026-11-16

## Delivered

- Four peer libraries: MM Image, AIGC, Video and Algo.
- Shared AIXA Bing Design Library name on the homepage and library headers/titles.
- Left rail adapted from Algo V8, with original icons, active marker and toggle.
  Real cross-library links replace the upstream placeholder spans. Expanded by
  default; collapse preference persists between documents.
- Algo V8 at `5c18515471dc3b0fc941ed8d7cf6e86d785378a8`: 19 documentation
  pages plus three legacy redirects. The full upstream application, public assets,
  SDL samples and source references are retained with a per-file hash ledger.
- Flat deployment includes all four libraries, Algo detail pages, scripts, CSS,
  fonts, media and metadata. No iframe or build step on the hosting platform.

## Checks

- `npm run build`: passed all three React builds and both static assembly paths.
- `npm run test:source`: passed the shared navigation/home/boot/import tests,
  compatibility-host tests, and existing Image/AIGC/Video component/export suites.
- `npm run verify`: passed 549 files, five main entries, all Algo detail pages,
  and 1,968 root/subpath HTML/CSS resource checks. Every emitted file matches its
  SHA-256 manifest and each external JS file parses as classic JavaScript.
- `node source/qa/algo-integration/browser-check.mjs`: passed 47 page/viewport
  checks in local headless Chrome at 1440, 1024, 390 and 320px. Checked every
  imported Algo page/redirect, representative existing component pages, and home.
  No local HTTP failures, JavaScript page errors or document horizontal overflow.
- Six interaction checks cover the four real cross-library switches with retained
  rail state; Algo type/device controls, code population and full-size example;
  and mobile drawer navigation to Video. These are grouped checks, not six clicks.
- Browser checks also confirm the rail's layout variables do not inherit into
  React specimen/export containers. Screenshots reviewed for desktop and mobile.
- Whitespace check passed for authored integration files. Imported Algo files and
  their generated copies retain upstream whitespace (including CRLF font licenses)
  intentionally; their source bytes are checked against the import ledger. Existing
  `source/projects/mm-image`, `aigc` and `video` have no changes from the
  pre-integration checkout.
- Deployment ZIP: 551 flat entries including manifest and `.nojekyll`; ZIP CRC
  and every manifest file hash were checked after packing.

## Outputs

Preview: http://127.0.0.1:5198/Bing-MM-design-library/

Deployment: `../../../../Bing-MM-design-library-delivery/AIXA-Bing-Design-Library-2026-11-16.zip`

ZIP SHA-256: `2360e6755ff1f665d1fca51bec0620ba21a1aa3768ab64f45fc1cf1950549fd3`

See `browser-results.json` and the adjacent desktop/mobile screenshots.

## Scope

These checks validate local Chromium behavior and the assembled deployment at root
and project-prefix paths. External example destinations and Mosaic services were
not exercised; external network requests were blocked during browser QA. Existing
JSX/SDL source suites passed, but this is not exhaustive visual comparison of every
component variant or a new accessibility audit. No GitHub push or hosted deployment
was performed for this update.

## Homepage follow-up · 2026-11-16

At the author's request the homepage now keeps the original full-viewport waterfall,
centered large wordmark and top-right horizontal entry links. The new name and Algo
entry remain. The library pages keep the vertical navigation from the integration.

The 16 existing homepage behavior tests passed. A focused Chrome check at 1440,
1024, 390 and 320px verified full-width layout, title/entry visibility, no horizontal
overflow, animation pause/resume, and all four entry links opening their libraries
with vertical navigation. See `homepage-results.json` and `home-restored-*.png`.
The static manifest and deployment ZIP were rebuilt and verified after this change.
