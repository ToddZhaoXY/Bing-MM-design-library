import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ShortCard, VideoCard, type VideoState } from './VideoMolecules'
import { VIDEO_TITLE } from '../data/molecule-data'
import { VideoMagazineZone } from './VideoCells'
import assets from '../data/organism-assets.json'
import { MAINLINE_CONFIGURATIONS, SOURCE_TITLE, SOURCE_QUERY, SOURCE_SNIPPET, SOURCE_HELPER_COPY, SOURCE_QUESTIONS, VIDEO_TABS, MAGAZINE_SUGGESTIONS, mainlineScene, shortScene, type MainlineConfiguration } from '../data/organism-data'
import '../video-organisms.css'

type Live = (values: Record<string, string | number | boolean>) => void
type Asset = keyof typeof assets
const asset = (name: Asset) => `${import.meta.env?.BASE_URL ?? './'}${assets[name].url}`
function Icon({ name }: { name: Asset }) { return <img className="vo-icon" src={asset(name)} alt="" aria-hidden="true" /> }
function Avatar({ size = 24 }: { size?: number }) { return <img src={asset('avatar')} alt="" className="vo-avatar" width={size} height={size} /> }

interface SceneProps { mobile?: boolean; width: number; height: number; pageShell?: boolean; query: string; onQuery: (query: string) => void; onSearch?: (query: string) => void; children: ReactNode }
function SearchScene({ mobile = false, width, height, pageShell = true, query, onQuery, onSearch, children }: SceneProps) {
  const [message, setMessage] = useState('')
  return <div className={`video-scene ${mobile ? 'video-scene-mobile' : ''} ${pageShell ? '' : 'video-scene-content'}`} style={{ width: pageShell ? width : mobile ? 290 : 1200, height: pageShell ? height : undefined }}>
    {pageShell && <header className="vo-search-header">
      <div className="vo-search-top"><span className="vo-logo"><Icon name="logo" /></span>
        <form className="vo-search-form" role="search" onSubmit={event => { event.preventDefault(); setMessage(`Search requested: ${query}`); onSearch?.(query) }}>
          <button type="submit" aria-label="Search"><Icon name="search" /></button><input aria-label="Search query" value={query} onChange={event => onQuery(event.target.value)} />
          <button type="button" aria-label="Voice search" onClick={() => setMessage('Voice search requires the host application.')}><Icon name="microphone" /></button><button type="button" aria-label="Visual search" onClick={() => setMessage('Visual search requires the host application.')}><Icon name="visualSearch" /></button>
        </form><div className="vo-user-actions">{!mobile && <><span>2,345 <Icon name="rewards" /></span><Avatar size={32} /></>}<button type="button" aria-label="Search settings" onClick={() => setMessage('Search settings requires the host application.')}><Icon name="menu" /></button></div>
      </div>
      <nav className="vo-search-scopes" aria-label="Search scopes">{['ALL', 'SEARCH', 'IMAGES', 'VIDEOS', 'MAPS', 'NEWS', 'COPILOT', 'MORE', 'TOOLS'].map((scope, i) => <button type="button" key={scope} className={i === 0 ? 'is-active' : ''} onClick={() => setMessage(`${scope} navigation requires the host application.`)}>{i === 1 && <Icon name="copilot" />}{scope === 'MORE' && <Icon name="more" />}{scope}</button>)}</nav>
    </header>}
    <div className="vo-page-body">{pageShell && <div className="vo-tween"><Icon name="favicon" /><Icon name="sourceIcon" /><Avatar /><span>About 999,999 result</span></div>}{children}</div>
    {pageShell && mobile && <><nav className="vo-pagination" aria-label="Results pages">{[1, 2, 3].map(n => <button key={n} onClick={() => setMessage(`Page ${n} requires the host application.`)}>{n}</button>)}<button aria-label="Next results page" onClick={() => setMessage('Next page requires the host application.')}><Icon name="chevron" /></button></nav><footer className="vo-page-footer"><span>Trems</span><span>Privacy</span></footer></>}
    <span role="status" className="vo-sr-only">{message}</span>
  </div>
}
function SectionHeading({ children, onClick }: { children: ReactNode; onClick?: () => void }) { return <h2 className="vo-section-heading"><button type="button" onClick={onClick}>{children}<Icon name="chevron" /></button></h2> }
function Requeries({ onQuery }: { onQuery: (query: string) => void }) { const scroll = useRef<HTMLDivElement>(null); return <div className="vo-requeries"><div ref={scroll}>{Array.from({ length: 7 }, (_, i) => <button key={i} onClick={() => onQuery('Requery Title')}><Avatar size={28} /><strong>Requery Title</strong></button>)}</div><button className="vo-scroller-next" aria-label="More related queries" onClick={() => scroll.current?.scrollBy({ left: 160, behavior: 'smooth' })}><Icon name="chevron" /></button></div> }
function RelatedSearches({ onQuery, horizontal = false }: { onQuery: (query: string) => void; horizontal?: boolean }) { return <aside className={`vo-related ${horizontal ? 'vo-related-horizontal' : ''}`}><h3>Deep dive into lorem ipsum</h3><div>{Array.from({ length: horizontal ? 8 : 7 }, (_, i) => <button key={i} onClick={() => onQuery('lorem ipsum dolor sit')}><Icon name="searchSmall" /><span>lorem ipsum dolor sit</span></button>)}</div></aside> }
function AnswerFooter({ children, onClick, expansion = false }: { children: ReactNode; onClick?: () => void; expansion?: boolean }) { return <div className="vo-answer-footer"><span /><button type="button" onClick={onClick}>{children}<Icon name={expansion ? 'down' : 'chevron'} /></button><span /></div> }
function AlgorithmResult({ mobile = false, withCards = true }: { mobile?: boolean; withCards?: boolean }) { return <section className="vo-algorithm"><div className="vo-algo-source"><Avatar size={24} /><div><span>Site name lorem ipsum</span><small>www.algoloremipsum-attribution.com › ... › ipsum</small></div></div><h3>Title lorem ipsum dolor consectetur</h3><p>{SOURCE_SNIPPET}</p>{withCards && <div className={`vo-helper-grid ${mobile ? 'vo-helper-grid-mobile' : ''}`}>{Array.from({ length: mobile ? 2 : 4 }, (_, i) => <div className="vo-helper-card" key={i}><p>{SOURCE_HELPER_COPY}</p><ul><li>The card width should based on the span (column count)</li></ul></div>)}</div>}</section> }
function VideoList({ mobile, hero, selectedIndex, onSelect }: { mobile: boolean; hero: boolean; selectedIndex: number; onSelect: (i: number) => void }) {
  const width = mobile ? 290 : 690
  const card = (i: number, large: boolean) => <VideoCard key={i} width={width} height={large ? mobile ? 163.13 : 200 : mobile ? 92 : 130.66667} thumbnailHeight={large ? mobile ? 163.13 : 200 : mobile ? 92 : 130.66667} metadataPosition={large && mobile ? 'Overlay' : 'Inline'} state={selectedIndex === i ? 'Preview' : 'Default'} description={VIDEO_TITLE} showDescription={large && !mobile} className={mobile ? 'vo-mobile-video' : ''} onActivate={() => onSelect(i)} />
  return <div className={`vo-video-list ${hero ? 'vo-video-list-hero' : ''}`}>{hero && card(0, true)}<div className="vo-generic-list">{(mobile && hero ? [0, 1] : [0, 1, 2]).map(i => card(i + (hero ? 1 : 0), false))}</div></div>
}
function ShortRow({ width, mobile = false, overlay = false, count, selectedIndex, onSelect }: { width: number; mobile?: boolean; overlay?: boolean; count: number; selectedIndex: number; onSelect: (i: number) => void }) {
  const scroll = useRef<HTMLDivElement>(null)
  return <div className={`vo-short-row ${mobile ? 'vo-short-row-mobile' : ''}`} style={{ width }}><div ref={scroll} className="vo-short-scroll" role="group" aria-label="Short videos">{Array.from({ length: count }, (_, i) => <ShortCard key={i} ratio="2:3" metadataPosition={overlay ? 'Overlay' : 'Below'} width={overlay ? 133.33334 : mobile ? 160 : 158.66667} thumbnailHeight={overlay ? 200 : 238} state={selectedIndex === i ? 'Preview' : 'Default'} onActivate={() => onSelect(i)} />)}</div>{!mobile && <button className="vo-scroller-next" aria-label="Next short videos" onClick={() => scroll.current?.scrollBy({ left: 348, behavior: 'smooth' })}><Icon name="chevron" /></button>}</div>
}

