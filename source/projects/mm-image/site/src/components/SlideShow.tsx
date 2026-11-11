import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { Badge } from './Molecules'
import type { LiveProps } from './Workbench'
import { SLIDESHOW_FONT, slideshowSizes, slideshowSources, slideshowSelection, slideshowSlides, slideshowCopy, slideIndex } from '../data/slideshow'
import type { SlideShowSize, SlideShowPagination, SlideShowState, SlideShowSlide } from '../data/slideshow'

export interface SlideShowProps {
  size?: SlideShowSize
  pagination?: SlideShowPagination
  state?: SlideShowState
  slides?: SlideShowSlide[]
  initialIndex?: number
  /** Collection metadata, independent of the number of preview slides. */
  imageCount?: number
  onSeeMore?: () => void
  onLive?: (props: LiveProps) => void
}
const button: CSSProperties = { appearance: 'none', border: 0, padding: 0, margin: 0, background: 'transparent', color: 'inherit', font: 'inherit', cursor: 'pointer', boxSizing: 'border-box' }
const fill: CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', maxWidth: 'none', display: 'block' }
const icons = {
  blue: { prev: './figma/slideshow/chevron-left-blue.svg', next: './figma/slideshow/chevron-right-blue.svg' },
  white: { prev: './figma/slideshow/chevron-left-white.svg', next: './figma/slideshow/chevron-right-white.svg' },
  soft: { prev: './figma/slideshow/chevron-left-soft.svg', next: './figma/slideshow/chevron-right-soft.svg' },
}
function Arrow({ direction, large, soft = false, disabled, onClick, style }: { direction: 'prev' | 'next'; large: boolean; soft?: boolean; disabled: boolean; onClick: () => void; style?: CSSProperties }) {
  const iconSize = large ? 20 : 16
  return <button type="button" aria-label={direction === 'prev' ? 'Previous slide' : 'Next slide'} disabled={disabled} onClick={onClick}
    style={{ ...button, position: 'relative', width: large ? 48 : 28, height: large ? 48 : 28, borderRadius: large ? 9999 : 4,
      background: large ? '#f8f4f1' : soft ? '#2c3459' : '#000', boxShadow: large || soft ? undefined : 'inset 0 0 0 1px rgba(0,0,0,.1)',
      opacity: disabled ? .3 : 1, cursor: disabled ? 'default' : 'pointer', flex: '0 0 auto', ...style }}>
    <span style={{ position: 'absolute', width: iconSize, height: iconSize, left: large ? 14 : 6, top: large ? 14 : 6 }}>
      <img src={icons[large ? 'blue' : soft ? 'soft' : 'white'][direction]} alt="" style={{ position: 'absolute', width: large ? 6.875 : 5.5, height: large ? 12.5 : 10,
        left: large ? (direction === 'prev' ? 6.25 : 6.875) : (direction === 'prev' ? 5 : 5.5), top: large ? 3.75 : 3, maxWidth: 'none' }} />
    </span>
  </button>
}

function gradient(size: SlideShowSize, hover: boolean) {
  if (size === '3:4') return hover
    ? 'linear-gradient(180deg,rgba(0,0,0,0) 40.21%,rgba(0,0,0,.502) 53.609%,rgba(0,0,0,.698) 66.739%,rgba(0,0,0,.698) 100%)'
    : 'linear-gradient(180deg,rgba(0,0,0,0) 48.94%,rgba(0,0,0,.502) 71.294%,rgba(0,0,0,.698) 80.694%,rgba(0,0,0,.698) 100%)'
  return hover
    ? 'linear-gradient(180deg,rgba(0,0,0,.051) 0%,rgba(0,0,0,.102) 18.18%,rgba(0,0,0,.502) 33.99%,rgba(0,0,0,.698) 53.5%,rgba(0,0,0,.698) 100%)'
    : 'linear-gradient(180deg,rgba(0,0,0,.051) 0%,rgba(0,0,0,.051) 40.762%,rgba(0,0,0,.502) 58.355%,rgba(0,0,0,.698) 79.5%,rgba(0,0,0,.698) 100%)'
}

