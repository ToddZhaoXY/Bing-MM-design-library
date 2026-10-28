import { Link } from 'react-router-dom'
import sourceJson from '../data/source-catalog.json'
import { bySlug } from '../data/components'

interface SourceWarning { stage: string; nodeId?: string; message: string }
interface SourceConfiguration {
  id: string
  name: string
  width: number
  height: number
  properties: Record<string, string>
}
interface SourceFamily {
  id: string
  name: string
  type: 'COMPONENT_SET' | 'COMPONENT'
  width: number
  height: number
  axes: Record<string, { values: string[] }>
  configurations: SourceConfiguration[]
}
interface SourceData {
  fileKey: string
  runId: string
  extractedAt: string
  pageCount: number
  nodeCount: number
  imageCount: number
  warnings: SourceWarning[]
  families: SourceFamily[]
}
const source = sourceJson as SourceData

// Compact provenance snapshot from design/inventory.json, same run as source-catalog.json.
// Do not import the complete raw node inventory into the browser bundle.
const SOURCE_PAGES = [
  { slug: 'main-image-area', name: 'Main image area', id: '395:18350', nodeCount: 373 },
  { slug: 'image-display-list', name: 'Image display list', id: '461:31677', nodeCount: 90 },
  { slug: 'history-panel-images', name: 'History panel images', id: '461:30766', nodeCount: 226 },
  { slug: 'main-content-area', name: 'Main content area', id: '395:18354', nodeCount: 727 },
  { slug: 'history-panel', name: 'History panel', id: '395:18353', nodeCount: 175 },
  { slug: 'sign-in-prompts', name: 'Sign-in prompts', id: '436:69152', nodeCount: 368 },
  { slug: 'error-states', name: 'Error states', id: '461:31252', nodeCount: 214 },
  { slug: 'action-bar', name: 'Action bar', id: '395:18355', nodeCount: 111 },
  { slug: 'creation-composer', name: 'Creation composer', id: '436:69594', nodeCount: 1311 },
  { slug: 'style-menu', name: 'Style menu', id: '436:70039', nodeCount: 220 },
  { slug: 'serp-carousel', name: 'SERP Carousel', id: '598:39652', nodeCount: 1464 },
  { slug: 'serp-aigc-answer', name: 'SERP · AIGC Answer', id: '395:18356', nodeCount: 4624 },
  { slug: 'components', name: 'Components', id: '437:83582', nodeCount: 4034 },
] as const

const FAMILY_DESTINATIONS: Record<string, { slug: string; helper?: boolean; note?: string }> = {
  '437:83684': { slug: 'prompt-template-card', helper: true, note: '88 × 116 template/original card' },
  '437:83677': { slug: 'checkmark-circle', helper: true, note: 'Selection icon used by image thumbnails' },
  '437:83587': { slug: 'action-bar' },
  '437:83640': { slug: 'history-panel-images' },
  '461:31862': { slug: 'main-image-area' },
  '464:32760': { slug: 'main-image-footer', helper: true, note: 'Prompt footer' },
  '470:34234': { slug: 'display-image', helper: true, note: 'Individual selected/unselected thumbnail' },
  '470:34378': { slug: 'image-display-list' },
  '470:34592': { slug: 'main-content-area' },
  '508:30661': { slug: 'history-panel' },
  '508:31112': { slug: 'sign-in-prompts' },
  '508:31674': { slug: 'error-states' },
  '542:32054': { slug: 'creation-composer' },
  '542:32853': { slug: 'style-menu' },
  '598:38176': { slug: 'serp-template-card', helper: true, note: '200 × 200 carousel template card' },
  '598:39314': { slug: 'serp-carousel' },
}

