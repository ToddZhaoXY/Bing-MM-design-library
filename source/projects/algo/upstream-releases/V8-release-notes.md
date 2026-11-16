# Algo Design Library V8

保存日期：2026-11-13（Asia/Shanghai）。这是当前本地实现的独立快照，不覆盖 V1–V7。本文记录优先于历史版本中的页面结构、字体和导航说明。

## 本次封存

- 从全部 19 个正式页面删除右上角的站内搜索入口、搜索弹窗和搜索逻辑；同时清理专属样式。示例搜索页面中的搜索框、图标与内容保持原样。
- 保留主题切换、左侧分类折叠和手机导航。移除站内搜索后，完整 Example 与 Sources 弹窗的关闭按钮仍独立工作。
- Anatomy 与 Example 恢复白色背景卡片。真实搜索页面外框与灰色代码框统一圆角：常规视口 22px，600px 及以下 16px，包含放大预览。
- 组件展示区标题显示模块与当前 variation 名称，随选项更新，例如 Standard Algo Block、Algo Block with Fact、Algo Block with List；不再重复展示小变体标题。
- 顶部 feature 介绍与具体组件展示保持分开。Overview 说明与选项采用宽屏双列、窄屏堆叠；Desktop／Mobile 保留直接切换。
- 文档字体固定为 Source Sans Pro，删除字体切换入口并迁移旧偏好；预览组件内部的设计字体保持不变。
- 移除右侧页内目录及其占位。左侧组件导航保持折叠功能、统一字级与左对齐；Algo 使用 T 图标，AIGC 使用待确认的魔法棒图标。
- 包含本轮首页开放式组件目录、来源说明、文档间距、控件与表格风格、Anatomy 标号锚点以及 Sectional Example 适配的现有改动。详细过程见同包的 Spectrum-design-audit-2026-11-13.md。

## 验证

- 所有顶层 JavaScript 通过语法检查；19 页导航、对话框关闭以及七组既有功能回归通过。
- 移除搜索后进行桌面／手机浏览器检查，并验证完整预览打开、关闭与原位置恢复；具体结果保存在同包的 V8-browser-checks.json。
- ZIP 使用逐文件 SHA-256、CRC 和源文件／快照／压缩包字节一致性检查；独立清单与整包校验值保存在压缩包旁。

## 尚未完成的设计验收

- 组件命名与介绍文案尚未逐项对齐 Figma。当前为 with Fact，尚未统一成 with Facts；部分 Rich Nav Carousel 介绍仍需核对。
- Figma 颜色、描边、背景仍需逐项核验，尤其 ACF 灰色描边；不将屏幕共享中的偏黄直接视为缺陷。
- AIGC 魔法棒已实现，但尚待 Ann 确认。Rich Content Item、Wiki／Fact Item 与 Carousel Navigation 的候选状态及 SDL 覆盖限制仍按既有记录保留。
- 功能回归与响应式检查不等同于所有 variation 已通过 Figma 视觉验收。

## 文件与 GitHub

- Algo-Design-Library-V8.zip 的根目录就是网站根目录；解压后从 index.html 打开，或者通过静态服务器预览。
- 快照包含当前 HTML、CSS、JavaScript、public 素材及本轮发布记录，不包含旧版 ZIP、临时截图、私人配置或任何凭据。
- 本次操作只保存本地版本，尚未上传、提交或合并至 GitHub，也没有触发 VibeHub 部署。上传时保留仓库现有的 .github 配置与仓库密钥。
