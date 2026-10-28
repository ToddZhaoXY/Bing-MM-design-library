# MM Video ACF component library

将指定的 MM ACF Video 设计页面转换为可交互的组件库网站，沿用前一套
MM_ACF / AIGC-ACF 的 React + TypeScript + Vite、registry、属性工作台、
页面装配、JSX 和 Mosaic SDL v2 架构。

来源：[MM-ACF Figma](https://www.figma.com/design/fRSRroY4YFgJSeqLLE0Y38/MM-ACF)。
截图范围共 15 个内容页，详见 `design/scope.json`。

## 已提供

- 10 个分子工作台：Short Card、Video Metadata、Video Card、Source Icon、
  Magazine Card、Hero、More videos、Shorts list、Playlist、Supplemental。
- 3 个 Cell：Video Group、Shorts Group、Video Magazine Zone。
- 4 个已实现的 Organism：Video Mainline、Short Video Mainline、Short Video
  Go-wide、Video Magazine Page；包含源中已有的桌面／移动端场景。
- Foundations 规则、来源目录、属性控制、Fit／100% 预览、JSX／SDL 复制、
  页面增删排序、撤销、JSON 状态恢复和内嵌图片／字体的静态 HTML 导出。

19 个注册入口中有 2 个源缺口，页面已明确说明：长视频 Go-wide 原页为空；
VRP 原页只链接到另一份文件的 WIP 封面，没有提供 VRP 界面。

## 运行与部署

建议 Node 22 LTS（22.12+）：

```sh
cd site
npm ci
npm run dev
```

```sh
npm test
npm run build
npm run preview
```

构建结果在 `site/dist/`。一键部署 ZIP 直接打包该目录的**内容**，根目录为
`index.html`、`assets/`、`figma/`；上传静态托管平台后，构建命令留空、
发布目录选压缩包根目录即可。使用相对资源路径和 HashRouter，可托管在子路径。
网站需要通过 HTTP(S) 访问，Playground 路由为 `#/playground`。

## 组件使用

```tsx
import { ShortCard, VideoGroup, SerpVideoAnswerMainline } from './components'

<ShortCard ratio="2:3" metadataPosition="Below" state="Default" />
<VideoGroup configuration="Horizontal / SERP / Below" />
<SerpVideoAnswerMainline configuration="Desktop Hero folded" pageShell />
```

复制到其他工程时一并包含组件、数据模块、CSS 和 `figma/` 运行资产。
组件是可继续开发的源码，目前没有发布为 npm 包。视频预览是源设计的状态演示；
实际媒体播放、搜索与产品导航由宿主回调接入，未构造虚假的视频流地址。

## 结构与来源

- `site/src/components/`：molecules、cells、organisms 和通用工作台。
- `site/src/data/component-registry.json`：驱动页面、属性和复制代码的 registry。
- `site/src/mosaic/`：SDL adapters、builders 和 catalog validator。
- `design/{molecule,cell,organism}-specs.json`：来源映射和注册属性。
- `design/figma-context/`、`design/figma-pages/`：设计证据和源差异记录。
- `tools/build-registry.mjs`：重新生成 registry 与 source catalog。
- `design/VERIFICATION.md`：实际测试、浏览器验收与限制。

运行 `node tools/build-registry.mjs` 可重建注册表。图像优化工具在 `tools/`；
原始大图保留于本地 `design/source-assets/`，不进入源码／部署压缩包。
Figma 临时下载地址仅作为来源记录保留，不用于运行时；重新获取源设计需要 Figma
访问权限和新的设计上下文。

SDL 沿用 CLI 1.0.969 的 32 组件 catalog：17 个 adapter 标为 partial，
2 个源缺口标为 gap。校验通过并不代表已通过目标 Mosaic 渲染器的视觉验收。
