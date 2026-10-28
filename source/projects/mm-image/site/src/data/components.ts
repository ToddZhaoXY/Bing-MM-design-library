// Component registry.
//
// Prop schemas are taken VERBATIM from the Figma variant axes on
// file `fRSRroY4YFgJSeqLLE0Y38`, page `139:7061` "Components".
// The variant panel is generated from this — never hand-authored.
//
// G1 (standing gate): bin is Eko's call. Only Badge carries a real bin,
// backed by Code Connect. Everything else is 'TBD'. NEVER infer a bin.

export type Tier = 'Molecule' | 'Cell' | 'Organism'

export type Bin =
  | 'MM-built'
  | 'ACF-direct'
  | 'Hybrid'
  | 'N/A'
  | 'SERP only'
  | 'IRP only'
  | 'TBD'

export type PropDef =
  | { name: string; kind: 'select'; values: string[]; default: string; numeric?: boolean; under?: string }
  | { name: string; kind: 'boolean'; default: boolean; under?: string }
  | { name: string; kind: 'text'; default: string; under?: string }

export type MosaicSupport = 'available' | 'partial' | 'candidate' | 'gap' | 'product-only'

export interface MosaicMappingDef {
  status: MosaicSupport
  identity: string
  componentTypes: string[]
  notes: string[]
}

export interface ComponentDef {
  slug: string
  name: string
  tier: Tier
  /** when set, this is a part of another entry — it does not get its own nav row */
  partOf?: string
  nodeId: string
  bin: Bin
  binEvidence?: string
  /** true when the prose below is quoted from an in-file doc frame, not drafted */
  verified: boolean
  overview: string
  props: PropDef[]
  notes?: string[]
}

