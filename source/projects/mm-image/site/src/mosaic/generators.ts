import type { MosaicMappingDef } from '../data/components'
import type {
  MosaicGeneration,
  MosaicGenerationContext,
  MosaicGenerator,
  MosaicLiveProps,
  MosaicSdlNode,
  MosaicValues,
} from './types'
import {
  basic,
  button,
  caption,
  card,
  col,
  FIGMA_IMAGE,
  finish,
  image,
  node,
  row,
  spacing,
  text,
  title,
  unwrapBasic,
} from './builders'
import { buildImageContainerSdl, generateImageContainerSdl } from './imageContainer'

export interface MosaicAdapter extends MosaicMappingDef {
  generate: MosaicGenerator
}

const productActionWarning =
  'Interaction is represented visually, but navigation/mutation is omitted until the product supplies a typed ActionConfig payload.'
const localAssetWarning =
  'Reference images use local Figma assets. Replace them with reachable product/CDN URLs before publishing in Mosaic.'

function value(values: MosaicValues, name: string, fallback = '') {
  return String(values[name] ?? fallback)
}

function bool(values: MosaicValues, name: string, fallback = false) {
  return values[name] === undefined ? fallback : Boolean(values[name])
}

function generateBadge(values: MosaicValues): MosaicGeneration {
  const variant = value(values, 'property1', 'Time')
  const config: Record<string, { label: string; icon?: string }> = {
    Time: { label: '1 day ago' },
    Recipe: { label: 'Recipe', icon: 'food-apple' },
    GIF: { label: 'GIF' },
    Play: { label: '1:24', icon: 'play' },
    'Multi image': { label: '4', icon: 'images' },
    Size: { label: '1920 × 1080' },
    truncated: { label: 'Lorem ips…' },
  }
  const selected = config[variant] ?? config.Time
  const properties: Record<string, unknown> = {
    label: selected.label,
    pill: true,
    size: 'sm',
    color: 'secondary',
    variant: 'solid',
  }
  if (selected.icon) properties.icon = selected.icon
  return finish(
    basic([
      node('Badge', properties),
    ]),
  )
}

function metadataNode(values: MosaicValues): MosaicSdlNode {
  const lines = value(values, 'lines', '1 line title + source')
  const showSource = bool(values, 'showSource', true) && lines.includes('source')
  const maxLines = lines.startsWith('2') ? 2 : 1
  const children = [
    text(value(values, 'title', 'Lorem ipsum dolor sit amet'), {
      size: 'md',
      maxLines,
      truncate: maxLines === 1,
    }),
  ]
  if (showSource) {
    children.push(
      caption(value(values, 'source', 'Pixels.com'), {
        size: 'sm',
        color: 'secondary',
        maxLines: 1,
      }),
    )
  }
  return col(children, { gap: 1, width: 226, padding: { x: 2, bottom: 2 } })
}

function generateMetadata(values: MosaicValues): MosaicGeneration {
  return finish(basic([metadataNode(values)]))
}

function sourceNode(values: MosaicValues): MosaicSdlNode {
  return row(
    [
      image(FIGMA_IMAGE.favicon, '', {
        size: 12,
        radius: 'xs',
        ariaHidden: true,
      }),
      caption(value(values, 'name', 'Pixels.com'), {
        size: 'sm',
        color: 'secondary',
        truncate: true,
      }),
    ],
    { gap: 1, align: 'center' },
  )
}

function generateSource(values: MosaicValues): MosaicGeneration {
  const hover = value(values, 'state', 'Default') === 'Hover'
  return finish(
    basic([sourceNode(values)]),
    hover
      ? ['The Figma hover underline has no portable Source primitive; SDL keeps the same semantic source row.']
      : [],
  )
}

