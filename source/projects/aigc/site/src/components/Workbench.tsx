import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { ComponentDef, PropDef } from '../data/components'
import type { MosaicGenerator } from '../mosaic/types'
import { mosaicCatalogSnapshot } from '../mosaic/validate'

export type Values = Record<string, string | boolean>
export type LiveProps = Record<string, unknown>
export type { MosaicGenerator } from '../mosaic/types'

export function defaults(props: PropDef[]): Values {
  return Object.fromEntries(props.map((prop) => [prop.name, prop.default]))
}

/** JSX expression syntax preserves quotes, braces, newlines and backslashes. */
export function literal(value: unknown): string {
  if (value === undefined) return '{undefined}'
  const serialized = JSON.stringify(value)
  return `{${serialized === undefined ? 'undefined' : serialized}}`
}

export function jsxProps(def: ComponentDef, values: Values, live: LiveProps): string[] {
  const props = new Map<string, unknown>()
  for (const prop of def.props) {
    const value = values[prop.name]
    if (value === undefined) continue
    props.set(prop.name, prop.kind === 'select' && prop.numeric ? Number(value) : value)
  }
  // Live interaction is the latest value; emit each property exactly once.
  for (const [name, value] of Object.entries(live)) props.set(name, value)
  return [...props].map(([name, value]) => value === true ? name : `${name}=${literal(value)}`)
}

export function toJSX(def: ComponentDef, values: Values, tag: string, live: LiveProps = {}): string {
  const parts = jsxProps(def, values, live)
  return parts.length ? `<${tag}\n  ${parts.join('\n  ')}\n/>` : `<${tag} />`
}

function PreviewFrame({ children }: { children: ReactNode }) {
  const viewport = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState(true)
  const [dimensions, setDimensions] = useState({ available: 0, width: 0, height: 0 })
  useEffect(() => {
    if (!viewport.current || !content.current) return
    const measure = () => setDimensions(current => {
      const next = { available: Math.max(1, viewport.current!.clientWidth - 48), width: content.current!.offsetWidth, height: content.current!.offsetHeight }
      return current.available === next.available && current.width === next.width && current.height === next.height ? current : next
    })
    const observer = new ResizeObserver(measure)
    observer.observe(viewport.current); observer.observe(content.current); measure()
    return () => observer.disconnect()
  }, [])
  const scale = fit && dimensions.width ? Math.min(1, dimensions.available / dimensions.width) : 1
  return <div style={{ minWidth: 0 }}>
    <div className="preview-toolbar">
      <span>{dimensions.width ? `${dimensions.width} × ${dimensions.height} px · ${Math.round(scale * 100)}%` : 'Source-size preview'}</span>
      <div><button type="button" aria-pressed={fit} onClick={() => setFit(true)}>Fit</button><button type="button" aria-pressed={!fit} onClick={() => setFit(false)}>100%</button></div>
    </div>
    <div className="preview" ref={viewport} style={{ display: 'block', padding: 24, minHeight: 300 }}>
      <div style={{ width: dimensions.width ? dimensions.width * scale : undefined, height: dimensions.height ? dimensions.height * scale : undefined, margin: '0 auto', position: 'relative' }}>
        <div ref={content} style={{ width: 'max-content', display: 'flow-root', transform: scale === 1 ? undefined : `scale(${scale})`, transformOrigin: 'top left' }}>{children}</div>
      </div>
    </div>
  </div>
}

