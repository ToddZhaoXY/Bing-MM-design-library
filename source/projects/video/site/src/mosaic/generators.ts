import { surfaceDefinition } from '../data/pageState'
import type { SurfaceId } from '../data/pageState'
import { videoMoleculeAssets, sourceIconFiles, supplementalAssets, VIDEO_TITLE, MAGAZINE_TITLE, MAGAZINE_DESCRIPTION, WIDE_DESCRIPTION, shortCardGeometry, videoCardGeometry, heroCardGeometry, supplementalGeometry } from '../data/molecule-data'
import { resolveVideoGroupGeometry, resolveShortsGroupGeometry, resolveMagazineGeometry, magazineOverview, cellAssets } from '../data/cell-data'
import type { VideoGroupOptions, ShortsGroupOptions, CellPlacement, GroupItem } from '../data/cell-data'
import { mainlineScene, shortScene, SOURCE_TITLE, SOURCE_QUERY, VIDEO_TABS, MAGAZINE_SUGGESTIONS, SOURCE_QUESTIONS, SOURCE_SNIPPET } from '../data/organism-data'
import type { MainlineConfiguration } from '../data/organism-data'
import organismAssets from '../data/organism-assets.json'
import { basic, button, caption, col, finish, image, row, spacing, text, title, unwrapBasic } from './builders'
import type { MosaicGeneration, MosaicGenerator, MosaicLiveProps, MosaicSdlNode, MosaicValues } from './types'

export interface MosaicAdapter {
  status: 'available' | 'partial' | 'candidate' | 'gap' | 'product-only'
  identity: string
  componentTypes: string[]
  notes: string[]
  generate: MosaicGenerator
}

const adapters: Record<string, MosaicAdapter> = Object.create(null)

const mediaWarning = 'The catalog has no verified video playback, hover preview, scrubbing, mute or overlay-positioning contract. Source thumbnails, metadata and preview state are preserved as a static normal-flow snapshot.'
const actionWarning = 'Playback, navigation, search and selection actions require host integration. No unverified ActionConfig is generated.'
const assetWarning = 'Images use extracted local Figma assets. Publish those files at reachable URLs before using this SDL outside the library.'
const shellWarning = 'Bing search chrome and responsive platform behavior are product-owned and omitted. An enabled pageShell retains the current query only as context text.'
const layoutWarning = 'Catalog spacing, radius and text-size tokens approximate the source geometry. Complex masks, overlap and clipping require target-renderer verification.'
const effective = (values: MosaicValues, live: MosaicLiveProps): MosaicLiveProps => ({ ...values, ...live })
const str = (props: MosaicLiveProps, key: string, fallback = '') => typeof props[key] === 'string' ? props[key] as string : fallback
const bool = (props: MosaicLiveProps, key: string, fallback = false) => typeof props[key] === 'boolean' ? props[key] as boolean : fallback
const number = (props: MosaicLiveProps, key: string, fallback?: number) => {
  const value = props[key]
  return value !== '' && value !== undefined && Number.isFinite(Number(value)) ? Number(value) : fallback
}
const asset = (path: string) => `${import.meta.env?.BASE_URL ?? './'}${path}`
const thumbnail = (props: MosaicLiveProps) => {
  const value = str(props, 'thumbnailUrl', videoMoleculeAssets.thumbnail)
  return value.startsWith('figma/') ? asset(value) : value
}

function sourceNode(props: MosaicLiveProps, showIcon = true): MosaicSdlNode {
  const source = str(props, 'source', 'YouTube')
  const channel = str(props, 'channel', 'Channel')
  const icons = source === 'Micrsoft Start' || source === 'Microsoft Start'
    ? ['413a3.png', '0f7f8.png'] : [sourceIconFiles[source] ?? sourceIconFiles.Web]
  return row([
    ...(showIcon ? icons.map(file => image(asset(`figma/molecules/${file}`), '', { width: icons.length > 1 ? 8 : 16, height: 16, fit: 'contain', ariaHidden: true })) : []),
    caption([source, channel].filter(Boolean).join(' · '), { size: 'sm' }),
  ], { gap: 1, align: 'center' })
}

function factsNode(props: MosaicLiveProps, views = '10K views', date = 'Nov 08, 2025'): MosaicSdlNode {
  return caption([str(props, 'views', views), str(props, 'date', date)].filter(Boolean).join(' · '), { size: 'sm' })
}

