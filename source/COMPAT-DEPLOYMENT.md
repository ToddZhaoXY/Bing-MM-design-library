# Flat compatibility deployment — 2026-10-21

This is a separate release, not an overwrite of the approved Portal or its ZIPs.
It addresses the highest-priority hypothesis: a host failing to publish or
resolve nested app scripts and their resources. VibeHub itself remains behind
Microsoft authentication; its actual failing response has not been observed.

## Changes limited to deployment

- No `<base>`, iframe, inline script or new external dependency.
- `index.html`, three library HTML entries, app JS/CSS, fonts, icons and images
  are all at the ZIP root. File names include the library name to avoid clashes.
- A TypeScript AST transform rewrites only asset-valued string/template literals
  in build output; CSS URLs and the HTML favicon are relocated as well.
- Original React/registry/SDL/export source files remain untouched. The relative
  image addresses emitted by the packaged SDL adapt to the new media locations.
- App JS/CSS use content-hashed names. Deploy the complete ZIP in one operation;
  do not mix an old HTML entry with a new set of app files.
- Startup errors identify the app script, retain CSP errors and attempt a
  bounded same-origin diagnostic that distinguishes 404, HTML and redirects.

## Build and verify

```sh
npm run build:compat
npm run test:compat
npm run package:compat
```

Uses the already-built child `dist` folders. Original sources are verified with
`npm run verify:sources` and `npm run verify:baseline`. The source build pipeline
and old `dist` are left unchanged. Output is in the sibling
`Design-Systems-Portal-Compat-delivery` folder; each ZIP includes BUILD-MANIFEST.json
and has a separate SHA-256 checksum file.

## Evidence for release 1b7bfc4c4b40

- Eight compatibility tests pass: flat layout, no base/frames/inline scripts,
  asset string/template/mask rewriting, binary equality, homepage preservation,
  manifest integrity, root/subpath resource resolution, and startup diagnostics.
- Existing Portal tests: 29 passed. AIGC and Video suites both exited successfully
  (40 and 57 tests respectively). Original 362 copied source files, refined 366
  frozen files and approved 836-file baseline verified unchanged.
- The actual ZIP was extracted into a fresh temporary directory and served at
  `/published/design/` with `base-uri 'none'; frame-src 'none'; script-src 'self'`,
  X-Frame-Options DENY, and nested-file requests deliberately rejected.
- Browser navigation MM Image → AIGC → Video succeeded. Each app rendered and
  dismissed its startup notice without a base element.
- MM Image Tile, AIGC Main image area and Video Short Card images loaded. Video
  Microsoft Start masks use flattened URLs; 2:3 ratio and Mosaic SDL reflect the
  selected state. MM Image component refresh and return-home navigation work.
- Deliberately missing AIGC app JS visibly reports its file name and HTTP 404.
- The old Portal ZIP and source ZIP still match their original checksums.

## Limits

This is local constrained-host verification, not a successful VibeHub deployment.
The host must still serve the uploaded HTML/JS/CSS/media files and allow same-origin
scripts. If it replaces even root JS requests with a login/index page, strips JS
uploads or prohibits scripts entirely, the package alone cannot override that
policy. The improved startup message is intended to expose the next actionable
failure without requiring access to browser developer tools.
