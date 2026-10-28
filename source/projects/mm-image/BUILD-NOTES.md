# BUILD-NOTES — MM Design System (Figma technical gotchas)

> Operational "how to build in file `fRSRroY4YFgJSeqLLE0Y38`" notes. Distinct from RUBRIC (taste) and ARCHITECTURE (structure).
> These cost real failed tool calls to learn — read before a build session.

## Shadow-node clone trap (cost 3 failed fills, 2026-07-02)
- **Symptom:** `figma.getNodeByIdAsync("I1:51927;…;1:38367")` → returns `null`; `node.clone()` → "cannot read property 'clone' of null".
- **Cause:** deep IDs with `;` segments are **non-persistent shadow nodes** inside instances. They are NOT addressable by ID across calls — the ID is only valid within the single `findAll` traversal that produced it.
- **Fix (the working flow):**
  1. `setCurrentPageAsync(Playground)` (the page that actually holds the real instances).
  2. Get a **live ref** via `findAll(...)` in THIS call — do not carry an ID from a prior call.
  3. `ref.clone()` **on that page** → the clone is a real persistent node.
  4. Reach the destination card by its **top-level persistent id** (e.g. `91:2`), then `appendChild` the clone (re-parenting across pages works).
- **Rule:** clone from a live `findAll` ref, never from a stored deep ID. Only top-level instance IDs (`1:51450`, no `;`) survive across calls.

## Transport drops on heavy single-transaction calls (cost 3 drops, 2026-07-02)
- **Symptom:** `use_figma` returns "MCP server figma transport dropped mid-call; response lost" — reproducibly — when one call does a big clone (e.g. the 482-instance `Content` block) AND/OR an inline `node.screenshot()` AND several other clones together.
- **Cause:** payload/time budget of a single `use_figma` transaction. Heavy DOM writes + screenshot serialization in one call exceed it.
- **Every drop rolled back cleanly** — nothing partially committed (verified 3×: destination page empty, no orphan clones on Playground). So it's safe to just verify-then-retry.
- **Fix — split into light calls, one heavy op each:**
  1. Call A: clone template + fill all TEXT slots (no instance clones). 
  2. Call B: clone the ONE big block into copy-me (isolated, nothing else).
  3. Call C: build empty labelled block SHELLS (no clones).
  4. Calls D…: one molecule clone per call into each shell's preview box.
  5. Call E: text table.
  6. **Screenshot is ALWAYS its own call** via `get_screenshot` (dedicated tool), never inline `node.screenshot()` in a write call.
- **After every drop: verify actual state before retrying** (destination children + Playground orphans). Never assume the write landed or didn't.

## Screenshot viewing pipeline (WebFetch can't decode PNG)
- `get_screenshot` returns a short-lived `figma.com/api/mcp/asset/…` URL, not an image.
- `WebFetch` on it FAILS (returns "raw PNG bytes, can't decode") BUT saves the bytes to a temp path it prints. OR cleaner: `curl -s -o /tmp/x.png "<url>"` then `Read /tmp/x.png` — Read renders images visually. Use the curl path.

## Arial font missing (this machine)
- Machine has **Arimo**, not **Arial**. Cloning any node with Arial text → "font family Arial does not exist" and the clone fails entirely.
- **Fix:** preload every font a node uses before cloning. Safe default preload set:
  `Inter [Semi Bold/Regular/Medium]`, `Roboto [Bold/Regular/Medium]`. Scan unknown nodes via `getStyledTextSegments(['fontName'])` and preload each.

## Layout gotchas
- `layoutSizingHorizontal="HUG"` only works on **auto-layout frames or text**. A plain `createFrame` can't HUG → append it to an auto-layout parent first, or set FIXED width.
- Plugin fonts: use style `"Semi Bold"` (with space), not `"SemiBold"`; `"Extra Bold"` not `"ExtraBold"`.

