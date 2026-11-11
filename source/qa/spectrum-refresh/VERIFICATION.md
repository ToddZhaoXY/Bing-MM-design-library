# UI refresh verification · 2026-11-10

Subsequent sidebar refinements and the latest archive are documented in [SIDEBAR-UPDATE.md](SIDEBAR-UPDATE.md). The checks below describe the first refresh stage.

## Build and regression checks

- Full three-library production build passed; subsequent theme-only rebuilds used the existing source build pipeline.
- `npm run test:source`: 149 passing tests (31 portal/navigation/home/boot, 8 compatibility, 13 MM Image, 40 AIGC, 57 Video).
- Existing theme isolation and contrast checks: 2 passing tests.
- Final `npm run verify`: 268 files, four HTML entries and 174 root/subpath resource references verified.
- Compatibility archive tests: 8 passed; `unzip -tq` passed.
- `git diff --check` passed.
- All 613 original files under `source/projects` (excluding dependencies, generated builds and QA artifacts) match the pre-edit SHA-256 snapshot. No component sources or source assets were changed by this refresh.
- Default Image card: before/after DOM plus computed font, color, size, background, corner radius, padding and gap matched exactly.

## Browser checks

Checked the built local static release using the in-app browser:

- Desktop at 1280px: MM Image / Image cards, AIGC / Creation composer, Video / Short Card, the Video Playground and homepage.
- Tablet at 1024px: AIGC preview uses the available width with properties below; no document horizontal overflow.
- Mobile at 390px: component navigation, collapse/expand, Image cards and 1208px-wide cards; no document horizontal overflow. At 100%, the card remains 1208px and scrolls inside its 309px preview viewport. Fit reduces it to the available space.
- Desktop 1208px card: 100% preserves source width and scrolls locally. Fit and Reset to defaults work.
- Nested Image Tile navigation expands without navigating; the main navigation collapses and expands.
- Video Playground: Blank assembly → add Short Card → visible Edit Short Card control; palette and inspector collapse correctly.
- Homepage pause/resume updates the accessible button state correctly.
- Keyboard Tab exposes the blue 2px focus ring on the navigation group control.
- No captured browser console errors during the local checks.

Screenshots are saved in this folder. The browser's temporary viewport override was reset after responsive testing.

## Delivery

- Updated repository-root static site, including `index.html`, all three Library pages and assets.
- `Design-Systems-Portal-Compat-delivery/MM-Design-Libraries-compat-a754058754f1.zip` with root-ready entries and complete assets.
- Online hosting was not updated. Runtime checks cover the sampled routes and interactions above, not every component variant or third-party renderer.
