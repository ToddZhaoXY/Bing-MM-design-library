/**
 * Molecules — 1:1 rebuild from Figma (MM-ACF `fRSRroY4YFgJSeqLLE0Y38`).
 *
 * Structure + assets read off the real component sets via get_design_context:
 *   150:5533   Badge (7 variants)
 *   150:5399   source
 *   150:5378   Meta data
 *   360:16129  Image action cluster
 *   385:4577   Image overflow flyout
 *   538:5310   RS Inline
 *   540:20844  RS Card
 *
 * Icons are the real Figma SVG exports under public/figma/icon/.
 * IMPORTANT: those exports are the *inset shape only* — they carry
 * preserveAspectRatio="none" and odd intrinsic sizes (badge-play.svg is
 * 8.2502 × 9.00348). Figma wraps each in a fixed icon box and positions the
 * shape at percentage insets. Rendering an export directly at 16×16 stretches
 * it. Always use <Ico> below, never a bare <img> at the icon size.
 *
 * Figma emits React+Tailwind; this project uses inline styles (Tailwind NOT installed).
 */

import * as React from 'react'
import { RSPill } from './RSPill'

const ROBOTO = 'Roboto, system-ui, sans-serif'
const ICON = 'figma/icon/'
// img-2.png is a 2.6KB blank from the Figma export — excluded.
/* RS Inline's ten tiles all share ONE fill in Figma (585:5237) — the abstract
   blue render. Cycling three different photos was our invention and made the
   1:1 × 16:9 cover-crop read as damage. Match Figma: one image, everywhere. */
const RS_INLINE_THUMB = 'figma/img/img-1.png'
const FAVICON12 = 'figma/img/favicon-12.png'

/** Figma icon box: fixed-size frame, shape absolutely positioned at its inset.
 *  Shared with ImageContainer — every Figma SVG export must go through this. */
export function Ico({ src, size, inset }: { src: string; size: number; inset: string }) {
  return (
    <span
      style={{
        position: 'relative',
        display: 'block',
        width: size,
        height: size,
        flex: '0 0 auto',
        overflow: 'hidden',
      }}
    >
      {/* Two levels, exactly as Figma emits them: the shape frame carries the
          inset and derives its own size from it; the img fills that frame.
          Putting inset + width:100% on the same element makes width win over
          right/bottom and stretches the shape to the full icon box. */}
      <span style={{ position: 'absolute', inset, display: 'block' }}>
        <img
          src={ICON + src}
          alt=""
          style={{ width: '100%', height: '100%', maxWidth: 'none', display: 'block' }}
        />
      </span>
    </span>
  )
}

/* ------------------------------------------------------------------ Badge */
// node 150:5533 · height 20 · pad 2/4 · radius 8 · bg #000 · Roboto Bold 11/13 #fff
// IconContainer: display flex, height 13, align center. Icon box: 12.
export type BadgeVariant =
  | 'Time' | 'Recipe' | 'GIF' | 'Play' | 'Multi image' | 'Size' | 'truncated'

const BADGE_TEXT: Record<BadgeVariant, string> = {
  Time: '1 day ago',
  Recipe: 'Recipe',
  GIF: 'GIF',
  Play: '3:30',
  'Multi image': '4',
  Size: '2560 × 1440',
  truncated: '...',
}

// Figma insets, read off each variant's Shape node inside its 12px icon box.
const BADGE_ICON: Partial<Record<BadgeVariant, { src: string; inset: string }>> = {
  Recipe: { src: 'badge-recipe.svg', inset: '12.5%' },
  Play: { src: 'badge-play.svg', inset: '12.5% 12.5% 12.47% 18.75%' },
  'Multi image': { src: 'badge-multi-image.svg', inset: '12.5%' },
}

/* Time/Clock (1:6411) emits no image asset from Figma — same situation as the
   Image Tile duration badge, so it uses the same hand-drawn clock. */
