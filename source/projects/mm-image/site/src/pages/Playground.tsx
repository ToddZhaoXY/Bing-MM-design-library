import * as React from 'react'
import { components, bySlug } from '../data/components'
import type { PropDef } from '../data/components'
import { defaults, jsxProps } from '../components/Workbench'
import type { LiveProps, Values } from '../components/Workbench'
import { RENDERERS, TAGS } from './ComponentPage'
import { BingShell } from '../components/Organisms'
import { RSOnTop } from '../components/Molecules'
import { search } from '../data/imageSearch'
import type { SearchImage, SearchSuggestion } from '../data/imageSearch'
import { Content, tileCount } from '../components/Content'
import { aiPrompt } from '../data/aiPrompt'
import { exportHtml, downloadHtml } from '../data/exportHtml'
import type { TileProps } from '../components/Content'
import { generateMosaicPage } from '../mosaic/generators'
import { mosaicCatalogSnapshot } from '../mosaic/validate'

/**
 * Page assembly canvas (requirement #4).
 *
 * Stack real component instances, tune each one's variants in place, then copy
 * the whole page as one JSX block. Same renderers and same code emitter as the
 * per-component Playground section — a block here is byte-identical to what
 * `/c/<slug>` would emit for the same values.
 */

interface Block {
  id: number
  slug: string
  values: Values
  live: LiveProps
  /** Content only — tile overrides applied to EVERY tile ("edit all"). */
  tileAll?: Values
  /** Content only — per-tile overrides, keyed by tile index ("edit one"). */
  tileOne?: Record<number, Values>
}

/** Which tile inside a Content block the inspector is pointed at. */
type TileSel = number | 'all' | null

/**
 * Full-state snapshot (requirement #4, round-trip half).
 *
 * The JSX emitter answers "give me code I can paste into a product repo". This
 * answers the other question: "give me back exactly this canvas." Everything
 * that makes the page what it is — surface, block stack with every value,
 * tile-level overrides, the live Bing payload, the query that produced it —
 * serialised verbatim, no defaults elided, nothing reconstructed.
 *
 * Paste it back via Load state and the canvas is identical.
 */
const STATE_VERSION = 1

interface PageState {
  version: number
  surface: SurfaceId
  query: string
  blocks: Block[]
  items: SearchImage[]
  suggestions: SearchSuggestion[]
}

function stateJSON(
  surface: SurfaceId,
  query: string,
  blocks: Block[],
  items: SearchImage[],
  suggestions: SearchSuggestion[],
) {
  const state: PageState = { version: STATE_VERSION, surface, query, blocks, items, suggestions }
  return JSON.stringify(state, null, 2)
}

/**
 * Parse a snapshot back into canvas state. Returns null on anything unusable —
 * the caller surfaces that rather than half-loading a broken page.
 */
function parseState(text: string): PageState | null {
  try {
    const s = JSON.parse(text) as PageState
    if (!s || typeof s !== 'object') return null
    if (!Array.isArray(s.blocks)) return null
    if (!SURFACES.some((x) => x.id === s.surface)) return null
    // Unknown slugs would render nothing — reject rather than silently drop.
    if (s.blocks.some((b) => !bySlug(b.slug))) return null
    return {
      version: s.version ?? 0,
      surface: s.surface,
      query: s.query ?? '',
      blocks: s.blocks,
      items: Array.isArray(s.items) ? s.items : [],
      suggestions: Array.isArray(s.suggestions) ? s.suggestions : [],
    }
  } catch {
    return null
  }
}

/** image-tile's registry props — the field set every Content cell exposes. */
function tileDef() {
  return bySlug('image-tile')!
}

/**
 * Values bag → ImageContainer props.
 *
 * Every present value is emitted, including ones that equal the registry
 * default. Eliding defaults looked tidier but was wrong: a layout branch can
 * pass its own baseline (Waterfall forces `showMetadata: false`), and the
 * user's props are what override it. Dropping `showMetadata: true` because it
 * matched the default meant the inspector toggle silently did nothing.
 */
function toTileProps(v: Values | undefined): TileProps {
  if (!v) return {}
  const out: Record<string, unknown> = {}
  for (const p of tileDef().props) {
    const val = v[p.name]
    if (val === undefined) continue
    out[p.name] = p.kind === 'select' && p.numeric ? Number(val) : val
  }
  return out as TileProps
}

/** Same set, emitted as a JSX object literal body — so code matches render. */
function tilePropsLiteral(v: Values | undefined) {
  if (!v) return ''
  const parts: string[] = []
  for (const p of tileDef().props) {
    const val = v[p.name]
    if (val === undefined) continue
    if (p.kind === 'boolean') parts.push(`${p.name}: ${val ? 'true' : 'false'}`)
    else if (p.kind === 'select' && p.numeric) parts.push(`${p.name}: ${val}`)
    else parts.push(`${p.name}: '${val}'`)
  }
  return parts.join(', ')
}

