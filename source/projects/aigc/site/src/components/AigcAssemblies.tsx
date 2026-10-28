import * as React from 'react'
import source from '../data/assembly-source.json'
import { figmaImage } from '../data/assets'
import { MainImageArea, ImageDisplayList, HistoryPanelImages, AIGC_SOURCE_PROMPT } from './AigcMolecules'
import type { AigcAspectRatio, MainImageStatus } from './AigcMolecules'
import { ActionBar, ErrorStates, CreationComposer } from './AigcControls'
import type { LiveProps } from './Workbench'
import { SerpTemplateCard } from './AigcParts'

const font = 'Roboto, Arial, sans-serif'
export const MAIN_CONTENT_VARIANTS = ['Image3:2', 'Image1:1', 'Image2:3', 'Single Image', 'loading status'] as const
export type MainContentVariant = typeof MAIN_CONTENT_VARIANTS[number]
export interface MainContentAreaProps {
  property1?: MainContentVariant
  selectedIndex?: number
  mainStatus?: MainImageStatus
  width?: number
  onLive?: (values: LiveProps) => void
}

/** Canonical Main content set 470:34592, always 1134 × 608. */
export function MainContentArea({ property1 = 'Image3:2', selectedIndex = 0, mainStatus = 'Default', width = 1134, onLive }: MainContentAreaProps) {
  const [selected, setSelected] = React.useState(selectedIndex)
  React.useEffect(() => setSelected(selectedIndex), [selectedIndex, property1])
  const ratio: AigcAspectRatio = property1 === 'Image1:1' ? '1:1' : property1 === 'Image2:3' ? '2:3' : '3:2'
  const data = source.content[ratio]
  const scale = width / 1134
  const pick = (index: number) => { setSelected(index); onLive?.({ selectedIndex: index }) }
  const selectedHash = selected === 0 ? data.main : data.images[Math.min(3, Math.max(0, selected))]
  const illustration = source.loading.illustration
  const transform = illustration.imageTransform
  return <div data-aigc="main-content-area" data-source-node="470:34592" style={{ width, height: 608 * scale, position: 'relative', flex: '0 0 auto', fontFamily: font }}>
    <div style={{ width: 1134, height: 608, transform: scale === 1 ? undefined : `scale(${scale})`, transformOrigin: 'top left', borderRadius: property1 === 'loading status' ? 0 : 16, overflow: 'hidden', position: 'relative', display: 'flex', gap: 2 }}>
      {property1 === 'loading status' ? <div role="status" style={{ width: 1134, height: 608, background: '#f8f4f1', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: 16 }}>
        <div style={{ width: illustration.width, height: illustration.height, position: 'relative', overflow: 'hidden', marginBottom: 16 }}>
          <img src={figmaImage(illustration.imageHash)} alt="Image generation illustration" style={{ position: 'absolute', maxWidth: 'none', width: `${100 / transform[0][0]}%`, height: `${100 / transform[1][1]}%`, left: `${-100 * transform[0][2] / transform[0][0]}%`, top: `${-100 * transform[1][2] / transform[1][1]}%` }} />
        </div>
        <strong style={{ fontSize: 18, lineHeight: '26px', marginBottom: 12 }}>{source.loading.title}</strong>
        <span style={{ fontSize: 14, lineHeight: '22px', color: '#666' }}>Analyze your prompt “an astronaut sits in a poppy field, working on a laptop”</span>
      </div> : property1 === 'Single Image' ? <>
        <img src={figmaImage(source.singleImage)} alt="" style={{ position: 'absolute', width: 1258, height: 767, left: -62, top: -50, objectFit: 'cover', filter: 'blur(36px) brightness(.9)' }} />
        <img src={figmaImage(source.singleImage)} alt="Bear illustration restyled as a pencil sketch" style={{ position: 'relative', width: 909, height: 608, margin: '0 auto', objectFit: 'cover' }} />
      </> : <>
        <MainImageArea property1={ratio} status={mainStatus} imageHash={selectedHash} width={data.mainWidth} />
        <ImageDisplayList property1={ratio === '3:2' ? '3:2' : '1:1'} images={data.images.map((hash, index) => ({ hash, alt: `Generated image ${index + 1}` }))} selectedIndex={selected} onSelect={pick} width={data.stripWidth} />
      </>}
    </div>
  </div>
}

