# Screenshot scope and delivery mapping

Source file: `fRSRroY4YFgJSeqLLE0Y38`, inspected 2026-10-16. Divider rows are labels.

| Selected page | Page ID | Website destination |
| --- | --- | --- |
| Components | 139:7061 | Source catalog; referenced video primitives |
| MM VIDEO DESIGN SYSTEM | 940:54 | Introduction and source overview |
| Video-specific rules | 940:332 | Foundations |
| Short Card | 940:569 | ShortCard |
| Video Metadata | 940:751 | VideoMetadata; VideoCard and SourceIcon dependencies |
| Video Magazine Card | 1014:24800 | MagazineCard, Hero, More, ShortsList, Playlist, Supplemental |
| Content · Video Group | 940:1156 | VideoGroup |
| Content · Shorts Group | 940:1404 | ShortsGroup |
| Content · Video Magazine Zone | 1014:24801 | VideoMagazineZone |
| SERP · Video Answer Mainline | 940:2243 | Six supplied desktop/mobile scenes |
| SERP · Video Answer Go-wide | 2128:29243 | Source gap: empty in-progress page |
| SERP · Short Video Answer Mainline | 2127:24212 | Desktop and mobile |
| SERP · Short Video Answer Go-wide | 2128:29378 | Desktop and mobile |
| SERP · Video Magazine Page | 940:2319 | Supplied Tom Hanks page |
| VRP · Whole Page | 940:2564 | Reference-only source gap |

The separate Video Card documentation page `940:470` is outside the screenshot and
was not read. VideoCard is implemented from instances/dependencies on the selected
Metadata and Components pages. Other non-selected pages were not used as UI sources.

The VRP reference was checked only at the exact linked node in a separate file; it
is a WIP cover. Its other pages were not traversed. Playlist's ten visible tuples
are retained despite source typing errors. Supplemental Card covers all thirteen
explicit examples on the selected Other video cards frame.

The foundation text mentions 9:16 shorts and bottom-positioned duration while its
current supplied components have additional 3:4/2:3 forms and top-left badges.
Vertical-group prose says Below while actual source instances use Inline metadata.
SourceCatalog and Foundations keep these discrepancies visible.

Code Connect mappings sometimes pointed to unrelated/nonexistent local files, and
codegen sometimes showed inherited text instead of actual instance overrides.
Implementations follow actual node values and design screenshots. Exact source
SVG exports corrected color-normalized Play/Search downloads. Raw evidence remains
in figma-pages/ and figma-context/; runtime uses only local assets.
