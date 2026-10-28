# MM Design System

- **Status:** Active Figma library build for Image SERP + IRP.
- **Scope:** Image only, SERP + IRP, Figma-first in file `fRSRroY4YFgJSeqLLE0Y38` "MM UX Governance".
- **Current source of truth:** [[work/projects/mm-design-system/ROADMAP]], with web-library execution in [[work/projects/mm-design-system/LOOP]], draft site copy in [[work/projects/mm-design-system/WEB-CONTENT-draft-01]], taste rules in [[work/projects/mm-design-system/RUBRIC]], structure in [[work/projects/mm-design-system/ARCHITECTURE]], and Figma build gotchas in [[work/projects/mm-design-system/BUILD-NOTES]].

## Current state

As of [[memory/2026-07-21]], the library had its page system, core molecules, and cell cards built; organisms were still gated at that point. The latest build corrections matter because the library is now using the real component sources: RS Pill was rebuilt with `Query Suggestion`, Content copy-me uses the refactored Image Container instances, and Image Container min floors moved to `182` width and `200` Dense height.

The canonical `Image Container` set (`150:5408`, 36 variants) now absorbs the hover state through one `Show hover` boolean instead of a separate attachment-card set. Hover drives the popup background, two-line metadata overlay, dimension label, and a nested `Image action cluster`; type-specific action logic lives in separate `Image action cluster` (`360:16129`) and `Image overflow flyout` (`385:4577`) component sets so `Image Container` stays a single on/off host rather than exploding into type-by-surface variants. The old 18-variant attachment-card set (`315:3033`) was retired after the canonical set was verified.

As of [[memory/2026-07-22]], the no-metadata image-fill attempt was reverted for the 12 single-image variants. Eko's correction was that the original IC should still read as one framed object that wraps image + metadata; splitting it into a fixed image plus floated card made the component look like two pieces. Final state: single-image variants returned to the original single-frame / HUG structure, `meta slot` stays ungated, `Meta data` and `hover meta overlay` self-gate at the leaf level, and hover+metadata both-on remains a consumer/script-layer mutual-exclusion case because Figma booleans cannot express `hover AND NOT metadata`.

The July 2 vNext roadmap sync makes this more than a local cleanup project: Eko's MMACF component library work was named as the prerequisite for [[work/projects/mm-gen-ui]], the future multimedia Gen-UI / Mosaic direction. That makes organizing the Figma library the gating work before model- or skill-driven layout generation can be credible.

The Jul 8 internal Image group gives the component decisions behind the current Figma values: ImageTile can switch Waterfall / Dense, the radius set stays `8 / 16 / 24`, the badge should use the ACF component directly rather than a double wrapper, and the height tension is real (`200` for carousel/SERP/vNext usability vs `232→252` for the ACF responsive stretch rule). The current `200` min-height is a pragmatic rule to test, not proof that the ACF tension is gone.

As of [[memory/2026-07-29]], the work added a second deliverable: an MMACF web component-library site under `site/`, using Vite + React + TypeScript. Slice 1 established the shell, level-first nav, component-page template, Image Container preview, generated variant panel, JSX generator, and ACF token file. Eko locked three web-library decisions: Filter ships `ACF Tokenization` only, `11x4` / `6x2` are size labels rather than counts with `1200 × 424 px` as the real constraint, and Header / Footer / RS cell were initially cut from v1.

As of [[memory/2026-08-02]], the web library's Playground has Option B for ImageTile editing: Eko can edit all ImageTiles in a Content block or one individual ImageTile, and copied page code emits `tile={{...}}` / `tiles={{ i: {...} }}` only when needed. The Content spacing control was corrected from shell `padding` to tile-to-tile `gap`; default `16` matches the Figma state, and gap changes now drive both horizontal and vertical tile distance instead of inset padding. Remaining open questions stay in `HANDOFF.md`: canvas squeeze, SERP/IRP fidelity gaps, and Figma-side cleanup.

As of 2026-08-14, the latest `MM_ACF-main.zip` source is merged and the web library is complete across 17 components, including Header, Footer, SERP, IRP, and the real `/playground`. A centralized Mosaic adapter registry now emits flattened SDL v2 for every component and for complete Playground assemblies. All output validates against the Mosaic full catalog from CLI `1.0.969` (32 components). Coverage is intentionally graded as 2 available, 12 partial, and 3 candidate: platform chrome, typed product actions, masonry, overlays, hover/pop-out, gradients, and local-image replacement are reported as explicit portability gaps rather than represented by invented renderer props. Automated browser verification exercised 150 component property cases plus SERP, IRP, Blank, block operations, and tile overrides with zero SDL catalog errors; the TypeScript/Vite production build is clean.

## Related

- Strategic consumer: [[work/projects/mm-gen-ui]]
- Product surface: [[work/projects/image-vertical-vnext]], [[work/projects/serp-genie]], [[work/projects/category-selector]]
- Upstream systems: [[work/acf-system-map]], [[work/sdl]]
- People: [[work/people/dazhou]], [[work/people/heba]], [[work/people/charlotte]]
- Source: [[memory/2026-07-21]]
- Source: [[memory/2026-07-22]]
- Source: [[memory/2026-07-08]], [[raw/meeting-transcript-20260702-continued-topics-vnext-design-sync]]
- Source: [[raw/meeting-transcript-20260708-image-group-groupchat]]
- Source: [[memory/2026-07-29]]
- Source: [[memory/2026-08-02]]
