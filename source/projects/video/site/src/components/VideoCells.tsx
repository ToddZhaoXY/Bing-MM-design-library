import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react'
import { VideoCard, ShortCard, VideoHeroCard, VideoMoreCard, PlaylistCard } from './VideoMolecules'
import { MAGAZINE_TITLE } from '../data/molecule-data'
import { cellAssets, magazineOverview, resolveMagazineGeometry, resolveShortsGroupGeometry, resolveVideoGroupGeometry, type CellLive, type CellPlacement, type CellState, type GroupItem, type ShortsGroupOptions, type VideoGroupOptions } from '../data/cell-data'
import '../video-cells.css'

export type ScrollPosition = 'Start' | 'Middle' | 'End'
/** Shared ACF Horizontal Scroller shell: source fade, FAB and dimensions, native scrolling. */
export function HorizontalScroller({ width, height, gap, children, label, contentWidth, scrollPosition = 'Start', onLive }: {
  width: number; height: number; gap: number; children: ReactNode; label: string; contentWidth: number; scrollPosition?: ScrollPosition; onLive?: CellLive
}) {
  const ref = useRef<HTMLDivElement>(null)
  const lastReported = useRef<ScrollPosition>('Start')
  const lastGeometry = useRef('')
  const [position, setPosition] = useState<ScrollPosition>(scrollPosition)
  const overflow = contentWidth > width + 1
  useEffect(() => {
    const el = ref.current
    const geometry = `${width}:${contentWidth}`
    if (!el || (lastReported.current === scrollPosition && lastGeometry.current === geometry)) return
    const max = Math.max(0, el.scrollWidth - el.clientWidth)
    el.scrollLeft = scrollPosition === 'End' ? max : scrollPosition === 'Middle' ? max / 2 : 0
    lastReported.current = scrollPosition
    lastGeometry.current = geometry
    setPosition(scrollPosition)
  }, [scrollPosition, width, contentWidth])
  const sync = () => {
    const el = ref.current
    if (!el) return
    const next = el.scrollLeft < 2 ? 'Start' : el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 ? 'End' : 'Middle'
    setPosition(next)
    if (lastReported.current !== next) { lastReported.current = next; onLive?.({ scrollPosition: next }) }
  }
  const scroll = (direction: number) => {
    const el = ref.current
    if (!el) return
    const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({ left: direction * Math.max(160, width * .8), behavior: reduced ? 'auto' : 'smooth' })
  }
  const keyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); scroll(event.key === 'ArrowRight' ? 1 : -1) }
    if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); ref.current?.scrollTo({ left: event.key === 'Home' ? 0 : contentWidth, behavior: 'auto' }) }
  }
  return <div className="vc-scroller" style={{ width, height }} data-acf-component="Horizontal Scroller">
    <div className="vc-scroll-viewport" ref={ref} role="region" aria-label={label} tabIndex={overflow ? 0 : undefined} onScroll={sync} onKeyDown={keyboard}>
      <div className="vc-scroll-body" style={{ gap }}>{children}</div>
    </div>
    {overflow && <>
      {position !== 'End' && <div className="vc-fade" aria-hidden="true"><img src={cellAssets.gradient} alt="" style={{ width: height, height: 48 }} /></div>}
      {position !== 'Start' && <button className="vc-scroll-button vc-scroll-previous" aria-label={`Previous ${label}`} onClick={() => scroll(-1)}><img src={cellAssets.chevron} alt="" /></button>}
      {position !== 'End' && <button className="vc-scroll-button vc-scroll-next" aria-label={`Next ${label}`} onClick={() => scroll(1)}><img src={cellAssets.chevron} alt="" /></button>}
    </>}
  </div>
}

function useGroupSelection(state: CellState, selectedIndex: number, onLive?: CellLive) {
  const [active, setActive] = useState(selectedIndex)
  const [current, setCurrent] = useState(state)
  useEffect(() => { setActive(selectedIndex); setCurrent(state) }, [selectedIndex, state])
  const change = (index: number, next: Record<string, string | number | boolean>) => {
    const raw = next.state
    const value: CellState = raw === 'VRP-preview' || raw === 'Hover' ? 'Preview' : raw === 'VRP-Default' ? 'Default' : raw === 'Preview' || raw === 'Post-preview' ? raw : 'Default'
    setActive(index); setCurrent(value); onLive?.({ selectedIndex: index, state: value })
  }
  return { active, current, change, cardState: (index: number): CellState => index === (active >= 0 ? active : 0) ? current : 'Default' }
}