let nextId = 1

/* ------------------------------------------------------------------ *
 * Surfaces
 *
 * The playground doesn't start from a blank page — it starts from a real
 * surface. SERP and IRP each bring their own page shell, gutter geometry
 * and default block stack, straight out of Organisms.tsx. You then add,
 * remove and retune blocks inside that frame.
 *
 * Geometry is lifted verbatim from SerpImageAnswer / IrpWholePage so the
 * assembled page measures the same as the organism it started from.
 * ------------------------------------------------------------------ */

type SurfaceId = 'serp' | 'irp' | 'blank'

interface Surface {
  id: SurfaceId
  name: string
  note: string
  /** Page frame width. 0 = fluid (blank canvas). */
  width: number
  /** Content column inside the page frame. */
  column: { width: number; marginLeft: number | 'auto'; padding: string; gap: number }
  /**
   * Width a Content block renders at on this surface. Omit to keep Figma's own
   * 1200 cell. IRP's column is 1360 and the grid must run edge to edge in it.
   */
  contentWidth?: number
  /** Default stack, as [slug, prop overrides]. */
  preset: [string, Values][]
  /** JSX emitted above the blocks, at page level (outside the column). */
  chrome: string[]
  /** JSX emitted inside the column, above the blocks. */
  columnChrome: string[]
}

const SURFACES: Surface[] = [
  {
    id: 'serp',
    name: 'SERP · Image Answer',
    note: 'Bing shell + the MM block, left-anchored at x 160. Waterfall clipped to 1200 × 424.',
    width: 1440,
    column: { width: 1280, marginLeft: 160, padding: '16px 0', gap: 16 },
    preset: [
      ['header', { title: 'Image of Living Room', showSubTitle: false }],
      ['content', { layout: 'Waterfall' }],
      ['footer', { clickAction: 'Expansion: See more' }],
    ],
    chrome: ['<BingShell />'],
    columnChrome: [],
  },
  {
    id: 'irp',
    name: 'IRP · Whole Page',
    note: 'Bing shell with IMAGES scope + subcategories, RS on Top, then the dense grid. No Header/Footer on this surface.',
    width: 1440,
    column: { width: 1360, marginLeft: 'auto', padding: '24px 0 16px', gap: 16 },
    contentWidth: 1360,
    // RS on Top is a real block, not page chrome — so it can be selected,
    // retuned, reordered and removed like everything else on the canvas.
    preset: [
      ['rs-on-top', {}],
      ['content', { layout: 'Dense' }],
    ],
    chrome: ['<BingShell activeScope="IMAGES" subcategories query="Living Room" />'],
    columnChrome: [],
  },
  {
    id: 'blank',
    name: 'Blank',
    note: 'No page shell. Stack anything, any width.',
    width: 0,
    column: { width: 0, marginLeft: 'auto', padding: '0', gap: 10 },
    preset: [],
    chrome: [],
    columnChrome: [],
  },
]

function surfaceOf(id: SurfaceId) {
  return SURFACES.find((s) => s.id === id)!
}

/** Build the starting block stack for a surface. */
function presetBlocks(s: Surface): Block[] {
  return s.preset.map(([slug, over]) => {
    const def = bySlug(slug)!
    return { id: nextId++, slug, values: { ...defaults(def.props), ...over }, live: {} }
  })
}

