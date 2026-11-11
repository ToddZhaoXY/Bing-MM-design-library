# Video Magazine layout fix · 2026-11-10

The card-level variant class `vm-video-overlay` collided with the class of its internal caption. Caption CSS applied `position: absolute`, bottom/left offsets, padding and `pointer-events: none` to the outer VideoCard. In a Magazine page, the card consequently positioned itself against the distant preview/page ancestor instead of participating in the right-column stack.

The caption now uses `vm-video-overlay-content`. The outer variant class is retained, and the card remains in normal flow. IMDb's invalid `height:200` declaration is corrected to `height:200px; flex-shrink:0`.

## Source ordering

Read the current Figma metadata for file `fRSRroY4YFgJSeqLLE0Y38`, node `2136:45835`. Its Zone C is at x=918 and contains Video card at y=0, 282×200, followed by the answer/IMDb card at y=224, 282×200. This confirms video above IMDb, not below. The metadata is saved in `source-layout.xml`.

## Checks

- 58 Video tests passed, including a new regression check applying simple class rules to the rendered card's actual class list across three metadata placements and three playback states. It rejects absolute/fixed positioning and pointer-event suppression on the card container.
- Production build passed. Root site verifies 268 files, four entry pages and 174 root/subpath references. Compatibility archive: 8 checks passed; ZIP integrity passed.
- Browser measurements passed for the SERP page in Default, clicked Preview and Post-preview states; the independent Magazine cell; Playground Magazine at desktop and 390px viewport; and exported HTML at its native 1520px width.
- Native exported coordinates: video x=918, y=0, w=282, h=200; IMDb x=918, y=224, w=282, h=200; gap=24; right-column height=424. Card accepts pointer input and remains within the Magazine zone.
- Browser geometry is saved in `geometry.json`; the corrected appearance is in `after.png`.
- The HTML exporter reported one existing font warning: Roboto 400 italic has no matching readable local font-face rule. The Magazine card placement was verified independently; this fix does not claim to resolve that font-export warning.
- The temporary browser viewport override was reset. Online hosting was not updated.

Deployment archive: `Design-Systems-Portal-Compat-delivery/MM-Design-Libraries-compat-5a74417ecbbf.zip`.
