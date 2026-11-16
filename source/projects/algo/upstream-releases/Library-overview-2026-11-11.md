# Library overview — 2026-11-11

> 当前更新（Cells 独立文档）：四个 Cell 各自使用独立页面（cells.html、cells-article-card.html、cells-action-card.html、cells-download-card.html）。顺序为 Overview 预览与控件 → 同 Organisms 样式的 Code 栏 → Properties → Used in；不增加独立 Example。右侧目录仅显示 Overview / Properties / Used in。所有 13 页侧栏和搜索已更新，旧 Cells 锚点链接兼容跳转。Code 当前为共享渲染器生成的 HTML，尚无独立 Cell SDL，不标为 SDL。Used in 跟随设备并打开对应 Organism 的 Magazine / Actions 变体。此前单页目录、锚点导航和“等待提取”说明均已被本更新替代。
>
> 本次验证：13 页导航及依赖检查、8 组 Support Card 与 Image Card 原始渲染回归通过；Edge 实际打开四个独立页面，检查 Article 的 Mobile / 带摘要切换与复制成功，并验证 Used in 打开 Without Magazine。此项不代表整个库全部 Figma 变体已完成视觉验收。


> 最新导航决定：用户已明确确认 Organisms 收纳现有 Mainline / Sectional，Cells 必须保留独立入口。已在十页导航、搜索和移动端菜单落实，并创建 cells.html 说明页面。Cells 内容等待后续提取指令；不增加 Molecules。下文移除 Cells / Organisms 的记录属于已被替代的历史解释。


## Current taxonomy supersedes the earlier structure below

Following the user's meeting notes, all nine pages now expose Overview / Intro, Mainline, and Sectional. Removed the Cells parent heading and Molecules placeholder, updated homepage descriptions and module counts, search groups, and breadcrumbs. Existing modules are not forcibly renamed Organisms. Cells are assessed by actual external reuse and composition needs; no components have been extracted. The entries below describe implementation history, not the current classification. See `Current-todos-2026-11-11.md` and `Cells-reuse-review-2026-11-11.md`.

- Added a library introduction at `index.html`, using the existing documentation fonts, colors, rounded cards, and theme controls.
- Added library metadata, the Figma source link, all eight module entry points, and a short usage guide.
- Grouped the sidebar into Overview (Intro), Cells (Mainline / Sectional), and Molecules across all nine pages. Cells is a static heading; both scenarios have independent native disclosures. The current scenario starts expanded. Desktop and Mobile documentation navigation share the same structure.
- Refined the navigation using Spectrum’s public navigation styles as a reference: removed horizontal dividers and segmented controls, used group spacing and a small indent, and kept a short vertical selection marker with stronger text. Collapsing the current scenario retains a marker on its heading.
- Reserved Molecules as a static group with a Coming soon label, without an empty disclosure. Search continues to include cells from both scenarios.
- Preserved the original Algo Block page at `algo-block.html` and updated its navigation links.
- Shared navigation and search now include the Overview page and work independently of component previews.
- Existing component layouts and Mobile visuals were not changed by this addition.

Validation: navigation/search checks on all nine pages; unique IDs and local dependencies; JavaScript syntax; existing Anatomy, Desktop state, and Mainline Mobile regression checks passed. Browser visual verification remains unavailable in this session. The published V5 ZIP was not modified; this update has not been published.

## Navigation typography source check

Reference: Adobe Spectrum Hub public source, `styles/styles.css` and `blocks/sitenav/sitenav.css` (main branch), checked 2026-11-11.

Confirmed source values: group label 12px / 700 with a 32px line box; ordinary navigation item 14px / 400; selected item 14px / 700; item line box 40px; marker 2 × 18px. Updated the corresponding local rules. Kept our Source Sans Pro documentation font and existing theme colors. Spectrum defines Adobe Clean Spectrum VF, so matching sizes does not imply identical glyph shapes or live rendered metrics. Live computed styles remain unverified because browser inspection is unavailable.

## Feature introduction and design sources

Applied the user's clarification of Chris's meeting direction: Component Source means the source of design information, including Figma references; it does not mean Algo-built / ACF-direct / Hybrid ownership classification.

- Added Feature Area Introduction to Intro: Algo Block (including MM), Rich Caption / Rich Nav Carousel, Expansion, and Nav, with their user-facing purpose and the Mainline / Sectional distinction. Copy is documentation drafted from the existing feature scope, not a quotation or approved meeting wording.
- Added Component Source with the Algo Design Library file link and eight Desktop / Mobile reference pairs from the current Figma audit index.
- Renamed Modules to Component Index and updated the right-hand page links; kept the current navigation and visual system.
- Properties already exists on component pages. Explicit Variations counts remain a separate meeting requirement to implement; this update does not count them as complete.
- Inspected the introduction and full source table in Edge. Navigation/dependency checks passed.

## Cells 导航修正

Cells 下直接列出 Image Card、Article Card、Action Card、Download Card，取代笼统的 Reusable cells 导航项；四个入口直接定位对应组件。当前 Cell 随链接、刷新和前进后退更新选中状态，移动端菜单同步。Cells 页面默认收起 Organisms 的两个场景，减少导航长度。十页导航 / 搜索回归通过，Edge 实际点击 Action Card 后内容与选中项对应。
