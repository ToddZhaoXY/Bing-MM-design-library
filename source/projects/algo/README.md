# Algo Library import

Imported from https://github.com/gim-home/algo-design-library at commit
`5c18515471dc3b0fc941ed8d7cf6e86d785378a8` (V8) on 2026-11-16.

`site/` is the complete, unchanged upstream application and assets. `UPSTREAM.json`
records every imported file hash. Historical release documentation is kept separately
in `upstream-releases/`; those notes are source evidence, not integration instructions.

`../../scripts/algo-library.mjs` adapts URLs at build time for the shared flat release,
replaces the four placeholder rail destinations with shared real navigation, and
makes the header return to the AIXA homepage. Algo Intro and its breadcrumb still
open the Algo overview. All component markup, variants, source metadata, examples,
code samples and theme controls remain upstream implementations.

The shared navigation lives in `../../scripts/library-chrome.mjs`,
`../../shared/library-nav.css`, and `../../shared/library-switcher.js`.
The V8 source has no package manifest and needs no separate dependency installation.
