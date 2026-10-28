# ROADMAP — MM Image Design System (Figma build)

> Input: firmed concept (proto-01 + teardown) + RUBRIC.md. Scope: Image, SERP+IRP, Figma-only, file `fRSRroY4YFgJSeqLLE0Y38`.
> This is the slice + load output of prototype-to-roadmap. Next: roadmap-to-loop turns each slice into tagged acceptance criteria.
> Echo holds the architecture & directs; Eko reacts at 【本人】 gates (esp. bin assignment, which tools cannot derive).

## Proposed ordering — MVP-first (Echo's proposal, Eko rules)

**Why MVP-first, not risk-first:** the biggest unknown (can we even read/build cleanly in this Figma) is cheap to retire by just building ONE real component card. So slice 1 is a vertical spike — one component, fully dressed to the component-page model — and it doubles as the template every later component copies. Get the template right once, the rest is throughput.

The riskiest *judgment* (bin assignment) can't be retired by sequencing — it needs Eko at every component. So it's a global gate, not a slice.

---

### Slice 0 — Library page system (the container)
**Owner's intent**: "你可以自由噉去創建一啲你覺得需要嘅頁面" + the divider-page model: "單拉一頁例如叫 Molecules，這頁本身唔放嘢，但喺 Figma config 上顯示個名…形成一種視覺關係。"
- seed: use the **divider-page pattern** (confirmed = how ACF's 120 pages work): bold-caps TITLE pages (`𝗠𝗢𝗟𝗘𝗖𝗨𝗟𝗘𝗦` / `𝗖𝗘𝗟𝗟𝗦` / `𝗢𝗥𝗚𝗔𝗡𝗜𝗦𝗠𝗦`) that hold nothing themselves, then EACH component on its OWN page, indented (`     ↳ Image Tile`). Page list is flat in config; the naming creates the visual hierarchy. 【from RUBRIC: revealed — structure A, corrected 2026-06-26】
- seed: NOT three container pages with things inside them — each molecule/cell/organism is a separate page under its divider 【Eko correction 2026-06-26】
- seed: a Foundations divider whose pages POINT to ACF tokens, not rebuilt 【from RUBRIC: known】
- thin: just the dividers + a Cover/Getting-started + empty per-component pages stubbed. Demoable = Eko opens the file and the page list reads as a 3-level system, like ACF's.

### Slice 1 — Image Tile component card (the template spike) ⭐
**Owner's intent**: Image Tile is the shared molecule, "精简即可" — build it first, dressed to the component-page model, as the pattern every later card copies.
- seed: lives on the Molecules page as a flat set of EXAMPLES (variants laid out on its own page) 【from RUBRIC: known】
- seed: trimmed variant set, not the full scattered set 【from RUBRIC: known — "image tile 精简即可"】
- seed: dressed to the component-page model — `.Page Header` + **Copy-me source** + variants/properties Table + when-to-use 【from RUBRIC: known — prior-framework presentation】
- seed: restrained visual style — light strokes, generous whitespace 【from RUBRIC: known】
- seed: internal molecule overlap shown honestly — Image Tile (MM-built) contains Badge (ACF-direct, Fluent `899:31263`) + Image Title (MM-built) 【from RUBRIC: revealed — overlap】
- 【本人 gate】: Eko confirms the trimmed variant set + the template layout before it becomes the pattern.

### Slice 2 — Remaining molecules (throughput, using slice-1 template)
**Owner's intent**: fill the molecule layer for Image SERP+IRP — RS Pill, and the rest sorted in teardown.
- seed: each molecule gets its own component card in the slice-1 format 【from RUBRIC: known】
- seed: shared pieces stored ONCE (Image Tile already done; don't duplicate) 【from RUBRIC: known】
- 【本人 gate per molecule】: Eko assigns the bin (ACF-direct-use vs MM-built) — tools can't derive it.

### Slice 3 — Cells
**Owner's intent**: Content, RS (per row), Filter, Header, Footer — assembled from the molecules.
- seed: cells compose upward from molecules only; cells may nest cells (Content ⊃ Filter) 【from RUBRIC: revealed】
- seed: each cell carries a Copy-me + variants 【from RUBRIC: known】

### Slice 4 — Organisms
**Owner's intent**: SERP Image Answer (Content+RS+Header+Footer) and IRP whole-page (Content+RS, no Header).
- seed: organism scope differs per surface; ACF page shell excluded 【from RUBRIC: revealed】
- seed: MM organism shown nested in (not rebuilding) the ACF scaffold 【from RUBRIC: known】

---

## Global gates (standing principles — checked on EVERY item)
- 【G1 / 本人】 **Bin is Eko's call.** No item ships an ACF-direct-use vs MM-built tag inferred from name or token. Echo presents structure; Eko assigns. Code Connect is the only auto-evidence. 【RUBRIC: process rule】
- 【G2】 Organized by LEVEL, never by surface. 【RUBRIC: revealed — structure A】
- 【G3】 Atom = ACF token, referenced never rebuilt. 【RUBRIC: known】
- 【G4】 Component-page model + restrained visual style on every component. 【RUBRIC: known】
- 【G5】 Shared pieces stored once. 【RUBRIC: known】
- 【G6】 Scope fence: Image only; library only (governance/review deferred); ACF shell excluded. 【RUBRIC: boundaries】

## Open question for Eko before roadmap-to-loop
- **Slice 0 first, or skip straight to Slice 1?** I propose building the skeleton (Slice 0) first so Image Tile has a home. But if you'd rather see ONE real component card before committing to the page structure, we do Slice 1 in a scratch area first. Your call — it's the first taste decision.

---

## BUILD PROGRESS (updated 2026-07-29)

- **Slice 0 (page system)** ✅ done — divider pages + per-component pages exist (file `fRSRroY4YFgJSeqLLE0Y38`).
- **Slice 1 (Image Tile template spike)** ✅ done — Eko's own card (main 19:31 / usage 47:12075) is the molecule template.
- **Slice 2 (remaining molecules)** ✅ done, with correction pending cleanup — Badge (83:54 / 83:83) is done. RS Pill was rebuilt with the real `Query Suggestion` component as a new card (224:98); the older wrong `Related search pill` card (91:2 / 91:31) is intentionally preserved until Eko approves deletion.
- **Slice 3 (cells)** ✅ partial / site-v1 scoped — Content (105:2/108:2) remains the only prose-backed cell. Filter now lives under section `621:14721`; Eko locked `ACF Tokenization` as the canonical shipped approach for the web library. The old Header (115:80004), Footer (115:99969), Filter (113:2), and RS cell (230:517) IDs are stale/not-found in the current Figma read; Header / Footer / RS cell are cut from web v1. Content copy-me should document the real size constraint (`1200 × 424 px`) rather than treating `11x4` / `6x2` as literal counts.
- **Image Container spec revision** ✅ applied — canonical set 150:5408 has min width `182` on all 36 variants; Dense variants have min height `200` and max height `252`. Earlier 190 / 232 floors are superseded.
- **Image Container hover/action revision** ✅ applied — hover is folded into the canonical 36-variant set via one `Show hover` boolean. It drives the popup bg, two-line hover meta, dimension label, and nested action cluster. The old 18-variant attachment-card set 315:3033 was deleted after Eko approved retirement; older source hover art 18:6441 / 139:7217 remains for migration/reference.
- **Typed action/flyout components** ✅ applied — `Image action cluster` (360:16129) and `Image overflow flyout` (385:4577) use `Type` (Web / AIGC / Homepage) × `Surface` (SERP / IRP). SERP drops Save for Web/AIGC; IRP keeps Save. `Image Tile (Hover)` showcase 47:37654 now presents variants by image type, not by old density/title buckets.
- **Slice 4 (organisms)** ⛔ NOT STARTED — deliberately gated. SERP (12:18) + IRP (12:19) are no longer safe to call empty; direct node reads found content, but organism scope is still gated and should not be built autonomously.

### Web component-library progress (updated 2026-07-29)
- **S1** ✅ done — `site/` contains the Vite + React + TypeScript shell, level-first nav, component-page template, Workbench, Image Container preview, generated variant panel, JSX generator, and ACF token file.
- **S2** next — remaining molecules.
- **S4** still gated — organisms need Eko's explicit go.

### Bins assigned so far (G1 status)
- ✅ evidence-backed: Badge = ACF-direct (Code Connect / Fluent evidence).
- ⬜ TBD-Eko (neutral chip in-file, not guessed): everything else until Eko assigns or Code Connect evidence exists.

### Open questions for Eko at review
1. Which three are "the three molecules" for S2 throughput?
2. Bins for all non-Badge components.
3. Do undocumented components get prose doc pages, or panel-only pages?
4. Organism scope — SERP Image Answer vs ACF shell boundary; IRP ours-vs-shell split.