function figmaUrl(nodeId: string) {
  return 'https://www.figma.com/design/' + source.fileKey + '/AIGC-ACF?node-id=' + encodeURIComponent(nodeId.replace(/:/g, '-'))
}
function SourceLink({ id, label }: { id: string; label?: string }) {
  return <a className="text-link" href={figmaUrl(id)} target="_blank" rel="noreferrer">{label ?? id} ↗</a>
}
function ParentLink({ slug }: { slug: string }) {
  return <Link className="text-link" to={'/c/' + slug}>{bySlug(slug)?.name ?? slug}</Link>
}
function dimensions(width: number, height: number) {
  const rounded = (value: number) => Number(value.toFixed(3))
  return <span title={'Exact source values: ' + width + ' × ' + height}>{rounded(width)} × {rounded(height)}</span>
}
function expectedVariantQuery(warning: SourceWarning) {
  return warning.stage === 'property componentPropertyDefinitions'
    && warning.message.includes('Can only get component property definitions of a component set or non-variant component')
}

const expectedWarnings = source.warnings.filter(expectedVariantQuery)
const sourceErrors = source.warnings.filter(warning => !expectedVariantQuery(warning))
const sourceErrorGroups = [...new Set(sourceErrors.map(warning => warning.message))].map(message => ({
  message, warnings: sourceErrors.filter(warning => warning.message === message),
}))