export interface SerpVideoAnswerMainlineProps { configuration?: MainlineConfiguration; pageShell?: boolean; query?: string; title?: string; selectedIndex?: number; onLive?: Live; onSearch?: (query: string) => void; onOpenVideos?: () => void }
export function SerpVideoAnswerMainline({ configuration = MAINLINE_CONFIGURATIONS[0], pageShell = true, query = SOURCE_QUERY, title = SOURCE_TITLE, selectedIndex = -1, onLive, onSearch, onOpenVideos }: SerpVideoAnswerMainlineProps) {
  const [current, setCurrent] = useState(configuration); const [selected, setSelected] = useState(selectedIndex); const [text, setText] = useState(query)
  useEffect(() => setCurrent(configuration), [configuration]); useEffect(() => setSelected(selectedIndex), [selectedIndex]); useEffect(() => setText(query), [query])
  const scene = mainlineScene(current)
  const select = (i: number) => { setSelected(i); onLive?.({ selectedIndex: i }) }
  const updateQuery = (q: string) => { setText(q); onLive?.({ query: q }) }
  const toggle = () => { if (scene.folded) { setCurrent('Desktop Hero expanded'); onLive?.({ configuration: 'Desktop Hero expanded' }) } else onOpenVideos?.() }
  const clipped = scene.folded
  return <div data-figma-node={scene.nodeId}><SearchScene mobile={scene.mobile} width={scene.width} height={scene.height} pageShell={pageShell} query={text} onQuery={updateQuery} onSearch={onSearch}>
    <div className="vo-results-grid"><div className="vo-mainline"><section className="vo-video-answer"><SectionHeading>{title}</SectionHeading>{!scene.mobile && <Requeries onQuery={updateQuery} />}
      <div className={`vo-video-list-clip ${clipped ? 'is-folded' : ''}`} style={clipped ? { height: scene.mobile ? 380 : 424 } : undefined}><VideoList mobile={scene.mobile} hero={scene.hero} selectedIndex={selected} onSelect={select} /></div>
      {scene.shorts && <div className="vo-inline-shorts"><SectionHeading>Short videos</SectionHeading><ShortRow width={690} overlay count={9} selectedIndex={selected - 4} onSelect={i => select(i + 4)} /></div>}
      <AnswerFooter onClick={toggle} expansion={clipped}>{clipped ? 'See more video' : 'See all video'}</AnswerFooter>
    </section>{pageShell && <AlgorithmResult mobile={scene.mobile} />}</div>{pageShell && !scene.mobile && <RelatedSearches onQuery={updateQuery} />}</div>
  </SearchScene></div>
}

