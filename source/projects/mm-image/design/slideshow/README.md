# SlideShow source handoff

Source: [MM-ACF · Slide Card](https://www.figma.com/design/fRSRroY4YFgJSeqLLE0Y38/MM-ACF?node-id=2568-13065). Initially captured 2026-11-09; refreshed 2026-11-11. User-facing library label: **SlideShow**, under **Cells**.

## Evidence and implementation inputs

- `specification.json`: 15 source variants, exact dimensions, backgrounds, typography/slot rectangles, controls, gradients and asset hashes. Updated entries reference current evidence in `update-2026-11-11/`; `specification-before.json` there preserves the previous 12-variant specification.
- `3x4/5x4/3x2-geometry.json`: source-local rectangles from read-only Plugin API inspection. Positions are relative to each card's top-left. The root and source file were not modified.
- `*-context.txt`: high-fidelity official design contexts for every variant. Each corresponding PNG is the visual target, **not an implementation asset**. Historical screenshots include former shadow bounds; actual card dimensions are 312 × 424, 536 × 424 and 312 × 204.
- `*-asset-context.txt`: exact SVG/image leaf contexts where Code Connect hid the assets. `source-leaf-geometry.json` records precise glyph placement.
- `asset-manifest-source.json`: download provenance. Temporary Figma URLs in evidence expire and must not enter runtime code.

## Composition facts

| Source size | Arrow/top image slot | Metadata visibility | Bottom-bars image slot |
| --- | --- | --- | --- |
| 3:4 | 536 × 424, x = −112, y = 0 | Fully clipped at x = −96 | 312 × 424 at 0,0 |
| 5:4 | 536 × 424 at 0,0 | x16, y16 arrows; x16, y388 top-bars | 536 × 424 at 0,0 |
| 3:2 | 312 × 204 at 0,0 | x16, y16 arrows; x16, y168 top-bars | 312 × 424 at x0, y−95 |

All source images use fill/cover with centered original Windows Bloom imagery. Thumbnail images use the same original. Source image SHA-256 is `3416a4dd979e41ce3c9e70e98bafcc71bce47e70ebddb0d34a22d0887e8249a7`, an exact match to the existing `./figma/fy25/windows-bloom.png`.

Bottom-arrow controls have 28 × 28 buttons, a 45 × 28 counter, 8 px gaps, and 20 px bottom inset. Group width is 117 px. Its x positions are 97.5/133.5/186.5 on 312 px cards, 209.5/245.5/298.5 on 536 px cards; y376 for 424 px cards, y156 for the compact card.

Top-bar arrow controls are 48 × 48 with 16 px horizontal insets. Their y is **193 on 424 px cards** (the source is 5 px below perfect vertical center), and y78 on compact cards. Top footer is 68 px high; bars start x36/y16, are 6 px high with 8 px gaps. Title starts x36/y30, Roboto Bold 14/22.

All card radii are 24 px. The 2026-11-11 source removes all root shadows. Comparing 330 historical geometry rows against the current source found seven root-effect changes and no other changes to the existing specimens' recorded geometry.

**Bottom bars + arrows** is new for all three sizes: nodes `2608:1516`, `2608:1684`, `2608:1815`. It uses the actual card-sized image slot, dark IMDb metadata at x16/y16, and a 90 px footer with 24 px padding and 8 px gaps. The footer has a one-line Roboto Bold 14/22 title, two 28 px soft arrows (`#2c3459` background, `#d9dffb` glyph), and five 6 px indicators. Selected bars are fully white; other bars are white at 30%. Only Default is supplied; this mode has no hover thumbnails. Figma's progressive blur is represented by the generated design context's constant 2.5 px backdrop blur, an acknowledged rendering approximation.

Bottom bars has a 2 px backdrop blur. Default 3:4 shows four unfilled grey bars. Default 5:4 and 3:2 show a 75%-filled first bar. Hover replaces bars with four thumbnails, selected first thumbnail outlined white. Thumbnail sizes are 64/110/54 px for 3:4/5:4/3:2; gaps are 8/12/12 px. See the JSON for exact text and thumbnail rectangles.

## Assets and fonts

- Reuse `./figma/fy25/windows-bloom.png` and `./figma/icon/badge-multi-image.svg`. Both downloaded source files were proven byte-identical to these existing files; duplicates were removed.
- Assets: `./figma/slideshow/imdb-favicon.png`, four left/right white/blue chevron SVGs, and `open-external-white.svg`. The 2026-11-11 update adds exact soft left/right chevrons, both 5.5 × 10 px.
- SVGs are tightly cropped shapes, not 16/20 px artboards. Preserve native root dimensions and position in the documented icon slots. Blue glyphs: 6.875 × 12.5; white glyphs: 5.5 × 10; external icon: 12 × 12. Do not stretch glyphs to fill the slot.
- Source bottom-bar headings use **Alice Regular**. `./figma/slideshow/fonts/alice-400.woff2` comes from pinned `@fontsource/alice@5.2.6`; OFL license is adjacent. It matches the requested font family/style, but Figma does not expose the original font binary to prove file identity.
- Reuse existing local Roboto 400/700 files in `./figma/fy25/fonts/`.

## Behavior boundary

The source explicitly describes static Default/Hover appearances, with no slide or hover interactions wired. Runtime interaction must be documented as implementation behavior.

Arrow and top-bar source tracks contain **five** image frames: four normal images and a final darkened “See more” panel. Arrow counter reads “1 of 4”; top bars exposes four indicators. The source does not define the fifth panel's navigation/count behavior. Collection badge counts 24 (3:4) and 23 (5:4/3:2) are separate from these preview slot counts.

The “See more” panel uses the same placeholder image, black 60% overlay, centered Roboto Bold 11/13 label, a 4 px gap and 16 × 16 external-icon slot (12 × 12 SVG at x2/y2). It exists offscreen in the initial source screenshots; its layout is established by the high-fidelity contexts and inspected geometry.

Code Connect references unavailable Windows `entity-segments` source paths. No mappings were edited; exact asset leaves were obtained to adapt into the local codebase.

## Library integration and validation

The runtime entry is `Cells → SlideShow`, route `#/c/slideshow`. It uses the shared Workbench, registry navigation, dependent state selector and Playground. Manual navigation supports arrow buttons, indicators, thumbnails and Left/Right/Home/End keys. Hover/focus reveals thumbnails; the Hover prop pins that appearance. There is no autoplay.

The arrow preview preserves the source's `1 of 4` image count and exposes the additional end card with a `More` counter. Top bars has four navigable slots matching its four indicators. The new Bottom bars + arrows mode exposes all five slots, including the final See more panel, with five matching indicators. `onSeeMore` supplies the product action; without it the end card is visual. These are implementation decisions where the source is static or ambiguous.

JSX and saved Playground state retain `initialIndex`. HTML embeds images and both font families as a static visual snapshot. Mosaic SDL is explicitly a linear, partial adapter; schema validation does not establish overlay or interaction fidelity.

Current validation is documented in [the 2026-11-11 verification report](update-2026-11-11/VERIFICATION.md), with browser evidence under `source/qa/slideshow-update/`.

Historical validation on 2026-11-09: production build; all 149 source/compatibility/system regression tests; root asset verification (268 files, four entries, 174 root/subpath references); all 12 configurations plus navigation, reset, saved state and HTML export in a fresh network-disabled browser fixture. At 390px viewport width, document width is 390px. Evidence is in `qa/report.json`, screenshots and `qa/standalone-snapshot.html`. This historical fixture did not inspect the user's browser or verify a hosted deployment.
