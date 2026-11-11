import type { CSSProperties } from 'react'
import type { CardNode, ImageCardGroup } from './types'

/** Twelve source variants from MM-ACF-FY25 / 2216:1178.
 * Exact contexts and source screenshots: design/fy25-cards/context-small-*.
 * Connected Windows-only SerpImageCard and weather-demo imports do not exist
 * in this repository; these descriptors preserve their inspected child slots.
 */
const PHOTO = './figma/fy25/windows-bloom.png'
const IMAGE_ICON = './figma/fy25/small-image-multiple.svg'
const HEADER_CHEVRON = './figma/fy25/small-header-chevron.svg'
const SCROLL_CHEVRON = './figma/fy25/small-scroll-chevron.svg'
const BLUE_CHEVRON = './figma/fy25/small-blue-chevron.svg'
const SEE_ALL_CHEVRON = './figma/fy25/small-seeall-chevron.svg'
const INSTAGRAM = './figma/fy25/small-instagram.png'
const GRADIENT = './figma/fy25/small-gradient.png'
const SOCIAL_GRADIENT = './figma/fy25/small-social-gradient.png'
const FONT = "Roboto, 'Segoe UI', sans-serif"

const box = (style: CSSProperties, children: CardNode[], id?: string): CardNode => ({ kind: 'box', style, children, id })
const text = (value: string, style: CSSProperties = {}): CardNode => ({ kind: 'text', text: value, style: { fontFamily: FONT, fontSize: 13, lineHeight: '20px', ...style } })
const action = (type: NonNullable<CardNode['action']>, style: CSSProperties, children: CardNode[], id?: string): CardNode => ({ kind: 'action', action: type, style, children, id })
const icon = (src: string, size = 16): CardNode => box({ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }, [{ kind: 'image', src, alt: '', style: { flexShrink: 0, objectFit: 'contain', ...(src !== IMAGE_ICON ? { transform: 'translateX(.25px)' } : {}) } }])

function photo(width: number, height: number, radius = 0, zoom = false, id?: string): CardNode {
  return action('open', { width, height, borderRadius: radius, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }, [
    { kind: 'image', src: PHOTO, alt: 'Windows blue bloom', style: { width: zoom ? width * 1.1518987 : width, height: zoom ? height * 1.15 : height, maxWidth: 'none', objectFit: 'cover', flexShrink: 0 } },
  ], id)
}

function root(width: number, height: number, children: CardNode[], style: CSSProperties = {}, id?: string): CardNode {
  return box({ width, height, position: 'relative', display: 'flex', overflow: 'hidden', borderRadius: 16, background: '#fff', fontFamily: FONT, fontSize: 13, lineHeight: '20px', color: '#000', ...style }, children, id)
}

function allImages(singular = false): CardNode {
  return action('more', { position: 'absolute', right: 12, bottom: 12, width: singular ? 88 : 95, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, padding: 4, borderRadius: 9999, background: '#000', color: '#fff', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.1)' }, [
    icon(IMAGE_ICON, 20), text(singular ? 'All image' : 'All images', { paddingRight: 4, whiteSpace: 'nowrap' }),
  ])
}

function header(width: number, rightInset = 0): CardNode {
  return box({ display: 'flex', alignItems: 'center', gap: 4, width, height: 24 }, [
    text('Title', { flex: '1 1 0', minWidth: 0, fontSize: 14, fontWeight: 700, lineHeight: '22px' }),
    action('more', { width: 24, height: 24, marginRight: rightInset, display: 'flex', alignItems: 'center', justifyContent: 'center' }, [icon(HEADER_CHEVRON)]),
  ])
}

function socialHeader(): CardNode {
  return box({ display: 'flex', alignItems: 'center', gap: 4, width: 272, height: 26 }, [
    { kind: 'image', src: INSTAGRAM, alt: 'Instagram', style: { width: 16, height: 16, borderRadius: 4, objectFit: 'cover' } },
    text('Instagram images', { width: 114, fontSize: 14, fontWeight: 700, lineHeight: '22px', whiteSpace: 'nowrap' }),
    action('related', { marginLeft: 'auto', width: 93, height: 26, borderRadius: 100, background: '#c6e2f7', color: '#005ba1', display: 'flex', alignItems: 'center', justifyContent: 'center' }, [text('@taylorswift')]),
  ])
}

