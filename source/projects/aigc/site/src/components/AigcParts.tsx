/** Independently reusable helpers from the included Figma Components page. */
import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { figmaImage } from '../data/assets'
import { AigcPartVector } from './AigcPartVectors'

const FONT = "Roboto, 'Segoe UI', Arial, sans-serif"
const bareButton: CSSProperties = { fontFamily: FONT, border: 0, padding: 0, cursor: 'pointer', color: 'inherit', background: 'transparent', outlineOffset: 3 }
export const PART_SOURCE_IMAGE_HASHES = {
  promptTemplate: 'ef79d4f453f2abe81aebe3638960ec536d09dafe',
  promptOriginal: 'ef79d4f453f2abe81aebe3638960ec536d09dafe',
  displayLandscapeSelected: '78c3724e4f1be49e35f2f5b02bc334feb500041e',
  displayLandscapeUnselected: 'bdaf4e94891b34d77a6aeb5f08d63a78410af701',
  displaySquareSelected: '3ff315905c14ee837c58ba797ffa6e2ba05337b0',
  displaySquareUnselected: '6c5a60f55eb5b7acd57eee2d424220e7f78a07b4',
  serpTemplate: '819503ea34a4eb8c90ff9f3d881e28c600231765',
  serpReference: 'e6ca6b7fd2e5249609839e3e7d27fb69d178a6f8',
} as const
export const FOOTER_PROMPTS = {
  '2 lines': 'A cute bear with big sparkling eyes, sitting on a green meadow surrounded by flowers and sun rays. Bright colors, fairy-tale style, soft shadows',
  '4 lines': 'A cute bear with big sparkling eyes, sitting on a green meadow surrounded by flowers and sun rays. Bright colors, fairy-tale style, soft shadowsA cute bear with big sparkling eyes, sitting on a green meadow surrounded by flowers and sun rays. Bright colors, fairy-tale style, soft shadowsA cute bear with big sparkling eyes, sitting on a green meadow surrounded by flowers and sun rays. Bright colors, fairy-tale style, soft shadowsA cute bear with big sparkling eyes, sitting on a green me...',
} as const

export type PromptTemplateVariant = 'Original' | 'Template'
export interface PromptTemplateCardProps {
  /** Canonical Figma Property 1. */
  property1?: PromptTemplateVariant
  imageHash?: string
  src?: string
  onSelect?: (variant: PromptTemplateVariant) => void
}

export function PromptTemplateCard({ property1 = 'Template', imageHash, src, onSelect }: PromptTemplateCardProps) {
  const original = property1 === 'Original'
  const label = original ? 'Original' : 'Sketch'
  return <button type="button" onClick={() => onSelect?.(property1)} aria-label={`Use ${label}`} data-aigc-component="PromptTemplateCard" data-figma-node={original ? '437:83689' : '437:83685'}
    style={{ ...bareButton, width: 88, height: 116, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'stretch', flexShrink: 0, background: '#fff' }}>
    <span style={{ display: 'block', width: 88, height: 88, position: 'relative', borderRadius: original ? 24 : 16, overflow: 'hidden', flexShrink: 0 }}>
      <img src={src ?? figmaImage(imageHash ?? PART_SOURCE_IMAGE_HASHES.promptTemplate)} alt="" width={88} height={88} style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} />
      {original && <span aria-hidden="true" style={{ position: 'absolute', top: 30, left: 30 }}><AigcPartVector name="originalCheck" /></span>}
    </span>
    <span style={{ padding: '0 4px', width: '100%', textAlign: 'center', color: '#000', fontSize: 13, lineHeight: '20px', fontWeight: 400 }}>{label}</span>
  </button>
}

export type CheckmarkVariant = 'Default' | 'Variant2'
export interface CheckmarkCircleProps { property1?: CheckmarkVariant }

export function CheckmarkCircle({ property1 = 'Default' }: CheckmarkCircleProps) {
  const small = property1 === 'Variant2'
  return <span role="img" aria-label="Selected" data-aigc-component="CheckmarkCircle" data-figma-node={small ? '437:83681' : '437:83678'}
    style={{ width: small ? 24 : 28, height: small ? 24 : 28, display: 'block', flexShrink: 0, filter: small ? 'drop-shadow(0 3px 8px rgba(0,0,0,.15)) drop-shadow(0 3px 1px rgba(0,0,0,.06))' : 'drop-shadow(0 2.3333px 6.2222px rgba(0,0,0,.15)) drop-shadow(0 2.3333px .7778px rgba(0,0,0,.06))' }}>
    <AigcPartVector name={small ? 'check24' : 'check28'} />
  </span>
}

