import * as React from 'react'
import { Ico } from './Molecules'

/* MM / Filter — 621:14721. Per D1 only Approach=ACF Tokenization (621:14722) is
   canonical; ACF Alignment (621:14730) and Alignment vNext (621:16416) are not shipped. */

const FONT = "Roboto, 'Segoe UI', system-ui, sans-serif"

/* ── tokens read off the Figma export ─────────────────────────────── */
const CORNER_CTRL = 8 // smtc/corner/ctrl/rest
const CORNER_SM = 4 // smtc/corner/ctrl/sm/hover
const PAD_H = 12 // smtc/padding/ctrl/horizontal-default
const GAP_XXS = 2 // smtc/gap/between/content/xxx-small
const FG_ON_SUBTLE_REST = '#3c51b4' // smtc/foreground/ctrl/on-subtle/rest
const FG_ON_SUBTLE_HOVER = '#191919' // smtc/foreground/ctrl/on-subtle/hover
const BG_OUTLINE_DISABLED = '#f8f4f1' // smtc/background/ctrl/outline/disabled
const BG_SUBTLE_HOVER = '#efeae7' // smtc/background/ctrl/subtle/hover
const OVERLAY_BG = '#ffffff' // bing/smtc/background/with-material/overlay
const STROKE = 'inset 0 0 0 1px rgba(0,0,0,0.1)'
const SHADOW_TOOLTIP = '-5px 4px 12px 0px rgba(0,0,0,0.1)' // smtc/shadows/tooltip
const LINK_VISITED = '#4007a2' // bing/smtc/ctrl/link/foreground/brand/alt/visited

const CARET = { src: 'filter-caret-down.svg', size: 16, inset: '37.5% 31.25%' }
const CHECK = { src: 'filter-checkmark.svg', size: 16, inset: '20.31% 10.94% 23.43% 12.5%' }

/** Bar item labels, in Figma order (621:14723 … 621:14729). */
const FILTER_ITEMS = ['Image size', 'Color', 'Type', 'Layout', 'People', 'Date', 'License']

/* Swatch grid 621:14764 — 15 frames, 621:14777 (#7032F5) is hidden=true.
   Each frame is 24×24; the colour ellipse inside is 17.6 at inset 3.2 (621:14766),
   with a 0.8px inside stroke at black 10%. */
const SWATCHES = [
  '#FF4E4E', '#F87125', '#FFD43E', '#28CD6A', '#228EF2',
  '#555BE3', '#F4F4F4', '#E3C39D', '#A6A08B', '#899C76',
  '#805739', '#424740', '#2D352A', '#2C4180',
]

const TYPE_ITEMS = ['All', 'Photograph', 'Clipart', 'Line drawing', 'Animated GIF', 'Transparent']
const LICENSE_ITEMS = [
  'All',
  'All Creative Commons',
  'Public domain',
  'Free to share and use',
  'Free to share and use commercially',
  'Free to modify, share, and use',
  'Free to modify, share, and use commercially',
  'Conversation',
  'Learn more',
]

/* ── pieces ───────────────────────────────────────────────────────── */

/** The label wrapper every bar item and the selected pill share: pb/pt 8, px 2. */
function Label({ text, color }: { text: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '8px 2px' }}>
      <p
        style={{
          margin: 0,
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 13,
          lineHeight: '20px',
          color,
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </p>
    </div>
  )
}

function Swatch({ color, size = 24, selected }: { color: string; size?: number; selected?: boolean }) {
  const s = size / 24
  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        flex: '0 0 auto',
        borderRadius: 9999,
        boxShadow: selected
          ? `inset 0 0 0 ${2 * s}px ${FG_ON_SUBTLE_REST}`
          : `inset 0 0 0 ${0.8 * s}px rgba(0,0,0,0.1)`,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 17.6 * s,
          height: 17.6 * s,
          borderRadius: 9999,
          background: color,
        }}
      />
    </div>
  )
}

