import { components } from '../data/overview-data'
import overviewSummary from '../data/overview-summary.json'
import { Link } from 'react-router-dom'
const { mosaicCoverage, mosaicCatalogSnapshot } = overviewSummary
const { imageCardSummaries: imageCardGroups, imageCardsFigmaUrl } = overviewSummary
const IMAGE_CARDS_SLUG = 'image-cards'

export function Home() {
  const available = mosaicCoverage.filter((item) => item.status === 'available').length
  const partial = mosaicCoverage.filter((item) => item.status === 'partial').length
  const candidate = mosaicCoverage.filter((item) => item.status === 'candidate').length

  return (
    <main className="main">
      <div className="page-header">
        <h2>Image component library</h2>
        <div className="meta">
          <span className="chip">v0.3 · Image ACF Cards</span>
          <a className="chip chip--node" href={imageCardsFigmaUrl} target="_blank" rel="noreferrer">FY25 source ↗</a>
          <span className="chip">{components.length} components</span>
        </div>
      </div>

      <section className="section">
        <div className="section__title">What this is</div>
        <p className="overview">
          The Image component library, on the web. Every component is documented at its real
          tier, carries live variant switching, and emits copyable MM JSX plus catalog-validated
          Mosaic SDL — so Vibe Coding starts from the real API instead of a screenshot.
        </p>
      </section>

      <section className="section">
        <div className="section__title">Image ACF Cards · {imageCardGroups.length} sizes · {imageCardGroups.reduce((count, group) => count + group.variantCount, 0)} configurations</div>
        <p className="overview" style={{ marginBottom: 16 }}>Explore the FY25 desktop cards by footprint. Switch between image collages, related searches and scrolling layouts within each size.</p>
        <div className="table-scroll"><table className="props"><thead><tr><th>Size</th><th>Source dimensions</th><th>Configurations</th></tr></thead><tbody>
          {imageCardGroups.map(group => <tr key={group.size}>
            <td><Link className="text-link" to={`/c/${IMAGE_CARDS_SLUG}?size=${group.size}`}>{group.size} →</Link></td>
            <td>{group.width} × {group.height} px</td><td>{group.variantCount}</td>
          </tr>)}
        </tbody></table></div>
      </section>

      <section className="section">
        <div className="section__title">How it's organised</div>
        <p className="overview">
          By <strong>level</strong>, never by surface. Atoms are ACF tokens — referenced, never
          rebuilt. Molecules compose from tokens. Cells compose molecules. Organisms are whole
          surfaces. SERP and IRP are <em>variants within a level</em>, not separate trees.
        </p>
      </section>

      <section className="section">
        <div className="section__title">Reading the bins</div>
        <div className="callout">
          A <code>bin</code> chip says where a piece comes from — MM-built, ACF-direct, Hybrid.
          Bin assignment is a design call, not something a tool can derive. Anything still
          showing <strong>TBD</strong> is genuinely undecided, not missing data.
        </div>
      </section>

      <section className="section">
        <div className="section__title">Mosaic SDL coverage</div>
        <div className="meta" style={{ marginBottom: 12 }}>
          <span className="chip chip--sdl chip--sdl-available">{available} available</span>
          <span className="chip chip--sdl chip--sdl-partial">{partial} partial</span>
          <span className="chip chip--sdl chip--sdl-candidate">{candidate} candidate</span>
        </div>
        <p className="overview">
          Every MM component has an SDL adapter validated against Mosaic full catalog CLI{' '}
          {mosaicCatalogSnapshot.mosaicCliVersion} ({mosaicCatalogSnapshot.componentCount}{' '}
          components). Partial and candidate labels are deliberate: unsupported image behavior is
          reported as a gap rather than hidden in invented renderer props.
        </p>
      </section>

      <section className="section">
        <div className="section__title">Current scope</div>
        <ul className="notes">
          <li>All molecules, cells, and SERP / IRP organism previews.</li>
          <li>Live variant controls with MM JSX and Mosaic SDL copy paths.</li>
          <li>SERP / IRP / Blank page assembly with per-tile editing and whole-page SDL export.</li>
          <li>Explicit portable fallbacks and a gap report for SDL governance follow-up.</li>
        </ul>
      </section>
    </main>
  )
}
