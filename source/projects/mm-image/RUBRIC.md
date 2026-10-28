# RUBRIC — MM Design System
> Taste rules distilled from Eko's reactions. Each line was a settled "yes, this / no, not that" that generalized.
> Project: build a Multimedia (Image-first) Design System in Figma, leveraging ACF's organization pattern,
> layered Molecule → Cell → Organism (Atom = ACF token, out of scope). Later: maintain + expose via MCP for vibe coding.

- [revealed] The Figma file is organized by ABSTRACTION LEVEL, not by canvas/surface. Top-level pages = Molecules / Cells / Organisms. SERP / IRP / Media Canvas are variants WITHIN a level, never their own top-level pages. — from: picked structure A over B on the A/B contrast (proto-01, 2026-06-25)
- [revealed] Structure A is realized via the **divider-page pattern** (= how ACF's 120 pages work, verified): bold-caps TITLE pages (`𝗠𝗢𝗟𝗘𝗖𝗨𝗟𝗘𝗦`/`𝗖𝗘𝗟𝗟𝗦`/`𝗢𝗥𝗚𝗔𝗡𝗜𝗦𝗠𝗦`) that hold NOTHING themselves, then EACH component on its OWN page, indented (`     ↳ Image Tile`). The page list is flat in Figma config; the naming/indent creates a VISUAL hierarchy, not a structural one. NOT three container pages with components nested inside them. — from: "單拉一頁叫 Molecules，呢頁本身唔放嘢，但喺 config 上顯示個名…形成視覺關係" (2026-06-26, corrected Echo's flat-page misread)
- [known] A component's variants live as flat EXAMPLES on that component's own page (e.g. every Button state — rest/hover/pressed/pill — laid out on the Button page itself), never split into separate pages. Mirrors ACF's property-matrix presentation. — from: "如果它有 variants 我们就会在那个 button 的页面以 example 的方式去放出来" (proto-01, 2026-06-25)
- [known] Everything composes strictly UPWARD and one level at a time: molecules assemble into cells, cells assemble into organisms. A higher level is built only from the level directly below it. — from: doc taxonomy + "molecules 拼成 cells, cells 拼成 organisms" reaffirmed (proto-01, 2026-06-25)
- [known] The MM Design System is its OWN standalone Figma library file, separate from the scattered Image SERP/IRP source file the assets are mined from. — from: confirmed guess "新建独立库文件" (proto-01, 2026-06-25)
- [revealed] Levels are NOT mutually exclusive — molecules overlap (Image Tile is a molecule; the Badge / Image Title inside it are ALSO molecules) and cells nest cells (IRP's Content cell contains a Filter cell + Image Tile molecules). MM diverges from strict atomic design here. — from: "不同分子之间会有 overlap" + "Content 里有 Filter 作为 cell" (2026-06-26)
- [known] A shared piece is stored ONCE. Image Tile is used on both SERP and IRP → one definition, not duplicated per surface. (Direct consequence of structure A.) — from: "IRP 文件里那个 Image Tile 就已经是 SERP 和 IRP 通用的了" (2026-06-26)
- [revealed] Organism scope differs per surface. SERP: our Image Answer is ONE organism (Content + RS + Header + Footer) sitting inside the ACF page shell — the shell is ACF's organism, NOT ours, we don't take it into the library. IRP: the WHOLE page is one organism (Content + RS, no Header). — from: Eko's decomposition (2026-06-26)
- [known] Each component page follows the "component-page model" borrowed from the prior Bing Image Design Framework + ACF: a `.Page Header` + a **Copy-me source component** + a variants/properties Table + Section/Sub-section blocks (when-to-use). Visual style = restrained: light strokes, generous whitespace, variants laid out flat. Borrow the PRESENTATION, not that file's top-level org (it groups by content-family; we group by level = structure A). — from: Eko shared the prior framework as a presentation reference (2026-06-26)
- [known] Image Tile goes into the library in a TRIMMED variant set, not the full scattered set. — from: "image tile 精简即可" (2026-06-26)
- [known] Each component page MUST include a USAGE section: a real SERP/IRP screenshot with the component's actual position highlighted + a one-line "used here on SERP / used here on IRP". Modeled on the prior framework's "RS Usage" page (node 3089-28825) and ACF's Filter-item Showcase. — from: "將 example 放出嚟，説明 image tile 喺邊度、SERP 喺邊度用、IRP 喺邊度用" (2026-06-26)
- [known] The full ACF component-page standard (ACF Filter item, node 131289-420060) is the gold reference: Title → Showcase → When to use ✅ / When NOT ❌ → Best practices (Do/Don't two-column) → Anatomy (numbered) → Assembly → Light/Dark → Properties table → Showcase-by-axis → Accessibility → Related Components. Borrow progressively — not every block is needed each round; Usage + Variants + soft Anatomy first. — from: Eko shared ACF Filter item as the standard (2026-06-26)

## Component-page template — corrected FORM (from Eko's own edits to the Image Tile card, 2026-06-26, nodes 19:31 + 47:12075)
Eko reworked Echo's first card by editing, not telling. The corrected template order + form:
1. **Copy me comes FIRST** (right after Overview) — a single centered large preview, the copy source. It's the core, so it leads. NOT buried mid-card.
2. **Variants are grouped BY REAL PROPERTY AXIS, not arbitrary labels.** Image Tile's real groups: `Basic - Dense` / `Basic - Waterfall` (layout mode), then title-count axis (`No title` / `One line title` / `Two lines title`), then `With badge`. Use the component's actual variant names, never labels copied from a source visual board (Echo's "Basic/Hover/Dense" was wrong — Hover/Dense weren't even this component's axes).
3. **Usage = "grey-placeholder page + ONE highlighted tile."** Not a full page thumbnail stuffed with real instances (Echo's mistake). Draw a clean surface mock where most tiles are grey placeholders and only the ONE Image Tile renders real/highlighted, so the eye instantly finds where the component lives. Multiple usage scenes (in-grid, see-more, related-searches) each as their own mock.
4. **Softened Anatomy & Bins table stays at the BOTTOM** (Part / Bin / Source; MM-built + ACF-direct color-coded but light). Echo's weakened version was kept — good.
- Echo lesson: the "blank Copy-me tile" was a screenshot-API isolation artifact, NOT a real bug — in the actual Figma file every tile renders fine. Don't chase screenshot-API blanks as real defects.

## Component-page LAYOUT = TWO cards, not one (Eko architecture, 2026-06-26)
- **Main card** = the component itself: `.Page Header → Overview → Copy me → Variants → Anatomy & Bins`. Usage is NOT in the main card.
- **Separate adjacent Usage card** = the SERP/IRP surface examples ("grey-placeholder page + one highlighted tile"). Reason: SERP/IRP page mocks are physically large; embedding them bloats the main card and buries the component. So Usage lives as its OWN card beside the main one.
- **This is the standard config for EVERY future component page**, not just Image Tile. Main card + adjacent Usage card, every time.
- **Properties/corner-cases are real spec, never "duplicate content" to clean.** Eko annotates min/max sizes (e.g. Image Tile min width 135px, min/max 190/208 width · 232/252 height) as floating property notes + in the Anatomy table. More states will be added there. NEVER delete or "dedupe" these — they are the component's real constraints.
- Echo lesson (2026-06-26): almost deleted the separate Usage card + property annotations as "unfinished/duplicate." They were INTENTIONAL. When something looks redundant on a card Eko built, assume intent first — ask or check before "cleaning." Copy-paste scaffolding artifacts (a mislabeled section, a stray nested Copy-me) ARE cleanable; architectural choices and spec annotations are NOT.

## How bins get decided (process rule, not taste)
- A molecule's bin (ACF-direct-use vs MM-built) is **Eko's call**, never tool-derived. Figma MCP cannot read an instance's library source (page is one instance; children are non-persistent shadow nodes). The only evidence-backed signal is Code Connect (e.g. Image Tile's inner Badge → Fluent `899:31263` = ACF-direct-use, verified). Everything else: Echo presents structure, Eko assigns the bin. Never infer bin from instance name or token usage (both are zero-signal — name-trap confirmed, every MM molecule uses ACF tokens).

## Bin COLOR system — CANONICAL (locked 2026-07-06, from Eko's real Image Tile card 19:31)
- **MM-built = brown/orange** `rgb 0.55, 0.40, 0.15` · chip bg `0.96, 0.93, 0.87`
- **ACF-direct = green** `rgb 0, 0.50, 0.20`
- **TBD (bin not yet assigned) = neutral grey** `0.40, 0.40, 0.40` · chip bg `0.94`
- Applies EVERYWHERE the bin appears: header chip, COMPOSED-OF labels, Anatomy/Composition table Bin column.
- ⚠️ Echo error caught 2026-07-06: built the first 5 cell cards with MM=green / ACF=blue — **semantically inverted** (green is ACF, not MM). Fixed all 3 cards that had MM/ACF text (Content/RS/Filter); Header/Footer were neutral grey so untouched. Verify colors against THIS block, not memory — the green/blue instinct is wrong.
- ⚠️ Eko's own real card has an internal inconsistency (Anatomy table = brown MM-built, but header chip = green MM-built — stale paste). Echo's cards use the UNIFIED semantic (both brown). Eko's card chip may want a matching brown sweep later — his call.

## Boundaries (scope, not taste — recorded here for the loop to respect)
- This round covers IMAGE only. Video / AIGC / Media Canvas come later, once the Image structure proves out.
- This round is the Figma component library ONLY. Governance/review process (Green/Yellow/Red coherence, review occasions, roles from the PDF) is DEFERRED — handled after the library is built. No coherence tags in-file this round. — from: "review 的事我们等做完了再说" (2026-06-26)
- Atom level (token) is owned by ACF — not built here, only referenced.
- The ACF page shell (header / search box / scope tabs / Avatar / Rewards / Bing brand) is ACF's organism — excluded from the MM library. We sit inside it, don't rebuild it.

## Open dependency (gates the next stage — NOT a taste rule)
- ✅ CLEARED 2026-06-25. The ACF re-check landed as a FULL 120-page live extraction (file lastModified 2026-06-25T08:56Z), with component-level detail in `knowledge/work/acf/` (10 files, 3719 lines, node IDs). Supersedes the 2026-04-06 snapshot. The reuse-vs-build line can now be drawn against ACF's real 157 build-ready components (`acf/08`). Image organism anchor = ACF `images answer` (`132348:131609`). Live-state risk is REAL (Image card doc-says-2 vs live-has-3) → MM catalog must pin node IDs and track live.
