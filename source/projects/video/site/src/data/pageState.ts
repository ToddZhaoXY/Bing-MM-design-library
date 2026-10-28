import type { ComponentDef, PropDef } from './components'

export const STATE_VERSION = 1 as const
export const MIN_CANVAS_WIDTH = 320
export const MAX_CANVAS_WIDTH = 3840
export const DEFAULT_CANVAS_WIDTH = 1200
export const MAX_BLOCKS = 100
export const MAX_STATE_BYTES = 2 * 1024 * 1024
export type SurfaceId = 'mainline' | 'go-wide' | 'magazine' | 'vrp' | 'blank'
export type PropertyValues = Record<string, string | boolean>
export type LiveValues = Record<string, string | boolean | number>

export interface PageBlock {
  id: number
  slug: string
  values: PropertyValues
  live: LiveValues
}
export interface PageState {
  version: typeof STATE_VERSION
  surface: SurfaceId
  width: number
  fitToWidth: boolean
  blocks: PageBlock[]
}
export interface SurfaceDefinition {
  id: SurfaceId
  name: string
  note: string
  preset: string[]
  width: number
  padding: number
}
export const SURFACES: SurfaceDefinition[] = [
  { id: 'mainline', name: 'Mainline', note: 'The source 1520 px search page with its mainline video answer.', preset: ['serp-video-answer-mainline'], width: 1520, padding: 0 },
  { id: 'go-wide', name: 'Go-wide', note: 'Source design in progress — this Figma page is empty.', preset: ['serp-video-answer-go-wide'], width: 1600, padding: 24 },
  { id: 'magazine', name: 'Magazine', note: 'The source 1520 px video magazine page composition.', preset: ['serp-video-magazine-page'], width: 1520, padding: 0 },
  { id: 'vrp', name: 'VRP', note: 'Source reference only — the linked node is a WIP cover.', preset: ['vrp-whole-page'], width: 1200, padding: 24 },
  { id: 'blank', name: 'Blank', note: 'An empty canvas for your own assembly.', preset: [], width: DEFAULT_CANVAS_WIDTH, padding: 24 },
]

export const surfaceDefinition = (id: SurfaceId) => SURFACES.find(surface => surface.id === id)!

export type StateResult = { ok: true; state: PageState } | { ok: false; error: string }
const forbidden = new Set(['__proto__', 'prototype', 'constructor'])
type JsonObject = Record<string, unknown>

function object(value: unknown, where: string): JsonObject {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${where} must be an object.`)
  const proto = Object.getPrototypeOf(value)
  if (proto !== Object.prototype && proto !== null) throw new Error(`${where} must be a plain object.`)
  return value as JsonObject
}
function keys(value: JsonObject, allowed: string[], where: string) {
  for (const key of Object.keys(value)) {
    if (forbidden.has(key) || !allowed.includes(key)) throw new Error(`${where}.${key} is not supported.`)
  }
}
function property(value: unknown, prop: PropDef, where: string, live: boolean): string | boolean | number {
  if (prop.kind === 'boolean') {
    if (typeof value !== 'boolean') throw new Error(`${where} must be true or false.`)
    return value
  }
  if (prop.kind === 'text') {
    if (typeof value !== 'string' || value.length > 20000) throw new Error(`${where} must be a string of at most 20,000 characters.`)
    return value
  }
  if (live && prop.numeric && typeof value === 'number' && Number.isFinite(value) && prop.values.includes(String(value))) return value
  if (typeof value !== 'string' || !prop.values.includes(value)) throw new Error(`${where} must be one of: ${prop.values.map(item => JSON.stringify(item)).join(', ')}.`)
  return value
}
function bag(value: unknown, def: ComponentDef, where: string, live: boolean): LiveValues {
  const input = object(value, where)
  keys(input, def.props.map(prop => prop.name), where)
  const result: LiveValues = {}
  for (const prop of def.props) {
    if (forbidden.has(prop.name)) throw new Error(`Unsupported registry property: ${prop.name}.`)
    if (Object.prototype.hasOwnProperty.call(input, prop.name)) result[prop.name] = property(input[prop.name], prop, `${where}.${prop.name}`, live)
    else if (!live) result[prop.name] = prop.default
  }
  return result
}

/** Runtime callbacks and imported snapshots use the same registry contract. */
export function validateLiveValues(value: unknown, def: ComponentDef): LiveValues {
  return bag(value, def, 'live', true)
}

export function validatePageState(value: unknown, registry: readonly ComponentDef[]): StateResult {
  try {
    const input = object(value, 'state')
    keys(input, ['version', 'surface', 'width', 'fitToWidth', 'blocks'], 'state')
    if (input.version !== STATE_VERSION) throw new Error(`Unsupported state version. Expected ${STATE_VERSION}.`)
    if (!SURFACES.some(surface => surface.id === input.surface)) throw new Error(`surface must be one of: ${SURFACES.map(surface => surface.id).join(', ')}.`)
    if (typeof input.width !== 'number' || !Number.isInteger(input.width) || input.width < MIN_CANVAS_WIDTH || input.width > MAX_CANVAS_WIDTH) throw new Error(`width must be an integer between ${MIN_CANVAS_WIDTH} and ${MAX_CANVAS_WIDTH}.`)
    if (typeof input.fitToWidth !== 'boolean') throw new Error('fitToWidth must be true or false.')
    if (!Array.isArray(input.blocks) || input.blocks.length > MAX_BLOCKS) throw new Error(`blocks must be an array with at most ${MAX_BLOCKS} entries.`)
    const seen = new Set<number>()
    const blocks = input.blocks.map((raw, index): PageBlock => {
      const where = `blocks[${index}]`
      const block = object(raw, where)
      keys(block, ['id', 'slug', 'values', 'live'], where)
      if (typeof block.id !== 'number' || !Number.isSafeInteger(block.id) || block.id < 1 || seen.has(block.id)) throw new Error(`${where}.id must be a unique positive safe integer.`)
      seen.add(block.id)
      const def = registry.find(component => component.slug === block.slug)
      if (!def) throw new Error(`${where}.slug is not in the component registry.`)
      return { id: block.id, slug: def.slug, values: bag(block.values, def, `${where}.values`, false) as PropertyValues,
        live: bag(block.live, def, `${where}.live`, true) }
    })
    return { ok: true, state: { version: STATE_VERSION, surface: input.surface as SurfaceId,
      width: input.width, fitToWidth: input.fitToWidth, blocks } }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Invalid page state.' }
  }
}

export function parsePageState(text: string, registry: readonly ComponentDef[]): StateResult {
  if (new TextEncoder().encode(text).length > MAX_STATE_BYTES) return { ok: false, error: 'State JSON exceeds the 2 MB limit.' }
  let value: unknown
  try { value = JSON.parse(text) } catch { return { ok: false, error: 'Paste a valid JSON object without Markdown fences.' } }
  return validatePageState(value, registry)
}
export function stateJSON(state: PageState): string { return JSON.stringify(state, null, 2) }

/** Imported IDs may be large; adding a block must not overflow a safe integer. */
export function nextBlockId(blocks: readonly PageBlock[]): number {
  const max = blocks.reduce((value, block) => Math.max(value, block.id), 0)
  if (max < Number.MAX_SAFE_INTEGER) return max + 1
  const used = new Set(blocks.map(block => block.id))
  let id = 1
  while (used.has(id)) id += 1
  return id
}

export function effectiveValues(block: PageBlock): PropertyValues {
  return { ...block.values, ...Object.fromEntries(Object.entries(block.live).map(([name, value]) => [name, typeof value === 'number' ? String(value) : value])) }
}
