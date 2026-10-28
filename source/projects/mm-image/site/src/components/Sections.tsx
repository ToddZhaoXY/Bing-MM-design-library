import * as React from 'react'
import { Ico } from './Molecules'

/* MM / Section cells.

   Header = `Section / title`  — master 624:19364, instance 665:6759.
     Its own only property is `endProps?` BOOLEAN (Figma default true).
     The two children are themselves component sets:
       section Title   624:15713 — style = Clickable title | Text title | Copilot Branding
                                 + `show sub title?` BOOLEAN (default true)
       title End Props 624:19338 — Props = Sponsor | AI buttons | See more | Tabs | WP Tabs

   Footer = `Section / footer` — set 47:26427, instance 665:6836. Properties:
       click action = No action | Expansion: See less | Expansion: See more | Redirect
       Feedback     = Yes | No          Footnote = Yes | No        block? = false | true
       show Gradient BOOLEAN            Footnote link BOOLEAN
     Feedback itself is set 47:26404 — State = Default | Active - Liked | Active - Disliked.

   Read off Figma via the Plugin API (getMainComponentAsync → parent COMPONENT_SET) and
   re-verified 2026-07-30 against the Figma REST API: /v1/files/.../nodes returned the
   componentPropertyDefinitions above verbatim, and /v1/images rendered all four sets to
   PNG — remote library nodes DO render through REST even though the MCP node tools refuse.
   The rendered sets drove the visual corrections in this file.
   Caveat: REST returns empty `children` for these sets at every depth, so the concrete
   variant COUNT is still unverified — don't quote a number. */

const FONT = "Roboto, 'Segoe UI', system-ui, sans-serif"

/* ── Header ───────────────────────────────────────────────────────── */

const CHEVRON_RIGHT = {
  src: 'header-chevron-right.svg',
  size: 16,
  inset: '18.75% 31.25% 18.75% 34.38%',
}

/* Verified against the rendered component sets (Figma REST /v1/images, 2026-07-30):
   624:15713 · 624:19338 · 47:26427 · 47:26404. */

/* Active (liked/disliked) thumb fill. MEASURED, not guessed: pulled the Feedback set
   47:26404 at scale=4 through the Figma REST /v1/images endpoint and pixel-scanned it.
   3303 amber pixels, bbox @1x x 22.5 y 128.0 w 249.8 h 13.8; the glyph is a SOLID filled
   thumb. Saturated core samples cluster at #ffb926 / #ffbe28 / #ffc328 / #ffc548; the
   mean over n=1146 masked pixels is rgb(247,176,61) = #f7b03d, dragged down by
   anti-aliasing against white. Using the core value. (Was #e3a21a — a guess.) */
const ACTIVE_THUMB = '#ffb926'

export type TitleStyle = 'Clickable title' | 'Text title' | 'Copilot Branding'
export type EndProps = 'Sponsor' | 'AI buttons' | 'See more' | 'Tabs' | 'WP Tabs'

const GHOST_BTN: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 28,
  padding: '0 4px',
  background: 'transparent',
  border: 'none',
  font: 'inherit',
  cursor: 'pointer',
  boxSizing: 'border-box',
}

