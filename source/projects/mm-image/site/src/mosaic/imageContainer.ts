import type { MosaicGeneration, MosaicSdlNode, MosaicValues } from './types'
import { basic, caption, col, FIGMA_IMAGE, finish, image, node, row, text } from './builders'

type Radius = 'xl' | 'lg' | 'md'

function radiusToken(radius: number): Radius {
  if (radius === 24) return 'xl'
  if (radius === 16) return 'lg'
  return 'md'
}

export function buildImageContainerSdl(
  values: MosaicValues,
): { node: MosaicSdlNode; warnings: string[] } {
  const layout = String(values.layout)
  const orientation = String(values.orientation)
  const multiImage = Number(values.multiImage)
  const radius = radiusToken(Number(values.borderRadius))
  const title = String(values.title)
  const source = String(values.source)
  const dense = layout === 'Dense'
  const portrait = orientation === 'Portrait'
  const width = dense ? (portrait ? 190 : 258) : 200
  const height = !dense && portrait ? 247 : 172
  const subCount = multiImage === 4 ? 3 : 2
  const aspectRatio = portrait ? '3/4' : '16/9'
  const mainSource = portrait ? FIGMA_IMAGE.portrait : FIGMA_IMAGE.landscape
  const warnings = [
    'Image src values point to this reference site’s local Figma assets. Replace them with reachable product/CDN URLs before publishing in Mosaic.',
    `Figma radius ${String(values.borderRadius)} is mapped to the semantic Mosaic radius token "${radius}".`,
  ]

  let visual: MosaicSdlNode
  if (multiImage === 1) {
    visual = image(mainSource, title, { width: '100%', height, aspectRatio, radius })
  } else {
    const secondaryHeight = Math.round((height - (subCount - 1) * 2) / subCount)
    visual = row(
      [
        col([image(mainSource, title, { width: '100%', height, aspectRatio, radius })], {
          flex: 1,
          height,
        }),
        col(
          Array.from({ length: subCount }, (_, index) =>
            image(FIGMA_IMAGE.square, `${title} — supporting image ${index + 1}`, {
              width: '100%',
              height: secondaryHeight,
              aspectRatio: '1/1',
              radius,
            }),
          ),
          { gap: 0.5, width: 73, height },
        ),
      ],
      { gap: 0.5, width: '100%', height },
    )
    warnings.push(
      'Multi-image layout is expressible with Row/Col, but “round only the outside container corners” is not guaranteed by the current portable contract.',
    )
  }

  const content: MosaicSdlNode[] = [visual]

  if (Boolean(values.imageBadge)) {
    content.push(
      row(
        [node('Badge', { label: '1 day ago', size: 'sm', color: 'secondary', variant: 'solid' })],
        { gap: 1 },
      ),
    )
    warnings.push(
      'The time badge is emitted in normal flow as an accessible fallback. On-image placement requires the Layered Composition candidate.',
    )
  }

  if (Boolean(values.showOverlay)) {
    warnings.push('showOverlay is omitted: Layered Composition is still a proposal, not a published Mosaic contract.')
  }

  if (Boolean(values.collectionButton) || Boolean(values.moreImageIcon)) {
    warnings.push(
      'Collection/more actions are omitted until the product supplies typed ActionConfig payloads and navigation/policy behavior.',
    )
  }

  const showMetadata = Boolean(values.showMetadata)
  const showHover = Boolean(values.showHover)
  if (showMetadata || showHover) {
    content.push(
      col(
        [
          text(title, { size: 'md', maxLines: 2 }),
          caption(source, { size: 'sm', color: 'secondary', maxLines: 1 }),
        ],
        { gap: 0.5, width: '100%' },
      ),
    )
  }

  if (showHover) {
    warnings.push(
      'Hover-revealed metadata is converted to always-visible content because SDL has no approved cross-input hover/pop-out contract.',
    )
  }

  return {
    node: col(content, { gap: dense ? 1 : 2, width, minWidth: 182 }),
    warnings,
  }
}

export function generateImageContainerSdl(values: MosaicValues): MosaicGeneration {
  const output = buildImageContainerSdl(values)
  return finish(basic([output.node], { padding: 0 }), output.warnings)
}
