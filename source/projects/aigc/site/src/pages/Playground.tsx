import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { bySlug, components } from '../data/components'
import { defaults, jsxProps } from '../components/Workbench'
import type { LiveProps } from '../components/Workbench'
import { RENDERERS, TAGS } from '../components/renderers'
import { generateMosaicPage } from '../mosaic/generators'
import { mosaicCatalogSnapshot } from '../mosaic/validate'
import { aiPrompt } from '../data/aiPrompt'
import { downloadHtml, downloadText, exportPortableHtml } from '../data/exportHtml'
import { DEFAULT_CANVAS_WIDTH, MAX_BLOCKS, MAX_CANVAS_WIDTH, MIN_CANVAS_WIDTH, STATE_VERSION, SURFACES,
  effectiveValues, nextBlockId, parsePageState, stateJSON, validateLiveValues } from '../data/pageState'
import type { PageBlock, PageState, SurfaceId } from '../data/pageState'

function preset(surface: SurfaceId, width = surface === 'serp' ? 1600 : surface === 'creator' ? 1256 : DEFAULT_CANVAS_WIDTH, fitToWidth = true): PageState {
  const slugs = SURFACES.find(item => item.id === surface)!.preset
  const blocks = slugs.flatMap((slug, index) => {
    const def = bySlug(slug)
    return def && RENDERERS[slug] ? [{ id: index + 1, slug, values: { ...defaults(def.props), ...(surface === 'creator' && slug === 'serp-aigc-answer' ? { pageShell: false } : {}) }, live: {} }] : []
  })
  return { version: STATE_VERSION, surface, width, fitToWidth, blocks }
}

export function pageJSX(blocks: readonly PageBlock[], width: number, surface: SurfaceId = 'blank'): string {
  const tags = [...new Set(blocks.map(block => TAGS[block.slug]).filter(Boolean))]
  const imports = tags.length ? `import { ${tags.join(', ')} } from './components'\n\n` : ''
  const body = blocks.map(block => {
    const def = bySlug(block.slug)
    const tag = TAGS[block.slug]
    if (!def || !tag) return ''
    const props = jsxProps(def, block.values, block.live)
    return props.length ? `      <${tag}\n        ${props.join('\n        ')}\n      />` : `      <${tag} />`
  }).filter(Boolean).join('\n')
  return `${imports}export default function AigcPage() {\n  return (\n    <div style={{ width: ${width}, display: 'flex', flexDirection: 'column', gap: 16, padding: ${surface === 'serp' ? 0 : 24}, boxSizing: 'border-box', background: '#fff' }}>\n${body}\n    </div>\n  )\n}`
}

function CanvasBlock({ block, selected, first, last, onSelect, onLive, onMove, onRemove }: {
  block: PageBlock; selected: boolean; first: boolean; last: boolean
  onSelect: (id: number) => void; onLive: (id: number, live: LiveProps) => void
  onMove: (id: number, direction: -1 | 1) => void; onRemove: (id: number) => void
}) {
  const render = RENDERERS[block.slug]
  const reportLive = useCallback((live: LiveProps) => onLive(block.id, live), [block.id, onLive])
  const name = bySlug(block.slug)?.name ?? block.slug
  return <div className={'pg__block' + (selected ? ' pg__block--on' : '')} onClick={() => onSelect(block.id)}>
    <div className="pg__block-chrome" data-playground-chrome onClick={event => event.stopPropagation()}>
      <button className="pg__block-label" type="button" onClick={() => onSelect(block.id)} aria-label={`Edit ${name}`}>{name}</button>
      <button type="button" disabled={first} onClick={() => onMove(block.id, -1)} aria-label={`Move ${name} up`} title="Move up">↑</button>
      <button type="button" disabled={last} onClick={() => onMove(block.id, 1)} aria-label={`Move ${name} down`} title="Move down">↓</button>
      <button type="button" onClick={() => onRemove(block.id)} aria-label={`Remove ${name}`} title="Remove">×</button>
    </div>
    {render ? render(effectiveValues(block), reportLive) : <div className="callout">Preview unavailable: {name}</div>}
  </div>
}