function actionClusterNode(values: MosaicValues): MosaicSdlNode {
  const type = value(values, 'type', 'Web')
  const surface = value(values, 'surface', 'SERP')
  const icons =
    type === 'Homepage'
      ? ['heart', 'dots-horizontal']
      : surface === 'IRP'
        ? ['save', 'dots-horizontal']
        : ['dots-horizontal']
  return row(
    icons.map((icon) =>
      button('', {
        iconStart: icon,
        iconSize: 'sm',
        uniform: true,
        pill: true,
        size: 'sm',
        variant: 'solid',
        color: 'secondary',
        ariaLabel: icon === 'dots-horizontal' ? 'More image actions' : icon,
      }),
    ),
    { gap: 1 },
  )
}

function generateActionCluster(values: MosaicValues): MosaicGeneration {
  return finish(basic([actionClusterNode(values)]), [productActionWarning])
}

function overflowRows(type: string, surface: string) {
  if (type === 'Homepage') {
    return [
      ['Like', 'heart'],
      ['Show less like this', 'thumbs-down'],
      ['Report content', 'flag'],
    ] as const
  }
  if (type === 'AIGC') {
    const rows: Array<readonly [string, string]> = [
      ['Visual search', 'vision'],
      ['Download', 'download'],
      ['Set as wallpaper', 'desktop'],
    ]
    if (surface === 'IRP') rows.push(['Save', 'save'])
    return rows
  }
  const rows: Array<readonly [string, string]> = [['Reimagine', 'wand']]
  if (surface === 'IRP') rows.push(['Save', 'save'])
  return rows
}

function overflowNode(values: MosaicValues): MosaicSdlNode {
  const type = value(values, 'type', 'Web')
  const surface = value(values, 'surface', 'IRP')
  return card(
    [
      col(
        overflowRows(type, surface).map(([label, icon]) =>
          button(label, {
            iconStart: icon,
            size: 'sm',
            variant: 'ghost',
            color: 'secondary',
            block: true,
          }),
        ),
        { gap: 1 },
      ),
    ],
    { padding: 1, background: 'surface', size: 'sm' },
  )
}

function generateOverflow(values: MosaicValues): MosaicGeneration {
  return finish(basic([overflowNode(values)]), [
    productActionWarning,
    'The flyout body maps to a Card, but its anchored popover/open-close behavior remains product implementation.',
  ])
}

const RELATED_LABELS = [
  'Minimalist living room',
  'Warm neutral living room',
  'Modern living room',
  'Cozy small living room',
  'Living room colors',
  'Living room decor',
  'Living room lighting',
  'Living room layout',
  'Scandinavian living room',
  'Luxury living room',
]

function relatedThumb(label: string, index: number, size = 120): MosaicSdlNode {
  return col(
    [
      image(index % 2 ? FIGMA_IMAGE.portrait : FIGMA_IMAGE.landscape, label, {
        width: size,
        height: size,
        radius: 'lg',
      }),
      caption(label, { size: 'sm', weight: 'bold', maxLines: 1 }),
    ],
    { gap: 1, width: size },
  )
}

function rsInlineNode(values: MosaicValues): MosaicSdlNode {
  return card(
    [
      col(
        [
          title(value(values, 'label', 'People also'), { size: 'md', weight: 'bold' }),
          row(RELATED_LABELS.map((label, index) => relatedThumb(label, index)), {
            gap: 2,
            scrollable: true,
          }),
        ],
        { gap: 3 },
      ),
    ],
    { padding: { top: 5, left: 5, bottom: 5 }, background: 'surface-secondary' },
  )
}

function generateRsInline(values: MosaicValues): MosaicGeneration {
  return finish(basic([rsInlineNode(values)]), [localAssetWarning])
}