function carousel(width: number, id: string, background = '#f5f5f5', social = false): CardNode {
  const contentWidth = width - 40
  const height = social ? 126 : 128
  const next = social ? BLUE_CHEVRON : SCROLL_CHEVRON
  return root(width, 200, [
    social ? socialHeader() : header(contentWidth, id === '750:61777' ? 4 : 0),
    box({ position: 'relative', width: contentWidth, height, display: 'flex' }, [
      box({ width: contentWidth, height, overflowX: 'auto', overflowY: 'hidden', scrollbarWidth: 'none', display: 'flex' }, [
        box({ width: 669, height, display: 'flex', gap: 8, alignItems: 'center' }, [
          ...Array.from({ length: 4 }, () => photo(138, height, 16, true)),
          action('more', { width: 85, height, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 4 }, [
            box({ width: 40, height: 40, borderRadius: 999, display: 'flex', justifyContent: 'center', alignItems: 'center' }, [icon(SEE_ALL_CHEVRON)]),
            text('See all', { fontWeight: 700, color: '#202020' }),
          ]),
        ]),
      ]),
      // Figma's exported gradient is a horizontal 139 × 20 raster, rotated -90°.
      box({ position: 'absolute', top: 0, right: -20, width: 50, height, display: 'flex', pointerEvents: 'none' }, [
        box({ width: 20, height, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }, [
          { kind: 'image', src: social ? SOCIAL_GRADIENT : GRADIENT, alt: '', style: { width: height, height: 20, maxWidth: 'none', objectFit: 'cover', transform: 'rotate(-90deg)' } },
        ]),
        box({ width: 30, height, background: social ? background : '#f5f5f5' }, []),
      ]),
      action('scroll', { position: 'absolute', right: -12, top: height / 2 - 13, width: 24, height: 24, padding: 4, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }, [icon(next)]),
    ]),
  ], { background, padding: 20, flexDirection: 'column', gap: 8 }, id)
}

function relatedGrid(): CardNode {
  return root(312, 200, [
    header(272),
    box({ width: 272, height: 126, display: 'flex', gap: 12 }, Array.from({ length: 2 }, () =>
      box({ width: 130, height: 126, display: 'flex', flexDirection: 'column', gap: 8 }, Array.from({ length: 3 }, () =>
        action('related', { width: 130, height: 110 / 3, display: 'flex', alignItems: 'center', gap: 8 }, [
          { kind: 'image', src: PHOTO, alt: 'Whale Kids', style: { width: 36, height: 36, borderRadius: 8, objectFit: 'cover' } },
          box({ display: 'flex', alignItems: 'center', width: 86, height: '100%', overflow: 'hidden', whiteSpace: 'pre' }, [text('Whale ', { fontSize: 14, lineHeight: '22px' }), text('Kids', { fontSize: 14, lineHeight: '22px', fontWeight: 700 })]),
        ]),
      )),
    )),
  ], { background: '#f8f4f1', padding: 20, flexDirection: 'column', gap: 8 }, '1266:15872')
}

function relatedList(): CardNode {
  return root(200, 424, [
    header(160),
    box({ width: 160, height: 352, display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' },
      ['Beautiful\nParis', 'Louvre\nParis', 'Where to Stay\nin Paris', 'Paris\nPostcard', 'Paris\nArtwork', 'Paris\nSightseeing'].map(label =>
        action('related', { width: 160, height: 48, display: 'flex', alignItems: 'center', gap: 8, borderRadius: 8, overflow: 'hidden' }, [
          { kind: 'image', src: PHOTO, alt: label.replace('\n', ' '), style: { width: 48, height: 48, objectFit: 'cover', borderRadius: 8 } },
          text(label, { width: 104, fontWeight: 700, whiteSpace: 'pre-line' }),
        ]),
      ),
    ),
  ], { background: '#f5f5f5', padding: 20, flexDirection: 'column', gap: 8 }, '1283:22499')
}

export const smallCardGroups: ImageCardGroup[] = [
  { size: '2x2', width: 200, height: 200, variants: [
    { id: 'single-image', label: 'Single image', nodeId: '16:7776', tree: root(200, 200, [photo(200, 200), allImages(true)], {}, '16:7776') },
  ] },
  { size: '3x2', width: 312, height: 200, variants: [
    { id: 'single-image', label: 'Single image', nodeId: '704:18885', tree: root(312, 200, [photo(312, 200), allImages()], {}, '704:18885') },
    { id: 'two-images', label: 'Two images', nodeId: '705:7425', tree: root(312, 200, [photo(155, 200, 0, true), photo(155, 200, 0, true), allImages(true)], { gap: 2 }, '705:7425') },
    { id: 'image-carousel', label: 'Image carousel', nodeId: '750:61777', tree: carousel(312, '750:61777') },
    { id: 'social-carousel', label: 'Instagram carousel', nodeId: '750:62130', tree: carousel(312, '750:62130', '#ebf6ff', true) },
    { id: 'related-grid', label: 'Related search grid', nodeId: '1266:15872', tree: relatedGrid() },
  ] },
  { size: '4x2', width: 424, height: 200, variants: [
    { id: 'single-image', label: 'Single image', nodeId: '16:7859', tree: root(424, 200, [photo(424, 200), allImages()], {}, '16:7859') },
    { id: 'two-images', label: 'Two images', nodeId: '16:7852', tree: root(424, 200, [photo(211, 200), photo(211, 200), allImages()], { gap: 2 }, '16:7852') },
    { id: 'image-carousel', label: 'Image carousel', nodeId: '1779:1126', tree: carousel(424, '1779:1126', '#f8f4f1') },
  ] },
  { size: '5x2', width: 536, height: 200, variants: [
    { id: 'split-images', label: 'Wide and square images', nodeId: '16:7872', tree: root(536, 200, [photo(334, 200), photo(200, 200), allImages()], { gap: 2 }, '16:7872') },
    { id: 'image-carousel', label: 'Image carousel', nodeId: '1268:1976', tree: carousel(536, '1268:1976') },
  ] },
  { size: '2x4', width: 200, height: 424, variants: [
    { id: 'related-list', label: 'Related search list', nodeId: '1283:22499', tree: relatedList() },
  ] },
]
