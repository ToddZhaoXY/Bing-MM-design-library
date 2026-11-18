import { LibraryNav } from './LibraryNav'
import type { LibraryNavGroup, LibraryNavNode } from './LibraryNav'
import { byTier, partsOf, components } from '../data/overview-data'
type ComponentDef = (typeof components)[number]

const tiers = ['Molecule', 'Cell', 'Organism'] as const
const componentNode = (component: ComponentDef): LibraryNavNode => ({
  id: component.slug,
  label: component.name,
  to: `/c/${component.slug}`,
  children: partsOf(component.slug).map(componentNode),
})
const groups: LibraryNavGroup[] = [
  { id: 'overview', label: 'Overview', items: [{"id": "0", "label": "Introduction", "to": "/"}, {"id": "1", "label": "Video-specific rules", "to": "/foundations"}, {"id": "2", "label": "Playground", "to": "/playground"}, {"id": "3", "label": "Components · source catalog", "to": "/source-catalog"}] },
  ...tiers.map(tier => ({ id: tier.toLowerCase(), label: `${tier}s`, items: byTier(tier).map(componentNode) })),
]

export function Nav() {
  return <LibraryNav brand="VIDEO ACF" description="MM Video · component library" groups={groups} sourceUrl="https://www.figma.com/design/fRSRroY4YFgJSeqLLE0Y38/MM-ACF" />
}