/** One bar item — 621:14723 … 621:14729. `selected` is the 621:14748 pill state. */
export function FilterItem({
  label,
  selected,
  swatches,
  open,
  onClick,
}: {
  label: string
  selected?: boolean
  swatches?: string[]
  open?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: GAP_XXS,
        height: 36,
        padding: `0 ${PAD_H}px`,
        borderRadius: CORNER_CTRL,
        overflow: 'hidden',
        flex: '0 0 auto',
        cursor: 'pointer',
        boxSizing: 'border-box',
        border: 'none',
        font: 'inherit',
        background: selected ? BG_OUTLINE_DISABLED : 'transparent',
      }}
    >
      <Label text={label} color={selected ? FG_ON_SUBTLE_HOVER : FG_ON_SUBTLE_REST} />
      {swatches?.map((c) => <Swatch key={c} color={c} size={16} />)}
      <span
        style={{
          display: 'inline-flex',
          transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform 120ms',
        }}
      >
        <Ico {...CARET} />
      </span>
    </button>
  )
}

/** Which bar items open a menu, and which menu shape. */
const MENUS: Record<string, 'color' | 'type' | 'license'> = {
  Color: 'color',
  Type: 'type',
  License: 'license',
}

/** 621:14722 — Approach=ACF Tokenization. Interactive: items open their menu below. */
export function FilterBar({ onLive }: { onLive?: (p: Record<string, string | number | boolean | string[]>) => void } = {}) {
  const [open, setOpen] = React.useState<string | null>(null)
  const [colors, setColors] = React.useState<string[]>([])
  const [picked, setPicked] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    const p: Record<string, string | number | boolean | string[]> = {}
    if (colors.length) p.colors = colors
    for (const [k, v] of Object.entries(picked)) p[k === 'Type' ? 'type' : 'license'] = v
    onLive?.(p)
  }, [colors, picked, onLive])

  return (
    <div
      style={{ position: 'relative', fontFamily: FONT }}
      onKeyDown={(e) => e.key === 'Escape' && setOpen(null)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {FILTER_ITEMS.map((l) => (
          <div key={l} style={{ position: 'relative' }}>
            <FilterItem
              label={picked[l] ?? l}
              selected={open === l || (l === 'Color' ? colors.length > 0 : Boolean(picked[l]))}
              swatches={l === 'Color' ? colors : undefined}
              open={open === l}
              onClick={() => setOpen(open === l ? null : l)}
            />
            {open === l && MENUS[l] && (
              <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 10 }}>
                {MENUS[l] === 'color' ? (
                  <FilterColorMenu
                    selected={colors}
                    onDone={() => setOpen(null)}
                    onToggle={(c) =>
                      setColors((prev) =>
                        prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
                      )
                    }
                  />
                ) : (
                  <FilterListMenu
                    property1={MENUS[l] === 'license' ? 'License' : 'Type'}
                    selected={picked[l] ?? 'All'}
                    onPick={(v) => {
                      setPicked((p) => {
                        const next = { ...p }
                        if (v === 'All') delete next[l]
                        else next[l] = v
                        return next
                      })
                      setOpen(null)
                    }}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/** 621:14748 — the selected state, 114 × 36. */
export function FilterPillSelected({ label = 'Color' }: { label?: string }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: GAP_XXS,
        height: 36,
        padding: `0 ${PAD_H}px`,
        borderRadius: CORNER_CTRL,
        overflow: 'hidden',
        background: BG_OUTLINE_DISABLED,
        boxSizing: 'border-box',
        fontFamily: FONT,
        cursor: 'pointer',
      }}
    >
      <Label text={label} color={FG_ON_SUBTLE_HOVER} />
      <Swatch color="#E3C39D" size={16} />
      <Swatch color="#A6A08B" size={16} />
      <Ico {...CARET} />
    </div>
  )
}

/** Shared menu shell — white overlay, 1px inside stroke, radius 8, tooltip shadow. */
function MenuShell({ width, children }: { width: number; children: React.ReactNode }) {
  return (
    <div
      style={{
        width,
        background: OVERLAY_BG,
        borderRadius: CORNER_CTRL,
        boxShadow: `${STROKE}, ${SHADOW_TOOLTIP}`,
        overflow: 'hidden',
        boxSizing: 'border-box',
        fontFamily: FONT,
      }}
    >
      {children}
    </div>
  )
}

/** 621:14757 — the colour swatch grid menu, 184 wide / max 250 tall. */
export function FilterColorMenu({
  selected = [],
  onToggle,
  onDone,
}: {
  selected?: string[]
  onToggle?: (c: string) => void
  onDone?: () => void
}) {
  return (
    <MenuShell width={184}>
      <div style={{ display: 'flex', flexDirection: 'column', maxHeight: 250, overflowY: 'auto', paddingTop: 8 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '0 4px' }}>
          {/* header 621:14760 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 13px 8px 8px',
            }}
          >
            <p
              style={{
                margin: 0,
                fontWeight: 400,
                fontSize: 11,
                lineHeight: '13px',
                color: 'rgba(0,0,0,0.75)',
                whiteSpace: 'nowrap',
              }}
            >
              Choose Color schemes
            </p>
            <button
              type="button"
              onClick={() => onDone?.()}
              aria-label="Done"
              style={{
                display: 'inline-flex',
                padding: 0,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                lineHeight: 0,
              }}
            >
              <Ico {...CHECK} />
            </button>
          </div>
          {/* swatch wrap 621:14764 */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
              alignItems: 'flex-start',
              paddingBottom: 16,
              paddingLeft: 8,
            }}
          >
            {SWATCHES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onToggle?.(c)}
                style={{
                  padding: 0,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  lineHeight: 0,
                  borderRadius: 9999,
                }}
              >
                <Swatch color={c} selected={selected.includes(c)} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </MenuShell>
  )
}

/** One list row — 621:14809 and siblings. Hover is live, not baked. */
function MenuRow({
  label,
  link,
  selected,
  onPick,
}: {
  label: string
  link?: boolean
  selected?: boolean
  onPick?: () => void
}) {
  const [hover, setHover] = React.useState(false)
  const lit = hover || selected
  return (
    <button
      type="button"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onPick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 12px',
        width: '100%',
        flexShrink: 0,
        borderRadius: CORNER_SM,
        background: lit ? BG_SUBTLE_HOVER : 'transparent',
        boxSizing: 'border-box',
        cursor: 'pointer',
        border: 'none',
        font: 'inherit',
        textAlign: 'left',
      }}
    >
      <p
        style={{
          margin: 0,
          flex: '1 0 0',
          minWidth: 1,
          fontFamily: FONT,
          fontWeight: 400,
          fontSize: 13,
          lineHeight: '20px',
          color: link ? LINK_VISITED : '#000000',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          wordBreak: 'break-word',
        }}
      >
        {label}
      </p>
      {selected && <Ico {...CHECK} />}
    </button>
  )
}

/** 621:14807 (Type, 200) and 621:14822 (License, 300). */
export function FilterListMenu({
  property1 = 'Type',
  selected,
  onPick,
}: {
  property1?: 'Type' | 'License'
  selected?: string
  onPick?: (v: string) => void
}) {
  const license = property1 === 'License'
  const items = license ? LICENSE_ITEMS : TYPE_ITEMS
  return (
    <MenuShell width={license ? 300 : 200}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '8px',
          boxSizing: 'border-box',
          width: '100%',
        }}
      >
        {items.map((l) => (
          <MenuRow
            key={l}
            label={l}
            link={license && l === 'Learn more'}
            selected={selected ? l === selected : l === 'All'}
            onPick={() => onPick?.(l)}
          />
        ))}
      </div>
    </MenuShell>
  )
}

/* ── the doc-page entry point ─────────────────────────────────────── */

export type FilterPart = 'Interactive' | 'Selected pill' | 'Color menu' | 'Type menu' | 'License menu'

export interface FilterProps {
  part?: FilterPart
}

/** Default is the live bar: click an item and its menu drops open below it.
    The other values isolate one piece for spec reference. */
export function Filter({ part = 'Interactive', onLive }: FilterProps & { onLive?: (p: Record<string, string | number | boolean | string[]>) => void }) {
  switch (part) {
    case 'Selected pill':
      return <FilterPillSelected />
    case 'Color menu':
      return <FilterColorMenu />
    case 'Type menu':
      return <FilterListMenu property1="Type" />
    case 'License menu':
      return <FilterListMenu property1="License" />
    default:
      return <FilterBar onLive={onLive} />
  }
}
