import catalogJson from '../data/mosaic-sdl-catalog.json'
import type { MosaicValidationCoverage, MosaicValidationIssue, MosaicValidationResult } from './types'

interface CatalogProp {
  name: string
  type: string
  required: boolean
  enum?: unknown[]
}

interface CatalogComponent {
  name: string
  version: { major: number; minor: number }
  canHaveChildren: boolean
  props: CatalogProp[]
}

interface CatalogSnapshot {
  generatedAt: string
  source: { apiUrl: string; mosaicCliVersion: string; schemaSet: string }
  components: Record<string, CatalogComponent>
}

const catalog = catalogJson as unknown as CatalogSnapshot

export const mosaicCatalogSnapshot = {
  generatedAt: catalog.generatedAt,
  mosaicCliVersion: catalog.source.mosaicCliVersion,
  schemaSet: catalog.source.schemaSet,
  componentCount: Object.keys(catalog.components).length,
}

function isRecord(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false
  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

function owns(value: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(value, key)
}

/** Split only at top-level pipes, so literal<false> and future nested unions stay intact. */
function unionMembers(type: string): string[] {
  if (!type.startsWith('union<') || !type.endsWith('>')) return [type]
  const inner = type.slice(6, -1)
  const result: string[] = []
  let depth = 0
  let start = 0
  for (let index = 0; index < inner.length; index++) {
    if (inner[index] === '<') depth++
    else if (inner[index] === '>') depth--
    else if (inner[index] === '|' && depth === 0) {
      result.push(inner.slice(start, index).trim())
      start = index + 1
    }
  }
  result.push(inner.slice(start).trim())
  return result
}

function matchesType(value: unknown, type: string, prop: CatalogProp): boolean {
  if (type.startsWith('union<') && type.endsWith('>')) return unionMembers(type).some(member => matchesType(value, member, prop))
  if (type === 'string') return typeof value === 'string'
  if (type === 'number') return typeof value === 'number' && Number.isFinite(value)
  if (type === 'boolean') return typeof value === 'boolean'
  if (type === 'object') return isRecord(value)
  if (type === 'array') return Array.isArray(value)
  if (type === 'enum') return prop.enum?.includes(value) ?? false
  if (type === 'literal<false>') return value === false
  if (type === 'literal<true>') return value === true
  // Unknown catalog types fail closed. The snapshot has no richer contract definitions.
  return false
}

function describe(value: unknown): string {
  if (typeof value === 'number' && !Number.isFinite(value)) return String(value)
  if (value === undefined) return 'undefined'
  try { return JSON.stringify(value) ?? String(value) }
  catch { return '[non-serializable value]' }
}

export function validateMosaicSdl(root: unknown): MosaicValidationResult {
  const issues: MosaicValidationIssue[] = []
  const componentTypes = new Set<string>()
  const ancestors = new Set<object>()
  const coverage: MosaicValidationCoverage = {
    mode: 'catalog-snapshot',
    checked: ['component names', 'flattened prop names', 'required props', 'primitive/enum/union types', 'children structure'],
    opaqueProperties: [],
    limitations: [
      'Object members and array item schemas are absent from this catalog snapshot and are not validated.',
      'Passing these checks does not verify Mosaic runtime behavior, product actions, URL reachability or visual equivalence.',
    ],
  }
  let nodeCount = 0
  const error = (path: string, message: string) => issues.push({ severity: 'error' as const, path, message })

  const visit = (value: unknown, path: string, depth: number) => {
    if (!isRecord(value)) { error(path, 'Node must be a plain object.'); return }
    if (ancestors.has(value)) { error(path, 'SDL children cannot contain circular references.'); return }
    if (depth > 200) { error(path, 'SDL nesting exceeds the validator limit of 200 levels.'); return }
    nodeCount += 1
    const type = value.type
    if (!owns(value, 'type') || typeof type !== 'string' || type.trim().length === 0) {
      error(`${path}.type`, 'Node type must be a non-empty string.')
      return
    }
    componentTypes.add(type)
    const component = owns(catalog.components, type) ? catalog.components[type] : undefined
    if (!component) { error(`${path}.type`, `Unknown Mosaic component "${type}".`); return }

    if (owns(value, 'props')) error(`${path}.props`, 'SDL v2 is flattened; component props must be node siblings.')
    const propMap = new Map(component.props.map(prop => [prop.name, prop]))
    const allowed = new Set(['type', 'children', ...propMap.keys()])
    for (const key of Object.keys(value)) {
      if (!allowed.has(key) && key !== 'props') {
        error(`${path}.${key}`, `"${key}" is not declared by ${type} v${component.version.major}.${component.version.minor}.`)
      }
    }
    for (const prop of component.props) {
      const present = owns(value, prop.name)
      if (prop.required && !present) {
        error(`${path}.${prop.name}`, `Missing required ${type} prop "${prop.name}".`)
      } else if (present && !matchesType(value[prop.name], prop.type, prop)) {
        error(`${path}.${prop.name}`, `Expected ${prop.type} for ${type}.${prop.name}; received ${describe(value[prop.name])}.`)
      } else if (present && (isRecord(value[prop.name]) || Array.isArray(value[prop.name]))) {
        // Checking the outer shape must never be presented as checking ActionConfig,
        // resource objects, responsive tokens, option records, or array item contracts.
        coverage.opaqueProperties.push({ path: `${path}.${prop.name}`, catalogType: prop.type })
      }
    }

    if (!owns(value, 'children')) return
    if (!Array.isArray(value.children)) { error(`${path}.children`, 'children must be an array.'); return }
    if (!component.canHaveChildren && value.children.length > 0) {
      error(`${path}.children`, `${type} is a leaf component and cannot have child nodes.`)
      return
    }
    ancestors.add(value)
    for (let index = 0; index < value.children.length; index++) {
      visit(value.children[index], `${path}.children[${index}]`, depth + 1)
    }
    ancestors.delete(value)
  }

  visit(root, '$', 0)
  return {
    valid: !issues.some(issue => issue.severity === 'error'),
    nodeCount,
    componentTypes: [...componentTypes].sort(),
    issues,
    coverage,
  }
}
