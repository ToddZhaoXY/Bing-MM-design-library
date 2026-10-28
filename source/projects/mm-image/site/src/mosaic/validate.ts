import catalogJson from '../data/mosaic-sdl-catalog.json'
import type {
  MosaicSdlNode,
  MosaicValidationIssue,
  MosaicValidationResult,
} from './types'

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
  source: {
    apiUrl: string
    mosaicCliVersion: string
    schemaSet: string
  }
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
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function matchesAtomicType(value: unknown, type: string, prop: CatalogProp): boolean {
  if (type === 'string') return typeof value === 'string'
  if (type === 'number') return typeof value === 'number' && Number.isFinite(value)
  if (type === 'boolean') return typeof value === 'boolean'
  if (type === 'object') return isRecord(value)
  if (type === 'array') return Array.isArray(value)
  if (type === 'enum') return prop.enum?.includes(value) ?? false
  if (type === 'literal<false>') return value === false
  if (type === 'literal<true>') return value === true
  // Catalog entries such as action/resource contracts are intentionally opaque
  // in this snapshot. Their outer object is still checked above.
  return true
}

function matchesCatalogType(value: unknown, prop: CatalogProp): boolean {
  const union = prop.type.match(/^union<(.+)>$/)
  if (!union) return matchesAtomicType(value, prop.type, prop)
  return union[1].split('|').some((type) => matchesAtomicType(value, type, prop))
}

export function validateMosaicSdl(root: MosaicSdlNode): MosaicValidationResult {
  const issues: MosaicValidationIssue[] = []
  const componentTypes = new Set<string>()
  let nodeCount = 0

  const error = (path: string, message: string) => {
    issues.push({ severity: 'error', path, message })
  }

  const visit = (value: unknown, path: string) => {
    if (!isRecord(value)) {
      error(path, 'Node must be an object.')
      return
    }

    nodeCount += 1
    const type = value.type
    if (typeof type !== 'string' || type.length === 0) {
      error(`${path}.type`, 'Node type must be a non-empty string.')
      return
    }

    componentTypes.add(type)
    const component = catalog.components[type]
    if (!component) {
      error(`${path}.type`, `Unknown Mosaic component "${type}".`)
      return
    }

    if ('props' in value) {
      error(`${path}.props`, 'SDL v2 is flattened; component props must be node siblings.')
    }

    const propMap = new Map(component.props.map((prop) => [prop.name, prop]))
    const allowed = new Set(['type', 'children', ...propMap.keys()])
    for (const key of Object.keys(value)) {
      if (!allowed.has(key)) {
        error(`${path}.${key}`, `"${key}" is not declared by ${type} v${component.version.major}.${component.version.minor}.`)
      }
    }

    for (const prop of component.props) {
      if (prop.required && !(prop.name in value)) {
        error(`${path}.${prop.name}`, `Missing required ${type} prop "${prop.name}".`)
      } else if (prop.name in value && !matchesCatalogType(value[prop.name], prop)) {
        error(
          `${path}.${prop.name}`,
          `Expected ${prop.type} for ${type}.${prop.name}; received ${JSON.stringify(value[prop.name])}.`,
        )
      }
    }

    if (!('children' in value)) return
    if (!Array.isArray(value.children)) {
      error(`${path}.children`, 'children must be an array.')
      return
    }
    if (!component.canHaveChildren && value.children.length > 0) {
      error(`${path}.children`, `${type} is a leaf component and cannot have child nodes.`)
      return
    }
    value.children.forEach((child, index) => visit(child, `${path}.children[${index}]`))
  }

  visit(root, '$')

  return {
    valid: !issues.some((issue) => issue.severity === 'error'),
    nodeCount,
    componentTypes: [...componentTypes].sort(),
    issues,
  }
}
