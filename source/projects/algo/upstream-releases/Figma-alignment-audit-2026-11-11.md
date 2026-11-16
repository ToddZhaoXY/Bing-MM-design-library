# Algo 网页与当前 Figma 核对 — 2026-11-11

> 后续实施状态：用户已授权修复 Mobile；下文差异表保留为修复前的核对证据。已确认差异的实施及 Desktop 新发现项见 [修复记录](Mobile-figma-fixes-2026-11-11.md)，当前待办见 [最新清单](Current-todos-2026-11-11.md)。此前“未修改 Mobile / 等待审阅”不再代表当前状态。用户下载的 Roboto 可变字体已接入并确认支持 420/660，浏览器访问现已解决，八模块 Desktop / Mobile 代表样本已实际验收；具体覆盖及尚未完成的变体见修复记录。

## 初次核对范围和结论（修复前）

重新读取 8 个模块 × Desktop / Mobile 的 16 个设计页面，获取对应 16 个主组件的设计上下文、Figma 截图和变量值。另补查 Mobile Sectional Fact、六链接展开（含 Action / Download 卡）与 MM Video，共 19 个组件上下文；对照当前 HTML / JS / CSS 与历史差异清单。

不能标记为全库对齐完成。Mobile Sectional Rich、Expansion 有明确结构差异；Nav 仍有字体、截断和尺寸差异。Desktop 的既有 token 修正保留，本轮八个主样本未发现需要推翻现有布局的证据，但未完成每个变体和状态的逐屏验收。

比较对象为“当前 Figma 具体节点”和“本地网页源码中对应组件”。浏览器实测未完成，没有宣称像素、字体解析、裁切或滚动验收通过。

## 主组件索引（状态列为修复前发现）

所有链接属于 Algo Design Library，文件 FCnmkxLq92iz995JhyN5N1。下列节点是组件，不是整页文档框。

