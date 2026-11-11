# Small-card transcription and verification

Implemented `site/src/data/image-cards/small.ts`: 12 source variants in 5 dimension families.

| Family | Source node IDs | Dimensions |
|---|---|---|
| 2x2 | 16:7776 | 200 × 200 |
| 3x2 | 704:18885, 705:7425, 750:61777, 750:62130, 1266:15872 | 312 × 200 |
| 4x2 | 16:7859, 16:7852, 1779:1126 | 424 × 200 |
| 5x2 | 16:7872, 1268:1976 | 536 × 200 |
| 2x4 | 1283:22499 | 200 × 424 |

Every source has a `get_design_context` text response and screenshot under `context-small-{node-id}.*`. `context-small-geometry.json` records visible descendant geometry and fill identities. Additional leaf contexts resolve image and icon content hidden by unavailable Code Connect mappings. Mapped SerpImageCard/SerpButton files on a Windows path and weather demo imports are not present in this repository.

All photo fills have source image hash `ef79d4f453f2abe81aebe3638960ec536d09dafe`, matching the shared downloaded `windows-bloom.png`. The image pair in 705:7425 and carousel photo slots preserve their inspected oversized image geometry, centered inside clipped native flex wrappers. All images, labels, icons, carousel overflow and action surfaces use native descriptors; no source screenshot is a UI asset.

Eight additional local assets were downloaded from official Figma context asset URLs: image-multiple SVG, header/scroll/blue/see-all chevron SVGs, Instagram image, neutral gradient, social gradient. SVGs keep their root intrinsic dimensions. All eight are nonempty and have corresponding descriptor callsites.

The parent context of 750:62130 exported a neutral gradient despite the blue resolved source screenshot. An isolated `get_design_context` on `I750:62130;23712:60428;750:56186;100330:193676` returned the correct blue gradient (`f217b.png`, 126 × 20), now used by the social variant. Source screenshot sampling confirms backgrounds #f5f5f5, #ebf6ff, and #f8f4f1 as used by the variants. The warm 1779:1126 card has a neutral #f5f5f5 scroller solid overlay, as shown in its source.

Validation:

- Standalone TypeScript check passed for small.ts.
- Headless Chrome rendered all 12 descriptors with local Roboto fonts; all measured root widths/heights match the table.
- All local images decoded successfully in Chrome.
- Inspected the rendered overview and individual source/render pairs; targeted header alignment and gradient mismatches were corrected and rerendered.
- `context-small-rendered-{node-id}.png` and `context-small-rendered-overview.png` hold the final standalone visual check. These are descriptor render checks, not the final integrated workbench interaction pass, which is handled by the parent task.