export interface SerpShortVideoAnswerProps { viewport?: 'Desktop' | 'Mobile'; pageShell?: boolean; query?: string; title?: string; selectedIndex?: number; onLive?: Live; onSearch?: (query: string) => void }
function ShortVideoAnswer({ viewport = 'Desktop', pageShell = true, query = SOURCE_QUERY, title = SOURCE_TITLE, selectedIndex = -1, onLive, onSearch, wide }: SerpShortVideoAnswerProps & { wide: boolean }) {
  const scene = shortScene(viewport, wide); const [selected, setSelected] = useState(selectedIndex); const [text, setText] = useState(query)
  useEffect(() => setSelected(selectedIndex), [selectedIndex]); useEffect(() => setText(query), [query])
  const select = (i: number) => { setSelected(i); onLive?.({ selectedIndex: i }) }; const updateQuery = (q: string) => { setText(q); onLive?.({ query:q }) }
  const answer = <section className="vo-short-answer"><SectionHeading>{title}</SectionHeading><ShortRow width={scene.mobile ? 306 : scene.contentWidth} mobile={scene.mobile} count={scene.count} selectedIndex={selected} onSelect={select} /><AnswerFooter>See more short videos</AnswerFooter></section>
  return <div data-figma-node={scene.nodeId}><SearchScene mobile={scene.mobile} width={scene.width} height={scene.height} pageShell={pageShell} query={text} onQuery={updateQuery} onSearch={onSearch}>
    {wide ? <>{answer}{pageShell && <div className="vo-results-grid vo-after-wide"><AlgorithmResult mobile={scene.mobile} />{!scene.mobile && <RelatedSearches onQuery={updateQuery} />}</div>}</> : <div className="vo-results-grid"><div className="vo-mainline">{answer}{pageShell && <AlgorithmResult mobile={scene.mobile} />}</div>{pageShell && !scene.mobile && <RelatedSearches onQuery={updateQuery} />}</div>}
  </SearchScene></div>
}
export function SerpShortVideoAnswerMainline(props: SerpShortVideoAnswerProps) { return <ShortVideoAnswer {...props} wide={false} /> }
export function SerpShortVideoAnswerGoWide(props: SerpShortVideoAnswerProps) { return <ShortVideoAnswer {...props} wide /> }

