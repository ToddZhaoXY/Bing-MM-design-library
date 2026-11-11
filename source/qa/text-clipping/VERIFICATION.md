# Complete-line text truncation pass · 2026-11-10

The user's IMDb screenshot exposed a clamped paragraph growing to 96px despite a four-line limit at 22px line height. The fifth line remained partially visible below the ellipsis. This pass inspected all three libraries and fixed the related issues found in Video.

## Changes

- IMDb body: four complete 22px lines (88px), no flex growth; the source footer keeps its bottom placement.
- Hero: a flexible description **slot** wraps a naturally sized clamped paragraph. A paragraph no longer absorbs arbitrary spare height or shrinks through a line. Source titles use one line; Wide preserves a complete two-line description and its original text-slot spacing.
- Video overlay and immersive Playlist titles: one-line ellipsis keeps long titles inside the media area.
- Playlist list/grid: source-appropriate title line counts and line heights; title and video-count rows do not squeeze one another into partial lines.
- Video Card with optional Below description: automatic height accommodates the extra complete text rows. Fixed-height Below cards reserve the full metadata height by reducing the media-to-metadata gap when necessary.
- Narrow 9:16 source labels: truncate the source name within the first metadata row instead of wrapping it into extra rows.
- Expanded Overview explicitly clears its clamp; collapsing restores six lines. No expanded article text is forcibly truncated.

## Source checks

Read current Figma metadata for file fRSRroY4YFgJSeqLLE0Y38:

- Hero Normal 1447:19385: title 22px, description slot 69px; text itself fits three 22px lines.
- Hero Wide 1447:19389: title 22px, description slot 46px; text fits two complete lines. Its source/footer follows the description slot directly.
- Hero Super wide 1447:19383: title 22px; description hidden by default.
- Playlist Wide 1481:55468: title 22px and video-count row 20px inside each 58px item.
- VRP horizontal scroller 1258:10572: fixed 200px card with media about 107.4px, gap 8px and metadata 88px. These source measurements overrun the card; the implementation now reduces only the gap when needed so metadata is not clipped.

## Browser regression matrix

`generate-fixtures.mjs` renders the current components, including default values, selectable options, dependent Image layouts, boolean branches and long-text stress cases. The fixture pages load the actual production component styles and assets. The matrix is finite, not an exhaustive Cartesian product of every possible public prop.

| Library | Cases | Clamped text elements checked | Remaining findings |
| --- | ---: | ---: | ---: |
| Video | 373 | 1530 | 0 |
| MM Image | 244 | 58 | 0 |
| AIGC | 108 | 0 | 0 |
| Total | 725 | 1588 | 0 |

`audit-dom.js` checks clamp bounds, fractional-line shrinking, footer placement, raw-text/card boundaries and hidden fixed-height text. AIGC has no CSS line clamps in this matrix; its two overflowing fixed-height text blocks end on complete line boundaries. Image and AIGC did not need component changes for this issue.

The `*-after.json` reports contain the final browser measurements. `video-before.json` captures the original clamp findings (including deliberately expanded Overview paragraphs, which now explicitly clear the clamp). `imdb-after.png` is the final visual check.

The integrated Magazine page was also reloaded and checked separately: IMDb = 88px / four lines; Overview expansion = 242px / no clamp, collapse = 132px / six lines.

## Other checks and delivery

- Full source regression suite: 150 passing tests (31 portal/navigation, 8 compatibility, 13 Image, 40 AIGC, 58 Video).
- After the final immersive-title adjustment: all 58 Video tests passed again; source provenance verification passed for 362 original files with the authorized corrections recorded separately. ORIGINALS.json remains immutable.
- Final production build and static-site verification passed: 268 files, four entries, 174 root/subpath references. Final archive compatibility checks and ZIP integrity check passed. `git diff --check` passed.
- Updated repository-root static release and `Design-Systems-Portal-Compat-delivery/MM-Design-Libraries-compat-e4c96a60dc64.zip`.
- No online deployment was performed. Prior exported HTML snapshots remain historical artifacts; newly generated exports use the updated live rendering.
