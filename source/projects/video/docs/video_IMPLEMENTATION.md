# Video ACF implementation

## Components and hierarchy

Use the scoped Figma pages for Short Card, Video Metadata, Video Magazine Card,
Video Group, Shorts Group, Video Magazine Zone, five SERP compositions and VRP.
Foundation rules and source catalog are documentation routes. Referenced video
primitives on the Components page can become nested workbenches as needed.

## Layout and code architecture

Reuse AIGC-ACF's tested shell and MM_ACF's molecule/cell/organism registry model.
Each registered component has a public React API, a property-driven preview,
copyable JSX and a flattened SDL adapter. Shared live values are validated and
persisted in page state. Intrinsic source dimensions and Fit view remain distinct.
Use source auto-layout relationships for React flex/grid composition.

## Design values and assets

Read actual source typography, paints, spacing, corner radii and assets from the
selected Figma nodes. Retain semantic ACF tokens where available and document
unresolved variable aliases. Figma screenshots are QA references only. Preserve
static SVG/image assets in their source slots, downloaded locally for runtime.

## Source differences

The Video-specific rules page mentions 9:16 shorts and bottom-positioned duration,
while the current Short Card page supplies 3:4/2:3 variants and the captured
default shows a top-left badge. Preserve both the written rule and the observed
component design; flag this discrepancy instead of silently changing the source.
SERP Video Answer Go-wide is explicitly in progress.

## Verification and delivery

Verify source asset presence and geometry, default/variant rendering, hover/focus
state behavior, inspector/JSX/SDL synchronization and imported state. Validate SDL
against the inherited 32-component catalog and document unsupported playback,
overlay and product action contracts. Build a static site with relative assets
and HashRouter. Package dist contents directly so index.html is ZIP-root-level.