/* title End Props 624:19338 */
function TitleEndProps({
  kind,
  onLive,
}: {
  kind: EndProps
  onLive?: (p: Record<string, string | number | boolean | string[]>) => void
}) {
  // Tabs / WP Tabs are a real selection control online — Figma can only ship the
  // selected-index-0 variant, but a component library page should let you click.
  const [tab, setTab] = React.useState(0)
  // See more is a real toggle; the AI button row is a real (exclusive) action group.
  const [seeMoreOpen, setSeeMoreOpen] = React.useState(false)
  const [aiAction, setAiAction] = React.useState('')
  React.useEffect(() => {
    if (kind === 'Tabs' || kind === 'WP Tabs') onLive?.({ selectedTab: tab })
  }, [kind, tab, onLive])

  if (kind === 'Sponsor') {
    // 624:19339 — Sponsored Slug, 71 × 17, r4, bg #efeae7, padding 2/2/2/4
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: 71,
          height: 17,
          padding: '2px 2px 2px 4px',
          borderRadius: 4,
          background: '#efeae7',
          boxSizing: 'border-box',
        }}
      >
        <span style={{ fontSize: 11, lineHeight: '13px', color: '#605e5c' }}>Sponsored</span>
        {/* Overflow glyph, MEASURED off the 4× render of 624:19339: three dots in one
            2px-wide column whose centres sit at x 63 of the 71-wide slug (so 6 inside a
            12-wide box) and at y 5.4 / 8.4 / 11.4. Ink colour #605e5c, same as the label. */}
        <svg width="12" height="16" viewBox="0 0 12 16" fill="none" aria-hidden="true">
          <circle cx="6" cy="5" r="0.9" fill="#605e5c" />
          <circle cx="6" cy="8" r="0.9" fill="#605e5c" />
          <circle cx="6" cy="11" r="0.9" fill="#605e5c" />
        </svg>
      </div>
    )
  }
  if (kind === 'See more') {
    /* 624:19346 — ghost Button, 89 × 28, r4. Geometry from node.exportAsync SVG
       (viewBox 0 0 89 28), cross-checked against the pixel-scanned 4× render:
         · ink colour #0159BA throughout (NOT the title link's #0f6cbd — the same
           foreground token resolves differently in this scope)
         · label outlines run x 8.5 → 62.25, so the label sits at 8px from the left edge
         · the trailing chevron ink is x 72.40 → 78.07, y 8.90 → 19.08 — i.e. a 16 × 16
           icon box vertically centred in the 28 (box y 6 → 22, glyph centred at y 14)
       The export also carries a 12px ring outline at x 8 → 20 (an iconStart slot). It
       does not appear in the rasterised render at all, so it is a hidden layer — same
       situation as the stray circles in the Tabs export — and is not reproduced.
       The chevron is drawn in the button's own 89 × 28 coordinate space rather than a
       local 16-box so the exported path can be used verbatim, with no re-derived offset. */
    const SEE_MORE_BLUE = '#0159ba'
    return (
      <button
        type="button"
        onClick={() => {
          const next = !seeMoreOpen
          setSeeMoreOpen(next)
          onLive?.({ seeMoreExpanded: next })
        }}
        style={{
          ...GHOST_BTN,
          position: 'relative',
          justifyContent: 'flex-start',
          width: 89,
          padding: '0 0 0 8px',
          borderRadius: 4,
        }}
      >
        <span style={{ fontSize: 14, lineHeight: '22px', fontWeight: 400, color: SEE_MORE_BLUE }}>
          {seeMoreOpen ? 'See less' : 'See more'}
        </span>
        <svg
          width="89"
          height="28"
          viewBox="0 0 89 28"
          fill="none"
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            pointerEvents: 'none',
            transform: seeMoreOpen ? 'rotate(180deg)' : undefined,
            transformOrigin: '75px 14px',
          }}
        >
          <path
            d="M72.7397 9.20041C72.4361 9.48226 72.4186 9.95681 72.7004 10.2603L76.2265 14L72.7004 17.7397C72.4186 18.0432 72.4361 18.5177 72.7397 18.7996C73.0432 19.0815 73.5177 19.0639 73.7996 18.7603L77.7996 14.5103C78.0668 14.2226 78.0668 13.7774 77.7996 13.4897L73.7996 9.23966C73.5177 8.93613 73.0432 8.91856 72.7397 9.20041Z"
            fill={SEE_MORE_BLUE}
          />
        </svg>
      </button>
    )
  }
  if (kind === 'AI buttons') {
    /* 624:19341 — four 28 × 28 icon-only ghost Buttons, r8: thumb-up, thumb-down, copy,
       Copilot-sparkle.
       The path data below is a REAL EXPORT, not hand-drawn. REST cannot read this set
       (`remote: true` — the master lives in another library file, so children/geometry
       come back empty and format=svg returns null). The Plugin API can:
         node.exportAsync({ format: 'SVG' }) on each Button instance.
       Each export is a 28 × 28 SVG whose FIRST path (fill="black" fill-opacity="0.6")
       is the icon; later paths are the button's label + chevron sitting at x > 27,
       outside the 28-wide box, so they are dropped here.
       These are FILLS in the button's own 28 × 28 coordinate space — not 16 × 16 strokes.
       Ink = rgba(0,0,0,0.6), which matches the earlier pixel scan (max alpha 153/255). */
    const S = 'rgba(0,0,0,0.6)'
    const S_ON = '#0159ba'
    const LABELS = ['Like', 'Dislike', 'Copy', 'Ask Copilot']
    const paths = [
      'M14.0349 7.92332C14.2441 7.40248 14.8301 6.843 15.5806 7.0516C16.1709 7.21566 16.5544 7.57258 16.7735 8.04807C16.9778 8.49126 17.028 9.01293 17.0375 9.51008C17.0478 10.0448 16.9361 10.6864 16.8047 11.2475C16.7434 11.5091 16.6759 11.7612 16.6099 11.9878H17.9949C19.3298 11.9878 20.29 13.2705 19.9139 14.5513L18.5497 19.1973C18.1555 20.5397 16.7365 21.2974 15.4018 20.8781L10.0459 19.1958C9.45891 19.0114 8.98944 18.5671 8.77304 17.9912L8.25304 16.6072C7.91142 15.698 8.27244 14.6747 9.109 14.1812L10.9809 13.0768C10.9846 13.0742 10.99 13.0704 10.997 13.0652C11.0176 13.05 11.052 13.0236 11.0984 12.9843C11.1909 12.9059 11.3313 12.7758 11.5035 12.5815C11.8476 12.1935 12.3214 11.5463 12.7956 10.537C13.0005 10.1011 13.1729 9.75833 13.3294 9.44707C13.5824 8.94395 13.7941 8.52303 14.0349 7.92332ZM11.5195 13.9197C11.5138 13.9233 11.508 13.9269 11.5022 13.9303L9.61713 15.0425C9.19885 15.2892 9.01834 15.8009 9.18915 16.2555L9.70914 17.6394C9.81735 17.9274 10.0521 18.1496 10.3456 18.2418L15.7015 19.9241C16.5023 20.1756 17.3537 19.721 17.5902 18.9156L18.9544 14.2695C19.1424 13.6291 18.6623 12.9878 17.9949 12.9878H15.9259C15.7635 12.9878 15.6112 12.9089 15.5175 12.7763C15.4238 12.6437 15.4004 12.4738 15.4546 12.3208C15.5546 12.0387 15.7067 11.55 15.831 11.0194C15.9571 10.4813 16.0456 9.93709 16.0377 9.52931C16.0287 9.061 15.9791 8.71335 15.8654 8.46667C15.7665 8.25227 15.6138 8.09874 15.3128 8.01508C15.2697 8.0031 15.2195 8.0066 15.1535 8.04989C15.0815 8.09718 15.0078 8.18417 14.9629 8.29598C14.7092 8.92772 14.4665 9.41157 14.1979 9.94711C14.0431 10.2556 13.8797 10.5813 13.7007 10.9623C13.1868 12.0559 12.6607 12.7837 12.2518 13.2449C12.0475 13.4753 11.8731 13.6385 11.7451 13.7471C11.6811 13.8013 11.6288 13.8419 11.5901 13.8703C11.5708 13.8846 11.5549 13.8958 11.5428 13.9041L11.5273 13.9146L11.5217 13.9182L11.5195 13.9197ZM10.9761 13.0802L10.9749 13.081Z',
      'M16.5776 15.9995C16.5944 16.133 16.6119 16.2848 16.6283 16.45C16.7019 17.1893 16.7593 18.2428 16.6146 19.1274C16.5427 19.5666 16.4137 20.0141 16.1727 20.3636C15.9161 20.7357 15.526 20.9995 15.0002 20.9995C14.4836 20.9995 14.1691 20.6298 13.9762 20.3084C13.7838 19.9879 13.6153 19.553 13.4427 19.1078L13.4296 19.0739C12.8829 17.6637 12.1352 15.7571 10.1232 14.4157C9.81627 14.2111 9.5248 14.0639 9.26989 13.9582C8.5733 13.6693 7.94781 12.901 8.11258 12.0217L8.33656 10.8263C8.47706 10.0764 9.03196 9.47175 9.76706 9.26756L14.7171 7.89254C16.6934 7.34358 18.716 8.60391 19.0939 10.6198L19.5475 13.0388C19.836 14.5773 18.6557 15.9995 17.0903 15.9995H16.5776ZM18.1111 10.8041C17.8411 9.36418 16.3964 8.46395 14.9848 8.85605L10.0347 10.2311C9.66715 10.3332 9.38971 10.6355 9.31945 11.0104L9.09548 12.2058C9.04235 12.4893 9.2566 12.8701 9.65293 13.0344C9.96222 13.1627 10.312 13.3397 10.6779 13.5837C12.9648 15.1083 13.8065 17.2795 14.3539 18.6916L14.362 18.7124C14.5515 19.2014 14.6907 19.5556 14.8336 19.7938C14.9027 19.909 14.9544 19.9644 14.9852 19.9886C14.9933 19.995 14.9986 19.9981 15.0012 19.9995C15.1431 19.9992 15.2464 19.9453 15.3495 19.7959C15.4685 19.6233 15.5658 19.3445 15.6277 18.966C15.7504 18.2154 15.7048 17.2689 15.6332 16.549C15.6048 16.2636 15.5731 16.0209 15.5486 15.8502C15.5364 15.7649 15.5259 15.6977 15.5187 15.6523L15.5103 15.6012L15.5082 15.5888L15.5077 15.5861C15.4823 15.4406 15.5224 15.2909 15.6173 15.1779C15.6688 15.1166 15.7336 15.0693 15.8056 15.0389C15.8665 15.0132 15.9325 14.9995 16.0002 14.9995H17.0903C18.0295 14.9995 18.7377 14.1462 18.5646 13.2231L18.1111 10.8041Z',
      'M10.0003 10.0852L10 16.5C10 17.8255 11.0315 18.91 12.3356 18.9947L12.5 19L16.9144 19.0007C16.7083 19.5829 16.1528 20 15.5 20H12C10.3431 20 9 18.6569 9 17V11.5C9 10.8468 9.41754 10.2911 10.0003 10.0852ZM17.5 8C18.3284 8 19 8.67157 19 9.5V16.5C19 17.3284 18.3284 18 17.5 18H12.5C11.6716 18 11 17.3284 11 16.5V9.5C11 8.67157 11.6716 8 12.5 8H17.5ZM17.5 9H12.5C12.2239 9 12 9.22386 12 9.5V16.5C12 16.7761 12.2239 17 12.5 17H17.5C17.7761 17 18 16.7761 18 16.5V9.5C18 9.22386 17.7761 9 17.5 9Z',
      'M16.8777 6.28225L17.226 7.35305C17.3343 7.67859 17.5171 7.97441 17.7599 8.21699C18.0026 8.45957 18.2987 8.64223 18.6245 8.75044L19.6961 9.09845L19.7175 9.10381C19.8001 9.13292 19.8716 9.18692 19.9222 9.25836C19.9728 9.3298 20 9.41516 20 9.50268C20 9.5902 19.9728 9.67556 19.9222 9.747C19.8716 9.81844 19.8001 9.87244 19.7175 9.90155L18.6459 10.2496C18.3201 10.3578 18.0241 10.5404 17.7813 10.783C17.5385 11.0256 17.3558 11.3214 17.2475 11.647L16.8992 12.7178C16.87 12.8003 16.816 12.8717 16.7445 12.9223C16.673 12.9729 16.5876 13 16.5 13C16.4124 13 16.327 12.9729 16.2555 12.9223C16.2484 12.9173 16.2416 12.9121 16.2349 12.9068C16.1736 12.8576 16.1271 12.7922 16.1008 12.7178L15.7526 11.647C15.7338 11.5901 15.7128 11.5342 15.6897 11.4793C15.5796 11.2187 15.4202 10.9812 15.2197 10.78C15.1815 10.7417 15.1421 10.705 15.1014 10.6697C14.883 10.4806 14.6292 10.3359 14.3541 10.2442L13.2825 9.8962C13.1999 9.86708 13.1284 9.81308 13.0778 9.74164C13.0272 9.6702 13 9.58484 13 9.49733C13 9.40981 13.0272 9.32445 13.0778 9.25301C13.1284 9.18157 13.1999 9.12757 13.2825 9.09845L14.3541 8.75044C14.6759 8.63941 14.9677 8.45549 15.2066 8.21307C15.4454 7.97065 15.625 7.67631 15.7311 7.35305L16.0794 6.28225C16.1085 6.19972 16.1626 6.12825 16.2341 6.0777C16.3056 6.02715 16.391 6 16.4786 6C16.5661 6 16.6516 6.02715 16.7231 6.0777C16.7946 6.12825 16.8486 6.19972 16.8777 6.28225ZM21.7829 14.2132L21.0175 13.9646C20.7848 13.8873 20.5733 13.7568 20.3999 13.5836C20.2265 13.4103 20.0959 13.199 20.0186 12.9665L19.7698 12.2016C19.749 12.1427 19.7104 12.0916 19.6593 12.0555C19.6083 12.0194 19.5473 12 19.4847 12C19.4221 12 19.3611 12.0194 19.31 12.0555C19.259 12.0916 19.2204 12.1427 19.1996 12.2016L18.9508 12.9665C18.875 13.1974 18.7467 13.4076 18.5761 13.5808C18.4055 13.7539 18.1971 13.8853 17.9672 13.9646L17.2018 14.2132C17.1428 14.234 17.0917 14.2725 17.0555 14.3236C17.0194 14.3746 17 14.4356 17 14.4981C17 14.5606 17.0194 14.6216 17.0555 14.6726C17.0917 14.7236 17.1428 14.7622 17.2018 14.783L17.9672 15.0316C18.2003 15.1093 18.412 15.2403 18.5855 15.4143C18.7589 15.5882 18.8893 15.8003 18.9661 16.0335L19.2149 16.7984C19.2357 16.8574 19.2743 16.9084 19.3254 16.9445C19.3764 16.9806 19.4374 17 19.5 17C19.5626 17 19.6236 16.9806 19.6746 16.9445C19.7257 16.9084 19.7643 16.8574 19.7851 16.7984L20.0339 16.0335C20.1113 15.801 20.2418 15.5897 20.4152 15.4164C20.5886 15.2432 20.8001 15.1127 21.0328 15.0354L21.7982 14.7868C21.8572 14.766 21.9083 14.7275 21.9445 14.6764C21.9806 14.6254 22 14.5644 22 14.5019C22 14.4394 21.9806 14.3784 21.9445 14.3274C21.9083 14.2764 21.8572 14.2378 21.7982 14.217L21.7829 14.2132ZM18.7561 17.7696C18.975 17.9189 19.2333 17.999 19.5018 18C19.5885 17.9998 19.6743 17.9944 19.758 17.9818C18.4944 19.8055 16.3867 21 14 21C10.134 21 7 17.866 7 14C7 10.134 10.134 7 14 7C14.2644 7 14.5254 7.01466 14.7822 7.04321C14.7221 7.22305 14.6221 7.38292 14.4923 7.51287C14.3621 7.64308 14.202 7.75326 14.0419 7.80334L13.3065 8.03965C10.3194 8.38345 8 10.9209 8 14C8 17.3137 10.6863 20 14 20C15.9049 20 17.6025 19.1123 18.7016 17.7279C18.7194 17.7422 18.7375 17.7561 18.7561 17.7696ZM13.4387 11.0029L14.0318 11.1989C14.182 11.249 14.3221 11.3291 14.5023 11.4894C14.5757 11.5628 14.6402 11.6451 14.7017 11.7601C14.596 12.0456 14.3213 12.2491 13.999 12.2491C13.5854 12.2491 13.25 11.9137 13.25 11.5C13.25 11.3093 13.3213 11.1352 13.4387 11.0029ZM13.999 13C14.2752 13 14.499 13.2238 14.499 13.5V16.5C14.499 16.7761 14.2752 17 13.999 17C13.7229 17 13.499 16.7761 13.499 16.5V13.5C13.499 13.2238 13.7229 13 13.999 13Z',
    ]
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {paths.map((d, i) => {
          // Thumb up / down are one exclusive pair; copy and sparkle are momentary.
          const on = aiAction === LABELS[i]
          return (
            <button
              key={i}
              type="button"
              aria-label={LABELS[i]}
              aria-pressed={i < 2 ? on : undefined}
              onClick={() => {
                const next = on ? '' : LABELS[i]
                setAiAction(next)
                onLive?.({ aiAction: next })
              }}
              style={{
                ...GHOST_BTN,
                width: 28,
                borderRadius: 8,
                background: on ? 'rgba(0,0,0,0.05)' : 'transparent',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <path d={d} fill={on ? S_ON : S} />
              </svg>
            </button>
          )
        })}
      </div>
    )
  }
  /* Tabs 624:19348 (268 × 36) / WP Tabs 624:19355 (369 × 46) wrap a `Basic` tab strip from
     the ACF library. These are `remote: true`, so REST returns no geometry — the numbers
     below come from node.exportAsync({format:'SVG'}) on each variant (real vector),
     cross-checked against a 4× REST render that was pixel-scanned for colour + x-runs.
       Tabs    — four 61 × 36 pills at x 0/69/138/207 (gap 8), squircle corner r16.
                 selected  bg #D7D7D7, label fill black (NOT bold — the selected and rest
                           label outlines are the same glyph set), + a 20 × 3 r1.5
                           underline at x20.5 y33 filled #272320.
                 rest      bg #F8F4F1, label black @ 0.6 (composites to #636260 on that bg)
       WP Tabs — first pill 89 × 46, rest 62 × 46 at x 97/167/237/307 (gap 8), r23 (pill).
                 selected  bg #EFEAE7, no stroke, label #0159BA
                 rest      transparent + rgba(0,0,0,0.1) hairline, label #3C51B4
     The exports also carry a black circle per tab and a duplicate underline path; neither
     appears in the rasterised render (the black pixel budget in the scan only covers the
     selected label + one underline), so they are hidden layers and are not reproduced. */
  const wp = kind === 'WP Tabs'
  const labels = wp
    ? ['Overview', 'label', 'label', 'label', 'label']
    : ['label', 'label', 'label', 'label']
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: wp ? 46 : 36 }}>
      {labels.map((l, i) => {
        const sel = i === tab
        return (
          <span
            key={i}
            onClick={() => setTab(i)}
            role="tab"
            aria-selected={sel}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              // width follows the LABEL (first pill is "Overview"), not the selection —
              // Figma only ever shipped selected-index-0, which conflated the two.
              width: wp ? (i === 0 ? 89 : 62) : 61,
              height: wp ? 46 : 36,
              borderRadius: wp ? 23 : 16,
              background: sel ? (wp ? '#efeae7' : '#d7d7d7') : wp ? 'transparent' : '#f8f4f1',
              // Figma stroke is an INSIDE stroke — inset shadow, never a CSS border.
              boxShadow: wp && !sel ? 'inset 0 0 0 1px rgba(0,0,0,0.1)' : undefined,
              fontSize: 14,
              lineHeight: '22px',
              fontWeight: 400,
              color: wp ? (sel ? '#0159ba' : '#3c51b4') : sel ? '#000' : '#636260',
              cursor: 'pointer',
              boxSizing: 'border-box',
            }}
          >
            {l}
            {!wp && sel && (
              <span style={{ width: 20, height: 3, borderRadius: 1.5, background: '#272320' }} />
            )}
          </span>
        )
      })}
    </div>
  )
}