## Verify, don't describe (CLAIM-VERIFIER hook)
- The screenshot API can render an isolated clone as a black dot / blank even when the node is fine in-file. Do NOT report a screenshot blank as a real defect, and do NOT state counts/sizes/attributions from screenshot memory.
- Report only facts returned by a tool call THIS turn (return an `out` object with the numbers you're about to claim).

## Isolated COMPONENT-variant screenshots come back blank — verify via INSTANCES (cost ~4 blank shots, 2026-07-07)
- **Symptom:** `get_screenshot` (and inline `node.screenshot()`) on a single COMPONENT variant inside a set returns a **149-byte 1×1 placeholder** or fully blank raster, even though `get_metadata` shows correct dimensions and the tile renders fine on canvas.
- **Cause:** image FILLS don't resolve when a component variant is rendered in isolation (same family as the "blank Copy-me" artifact). The whole-SET screenshot works because instances inside it resolve.
- **Fix — the reliable visual check:** `createInstance()` of the variant(s) into a temp auto-layout frame (grey bg), set each instance `layoutSizing* = FIXED` to keep intrinsic size, then `get_screenshot` the TEMP FRAME. Instances resolve image fills. Remove the temp frame after. This doubles as proof the variant is instantiable.
- Pattern: to spot-check an axis, instantiate 1 sample per axis value (e.g. 2 orientations × 3 metadata = 6 instances in a horizontal strip) rather than shooting the giant set.

## Resize clamps against inherited min/max — clear the bound FIRST (cost 1 bug at variant #1, 2026-07-07)
- **Symptom:** cloned a variant that had `maxWidth=208`, called `resize(258, 232)` → came back **208 wide, not 258**. Silent clamp, no error.
- **Cause:** `resize()` respects the node's current `minWidth/maxWidth/minHeight/maxHeight`. Growing past an inherited max clamps to the max.
- **Fix:** set/clear the constraints you're changing BEFORE `resize()` — `node.maxWidth = null` then `node.resize(258, …)`. Order matters. (Growing to a value ABOVE the old min is fine; it's the max that bites when growing, the min when shrinking.)

## Absolute-positioned children with MIN constraint DON'T follow a width resize (cost 1 bug found by Eko, 2026-07-08)
- **Symptom:** in the Dense variants (cloned from Waterfall then widened 200→258), the top-right Collection button (`"Button "`, trailing space) sat ~58px left of the edge instead of flush-right.
- **Cause:** the button is `layoutPositioning:"ABSOLUTE"` with `constraints.horizontal:"MIN"` and a fixed `x=160`. In Waterfall (width 200) x=160 happened to be flush-right (200-28-12=160). When cloned + widened to 258, x stayed 160 → gap to the right edge grew. MIN = pin-left = x is fixed, does NOT track width.
- **The other button was fine:** `"Top Button"` uses `constraints.horizontal:"MAX"` (pin-right) so it auto-tracked to x=218 in the wide variant. Only the MIN-constrained one broke.
- **Fix:** set the button's `constraints = {...constraints, horizontal:"MAX"}` (pin-right, tracks width going forward) AND correct current x to `parent.width - button.width - 12` (flush-right 12px). Both, because changing the constraint doesn't re-lay an already-placed absolute node.
- **General lesson:** any time you clone a variant and CHANGE ITS WIDTH, audit every absolute-positioned child — MIN-constrained ones silently keep their old x and drift from the far edge. Verify by measuring `parent.width - (child.x + child.width)` per orientation, not by eye on one sample. A variant can hold MULTIPLE such buttons (multi-image variants repeat them per sub-image) — `findAll`, not `findOne`.

## Swapping demo instances → your refactored component (cost 0 bugs, 2026-07-08)
- **Goal:** replace the placeholder Image Containers inside the Content card's Copy-me demos with instances of our refactored set (150:5408), so the demo IS the real component.
- **Dense block (direct instances, swappable):** `inst.swapComponent(denseVariant)` in place, then set sizing. Match variant axes to each tile's real dims (all were Landscape/1/radius24 → one Dense variant). **Overflow trap:** the demo had one abnormally-narrow FILL tile (102px) in a fixed-tile row; our Dense variant carries `minW=190`, so on swap it snapped 102→190 and pushed the row's maxRight to 1296 > frame 1208 (right tile clipped). **Fix:** proportionally shrink the row's *fixed* siblings (260/254/247/281 → 236/230/224/255, ~0.91×) so the FILL tile lands ≥190 and row sums to exactly 1208. Always re-measure `max(child.x+child.width)` vs `frame.width` after a min-width-bearing swap into a justified row.
- **Waterfall block (shadow instances inside a Content INSTANCE):** the 25 tiles were shadow nodes (`I243:73;…`) — not directly swappable. **Must `detachInstance()` the wrapping Content instance first** → it becomes a real FRAME (new id) with editable children. Then swap each tile to the Waterfall variant, keep `layoutSizingHorizontal=FILL` (columns control width), force each tile's *original* height with `resize(w, origHeight)` to preserve the masonry rhythm. Our fixed-height-per-variant component still renders varied heights because the demo forces height per instance — image area grows/crops gracefully, no distortion.
- **Order for FILL tiles:** `swap → set min/max → layoutSizingVertical=FIXED → resize(width, height) → layoutSizingHorizontal=FILL`. Setting FILL last avoids the resize being overridden by the column's fill math mid-script.
- **Leave foreign molecules alone:** the masonry's last column was a popout row (`horizontal tile 2 (popout)`, main `Property 1=Default`) — NOT an Image Container. Audit by `mc.parent.id===<ourSetId>` and only swap matches; verify count after (`ours:25, notOurs_incl_popout:6`).