/** Native component rebuilt from the 15 Slide Card specimens in MM-ACF. */
export function SlideShow(props: SlideShowProps) {
  const { size, pagination, state } = slideshowSelection({ size: props.size, pagination: props.pagination, state: props.state })
  const { width, height } = slideshowSizes[size]
  const slides = props.slides?.length ? props.slides : slideshowSlides(size, pagination)
  const [selected, setSelected] = useState(() => slideIndex(props.initialIndex, slides.length))
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const index = slideIndex(selected, slides.length)
  const current = slides[index]
  const fallback = slideshowCopy(size, pagination)
  useEffect(() => { setSelected(slideIndex(props.initialIndex, slides.length)) }, [props.initialIndex, slides.length, size, pagination, state])
  const choose = (next: number) => {
    const value = slideIndex(next, slides.length)
    setSelected(value)
    props.onLive?.({ initialIndex: value })
  }
  const bottom = pagination === 'Bottom bars'
  const top = pagination === 'Top bars'
  const combined = pagination === 'Bottom bars + arrows'
  const portrait = size === '3:4'
  const compact = size === '3:2'
  const hover = bottom && (state === 'Hover' || hovered || focused)
  const source = slideshowSources.find(s => s.values.size === size && s.values.pagination === pagination && s.values.state === (hover ? 'Hover' : 'Default'))!
  const contentX = portrait ? 16 : 30
  const contentWidth = width - contentX * 2
  const thumbGap = portrait ? 8 : 12
  const thumbSize = Math.min((contentWidth - thumbGap * (slides.length - 1)) / slides.length, compact ? 54 : portrait ? 64 : 110)
  const barsWidth = size === '5:4' ? contentWidth : 138
  const barButtons = () => <div data-slideshow-bars style={{ display: 'flex', gap: 8, height: 6, width: '100%' }}>
    {slides.map((_, i) => <button key={i} type="button" aria-label={`Go to slide ${i + 1}`} aria-pressed={i === index} onClick={() => choose(i)}
      style={{ ...button, flex: 1, minWidth: 0, height: 6, position: 'relative', borderRadius: 9999, background: 'rgba(255,255,255,.3)' }}>
      <span style={{ position: 'absolute', inset: combined ? '-4px 0 -14px' : '-9px 0' }} />
      <span style={{ display: 'block', height: '100%', borderRadius: 'inherit', background: '#fff', width: i === index ? '100%' : '0%' }} />
    </button>)}
  </div>
  return <section data-slideshow={size} data-pagination={pagination} data-state={hover ? 'Hover' : 'Default'} data-source-node={source.nodeId} data-slide-index={index}
    role="region" aria-roledescription="carousel" aria-label="SlideShow" tabIndex={0}
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false) }}
    onKeyDown={e => {
      const next = e.key === 'ArrowRight' ? index + 1 : e.key === 'ArrowLeft' ? index - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? slides.length - 1 : null
      if (next !== null) { e.preventDefault(); e.stopPropagation(); choose(next) }
    }}
      style={{ position: 'relative', flex: '0 0 auto', width, height, borderRadius: 24, overflow: 'hidden', color: '#fff', fontFamily: SLIDESHOW_FONT, boxSizing: 'border-box', isolation: 'isolate' }}>
    <div role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${slides.length}`} style={{ position: 'absolute', width: !bottom && !combined && !compact ? 536 : width, height: bottom && compact ? 424 : height, left: !bottom && !combined && portrait ? -112 : 0, top: bottom && compact ? -95 : 0 }}>
      <img src={current.src} alt={current.alt} style={fill} />
      {!bottom && !current.seeMore && index === 0 && <div data-slideshow-source style={{ position: 'absolute', left: 16, top: top ? height - 36 : 16, display: 'flex', alignItems: combined ? 'flex-start' : 'center', gap: 4, filter: 'drop-shadow(0 0 2px rgba(0,0,0,.25))', fontSize: 13, lineHeight: '20px', whiteSpace: 'nowrap', color: combined ? '#1a1a1a' : undefined }}>
        <img src="./figma/slideshow/imdb-favicon.png" alt="" style={{ width: 16, height: 16, borderRadius: 4 }} />{current.source ?? 'imdb.com'}
      </div>}
    </div>
    {current.seeMore && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.6)' }}>
      {props.onSeeMore ? <button type="button" onClick={props.onSeeMore} style={{ ...button, display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700 }}>See more<span style={{ display: 'grid', placeItems: 'center', width: 16, height: 16 }}><img src="./figma/slideshow/open-external-white.svg" alt="" style={{ width: 12, height: 12 }} /></span></button>
        : <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700 }}>See more<span style={{ display: 'grid', placeItems: 'center', width: 16, height: 16 }}><img src="./figma/slideshow/open-external-white.svg" alt="" style={{ width: 12, height: 12 }} /></span></span>}
    </div>}
    {pagination === 'Bottom arrows' && <div style={{ position: 'absolute', bottom: 20, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
      <Arrow direction="prev" large={false} disabled={index === 0} onClick={() => choose(index - 1)} />
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, width: 45, height: 28, borderRadius: 4, background: '#000', fontSize: 11, lineHeight: '13px' }}>{current.seeMore ? 'More' : <><span>{index + 1}</span><span>of</span><span>{slides.filter(slide => !slide.seeMore).length}</span></>}</span>
      <Arrow direction="next" large={false} disabled={index === slides.length - 1} onClick={() => choose(index + 1)} />
    </div>}
    {top && <>
      <div style={{ position: 'absolute', left: 0, top: 0, right: 0, padding: '16px 36px', display: 'flex', flexDirection: 'column', gap: 8, background: 'linear-gradient(to top,rgba(0,0,0,0),rgba(0,0,0,.48) 56.452%)' }}>
        {barButtons()}
        <div style={{ fontSize: 14, fontWeight: 700, lineHeight: '22px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{current.title ?? fallback.title}</div>
      </div>
      <Arrow direction="prev" large disabled={index === 0} onClick={() => choose(index - 1)} style={{ position: 'absolute', left: 16, top: compact ? 78 : 193 }} />
      <Arrow direction="next" large disabled={index === slides.length - 1} onClick={() => choose(index + 1)} style={{ position: 'absolute', right: 16, top: compact ? 78 : 193 }} />
    </>}
    {combined && <div data-slideshow-footer="bars-arrows" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 24, display: 'flex', flexDirection: 'column', gap: 8, backdropFilter: 'blur(2.5px)', background: 'linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,.1) 17.416%,rgba(0,0,0,.6) 56.452%)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, width: '100%' }}>
        <div data-slideshow-caption style={{ flex: '1 1 0', minWidth: 0, fontSize: 14, fontWeight: 700, lineHeight: '22px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{current.title ?? fallback.title}</div>
        <div style={{ display: 'flex', flex: '0 0 auto', gap: 8 }}>
          <Arrow direction="prev" large={false} soft disabled={index === 0} onClick={() => choose(index - 1)} />
          <Arrow direction="next" large={false} soft disabled={index === slides.length - 1} onClick={() => choose(index + 1)} />
        </div>
      </div>
      {barButtons()}
    </div>}
    {bottom && <>
      <div style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(2px)', backgroundImage: gradient(size, hover), pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', left: portrait ? 16 : 13, top: portrait ? 16 : 12 }}><Badge property1="Multi image" label={`${props.imageCount ?? (portrait ? 24 : 23)} images`} fontFamily={SLIDESHOW_FONT} /></div>
      <div style={{ position: 'absolute', left: contentX, right: contentX, bottom: 16, display: 'flex', flexDirection: 'column', alignItems: compact ? 'center' : 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%', padding: compact ? '0 2px' : 0, boxSizing: 'border-box', textAlign: compact ? 'center' : 'left' }}>
          <div style={{ fontFamily: "'MM SlideShow Alice', Georgia, serif", fontSize: compact ? 20 : 28, lineHeight: compact ? '26px' : '34px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{current.title ?? fallback.title}</div>
          <div style={{ fontSize: compact ? 11 : 14, lineHeight: compact ? '13px' : '22px', height: compact ? 26 : 44, overflow: 'hidden' }}>{current.description ?? fallback.description}</div>
        </div>
        {/* Keep the same buttons mounted when focus reveals thumbnails. */}
        <div style={{ display: 'flex', gap: hover ? thumbGap : 3, height: hover ? Math.max(1, thumbSize) : 4, width: hover ? contentWidth : barsWidth, overflowX: hover && slides.length > 4 ? 'auto' : undefined }}>
          {slides.map((slide, i) => <button key={i} type="button" aria-label={`Go to slide ${i + 1}`} aria-pressed={i === index} onClick={() => choose(i)}
            style={{ ...button, position: 'relative', flex: '1 0 0', minWidth: 0, borderRadius: hover ? 8 : 9999, height: '100%', background: 'rgba(255,255,255,.3)' }}>
            {hover ? <><img src={slide.src} alt="" style={{ ...fill, borderRadius: 8 }} /><span style={{ position: 'absolute', inset: 0, borderRadius: 8, boxShadow: i === index ? 'inset 0 0 0 1px #fff' : undefined }} /></>
              : <><span style={{ position: 'absolute', inset: '-9px 0' }} /><span style={{ display: 'block', height: '100%', borderRadius: 'inherit', background: '#fff', width: i === index ? portrait && index === 0 ? '0%' : '75%' : '0%' }} /></>}
          </button>)}
        </div>
      </div>
    </>}
    <span aria-live="polite" aria-atomic="true" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap' }}>Slide {index + 1} of {slides.length}</span>
  </section>
}