function StateDialog({ onClose, onLoad }: { onClose: () => void; onLoad: (state: PageState) => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  useEffect(() => { dialog.current?.showModal() }, [])
  return <dialog ref={dialog} className="pg-dialog" aria-labelledby={titleId} onCancel={onClose} onClose={onClose}>
    <form onSubmit={event => {
      event.preventDefault()
      const result = parsePageState(text, components)
      if (!result.ok) { setError(result.error); return }
      onLoad(result.state)
    }}>
      <div className="pg-dialog__head"><h2 id={titleId}>Load page state</h2><button className="btn" type="button" onClick={onClose} aria-label="Close load state dialog">×</button></div>
      <p>Paste state JSON from this library or its generated AI prompt. Loading replaces the canvas; Undo restores the previous assembly.</p>
      <label className="field__label" htmlFor={`${titleId}-json`}>Page state JSON</label>
      <textarea id={`${titleId}-json`} value={text} onChange={event => { setText(event.target.value); setError('') }} spellCheck={false} autoFocus aria-describedby={error ? `${titleId}-error` : undefined} />
      {error && <p className="pg-dialog__error" id={`${titleId}-error`} role="alert">{error}</p>}
      <div className="pg-dialog__actions"><button type="button" className="btn" onClick={onClose}>Cancel</button><button className="btn btn--primary" type="submit" disabled={!text.trim()}>Load state</button></div>
    </form>
  </dialog>
}

export function Playground() {
  const [page, setPage] = useState<PageState>(() => preset('creator'))
  const [selected, setSelected] = useState<number | null>(() => preset('creator').blocks[0]?.id ?? null)
  const [previous, setPrevious] = useState<PageState | null>(null)
  const [format, setFormat] = useState<'jsx' | 'sdl'>('jsx')
  const [status, setStatus] = useState('')
  const [exportingHtml, setExportingHtml] = useState(false)
  const [htmlWarnings, setHtmlWarnings] = useState<string[]>([])
  const [loadOpen, setLoadOpen] = useState(false)
  const [leftOpen, setLeftOpen] = useState(true)
  const [rightOpen, setRightOpen] = useState(true)
  const [widthInput, setWidthInput] = useState(String(preset('creator').width))
  const [revision, setRevision] = useState(0)
  const [viewportWidth, setViewportWidth] = useState(0)
  const [frameHeight, setFrameHeight] = useState(480)
  const frame = useRef<HTMLDivElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const selectedBlock = page.blocks.find(block => block.id === selected)
  const selectedDef = selectedBlock ? bySlug(selectedBlock.slug) : undefined
  const values = selectedBlock ? effectiveValues(selectedBlock) : {}
  const surface = SURFACES.find(item => item.id === page.surface)!
  const scale = page.fitToWidth && viewportWidth > 0 ? Math.min(1, viewportWidth / page.width) : 1
  const jsx = useMemo(() => pageJSX(page.blocks, page.width, page.surface), [page.blocks, page.width, page.surface])
  const mosaic = useMemo(() => generateMosaicPage(page.blocks, page.surface, page.width), [page.blocks, page.surface, page.width])
  const code = format === 'jsx' ? jsx : JSON.stringify(mosaic.node, null, 2)
  const validationErrors = mosaic.validation.issues.filter(issue => issue.severity === 'error')

  useEffect(() => {
    if (!viewport.current || !frame.current) return
    const measure = () => {
      setViewportWidth(Math.max(0, (viewport.current?.clientWidth ?? 0) - 2))
      setFrameHeight(frame.current?.offsetHeight ?? 480)
    }
    const observer = new ResizeObserver(measure)
    observer.observe(viewport.current); observer.observe(frame.current)
    measure()
    return () => observer.disconnect()
  }, [])

  function replace(next: PageState) {
    setPrevious(page); setPage(next); setWidthInput(String(next.width))
    setSelected(next.blocks[0]?.id ?? null); setRevision(value => value + 1); setStatus('')
  }
  function add(slug: string) {
    const def = bySlug(slug)
    if (!def || !RENDERERS[slug] || page.blocks.length >= MAX_BLOCKS) return
    const id = nextBlockId(page.blocks)
    setPrevious(page)
    setPage({ ...page, blocks: [...page.blocks, { id, slug, values: defaults(def.props), live: {} }] })
    setSelected(id); setStatus('')
  }
  function remove(id: number) {
    const index = page.blocks.findIndex(block => block.id === id)
    const blocks = page.blocks.filter(block => block.id !== id)
    setPrevious(page); setPage({ ...page, blocks })
    if (selected === id) setSelected(blocks[Math.min(index, blocks.length - 1)]?.id ?? null)
  }
  function move(id: number, direction: -1 | 1) {
    const index = page.blocks.findIndex(block => block.id === id)
    const nextIndex = index + direction
    if (index < 0 || nextIndex < 0 || nextIndex >= page.blocks.length) return
    const blocks = [...page.blocks]
    ;[blocks[index], blocks[nextIndex]] = [blocks[nextIndex], blocks[index]]
    setPrevious(page); setPage({ ...page, blocks })
  }
  const reportLive = useCallback((id: number, live: LiveProps) => {
    setPage(current => {
      const block = current.blocks.find(item => item.id === id)
      const def = block && bySlug(block.slug)
      if (!block || !def) return current
      let next
      try { next = validateLiveValues({ ...block.live, ...live }, def) } catch { return current }
      if (JSON.stringify(block.live) === JSON.stringify(next)) return current
      return { ...current, blocks: current.blocks.map(item => item.id === id ? { ...item, live: next } : item) }
    })
  }, [])
  function updateProp(name: string, value: string | boolean) {
    if (!selectedBlock) return
    setPage(current => ({ ...current, blocks: current.blocks.map(block => {
      if (block.id !== selectedBlock.id) return block
      const live = { ...block.live }; delete live[name]
      return { ...block, values: { ...block.values, [name]: value }, live }
    }) }))
  }
  function applyWidth() {
    const width = Number(widthInput)
    if (!Number.isInteger(width) || width < MIN_CANVAS_WIDTH || width > MAX_CANVAS_WIDTH) {
      setStatus(`Canvas width must be an integer from ${MIN_CANVAS_WIDTH} to ${MAX_CANVAS_WIDTH}.`); return
    }
    setPage(current => ({ ...current, width })); setStatus('')
  }
  async function copy(text: string, label: string) {
    try { await navigator.clipboard.writeText(text); setStatus(`${label} copied.`) }
    catch { setStatus(`Clipboard unavailable. Use Download ${label === 'full state' ? 'state' : label === 'AI prompt' ? 'prompt' : 'code'}.`) }
  }
  async function downloadPortableSnapshot() {
    if (!frame.current || exportingHtml) return
    setExportingHtml(true); setHtmlWarnings([]); setStatus('Embedding images and Roboto fonts…')
    try {
      const output = await exportPortableHtml(frame.current, { surface: surface.name, width: page.width })
      downloadHtml(output.html, `aigc-${page.surface}.html`)
      setHtmlWarnings(output.warnings)
      setStatus(output.warnings.length
        ? `HTML downloaded with ${output.warnings.length} export warning${output.warnings.length === 1 ? '' : 's'}; see the list below.`
        : `Standalone HTML downloaded with ${output.embeddedAssets} embedded assets. It can be viewed offline.`)
    } catch (error) {
      setStatus(`HTML export failed: ${error instanceof Error ? error.message : 'Unexpected error'}`)
    } finally { setExportingHtml(false) }
  }
  function handleWidthKey(event: KeyboardEvent<HTMLInputElement>) { if (event.key === 'Enter') applyWidth() }

  return <main className="main" id="main-content">
    <div className="page-header">
      <h2>Playground</h2>
      <div className="meta"><span className="chip">Page assembly</span><span className="chip">{page.blocks.length} blocks</span><span className="chip">React JSX + Mosaic SDL</span></div>
    </div>
    <p className="overview">Assemble registered components, edit their properties, and export the same values as JSX, SDL or a reusable page state.</p>
    {components.length === 0 && <div className="callout" style={{ marginTop: 18 }}>Figma source extraction is pending. The registry is empty, so no converted AIGC components or previews are available yet. The workbench currently opens an empty canvas.</div>}
    <div className="pg__surfaces" aria-label="Starting assemblies">
      {SURFACES.map(item => <button type="button" key={item.id} className={'pg__surface' + (item.id === page.surface ? ' pg__surface--on' : '')} aria-pressed={item.id === page.surface} onClick={() => replace(preset(item.id, undefined, page.fitToWidth))}>
        <strong>{item.name}</strong><span>{item.note}</span>
      </button>)}
    </div>
    <p className="source-note">Selecting an assembly loads its preset. Canvas width is a workbench control, not a source measurement.</p>
    <div className="pg__toolbar">
      <label htmlFor="canvas-width">Canvas width</label>
      <input id="canvas-width" type="number" min={MIN_CANVAS_WIDTH} max={MAX_CANVAS_WIDTH} step={1} value={widthInput} onChange={event => setWidthInput(event.target.value)} onKeyDown={handleWidthKey} />
      <span>px</span><button className="btn" type="button" onClick={applyWidth}>Apply</button>
      <label className="pg__fit"><input type="checkbox" checked={page.fitToWidth} onChange={event => setPage(current => ({ ...current, fitToWidth: event.target.checked }))} /> Fit to width</label>
      <span className="pg__zoom">{Math.round(scale * 100)}%</span>
      <button className="btn" type="button" disabled={!previous} onClick={() => {
        if (!previous) return
        const current = page; setPage(previous); setPrevious(current); setWidthInput(String(previous.width)); setSelected(previous.blocks[0]?.id ?? null); setRevision(value => value + 1)
      }}>Undo / restore</button>
    </div>
    <div className={'pg' + (!leftOpen ? ' pg--no-l' : '') + (!rightOpen ? ' pg--no-r' : '')}>
      {leftOpen ? <aside className="pg__palette" aria-label="Component palette">
        <div className="pg__panel-head"><h3>Components</h3><button className="pg__collapse" type="button" onClick={() => setLeftOpen(false)} aria-label="Collapse component palette">‹</button></div>
        {components.length === 0 && <p className="source-note">Components will appear here after source extraction.</p>}
        {(['Molecule', 'Cell', 'Organism'] as const).map(tier => <div className="pg__palette-group" key={tier}>
          <h4>{tier}s</h4>
          {components.filter(component => component.tier === tier).map(component => <button className="pg__add" type="button" key={component.slug} onClick={() => add(component.slug)} disabled={!RENDERERS[component.slug] || page.blocks.length >= MAX_BLOCKS}>
            <span>{component.name}</span><span aria-hidden="true">+</span>
          </button>)}
        </div>)}
        {page.blocks.length >= MAX_BLOCKS && <p className="source-note">Canvas limit: {MAX_BLOCKS} blocks.</p>}
      </aside> : <button className="pg__rail" type="button" onClick={() => setLeftOpen(true)}>Components ›</button>}
      <div className="pg__canvas">
        <div className="pg__viewport" ref={viewport}>
          <div className="pg__scale-box" style={{ width: page.width * scale, height: frameHeight * scale }}>
            <div className="pg__frame" ref={frame} style={{ width: page.width, minHeight: 480, display: 'flex', flexDirection: 'column', gap: 16, padding: page.surface === 'serp' ? 0 : 24, background: '#fff', transform: `scale(${scale})`, transformOrigin: 'top left' }}>
              {page.blocks.map((block, index) => <CanvasBlock key={`${revision}-${block.id}`} block={block} selected={selected === block.id} first={index === 0} last={index === page.blocks.length - 1} onSelect={setSelected} onLive={reportLive} onMove={move} onRemove={remove} />)}
              {page.blocks.length === 0 && <div className="pg__empty" data-playground-chrome><strong>{components.length ? 'Your canvas is empty' : 'Waiting for Figma source'}</strong><span>{components.length ? 'Add a component from the palette to begin.' : 'Previews will appear after the selected source pages are read.'}</span></div>}
            </div>
          </div>
        </div>
        <div className="export-row"><button className="btn" type="button" onClick={() => copy(stateJSON(page), 'full state')}>Copy full state</button><button className="btn" type="button" onClick={() => downloadText(stateJSON(page), `aigc-${page.surface}-state.json`, 'application/json')}>Download state</button><button className="btn" type="button" onClick={() => setLoadOpen(true)}>Load state</button></div>
        <div className="export-row"><button className="btn" type="button" disabled={exportingHtml} onClick={downloadPortableSnapshot}>{exportingHtml ? 'Embedding assets…' : 'Download HTML'}</button><button className="btn" type="button" onClick={() => copy(aiPrompt(components), 'AI prompt')}>Copy AI prompt</button><button className="btn" type="button" onClick={() => downloadText(aiPrompt(components), 'aigc-assembly-prompt.txt')}>Download prompt</button></div>
        <p className="source-note">HTML embeds local images and used Roboto fonts for offline viewing. It preserves the canvas appearance as a static snapshot; interactive behavior is not included.</p>
        {htmlWarnings.length > 0 && <details className="source-note"><summary>{htmlWarnings.length} HTML export warning{htmlWarnings.length === 1 ? '' : 's'}</summary><ul>{htmlWarnings.map(warning => <li key={warning}>{warning}</li>)}</ul></details>}
      </div>
      {rightOpen ? <aside className="panel pg__inspector" aria-label="Selected block properties">
        <div className="pg__panel-head"><h3>Inspector</h3><button className="pg__collapse" type="button" onClick={() => setRightOpen(false)} aria-label="Collapse inspector">›</button></div>
        {page.blocks.length > 0 && <div className="field"><label className="field__label" htmlFor="selected-block">Block</label><select id="selected-block" value={selected ?? ''} onChange={event => setSelected(Number(event.target.value))}>{page.blocks.map((block, index) => <option key={block.id} value={block.id}>{index + 1}. {bySlug(block.slug)?.name}</option>)}</select></div>}
        {selectedBlock && selectedDef ? <>
          <p className="source-note pg__inspector-title">{selectedDef.name}</p>
          {selectedDef.props.map(prop => {
            const id = `inspector-${selectedBlock.id}-${prop.name}`
            const disabled = Boolean(prop.under && values[prop.under] === false)
            return prop.kind === 'boolean'
              ? <div className="field--bool" key={prop.name}><input id={id} type="checkbox" checked={Boolean(values[prop.name])} disabled={disabled} onChange={event => updateProp(prop.name, event.target.checked)} /><label htmlFor={id}>{prop.name}</label></div>
              : <div className="field" key={prop.name}><label className="field__label" htmlFor={id}>{prop.name}</label>{prop.kind === 'select'
                ? <select id={id} value={String(values[prop.name])} disabled={disabled} onChange={event => updateProp(prop.name, event.target.value)}>{prop.values.map(value => <option key={value} value={value}>{value}</option>)}</select>
                : <input id={id} type="text" value={String(values[prop.name] ?? '')} disabled={disabled} onChange={event => updateProp(prop.name, event.target.value)} />}</div>
          })}
          {!selectedDef.props.length && <p className="source-note">This component has no editable registry properties.</p>}
          <button className="panel__reset" type="button" onClick={() => { setPage(current => ({ ...current, blocks: current.blocks.map(block => block.id === selectedBlock.id ? { ...block, values: defaults(selectedDef.props), live: {} } : block) })); setRevision(value => value + 1) }}>Reset block</button>
          <div className="pg__inspector-actions"><button className="btn" type="button" onClick={() => move(selectedBlock.id, -1)} disabled={page.blocks[0]?.id === selectedBlock.id}>Move up</button><button className="btn" type="button" onClick={() => move(selectedBlock.id, 1)} disabled={page.blocks[page.blocks.length - 1]?.id === selectedBlock.id}>Move down</button><button className="btn" type="button" onClick={() => remove(selectedBlock.id)}>Remove</button></div>
        </> : <p className="source-note">Select a block on the canvas or add one from the palette.</p>}
      </aside> : <button className="pg__rail" type="button" onClick={() => setRightOpen(true)}>‹ Inspector</button>}
    </div>
    <p className="pg__status" role="status">{status}</p>
    <section className="section">
      <div className="code-toolbar"><h3 className="section__title" style={{ margin: 0 }}>Page code</h3><div className="code-tabs" aria-label="Page code format"><button className={'code-tab' + (format === 'jsx' ? ' code-tab--active' : '')} type="button" aria-pressed={format === 'jsx'} onClick={() => setFormat('jsx')}>AIGC JSX</button><button className={'code-tab' + (format === 'sdl' ? ' code-tab--active' : '')} type="button" aria-pressed={format === 'sdl'} onClick={() => setFormat('sdl')}>Mosaic SDL</button></div></div>
      <div className="code"><pre tabIndex={0}><code>{code}</code></pre><button className="code__copy" type="button" onClick={() => copy(code, 'code')}>Copy code</button></div>
      <div className="export-row"><button className="btn" type="button" onClick={() => downloadText(code, `aigc-${page.surface}.${format === 'jsx' ? 'tsx' : 'sdl.json'}`, format === 'sdl' ? 'application/json' : 'text/plain')}>Download code</button><span className="export-row__note">JSX imports named components from the library’s public components index.</span></div>
      {format === 'sdl' && <div className="sdl-report"><div className="sdl-report__summary"><span className={'sdl-status ' + (mosaic.validation.valid ? 'sdl-status--valid' : 'sdl-status--error')}>{mosaic.validation.valid ? `✓ Catalog valid · ${mosaic.validation.nodeCount} nodes` : `${validationErrors.length} validation errors`}</span><span className="sdl-report__catalog">Mosaic CLI {mosaicCatalogSnapshot.mosaicCliVersion} · {mosaicCatalogSnapshot.componentCount} components</span></div>
        {validationErrors.length > 0 && <ul className="sdl-report__errors">{validationErrors.map(issue => <li key={`${issue.path}-${issue.message}`}><code>{issue.path}</code> — {issue.message}</li>)}</ul>}
        {mosaic.warnings.length > 0 && <><div className="sdl-report__label">Portable fallback / gaps</div><ul className="sdl-report__warnings">{mosaic.warnings.map(warning => <li key={warning}>{warning}</li>)}</ul></>}
      </div>}
    </section>
    {loadOpen && <StateDialog onClose={() => setLoadOpen(false)} onLoad={state => { replace(state); setLoadOpen(false); setStatus('Page state loaded.') }} />}
  </main>
}