function imageClusterNode(values: MosaicValues): MosaicSdlNode {
  const heading = value(values, 'heading', 'Minimalist Living Room Colors')
  const tile = (i: number, width: number, height: number) =>
    image(i % 2 ? FIGMA_IMAGE.portrait : FIGMA_IMAGE.landscape, `${heading} image ${i + 1}`, {
      width,
      height,
      radius: 'md',
    })
  return card(
    [
      col(
        [
          row(
            [
              title(heading, { size: 'sm', weight: 'bold', maxLines: 1, width: 356 }),
              button('', {
                iconStart: 'chevron-right',
                uniform: true,
                size: '2xs',
                variant: 'ghost',
                color: 'primary',
                ariaLabel: `Open ${heading}`,
              }),
            ],
            { justify: 'between', align: 'center' },
          ),
          col(
            [
              row([tile(0, 130, 112), tile(1, 130, 112), tile(2, 130, 112)], { gap: 1 }),
              row([tile(3, 197, 112), tile(4, 197, 112)], { gap: 1 }),
            ],
            { gap: 1, radius: 'lg' },
          ),
        ],
        { gap: 3 },
      ),
    ],
    { padding: 5, background: 'surface-secondary', size: 'md' },
  )
}

function generateImageCluster(values: MosaicValues): MosaicGeneration {
  return finish(basic([imageClusterNode(values)]), [localAssetWarning, productActionWarning])
}

function rsPillNode(values: MosaicValues): MosaicSdlNode {
  const label = value(values, 'label', 'Requery Title')
  const state = value(values, 'state', 'rest')
  const children: MosaicSdlNode[] = []
  if (bool(values, 'thumbnail', true)) {
    children.push(
      image(FIGMA_IMAGE.related, '', {
        size: 30,
        radius: '100%',
        ariaHidden: true,
      }),
    )
  }
  children.push(text(label, { size: 'sm', weight: 'bold', truncate: true, maxLines: 1 }))
  return node(
    'Pressable',
    {
      role: 'button',
      ariaLabel: label,
      direction: 'row',
      align: 'center',
      gap: 2,
      padding: { left: 1, right: 4 },
      radius: '100%',
      height: 38,
      maxWidth: 250,
      background:
        state === 'hover'
          ? 'background-200'
          : state === 'pressed'
            ? 'background-150'
            : 'surface',
      variant: 'surface',
      color: 'primary',
    },
    children,
  )
}

function generateRsPill(values: MosaicValues): MosaicGeneration {
  const warnings = [productActionWarning]
  if (value(values, 'state') === 'focus') {
    warnings.push('The two-ring Figma focus treatment is delegated to the host renderer accessibility state.')
  }
  return finish(basic([rsPillNode(values)]), warnings)
}

function rsOnTopNode(values: MosaicValues): MosaicSdlNode {
  return col(
    [
      text(value(values, 'label', 'Requery Title'), { size: 'sm', weight: 'bold' }),
      row(
        RELATED_LABELS.slice(0, 9).map((label) =>
          rsPillNode({ state: 'rest', thumbnail: true, label }),
        ),
        { gap: 2, scrollable: true, width: '100%' },
      ),
    ],
    { gap: 2, width: '100%' },
  )
}

function generateRsOnTop(values: MosaicValues): MosaicGeneration {
  const warnings = [localAssetWarning, productActionWarning]
  if (bool(values, 'showGradient', true)) {
    warnings.push('The edge fade is renderer paint and is not encoded as a semantic SDL node.')
  }
  if (bool(values, 'showScrollButton', true)) {
    warnings.push('Native horizontal scrolling replaces the separately positioned Figma scroll affordance.')
  }
  return finish(basic([rsOnTopNode(values)]), warnings)
}