## RS Pill correction: use Query Suggestion, not Related search pill (2026-07-08)
- **Wrong earlier source:** `Related search pill` is the vertical search-box-style pill. It is NOT the RS Pill Eko meant.
- **Correct source:** `Query Suggestion` component set (1:1240), used as the horizontal requery pill with thumbnail + query title at the top of IRP.
- **Efficient rebuild flow:** clone the old card structure beside itself, `swapComponent()` each wrong instance to the `Query Suggestion` main component, then `resize()` to the new component's natural dimensions. Swap keeps the old bbox otherwise, producing stretched pills.
- **Whole-block replacement:** to replace a vertical RS block with the real horizontal requery band, clone the source `Hero section` row into the copy-me container, then remove the old block. The row can be wider than the container; horizontal overflow is correct for the requery band.
- **Text-edit safety:** never rewrite by `findAll(characters=="RS Pill")` when the same string appears in the page header and anatomy rows. Target exact node IDs for text mutations or the title will be overwritten.

## RS Pill max-width property semantics (2026-07-08)
- `Query Suggestion` carried a built-in `maxWidth: 180`; `resize(250, h)` silently stayed 180 until the constraint was changed.
- Correct "max width 250px" behavior is `maxWidth=250`, `minWidth=null`: short titles can stay short, long titles hug up to the cap and truncate.
- `minWidth=maxWidth=250` means forced fixed width, which is NOT the same spec.
- Long title setup: remap text font away from missing Arial first (`setRangeFontName(..., Arimo Bold)`), then set `characters`; title text must be horizontal FILL with `textTruncation="ENDING"`.
- In auto-layout, child order wins over absolute x/y. Use `insertChild(index, node)` to place a subtitle under a heading; coordinates are ignored by the vertical stack.

## Content copy-me sizing: snap to 11×4, not fit-to-card (2026-07-08)
- Content/layout demos use the 11-column grid size: **1208×424** for 11×4.
- Do not invent a smaller "fits the card" scale. Scaling auto-layout/hug clones can collapse them; rebuild at true grid size instead.
- The Content card's Copy-me now shows both layouts: Waterfall (Content component) and Dense (row-based Image Content rows), both 1208×424.

## Image Container min-value revision (2026-07-08)
- Canonical set: 150:5408.
- All 36 variants: `minWidth=182`.
- Dense variants: `minHeight=200`, `maxHeight=252`.
- Waterfall signature: `minW=182`, `maxW=208`.
- Content Copy-me demo instances may still carry frozen instance-level min overrides from earlier swaps; do not assume demo instances inherit future component constraint edits.

## Working nodes (file `fRSRroY4YFgJSeqLLE0Y38` "MM UX Governance")
- Page list is FLAT; divider pages `── MOLECULES ──` (12:6) etc. hold nothing. Each component = own page.
- Molecule pages: Image Tile 12:7 · RS Pill 12:8 · Badge 12:9. (No Image Title page — it's a sub-molecule inside Image Tile's anatomy.)
- Cell pages: Content 12:12 · RS 12:13 · Filter 12:14 · Header 12:15 · Footer 12:16.
- Organism pages: SERP·Image Answer 12:18 · IRP·Whole Page 12:19.
- Template page `⟢ _TEMPLATE` 82:2 → main template 82:3, usage template 82:32.
- Real source material lives on **Playground** (1:2): Image Container ×12 (pasted section 18:16645), Related search pill ×15 + RS/Thumbnail ×22 (inside SERP 1:51927 / IRP 1:51278 page instances), Meta data ×24 (= Image Title molecule, id family `…;42:9788`, 260×69).
- Finished / current cards: Image Tile main 19:31 / usage 47:12075 (Eko's, 604 instances — don't touch). Badge main 83:54 / usage 83:83. Correct RS Pill main 224:98 (new, Query Suggestion). Correct RS cell 230:517 (new, Query Suggestion row). Older wrong RS Pill 91:2 / usage 91:31 and wrong RS cell 110:54824 / 111:2 are preserved pending Eko's delete approval.

