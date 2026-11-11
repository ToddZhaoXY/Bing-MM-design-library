import type { CSSProperties } from 'react'
import type { CardNode, CardVariant, ImageCardGroup } from './types'

/**
 * MM ACF FY25 · 3×4 and 4×4 cards.
 * Every variant has its own get_design_context and reference screenshot in
 * ../design/fy25-cards/context-tall-*. Exact image slot dimensions additionally
 * come from context-tall-image-geometry.json. All slots share Figma image hash
 * ef79d4f453f2abe81aebe3638960ec536d09dafe, with FILL / object-cover geometry.
 * The remote Code Connect sample paths are absent from this project; these
 * native descriptors compose the shared ImageAnswerCard renderer instead.
 */
const FONT = "Roboto, 'Segoe UI', sans-serif"
const box = (style: CSSProperties, children: CardNode[] = [], id?: string): CardNode => ({ kind: 'box', id, style, children })
const text = (value: string, style: CSSProperties = {}): CardNode => ({
  kind: 'text', text: value,
  style: { fontFamily: FONT, fontSize: 13, fontWeight: 400, lineHeight: '20px', ...style },
})
const photo = (width: number, height: number, id?: string, radius = 0): CardNode => ({
  kind: 'image', id, src: './figma/fy25/windows-bloom.png', alt: 'Windows blue bloom',
  style: { width, height, objectFit: 'cover', borderRadius: radius, display: 'block' },
})
const tile = (width: number, height: number, id: string): CardNode => ({
  kind: 'action', id, action: 'open', text: 'Open image',
  style: { width, height, display: 'flex', overflow: 'hidden', padding: 0, border: 0, background: 'transparent' },
  children: [photo(width, height, `I${id};18895:4716`)],
})
const row = (width: number, height: number, children: CardNode[]): CardNode => box({ display: 'flex', flexDirection: 'row', gap: 2, width, height }, children)
const column = (width: number, height: number, children: CardNode[]): CardNode => box({ display: 'flex', flexDirection: 'column', gap: 2, width, height }, children)
const allImages = (right = 12): CardNode => ({
  kind: 'action', action: 'more', text: 'All images',
  style: {
    position: 'absolute', right, bottom: 12, width: 95, height: 28,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2,
    padding: '4px 8px 4px 4px', border: 0, borderRadius: 9999,
    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.1)', background: '#000', color: '#fff', fontFamily: FONT,
  },
  children: [
    box({ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20 }, [
      { kind: 'image', src: './figma/fy25/tall-image-multiple.svg', alt: '', style: { display: 'block' } },
    ]),
    text('All images', { whiteSpace: 'nowrap', color: '#fff' }),
  ],
})
const collage = (nodeId: string, width: number, body: CardNode, more = true, right = 12): CardNode => box({
  position: 'relative', display: 'flex', width, height: 424,
  borderRadius: 16, overflow: 'hidden', background: '#fff', fontFamily: FONT,
}, [body, ...(more ? [allImages(right)] : [])], nodeId)
const variant = (id: string, label: string, nodeId: string, tree: CardNode, notes?: string[]): CardVariant => ({ id, label, nodeId, tree, notes })