export const HISTORY_VARIANTS = ['full', 'half', 'unsigned in'] as const
export type HistoryVariant = typeof HISTORY_VARIANTS[number]
export interface HistoryPanelProps { property1?: HistoryVariant; selectedIndex?: number; loading?: boolean; onSelect?: (index: number) => void; onNewCreation?: () => void; onSeeAll?: () => void; onLive?: (values: LiveProps) => void }

/** Canonical Preview · History 508:30661. Header, divider and row positions are source pixels. */
export function HistoryPanel({ property1 = 'full', selectedIndex = 0, loading = false, onSelect, onNewCreation, onSeeAll, onLive }: HistoryPanelProps) {
  const [selected, setSelected] = React.useState(selectedIndex)
  const [expanded, setExpanded] = React.useState(false)
  React.useEffect(() => { setSelected(selectedIndex); setExpanded(false) }, [selectedIndex, property1])
  const variant = expanded ? 'full' : property1
  const items = source.history[variant]
  const currentIndex = Math.min(Math.max(0, selected), items.length - 1)
  return <aside data-aigc="history-panel" data-source-node="508:30661" aria-label="Creation history" style={{ width: 54, height: 608, flex: '0 0 54px', fontFamily: font }}>
    <button type="button" onClick={() => { setSelected(0); onNewCreation?.() }} style={{ width: 54, height: 74, padding: '12px 0', border: 0, borderRadius: 8, background: '#f8f4f1', color: '#3c51b4', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer', font: `700 11px/13px ${font}` }}>
      <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3v14M3 10h14" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg><span>New<br />creation</span>
    </button>
    <div style={{ height: 16, margin: '8px 0', display: 'flex', alignItems: 'center' }}><div style={{ height: 1, width: 54, background: '#ececec' }} /></div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((item, index) => <HistoryPanelImages key={item.id} property1={loading && index === 0 ? 'Loading' : item.kind as 'Multi' | 'Single'} property2={index === currentIndex ? 'Selected' : 'Default'} images={item.images.map(hash => ({ hash }))} onSelect={() => { setSelected(index); onSelect?.(index); onLive?.({ selectedIndex: index }) }} />)}
      {variant !== 'unsigned in' && <button type="button" onClick={() => { setExpanded(true); onSeeAll?.() }} style={{ width: 54, height: variant === 'full' ? 68 : 40, border: '1px solid #ececec', borderRadius: 8, background: '#fff', color: '#333', font: `11px/13px ${font}`, cursor: 'pointer' }}>See all</button>}
    </div>
  </aside>
}

export const CAROUSEL_CATEGORIES = ['All', 'Line drawing', 'Styles & aesthetics', 'Photo transform', 'Stickers', 'Editing tools'] as const
export type CarouselCategory = typeof CAROUSEL_CATEGORIES[number]
export const CAROUSEL_TEMPLATES = source.carousel
export interface SerpCarouselProps { category?: CarouselCategory; heading?: string; onSelect?: (name: string) => void; onLive?: (values: LiveProps) => void }

/** SERP_Carousel 598:39314. Only the six line-drawing examples exist in the source. */
export function SerpCarousel({ category = 'All', heading = 'Get started with templates', onSelect, onLive }: SerpCarouselProps) {
  const [active, setActive] = React.useState(category)
  const [selected, setSelected] = React.useState('')
  const [atEnd, setAtEnd] = React.useState(false)
  const rail = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => setActive(category), [category])
  const supplied = active === 'All' || active === 'Line drawing'
  return <section data-aigc="serp-carousel" data-source-node="598:39314" style={{ width: 1208, height: 283, position: 'relative', flex: '0 0 auto', fontFamily: font, color: '#000' }}>
    <div style={{ marginLeft: 4, fontSize: 14, lineHeight: '22px', fontWeight: 700 }}>{heading}</div>
    <div role="tablist" aria-label="Template categories" style={{ display: 'flex', gap: 8, margin: '8px 0 0 4px', height: 36 }}>
      {CAROUSEL_CATEGORIES.map(item => <button key={item} type="button" role="tab" aria-selected={active === item} onClick={() => { setActive(item); onLive?.({ category: item }); setSelected('') }} style={{ font: `700 13px/20px ${font}`, color: active === item ? '#000' : '#666', position: 'relative', height: 36, border: 0, borderRadius: 8, background: active === item ? '#efEae7' : 'transparent', padding: '8px 16px', cursor: 'pointer' }}>
        {item}{active === item && <span style={{ position: 'absolute', left: 'calc(50% - 10px)', width: 20, height: 3, bottom: 0, borderRadius: 3, background: '#000' }} />}
      </button>)}
    </div>
    {supplied ? <>
      <div ref={rail} role="tabpanel" tabIndex={0} aria-label={`${active} templates`} onScroll={() => { if (rail.current) setAtEnd(rail.current.scrollLeft >= rail.current.scrollWidth - rail.current.clientWidth - 2) }} style={{ marginTop: 17, display: 'flex', gap: 16, overflowX: 'auto', scrollbarWidth: 'none', width: 1208, height: 200 }}>
        {source.carousel.map(item => <div key={item.id} style={{ flex: '0 0 200px', width: 200, borderRadius: 24, outline: selected === item.label ? '2px solid #3c51b4' : undefined, outlineOffset: -2 }}>
          <SerpTemplateCard title={item.label} imageHash={item.image} referenceImageHash={item.original} onSelect={() => { setSelected(item.label); onSelect?.(item.label) }} />
        </div>)}
      </div>
      <div aria-hidden="true" style={{ position: 'absolute', right: 0, top: 83, height: 200, width: 30, background: 'linear-gradient(90deg,transparent,#fff)', pointerEvents: 'none' }} />
      <button type="button" aria-label={atEnd ? 'Previous templates' : 'Next templates'} onClick={() => rail.current?.scrollTo({ left: atEnd ? 0 : rail.current.scrollWidth, behavior: 'smooth' })} style={{ position: 'absolute', right: -16, top: 143, width: 32, height: 48, border: 0, borderRadius: 8, background: '#fff', boxShadow: '0 4px 8px #0002', cursor: 'pointer', color: '#444' }}>
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d={atEnd ? 'M10 3 5 8l5 5' : 'M6 3l5 5-5 5'} fill="none" stroke="currentColor" /></svg>
      </button>
    </> : <div role="tabpanel" style={{ height: 200, marginTop: 17, display: 'grid', placeItems: 'center', background: '#fafafa', borderRadius: 16, color: '#666', fontSize: 14 }}>The supplied Figma configuration contains line-drawing templates only.</div>}
  </section>
}