export interface SerpVideoMagazinePageProps { pageShell?: boolean; query?: string; activeTab?: typeof VIDEO_TABS[number]; openQuestion?: number; magazineState?: VideoState; magazineSelectedIndex?: number; overviewExpanded?: boolean; showSources?: boolean; selectedIndex?: number; onLive?: Live; onSearch?: (query: string) => void }
export function SerpVideoMagazinePage({ pageShell = true, query = 'Tom hanks', activeTab = 'Overview', openQuestion = 0, magazineState = 'Default', magazineSelectedIndex = -1, overviewExpanded = false, showSources = false, selectedIndex = -1, onLive, onSearch }: SerpVideoMagazinePageProps) {
  const [text, setText] = useState(query); const [tab, setTab] = useState(activeTab); const [question, setQuestion] = useState(openQuestion)
  useEffect(() => setText(query), [query]); useEffect(() => setTab(activeTab), [activeTab]); useEffect(() => setQuestion(openQuestion), [openQuestion])
  const [zoneState, setZoneState] = useState(magazineState); const [zoneIndex, setZoneIndex] = useState(magazineSelectedIndex); const [overview, setOverview] = useState(overviewExpanded); const [sources, setSources] = useState(showSources); const [videoIndex, setVideoIndex] = useState(selectedIndex)
  useEffect(() => setZoneState(magazineState), [magazineState]); useEffect(() => setZoneIndex(magazineSelectedIndex), [magazineSelectedIndex]); useEffect(() => setOverview(overviewExpanded), [overviewExpanded]); useEffect(() => setSources(showSources), [showSources]); useEffect(() => setVideoIndex(selectedIndex), [selectedIndex])
  const updateZone = (values: Record<string, string | number | boolean>) => {
    const next: Record<string, string | number | boolean> = {}
    if (typeof values.state === 'string') { setZoneState(values.state as VideoState); next.magazineState = values.state }
    if (typeof values.selectedIndex === 'number') { setZoneIndex(values.selectedIndex); next.magazineSelectedIndex = values.selectedIndex }
    if (typeof values.expanded === 'boolean') { setOverview(values.expanded); next.overviewExpanded = values.expanded }
    if (typeof values.showSources === 'boolean') { setSources(values.showSources); next.showSources = values.showSources }
    onLive?.(next)
  }
  const updateQuery = (q: string) => { setText(q); onLive?.({ query: q }) }
  return <div data-figma-node="2223:96460"><SearchScene width={1520} height={2643} pageShell={pageShell} query={text} onQuery={updateQuery} onSearch={onSearch}>
    <section className="vo-magazine-answer"><div className="vo-entity-header"><div><h2>Tom Hanks</h2><p>American actor and filmmaker</p></div><div role="group" aria-label="Entity category">{VIDEO_TABS.map(value => <button type="button" key={value} aria-pressed={tab === value} onClick={() => { setTab(value); onLive?.({ activeTab:value }) }}>{value}</button>)}</div></div>
      <VideoMagazineZone placement="SERP" width={1200} state={zoneState} selectedIndex={zoneIndex} expanded={overview} showSources={sources} onLive={updateZone} /><div className="vo-magazine-footnote"><small>Wikipedia text under CC-BY-SA license</small><span>Feedback <Icon name="thumb" /></span></div>
    </section><div className="vo-topic-pills">{MAGAZINE_SUGGESTIONS.map(s => <button key={s} onClick={() => updateQuery(s)}>{s}</button>)}</div>
    {pageShell && <><div className="vo-results-grid"><div className="vo-mainline"><AlgorithmResult withCards={false} /><div className="vo-algo-tabs"><strong>lorem ipsum dolor sit amet</strong><span>lorem ipsum dolor</span><span>lorem ipsum dolor</span></div><p className="vo-body-copy">{SOURCE_SNIPPET} {SOURCE_SNIPPET}</p>
      <section className="vo-magazine-videos"><SectionHeading>Videos of Lorem ipsum</SectionHeading><VideoList mobile={false} hero={false} selectedIndex={videoIndex} onSelect={i => { setVideoIndex(i); onLive?.({selectedIndex:i}) }} /><AnswerFooter expansion>Show more</AnswerFooter></section>
      <section className="vo-questions"><h3>People also ask</h3>{SOURCE_QUESTIONS.map((item, i) => <div key={i}><button type="button" aria-expanded={question === i} onClick={() => { const next=question === i ? -1 : i; setQuestion(next); onLive?.({openQuestion:next}) }}>{item.title}<Icon name={question === i ? 'up' : 'down'} /></button>{question === i && <div className="vo-question-body"><p>{item.body}</p><button type="button">Continue reading ›</button><AlgorithmResult withCards={false} /></div>}</div>)}</section>
    </div><RelatedSearches onQuery={updateQuery} /></div><RelatedSearches horizontal onQuery={updateQuery} /><nav className="vo-pagination" aria-label="Results pages"><button>1</button><button>2</button><button>3</button><button aria-label="Next results page"><Icon name="chevron" /></button></nav></>}
  </SearchScene></div>
}

function SourceGap({ title, node, children, url }: { title: string; node: string; children: ReactNode; url?: string }) { return <section className="vo-source-gap" data-figma-node={node}><span>Source design status</span><h2>{title}</h2><p>{children}</p><a href={url ?? `https://www.figma.com/design/fRSRroY4YFgJSeqLLE0Y38/MM-ACF?node-id=${node.replace(':','-')}`} target="_blank" rel="noreferrer">Open source Figma ↗</a></section> }
export function SerpVideoAnswerGoWide() { return <SourceGap title="Video Answer Go-wide — in progress" node="2128:29243">This selected Figma page is empty. A visual component and SDL layout have not been supplied yet.</SourceGap> }
export function VrpWholePage() { return <SourceGap title="VRP · Whole Page — source reference" node="940:2564" url="https://www.figma.com/design/dd9IQ0YMNSEtTDs0QhbDFJ/Video-vertical-ACF?node-id=1990-22578">The selected page links to a separate Video Vertical file. Its linked node is a WIP cover, not a VRP layout. The reference is retained here.</SourceGap> }