function metadataNode(props: MosaicLiveProps): MosaicSdlNode {
  const placement = str(props, 'placement', 'Below')
  return col([
    text(str(props, 'title', VIDEO_TITLE), { weight: 'semibold', size: str(props, 'placement') === 'Inline' ? 'lg' : 'md', maxLines: number(props, 'titleLines', 2) }),
    ...(bool(props, 'showDescription') ? [text(str(props, 'description', MAGAZINE_DESCRIPTION), { size: 'sm', maxLines: 4 })] : []),
    sourceNode(props, bool(props, 'showSourceIcon', true)),
    ...(bool(props, 'showStats', true) ? [factsNode(props)] : []),
  ], { gap: 1, width: number(props, 'width', placement === 'Inline' ? 403.5 : placement === 'Overlay' ? 355.5 : 386), maxWidth: '100%' })
}

function mediaNode(props: MosaicLiveProps, width: number, height: number, short = false): MosaicSdlNode {
  const state = str(props, 'state', 'Default')
  const preview = state === 'Preview' || state === 'VRP-preview'
  const post = state === 'Post-preview'
  return col([
    image(thumbnail(props), str(props, 'title', VIDEO_TITLE), { width, height, fit: 'cover', radius: short ? 'lg' : 'xl' }),
    ...(!preview && !post && bool(props, 'showBadge', true) ? [caption(str(props, 'duration', '99:99'), { size: 'sm' })] : preview && !short ? [caption('Preview', { size: 'sm' })] : []),
  ], { width, gap: 1, ariaLabel: `${short ? 'Short video' : 'Video'} thumbnail · ${state}` })
}

function filmstripNode(props: MosaicLiveProps, width: number, height: number): MosaicSdlNode {
  return row([0, 1, 2, 3].map(index => image(thumbnail(props), `Preview frame ${index + 1}`, { width: width / 4, height })), { gap: 0, width })
}

function shortNode(props: MosaicLiveProps): MosaicSdlNode {
  const state = str(props, 'state', 'Default')
  const ratio = str(props, 'ratio', '3:4')
  const g = shortCardGeometry(ratio, str(props, 'metadataPosition', 'Below'), state, number(props, 'width'), number(props, 'thumbnailHeight'))
  const vrpPreview = state === 'VRP-preview'
  const content = g.overlay ? {
    ...props,
    title: str(props, 'title', VIDEO_TITLE) === VIDEO_TITLE ? 'Title Lorem ipsum dolor sit amet consectetur.' : props.title,
    source: str(props, 'source', 'YouTube') === 'YouTube' ? 'Source' : props.source,
    channel: str(props, 'channel', 'Channel') === 'Channel' ? 'https://www.lorem.com' : props.channel,
  } : props
  return col([
    mediaNode(content, g.width, g.thumbnailHeight, true),
    ...(vrpPreview ? [filmstripNode(props, g.width, 23), button('More like this', { variant: 'ghost', size: 'sm' })] : [metadataNode({ ...content, width: g.width, showStats: g.vrp, showSourceIcon: !g.vrp })]),
  ], { width: g.width, gap: 2, role: 'article', ariaLabel: `${g.vrp ? 'VRP' : 'SERP'} short · ${g.vrp ? '3:4' : ratio} · ${state}` })
}

function videoNode(props: MosaicLiveProps): MosaicSdlNode {
  const position = str(props, 'metadataPosition', 'Below')
  const g = videoCardGeometry(position, number(props, 'width'), number(props, 'thumbnailHeight'))
  const mediaWidth = number(props, 'thumbnailWidth', g.thumbnailWidth)!
  const vrpPreview = str(props, 'placement', 'SERP') === 'VRP' && str(props, 'state', 'Default') === 'Preview'
  const content = position === 'Overlay' ? {
    ...props,
    title: str(props, 'title', VIDEO_TITLE) === VIDEO_TITLE ? 'Title Lorem ipsum dolor sit amet consectetur.' : props.title,
    source: str(props, 'source', 'YouTube') === 'YouTube' ? 'Source' : props.source,
    channel: str(props, 'channel', 'Channel') === 'Channel' ? 'https://www.lorem.com' : props.channel,
    showStats: false,
  } : props
  const media = col([mediaNode(props, mediaWidth, g.thumbnailHeight), ...(vrpPreview ? [filmstripNode(props, mediaWidth, g.width * 50.728 / 386)] : [])], { width: mediaWidth, gap: 0 })
  const details = vrpPreview ? button('More like this', { variant: 'ghost', size: 'sm' }) : metadataNode({ ...content, placement: position, width: position === 'Inline' ? Math.max(0, g.width - mediaWidth - 12) : g.width })
  return (position === 'Inline' ? row : col)([media, details], { width: g.width, gap: 3, align: 'start', role: 'article' })
}

