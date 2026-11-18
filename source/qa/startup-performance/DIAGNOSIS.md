# Library startup diagnosis · 2026-11-16

Measurements use the local release at `http://127.0.0.1:5198/Bing-MM-design-library/`.
Browser cache was disabled. The slow profile uses 150ms latency, 200,000 bytes/s download throughput and 4x CPU throttling in desktop Chrome. These are controlled local observations, not measurements of a deployed platform or statistically averaged Web Vitals.

## Findings

1. Cross-library links open independent HTML documents. Image, AIGC and Video each load and mount a standalone React bundle; Algo uses a separate static-document implementation.
2. The old HTML displayed the startup panel, retry button and upload advice immediately. A 250ms poll removed it only after the root contained rendered children. After eight seconds, a slow load was incorrectly styled as a startup failure. After a minute, polling stopped permanently even if the app subsequently rendered.
3. In the slow profile, almost all time before app rendering was spent waiting for the main JavaScript response, not executing the startup notice. Navigation fonts also compete for bandwidth. This patch does not change application bundle size or server compression/cache headers.

## Measured UI behavior

| Library | Before: root / panel gone | After: root / panel gone | Before / after startup frames |
| --- | --- | --- | --- |
| mm-image | 102 / 317 ms | 106 / 106 ms | 16 / 0 |
| aigc | 58 / 304 ms | 38 / 38 ms | 17 / 0 |
| video | 47 / 288 ms | 28 / 28 ms | 17 / 0 |

The zero visible-frame result is the intended improvement. Differences in the small root-render times are single-run variability and are not claimed as a bundle-execution speedup.

## Main script sizes

| Library | Raw | gzip estimate | Brotli estimate |
| --- | --- | --- | --- |
| mm-image | 558.1 KB | 129.1 KB | 106.5 KB |
| aigc | 549.4 KB | 153.2 KB | 119.4 KB |
| video | 457.3 KB | 119.0 KB | 98.2 KB |

gzip/Brotli figures are local compression estimates of the current script bytes, not proof of the deployed server’s transfer encoding. The local preview intentionally sends `Cache-Control: no-cache` and no compression for development. The ZIP does not control a third-party host’s response headers.

## Implemented

- Do not display the startup panel for the first 400ms after its styles become active.
- Normal waiting says “Loading…” and has no failure/recovery controls. Slow loading stays informational after eight seconds. Actual script failures and security-policy failures keep their alerts and diagnostics.
- Observe the React root and hide the panel as soon as the app mounts, with a CSS readiness fallback.
- Stop periodic polling after sixty seconds while retaining the DOM observer for late completion.
- Keep the visibility timer functional under reduced-motion settings; it has no moving/fading effect.

## Validation

- Shared source suite: 37 tests passed. Compatibility suite: 9 tests passed.
- Final local manifest verification: 549 files and 1,968 root/subpath resource references passed.
- Browser measurements: all three React libraries have zero visible startup frames on normal localhost loads. Under simulated slow loading the informational panel appears, with no premature retry controls.
- Fault checks: reduced-motion and normal-motion settings; waiting beyond eight seconds remains informational; injected HTTP 404 retains its diagnostic; retry successfully recovers. No unexpected page errors.
- Simulated slow root readiness remained about 4.4–4.8 seconds. This pass removes the misleading flash and post-render delay; it does not claim to solve download latency.

## Next performance priorities

1. Reduce the initial bundle: load workbenches, Playground, export generators and source catalogs only when needed. The current flat classic-script deployment assumes one bundle per React library, so splitting needs corresponding packaging and route/export regression work.
2. Prefetch the next library on user navigation intent and reuse cacheable shared runtime assets. Keep prefetch bounded and optional on constrained connections.
3. Serve versioned scripts with suitable caching and gzip/Brotli; convert documentation fonts to WOFF2 while preserving their licensed source.
4. A persistent shared shell could avoid rebooting every library on a tab switch, but is a larger integration change because Algo and the three React libraries currently have different page lifecycles.

Changes are applied locally. The previous ZIP and GitHub branch remain the saved pre-optimization release; this experiment has not been repackaged or pushed.