## Folding a "hover state" into a component via one boolean (2026-07-21)
- **Goal:** designers toggle default↔hover on ONE component, not maintain two sets. One SET-level boolean drives multiple layers' visibility.
- **Mechanism:** `set.addComponentProperty("Show hover","BOOLEAN",false)` → returns `Show hover#NNN:0`. On each layer to toggle, set `node.componentPropertyReferences = {...existing, visible: "Show hover#NNN:0"}`. Bind pop-up bg + action cluster + overlay meta + dimension label all to the same prop → one switch, many layers.
- **Cloning across variants:** clone the 3 hover layers from a validated pilot variant, `appendChild` into each target variant, then re-set `componentPropertyReferences.visible` to the prop (clone carries the pilot's ref but re-set to be safe). Position per variant's own width/height/radius (parse radius from variant name).

## Image stays dynamic AND hover extends down — the two-axis split (2026-07-21)
- **The conflict:** "hover extends card downward" wants root=HUG (grow). "image height adjustable per instance" wants image=FILL + root=FIXED (designer resizes root, image tracks). root can't be both HUG and FIXED.
- **Resolution — put the two on DIFFERENT axes:**
  - Image dynamic: `image.layoutSizingVertical=FILL`, `root.primaryAxisSizingMode=FIXED`. Designer resizes the INSTANCE ROOT height → FILL image tracks. (Tested: root 320→img 260, root 200→img 140. Resizing a FILL child directly does NOT work — you resize the root, not the child.)
  - Hover down-extension: the extra content (source row) is an **absolute-positioned overlay** (`layoutPositioning=ABSOLUTE`, `y=rootBottom`, `constraints vertical=MAX`) — hangs below root, does NOT occupy flow, so it never compresses the image.
- **Trade-off:** absolute overlay doesn't add to auto-layout container height → in a masonry/dense container the hover state may overlap the element below by the overlay's height (~21px). Acceptable for a transient hover state; it's standard overlay behavior. Flag it, don't silently ship it.
- **FIXED image locks the instance (the wrong path):** if you set image `layoutSizingVertical=FIXED` to make root HUG, the image can no longer be resized on instances (resize returns the old value silently). Verified. That's why FILL+root-FIXED is the correct combo.

## componentPropertyReferences only accepts visible / characters / mainComponent (re-confirmed 2026-07-21)
- You CANNOT bind a nested instance's own property (e.g. a nested Meta's `Title#..` or a nested cluster's `Type` variant) to a parent component property via `componentPropertyReferences`. Keys other than `visible`/`characters`/`mainComponent` throw `Unrecognized key(s)`.
- Consequence 1: a parent boolean can't flip a nested instance's VARIANT or its own boolean. Workaround for "hover always 2-line title": don't try to change the nested Meta's Lines — instead **mask** it with a second opaque Meta overlay (fixed to 2-line+source) whose `visible` binds to the parent boolean.
- Consequence 2: nested variant props (C cluster's Type/Surface) do NOT bubble to the IC top level even with `isExposedInstance=true`. `isExposedInstance` surfaces props at the instance's OWN level for editing, but does not cascade them into the containing component's `componentPropertyDefinitions`. Designer edits them by drilling into the nested instance. Accept this or add explicit IC-level props (which then hit the binding wall above).

## Sharing a TEXT property across two instances of the same component (2026-07-21)
- Add the TEXT prop to the SET (`metaSet.addComponentProperty("Title","TEXT",default)`), bind the title node's `characters` in EVERY variant (`textNode.componentPropertyReferences={characters: pid}`). Additive — existing instances gain the prop and keep default text, don't break.
- Two instances of that component surface the SAME property NAME (`Title#NNN:0`) but are DIFFERENT instances → you must `setProperties` on each. It is NOT one-input-auto-sync. (Inferred sync first, test disproved it. Verify sharing claims with a real 2-instance test before promising "type once".)
- Reading exposed prop keys: on the IC instance top level the nested prop may NOT appear at all (see cascade note above) — read `instance.componentProperties` keys empirically, don't assume the `#id` suffix.

## Reusable action cluster as its own type-bearing component (2026-07-21)
- To give a hover cluster type/surface knowledge without exploding the host component's variant count: build a SEPARATE `Image action cluster` COMPONENT_SET (Type × Surface), record per-variant action spec in `variant.description`, and place its instance inside the host. Host owns only on/off; cluster owns type differentiation.
- `combineAsVariants(components, page)` needs all candidates as COMPONENTs first (`createComponentFromNode` on each frame). Variant names `Type=X, Surface=Y` define the axes.
- Button icon is instance-swap: `iconStart` carries `iconStyle#115630:0` (INSTANCE_SWAP). Swap it to change the dominant icon per type. Placeholder until real icon component IDs are available.

## Dimension label on image (2026-07-21)
- Bottom-left on-image text: frame in image unit, `layoutPositioning=ABSOLUTE`, `constraints {horizontal:STRETCH, vertical:MAX}`, `y = imageUnitHeight - labelHeight`, pad[6,12,6,12]. MAX pins it to the bottom so it tracks image resize.
- Text: 13px Roboto (preload; falls back Arimo/Inter on this machine), white, bound to token `mai/smtc/foreground/ctrl/on-image/rest` (VariableID `.../d2e6addf1ed32573ad770042224f1373f5d48949/132105:65`).
- If it should appear only on hover, bind its `visible` to the hover boolean (not a separate switch). Deleting a now-unused boolean prop: verify `stillRef===0` across the set first, then `deleteComponentProperty`.

## Fluent dropdown flyout uses per-item visible toggles — read the RENDER, not the text list (2026-07-21)
- The Fluent `dropdown flyout` / `List View` component holds MANY `Menu item` instances in its body SLOT; which ones show is controlled by each item's `visible` flag (+ hidden hover-state template items with `L2` submenus). A configured flyout = the template with most items hidden.
- **Trap:** reading each Menu item's `text#25773:11` prop value returns ALL items including `visible:false` template filler (e.g. a "Lorem ipsum…" hover-state row, duplicate/hidden actions). This does NOT match what renders. My first read of a 2-item flyout returned 4-5 texts.
- **Correct method:** `get_screenshot` the flyout in place (non-isolated, so visible logic + real layout apply) to see the true menu. Cross-check by filtering `menuItem.visible === true`.
- **Editing (e.g. drop Save on SERP):** find the Menu item whose `text` is "Save" AND `visible===true`, `.remove()` it (works without detach). Verify afterward: 0 visible "Save" in SERP variants, 1 in IRP. There can be hidden Save duplicates — target the visible one.
- **Building a typed flyout set:** clone the user's already-configured source flyout (it carries the correct visible config) rather than rebuilding from the raw template; then remove/adjust the few items that differ per variant. `createComponentFromNode` each clone → `combineAsVariants`.

## "meta slot" — a mask that must reposition with a HUG/collapsing sibling (2026-07-21)
- **Problem shape:** an absolute overlay/mask must land in DIFFERENT positions depending on a sibling's visibility state. Here: hover meta overlay must COVER the default Meta when metadata is on (y=180), but hang BELOW the image when metadata is off (y=232, default Meta hidden → root doesn't shrink). One fixed constraint can't do both.
- **Why the naive fixes fail:**
  - Root-level absolute child at fixed y → floats over the image when metadata is hidden (root height doesn't change).
  - Move mask INTO image unit with `constraints vertical=MAX` (track image bottom) → meta-off correct, but meta-ON **doubles**: auto-layout couples layout-order with paint-order, so a later flow sibling (default Meta) paints ON TOP of the mask.
- **Fix — wrap the sibling in a HUG "slot" and pin the mask to the slot edge:**
  1. Create `meta slot` = `createAutoLayout("VERTICAL")`, FILL width, HUG height, no fills/padding, `clipsContent=false`, appended as the LAST flow child of the root (after the image unit).
  2. Default Meta → flow child of the slot (`layoutPositioning=AUTO`, FILL/HUG).
  3. Mask → ABSOLUTE child of the slot, `x=0,y=0`, `constraints {horizontal:STRETCH, vertical:MIN}` (pinned to slot TOP).
  4. The slot's TOP auto-tracks the image bottom because the slot HUGs: 52px tall when meta on, HUGs to 0 (sits at image bottom) when meta off. Mask lands right in both states.
  5. Mask being the slot's LAST child fixes paint order for free (paints over the default Meta → no doubling).
- **General rule:** when an overlay must move WITH a sibling that HUGs/collapses, don't anchor it to the root — give the sibling a HUG wrapper and pin the overlay to the wrapper edge. The wrapper's HUG does the state-dependent math; the overlay just follows one edge.
- Rolled to 36/36 via 3 chunks; verify predicate = slot present + meta & mask both children of slot + mask ABSOLUTE with `constraints.vertical==="MIN"`.

## Hover card that must WRAP variable content — "follow-bg" (2026-07-21)
- **Problem:** a popup card background must contain content that changes height (hover reveals extra meta rows, image height varies). A fixed-height bg overflows or leaves gaps.
- **Figma rule that bit us:** an auto-layout frame whose flow children are ALL hidden does NOT collapse to 0 — it sticks at its last non-empty height. So a "meta slot" holding only a hidden Meta can't shrink away; the image (FILL) can't reclaim that space. (A slot with ≥1 visible flow child DOES collapse normally.)
- **The core conflict:** "image fills when there's no title" wants root FIXED + image FILL; "hover extends the card downward" wants root to grow. Same axis, opposite directions — one fixed anchor can't do both.
- **Resolution (follow-bg), when you choose "card wraps content" over "image always fills":**
  - image unit `layoutSizingVertical = FIXED` (image inside stays FILL, tracks the unit; designer drags the unit height to match real aspect).
  - root `primaryAxisSizingMode = AUTO` (HUG) — root height = image unit + visible meta, so it grows when hover meta appears.
  - hover meta overlay = FLOW child of the meta slot (`layoutPositioning=AUTO`, FILL width, HUG height), so it pushes root height. Give it **no fill** (an opaque meta bg protrudes past the card bottom).
  - `hover popup bg` = ABSOLUTE, `constraints {horizontal:STRETCH, vertical:STRETCH}`, sized `root+16` at `(-8,-8)`. STRETCH keeps both insets, so bg tracks root height in every state. Verify: bg bottom = source bottom + 8.
- **Trade-off to name for the user:** with image unit FIXED, no-metadata mode no longer grows the image to fill; and metadata+hover both-on stacks two meta rows (Figma booleans can't express the XOR to auto-hide the default meta — handle by a manual "turn metadata off in hover" rule).
- **Process note (self-review):** settle the load-bearing model (which node is FIXED, which HUG, which FILL, and why) BEFORE editing the pilot. Live-thrashing across 5–6 structural versions in front of the user is expensive and erodes trust. Decide on paper, build once, screenshot, roll out.

## Jul 22 correction — preserve the one-frame IC architecture
- **Supersedes the no-metadata image-fill attempt.** Trying to make no-metadata image fill the tile by switching root to FIXED + image unit to FILL and floating hover metadata below the image split the component into two visual pieces. Eko's correction: IC should remain one frame wrapping image + metadata; drop the fill goal rather than breaking the frame.
- **Final single-image structure:** root = HUG/AUTO, image unit = HUG, `hover popup bg` remains the single absolute background wrapping the root, and `hover meta overlay` lives back inside `meta slot` as a flow child beside `Meta data`.
- **Gate leaves, not the container.** A previous fix bound `meta slot.visible` to `Show metadata`; after moving the hover overlay back inside the slot, that parent binding hid the hover card in no-metadata+hover. Remove container-level visibility gates when children have independent show conditions; let leaf children self-gate.
- **Reparenting changes a node's role.** When the overlay moved from floated card back to inline metadata, its old self-styling became wrong: white fill, 8/16/8/16 padding, and outset width had to be removed/aligned to the sibling `Meta data`.
- **Repeated seam bugs mean architecture, not details.** If a fix chain starts producing corner gaps, nubs, missing fills, and width drift one after another, stop patching properties and diff against the reference/original structure before another rollout.
- **Boolean limit still stands:** `Show hover` and `Show metadata` are independent booleans; Figma cannot bind visible to `hover AND NOT metadata`. Use a true variant axis or enforce mutual exclusion in the consumer/script layer.
