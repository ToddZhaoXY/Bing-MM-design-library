/**
 * RS Pill — 1:1 rebuild from Figma (MM-ACF page 12:8, "RS Pill · NEW (Query Suggestion)").
 *
 * Source component is ACF's `Query suggestion` — NOT `Related search pill`.
 * (componentKey 9f86ca0c86ef94370dde37cb490d61609bfd9cbe, 8 variants, lives in the
 *  Answer Card Framework library. The old node id 467:31806 is STALE — Figma rejects it.)
 * Structure read off two real instances via get_design_context:
 *   482:33445  thumbnail=True / state=rest / short title  → 139×38
 *   482:33451  same, long title at maxWidth 250           → 250×38
 *
 * Figma tokens seen on the node:
 *   bg      smtc/background/ctrl/outline/rest      #ffffff
 *   stroke  smtc/stroke/ctrl/on-neutral/rest       rgba(0,0,0,0.1)  ← INSIDE stroke
 *   gap     smtc/gap/between/content/x-small       8
 *   pl      bing/smtc/padding/ctrl-xs/horizontal   4
 *   pr      smtc/padding/ctrl-lg/horizontal-default 16
 *   radius  smtc/corner/circular                   9999
 *   text    caption1 strong — Roboto Bold 13 / 20
 *
 * Figma emits React+Tailwind; this project uses inline styles (Tailwind NOT installed).
 */

const THUMB = 'figma/img/rs-pill-thumb.png'

const FONT = "Roboto, 'Segoe UI', system-ui, sans-serif"

export interface RSPillProps {
  state?: 'rest' | 'hover' | 'pressed' | 'focus'
  thumbnail?: boolean
  label?: string
  /** Figma property: the pill never grows past this; long titles truncate. */
  maxWidth?: number
  /** In a scroller the pills must keep their natural width instead of squeezing. */
  shrink?: boolean
  /** Live thumbnail. Falls back to the Figma export so the offline pill is 1:1. */
  thumbnailSrc?: string
  onClick?: () => void
}

/* ACF control states — READ from Figma variables via the Plugin API
   (importVariableByKeyAsync + recursive alias resolve), light mode:
     smtc/background/ctrl/outline/rest    → FY25/Gray/Light/FFFFFF        #ffffff
     smtc/background/ctrl/outline/hover   → [SNR] color/light-dark/66     #0000000d  (black 5%)
     smtc/background/ctrl/outline/pressed → [SNR] color/light-dark/67     #00000008  (black 3%)
     smtc/stroke/ctrl/on-neutral/rest     → Gray/Light/With Opacity/10%   #0000001a
     smtc/ctrl/focus/inner/stroke         → FFFFFF                        #ffffff
     smtc/ctrl/focus/outer/stroke         → 000000                        #000000

   Three things this read corrected:
   1. hover/pressed are TRANSLUCENT BLACK OVERLAYS on the white surface, not opaque greys.
   2. pressed (3%) is LIGHTER than hover (5%).
   3. the stroke does NOT ramp per state — one on-neutral/rest value on all four.
   Focus is a two-ring treatment, not a background change. */
import * as React from 'react'

const OVERLAY: Record<NonNullable<RSPillProps['state']>, string | null> = {
  rest: null,
  hover: 'rgba(0,0,0,0.05)',
  pressed: 'rgba(0,0,0,0.03)',
  focus: null,
}
const BASE_BG = '#ffffff'
const STROKE = 'rgba(0,0,0,0.1)'
const FOCUS_INNER = '#ffffff'
const FOCUS_OUTER = '#000000'

export function RSPill({
  state = 'rest',
  thumbnail = true,
  label = 'Requery Title',
  maxWidth = 250,
  shrink = true,
  thumbnailSrc,
  onClick,
}: RSPillProps) {
  // `state` is the seed (Workbench / spec rows). Online the pill actually responds:
  // real pointer + focus events drive it, so hovering a live pill shows the hover wash.
  const [live, setLive] = React.useState<RSPillProps['state']>(state)
  React.useEffect(() => setLive(state), [state])
  const overlay = OVERLAY[live ?? 'rest']
  return (
    <div
      role="button"
      tabIndex={0}
      onMouseEnter={() => setLive('hover')}
      onMouseLeave={() => setLive(state)}
      onMouseDown={() => setLive('pressed')}
      onMouseUp={() => setLive('hover')}
      onFocus={() => setLive('focus')}
      onBlur={() => setLive(state)}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick()
        }
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        height: 38,
        maxWidth,
        flex: shrink ? undefined : '0 0 auto',
        // pl 4 when the thumbnail is present; without it the left padding matches the right ramp
        padding: thumbnail ? '0 16px 0 4px' : '0 16px',
        borderRadius: 9999,
        // hover/pressed paint a translucent black overlay OVER the white surface —
        // layered background, not a swapped opaque colour.
        background: overlay
          ? `linear-gradient(${overlay}, ${overlay}), ${BASE_BG}`
          : BASE_BG,
        // Figma stroke is an INSIDE stroke — a CSS border would add 2px to the auto width.
        // Focus is a two-ring treatment: inner white ring inside the stroke, outer black ring outside.
        boxShadow:
          live === 'focus'
            ? `inset 0 0 0 1px ${STROKE}, 0 0 0 2px ${FOCUS_INNER}, 0 0 0 4px ${FOCUS_OUTER}`
            : `inset 0 0 0 1px ${STROKE}`,
        boxSizing: 'border-box',
        fontFamily: FONT,
        cursor: 'pointer',
        outline: 'none',
      }}
    >
      {thumbnail && (
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            width: 30,
            height: 30,
            flex: '0 0 auto',
            borderRadius: 9999,
            overflow: 'hidden',
          }}
        >
          <img
            src={thumbnailSrc || THUMB}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </span>
      )}
      <p
        style={{
          margin: 0,
          flex: '1 0 0',
          minWidth: 1,
          fontWeight: 700,
          fontSize: 13,
          lineHeight: '20px',
          color: '#000000',
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

export default RSPill
