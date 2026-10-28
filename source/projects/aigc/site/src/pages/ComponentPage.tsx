import { Link, useParams } from 'react-router-dom'
import { bySlug, propertyCombinations } from '../data/components'
import { Workbench } from '../components/Workbench'
import { RENDERERS, TAGS } from '../components/renderers'
import { mosaicAdapter } from '../mosaic/generators'

// Preserve MM_ACF's import location for page assemblers.
export { RENDERERS, TAGS } from '../components/renderers'

export function ComponentPage() {
  const { slug = '' } = useParams()
  const def = bySlug(slug)
  if (!def) return <main className="main" id="main-content"><h2>Component not found</h2><Link className="text-link" to="/">Return to introduction</Link></main>

  const render = RENDERERS[slug]
  const mosaic = mosaicAdapter(slug)
  const combos = propertyCombinations(def.props)
  const figmaUrl = `https://www.figma.com/design/8voz5X3e3lPITEt9q5bbUe/AIGC-ACF?node-id=${encodeURIComponent(def.nodeId.replace(':', '-'))}`

  return (
    <main className="main" id="main-content">
      <div className="page-header">
        <h2>{def.name}</h2>
        <div className="meta">
          <span className="chip chip--tier">{def.tier.toUpperCase()}</span>
          <span className={'chip' + (def.bin !== 'TBD' ? ' chip--bin-known' : '')}>bin: {def.bin}</span>
          <a className="chip chip--node" href={figmaUrl} target="_blank" rel="noreferrer" title="Open source node in Figma">{def.nodeId} ↗</a>
          <span className="chip">{combos} property combinations</span>
          {mosaic && <span className={`chip chip--sdl chip--sdl-${mosaic.status}`}>SDL: {mosaic.status}</span>}
        </div>
      </div>
      <section className="section">
        <h3 className="section__title">Overview</h3>
        <p className="overview">{def.overview}</p>
        {!def.verified && <p className="source-note">Documentation summary: not a verbatim quote from a Figma documentation frame.</p>}
      </section>
      <section className="section">
        <h3 className="section__title">Playground</h3>
        {render ? <Workbench key={slug} def={def} tag={TAGS[slug] ?? def.name.replace(/\s/g, '')} render={render} mosaic={mosaic?.generate} />
          : <div className="callout">A React preview is not available for this entry.</div>}
      </section>
      <section className="section">
        <h3 className="section__title">Properties</h3>
        <div className="table-scroll">
          <table className="props">
            <thead><tr><th scope="col">Prop</th><th scope="col">Type</th><th scope="col">Values</th><th scope="col">Default</th></tr></thead>
            <tbody>{def.props.map((prop) => (
              <tr key={prop.name}>
                <td><code>{prop.name}</code></td>
                <td>{prop.kind}</td>
                <td>{prop.kind === 'select' ? prop.values.join(' · ') : prop.kind === 'text' ? 'free text' : 'true · false'}</td>
                <td><code>{String(prop.default)}</code></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>
      {mosaic && <section className="section">
        <h3 className="section__title">Mosaic SDL mapping</h3>
        <p className="overview"><strong>{mosaic.identity}</strong></p>
        <p className="source-note">Published components: {mosaic.componentTypes.join(' · ')}</p>
        <ul className="notes">{mosaic.notes.map((note) => <li key={note}>{note}</li>)}</ul>
      </section>}
      {def.notes && def.notes.length > 0 && <section className="section">
        <h3 className="section__title">Notes</h3>
        <ul className="notes">{def.notes.map((note) => <li key={note}>{note}</li>)}</ul>
      </section>}
    </main>
  )
}