function CopilotMark() {
  // 624:15720 — Copilot Search logo lockup, 134 × 16
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <svg width="18" height="16" viewBox="0 0 18 16" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="cp" x1="0" y1="0" x2="18" y2="16" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2870EA" />
            <stop offset="1" stopColor="#1B4AEF" />
          </linearGradient>
        </defs>
        <path
          d="M4.4 2.4h6.1c1.6 0 2.6.9 3 2.4l1.1 4c.4 1.6-.5 2.8-2.1 2.8H6.4c-1.6 0-2.6-.9-3-2.4l-1.1-4C1.9 3.6 2.8 2.4 4.4 2.4Z"
          fill="url(#cp)"
        />
      </svg>
      <span style={{ fontSize: 16, lineHeight: '26px', fontWeight: 700, color: '#000' }}>
        Copilot Search
      </span>
    </div>
  )
}

export function Header({
  title = 'Image of Living Room',
  subtitle = 'Sub title lorem ipsum dolor sit amet',
  style: titleStyle = 'Clickable title',
  showSubTitle = true,
  showChevron = true,
  endProps = false,
  endPropsType = 'Sponsor',
  onLive,
}: {
  title?: string
  subtitle?: string
  style?: TitleStyle
  showSubTitle?: boolean
  showChevron?: boolean
  endProps?: boolean
  endPropsType?: EndProps
  onLive?: (p: Record<string, string | number | boolean | string[]>) => void
}) {
  const copilot = titleStyle === 'Copilot Branding'
  const clickable = titleStyle === 'Clickable title'
  // Clickable title is a real affordance: it presses. Figma has no press state on
  // the title, so this is a live-only hover/press treatment, not a Figma variant.
  const [pressed, setPressed] = React.useState(false)

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8, // smtc/gap/between/content/x-small
        alignItems: 'center',
        alignContent: 'center', // Figma `content-center` = align-content, not justify-content
        width: '100%',
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          flex: '1 0 0',
          minWidth: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        {copilot ? (
          <CopilotMark />
        ) : (
          <>
            <div
              role={clickable ? 'link' : undefined}
              tabIndex={clickable ? 0 : undefined}
              onMouseDown={clickable ? () => setPressed(true) : undefined}
              onMouseUp={clickable ? () => setPressed(false) : undefined}
              onMouseLeave={clickable ? () => setPressed(false) : undefined}
              onClick={clickable ? () => onLive?.({ titleClicked: true }) : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: clickable ? 'pointer' : 'default',
                opacity: clickable && pressed ? 0.6 : 1,
                outline: 'none',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  minWidth: 1,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontWeight: 700, // text/style/default/header/weight
                    fontSize: 20, // text/global/subtitle1/fontSize
                    lineHeight: '26px', // text/global/subtitle1/lineHeight
                    color: '#000000', // smtc/foreground/ctrl/neutral/primary/rest
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    wordBreak: 'break-word',
                    fontVariationSettings: '"wdth" 100',
                  }}
                >
                  {title}
                </p>
              </div>
              {clickable && showChevron && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 4, // icon-only text-top/bottom + to-secondary-icon
                    borderRadius: 4, // smtc/corner/ctrl/sm/hover
                  }}
                >
                  <Ico {...CHEVRON_RIGHT} />
                </div>
              )}
            </div>
            {showSubTitle && (
              <p
                style={{
                  margin: 0,
                  fontWeight: 400,
                  fontSize: 14, // text/global/body3
                  lineHeight: '22px',
                  color: 'rgba(0,0,0,0.75)',
                }}
              >
                {subtitle}
              </p>
            )}
          </>
        )}
      </div>

      {/* 624:19338 "title End Props" — gated by the master's `endProps?` boolean. */}
      {endProps && <TitleEndProps kind={endPropsType} onLive={onLive} />}
    </div>
  )
}