function rsCardNode(values: MosaicValues): MosaicSdlNode {
  const length = value(values, 'length', 'Two-line')
  const count = length === 'Short' ? 3 : 5
  const size = length === 'Two-line' ? 44 : 38
  return card(
    [
      col(
        [
          row(
            [
              node('Icon', { name: 'search', size: 'sm', ariaHidden: true }),
              title('Related Searches', { size: 'sm', weight: 'bold' }),
            ],
            { gap: 1, align: 'center' },
          ),
          ...RELATED_LABELS.slice(0, count).map((label, index) =>
            row(
              [
                image(FIGMA_IMAGE.related, '', {
                  size,
                  radius: 'md',
                  ariaHidden: true,
                }),
                text(label, {
                  size: 'sm',
                  weight: index === 3 ? 'normal' : 'bold',
                  maxLines: length === 'Two-line' ? 2 : 1,
                }),
              ],
              {
                gap: 2,
                align: 'center',
                padding: value(values, 'state') === 'Default' || index > 0 ? 0 : 1,
                radius: 'md',
                background:
                  value(values, 'state') === 'Hover' && index === 0
                    ? 'background-200'
                    : value(values, 'state') === 'Press' && index === 0
                      ? 'background-250'
                      : 'surface-secondary',
              },
            ),
          ),
        ],
        { gap: length === 'Two-line' ? 3 : 2 },
      ),
    ],
    { padding: 5, background: 'surface-secondary', size: 'sm' },
  )
}

function generateRsCard(values: MosaicValues): MosaicGeneration {
  return finish(basic([rsCardNode(values)]), [localAssetWarning, productActionWarning])
}

const IMAGE_TILE_DEFAULTS: MosaicValues = {
  layout: 'Waterfall',
  orientation: 'Landscape',
  multiImage: '1',
  borderRadius: '16',
  showMetadata: false,
  metaSource: false,
  metaLines: '2 lines title',
  title: 'Living room inspiration',
  source: 'Pixels.com',
  imageBadge: false,
  showOverlay: false,
  collectionButton: false,
  moreImageIcon: false,
  showHover: false,
  hoverActions: true,
  dimensionLabel: true,
  flyoutType: 'Web',
  flyoutSurface: 'IRP',
}

function contentNode(values: MosaicValues, context?: MosaicGenerationContext): {
  node: MosaicSdlNode
  warnings: string[]
} {
  const layout = value(values, 'layout', 'Waterfall')
  const gap = spacing(value(values, 'gap', '16'))
  const rows: MosaicSdlNode[] = []
  const warnings = [localAssetWarning]

  for (let rowIndex = 0; rowIndex < 2; rowIndex += 1) {
    const tiles = Array.from({ length: 6 }, (_, columnIndex) => {
      const index = rowIndex * 6 + columnIndex
      const perTile = context?.tileOne?.[index] ?? {}
      const tileValues: MosaicValues = {
        ...IMAGE_TILE_DEFAULTS,
        layout,
        orientation:
          layout === 'Waterfall' && (index + rowIndex) % 3 === 1 ? 'Portrait' : 'Landscape',
        showMetadata: layout === 'Dense',
        ...context?.tileAll,
        ...perTile,
      }
      return buildImageContainerSdl(tileValues).node
    })
    rows.push(row(tiles, { gap, align: 'start', width: '100%' }))
  }

  if (layout === 'Waterfall') {
    warnings.push(
      'Mosaic has no published masonry primitive. Waterfall is exported as row-split images with varied aspect ratios.',
    )
  }

  return {
    node: col(rows, { gap, width: context?.width || '100%' }),
    warnings,
  }
}

function generateContent(
  values: MosaicValues,
  _live: MosaicLiveProps,
  context?: MosaicGenerationContext,
): MosaicGeneration {
  const output = contentNode(values, context)
  return finish(basic([output.node], { padding: 0 }), output.warnings)
}

const FILTER_OPTIONS = [
  ['Image size', 'All', 'Large', 'Medium', 'Small'],
  ['Color', 'All', 'Color only', 'Black & white'],
  ['Type', 'All', 'Photograph', 'Clipart', 'Line drawing', 'Animated GIF'],
  ['Layout', 'All', 'Square', 'Wide', 'Tall'],
  ['People', 'All', 'Faces', 'Head & shoulders'],
  ['Date', 'All', 'Past 24 hours', 'Past week', 'Past month'],
  ['License', 'All', 'Public domain', 'Free to share', 'Free to modify'],
]

