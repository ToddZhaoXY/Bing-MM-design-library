import type { CardNode } from '../data/image-cards'
import { IMAGE_CARDS_SLUG, imageCardGroups, imageCardSlug, imageCardVariant, imageCardSelection } from '../data/image-cards'
import type { MosaicAdapter } from './generators'
import type { MosaicSdlNode } from './types'
import { basic, button, col, finish, image, row, spacing, text } from './builders'

const label = (n: CardNode): string => n.text || n.alt || (n.children ?? []).map(label).filter(Boolean).join(' ')
const dimension = (value: unknown, parent: number) => typeof value === 'number' ? value
  : typeof value === 'string' && /^\d+(\.\d+)?%$/.test(value) ? parseFloat(value) / 100 * parent : parent
function padding(value: unknown) {
  const parts = String(value ?? 0).split(/\s+/).map(part => parseFloat(part) || 0)
  const [top = 0, right = top, bottom = top, left = right] = parts
  return { top, right, bottom, left }
}

function portable(n: CardNode, inheritedWidth: number, inheritedHeight: number, warnings: string[], inheritedColor = 'primary'): MosaicSdlNode {
  const s = n.style ?? {}
  const foreground = typeof s.color === 'string' ? s.color : inheritedColor
  const width = dimension(s.width, inheritedWidth)
  const height = dimension(s.height, inheritedHeight)
  if (n.kind === 'image') return image(n.src ?? '', n.alt ?? 'Image', {
    width: Math.min(width, inheritedWidth), height: Math.min(height, inheritedHeight), fit: s.objectFit === 'contain' ? 'contain' : 'cover',
  })
  if (n.kind === 'text') return text(n.text, {
    size: Number(s.fontSize ?? 14) <= 13 ? 'sm' : 'md',
    weight: Number(s.fontWeight ?? 400) >= 600 ? 'bold' : 'normal',
    color: foreground,
    ...(s.width ? { width } : {}),
    ...(s.whiteSpace === 'nowrap' ? { maxLines: 1, truncate: true } : {}),
  })
  if (n.kind === 'action' && !n.children?.some(c => c.kind === 'box' || c.kind === 'image' && Number(c.style?.width) > 24)) {
    return button(label(n) || (n.action === 'scroll' ? 'Next images' : 'View images'), { size: 'sm', variant: 'soft', color: 'secondary' })
  }
  const overlays = (n.children ?? []).filter(c => c.style?.position === 'absolute' && c.kind !== 'image')
  const normal = (n.children ?? []).filter(c => !overlays.includes(c))
  if (overlays.length) warnings.push('Absolute action overlays and inset panels are placed after their image composition; SDL does not preserve their overlap.')
  if (s.display === 'grid') warnings.push('CSS grid uses a linear portable fallback; exact grid placement requires the web component.')
  if (s.transform || s.overflow === 'hidden' || s.overflow === 'clip') warnings.push('Exact image zoom, clipping, and per-corner masks remain web-renderer behavior.')
  const properties: Record<string, unknown> = { gap: spacing(Number(s.gap ?? 0)) }
  if (s.width) properties.width = width
  if (s.height && !overlays.length) properties.height = height
  if (s.flex) properties.flex = s.flex
  const inset = padding(s.padding)
  if (s.padding !== undefined) properties.padding = Object.fromEntries(Object.entries(inset).map(([side, px]) => [side, spacing(px)]))
  if (typeof s.background === 'string' && !s.background.includes('gradient')) properties.background = s.background
  if (s.overflowX === 'auto' || s.overflowX === 'scroll') properties.scrollable = true
  if (s.alignItems === 'center') properties.align = 'center'
  if (s.justifyContent === 'space-between') properties.justify = 'between'
  const contentWidth = Math.max(1, width - inset.left - inset.right)
  const contentHeight = Math.max(1, height - inset.top - inset.bottom)
  const children = normal.map(child => portable(child, contentWidth, contentHeight, warnings, foreground))
  const base = s.display === 'flex' && s.flexDirection !== 'column' ? row(children, properties) : col(children, properties)
  return overlays.length ? col([base, ...overlays.map(child => portable(child, contentWidth, contentHeight, warnings, foreground))], { gap: 2, width }) : base
}

export const imageCardAdapters: Record<string, MosaicAdapter> = Object.fromEntries(imageCardGroups.map(group => [imageCardSlug(group.size), {
  status: 'partial',
  identity: 'Basic → Row/Col → Image + Text + Button',
  componentTypes: ['Basic', 'Row', 'Col', 'Image', 'Text', 'Button'],
  notes: [
    'Each selected FY25 configuration maps to portable image and text content with its source footprint.',
    'On-image actions, source crop zoom, exact clipping and layered related-search panels use explicit linear fallbacks.',
    'Local assets must be replaced with renderer-reachable URLs. Product navigation requires ActionConfig; catalog validity is not visual acceptance.',
  ],
  generate(values) {
    const variant = imageCardVariant(group.size, String(values.variant ?? ''))!
    const warnings = [
      'Reference images use local Figma assets. Replace them with reachable product/CDN URLs before publishing in Mosaic.',
      'Interactions are visual fallbacks; product navigation requires typed ActionConfig. Web dialogs are not exported.',
      'Font metrics, pixel gaps, rounded clipping, crop zoom and overlay placement may differ in the target Mosaic renderer.',
    ]
    return finish(basic([portable(variant.tree, group.width, group.height, warnings)], { padding: 0 }), warnings)
  },
} satisfies MosaicAdapter]))

imageCardAdapters[IMAGE_CARDS_SLUG] = {
  ...imageCardAdapters[imageCardSlug(imageCardGroups[0].size)],
  generate(values, live, context) {
    const selection = imageCardSelection(values)
    return imageCardAdapters[imageCardSlug(selection.size)].generate(selection, live, context)
  },
}