export function Workbench({ def, tag, render, mosaic }: {
  def: ComponentDef
  tag: string
  render: (values: Values, onLive: (props: LiveProps) => void) => ReactNode
  mosaic?: MosaicGenerator
}) {
  const fieldPrefix = useId()
  const [values, setValues] = useState<Values>(() => defaults(def.props))
  const [live, setLive] = useState<LiveProps>({})
  const [revision, setRevision] = useState(0)
  const [copyStatus, setCopyStatus] = useState('')
  const [format, setFormat] = useState<'jsx' | 'sdl'>('jsx')
  const jsx = useMemo(() => toJSX(def, values, tag, live), [def, values, tag, live])
  const mosaicOutput = useMemo(() => mosaic?.(values, live), [live, mosaic, values])
  const code = format === 'sdl' && mosaicOutput ? JSON.stringify(mosaicOutput.node, null, 2) : jsx
  const validationErrors = mosaicOutput?.validation.issues.filter((issue) => issue.severity === 'error') ?? []
  const displayed: Values = { ...values }
  for (const [name, value] of Object.entries(live)) {
    if (typeof value === 'string' || typeof value === 'boolean') displayed[name] = value
    else if (typeof value === 'number' && Number.isFinite(value)) displayed[name] = String(value)
  }
  const reportLive = useCallback((next: LiveProps) => setLive(current => ({ ...current, ...next })), [])

  function set(name: string, value: string | boolean) {
    setValues((current) => ({ ...current, [name]: value }))
    setLive((current) => {
      const next = { ...current }
      delete next[name]
      return next
    })
    setCopyStatus('')
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopyStatus('Copied ✓')
    } catch {
      setCopyStatus('Copy unavailable. Select and copy the code below.')
    }
  }

  return <>
    <div className="workbench">
      <PreviewFrame key={revision}>{render(displayed, reportLive)}</PreviewFrame>
      <div className="panel">
        <h3>Properties</h3>
        {def.props.map((prop) => {
          const id = `${fieldPrefix}-${prop.name}`
          const disabled = Boolean(prop.under && displayed[prop.under] === false)
          if (prop.kind === 'boolean') return <div className="field--bool" key={prop.name}>
            <input id={id} type="checkbox" disabled={disabled} checked={Boolean(displayed[prop.name])} onChange={(event) => set(prop.name, event.target.checked)} />
            <label htmlFor={id}>{prop.name}</label>
          </div>
          return <div className="field" key={prop.name}>
            <label className="field__label" htmlFor={id}>{prop.name}</label>
            {prop.kind === 'select'
              ? <select id={id} value={String(displayed[prop.name])} disabled={disabled} onChange={(event) => set(prop.name, event.target.value)}>
                  {prop.values.map((value) => <option key={value} value={value}>{value}</option>)}
                </select>
              : <input id={id} type="text" disabled={disabled} value={String(displayed[prop.name] ?? '')} onChange={(event) => set(prop.name, event.target.value)} />}
          </div>
        })}
        <button className="panel__reset" type="button" onClick={() => {
          setValues(defaults(def.props)); setLive({}); setRevision((value) => value + 1); setCopyStatus('')
        }}>Reset to defaults</button>
      </div>
    </div>
    <div className="section">
      <div className="code-toolbar">
        <h3 className="section__title" style={{ marginBottom: 0 }}>Copy me</h3>
        {mosaic && <div className="code-tabs" aria-label="Code output format">
          <button className={'code-tab' + (format === 'jsx' ? ' code-tab--active' : '')} aria-pressed={format === 'jsx'} type="button" onClick={() => { setFormat('jsx'); setCopyStatus('') }}>AIGC JSX</button>
          <button className={'code-tab' + (format === 'sdl' ? ' code-tab--active' : '')} aria-pressed={format === 'sdl'} type="button" onClick={() => { setFormat('sdl'); setCopyStatus('') }}>Mosaic SDL</button>
        </div>}
      </div>
      <div className="code">
        <pre tabIndex={0}><code>{code}</code></pre>
        <button className="code__copy" type="button" onClick={copy}>{copyStatus === 'Copied ✓' ? copyStatus : 'Copy code'}</button>
      </div>
      <p className="copy-status" role="status">{copyStatus}</p>
      {format === 'sdl' && mosaicOutput && <div className="sdl-report">
        <div className="sdl-report__summary">
          <span className={'sdl-status ' + (mosaicOutput.validation.valid ? 'sdl-status--valid' : 'sdl-status--error')}>
            {mosaicOutput.validation.valid ? `✓ Catalog valid · ${mosaicOutput.validation.nodeCount} nodes` : `✕ ${validationErrors.length} validation errors`}
          </span>
          <span className="sdl-report__catalog">Mosaic full · CLI {mosaicCatalogSnapshot.mosaicCliVersion} · {mosaicCatalogSnapshot.componentCount} components</span>
        </div>
        {validationErrors.length > 0 && <ul className="sdl-report__errors">{validationErrors.map((issue) => <li key={`${issue.path}-${issue.message}`}><code>{issue.path}</code> — {issue.message}</li>)}</ul>}
        {mosaicOutput.warnings.length > 0 && <><div className="sdl-report__label">Portable fallback / gaps</div><ul className="sdl-report__warnings">{mosaicOutput.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul></>}
      </div>}
    </div>
  </>
}
