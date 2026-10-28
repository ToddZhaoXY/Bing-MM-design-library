# Verification — 2026-10-16

## Scope and implementation

The screenshot-selected 15 content pages were inspected. The site provides 19
registry entries: 10 molecules, 3 cells, 4 implemented organisms and 2 source-gap
entries. Foundation rules and source provenance are separate documentation routes.
The original AIGC project and the reference MM_ACF checkout remain unchanged.

Source gaps are factual, not implementation placeholders:

- Long-video Go-wide page `2128:29243` is empty.
- VRP page `940:2564` contains an external reference. Its exact linked node
  `dd9IQ0YMNSEtTDs0QhbDFJ / 1990:22578` is a Cover page with a WIP frame, not VRP UI.
- Some Playlist source properties throw existing Figma errors. Ten observed
  configurations remain selectable with explicit source notes.
- Written rules and actual source instances differ in some ratios, badge placement
  and metadata position. Both are recorded; source instances drive the visual UI.

## Automated checks

Environment: Node 22.19.0. `cd site && npm test && npm run build` passed.

| Check | Result |
| --- | --- |
| Automated tests | 57 passed, zero failed |
| Registry select/boolean combinations | 15,413 catalog-valid, JSON-serializable outputs |
| Copied JSX parity | 277 cases render identically to workbench SSR |
| Public components | All 19 defaults render independently |
| TypeScript and production build | Passed |
| SDL asset references | All referenced local files exist |

Tests cover source geometry, cell composition, source-text overrides, source-gap
handling, independent nested Magazine state, literal text escaping, strict JSON
import validation and portable HTML resource embedding. The catalog remains the
MM_ACF snapshot: CLI 1.0.969, 32 published component types.

## Browser verification

- Molecules: all 10 workbenches and 106 single-property selector cases checked;
  initial pending assets were rechecked after loading. Defaults and representative
  variants were compared visually to source screenshots.
- Mainline: all six supplied desktop/mobile configurations loaded at their source
  dimensions. Clicking See more selected the expanded configuration in inspector
  and JSX; edited search text stayed literal and appeared in valid SDL.
- Short-video organisms: both mainline and go-wide, Desktop/Mobile, loaded with
  correct source-frame dimensions and no broken images.
- Cells: four Video Group and five Shorts Group configurations loaded. Keyboard
  End changed the exported scroll position to End. Selecting item 9 and Preview
  preserved both in JSX and valid SDL.
- Magazine: SERP/VRP zone layouts loaded; Overview expansion, source disclosure,
  entity-tab selection and accordion choice propagated to organism-level JSX/SDL.
- Real JSON download/import: a 1520 px mainline with a live expanded state and
  `video QA "quoted" & <literal>` query restored correctly. Invalid `{}` was rejected.
- Production HTML download: 20 unique embedded resources, 39 embedded image
  elements, two Roboto font-face rules, no export warnings or script tags, no
  external image/CSS asset dependency. Font license retained. Downloaded file size
  was 9,299,655 bytes. Disconnected/offline reopening was not separately tested.

The development session briefly saw intermediate hot-update errors while multiple
source edits were applied. Acceptance uses the completed production build. A fresh
production-browser session visited all 19 routes: no failed/pending images and no
console errors were recorded.

## Assets and packaging

The shared 24,635,075-byte source PNG was preserved locally and converted to a
941,520-byte quality-92 WebP (3839×2558 → 2048×1365). Source SVGs retain their
original dimensions. White Play/Search icon exports were corrected using full
SVG exports of exact existing source nodes, preserving paths rather than redrawing.

The static package contains `index.html` at the ZIP root, with `assets/` and
`figma/` alongside it. It needs no build command on a static hosting platform.
Original images, node_modules, build caches and source-only archives are excluded.

## Verification boundaries

This is a reusable design-system website. Real playback, search and product
navigation require media/service integration. Static HTML export preserves an
appearance snapshot, not React behavior or video streams.

SDL coverage is 17 partial and 2 gap. Catalog validation is not a live Mosaic
rendering acceptance. Playback, hover, scrub/mute, precise overlays, clipping,
platform chrome and opaque action contracts remain documented portability gaps.
Visual checks are source comparisons and geometry checks, not an exhaustive
automated pixel-diff or accessibility certification.

The combined desktop Hero+Shorts scene was checked through measured source nodes
and its constituent designs; a full-scene design-context refresh failed with a
Figma transport disconnect. Its source dimensions and local rendering were checked,
but a new full-scene screenshot comparison is not claimed.
