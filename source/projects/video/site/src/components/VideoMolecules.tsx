import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { videoMoleculeAssets as assets, supplementalAssets, sourceIconFiles, VIDEO_TITLE, MAGAZINE_TITLE, MAGAZINE_DESCRIPTION, WIDE_DESCRIPTION, shortCardGeometry, videoCardGeometry, heroCardGeometry, supplementalGeometry, type PlaylistConfiguration, type SupplementalConfiguration } from '../data/molecule-data'
import '../video-molecules.css'

export type VideoState = 'Default' | 'Preview' | 'Post-preview'
export type ShortState = VideoState | 'VRP-Default' | 'VRP-preview'
export type LiveValues = Record<string, string | number | boolean>
export interface VideoContentProps {
  title?: string; thumbnailUrl?: string; duration?: string; source?: string; channel?: string
  views?: string; date?: string; description?: string; showDescription?: boolean
  width?: number; height?: number; thumbnailHeight?: number; thumbnailWidth?: number; className?: string
  onActivate?: () => void; onLive?: (values: LiveValues) => void
}

export function SourceIcon({ source = 'YouTube' }: { source?: string }) {
  if (source === 'Micrsoft Start' || source === 'Microsoft Start') return <span className="vm-source-icon vm-start-icon" aria-hidden="true"><img src="figma/molecules/413a3.png" alt="" style={{ maskImage: 'url("figma/molecules/65740.svg")' }} /><img src="figma/molecules/0f7f8.png" alt="" style={{ maskImage: 'url("figma/molecules/85558.svg")' }} /></span>
  const file = sourceIconFiles[source === 'Source' ? 'YouTube' : source] ?? sourceIconFiles.Web
  return <span className={`vm-source-icon ${source === 'Instagram' ? 'vm-instagram-icon' : ''}`} aria-hidden="true"><img src={`figma/molecules/${file}`} alt="" className={file.endsWith('.png') ? 'vm-raster-brand' : ''} style={source === 'Twitch' ? { width: 16, height: 16 } : undefined} /></span>
}

export function VideoSource({ source = 'YouTube', channel = 'Channel', icon = true }: { source?: string; channel?: string; icon?: boolean }) {
  return <span className="vm-source">{icon && <SourceIcon source={source} />}<span>{source}</span>{channel && <><span aria-hidden="true">·</span><span className="vm-ellipsis">{channel}</span></>}</span>
}

export function VideoFacts({ views = '10K views', date = 'Nov 08, 2025' }: { views?: string; date?: string }) {
  return <span className="vm-facts">{views && <span>{views}</span>}{views && date && <span aria-hidden="true">·</span>}{date && <span>{date}</span>}</span>
}

export interface VideoMetadataProps extends VideoContentProps {
  placement?: 'Below' | 'Inline' | 'Overlay'; showStats?: boolean; showSourceIcon?: boolean; titleLines?: number
}
export function VideoMetadata({ placement = 'Below', title = VIDEO_TITLE, source = 'YouTube', channel = 'Channel', views = '10K views', date = 'Nov 08, 2025', description = MAGAZINE_DESCRIPTION, showDescription = false, showStats = true, showSourceIcon = true, width, height, className = '', titleLines = 2, onActivate }: VideoMetadataProps) {
  const style = { width: width ?? (placement === 'Inline' ? 403.5 : placement === 'Overlay' ? 355.5 : 386), height: height ?? (placement === 'Inline' ? 160 : undefined), '--vm-title-lines': titleLines } as CSSProperties
  const titleNode = <span className="vm-title">{title}</span>
  return <div className={`vm-metadata vm-metadata-${placement.toLowerCase()} ${className}`} style={style}>
    {onActivate ? <button className="vm-title-link" onClick={onActivate}>{titleNode}</button> : titleNode}
    {showDescription && <p className="vm-description">{description}</p>}
    <div className="vm-metadata-bottom"><VideoSource source={source} channel={channel} icon={showSourceIcon} />{showStats && <VideoFacts views={views} date={date} />}</div>
  </div>
}