/* ── Footer ───────────────────────────────────────────────────────── */

const CHEVRON_DOWN = {
  src: 'footer-chevron-down.svg',
  size: 16,
  inset: '34.38% 18.75% 31.25% 18.75%',
}

const BG_SUBTLE_REST = '#f8f4f1' // bing/smtc/background/ctrl/subtle/rest
const FG_ON_SUBTLE_REST = '#0159ba' // smtc/foreground/ctrl/on-subtle/rest (footer scope)
const FG_LINK = '#3c51b4' // footnote Link — rgb(60,81,180)

export type ClickAction = 'No action' | 'Expansion: See less' | 'Expansion: See more' | 'Redirect'
export type FeedbackState = 'Default' | 'Active - Liked' | 'Active - Disliked'

/* Button label is carried by the Button instance per click action. */
const ACTION_LABEL: Record<Exclude<ClickAction, 'No action'>, string> = {
  Redirect: 'See all',
  'Expansion: See more': 'See more',
  'Expansion: See less': 'See less',
}

function Divider({ flip }: { flip: 'x' | 'y' }) {
  return (
    <div
      style={{
        // Figma marks the divider cell `relative` — it must paint above the
        // absolutely-positioned Gradient sibling, not under it.
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          transform: flip === 'x' ? 'rotate(180deg)' : 'scaleY(-1)',
        }}
      >
        <img
          src="figma/icon/footer-divider.svg"
          alt=""
          style={{ display: 'block', width: '100%', height: 1 }}
        />
      </div>
    </div>
  )
}

