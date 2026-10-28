# Portal / deployment repair — 2026-10-21

## Scope

Preserve Design-Systems-Hub and Design-Systems-Hub-Refined. This separate copy
adds a first-visit overview with a motion masonry showcase and links to three
independently navigable libraries. Existing React components, registry and SDL
logic remain unchanged.

## Evidence and hypotheses

- User screenshot: tab bar visible; Loading MM Image persists; two libraries
  reportedly unavailable after deployment. The actual hosted URL is not supplied.
- Previous deployment ZIP passes integrity and includes all three entry HTML/JS
  sets. Missing ZIP entries are not established as the cause.
- Original shell reads iframe.contentWindow.document/history without catch and
  only dismisses the loader after frame load. No render readiness or timeout.
- Candidate host issues: nested-frame restrictions, opaque/cross-origin sandbox,
  rewritten subpage URLs, blocked ES module loading. Must distinguish reproduced
  local failure modes from the unknown actual production configuration.
- Reproduced: exact previous ZIP under frame-src 'none' / X-Frame-Options DENY
  remains on Loading MM Image. Console: SecurityError reading child document
  from Window at old app.mjs. Actual hosted site is still not provided.
- New homepage and all three root library links render successfully under the
  same restriction at /published/design/. Startup status hides after real render.

## Chosen repair

- Remove production iframe embedding. Use root index.html overview plus root
  mm-image.html / aigc.html / video.html; retain nested entries for compatibility.
- Native links work before JavaScript. Root aliases use a correct relative base
  for unchanged source asset addresses and exports.
- Emit classic, bundled scripts for libraries (no module/CORS loader dependency).
- Add bounded render checks and readable failure diagnostics; do not cover a
  successfully rendered library behind an indefinite loader.
- Keep the refined UI theme; provide Home / all three library links per page.

## Stages and owners

1. Main: deployment diagnosis, multipage build, navigation, boot diagnostics/tests.
2. Homepage worker: portal/index.html, portal/home.css, portal/home.js and selected
   local source-based showcase assets. No remote images or made-up service demos.
3. Main: root/subpath/blocked-frame/sandbox/error checks, screenshots and archives.

Performance: static HTML first; bounded CSS transform motion, pause control,
reduced-motion support, no new frontend dependency/CDN, no hero autoplay video.
Style: refined, white/cool-grey, charcoal type, restrained blue; asymmetric
intro plus staggered gallery, with prominent honest links to all three libraries.

## Progress

- Homepage: 8 source-based previews, 6 optimized local JPGs (~552 KB), static
  first render, pause/reduced-motion support and safe old-hash migration.
- Build: three root HTML aliases and compatible nested entries, classic IIFE
  bundles, correctly based source assets, direct library/home links.
- 13 portal/boot/static-host tests passed, original 362 source files unchanged.
- Finishing deep-link/refresh/error/animation checks and final package QA.
- Follow-up home revision completed: centered wordmark/description, top-right
  native links, soft mist and measured seamless waterfall loops. Old bounded
  drift and hover pause removed. 25 current portal tests pass; see HOME-REVISION.md.
