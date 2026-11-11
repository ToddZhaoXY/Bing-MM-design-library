# Wide-card verification

- 21 source cards read through `get_design_context`, with Code Connect enabled; all returned screenshots inspected and saved as `context-wide-reference-*.png`.
- Source groups: 5x4 (9), 6x4 (5), 8x4 (2), 9x4 (1), 11x4 (1), 11x2 (3).
- Native descriptor TypeScript compilation passes. Every source image uses the downloaded source wallpaper; the source leaf download and shared file have identical SHA-256 `3416a4dd979e41ce3c9e70e98bafcc71bce47e70ebddb0d34a22d0887e8249a7`.
- All six runtime assets are nonempty local files. No screenshot is used as a runtime asset.
- Browser inspection of `context-wide-qa.html` confirms source-size gallery, mosaic, and carousel layouts; all image elements load. Effective first-variant image bounds are 323x424 and 211x211.
- Image crop verification (`context-wide-image-check.py/json`) compares source screenshots with a PIL simulation of CSS cover and the recorded enlarged hover leaf bounds. This is a source-geometry crop check, not an end-to-end screenshot test of the integrated application. All 21 source variants are represented, with mean cropped RGB error 1.088–4.624 out of 255. The rail screenshots include the 30 px protruding arrow/shadow extent beyond their 1208 px node width.
- The common `imageTransform` does not require additional zoom: base center-cover has whole-hero mean RGB error 2.687; applying 1/0.8775 zoom increases error to 31.755. Hover instances retain their separately recorded 115% image bounds.
- In-source mappings point to unavailable `C:\code\entity-segments`, weather-wrapper, and another user's icon files; local MM ImageContainer cannot express these exact crop/geometry variations. The central descriptor renderer supplies interaction and native composition.
- The 11x2 rail scroller is visible despite all five source images fitting exactly; integrated renderer should fall back to gallery when no horizontal overflow exists. The 5x4 carousel has genuine 872 px content within a 496 px viewport.
- Integration interactions, app-level theme behavior, and Mosaic exports are handled by the parent task.