export const SERP_QUERY = `Create an image of ${AIGC_SOURCE_PROMPT[0].toLowerCase()}${AIGC_SOURCE_PROMPT.slice(1)}`
export type AigcAnswerState = 'Result' | 'Error'
export interface SerpAigcAnswerProps { state?: AigcAnswerState; pageShell?: boolean; query?: string; imageVariant?: MainContentVariant; selectedIndex?: number; historyIndex?: number; onLive?: (values: LiveProps) => void }

/** Source page 581:37248 and the supplied error composition 614:39975 (1600×1000). */
export function SerpAigcAnswer({ state = 'Result', pageShell = true, query = SERP_QUERY, imageVariant = 'Image3:2', selectedIndex = 0, historyIndex = 0, onLive }: SerpAigcAnswerProps) {
  const [searchText, setSearchText] = React.useState(query)
  const [contentVariant, setContentVariant] = React.useState<MainContentVariant>(imageVariant)
  const [imageSelection, setImageSelection] = React.useState(selectedIndex)
  const [historySelection, setHistorySelection] = React.useState(historyIndex)
  const [composer, setComposer] = React.useState(false)
  const [templates, setTemplates] = React.useState(false)
  const [generationMessage, setGenerationMessage] = React.useState('')
  React.useEffect(() => setSearchText(query), [query])
  React.useEffect(() => setContentVariant(imageVariant), [imageVariant])
  React.useEffect(() => setImageSelection(selectedIndex), [selectedIndex])
  React.useEffect(() => setHistorySelection(historyIndex), [historyIndex])
  const selectContent = (variant: MainContentVariant, image = imageSelection, history = historySelection) => {
    setContentVariant(variant); setImageSelection(image); setHistorySelection(history)
    onLive?.({ imageVariant: variant, selectedIndex: image, historyIndex: history })
  }
  return <div data-aigc="serp-aigc-answer" data-source-node={state === 'Error' ? '614:39975' : '581:37248'} style={{ position: 'relative', width: pageShell ? 1600 : 1208, height: pageShell ? 1000 : 690, overflow: 'hidden', background: '#fff', color: '#000', fontFamily: font, flex: '0 0 auto' }}>
    {pageShell && <header style={{ height: 152, position: 'relative' }}>
      <div style={{ position: 'absolute', left: 32, top: 33, display: 'flex', alignItems: 'center', gap: 7, color: '#777', fontSize: 20 }}><span aria-hidden="true" style={{ display: 'grid', gridTemplateColumns: '11px 11px', gap: 2 }}>{['#f35325', '#81bc06', '#05a6f0', '#ffba08'].map(color => <i key={color} style={{ width: 11, height: 11, background: color }} />)}</span>Bing</div>
      <nav aria-label="Search scopes" style={{ position: 'absolute', left: 220, top: 34, height: 32, color: '#666', fontSize: 13 }}>
        {['All', 'Search', 'Images', 'Videos', 'Maps', 'News', 'Copilot', '•••', 'Tools⌄'].map((label, index) => <span key={label} style={{ position: 'absolute', left: [8,78,148,223,295,360,425,512,574][index], top: 0, height: 30, lineHeight: '20px', whiteSpace: 'nowrap', fontWeight: index === 0 ? 700 : 400, borderBottom: index === 0 ? '3px solid #555' : undefined }}>{label}</span>)}
      </nav>
      <span style={{ position: 'absolute', left: 1434, top: 34, color: '#777', fontSize: 14, lineHeight: '20px' }}>2,345</span>
      <svg aria-label="Rewards" role="img" width="32" height="32" viewBox="0 0 32 32" style={{ position: 'absolute', left: 1478, top: 28, color: '#4285ff' }}><circle cx="16" cy="16" r="15" fill="none" stroke="currentColor" /><path d="M11 7h10l-2 7h-6l-2-7m5 7v9m-4 2h8m-4-10a4 4 0 1 0 0 8 4 4 0 0 0 0-8" fill="none" stroke="currentColor" /></svg>
      <img src={figmaImage('80a22a21309582ad6d57813767e8fa264f289f40')} alt="Source profile avatar" width="32" height="32" style={{ position: 'absolute', left: 1532, top: 28, borderRadius: '50%' }} />
      <form onSubmit={event => { event.preventDefault(); setComposer(true) }} style={{ position: 'absolute', top: 80, left: 216, width: 648, height: 48, padding: '0 16px', display: 'flex', alignItems: 'center', gap: 16, borderRadius: 100, boxShadow: '0 2px 8px #0003', background: '#fff', boxSizing: 'border-box' }}>
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="6.5" fill="none" stroke="#333" strokeWidth="1.5" /><path d="m13 13 5 5" stroke="#333" strokeWidth="1.5" /></svg>
        <input aria-label="Search query" value={searchText} onChange={event => { setSearchText(event.target.value); onLive?.({ query: event.target.value }) }} style={{ width: 501, flex: 1, minWidth: 0, border: 0, outline: 0, font: `16px/26px ${font}`, overflow: 'hidden', textOverflow: 'ellipsis', background: 'transparent' }} />
        <button aria-label="Edit image prompt" type="submit" style={{ width: 24, height: 24, padding: 0, background: 'transparent', border: 0, cursor: 'pointer' }}><svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 2H2v3m13-3h3v3M2 15v3h3m13-3v3h-3" fill="none" stroke="#444" /><circle cx="10" cy="10" r="3" fill="none" stroke="#444" /></svg></button>
      </form>
    </header>}
    <div style={{ position: 'absolute', top: pageShell ? 152 : 0, left: pageShell ? 220 : 0, width: 1208 }}>
      <h2 style={{ font: '700 20px/26px Arial, sans-serif', margin: '0 0 16px' }}>Bing Creator</h2>
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        <div style={{ width: 1134 }}>
          {state === 'Error' ? <ErrorStates state="not_signed_in" onAction={() => setComposer(true)} /> : <MainContentArea property1={contentVariant} selectedIndex={imageSelection} onLive={values => selectContent(contentVariant, Number(values.selectedIndex))} />}
          <div style={{ marginTop: 4 }}><ActionBar configuration={state === 'Error' || contentVariant === 'loading status' ? 'Image Loading' : 'Image Default'} onAction={action => {
            if (action === 'Edit image') setComposer(true)
            if (action === 'Recreate') { setComposer(true); setGenerationMessage('') }
            if (action === 'Explore templates') setTemplates(value => !value)
          }} /></div>
        </div>
        <HistoryPanel selectedIndex={historySelection} loading={state === 'Error'} onNewCreation={() => setComposer(true)} onSelect={index => selectContent(index === 1 ? 'Image1:1' : 'Image3:2', 0, index)} />
      </div>
      {templates && <div style={{ position: 'absolute', top: 74, left: 0, padding: 24, background: '#fff', boxShadow: '0 4px 32px #0003', borderRadius: 16, zIndex: 2, transform: 'scale(.85)', transformOrigin: 'top left' }}><SerpCarousel onSelect={() => { selectContent('Single Image'); setTemplates(false) }} /></div>}
    </div>
    {pageShell && <div style={{ position: 'absolute', left: 196, top: 874, width: 1208, borderTop: '1px solid #ececec', padding: '36px 20px 0', boxSizing: 'border-box', fontSize: 14 }}>
      <div style={{ fontSize: 13, lineHeight: '18px', marginBottom: 8 }}>Bing<br />www.bing.com/images/create</div>
      <div style={{ fontSize: 20, lineHeight: '26px', color: '#335cc7', marginBottom: 4 }}>Free AI Image Generator - Bing Image Creator</div>
      <div style={{ color: '#777' }}>Free. AI-powered Bing Image Creator and Bing Video Creator turn your words into stunning visuals</div>
    </div>}
    {composer && <div role="dialog" aria-label="Create an image" style={{ position: 'absolute', top: 110, left: pageShell ? 440 : 220, background: '#fff', borderRadius: 20, boxShadow: '0 8px 48px #0004', zIndex: 3 }}>
      <CreationComposer prompt={searchText} state="typing" onClose={() => setComposer(false)} onGenerate={() => { setGenerationMessage('Generation requires a connected product service. This library previews the supplied states.'); selectContent('loading status') }} />
      {generationMessage && <div role="status" style={{ width: 580, boxSizing: 'border-box', padding: 16, fontSize: 13, color: '#555' }}>{generationMessage}</div>}
    </div>}
  </div>
}
