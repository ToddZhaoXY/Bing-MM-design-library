import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { CSSProperties, MouseEvent, ReactNode } from 'react'
import { imageCardGroup, imageCardVariant, imageCardSelection } from '../data/image-cards'
import type { CardNode } from '../data/image-cards'
import { tokens } from '../data/tokens'

export interface ImageCardProps {
  variant?: string
  /** Optional product image override. Source imagery is preserved by default. */
  imageSrc?: string
  onAction?: (action: string, label: string) => void
}

/** Unified library entry: size is the outer variant axis, layout is dependent on it. */
export function ImageCards({ size = '2x2', variant, ...props }: ImageCardProps & { size?: string }) {
  const selection = imageCardSelection({ size, variant })
  return <ImageAnswerCard {...props} {...selection} />
}

const resetButton: CSSProperties = {
  appearance: 'none', border: 0, padding: 0, margin: 0, background: 'transparent',
  color: 'inherit', font: 'inherit', textAlign: 'inherit', cursor: 'pointer',
}

function labelOf(node: CardNode): string {
  return node.text || node.alt || (node.children ?? []).map(labelOf).filter(Boolean).join(' ')
}
function photosOf(node: CardNode): CardNode[] {
  return node.kind === 'image' && Boolean(node.alt) && Number(node.style?.width ?? 100) > 24
    ? [node] : (node.children ?? []).flatMap(photosOf)
}

/** Public source component shared by all size families; no dependency on the workbench. */
export function ImageAnswerCard({ size, variant, imageSrc, onAction }: ImageCardProps & { size: string }) {
  const group = imageCardGroup(size)
  const selected = imageCardVariant(size, variant)
  const root = useRef<HTMLDivElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const lastTrigger = useRef<HTMLElement | null>(null)
  const [detail, setDetail] = useState<{ label: string; photos: CardNode[] } | null>(null)

  useEffect(() => { setDetail(null) }, [size, variant])
  useEffect(() => {
    if (detail && dialog.current && !dialog.current.open) dialog.current.showModal()
  }, [detail])
  if (!group || !selected) return null

  const close = () => { setDetail(null); lastTrigger.current?.focus() }
  const activate = (node: CardNode, event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    const action = node.action ?? 'open'
    const label = labelOf(node) || 'Image preview'
    if (action === 'scroll') {
      // Use the nearest actual overflowing rail, never scroll the surrounding workbench.
      let scope: HTMLElement | null = event.currentTarget.parentElement
      while (scope && root.current?.contains(scope)) {
        const rail = [scope, ...Array.from(scope.querySelectorAll<HTMLElement>('*'))]
          .find(el => /auto|scroll/.test(getComputedStyle(el).overflowX) && el.scrollWidth > el.clientWidth + 1)
        if (rail) {
          const end = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2
          rail.scrollTo({ left: end ? 0 : rail.scrollLeft + rail.clientWidth * .75, behavior: 'smooth' })
          onAction?.(action, label)
          return
        }
        scope = scope.parentElement
      }
    }
    if (onAction) { onAction(action, label); return }
    lastTrigger.current = event.currentTarget
    setDetail({ label, photos: action === 'more' || action === 'scroll' ? photosOf(selected.tree) : photosOf(node) })
  }

  function render(node: CardNode, key: number | string, interactive = true): ReactNode {
    const props = { 'data-figma-node': node.id, style: { boxSizing: 'border-box' as const, flexShrink: 0, ...node.style,
      ...(node.style?.fontFamily?.includes('Roboto') ? { fontFamily: '"MM FY25 Roboto", Roboto, sans-serif' } : {}) } }
    if (node.kind === 'image') {
      const photo = <img key={key} {...props} src={imageSrc && node.alt && Number(node.style?.width ?? 100) > 24 ? imageSrc : node.src}
        alt={node.alt ?? ''} draggable={false} style={{ display: 'block', objectFit: 'cover', ...props.style }} />
      // The image slot remains exactly the source geometry; interaction belongs to its containing card.
      return photo
    }
    if (node.kind === 'text') return <span key={key} {...props}>{node.text}</span>
    const children = node.children?.map((child, i) => render(child, i, node.kind === 'action' ? false : interactive)) ?? node.text
    if (node.kind === 'action' && interactive) return <button key={key} {...props} type="button"
      aria-label={labelOf(node) || (node.action === 'scroll' ? 'Next images' : 'View images')}
      data-card-action={node.action ?? 'open'} style={{ ...resetButton, ...props.style }} onClick={event => activate(node, event)}>{children}</button>
    return <div key={key} {...props}>{children}</div>
  }

  return <>
    <div ref={root} data-image-card={size} data-card-variant={selected.id} data-source-node={selected.nodeId}
      style={{ width: group.width, height: group.height, flex: '0 0 auto', position: 'relative',
        fontFamily: tokens['text/style/default/regular/font-family'], color: '#000' }}>
      {render(selected.tree, selected.id)}
    </div>
    {detail && typeof document !== 'undefined' && createPortal(
      <dialog ref={dialog} aria-label={detail.label} onCancel={close} onClick={event => { if (event.target === event.currentTarget) close() }}
        style={{ border: '1px solid #ddd', borderRadius: 16, padding: 24, width: 'min(800px, 90vw)', maxHeight: '85vh', overflow: 'auto', color: '#111', background: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, marginBottom: 16 }}>
          <strong>{detail.label}</strong><button type="button" onClick={close} autoFocus>Close</button>
        </div>
        {detail.photos.length ? <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
          {detail.photos.map((photo, i) => <img key={i} src={imageSrc || photo.src} alt={photo.alt || `Image ${i + 1}`} style={{ width: '100%', height: 190, objectFit: 'cover', borderRadius: 8 }} />)}
        </div> : <p>{detail.label}</p>}
        <p style={{ fontSize: 12, color: '#666', marginBottom: 0 }}>Component preview. Connect onAction to your product navigation.</p>
      </dialog>, document.body)}
  </>
}

export const ImageCard2x2 = (props: ImageCardProps) => <ImageAnswerCard size="2x2" {...props} />
export const ImageCard3x2 = (props: ImageCardProps) => <ImageAnswerCard size="3x2" {...props} />
export const ImageCard4x2 = (props: ImageCardProps) => <ImageAnswerCard size="4x2" {...props} />
export const ImageCard5x2 = (props: ImageCardProps) => <ImageAnswerCard size="5x2" {...props} />
export const ImageCard2x4 = (props: ImageCardProps) => <ImageAnswerCard size="2x4" {...props} />
export const ImageCard3x4 = (props: ImageCardProps) => <ImageAnswerCard size="3x4" {...props} />
export const ImageCard4x4 = (props: ImageCardProps) => <ImageAnswerCard size="4x4" {...props} />
export const ImageCard5x4 = (props: ImageCardProps) => <ImageAnswerCard size="5x4" {...props} />
export const ImageCard6x4 = (props: ImageCardProps) => <ImageAnswerCard size="6x4" {...props} />
export const ImageCard8x4 = (props: ImageCardProps) => <ImageAnswerCard size="8x4" {...props} />
export const ImageCard9x4 = (props: ImageCardProps) => <ImageAnswerCard size="9x4" {...props} />
export const ImageCard11x4 = (props: ImageCardProps) => <ImageAnswerCard size="11x4" {...props} />
export const ImageCard11x2 = (props: ImageCardProps) => <ImageAnswerCard size="11x2" {...props} />
