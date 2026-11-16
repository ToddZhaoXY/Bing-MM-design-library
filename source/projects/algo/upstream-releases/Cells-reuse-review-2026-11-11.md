# Cells 复用评估 — 2026-11-11

> 2026-11-12 更新：按 Chris 最新范围新增 Favicon、Attribution 两类独立 Cells；共六类、15 页导航。此前“来源与图标不单列”的判断已被替代。候选及提取边界见 [本轮记录](Cells-candidates-2026-11-12.md)。本次未上传 GitHub。

> 当前更新（Cells 独立文档）：四个 Cell 各自使用独立页面（cells.html、cells-article-card.html、cells-action-card.html、cells-download-card.html）。顺序为 Overview 预览与控件 → 同 Organisms 样式的 Code 栏 → Properties → Used in；不增加独立 Example。右侧目录仅显示 Overview / Properties / Used in。所有 13 页侧栏和搜索已更新，旧 Cells 锚点链接兼容跳转。Code 当前为共享渲染器生成的 HTML，尚无独立 Cell SDL，不标为 SDL。Used in 跟随设备并打开对应 Organism 的 Magazine / Actions 变体。此前单页目录、锚点导航和“等待提取”说明均已被本更新替代。
>
> 本次验证：13 页导航及依赖检查、8 组 Support Card 与 Image Card 原始渲染回归通过；Edge 实际打开四个独立页面，检查 Article 的 Mobile / 带摘要切换与复制成功，并验证 Used in 打开 Without Magazine。此项不代表整个库全部 Figma 变体已完成视觉验收。


> 提取实施更新：用户已要求实际提取。Cells 页面现已展示 Image Card、Article Card（普通 / 带摘要）、Action Card、Download Card，四类五种内容变体；与 Sectional Organisms 共用 algo-cells.js 渲染器。Desktop / Mobile、有图 / 无图、Properties、来源、HTML 复制均已接入。下文“尚未拆组件”的段落为历史评估，不再代表这四类的当前状态。


> 最新导航决定：用户已明确确认 Organisms 收纳现有 Mainline / Sectional，Cells 必须保留独立入口。已在十页导航、搜索和移动端菜单落实，并创建 cells.html 说明页面。Cells 内容等待后续提取指令；不增加 Molecules。下文移除 Cells / Organisms 的记录属于已被替代的历史解释。


依据用户提供的会议记录：其他 Designer 是否需要拿这个完整单元去组合新的组件，是独立拆分和展示的判断标准。复杂度、是否含有 Title / Badge / Button 均不作为分类门槛。实际团队需求尚未确认，以下是候选评估，不是已确认的拆分清单。

对外继续按 Mainline / Sectional 展示完整模块，不增加 Molecules，不强制改为 Cells / Organisms 树状层级。内部可复用实现不必全部成为外部导航条目。

| 候选单元 | 可能的实际组合场景 | 必须保留的完整边界 | 当前建议 |
| --- | --- | --- | --- |
| Sectional Rich 图片内容卡 | 在新的结果区内组合多个内容入口 | 图片、标题、来源、目标链接及完整点击范围；保留设备变体 | 优先候选。先校正 Mobile 横向双卡，再确认外部复用需求；不重复展示整个 1+2 结果区 |
| Sectional Nav Article / Article with description | 在其他 Feature 内容栏组合文章推荐 | 标题、可选摘要、来源、可选图像、点击目标 | 优先候选。按内容差异提供变体，不为每张示例文章新建组件 |
| Sectional Nav Action / Download | 在其他功能结果中加入登录或下载入口 | 标题、说明、配图 / 图标、操作文案和操作目标 | 优先候选。完整卡本身可复用，不能只提取按钮替代整卡 |
| Mainline Rich 内容项 | 组合新的横向内容列表或相关入口 | 标题、图像 / accessory、事实 / 摘要 / URL 变体、目标与状态 | 条件候选。确认是否需要脱离现有轮播复用；滚动和箭头属于外层 |
| Expansion Wiki / Fact 条目 | 在其他 Feature 组合主题或事实列表 | 标题 / 数值、摘要、可选图像、详情和跳转、设备形式 | 条件候选。Desktop 卡片和 Mobile 扁平列表不同，不能为了统一 Cell 形状合并设计 |
| MM Image / Video Result | 在其他搜索场景放置完整媒体结果 | 来源、标题、媒体、摘要、元信息及目标 | 已有完整模块入口，无需为增加 Cells 分类再重复建一份；若确认只复用独立媒体卡，再按实际需求定义 |

## 暂不独立展示

- Attribution、favicon、title、snippet、badge、button、divider：可内部维护复用，但没有独立组合成新 Feature 的需求证据。
- 单独裁下来的图片或带播放图标的缩略图：不能仅因为视觉独立就认定为完整可用的 Video Cell，需要明确内容和操作边界。
- 完整 Mainline / Sectional 模块：继续保留场景入口，不因对应 MM 的 Organisms 就更改外部命名。

## 当前落实与后续边界

已移除九页导航和首页的 Cells 总分类、Molecules 占位，并保留 Mainline / Sectional。此处“候选”只说明值得验证的复用场景，不代表已有 Feature Team 承诺使用。尚未拆组件、写入 Figma 或增加独立 Cells 导航。后续与 Multimedia / Video / AIGC 负责人对齐大框架时，以实际查找、拖放和组合方式验证候选，再决定粒度与展示位置。
