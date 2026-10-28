/**
 * Content — 1:1 rebuild from Figma (MM-ACF card 105:2, "Content · CELL").
 *
 * Read off the real Figma nodes, not transcribed by eye:
 *   243:72  / 592:333  layout: waterfall  → inner frame 254:13490 / 592:334, 1200×424
 *   244:72            layout: dense      → inner frame 244:73,               1200×424
 *
 * The Figma Properties table on this page (595:337) states verbatim:
 *   Grid                11 × 4        dense default · 11 columns, 4 rows
 *   Frame size          1200 × 424    "true grid size for 11×4 — do not scale to fit"
 *   Column width · gap  186.67 · 16   6 image columns, 16px gutters
 *   Layouts             Waterfall · Dense
 * That settles D2 and kills the 1208 / 1072 widths that were on record — 1200 × 424.
 *
 * Waterfall is masonry: 6 columns of variable-height tiles that OVERFLOW the 424 box.
 * The inner "Top Results Content" frame is 1200×810 and is clipped by the 424 shell —
 * that clip is the design, not a bug. Tile heights below are the literal Figma values.
 *
 * Dense is row-based: two 204-tall rows (6 × 186.67 × 200 tiles) with a 16 gap.
 * Only the dense tiles carry a meta slot; the waterfall tiles are image-only.
 *
 * Composition: every cell here is a real <ImageContainer> (Image Tile molecule),
 * NOT a private copy. Content drives the grid geometry (column width, per-tile
 * height) through ImageContainer's width/unitHeight overrides and leaves every
 * other tile prop addressable — globally via `tile`, per-cell via `tiles[i]`.
 * That is what makes each tile individually selectable in the Playground.
 *
 * Figma emits React+Tailwind; this project uses inline styles (Tailwind NOT installed).
 */

import * as React from 'react'
import { ImageContainer } from './ImageContainer'
import type { ImageContainerProps } from './ImageContainer'
import type { SearchImage } from '../data/imageSearch'

const FONT = "Roboto, 'Segoe UI', system-ui, sans-serif"

/** radius/lg — the value get_design_context emits on every Image Container here. */
const RADIUS = 16
const COL_W = 186.6667 // Figma's stated column width; = (1200 - 5×16)/6, derived below
const GAP = 16 // Figma's tile-to-tile distance, horizontal and vertical. Overridable via the `gap` prop.

/* Literal per-column tile heights, read off nodes 562:24703 / 562:24648 /
   567:24794 / 567:24849 / 567:24904 / 567:24959. Every intra-column gap is 16. */
const WATERFALL_COLUMNS: number[][] = [
  [164, 218, 164, 216],
  [218, 113, 218, 216],
  [163, 153, 218, 216],
  [261, 113, 218, 216],
  [193, 147, 218, 216],
  [253, 113, 218, 216],
]

/** Per-tile overrides. Anything ImageContainer takes, minus the host geometry. */
export type TileProps = Omit<ImageContainerProps, 'width' | 'unitHeight'>

export interface ContentProps {
  layout?: 'Waterfall' | 'Dense'
  /**
   * Shell height. Defaults to the cell's own 424 (the 11×4 frame size, clipped).
   * The SERP organism spec card (665:6770) places the same waterfall at 1200×810
   * un-clipped — which is exactly the natural column height (164+218+164+216 + 3×16),
   * so the organism passes 810 and nothing is cut.
   */
  height?: number
  /**
   * Shell width. Figma's cell is 1200 (the 11×4 frame). A host surface whose
   * content column is wider — IRP's is 1360 — passes its own column width so
   * the grid runs edge to edge instead of leaving a gutter. Columns re-derive
   * from it, so the 6-column / gap contract is preserved at any width.
   */
  width?: number
  /**
   * Distance BETWEEN tiles — horizontal (between columns) and vertical (within
   * a column / between dense rows) alike. Figma's value is 16. The 1200 shell
   * is fixed, so widening the gap narrows the columns; the grid never overflows.
   */
  gap?: number
  /** Applied to EVERY tile. Edit-all. */
  tile?: TileProps
  /** Per-tile override, keyed by render index. Beats `tile`. Edit-one. */
  tiles?: Record<number, TileProps>
  /**
   * Live search results. When present the waterfall stops using the literal
   * Figma column heights and becomes a real masonry: each tile's height is its
   * own aspect ratio at the column width, packed shortest-column-first — which
   * is what Bing itself does. Absent, the Figma geometry is untouched.
   */
  items?: SearchImage[]
  /**
   * Wrap each rendered tile — the Playground uses this to hang selection chrome
   * on an individual cell without Content knowing anything about the playground.
   */
  renderTile?: (node: React.ReactNode, index: number) => React.ReactNode
}