export type MainImageFooterVariant = keyof typeof FOOTER_PROMPTS
export interface MainImageFooterProps {
  property1?: MainImageFooterVariant
  /** Optional host content overrides; they are not additional Figma variant axes. */
  prompt?: string
  mode?: string
  aspectRatio?: string
  width?: number | string
  onPromptChange?: (prompt: string) => void
  onEditPrompt?: () => void
  onFeedback?: (feedback: 'like' | 'dislike' | null) => void
}

export function MainImageFooter({ property1 = '2 lines', prompt, mode = 'Vivid storytelling', aspectRatio = '3:2', width = 909, onPromptChange, onEditPrompt, onFeedback }: MainImageFooterProps) {
  const sourcePrompt = prompt || FOOTER_PROMPTS[property1]
  const [draft, setDraft] = useState(sourcePrompt)
  const [editing, setEditing] = useState(false)
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null)
  useEffect(() => { setDraft(sourcePrompt); setEditing(false) }, [sourcePrompt])
  const lines = property1 === '4 lines' ? 4 : 2
  const choose = (value: 'like' | 'dislike') => { const next = feedback === value ? null : value; setFeedback(next); onFeedback?.(next) }
  const badge: CSSProperties = { display: 'inline-block', borderRadius: 8, padding: '2px 8px', color: 'rgba(255,255,255,.8)', background: '#000', fontSize: 13, lineHeight: '20px', whiteSpace: 'nowrap' }
  const feedbackButton: CSSProperties = { ...bareButton, width: 28, height: 28, display: 'grid', placeItems: 'center', borderRadius: 4, background: '#232738', color: '#d9dffb', flexShrink: 0 }
  return <div data-aigc-component="MainImageFooter" data-figma-node={property1 === '4 lines' ? '464:32758' : '464:32759'} style={{ width, minHeight: property1 === '4 lines' ? 152 : 108, boxSizing: 'border-box', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8, fontFamily: FONT, color: '#fff', background: 'linear-gradient(to bottom,rgba(0,0,0,0) 0%,rgba(0,0,0,.7) 49.3013%)', flexShrink: 0 }}>
    <div style={{ display: 'flex', gap: 8 }}><span style={badge}>Mode: {mode}</span><span style={badge}>{aspectRatio}</span></div>
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', minWidth: 0 }}>
      {editing ? <textarea autoFocus aria-label="Edit image prompt" value={draft} rows={lines} onChange={event => setDraft(event.target.value)} onBlur={() => { setEditing(false); onPromptChange?.(draft) }}
        style={{ flex: 1, minWidth: 0, height: lines * 22, font: `14px/22px ${FONT}`, color: '#fff', background: 'rgba(0,0,0,.45)', border: '1px solid rgba(255,255,255,.5)', padding: 0, resize: 'vertical', boxSizing: 'border-box' }} />
        : <div style={{ flex: 1, minWidth: 0, height: lines * 22, fontSize: 14, lineHeight: '22px', overflow: 'hidden', overflowWrap: 'anywhere' }}>
            {draft}<button type="button" aria-label="Edit prompt" onClick={() => { if (onEditPrompt) onEditPrompt(); else setEditing(true) }} style={{ ...bareButton, display: 'inline-grid', placeItems: 'center', width: 24, height: 22, verticalAlign: 'middle' }}><AigcPartVector name="edit" /></button>
          </div>}
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button type="button" aria-label="Like image" aria-pressed={feedback === 'like'} onClick={() => choose('like')} style={{ ...feedbackButton, boxShadow: feedback === 'like' ? 'inset 0 0 0 1px #d9dffb' : undefined }}><AigcPartVector name="like" /></button>
        <button type="button" aria-label="Dislike image" aria-pressed={feedback === 'dislike'} onClick={() => choose('dislike')} style={{ ...feedbackButton, boxShadow: feedback === 'dislike' ? 'inset 0 0 0 1px #d9dffb' : undefined }}><AigcPartVector name="dislike" /></button>
      </div>
    </div>
  </div>
}

