/**
 * Organisms — whole-page assemblies.
 *
 * SERP · Image Answer — rebuilt from the MM-ACF spec card 664:4322.
 *
 * COMPOSITION · CELL BY CELL (665:7085 / 7109 / 7133 / 7157):
 *   1  Platform · Bing page shell   665:6711   1232 × 125   Bing chrome — not ours
 *   2  Header cell · Section/title  665:6759   1232 × 26
 *   3  Content cell · waterfall     665:6770   1200 × 810
 *   4  Footer cell · Section/footer 665:6836   1208 × 38
 *
 * PAGE SPECS table 665:7180 (verbatim):
 *   Page width 1440 · Page height 1090 · Header height 125
 *   Header cell width 1280 · Waterfall width 1200 · Footer width 1208
 *
 * The three frames marked hidden inside the Figma composition
 * (665:6773 Header "Top results", 665:6780 explore-more filter row,
 *  665:6829 popout tile row) are NOT rendered — hidden layers, same call as
 * the stray circles in the Tabs export.
 *
 * Shell geometry is read off the live nodes, not eyeballed:
 *   Header Top      665:6712  x60  y12  1112 × 64
 *   Search form     665:6714              926 × 48   logo 18.008 × 18.307
 *   Composer        665:6725              648 × 48   icons 20 in 36 boxes
 *   Right Group     665:6740  x950 y13   162 × 38    "2,345" + icon, avatar 32, button 38
 *   Scope row       665:6747  y79        1112 × 46   9 tabs, ALL active w/ 3px underline
 */

import { Fragment } from 'react'
import * as React from 'react'
import { Header, Footer } from './Sections'
import { Content } from './Content'
import { RSOnTop } from './Molecules'

const FONT = "Roboto, 'Segoe UI', system-ui, sans-serif"
const ICON = 'figma/icon/'

/* Scope tabs, in Figma order. Widths come from the tab instances at
   x 0/60/163/244/323/394/465/550/641 — but each tab is auto-layout
   (12px outer + 8px inner padding), so we let the label size them and
   only pin the two that carry an icon. */
const SCOPES: { label: string; icon?: string }[] = [
  { label: 'ALL' },
  { label: 'SEARCH', icon: 'shell-copilot.svg' },
  { label: 'IMAGES' },
  { label: 'VIDEOS' },
  { label: 'MAPS' },
  { label: 'NEWS' },
  { label: 'COPILOT' },
  { label: 'MORE', icon: 'shell-more.svg' },
  { label: 'TOOLS' },
]

/* Subcategories 661:7245 — sit inside the Scopes row, right after IMAGES.
   Border #d1dbfa 1px · radius 20 · h 30 · padding 5/12 · gap 6
   label #174ae4 Roboto Regular 11/13. Group gap 8.
   A 4th pill (661:7248) exists in Figma but is hidden — not rendered. */
const SUBCATEGORIES: { label: string; icon: string; box: number }[] = [
  { label: 'Inspiration', icon: 'chip-inspiration.svg', box: 12 },
  { label: 'Create', icon: 'chip-create.svg', box: 16 },
  { label: 'Collections', icon: 'chip-collections.svg', box: 16 },
]

const DENIM = '#174ae4'
const DENIM_PLUS_4 = '#d1dbfa'

function SubcategoryPill({ label, icon, box }: { label: string; icon: string; box: number }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        height: 30,
        padding: '5px 12px',
        borderRadius: 20,
        // Figma stroke is an INSIDE stroke — inset shadow, never a CSS border.
        boxShadow: `inset 0 0 0 1px ${DENIM_PLUS_4}`,
        boxSizing: 'border-box',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <Glyph src={icon} box={box} />
      <span
        style={{
          fontSize: 11,
          lineHeight: '13px',
          fontWeight: 400,
          color: DENIM,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </div>
  )
}

const SECONDARY = 'rgba(0,0,0,0.75)'

/**
 * A glyph centred in a fixed box, keeping its own aspect ratio.
 *
 * Figma exports carry the glyph's TRUE size, not the box's — shell-more.svg is
 * 2.5 × 10.5 (a vertical ⋮), shell-menu.svg is 12 × 9, shell-rewards.svg is
 * 15 × 16.25. Painting any of them at width:100%/height:100% inside a square box
 * stretches them. Never size the <img> — size the box and let the glyph contain.
 */
function Glyph({ src, box }: { src: string; box: number }) {
  return (
    <div
      style={{
        position: 'relative',
        width: box,
        height: box,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src={ICON + src}
        alt=""
        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }}
      />
    </div>
  )
}

/** 20px icon inside a 36px hit box — the composer/right-action pattern. */
function ActionIcon({ src }: { src: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '8px' }}>
      <Glyph src={src} box={20} />
    </div>
  )
}

