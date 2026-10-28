# WEB-CONTENT — draft 01

> Draft copy for the MMACF online component library. Echo drafted; **Eko edits**.
> Source of truth = Figma `fRSRroY4YFgJSeqLLE0Y38`, page `139:7061` "Components" (verified 2026-07-29).
> Rule held: **bin is Eko's call.** Every bin below is ⬜ TBD except Badge, which has Code Connect evidence.
> ⚠️ Only two doc frames exist in-file (Image Tile `139:7434`, Content `105:2`). All other Overview / when-to-use text below is **newly drafted by Echo and unverified** — treat as a starting point, not a record.

---

## Site inventory — what actually exists

Ten component sets carry real variant axes. These drive the web variant panel directly; no hand-authoring needed for the controls.

| Component | Node | Variant axes | Count |
|---|---|---|---|
| Image Container | `150:5408` | Layout · Orientation · Multi-image · Border radius | 36 |
| Badge | `150:5533` | Property 1 | 7 |
| Meta data | `150:5378` | Lines | 3 |
| source | `150:5399` | State | 2 |
| Image action cluster | `360:16129` | Type · Surface | 6 |
| Image overflow flyout | `385:4577` | Type · Surface | 6 |
| RS Inline | `538:5310` | Label | 2 |
| RS Card | `540:20844` | State · Length | 9 |
| Status / Bin | `545:10464` | Bin | 6 |
| MM / Filter Bar | `621:16444` | Approach | 3 |

Plus non-variant pieces in the same section: `MM / Filter · selected pill` (`621:14748`), `MM / Filter menu · swatch grid` (`621:14757`), `MM / Filter menu · list` (`621:14806`, Property 1 = Type / License), `Image Cluster` (`538:5325`).

---

## MOLECULES

### Image Container
`150:5408` · bin ⬜ TBD-Eko

**Overview** *(drafted — Eko to confirm)*
The atomic image unit for results surfaces. Wraps the image, its overlay badge, and the metadata block into one sized container. Everything above this tier composes from it.

**Properties** *(read from Figma, verified)*

| Prop | Values | Default |
|---|---|---|
| `layout` | `Waterfall` · `Dense` | Waterfall |
| `orientation` | `Landscape` · `Portrait` | Landscape |
| `multiImage` | `1` · `3` · `4` | 1 |
| `borderRadius` | `24` · `16` · `8` | 24 |
| `showHover` | boolean | false |

**Sizing** *(from ROADMAP + Eko decision 2026-07-29)*
- min width `182` on all 36 variants
- Dense: min height `200`, max height `252`
- when the image is narrower than the floor, fill background grey (ACF token)

**When to use** ✅ *(drafted)*
- any image result inside Content, on SERP or IRP
- as the unit of a waterfall column or a dense row

**When not to use** ❌ *(drafted)*
- for a related-search suggestion → use RS Card
- for a full assembled grid → use the Content cell

---

### Badge
`150:5533` · bin **ACF-direct** ✅ *(only evidence-backed bin in the file — Code Connect → Fluent `899:31263`)*

**Overview** *(drafted)*
The overlay chip on an image tile. Signals a content attribute at a glance — duration, format, size, or count.

| Prop | Values |
|---|---|
| `type` | `Time` · `Recipe` · `Size` · `Play` · `Multi image` · `GIF` · `truncated` |

⚠️ **Name trap** (from CATALOG-draft-02): the ACF Badge inside Image Tile is NOT the IRP standalone bespoke count badge. Different component, different bin.

---

### Meta data
`150:5378` · bin ⬜ TBD-Eko

**Overview** *(drafted)* — the title + source block beneath an image.

| Prop | Values |
|---|---|
| `lines` | `1 line title + source` · `2 lines title` · `2 lines title + source` |

Contains `source` (`150:5399`, `state` = `Default` · `Hover`).

---

### Image Tile
`139:7434` — **has a real doc frame; text below is quoted from Figma, not drafted** ✅

> The atomic image unit for results surfaces. An MM-built wrapper that consumes ACF tokens — it carries an ACF Badge (overlay) and an MM-built title. Shared by SERP and IRP, stored once.

Anatomy & bins (in-file, verified):

