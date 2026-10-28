# AIGC ACF Component Library

将 [AIGC ACF Figma](https://www.figma.com/design/8voz5X3e3lPITEt9q5bbUe/AIGC-ACF) 中指定的 13 个页面转换为与 MM_ACF 同形式的组件库。

已实现 17 个可独立使用的 React 组件：12 个主组件和 5 个嵌套部件。每个组件都有属性面板、实时预览、JSX 复制和 Mosaic SDL v2 输出。Playground 支持 Creator、SERP、空白画布、增删排序、属性编辑、JSON 状态恢复及页面导出。

- 来源：13,937 个真实节点、16 个源组件族、75 张原始图片；截图之外的页面未提取。
- 架构：React + TypeScript + Vite；HashRouter、相对 base、registry、Workbench、Playground 和 SDL adapter 沿用 MM_ACF。
- 设计：保留原始变体值、尺寸、文案、图片和图标路径；Roboto 字体随站点加载。
- 图片：74 张静态图优化为 WebP，1 张动画 GIF 保留；运行图片约 12.9 MiB，原图保留在本地档案。
- SDL：17 个适配器使用参考仓库的 32 组件 catalog（CLI 1.0.969）；14 partial、3 candidate。

运行需要 Node 22.12+ 或 20.19+：

```sh
cd site
npm ci
npm run dev
npm test
npm run build
```

生产文件位于 `site/dist/`，可部署到静态 Web Hub 或任意静态站点子路径。原始导出档案和未优化图片不会进入部署包。

```tsx
import { MainContentArea, CreationComposer, SerpAigcAnswer } from './components'

<MainContentArea property1="Image3:2" selectedIndex={0} />
<CreationComposer state="typing" onGenerate={(prompt, mode) => { /* connect your service */ }} />
<SerpAigcAnswer state="Result" pageShell />
```

复制 JSX 时需要本库的组件、数据模块和 `figma/` 运行资产。此项目是完整源码工程，未发布为 npm 包。认证、生成、分享等保留回调，不会请求真实业务服务。状态 JSON 保存注册属性和交互值；临时焦点、悬浮及菜单展开不属于持久状态。SDL 的 catalog 校验不等于目标 Mosaic 渲染器的视觉与业务验收。

Playground 的 Download HTML 导出静态画面快照，内嵌同源图片、背景图和用到的 Roboto 字体及其许可。导出不包含 React 交互；无法内嵌的资源会在页面及 HTML 中明确列为告警。要继续编辑，使用源码或状态 JSON。

交付验收：40 项站点测试、12 项提取工具测试、695 种注册属性组合的 SDL catalog 校验及生产构建通过。详细范围与尚未验证事项见 `design/VERIFICATION.md`。

主要入口：

| 路径 | 内容 |
| --- | --- |
| `site/src/data/components.ts` | typed registry 与查询 |
| `site/src/data/component-registry.json` | 源属性、默认值与节点 |
| `site/src/components/` | molecules、controls、parts、assemblies、Workbench |
| `site/src/pages/Playground.tsx` | 页面装配与导出 |
| `site/src/mosaic/` | SDL builders、generators、validator |
| `design/COVERAGE.md` | 范围、映射和源文件差异 |
| `design/VERIFICATION.md` | 验证记录 |

重新提取：先运行 `node tools/figma-collector.mjs`，在 Figma 导入 `tools/figma-export-plugin/manifest.json`，运行 **AIGC ACF Local Read-only Export**。开发域名使用 `http://localhost:3846`，接收器仅监听本机。随后执行：

```sh
node tools/summarize-export.mjs design/figma-export/latest.json
cd tools && npm ci && npm run prepare-assets
cd .. && node tools/prepare-assembly-data.mjs && node tools/build-registry.mjs
```

源图层变更后仍需核对 React 实现。原始提取档案保留在当前工作区；交付压缩包只包含实现、来源说明、可复现工具和运行资产。
