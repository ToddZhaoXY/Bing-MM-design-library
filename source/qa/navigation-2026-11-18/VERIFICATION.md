# Image naming and Algo navigation · 2026-11-18

- Visible library naming is Image: homepage links, global rail, accessible names,
  page titles, startup title, Image sidebar branding and introduction heading.
  Existing `mm-image.html` routes and public component/export identifiers stay valid.
- Algo's upstream link hierarchy is rendered using the canonical sidebar classes.
  Sidebar CSS is generated from `theme/documentation.css` and `theme/tokens.css`;
  it is not a separately maintained visual approximation. No React runtime was added
  to the static Algo pages. The original imported source tree remains untouched.
- Overview, Cells and Organisms groups support disclosure. Mainline/Sectional folders
  reveal the current page. Full sidebar collapse, independent mobile drawer IDs,
  keyboard buttons, current-page markers and the existing dark theme remain usable.

## Verification

- Build and type checks passed.
- 39 shared tests + 9 compatibility tests passed.
- Browser checks passed for 25 entries, including all Algo document/redirect entries.
  No JavaScript page errors or local HTTP failures.
- Compared computed sidebar, brand, group, link and toggle styles against AIGC:
  family, size, weight, line height, padding, colors, radius, width and height matched.
- Checked 1024, 390 and 320px layouts, group/full-menu collapse, current-branch
  expansion, dark mode and mobile drawer navigation. No document horizontal overflow
  or duplicated IDs. Desktop and mobile screenshots reviewed.
- Published HTML and active shell/portal chrome contain no `MM Image` label.
- Static manifest, ZIP CRC, exact entry set and every file hash passed.

Package: `AIXA-Bing-Design-Library-2026-11-18.zip`

ZIP SHA-256: `f40880940562289c2a5218eda5b9537d3f0e6b508d5454df589d0bd7b343d888`

The local preview and deployment package are updated. No GitHub push was performed.