function usePreview(state: ShortState | 'Hover', onLive?: (v: LiveValues) => void, vrp = false) {
  const [current, setCurrent] = useState(state)
  useEffect(() => setCurrent(state), [state])
  const change = (next: ShortState | 'Hover') => { setCurrent(next); onLive?.({ state: next }) }
  return { current, enter: () => change(vrp ? 'VRP-preview' : 'Preview'), leave: () => change(vrp ? 'VRP-Default' : 'Post-preview'), activate: () => change(vrp ? 'VRP-preview' : 'Preview') }
}

interface ThumbnailProps {
  state?: ShortState; src?: string; title?: string; duration?: string; short?: boolean; width?: number | string; height: number | string
  radius?: number; children?: ReactNode; badge?: ReactNode; showBadge?: boolean; onActivate?: () => void
  onPreview?: () => void; onLeave?: () => void; className?: string; progress?: boolean
}
export function VideoThumbnail({ state = 'Default', src = assets.thumbnail, title = 'Play video', duration = '99:99', short = false, width = '100%', height, radius = short ? 16 : 24, children, badge, showBadge = true, onActivate, onPreview, onLeave, className = '', progress = false }: ThumbnailProps) {
  const preview = state === 'Preview' || state === 'VRP-preview'
  const post = state === 'Post-preview'
  const [muted, setMuted] = useState(true)
  return <div className={`vm-thumbnail ${preview ? 'is-preview' : ''} ${post ? 'is-post' : ''} ${className}`} style={{ width, height, borderRadius: radius }} onMouseEnter={onPreview} onMouseLeave={onLeave} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) onLeave?.() }}>
    <img className="vm-photo" src={src} alt="" />
    {post && <span className="vm-scrim" />}
    <button className="vm-media-hit" aria-label={`Play ${title}`} onClick={onActivate} onFocus={onPreview} />
    {!preview && !post && showBadge && <span className="vm-badge">{badge ?? <>{short && <img src={assets.shortPlay} alt="" />}{duration}</>}</span>}
    {preview && <>{!short && <span className="vm-badge">Preview</span>}<button className={`vm-mute ${muted ? '' : 'is-unmuted'}`} aria-label={muted ? 'Unmute preview' : 'Mute preview'} aria-pressed={!muted} onClick={() => setMuted(!muted)}><img src={assets.mute} alt="" /></button></>}
    {!preview && (!short || post) && <span className={`vm-play ${post ? 'vm-play-post' : ''}`}><img src={post ? assets.postPlay : assets.play} alt="" /></span>}
    {progress && preview && <span className="vm-progress"><i /></span>}
    {children}
  </div>
}

function PreviewStrip({ src = assets.thumbnail, height = 23 }: { src?: string; height?: number }) {
  return <div className="vm-preview-strip" style={{ height }}>{[0, 1, 2, 3].map(i => <img key={i} src={src} alt="" style={{ objectPosition: `${i * 25}% 50%` }} />)}</div>
}
function MoreLikeThis({ onActivate }: { onActivate?: () => void }) {
  return <button className="vm-related" onClick={onActivate}><img src={assets.related} alt="" /><span>More like this</span></button>
}