export const components: ComponentDef[] = [
  {
    slug: 'image-tile',
    name: 'Image Tile',
    tier: 'Molecule',
    nodeId: '150:5408',
    bin: 'TBD',
    verified: false,
    overview:
      'The atomic image unit for results surfaces. Wraps the image, its overlay badge, and the metadata block into one sized container. Everything above this tier composes from it.',
    props: [
      { name: 'layout', kind: 'select', values: ['Waterfall', 'Dense'], default: 'Waterfall' },
      { name: 'orientation', kind: 'select', values: ['Landscape', 'Portrait'], default: 'Landscape' },
      { name: 'multiImage', kind: 'select', values: ['1', '3', '4'], default: '1', numeric: true },
      { name: 'borderRadius', kind: 'select', values: ['16', '24', '8'], default: '16', numeric: true },
      { name: 'showMetadata', kind: 'boolean', default: true },
      { name: 'metaSource', kind: 'boolean', default: false, under: 'showMetadata' },
      { name: 'metaLines', kind: 'select', values: ['1 line title + source', '2 lines title', '2 lines title + source'], default: '1 line title + source', under: 'showMetadata' },
      { name: 'title', kind: 'text', default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', under: 'showMetadata' },
      { name: 'source', kind: 'text', default: 'Pixels.com', under: 'showMetadata' },
      { name: 'imageBadge', kind: 'boolean', default: true },
      { name: 'showOverlay', kind: 'boolean', default: false },
      { name: 'collectionButton', kind: 'boolean', default: false },
      { name: 'moreImageIcon', kind: 'boolean', default: false },
      { name: 'showHover', kind: 'boolean', default: false },
      { name: 'hoverActions', kind: 'boolean', default: true },
      { name: 'dimensionLabel', kind: 'boolean', default: true },
      { name: 'flyoutType', kind: 'select', values: ['Web', 'AIGC', 'Homepage'], default: 'Web' },
      { name: 'flyoutSurface', kind: 'select', values: ['IRP', 'SERP'], default: 'IRP' },
    ],
    notes: [
      'Overview text is drafted by Echo, not quoted from a doc frame — Eko to confirm.',
      'min-width 182 · max-width 208 on all 36 select-axis combinations.',
      'When the image is narrower than the floor, fill the background grey (ACF token).',
      'Interactive: with showHover on, the「...」button opens Image Overflow Flyout (385:4577) beside it.',
      'Deliberate divergence from Figma: showHover suppresses showMetadata. The hover variant already carries its own metadata block; Figma renders both only because the two slots cannot be linked there.',
      'hoverActions / dimensionLabel switch the hover-only top-right cluster and bottom-left size label.',
    ],
  },
  {
    slug: 'badge',
    name: 'Badge',
    tier: 'Molecule',
    nodeId: '150:5533',
    bin: 'TBD',
    verified: false,
    overview:
      'The on-image overlay chip. One fixed 20px-tall pill on a solid black surface, Roboto Bold 11/13 in white, optional 12px leading icon. Seven content variants cover time, recipe, GIF, play duration, multi-image count, pixel size, and the truncated state.',
    props: [
      {
        name: 'property1',
        kind: 'select',
        values: ['Time', 'Recipe', 'GIF', 'Play', 'Multi image', 'Size', 'truncated'],
        default: 'Time',
      },
    ],
    notes: [
      'No Code Connect snippet on this node. The Fluent evidence in the catalog belongs to the ACF Badge 899:31263 nested inside Image Tile — a different node. Bin stays TBD until Eko rules.',
      'Geometry verbatim: height 20 · padding 2/4 · radius 8 · gap 2 · icon 12×12 in a 13px container.',
    ],
  },
  {
    slug: 'meta-data',
    name: 'Meta data',
    tier: 'Molecule',
    partOf: 'image-tile',
    nodeId: '150:5378',
    bin: 'TBD',
    verified: false,
    overview:
      'The text block under an image: title plus optional source row. Fixed 226px wide, 4px gap, padded 8px on the sides and bottom with no top padding — it sits flush against the image above it.',
    props: [
      {
        name: 'lines',
        kind: 'select',
        values: ['1 line title + source', '2 lines title', '2 lines title + source'],
        default: '1 line title + source',
      },
      { name: 'showSource', kind: 'boolean', default: true },
      { name: 'title', kind: 'text', default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit' },
      { name: 'source', kind: 'text', default: 'Pixels.com' },
    ],
    notes: [
      'Title is Roboto Regular 14/22 #000, ellipsised. The 1-line variant adds nowrap.',
      'Nests the source molecule, which exposes only its Default state here.',
    ],
  },
  {
    slug: 'source',
    name: 'source',
    tier: 'Molecule',
    partOf: 'image-tile',
    nodeId: '150:5399',
    bin: 'TBD',
    verified: false,
    overview:
      'Favicon plus domain name. A 12×12 favicon at radius 4 with a 10%-black hairline, then Roboto Regular 11/13 at 60% black. Hover adds an underline and nothing else.',
    props: [
      { name: 'state', kind: 'select', values: ['Default', 'Hover'], default: 'Default' },
      { name: 'name', kind: 'text', default: 'Pixels.com' },
    ],
    notes: ['Hover underline uses decoration-from-font with skip-ink off.'],
  },
  {
    slug: 'image-action-cluster',
    name: 'Image action cluster',
    tier: 'Molecule',
    partOf: 'image-tile',
    nodeId: '360:16129',
    bin: 'TBD',
    verified: true,
    overview:
      'Image action cluster — hover actions per image Type × Surface. Dominant (exposed) icon + more(…) overflow. Icons are placeholders — swap iconStyle to real icons. Save rule: Web/AIGC show Save only on IRP (dropped on SERP). Homepage dominant = Save.',
    props: [
      { name: 'type', kind: 'select', values: ['Web', 'AIGC', 'Homepage'], default: 'Web' },
      { name: 'surface', kind: 'select', values: ['SERP', 'IRP'], default: 'SERP' },
    ],
    notes: [
      'Overview quoted verbatim from the Figma component description.',
      'Icon-only — the component contains zero text nodes.',
      'Chip: 28×28 fixed height, min-width 28, radius 9999, black fill, 10%-black hairline, no shadow.',
      'Surface changes what the overflow menu holds, not the cluster geometry.',
    ],
  },
  {
    slug: 'image-overflow-flyout',
    name: 'Image overflow flyout',
    tier: 'Molecule',
    partOf: 'image-tile',
    nodeId: '385:4577',
    bin: 'TBD',
    verified: true,
    overview:
      "Image overflow flyout — the '…' menu content per image Type × Surface. Web: Reimagine, Save. AIGC: Visual search, Download, Set as wallpaper, Save. Homepage: Like, Show less like this, Report content. Save rule: shown on IRP only; dropped on SERP for Web & AIGC. Homepage has no Save on either surface.",
    props: [
      { name: 'type', kind: 'select', values: ['Web', 'AIGC', 'Homepage'], default: 'Web' },
      { name: 'surface', kind: 'select', values: ['IRP', 'SERP'], default: 'IRP' },
    ],
    notes: [
      'Overview quoted verbatim from the Figma component description.',
      'Surface default is IRP here but SERP on the action cluster — that asymmetry is in Figma, kept as-is.',
      'Popover: 177px wide, max-height 424, padding 4, radius 16, white, 10%-black hairline.',
      'Shadow discrepancy: the effect token declares blur 12, the emitted CSS renders 6. Both reported, unreconciled.',
    ],
  },
  {
    slug: 'rs-inline',
    name: 'RS Inline',
    tier: 'Cell',
    partOf: 'rs-card',
    nodeId: '581:6283',
    bin: 'TBD',
    verified: false,
    overview:
      'The inline related-searches strip: a bold title over a row of ten 120×120 thumbnails at radius 16. Sits on a warm #f8f4f1 surface at radius 24, 1360px wide, padded 20 on top, left and bottom.',
    props: [
      {
        name: 'label',
        kind: 'select',
        values: ['Top suggestion', 'People also'],
        default: 'People also',
      },
    ],
    notes: [
      'No right padding is emitted — the row bleeds toward the right edge by design.',
      'Captions are Roboto Bold 14/22 in #3a3a3a, ellipsised.',
    ],
  },
  {
    slug: 'image-cluster',
    name: 'Image Cluster',
    tier: 'Cell',
    nodeId: '581:6388',
    bin: 'TBD',
    partOf: 'rs-card',
    verified: true,
    overview:
      'A titled mosaic of related images — one heading plus a 5-image grid (3 + 2). Tapping the heading opens a related query. MM-built cluster consuming ACF-direct image tiles. Shown on SERP and IRP.',
    props: [
      { name: 'heading', kind: 'text', default: 'Minimalist Living Room Colors' },
    ],
    notes: [
      '440 × 312 · fixed mosaic. Top row 3 equal tiles, bottom row 2 wider tiles. 4px gaps.',
      'Single layout — the Figma VARIANTS section carries exactly one entry (Default).',
      'Shell: bing/smtc/background/card/on-primary/alt/rest #f8f4f1, padding 20 (mai/smtc/padding/card/default), radius 24, overflow clip.',
      'Images wrapper is radius 16 (bing/static/corner/rounded/small) with overflow clip; the four OUTER tile corners additionally carry smtc/corner/ctrl/rest 8.',
      'Heading is body3-strong (Roboto Bold 14/22, black) followed by an ACF Button / Title action — circle, size 28-xxs, accent — carrying the 5.5 × 10 Fluent Chevron export.',
      'Anatomy & bins (from the Figma table): wrapper MM-built · image tile ACF-direct (Fluent image tile token) · heading MM-built (body3 + chevron).',
      'Built from COPY ME specimen 588:5254, not the Variants teaching rows.',
    ],
  },
  {
    slug: 'rs-on-top',
    name: 'RS on Top',
    tier: 'Cell',
    nodeId: '798:2246',
    bin: 'TBD',
    partOf: 'rs-card',
    verified: true,
    overview:
      'The requery strip in its top placement — a horizontal scrolling row of query suggestion pills sitting above the image results, before the user reaches the grid. Same pills as the inline strip, flipped to the top of the page so the reformulation offer comes first. MM-built row consuming ACF-direct query suggestion pills.',
    props: [
      { name: 'label', kind: 'text', default: 'Requery Title' },
      { name: 'showGradient', kind: 'boolean', default: true },
      { name: 'showScrollButton', kind: 'boolean', default: true },
    ],
    notes: [
      'Single variant — the Figma PLACEMENT section carries exactly one entry (Top): "sits above the results grid, the requery offer lands before the images."',
      'COPY ME specimen 799:2804 is an ACF Horizontal Scroller instance, 1262 × 38.',
      'Nine Query suggestion pills at 139 × 38, 147px pitch (139 + gap 8, smtc/gap/between/content/x-small). maxWidth 180 here.',
      'The pill is the same ACF Query suggestion component as RS Pill — reused directly, not re-implemented.',
      'Edge fade: 48px wide pinned at right -1. Figma builds it by rotating a vertical ramp -90° inside a container-query box; expressed here as a CSS horizontal linear-gradient — same visual effect, resolution-independent.',
      'Scroller button: 32 × 32 at right -18, vertically centred. bg smtc/ctrl/fab/background/rest white, INSIDE stroke on-neutral/rest, radius smtc/corner/ctrl/rest 8, shadow smtc/shadows/floating/action-button/rest.',
      'Chevron sits in a 20px icon box at inset 18.75% 31.25% 18.75% 34.38% → glyph renders 6.875 × 12.5.',
      'Anatomy & bins (from the Figma table): wrapper MM-built (in-file horizontal scroll row) · query suggestion pill ACF-direct · label MM-built (body3 text token) · placement above the results grid.',
    ],
  },
  {
    slug: 'rs-card',
    name: 'RS Card',
    tier: 'Cell',
    nodeId: '577:10440',
    bin: 'TBD',
    verified: false,
    overview:
      'The rail-side related-searches card. 200px wide (layout/card/width/2-by/max-width), padded 20, with a "Related Searches" header over a stack of thumbnail + label rows. Length controls row count and density; state paints the hover/press wash behind a row.',
    props: [
      { name: 'length', kind: 'select', values: ['Two-line', 'List', 'Short'], default: 'Two-line' },
      { name: 'state', kind: 'select', values: ['Default', 'Hover', 'Press'], default: 'Default' },
    ],
    notes: [
      'Card surface: #f5f5f5 (bing/smtc/background/card/on-primary/alt/rest) at radius 24 (mai/smtc/corner/card/default). get_design_context emits NEITHER — both are bound variables, only visible via get_variable_defs.',
      'Header carries a 16×16 Search icon (540:3440) before the title — also dropped by get_design_context, found via get_metadata. The 24×24 "Right props" instance 540:3442 is hidden and must not render.',
      'Thumbnails: 38 on List/Short · 44 on Two-line, uniform across all three states.',
      'Shell gap is 12 on Two-line, 8 on List/Short. Chips gap is the same.',
      'DELIBERATE DIVERGENCE (Eko, option A): Figma has Two-line Default at 200×340 but Hover/Press at 200×360 — thumbs jump 44/44/44/42/42 → 48 and the shell gap drops 12 → 8. List (292) and Short (200) are uniform across states, so that drift is a hand-tune, not intent. Here geometry depends on `length` only; state changes the wash and nothing else. Figma side should be fixed to match, or a re-export will reintroduce it.',
      'Header carries an explicit 24px height on Two-line; List/Short hug the text.',
      'Rows 4 and 5 render only for Two-line and List. Short is 3 rows.',
      'Two-line labels are two stacked <p> lines, not one inline run. Row 4 is inverted: Regular "Paris" over Bold "Postcard".',
      'Row 5 copy is "Beautiful / Paris" — the earlier "Montmartre" was wrong.',
      'Wash sits on ROW 1 ONLY, as an absolute inset:-4 radius-8 sibling behind the content (540:3474 / 540:3504 / 540:3563); that row drops overflow:hidden. Hover #c1c1c1, press #ababab.',
      'All rows share one Figma asset (figma/img/rs-card-thumb.png), not five different photos.',
      'Three imports at the top of the Figma export are unused boilerplate, not Code Connect evidence.',
    ],
  },
  {
    slug: 'rs-pill',
    name: 'RS Pill',
    tier: 'Molecule',
    nodeId: '482:33445',
    bin: 'TBD',
    verified: false,
    overview:
      "A tappable requery suggestion shown as a horizontal scrolling row above image results — a small pill with an optional thumbnail preview + query title. Used directly from ACF's Query Suggestion component (componentKey 9f86ca0c…, Answer Card Framework library), not the older Related search pill.",
    props: [
      { name: 'state', kind: 'select', values: ['rest', 'hover', 'pressed', 'focus'], default: 'rest' },
      { name: 'thumbnail', kind: 'boolean', default: true },
      { name: 'label', kind: 'text', default: 'Requery Title' },
    ],
    notes: [
      'Height is fixed at 38. Max width 250 — the pill never grows wider; long titles truncate with ellipsis.',
      'Padding is asymmetric: 4 left (thumbnail side), 16 right. Gap 8. Radius circular.',
      'Thumbnail is a 30px circular crop. 8 Figma variants = 4 states × thumbnail on/off.',
      'Stroke rgba(0,0,0,0.1) is an INSIDE stroke — rendered as inset box-shadow, not CSS border.',
      'Text is caption1 strong: Roboto Bold 13 / 20.',
      'State colors were READ from ACF variables via the Plugin API, not inferred. The MM-ACF file only instantiates rest, so get_variable_defs on the local node returns rest tokens only — the ramp lives upstream in Answer Card Framework.',
      'Hover/pressed are translucent BLACK OVERLAYS on white (hover 5% #0000000d, pressed 3% #00000008) — not opaque greys. Pressed is LIGHTER than hover.',
      'The stroke does NOT ramp per state: one smtc/stroke/ctrl/on-neutral/rest value (#0000001a) on all four states.',
      'Focus is a two-ring treatment (inner #ffffff, outer #000000) outside the pill, not a background change.',
      'Figma-side content bug: this page’s Anatomy & Bins table (482:33374) and Usage caption (482:33367) are copy-pasted from Badge.',
    ],
  },
  {
    slug: 'content',
    name: 'Content',
    tier: 'Cell',
    nodeId: '105:2',
    bin: 'TBD',
    verified: false,
    overview:
      'The SERP image-answer body — the image grid a query returns. Assembled from Image Tile molecules (with Badge + Image Title) plus popout tile rows. MM-built; consumes ACF tokens but the structure is MM’s.',
    props: [
      { name: 'layout', kind: 'select', values: ['Waterfall', 'Dense'], default: 'Waterfall' },
      { name: 'gap', kind: 'select', values: ['0', '8', '16', '24', '32'], default: '16', numeric: true },
    ],
    notes: [
      'Overview is quoted verbatim from the Figma Overview frame (105:12).',
      'Frame size 1200 × 424, settled. The Figma Properties table (595:337) says "true grid size for 11×4 — do not scale to fit". The 1208 / 1072 widths previously on record are dead.',
      'Column width 186.67 · gap 16 — 6 image columns, 16px gutters. The "11 × 4" grid label is ACF grid units, not image columns.',
      'Waterfall is masonry: the inner Top Results Content frame is 1200×810 and is CLIPPED by the 424 shell. The clip is the design.',
      'Dense is row-based: two 204-tall rows of six 186.67×200 tiles, 16px gap.',
      'Tiles here render at radius/lg = 16, not the Image Tile default 24.',
      'Only dense tiles carry a meta slot (title only, no source row); waterfall tiles are image-only.',
      'Header (254:13492), Explore-more/Hero pill row (254:13499) and the popout tile row (254:13555) are all hidden=true in Figma — not rendered.',
    ],
  },
  {
    slug: 'filter',
    name: 'Filter',
    tier: 'Cell',
    nodeId: '621:14721',
    bin: 'TBD',
    verified: false,
    overview:
      'The image-filter bar that sits above the results — seven dropdown items (Image size, Color, Type, Layout, People, Date, License), the selected-pill state, and the two menu shapes those items open: a colour swatch grid and a text list. Per D1 only the ACF Tokenization approach is canonical; ACF Alignment and Alignment vNext are not shipped.',
    props: [
      {
        name: 'part',
        kind: 'select',
        values: ['Interactive', 'Selected pill', 'Color menu', 'Type menu', 'License menu'],
        default: 'Interactive',
      },
    ],
    notes: [
      'Overview is drafted — there is no Overview doc frame on the Filter section yet.',
      'Figma splits the bar, the selected pill and the three menus into separate frames only because they would collide on one page. Online they are ONE interactive component: the default "Interactive" part is the live bar, and clicking an item drops its menu open 4px below, left-aligned to that item. The other part values isolate a single piece for spec reference.',
      'Color is multi-select — picked swatches ring in #3c51b4 and echo as 16px chips inside the bar item, which is how the 621:14748 selected pill state is actually produced. Type and License are single-select: picking a row writes the label back onto the bar item and closes the menu. "All" clears.',
      'Figma bakes a hover row into each list menu (Photograph, All Creative Commons). Online that is live hover instead; the selected row carries the checkmark.',
      'D1: built from Approach=ACF Tokenization (621:14722) only. ACF Alignment (621:14730) and Alignment vNext (621:16416) exist in Figma but are not shipped.',
      'Bar item: gap 2 (smtc/gap/between/content/xxx-small), px 12 (smtc/padding/ctrl/horizontal-default), radius 8 (smtc/corner/ctrl/rest). Label Bold 13/20 in smtc/foreground/ctrl/on-subtle/rest #3c51b4.',
      'Selected pill (621:14748) is 114 × 36 on smtc/background/ctrl/outline/disabled #f8f4f1, label in on-subtle/hover #191919, and carries two 16px swatch chips (#E3C39D, #A6A08B) before the caret.',
      'The caret exports at a native 6 × 4 — it is placed via <Ico size={16} inset="37.5% 31.25%" />, never as a bare 16px img. Same for the checkmark (12.25 × 9.00113, inset "20.31% 10.94% 23.43% 12.5%").',
      'Colour menu (621:14757) is 184 wide, max-height 250, bg bing/smtc/background/with-material/overlay white, 1px inside stroke at black 10%, radius 8, shadow -5px 4px 12px rgba(0,0,0,0.1) (smtc/shadows/tooltip). Header text is Regular 11/13 at rgba(0,0,0,0.75).',
      'Swatch grid 621:14764 holds 15 frames but 621:14777 (#7032F5 purple) is hidden=true — 14 render. Each is 24 × 24 with a 0.8px inside stroke at black 10% and an r=5.867 fill.',
      'List menu is one component at two widths: Type (621:14807) 200, License (621:14822) 300. Rows are px 12 / py 8, radius 4, hover fill smtc/background/ctrl/subtle/hover #efeae7. Figma marks Photograph and All Creative Commons as the hovered rows.',
      'License’s last row "Learn more" is the only non-black label — bing/smtc/ctrl/link/foreground/brand/alt/visited #4007a2.',
      'Figma writes these labels as Arimo — that is its metric-compatible Roboto fallback, so the project FONT constant is used.',
    ],
  },
  {
    slug: 'header',
    name: 'Header',
    tier: 'Cell',
    nodeId: '624:19364',
    bin: 'TBD',
    verified: false,
    overview:
      'Section / title — the block heading that opens a SERP section. Master 624:19364 (868 × 48) carries one boolean of its own, `endProps?`; its variants live one level down in two nested component sets: `section Title` 624:15713 (style = Clickable title · Text title · Copilot Branding, plus a `show sub title?` boolean) and `title End Props` 624:19338 (Props = Sponsor · AI buttons · See more · Tabs · WP Tabs). Composition instance 665:6759.',
    props: [
      { name: 'title', kind: 'text', default: 'Image of Living Room' },
      { name: 'subtitle', kind: 'text', default: 'Sub title lorem ipsum dolor sit amet' },
      {
        name: 'style',
        kind: 'select',
        values: ['Clickable title', 'Text title', 'Copilot Branding'],
        default: 'Clickable title',
      },
      { name: 'showSubTitle', kind: 'boolean', default: true },
      { name: 'showChevron', kind: 'boolean', default: true },
      { name: 'endProps', kind: 'boolean', default: false },
      {
        name: 'endPropsType',
        kind: 'select',
        values: ['Sponsor', 'AI buttons', 'See more', 'Tabs', 'WP Tabs'],
        default: 'Sponsor',
      },
    ],
    notes: [
      'Bin is Eko’s call — the Figma anatomy table marks this cell “⬜ Eko’s call”.',
      'Earlier note claiming this is “a non-variant section heading bar” was wrong. The master is non-variant, but it composes two variant sets one level down — that is where the 3 title styles and 5 end-prop types live.',
      '`title End Props` is visible:true in the master 624:19364; it is the on-canvas instance 665:6759 that sets endProps?=false. Hence the web default is off.',
      'Clickable title 624:15714: title 20/26 Bold black; icon container 24 × 24, r4, padding 4. Subtitle 14/22 Regular black @ 0.75.',
      'Sponsor 624:19339 = Sponsored Slug 71 × 17, r4, bg #efeae7, padding 2/2/2/4. AI buttons 624:19341 = four 28 × 28 r8 ghost Buttons. See more 624:19346 = one 89 × 28 r4 ghost Button, label + iconEnd.',
      'Tabs (268 × 36) and WP Tabs (369 × 46) wrap an ACF `Basic` tab strip that is not exported into this project — rebuilt as pill chips to match the rendered set, but it is an approximation until the real ACF component is exported.',
      'The MCP node tools reject these remote library masters, but the Figma REST API does not: /v1/files/.../nodes returned componentPropertyDefinitions and /v1/images rendered the sets to PNG (verified 2026-07-30). The renders drove the visual corrections. REST returns empty `children` at every depth, so the concrete variant count is still unverified.',
    ],
  },
  {
    slug: 'footer',
    name: 'Footer',
    tier: 'Cell',
    nodeId: '47:26427',
    bin: 'TBD',
    verified: false,
    overview:
      'Section / footer — the exit of a SERP section. Component set 47:26427 with 6 properties: click action (No action · Expansion: See less · Expansion: See more · Redirect), Feedback (Yes · No), Footnote (Yes · No), block? (false · true), plus `show Gradient` and `Footnote link` booleans. Button container is a 4-column grid (gap 24) with a hairline, the #f8f4f1 r8 button in columns 2–3, and a mirrored hairline; below it a Bottom Container carries the footnote + link and the Feedback molecule. Instance 665:6836.',
    props: [
      {
        name: 'clickAction',
        kind: 'select',
        values: ['Redirect', 'Expansion: See more', 'Expansion: See less', 'No action'],
        default: 'Redirect',
      },
      { name: 'block', kind: 'boolean', default: false },
      { name: 'footnote', kind: 'boolean', default: true },
      { name: 'footnoteText', kind: 'text', default: 'footnote' },
      { name: 'footnoteLink', kind: 'boolean', default: true },
      { name: 'linkText', kind: 'text', default: 'Link' },
      { name: 'feedback', kind: 'boolean', default: true },
      {
        name: 'feedbackState',
        kind: 'select',
        values: ['Default', 'Active - Liked', 'Active - Disliked'],
        default: 'Default',
      },
      { name: 'showGradient', kind: 'boolean', default: false },
    ],
    notes: [
      'Bin is Eko’s call — the Figma anatomy table marks this cell “⬜ Eko’s call”.',
      'Button label is carried by the Button instance per click action: Redirect → “See all”, Expansion: See more → “See more”, Expansion: See less → “See less”. The earlier hardcoded “See more images” was not Figma’s default.',
      'click action = No action removes the whole Button container. block? = true removes both dividers and lets the Button span all 4 columns. Footnote = No removes the Footnote Container. Feedback = No keeps the slot but sets visible:false.',
      'Feedback is its own set 47:26404 — State = Default (87 × 16, gap 4) · Active - Liked (120 × 16, gap 2, “Thanks!” + “Tell us more”) · Active - Disliked (87 × 16).',
      'smtc/foreground/ctrl/on-subtle/rest resolves to #0159ba here but #3c51b4 in Filter — the token is theme-scoped, read it per node. The footnote Link is #3c51b4.',
      'The divider is a 284×1 SVG: black at 10% for the first 85%, fading to transparent.',
      'The divider cells and the Button are marked `relative` in Figma — that is load-bearing paint order, they must paint above the absolutely-positioned Gradient.',
      'The MCP node tools reject this remote library master, but the Figma REST API does not: /v1/files/.../nodes returned componentPropertyDefinitions and /v1/images rendered set 47:26427 (and Feedback 47:26404) to PNG (verified 2026-07-30). Corrections that came out of the render: `See all` uses a right chevron, the active Feedback thumb is amber. REST returns empty `children` at every depth, so the concrete variant count is unverified — do not quote a number.',
    ],
  },
  {
    slug: 'serp-image-answer',
    name: 'SERP · Image Answer',
    tier: 'Organism',
    nodeId: '664:4322',
    bin: 'TBD',
    verified: true,
    overview:
      'The Image Answer block on the SERP. A whole-page assembly: the Bing page shell (platform), our Header cell as the block title, the Content cell in its waterfall layout, and our Footer cell as the exit. No Filter cell here — the SERP block is scoped by the query, not re-filtered in place.',
    props: [
      { name: 'title', kind: 'text', default: 'Image of Living Room' },
      { name: 'pageShell', kind: 'boolean', default: true },
    ],
    notes: [
      'PAGE SPECS (665:7180): page 1440 × 1090 · header 125 · header cell 1280 · waterfall 1200 · footer 1208.',
      'ANATOMY & BINS (664:4405): page shell = Platform (Bing chrome, not ours, not ACF); Header cell + Footer cell = Eko’s call; Content cell = MM-built, consumes ACF tokens; Image Tile = MM-built, shared SERP + IRP.',
      'Three frames are hidden in the Figma composition and are not rendered: 665:6773 (Top results header), 665:6780 (explore-more filter row), 665:6829 (popout tile row).',
      'The waterfall runs at 1200 × 810 here — the Content cell’s own 424 shell is a clip, and the columns’ natural height is exactly 810.',
    ],
  },
  {
    slug: 'irp-whole-page',
    name: 'IRP · Whole Page',
    tier: 'Organism',
    nodeId: '661:684',
    bin: 'TBD',
    verified: true,
    overview:
      'The Images Results Page. A whole-page assembly: the Bing page shell (platform), our Filter cell across the top of the content area, and the Content cell in its dense layout. No Header cell and no Footer cell on this surface — the query tabs do the framing that Section/title does on SERP.',
    props: [
      { name: 'pageShell', kind: 'boolean', default: true },
      { name: 'filterRow', kind: 'boolean', default: true },
    ],
    notes: [
      'PAGE SPECS (662:2811): page 1440 × 867 · header height 125 · content area width 1360. Measured from the live IRP frame 659:46853.',
      'Composition — 1 Page shell (platform, Bing header + tab bar) · 2 Filter cell, Whole Page Tabs = 10 × Query Suggestion at 180 × 38, 1350 wide · 3 Content cell dense = 3 rows × 6 Image Container, 208 × 200, 1360 × 644.',
      'ANATOMY & BINS — Page shell: Platform (Bing chrome, not ours, not ACF). Filter cell: MM-built (pill from ACF, composition is MM). Content cell dense: MM-built (in-file cell, consumes ACF tokens). Image Tile: MM-built molecule, shared SERP + IRP.',
      'The spec card renders the dense grid scaled to 1240/1360 = 0.9118, so its instances measure 189.647 × 182.353. The label’s 208 × 200 on 1360 × 644 is the true size.',
      'Hidden layer 662:2297 (search placeholder) is not rendered. Query Suggestion’s hairline is a Figma INSIDE stroke — rendered as inset box-shadow, not a CSS border.',
    ],
  },
]

/** Nav rows for a tier — parts are nested under their owner, not listed at top level. */
export const byTier = (tier: Tier) =>
  components.filter((c) => c.tier === tier && !c.partOf)
export const partsOf = (slug: string) => components.filter((c) => c.partOf === slug)
export const bySlug = (slug: string) => components.find((c) => c.slug === slug)
