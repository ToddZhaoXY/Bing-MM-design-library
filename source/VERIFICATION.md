# Portal 交付验证 — 2026-10-21

## 最新首页修订

最新补充：标题上限 5rem（默认 80px），桌面雾面上限 1280 × 480px；
1920px / 2560px 实测保持同样尺寸。390px 无横向溢出，标题两行、三列展示保留。
18 张预览链接到 9 个真实组件页；循环副本同样可点，中央遮罩不会拦截鼠标。
实点验证 MM Image → Image Tile、AIGC → Main image area、Video → Short Card，
包含中央字标下的循环副本。键盘可聚焦原始预览，副本不重复进入 Tab 顺序。
本次 29 项自动测试通过，362 个原库文件及先前基线校验均未变。
滚动实测仍约 24px/s、23px/s；暂停 5.956 秒各列 transform 不变，恢复按钮正常。

按最新反馈：首页改为中央大号 MM Design Libraries、原 description、右上角三个入口。
背景为六/四/三列响应式瀑布流，中央雾面遮罩，不再有左侧列表、页脚或说明标题。

已纠正旧动画的可感知性问题：旧版只在24–31秒内移动24px且悬停会暂停；新版按实际
重复组高度无缝循环，22–28px/s匀速移动，不因鼠标停在背景上而停止。
实测27.832秒内四列分别移动约668/779/751/640px；暂停62.322秒后四列位移全部为0，
恢复后继续移动。1280px、837px及390px上下文检查没有整页横向溢出。
系统减少动态偏好继续生效。详见 HOME-REVISION.md 和交付目录 motion-verification.json。

本轮首页、加载保护及部署测试25项通过；362个原库源文件校验未变。
下方是此前独立页面迁移的验证记录，旧首页“8个预览/左侧入口”已被本节取代。

## 用户故障与已验证范围

用户截图显示页头可见，但主体持续 Loading；报告部署后两套库不可见。
用户未提供实际托管网址。以下是本地可复现证据，不把未查明的线上策略写成事实。

1. 上版 Refined 部署 ZIP 通过 unzip 完整性检查，三个 entry HTML 和 JS 均存在。
2. 将这个真实 ZIP 解压到独立临时目录，使用 `frame-src 'none'`、`X-Frame-Options: DENY` 提供服务。
3. 浏览器复现持续 Loading MM Image；旧 `app.mjs` 记录 SecurityError：无法读取跨来源 Window 的 document。
4. 新版不创建 iframe；在同样的限制与 `/published/design/` 子目录下，三个独立入口全部实际打开，根 React 内容正常，启动提示自动消失。

## 新版检查

- 三套原始源码/运行资源文件继续通过 ORIGINALS.json 的 362 文件 SHA-256 校验。
- 普通脚本输出通过 classic JavaScript 语法验证；保留原 app bundle 内容含义和其余资产字节。
- 直接入口与备用嵌套入口的 base、脚本、CSS、图片、导航和深层链接均校验。
- 缺脚本测试服务器真实返回 404：界面显示 This library did not start、明确的缺 JavaScript 说明、Try again / 返回首页 / 备用入口，不再永久等待。
- 首页在 JS 前就有内容和三套原生链接，未使用 iframe / module / 外部图片服务。
- 119 项自动测试：Portal/boot/home 22 项 + 原 AIGC 40 项 + 原 Video 57 项。
- 原 Video 测试继续覆盖 15,413 种 SDL 组合及 277 个 JSX 渲染一致性用例。
- 三个子项目完整 TypeScript/Vite 构建；全部发布文件通过受限子路径 HTTP 检查。

## 浏览器实测

- 首页默认 1280 × 720 视口中三个主要入口底边分别约为 514 / 586 / 658px，全部在首屏。
- 首页有 8 个源素材/组件预览，6 张本地优化图片约 552 KB。
- Pause motion 切换为 Resume motion，展示区 data-motion=paused；恢复按钮可继续动画。
- Video Short Card 的 ratio 切换为 2:3，SDL 显示 Catalog valid · 10 nodes；刷新正确恢复相同组件路线。
- Video 预览 3 个实际图片 complete=true、naturalWidth>0，说明相对图像路径仍成立。
- AIGC Creation composer 编辑 prompt 后，预览和 JSX 反映同一内容。
- MM Image Playground 正常进入，原有页面组装入口保留。
- 使用 390px 嵌套浏览上下文检查首页：内容宽 375px（扣除滚动条），scrollWidth=375，无整页横向溢出；瀑布流两列，动效自动 static。该检查不是手机真机验证。

## 交付和限制

静态 ZIP 根目录包含 index.html / mm-image.html / aigc.html / video.html。
两个新 ZIP 做完整性与 SHA-256 检查；旧项目及旧交付包不覆盖。

本轮验证的是本机模拟的静态托管策略，未在用户未知平台上部署或检查真实线上地址。
如果平台禁止所有 JavaScript、删除目录、改变 URL 或返回错误 MIME，仍需按诊断调整托管。
新版允许禁止 iframe，但仍需要本网站脚本、资源和同源 base URL。

独立页面导航不再保持三个工作台同时挂载；未保存的编辑需要原有状态导出/导入或独立浏览器标签页。
首页为源素材和静态组件缩略展示，点击进入真实 React 工作台；不伪造后端生成/视频播放能力。
未把所有组件路由、所有浏览器或导出 HTML 离线重开算成本轮已验证。
