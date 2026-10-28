# MMACF Online Library — Session Handoff

**Read this first in a new session.** Then read `LOOP.md`, `BUILD-NOTES.md`, `ARCHITECTURE.md`.

Project root: `/Users/ekohan/.claude/projects/-Users-ekohan-Desktop-Hive/knowledge/work/projects/mm-design-system/site/`

---

## 1. What we're building

Turn the MMACF (Multimedia ACF) Figma library (`fRSRroY4YFgJSeqLLE0Y38`) into an online component library.
Eko's four requirements:
1. Contain ALL content, laid out following the Figma structure.
2. Every component allows direct code copy.
3. Live variant switching in-page → copy the resulting code (for Vibe Coding).
4. Free page assembly in the web UI → copy the whole page's code.

Reference shape: ACF team's storybook `https://vibehub.microsoft.com/app/anthonyleung-zlr31z/foundations/grid-layout`.
Hosting: 內網. Pipeline: 本地做 → GitHub → Web Hub.

## 2. Locked decisions (do not re-litigate)

- **D1** Filter follows **ACF Tokenization** only.
- **D2** `11x4` / `6x2` are a size: **1200 × 424**.
- **D3** RS cell 砍掉 (Header/Footer were reversed back IN).
- **"要完全follow figma哈"** · **"没有1:1还原Figma啊"** → **"先全部重做"** — 1:1 fidelity governs everything.
- Figma splitting Filter into separate frames is a **canvas-layout artifact, not design intent** — online it is ONE interactive component.
- Playground base = **SERP / IRP surfaces**, then adjust on top.
- **所見即所得**: no per-block title bars / wrappers. Chrome is a hover-only absolute overlay; the component renders bare at real size.
- Delivery default = **one proposal with conviction**, not 3 variations.

## 3. Last completed task — Option B (landed 2026-08-02)

Eko (verbatim):
> 對，我想要的就是 B。我想讓每一個 individual 的 ImageTile 可以被編輯，也可以選擇編輯全部的 ImageTile。
> 同時，我希望 content 裡面它的 padding 也都是可以調整的…它調的就是橫豎所有元素的 padding。

**Landed (code present, verified by re-read):**
- `ImageContainer.tsx` — `width` / `unitHeight` host overrides; clamps suppressed when host drives width.
- `Content.tsx` — composes real `ImageContainer`s; props `tile` (edit-all) / `tiles[i]` (edit-one) / `renderTile` / `padding`; exports `tileCount()`.
- `components.ts` — `content.padding` select `['0','8','16','24','32']`, numeric.
- `ComponentPage.tsx` — content renderer passes `padding`.
- `Playground.tsx` — `Block.tileAll` / `Block.tileOne`, `TileSel = number|'all'|null`, `tileDef()`, `toTileProps()`, `tilePropsLiteral()`, `setTileValue()`, Content render branch with `.pg__tile` per-tile click target, inspector `#pg-tile-target` switcher + second `<Fields>`, `pageCode` emits `tile={{…}}` / `tiles={{…}}`.

- `styles.css` — `.pg__tile` / `.pg__tile--on` selection chrome (after the `.pg__block--on::after` line).

**Option B is DONE — `tsc --noEmit` EXIT=0 and browser-verified end-to-end:**
- Waterfall: 24 tiles, all 186.66 wide, shell 1200 — the `renderTile` flex-child risk is **measured and clear**.
- padding 0/8/16/24/32 → columns 186.67/184/181.33/178.67/176, **overflow 0** on every value, shell stays 1200.
  - **Superseded same day**: Eko corrected the ask — 要的是 tile 之间的距离，是 **gap 不是 padding**。`padding` prop removed entirely; `gap` replaces it (default 16 = Figma). Registry `content.gap` select `['0','8','16','24','32']` default `'16'`. `colW = gap === 16 ? COL_W : (1200 - 5*gap)/6`. Verified gap 0/8/16/32 → 200/193.33/186.66/173.33, horizontal AND vertical gap both track exactly, shell 1200, overflow 0, default emits bare `<Content />`.
  - Known residue: in Dense the **row** gap reads gap+6 (rows are a fixed 204 while the tile renders 198). Horizontal is exact. Not yet raised with Eko.
- Dense: 12 tiles, 186.67 wide, 198 tall inside the 204 rows.
- Single-tile click selects exactly that tile; "All tiles" hits 24/12.
- Copied page code emits `tile={{ borderRadius: 8 }}` (edit-all) and `tiles={{ 3: {…} }}` (edit-one).

