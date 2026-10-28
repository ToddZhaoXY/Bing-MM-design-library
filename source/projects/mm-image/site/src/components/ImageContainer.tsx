/**
 * Image Tile — 1:1 rebuild from Figma (MM-ACF, component set 150:5408).
 *
 * Structure was read off four real variants via get_design_context,
 * not transcribed by eye:
 *   150:5496  Waterfall / Landscape / multiImage=3 / r24
 *   150:5513  Waterfall / Landscape / multiImage=4 / r24
 *   150:5449  Waterfall / Portrait  / multiImage=1 / r24
 *   169:2     Dense     / Landscape / multiImage=1 / r24
 *
 * Images and icons are the real Figma exports under public/figma/, not CSS stand-ins.
 * Figma emits React+Tailwind; this project uses inline styles (Tailwind NOT installed).
 */

import * as React from 'react'
import { Ico, ImageOverflowFlyout } from './Molecules'
import type { ActionType, Surface, MetaLines } from './Molecules'

const IMG = {
  landscape: 'figma/img/photo-landscape.png',
  portrait: 'figma/img/photo-portrait.png',
  square: 'figma/img/photo-square.png',
  favicon16: 'figma/img/favicon-16.png',
  favicon12: 'figma/img/favicon-12.png',
}

/* Icon specs read off Figma. src is relative to public/figma/icon/; inset is the
   Shape node's offset inside its fixed icon box. <Ico> reproduces Figma's two-level
   box/inset DOM — never render these exports as a bare <img> at the box size, the
   exports carry preserveAspectRatio="none" and would stretch. */
const ICON = {
  collectionsAdd: { src: 'collections-add.svg', size: 20, inset: '0%' },   // 150:5507 — full-bleed 20px box
  moreImage: { src: 'more-image.svg', size: 16, inset: '12.5%' },          // 150:5526
  searchVisual: { src: 'search-visual.svg', size: 16, inset: '12.5%' },    // 362:994
  moreHorizontal: { src: 'more-horizontal.svg', size: 16, inset: '42.19% 17.19%' },
}

export interface ImageContainerProps {
  layout?: 'Waterfall' | 'Dense'
  orientation?: 'Landscape' | 'Portrait'
  multiImage?: 1 | 3 | 4
  borderRadius?: 24 | 16 | 8
  showMetadata?: boolean
  /**
   * Metadata sub-slot: render the favicon + source line under the title.
   * The hover variant always shows it (that's its Figma spec); this only
   * governs the resting metadata block.
   */
  metaSource?: boolean
  /** Metadata sub-slot: how many lines the title block occupies. */
  metaLines?: MetaLines
  imageBadge?: boolean
  showOverlay?: boolean
  collectionButton?: boolean
  moreImageIcon?: boolean
  showHover?: boolean
  /** Hover-only slots. Both default on; only render while showHover is on. */
  hoverActions?: boolean
  dimensionLabel?: boolean
  /** Which flyout the「...」button opens. */
  flyoutType?: ActionType
  flyoutSurface?: Surface
  title?: string
  source?: string
  /**
   * Live content. When absent the tile renders the Figma exports, so the
   * default (offline) state is byte-identical to the 1:1 rebuild.
   */
  imageSrc?: string
  faviconSrc?: string
  /**
   * Geometry overrides. The Figma variants carry fixed sizes (200/258/190 wide,
   * 172/247 tall) but a grid host — Content's 6-column waterfall / dense rows —
   * places the same tile at its own column width and per-tile height. These let
   * the host drive that without forking the component.
   */
  width?: number
  unitHeight?: number
}

const FONT = "Roboto, 'Segoe UI', system-ui, sans-serif"

const fillImg: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  maxWidth: 'none',
  objectFit: 'cover',
  pointerEvents: 'none',
}

