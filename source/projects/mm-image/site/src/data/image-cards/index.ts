import { smallCardGroups } from './small'
import { tallCardGroups } from './tall'
import { wideCardGroups } from './wide'
export type { CardNode, CardVariant, ImageCardGroup } from './types'

export const IMAGE_CARDS_FILE = '9yILIRLGDWRBLMqbs5hkoZ'
export const IMAGE_CARDS_SLUG = 'image-cards'
export const imageCardGroups = [...smallCardGroups, ...tallCardGroups, ...wideCardGroups]
export const imageCardSlug = (size: string) => `image-card-${size}`
export const imageCardTag = (size: string) => `ImageCard${size}`
export const imageCardGroup = (size: string) => imageCardGroups.find(group => group.size === size)
export const imageCardVariant = (size: string, variant?: string) => {
  const group = imageCardGroup(size)
  return group?.variants.find(item => item.id === variant || item.label === variant) ?? group?.variants[0]
}
export const figmaCardUrl = (nodeId: string) =>
  `https://www.figma.com/design/${IMAGE_CARDS_FILE}/MM-ACF-FY25?node-id=${nodeId.replace(':', '-')}`

export function imageCardSelection(values: Record<string, unknown>) {
  const group = imageCardGroup(String(values.size ?? '')) ?? imageCardGroups[0]
  const variant = imageCardVariant(group.size, String(values.variant ?? ''))!
  return { size: group.size, variant: variant.label }
}

/** Old individual-size URLs and saved blocks remain usable after consolidation. */
export function legacyImageCardSize(slug: string) {
  return imageCardGroups.find(group => imageCardSlug(group.size) === slug)?.size
}
export function migrateImageCardBlock<T extends { slug: string; values: Record<string, string | boolean> }>(block: T): T {
  const legacySize = legacyImageCardSize(block.slug)
  if (!legacySize && block.slug !== IMAGE_CARDS_SLUG) return block
  return { ...block, slug: IMAGE_CARDS_SLUG, values: {
    ...block.values, ...imageCardSelection({ ...block.values, ...(legacySize ? { size: legacySize } : {}) }),
  } }
}
