# Desktop 对齐修正 — 2026-11-10

按用户确认：Desktop 使用当前 Figma 的设计和 token；Mobile 暂缓调整，等待用户核对。所有改动仅在 Desktop 生效。

| 位置 | 修正前的网站 | 本次按 Figma 修正为 |
| --- | --- | --- |
| 组件字体 | Arial | Roboto Regular / Bold，本地字体文件 |
| Algo 来源下方 URL | 13px / 20px，来源行灰度与稿不同 | 两行 attribution 均 14px / 22px，tertiary = #00000099 |
| Mainline Expansion 主结果到列表 | 16px | xx-small = 4px |
| Mainline Expansion section 标题 | 16px / 24px | body1 = 18px / 28px |
| Mainline Expansion 分隔线 | 实体 border 额外占高度 | 不占额外高度的分隔线，折叠行保持稿内 96px |
| Mainline Expansion 展开标题 | 上下各 14px | small = 12px，配合 28px 行高保持 52px |
| Mainline Nav attribution 到标题 | 8px | xx-small = 4px |
| Mainline / Sectional Nav 导航文字 | 18px / 24px | body1 = 18px / 28px |
| Mainline Nav More results | 12px / 18px | 当前稿 caption2 = 11px / 13px；footer 内容区域最小 16px |
| Nav / Sectional 链接色 | 沿用基础 Algo 的 #4007a2 | 对应节点 smtc/ctrl/link/foreground/brand/rest = #3d00a6；基础 Algo/MM/Rich 保留 Base/Link Default = #4007a2 |
| Sectional Nav 右栏 | 额外下移 44px | From 标题与左侧 attribution 顶部对齐 |
| Sectional Nav 右栏卡片 | 156px 最小高、内距和文图 gap 不符 | 158px、20px 内距（含 1px stroke）、12px 文图 gap |
| Sectional Nav Show more 上方 | 24px | medium = 16px |
| Sectional Nav Anatomy 右栏标记 | 跟随旧的下移位置 | 标记移动至右栏标题附近；精确画面位置待验收 |
| Sectional Rich 图片卡 hover | 额外阴影、下划线 | 去除稿外 hover 外观，保留键盘 focus 提示 |
| Algo / MM / Rich / Nav Anatomy | Overview 选 Hover/Visited，Anatomy 仍 Default | 同一所选状态保持联动 |
| Desktop Title 说明 | “最多两行” | 单行省略，与现有正式稿一致 |

基础 token 值来自 Figma `get_variable_defs`，节点为 273:20313、277:6911、866:3083、308:14592、303:2279、304:5461；展开态补充参考 284:78040。原始返回值保存于 [Desktop Figma token values](Desktop-figma-token-values-2026-11-10.json)，保留各节点模式差异，没有把两种链接色合并。

`desktop-figma.css` 使用 Figma 名称到 CSS 变量的一对一名称转换，例如 `text/global/body3/lineHeight` → `--text-global-body3-lineHeight`。通过 Desktop 专属作用范围应用；8 个文档页与 Desktop HTML code sample 均加载这份样式。原始 SDL 不改写。Figma Code Connect 指向本项目之外的组件路径，本次将高保真上下文适配为现有静态 HTML/CSS 组件。

Roboto 从用户本地已有的 Bing Design template 字体目录复用，确认是有效 TrueType 字体和正确的 Regular / Bold 字重；保留原始文件和来源信息。没有使用下载目录中同名但实际为 HTML 的 woff2 文件。

## 验证

- 36 个 Desktop 类型 / 状态组合：Overview 与 Anatomy 状态一致，图片依赖存在。
- 原有 33 个 Mainline Desktop / Mobile 组合与交互回归通过。与 V5 包比较时，仅明确允许本次修复的 Nav Anatomy 状态变化，其他结构仍比较。
- 48 个 Mobile 生成结果与本次修改前逐字一致；所有 Mobile 专用文件、原始 SDL 和 manifest 的哈希均未变化。
- 顶层 JS 语法、8 页本地样式/脚本依赖、HTML 重复 ID、字体文件有效性检查通过。
- V5 ZIP 保持 SHA256 `b907f006ba716fc53845b9f6b150f9de2e1cc3a5a83acdde2a89eedd6205a80f`；没有重新打包或上传。
- 浏览器画面对比未完成：访问动作被自动审批服务的 `unsupported_model` 错误阻断。不能把本次值与结构的修正写成全库像素验收通过。

## 仍保留的事项

- 全部 Mobile 细节等待用户确认，不套用 Desktop 的修正。
- Sectional Nav 画面 6 条与注释/原始 SDL 8 条的冲突，保持现有 4→6，不擅自增添。
- 完整 Example 内容、SDL 覆盖、三个已发现链接的接入、设备跨页保持仍按[全库清单](Figma-alignment-audit-2026-11-10.md)追踪，不计入本次 token 修正完成范围。
- 各种变体尚未逐屏完成画面对比；Dark 未提供对应 Figma 基准，保留现有主题语义，不声称 Dark 已按稿验收。

## 后续：Rich Nav Carousel Anatomy 高亮修复

用户截图中的底部紫色细框来自 Navigation Control 的零高度标注外层：箭头使用绝对定位，外层的 outline 被压成横线，tooltip 也按错误的矩形定位。现在高亮可见箭头按钮，并用实际按钮的矩形定位 tooltip，保留其余标注和滚动行为。新增检查覆盖右箭头、滚动末尾的左箭头、无可见按钮 fallback 及其他普通标注；现有 Desktop / Mobile 回归均通过。实际画面仍待浏览器复核。

随后根据用户截图修正 Desktop Rich 第一张卡片 hover 阴影裁切：滚动区域内原有横向 8px 留白只容纳背景外扩，没有容纳阴影；现改为四周 32px，并以等量负 margin 保持卡片原来的对齐与间距。同步 scroll-padding，使首卡吸附位置一致。仅作用于非 Mobile Rich；Mobile 的滚动样式保持不变。

## Properties 文档

按用户提供的参考截图，为现有 8 个模块在 Anatomy 后增加 Properties，右侧目录同步增加入口。使用现有文档视觉：Prop / Type / Values / Default 四列表格、灰色表头、分隔线和代码标签。枚举属性直接读取各模块现有控件；随设备/变体过滤隐藏或禁用选项，Default 保持初始默认值。标题、摘要、来源及 URL 使用当前变体已有的 placeholder 内容，不新增组件样式或额外状态。所有数据以 textContent 写入。

检查覆盖 8 模块 × 2 设备的表格内容、条件属性、默认值稳定性及文本安全；8 页的依赖、脚本顺序、唯一 ID 和目录锚点检查通过。现有组件回归通过。Mobile 组件视觉、原始 SDL 与历史 release 包保持不变。浏览器视觉验收仍受之前记录的工具限制。