export interface ShortCardProps extends VideoContentProps { state?: ShortState; metadataPosition?: 'Below' | 'Overlay'; ratio?: '3:4' | '2:3' | '9:16' }
export function ShortCard({ state = 'Default', metadataPosition = 'Below', ratio = '3:4', width, height, thumbnailHeight, thumbnailUrl = assets.thumbnail, title = VIDEO_TITLE, duration = '99:99', source = 'YouTube', channel = 'Channel', views, date, onActivate, onLive, className = '' }: ShortCardProps) {
  const geometry = shortCardGeometry(ratio, metadataPosition, state, width, thumbnailHeight)
  const preview = usePreview(state, onLive, geometry.vrp)
  const vrpPreview = preview.current === 'VRP-preview'
  const activate = () => { preview.activate(); onActivate?.() }
  const actualTitle = geometry.overlay && title === VIDEO_TITLE ? 'Title Lorem ipsum dolor sit amet consectetur.' : title
  return <article className={`vm-card vm-short-card ${className}`} style={{ width: geometry.width, height: height ?? geometry.height }} data-state={preview.current} data-ratio={geometry.vrp ? '3:4' : ratio}>
    <div className="vm-short-media" style={{ borderRadius: 16 }}><VideoThumbnail state={preview.current as ShortState} src={thumbnailUrl} title={actualTitle} duration={duration} short height={geometry.thumbnailHeight} onActivate={activate} onPreview={preview.enter} onLeave={preview.leave}>
      {geometry.overlay && <div className="vm-short-overlay"><VideoSource source={source === 'YouTube' ? 'Source' : source} channel={channel === 'Channel' ? 'https://www.lorem.com' : channel} /><span className="vm-overlay-title">{actualTitle}</span></div>}
    </VideoThumbnail>{vrpPreview && <PreviewStrip src={thumbnailUrl} />}</div>
    {!geometry.overlay && (vrpPreview ? <MoreLikeThis onActivate={onActivate} /> : <VideoMetadata width={geometry.width} title={title} source={source} channel={channel} views={views} date={date} showStats={geometry.vrp} showSourceIcon={!geometry.vrp} onActivate={activate} />)}
  </article>
}

export interface VideoCardProps extends VideoContentProps { state?: VideoState; metadataPosition?: 'Below' | 'Inline' | 'Overlay'; placement?: 'SERP' | 'VRP' }
export function VideoCard({ state = 'Default', metadataPosition = 'Below', placement = 'SERP', width, height, thumbnailHeight, thumbnailWidth, thumbnailUrl = assets.thumbnail, title = VIDEO_TITLE, duration = '99:99', source = 'YouTube', channel = 'Channel', views, date, description, showDescription = false, onActivate, onLive, className = '' }: VideoCardProps) {
  const geometry = videoCardGeometry(metadataPosition, width, thumbnailHeight)
  const preview = usePreview(state, onLive)
  const vrpPreview = placement === 'VRP' && preview.current === 'Preview'
  const activate = () => { preview.activate(); onActivate?.() }
  const overlay = metadataPosition === 'Overlay'
  return <article className={`vm-card vm-video-card vm-video-${metadataPosition.toLowerCase()} ${className}`} data-state={preview.current} style={{ width: geometry.width, height: height ?? geometry.height }}>
    <div className="vm-video-media" style={{ width: thumbnailWidth ?? geometry.thumbnailWidth, borderRadius: vrpPreview ? 16 : 24 }}><VideoThumbnail state={preview.current as VideoState} src={thumbnailUrl} title={title} duration={duration} height={geometry.thumbnailHeight} onActivate={activate} onPreview={preview.enter} onLeave={preview.leave} progress={vrpPreview}>
      {overlay && <div className="vm-video-overlay"><span className="vm-overlay-title">{title === VIDEO_TITLE ? 'Title Lorem ipsum dolor sit amet consectetur.' : title}</span><VideoSource source={source === 'YouTube' ? 'Source' : source} channel={channel === 'Channel' ? 'https://www.lorem.com' : channel} /></div>}
    </VideoThumbnail>{vrpPreview && <PreviewStrip src={thumbnailUrl} height={geometry.width * 50.728 / 386} />}</div>
    {!overlay && (vrpPreview ? <MoreLikeThis onActivate={onActivate} /> : <VideoMetadata placement={metadataPosition} width={metadataPosition === 'Inline' ? Math.max(0, geometry.width - (thumbnailWidth ?? geometry.thumbnailWidth) - 12) : geometry.width} title={title} source={source} channel={channel} views={views} date={date} description={description} showDescription={showDescription} height={metadataPosition === 'Inline' ? geometry.thumbnailHeight : undefined} onActivate={activate} />)}
  </article>
}