function pageCode(
  blocks: Block[],
  s: Surface,
  items?: SearchImage[],
  suggestions?: SearchSuggestion[],
) {
  // Only embed when there is something to embed AND the toggle asked for it.
  const withData = !!items && items.length > 0
  const withSug = withData && !!suggestions && suggestions.length > 0
  const lines = blocks.map((b) => {
    const def = bySlug(b.slug)!
    const tag = TAGS[b.slug] ?? def.name.replace(/\s/g, '')
    const parts = jsxProps(def, b.values, b.live)

    // Content carries tile-level edits that aren't registry props — emit them
    // as the tile / tiles object props so the copied code reproduces the canvas.
    if (b.slug === 'content') {
      // Surface-driven shell width — emitted so the copy renders edge to edge
      // in the same column it does on the canvas.
      if (s.contentWidth) parts.push(`width={${s.contentWidth}}`)
      if (withData) parts.push(`items={items}`)
      const all = tilePropsLiteral(b.tileAll)
      if (all) parts.push(`tile={{ ${all} }}`)
      const ones = Object.entries(b.tileOne ?? {})
        .map(([k, v]) => [k, tilePropsLiteral(v)] as const)
        .filter(([, lit]) => lit !== '')
      if (ones.length) {
        parts.push(`tiles={{\n${ones.map(([k, lit]) => `    ${k}: { ${lit} },`).join('\n')}\n  }}`)
      }
    }

    // RS on Top sits in the same column as Content, so it carries the surface
    // width too — and the live pills when data is embedded.
    if (b.slug === 'rs-on-top') {
      if (s.contentWidth) parts.push(`width={${s.contentWidth - 34}}`)
      if (withSug) parts.push(`suggestions={suggestions}`)
    }

    if (!parts.length) return `<${tag} />`
    return `<${tag}\n${parts.map((p) => `  ${p}`).join('\n')}\n/>`
  })

  // The live data, serialised ahead of the component so the copied file runs
  // standalone. Bing's CDN URLs do expire — swap this for your own source.
  const data =
    (withData ? `const items = ${JSON.stringify(items, null, 2)}\n\n` : '') +
    (withSug ? `const suggestions = ${JSON.stringify(suggestions, null, 2)}\n\n` : '')

  if (s.id === 'blank') {
    if (!lines.length) return '<Page />'
    const body = lines.map((l) => indent(l, 6)).join('\n')
    return `${data}export function Page() {\n  return (\n    <div className="mm-page">\n${body}\n    </div>\n  )\n}`
  }

  // Surface pages carry the organism's own page frame + column geometry, so
  // the copied code renders at the same measurements it does here.
  const col = s.column
  const ml = col.marginLeft === 'auto' ? `margin: '0 auto'` : `marginLeft: ${col.marginLeft}`
  const chrome = s.chrome.map((c) => indent(c, 6)).join('\n')
  const colChrome = s.columnChrome.map((c) => indent(c, 8)).join('\n')
  const body = lines.map((l) => indent(l, 8)).join('\n')
  return [
    `${data}export function Page() {`,
    `  return (`,
    `    <div style={{ width: ${s.width}, background: '#fff', overflow: 'hidden' }}>`,
    chrome,
    `      <div`,
    `        style={{`,
    `          display: 'flex',`,
    `          flexDirection: 'column',`,
    `          alignItems: 'flex-start',`,
    `          gap: ${col.gap},`,
    `          width: ${col.width},`,
    `          ${ml},`,
    `          padding: '${col.padding}',`,
    `        }}`,
    `      >`,
    colChrome,
    body,
    `      </div>`,
    `    </div>`,
    `  )`,
    `}`,
  ]
    .filter((l) => l !== '')
    .join('\n')
}

function indent(block: string, n: number) {  const pad = ' '.repeat(n)
  return block
    .split('\n')
    .map((l) => pad + l)
    .join('\n')
}

