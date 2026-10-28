import { Link } from 'react-router-dom'
import { byTier, components } from '../data/components'
import { mosaicCoverage } from '../mosaic/generators'
import { mosaicCatalogSnapshot } from '../mosaic/validate'

export function Home() {
  const statuses = ['available', 'partial', 'candidate', 'gap', 'product-only'] as const

  return (
    <main className="main" id="main-content">
      <div className="page-header">
        <h2>AIGC ACF component library</h2>
        <div className="meta">
          <span className="chip">v0.1 · AIGC library</span>
          <a className="chip chip--node" href="https://www.figma.com/design/8voz5X3e3lPITEt9q5bbUe/AIGC-ACF" target="_blank" rel="noreferrer">Figma 8voz5X3e3lPITEt9q5bbUe ↗</a>
          <span className="chip">{components.length} components</span>
        </div>
      </div>
      {components.length === 0 && <section className="section">
        <h3 className="section__title">Awaiting Figma source extraction</h3>
        <div className="callout">
          The React workbench and Mosaic infrastructure are prepared. The AIGC components have
          not been converted yet: source layers, variants and images must be extracted from
          the selected Figma pages first. No previews or design properties have been invented.
        </div>
      </section>}
      <section className="section">
        <h3 className="section__title">What this is</h3>
        <p className="overview">
          The AIGC ACF library in the same format as MM_ACF: a typed component registry,
          live React previews, variant controls, copyable JSX and catalog-validated Mosaic SDL.
          Use the <Link className="text-link" to="/playground">Playground</Link> to assemble components and export a page.
        </p>
      </section>
      <section className="section">
        <h3 className="section__title">Source scope</h3>
        <p className="overview">
          This library follows the selected AIGC Figma pages: three molecule pages, eight cell
          pages, SERP · AIGC Answer, and the shared Components page. Other Figma pages are excluded.
          Component pages link to their source nodes and document their properties and mappings.
        </p>
      </section>
      <section className="section">
        <h3 className="section__title">Component index</h3>
        <div className="overview-index">
          {(['Molecule', 'Cell', 'Organism'] as const).map((tier) => (
            <div key={tier}>
              <h4>{tier}s</h4>
              <ul>{byTier(tier).map((component) => (
                <li key={component.slug}><Link className="text-link" to={`/c/${component.slug}`}>{component.name}</Link></li>
              ))}</ul>
            </div>
          ))}
        </div>
      </section>
      <section className="section">
        <h3 className="section__title">Mosaic SDL coverage</h3>
        <div className="meta" style={{ marginBottom: 12 }}>
          {statuses.map((status) => {
            const count = mosaicCoverage.filter((item) => item.status === status).length
            return count > 0 ? <span key={status} className={`chip chip--sdl chip--sdl-${status}`}>{count} {status}</span> : null
          })}
        </div>
        <p className="overview">
          SDL uses the Mosaic catalog snapshot inherited from MM_ACF: CLI {mosaicCatalogSnapshot.mosaicCliVersion},
          {' '}{mosaicCatalogSnapshot.componentCount} components. Each export includes local catalog validation
          and explicit notes for behavior that requires application integration.
        </p>
      </section>
      <section className="section">
        <h3 className="section__title">How it is organised</h3>
        <p className="overview">
          Molecules compose into cells; cells compose the SERP answer. Properties come from the
          registry, and the same values drive the preview and code output. A component’s bin remains
          TBD wherever source evidence does not establish an ACF or product ownership assignment.
        </p>
      </section>
    </main>
  )
}