export type DisplayImageSelection = 'selected' | 'unselected'
export type DisplayImageAspect = '1:1' | '3:2'
export interface DisplayImageProps {
  property1?: DisplayImageSelection
  property2?: DisplayImageAspect
  imageHash?: string
  src?: string
  alt?: string
  onSelect?: () => void
  onLive?: (values: { property1: DisplayImageSelection; property2: DisplayImageAspect }) => void
}

export function DisplayImage({ property1 = 'selected', property2 = '3:2', imageHash, src, alt = 'Generated image thumbnail', onSelect, onLive }: DisplayImageProps) {
  const [selected, setSelected] = useState(property1 === 'selected')
  useEffect(() => setSelected(property1 === 'selected'), [property1, property2])
  const square = property2 === '1:1'
  // Keep the source image tied to the requested configuration while a click changes selection.
  const hash = imageHash ?? (square
    ? property1 === 'selected' ? PART_SOURCE_IMAGE_HASHES.displaySquareSelected : PART_SOURCE_IMAGE_HASHES.displaySquareUnselected
    : property1 === 'selected' ? PART_SOURCE_IMAGE_HASHES.displayLandscapeSelected : PART_SOURCE_IMAGE_HASHES.displayLandscapeUnselected)
  const nodeId = square ? (selected ? '470:34251' : '470:34252') : (selected ? '470:34233' : '470:34232')
  return <button type="button" aria-label={alt} aria-pressed={selected} onClick={() => { setSelected(true); onSelect?.(); onLive?.({ property1: 'selected', property2 }) }} data-aigc-component="DisplayImage" data-figma-node={nodeId}
    style={{ ...bareButton, width: square ? 150 : 223, height: 150.5, display: 'block', position: 'relative', overflow: 'hidden', flexShrink: 0, background: '#fff', boxShadow: square && selected ? '0 0 1px rgba(0,0,0,.08),0 2px 4px rgba(0,0,0,.03),0 4px 6px rgba(0,0,0,.08)' : undefined }}>
    <img src={src ?? figmaImage(hash)} alt="" style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }} />
    {selected && <span style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.3)', display: 'grid', placeItems: 'center' }}><CheckmarkCircle /></span>}
  </button>
}

export interface SerpTemplateCardProps {
  /** Content overrides for use in a carousel; canonical card has no variant axes. */
  title?: string
  imageHash?: string
  referenceImageHash?: string
  src?: string
  referenceSrc?: string
  onSelect?: () => void
}

export function SerpTemplateCard({ title = 'Product Spotlight', imageHash = PART_SOURCE_IMAGE_HASHES.serpTemplate, referenceImageHash = PART_SOURCE_IMAGE_HASHES.serpReference, src, referenceSrc, onSelect }: SerpTemplateCardProps) {
  return <button type="button" aria-label={`Use ${title} template`} onClick={onSelect} data-aigc-component="SerpTemplateCard" data-figma-node="598:38176"
    style={{ ...bareButton, position: 'relative', display: 'flex', flexDirection: 'column', gap: 8, width: 200, height: 200, textAlign: 'left', flexShrink: 0, color: '#000' }}>
    <img src={src ?? figmaImage(imageHash)} alt="" width={200} height={170} style={{ display: 'block', borderRadius: 24, width: 200, height: 170, objectFit: 'cover', objectPosition: imageHash === PART_SOURCE_IMAGE_HASHES.serpTemplate && !src ? '50% 73.3333%' : 'center', flexShrink: 0 }} />
    <span style={{ display: 'block', width: 200, padding: '0 4px', fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 14, lineHeight: '22px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
    <span aria-hidden="true" style={{ position: 'absolute', top: 110, left: 12, width: 48, height: 48, borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,.15)' }}>
      <img src={referenceSrc ?? figmaImage(referenceImageHash)} alt="" width={48} height={48} style={{ display: 'block', width: 48, height: 48, objectFit: 'cover' }} />
      <span style={{ position: 'absolute', inset: 0, borderRadius: 12, boxShadow: 'inset 0 0 0 2px #fff' }} />
    </span>
  </button>
}