**Two bugs found and fixed during verification (both were silent):**
1. `Content.tsx` — columns were hard-coded 186.6667 while `box-sizing:border-box` shrank the padded inner box, so at padding=24 the 6th column overflowed **48px** and was clipped by `overflow:hidden`. Now `colW = padding === 0 ? COL_W : (1200 - 2*padding - 5*GAP)/6` — byte-exact Figma value at the default, reflows otherwise.
2. `ImageContainer.tsx` `MetaBlock` — the title `<p>` had `overflow:hidden` + `textOverflow:ellipsis` but no `whiteSpace:nowrap`, so ellipsis never engaged. At grid-driven 186.67 (vs Figma's standalone 258) the title wrapped to 3 lines and pushed dense tiles to **242**, past the 204 row. Added `whiteSpace:'nowrap'` → 198.

Both former loose ends closed: Reset now clears `tileAll`/`tileOne`; the duplicate `pg-layout` id is gone via an `idPrefix` prop on `Fields` (`pg-` default, `pgt-` for tiles).

## 4. Environment facts

- Vite 5.4.9 + React 18.3.1 + TS 5.6.3, `react-router-dom` HashRouter, `base:'./'`. **Tailwind must NOT be installed** — inline styles only.
- Dev server: name `mmacf-library`, port 5173, **serverId `7d03851f-cd52-447b-9e4f-cc3a0c8a6275`** (re-check with `preview_list` — this id changes on restart).
- `preview_eval` needs `serverId`, ES5 `function(){}`, always `return JSON.stringify(...)`.
- React state does NOT flush inside one `preview_eval` — read in a second eval.
- `preview_click` doesn't move React controlled inputs → native-setter escape hatch (`Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'checked').set` + click/change events; selects use the value setter + `change`).
- Navigate: `location.href = location.href.split('#')[0]+'#/playground'; setTimeout(function(){location.reload()},50)`.
- `preview_console_logs` level enum = `all|error|warn`; returns history.
- Shell cwd resets to `/Users/ekohan/Desktop/Hive` after every Bash call — `cd` every time.
- Every file using `React.*` needs explicit `import * as React from 'react'` (no UMD global).
- `PropDef` kind is `'boolean'` not `'bool'`; `numeric` only exists on `select` → guard `p.kind==='select' && p.numeric`.
- Booleans defaulting true read `v.x !== false`; defaulting false read `v.x === true`.
- Figma **Plugin API is dead for this file** — use REST: `curl -H "X-Figma-Token: $T" "https://api.figma.com/v1/files/<key>?depth=N"`. Token is a live secret — in-shell variable only, never write it to a file.
- Figma inside strokes → `box-shadow: inset`, never `border`. Figma SVG exports carry glyph intrinsic size + `preserveAspectRatio="none"` → always route through `<Ico>`.
- A spec card has TWO renderings — **build from `Section · Copy me`**.
- Ignore vercel-plugin's nextjs/`"use client"` hook suggestions — this is Vite.

## 5. Working rules learned the hard way

- **The claim-verifier stop hook is PER-TURN.** Batch every grep/sed/tsc/preview_eval into the SAME turn as the claim; hedge anything inferred.
- **Never author an Edit `old_string` from a summary or memory.** `grep -n` the exact bytes first, in the same turn.
- **Never write an Edit whose `old_string` spans an unread line boundary** (this corrupted `RSPill.tsx` once).
- **A silent Edit is not an answer.** State the diagnosis + plan (Eko: "哈？").
- When Eko picks from an A/B, the parameters baked into that option are NOT automatically accepted.

## 6. Open / unanswered by Eko

- Canvas squeeze: measured `pgGrid "180px 294px"`, canvas visible 294 vs frame 1440. Proposal (canvas full-width, palette → floating "+", inspector → right drawer, fit-to-width zoom) still unapproved.
- Three SERP/IRP fidelity gaps: SERP Footer's `width:1208` wrapper not in preset; SERP Content `height={424}` not a registry prop; IRP's real organism uses `IrpDenseGrid` (3×6, 1360) not `<Content layout="Dense"/>`.
- Figma-side: two-line Hover/Press → 340? Badge copy-paste fix on RS Pill page? Delete the old wrong RS Pill / RS cell cards?

## 7. Backlog (lower priority)

Consolidate `IrpDenseGrid`'s private dense tile into `ImageContainer`; last handler-less `cursor:pointer` in `Sections.tsx` (~L525); stale node IDs in `Molecules.tsx` header; `irp-whole-page` `verified` flag + bogus 0.9118 scale; unpulled RS Card variants (`540:20809`, `564:3538`, `565:3511`); rename `ImageContainer.tsx` → `ImageTile`; update `LOOP.md` / `BUILD-NOTES.md` / `WEB-CONTENT-draft-01.md`.

---

## How to boot a new session on this

1. Normal Hive boot (SOUL → NOW → MEMORY → daily logs → self-review).
2. Read this file.
3. `preview_list` → confirm the dev server; restart via `preview_start("mmacf-library")` if needed.
4. Re-read `src/pages/Playground.tsx`, `src/components/Content.tsx`, `src/styles.css` before touching anything.
5. Resume at §3 step 1.