export interface BingShellProps {
  /** Which scope tab carries the active underline. */
  activeScope?: string
  /** Render the Subcategory pills after IMAGES (IRP only). */
  subcategories?: boolean
  /** Search field query text. */
  query?: string
  /**
   * Makes the search field editable. Fires on Enter, with the typed query —
   * the Playground uses it to re-fetch every tile's image and metadata.
   * Omit and the field stays the static Figma text.
   */
  onSearch?: (query: string) => void
}

/** Platform · Bing page shell — 665:6711 / 661:7205. Not ours, not ACF. */
export function BingShell({
  activeScope = 'ALL',
  subcategories = false,
  query = 'Living Room',
  onSearch,
}: BingShellProps = {}) {
  const [draft, setDraft] = React.useState(query)
  // The query can also change from outside (surface switch, preset) — follow it.
  React.useEffect(() => setDraft(query), [query])
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '100%',
        padding: '12px 60px 0',
        boxSizing: 'border-box',
        fontFamily: FONT,
        boxShadow: 'inset 0 -1px 0 0 rgba(0,0,0,0.1)',
      }}
    >
      {/* Header Top 665:6712 — 1112 × 64 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          width: '100%',
          padding: '8px 0',
          boxSizing: 'border-box',
        }}
      >
        {/* Search Container 665:6713 */}
        <div style={{ display: 'flex', alignItems: 'center', flex: '1 0 0', minWidth: 0, gap: 24 }}>
          <img
            src={ICON + 'shell-logo.svg'}
            alt=""
            style={{ width: 18.008, height: 18.307, flexShrink: 0, display: 'block' }}
          />
          {/* Temp Composer POR 665:6723 — 648 × 48 pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flex: '1 0 0',
              minWidth: 0,
              maxWidth: 648,
              height: 48,              background: '#fff',
              borderRadius: 9999,
              overflow: 'hidden',
              boxShadow:
                '0 1px 3px 0 rgba(0,0,0,0.15), 0 0 1px 0 rgba(0,0,0,0.15), 0 2px 6px 0 rgba(244,190,146,0.18)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                flex: '1 0 0',
                minWidth: 0,
                height: 48,
                padding: '0 8px',
                boxSizing: 'border-box',
              }}
            >
              <ActionIcon src="shell-search.svg" />
              <div style={{ display: 'flex', alignItems: 'center', flex: '1 0 0', minWidth: 0, height: 24 }}>
                {onSearch ? (
                  // Same type ramp as the static span — an input, not a new style.
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') onSearch(draft)
                    }}
                    aria-label="Search"
                    style={{
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      padding: 0,
                      fontFamily: 'inherit',
                      fontSize: 14,
                      lineHeight: '22px',
                      fontWeight: 700,
                      color: SECONDARY,
                    }}
                  />
                ) : (
                  <span
                    style={{
                      fontSize: 14,
                      lineHeight: '22px',
                      fontWeight: 700,
                      color: SECONDARY,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {query}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', height: 48, flexShrink: 0 }}>
                <ActionIcon src="shell-mic.svg" />
                <ActionIcon src="shell-visual.svg" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Group 665:6740 — 162 × 38 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 16,
            maxWidth: 250,
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <span style={{ fontSize: 14, lineHeight: '22px', fontWeight: 700, color: SECONDARY }}>2,345</span>
            <Glyph src="shell-rewards.svg" box={20} />
          </div>
          {/* Avatar 665:6744 — 32 circle, gradient placeholder per Figma */}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9999,
              flexShrink: 0,
              backgroundImage:
                'linear-gradient(157.2deg, rgb(237,237,237) 19.8%, rgb(205,125,137) 270.8%)',
              filter: 'drop-shadow(0 1px 1.5px rgba(0,0,0,0.15))',
            }}
          />
          {/* Button 665:6745 — 38 square, 16 icon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 38,
              height: 38,
              borderRadius: 8,
              flexShrink: 0,
            }}
          >
            <Glyph src="shell-menu.svg" box={16} />
          </div>
        </div>
      </div>

      {/* Header Tab Bar Container 665:6746 → Scopes 665:6747, 46 tall */}
      <div style={{ width: '100%', paddingTop: 3, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%', overflow: 'hidden' }}>
          {SCOPES.map((s, i) => (
            <Fragment key={s.label}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 46,
                maxWidth: 234,
                padding: '0 12px',
                boxSizing: 'border-box',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  height: '100%',
                  padding: '8px',
                  boxSizing: 'border-box',
                  // Figma: 3px bottom border on the active tab's INNER container.
                  boxShadow: s.label === activeScope ? 'inset 0 -3px 0 0 #000' : undefined,
                }}
              >
                {s.icon && <Glyph src={s.icon} box={16} />}
                <span
                  style={{
                    fontSize: 11,
                    lineHeight: '13px',
                    // 661:7242 — ALL is the one Regular label; the rest are Bold.
                    fontWeight: i === 0 ? 400 : 700,
                    color: s.label === activeScope ? '#000' : SECONDARY,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {s.label}
                </span>
              </div>
            </div>
            {subcategories && s.label === 'IMAGES' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                {SUBCATEGORIES.map((c) => (
                  <SubcategoryPill key={c.label} label={c.label} icon={c.icon} box={c.box} />
                ))}
              </div>
            )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

export interface SerpImageAnswerProps {
  /** Block title — the Header cell's clickable title. */
  title?: string
  /** Render the Bing page shell above the block. Off = the block alone. */
  pageShell?: boolean
}

/**
 * SERP · Image Answer — the whole-page assembly.
 *
 * Built from the spec card's `Section · Copy me` specimen 664:7966, which
 * renders the 1440-wide page at 1240/1440 = 0.86111. Every number below is the
 * scaled measurement divided by that constant:
 *
 *   Header cell   x 137.778  w 1102.222  h 23      →  x 160  w 1280  h 26
 *   Waterfall     y 158.194  1033.333 × 365.111    →  y 184  1200 × 424
 *   Footer cell   y 537.083  1040.222 × 32.722     →  y 624  1208 × 38
 *
 * Two things the composition rows got wrong and the specimen gets right:
 *   · the block is LEFT-anchored at x 160 and runs to the page edge — it is
 *     not a 1280 column centred on 1440.
 *   · the waterfall is CLIPPED to 424 tall (D2's 11x4 = 1200 × 424), not the
 *     810 the standalone Content cell shows.
 */
export function SerpImageAnswer({
  title = 'Image of Living Room',
  pageShell = true,
}: SerpImageAnswerProps) {
  return (
    <div
      style={{
        width: 1440,
        background: '#fff',
        fontFamily: FONT,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {pageShell && <BingShell />}

      {/* The MM block — left gutter 160, flush to the page's right edge. */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 16,
          width: 1280,
          marginLeft: 160,
          padding: '16px 0',
          boxSizing: 'border-box',
        }}
      >
        {/* Header cell · Section / title — title + chevron only, no end props. */}
        <Header title={title} showSubTitle={false} />

        {/* Content cell · waterfall — clipped to the 1200 × 424 block size. */}
        <Content layout="Waterfall" height={424} />

        {/* Footer cell · Section / footer — the exit. */}
        <div style={{ width: 1208 }}>
          <Footer clickAction="Expansion: See more" />
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * IRP · Whole Page — spec card 661:684
 *
 * Overview (661:693, verbatim):
 *   "The Images Results Page. A whole-page assembly: the Bing page shell
 *    (platform), our Filter cell across the top of the content area, and the
 *    Content cell in its dense layout. No Header cell and no Footer cell on
 *    this surface — the query tabs do the framing that Section/title does on
 *    SERP."
 *
 * PAGE SPECS 662:2811:  page 1440 × 867 · header 125 · content area 1360
 * COMPOSITION:
 *   1  Page shell        662:2279  platform — Bing header + tab bar
 *   2  Filter cell       662:2332  Whole Page Tabs — 10 × Query Suggestion,
 *                                  180 × 38 each, 1350 wide, gap 8
 *   3  Content / dense   662:2343  3 rows × 6 Image Container, 208 × 200,
 *                                  1360 × 644 (row pitch 220 → 20 gap;
 *                                  column pitch 224 → 16 gap)
 *
 * NOTE the spec card renders step 3 at 1240/1360 = 0.9118 scale (instances
 * measure 189.647 × 182.353). The label's numbers are the true ones.
 * Hidden layer 662:2297 (search placeholder) is NOT rendered.
 *
 * Query Suggestion pill tokens (get_design_context on 662:2332):
 *   bg white · stroke 1px rgba(0,0,0,.1) INSIDE → inset box-shadow, not border
 *   h 38 · max-w 180 · pl 4 · pr 16 · gap 8 · radius circular
 *   thumb 30 square, radius-8 clip wrapper, inner img circular object-cover
 *   label 13/20 weight 700 black, ellipsised
 * ------------------------------------------------------------------ */

const IMG = 'figma/img/'

const QS_THUMBS = ['qs-thumb-1.png', 'qs-thumb-2.png', 'qs-thumb-3.png']

const LOREM = 'Lorem ipsum dolor sit amet, consectetur'

/** The 10 Query Suggestion labels, in Figma order. */
const QS_ITEMS: { label: string; thumb: string }[] = Array.from({ length: 10 }, (_, i) => ({
  label: LOREM,
  thumb: QS_THUMBS[i % QS_THUMBS.length],
}))

export function QuerySuggestion({ label, thumb }: { label: string; thumb: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        height: 38,
        maxWidth: 180,
        padding: '0 16px 0 4px',
        background: '#fff',
        borderRadius: 9999,
        // Figma stroke is an INSIDE stroke — never a CSS border.
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
        boxSizing: 'border-box',
        flexShrink: 0,
      }}
    >
      <div style={{ position: 'relative', width: 30, height: 30, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
        <img
          src={IMG + thumb}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            maxWidth: 'none',
            objectFit: 'cover',
            borderRadius: 9999,
          }}
        />
      </div>
      <p
        style={{
          margin: 0,
          flex: '1 1 0',
          minWidth: 1,
          fontSize: 13,
          lineHeight: '20px',
          fontWeight: 700,
          color: '#000',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </p>
    </div>
  )
}

/** Filter cell · Whole Page Tabs — 662:2332. 10 pills, gap 8, 1350 wide. */
export function WholePageTabs() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: FONT }}>
      {QS_ITEMS.map((q, i) => (
        <QuerySuggestion key={i} label={q.label} thumb={q.thumb} />
      ))}
    </div>
  )
}

const TILE_CAPTION = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'

/** Content cell · dense — 661:7404. 3 × 6 grid of 208-wide tiles on 1360.
 *  Each tile = individual image unit (200 tall, radius 16) + meta slot
 *  (661:7406 → 150:5438): padding 8 all round, gap 4, one <p> 14/22 Roboto
 *  Regular black clamped to 2 lines. */
export function IrpDenseGrid() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: 1360 }}>
      {[0, 1, 2].map((r) => (
        <div key={r} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: 208,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: 200,
                  borderRadius: 16,
                  overflow: 'hidden',
                }}
              >
                <img
                  src={IMG + 'photo-landscape.png'}
                  alt=""
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    maxWidth: 'none',
                    objectFit: 'cover',
                  }}
                />
              </div>
              {/* meta slot */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 4,
                  width: '100%',
                  padding: 8,
                  boxSizing: 'border-box',
                  flexShrink: 0,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    width: '100%',
                    fontSize: 14,
                    lineHeight: '22px',
                    fontWeight: 400,
                    color: '#000',
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {TILE_CAPTION}
                </p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export interface IrpWholePageProps {
  /** Render the Bing page shell above the content area. */
  pageShell?: boolean
  /** Render the Whole Page Tabs filter row. */
  filterRow?: boolean
}

export function IrpWholePage({ pageShell = true, filterRow = true }: IrpWholePageProps) {
  return (
    <div
      style={{
        width: 1440,
        background: '#fff',
        fontFamily: FONT,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {pageShell && <BingShell activeScope="IMAGES" subcategories query="Living Room" />}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 16,
          width: 1360,
          margin: '0 auto',
          padding: '24px 0 16px',
          boxSizing: 'border-box',
        }}
      >
        {/* The requery strip above the grid is the RS on Top cell (798:2246) —
            the same component the library ships, not a local pill row. It runs
            the content column instead of its standalone 1262; 1326 leaves the
            scroller button (right -18, 32 wide) inside the 1360 column, so the
            row must NOT be clipped here. */}
        {filterRow && <RSOnTop width={1326} />}
        <IrpDenseGrid />
      </div>
    </div>
  )
}

export default SerpImageAnswer