export function Playground() {
  const [surfaceId, setSurfaceId] = React.useState<SurfaceId>('serp')
  const surface = surfaceOf(surfaceId)
  const [blocks, setBlocks] = React.useState<Block[]>(() => presetBlocks(surfaceOf('serp')))
  const [selected, setSelected] = React.useState<number | null>(null)
  /** Second selection level: which tile inside the selected Content block. */
  const [tileSel, setTileSel] = React.useState<TileSel>(null)
  const [copied, setCopied] = React.useState(false)
  const [codeFormat, setCodeFormat] = React.useState<'jsx' | 'sdl'>('jsx')
  const [stateCopied, setStateCopied] = React.useState(false)
  const [loadErr, setLoadErr] = React.useState<string | null>(null)
  /** AI hand-off: copy the schema contract, paste JSON back. See data/aiPrompt.ts. */
  const [promptCopied, setPromptCopied] = React.useState(false)
  /** Live canvas frame — the HTML export serialises this node. */
  const frameRef = React.useRef<HTMLDivElement>(null)
  /**
   * Rail collapse. The canvas is real Figma pixels (1200 SERP / 1360 IRP) and
   * cannot shrink, so on a laptop the two side panels are what starves it.
   * Collapsing either one gives its width straight back to the canvas column.
   */
  const [showPalette, setShowPalette] = React.useState(true)
  const [showInspector, setShowInspector] = React.useState(true)
  /**
   * Live Bing content. `query` is what the shell's search field committed;
   * `items` feed every Content block on the page. Empty items = Figma defaults,
   * so the page is identical to before until someone actually searches.
   */
  const [query, setQuery] = React.useState('Living Room')
  const [items, setItems] = React.useState<SearchImage[]>([])
  /** Requery suggestions from the same response — they drive RS on Top. */
  const [suggestions, setSuggestions] = React.useState<SearchSuggestion[]>([])
  const [searchErr, setSearchErr] = React.useState<string | null>(null)
  /**
   * Copy option: embed the live Bing results in the generated code, or not.
   * Defaults on — what you see on the canvas is what the copy should reproduce.
   * With no search run yet `items` is empty, so this is inert until it matters.
   */
  const [copyWithData, setCopyWithData] = React.useState(true)

  const runSearch = React.useCallback(async (q: string) => {
    setQuery(q)
    setSearchErr(null)
    try {
      const r = await search(q)
      setItems(r.images)
      setSuggestions(r.suggestions)
    } catch (e) {
      setItems([])
      setSuggestions([])
      setSearchErr(e instanceof Error ? e.message : String(e))
    }
  }, [])

  const jsxCode = React.useMemo(
    () =>
      pageCode(
        blocks,
        surface,
        copyWithData ? items : undefined,
        copyWithData ? suggestions : undefined,
      ),
    [blocks, surface, copyWithData, items, suggestions],
  )
  const mosaicOutput = React.useMemo(
    () =>
      generateMosaicPage(
        blocks,
        surfaceId,
        surface.column.width || undefined,
      ),
    [blocks, surface.column.width, surfaceId],
  )
  const code =
    codeFormat === 'sdl' ? JSON.stringify(mosaicOutput.node, null, 2) : jsxCode
  const current = blocks.find((b) => b.id === selected) ?? null
  const currentDef = current ? bySlug(current.slug) : null

  /** Switching surface reloads that surface's preset stack. */
  const pickSurface = (id: SurfaceId) => {
    setSurfaceId(id)
    setBlocks(presetBlocks(surfaceOf(id)))
    setSelected(null)
    setTileSel(null)
  }

  /** Selecting a block clears the tile pointer — it only means something inside Content. */
  const pickBlock = (id: number) => {
    setSelected(id)
    setTileSel(null)
  }

  const add = (slug: string) => {
    const def = bySlug(slug)
    if (!def) return
    const b: Block = { id: nextId++, slug, values: defaults(def.props), live: {} }
    setBlocks((v) => [...v, b])
    setSelected(b.id)
  }

  const remove = (id: number) => {
    setBlocks((v) => v.filter((b) => b.id !== id))
    setSelected((s) => (s === id ? null : s))
    setTileSel(null)
  }

  /** Write one tile field. target 'all' → tileAll; a number → tileOne[i]. */
  const setTileValue = (id: number, target: TileSel, name: string, value: string | boolean) => {
    if (target === null) return
    setBlocks((v) =>
      v.map((b) => {
        if (b.id !== id) return b
        if (target === 'all') {
          const base = b.tileAll ?? defaults(tileDef().props)
          return { ...b, tileAll: { ...base, [name]: value } }
        }
        const base = b.tileOne?.[target] ?? defaults(tileDef().props)
        return { ...b, tileOne: { ...(b.tileOne ?? {}), [target]: { ...base, [name]: value } } }
      }),
    )
  }

  const move = (id: number, dir: -1 | 1) =>
    setBlocks((v) => {
      const i = v.findIndex((b) => b.id === id)
      const j = i + dir
      if (i < 0 || j < 0 || j >= v.length) return v
      const next = v.slice()
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })

  const setValue = (id: number, name: string, value: string | boolean) =>
    setBlocks((v) => v.map((b) => (b.id === id ? { ...b, values: { ...b.values, [name]: value } } : b)))

  /**
   * Direct manipulation: double-click any text in a rendered component and edit
   * it in place, instead of hunting for the matching field in the inspector.
   *
   * How the target is resolved: the element's own text is matched against the
   * current value of every `text` prop in scope — tile props first when the
   * double-click landed inside a tile, then the block's own props. That keeps
   * this registry-driven; a new text prop becomes editable with no work here.
   *
   * The commit goes back into Block.values / tileAll / tileOne, so the copied
   * code reflects the edit. Nothing is ephemeral.
   */
  const editText = (
    e: React.MouseEvent,
    blockId: number,
    slug: string,
    tile: TileSel,
  ) => {
    const el = e.target as HTMLElement
    if (!el || el.isContentEditable) return
    const text = (el.textContent ?? '').trim()
    if (!text) return

    const block = blocks.find((b) => b.id === blockId)
    if (!block) return

    // Candidate (scope, prop-name) pairs, most specific scope first.
    const cands: Array<{ scope: 'tile' | 'block'; name: string }> = []
    if (tile !== null) {
      const tv = (tile === 'all' ? block.tileAll : block.tileOne?.[tile]) ?? defaults(tileDef().props)
      for (const p of tileDef().props)
        if (p.kind === 'text' && String(tv[p.name] ?? p.default).trim() === text)
          cands.push({ scope: 'tile', name: p.name })
    }
    for (const p of bySlug(slug)?.props ?? [])
      if (p.kind === 'text' && String(block.values[p.name] ?? p.default).trim() === text)
        cands.push({ scope: 'block', name: p.name })

    const hit = cands[0]
    if (!hit) return

    e.stopPropagation()
    e.preventDefault()

    el.contentEditable = 'true'
    el.focus()
    const r = document.createRange()
    r.selectNodeContents(el)
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(r)

    const done = (commit: boolean) => {
      el.contentEditable = 'false'
      el.removeEventListener('blur', onBlur)
      el.removeEventListener('keydown', onKey)
      const next = (el.textContent ?? '').trim()
      if (commit && next && next !== text) {
        if (hit.scope === 'tile') setTileValue(blockId, tile, hit.name, next)
        else setValue(blockId, hit.name, next)
      } else {
        // React owns this node; restore so the DOM matches state either way.
        el.textContent = text
      }
    }
    const onBlur = () => done(true)
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Enter') { ev.preventDefault(); done(true) }
      if (ev.key === 'Escape') { ev.preventDefault(); done(false) }
    }
    el.addEventListener('blur', onBlur)
    el.addEventListener('keydown', onKey)
  }

  // Live props arrive from inside the rendered component (Filter menus, Footer
  // feedback, …). Keyed by block so two Filters on one page stay independent.
  const onLive = React.useCallback(
    (id: number) => (p: LiveProps) =>
      setBlocks((v) => v.map((b) => (b.id === id ? { ...b, live: p } : b))),
    [],
  )

  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  /**
   * Copy the assembly contract for an assistant.
   *
   * Deliberately NOT an embedded chat: this site is a static build on the
   * internal Web Hub with no backend to hold an OAuth secret, and the people
   * who'd use this already have an assistant open. Export the schema, let them
   * paste the JSON into Load state.
   */
  const copyPrompt = async () => {
    await navigator.clipboard.writeText(aiPrompt(SURFACES))
    setPromptCopied(true)
    setTimeout(() => setPromptCopied(false), 1400)
  }

  /**
   * Standalone HTML. Serialises the live canvas rather than re-rendering it —
   * see data/exportHtml.ts for why that is the honest way to do this.
   */
  const saveHtml = () => {
    if (!frameRef.current) return
    const html = exportHtml(frameRef.current, {
      surface: surface.name,
      width: surface.width || frameRef.current.offsetWidth,
    })
    downloadHtml(html, `mmacf-${surfaceId}-${blocks.length}blocks.html`)
  }

  /** Full-state snapshot — the round-trip counterpart to Copy code. */
  const copyState = async () => {
    await navigator.clipboard.writeText(stateJSON(surfaceId, query, blocks, items, suggestions))
    setStateCopied(true)
    setTimeout(() => setStateCopied(false), 1400)
  }

  /**
   * Restore a snapshot. Block ids are reissued so a loaded page can't collide
   * with ids already handed out this session.
   */
  const loadState = () => {
    const text = window.prompt('Paste page state JSON:')
    if (text === null) return
    const s = parseState(text)
    if (!s) {
      setLoadErr('Could not parse that — not a valid page state JSON.')
      setTimeout(() => setLoadErr(null), 3000)
      return
    }
    setSurfaceId(s.surface)
    setBlocks(s.blocks.map((b) => ({ ...b, id: nextId++ })))
    setQuery(s.query)
    setItems(s.items)
    setSuggestions(s.suggestions)
    setSelected(null)
    setTileSel(null)
    setSearchErr(null)
    setLoadErr(null)
  }

  return (
    <main className="main">
      <div className="page-header">
        <h2>Playground</h2>
        <div className="meta">
          <span className="chip chip--tier">PAGE ASSEMBLY</span>
          <span className="chip">{surface.name}</span>
          <span className="chip">{blocks.length} blocks</span>
          {items.length > 0 && <span className="chip">live · {items.length} images</span>}
          {searchErr && <span className="chip">search failed: {searchErr}</span>}
        </div>
      </div>

      <p className="overview">
        Start from a real surface, then add, reorder and retune blocks inside it. Copy the whole
        page when it looks right.
      </p>

      <div className="pg__surfaces">
        {SURFACES.map((s) => (
          <button
            key={s.id}
            className={'pg__surface' + (s.id === surfaceId ? ' pg__surface--on' : '')}
            onClick={() => pickSurface(s.id)}
          >
            <strong>{s.name}</strong>
            <span>{s.note}</span>
          </button>
        ))}
      </div>

      <div
        className={
          'pg' + (showPalette ? '' : ' pg--no-l') + (showInspector ? '' : ' pg--no-r')
        }
      >
        {/* palette */}
        {!showPalette ? (
          <button
            className="pg__rail"
            onClick={() => setShowPalette(true)}
            aria-label="Show component palette"
          >
            Add ›
          </button>
        ) : (
        <aside className="pg__palette">
          <div className="pg__panel-head">
            <h3>Add component</h3>
            <button
              className="pg__collapse"
              onClick={() => setShowPalette(false)}
              aria-label="Hide component palette"
            >
              ‹
            </button>
          </div>
          {components
            .filter((c) => RENDERERS[c.slug])
            .map((c) => {
              // How many of this component are on the canvas. Non-zero → the row
              // reads as selected and its ✕ drops the last one, so a component can
              // be cancelled from the left without hunting for it on the canvas.
              const mine = blocks.filter((b) => b.slug === c.slug)
              const n = mine.length
              return (
                <button
                  key={c.slug}
                  className={'pg__add' + (n ? ' pg__add--on' : '')}
                  onClick={() => add(c.slug)}
                >
                  <span>{c.name}</span>
                  {n > 0 && (
                    <>
                      <span className="pg__add-count">{n}</span>
                      <span
                        role="button"
                        tabIndex={0}
                        className="pg__add-x"
                        aria-label={`Remove ${c.name}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          remove(mine[n - 1].id)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            e.stopPropagation()
                            remove(mine[n - 1].id)
                          }
                        }}
                      >
                        ✕
                      </span>
                    </>
                  )}
                  <span className="pg__add-tier">{c.tier[0]}</span>
                </button>
              )
            })}
        </aside>
        )}
        <div className="pg__canvas">
          <div
            className="pg__frame"
            ref={frameRef}
            style={surface.width ? { width: surface.width, background: '#fff' } : undefined}
          >
            {surfaceId === 'serp' && <BingShell query={query} onSearch={runSearch} />}
            {surfaceId === 'irp' && (
              <BingShell activeScope="IMAGES" subcategories query={query} onSearch={runSearch} />
            )}

            <div
              className="pg__column"
              style={
                surface.width
                  ? {
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: surface.column.gap,
                      width: surface.column.width,
                      marginLeft: surface.column.marginLeft,
                      marginRight: surface.column.marginLeft === 'auto' ? 'auto' : undefined,
                      padding: surface.column.padding,
                      boxSizing: 'border-box',
                    }
                  : undefined
              }
            >
              {blocks.length === 0 ? (
                <div className="callout">Empty page. Add a component from the left.</div>
              ) : (
                (() => {
                  /**
                   * Live items are a single ranked feed, and a real IRP is ONE
                   * continuous waterfall — a second Content row carries on down the
                   * list, it does not restart at rank 0. Without an offset every
                   * Content block gets items[0..n] and the page shows the same
                   * photos twice. Walk the blocks in order and hand each Content
                   * the next slice; per-block prop edits stay untouched.
                   */
                  const feed = new Map<number, SearchImage[]>()
                  let cursor = 0
                  for (const b of blocks) {
                    if (b.slug !== 'content') continue
                    const n = tileCount(b.values.layout as 'Waterfall' | 'Dense')
                    feed.set(b.id, items.slice(cursor, cursor + n))
                    cursor += n
                  }
                  return blocks.map((b, i) => {
              const render = RENDERERS[b.slug]
              const def = bySlug(b.slug)!
              const on = b.id === selected
              return (
                <div
                  key={b.id}
                  className={'pg__block' + (on ? ' pg__block--on' : '')}
                  onClick={() => pickBlock(b.id)}
                  onDoubleClick={(e) => editText(e, b.id, b.slug, null)}
                >
                  {/* Chrome is an OVERLAY, never a wrapper. The component sits
                      in the page flow at its real size, with nothing added to
                      the layout — what you see is what you copy. */}
                  <div className="pg__block-chrome">
                    <span className="pg__block-name">{def.name}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); move(b.id, -1) }}
                      disabled={i === 0}
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); move(b.id, 1) }}
                      disabled={i === blocks.length - 1}
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); remove(b.id) }}
                      aria-label="Remove"
                    >
                      ✕
                    </button>
                  </div>
                  {b.slug === 'content' ? (
                    /* Content composes real Image Tiles, so each cell gets its own
                       selection overlay — click one tile to edit just that tile. */
                    <Content
                      layout={b.values.layout as 'Waterfall' | 'Dense'}
                      width={surface.contentWidth ?? 1200}
                      items={feed.get(b.id) ?? items}
                      gap={b.values.gap === undefined ? 16 : Number(b.values.gap)}
                      tile={toTileProps(b.tileAll)}
                      tiles={Object.fromEntries(
                        Object.entries(b.tileOne ?? {}).map(([k, v]) => [k, toTileProps(v)]),
                      )}
                      renderTile={(node, ti) => (
                        <div
                          className={
                            'pg__tile' +
                            (on && (tileSel === ti || tileSel === 'all') ? ' pg__tile--on' : '')
                          }
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelected(b.id)
                            setTileSel(ti)
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation()
                            setSelected(b.id)
                            setTileSel(ti)
                            editText(e, b.id, b.slug, ti)
                          }}
                        >
                          {node}
                        </div>
                      )}
                    />
                  ) : b.slug === 'rs-on-top' ? (
                    /* RS on Top is a live block: its pills come from the same Bing
                       response as the tiles, and clicking one re-runs the search. */
                    <RSOnTop
                      label={b.values.label as string}
                      showGradient={b.values.showGradient !== false}
                      showScrollButton={b.values.showScrollButton !== false}
                      width={surface.contentWidth ? surface.contentWidth - 34 : undefined}
                      suggestions={suggestions}
                      onPick={runSearch}
                    />
                  ) : (
                    render(b.values, onLive(b.id))
                  )}
                </div>
                  )
                })
                })()
              )}
            </div>
          </div>
        </div>

        {/* inspector */}
        {!showInspector ? (
          <button
            className="pg__rail"
            onClick={() => setShowInspector(true)}
            aria-label="Show inspector"
          >
            ‹ Edit
          </button>
        ) : (
        <aside className="panel pg__inspector">
          <div className="pg__panel-head">
            <span />
            <button
              className="pg__collapse"
              onClick={() => setShowInspector(false)}
              aria-label="Hide inspector"
            >
              ›
            </button>
          </div>
          {!current || !currentDef ? (
            <p className="notes" style={{ paddingLeft: 0 }}>
              Select a block to edit its variants.
            </p>
          ) : (
            <>
              <h3>{currentDef.name}</h3>
              <Fields
                props={currentDef.props}
                values={current.values}
                onSet={(n, v) => setValue(current.id, n, v)}
              />

              {current.slug === 'content' && (
                <>
                  <h3 style={{ marginTop: 18 }}>Image Tiles</h3>
                  <div className="field">
                    <label className="field__label" htmlFor="pg-tile-target">edit</label>
                    <select
                      id="pg-tile-target"
                      value={tileSel === null ? '' : String(tileSel)}
                      onChange={(e) =>
                        setTileSel(e.target.value === '' ? null : e.target.value === 'all' ? 'all' : Number(e.target.value))
                      }
                    >
                      <option value="">— none —</option>
                      <option value="all">All tiles</option>
                      {Array.from({
                        length: tileCount(current.values.layout as 'Waterfall' | 'Dense'),
                      }).map((_, i) => (
                        <option key={i} value={i}>Tile #{i + 1}</option>
                      ))}
                    </select>
                  </div>
                  {tileSel !== null && (
                    <Fields
                      idPrefix="pgt-"
                      props={tileDef().props}
                      values={
                        (tileSel === 'all' ? current.tileAll : current.tileOne?.[tileSel]) ??
                        defaults(tileDef().props)
                      }
                      onSet={(n, v) => setTileValue(current.id, tileSel, n, v)}
                    />
                  )}
                </>
              )}

              <button
                className="panel__reset"
                onClick={() =>
                  setBlocks((v) =>
                    v.map((b) =>
                      b.id === current.id
                        ? { ...b, values: defaults(currentDef.props), live: {}, tileAll: undefined, tileOne: undefined }
                        : b,
                    ),
                  )
                }
              >
                Reset to defaults
              </button>
            </>
          )}
        </aside>
        )}
      </div>

      <div className="section">
        <div className="code-toolbar">
          <div className="section__title" style={{ marginBottom: 0 }}>Copy page</div>
          <div className="code-tabs" aria-label="Page output format">
            <button
              className={codeFormat === 'jsx' ? 'code-tab code-tab--active' : 'code-tab'}
              onClick={() => setCodeFormat('jsx')}
              type="button"
            >
              MM JSX
            </button>
            <button
              className={codeFormat === 'sdl' ? 'code-tab code-tab--active' : 'code-tab'}
              onClick={() => setCodeFormat('sdl')}
              type="button"
            >
              Mosaic SDL
            </button>
          </div>
        </div>
        {codeFormat === 'jsx' && (
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              margin: '0 0 8px',
              fontSize: 13,
              opacity: items.length ? 1 : 0.45,
              cursor: items.length ? 'pointer' : 'not-allowed',
            }}
          >
            <input
              type="checkbox"
              checked={copyWithData && items.length > 0}
              disabled={items.length === 0}
              onChange={(e) => setCopyWithData(e.target.checked)}
            />
            Include live data ({items.length} images) — uncheck to use the Figma default artwork and wire your own source
          </label>
        )}
        <div className="code">
          <pre>{code}</pre>
          <button className="code__copy" onClick={copy}>
            {copied ? 'Copied ✓' : 'Copy code'}
          </button>
        </div>
        {codeFormat === 'sdl' && (
          <div className="sdl-report">
            <div className="sdl-report__summary">
              <span
                className={
                  mosaicOutput.validation.valid
                    ? 'sdl-status sdl-status--valid'
                    : 'sdl-status sdl-status--error'
                }
              >
                {mosaicOutput.validation.valid
                  ? `✓ Catalog valid · ${mosaicOutput.validation.nodeCount} nodes`
                  : `✕ ${mosaicOutput.validation.issues.length} validation errors`}
              </span>
              <span className="sdl-report__catalog">
                Mosaic full · CLI {mosaicCatalogSnapshot.mosaicCliVersion} ·{' '}
                {mosaicCatalogSnapshot.componentCount} components
              </span>
            </div>
            {mosaicOutput.validation.issues.length > 0 && (
              <ul className="sdl-report__errors">
                {mosaicOutput.validation.issues.map((issue) => (
                  <li key={`${issue.path}-${issue.message}`}>
                    <code>{issue.path}</code> — {issue.message}
                  </li>
                ))}
              </ul>
            )}
            {mosaicOutput.warnings.length > 0 && (
              <>
                <div className="sdl-report__label">Portable fallback / gaps</div>
                <ul className="sdl-report__warnings">
                  {mosaicOutput.warnings.map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}

        {/* Round-trip snapshot. Separate from Copy code on purpose: that one
            targets a product repo, this one targets this canvas. */}
        <div className="export-row">
          <button className="btn" onClick={copyState}>
            {stateCopied ? 'Copied ✓' : 'Copy full state'}
          </button>
          <button className="btn" onClick={loadState}>
            Load state
          </button>
          <span className={'export-row__note' + (loadErr ? ' export-row__note--err' : '')}>
            {loadErr ?? 'Full snapshot JSON — paste it back into Load state to restore this canvas exactly.'}
          </span>
        </div>

        {/* Standalone HTML. The third and most portable export: no component
            library, no repo, no this-site. Opens in any browser. */}
        <div className="export-row">
          <button className="btn" onClick={saveHtml}>
            Export HTML
          </button>
          <span className="export-row__note">
            A single .html file — inline styles, no component library required. Send it to a PM or drop it in a deck.
          </span>
        </div>
      </div>

      {/* Assemble with AI. The contract, not a chat window — see data/aiPrompt.ts
          for why an embedded assistant is the wrong shape for this deployment. */}
      <div className="section">
        <div className="section__title">Assemble with AI</div>
        <p style={{ fontSize: 13, lineHeight: '20px', margin: '0 0 10px', maxWidth: '68ch' }}>
          Copy the prompt below into your own Copilot or Claude, describe the page you want in
          plain language (&ldquo;an IRP with related searches on top and two rows of dense
          grid&rdquo;), then paste the JSON it returns into <strong>Load state</strong> above —
          the canvas builds itself. The prompt is generated live from the component registry,
          so it can never drift from the real schema.
        </p>
        <div className="export-row" style={{ marginTop: 0 }}>
          <button className="btn btn--primary" onClick={copyPrompt}>
            {promptCopied ? 'Copied ✓' : 'Copy AI prompt'}
          </button>
          <span className="export-row__note">
            {components.length} components · {SURFACES.length} surfaces · includes few-shot examples
          </span>
        </div>
      </div>
    </main>
  )
}

/** Same field set as the Workbench panel, driven by an external value bag. */
function Fields({
  props,
  values,
  onSet,
  idPrefix = 'pg-',
}: {
  props: PropDef[]
  values: Values
  onSet: (name: string, value: string | boolean) => void
  idPrefix?: string
}) {
  // Props declaring `under` are sub-options of a parent slot — they render
  // indented beneath it and disappear when the parent is switched off, so the
  // panel reads as the nesting the Figma variant panel implies.
  const kids = (parent: string) => props.filter((p) => p.under === parent)
  const top = props.filter((p) => !p.under)

  const field = (p: PropDef) => {
    if (p.kind === 'select')
      return (
        <div className="field" key={p.name}>
          <label className="field__label" htmlFor={`${idPrefix}${p.name}`}>{p.name}</label>
          <select
            id={`${idPrefix}${p.name}`}
            value={String(values[p.name])}
            onChange={(e) => onSet(p.name, e.target.value)}
          >
            {p.values.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
      )
    if (p.kind === 'text')
      return (
        <div className="field" key={p.name}>
          <label className="field__label" htmlFor={`${idPrefix}${p.name}`}>{p.name}</label>
          <input
            id={`${idPrefix}${p.name}`}
            type="text"
            value={String(values[p.name] ?? '')}
            onChange={(e) => onSet(p.name, e.target.value)}
          />
        </div>
      )
    return (
      <div className="field--bool" key={p.name}>
        <input
          id={`${idPrefix}${p.name}`}
          type="checkbox"
          checked={Boolean(values[p.name])}
          onChange={(e) => onSet(p.name, e.target.checked)}
        />
        <label htmlFor={`${idPrefix}${p.name}`}>{p.name}</label>
      </div>
    )
  }

  /** A slot plus its sub-options, the children hidden while the slot is off. */
  const group = (p: PropDef) => {
    const sub = kids(p.name)
    if (!sub.length) return field(p)
    return (
      <div key={p.name}>
        {field(p)}
        {Boolean(values[p.name]) && (
          <div className="field__sub">{sub.map(field)}</div>
        )}
      </div>
    )
  }

  return (
    <>
      {top.filter((p) => p.kind === 'select').map(group)}

      {top.some((p) => p.kind === 'text') && <h3 style={{ marginTop: 18 }}>Content</h3>}
      {top.filter((p) => p.kind === 'text').map(group)}

      {top.some((p) => p.kind === 'boolean') && <h3 style={{ marginTop: 18 }}>Slots</h3>}
      {top.filter((p) => p.kind === 'boolean').map(group)}
    </>
  )
}