/* Feedback Button 16 × 16.
   The glyph is the real ACF thumb export (thumb-dislike.svg, 11.5051 × 13.2358),
   an OUTLINE thumb — not the solid blob this used to hand-draw. Like = the same
   path rotated 180°. The art sits centred in the 16 box at its own aspect ratio;
   sizing the <img>/<svg> to 16 × 16 would stretch it. */
const THUMB_PATH =
  'M8.4917 8.23584C8.50845 8.36929 8.52594 8.52109 8.54238 8.68635C8.61592 9.4256 8.67332 10.4791 8.52864 11.3637C8.45681 11.8029 8.32778 12.2504 8.08679 12.5999C7.83015 12.9721 7.44011 13.2358 6.91423 13.2358C6.39763 13.2358 6.08313 12.8661 5.89022 12.5447C5.6979 12.2242 5.52934 11.7893 5.35677 11.3441L5.34364 11.3102C4.79693 9.90004 4.04928 7.9934 2.03727 6.65206C1.73033 6.44744 1.43886 6.30019 1.18395 6.19448C0.487365 5.90563 -0.138124 5.13738 0.0266447 4.25798L0.25062 3.0626C0.391124 2.31271 0.946022 1.70808 1.68113 1.50388L6.63119 0.128865C8.60743 -0.420089 10.63 0.84024 11.008 2.85617L11.4616 5.27512C11.75 6.81366 10.5697 8.23584 9.00437 8.23584H8.4917ZM10.0251 3.04046C9.75514 1.60051 8.31043 0.700273 6.89884 1.09238L1.94877 2.4674C1.58122 2.5695 1.30377 2.87182 1.23352 3.24676L1.00954 4.44214C0.956416 4.72567 1.17066 5.1064 1.567 5.27075C1.87629 5.39901 2.22604 5.57607 2.59197 5.82001C4.87886 7.34461 5.72054 9.51582 6.26794 10.9279L6.27603 10.9488C6.46558 11.4377 6.60473 11.792 6.74765 12.0301C6.81681 12.1453 6.86845 12.2007 6.89925 12.2249C6.90736 12.2313 6.91268 12.2345 6.9153 12.2358C7.05717 12.2356 7.16049 12.1816 7.26356 12.0322C7.38255 11.8596 7.47985 11.5808 7.54175 11.2023C7.66451 10.4517 7.6189 9.50524 7.54729 8.78534C7.5189 8.49996 7.4872 8.25727 7.46268 8.08649C7.45043 8.00118 7.44001 7.93402 7.43273 7.88868L7.42435 7.83755L7.42225 7.82517L7.42178 7.82242C7.39634 7.67696 7.43642 7.52726 7.53141 7.4142C7.5829 7.35292 7.64765 7.30567 7.71966 7.27525C7.78053 7.24954 7.84658 7.23584 7.91423 7.23584H9.00437C9.94358 7.23584 10.6518 6.38253 10.4787 5.45941L10.0251 3.04046Z'

