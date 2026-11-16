# AIXA Bing Design Library

The integrated **MM Image, AIGC, Video and Algo** design libraries, with the original full-screen waterfall homepage and left-side navigation inside each library.

The 2026-11-16 integration adds [Algo Library V8](https://github.com/gim-home/algo-design-library) at commit `5c18515471dc3b0fc941ed8d7cf6e86d785378a8`: 19 documentation pages and three legacy redirects, including Cells, Mainline and Sectional examples. The icon rail, active marker and expand/collapse design come from Algo. All four destinations are real links; the selected rail width is retained when switching libraries. See [integration notes](source/qa/algo-integration/VERIFICATION.md).

The 2026-11-11 **SlideShow** update follows the latest MM-ACF source: 15 configurations,
including **Bottom bars + arrows** at all three sizes, and no outer card shadows.
Workbench controls, Playground state, JSX and HTML exports include the new mode.
See the [source and verification notes](source/projects/mm-image/design/slideshow/update-2026-11-11/VERIFICATION.md).

The 2026-11-10 UI refresh applies a Spectrum-inspired neutral canvas, rounded
documentation surfaces and unified controls across all three libraries. Existing
component renderers and source content remain unchanged. See the [design and QA notes](source/qa/spectrum-refresh/DESIGN.md).

The 2026-10-29 Image update adds one **Image cards** component with **13 size variants and 49
desktop layouts** from the supplied MM ACF FY25 frame. The component
includes source links, selectable layouts, Fit/100% previews, Playground
assembly, public JSX and an explicitly partial Mosaic SDL adapter. See
[source and verification](source/projects/mm-image/design/fy25-cards/VERIFICATION.md).

All three libraries now share hierarchical sidebar navigation: collapsible
categories and component branches, smaller indented child links, exact current-page
highlighting, automatic active-path expansion, and keyboard/touch support.

**Website: https://toddzhaoxy.github.io/Bing-MM-design-library/**

## Current local deployment package

`../Bing-MM-design-library-delivery/AIXA-Bing-Design-Library-2026-11-16.zip`
contains the complete four-library release. Its adjacent `.sha256` records the
archive checksum. The current integration has been verified locally; publication
to GitHub Pages is a separate step.

## Previous one-click deployment package

Download the [2026-11-11 deployment ZIP](https://github.com/ToddZhaoXY/Bing-MM-design-library/releases/download/v2026.11.11/MM-Design-Libraries-one-click-2026-11-11.zip)
and its [SHA-256 checksum](https://github.com/ToddZhaoXY/Bing-MM-design-library/releases/download/v2026.11.11/MM-Design-Libraries-one-click-2026-11-11.zip.sha256).
That historical archive contains `index.html`, the original three library entries and every required
asset directly at its root. Extract or upload the complete package together;
no dependency installation or build step is required on the hosting platform.
See the [release notes](https://github.com/ToddZhaoXY/Bing-MM-design-library/releases/tag/v2026.11.11).

## Browse

| Library | Entry |
| --- | --- |
| All libraries | [index.html](https://toddzhaoxy.github.io/Bing-MM-design-library/) |
| MM Image | [mm-image.html](https://toddzhaoxy.github.io/Bing-MM-design-library/mm-image.html) |
| AIGC | [aigc.html](https://toddzhaoxy.github.io/Bing-MM-design-library/aigc.html) |
| Video | [video.html](https://toddzhaoxy.github.io/Bing-MM-design-library/video.html) |
| Algo | [algo.html](https://toddzhaoxy.github.io/Bing-MM-design-library/algo.html) |

## GitHub Pages

The repository root is the complete, prebuilt static website. `index.html`, the four library entry pages and Algo detail pages, JavaScript, CSS, fonts and images are committed together. No build service or backend is required to browse the libraries.

In **Settings → Pages**, use **Deploy from a branch**, **main**, **/ (root)**. Pushing updated static files to `main` automatically redeploys the site. `.nojekyll` disables Jekyll processing. All local asset references are relative, so the `/Bing-MM-design-library/` project prefix works without changing the website. Component links use hash routes, such as `video.html#/c/short-card`, and can be refreshed directly.

## Local preview and verification

Node.js 22.12 or newer is required. The prebuilt site needs no dependency installation.

```sh
npm run verify
npm run preview
```

Open http://127.0.0.1:5198/Bing-MM-design-library/ to preview the same project prefix as GitHub Pages. Verification checks SHA-256 hashes, JavaScript syntax, all five main entry pages and the Algo detail pages, and HTML/CSS resource resolution at both root and project paths.

## Rebuild from source

The complete integrated project is preserved in `source/`, including the three React libraries, the original Algo V8 static site, registries, export code, source assets, locked dependencies and existing tests. See [the source README](source/README.md) and [compatibility build notes](source/COMPAT-DEPLOYMENT.md) for the original implementation details.

```sh
npm run setup
npm run build
npm run test:source
npm run verify
```

`build` compiles the three React libraries, integrates the Algo static site, generates the flat compatibility release, and updates the website at the repository root. It removes obsolete assets listed in the previous build manifest. Commit the resulting root files together with your source changes, then push to `main`. Generated intermediate folders and dependencies are ignored by Git.

The initial website uses compatibility release `1b7bfc4c4b40`, with the approved homepage, navigation and component behavior preserved. `BUILD-MANIFEST.json` records the published asset hashes. Original source provenance and historical verification notes remain under `source/`; references there to sibling projects describe the original development workspace.

## Existing capabilities and attribution

GitHub Pages hosts the library documentation, previews and client-side workbenches. External image search retains its original network/CORS requirements; generation, login and a video backend are not added by this deployment. Existing source-coverage notes are preserved. Font licenses, image-source notes and third-party notices are included alongside the assets and in `source/projects/`.