function heroNode(props: MosaicLiveProps): MosaicSdlNode {
  const size = str(props, 'size', 'Normal')
  const g = heroCardGeometry(size, number(props, 'width'), number(props, 'height', 424), number(props, 'thumbnailHeight'))
  const actualTitle = str(props, 'title', size === 'Super wide' ? 'Lorem ipsum dolor sit amet consectetur. Luctus leo turpis porttitor' : MAGAZINE_TITLE)
  return col([
    mediaNode({ ...props, title: actualTitle }, g.width, g.thumbnailHeight),
    col([
      text(actualTitle, { size: 'lg', weight: 'semibold', maxLines: 2 }),
      ...(size === 'Normal' ? [factsNode(props, '2.1M views', 'Feb. 24, 2018')] : []),
      ...(bool(props, 'showDescription', size !== 'Super wide') ? [text(str(props, 'description', size === 'Wide' ? WIDE_DESCRIPTION : MAGAZINE_DESCRIPTION), { size: 'sm', maxLines: 4 })] : []),
      sourceNode(props),
      ...(size !== 'Normal' ? [factsNode(props, '2.1M views', 'Feb. 24, 2018')] : []),
    ], { gap: 2, padding: 4 }),
  ], { width: g.width, gap: 0, radius: 'xl', background: 'surface-secondary', role: 'article' })
}

function moreNode(props: MosaicLiveProps): MosaicSdlNode {
  const list = str(props, 'layout', 'List') === 'List'
  const normal = str(props, 'size', 'Normal') === 'Normal'
  const contained = list || str(props, 'cardStyle', 'Split') === 'Contained'
  const width = number(props, 'width', list || normal ? 536 : 312)!
  const count = list || normal ? 3 : 2
  const itemWidth = list ? width - 32 : (width - (contained ? 32 : 0) - (count - 1) * 12) / count
  const itemTitle = str(props, 'title', `${MAGAZINE_TITLE} Dolor sit amet consectetur. Eget aliquam.`)
  const items = Array.from({ length: count }, (_, index) => (list ? row : col)([
    mediaNode({ ...props, state: index === 0 ? props.state : 'Default', title: itemTitle }, number(props, 'thumbnailWidth', list ? 186 : itemWidth)!, number(props, 'thumbnailHeight', list ? 104 : contained ? 78 : 98)!),
    metadataNode({ ...props, title: itemTitle, showStats: list, showSourceIcon: !list, views: str(props, 'views', '2.1M views'), date: str(props, 'date', 'Feb. 24, 2018'), ...(list ? { width: itemWidth - number(props, 'thumbnailWidth', 186)! - 12 } : {}) }),
  ], { width: itemWidth, gap: 3, align: 'start' }))
  return col([
    ...(contained ? [title('More videos', { size: 'sm', weight: 'semibold' })] : []),
    (list ? col : row)(items, { gap: 3, align: 'start' }),
  ], { width, padding: contained ? 4 : 0, gap: 3, background: contained ? 'surface-secondary' : 'surface', radius: 'xl' })
}