/* Duration/Time badge — Fluent Badge size=12 + Clock icon (I150:5516;899:31705) */
function DurationBadge() {
  return (
    <div style={{ position: 'absolute', left: 12, top: 12, display: 'flex', alignItems: 'flex-start', zIndex: 2 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          height: 20,
          padding: '2px 4px',
          borderRadius: 8,
          background: '#000',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', height: 13 }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <circle cx="6" cy="6" r="4.6" stroke="#fff" strokeWidth="1" />
            <path d="M6 3.3V6.1L7.9 7.3" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p
          style={{
            margin: 0,
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 11,
            lineHeight: '13px',
            color: '#fff',
            whiteSpace: 'nowrap',
          }}
        >
          1 day ago
        </p>
      </div>
    </div>
  )
}

/* Collection button — position differs per variant, read off Figma */
function CollectionButton({ pos }: { pos: React.CSSProperties }) {
  return (
    <div
      style={{
        position: 'absolute',
        ...pos,
        zIndex: 2,
        width: 28,
        height: 28,
        borderRadius: 100,
        background: '#fff',
        opacity: 0.75,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ico {...ICON.collectionsAdd} />
    </div>
  )
}

/* more-image pill (150:5526) */
function MoreImageIcon() {
  return (
    <div
      style={{
        position: 'absolute',
        right: 12,
        bottom: 12,
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        padding: 4,
        borderRadius: 9999,
        background: 'rgba(0,0,0,0.8)',
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.17)',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20 }}>
        <Ico {...ICON.moreImage} />
      </span>
    </div>
  )
}

/* Gradient overlay: dimension + Footnote Source (150:5527) */
function Overlay() {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 4,
        padding: 20,
        boxSizing: 'border-box',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000 43%)',
      }}
    >
      <p
        style={{
          margin: 0,
          width: '100%',
          fontFamily: FONT,
          fontWeight: 400,
          fontSize: 14,
          lineHeight: '22px',
          color: '#fff',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        200x144
      </p>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 4 }}>
        <span style={{ display: 'flex', alignItems: 'center', width: 16, height: 16, flex: '0 0 auto' }}>
          <img src={IMG.favicon16} alt="" style={{ width: 16, height: 16, borderRadius: 4, objectFit: 'cover' }} />
        </span>
        <p
          style={{
            margin: 0,
            flex: '1 0 0',
            minWidth: 0,
            fontFamily: FONT,
            fontWeight: 400,
            fontSize: 11,
            lineHeight: '13px',
            color: '#fff',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          lorem.com
        </p>
      </div>
    </div>
  )
}

/* hover: dimension label (366:594) */
function DimensionLabel() {
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 2, padding: '6px 12px', overflow: 'hidden', boxSizing: 'border-box' }}>
      <p style={{ margin: 0, width: '100%', fontFamily: FONT, fontWeight: 400, fontSize: 13, color: '#fff' }}>2560 × 1440</p>
    </div>
  )
}

/* hover: action cluster (362:994) — dominant SearchVisual + MoreHorizontal */
function HoverActionCluster({
  flyoutType = 'Web',
  flyoutSurface = 'IRP',
}: { flyoutType?: ActionType; flyoutSurface?: Surface }) {
  const [open, setOpen] = React.useState(false)
  const btn: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
    minWidth: 28,
    padding: '0 4px',
    borderRadius: 9999,
    background: '#000',
    // inside stroke — a CSS border would widen the 28×28 circle to 30×28
    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
    boxSizing: 'border-box',
    border: 'none',
    cursor: 'pointer',
  }
  return (
    <div
      style={{
        position: 'absolute',
        right: 8,
        top: 8,
        zIndex: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 8,
      }}
    >
      <span style={btn}>
        <Ico {...ICON.searchVisual} />
      </span>
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          aria-label="More"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          style={btn}
        >
          <Ico {...ICON.moreHorizontal} />
        </button>
        {open && (
          // opens beside the button, to its left — the tile's right edge is the page edge
          <div style={{ position: 'absolute', top: 0, right: 'calc(100% + 8px)', zIndex: 4 }}>
            <ImageOverflowFlyout type={flyoutType} surface={flyoutSurface} />
          </div>
        )}
      </div>
    </div>
  )
}

/* Meta data (150:5530) and its hover variant (356:584) */
function MetaBlock({
  topPad,
  withSource,
  lines = '1 line title + source',
  title = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  source = 'Pixels.com',
  faviconSrc,
}: {
  topPad: number
  withSource: boolean
  lines?: MetaLines
  title?: string
  source?: string
  faviconSrc?: string
}) {
  const twoLine = lines !== '1 line title + source'
  // '2 lines title' is the title-only variant — it drops the source row even
  // when the source slot is on. Same rule as the MetaData molecule.
  const showSource = withSource && lines !== '2 lines title'
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 4,
        width: '100%',
        padding: `${topPad}px 8px 8px`,
        boxSizing: 'border-box',
      }}
    >
      <p
        style={{
          margin: 0,
          width: '100%',
          fontFamily: FONT,
          fontWeight: 400,
          fontSize: 14,
          lineHeight: '22px',
          color: '#000',
          // Figma's title is a single clipped line. Without nowrap the ellipsis
          // never engages, and at grid-driven column widths (186.67 vs Figma's
          // standalone 258) the title wrapped to 3 lines and pushed dense tiles
          // to 242 — past the 204 row.
          // The 2-line variants opt into wrapping, clamped at exactly 2 so the
          // tile height stays bounded.
          ...(twoLine
            ? {
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical' as const,
                WebkitLineClamp: 2,
                whiteSpace: 'normal' as const,
                overflow: 'hidden',
              }
            : {
                whiteSpace: 'nowrap' as const,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }),
        }}
      >
        {title}
      </p>
      {showSource && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              width: 12,
              height: 12,
              borderRadius: 4,
              // Figma inside stroke — inset shadow, not a CSS border.
              boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              boxSizing: 'border-box',
            }}
          >
            <img src={faviconSrc || IMG.favicon12} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </span>
          <p
            style={{
              margin: 0,
              fontFamily: FONT,
              fontWeight: 400,
              fontSize: 11,
              lineHeight: '13px',
              color: 'rgba(0,0,0,0.6)',
              whiteSpace: 'nowrap',
            }}
          >
            {source}
          </p>
        </div>
      )}
    </div>
  )
}

