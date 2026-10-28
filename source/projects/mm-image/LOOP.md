# LOOP — MMACF Web Component Library

> Goal: an intranet-hosted component library site for MMACF. Local build → GitHub → Web Hub.
> Source of truth: Figma `fRSRroY4YFgJSeqLLE0Y38`, page `139:7061` "Components".
> Content draft: `WEB-CONTENT-draft-01.md`.
> Reference shape: ACF Storybook (vibehub) — left nav taxonomy, per-component doc page, live variant panel.

## Decisions locked by Eko (2026-07-29)

- **D1 — Filter approach**: `ACF Tokenization` is canonical. The other two (`ACF Alignment`, `ACF Alignment vNext`) are NOT shipped in the site.
- **D2 — Content grid**: `11 × 4` and `6 × 2` are *labels*, not counts. The real constraint is the **size: 1200 × 424 px**. Site documents the size; drops the ambiguous count language.
- **D3 — v1 scope cut**: Header cell, Footer cell, RS cell are **OUT of v1** (no file source, no doc frame, bins undecided). Not stubbed, not navigated to — simply absent.

## Standing gates (carried from ROADMAP / RUBRIC)

- **G1** Bin is Eko's call. Only Badge ships a bin (`ACF-direct`, Code Connect → Fluent `899:31263`). Everything else renders a neutral `TBD` chip. **Never infer.**
- **G2** Organized by LEVEL (Molecule / Cell / Organism), never by surface. SERP/IRP are variants within a level.
- **G3** Atom = ACF token. Referenced, never rebuilt.
- **G5** Shared pieces stored once.
- **G6** Image scope only.

## Requirements (Eko's four, verbatim intent)

1. Contains all content, laid out following the Figma structure
2. Every component allows direct code copy
3. Live variant switching in-page → copy the resulting code (for Vibe Coding)
4. Free page assembly in-browser → copy the whole page's code

## Slices

### S1 — Shell + nav + one real component page ⭐ ✅ DONE (2026-07-29)
Vertical spike. Route structure, left nav (level-first), and **Image Container** fully dressed: overview, live preview, variant panel (4 axes → 36 combos), copy-code. Gets the template right once.
- Accept: Eko opens it, switches all 4 axes, preview changes, copied JSX matches the selection.
- Built in `site/`. `npm run dev` → :5173. tsc + vite build both clean.
- Verified in-browser: setting Dense/Portrait/3/8 + showOverlay redraws the preview and emits
  `<ImageContainer layout="Dense" orientation="Portrait" multiImage={3} borderRadius={8} showOverlay />`.
- Bonus vs plan: `get_design_context` on `150:5409` revealed **6 boolean slots** beyond the 4 select
  axes (showMetadata · imageBadge · showOverlay · collectionButton · moreImageIcon · showHover).
  All ten are in the panel. Real ACF token values captured into `src/data/tokens.ts`.

### S1.5 — Mosaic SDL pilot ✅ PARTIAL (2026-08-14)
Image Container now emits flattened Mosaic SDL v2 alongside MM JSX and validates the generated
tree against a sanitized 32-component Mosaic full-catalog snapshot (CLI `1.0.969`).
- Mapped: Basic / Col / Row composition, Image, Text, Caption, and an adjacent Badge fallback.
- Explicit gaps: local image URLs must become product/CDN URLs; overlay placement, container-only
  corner clipping, and hover/pop-out behavior lack a published portable contract; product actions
  still need typed `ActionConfig` payloads.
- Runtime verified: format switch, catalog-valid status, variant-driven SDL regeneration, fallback
  report, and clipboard copy all work in Chromium.
- Status remains **partial** until the above gaps are resolved; unsupported behavior is not encoded
  as arbitrary renderer instructions.

### S2 — Remaining molecules ✅ DONE
Badge · Meta data · source · Image Tile · RS Inline · RS Card · Image action cluster · Image overflow flyout. Same template.
- Accept: every component set in the inventory has a page with a working variant panel.

### S3 — Cells ✅ DONE
Content (1200 × 424, Waterfall + Dense) and Filter (`ACF Tokenization` only, per D1).
- Accept: Content renders at true size; Filter shows only the canonical approach.

### S4 — Organisms ✅ DONE
SERP · Image Answer and IRP · Whole Page, as composed views. Read-only showcase — **not** rebuilt from scratch.
- Gate cleared by Eko; both organisms are implemented from the latest MM_ACF source.

### S5 — Page assembly (req #4) ✅ DONE (2026-08-03)
The standalone `/playground` starts from SERP, IRP, or Blank and lets Eko add, remove, reorder,
and retune real MM component instances without adding layout wrappers to the copied surface.
- Content supports Image Tile edit-all and per-tile overrides.
- Export paths: page JSX, full round-trip state JSON, standalone HTML, and a registry-generated AI
  assembly prompt.
- Live image search feeds Content and RS on Top; copied JSX can include or omit the returned data.
- August 3 source archive: commit `0010c1a54d922dd1c14ea1bcff7bae274526c324`.
- Rebased on 2026-08-14 with the S1.5 Mosaic SDL pilot retained; production build passes.

### S6 — Full-library Mosaic SDL integration ✅ DONE (2026-08-14)
The Image Tile pilot is now a registry-backed SDL layer across the complete MMACF site.
- Coverage: **17 / 17** component pages have a live Mosaic SDL tab.
- Readiness: **2 available · 12 partial · 3 candidate**. These labels describe portability,
  not catalog validity.
- Every output is flattened SDL v2 and validates against the local Mosaic full-catalog
  snapshot: CLI `1.0.969`, 32 published components.
- Playground exports one portable SDL tree for SERP, IRP, or Blank assemblies, including
  block ordering and Content all-tile / per-tile overrides.
- Unsupported behavior is never hidden in made-up renderer props. Platform shell, product
  actions, masonry, overlays, hover/pop-out, gradients, and local-asset replacement remain
  visible warnings where applicable.
- Browser verification covers all 17 defaults plus every select option, boolean toggle,
  text override, reset, all three page surfaces, block add/remove/reorder, and Content tile
  overrides: **150 component cases + Playground interaction cases, zero catalog errors**.
- `npm run build` passes TypeScript and Vite production builds.

## Code output format

v1 emits **MM's own semantic JSX** with props taken verbatim from Figma variant names:

```jsx
<ImageContainer layout="Waterfall" orientation="Landscape" multiImage={1} borderRadius={24} />
```

Rationale: ARCHITECTURE.md D6 names Fluent v9 as the eventual target, but RUBRIC establishes only Badge has Code-Connect evidence — the mapping doesn't exist yet. Swapping to real Fluent later is a generator-template change, not a structural one.

## Stack

Vite + React + TypeScript, static build. No server. Deploys as static files to Web Hub.

## Open / deferred

- Header · Footer · RS cell — cut from v1 (D3), revisit when Eko writes the source
- Fluent v9 mapping — deferred until Code Connect coverage exists
- Figma live embed — blocked (CloudFront 403 observed); using rebuilt HTML/CSS previews instead
