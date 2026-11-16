> 当前覆盖与链接缺项请参见 [2026-11-10 对齐走查](../../releases/Figma-alignment-audit-2026-11-10.md)。本文件保留各批导入来源，早期“未提供链接”可能已由后续映射补齐。

Algo Block — Standard / Desktop: user-provided original SDL copied from the Mosaic SDL V2 panel, template cmGMEnamyYzQ2WHusE7CX, shown as version 13 of 13 in the supplied screenshot. Export contains sdlVersion 1.5; preserved without changes, including the embedded favicon. Raw payload: algo-standard.desktop.json.

Algo Block — With fact / Desktop: user-provided original SDL, preserved without changes (19,327 bytes; sdlVersion 1.5). Contains four label/value facts. No template URL supplied; the Standard URL is not reused. Raw payload: algo-fact.desktop.json.

Algo Block — With list / Desktop: two original user-supplied SDL payloads, preserved unchanged. Clickable (24,700 bytes) has item navigation links; Unclickable (22,060 bytes) keeps entries as text. Both retain title and full-list navigation. Template URLs not supplied.

MM Algo Block — Image Caption / Desktop: three user-supplied original SDL exports for image counts 1 / 2 / 3. Payloads and embedded images are preserved exactly. Raw files: mm-image-1.desktop.json (76,007 bytes), mm-image-2.desktop.json (119,442 bytes), mm-image-3.desktop.json (138,085 bytes). Mosaic template URLs not supplied.

MM Algo Block — Video Caption / Desktop: user-provided original SDL, preserved unchanged (140,294 bytes). Identified by the 231.22 × 130 video thumbnail, 99:99 duration, Author / Views metadata and four-line video snippet. Raw payload: mm-video.desktop.json. Mosaic template URL not supplied.

Mainline Rich Nav Carousel — Title / Default thumbnail / Desktop: user-provided original SDL, preserved unchanged (139,442 bytes). Contains the primary result, carousel heading and five image/title links, without additional fact, snippet, URL, rating or duration fields on the items. Raw payload: rich-title-default.desktop.json. Template URL not supplied.

Desktop Expansion — four original user-supplied SDL payloads, preserved byte-for-byte, including embedded images. All exports describe a static preview with the first section expanded; the website interaction remains unchanged. Mosaic template URLs not supplied.

- Multiple Image / Keyword: `expansion-multiple-keyword.desktop.json` (100,706 bytes).
- Multiple Image / Sentence: `expansion-multiple-sentence.desktop.json` (126,202 bytes).
- Single Image / Keyword: `expansion-single-keyword.desktop.json` (63,550 bytes).
- Single Image / Sentence: `expansion-single-sentence.desktop.json` (63,606 bytes).

## Desktop Sectional SDL batch

Eight unique original exports were imported unchanged. Provenance, byte counts and hashes are in `sectional-import-manifest.json`.

- `sectional-rich:desktop:sectional:plain` → `sectional-rich.desktop.json` (162,984 bytes).
- `sectional-expansion:desktop:wiki:all` → `sectional-expansion-wiki.desktop.json` (153,252 bytes).
- `sectional-expansion:desktop:fact:all` → `sectional-expansion-fact.desktop.json` (145,276 bytes).
- `sectional-nav:desktop:parts:links-eight` → `sectional-nav-links-eight.desktop.json` (52,374 bytes).
- `sectional-nav:desktop:parts:article-source` → `sectional-nav-article-source.desktop.json` (70,444 bytes).
- `sectional-nav:desktop:parts:article` → `sectional-nav-article.desktop.json` (70,175 bytes).
- `sectional-nav:desktop:parts:links-six` → `sectional-nav-links-six.desktop.json` (47,190 bytes).
- `sectional-nav:desktop:parts:signin-source` → `sectional-nav-signin-source.desktop.json` (29,795 bytes).

Duplicate exports were not added twice:
- `7dc0043a-1d9c-4cee-909d-79ee7e55e9f2` is byte-identical to `f365ba7f-90f6-4c7d-b365-c5a8d17bdbc3` (six navigation links).
- `ff0f46a6-7132-48ae-b049-5b3ea8efce0e` is byte-identical to `746536c9-1bd1-4389-bfd3-16910a57f10f` (Sign-in card with source heading).

The Nav exports are partial components: eight-link primary column, six-link primary column, first article with source heading, second article, and Sign-in with source heading. The code panel explicitly labels their scope and also offers the complete layout as HTML. No complete Nav composition or Download export was supplied. The eight-link source differs from the current six-link website preview; original source is preserved, rather than silently rewritten. Wiki / Fact originals cover the all-image setting only. Other image settings retain their HTML previews. No exact Mosaic URLs accompanied this batch, so unrelated template links are not assigned to the imported payloads.