| 模块 | Desktop 基准 | Mobile 基准 | 状态 |
| --- | --- | --- | --- |
| Mainline Algo | [273:20313](https://www.figma.com/design/FCnmkxLq92iz995JhyN5N1/Algo-Design-Library?node-id=273-20313) | [664:43831](https://www.figma.com/design/FCnmkxLq92iz995JhyN5N1/Algo-Design-Library?node-id=664-43831) | 主样本已核对；Mobile 外框、字体、间距有差异 |
| Mainline MM | [273:27911](https://www.figma.com/design/FCnmkxLq92iz995JhyN5N1/Algo-Design-Library?node-id=273-27911) | [691:3258](https://www.figma.com/design/FCnmkxLq92iz995JhyN5N1/Algo-Design-Library?node-id=691-3258) | 单图样本与 Video 已查；多图未逐个复核 |
| Mainline Rich | [284:34561](https://www.figma.com/design/FCnmkxLq92iz995JhyN5N1/Algo-Design-Library?node-id=284-34561) | [748:38472](https://www.figma.com/design/FCnmkxLq92iz995JhyN5N1/Algo-Design-Library?node-id=748-38472) | 主样本已查；Mobile 卡片基本几何对应，字体 / 外框不同 |
| Mainline Expansion | [277:6911](https://www.figma.com/design/FCnmkxLq92iz995JhyN5N1/Algo-Design-Library?node-id=277-6911) | [867:32171](https://www.figma.com/design/FCnmkxLq92iz995JhyN5N1/Algo-Design-Library?node-id=867-32171) | 展开主样本已读；Single / Multiple、Keyword / Sentence、各状态未逐个验收 |
| Mainline Nav | [866:3083](https://www.figma.com/design/FCnmkxLq92iz995JhyN5N1/Algo-Design-Library?node-id=866-3083) | [900:51479](https://www.figma.com/design/FCnmkxLq92iz995JhyN5N1/Algo-Design-Library?node-id=900-51479) | 六链接主样本已查；Compact / 完整 Example 未逐屏验收 |
| Sectional Rich | [308:14592](https://www.figma.com/design/FCnmkxLq92iz995JhyN5N1/Algo-Design-Library?node-id=308-14592) | [904:29358](https://www.figma.com/design/FCnmkxLq92iz995JhyN5N1/Algo-Design-Library?node-id=904-29358) | Mobile 明确结构不一致 |
| Sectional Expansion | [303:2279](https://www.figma.com/design/FCnmkxLq92iz995JhyN5N1/Algo-Design-Library?node-id=303-2279) | [904:23450](https://www.figma.com/design/FCnmkxLq92iz995JhyN5N1/Algo-Design-Library?node-id=904-23450) | Wiki / Fact 均确认 Mobile 结构不一致 |
| Sectional Nav | [304:5461](https://www.figma.com/design/FCnmkxLq92iz995JhyN5N1/Algo-Design-Library?node-id=304-5461) | [902:19006](https://www.figma.com/design/FCnmkxLq92iz995JhyN5N1/Algo-Design-Library?node-id=902-19006) | Magazine 默认与六链接展开已查；Mobile 细节不同 |

Mobile 旧节点 679:10514、737:8035、835:24011 已无法读取，通过当前页面元数据找到新的 Showcase 节点；旧报告仅用于历史追踪。

## 已确认的 Mobile 差异（修复前，已实施情况见修复记录）

| 具体位置 | 当前 Figma | 当前网页 | 源码证据 |
| --- | --- | --- | --- |
| Sectional Rich 主结果 / 双卡 | 374 外框，左右 16 / 上下 12；主结果无包围边框；两张约 163×200 卡横排，间距 16 | 最大宽 372；主结果有边框、圆角、16 内距；两卡纵排、间距 12 | sectional-mobile.css:2–5；sectional-rich-nav.css:5 |
| Sectional Expansion Wiki | 主结果不包圆角卡；四条扁平列表，左图 56×56、圆角 12，条目间分隔线 | 主结果和四条内容仍用圆角卡；图片在文案右侧 | sectional-mobile.css:5,18–21；sectional-expansion.js:28 |
| Sectional Expansion Fact | 补查 [904:26031](https://www.figma.com/design/FCnmkxLq92iz995JhyN5N1/Algo-Design-Library?node-id=904-26031)：左侧缩略图 + Value / Label 的四条列表 | 与 Wiki 共用圆角卡和右侧图片结构 | 同上；这是独立补查结论，不是从 Wiki 推断 |
| Sectional Nav 摘要 / 链接 | 摘要三行；链接 18 / 28，左边与主内容对齐 | 摘要两行；链接 16 / 22，额外左内距 16 | sectional-nav-mobile.css:6,10 |
| Sectional Nav Show more | 当前按钮高 38、约半宽、圆角 6 | 高 32、最小宽 104、圆角 24 | sectional-nav-mobile.css:17–21；旧报告圆角 8 由本轮值取代 |
| Sectional Nav 内容栏 | 标题 18 / 22；卡间距 16；Magazine / Action 图 126×126、圆角 12 | 栏标题 20 / 26；卡间距 12；图 128×128，另有窄视口 108 覆盖 | sectional-nav-mobile.css:14–16,21–22 及文件尾 media query |
| Mainline Algo | 374 外框，左右 16 / 上下 12，内容宽 342；来源到标题 6，标题到摘要 3 | 宽 344，无相同外框；旧间距 | algo-block.css 的 .algo.algo-mobile；algo-mobile.css |
| Mainline MM 单图 | 内容宽 342；图 88×88、圆角 12；文图间距 16、底部对齐 | 内容宽 344；图 88×88、圆角 16；文图间距 12、顶部对齐 | mm-mobile.css:2,5,9,11 |
| Mainline MM Video | 补查 [704:12229](https://www.figma.com/design/FCnmkxLq92iz995JhyN5N1/Algo-Design-Library?node-id=704-12229)：374 外框内视频宽 342、高约 192.38，16:9；标题到视频 9，视频到摘要 9 | 344 内容宽；16:9 与圆角 24 已对应，外框、字体、间距仍不同 | mm-mobile.css:2,5,16–19 |
| Mainline Rich | 374 外框内 342 内容；卡宽 200、图高 128、圆角 24、间距 16 | 344 内容宽，无相同外框；卡片基本几何对应 | rich-mobile.css；不能误报为缺少轮播 |
| 多个 Mobile 字体 | 当前变量返回 Roboto、regular weight 420；部分 header weight 与 Desktop 模式不同 | 多处显式 Arial 400 / 700；Desktop Roboto 规则不覆盖 Mobile | 各 Mobile CSS；本轮 token 原始快照 |

字体需要保留设备 / 节点模式差异。420 需要检查所用字体是否支持相应可变字重，不能把静态 Regular 文件直接当作 420 已验收，也不能将 Mobile 全部覆盖为 Desktop 值。

## 不能统一套用的部分

- Mainline Nav 当前 Mobile 节点 900:51479 是 374 宽、主内容从 x=0 开始，没有上述外侧 16 内距。不能仅因为别页有 padding 就判错。
- Mainline Expansion 已有 374 + 16/12 外框，网站也有对应规则。展开内文的嵌套内距及 Keyword / Sentence 须逐层比较，保留待查，不能仅凭视觉缩进就记为确定缺陷。
- Sectional Nav 第二个大文档框仍名为 With Magazine，但内容包含 Action / Download。本轮按具体内容和节点核对，不按标题顺序臆断类型。[882:10635](https://www.figma.com/design/FCnmkxLq92iz995JhyN5N1/Algo-Design-Library?node-id=882-10635) 当前确有六条链接与 Action / Download 卡。
- 说明和原始 SDL 曾写八条链接，当前展开样本显示六条。继续保留网页 4→6，原始 SDL 不改写；记录为源头冲突，不直接增添到八条。

## Desktop 与历史问题状态

- 已关闭项保留：[Desktop token 修正](Desktop-token-alignment-2026-11-10.md) 中字体、attribution、Expansion / Nav 间距与行高、Sectional Nav 右栏对齐、状态联动等没有回退。
- 本轮八个 Desktop 主上下文不等于所有变体均通过。Rich 完整 content × accessory、Expansion Single / Multiple 和全部状态、Sectional Fact / 图片组合、完整搜索页 Example 仍需逐个验收。
- 三条已找到的 Algo With fact / List clickable / List unclickable Mosaic 链接仍未全部接入注册表，继续沿用上一轮链接清单，不需要用户重发。
- Mobile 没有原始 SDL、Desktop 部分变体只有基准导出，与“网页组件是否存在 / 是否对齐”分开记录。已有 Derived Download 不重新算作缺原始链接。
- Mainline Nav 完整 Mobile Example 的后续 News、其他整页附属内容仍需补核，不因核心 Nav 已查就算整个 Example 完成。
- 跨页设备选择未保持，属于文档体验项。Dark 没有本轮对应 Figma 基准，不声明已按稿验收。

## 本轮落实和验证边界

- 九页分类按最新会议结论修正：Overview / Intro、Mainline、Sectional；移除外部 Cells 总标题与 Molecules 占位，同步首页、计数、搜索和面包屑，没有迁入 Organisms。
- Cells 候选及复用边界见 [复用评估](Cells-reuse-review-2026-11-11.md)，未拆组件或增加 Cells 页面。
- 未修改 Mobile 组件视觉、原始 SDL、Figma 或历史 V5 ZIP，未发布。
- 保存了 16 个主节点的 [token 返回值](Figma-token-snapshot-2026-11-11.json)。补查三个节点使用上下文和截图核对，不冒充独立 token 快照。
- 浏览器画面对比仍未完成：此前访问被自动审批服务的 unsupported_model 错误阻断。源码与 Figma 对比能确认以上结构和值的差异，不能代替真实浏览器截图、字体解析和交互验收。

本轮运行通过：九页导航 / 搜索 / 链接 / ID / 本地依赖检查；Anatomy 箭头标注检查；36 个 Desktop 类型 / 状态组合；33 个 Mainline Desktop / Mobile 组合与交互回归；共享导航脚本语法检查。这些检查不代表设计画面验收。

## 后续实际验收更新

原生 Edge 访问已恢复并完成八模块两种设备的代表样本画面对照；此前浏览器阻塞描述保留为历史记录。Desktop 预览宽度、轮播截断与末尾滚动、Sectional Fact 对齐，以及 Mobile 三图裁切、七行展开正文、满宽列表、Nav 按钮和间距等追加问题已修复。详见 [实际验收覆盖与回归结果](Mobile-figma-fixes-2026-11-11.md)。本报告前文的“当前网页”和“未修改 Mobile”描述属于首次核对时点，不再代表现状。全量变体和完整 Example 附属内容尚未全部逐屏验收。