function MagazineHeader({ children, onActivate }: { children: ReactNode; onActivate?: () => void }) {
  return <div className="vm-magazine-header"><strong>{children}</strong><button aria-label={`Open ${children}`} onClick={onActivate}><img src={assets.chevron} alt="" /></button></div>
}
export interface VideoHeroCardProps extends VideoContentProps { size?: 'Normal' | 'Wide' | 'Super wide'; state?: VideoState }
export function VideoHeroCard({ size = 'Normal', state = 'Default', width, height = 424, thumbnailHeight, title, thumbnailUrl = assets.thumbnail, duration, source = 'YouTube', channel = 'Channel', views = '2.1M views', date = 'Feb. 24, 2018', description, showDescription, onActivate, onLive, className = '' }: VideoHeroCardProps) {
  const g = heroCardGeometry(size, width, height, thumbnailHeight)
  const preview = usePreview(state, onLive)
  const activate = () => { preview.activate(); onActivate?.() }
  const showText = showDescription ?? size !== 'Super wide'
  return <article className={`vm-magazine vm-hero vm-hero-${size.replace(' ', '-').toLowerCase()} ${className}`} style={{ width: g.width, height }} data-state={preview.current}>
    <VideoThumbnail state={preview.current as VideoState} src={thumbnailUrl} title={title} duration={duration} height={g.thumbnailHeight} radius={0} onActivate={activate} onPreview={preview.enter} onLeave={preview.leave} />
    <div className="vm-hero-copy"><button className="vm-title-link" onClick={activate}><span className="vm-title">{title ?? (size === 'Super wide' ? 'Lorem ipsum dolor sit amet consectetur. Luctus leo turpis porttitor' : MAGAZINE_TITLE)}</span></button>
      {size === 'Normal' && <VideoFacts views={views} date={date} />}
      {showText && <p className="vm-description">{description ?? (size === 'Wide' ? WIDE_DESCRIPTION : MAGAZINE_DESCRIPTION)}</p>}
      <div className="vm-hero-footer"><VideoSource source={source} channel={channel} />{size !== 'Normal' && <><span>·</span><VideoFacts views={views} date={date} /></>}</div>
    </div>
  </article>
}

export interface VideoMoreCardProps extends VideoContentProps { layout?: 'List' | 'Grid'; cardStyle?: 'Split' | 'Contained'; size?: 'Normal' | 'Narrow'; state?: VideoState }
export function VideoMoreCard({ layout = 'List', cardStyle = 'Split', size = 'Normal', state = 'Default', width, height, thumbnailWidth, thumbnailHeight, title = MAGAZINE_TITLE + ' Dolor sit amet consectetur. Eget aliquam.', thumbnailUrl = assets.thumbnail, duration, source = 'YouTube', channel = 'Channel', views = '2.1M views', date = 'Feb. 24, 2018', onActivate, onLive, className = '' }: VideoMoreCardProps) {
  const w = width ?? (layout === 'List' || size === 'Normal' ? 536 : 312)
  const h = height ?? (layout === 'List' ? 424 : 200)
  const contained = layout === 'List' || cardStyle === 'Contained'
  const count = layout === 'List' || size === 'Normal' ? 3 : 2
  const [active, setActive] = useState(0)
  const preview = usePreview(state, onLive)
  const enter = (i: number) => { setActive(i); preview.enter() }
  const activate = (i: number) => { enter(i); onActivate?.() }
  return <section className={`vm-magazine vm-more vm-more-${layout.toLowerCase()} ${contained ? 'vm-contained' : 'vm-split'} ${className}`} style={{ width: w, height: h }} data-state={preview.current}>
    {contained && <MagazineHeader onActivate={onActivate}>More videos</MagazineHeader>}
    <div className="vm-more-items">{Array.from({ length: count }, (_, i) => <article className={`vm-more-item ${preview.current !== 'Default' && active === i ? 'is-active' : ''}`} key={i} style={layout === 'List' ? { flex: '0 0 auto', height: thumbnailHeight ?? 104 } : undefined}>
      <VideoThumbnail state={active === i ? preview.current as VideoState : 'Default'} src={thumbnailUrl} title={title} duration={duration} height={thumbnailHeight ?? (layout === 'List' ? 104 : contained ? 78 : 98)} width={thumbnailWidth ?? (layout === 'List' ? 186 : '100%')} radius={contained ? 8 : 0} onActivate={() => activate(i)} onPreview={() => enter(i)} onLeave={preview.leave} />
      <div className="vm-more-copy"><button className="vm-title-link" onClick={() => activate(i)}><span className="vm-title">{title}</span></button><div className="vm-more-meta"><VideoSource source={source} channel={channel} icon={layout !== 'List'} />{layout === 'List' && <VideoFacts views={views} date={date} />}</div></div>
    </article>)}</div>
  </section>
}

