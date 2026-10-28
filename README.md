# Bing MM Design Libraries

The integrated MM Image, AIGC and Video component libraries, with the shared MM Design Libraries homepage.

**Website: https://toddzhaoxy.github.io/Bing-MM-design-library/**

## Browse

| Library | Entry |
| --- | --- |
| All libraries | [index.html](https://toddzhaoxy.github.io/Bing-MM-design-library/) |
| MM Image | [mm-image.html](https://toddzhaoxy.github.io/Bing-MM-design-library/mm-image.html) |
| AIGC | [aigc.html](https://toddzhaoxy.github.io/Bing-MM-design-library/aigc.html) |
| Video | [video.html](https://toddzhaoxy.github.io/Bing-MM-design-library/video.html) |

## GitHub Pages

The repository root is the complete, prebuilt static website. `index.html`, the three library entry pages, JavaScript, CSS, fonts and images are committed together. No build service or backend is required to browse the libraries.

In **Settings → Pages**, use **Deploy from a branch**, **main**, **/ (root)**. Pushing updated static files to `main` automatically redeploys the site. `.nojekyll` disables Jekyll processing. All local asset references are relative, so the `/Bing-MM-design-library/` project prefix works without changing the website. Component links use hash routes, such as `video.html#/c/short-card`, and can be refreshed directly.

## Local preview and verification

Node.js 22.12 or newer is required. The prebuilt site needs no dependency installation.

```sh
npm run verify
npm run preview
```

Open http://127.0.0.1:5198/Bing-MM-design-library/ to preview the same project prefix as GitHub Pages. Verification checks SHA-256 hashes, JavaScript syntax, all four entry pages, and HTML/CSS resource resolution at both root and project paths.

## Rebuild from source

The complete integrated project is preserved in `source/`, including the three React libraries, registries, export code, source assets, locked dependencies and existing tests. See [the source README](source/README.md) and [compatibility build notes](source/COMPAT-DEPLOYMENT.md) for the original implementation details.

```sh
npm run setup
npm run build
npm run test:source
npm run verify
```

`build` compiles all three libraries, generates the flat compatibility release, and updates the website at the repository root. It removes obsolete assets listed in the previous build manifest. Commit the resulting root files together with your source changes, then push to `main`. Generated intermediate folders and dependencies are ignored by Git.

The initial website uses compatibility release `1b7bfc4c4b40`, with the approved homepage, navigation and component behavior preserved. `BUILD-MANIFEST.json` records the published asset hashes. Original source provenance and historical verification notes remain under `source/`; references there to sibling projects describe the original development workspace.

## Existing capabilities and attribution

GitHub Pages hosts the library documentation, previews and client-side workbenches. External image search retains its original network/CORS requirements; generation, login and a video backend are not added by this deployment. Existing source-coverage notes are preserved. Font licenses, image-source notes and third-party notices are included alongside the assets and in `source/projects/`.
