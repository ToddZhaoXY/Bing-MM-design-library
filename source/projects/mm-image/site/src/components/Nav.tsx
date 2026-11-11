import { LibraryNav } from './LibraryNav'
import type { LibraryNavGroup, LibraryNavNode } from './LibraryNav'
import { byTier, partsOf } from '../data/components'
import type { ComponentDef } from '../data/components'

const tiers = ['Molecule', 'Cell', 'Organism'] as const
const componentNode = (component: ComponentDef): LibraryNavNode => ({
  id: component.slug,
  label: component.name,
  to: `/c/${component.slug}`,
  children: partsOf(component.slug).map(componentNode),
})
const groups: LibraryNavGroup[] = [
  { id: 'overview', label: 'Overview', items: [{"id": "0", "label": "Introduction", "to": "/"}, {"id": "1", "label": "Playground", "to": "/playground"}] },
  ...tiers.map(tier => ({ id: tier.toLowerCase(), label: `${tier}s`, items: byTier(tier).map(componentNode) })),
]

export function Nav() {
  return <LibraryNav brand="MMACF" description="Multimedia ACF · component library" groups={groups} />
}