export function SourceCatalog() {
  const variantCount = source.families.reduce((sum, family) => sum + family.configurations.length, 0)
  const standaloneCount = source.families.filter(family => family.type === 'COMPONENT').length
  return <main className="main" id="main-content">
    <div className="page-header">
      <h2>Figma source catalog</h2>
      <div className="meta">
        <span className="chip">{source.pageCount} scoped pages</span>
        <span className="chip">{source.nodeCount.toLocaleString()} source nodes</span>
        <span className="chip">{source.families.length} source families</span>
        <span className="chip">{source.imageCount} original images</span>
      </div>
    </div>
    <section className="section">
      <h3 className="section__title">Source and coverage</h3>
      <p className="overview">
        The 13 requested pages were collected through the read-only Figma Plugin API. The shared Components
        page contains {variantCount} variant components and {standaloneCount} standalone components grouped
        into {source.families.length} source families. The library exposes 12 main component pages and five nested-component workbenches.
      </p>
      <p className="source-note">
        Each source family links to its editable React workbench, copied JSX and Mosaic SDL mapping.
        Product authentication and generation services remain host integration points.
      </p>
      <div style={{ display: 'grid', gap: 6, fontSize: 13, overflowWrap: 'anywhere' }}>
        <span>Export run: <code>{source.runId}</code></span>
        <span>Extraction completed: <time dateTime={source.extractedAt}>{source.extractedAt}</time></span>
        <span>Figma file: <a className="text-link" href={'https://www.figma.com/design/' + source.fileKey + '/AIGC-ACF'} target="_blank" rel="noreferrer">{source.fileKey} ↗</a></span>
      </div>
      <p className="source-note">The collector stores the expected file key; an independent Plugin API file-key verification flag was not recorded in this export.</p>
    </section>

    <section className="section" aria-labelledby="source-pages-heading">
      <h3 className="section__title" id="source-pages-heading">Requested pages</h3>
      <div className="table-scroll"><table className="props">
        <thead><tr><th scope="col">Source page</th><th scope="col">Figma page ID</th><th scope="col">Collected nodes</th><th scope="col">Library destination</th></tr></thead>
        <tbody>{SOURCE_PAGES.map(page => <tr key={page.id}>
          <td>{page.name}</td><td><SourceLink id={page.id} /></td><td>{page.nodeCount.toLocaleString()}</td>
          <td>{page.slug === 'components' ? <span>Shared source families, listed below</span> : <ParentLink slug={page.slug} />}</td>
        </tr>)}</tbody>
      </table></div>
      <p className="source-note">All 13 requested pages are present. Pages outside the screenshot scope were not collected.</p>
    </section>

    <section className="section" aria-labelledby="source-families-heading">
      <h3 className="section__title" id="source-families-heading">Source component families</h3>
      <p className="source-note">Names and variant strings below are retained exactly. Dimensions display up to three decimal places; hover a dimension for the full source precision. Component-set bounds describe the Figma set canvas, not a rendered variant.</p>
      <div style={{ display: 'grid', gap: 16 }}>
        {source.families.map(family => {
          const destination = FAMILY_DESTINATIONS[family.id]
          const axes = Object.entries(family.axes)
          return <section key={family.id} style={{ border: '1px solid var(--border, #e5e5e5)', borderRadius: 8, padding: 20, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 10 }}>
              <h4 style={{ fontSize: 16, margin: 0 }}>{family.name}</h4>
              <SourceLink id={family.id} />
              {destination?.helper && <span className="chip">Nested component</span>}
            </div>
            <p style={{ margin: '10px 0', fontSize: 13 }}>
              {family.type === 'COMPONENT_SET' ? 'Set canvas' : 'Source component'}: {dimensions(family.width, family.height)} px.
              {' '}{family.configurations.length > 0 ? family.configurations.length + ' collected variants.' : 'No variant set.'}
            </p>
            {destination && <p style={{ margin: '8px 0', fontSize: 13 }}>
              Workbench: <ParentLink slug={destination.slug} />
              {destination.note && <> · {destination.note}</>}
            </p>}
            {axes.length > 0 && <dl style={{ display: 'grid', gap: 6, margin: '14px 0', fontSize: 13 }}>
              {axes.map(([name, axis]) => <div key={name} style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <dt style={{ fontWeight: 600 }}>{name}</dt><dd style={{ margin: 0 }}>{axis.values.map(value => JSON.stringify(value)).join(' · ')}</dd>
              </div>)}
            </dl>}
            {family.type === 'COMPONENT_SET' && axes.length === 0 && <p className="source-note">
              Typed variant axes were not returned because this source set has existing errors. The child names
              remain available; no missing type definitions are inferred from those names.
            </p>}
            {family.configurations.length > 0 && <details style={{ marginTop: 12 }}>
              <summary style={{ cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Inspect {family.configurations.length} source variants</summary>
              <div className="table-scroll" style={{ marginTop: 12 }}><table className="props">
                <thead><tr><th scope="col">Exact source variant name</th><th scope="col">Dimensions (px)</th><th scope="col">Typed properties</th><th scope="col">Source node</th></tr></thead>
                <tbody>{family.configurations.map(configuration => <tr key={configuration.id}>
                  <td><code style={{ whiteSpace: 'pre-wrap' }}>{configuration.name}</code></td>
                  <td>{dimensions(configuration.width, configuration.height)}</td>
                  <td>{Object.keys(configuration.properties).length > 0
                    ? <code style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{JSON.stringify(configuration.properties)}</code>
                    : <span>Not returned</span>}</td>
                  <td><SourceLink id={configuration.id} /></td>
                </tr>)}</tbody>
              </table></div>
            </details>}
          </section>
        })}
      </div>
    </section>

    <section className="section" aria-labelledby="source-warnings-heading">
      <h3 className="section__title" id="source-warnings-heading">Source extraction notes</h3>
      <p className="overview">{source.warnings.length} recorded warnings fall into two distinct groups.</p>
      <details style={{ margin: '16px 0' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600 }}>{expectedWarnings.length} expected variant-child property queries</summary>
        <p className="source-note">The exporter queried componentPropertyDefinitions on variant children. Figma permits that property on a component set or a non-variant component, so these calls were rejected as expected. This does not mean those variant nodes or their images were omitted.</p>
        <p className="source-note">Where the parent set returned definitions, its actual axes are shown above. No unavailable child definitions are filled in.</p>
      </details>
      <details open style={{ margin: '16px 0' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600 }}>{sourceErrors.length} Action row source errors requiring attention</summary>
        <p className="source-note">The Action row component set reports existing Figma errors. Its axes and some instance property maps are unavailable. Four named variant children, their dimensions, rendered content and source references were retained.</p>
        <p className="source-note">Repair the source set in Figma before treating its variant names as a verified typed schema. The library can show the retained source configurations while documenting that limitation.</p>
        {sourceErrorGroups.map(group => <div key={group.message} style={{ margin: '16px 0' }}>
          <p style={{ margin: '0 0 8px', fontSize: 13 }}><code>{group.message}</code> · {group.warnings.length} occurrences</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px' }}>
            {group.warnings.map((warning, index) => <span key={warning.stage + warning.nodeId + index} style={{ fontSize: 13 }}>
              {warning.nodeId ? <SourceLink id={warning.nodeId} /> : 'No node ID'}
            </span>)}
          </div>
        </div>)}
      </details>
    </section>
  </main>
}
