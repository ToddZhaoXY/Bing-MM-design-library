import { Link } from 'react-router-dom'
import sourceJson from '../data/source-catalog.json'
import { bySlug, components } from '../data/components'

interface SourcePage { id: string; name: string; slug?: string; nodeCount?: number; status?: string; notes?: string[] }
interface SourceConfiguration { id: string; name: string; width?: number; height?: number; properties?: Record<string, string> }
interface SourceFamily { id: string; name: string; type?: string; slug?: string; width?: number; height?: number; axes?: Record<string, { values: string[] }>; configurations?: SourceConfiguration[] }
interface SourceData {
  fileKey: string
  extractedAt?: string
  runId?: string
  pages: SourcePage[]
  families?: SourceFamily[]
  warnings?: { stage?: string; nodeId?: string; message: string }[]
}
const source = sourceJson as SourceData
const families = source.families ?? []
const warnings = source.warnings ?? []
function SourceLink({ id }: { id: string }) {
  return <a className="text-link" href={`https://www.figma.com/design/${source.fileKey}/MM-ACF?node-id=${encodeURIComponent(id.replace(':', '-'))}`} target="_blank" rel="noreferrer">{id} ↗</a>
}
function Destination({ slug }: { slug?: string }) {
  const component = slug && bySlug(slug)
  if (component) return <Link className="text-link" to={`/c/${component.slug}`}>{component.name}</Link>
  if (slug === 'foundations') return <Link className="text-link" to="/foundations">Video-specific rules</Link>
  return <span>Source reference</span>
}
function Dimensions({ width, height }: { width?: number; height?: number }) {
  return width === undefined || height === undefined ? <>—</> : <span title={`${width} × ${height}`}>{Number(width.toFixed(3))} × {Number(height.toFixed(3))}</span>
}

export function SourceCatalog() {
  const nodeCountsComplete = source.pages.every(page => page.nodeCount !== undefined)
  return <main className="main" id="main-content">
    <div className="page-header">
      <h2>Figma source catalog</h2>
      <div className="meta">
        <span className="chip">{source.pages.length} scoped pages</span>
        {families.length > 0 && <span className="chip">{families.length} source families</span>}
        <span className="chip">{components.length} registry entries</span>
        {nodeCountsComplete && <span className="chip">{source.pages.reduce((sum, page) => sum + (page.nodeCount ?? 0), 0).toLocaleString()} source nodes</span>}
      </div>
    </div>
    <p className="overview">The requested Video pages define this library’s scope. Source links and variant names preserve the connection between each Figma design and its React workbench.</p>
    <div className="source-provenance">
      <span>File: <a className="text-link" href={`https://www.figma.com/design/${source.fileKey}/MM-ACF`} target="_blank" rel="noreferrer">{source.fileKey} ↗</a></span>
      {source.runId && <span>Export run: <code>{source.runId}</code></span>}
      {source.extractedAt && <span>Extracted: <time dateTime={source.extractedAt}>{source.extractedAt}</time></span>}
    </div>
    <section className="section">
      <h3 className="section__title">Selected pages</h3>
      <div className="table-scroll"><table className="props source-table">
        <thead><tr><th scope="col">Source page</th><th scope="col">Figma ID</th><th scope="col">Nodes</th><th scope="col">Library destination</th></tr></thead>
        <tbody>{source.pages.map(page => <tr key={page.id}>
          <td>{page.name}{page.status && <div className="source-note">{page.status}</div>}{page.notes?.map((note, index) => <p className="source-note" key={index}>{note}</p>)}</td>
          <td><SourceLink id={page.id} /></td><td>{page.nodeCount?.toLocaleString() ?? '—'}</td><td><Destination slug={page.slug} /></td>
        </tr>)}</tbody>
      </table></div>
    </section>
    {families.length > 0 && <section className="section">
      <h3 className="section__title">Source component families</h3>
      <p className="source-note">Source names and variant strings are retained. Set-canvas dimensions describe the Figma component set, not an individual rendered variant.</p>
      <div className="source-families">{families.map(family => <section className="source-family" key={family.id}>
        <div className="source-family__heading"><h4>{family.name}</h4><SourceLink id={family.id} /></div>
        <p className="source-note">{family.type === 'COMPONENT_SET' ? 'Set canvas' : 'Source component'}: <Dimensions width={family.width} height={family.height} /> px · <Destination slug={family.slug} /></p>
        {Object.entries(family.axes ?? {}).length > 0 && <dl className="source-axes">{Object.entries(family.axes ?? {}).map(([name, axis]) => <div key={name}><dt>{name}</dt><dd>{axis.values.map(value => JSON.stringify(value)).join(' · ')}</dd></div>)}</dl>}
        {Boolean(family.configurations?.length) && <details className="source-configurations"><summary>Inspect {family.configurations!.length} source variants</summary>
          <div className="table-scroll"><table className="props source-table"><thead><tr><th scope="col">Exact source name</th><th scope="col">Size (px)</th><th scope="col">Properties</th><th scope="col">Source</th></tr></thead>
            <tbody>{family.configurations!.map(configuration => <tr key={configuration.id}><td><code>{configuration.name}</code></td><td><Dimensions width={configuration.width} height={configuration.height} /></td><td><code>{Object.keys(configuration.properties ?? {}).length ? JSON.stringify(configuration.properties) : '—'}</code></td><td><SourceLink id={configuration.id} /></td></tr>)}</tbody>
          </table></div>
        </details>}
      </section>)}</div>
    </section>}
    {warnings.length > 0 && <section className="section"><h3 className="section__title">Extraction notes</h3><details className="source-configurations"><summary>{warnings.length} recorded source notes</summary><ul className="notes">{warnings.map((warning, index) => <li key={index}>{warning.stage && <strong>{warning.stage}: </strong>}{warning.message}{warning.nodeId && <> · <SourceLink id={warning.nodeId} /></>}</li>)}</ul></details></section>}
  </main>
}
