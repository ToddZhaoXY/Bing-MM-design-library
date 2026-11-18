// Build-generated navigation metadata; full registries load with the workbench.
import summary from './overview-summary.json'
export const components = summary.components
export const byTier = (tier: string) => components.filter(component => component.tier === tier && !component.partOf)
export const partsOf = (slug: string) => components.filter(component => component.partOf === slug)