/** Min/max tile height, so one panorama or one tower can't wreck the grid. */
const MIN_H = 96
const MAX_H = 320

/**
 * Greedy masonry: walk the items in rank order, drop each into whichever column
 * is currently shortest. Returns per-column lists of [itemIndex, height].
 */
function packColumns(items: SearchImage[], colW: number, gap: number) {
  const cols: [number, number][][] = [[], [], [], [], [], []]
  const tops = [0, 0, 0, 0, 0, 0]
  items.forEach((it, i) => {
    const raw = (colW * it.height) / it.width
    const h = Math.round(Math.min(MAX_H, Math.max(MIN_H, raw)))
    let c = 0
    for (let k = 1; k < 6; k++) if (tops[k] < tops[c]) c = k
    cols[c].push([i, h])
    tops[c] += h + gap
  })
  return cols
}

/** Tile count per layout, so a host can enumerate selectable cells. */
export function tileCount(layout: 'Waterfall' | 'Dense' = 'Waterfall') {
  return layout === 'Waterfall'
    ? WATERFALL_COLUMNS.reduce((n, col) => n + col.length, 0)
    : 12
}

export function Content({
  layout = 'Waterfall',
  height = 424,
  width = 1200,
  gap = GAP,
  tile,
  tiles,
  items,
  renderTile,
}: ContentProps) {
  /**
   * Column width derived from the shell width and the gap, NOT a constant.
   * At width 1200 / gap 16 this is (1200 - 5×16) / 6 = 186.6667 exactly — the
   * Figma value — so fidelity is untouched. Any other width or gap reflows the
   * columns instead of overflowing.
   */
  const colW = width === 1200 && gap === GAP ? COL_W : (width - 5 * gap) / 6

  /** One cell. Host geometry is forced; everything else is editable. */
  const cell = (index: number, unitHeight: number, extra: TileProps, item?: SearchImage) => {
    // Live content sits between the layout defaults and the user's own edits,
    // so an explicitly edited title still wins over whatever Bing returned.
    const live: TileProps = item
      ? { imageSrc: item.src, faviconSrc: item.favicon, title: item.title, source: item.source }
      : {}
    const props: TileProps = { ...extra, ...live, ...tile, ...(tiles?.[index] ?? {}) }
    const node = (
      <ImageContainer
        key={index}
        width={colW}
        unitHeight={unitHeight}
        borderRadius={RADIUS}
        {...props}
      />
    )
    return renderTile ? (
      <React.Fragment key={index}>{renderTile(node, index)}</React.Fragment>
    ) : (
      node
    )
  }

  let i = 0

  return (
    // The 1200×424 shell. Frame size is a hard constraint per the Figma
    // properties table — "do not scale to fit". Waterfall overflows and is clipped.
    <div
      style={{
        position: 'relative',
        width,
        height,
        overflow: 'hidden',
        fontFamily: FONT,
        boxSizing: 'border-box',
      }}
    >
      {layout === 'Waterfall' ? (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap, width: '100%' }}>
          {(items && items.length
            ? packColumns(items, colW, gap)
            : WATERFALL_COLUMNS.map((hs) => hs.map((h): [number, number] => [i++, h]))
          ).map((col, c) => (
            <div
              key={c}
              style={{ display: 'flex', flexDirection: 'column', gap, width: colW, flex: '0 0 auto' }}
            >
              {/* Waterfall tiles are image-only — no meta slot in Figma. */}
              {col.map(([idx, h]) =>
                cell(idx, h, { showMetadata: false, imageBadge: false }, items?.[idx]),
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap, width: '100%' }}>
          {[0, 1].map((r) => (
            // 204 is the image unit's ceiling, not the row's. Metadata sits on
            // top of it — a 2-line title makes the row taller rather than
            // getting clipped. So this is a floor, not a fixed height.
            <div key={r} style={{ display: 'flex', alignItems: 'flex-start', gap, width: '100%', minHeight: 204 }}>
              {/* Dense tiles: 200-tall unit incl. a title-only meta slot. */}
              {Array.from({ length: 6 }).map(() => {
                const idx = i++
                return cell(
                  idx,
                  160,
                  { layout: 'Dense', showMetadata: true, imageBadge: false },
                  items?.[idx],
                )
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Content
