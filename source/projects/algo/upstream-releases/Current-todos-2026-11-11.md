# Algo Library 当前待办 — 2026-11-11

> 2026-11-12 更新：按 Chris 最新范围新增 Favicon、Attribution 两类独立 Cells；共六类、15 页导航。此前“来源与图标不单列”的判断已被替代。候选及提取边界见 [本轮记录](Cells-candidates-2026-11-12.md)。本次未上传 GitHub。

> 当前更新（Cells 独立文档）：四个 Cell 各自使用独立页面（cells.html、cells-article-card.html、cells-action-card.html、cells-download-card.html）。顺序为 Overview 预览与控件 → 同 Organisms 样式的 Code 栏 → Properties → Used in；不增加独立 Example。右侧目录仅显示 Overview / Properties / Used in。所有 13 页侧栏和搜索已更新，旧 Cells 锚点链接兼容跳转。Code 当前为共享渲染器生成的 HTML，尚无独立 Cell SDL，不标为 SDL。Used in 跟随设备并打开对应 Organism 的 Magazine / Actions 变体。此前单页目录、锚点导航和“等待提取”说明均已被本更新替代。
>
> 本次验证：13 页导航及依赖检查、8 组 Support Card 与 Image Card 原始渲染回归通过；Edge 实际打开四个独立页面，检查 Article 的 Mobile / 带摘要切换与复制成功，并验证 Used in 打开 Without Magazine。此项不代表整个库全部 Figma 变体已完成视觉验收。


## 当前分类原则

以用户最新明确确认取代此前移除 Cells / Organisms 的解释：

- Overview / Intro 介绍 Feature Area 并提供 Component Source。
- Organisms 收纳现有八个模块，内部保留 Mainline / Sectional 两个独立折叠分组。
- Cells 必须有独立入口，展示后续从 Organisms 提取的可复用组件；现已展示四类完整 Cell、五种内容变体。
- 不增加 Molecules。Cells 仍按实际复用和组合需求提取，不按内部元素数量拆分。

## TODO 1：网页与当前 Figma 一致性

状态：第一轮已确认的 Mobile 布局/样式差异及 Desktop 补查差异已修复；用户提供的 Roboto 可变字体已接入并验证支持 420/660。浏览器访问已解决，八模块 Desktop / Mobile 代表样本已实际检查；全量变体逐屏验收未完成。见 [实施记录](Mobile-figma-fixes-2026-11-11.md)。

- 重新读取 16 个 Desktop / Mobile 页面，核对 16 个主组件上下文、截图和 token；补查 Mobile Fact、六链接展开及 Video，共 19 个组件上下文。
- 差异与当前节点见 [本轮核对报告](Figma-alignment-audit-2026-11-11.md)。
- 已修复：Mobile Sectional Rich 横向双卡、Expansion Wiki / Fact 缩略图列表、Nav 字号 / 截断 / 按钮 / 图片尺寸及八模块外框。
- Mobile 外框、字体及间距按各自节点处理；Mainline Nav 当前节点没有相同的外侧 16px padding，不能全库套用。
- 用户已要求实施 Mobile 修复，当前不再暂停；Roboto 可变字体已从用户下载文件接入，支持 420/660，已检查实际文字外观与换行，未单独读取浏览器计算字体。
- Desktop 既有 token 修正保留，并修复 Sectional Expansion 及 Rich Title 图片尺寸的补查差异；其余变体、完整 Example 附属内容和 SDL 覆盖仍须继续核对，不记为全部通过。

- 本次追加修复：Desktop 690px 预览宽度、Rich 卡片截断与末尾箭头，Mobile MM 三图裁切、Expansion 七行正文、Sectional 列表满宽与 Nav 按钮间距。代表样本和已操作状态详见实施记录。

## TODO 2：按复用场景评估 Cells

状态：已提取首批四类完整 Cell，并接入独立预览、设备及内容切换、Properties、设计来源与 HTML 复制。

- 见 [Cells 复用评估](Cells-reuse-review-2026-11-11.md)。
- 已提取：Sectional Image Card、Article Card（普通 / 带摘要）、Action Card、Download Card。
- Mainline Rich 内容项与 Wiki / Fact 条目仍保留为后续候选，不把本次四类说成全库所有可复用单元。
- 用户已明确要求提取 Cells；本次按已有优先候选落实，不再等待额外提取指令。
- Wiki / Fact 的 Desktop 卡片与 Mobile 列表须分别保留设计形式。
- Attribution、标题、按钮、分隔线等内部片段暂不单列为 Cells。
- 十页导航及搜索已同步为 Overview / Intro、Cells / Reusable cells、Organisms / Mainline 与 Sectional；组件页路径和预览不变。

历史 V5 包及原始 SDL 不变；本轮未发布。

## Overview meeting requirements

- Feature Area Introduction: implemented in Intro with the purpose of each feature family.
- Component Source: implemented with Figma file and Desktop / Mobile component references.
- Properties: present on the eight component pages.
- Variations: Cells now shows content-structure counts. Counts for the original eight Organisms remain pending.

## Cells 提取落实

- `algo-cells.js` 提供共享的 Image / Support card 渲染器；Sectional Rich 与 Sectional Nav 使用这份实现。
- `cells.html` 展示 Image、Article、Action、Download 四类；Article 有普通和带摘要两种内容变体。计数为 4 cells / 5 content variations，不把图片开关或设备重复算入。
- Desktop / Mobile 保留原卡片形式；三个 Nav Cell 支持有图 / 无图。Properties、来源链接、HTML 依赖和复制已接入。
- 已在 Edge 检查独立卡片、Mobile Article 摘要与无图切换、Download 和 HTML 复制。提取回归比较 8 个 Support card 组合及 Image Card 与原始实现的标记一致；十页导航检查和本轮 JS 语法通过。

## Cells 导航修正

Cells 下直接列出 Image Card、Article Card、Action Card、Download Card，取代笼统的 Reusable cells 导航项；四个入口直接定位对应组件。当前 Cell 随链接、刷新和前进后退更新选中状态，移动端菜单同步。Cells 页面默认收起 Organisms 的两个场景，减少导航长度。十页导航 / 搜索回归通过，Edge 实际点击 Action Card 后内容与选中项对应。