function Thumb({
  down,
  filled,
  onClick,
}: {
  down?: boolean
  filled?: boolean
  onClick?: () => void
}) {
  return (
    <span
      role={onClick ? 'button' : undefined}
      aria-pressed={onClick ? Boolean(filled) : undefined}
      aria-label={onClick ? (down ? 'Dislike' : 'Like') : undefined}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 16,
        height: 16,
        cursor: 'pointer',
      }}
    >
      <svg
        width="11.5051"
        height="13.2358"
        viewBox="0 0 11.5051 13.2358"
        fill="none"
        aria-hidden="true"
        style={{ display: 'block', transform: down ? undefined : 'rotate(180deg)' }}
      >
        <path d={THUMB_PATH} fill={filled ? ACTIVE_THUMB : 'rgba(0,0,0,0.6)'} />
      </svg>
    </span>
  )
}

/* Feedback — set 47:26404. Default 87 × 16 gap 4; Active-Liked 120 × 16 gap 2.
   `state` is the INITIAL state; online the thumbs actually toggle. Clicking Like
   walks Default → Active - Liked, clicking again walks back. */
export function Feedback({
  state = 'Default',
  onLive,
}: {
  state?: FeedbackState
  onLive?: (p: Record<string, string | number | boolean | string[]>) => void
}) {
  const [live, setLive] = React.useState<FeedbackState>(state)
  React.useEffect(() => setLive(state), [state])
  const pick = (next: FeedbackState) => {
    const v = live === next ? 'Default' : next
    setLive(v)
    onLive?.({ feedbackState: v })
  }
  const label: React.CSSProperties = {
    margin: 0,
    fontSize: 11,
    lineHeight: '13px',
    fontWeight: 400,
    whiteSpace: 'nowrap',
  }
  if (live === 'Active - Liked') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 16, fontFamily: FONT }}>
        <Thumb filled onClick={() => pick('Active - Liked')} />
        <p style={{ ...label, color: 'rgba(0,0,0,0.75)' }}>Thanks!</p>
        <p style={{ ...label, color: FG_LINK, cursor: 'pointer' }}>Tell us more</p>
      </div>
    )
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 16, fontFamily: FONT }}>
      <p style={{ ...label, color: 'rgba(0,0,0,0.6)' }}>Feedback</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Thumb onClick={() => pick('Active - Liked')} />
        <Thumb
          down
          filled={live === 'Active - Disliked'}
          onClick={() => pick('Active - Disliked')}
        />
      </div>
    </div>
  )
}

