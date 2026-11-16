# Algo Design Library V7

Saved on 2026-11-12 (Asia/Shanghai). This note supersedes earlier Cells candidate counts and navigation descriptions.

## Changes

- Ten independent Cells pages: Favicon, Attribution, Deeplink Item, Image Card, Article Card, Action Card, Download Card, Rich Content Item, Wiki / Fact Item, and Carousel Navigation.
- Deeplink Item combines Standard and Expandable variants. Controls, preview, Properties, code export, Figma reference, and Used in switch together on Desktop and Mobile. The former Nav Link Item URL redirects to the Standard variant while preserving device selection.
- Result Title and Result Snippet are removed from the Cells navigation and search. Their old URLs redirect to the Cells entry; internal renderers remain available to Organisms.
- Favicon and Attribution each list all eight Mainline / Sectional Organisms under Used in, with device-specific links.
- Cells previews use content-driven height, centered specimens and modest vertical padding. Small components retain their actual design sizes.
- Carousel Navigation shows functional scrolling context without the artificial Position selector. Arrow position is centered on thumbnails, with equal space reserved on both sides. Rating and Video options remain on Rich Content Item and the full carousel.
- Action Card preview keeps its CTA in the left copy column near the image bottom, correcting excessive Mobile spacing.
- Mainline and Sectional navigation headings use smaller type and medium weight to distinguish them from Overview / Cells / Organisms.
- Rich Content Item, Wiki / Fact Item and Carousel Navigation remain candidates for review. Existing confirmed card/source cells retain their source markup and shared renderers.

## Validation and limits

All top-level JavaScript syntax checks and seven regression scripts passed, including 19-page navigation/search, 128 expandable-row combinations, 24 Wiki/Fact compositions, shared renderers, device-specific source links and unified Deeplink variant behavior. Archive CRC and exact file-byte checks passed.

These are functional and structural checks. Full browser/Figma visual acceptance of every variation and Example remains incomplete. Recent layout refinements have not been independently visually verified in a browser.

## Pending decisions

- Cells expose HTML code; no independent Cell SDL or JSX is claimed.
- Original Mobile SDL and remaining Desktop SDL coverage are still pending as recorded in prior audit reports.
- This update is uploaded as a GitHub pull request. Merging and VibeHub deployment are separate from creating this snapshot.