interface SharedGroupProps {
  state?: CellState; selectedIndex?: number; scrollPosition?: ScrollPosition; title?: string; items?: GroupItem[];
  onLive?: CellLive; onActivate?: (index: number) => void; className?: string
}
export interface VideoGroupProps extends VideoGroupOptions, SharedGroupProps {}
export function VideoGroup({ state = 'Default', selectedIndex = -1, scrollPosition = 'Start', title = '', items, onLive, onActivate, className = '', ...options }: VideoGroupProps) {
  const g = resolveVideoGroupGeometry({ ...options, itemCount: items?.length || options.itemCount })
  const selection = useGroupSelection(state, selectedIndex, onLive)
  const cards = g.cards.map((card, index) => <div key={index} className="vc-card-slot" data-selected={selection.active === index ? 'true' : undefined}>
    <VideoCard {...card} {...(title ? { title } : {})} {...items?.[index]} state={selection.cardState(index)} onLive={next => selection.change(index, next)} onActivate={() => { selection.change(index, { state: 'Preview' }); onActivate?.(index) }} />
  </div>)
  return <section className={`vc-group ${className}`} data-source-node={g.nodeId} data-configuration={g.configuration} style={{ width: g.width }} aria-label="Video group">
    {g.layout === 'Vertical' ? <div className="vc-video-list" style={{ gap: g.gap }} data-acf-component="List View">{cards}</div> : <HorizontalScroller width={g.width} height={g.height} gap={g.gap} label="videos" contentWidth={g.cards[0].width * g.count + g.gap * (g.count - 1)} scrollPosition={scrollPosition} onLive={onLive}>{cards}</HorizontalScroller>}
  </section>
}

export interface ShortsGroupProps extends ShortsGroupOptions, SharedGroupProps {}
export function ShortsGroup({ state = 'Default', selectedIndex = -1, scrollPosition = 'Start', title = '', items, onLive, onActivate, className = '', ...options }: ShortsGroupProps) {
  const g = resolveShortsGroupGeometry({ ...options, itemCount: items?.length || options.itemCount })
  const selection = useGroupSelection(state, selectedIndex, onLive)
  return <section className={`vc-group ${className}`} data-source-node={g.nodeId} data-configuration={g.configuration} style={{ width: g.width }} aria-label="Shorts group">
    <HorizontalScroller width={g.width} height={g.height} gap={g.gap} label="short videos" contentWidth={g.cards[0].width * g.count + g.gap * (g.count - 1)} scrollPosition={scrollPosition} onLive={onLive}>
      {g.cards.map(({ placement, ...card }, index) => {
        const cardState = selection.cardState(index)
        const shortState = placement === 'VRP' ? cardState === 'Preview' ? 'VRP-preview' : 'VRP-Default' : cardState
        return <div key={index} className="vc-card-slot" data-selected={selection.active === index ? 'true' : undefined}><ShortCard {...card} {...(title ? { title } : {})} {...items?.[index]} state={shortState} onLive={next => selection.change(index, next)} onActivate={() => { selection.change(index, { state: 'Preview' }); onActivate?.(index) }} /></div>
      })}
    </HorizontalScroller>
  </section>
}