export function ImageContainer({
  layout = 'Waterfall',
  orientation = 'Landscape',
  multiImage = 1,
  borderRadius = 16,
  showMetadata = true,
  metaSource = false,
  metaLines = '1 line title + source',
  imageBadge = true,
  showOverlay = false,
  collectionButton = false,
  moreImageIcon = false,
  showHover = false,
  hoverActions = true,
  dimensionLabel = true,
  flyoutType = 'Web',
  flyoutSurface = 'IRP',
  title = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  source = 'Pixels.com',
  imageSrc,
  faviconSrc,
  width: widthOverride,
  unitHeight: unitHeightOverride,
}: ImageContainerProps) {
  const dense = layout === 'Dense'
  const portrait = orientation === 'Portrait'
  const multi = multiImage !== 1

  // Real Figma geometry:
  //   Waterfall/Landscape 200 wide, image unit 172 tall, 8px gap before meta
  //   Waterfall/Portrait  200 wide, image unit 247 tall, no gap
  //   Dense/Landscape     258 wide, Dense/Portrait 190 wide; unit 172, min-h 200 / max-h 252
  const width = widthOverride ?? (dense ? (portrait ? 190 : 258) : 200)
  const unitHeight = unitHeightOverride ?? (!dense && portrait ? 247 : 172)
  const waterfallLandscape = !dense && !portrait
  // Figma's 8px is the image→text gap. With no text it has no meaning — it just
  // leaves dead space under the tile (visible as slack inside the selection
  // outline in the Playground). So the gap follows whether meta actually renders.
  const hasMeta = showHover || showMetadata
  const rootGap = waterfallLandscape && hasMeta ? 8 : 0
  const metaTopPad = waterfallLandscape ? 0 : 8
  const photo = imageSrc || (portrait ? IMG.portrait : IMG.landscape)
  // multiImage=3 → 2 stacked sub-images; multiImage=4 → 3 stacked. Sub-column is 72.5px.
  const subCount = multiImage === 4 ? 3 : 2

  // collectionButton anchors differently per variant.
  const collectionPos: React.CSSProperties = dense
    ? { right: 12, top: 12 }
    : multiImage === 3
      ? { left: 160, top: 12 }
      : { left: 164, top: 8 }

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: rootGap,
        width,
        // The Figma min/max width+height clamps belong to the standalone variants.
        // When a grid host drives the geometry, they must not fight it.
        // Note the dense *max* clamp is deliberately dropped: 252 bounds the
        // image unit, and metadata is extra height on top of it. Capping the
        // root would let a 2-line title eat into the image instead of growing
        // the tile. minHeight still holds the standalone variant's floor.
        ...(widthOverride === undefined
          ? { minWidth: 182, ...(dense ? { minHeight: 200 } : { maxWidth: 208 }) }
          : null),
        fontFamily: FONT,
      }}
    >
      {showHover && (
        <div
          style={{
            position: 'absolute',
            inset: -8,
            background: '#fff',
            borderRadius: 24,
            boxShadow: '0px 8px 24px 0px rgba(0,0,0,0.16)',
          }}
        />
      )}

      {/* individual image unit */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: multi ? 'row' : 'column',
          alignItems: multi ? 'flex-start' : 'stretch',
          justifyContent: 'center',
          gap: multi ? 2 : 0,
          width: '100%',
          height: unitHeight,
          borderRadius,
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', flex: '1 0 0', minWidth: 1, minHeight: 1, height: '100%' }}>
          <img src={photo} alt="" style={fillImg} />
        </div>

        {multi && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%', width: 72.5, flex: '0 0 auto' }}>
            {Array.from({ length: subCount }).map((_, i) => (
              <div key={i} style={{ position: 'relative', flex: '1 0 0', minHeight: 1 }}>
                <img src={IMG.square} alt="" style={fillImg} />
              </div>
            ))}
          </div>
        )}

        {showOverlay && <Overlay />}
        {imageBadge && <DurationBadge />}
        {collectionButton && <CollectionButton pos={collectionPos} />}
        {moreImageIcon && <MoreImageIcon />}
        {showHover && dimensionLabel && <DimensionLabel />}
      </div>

      {showHover && hoverActions && (
        <HoverActionCluster flyoutType={flyoutType} flyoutSurface={flyoutSurface} />
      )}

      {/* meta slot — the hover variant already carries metadata, so showMetadata
          yields to showHover. (Figma renders both; that's a Figma limitation, not intent.) */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
        {showMetadata && !showHover && (
          <MetaBlock topPad={metaTopPad} withSource={metaSource} lines={metaLines} title={title} source={source} faviconSrc={faviconSrc} />
        )}
        {showHover && <MetaBlock topPad={metaTopPad} withSource lines={metaLines} title={title} source={source} faviconSrc={faviconSrc} />}
      </div>
    </div>
  )
}

export default ImageContainer
