import foundationsJson from '../data/foundations.json'

interface FoundationSection {
  id: string
  title: string
  nodeId?: string
  body?: string
  items?: string[]
  tokens?: { name: string; value: string; note?: string }[]
}
interface FoundationData {
  title?: string
  sourceNodeId?: string
  summary?: string
  sections: FoundationSection[]
}
const foundations = foundationsJson as FoundationData
const sourceUrl = (nodeId: string) => `https://www.figma.com/design/fRSRroY4YFgJSeqLLE0Y38/MM-ACF?node-id=${encodeURIComponent(nodeId.replace(':', '-'))}`

export function Foundations() {
  return <main className="main" id="main-content">
    <div className="page-header">
      <h2>{foundations.title ?? 'Video-specific rules'}</h2>
      <div className="meta"><span className="chip">Foundations</span>{foundations.sourceNodeId && <a className="chip chip--node" href={sourceUrl(foundations.sourceNodeId)} target="_blank" rel="noreferrer">{foundations.sourceNodeId} ↗</a>}</div>
    </div>
    {foundations.summary && <p className="overview">{foundations.summary}</p>}
    {foundations.sections.length === 0 && <div className="callout">The source foundations have not been documented yet.</div>}
    {foundations.sections.length > 1 && <nav className="foundation-index" aria-label="Foundation sections">{foundations.sections.map(section => <button type="button" key={section.id} onClick={() => document.getElementById(`foundation-${section.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>{section.title}</button>)}</nav>}
    {foundations.sections.map(section => <section className="section foundation-section" id={`foundation-${section.id}`} key={section.id}>
      <h3>{section.title}</h3>
      {section.nodeId && <a className="text-link source-note" href={sourceUrl(section.nodeId)} target="_blank" rel="noreferrer">Source {section.nodeId} ↗</a>}
      {section.body && <p className="overview" style={{ whiteSpace: 'pre-line', marginTop: 12 }}>{section.body}</p>}
      {section.items && section.items.length > 0 && <ul className="foundation-rules">{section.items.map((item, index) => <li key={index}>{item}</li>)}</ul>}
      {section.tokens && section.tokens.length > 0 && <div className="table-scroll" style={{ marginTop: 16 }}><table className="props">
        <thead><tr><th scope="col">Token / rule</th><th scope="col">Value</th><th scope="col">Note</th></tr></thead>
        <tbody>{section.tokens.map((token, index) => <tr key={index}><td>{token.name}</td><td><code>{token.value}</code></td><td>{token.note ?? '—'}</td></tr>)}</tbody>
      </table></div>}
    </section>)}
  </main>
}