function filterNode(values: MosaicValues): MosaicSdlNode {
  const part = value(values, 'part', 'Interactive')
  if (part === 'Interactive') {
    return row(
      FILTER_OPTIONS.map(([label, ...options]) =>
        node('Select', {
          name: label.toLowerCase().replace(/\s+/g, '-'),
          options: options.map((option) => ({ label: option, value: option })),
          placeholder: label,
          variant: 'ghost',
          size: 'sm',
        }),
      ),
      { gap: 1, wrap: 'wrap' },
    )
  }
  if (part === 'Selected pill') {
    return button('Color · 2', {
      iconEnd: 'chevron-down-up',
      size: 'sm',
      variant: 'soft',
      color: 'secondary',
    })
  }
  const options =
    part === 'Color menu'
      ? ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Black', 'White']
      : part === 'License menu'
        ? ['All', 'Public domain', 'Free to share', 'Free to modify', 'Learn more']
        : ['All', 'Photograph', 'Clipart', 'Line drawing', 'Animated GIF']
  return card(
    [
      col(
        options.map((option) =>
          button(option, {
            block: true,
            size: 'sm',
            variant: 'ghost',
            color: 'secondary',
          }),
        ),
        { gap: 1 },
      ),
    ],
    { padding: 1, background: 'surface', size: 'sm' },
  )
}

function generateFilter(values: MosaicValues): MosaicGeneration {
  return finish(basic([filterNode(values)]), [
    productActionWarning,
    'Mosaic Select can express the fields, but the MM multi-swatch selection summary remains host-managed state.',
  ])
}

function headerNode(values: MosaicValues): MosaicSdlNode {
  const style = value(values, 'style', 'Clickable title')
  const headingChildren: MosaicSdlNode[] = [
    title(value(values, 'title', 'Image of Living Room'), {
      size: 'lg',
      weight: 'bold',
      maxLines: 1,
    }),
  ]
  if (bool(values, 'showChevron', true) && style === 'Clickable title') {
    headingChildren.push(node('Icon', { name: 'chevron-right', size: 'sm', ariaHidden: true }))
  }

  const left = col(
    [
      row(headingChildren, { gap: 1, align: 'center' }),
      ...(bool(values, 'showSubTitle', true)
        ? [caption(value(values, 'subtitle', 'Sub title'), { size: 'md', color: 'secondary' })]
        : []),
    ],
    { gap: 1 },
  )
  const children: MosaicSdlNode[] = [left]
  if (bool(values, 'endProps', false)) {
    const type = value(values, 'endPropsType', 'Sponsor')
    if (type === 'Sponsor') {
      children.push(node('Badge', { label: 'Sponsored', size: 'sm', color: 'secondary', variant: 'soft' }))
    } else if (type === 'AI buttons') {
      children.push(
        row(
          ['sparkle', 'share', 'save', 'dots-horizontal'].map((icon) =>
            button('', {
              iconStart: icon,
              uniform: true,
              size: '2xs',
              variant: 'ghost',
              color: 'secondary',
              ariaLabel: icon,
            }),
          ),
          { gap: 1 },
        ),
      )
    } else if (type === 'See more') {
      children.push(
        button('See more', {
          iconEnd: 'chevron-right',
          size: '2xs',
          variant: 'ghost',
          color: 'secondary',
        }),
      )
    } else {
      children.push(
        row(
          (type === 'WP Tabs' ? ['Images', 'Videos', 'News', 'Maps'] : ['All', 'Images', 'Videos']).map(
            (label) =>
              button(label, {
                size: '2xs',
                variant: label === 'Images' ? 'soft' : 'ghost',
                color: 'secondary',
              }),
          ),
          { gap: 1 },
        ),
      )
    }
  }
  return row(children, { justify: 'between', align: 'center', width: '100%' })
}

function generateHeader(values: MosaicValues): MosaicGeneration {
  const warnings = [productActionWarning]
  if (value(values, 'style') === 'Copilot Branding') {
    warnings.push('Copilot branding is reduced to semantic title text because no portable brand lockup is published.')
  }
  return finish(basic([headerNode(values)]), warnings)
}

