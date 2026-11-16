# Mobile 与 Desktop 补充修复 — 2026-11-11

用户已要求修复全部已确认的 Mobile 差异，取代此前“Mobile 暂缓”的状态。基准是当前 Figma，索引见 [核对报告](Figma-alignment-audit-2026-11-11.md)。本记录只描述已实施范围，不代表全部变体已完成浏览器画面验收。

## Mobile 已实施

- 八个模块外框统一 374px；通常左右 16、上下 12，内容宽 342。Mainline Nav 当前 Figma 是 374px 内容、左右 padding 0，按该节点保留。这是设计内部间距差异，并非预览外框宽度不同。
- 共用 `mobile-figma.css` 覆盖字号、行高、间距、圆角、图片尺寸和截断；Overview、Anatomy、Example 核心模块及 HTML 示例接入同一修复。
- Algo 来源 14/22、标题 20/26、摘要三行，Fact / List 行距与尾链间距修正。
- MM 单图 88×88、圆角 12、文图间距 16、底部对齐；双/三图 342×200、圆角 24；视频 16:9，标题及摘要前后间距 9。
- Rich 保留 200px 卡宽、128px 图高、24px 圆角、16px 卡间距，修正外框与文案间距。
- Mainline Expansion 去除展开答案额外的左右缩进，修正 Keyword 36/42、Sentence 18/28、图片和正文行数；Nav 修正行内间距、圆角与字体值。
- Sectional Rich 主结果去掉外围卡片框，两张图片卡横向并排，间距 16。
- Sectional Expansion Wiki / Fact 改为四条扁平列表；有图时左侧 56px 图片、圆角 12、间距 9。主结果无包围卡；混合图标题在全文宽度上方。无图行与有图行分别保留设计高度。修正卡片关闭后再次点击无法正常开启的状态残留，按钮和面板保持唯一关联。
- Sectional Nav 摘要三行、链接 18/28、Show more 高 38/圆角 6；栏标题 18/22、卡间距 16、图片 126×126/圆角 12，Download 图保持 56。

额外核对了 MM 双图/三图、Expansion Single Keyword / Multiple Sentence、Sectional Wiki 混合图 / Fact 无图，以及 Algo Fact / List。具体参考包括 691:3360、691:3441、874:34622、867:32574、904:23711、904:27065、664:43848、674:1296。904:23711 是混合图默认状态，不作为展开状态证据。

## Desktop 发现并修复

- Sectional Expansion Wiki / Fact：主卡 padding 20（CSS 扣除 1px 边框）、小卡 padding 16/20、文图 gap 8、图片圆角 12、标题间距 2、Fact 标签 13/20。
- Learn more 高 38、字体 13/20、圆角 8、背景 #e1f0fd；Continue reading 13/20、#0b497f。
- Rich 仅 Title 变体图片高 126，修正 200px 卡总高关系。
- 保留 Desktop 双列结构及 1200 最大宽。补充基准 303:4470（Fact）、303:2524（Wiki hover）；304:6458 是整页文档框，未当作 1200px 组件根节点。

## 字体与验证边界

Mobile 已接入用户下载的官方 Roboto 可变字体，使用独立的 Algo Roboto Variable 字体家族。字体 fvar 确认 wght 100–900、wdth 75–100，支持 Figma 420 / 660；默认宽度 100。文件复制后哈希与用户原文件一致。此前自动下载失败不再阻断此项。Desktop 保留静态 400/700。字体文件能力和样式接入已验证，并已在 Edge 实际画面中检查文字换行和外观；未单独读取浏览器的计算字体结果。

浏览器访问问题已解决：扩展接口仍不可用，但通过原生 Edge 窗口可正常打开本地网页、截图、切换选项和操作组件。无需用户继续调整设置。此前连接失败只代表当时的工具状态，不再是视觉验收阻塞项。

## 实际浏览器复查与追加修复

已检查八个模块的 Desktop / Mobile 代表样本，并对照对应 Figma 截图；覆盖不等于全量变体完成。以下均已实施，并对关键结果刷新后复查：

- Desktop Mainline 预览在宽文档区保留 690px，避免右侧控制栏压缩组件而改变换行。MM 单图及主结果换行已实际检查。
- Desktop Rich 修正轨道额外宽度导致的第四张露边、箭头偏高；末尾滚动限制在内容末端。点击 Next 后最后三张卡完整，Next 隐藏，Previous 显示。
- Mobile MM 三图的右侧两张采用与稿件一致的宽图素材，修正裁切；单图、三图、Video 已实际检查。
- Mobile Mainline Expansion Single 的标题、Snippet 占位文案按稿修正；展开答案限制七行。Keyword 展开、收起和重新展开已实际检查。Summary 选择 Keyword / Sentence 会直接展开，选择 Default 则收起。
- Sectional Rich 区分 Desktop 宽图和 Mobile 方图；渐变采用透明 20% 到黑色 60% 的 80% 位置，并加渐进模糊。Desktop / Mobile 均刷新检查。
- Mobile Sectional Expansion 列表横向拉满 342px，修正继承 align-items 导致分隔线随文字收窄；列表间隔及 Learn more 下方间距改为 12。Fact 展开、关闭、再次展开无重叠。
- Desktop Sectional Fact 小卡内部最小高 68，使标题、标签及图片位置与当前稿对应。
- Mobile Sectional Nav 主标题间距、Show more 宽 163 / 上方间隔 12、右栏标题上方距离修正。默认四条与展开六条实际检查。
- Mainline / Sectional Nav 的 Desktop 占位链接文案改为当前稿的 Lorem ipsum dolor consectatur，Mobile 改为 Deeplink；Sectional 两张文章卡来源分别为 2h / 3h。

### 实际画面覆盖

| 模块 | Desktop | Mobile |
| --- | --- | --- |
| Algo | Standard | Standard |
| MM | 单图 | 单图、三图、Video |
| Rich | Title 默认与滚动末尾 | Title 默认，第二张局部露出与设计一致 |
| Expansion | Multiple 默认 | Single 默认、Keyword 展开与收起 |
| Nav | 六链接 | 六链接主样本 |
| Sectional Rich | 主结果 + 双卡 | 主结果 + 横向双卡 |
| Sectional Expansion | Fact 默认 | Fact 默认、展开、关闭再开启 |
| Sectional Nav | With Magazine 默认 | With Magazine 默认、Show more 六链接 |

上述覆盖包含本次连续走查及修复后复查。尚未完成全部 content × accessory × state 组合逐屏对照；Mobile Wiki / 无图、Mainline Multiple Sentence、Nav Compact 等仍有仅上下文和自动检查的部分。完整 Example 的非核心附属内容也未全部验收。Dark 没有本轮 Figma 基准，不声明按稿通过。

检查覆盖：九页导航与依赖；Anatomy 标注；36 个 Desktop 类型/状态；33 个 Mainline Desktop/Mobile 组合与交互；24 个 Sectional Expansion 组合（图片条件、唯一 ID、按钮关联、关闭再开启、导出样式）；顶层 JS 语法及 CSS 本地资源路径。

原始 SDL、Figma 和历史 V5 ZIP 未修改，未发布。SDL 缺失及源头六/八链接冲突仍单独追踪；本轮样式修复不等于补齐原始 SDL。

最终回归：library-navigation、anatomy-navigation、desktop-state（36 组合）、mainline-mobile（33 组合）、sectional-mobile（24 组合）全部通过；本轮修改的七个 JS 文件语法通过。Nav 回归基准仅允许本轮经 Figma 确认的占位文案更新，其余 Desktop 历史结构比较保留。这些自动检查是状态及结构检查，不代替画面验收。
