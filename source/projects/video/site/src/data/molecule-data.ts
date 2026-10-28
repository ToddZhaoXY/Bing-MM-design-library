export const videoMoleculeAssets = {
  thumbnail: 'figma/molecules/88585.webp',
  imageUnderlay: 'figma/molecules/acc04.png',
  youtube: 'figma/molecules/c6a30.svg',
  youtubeRaster: 'figma/molecules/69d15.png',
  play: 'figma/molecules/video-play-source.svg',
  shortPlay: 'figma/molecules/short-play-source.svg',
  postPlay: 'figma/molecules/f5004.svg',
  mute: 'figma/molecules/f21c7.svg',
  chevron: 'figma/molecules/a7444.svg',
  related: 'figma/molecules/f08b7.svg',
  playlist: 'figma/molecules/ba3e8.svg',
  playlistBadge: 'figma/molecules/da389.svg',
} as const

export const VIDEO_TITLE = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore'
export const MAGAZINE_TITLE = 'Lorem ipsum dolor sit amet consectetur. Eget aliquam.'
export const MAGAZINE_DESCRIPTION = 'Lorem ipsum dolor sit amet consectetur. Luctus leo turpis porttitor sed non lobortis ultricies nibh. Massa morbi in massa blandit integer ut id ultrices fringilla. Enim. Lorem ipsum dolor sit amet consectetur. Luctus leo turpis porttitor sed non lobortis ultricies nibh.'
export const WIDE_DESCRIPTION = 'One Epic Place With Beautiful Scenery ! i lost the audio with copyright music :( trackname: almost in f tranquillity by kevin macleod Places : Fairmont Springs...'
export const SOURCE_BRANDS = ['YouTube', 'Vimeo', 'Dailymotion', 'Instagram', 'Micrsoft Start', 'Twitch', 'Bilibili', 'TikTok', 'Pinterest', 'Facebook', 'Web', 'iQiyi', 'Tencent video', 'Youku', 'X'] as const
export const sourceIconFiles: Record<string, string> = {
  YouTube: 'c6a30.svg', Vimeo: 'abfe7.svg', Dailymotion: 'ab4e6.png',
  Instagram: '6f156.svg', Twitch: '6bb2d.png', Bilibili: '76e73.svg',
  TikTok: 'cbfca.svg', Pinterest: '4021d.svg', Facebook: 'd3196.svg',
  Web: 'f71ed.svg', iQiyi: 'edce1.png', 'Tencent video': 'e10c4.svg',
  Youku: '1cf90.svg', X: 'fa886.svg',
}
export const PLAYLIST_CONFIGURATIONS = [
  'Immersive / Small', 'Immersive / Normal',
  'List view / Wide / Default', 'List view / Wide / Hover',
  'List view / Small / Default', 'List view / Small / Hover',
  'Grid view / Default', 'Grid view / Hover',
  'List view / Tall / Default', 'List view / Tall / Hover',
] as const
export type PlaylistConfiguration = typeof PLAYLIST_CONFIGURATIONS[number]
export const SUPPLEMENTAL_CONFIGURATIONS = ['Trending / Wide', 'Trending / Normal', 'Trending / Shorts', 'Topic / Wide', 'Topic / Normal', 'Topic / Shorts', 'Related / One column', 'Related / Two columns', 'Related / Tall', 'Single / Normal', 'Single / Small', 'See more / Normal', 'See more / Small'] as const
export type SupplementalConfiguration = typeof SUPPLEMENTAL_CONFIGURATIONS[number]
export const supplementalAssets = {
  thumbnail: 'figma/molecules/acc04.png', tiktok: 'figma/molecules/2b8ab.png',
  collage: ['figma/molecules/46d75.png', 'figma/molecules/9ee9f.png', 'figma/molecules/93578.png', 'figma/molecules/4c87a.png', 'figma/molecules/36bec.png'],
  streaming: 'figma/molecules/0c9c2.png', arrow: 'figma/molecules/13c5f.svg', search: 'figma/molecules/search-white-source.svg', stack: 'figma/molecules/85a97.svg', play: 'figma/molecules/237b5.svg',
} as const
export function supplementalGeometry(configuration = 'Trending / Wide') {
  return { width: configuration.endsWith('Wide') ? 536 : configuration.endsWith('Small') || configuration.endsWith('Tall') ? 200 : 312, height: configuration.endsWith('Tall') ? 424 : 200 }
}

/** The source supports VRP only as Below / 3:4. */
export function shortCardGeometry(ratio = '3:4', position = 'Below', state = 'Default', width?: number, thumbnailHeight?: number) {
  const vrp = state.startsWith('VRP')
  const mediaRatio = vrp ? 3 / 4 : ratio === '2:3' ? 2 / 3 : ratio === '9:16' ? 9 / 16 : 3 / 4
  const overlay = !vrp && position === 'Overlay'
  const sourceHeight = vrp ? 216 : overlay ? 200 : ratio === '9:16' ? 214 : 238
  const w = width ?? sourceHeight * mediaRatio
  const h = thumbnailHeight ?? w / mediaRatio
  return { width: w, thumbnailHeight: h, height: h + (overlay ? 0 : vrp ? 96 : ratio === '9:16' ? 98 : 74), overlay, vrp }
}
export function videoCardGeometry(position = 'Below', width?: number, thumbnailHeight?: number) {
  const w = width ?? (position === 'Inline' ? 700 : position === 'Overlay' ? 355.5 : 386)
  const h = thumbnailHeight ?? (position === 'Inline' ? 160 : position === 'Overlay' ? w * 200 / 355.5 : w * 216 / 386)
  return { width: w, thumbnailHeight: h, thumbnailWidth: position === 'Inline' ? h * 284.5 / 160 : w, height: position === 'Below' ? h + 96 : h }
}
export function heroCardGeometry(size = 'Normal', width?: number, height = 424, thumbnailHeight?: number) {
  const w = width ?? (size === 'Super wide' ? 648 : size === 'Wide' ? 536 : 424)
  const metadataHeight = size === 'Super wide' ? 78 : size === 'Wide' ? 124 : 187
  return { width: w, height, thumbnailHeight: thumbnailHeight ?? Math.max(40, height - metadataHeight), metadataHeight: thumbnailHeight === undefined ? metadataHeight : height - thumbnailHeight }
}