function footerNode(values: MosaicValues): MosaicSdlNode {
  const children: MosaicSdlNode[] = []
  const action = value(values, 'clickAction', 'Redirect')
  if (action !== 'No action') {
    const label =
      action === 'Expansion: See more'
        ? 'See more'
        : action === 'Expansion: See less'
          ? 'See less'
          : 'See all'
    const actionButton = button(label, {
      iconEnd: action === 'Expansion: See less' ? 'chevron-up-down' : 'chevron-right',
      size: 'sm',
      variant: 'soft',
      color: 'secondary',
      block: bool(values, 'block', false),
    })
    children.push(
      bool(values, 'block', false)
        ? actionButton
        : row(
            [
              node('Divider', { color: 'subtle', size: 1, spacing: 0 }),
              actionButton,
              node('Divider', { color: 'subtle', size: 1, spacing: 0 }),
            ],
            { gap: 6, align: 'center' },
          ),
    )
  }
  if (bool(values, 'footnote', true)) {
    const bottom: MosaicSdlNode[] = [
      caption(value(values, 'footnoteText', 'footnote'), { size: 'sm', color: 'secondary' }),
    ]
    if (bool(values, 'footnoteLink', true)) {
      bottom.push(
        button(value(values, 'linkText', 'Link'), {
          size: '2xs',
          variant: 'ghost',
          color: 'primary',
        }),
      )
    }
    if (bool(values, 'feedback', true)) {
      const state = value(values, 'feedbackState', 'Default')
      bottom.push(
        row(
          [
            ...(state === 'Active - Liked'
              ? [caption('Thanks!', { size: 'sm', color: 'secondary' })]
              : []),
            button('', {
              iconStart: state === 'Active - Liked' ? 'thumbs-up-filled' : 'thumbs-up',
              uniform: true,
              size: '2xs',
              variant: 'ghost',
              color: 'secondary',
              ariaLabel: 'Like',
            }),
            button('', {
              iconStart: state === 'Active - Disliked' ? 'thumbs-down-filled' : 'thumbs-down',
              uniform: true,
              size: '2xs',
              variant: 'ghost',
              color: 'secondary',
              ariaLabel: 'Dislike',
            }),
          ],
          { gap: 1, align: 'center' },
        ),
      )
    }
    children.push(row(bottom, { gap: 2, justify: 'between', align: 'center', width: '100%' }))
  }
  return col(children, { gap: 3, width: '100%' })
}

function generateFooter(values: MosaicValues): MosaicGeneration {
  const warnings = [productActionWarning]
  if (bool(values, 'showGradient', false)) {
    warnings.push('The footer gradient is renderer paint and is intentionally omitted from semantic SDL.')
  }
  return finish(basic([footerNode(values)]), warnings)
}

function generateSerp(values: MosaicValues): MosaicGeneration {
  const content = contentNode({ layout: 'Waterfall', gap: '16' }, { surface: 'serp', width: 1200 })
  const children = [
    headerNode({
      title: value(values, 'title', 'Image of Living Room'),
      subtitle: '',
      style: 'Clickable title',
      showSubTitle: false,
      showChevron: true,
      endProps: false,
      endPropsType: 'Sponsor',
    }),
    content.node,
    footerNode({
      clickAction: 'Expansion: See more',
      block: false,
      footnote: true,
      footnoteText: 'footnote',
      footnoteLink: true,
      linkText: 'Link',
      feedback: true,
      feedbackState: 'Default',
      showGradient: false,
    }),
  ]
  const warnings = [...content.warnings, productActionWarning]
  if (bool(values, 'pageShell', true)) {
    warnings.push('The Bing page shell is platform chrome and stays outside the portable SDL answer block.')
  }
  return finish(basic([col(children, { gap: 4, width: 1280 })], { padding: 0 }), warnings)
}

