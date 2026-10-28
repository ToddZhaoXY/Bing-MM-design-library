import { useParams } from 'react-router-dom'
import { bySlug } from '../data/components'
import { Workbench } from '../components/Workbench'
import type { LiveProps } from '../components/Workbench'
import { ImageContainer } from '../components/ImageContainer'
import { mosaicAdapter } from '../mosaic/generators'
import { RSPill } from '../components/RSPill'
import type { RSPillProps } from '../components/RSPill'
import { Content } from '../components/Content'
import { Filter } from '../components/Filter'
import type { FilterPart } from '../components/Filter'
import { Header, Footer } from '../components/Sections'
import { SerpImageAnswer, IrpWholePage } from '../components/Organisms'
import type { TitleStyle, EndProps, ClickAction, FeedbackState } from '../components/Sections'
import {
  Badge, MetaData, Source, ImageActionCluster, ImageOverflowFlyout, RSInline, RSCard,
  ImageCluster, RSOnTop,
} from '../components/Molecules'
import type {
  BadgeVariant, MetaLines, ActionType, Surface, RSLength, RSState,
} from '../components/Molecules'

/** slug → live preview renderer. One entry per implemented component. */
export const RENDERERS: Record<
  string,
  (v: Record<string, string | boolean>, onLive: (p: LiveProps) => void) => React.ReactNode
> = {
  'image-tile': (v) => (
    <ImageContainer
      layout={v.layout as 'Waterfall' | 'Dense'}
      orientation={v.orientation as 'Landscape' | 'Portrait'}
      multiImage={Number(v.multiImage) as 1 | 3 | 4}
      borderRadius={Number(v.borderRadius) as 24 | 16 | 8}
      showMetadata={v.showMetadata !== false}
      imageBadge={v.imageBadge !== false}
      showOverlay={v.showOverlay === true}
      collectionButton={v.collectionButton === true}
      moreImageIcon={v.moreImageIcon === true}
      showHover={v.showHover === true}
      hoverActions={v.hoverActions !== false}
      dimensionLabel={v.dimensionLabel !== false}
      flyoutType={v.flyoutType as ActionType}
      flyoutSurface={v.flyoutSurface as Surface}
      title={(v.title as string) ?? undefined}
      source={(v.source as string) ?? undefined}
    />
  ),
  badge: (v) => <Badge property1={v.property1 as BadgeVariant} />,
  'meta-data': (v) => (
    <MetaData
      lines={v.lines as MetaLines}
      showSource={Boolean(v.showSource)}
      title={(v.title as string) ?? undefined}
      source={(v.source as string) ?? undefined}
    />
  ),
  source: (v) => (
    <Source state={v.state as 'Default' | 'Hover'} name={(v.name as string) ?? undefined} />
  ),
  'image-action-cluster': (v) => (
    <ImageActionCluster type={v.type as ActionType} surface={v.surface as Surface} />
  ),
  'image-overflow-flyout': (v) => (
    <ImageOverflowFlyout type={v.type as ActionType} surface={v.surface as Surface} />
  ),
  'rs-inline': (v) => <RSInline label={v.label as 'Top suggestion' | 'People also'} />,
  'rs-card': (v) => <RSCard length={v.length as RSLength} state={v.state as RSState} />,
  'image-cluster': (v) => <ImageCluster heading={(v.heading as string) || undefined} />,
  'rs-on-top': (v) => (
    <div style={{ overflowX: 'auto', maxWidth: '100%', padding: '0 24px' }}>
      <RSOnTop
        label={(v.label as string) || undefined}
        showGradient={v.showGradient !== false}
        showScrollButton={v.showScrollButton !== false}
      />
    </div>
  ),
  'rs-pill': (v) => (
    <RSPill
      state={v.state as RSPillProps['state']}
      thumbnail={Boolean(v.thumbnail)}
      label={(v.label as string) || 'Requery Title'}
    />
  ),
  content: (v) => (
    <Content layout={v.layout as 'Waterfall' | 'Dense'} gap={v.gap === undefined ? 16 : Number(v.gap)} />
  ),
  filter: (v, onLive) => <Filter part={(v.part as FilterPart) ?? 'Interactive'} onLive={onLive} />,
  header: (v, onLive) => (
    <Header
      title={(v.title as string) ?? 'Image of Living Room'}
      subtitle={(v.subtitle as string) ?? undefined}
      style={v.style as TitleStyle}
      showSubTitle={v.showSubTitle !== false}
      showChevron={v.showChevron !== false}
      endProps={v.endProps === true}
      endPropsType={v.endPropsType as EndProps}
      onLive={onLive}
    />
  ),
  footer: (v, onLive) => (
    <Footer
      clickAction={v.clickAction as ClickAction}
      block={v.block === true}
      footnote={v.footnote !== false}
      footnoteText={(v.footnoteText as string) ?? undefined}
      footnoteLink={v.footnoteLink !== false}
      linkText={(v.linkText as string) ?? undefined}
      feedback={v.feedback !== false}
      feedbackState={v.feedbackState as FeedbackState}
      showGradient={v.showGradient === true}
      onLive={onLive}
    />
  ),
  'serp-image-answer': (v) => (
    // 1440 page frame is wider than the playground — scroll rather than scale,
    // so every measurement on screen is the real Figma pixel value.
    <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
      <SerpImageAnswer
        title={(v.title as string) ?? undefined}
        pageShell={v.pageShell !== false}
      />
    </div>
  ),
  'irp-whole-page': (v) => (
    <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
      <IrpWholePage
        pageShell={v.pageShell !== false}
        filterRow={v.filterRow !== false}
      />
    </div>
  ),
}

