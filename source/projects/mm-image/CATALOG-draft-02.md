# MM Image Design System — Catalog Draft v2 (teardown of SERP + IRP)

> Source: file `fRSRroY4YFgJSeqLLE0Y38` "MM UX Governance" — one real SERP page (`Page` block) + one real IRP page (`Grid` block), Eko-assembled.
> Structure below = Eko's real decomposition (2026-06-26), NOT Echo's first flat guess. Echo's earlier error: treated `Content` as the organism. Corrected: `Content` is a CELL; the organism is the whole Image Answer (Content + RS + Header + Footer).
> **Provenance/bin note:** Figma MCP tools CANNOT read an instance's library source (the page is one instance; children are non-persistent shadow nodes — get_metadata/get_design_context reject them). So the ACF-direct-use vs MM-built **bin is Eko's call**, not tool-derivable. The ONE evidence-backed signal found: `metadata` badge → Code Connect `@fluentui/react-components` Badge. Everything else: bin = ⬜ TBD-Eko.

---

## The two surfaces have different organism scope (Eko-confirmed)

- **SERP** — our **Image Answer** is ONE organism living inside the SERP page, alongside non-image answers (video answer, PAA, algo) and wrapped by the **ACF page shell** (header / search box / scope tabs). That shell is **ACF's organism, NOT ours** — we don't tear it down or take it into the MM library; we just sit inside it.
- **IRP** — the **whole page is one organism** (it's the image results page; the entire page is ours).

## Three nesting rules (Eko-defined — MM diverges from strict atomic design)
1. **Molecule overlap** — a molecule may contain other molecules. Image Tile is a molecule; the Badge / Image Title inside it are also molecules. Not mutually exclusive.
2. **Cell nests cell** — a cell may contain another cell. IRP's Content cell contains a Filter cell + the Image Tile molecules.
3. **Shared once** — a piece used on both surfaces (Image Tile) is stored a single time (validates structure A).

## The complete model (both surfaces)
```
SERP ── ◆ Image Answer (organism) = Content + RS + Header + Footer  [4 cells]
          └ ▸ Content (cell) ── ● Image Tile ── [● Badge=ACF-direct · ● Image Title=MM-built]
          └ ▸ RS, each row (cell) ── ● RS Pill
          └ ▸ Header (cell) · ▸ Footer (cell)

IRP ── ◆ whole page (organism) = Content + RS  [2 cells, NO Header]
          └ ▸ Content (cell) ── [▸ Filter (nested cell) · ● Image Tile (molecule) ×N]
          └ ▸ RS (cell) ── ● RS Pill
```

## Image Tile internal teardown (VERIFIED from code, node 999:37974)
| molecule | bin | evidence |
|---|---|---|
| **Image Tile** (outer, = "Image Container") | **MM-built** | in-file wrapper fn, Eko-confirmed |
| ↳ **individual image unit** | MM-built | image body + placeholder bg, in-file |
| ↳ **Badge** (inner, with Clock icon) | **ACF-direct-use** ✅ | Figma component doc: node `899:31263`, "132 variants, 5 semantic colors, overlay mode for images"; icon = Fluent Clock `899:31210`. A REAL ACF component. |
| ↳ **Image Title / Meta data** | **MM-built** | body3 text token, in-file |

⚠️ **Badge name-trap resolved:** the ACF Badge `899:31263` (nested in Image Tile) ≠ the IRP standalone `Badge` (in-file bespoke count badge, hardcoded #c80000). Same name, different source. Eko's "Badge = ACF-direct-use" referred to the Fluent one inside the tile.

---

## SERP — Image Answer organism

```
[ACF page shell: header / search box / scope tabs / Avatar / Rewards / Bing brand]   ← ACF's organism, NOT ours — excluded
│
└── ◆ ORGANISM: Image Answer
     ├── ▸ CELL: Content   (node 0:166, 1072×424 — the image grid block)
     │      └── ● MOLECULE: Image Tile  (the SERP+IRP-shared MM image molecule)
     │             └── ● MOLECULE: Badge,  ● MOLECULE: Image Title   ← overlap: molecules nest molecules
     ├── ▸ CELL: RS (Related Searches) — each ROW is a cell
     │      └── ● MOLECULE: RS Pill   (×15 instances seen on SERP as "Related search pill")
     ├── ▸ CELL: Header   (also counts as a component OF the organism — dual role)
     └── ▸ CELL: Footer
```

**Key rule — molecule overlap:** a molecule may contain other molecules. Image Tile is a molecule; the Badge / Image Title inside it are also molecules. Levels are NOT mutually exclusive at the molecule tier. (This is where MM diverges from strict atomic design — Eko's definition.)

### Raw SERP inventory mapped onto this (from teardown), bin = ⬜ TBD-Eko
| Observed instance | →our structure | level | bin | evidence |
|---|---|---|---|---|
| `Content` (0:166) | Image Answer ▸ Content | **cell** | mm-built | Eko-confirmed |
| `Image Container` ×31 (shared w/ IRP) | inside Content | **molecule** | mm-built | Eko-confirmed earlier |
| `metadata` ×22 | inside tiles/cards | **molecule** | **acf-direct-use** | ✅ Code Connect → Fluent Badge (only verified bin) |
| `Related search pill` ×15 | RS ▸ RS Pill | **molecule** | ⬜ | name-match only |
| `Section / title` ×4, `card header` ×9, `Section / footer` ×5 | Header / Footer cells + card chrome | **molecule/cell** | ⬜ | — |
| `video answer`, `PAA answer`, `basic algo` ×8, `Accordion` ×5, `Expansion card` ×3 | **NOT ours** — sibling non-image answers in the SERP page | — | ACF/other | excluded from MM Image scope |
| `Page`, `Header Tab` ×9, `Avatar`, `Rewards meter`, `Input`, `Vertical Scope`, `Bing brand` | **ACF page shell** | — | ACF organism | excluded — not our organism |

---

## IRP — whole page = one organism

```
◆ ORGANISM: IRP page (entire page)
 └── ▸ CELLs (rows / sections) ── ● MOLECULEs (same overlap rule)
```

### Raw IRP inventory (Grid block), bin = ⬜ TBD-Eko
| Observed instance | level (likely) | bin | note |
|---|---|---|---|
| `Image Container` ×31 | **molecule** | mm-built | shared with SERP — store ONCE |
| `RS/Thumbnail` ×11 | **molecule** | ⬜ | in-file bespoke; image-result molecule |
| `Query Suggestion` ×10 | **molecule** | ⬜ | bespoke pill |
| `Video Feed` ×6 | molecule/atom | ⬜ | renders as single vector glyph — confirm |
| `horizontal tile 2 (popout)` ×6 | **cell?** | ⬜ | a tile-row structure — likely cell |
| `Subcategory Pill` + Inspiration/Create/Collection | **molecule** | ⬜ | bespoke pill family, hardcoded hex |
| `Badge` ×1 (IRP) | **molecule** | mm-built | ⚠️ NAME-TRAP: bespoke count badge, NOT ACF Fluent Badge |
| `Vertical Scope` ×4, `Bing brand`, `ID/Persona`, `Rewards meter`, `Input` | — | ACF shell | likely the IRP page chrome — confirm if ours or shell |

---

## What Eko still needs to decide (the bins + 2 boundaries)
1. **Bins** — for every ⬜ row, ACF-direct-use vs MM-built. Tools can't read it; only Eko knows.
2. **`Cards / answer card` / `Cards / video card`** — molecule or cell? (compound internally, but it's the ACF "card" unit; Eko's cell def = "more than ACF cards").
3. **IRP shell split** — which IRP-Grid items are the page chrome (Vertical Scope, Bing brand, persona) vs genuinely part of our IRP organism, since the whole IRP page is ours.
