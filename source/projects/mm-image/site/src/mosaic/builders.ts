import type { MosaicGeneration, MosaicSdlNode } from './types'
import { validateMosaicSdl } from './validate'

export const FIGMA_IMAGE = {
  landscape: 'figma/img/photo-landscape.png',
  portrait: 'figma/img/photo-portrait.png',
  square: 'figma/img/photo-square.png',
  favicon: 'figma/img/favicon-12.png',
  related: 'figma/img/rs-card-thumb.png',
}

export function node(
  type: string,
  properties: Record<string, unknown> = {},
  children: MosaicSdlNode[] = [],
): MosaicSdlNode {
  return { type, ...properties, children }
}

export function text(
  value: unknown,
  properties: Record<string, unknown> = {},
): MosaicSdlNode {
  return node('Text', { value: String(value ?? ''), ...properties })
}

export function title(
  value: unknown,
  properties: Record<string, unknown> = {},
): MosaicSdlNode {
  return node('Title', { value: String(value ?? ''), ...properties })
}

export function caption(
  value: unknown,
  properties: Record<string, unknown> = {},
): MosaicSdlNode {
  return node('Caption', { value: String(value ?? ''), ...properties })
}

export function image(
  src: string,
  alt: string,
  properties: Record<string, unknown> = {},
): MosaicSdlNode {
  return node('Image', { src, alt, fit: 'cover', ...properties })
}

export function button(
  label: string,
  properties: Record<string, unknown> = {},
): MosaicSdlNode {
  return node('Button', { label, ...properties })
}

export function basic(children: MosaicSdlNode[], properties: Record<string, unknown> = {}) {
  return node('Basic', properties, children)
}

export function col(children: MosaicSdlNode[], properties: Record<string, unknown> = {}) {
  return node('Col', properties, children)
}

export function row(children: MosaicSdlNode[], properties: Record<string, unknown> = {}) {
  return node('Row', properties, children)
}

export function card(children: MosaicSdlNode[], properties: Record<string, unknown> = {}) {
  return node('Card', properties, children)
}

/**
 * MM exposes spacing in pixels while Mosaic accepts semantic spacing numbers.
 * Keep the conversion explicit so unsupported values never reach the renderer.
 */
export function spacing(px: unknown): number {
  const value = Number(px)
  const map: Record<number, number> = {
    0: 0,
    2: 0.5,
    4: 1,
    8: 2,
    12: 3,
    16: 4,
    20: 5,
    24: 6,
    36: 9,
    48: 12,
    80: 20,
  }
  if (value in map) return map[value]
  if (!Number.isFinite(value) || value <= 0) return 0
  const supported = Object.keys(map).map(Number)
  const nearest = supported.reduce((best, item) =>
    Math.abs(item - value) < Math.abs(best - value) ? item : best,
  )
  return map[nearest]
}

export function finish(node: MosaicSdlNode, warnings: string[] = []): MosaicGeneration {
  return {
    node,
    validation: validateMosaicSdl(node),
    warnings: [...new Set(warnings)],
  }
}

export function unwrapBasic(generation: MosaicGeneration): MosaicSdlNode[] {
  return generation.node.type === 'Basic' && Array.isArray(generation.node.children)
    ? generation.node.children
    : [generation.node]
}