function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ display: 'block' }}>
      <circle cx="6" cy="6" r="4.6" stroke="#fff" strokeWidth="1" />
      <path d="M6 3.3V6.1L7.9 7.3" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Badge({ property1 = 'Time' }: { property1?: BadgeVariant }) {
  const icon = BADGE_ICON[property1]
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
      <div
        style={{
          display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2,
          height: 20, padding: '2px 4px', borderRadius: 8,
          background: '#000000', flexShrink: 0,
        }}
      >
        {(icon || property1 === 'Time') && (
          <span style={{ display: 'flex', alignItems: 'center', height: 13, flex: '0 0 auto' }}>
            {icon ? <Ico src={icon.src} size={12} inset={icon.inset} /> : <ClockIcon />}
          </span>
        )}
        <span
          style={{
            fontFamily: ROBOTO, fontWeight: 700, fontSize: 11, lineHeight: '13px',
            color: '#ffffff', textAlign: 'center', whiteSpace: 'nowrap',
          }}
        >
          {BADGE_TEXT[property1]}
        </span>
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------- source */
// node 150:5399 · favicon 12×12 r4 hairline · Roboto 11/13 rgba(0,0,0,.6)
export function Source({ state = 'Default', name = 'Pixels.com' }: { state?: 'Default' | 'Hover'; name?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: 4, alignItems: 'center' }}>
      <span
        style={{
          display: 'flex', alignItems: 'center', width: 12, height: 12,
          // Figma inside stroke — inset shadow, not a CSS border (a border would
          // eat 2px of the 12px favicon).
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)', borderRadius: 4,
          overflow: 'hidden', flexShrink: 0, boxSizing: 'border-box',
        }}
      >
        <img src={FAVICON12} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </span>
      <span
        style={{
          fontFamily: ROBOTO, fontWeight: 400, fontSize: 11, lineHeight: '13px',
          color: 'rgba(0,0,0,0.6)', whiteSpace: 'nowrap', overflow: 'hidden',
          textOverflow: 'ellipsis',
          textDecoration: state === 'Hover' ? 'underline' : 'none',
          textDecorationSkipInk: state === 'Hover' ? 'none' : undefined,
        }}
      >
        {name}
      </span>
    </div>
  )
}

/* -------------------------------------------------------------- Meta data */
// node 150:5378 · width 226 · gap 4 · pad 0 8 8 8 · title Roboto 14/22 #000
export type MetaLines = '1 line title + source' | '2 lines title' | '2 lines title + source'

export function MetaData({
  lines = '1 line title + source',
  showSource = true,
  title = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  source = 'Pixels.com',
}: { lines?: MetaLines; showSource?: boolean; title?: string; source?: string }) {
  const oneLine = lines === '1 line title + source'
  const withSource = showSource && lines !== '2 lines title'
  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start',
        width: 226, padding: '0 8px 8px 8px',
      }}
    >
      <p
        style={{
          margin: 0, width: '100%', fontFamily: ROBOTO, fontWeight: 400,
          fontSize: 14, lineHeight: '22px', color: '#000000', overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: oneLine ? 'nowrap' : 'normal',
          display: oneLine ? 'block' : '-webkit-box',
          WebkitLineClamp: oneLine ? undefined : 2,
          WebkitBoxOrient: oneLine ? undefined : 'vertical',
        }}
      >
        {title}
      </p>
      {withSource && (
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Source state="Default" name={source} />
        </div>
      )}
    </div>
  )
}

/* --------------------------------------------------- Image action cluster */
// node 360:16129 · chip h28 min-h28 max-h28 min-w28 · px 4 · radius 9999
// bg #000 · border 1px rgba(0,0,0,.1) · nested gap 2 px 2 · iconStart 16
export type ActionType = 'Web' | 'AIGC' | 'Homepage'
export type Surface = 'SERP' | 'IRP'

type IconSpec = { src: string; inset: string }

const DOMINANT_ICON: Record<ActionType, IconSpec> = {
  Web: { src: 'search-visual.svg', inset: '12.5%' },
  AIGC: { src: 'wand.svg', inset: '12.5% 12.5% 8.11% 8.47%' },
  // chip-collections-add.svg is the white-fill export from the action-cluster node
  // (4a87e4e2-…). collections-add.svg is the black-fill one — it would be invisible
  // on the #000 chip.
  Homepage: { src: 'chip-collections-add.svg', inset: '8.33% 4.17% 4.17% 8.33%' },
}
const MORE_ICON: IconSpec = { src: 'more-horizontal.svg', inset: '42.19% 17.19%' }

