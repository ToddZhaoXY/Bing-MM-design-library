# AIXA Bing Design Library · Source

## 2026-11-18 · Tokens

Tokens 作为第一个分区接入首页和所有库内导航，沿用现有文档视觉。
`projects/tokens/content.json` 保存来源网站的 426 条 Token 和其余可见内容；
`projects/tokens/assets/` 保存作者及案例图片；`scripts/tokens-library.mjs`
为标准构建和扁平部署共用的页面生成器。排除 Legacy v1.2 Card Showcase。
分类、搜索、复制、Light / Dark 对照、可视化样例和案例切换均在本地运行。
详情见 `projects/tokens/README.md`。下方为历史版本记录。

## 2026-11-16 · Loading optimization

首屏只加载轻量导航与介绍；组件工作台、Playground、来源目录和规则页按需加载。
`generate-overview.mjs` 从真实组件注册表和 SDL adapters 生成首屏统计，
`classic-chunks.mjs` 与 `classic-runtime.js` 将拆分结果编译为普通脚本，保留平面部署兼容性。
`ui/RouteLoading.tsx` / `.css` 提供共享 skeleton；`npm run sync:navigation` 同步副本。

部署必须保留清单中的全部分块文件。重试、受限 CSP、HTML/SDL 导出和移动端骨架
已验证；具体测量与测试范围见 `qa/startup-performance/OPTIMIZATION.md`。

## 2026-11-16 · Algo integration

当前整合 Image、AIGC、Video 和 Algo 四个并列分区；名称统一为
**AIXA Bing Design Library**。库内页面的跨库切换使用 Algo V8 的左侧图标／文字导航；首页保留原来的
全屏瀑布流、中央大标题和右上角入口，并补上 Algo。Algo 的原始文档、预览及资源保存在 `projects/algo/site/`，
哈希记录在 `projects/algo/UPSTREAM.json`；构建时统一路径并连接跨库导航。

共享入口生成器：`scripts/library-chrome.mjs`；导航样式和交互：
`shared/library-nav.css`、`shared/library-switcher.js`。详情见
`qa/algo-integration/VERIFICATION.md`。下方按日期保留历史改动说明。

## 2026-11-11 · SlideShow

按最新 MM-ACF 源稿将 SlideShow 更新为 15 个配置。新增三种尺寸的
`Bottom bars + arrows`，包含五段进度条、底部左右箭头和末尾 See more；
全部卡片移除外阴影。工作台、Playground、状态恢复及 JSX/HTML 导出已同步。
详见 `projects/mm-image/design/slideshow/update-2026-11-11/VERIFICATION.md`。

## 2026-10-29 · Unified sidebar

Image、AIGC、Video 共用 `ui/LibraryNav.tsx`，字体和层级规则位于
`theme/documentation.css`。分类及有子项的组件支持展开/收起，名称仍是独立页面链接。
进入页面时自动展开所在分类和父组件；手动收起不触发跳转。

修改公共菜单后运行 `npm run sync:navigation`，将生成副本同步到三个独立项目。
完整构建会自动同步；`build:reuse` 只检查同步状态，避免错误复用旧编译结果。
回归测试同时检查三个副本一致，以及全部组件路由和跨分类父子关系。

## 2026-10-29 · Image ACF Cards

当前源码新增统一的 Image cards 入口，位于 Molecules 最后；包含 13 个尺寸选项与
49 个 FY25 Image 布局配置，接入属性工作台、页面装配、
JSX／SDL 和离线 HTML 导出。下方“原始源码不变”描述的是最初 Portal 迁移；此次内容
扩充后的来源变更单独记录于 `SOURCE-UPDATES.json`，`ORIGINALS.json` 和 `BASELINE.json`
保留初次导入记录。验证命令同时核对未改动原件与已记录的 Image 更新。
详细验收见 `projects/mm-image/design/fy25-cards/VERIFICATION.md`。

综合首页 + Image / AIGC / Video / Algo 四个独立 Library 分区。
这是新的独立版本，之前的 Hub / Refined 项目和部署包没有被覆盖。

## 本次修复

旧入口通过 iframe 显示三个网站，并直接读取子 frame 的 document 和 history。
在禁止嵌入或隔离来源的环境中，这段读取可能抛出 SecurityError，Loading 提示无法结束。
已用旧版真实 ZIP，在本机禁止 iframe 的托管环境中复现同样的持续 Loading。
未收到实际线上网址，因此该复现不能代替对用户真实托管配置的确认。

新版不再嵌入子网站：

- 首次打开 `index.html` 是静态可读的综合首页，带三套库的入口和动态瀑布流。
- `mm-image.html`、`aigc.html`、`video.html` 是三个根目录独立入口。
- 每套库都有 All libraries 和其他库的直接链接，不需要 iframe 权限。
- 应用发布为普通 defer/IIFE 脚本，不依赖 ES module 的初始加载/CORS 机制。
- 启动检测检查真实渲染内容；缺文件、脚本拦截、超时会显示说明、重试和备用入口。
- 三套原始 React 组件、注册表、数据、SDL 和导出源码仍保持不变；沿用精修版 UI。

