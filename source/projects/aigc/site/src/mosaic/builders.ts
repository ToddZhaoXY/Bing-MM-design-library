import type { MosaicGeneration, MosaicSdlNode } from './types'
import { validateMosaicSdl } from './validate'

export function node(
  type: string,
  properties: Record<string, unknown> = {},
  children: MosaicSdlNode[] = [],
): MosaicSdlNode {
  return { ...properties, type, children }
}

export function text(value: unknown, properties: Record<string, unknown> = {}): MosaicSdlNode {
  return node('Text', { value: String(value ?? ''), ...properties })
}

export function title(value: unknown, properties: Record<string, unknown> = {}): MosaicSdlNode {
  return node('Title', { value: String(value ?? ''), ...properties })
}

export function caption(value: unknown, properties: Record<string, unknown> = {}): MosaicSdlNode {
  return node('Caption', { value: String(value ?? ''), ...properties })
}

/** Callers supply source-derived assets; the infrastructure contains no MM image paths. */
export function image(src: string, alt: string, properties: Record<string, unknown> = {}): MosaicSdlNode {
  return node('Image', { src, alt, fit: 'cover', ...properties })
}

export function button(label: string, properties: Record<string, unknown> = {}): MosaicSdlNode {
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
 * Preserve MM_ACF's pixel-to-semantic-spacing mapping. Intermediate pixel values
 * are approximated to the nearest supported step; this is not a source token.
 */
export function spacing(px: unknown): number {
  const value = Number(px)
  const map: Record<number, number> = {
    0: 0, 2: 0.5, 4: 1, 8: 2, 12: 3, 16: 4,
    20: 5, 24: 6, 36: 9, 48: 12, 80: 20,
  }
  if (value in map) return map[value]
  if (!Number.isFinite(value) || value <= 0) return 0
  const supported = Object.keys(map).map(Number)
  const nearest = supported.reduce((best, item) =>
    Math.abs(item - value) < Math.abs(best - value) ? item : best,
  )
  return map[nearest]
}

export function finish(root: MosaicSdlNode, warnings: string[] = []): MosaicGeneration {
  const validation = validateMosaicSdl(root)
  const coverageWarnings = validation.coverage.opaqueProperties.length > 0
    ? ['Object/array properties pass outer-shape checks only; nested action, resource and other contracts are not included in this catalog snapshot.']
    : []
  return { node: root, validation, warnings: [...new Set([...warnings, ...coverageWarnings])] }
}

export function unwrapBasic(generation: MosaicGeneration): MosaicSdlNode[] {
  return generation.node.type === 'Basic' && Array.isArray(generation.node.children)
    ? generation.node.children
    : [generation.node]
}