function ActionChip({ icon }: { icon: IconSpec }) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', height: 28, minHeight: 28, maxHeight: 28,
        minWidth: 28, padding: '0 4px', borderRadius: 9999, background: '#000000',
        // Figma stroke is an INSIDE stroke — a CSS border would add 2px to the
        // auto width and turn the 28×28 circle into a 30×28 pill.
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)', boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', gap: 2, alignItems: 'center', padding: '0 2px' }}>
        <Ico src={icon.src} size={16} inset={icon.inset} />
      </div>
    </div>
  )
}

export function ImageActionCluster({
  type = 'Web', surface = 'SERP',
}: { type?: ActionType; surface?: Surface }) {
  void surface // structure is identical; surface only changes flyout contents
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
      <ActionChip icon={DOMINANT_ICON[type]} />
      <ActionChip icon={MORE_ICON} />
    </div>
  )
}

/* --------------------------------------------------- Image overflow flyout */
// node 385:4577 · w 177 · max-h 424 · pad 4 · radius 16 · white · hairline
// item: gap 8 · pad 8/12 · r4 · icon 16 · Roboto 13/20 #000 ellipsis
const FLYOUT_ICON: Record<string, IconSpec> = {
  Reimagine: { src: 'fly-reimagine.svg', inset: '12.5% 12.5% 8.11% 8.47%' },
  Save: { src: 'fly-save.svg', inset: '8.33% 4.17% 4.17% 8.33%' },
  'Visual search': { src: 'fly-visual-search.svg', inset: '12.5%' },
  Download: { src: 'download.svg', inset: '9.38% 18.75%' },
  'Set as wallpaper': { src: 'wallpaper.svg', inset: '12.5%' },
  Like: { src: 'heart.svg', inset: '16.67% 8.32% 11.27% 8.33%' },
  'Show less like this': { src: 'thumb-dislike.svg', inset: '11.02% 15.06% 6.25% 13.04%' },
  'Report content': { src: 'flag.svg', inset: '12.49% 12.48% 8.33% 12.5%' },
}

// Save rule (Figma doc): Web/AIGC show Save only on IRP; Homepage dominant = Save.
const FLYOUT_ITEMS: Record<ActionType, Record<Surface, string[]>> = {
  Web: { IRP: ['Reimagine', 'Save'], SERP: ['Reimagine'] },
  AIGC: {
    IRP: ['Visual search', 'Download', 'Set as wallpaper', 'Save'],
    SERP: ['Visual search', 'Download', 'Set as wallpaper'],
  },
  Homepage: {
    IRP: ['Like', 'Show less like this', 'Report content'],
    SERP: ['Like', 'Show less like this', 'Report content'],
  },
}