export const TAGS: Record<string, string> = {
  'image-tile': 'ImageContainer',
  badge: 'Badge',
  'meta-data': 'MetaData',
  source: 'Source',
  'image-action-cluster': 'ImageActionCluster',
  'image-overflow-flyout': 'ImageOverflowFlyout',
  'rs-inline': 'RSInline',
  'rs-card': 'RSCard',
  'image-cluster': 'ImageCluster',
  'rs-on-top': 'RSOnTop',
  'rs-pill': 'RSPill',
  content: 'Content',
  filter: 'Filter',
  header: 'Header',
  footer: 'Footer',
  'serp-image-answer': 'SerpImageAnswer',
  'irp-whole-page': 'IrpWholePage',
}

export function ComponentPage() {
  const { slug = '' } = useParams()
  const def = bySlug(slug)

  if (!def) return <div className="main">Not found.</div>

  const render = RENDERERS[slug]
  const mosaic = mosaicAdapter(slug)
  const combos = def.props
    .filter((p) => p.kind === 'select')
    .reduce((n, p) => n * (p.kind === 'select' ? p.values.length : 1), 1)

  return (
    <main className="main">
      <div className="page-header">
        <h2>{def.name}</h2>
        <div className="meta">
          <span className="chip chip--tier">{def.tier.toUpperCase()}</span>
          <span className={'chip' + (def.bin !== 'TBD' ? ' chip--bin-known' : '')}>
            bin: {def.bin}
          </span>
          <span className="chip chip--node">{def.nodeId}</span>
          <span className="chip">{combos} variants</span>
          {mosaic && (
            <span className={`chip chip--sdl chip--sdl-${mosaic.status}`}>
              SDL: {mosaic.status}
            </span>
          )}
        </div>
      </div>

      <section className="section">
        <div className="section__title">Overview</div>
        <p className="overview">{def.overview}</p>
        {!def.verified && (
          <p className="notes" style={{ paddingLeft: 0, marginTop: 10 }}>
            ⚠️ This overview is drafted, not quoted from a Figma doc frame. Eko to confirm.
          </p>
        )}
      </section>

      <section className="section">
        <div className="section__title">Playground</div>
        {render ? (
          <Workbench
            key={slug}
            def={def}
            tag={TAGS[slug] ?? def.name.replace(/\s/g, '')}
            render={render}
            mosaic={mosaic?.generate}
          />
        ) : (
          <div className="callout">No preview implemented yet for this component.</div>
        )}
      </section>

      <section className="section">
        <div className="section__title">Properties</div>
        <table className="props">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Values</th>
              <th>Default</th>
            </tr>
          </thead>
          <tbody>
            {def.props.map((p) => (
              <tr key={p.name}>
                <td>
                  <code>{p.name}</code>
                </td>
                <td>{p.kind}</td>
                <td>
                  {p.kind === 'select'
                    ? p.values.join(' · ')
                    : p.kind === 'text'
                      ? 'free text'
                      : 'true · false'}
                </td>
                <td>
                  <code>{String(p.default)}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {mosaic && (
        <section className="section">
          <div className="section__title">Mosaic SDL mapping</div>
          <p className="overview">
            <strong>{mosaic.identity}</strong>
          </p>
          <p className="notes" style={{ paddingLeft: 0 }}>
            Published components: {mosaic.componentTypes.join(' · ')}
          </p>
          <ul className="notes">
            {mosaic.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>
      )}

      {def.notes && def.notes.length > 0 && (
        <section className="section">
          <div className="section__title">Notes</div>
          <ul className="notes">
            {def.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
