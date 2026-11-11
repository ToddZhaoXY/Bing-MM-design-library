export const SLIDESHOW_FILE = 'fRSRroY4YFgJSeqLLE0Y38'
export const SLIDESHOW_IMAGE = './figma/fy25/windows-bloom.png'
export const SLIDESHOW_FONT = "'MM FY25 Roboto', Roboto, sans-serif"
export const slideshowSizes = {
  '3:4': { width: 312, height: 424 },
  '5:4': { width: 536, height: 424 },
  '3:2': { width: 312, height: 204 },
} as const
export type SlideShowSize = keyof typeof slideshowSizes
export const slideshowPaginations = ['Bottom arrows', 'Top bars', 'Bottom bars', 'Bottom bars + arrows'] as const
export type SlideShowPagination = typeof slideshowPaginations[number]
export type SlideShowState = 'Default' | 'Hover'
export interface SlideShowSlide {
  src: string
  alt: string
  title?: string
  description?: string
  source?: string
  /** The source's fifth arrow slide is an end card, not another photograph. */
  seeMore?: boolean
}

const nodes = {
  '3:4': ['2568:13161', '2568:13209', '2568:13303', '2568:13374', '2608:1516'],
  '5:4': ['2568:13447', '2568:13537', '2568:13631', '2568:13699', '2608:1684'],
  '3:2': ['2568:13771', '2568:13861', '2568:13955', '2568:14032', '2608:1815'],
} as const
export const slideshowSources = Object.entries(nodes).flatMap(([size, ids]) => ids.map((nodeId, i) => ({
  label: `${size} · ${i === 4 ? 'Bottom bars + arrows' : i < 2 ? ['Bottom arrows', 'Top bars'][i] : `Bottom bars · ${i === 3 ? 'Hover' : 'Default'}`}`,
  nodeId,
  values: { size, pagination: i === 4 ? 'Bottom bars + arrows' : (i < 2 ? ['Bottom arrows', 'Top bars'][i] : 'Bottom bars'), state: i === 3 ? 'Hover' : 'Default' },
})))

export function slideshowSelection(values: Record<string, unknown> = {}) {
  const size: SlideShowSize = Object.prototype.hasOwnProperty.call(slideshowSizes, String(values.size)) ? values.size as SlideShowSize : '3:4'
  const pagination: SlideShowPagination = slideshowPaginations.some(value => value === values.pagination) ? values.pagination as SlideShowPagination : 'Bottom bars'
  const state: SlideShowState = pagination === 'Bottom bars' && values.state === 'Hover' ? 'Hover' : 'Default'
  return { size, pagination, state }
}

export function slideshowCopy(size: SlideShowSize, pagination: SlideShowPagination) {
  if (pagination !== 'Bottom bars') return { title: 'Personable Tom at age 60s', description: '' }
  return size === '3:2' ? {
    title: 'Colors of the Tundra',
    description: "Explore Denali's open tundra, from summer wildflowers to brilliant autumn colors.",
  } : {
    title: 'The Alaska Range',
    description: "Discover Denali's snow-covered peaks rising above the vast Alaskan wilderness.",
  }
}

export function slideshowSlides(size: SlideShowSize, pagination: SlideShowPagination): SlideShowSlide[] {
  // Figma supplies one placeholder fill. Collection counts do not imply unique preview assets.
  const hasEndCard = pagination === 'Bottom arrows' || pagination === 'Bottom bars + arrows'
  return Array.from({ length: hasEndCard ? 5 : 4 }, (_, i) => ({
    src: SLIDESHOW_IMAGE, alt: 'Blue abstract Windows bloom — Figma placeholder',
    ...slideshowCopy(size, pagination), source: 'imdb.com',
    ...(hasEndCard && i === 4 ? { seeMore: true } : {}),
  }))
}

export function slideIndex(value: unknown, count: number) {
  const n = Number(value)
  return Math.max(0, Math.min(count - 1, Number.isFinite(n) ? Math.trunc(n) : 0))
}