function relatedTrends(): CardNode {
  const rows = ['Japandi Style', 'Statement Lighting', 'Curved Furniture', 'Biophilic design'].map((label, index): CardNode => ({
    kind: 'action', action: 'related', text: label,
    id: `I16:7917;24115:64449;2731:${48434 + index}`,
    style: { display: 'flex', alignItems: 'center', gap: 8, width: 272, height: 52, padding: '4px 8px 4px 4px', border: 0, borderRadius: 8, overflow: 'hidden', background: '#fff', color: '#000' },
    children: [photo(44, 44, undefined, 4), text(label, { fontSize: 14, lineHeight: '22px', width: 208, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' })],
  }))
  const arrow = (direction: 'left' | 'right'): CardNode => box({ width: 16, height: 16 }, [{
    kind: 'image', src: direction === 'left' ? './figma/fy25/tall-chevron-left.svg' : './figma/fy25/tall-chevron-right.svg', alt: '',
    style: { display: 'block', marginLeft: direction === 'left' ? 5 : 6.5, marginTop: 4 },
  }])
  return box({ display: 'flex', flexDirection: 'column', position: 'relative', width: 312, height: 424, borderRadius: 16, overflow: 'hidden', background: '#e4e8f7', color: '#000', fontFamily: FONT }, [
    // The top image extends behind the overlapping white heading, as in Figma.
    box({ position: 'absolute', top: 0, left: 0, width: 312, height: 112 }, [photo(312, 112)]),
    box({ height: 42, width: 312 }),
    box({ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', width: 312, height: 350, padding: '0 20px' }, [
      box({ width: 272, height: 92, borderRadius: 8, padding: 20, background: '#fff' }, [
        text('Also search for latest trend in\ninterior design', { display: 'block', width: 232, fontSize: 16, fontWeight: 700, lineHeight: '26px', whiteSpace: 'pre-line' }),
      ]),
      box({ display: 'flex', flexDirection: 'column', gap: 8, width: 272, height: 232 }, rows),
    ]),
    box({ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 8, width: 312, height: 12 }, [
      box({ width: 24, height: 24, padding: 4, borderRadius: 4, background: '#d9dffb', opacity: .3 }, [arrow('left')]),
      text('1/5', { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 17, height: 24, fontSize: 11, lineHeight: '13px', color: 'rgba(0,0,0,.8)' }),
      { kind: 'action', action: 'next-page', text: 'Next related searches', id: 'tall-related-next', style: { width: 24, height: 24, padding: 4, border: 0, borderRadius: 4, background: '#d9dffb' }, children: [arrow('right')] },
    ]),
  ], '16:7917')
}

export const tallCardGroups: ImageCardGroup[] = [
  {
    size: '3x4', width: 312, height: 424,
    variants: [
      variant('masonry-five', 'Five images · 3 + 2 columns', '1748:1270', collage('1748:1270', 312,
        row(312, 424, [column(155, 424, [tile(155, 140, '1748:1275'), tile(155, 140, '1748:1276'), tile(155, 140, '1748:1277')]), column(155, 424, [tile(155, 211, '1748:1279'), tile(155, 211, '1748:1280')])]))),
      variant('four-equal', 'Four images · equal columns', '1270:13254', collage('1270:13254', 312,
        row(312, 424, [column(155, 424, [tile(155, 211, '1270:13544'), tile(155, 211, '1270:13529')]), column(155, 424, [tile(155, 211, '1270:13564'), tile(155, 211, '1270:13554')])]))),
      variant('hero-three', 'Portrait hero + three images', '16:7896', collage('16:7896', 312,
        row(312, 424, [tile(200, 424, '1270:13584'), column(110, 424, [tile(110, 140, '1270:13592'), tile(110, 140, '1270:13596'), tile(110, 140, '1270:13588')])]))),
      variant('related-trends', 'Related searches · interior trends', '16:7917', relatedTrends(), ['The Figma source provides the first-page state only. Supply pagination data via onAction; the default next-page interaction opens a component preview.']),
      variant('staggered-four', 'Four images · staggered rows', '1270:13639', collage('1270:13639', 312,
        column(312, 424, [row(312, 211, [tile(173, 211, '1270:13668'), tile(137, 211, '1270:13672')]), row(312, 211, [tile(131, 211, '1270:13676'), tile(179, 211, '1270:13680')])]))),
      variant('hero-top', 'Landscape hero + two images', '1270:13704', collage('1270:13704', 312,
        column(312, 424, [tile(312, 211, '1270:13729'), row(312, 211, [tile(155, 211, '1270:13733'), tile(155, 211, '1270:13737')])]), false), ['This source variant has no All images button.']),
      variant('hero-bottom', 'Two images + landscape hero', '1270:13753', collage('1270:13753', 312,
        column(312, 424, [row(312, 211, [tile(155, 211, '1270:13778'), tile(155, 211, '1270:13782')]), tile(312, 211, '1270:13786')]))),
      variant('two-stacked', 'Two landscape images', '1270:13802', collage('1270:13802', 312,
        column(312, 424, [tile(312, 211, '1270:13852'), tile(312, 211, '1270:13862')]))),
      variant('four-equal-alternate', 'Four images · alternate source', '1270:13885', collage('1270:13885', 312,
        row(312, 424, [column(155, 424, [tile(155, 211, '1270:13972'), tile(155, 211, '1270:13992')]), column(155, 424, [tile(155, 211, '1270:13982'), tile(155, 211, '1270:14002')])])), ['A separate source card with the same resting layout as Four images · equal columns.']),
      variant('single-portrait', 'Single portrait image', '1270:14063', collage('1270:14063', 312, tile(312, 424, '1270:14164'))),
    ],
  },
  {
    size: '4x4', width: 424, height: 424,
    variants: [
      variant('hero-three', 'Portrait hero + three images', '1270:14187', collage('1270:14187', 424,
        row(424, 424, [tile(282, 424, '1270:14276'), column(140, 424, [tile(140, 140, '1270:14288'), tile(140, 140, '1270:14284'), tile(140, 140, '1270:14280')])]))),
      variant('five-rows', 'Five images · 3 + 2 rows', '1270:14315', collage('1270:14315', 424,
        column(424, 424, [row(424, 211, [tile(140, 211, '1270:14396'), tile(140, 211, '1270:14400'), tile(140, 211, '1270:14404')]), row(424, 211, [tile(211, 211, '1270:14412'), tile(211, 211, '1270:14408')])]))),
      variant('hero-top', 'Landscape hero + two images', '1270:14440', collage('1270:14440', 424,
        column(424, 424, [tile(424, 211, '1270:14522'), row(424, 211, [tile(211, 211, '1270:14532'), tile(211, 211, '1270:14542')])]), true, 11)),
      variant('hero-two', 'Portrait hero + two images', '1270:14583', collage('1270:14583', 424,
        row(424, 424, [tile(211, 424, '1270:14638'), column(211, 424, [tile(211, 211, '1270:14642'), tile(211, 211, '1270:14646')])]))),
      variant('hero-top-alternate', 'Landscape hero · alternate source', '1270:14667', collage('1270:14667', 424,
        column(424, 424, [tile(424, 211, '1270:14961'), row(424, 211, [tile(211, 211, '1270:14931'), tile(211, 211, '1270:14941')])])), ['Separate source card: same image arrangement, with All images positioned 12px from the right edge.']),
      variant('four-equal', 'Four square images', '1270:14751', collage('1270:14751', 424,
        row(424, 424, [column(211, 424, [tile(211, 211, '1270:14972'), tile(211, 211, '1270:14982')]), column(211, 424, [tile(211, 211, '1270:15002'), tile(211, 211, '1270:14992')])]))),
    ],
  },
]
