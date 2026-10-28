import { Link } from 'react-router-dom'
import { byTier, components } from '../data/components'
import source from '../data/source-catalog.json'
import { mosaicCoverage } from '../mosaic/generators'
import { mosaicCatalogSnapshot } from '../mosaic/validate'

export function Home() {
  const statuses = ['available', 'partial', 'candidate', 'gap', 'product-only'] as const
  return <main className="main" id="main-content">
    <div className="page-header">
      <h2>Video ACF component library</h2>
      <div className="meta">
        <span className="chip">MM Video design system</span>
        <span className="chip">{components.length} registry entries</span>
        <span className="chip">{source.pages.length} scoped Figma pages</span>
        <a className="chip chip--node" href="https://www.figma.com/design/fRSRroY4YFgJSeqLLE0Y38/MM-ACF" target="_blank" rel="noreferrer">Source Figma ↗</a>
      </div>
    </div>
    <section className="section">
      <h3 className="section__title">Video, from component to page</h3>
      <p className="overview">Explore the MM Video design system through live React previews, property controls and copyable JSX. Assemble components in the Playground and export the same values as a page, a reusable JSON state or catalog-validated Mosaic SDL.</p>
      <div className="home-actions">
        <Link className="btn btn--primary" to="/playground">Open Playground</Link>
        <Link className="btn" to="/foundations">Video-specific rules</Link>
        <Link className="btn" to="/source-catalog">Explore source catalog</Link>
      </div>
    </section>
    <section className="section">
      <h3 className="section__title">Component index</h3>
      <div className="overview-index">
        {(['Molecule', 'Cell', 'Organism'] as const).map(tier => <div key={tier}>
          <h4>{tier}s</h4>
          <ul>{byTier(tier).map(component => <li key={component.slug}><Link className="text-link" to={`/c/${component.slug}`}>{component.name}</Link></li>)}</ul>
          {byTier(tier).length === 0 && <p className="source-note">No entries yet.</p>}
        </div>)}
      </div>
    </section>
    <section className="section">
      <h3 className="section__title">Source scope</h3>
      <p className="overview">The selected source pages cover video foundations, short cards, metadata, magazine cards, content groups and SERP / VRP compositions. Each component documents its source node, supported properties and implementation notes.</p>
      <div className="callout" style={{ marginTop: 16 }}>Two source gaps are documented: the long-video Go-wide page is empty, and VRP links to a separate WIP cover. Their entries retain the source status and references.</div>
      <p className="source-note">The <Link className="text-link" to="/source-catalog">source catalog</Link> lists the selected pages and their extracted content. Pages outside that scope are excluded.</p>
    </section>
    <section className="section">
      <h3 className="section__title">Mosaic SDL coverage</h3>
      <div className="meta" style={{ marginBottom: 12 }}>{statuses.map(status => {
        const count = mosaicCoverage.filter(item => item.status === status).length
        return count ? <span key={status} className={`chip chip--sdl chip--sdl-${status}`}>{count} {status}</span> : null
      })}</div>
      <p className="overview">SDL uses the Mosaic catalog snapshot inherited from MM_ACF: CLI {mosaicCatalogSnapshot.mosaicCliVersion}, {mosaicCatalogSnapshot.componentCount} published component types. Exports include local catalog validation and document rendering or interaction gaps.</p>
      <p className="source-note">Catalog validation checks the exported structure. It does not verify the output in a live Mosaic renderer.</p>
    </section>
    <section className="section">
      <h3 className="section__title">The same component architecture</h3>
      <p className="overview">Typed molecules compose into cells and page organisms. The registry drives the sidebar, preview controls, copied JSX and page-state validation. The site follows the MM_ACF and AIGC library workflow, including fit-to-width previews and portable HTML snapshots.</p>
    </section>
  </main>
}
