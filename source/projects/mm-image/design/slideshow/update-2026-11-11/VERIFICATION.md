# SlideShow update · 2026-11-11

Source: [MM-ACF · Slide Card](https://www.figma.com/design/fRSRroY4YFgJSeqLLE0Y38/MM-ACF?node-id=2568-13065). This update changes the existing `Cells → SlideShow` component in the integrated library.

## Source changes

- 15 configurations, previously 12. New `Bottom bars + arrows` specimens: `2608:1516` (312 × 424), `2608:1684` (536 × 424), `2608:1815` (312 × 204).
- All card outer shadows removed. Comparison of 330 historical geometry rows found seven changed root effects; the recorded geometry of existing specimens is unchanged. See `delta.json` and the three current geometry captures.
- New mode: Default only, five indicators for four images and the final See more panel, no thumbnail-hover appearance. Footer: 90 px high, 24 px padding, 8 px gaps, 28 px soft arrow buttons, 6 px indicators and a single-line Roboto Bold 14/22 title.
- Soft chevrons retain their source SVG dimensions of 5.5 × 10 px. Asset hashes and exact asset contexts are recorded in the updated specification. Source image SHA-256 remains `3416a4dd979e41ce3c9e70e98bafcc71bce47e70ebddb0d34a22d0887e8249a7`; IMDb remains `0d6537d0f6782be87b149b5cfb8c81aa62c616ce51d6fb1b0ed0112cf72ef483`.

## Integration

The fourth pagination choice is available in the Workbench and Playground; dependent state options restrict it to Default. JSX, saved state and the partial Mosaic SDL adapter include the selected mode and slide index. HTML export embeds images/fonts as a static visual snapshot. See more invokes the consumer's optional callback; it does not invent a destination.

## Verification

- Full production build passed. Root site verifies 270 files, four entry pages and 174 root/subpath references. Source provenance verifies 362 recorded files.
- Full source/compatibility/system regression run: 152 passed (31 portal/navigation, 8 compatibility, 15 Image, 40 AIGC, 58 Video). After the final 2 px favicon alignment correction, the production build and all 15 Image tests passed again.
- Browser checked all 15 source configurations: expected size, correct source node, no outer shadow, no unloaded images. A path correction was necessary in the nested QA fixture for the shared badge asset prefix; the production asset path was already correct.
- All three new sizes passed previous/next boundaries, indicator selection, See more callback, Home/ArrowRight navigation, and absence of hover thumbnails.
- Workbench exposes the new mode and copies the live slide index. Playground state roundtrip restored 5:4/new mode/index 3. Exported HTML reopened successfully with five indicators and all four visible images embedded and loaded.
- New footer geometry matches source: portrait/compact title width 192 px, wide title width 416 px; footer starts at y334 for tall cards and y114 for compact; indicators start at x24/y394 or y174. IMDb favicon is x16/y16, 16 × 16 px.
- The requested 390 px browser viewport override was not reflected in the observed viewport. The actual narrow-page check was 661 px, with a 646 px document and a 532 px Fit-scaled wide card; there was no horizontal page overflow. This run does **not** establish 390 px acceptance. The override was reset.
- Compatibility ZIP `MM-Design-Libraries-compat-00f36936859b.zip` passed all eight compatibility checks and ZIP integrity validation. The first sandboxed packaging attempt could not listen on loopback; the authorized rerun passed.

Browser captures, measured rectangles, all-variant checks, interaction results, saved state, exported HTML and logs are under `source/qa/slideshow-update/`. Native card captures are `3x4.png`, `5x4.png`, `3x2.png`; `updated-slideshow.png` places them side by side. Figma captures in this directory are reference evidence, not implementation assets.

## Rendering and validation boundaries

Figma specifies progressive blur from 0 to 5 px. Its generated design context represents this as a constant 2.5 px backdrop blur, which the implementation follows. This is an approximation, not a pixel-identical progressive-blur claim. Source images are byte-identical; browser resampling and font rasterization can differ from Figma.

Mosaic SDL remains a documented linear partial adapter and requires host rendering for overlays, cropping, blur and interactions. HTML export is a static snapshot. No online publication or hosted-deployment validation was performed.
