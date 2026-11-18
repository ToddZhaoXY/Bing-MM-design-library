# Lazy loading and skeleton verification · 2026-11-16

## Result

Heavy component/workbench, Playground, source-catalog and foundation routes load when entered. Library introductions and navigation use small metadata generated from the real registries and Mosaic adapters. Source component renderers, data registries and export implementations remain unchanged.

| Library | Previous initial JS | Current initial JS | Reduction | Slow-profile introduction before / after |
| --- | --- | --- | --- | --- |
| mm-image | 558.1 KB | 186.9 KB | 66.5% | 4.77 / 2.82 s |
| aigc | 549.4 KB | 204.8 KB | 62.7% | 4.70 / 3.02 s |
| video | 457.3 KB | 206.6 KB | 54.8% | 4.40 / 3.18 s |

The profiles use a cold browser cache, 150ms latency, 200,000 bytes/s download throughput and 4x CPU throttling in desktop Chrome. These are local controlled observations, not hosted-site measurements or statistically averaged Web Vitals. Normal localhost runs render without a startup skeleton flash. The before/optimized JSON files retain resource timings and exact bytes.

## Loading behavior

- Page-shaped startup skeleton: secondary navigation, heading, content rows.
- Route skeleton: heading, preview canvas and properties placeholders; real navigation remains interactive.
- Subtle opacity pulse only; reduced-motion mode remains static. No artificial minimum loading duration.
- Normal waiting is separate from failure; slow or missing entry scripts retain diagnostics. Missing lazy scripts show an error boundary and retry recovers.
- A pointer dwell or keyboard focus warms the intended library HTML and up to eight same-origin script/style resources. At most two destinations per document, no prefetch during startup, no app execution during prefetch, and no prefetch on Save-Data/2G connections. HTTP cache reuse depends on browser and host headers.
- Algo static content no longer hides the whole document while its fonts are pending. Its upstream source remains unchanged; the integration adapter removes the font visibility guard.

## Deployment compatibility

The build emits ordinary classic scripts into one flat directory. A small dependency loader downloads missing chunks concurrently, registers factories, reuses loaded modules and catches failed loads. No eval, initial module entry, iframe, backend routes or nested asset directories are required. The initial script includes its static dependency closure. Manifest validation verifies all deferred filenames and graph edges.

`generate-overview.mjs` regenerates lightweight statistics before building. `sync-navigation.mjs` synchronizes the shared navigation and route-loading components. `SOURCE-UPDATES.json` records the permitted Home/main/Nav/Vite integration edits without rewriting the original source ledger.

## Checks

- Production build and type checks passed for all three React libraries.
- `npm run test:source`: 161 tests passed (39 integration/navigation/loading, 9 flat compatibility, 15 Image, 40 AIGC, 58 Video).
- `npm run verify`: 563 files, all main/Algo entries, 1,970 HTML/CSS root/subpath references and all deferred module dependencies passed.
- Browser lazy-check: 15 grouped checks passed under `script-src self`, `base-uri none`, `frame-src none`. Home requests no workbench chunks; real component pages produce valid SDL; every Playground exports HTML; repeated route visits do not re-download modules; intent prefetch does not execute another app; missing chunks recover; Algo remains visible while fonts are blocked.
- Reviewed desktop startup/route skeletons and the 390px route screenshot. The mobile skeleton has no page overflow; reduced-motion pulse is disabled.
- Existing imported Algo files still match their pinned hashes. Only the integration-generated theme removes the font guard.
- ZIP CRC, exact entry set, flat paths and every manifest SHA-256 were verified after packing.

## Deliverable

/Users/toddzhao/Documents/ChatGPT/Bing Design Library/Bing-MM-design-library-delivery/AIXA-Bing-Design-Library-optimized-2026-11-16.zip

ZIP SHA-256: `d9cbf7beb6b38ffce5acdba1126a6febf1d76f575a015ef9ef78123666e8569a`

The older deployment ZIP remains intact. This optimization is local and has not been committed or pushed to the saved GitHub branch. Cold first visits to a detail route can still need its deferred workbench bundle; the measured time reduction above applies to library introductions.
