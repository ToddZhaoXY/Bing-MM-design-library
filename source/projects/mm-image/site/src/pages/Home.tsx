import { components } from '../data/components'
import { mosaicCoverage } from '../mosaic/generators'
import { mosaicCatalogSnapshot } from '../mosaic/validate'

export function Home() {
  const available = mosaicCoverage.filter((item) => item.status === 'available').length
  const partial = mosaicCoverage.filter((item) => item.status === 'partial').length
  const candidate = mosaicCoverage.filter((item) => item.status === 'candidate').length

  return (
    <main className="main">
      <div className="page-header">
        <h2>MMACF component library</h2>
        <div className="meta">
          <span className="chip">v0.2 · full library</span>
          <span className="chip chip--node">figma fRSRroY4YFgJSeqLLE0Y38</span>
          <span className="chip">{components.length} components</span>
        </div>
      </div>

      <section className="section">
        <div className="section__title">What this is</div>
        <p className="overview">
          The Multimedia ACF library, on the web. Every component is documented at its real
          tier, carries live variant switching, and emits copyable MM JSX plus catalog-validated
          Mosaic SDL — so Vibe Coding starts from the real API instead of a screenshot.
        </p>
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