function OverviewCard({ expanded, showSources, onToggleExpanded, onToggleSources }: { expanded: boolean; showSources: boolean; onToggleExpanded: () => void; onToggleSources: () => void }) {
  return <article className="vc-answer-card vc-overview">
    <div className="vc-answer-header"><strong>{magazineOverview.title}</strong><button aria-label={expanded ? 'Collapse overview' : 'Expand overview'} aria-expanded={expanded} onClick={onToggleExpanded}><img src={cellAssets.maximize} alt="" /></button></div>
    <div className={`vc-overview-content ${expanded ? 'is-expanded' : ''}`}><p className="vc-overview-text"><strong>Thomas Jeffrey Hanks</strong> is an <strong>American actor</strong> and filmmaker celebrated for his versatility in comedic and dramatic roles and regarded as an American cultural icon. A two-time consecutive Best Actor Oscar winner for <em>Philadelphia</em> (1993) and <em>Forrest Gump</em> (1994), his career spans acclaimed films such as Splash Sleepless in Seattle, Saving Private Ryan, Cast Away</p>
      <button className="vc-learn-more" onClick={onToggleExpanded} aria-expanded={expanded}>{expanded ? 'Show less' : 'Learn more'}<img src={cellAssets.arrow} alt="" /></button>
      <p className="vc-fact"><strong>Age:</strong><span>{magazineOverview.age}</span></p><p className="vc-fact"><strong>Spouses:</strong><span>{magazineOverview.spouses}</span></p>
    </div>
    <button className="vc-citation" aria-expanded={showSources} onClick={onToggleSources} aria-label="Show overview sources">
      <span className="vc-citation-icon vc-citation-first" style={{ maskImage: `url(${cellAssets.citationMaskFirst})` }}><span><img src={cellAssets.citationImdb} alt="IMDb" /></span></span>
      <span className="vc-citation-icon vc-citation-second" style={{ maskImage: `url(${cellAssets.citationMaskSecond})` }}><span><img src={cellAssets.citationWikipedia} alt="Wikipedia" /></span></span>
      <span className="vc-citation-count"><img src={cellAssets.link} alt="" />4 Sources</span>
    </button>
    {showSources && <div className="vc-source-details"><strong>Sources shown in this design</strong><span>IMDb · Wikipedia</span><button onClick={onToggleSources}>Close</button></div>}
  </article>
}
function ImdbCard() {
  return <article className="vc-answer-card vc-imdb"><div className="vc-answer-header"><strong>{magazineOverview.imdbTitle}</strong></div><p><strong>Tom Hanks</strong> Through the Years Take a journey through the prolific career of Oscar-winning actor <strong>Tom Hanks</strong> through his standout roles in Philadelphia, Forrest Gump, and more films.</p><div className="vc-imdb-source"><img src={cellAssets.imdb} alt="" />IMDb</div></article>
}

export interface VideoMagazineZoneProps {
  placement?: CellPlacement; width?: number; state?: CellState; selectedIndex?: number; title?: string;
  expanded?: boolean; showSources?: boolean; onLive?: CellLive; onActivate?: (index: number) => void; className?: string
}
export function VideoMagazineZone({ placement = 'SERP', width, state = 'Default', selectedIndex = -1, title = '', expanded = false, showSources = false, onLive, onActivate, className = '' }: VideoMagazineZoneProps) {
  const g = resolveMagazineGeometry({ placement, width })
  const selection = useGroupSelection(state, selectedIndex, onLive)
  const [isExpanded, setExpanded] = useState(expanded)
  const [sourcesVisible, setSourcesVisible] = useState(showSources)
  useEffect(() => setExpanded(expanded), [expanded]); useEffect(() => setSourcesVisible(showSources), [showSources])
  const activate = (index: number) => { selection.change(index, { state: 'Preview' }); onActivate?.(index) }
  return <section className={`vc-magazine-zone ${className}`} data-source-node={g.nodeId} data-placement={placement} style={{ width: g.width, height: g.height, gap: g.gap, gridTemplateColumns: g.columns.map(x => `${x}px`).join(' ') } as CSSProperties} aria-label="Video magazine zone">
    <VideoHeroCard size={placement === 'SERP' ? 'Super wide' : 'Wide'} width={g.columns[0]} height={424} thumbnailHeight={g.columns[0] * 112 / 200} title={title || MAGAZINE_TITLE} state={selection.cardState(0)} onLive={next => selection.change(0, next)} onActivate={() => activate(0)} />
    {placement === 'SERP' ? <>
      <OverviewCard expanded={isExpanded} showSources={sourcesVisible} onToggleExpanded={() => { const next = !isExpanded; setExpanded(next); onLive?.({ expanded: next }) }} onToggleSources={() => { const next = !sourcesVisible; setSourcesVisible(next); onLive?.({ showSources: next }) }} />
      <div className="vc-magazine-side"><VideoCard width={g.columns[2]} height={200} thumbnailHeight={200} metadataPosition="Overlay" state={selection.cardState(1)} {...(title ? { title } : {})} onLive={next => selection.change(1, next)} onActivate={() => activate(1)} /><ImdbCard /></div>
    </> : <>
      <VideoMoreCard layout="List" width={g.columns[1]} height={424} thumbnailWidth={186} thumbnailHeight={104} className="vc-more-cell" state={selection.cardState(1)} {...(title ? { title } : {})} onLive={next => selection.change(1, next)} onActivate={() => activate(1)} />
      <PlaylistCard configuration={selection.cardState(2) === 'Preview' ? 'List view / Tall / Hover' : 'List view / Tall / Default'} width={g.columns[2]} height={424} {...(title ? { title } : {})} onLive={next => selection.change(2, { state: String(next.configuration).endsWith('Hover') ? 'Preview' : 'Default' })} onActivate={() => activate(2)} />
    </>}
  </section>
}