export function ImageOverflowFlyout({
  type = 'Web', surface = 'IRP',
}: { type?: ActionType; surface?: Surface }) {
  return (
    <div
      style={{
        width: 177, maxHeight: 424, padding: 4, borderRadius: 16, background: '#ffffff',
        boxSizing: 'border-box',
        // bing/smtc/stroke/ctrl/default #0000001a is a Figma INSIDE stroke — inset shadow, never a CSS border.
        // smtc/shadows/flyout = offset (-5, 4), radius 12 (get_variable_defs on 385:4577).
        // The design_context export rendered blur 6; the token wins.
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1), -5px 4px 12px 0 rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', borderRadius: 16 }}>
        {FLYOUT_ITEMS[type][surface].map((label) => {
          const icon = FLYOUT_ICON[label]
          return (
            <div
              key={label}
              style={{
                display: 'flex', flexDirection: 'row', gap: 8,
                padding: '8px 12px', borderRadius: 4, width: '100%',
                alignItems: 'center', boxSizing: 'border-box',
              }}
            >
              {icon && <Ico src={icon.src} size={16} inset={icon.inset} />}
              <span
                style={{
                  fontFamily: ROBOTO, fontWeight: 400, fontSize: 13, lineHeight: '20px',
                  color: '#000000', whiteSpace: 'nowrap', overflow: 'hidden',
                  textOverflow: 'ellipsis', flex: 1,
                }}
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------- RS Inline */
// node 538:5310 · w 1360 · bg #f8f4f1 · radius 24 · pad 20 (no right) · gap 12
const RS_CAPTIONS = [
  'Elements of ', 'Minimalist Room', 'Gorgeously ', 'Warm Minimalist ',
  'Stylish Minimalist ', 'Warm Living Room ', 'Ideas for Artistic...',
  '10 minimalist ', 'How to Design ', 'Before & After: ',
]

export function RSInline({ label = 'People also' }: { label?: 'Top suggestion' | 'People also' }) {
  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start',
        padding: '20px 0 20px 20px', width: 1360, background: '#f8f4f1',
        borderRadius: 24, boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          fontFamily: ROBOTO, fontWeight: 700, fontSize: 14, lineHeight: '22px',
          color: '#000000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}
      >
        {label === 'Top suggestion' ? 'Top suggestion for living room interior' : 'People also search for'}
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', gap: 20, alignItems: 'flex-start', overflow: 'hidden', width: '100%' }}>
        {RS_CAPTIONS.map((cap, i) => (
          <div key={cap} style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start', justifyContent: 'center', overflow: 'hidden' }}>
            <img
              src={RS_INLINE_THUMB}
              alt=""
              style={{ width: 120, height: 120, borderRadius: 16, objectFit: 'cover', display: 'block', flex: '0 0 auto' }}
            />
            <span
              style={{
                fontFamily: ROBOTO, fontWeight: 700, fontSize: 14, lineHeight: '22px',
                color: '#3a3a3a', minWidth: '100%', width: 'min-content',
                overflow: 'hidden', textOverflow: 'ellipsis',
                textDecoration: i === 1 ? 'underline' : 'none',
              }}
            >
              {cap}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ----------------------------------------------------------- Image Cluster */
/**
 * Figma spec card 581:6388 · COPY ME specimen 588:5254 (440 × 312).
 *
 * A titled mosaic of related images — one heading plus a 5-image grid (3 + 2).
 * Read off get_design_context on the copy-me instance, not the Variants rows:
 *   shell   bing/smtc/background/card/on-primary/alt/rest #f8f4f1
 *           mai/smtc/padding/card/default 20 · corner/card/default 24 · overflow clip
 *   content flex col · gap 10 · radius 12
 *   header  gap 8 → title group gap 4 · body3-strong (Roboto Bold 14/22, black)
 *           + ACF Button / Title action (circle, 28-xxs, accent) carrying a Chevron
 *   images  flex col · gap 4 (spacing/xs) · radius 16 (bing/static/corner/rounded/small)
 *           · overflow clip · two rows, both flex-1
 *   row 1   three flex-1 tiles; outer corners get smtc/corner/ctrl/rest 8
 *   row 2   two flex-1 tiles; outer bottom corners 8
 * Single variant — the Figma page's VARIANTS section is "Default" only.
 */
const CLUSTER_IMG = 'figma/img/img-1.png'

/** 581:6388 chevron — the real 5.5 × 10 Fluent export, not a hand-drawn caret. */
function ClusterChevron() {
  return (
    <svg width="5.5" height="10" viewBox="0 0 5.5 10" fill="none" aria-hidden="true" style={{ display: 'block' }}>
      <path
        d="M0.239665 0.200408C-0.0638681 0.48226 -0.081444 0.956809 0.200408 1.26034L3.72652 5L0.200408 8.73967C-0.0814437 9.0432 -0.0638678 9.51775 0.239665 9.7996C0.543198 10.0815 1.01775 10.0639 1.2996 9.76034L5.2996 5.51034C5.5668 5.22258 5.5668 4.77743 5.2996 4.48966L1.2996 0.239665C1.01775 -0.0638681 0.543198 -0.081444 0.239665 0.200408Z"
        fill="black"
      />
    </svg>
  )
}

function ClusterTile({ radii }: { radii: React.CSSProperties }) {
  return (
    <div style={{ flex: '1 0 0', minWidth: 1, height: '100%', position: 'relative', overflow: 'hidden', ...radii }}>
      <img
        src={CLUSTER_IMG}
        alt=""
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  )
}

/* Title action — Figma ships only the rest circle, but online it's a button:
   it washes on hover and dims on press. */
function TitleActionButton() {
  const [hover, setHover] = React.useState(false)
  const [pressed, setPressed] = React.useState(false)
  return (
    <span
      role="button"
      tabIndex={0}
      aria-label="See more"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false)
        setPressed(false)
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 28, height: 28, borderRadius: '50%', flex: '0 0 auto', cursor: 'pointer',
        background: pressed
          ? 'rgba(0,0,0,0.03)'
          : hover
            ? 'rgba(0,0,0,0.05)'
            : 'transparent',
        outline: 'none',
      }}
    >
      <ClusterChevron />
    </span>
  )
}

export function ImageCluster({ heading = 'Minimalist Living Room Colors' }: { heading?: string }) {
  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
        width: 440, height: 312, boxSizing: 'border-box',
        padding: 20, background: '#f8f4f1', borderRadius: 24, overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center',
          flex: '1 0 0', minHeight: 1, width: '100%', borderRadius: 12,
        }}
      >
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <span
              style={{
                fontFamily: ROBOTO, fontWeight: 700, fontSize: 14, lineHeight: '22px',
                color: '#000000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}
            >
              {heading}
            </span>
            {/* ACF Button / Title action — circle, 28-xxs, accent.
                Live: it's a real button, so it hovers and presses. */}
            <TitleActionButton />
          </div>
        </div>

        <div
          style={{
            display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start',
            flex: '1 0 0', minHeight: 1, width: '100%',
            borderRadius: 16, overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', gap: 4, alignItems: 'flex-start', flex: '1 0 0', minHeight: 1, width: '100%' }}>
            <ClusterTile radii={{ borderTopLeftRadius: 8 }} />
            <ClusterTile radii={{}} />
            <ClusterTile radii={{ borderTopRightRadius: 8 }} />
          </div>
          <div style={{ display: 'flex', gap: 4, alignItems: 'flex-start', flex: '1 0 0', minHeight: 1, width: '100%' }}>
            <ClusterTile radii={{ borderBottomLeftRadius: 8 }} />
            <ClusterTile radii={{ borderBottomRightRadius: 8 }} />
          </div>
        </div>
      </div>
    </div>
  )
}

/* --------------------------------------------------------------- RS on Top */
/**
 * Figma spec card 798:2246 · COPY ME specimen 799:2804 (1262 × 38).
 *
 * The requery strip in its TOP placement — a horizontal scrolling row of Query
 * Suggestion pills sitting above the results grid. Same pill as RS Pill; what
 * differs is the wrapper: ACF `Horizontal Scroller` (467:31810), which adds an
 * edge fade and a scroll arrow.
 *   row      display flex · gap smtc/gap/between/content/x-small 8 · overflow clip
 *   pill     ACF Query suggestion — see RSPill.tsx (h 38, maxWidth 180 here)
 *   fade     48px wide, pinned right:-1, bing/smtc/background/ctrl/fade/on-primary/gradient
 *            (Figma rotates a vertical ramp -90°; expressed here as a CSS
 *             horizontal gradient — resolution-independent, same visual effect)
 *   button   Scroller button 32 × 32 · right -18 · vertically centred
 *            bg smtc/ctrl/fab/background/rest white · stroke on-neutral/rest (INSIDE)
 *            radius smtc/corner/ctrl/rest 8 · shadow floating/action-button/rest
 *            icon Fluent ChevronRight in a 20px box at inset 18.75% 31.25% 18.75% 34.38%
 * Single variant — the Figma PLACEMENT section carries exactly one entry (Top).
 */
function ScrollerChevronRight() {
  // 20px icon box, shape inset 18.75%/31.25%/18.75%/34.38% → 6.875 × 12.5
  return (
    <span style={{ position: 'relative', display: 'block', width: 20, height: 20, flex: '0 0 auto' }}>
      <svg
        width="6.875"
        height="12.5"
        viewBox="0 0 5.5 10"
        fill="none"
        aria-hidden="true"
        style={{ position: 'absolute', left: '34.38%', top: '18.75%', display: 'block' }}
      >
        <path
          d="M0.239665 0.200408C-0.0638681 0.48226 -0.081444 0.956809 0.200408 1.26034L3.72652 5L0.200408 8.73967C-0.0814437 9.0432 -0.0638678 9.51775 0.239665 9.7996C0.543198 10.0815 1.01775 10.0639 1.2996 9.76034L5.2996 5.51034C5.5668 5.22258 5.5668 4.77743 5.2996 4.48966L1.2996 0.239665C1.01775 -0.0638681 0.543198 -0.081444 0.239665 0.200408Z"
          fill="black"
        />
      </svg>
    </span>
  )
}

export function RSOnTop({
  label = 'Requery Title',
  showGradient = true,
  showScrollButton = true,
  width = 1262,
  suggestions,
  onPick,
}: {
  label?: string
  showGradient?: boolean
  showScrollButton?: boolean
  width?: number
  /**
   * Live requery suggestions (Bing relatedSearches + queryExpansions). Absent or
   * empty → the Figma 9 × `label` row, so the offline component stays 1:1.
   */
  suggestions?: { label: string; query: string; thumbnail: string }[]
  onPick?: (query: string) => void
}) {
  // Figma can only draw the scroller button; online it actually scrolls the row.
  // At the end the caret flips and takes you back — one control, no dead state.
  const rowRef = React.useRef<HTMLDivElement>(null)
  const live = suggestions ?? []
  const [atEnd, setAtEnd] = React.useState(false)
  const sync = () => {
    const el = rowRef.current
    if (!el) return
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2)
  }
  const scroll = () => {
    const el = rowRef.current
    if (!el) return
    if (atEnd) el.scrollTo({ left: 0, behavior: 'smooth' })
    else el.scrollBy({ left: Math.round(el.clientWidth * 0.8), behavior: 'smooth' })
  }
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', width }}>
      <div
        ref={rowRef}
        onScroll={sync}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center',
          flex: '1 0 0', minWidth: 1, overflowX: 'auto', overflowY: 'hidden',
          scrollbarWidth: 'none',
        }}
      >
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: '0 0 auto' }}>
          {(live.length ? live : Array.from({ length: 9 }, () => ({ label, query: label, thumbnail: '' }))).map(
            (s, i) => (
              <RSPill
                key={i}
                state="rest"
                thumbnail
                label={s.label}
                thumbnailSrc={s.thumbnail || undefined}
                onClick={onPick ? () => onPick(s.query) : undefined}
                maxWidth={180}
                shrink={false}
              />
            ),
          )}
        </div>
      </div>

      {showGradient && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute', top: 0, bottom: 0, right: -1, width: 48, pointerEvents: 'none',
            background: 'linear-gradient(to right, rgba(255,255,255,0) 0%, #ffffff 100%)',
          }}
        />
      )}

      {showScrollButton && (
        <span
          role="button"
          tabIndex={0}
          aria-label={atEnd ? 'Back to start' : 'Scroll right'}
          onClick={scroll}
          style={{
            position: 'absolute', right: -18, top: '50%', transform: 'translateY(-50%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 32, height: 32, borderRadius: 8, background: '#ffffff',
            boxShadow:
              'inset 0 0 0 1px rgba(0,0,0,0.1), 0 0 0 0 rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.14)',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <span style={{ display: 'inline-flex', transform: atEnd ? 'rotate(180deg)' : undefined }}>
            <ScrollerChevronRight />
          </span>
        </span>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- RS Card */
// node 540:20844 · width 200 (layout/card/width/2-by/max-width) · pad 20
export type RSLength = 'Two-line' | 'List' | 'Short'
export type RSState = 'Default' | 'Hover' | 'Press'

/**
 * Read off six real variants via get_design_context, not transcribed by eye:
 *   540:3435  Default / Two-line   540:3464  Hover / Two-line   540:3494  Press / Two-line
 *   540:3524  Default / List       540:3553  Hover / List       550:22996 Default / Short
 *
 * Facts that the earlier hand-drawn version got wrong:
 *  - row 5 is "Beautiful / Paris", not "Montmartre / Paris"
 *  - Default/Two-line thumbnails are 44 on rows 1-3 and 42 on rows 4-5 (not uniform)
 *  - labels are two stacked <p> lines in an inline-grid, not one inline run
 *  - row 4 is inverted: Regular "Paris" over "Postcard"
 *  - the wash sits on ROW 1 ONLY, as an absolute inset:-4 sibling behind the content
 *    (540:3474 / 540:3504 / 540:3563), and that row drops overflow:hidden
 *  - one shared thumbnail asset for every row
 */
const RS_THUMB = 'figma/img/rs-card-thumb.png'

/** [line1, line2, inverted] — inverted flips which line is Bold. */
const RS_ROWS: Array<[string, string, boolean?]> = [
  ['Beautiful', 'Paris'],
  ['Louvre ', 'Paris'],
  ['Where to Stay', 'in Paris'],
  ['Paris', 'Postcard', true],
  ['Beautiful', 'Paris'],
]

export function RSCard({
  length = 'Two-line', state = 'Default',
}: { length?: RSLength; state?: RSState }) {
  const compact = length === 'List' || length === 'Short'
  // Canonicalized (Eko, option A): geometry depends on `length` ONLY. Figma has
  // Two-line Default at 340 but Hover/Press at 360 (thumbs 44/44/44/42/42 → 48,
  // gap 12 → 8); List/Short are uniform across states. That drift is a Figma
  // hand-tune, not intent — here state changes the wash and nothing else.
  const shellGap = compact ? 8 : 12
  const chipsGap = compact ? 8 : 12
  const rowCount = length === 'Short' ? 3 : 5
  // Header carries an explicit 24px height on Two-line; List/Short hug the text.
  const headerHeight = compact ? undefined : 24
  const wash = state === 'Press' ? '#ababab' : state === 'Hover' ? '#c1c1c1' : null

  // Thumbnail: 38 on List/Short; 44 everywhere on Two-line, all three states.
  const thumbAt = (_i: number) => (compact ? 38 : 44)

  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: 200, overflow: 'hidden',
        // get_design_context emits NEITHER of these — both are bound variables,
        // only visible via get_variable_defs on 540:3435:
        //   bing/smtc/background/card/on-primary/alt/rest  #f5f5f5
        //   mai/smtc/corner/card/default                   24
        background: '#f5f5f5',
        borderRadius: 24,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', padding: 20, width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: shellGap }}>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center', width: '100%', height: headerHeight }}>
            {/* 540:3440 — a 16×16 Search instance at x=0,y=4, dropped entirely by
                get_design_context; found via get_metadata on the header 540:3439.
                540:3442 "Right props" is hidden="true" — deliberately not rendered. */}
            <Ico src="rs-card-search.svg" size={16} inset="9.375%" />
            <span
              style={{
                fontFamily: ROBOTO, fontWeight: 700, fontSize: 14, lineHeight: '22px',
                color: '#000000', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis',
              }}
            >
              Related Searches
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '100%', gap: chipsGap }}>
            {RS_ROWS.slice(0, rowCount).map(([line1, line2, inverted], i) => {
              const washed = wash !== null && i === 0
              const size = thumbAt(i)
              return (
                <div
                  key={i}
                  style={{
                    position: 'relative', display: 'flex', gap: 8, alignItems: 'center',
                    borderRadius: 8, width: '100%',
                    // the washed row must not clip its own -4px bleed
                    overflow: washed ? undefined : 'hidden',
                  }}
                >
                  {washed && (
                    <div
                      style={{
                        position: 'absolute', inset: -4, borderRadius: 8,
                        background: wash as string,
                      }}
                    />
                  )}
                  <div
                    style={{
                      position: 'relative', width: size, height: size, flex: '0 0 auto',
                      borderRadius: 8, overflow: 'hidden',
                      // Figma stroke is an INSIDE stroke — never a CSS border.
                      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
                    }}
                  >
                    <img
                      src={RS_THUMB}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                  <div
                    style={{
                      position: 'relative', flex: '1 0 0', minWidth: 1,
                      fontFamily: ROBOTO, fontSize: 13, lineHeight: '20px', color: '#000',
                    }}
                  >
                    {compact ? (
                      <p style={{ margin: 0, fontWeight: 600 }}>Minimal Decor</p>
                    ) : (
                      <>
                        <p style={{ margin: 0, fontWeight: inverted ? 400 : 700 }}>{line1}</p>
                        <p style={{ margin: 0, fontWeight: inverted ? 700 : 400 }}>{line2}</p>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