| Part | Bin | Source |
|---|---|---|
| Image Tile (wrapper) | MM-built | in-file, consumes ACF tokens |
| Badge (overlay) | ACF-direct | Fluent · overlay=true |
| Image Title | MM-built | body3 text token |
| Variants | — | Multi-image · radius · orientation · metadata |

Trimmed variant set shown in-file: Basic-Dense · Basic-Waterfall · No title · Two lines title · One line title · With badge. Properties section shows Minimum size (Waterfall / Dense) + With Grey bg.

---

### RS Inline
`538:5310` · bin ⬜ TBD-Eko

| Prop | Values |
|---|---|
| `label` | `People also` · `Top suggestion` |

### RS Card
`540:20844` · bin ⬜ TBD-Eko

| Prop | Values |
|---|---|
| `state` | `Default` · `Hover` · `Press` |
| `length` | `Two-line` · `List` · `Short` |

**Overview** *(drafted)* — a related-search suggestion rendered as a card. Built on the real `Query Suggestion` component (per ROADMAP slice-2 correction).

---

### Image action cluster
`360:16129` · bin ⬜ TBD-Eko

| Prop | Values |
|---|---|
| `type` | `Web` · `AIGC` · `Homepage` |
| `surface` | `SERP` · `IRP` |

Rule (from ROADMAP, verified in file structure): **SERP drops Save for Web/AIGC; IRP keeps Save.**

### Image overflow flyout
`385:4577` · same `type` × `surface` axes, 6 variants.

---

## CELLS

### Content
`105:2` — **has a real doc frame; text below quoted from Figma** ✅

> The SERP image-answer body — the image grid a query returns. Assembled from Image Tile molecules (with Badge + Image Title) plus popout tile rows. MM-built; consumes ACF tokens but the structure is MM's.

| Property | Value | Notes |
|---|---|---|
| Grid label | 11 × 4 | label only; not a literal count |
| Frame size | 1200 × 424 | true content constraint — do not scale to fit |
| Column width · gap | 186.67 · 16 | 6 image columns, 16px gutters |
| Layouts | Waterfall · Dense | masonry (variable height) · row-based (fixed height) |

**Eko decision 2026-07-29:** `11 × 4` / `6 × 2` are size labels, not literal counts. Site copy should document the real constraint: **1200 × 424 px**.

Anatomy (verified in-file):

| Part | Bin | Source |
|---|---|---|
| Image Tile ×25 | MM-built | in-file wrapper · shared SERP+IRP |
| ↳ Badge | ACF-direct | Fluent · node 899:31263 (Code Connect) |
| ↳ Image Title | MM-built | body3 token · in-file |
| Popout tile row ×6 | MM-built | horizontal tile 2 (popout) · in-file |

### Filter
Section `621:14721` · bin ⬜ TBD-Eko · **no doc frame** (`113:2` returns not-found)

| Piece | Node | Props |
|---|---|---|
| Filter Bar | `621:16444` | shipped approach = `ACF Tokenization` |
| selected pill | `621:14748` | — |
| menu · swatch grid | `621:14757` | — |
| menu · list | `621:14806` | `Property 1` = `Type` · `License` |

**Eko decision 2026-07-29:** `ACF Tokenization` is canonical. `ACF Alignment` and `ACF Alignment vNext` are present in Figma but not shipped in v1.

### Header · Footer · RS cell
**Cut from v1 per Eko decision 2026-07-29.** `115:80004`, `115:99969`, and `230:517` return not-found; content for these pages cannot be drafted from the current file source.

---

## ORGANISMS

`12:18` SERP · Image Answer — live frame `659:45646` + spec card `664:4322`
`12:19` IRP · Whole Page — live frame `659:46853` + spec card `661:684`

Both exist and are non-empty. ROADMAP now treats them as contentful but still gated.

⚠️ These two canvases did not appear in the top-level page list (`0:1` and `139:7061` only), yet returned content when addressed by ID. Unexplained. Flagging, not concluding.

---

## Open questions

1. **Which three are "the three molecules"?** File suggests Image Tile / Badge / RS. Confirm.
2. **Bins for everything marked ⬜.** Tools can't derive these — only Eko / Code Connect evidence can.
3. **Do the un-documented components get doc pages?** The variant panel works without them; the prose doesn't.
4. **Organisms:** SERP and IRP nodes return content, but S4 still needs Eko's go before build.