function generateIrp(values: MosaicValues): MosaicGeneration {
  const content = contentNode({ layout: 'Dense', gap: '16' }, { surface: 'irp', width: 1360 })
  const children: MosaicSdlNode[] = []
  if (bool(values, 'filterRow', true)) children.push(filterNode({ part: 'Interactive' }))
  children.push(content.node)
  const warnings = [...content.warnings, productActionWarning]
  if (bool(values, 'pageShell', true)) {
    warnings.push('The Bing IMAGES shell and whole-page tabs are platform chrome outside the portable SDL content.')
  }
  return finish(basic([col(children, { gap: 4, width: 1360 })], { padding: 0 }), warnings)
}

const adapters: Record<string, MosaicAdapter> = {
  'image-tile': {
    status: 'partial',
    identity: 'Basic → Col → Image/Row composition',
    componentTypes: ['Basic', 'Col', 'Row', 'Image', 'Text', 'Caption', 'Badge'],
    notes: [
      'Base image, multi-image composition, title, source, and semantic badge map to the published catalog.',
      'Overlay placement, hover/pop-out, action policy, and container-only corner clipping remain explicit gaps.',
    ],
    generate: generateImageContainerSdl,
  },
  badge: {
    status: 'available',
    identity: 'Badge',
    componentTypes: ['Basic', 'Badge'],
    notes: ['All seven MM content variants map to the published Badge primitive.'],
    generate: generateBadge,
  },
  'meta-data': {
    status: 'available',
    identity: 'Col → Text + Caption',
    componentTypes: ['Basic', 'Col', 'Text', 'Caption'],
    notes: ['Title line count and optional source are preserved semantically.'],
    generate: generateMetadata,
  },
  source: {
    status: 'partial',
    identity: 'Row → Image + Caption',
    componentTypes: ['Basic', 'Row', 'Image', 'Caption'],
    notes: ['Favicon and domain map directly; the exact hover underline stays renderer-owned.'],
    generate: generateSource,
  },
  'image-action-cluster': {
    status: 'candidate',
    identity: 'Row → icon Buttons',
    componentTypes: ['Basic', 'Row', 'Button'],
    notes: ['Geometry and type/surface action inventory map; product ActionConfig payloads are still required.'],
    generate: generateActionCluster,
  },
  'image-overflow-flyout': {
    status: 'candidate',
    identity: 'Card → Col → Buttons',
    componentTypes: ['Basic', 'Card', 'Col', 'Button'],
    notes: ['Flyout body maps to Card; anchor, trigger, policy, and actions stay product-owned.'],
    generate: generateOverflow,
  },
  'rs-inline': {
    status: 'partial',
    identity: 'Card → Col → scrolling Row',
    componentTypes: ['Basic', 'Card', 'Col', 'Row', 'Image', 'Caption', 'Title'],
    notes: ['The related-search strip is expressible; live query/action data still needs product wiring.'],
    generate: generateRsInline,
  },
  'image-cluster': {
    status: 'partial',
    identity: 'Card → Col → two image Rows',
    componentTypes: ['Basic', 'Card', 'Col', 'Row', 'Image', 'Title', 'Button'],
    notes: ['The fixed 3+2 collage maps without inventing a new component.'],
    generate: generateImageCluster,
  },
  'rs-on-top': {
    status: 'partial',
    identity: 'Col → scrolling Row → Pressables',
    componentTypes: ['Basic', 'Col', 'Row', 'Pressable', 'Image', 'Text'],
    notes: ['Native scrolling maps; edge fade and detached scroll button remain renderer treatment.'],
    generate: generateRsOnTop,
  },
  'rs-card': {
    status: 'partial',
    identity: 'Card → Col → result Rows',
    componentTypes: ['Basic', 'Card', 'Col', 'Row', 'Image', 'Text', 'Title', 'Icon'],
    notes: ['Length and state variants map; navigation still needs ActionConfig.'],
    generate: generateRsCard,
  },
  'rs-pill': {
    status: 'partial',
    identity: 'Pressable → Image + Text',
    componentTypes: ['Basic', 'Pressable', 'Image', 'Text'],
    notes: ['Pill content and visual states map; host focus and navigation behavior remain renderer/product work.'],
    generate: generateRsPill,
  },
  content: {
    status: 'partial',
    identity: 'Col → row-split Image Tile composition',
    componentTypes: ['Basic', 'Col', 'Row', 'Image', 'Text', 'Caption'],
    notes: ['Dense maps directly; Waterfall uses an explicit row-split fallback until SDL publishes masonry.'],
    generate: generateContent,
  },
  filter: {
    status: 'candidate',
    identity: 'Row → Select controls / Card menus',
    componentTypes: ['Basic', 'Row', 'Select', 'Card', 'Col', 'Button'],
    notes: ['Single-select controls map; MM multi-swatch summary and menu state need host-managed state.'],
    generate: generateFilter,
  },
  header: {
    status: 'partial',
    identity: 'Row → Title/Caption + optional end props',
    componentTypes: ['Basic', 'Row', 'Col', 'Title', 'Caption', 'Icon', 'Button', 'Badge'],
    notes: ['Title and end-prop families map; Copilot branding and product actions remain external.'],
    generate: generateHeader,
  },
  footer: {
    status: 'partial',
    identity: 'Col → action Row + footnote/feedback Row',
    componentTypes: ['Basic', 'Col', 'Row', 'Divider', 'Button', 'Caption'],
    notes: ['Visible structure maps; action semantics and renderer gradient are external.'],
    generate: generateFooter,
  },
  'serp-image-answer': {
    status: 'partial',
    identity: 'Basic → Header + Waterfall Content + Footer',
    componentTypes: ['Basic', 'Col', 'Row', 'Title', 'Image', 'Button', 'Divider', 'Caption'],
    notes: ['The MM answer block maps; the Bing shell stays platform-owned and Waterfall uses a row fallback.'],
    generate: generateSerp,
  },
  'irp-whole-page': {
    status: 'partial',
    identity: 'Basic → Filter + Dense Content',
    componentTypes: ['Basic', 'Col', 'Row', 'Select', 'Image', 'Text', 'Caption'],
    notes: ['Dense content and filter controls map; Bing shell and full page policy stay platform-owned.'],
    generate: generateIrp,
  },
}