export interface ShortsListCardProps extends VideoContentProps { variant?: 'Wide' | 'Normal' | 'Grid' | 'Small'; state?: VideoState }
export function ShortsListCard({ variant = 'Wide', state = 'Default', width, height, title = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', thumbnailUrl = assets.thumbnail, duration = '99:99', source = 'YouTube', channel = 'Channel', onActivate, onLive, className = '' }: ShortsListCardProps) {
  const w = width ?? (variant === 'Wide' ? 536 : variant === 'Normal' ? 424 : 312)
  const h = height ?? (variant === 'Small' ? 200 : 424)
  const grid = variant === 'Grid', small = variant === 'Small'
  const count = grid ? 4 : variant === 'Normal' ? 2 : 3
  const [active, setActive] = useState(0)
  const preview = usePreview(state, onLive)
  const enter = (i: number) => { setActive(i); preview.enter() }
  return <section className={`vm-magazine vm-contained vm-shorts-list vm-shorts-${variant.toLowerCase()} ${className}`} style={{ width: w, height: h }} data-state={preview.current}>
    <MagazineHeader onActivate={onActivate}>Shorts</MagazineHeader><div className="vm-shorts-items">{Array.from({ length: count }, (_, i) => {
      const brand = grid && i % 2 ? 'TikTok' : source
      return <article key={i} className="vm-shorts-item"><VideoThumbnail state={active === i ? preview.current as VideoState : 'Default'} src={thumbnailUrl} title={title} duration={duration} short height={grid ? (h - 92) / 2 : small ? h - 76 : h - 150} radius={16} onPreview={() => enter(i)} onLeave={preview.leave} onActivate={() => { enter(i); onActivate?.() }} showBadge={!small} badge={grid ? <><SourceIcon source={brand} />{brand}</> : undefined}>
        {small && <div className="vm-small-source"><SourceIcon source={source} /><span>Source</span></div>}
      </VideoThumbnail>{!grid && !small && <VideoMetadata width={(w - 40 - 16 * (count - 1)) / count} title={title} source={source} channel={channel} showStats={false} onActivate={onActivate} />}</article>
    })}</div>
  </section>
}

export interface PlaylistCardProps extends VideoContentProps { configuration?: PlaylistConfiguration }
export function PlaylistCard({ configuration = 'Immersive / Normal', width, height, title = 'Lorem ipsum dolor', thumbnailUrl = assets.thumbnail, onActivate, onLive, className = '' }: PlaylistCardProps) {
  const immersive = configuration.startsWith('Immersive'), grid = configuration.startsWith('Grid'), small = configuration.includes('Small'), tall = configuration.includes('Tall')
  const w = width ?? (small ? 200 : 312), h = height ?? (tall ? 424 : 200)
  const [hovered, setHovered] = useState(configuration.endsWith('Hover'))
  useEffect(() => setHovered(configuration.endsWith('Hover')), [configuration])
  const hover = (next: boolean) => { setHovered(next); if (!immersive) onLive?.({ configuration: configuration.replace(/Default|Hover$/, next ? 'Hover' : 'Default') }) }
  const imageNode = <img className="vm-photo" src={thumbnailUrl} alt="" />
  return <section className={`vm-magazine vm-playlist ${immersive ? 'vm-playlist-immersive' : 'vm-contained'} ${grid ? 'vm-playlist-grid' : ''} ${tall ? 'vm-playlist-tall' : ''} ${small ? 'vm-playlist-small' : ''} ${hovered ? 'is-hover' : ''} ${className}`} style={{ width: w, height: h }}>
    {immersive ? <>{imageNode}<span className="vm-badge vm-badge-light"><img src={assets.playlistBadge} alt="" />Playlist</span><button className="vm-media-hit" aria-label={`Open playlist ${title}`} onClick={onActivate} /><div className="vm-playlist-overlay"><strong>{title}</strong><span>1.Lorem ipsum dolor sit amet consectetur. Eget aliquam.</span><span>2.Lorem ipsum dolor sit amet consectetur. Eget aliquam.</span></div></> : <>
      <MagazineHeader onActivate={onActivate}>{grid ? 'Playlist' : 'Playlists'}</MagazineHeader><div className="vm-playlist-items">{Array.from({ length: tall ? 4 : grid ? 3 : 2 }, (_, i) => <button className="vm-playlist-item" key={i} onMouseEnter={() => hover(true)} onMouseLeave={() => hover(false)} onFocus={() => hover(true)} onBlur={() => hover(false)} onClick={onActivate}>
        <span className="vm-playlist-thumb">{imageNode}<span><img src={assets.playlist} alt="" /></span></span><span className="vm-playlist-copy"><strong>{tall && i % 2 ? `${title} sit amet consectetur.` : title}</strong><span>14 videos</span></span>
      </button>)}</div>
    </>}
  </section>
}

export interface VideoMagazineCardProps extends VideoHeroCardProps { family?: 'Hero' | 'More videos' | 'Shorts' | 'Playlist'; layout?: 'List' | 'Grid'; cardStyle?: 'Split' | 'Contained'; shortsVariant?: ShortsListCardProps['variant']; playlistConfiguration?: PlaylistConfiguration }
export function VideoMagazineCard({ family = 'Hero', size = 'Normal', layout = 'List', cardStyle = 'Split', shortsVariant = 'Wide', playlistConfiguration = 'Immersive / Normal', ...props }: VideoMagazineCardProps) {
  if (family === 'More videos') return <VideoMoreCard {...props} layout={layout} cardStyle={cardStyle} />
  if (family === 'Shorts') return <ShortsListCard {...props} variant={shortsVariant} />
  if (family === 'Playlist') return <PlaylistCard {...props} configuration={playlistConfiguration} />
  return <VideoHeroCard {...props} size={size} />
}

export interface VideoSupplementalCardProps extends VideoContentProps { configuration?: SupplementalConfiguration }
export function VideoSupplementalCard({ configuration = 'Trending / Wide', width, height, title, thumbnailUrl = supplementalAssets.thumbnail, onActivate, className = '' }: VideoSupplementalCardProps) {
  const g = supplementalGeometry(configuration), w = width ?? g.width, h = height ?? g.height
  const topic = configuration.startsWith('Topic'), shorts = configuration.endsWith('Shorts'), wide = configuration.endsWith('Wide'), small = configuration.endsWith('Small'), tall = configuration.endsWith('Tall')
  if (configuration.startsWith('Single')) return <VideoCard metadataPosition="Overlay" width={w} height={h} thumbnailHeight={h} thumbnailUrl={thumbnailUrl} title={title} onActivate={onActivate} />
  if (configuration.startsWith('See more')) return <section className={`vm-magazine vm-supplemental vm-see-more ${small ? 'vm-see-small' : 'vm-see-normal'} ${className}`} style={{ width: w, height: h }}>
    {small ? <><div className="vm-streaming-art"><div className="vm-streaming-back" /><div className="vm-streaming-front"><img src={supplementalAssets.streaming} alt="" /><span><img src={supplementalAssets.play} alt="" /></span></div></div><span className="vm-badge vm-badge-light"><img src={supplementalAssets.stack} alt="" />999+ videos</span><button className="vm-explore-link" onClick={onActivate}>Explore more videos<img src={supplementalAssets.arrow} alt="" /></button></> : <>
      <div className="vm-see-collage"><div className="vm-collage-rotate"><div>{supplementalAssets.collage.slice(0, 2).map((src, i) => <span key={src}><img src={src} alt="" />{i === 0 ? <i><img src={supplementalAssets.play} alt="" /></i> : <b />}</span>)}</div><div>{supplementalAssets.collage.slice(2).map((src, i) => <span key={src}><img src={src} alt="" />{i === 1 ? <i><img src={supplementalAssets.play} alt="" /></i> : <b />}</span>)}</div></div></div>
      <div className="vm-see-copy"><strong>{title ?? 'Discover more stunning videos.'}</strong><button onClick={onActivate}><img src={supplementalAssets.search} alt="" />Search videos</button></div>
    </>}
  </section>
  if (configuration.startsWith('Related')) {
    const twoColumns = configuration.includes('Two columns')
    return <section className={`vm-magazine vm-contained vm-supplemental vm-related-card ${twoColumns ? 'vm-related-columns' : ''} ${tall ? 'vm-related-tall' : ''} ${className}`} style={{ width: w, height: h }}><MagazineHeader onActivate={onActivate}>Explore more</MagazineHeader><div className="vm-related-items">{Array.from({ length: twoColumns || tall ? 6 : 3 }, (_, i) => <button key={i} onClick={onActivate}><img src={thumbnailUrl} alt="" /><strong>{title ?? 'Title of the list item'}</strong></button>)}</div></section>
  }
  return <section className={`vm-magazine vm-contained vm-supplemental vm-trending ${wide ? 'vm-trending-wide' : ''} ${shorts ? 'vm-trending-shorts' : ''} ${className}`} style={{ width: w, height: h }}>
    <MagazineHeader onActivate={onActivate}>{topic ? '#Topic title' : shorts ? 'Trending videos on TikTok' : wide ? 'Trending videos' : 'Trending videos on xxx'}</MagazineHeader>
    <div className="vm-trending-items">{Array.from({ length: wide || shorts ? 3 : 2 }, (_, i) => <article key={i}>
      <VideoThumbnail src={thumbnailUrl} title={title} height={shorts ? 124 : wide ? 86.67 : 72} radius={8} showBadge={wide} onActivate={onActivate}>
        {shorts && <div className="vm-small-source"><img className="vm-supp-brand" src={i === 1 ? supplementalAssets.tiktok : assets.youtubeRaster} alt="" />{i === 1 ? 'TikTok' : 'YouTube'}</div>}
      </VideoThumbnail>
      {!shorts && <div className="vm-trending-copy"><button className="vm-title-link" onClick={onActivate}><span className="vm-title">{title ?? 'Lorem ipsum dolor sit amet consectetur.'}</span></button>{wide ? <div className="vm-trending-source"><span className="vm-placeholder-icon" /><span>Source · https://www.lorem.com</span></div> : <span className="vm-facts">Channel · 1 mon ago</span>}</div>}
    </article>)}</div>
  </section>
}
