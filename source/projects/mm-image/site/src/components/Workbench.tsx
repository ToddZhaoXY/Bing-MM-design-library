import { useMemo, useState } from 'react'
import type { ComponentDef, PropDef } from '../data/components'
import type { MosaicGenerator } from '../mosaic/types'
import { mosaicCatalogSnapshot } from '../mosaic/validate'

export type Values = Record<string, string | boolean>

export function defaults(props: PropDef[]): Values {
  const v: Values = {}
  for (const p of props) v[p.name] = p.default
  return v
}

/** Props a live component reports back so the Copy-me block stays in sync. */
export type LiveProps = Record<string, unknown>
export type { MosaicGenerator } from '../mosaic/types'

export function literal(v: LiveProps[string]) {
  if (typeof v === 'string') return `"${v}"`
  if (Array.isArray(v)) return `{${JSON.stringify(v)}}`
  if (typeof v === 'object' && v !== null) return `{${JSON.stringify(v)}}`
  return `{${String(v)}}`
}

/**
 * Emits MM semantic JSX.
 *
 * Every set prop is emitted, including ones that equal the Figma default.
 * Eliding defaults read tidier but was wrong: a host surface or organism can
 * pass its own baseline, and the user's value is what overrides it. Dropping a
 * prop because it matched the registry default meant the copied code silently
 * failed to reproduce the canvas. Same fix as the tile layer.
 */
export function jsxProps(def: ComponentDef, values: Values, live: LiveProps) {
  const parts: string[] = []
  for (const p of def.props) {
    const val = values[p.name]
    if (val === undefined) continue
    if (p.kind === 'boolean') parts.push(val ? p.name : `${p.name}={false}`)
    else if (p.kind === 'select' && p.numeric) parts.push(`${p.name}={${val}}`)
    else parts.push(`${p.name}="${val}"`)
  }
  for (const [k, v] of Object.entries(live)) parts.push(`${k}=${literal(v)}`)
  return parts
}

/** Emits MM semantic JSX. Props whose value equals the Figma default are omitted. */
function toJSX(def: ComponentDef, values: Values, tag: string, live: LiveProps) {
  const parts = jsxProps(def, values, live)
  if (!parts.length) return `<${tag} />`
  return `<${tag}\n  ${parts.join('\n  ')}\n/>`
}

export function Workbench({
  def,
  tag,
  render,
  mosaic,
}: {
  def: ComponentDef
  tag: string
  render: (values: Values, onLive: (p: LiveProps) => void) => React.ReactNode
  mosaic?: MosaicGenerator
}) {
  const [values, setValues] = useState<Values>(() => defaults(def.props))
  const [live, setLive] = useState<LiveProps>({})
  const [copied, setCopied] = useState(false)
  const [format, setFormat] = useState<'jsx' | 'sdl'>('jsx')

  const jsx = useMemo(() => toJSX(def, values, tag, live), [def, values, tag, live])
  const mosaicOutput = useMemo(() => mosaic?.(values, live), [live, mosaic, values])
  const code =
    format === 'sdl' && mosaicOutput ? JSON.stringify(mosaicOutput.node, null, 2) : jsx
  const validationErrors =
    mosaicOutput?.validation.issues.filter((issue) => issue.severity === 'error') ?? []

  const set = (name: string, value: string | boolean) =>
    setValues((v) => ({ ...v, [name]: value }))

  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  return (
    <>
      <div className="workbench">
        <div className="preview">{render(values, setLive)}</div>

        <div className="panel">
          <h3>Properties</h3>
          {def.props
            .filter((p): p is Extract<PropDef, { kind: 'select' }> => p.kind === 'select')
            .map((p) => (
              <div className="field" key={p.name}>
                <label className="field__label" htmlFor={`f-${p.name}`}>
                  {p.name}
                </label>
                <select
                  id={`f-${p.name}`}
                  value={String(values[p.name])}
                  onChange={(e) => set(p.name, e.target.value)}
                >
                  {p.values.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            ))}

          {def.props.some((p) => p.kind === 'text') && (
            <h3 style={{ marginTop: 18 }}>Content</h3>
          )}
          {def.props
            .filter((p): p is Extract<PropDef, { kind: 'text' }> => p.kind === 'text')
            .map((p) => (
              <div className="field" key={p.name}>
                <label className="field__label" htmlFor={`f-${p.name}`}>
                  {p.name}
                </label>
                <input
                  id={`f-${p.name}`}
                  type="text"
                  value={String(values[p.name] ?? '')}
                  onChange={(e) => set(p.name, e.target.value)}
                />
              </div>
            ))}

          {def.props.some((p) => p.kind === 'boolean') && (
            <h3 style={{ marginTop: 18 }}>Slots</h3>
          )}
          {def.props
            .filter((p) => p.kind === 'boolean')
            .map((p) => (
              <div className="field--bool" key={p.name}>
                <input
                  id={`f-${p.name}`}
                  type="checkbox"
                  checked={Boolean(values[p.name])}
                  onChange={(e) => set(p.name, e.target.checked)}
                />
                <label htmlFor={`f-${p.name}`}>{p.name}</label>
              </div>
            ))}

          <button className="panel__reset" onClick={() => setValues(defaults(def.props))}>
            Reset to defaults
          </button>
        </div>
      </div>

      <div className="section">
        <div className="code-toolbar">
          <div className="section__title" style={{ marginBottom: 0 }}>
            Copy me
          </div>
          {mosaic && (
            <div className="code-tabs" aria-label="Code output format">
              <button
                className={format === 'jsx' ? 'code-tab code-tab--active' : 'code-tab'}
                onClick={() => setFormat('jsx')}
                type="button"
              >
                MM JSX
              </button>
              <button
                className={format === 'sdl' ? 'code-tab code-tab--active' : 'code-tab'}
                onClick={() => setFormat('sdl')}
                type="button"
              >
                Mosaic SDL
              </button>
            </div>
          )}
        </div>
        <div className="code">
          <pre>{code}</pre>
          <button className="code__copy" onClick={copy}>
            {copied ? 'Copied ✓' : 'Copy code'}
          </button>
        </div>
        {format === 'sdl' && mosaicOutput && (
          <div className="sdl-report">
            <div className="sdl-report__summary">
              <span className={mosaicOutput.validation.valid ? 'sdl-status sdl-status--valid' : 'sdl-status sdl-status--error'}>
                {mosaicOutput.validation.valid
                  ? `✓ Catalog valid · ${mosaicOutput.validation.nodeCount} nodes`
                  : `✕ ${validationErrors.length} validation error${validationErrors.length === 1 ? '' : 's'}`}
              </span>
              <span className="sdl-report__catalog">
                Mosaic full · CLI {mosaicCatalogSnapshot.mosaicCliVersion} · {mosaicCatalogSnapshot.componentCount} components
              </span>
            </div>

            {validationErrors.length > 0 && (
              <ul className="sdl-report__errors">
                {validationErrors.map((issue) => (
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
      </div>
    </>
  )
}
