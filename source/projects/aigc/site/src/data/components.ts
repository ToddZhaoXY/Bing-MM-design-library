import registry from './component-registry.json'
/** AIGC registry, generated from scoped Figma extraction and checked source mappings. */
export type Tier = 'Molecule' | 'Cell' | 'Organism'
export type Bin = 'MM-built' | 'ACF-direct' | 'Hybrid' | 'N/A' | 'SERP only' | 'IRP only' | 'TBD'
export type PropDef =
  | { name: string; kind: 'select'; values: string[]; default: string; numeric?: boolean; under?: string }
  | { name: string; kind: 'boolean'; default: boolean; under?: string }
  | { name: string; kind: 'text'; default: string; under?: string }
export interface ComponentDef {
  slug: string
  name: string
  tier: Tier
  partOf?: string
  nodeId: string
  bin: Bin
  binEvidence?: string
  verified: boolean
  overview: string
  props: PropDef[]
  notes?: string[]
  tag?: string
  sourceIDs?: string[]
}

export const components = registry as unknown as ComponentDef[]
export const bySlug = (slug: string) => components.find(component => component.slug === slug)
export const byTier = (tier: Tier) => components.filter(component => component.tier === tier && !component.partOf)
export const partsOf = (slug: string) => components.filter(component => component.partOf === slug)
export const propertyCombinations = (props: PropDef[]) => props.reduce((count, prop) => count * (prop.kind === 'select' ? prop.values.length : prop.kind === 'boolean' ? 2 : 1), 1)
