# AIGC ACF handoff

The requested conversion is implemented: 13 screenshot-selected pages feed 17 React
workbenches, preserving MM_ACF's registry, property panel, JSX, page assembly and SDL architecture.
The original MM_ACF review checkout and the source Figma document were not edited.
No remote repository or deployment was created.

Source run: 2026-09-23T04-32-44-310Z-cad283cd; completed 2026-09-23T04:35:21.660Z.
13 pages, 13,937 nodes, 75 original images, 16 source families. Exact scope, source warnings,
duplicate spec cards and Figma IDs are in design/COVERAGE.md and the source catalog page.

The earlier blocker is resolved: Figma rejects http://127.0.0.1:3846 in devAllowedDomains;
http://localhost:3846 works. Do not repeat the earlier file-chooser diagnosis or ask for
routine authorization. The source desktop URL was visibly verified before extraction.

Development preview: http://127.0.0.1:5174/ (process session 21141).
Production preview: http://127.0.0.1:5175/ (process session 26623).
Collector session 38547 was used for extraction; restart only when needed.
Build/test: cd site && npm ci && npm test && npm run build.

React modules: AigcMolecules (3), AigcControls (5), AigcAssemblies (4), AigcParts (5).
Metadata: design/{molecule,control,assembly,part}-specs.json.
Regenerate the registry via node tools/build-registry.mjs.
Optimized images use the same Figma hashes and preserve original files.

Action row has four observed configurations but broken typed axes in Figma.
The library exposes a documented configuration selector. Source typo strings remain
unchanged. SDL is checked against the local reference catalog, not a live Mosaic product.
Authentication, generation, navigation and product actions remain host integration points.

See design/VERIFICATION.md for checks. Raw archives/unoptimized images are excluded
from production copies and distributable archives.

Delivery: 40 site tests, 12 tool tests and 695 SDL property combinations passed.
Portable HTML embeds local image assets and used Roboto fonts with their license;
it is a static snapshot, not a copy of React interaction logic. Browser file-URL
opening is restricted, so offline reopening is not claimed as verified.
