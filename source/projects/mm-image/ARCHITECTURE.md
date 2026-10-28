# MM UX Governance — Architecture (the spine)

> Owner of this architecture: Echo. Eko executes in Figma under Echo's direction.
> Collaboration model (settled 2026-06-26): **Echo holds the architecture and directs; Eko supplies/​builds the Figma material Echo asks for.** No longer guess-and-correct — Echo drives.
> Scope this round: **Image only · SERP + IRP · Figma-first** (the MCP comes after the Figma library is mature).
> Status: v0.1 — skeleton firm, two gaps marked ⛔ BLOCKING that only Eko can fill.

---

## The hierarchy (settled with Eko)

| Level | = | Owner / bins | Image examples |
|---|---|---|---|
| **Atom 原子** | token only | **ACF owns.** We only *reference*, never rebuild. | color / type / spacing / radius / elevation tokens |
| **Molecule 分子** | a component | **TWO bins** ↓ | Badge · Image Tile · Image Container |
| &nbsp;&nbsp;↳ *bin 1* | ACF-direct-use | pull the ACF library component as-is | **Badge** (Eko-confirmed) |
| &nbsp;&nbsp;↳ *bin 2* | MM-built | we build it; it *consumes* ACF tokens but the component is MM's asset | **Image Tile, Image Container** (Eko-confirmed) |
| **Cell 细胞** | structure from many molecules | "more than ACF cards" — mostly MM-built | waterfall · category selector · grid / carousel |
| **Organism 器官** | page experience from cells | "more than ACF Answer" — MM-built | Image answer (SERP) · IRP page |

Key correction I now hold (was my repeated error): **token-use never decides a molecule's bin.** Every MM-built molecule consumes ACF tokens by the atom rule — so token bindings carry zero provenance signal. A molecule's bin is decided ONLY by its main-component library, or by Eko stating it. Never by name or token.

File organization = **structure A** (settled in proto-01): top-level Figma pages = abstraction LEVELS (Molecules / Cells / Organisms). SERP & IRP are variants *within* a level, so a shared piece is stored once. A component's variants sit flat on its own page as examples (the Button-page model).

---

## Eko's three questions — the frame I must hold clearly

### 1 — What we NEED (target state = "a mature library like ACF, in Figma")

A standalone MM library Figma file containing, for the Image SERP+IRP surface:

- **D1.** The file itself — separate from the scattered sources *and* separate from ACF.
- **D2.** Pages organized by **level** (Molecules / Cells / Organisms). An Atom page that *points to* ACF tokens, not a rebuilt one.
- **D3.** Each level populated with the real Image SERP+IRP inventory, every piece sorted into its **bin**.
- **D4.** Each component dressed to the **"component-page model"** (see below) — this is what makes it *mature* vs a pile of frames.
- **D5.** ACF-direct-use molecules = instances pinned to their ACF source node (so they track ACF's live state — which we proved is real: ACF is edited live).
- **D6.** (forward-looking, cheap to leave room for now) each component carries clean variant props + a Fluent UI v9 mapping line, so the later MCP can harvest it instead of re-dressing everything.

**The component-page model** (the per-entry template, borrowed from ACF + 2 MM columns):
`purpose → variants flat as examples → when-to-use ✅/❌ → anatomy → states → properties` **＋ MM:** `bin tag (ACF-direct-use / MM-built)` ＋ `ACF source node (if reused) / build status (if MM)` ＋ `(MCP) Fluent v9 mapping`.

### 2 — What we HAVE (⛔ largely UNKNOWN — this is my biggest blind spot)

Honest inventory of what I can actually point at today:

- **ACF reference archive** — full, current (the `acf/` files). This is a *template + input*, NOT MM content. (My earlier error was mining it as the source of MM's contents.) Its role: the shape to copy + the bin-1 molecules (Badge etc.) we pull from.
- **Existing MM Image sediment** — exists, scattered. I have inventoried exactly **one node**: the `Image tile` in the IRP file `XaiqC45jeMtrd2umFH2fA9`, which demonstrably holds MM-built molecules with real variants (Waterfall / Dense / Badge / Video). **I do not know the rest** — not the SERP side, not how much of IRP, not which files.
- **The new MM library file** — not created yet.
- **Spec scaffolding** — this doc + RUBRIC.md. Just us.

⛔ **I cannot compute "what we have" from one node.** Need Eko to map the territory (Q1 below).

### 3 — What we still need to MAKE (= NEED − HAVE)

Structurally certain even before the inventory:
- **M1.** Create the library file + the level pages (D1, D2).
- **M2.** **Inventory** the existing sediment; sort each piece → level + bin. *(blocked on HAVE)*
- **M3.** ACF-direct-use molecules: pull + pin to ACF node (D5).
- **M4.** MM-built molecules that already exist: migrate into the library, dress to the component-page model (D4).
- **M5.** Molecules / cells / organisms that don't exist yet: build. (Cells & organisms are mostly here — ACF's blank zone, the real reason MM needs its own library.)
- **M6.** The governance metadata layer (bin tags / coherence) — *scope TBD, Q2 below.*

---

## ⛔ Gaps only Eko can fill (block me from "directing")

- **Q1 — Map the territory (unblocks HAVE).** Where does existing Image work actually live in Figma — SERP and IRP? Is the IRP file `XaiqC45…` (where Image Tile lives) one of the sources I inventory? You said "另一个 Figma file 还没开始" — is that a *new* consolidation file you'll start, distinct from existing per-surface files? I need the list of files that hold real Image material so M2 can run.
- **Q2 — Governance scope in this Figma round.** The PDF's governance half (Green/Yellow/Red coherence, review occasions, roles). Figma-first: do you want the **coherence tag to live ON each component** in the file (file carries governance), with the review *process* staying a separate doc? Or is governance entirely out of this round and Figma is purely the component library?

Once Q1 + Q2 land, I finalize this doc to v1 and start issuing Figma build instructions.

---

## RESOLVED (2026-06-26 working session)

- **Q1 answered.** Eko assembled a reference file **`fRSRroY4YFgJSeqLLE0Y38` "MM UX Governance"** placing ONE real SERP page + ONE real IRP page side by side, mixed components (some ACF-direct, some old MM-built — *"并不是说这个以后也用"*, i.e. current usage ≠ final bin). Collaboration model: Eko drops real pages, **Echo tears them down from pixels** (not Eko pre-listing components — that would pre-empt Echo's classification judgment). The big consolidation file is still TBD; this reference file is the teardown input.
- **⚠️ ORIENTATION (Eko-steered, counterintuitive — DO NOT re-flip):** in this file the **`Grid` block = IRP**, the **`Page` block = SERP**. Echo's shape-based guess (Grid=SERP) was WRONG; Eko corrected.
- **Image-answer ORGANISM (SERP) = the section instance named `Content`** (node `0:166`, 1072×424). It is MM-built, wrapped in ACF's Section/Zone/answer-card scaffold — the whole MM-on-ACF pattern in microcosm. The name "Content" is neutral; the role is the SERP image-answer organism.
- **`Image Container` = the SERP+IRP-shared MM-built image molecule** (Eko-confirmed). Stored once (validates structure A).
- **Q2 deferred by Eko:** review/governance handled AFTER the library is built. This round = pure component library in Figma, no coherence tags in-file.
- **Teardown plan:**先 1 后 2 — Round 1 = top-level components sorted to level + observed-provenance (workflow `wf_9c8f4714-2d4`), Eko tears the framework; Round 2 = open each MM-built component's main component to mine anatomy.