export function mosaicAdapter(slug: string): MosaicAdapter | undefined {
  return adapters[slug]
}

export function generateMosaicComponent(
  slug: string,
  values: MosaicValues,
  live: MosaicLiveProps = {},
  context?: MosaicGenerationContext,
): MosaicGeneration | null {
  return adapters[slug]?.generate(values, live, context) ?? null
}

export function generateMosaicPage(
  blocks: Array<{
    slug: string
    values: MosaicValues
    live: MosaicLiveProps
    tileAll?: MosaicValues
    tileOne?: Record<number, MosaicValues>
  }>,
  surface: 'serp' | 'irp' | 'blank',
  width?: number,
): MosaicGeneration {
  const children: MosaicSdlNode[] = []
  const warnings: string[] = []

  for (const block of blocks) {
    const output = generateMosaicComponent(block.slug, block.values, block.live, {
      surface,
      width,
      tileAll: block.tileAll,
      tileOne: block.tileOne,
    })
    if (!output) {
      warnings.push(`${block.slug}: no Mosaic adapter; block omitted.`)
      continue
    }
    children.push(...unwrapBasic(output))
    warnings.push(...output.warnings.map((warning) => `${block.slug}: ${warning}`))
  }

  if (surface !== 'blank') {
    warnings.push(
      `${surface.toUpperCase()} platform chrome is not embedded; this export contains the portable MM content column only.`,
    )
  }

  return finish(
    basic(
      [
        col(children, {
          gap: 4,
          width: width || '100%',
        }),
      ],
      { padding: 0 },
    ),
    warnings,
  )
}

export const mosaicCoverage = Object.entries(adapters).map(([slug, adapter]) => ({
  slug,
  status: adapter.status,
}))