Mainline Nav / Desktop: original JSON supplied inline in this chat, preserved unchanged from its opening to closing brace (56,450 bytes). Root label: `Nav Mainline — Figma 299:2058`. Contains attribution, title, two-line snippet, six deeplinks and More results. Embedded JPEG favicon and SVG chevrons retained. Source token `foreground-750` is preserved; the website preview keeps its previously agreed 60% snippet color. Raw payload: `nav-mainline.desktop.json`. No exact Mosaic template URL supplied.

## Derived Sectional Nav Download

`sectional-nav-download.derived.desktop.json` is derived from the supplied Sign-in source at the user's suggestion. This is not an original Mosaic export. Changes: Application name title, Download for Windows label, placeholder download destination, arrow-download button icon, 56px app thumbnail before the title/description, and a bottom-aligned button. Original Sign-in payload is unchanged. Code sample labels this option Derived SDL.

### MM Desktop Mosaic template links

User supplied the Image Caption URLs in 1 / 2 / 3 image order and Video Caption separately:

- 1 image: https://mosaic.ai.microsoft.com/templates/VhdeG4N3JR8uCh5tV97Sa
- 2 images: https://mosaic.ai.microsoft.com/templates/sTEBV263m7VyJRMMMNj6D
- 3 images: https://mosaic.ai.microsoft.com/templates/ciSNjSvH6bWSaz8ERLDoH
- Video: https://mosaic.ai.microsoft.com/templates/hGMxJSJ66SRNkfhuA8n1s

These URLs are mapped only to the corresponding original Desktop MM exports. Raw SDL payloads are unchanged.

- Mainline Rich Caption / Carousel layout: user-supplied Mosaic URL https://mosaic.ai.microsoft.com/templates/yzDKmtFYLXZtuQgxKaz8d mapped to the imported Desktop Title + Default SDL. Other variations remain unmapped pending their corresponding exports/template scope.

### Mainline Nav and Expansion Multiple Images template links

User explicitly confirmed these Desktop mappings:

- Mainline Nav: https://mosaic.ai.microsoft.com/templates/V2V93NozvKQFVvyEWG5gW
- Expansion / Multiple Images / Keyword: https://mosaic.ai.microsoft.com/templates/SaehK1xURsaCXM77h9PBv
- Expansion / Multiple Images / Sentence: https://mosaic.ai.microsoft.com/templates/uD926KdTVU7Azpmn8NCti

Only template URLs were added; original SDL payloads are unchanged.

### Expansion Single Image template links

User explicitly confirmed these Desktop mappings:

- Expansion / Single Image / Keyword: https://mosaic.ai.microsoft.com/templates/7ixEqT9uNKaYNcEcDVT5N
- Expansion / Single Image / Sentence: https://mosaic.ai.microsoft.com/templates/Hh7Vvr8xHZdvsrZwGfu9v

Only template URLs were added; original SDL payloads are unchanged. All four Desktop Mainline Expansion variants now have confirmed Mosaic links.

### Sectional Rich Caption and Expansion template links

User confirmed these Desktop mappings:

- Sectional Rich Caption / 1+2: https://mosaic.ai.microsoft.com/templates/FaSwTuPVZvnsoGXRhQqfB
- Sectional Expansion / Wiki / all images: https://mosaic.ai.microsoft.com/templates/xuu3tQYTc4eBALetrgQHV
- Sectional Expansion / Fact Layout / all images: https://mosaic.ai.microsoft.com/templates/4a29aHkgGaXBBQnnhMGSx

The Wiki URL's trailing pasted punctuation `。//` was removed. Links are assigned to existing original Desktop exports only; raw payloads are unchanged. Mixed-image / text-only and Mobile mappings remain unassigned.

### Sectional Nav template links

User confirmed six Desktop template links, in basic algo / Card 1 / Card 2 order:

| Layout | Part | Existing sample | Mosaic template |
| --- | --- | --- | --- |
| With Magazine | basic algo | links-eight | KDcLubh9E3mGdUx9YR1yW |
| With Magazine | Card 1 | article-source | meT5w9jJZ2ypgSUpKdyLF |
| With Magazine | Card 2 | article | ymjGGVEoVrQap9qiMuYNm |
| Without Magazine | basic algo | links-six | iC7xJHx57uijeTPDqWpoT |
| Without Magazine | Card 1 | signin-source | dTHZhKBMPErwsd6Ckdzg8 |
| Without Magazine | Card 2 | download-derived | vD6kGMHpA8iftykWaSHbx |

These URLs are exposed on the corresponding partial-component selections. The Download sample remains explicitly Derived SDL: a template link does not replace the missing original Download export. Full-composition HTML and Mobile remain unmapped. All SDL payloads are unchanged.
