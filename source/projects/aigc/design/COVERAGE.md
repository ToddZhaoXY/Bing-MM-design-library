# AIGC-ACF source coverage

This document describes the source collected for conversion and its mapping to the library. It is not a certificate of final visual acceptance, runtime Mosaic validation, or production integration.

Source: [AIGC ACF](https://www.figma.com/design/8voz5X3e3lPITEt9q5bbUe/AIGC-ACF). Export run: `2026-09-23T04-32-44-310Z-cad283cd`, completed `2026-09-23T04:35:21.660Z` through the read-only Figma Plugin API.

The 13 screenshot-selected pages are all present. They contain 13,937 unique node records, with no duplicate IDs or missing requested pages in `inventory.json`. The collected assets comprise 75 original image files and 174 frame PNG/SVG exports, all 249 available locally at inventory time. There are 673 referenced variable alias IDs; these are references, not a resolved design-token dictionary. Other Figma pages were not traversed.

The collector recorded the expected file key, but the independent Plugin API file-key verification flag was not included in this run's source metadata. The inventory reports this limitation explicitly.

## Requested pages and parent workbenches

The 12 documentation pages map to 12 parent component routes. Components supplies five additional nested workbenches: prompt-template-card, checkmark-circle, main-image-footer, display-image, and serp-template-card. The library exposes 17 React/JSX/SDL entries.

| Requested page | Figma page ID | Collected nodes | Parent route | Canonical source coverage |
| --- | --- | ---: | --- | --- |
| Main image area | [395:18350](https://www.figma.com/design/8voz5X3e3lPITEt9q5bbUe/AIGC-ACF?node-id=395-18350) | 373 | `/c/main-image-area` | MainImage: 6 aspect/status variants; Footer and selection-icon helpers |
| Image display list | [461:31677](https://www.figma.com/design/8voz5X3e3lPITEt9q5bbUe/AIGC-ACF?node-id=461-31677) | 90 | `/c/image-display-list` | Strip: 2 variants; Display image: 4 thumbnail variants |
| History panel images | [461:30766](https://www.figma.com/design/8voz5X3e3lPITEt9q5bbUe/AIGC-ACF?node-id=461-30766) | 226 | `/c/history-panel-images` | HistoryRail: 8 content/selection variants |
| Main content area | [395:18354](https://www.figma.com/design/8voz5X3e3lPITEt9q5bbUe/AIGC-ACF?node-id=395-18354) | 727 | `/c/main-content-area` | Main content: 5 variants |
| History panel | [395:18353](https://www.figma.com/design/8voz5X3e3lPITEt9q5bbUe/AIGC-ACF?node-id=395-18353) | 175 | `/c/history-panel` | Preview · History: 3 variants |
| Sign-in prompts | [436:69152](https://www.figma.com/design/8voz5X3e3lPITEt9q5bbUe/AIGC-ACF?node-id=436-69152) | 368 | `/c/sign-in-prompts` | Signing flyout: 5 variants |
| Error states | [461:31252](https://www.figma.com/design/8voz5X3e3lPITEt9q5bbUe/AIGC-ACF?node-id=461-31252) | 214 | `/c/error-states` | ErrorStatus: 6 canonical variants |
| Action bar | [395:18355](https://www.figma.com/design/8voz5X3e3lPITEt9q5bbUe/AIGC-ACF?node-id=395-18355) | 111 | `/c/action-bar` | Action row: 4 named child configurations; typed axes unavailable due to source errors |
| Creation composer | [436:69594](https://www.figma.com/design/8voz5X3e3lPITEt9q5bbUe/AIGC-ACF?node-id=436-69594) | 1,311 | `/c/creation-composer` | Composer: 4 variants; 88 × 116 template/original card helper |
| Style menu | [436:70039](https://www.figma.com/design/8voz5X3e3lPITEt9q5bbUe/AIGC-ACF?node-id=436-70039) | 220 | `/c/style-menu` | Restyle: one standalone component |
| SERP Carousel | [598:39652](https://www.figma.com/design/8voz5X3e3lPITEt9q5bbUe/AIGC-ACF?node-id=598-39652) | 1,464 | `/c/serp-carousel` | SERP_Carousel and 200 × 200 template-card helper |
| SERP · AIGC Answer | [395:18356](https://www.figma.com/design/8voz5X3e3lPITEt9q5bbUe/AIGC-ACF?node-id=395-18356) | 4,624 | `/c/serp-aigc-answer` | Three source specification frames and their composed instances; no separate canonical component set |
| Components | [437:83582](https://www.figma.com/design/8voz5X3e3lPITEt9q5bbUe/AIGC-ACF?node-id=437-83582) | 4,034 | Source catalog | 13 component sets plus 3 standalone components |

## Canonical source families

There are 16 source families plus the composed SERP organism, represented by 17 editable workbenches. Thirteen sets contain 53 variant components; three additional components are standalone. Dimensions below describe variant surfaces, except where explicitly stated. Full precision and every child node ID are retained in `inventory.json` and `site/src/data/source-catalog.json`.

| Exact source family | Canonical ID | Source configurations | Variant/component dimensions in pixels | Parent page / role |
| --- | --- | --- | --- | --- |
| Template card | `437:83684` | Original, Template | 88 × 116 | Creation composer helper |
| CheckmarkCircle | `437:83677` | Default, Variant2 | 28 × 28; 24 × 24 | Main image area helper catalog; also used by image thumbnails |
| Action row | `437:83587` | 4 named children; no returned typed axes | 1134 × 36 | Action bar |
| HistoryRail | `437:83640` | Multi / Single / Loading / Video × Default / Selected | 54 × 54, with source float precision retained | History panel images |
| MainImage | `461:31862` | 3:2 / 1:1 / 2:3 × Default / hover | 909 × 608 for 3:2; 982 × 608 for 1:1 and 2:3 outer stages | Main image area |
| Footer | `464:32760` | 2 lines, 4 lines | 909 × 108; 909 × 152 | Main image area helper |
| Display image | `470:34234` | selected / unselected × 1:1 / 3:2 | 150 × 150.5; 223 × 150.5 | Image display list helper |
| Strip | `470:34378` | 1:1, 3:2 | 150 × 608; 223 × 608 | Image display list |
| Main content | `470:34592` | loading status, Single Image, Image3:2, Image1:1, Image2:3 | 1134 × 608 | Main content area |
| Preview · History | `508:30661` | unsigned in, half, full | 54 × 608 | History panel |
| Signing flyout | `508:31112` | keep creating, unlcok models, unlock uploads, top right, reach limit | 400 × 356.703369; 400 × 352.703369; 400 × 411; 435 × 154; 400 × 357.000061 | Sign-in prompts |
| ErrorStatus | `508:31674` | Access suspended, need to re-imagene, Run into an issue, in progress, Need descriptive prompt, not_signed_in | 1134 × 608 | Error states |
| Composer | `542:32054` | empty, image uploaded, typing, Model menu | 648 × 379 for empty/model menu; 580 × 162.901230 uploaded; 580 × 166.481476 typing | Creation composer |
| Restyle | `542:32853` | Standalone component | 184 × 316 | Style menu |
| Template card | `598:38176` | Standalone component | 200 × 200 | SERP Carousel helper |
| SERP_Carousel | `598:39314` | Standalone component | 1208 × 283 | SERP Carousel |

The two Template card families are distinct source components and retain distinct node IDs and dimensions. All five nested helpers have preview, JSX and SDL pages; product actions remain host integration points.

## Source naming, duplicates and discrepancies

Exact source axis strings are preserved, including `unlcok models`, `need to re-imagene`, `unsigned in`, `not_signed_in`, `Model menu`, and lowercase `hover`. They are not silently corrected or normalized into different Figma identifiers. React-friendly prop names are explicit adapters: for example, `Property 1` → `property1` and `Status` → `status`.

Several pages contain repeated same-title specification cards. These are retained as separate source frames; repeated titles do not establish identical contents:

- Main image: `436:63019` and `458:29637`.
- HistoryRail: `461:30858` and `461:31076`.
- Main content: `436:68148` and `436:68457`.
- Creation composer: `436:69595` and `551:33264`.
- SERP · AIGC Answer: `436:70173`, `614:39962`, and `614:40882`.

Confirmed documentation/canonical-source differences:

- Main image cards contain “VARIANTS · 2 SUPPLIED” (`436:63047`, `458:29665`), while canonical MainImage has six aspect/status combinations. The card headings describe supplied examples and must not be treated as the full canonical variant count.
- The Thumbnail strip card contains both “VARIANTS · 2 SUPPLIED” (`461:31706`) and “VARIANTS · 1 SUPPLIED” (`461:31724`), plus “Single supplied configuration.” (`461:31725`). Canonical Strip has two variants.
- Main content cards contain “VARIANTS · 10 SUPPLIED” (`436:68188`, `436:68497`), while the canonical Main content set has five children.
- The Error states card contains “VARIANTS · 10 SUPPLIED” (`461:31288`), while canonical ErrorStatus has six children. Several documented instances retain identities of older masters; only reference identity was retained for masters outside the selected source definitions.
- The Action bar card says “VARIANTS · 1 SUPPLIED” (`436:69496`), while Action row has four named children. Its missing typed axes are a separate source error, not evidence that only one child exists.
- Composer card headings say four supplied examples (`436:69668`) and two supplied examples (`551:33281`), respectively. Canonical Composer contains four variants; the second card is a subset rather than a second variant schema.
- HistoryRail specification-table text says “2px blue” (`461:30931`, `461:31162`), but the canonical selected variants use an inside stroke of `#515151` at `1.2527998685836792px`; `437:83641` is the multi-image selected example. The implementation follows the actual node paint.
- SERP Carousel's top-level source frame is named “Style menu · spec card” (`598:39653`). The requested page identity remains SERP Carousel; the frame name is not used to reclassify its content.

## Export warnings and missing typing metadata

The export records 67 property-read warnings:

| Group | Count | Meaning |
| --- | ---: | --- |
| `componentPropertyDefinitions` queried on variant children | 53 | Expected API restriction: Figma allows this property on a set or a non-variant component. Variant nodes, dimensions and assets remain collected. Definitions are taken from the actual parent set where available. |
| Existing errors in the Action row source set | 14 | Action row axes or instance property maps could not be read. These need source-design attention before treating the names as a verified typed schema. |

All 14 actionable source-error occurrences relate to Action row: set `437:83587`; variant children `437:83588`, `437:83604`, `437:83620`, `437:83630`; and instances `461:30110`, `581:37291`, `614:40018`, `614:40938`. The error totals include separate failed property reads on the same node.

The child names include `Property 1=Image, Property 2=Default ` and `Property 1=Image, Property 2=Loading ` with trailing spaces, plus `Property 1=Video` and `Property 1=Video, Property 2=Loading`. The catalog preserves these names, but does not parse them into invented typed property definitions or invent a missing Property 2 value for the Video child.

The inventory additionally records one source-key verification metadata limitation, described above. No missing source fields are filled with guessed values.

## Verification boundaries

Source collection is complete for the requested scope: page counts agree, IDs are unique and all listed assets existed at inventory time. This does not imply every source property was readable; the Action row errors and expected API query restrictions remain documented.

The React molecule implementation has passed strict TypeScript checks and server-rendered all six MainImage, two Strip and eight HistoryRail combinations. That verifies imports, source-asset lookup and basic semantic markup; it does not establish pixel equality or browser interaction acceptance for the entire library.

Browser interaction, export, production-build and automated checks are recorded in `VERIFICATION.md`. No exhaustive pixel-diff, accessibility certification or live product integration is claimed. Local Mosaic catalog validation checks the available flattened contracts; nested opaque action/resource objects and real Mosaic runtime behavior remain outside that snapshot's coverage.

## Evidence files

- `inventory.json` and `INVENTORY.md`: full scoped inventory and source text.
- `figma-export/2026-09-23T04-32-44-310Z-cad283cd/manifest.json`: collector metadata and exact warnings.
- `figma-export/2026-09-23T04-32-44-310Z-cad283cd/pages/*.json`: immutable scoped Plugin API node records.
- `../site/src/data/source-catalog.json`: compact canonical-family catalog consumed by SourceCatalog.
- `molecule-specs.json`: source evidence and React prop mappings for the three molecule pages.
