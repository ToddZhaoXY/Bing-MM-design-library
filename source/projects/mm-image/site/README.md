# MMACF site

Web component library for Multimedia ACF. Static Vite + React + TS build.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/, static, deployable to Web Hub
```

## Layout

```
src/
  data/components.ts   ← the registry. Prop schemas copied VERBATIM from Figma variant axes.
  data/tokens.ts       ← ACF token values pulled from Figma get_variable_defs.
  data/mosaic-sdl-catalog.json ← sanitized Mosaic full catalog snapshot (CLI 1.0.969).
  mosaic/              ← SDL generators + catalog-backed strict validator.
  components/          ← rebuilt previews + Workbench (variant panel + code generator)
  pages/               ← Home, ComponentPage
```

Adding a component = one entry in `data/components.ts`, one preview component, one line in
`RENDERERS` + `TAGS` in `pages/ComponentPage.tsx`. The variant panel and the JSX generator
come for free from the prop schema.

## Rules baked in

- **Bin is Eko's call.** `bin: 'TBD'` is the default and renders a neutral chip. Never infer.
- **Organised by level**, never by surface. SERP/IRP are variants within a level.
- Routing is `HashRouter` — Web Hub serves static files with no SPA rewrite.
- `base: './'` in vite config so it works from any intranet sub-path.

## Status

Slice 1 done: shell, level-first nav, Image Container fully dressed (4 select axes = 36
combos, plus 6 boolean slots), live preview, copy-code.

Mosaic SDL is available from every component page and from the full-page Playground export.
All 17 adapters emit flattened SDL v2 and validate against the bundled 32-component `full`
catalog (CLI 1.0.969). Support is graded as `available`, `partial`, or `candidate`;
unsupported platform chrome, masonry, overlay/hover, action-policy, gradient, and
container-corner behavior is reported as an explicit fallback/gap rather than silently
encoded as a made-up renderer instruction.