初版首页只保留中央大字标 `MM Design Libraries`、指定的一句描述和右上角三个入口。
标题最大 5rem（默认 80px），桌面中央雾面最大 1280 × 480px，不随超宽屏继续放大。
现有 Figma 源素材组成环绕式瀑布流；18 张缩略组件分别链接到 9 个真实组件详情页，不是生成或播放服务。
循环副本也能点击，可通过浏览器在新标签页打开；中央文字及雾面不会阻挡点击。
各列以约 22–28 px/s 匀速、无缝、交错方向滚动，右下角图标可暂停/继续。
鼠标停在背景上不会暂停。小屏同样可滚动，系统减少动态偏好下保持静态；后台页面暂停以节省资源。
键盘聚焦组件时，该列切换为静态可滚动列表；循环副本不重复占用 Tab 顺序。

## 一键部署

交付目录：`../Design-Systems-Portal-delivery/`。

- `Design-Systems-Portal-one-click-deploy.zip`：根目录直接包含 `index.html` 及三个库入口，上传/解压即可，不需要 npm 构建。
- `Design-Systems-Portal-source.zip`：可重建源码、测试、样式、资源及来源文档，不含 node_modules、构建缓存或大型设计提取原档。
- `SHA256SUMS.txt`：两包校验值。

请使用**全量新包**替换旧部署，保留 `systems/`、`theme/`、`showcase/` 等目录。
发布目录选解压后的根目录，不要只上传一个 HTML。支持域名根路径和站点子目录。

不需要 SPA history fallback；库内依然使用 hash 路由。
例如 `video.html#/c/short-card`。旧总入口 `#/video/c/short-card` 会迁移到对应独立页面。
`systems/<library>/index.html` 也保留为备用入口。

托管要求：能提供 HTML/CSS/JS/图片等静态文件，允许本网站脚本和同源 base URL。
允许 `X-Frame-Options: DENY` / `frame-src 'none'`，新版不要求放开 iframe。
若自定义 CSP，`base-uri 'self'` 可支持根目录别名入口。建议 HTTPS，以启用剪贴板功能。
HTTP(S) 是支持的访问方式；不把双击 file:// 当作部署验证。

## 导航与编辑状态

三个 library 现在是普通独立页面。跨 library 导航会切换文档，不再维持三个 iframe
同时挂载。离开前如需保存工作台编辑，请使用原有完整状态导出/导入；也可用浏览器
“在新标签页中打开”保留当前工作台。不要把浏览器返回缓存当成持久化存储。

## 本地开发

Node.js 22.12+，npm；打包需要 zip/unzip。

```sh
npm run setup
npm run build
npm test
npm run test:systems
npm run verify:sources
npm run preview
npm run package
```

默认预览：`http://127.0.0.1:5196/`。原版 5190、精修版 5193 不受影响。

`setup` 在三个子项目分别运行 npm ci。当前机器为节省空间使用的依赖软链接不进入源码包。
解压新源码包可正常安装；setup 检测到现有依赖软链接会停止，避免改动共享依赖。

仅改首页/主题/导航时可用 `npm run build:reuse`，前提是三个子项目已有 dist。
预览不是热更新服务器，修改后需要重建并刷新。

## 结构

```text
portal/                     首页 HTML、CSS、渐进增强脚本和本地展示素材
shared/                     每个 library 的顶部导航样式和启动诊断脚本
theme/                      保留的文档/工作台精修样式；构建时变量展开为常量
projects/{mm-image,aigc,video}/site/
                            三个原始 React 项目，源码不改
scripts/library-page.mjs     独立 entry HTML 和 classic bundle 生成
scripts/build.mjs            完整组合构建
tests/{portal,boot,home}.test.mjs
                            当前入口、错误恢复、路径与动效测试
qa/                         仅开发用受限托管/缺文件/窄屏验证工具，不进入发布包
dist/                       最终网站；index.html 与三个 library HTML 位于根目录
```

原 `shell/` 和旧入口测试保留为迁移参考，不进入新生产目录；当前 npm test 使用 package.json
列出的三个新测试文件。来源证明见 ORIGINALS.json；之前版本的审计基线仍保留。

## 验证与原有边界

验证记录见 [VERIFICATION.md](VERIFICATION.md)，实现阶段记录见 [WORK_LOG-PORTAL.md](WORK_LOG-PORTAL.md)。
原 Image 外部搜图依赖网络与服务 CORS；Video 两处源页面缺口照旧保留。
静态部署不增加生成、登录、搜索代理或真实视频播放后端。
