# FY25 Image ACF Cards

Source: https://www.figma.com/design/9yILIRLGDWRBLMqbs5hkoZ/MM-ACF-FY25?node-id=2216-1178

Imported 2026-10-29 from the user-selected desktop frame, through Figma MCP.
`inventory.json` enumerates 49 source examples in 13 actual size families. The
original frame hierarchy is preserved in `root-context.txt`; `overview.png`
is reference evidence only, never a runtime asset. Per-card high-fidelity
contexts are saved as `context-{small,tall,wide}-*.txt`.

## Organization

- 2x2 (200×200), 3x2 (312×200), 4x2 (424×200), 5x2 (536×200), 2x4 (200×424).
- 3x4 (312×424), 4x4 (424×424), 5x4 (536×424), 6x4 (648×424).
- 8x4 (872×424), 9x4 (984×424), 11x4 (1208×424), 11x2 (1208×200).

The library exposes one Image cards entry at the end of Molecules. Size is the
outer variant axis; the layout choices depend on the selected size. These are
web variants transcribed from source examples, not
new component sets written back into Figma. Duplicate-looking frames remain
separate source configurations when their source classification differs.
The FY25 1208px footprint intentionally coexists with the existing 1200px
Content contract. Existing MM Image components retain their original source.

## Implementation

`site/src/data/image-cards/` holds typed native layout descriptors. Shared
`ImageCards.tsx` renders them with inline styles, flex layouts, source images,
source SVG icons, and limited absolute positioning for overlays. Source labels,
image crops, gaps, corner masks and resolved source colors remain per variant.
The source file is linked from the common page header; the active layout has
one Figma link in the property panel. Page chrome follows the existing library.

The public `ImageCards` component exposes `size` and a dependent `variant` prop.
Legacy size-specific exports and saved page blocks remain compatible. Optional `imageSrc` and `onAction` connect product data. Default
preview actions open image/related-search dialogs; scroll controls operate on
actual rails. Pagination for the related-search example provides a callback:
only the first page exists in the source, so no additional results are invented.

Mosaic SDL is explicitly **partial**. Images, text and linear structures map
to published primitives. Crops, overlays, rounded masks and source actions
cannot be represented exactly by the saved catalog. Local image URLs require
replacement by renderer-reachable URLs. Catalog validation is not evidence of
visual parity in the target Mosaic renderer.

Standalone Playground HTML embeds the new cards' source assets and fonts. It
is a visual snapshot; React callbacks and dialogs remain in the live component
library. Source image/SVG temporary URLs are not used at runtime.

## Verification

- `npm --prefix site test`: complete inventory, source-size grouping, public
  JSX/workbench parity for every configuration, local assets, component/page SDL.
- `npm --prefix site run build`: TypeScript and production build.
- Root `npm run build`, `npm run test:source`, `npm run verify`: integrated
  build and static publication validation.
- `qa/browser-report.json`: rendered variant bounds, actual asset requests,
  native gallery interaction, desktop/mobile preview checks.

This directory holds source and verification evidence. Runtime assets are in
`site/public/figma/fy25/`; generated root assets are produced by the existing
compatibility publisher. No Figma source nodes were modified.