export function Footer({
  label,
  clickAction = 'Redirect',
  block = false,
  footnote = true,
  footnoteText = 'footnote',
  footnoteLink = true,
  linkText = 'Link',
  feedback = true,
  feedbackState = 'Default',
  showGradient = true,
  onLive,
}: {
  label?: string
  clickAction?: ClickAction
  block?: boolean
  footnote?: boolean
  footnoteText?: string
  footnoteLink?: boolean
  linkText?: string
  feedback?: boolean
  feedbackState?: FeedbackState
  showGradient?: boolean
  onLive?: (p: Record<string, string | number | boolean | string[]>) => void
}) {
  // `clickAction` seeds the button; the two Expansion actions are two ends of ONE
  // toggle, so clicking See more flips to See less and vice versa.
  const [action, setAction] = React.useState<ClickAction>(clickAction)
  React.useEffect(() => setAction(clickAction), [clickAction])
  const expandable = action === 'Expansion: See more' || action === 'Expansion: See less'
  const onButton = () => {
    if (!expandable) return
    const next: ClickAction =
      action === 'Expansion: See more' ? 'Expansion: See less' : 'Expansion: See more'
    setAction(next)
    onLive?.({ clickAction: next })
  }

  const hasButton = action !== 'No action'
  const buttonLabel =
    label ?? (hasButton ? ACTION_LABEL[action as Exclude<ClickAction, 'No action'>] : '')

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4, // smtc/gap/between/content/xx-small
        alignItems: 'center',
        width: '100%',
        fontFamily: FONT,
      }}
    >
      {hasButton && (
        <div
          style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gridTemplateRows: 'repeat(1, fit-content(100%))',
            columnGap: 24, // smtc/gap/between/content/x-large
            rowGap: 24,
            width: '100%',
          }}
        >
          {showGradient && (
            /* bing/smtc/background/ctrl/fade/on-primary/gradient — the fade that
               dissolves the clipped waterfall into the footer.

               Figma ships this as a 649 × 80 PNG, but painting it with object-cover
               into a 1208-wide slot scales it 1.86× and crops away both ends of the
               ramp: the top never reaches alpha 0 and the bottom never reaches solid
               white, so the fade reads as a flat grey band instead of a dissolve.
               The PNG is pure #fff with alpha climbing 1 → 255 over its first ~60%
               and holding 255 below that, so a CSS gradient reproduces it exactly
               and is resolution-independent. Vertical only — no horizontal
               component — so the scaleX(-1) Figma applies is a no-op here. */
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: -62,
                height: 80,
                pointerEvents: 'none',
                background:
                  'linear-gradient(to bottom,' +
                  ' rgba(255,255,255,0) 0%,' +
                  ' rgba(255,255,255,0.17) 10%,' +
                  ' rgba(255,255,255,0.34) 20%,' +
                  ' rgba(255,255,255,0.51) 30%,' +
                  ' rgba(255,255,255,0.67) 40%,' +
                  ' rgba(255,255,255,0.84) 50%,' +
                  ' rgba(255,255,255,1) 60%,' +
                  ' rgba(255,255,255,1) 100%)',
              }}
            />
          )}

          {/* block? = true removes both dividers and lets the Button span all 4 columns. */}
          {!block && <Divider flip="x" />}

          <button
            type="button"
            onClick={onButton}
            style={{
              // Figma marks the Button `relative` — paints above the Gradient.
              position: 'relative',
              gridColumn: block ? '1 / span 4' : '2 / span 2',
              justifySelf: 'stretch',
              height: 38,
              maxHeight: 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 8px', // smtc/padding/ctrl-sm/horizontal-default
              borderRadius: 8, // smtc/corner/ctrl/rest
              background: BG_SUBTLE_REST,
              border: 'none',
              font: 'inherit',
              boxSizing: 'border-box',
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4, // smtc/gap/between/content/xx-small
                padding: '0 2px', // smtc/padding/content/xxx-small
              }}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 2px', // smtc/padding/ctrl/text-side
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontWeight: 700,
                    fontSize: 14, // text/global/body3/fontSize
                    lineHeight: '22px', // text/global/body3/lineHeight
                    color: FG_ON_SUBTLE_REST,
                    whiteSpace: 'nowrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {buttonLabel}
                </p>
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  // Expansion: See less points the caret back up.
                  transform: action === 'Expansion: See less' ? 'rotate(180deg)' : undefined,
                }}
              >
                {action === 'Redirect' ? (
                  /* rendered set 47:26427 — `See all` uses a RIGHT chevron,
                     only See more / See less use the down/up caret. */
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M6 3.5 10.5 8 6 12.5"
                      stroke={FG_ON_SUBTLE_REST}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <Ico {...CHEVRON_DOWN} />
                )}
              </span>
            </span>
          </button>

          {!block && <Divider flip="y" />}
        </div>
      )}

      {/* Bottom Container — HORIZONTAL, gap 4, height 16. */}
      {(footnote || feedback) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, width: '100%', minHeight: 16 }}>
          {footnote && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: '1 0 0', minWidth: 1 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 11,
                  lineHeight: '13px',
                  fontWeight: 400,
                  color: 'rgba(0,0,0,0.6)',
                  whiteSpace: 'nowrap',
                }}
              >
                {footnoteText}
              </p>
              {footnoteLink && (
                <p
                  role="link"
                  tabIndex={0}
                  onClick={() => onLive?.({ footnoteLinkClicked: true })}
                  style={{
                    margin: 0,
                    fontSize: 11,
                    lineHeight: '13px',
                    fontWeight: 400,
                    color: FG_LINK,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    textDecorationColor: 'transparent',
                    outline: 'none',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.textDecorationColor = FG_LINK)}
                  onMouseLeave={(e) => (e.currentTarget.style.textDecorationColor = 'transparent')}
                >
                  {linkText}
                </p>
              )}
            </div>
          )}
          {/* Feedback=No keeps the slot but hides it (Figma sets visible:false). */}
          {feedback && <Feedback state={feedbackState} onLive={onLive} />}
        </div>
      )}
    </div>
  )
}