function shortsListNode(props: MosaicLiveProps): MosaicSdlNode {
  const variant = str(props, 'variant', 'Wide')
  const grid = variant === 'Grid', small = variant === 'Small'
  const width = number(props, 'width', variant === 'Wide' ? 536 : variant === 'Normal' ? 424 : 312)!
  const height = number(props, 'height', small ? 200 : 424)!
  const count = grid ? 4 : variant === 'Normal' ? 2 : 3
  const columns = grid ? 2 : count
  const itemWidth = (width - 32 - (columns - 1) * 12) / columns
  const itemTitle = str(props, 'title', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit')
  const items = Array.from({ length: count }, (_, index) => col([
    mediaNode({ ...props, title: itemTitle, state: index === 0 ? props.state : 'Default', showBadge: !grid && !small }, itemWidth, grid ? (height - 92) / 2 : small ? height - 76 : height - 150, true),
    ...(grid || small ? [sourceNode({ ...props, source: grid && index % 2 ? 'TikTok' : str(props, 'source', 'YouTube'), channel: '' })] : [metadataNode({ ...props, title: itemTitle, width: (width - 40 - 16 * (count - 1)) / count, showStats: false })]),
  ], { width: itemWidth, gap: 2 }))
  const body = grid ? col([row(items.slice(0, 2), { gap: 3 }), row(items.slice(2), { gap: 3 })], { gap: 3 }) : row(items, { gap: 3, align: 'start' })
  return col([title('Shorts', { size: 'sm', weight: 'semibold' }), body], { width, gap: 3, padding: 4, background: 'surface-secondary', radius: 'xl' })
}

function playlistNode(props: MosaicLiveProps): MosaicSdlNode {
  const configuration = str(props, 'configuration', 'Immersive / Normal')
  const immersive = configuration.startsWith('Immersive'), grid = configuration.startsWith('Grid'), small = configuration.includes('Small'), tall = configuration.includes('Tall')
  const width = number(props, 'width', small ? 200 : 312)!
  const height = number(props, 'height', tall ? 424 : 200)!
  const itemTitle = str(props, 'title', 'Lorem ipsum dolor')
  if (immersive) return col([
    image(thumbnail(props), itemTitle, { width, height, radius: 'xl' }), caption('Playlist'),
    text(itemTitle, { weight: 'semibold' }),
    text('1.Lorem ipsum dolor sit amet consectetur. Eget aliquam.', { size: 'sm' }),
    text('2.Lorem ipsum dolor sit amet consectetur. Eget aliquam.', { size: 'sm' }),
  ], { width, gap: 2 })
  const count = tall ? 4 : grid ? 3 : 2
  const itemWidth = grid ? (width - 56) / 3 : width - 32
  return col([
    title(grid ? 'Playlist' : 'Playlists', { size: 'sm', weight: 'semibold' }),
    (grid ? row : col)(Array.from({ length: count }, (_, index) => (grid ? col : row)([
      image(thumbnail(props), itemTitle, { width: grid ? itemWidth : small ? 64 : 96, height: grid ? 64 : small ? 40 : 54, radius: 'sm' }),
      col([text(tall && index % 2 ? `${itemTitle} sit amet consectetur.` : itemTitle, { weight: 'semibold', size: 'sm', maxLines: 2 }), caption('14 videos', { size: 'sm' })], { gap: 1 }),
    ], { gap: 2, width: itemWidth, align: 'start' })), { gap: 3 }),
  ], { width, padding: 4, gap: 3, radius: 'xl', background: 'surface-secondary', ariaLabel: `Playlist · ${configuration}` })
}

function magazineCardNode(props: MosaicLiveProps): MosaicSdlNode {
  switch (str(props, 'family', 'Hero')) {
    case 'More videos': return moreNode({ ...props, size: 'Normal' })
    case 'Shorts': return shortsListNode({ ...props, variant: str(props, 'shortsVariant', 'Wide') })
    case 'Playlist': return playlistNode({ ...props, configuration: str(props, 'playlistConfiguration', 'Immersive / Normal') })
    default: return heroNode(props)
  }
}

function supplementalNode(props: MosaicLiveProps): MosaicSdlNode {
  const configuration = str(props, 'configuration', 'Trending / Wide')
  const g = supplementalGeometry(configuration)
  const width = number(props, 'width', g.width)!
  const height = number(props, 'height', g.height)!
  const artwork = { ...props, thumbnailUrl: str(props, 'thumbnailUrl', supplementalAssets.thumbnail) }
  const topic = configuration.startsWith('Topic'), shorts = configuration.endsWith('Shorts'), wide = configuration.endsWith('Wide'), small = configuration.endsWith('Small'), tall = configuration.endsWith('Tall')
  if (configuration.startsWith('Single')) return videoNode({ ...artwork, metadataPosition: 'Overlay', width, height, thumbnailHeight: height })
  if (configuration.startsWith('See more')) return col(small ? [
    image(asset(supplementalAssets.streaming), 'Video discovery artwork', { width, fit: 'contain' }), caption('999+ videos'), button('Explore more videos', { variant: 'ghost', size: 'sm' }),
  ] : [
    row(supplementalAssets.collage.map(src => col([image(asset(src), 'Video discovery collage', { width: '100%', fit: 'contain' })], { flex: 1 })), { gap: 2, align: 'start' }),
    title(str(props, 'title', 'Discover more stunning videos.'), { size: 'md' }), button('Search videos', { iconStart: 'search', variant: 'soft', size: 'sm' }),
  ], { width, gap: 3, padding: 4, radius: 'xl', background: 'surface-secondary' })
  if (configuration.startsWith('Related')) {
    const twoColumns = configuration.includes('Two columns')
    const count = twoColumns || tall ? 6 : 3
    const items = Array.from({ length: count }, () => row([image(thumbnail(artwork), '', { width: 40, height: 40, radius: 'sm', ariaHidden: true }), text(str(props, 'title', 'Title of the list item'), { size: 'sm', weight: 'semibold' })], { gap: 2, align: 'center' }))
    return col([title('Explore more', { size: 'sm', weight: 'semibold' }), twoColumns ? row([col(items.slice(0, 3), { gap: 3, flex: 1 }), col(items.slice(3), { gap: 3, flex: 1 })], { gap: 3 }) : col(items, { gap: 3 })], { width, gap: 3, padding: 4, radius: 'xl', background: 'surface-secondary' })
  }
  const count = wide || shorts ? 3 : 2
  const itemWidth = (width - 32 - (count - 1) * 12) / count
  return col([
    title(topic ? '#Topic title' : shorts ? 'Trending videos on TikTok' : wide ? 'Trending videos' : 'Trending videos on xxx', { size: 'sm', weight: 'semibold' }),
    row(Array.from({ length: count }, (_, index) => col([
      mediaNode({ ...artwork, showBadge: wide }, itemWidth, shorts ? 124 : wide ? 86.67 : 72),
      ...(shorts ? [sourceNode({ source: index === 1 ? 'TikTok' : 'YouTube', channel: '' })] : [
        text(str(props, 'title', 'Lorem ipsum dolor sit amet consectetur.'), { size: 'sm', weight: 'semibold', maxLines: 2 }),
        caption(wide ? 'Source · https://www.lorem.com' : 'Channel · 1 mon ago', { size: 'sm' }),
      ]),
    ], { width: itemWidth, gap: 2 })), { gap: 3, align: 'start' }),
  ], { width, padding: 4, gap: 3, radius: 'xl', background: 'surface-secondary' })
}

function groupContent(props: MosaicLiveProps, index: number): MosaicLiveProps {
  const items = Array.isArray(props.items) ? props.items as GroupItem[] : []
  const item = items[index] ?? {}
  const content: MosaicLiveProps = { ...(str(props, 'title') ? { title: props.title } : {}), ...item }
  const state = str(props, 'state', 'Default')
  const selected = number(props, 'selectedIndex', -1)!
  const active = selected < 0 && state !== 'Default' ? 0 : selected
  content.state = index === active ? state : 'Default'
  return content
}

function videoGroupNode(props: MosaicLiveProps): MosaicSdlNode {
  const g = resolveVideoGroupGeometry({ ...props, width: number(props, 'width'), itemCount: (Array.isArray(props.items) && props.items.length) || number(props, 'itemCount') } as VideoGroupOptions)
  const items = g.cards.map((geometry, index) => {
    const content = videoNode({ ...groupContent(props, index), ...geometry })
    content.ariaLabel = `Video ${index + 1}${number(props, 'selectedIndex', -1) === index ? ', selected' : ''}`
    return content
  })
  return (g.layout === 'Vertical' ? col : row)(items, { width: g.width, gap: spacing(g.gap), align: 'start', scrollable: g.scrollable, role: 'list', ariaLabel: `Video group · scroll position ${str(props, 'scrollPosition', 'Start')}` })
}

function shortsGroupNode(props: MosaicLiveProps): MosaicSdlNode {
  const g = resolveShortsGroupGeometry({ ...props, width: number(props, 'width'), itemCount: (Array.isArray(props.items) && props.items.length) || number(props, 'itemCount') } as ShortsGroupOptions)
  const items = g.cards.map((geometry, index) => {
    const content = groupContent(props, index)
    if (g.placement === 'VRP') content.state = content.state === 'Preview' ? 'VRP-preview' : 'VRP-Default'
    const item = shortNode({ ...content, ...geometry })
    item.ariaLabel = `Short ${index + 1}${number(props, 'selectedIndex', -1) === index ? ', selected' : ''}`
    return item
  })
  return row(items, { width: g.width, gap: spacing(g.gap), align: 'start', scrollable: true, role: 'list', ariaLabel: `Shorts group · scroll position ${str(props, 'scrollPosition', 'Start')}` })
}

function magazineOverviewNode(width: number, props: MosaicLiveProps): MosaicSdlNode {
  return col([
    title(magazineOverview.title, { size: 'lg' }),
    text(magazineOverview.text, { size: 'sm', ...(bool(props, 'expanded') ? {} : { maxLines: 8 }) }),
    button(bool(props, 'expanded') ? 'Show less' : 'Learn more', { variant: 'ghost', size: 'sm' }),
    text(`Age: ${magazineOverview.age}`, { size: 'sm' }),
    text(`Spouses: ${magazineOverview.spouses}`, { size: 'sm' }),
    row([image(asset(cellAssets.citationImdb), 'IMDb', { width: 18, height: 18, fit: 'contain' }), image(asset(cellAssets.citationWikipedia), 'Wikipedia', { width: 18, height: 18, fit: 'contain' }), caption('4 Sources')], { gap: 1, align: 'center' }),
    ...(bool(props, 'showSources') ? [title('Sources shown in this design', { size: 'sm' }), text('IMDb · Wikipedia', { size: 'sm' }), button('Close', { variant: 'ghost', size: 'sm' })] : []),
  ], { width, padding: 4, gap: 3, radius: 'xl', background: 'surface-secondary' })
}

function magazineZoneNode(props: MosaicLiveProps): MosaicSdlNode {
  const g = resolveMagazineGeometry({ placement: str(props, 'placement', 'SERP') as CellPlacement, width: number(props, 'width') })
  const content = groupContent(props, 0)
  return row([
    heroNode({ ...content, title: str(props, 'title') || MAGAZINE_TITLE, size: g.placement === 'SERP' ? 'Super wide' : 'Wide', width: g.columns[0], height: g.height, thumbnailHeight: g.columns[0] * 112 / 200 }),
    ...(g.placement === 'SERP' ? [
      magazineOverviewNode(g.columns[1], props),
      col([
        videoNode({ ...groupContent(props, 1), metadataPosition: 'Overlay', width: g.columns[2], height: 200, thumbnailHeight: 200 }),
        col([title(magazineOverview.imdbTitle, { size: 'sm', weight: 'semibold' }), text(magazineOverview.imdbText, { size: 'sm' }), row([image(asset(cellAssets.imdb), '', { width: 18, height: 18, fit: 'contain', ariaHidden: true }), caption('IMDb')], { gap: 1 })], { width: g.columns[2], padding: 4, gap: 3, radius: 'xl', background: 'surface-secondary' }),
      ], { gap: 6, width: g.columns[2] }),
    ] : [
      moreNode({ ...groupContent(props, 1), layout: 'List', width: g.columns[1], height: 424, thumbnailWidth: 186, thumbnailHeight: 104 }),
      playlistNode({ ...groupContent(props, 2), configuration: groupContent(props, 2).state === 'Preview' ? 'List view / Tall / Hover' : 'List view / Tall / Default', width: g.columns[2], height: 424 }),
    ]),
  ], { width: g.width, gap: spacing(g.gap), align: 'start' })
}

function answerContext(props: MosaicLiveProps, fallback = SOURCE_QUERY): MosaicSdlNode[] {
  return bool(props, 'pageShell', true) ? [caption(str(props, 'query', fallback), { size: 'md' })] : []
}

function shortRowNode(width: number, count: number, selected: number, mobile = false, overlay = false): MosaicSdlNode {
  return row(Array.from({ length: count }, (_, index) => {
    const item = shortNode({ ratio: '2:3', metadataPosition: overlay ? 'Overlay' : 'Below', width: overlay ? 133.33334 : mobile ? 160 : 158.66667, thumbnailHeight: overlay ? 200 : 238, state: index === selected ? 'Preview' : 'Default' })
    item.ariaLabel = `Short ${index + 1}${index === selected ? ', selected' : ''}`
    return item
  }), { width, gap: 3, scrollable: true, align: 'start', role: 'list', ariaLabel: 'Short videos' })
}

function mainlineNode(props: MosaicLiveProps): MosaicSdlNode {
  const scene = mainlineScene(str(props, 'configuration', 'Desktop Generics') as MainlineConfiguration)
  const width = scene.mobile ? 290 : 690
  const selected = number(props, 'selectedIndex', -1)!
  const clipped = scene.folded
  const visibleCards = scene.mobile && scene.hero ? scene.cards.slice(0, 3) : scene.cards
  const cards = visibleCards.map((card, index) => {
    const item = videoNode({ ...card, thumbnailHeight: card.height, state: selected === index ? 'Preview' : 'Default', description: VIDEO_TITLE, showDescription: scene.hero && !scene.mobile && index === 0 })
    item.ariaLabel = `Video ${index + 1}${selected === index ? ', selected' : ''}`
    return item
  })
  const videoList = scene.hero ? col([cards[0], col(cards.slice(1), { gap: 4 })], { gap: 6 }) : col(cards, { gap: 4 })
  return col([
    ...answerContext(props), title(str(props, 'title', SOURCE_TITLE), { size: 'lg', weight: 'semibold' }),
    ...(!scene.mobile ? [row(Array.from({ length: 7 }, () => row([image(asset(organismAssets.avatar.url), '', { width: 28, height: 28, radius: 'full', ariaHidden: true }), button('Requery Title', { variant: 'ghost', size: 'sm' })], { gap: 2, align: 'center' })), { gap: 3, scrollable: true })] : []),
    videoList,
    ...(scene.shorts ? [title('Short videos', { size: 'lg' }), shortRowNode(690, 9, selected - 4, false, true)] : []),
    button(clipped ? 'See more video' : 'See all video', { variant: 'ghost', size: 'sm' }),
  ], { width, gap: 4, role: 'region', ariaLabel: `Video answer · ${str(props, 'configuration', 'Desktop Generics')}${clipped ? ' · folded source snapshot; clipping omitted' : ''}` })
}

function shortAnswerNode(props: MosaicLiveProps, wide: boolean): MosaicSdlNode {
  const scene = shortScene(str(props, 'viewport', 'Desktop') as 'Desktop' | 'Mobile', wide)
  return col([
    ...answerContext(props), title(str(props, 'title', SOURCE_TITLE), { size: 'lg', weight: 'semibold' }),
    shortRowNode(scene.mobile ? 306 : scene.contentWidth, scene.count, number(props, 'selectedIndex', -1)!, scene.mobile),
    button('See more short videos', { variant: 'ghost', size: 'sm' }),
  ], { width: scene.contentWidth, gap: 3, role: 'region', ariaLabel: `Short video answer · ${wide ? 'Go-wide' : 'Mainline'} · ${scene.mobile ? 'Mobile' : 'Desktop'}` })
}

function magazinePageNode(props: MosaicLiveProps): MosaicSdlNode {
  const activeTab = str(props, 'activeTab', 'Overview')
  const question = number(props, 'openQuestion', 0)!
  return col([
    ...answerContext(props, 'Tom hanks'), title('Tom Hanks', { size: 'xl', weight: 'semibold' }), text('American actor and filmmaker', { size: 'sm' }),
    row(VIDEO_TABS.map(tab => button(tab, { variant: tab === activeTab ? 'solid' : 'ghost', size: 'sm', color: 'secondary', ariaLabel: `${tab}${tab === activeTab ? ', selected' : ''}` })), { gap: 2 }),
    magazineZoneNode({ placement: 'SERP', width: 1200, state: str(props, 'magazineState', 'Default'), selectedIndex: number(props, 'magazineSelectedIndex', -1), expanded: bool(props, 'overviewExpanded'), showSources: bool(props, 'showSources') }),
    caption('Wikipedia text under CC-BY-SA license', { size: 'sm' }), button('Feedback', { variant: 'ghost', size: 'sm' }),
    row(MAGAZINE_SUGGESTIONS.map(suggestion => button(suggestion, { variant: 'outline', size: 'sm' })), { gap: 3, wrap: 'wrap' }),
    ...(bool(props, 'pageShell', true) ? [
      title('Videos of Lorem ipsum', { size: 'lg' }),
      col([0, 1, 2].map(index => {
        const selected = number(props, 'selectedIndex', -1) === index
        const item = videoNode({ width: 690, height: 130.66667, thumbnailHeight: 130.66667, metadataPosition: 'Inline', state: selected ? 'Preview' : 'Default' })
        item.ariaLabel = `Magazine video ${index + 1}${selected ? ', selected' : ''}`
        return item
      }), { gap: 4, width: 690 }),
      button('Show more', { variant: 'ghost', size: 'sm' }),
      title('People also ask', { size: 'lg' }),
      col(SOURCE_QUESTIONS.map((item, index) => col([
        button(item.title, { variant: 'ghost', size: 'sm', ariaLabel: `${item.title}, ${question === index ? 'expanded' : 'collapsed'}` }),
        ...(question === index ? [text(item.body), button('Continue reading ›', { variant: 'ghost', size: 'sm' }), text(SOURCE_SNIPPET, { size: 'sm' })] : []),
      ], { gap: 3 })), { gap: 4, width: 690 }),
    ] : []),
  ], { width: 1200, gap: 4 })
}

function register(slug: string, identity: string, status: MosaicAdapter['status'], componentTypes: string[], notes: string[], generate: MosaicGenerator) {
  adapters[slug] = { identity, status, componentTypes, notes, generate }
}

function partial(slug: string, identity: string, render: (props: MosaicLiveProps) => MosaicSdlNode, notes: string[] = []) {
  register(slug, identity, 'partial', ['Basic', 'Col', 'Row', 'Image', 'Text', 'Title', 'Caption', 'Button'], [mediaWarning, actionWarning, layoutWarning, ...notes],
    (values, live) => finish(basic([render(effective(values, live))]), [mediaWarning, actionWarning, assetWarning, layoutWarning, ...notes]))
}

partial('short-card', 'Short card → source thumbnail and metadata', shortNode)
partial('video-metadata', 'Video metadata → Text / Caption / source icon', metadataNode, ['Overlay metadata is exported in normal flow. Exact typography and line-clamping require renderer verification.'])
partial('video-card', 'Video card → source thumbnail and metadata', videoNode)
partial('video-magazine-card', 'Magazine family → source-backed card composition', magazineCardNode)
partial('video-hero-card', 'Hero card → thumbnail, title, description and source', heroNode)
partial('video-more-card', 'More videos → list or grid of source cards', moreNode)
partial('shorts-list-card', 'Shorts card → source thumbnail list', shortsListNode)
partial('playlist-card', 'Playlist → source imagery and list content', playlistNode)
partial('video-supplemental-card', 'Other video cards → source trending / related / discovery content', supplementalNode, ['Rotated collage and clipped discovery artwork are exported as normal-flow images.'])
partial('video-source-icon', 'Source brand → extracted brand artwork', props => {
  const source = str(props, 'source', 'YouTube')
  const files = source === 'Micrsoft Start' || source === 'Microsoft Start' ? ['413a3.png', '0f7f8.png'] : [sourceIconFiles[source] ?? sourceIconFiles.Web]
  return row(files.map(file => image(asset(`figma/molecules/${file}`), source, { width: files.length > 1 ? 8 : 16, height: 16, fit: 'contain' })), { gap: 0, ariaLabel: source })
}, ['Two-part Microsoft Start artwork is kept in normal flow. Exact source masking and color backing require renderer support.'])
partial('video-group', 'Video group → source-count vertical or horizontal cards', videoGroupNode, ['Horizontal scrolling, clipping and active preview are static layout hints. Selection is retained as an accessible snapshot.'])
partial('shorts-group', 'Shorts group → source-count horizontal short cards', shortsGroupNode, ['The VRP source supports only Below / 3:4. Horizontal scrolling and preview filmstrips require host behavior.'])
partial('video-magazine-zone', 'Magazine zone → source columns and narrative', magazineZoneNode, ['The source magazine column spans and content are retained; inline citations and complex clipped collage details are approximated.'])
partial('serp-video-answer-mainline', 'Video answer → source video-list composition', mainlineNode, [shellWarning, 'Folded source lists retain all source cards in normal flow because the catalog has no verified clipping / gradient-fade / expansion contract.'])
partial('serp-short-video-answer-mainline', 'Short video mainline → source short-card row', props => shortAnswerNode(props, false), [shellWarning, 'Source horizontal-scroller artwork and scroll position require host rendering.'])
partial('serp-short-video-answer-go-wide', 'Short video Go-wide → source wide short-card row', props => shortAnswerNode(props, true), [shellWarning, 'Source horizontal-scroller artwork and scroll position require host rendering.'])
partial('serp-video-magazine-page', 'Video magazine page → source entity, magazine and question content', magazinePageNode, [shellWarning, 'Entity tab selection is a static state. The source does not supply alternate tab datasets; no filtering data is invented. Accordion openness is exported as visible text and requires host actions to change.'])

register('serp-video-answer-go-wide', 'Empty in-progress source page → no portable layout', 'gap', ['Basic'], [
  'Source design in progress — Figma page 2128:29243 is empty. No layout or content is inferred.',
], () => finish(basic([]), ['Source design in progress — Figma page 2128:29243 is empty. This SDL intentionally contains no video-answer layout.']))

register('vrp-whole-page', 'Reference-only source page → no portable layout', 'gap', ['Basic'], [
  'The scoped VRP page links to file dd9IQ0YMNSEtTDs0QhbDFJ, node 1990:22578. That node is a Cover / WIP page, not a VRP interface.',
], () => finish(basic([]), ['VRP is reference-only: the source points to an external Cover / WIP page, not an implemented results-page design. No VRP layout is fabricated.']))

export const mosaicAdapter = (slug: string): MosaicAdapter | undefined => Object.prototype.hasOwnProperty.call(adapters, slug) ? adapters[slug] : undefined
export const mosaicCoverage = Object.entries(adapters).map(([slug, adapter]) => ({ slug, status: adapter.status }))

export function generateMosaicPage(
  blocks: Array<{ slug: string; values: MosaicValues; live: MosaicLiveProps }>,
  surface: SurfaceId,
  width?: number,
): MosaicGeneration {
  const children: MosaicSdlNode[] = []
  const warnings: string[] = []
  const missing: string[] = []
  for (const block of blocks) {
    const adapter = mosaicAdapter(block.slug)
    if (!adapter) { missing.push(block.slug); continue }
    const result = adapter.generate(block.values, block.live, { surface, width })
    children.push(...unwrapBasic(result))
    warnings.push(...result.warnings.map(warning => `${block.slug}: ${warning}`))
  }
  const surfaceOptions = surfaceDefinition(surface)
  const output = finish(basic([col(children, {
    gap: 4, width: width ?? surfaceOptions.width, padding: spacing(surfaceOptions.padding), background: 'surface',
  })], { padding: 0 }), warnings)
  for (const slug of missing) output.validation.issues.push({ severity: 'error', path: '$.children', message: `No source-backed Mosaic adapter is registered for ${slug}.` })
  if (missing.length) output.validation.valid = false
  return output
}
