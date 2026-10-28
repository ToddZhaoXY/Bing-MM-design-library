/** Source geometry read from the scoped Figma cell samples, not inferred from names. */
export const VIDEO_GROUP_CONFIGURATIONS = ['Vertical / SERP', 'Horizontal / SERP / Below', 'Horizontal / SERP / Overlay', 'Horizontal / VRP'] as const
export const SHORTS_GROUP_CONFIGURATIONS = ['SERP / 3:4 / Below', 'SERP / 2:3 / Below', 'SERP / 3:4 / Overlay', 'SERP / 2:3 / Overlay', 'VRP / 3:4 / Below'] as const
export type VideoGroupConfiguration = typeof VIDEO_GROUP_CONFIGURATIONS[number]
export type ShortsGroupConfiguration = typeof SHORTS_GROUP_CONFIGURATIONS[number]
export type CellState = 'Default' | 'Preview' | 'Post-preview'
export type CellPlacement = 'SERP' | 'VRP'
export type CellLive = (next: Record<string, string | number | boolean>) => void
export type GroupItem = { title?: string; thumbnailUrl?: string; duration?: string; source?: string; channel?: string; views?: string; date?: string; description?: string }
export type VideoGroupOptions = {
  configuration?: VideoGroupConfiguration; layout?: 'Vertical' | 'Horizontal'; metadataPosition?: 'Below' | 'Overlay'; placement?: CellPlacement;
  width?: number; itemCount?: number
}
export type ShortsGroupOptions = {
  configuration?: ShortsGroupConfiguration; metadataPosition?: 'Below' | 'Overlay'; placement?: CellPlacement; ratio?: '3:4' | '2:3';
  width?: number; itemCount?: number
}
const validWidth = (value: number | undefined, fallback: number) => Number.isFinite(value) && value! > 0 ? Math.max(240, value!) : fallback
const validCount = (value: number | undefined, fallback: number) => Number.isFinite(value) && value! > 0 ? Math.min(30, Math.max(1, Math.round(value!))) : fallback

export function resolveVideoGroupGeometry(options: VideoGroupOptions = {}) {
  const configuration = options.configuration ?? 'Vertical / SERP'
  const layout = options.layout ?? (configuration.startsWith('Vertical') ? 'Vertical' : 'Horizontal')
  const placement = options.placement ?? (configuration.endsWith('VRP') ? 'VRP' : 'SERP')
  const metadataPosition: 'Inline' | 'Below' | 'Overlay' = layout === 'Vertical' ? 'Inline' : placement === 'VRP' ? 'Below' : options.metadataPosition ?? (configuration.endsWith('Overlay') ? 'Overlay' : 'Below')
  const width = validWidth(options.width, layout === 'Vertical' ? 648 : configuration === 'Horizontal / SERP / Below' ? 1104 : 1056)
  const count = validCount(options.itemCount, layout === 'Vertical' ? 4 : placement === 'VRP' ? 5 : 6)
  const gap = layout === 'Vertical' ? 16 : 24
  const cardWidth = layout === 'Vertical' ? width : placement === 'VRP' ? (width - gap * 4) / 5 : metadataPosition === 'Overlay' ? 284.4 : 185.9
  const height = layout === 'Vertical' ? 200 + (count > 1 ? 24 + (count - 1) * (392 / 3) + Math.max(0, count - 2) * 16 : 0) : metadataPosition === 'Overlay' ? 160 : 200
  const nodeId = layout === 'Vertical' ? '1241:19870' : placement === 'VRP' ? '1258:10572' : metadataPosition === 'Overlay' ? '1258:12465' : '1241:23529'
  const cards = Array.from({ length: count }, (_, index) => ({
    width: cardWidth,
    height: layout === 'Vertical' ? index === 0 ? 200 : 392 / 3 : 200,
    thumbnailHeight: layout === 'Vertical' ? index === 0 ? 200 : 392 / 3 : metadataPosition === 'Overlay' ? 200 : cardWidth * 112 / 200,
    metadataPosition, placement,
  }))
  return { configuration, layout, placement, metadataPosition, width, height, count, gap, cards, nodeId, scrollable: layout === 'Horizontal' }
}

export function resolveShortsGroupGeometry(options: ShortsGroupOptions = {}) {
  const configuration = options.configuration ?? 'SERP / 3:4 / Below'
  const placement = options.placement ?? (configuration.startsWith('VRP') ? 'VRP' : 'SERP')
  const metadataPosition = placement === 'VRP' ? 'Below' : options.metadataPosition ?? (configuration.endsWith('Overlay') ? 'Overlay' : 'Below')
  const ratio = placement === 'VRP' ? '3:4' : options.ratio ?? (configuration.includes('2:3') ? '2:3' : '3:4')
  const width = validWidth(options.width, configuration === 'SERP / 3:4 / Below' ? 1104 : 1056)
  const count = validCount(options.itemCount, 9)
  const thumbnailHeight = placement === 'VRP' ? 216 : metadataPosition === 'Overlay' ? 200 : 238
  const cardWidth = thumbnailHeight * (ratio === '2:3' ? 2 / 3 : 3 / 4)
  const height = metadataPosition === 'Overlay' ? 200 : 312
  const nodeId = placement === 'VRP' ? '1818:81770' : ratio === '2:3' ? metadataPosition === 'Overlay' ? '1818:80291' : '1818:79597' : metadataPosition === 'Overlay' ? '1818:81256' : '1258:13851'
  const cards = Array.from({ length: count }, () => ({ width: cardWidth, height, thumbnailHeight, ratio, metadataPosition, placement }))
  return { configuration, placement, metadataPosition, ratio, width, height, count, gap: 16, cards, nodeId }
}

export function resolveMagazineGeometry({ placement = 'SERP', width: requestedWidth }: { placement?: CellPlacement; width?: number } = {}) {
  const width = Math.max(600, validWidth(requestedWidth, 1200))
  const unit = (width - 11 * 24) / 12
  const spans = placement === 'SERP' ? [6, 3, 3] : [5, 4, 3]
  const columns = spans.map(span => unit * span + (span - 1) * 24)
  return { placement, width, height: 424, gap: 24, spans, columns, nodeId: placement === 'SERP' ? '2136:45835' : '2136:50673' }
}

export const cellAssets = {
  gradient: 'figma/cells/scroller-gradient.png', chevron: 'figma/cells/chevron-right.svg',
  imdb: 'figma/cells/imdb.png', citationImdb: 'figma/cells/citation-imdb.png', citationWikipedia: 'figma/cells/citation-wikipedia.png',
  citationMaskFirst: 'figma/cells/citation-mask-first.svg', citationMaskSecond: 'figma/cells/citation-mask-second.svg',
  arrow: 'figma/cells/arrow-right.svg', link: 'figma/cells/link.svg', maximize: 'figma/cells/maximize.svg',
} as const

export const magazineOverview = {
  title: 'Overview',
  text: 'Thomas Jeffrey Hanks is an American actor and filmmaker celebrated for his versatility in comedic and dramatic roles and regarded as an American cultural icon. A two-time consecutive Best Actor Oscar winner for Philadelphia (1993) and Forrest Gump (1994), his career spans acclaimed films such as Splash Sleepless in Seattle, Saving Private Ryan, Cast Away',
  age: '69 years (Jul 9, 1956)', spouses: 'Rita Wilson (1988–), Samantha Lewes (1978–1987)',
  imdbTitle: 'Tom Hanks - IMDb',
  imdbText: 'Tom Hanks Through the Years Take a journey through the prolific career of Oscar-winning actor Tom Hanks through his standout roles in Philadelphia, Forrest Gump, and more films.',
} as const
