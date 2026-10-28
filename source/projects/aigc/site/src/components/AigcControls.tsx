import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { figmaImage } from '../data/assets'
import { ControlIcon } from './AigcControlIcons'
import { AigcControlWarning } from './AigcControlWarning'
import type { ControlIconName } from './AigcControlIcons'

const font = "Roboto, 'Segoe UI', Arial, sans-serif"
const blue = '#0159ba'
const primary = '#4f6bed'
const baseButton: CSSProperties = { fontFamily: font, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4, border: 0, cursor: 'pointer', background: 'transparent', padding: 0, color: 'inherit' }
const srOnly: CSSProperties = { position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap' }
type LiveReporter = (values: Record<string, string | boolean>) => void
const sourceArt = (name: string) => `${import.meta.env?.BASE_URL ?? './'}figma/controls/${name}.png`

/** Exact source labels; the spelling is retained even where the Figma copy has typos. */
export const ERROR_CONTENT = {
  'not_signed_in': { nodeId: '508:31715', title: 'Guest image generation is limited.', body: 'Sign in to continue creating, or try another model.', action: 'Sign in & Keep Creating', hash: '', artY: 173, textY: 325, artHeight: 136, gap: 4 },
  'Access suspended': { nodeId: '508:31675', title: 'Access suspended for 1 hour', body: 'Access to image Creator has been suspended due to content policy violations. You will be able to create images again once the suspension is lifted.', action: '', hash: '', artY: 247, textY: 283, artHeight: 24, gap: 8 },
  'Run into an issue': { nodeId: '508:31693', title: 'We’re sorry - we’ve run into an issue.', body: 'Create a new image or discover ideas on the Bing Creator portal.', action: 'Go to Creator Portal', hash: '304d8e255a96db1f775f81661850b1d453dedc2a', artY: 122, textY: 380, artHeight: 242, gap: 8 },
  'Need descriptive prompt': { nodeId: '508:31708', title: 'Please provide a more descriptive prompt', body: 'The prompt was too vague to generate high-quality images. Visit our FAQ page for tips on writing better prompts.', action: '', hash: '7acbccc18861cce6b17f4194e8b7546af3dab2d2', artY: 138, textY: 385, artHeight: 242, gap: 8 },
  'need to re-imagene': { nodeId: '508:31685', title: "We'll need to re-imagene that!", body: 'We couldn’t load this image. Please try again.', action: 'Retry', hash: '8a66a18de7f6d3e5599932aa11dab33975ef5246', artY: 120, textY: 367, artHeight: 242, gap: 4 },
  'in progress': { nodeId: '508:31701', title: 'Please wait. Your images are currently in progress', body: 'Check back later to see if your images are ready.', action: '', hash: 'a95190311e4310c99c8b26c7c9973f7eb8bae53f', artY: 149, textY: 396, artHeight: 242, gap: 8 },
} as const
export type ErrorState = keyof typeof ERROR_CONTENT
export interface ErrorStatesProps { state?: ErrorState; width?: number; onAction?: (action: string) => void }

export function ErrorStates({ state = 'not_signed_in', width = 1134, onAction }: ErrorStatesProps) {
  const item = ERROR_CONTENT[state]
  const [announcement, setAnnouncement] = useState('')
  const scale = width / 1134
  const suspended = state === 'Access suspended'
  return <div data-figma-node={item.nodeId} style={{ width, height: 608 * scale, position: 'relative', flexShrink: 0, fontFamily: font }}>
    <div style={{ width: 1134, height: 608, position: 'absolute', transform: `scale(${scale})`, transformOrigin: 'top left', background: '#f7f7f7', border: '1px solid rgba(0,0,0,.1)', borderRadius: 12, overflow: 'hidden', color: '#111' }}>
      {state === 'not_signed_in' ? <img src={sourceArt('guest-lock-error')} alt="" width={153} height={138} style={{ position: 'absolute', top: 172, left: 491 }} />
        : suspended ? <span style={{ position: 'absolute', top: 247, left: 553, color: '#bc6700' }}><AigcControlWarning /></span>
          : <img src={figmaImage(item.hash)} alt="" width={264} height={242} style={{ position: 'absolute', top: item.artY, left: 435, objectFit: 'fill' }} />}
      <div style={{ position: 'absolute', top: item.textY, left: suspended ? 317 : 327, width: suspended ? 500 : 480, textAlign: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: 18, lineHeight: '22px', color: suspended ? '#bc6700' : '#111' }}>{item.title}</div>
        <div style={{ fontSize: 14, lineHeight: '22px', marginTop: item.gap, color: '#767676' }}>{item.body}</div>
        {item.action && <button type="button" onClick={() => { onAction?.(item.action); setAnnouncement(`${item.action} selected`) }} style={{ ...baseButton, marginTop: state === 'Run into an issue' ? 16 : 24, background: '#d9dffb', borderRadius: 999, height: 38, padding: '0 16px', fontSize: 13, lineHeight: '20px', color: blue }}>{item.action}</button>}
      </div>
      <span role="status" style={srOnly}>{announcement}</span>
    </div>
  </div>
}

export const SIGN_IN_CONTENT = {
  'reach limit': { nodeId: '508:31108', title: 'You’ve reached today’s guest creation limit', body: 'Sign in to create more and unlock additional models—free.', action: 'Sign in & Generate', width: 400, height: 357 },
  'keep creating': { nodeId: '508:31111', title: 'Guest creation is at today’s capacity', body: 'Sign in to keep creating without interruption.\nGuest limits reset daily.', action: 'Sign in & Keep Creating', width: 400, height: 357 },
  'unlcok models': { nodeId: '508:31110', title: 'Unlock advance creation models', body: 'Get free credits and access more advanced creation models.', action: 'Sign in & Generate', width: 400, height: 353 },
  'unlock uploads': { nodeId: '508:31109', title: 'Sign in to Bing to unlock uploads and create your image', body: 'Sign in to unlock advanced models and additional creation credits—power up every generation.', action: 'Sign in & Generate', width: 400, height: 411 },
  'top right': { nodeId: '508:31107', title: 'Sign in to create more in parallel and save', body: 'Create up to 3 images at once and revisit your past creations anytime', action: 'Sign in', width: 435, height: 154 },
} as const
export const REWARDS_NOTICE = 'You will receive emails about Microsoft Rewards, which include offers about Microsoft and partner products.'
export type SignInState = keyof typeof SIGN_IN_CONTENT
export interface SignInPromptsProps { state?: SignInState; onSignIn?: () => void; onClose?: () => void }

export function SignInPrompts({ state = 'reach limit', onSignIn, onClose }: SignInPromptsProps) {
  const item = SIGN_IN_CONTENT[state]
  const [closed, setClosed] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  useEffect(() => { setClosed(false); setAnnouncement('') }, [state])
  const dismiss = () => { setClosed(true); onClose?.() }
  const signIn = () => { onSignIn?.(); setAnnouncement('Sign in selected') }
  if (closed) return <button type="button" style={{ ...baseButton, color: blue, fontSize: 13, padding: 12 }} onClick={() => setClosed(false)}>Reopen sign-in prompt</button>
  if (state === 'top right') return <div data-figma-node={item.nodeId} style={{ position: 'relative', width: 435, minHeight: 154, padding: '20px 16px 16px', border: '1px solid rgba(0,0,0,.1)', borderRadius: 16, background: '#fff', boxShadow: '-5px 4px 12px rgba(0,0,0,.1)', display: 'flex', gap: 16, fontFamily: font, flexShrink: 0 }}>
    <div style={{ position: 'absolute', width: 12, height: 12, right: 20, top: -7, transform: 'rotate(45deg)', background: '#fff', borderLeft: '1px solid rgba(0,0,0,.1)', borderTop: '1px solid rgba(0,0,0,.1)' }} />
    <div style={{ width: 90, flex: '0 0 90px', position: 'relative', alignSelf: 'center', height: 72 }}>
      <img src={figmaImage('695922851b93d8ead5afba8b8ec1148f9423abf1')} alt="" width={56} height={56} style={{ position: 'absolute', top: 0, left: 0, objectFit: 'cover', borderRadius: 12, boxShadow: '0 9px 12px rgba(132,107,74,.2)' }} />
      <img src={figmaImage('9c4e15b4ec0e09835e84006bf9ede7c5d266bf4f')} alt="" width={30} height={30} style={{ position: 'absolute', top: 21, left: 60, objectFit: 'cover', borderRadius: 8 }} />
      <span aria-hidden="true" style={{ position: 'absolute', top: -9, left: 46, width: 22, height: 22, borderRadius: '50%', color: '#fff', background: '#6b769a', textAlign: 'center', fontSize: 18, lineHeight: '22px' }}>+</span>
    </div>
    <div style={{ flex: 1, minWidth: 0 }}><strong style={{ display: 'block', fontSize: 14, lineHeight: '22px', paddingRight: 20 }}>{item.title}</strong><p style={{ fontSize: 14, lineHeight: '22px', margin: '4px 0 8px' }}>{item.body}</p><button type="button" onClick={signIn} style={{ ...baseButton, borderRadius: 8, background: primary, color: '#fff', height: 38, padding: '0 12px', fontSize: 13 }}>{item.action}</button></div>
    <button type="button" aria-label="Close sign-in prompt" onClick={dismiss} style={{ ...baseButton, width: 24, height: 24, position: 'absolute', top: 16, right: 16 }}><ControlIcon name="close" size={24} /></button><span role="status" style={srOnly}>{announcement}</span>
  </div>
  return <div data-figma-node={item.nodeId} style={{ width: 400, minHeight: item.height, borderRadius: 16, padding: 20, background: '#fff', fontFamily: font, color: '#111', flexShrink: 0 }}>
    <div style={{ position: 'relative', textAlign: 'center' }}>
      <strong style={{ display: 'block', fontSize: 16, lineHeight: '26px', width: 'calc(100% - 24px)' }}>{item.title}</strong>
      <button type="button" aria-label="Close sign-in prompt" onClick={dismiss} style={{ ...baseButton, position: 'absolute', top: 0, right: 0, width: 24, height: 24 }}><ControlIcon name="close" size={24} /></button>
      <p style={{ fontSize: 14, lineHeight: '22px', color: '#444', whiteSpace: 'pre-line', margin: '4px 0 0' }}>{item.body}</p>
    </div>
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
      {state === 'unlock uploads' ? <img src={figmaImage('484f886c2b263be7e732227f503c54f144f4a495')} alt="" width={209} height={144} style={{ objectFit: 'contain' }} />
        : <img src={sourceArt('guest-lock-modal')} alt="" width={125} height={state === 'unlcok models' ? 113 : 117} style={{ objectFit: 'contain' }} />}
    </div>
    <button type="button" onClick={signIn} style={{ ...baseButton, width: '100%', height: 36, borderRadius: 8, background: primary, color: '#fff', fontSize: 13, fontWeight: 700, marginTop: 16 }}>{item.action}</button>
    <div style={{ marginTop: 16, fontSize: 11, lineHeight: '13px', color: '#767676', textAlign: 'center' }}><p style={{ margin: 0 }}>{REWARDS_NOTICE}</p><p style={{ margin: '8px 0 0', textDecoration: 'underline' }}>Privacy | Rewards Terms | Image Creator Terms</p></div>
    <span role="status" style={srOnly}>{announcement}</span>
  </div>
}

export const STYLE_ITEMS = [
  { name: 'Anime', hash: '7259067f3fab2705ce742f48d77ba87edbd11b7a' },
  { name: '3D Cartoon', hash: '52923dc8eba348f60e7a8c296572185d4d2fe787' },
  { name: 'Plushy', hash: 'f8bb0783809c4eaff5ab6fcf14a2666ddc32c69e' },
  { name: 'Watercolor', hash: '2375bc861c78b705a8d0738981517f20c38fc45e' },
  { name: 'Sketch', hash: '833f3b794bd41e3cfc1f72903f8b112192f4f2c5' },
  { name: 'Sticker', hash: '141b22aef72692f8374fd44baa3b74b19dc8e3b3' },
] as const
export type CreationStyle = typeof STYLE_ITEMS[number]['name']
export interface StyleMenuProps { selectedStyle?: CreationStyle; showMore?: boolean; onSelect?: (style: CreationStyle) => void; onMore?: () => void; onLive?: LiveReporter }

export function StyleMenu({ selectedStyle = 'Sketch', showMore = false, onSelect, onMore, onLive }: StyleMenuProps) {
  const [selected, setSelected] = useState<CreationStyle>(selectedStyle)
  const [hover, setHover] = useState<CreationStyle | null>(null)
  useEffect(() => setSelected(selectedStyle), [selectedStyle])
  return <div data-figma-node="542:32853" style={{ width: 184, padding: 12, boxSizing: 'border-box', borderRadius: 16, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.1), -5px 4px 12px rgba(0,0,0,.1)', fontFamily: font, background: '#fff', color: '#000', flexShrink: 0 }}>
    <div style={{ height: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}><strong style={{ fontSize: 14, lineHeight: '22px' }}>Choose a style</strong><button type="button" aria-label="Reset style selection" style={{ ...baseButton, width: 24, height: 24 }} onClick={() => { setSelected('Sketch'); onSelect?.('Sketch'); onLive?.({ selectedStyle: 'Sketch', showMore }) }}><ControlIcon name="recreate" size={16} /></button></div>
    <div role="listbox" aria-label="Image style" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {STYLE_ITEMS.map(item => <div key={item.name} style={{ position: 'relative', height: 36 }}><button role="option" aria-selected={selected === item.name} type="button" onMouseEnter={() => setHover(item.name)} onMouseLeave={() => setHover(null)} onClick={() => { setSelected(item.name); onSelect?.(item.name); onLive?.({ selectedStyle: item.name, showMore }) }} style={{ ...baseButton, position: 'absolute', top: -4, left: -4, width: 168, height: 44, justifyContent: 'flex-start', gap: 8, borderRadius: 8, padding: 4, background: (hover ?? selected) === item.name ? '#c4c4c4' : 'transparent', fontSize: 13, lineHeight: '20px', textAlign: 'left' }}><img src={figmaImage(item.hash)} alt="" width={36} height={36} style={{ objectFit: 'cover', borderRadius: 8 }} /><span>{item.name}</span></button></div>)}
      {showMore && <button type="button" onClick={onMore} style={{ ...baseButton, height: 36, fontSize: 13, justifyContent: 'flex-start' }}>View more</button>}
    </div>
  </div>
}

export const ACTION_CONFIGURATIONS = ['Image Default', 'Image Loading', 'Video', 'Video Loading'] as const
export type ActionConfiguration = typeof ACTION_CONFIGURATIONS[number]
export type ImageAction = 'Share' | 'Download' | 'Add to collection' | 'Set as wallpaper' | 'Edit image' | 'Recreate' | 'Explore templates'
export interface ActionBarProps { configuration?: ActionConfiguration; width?: number; onAction?: (action: ImageAction) => void }
export function ActionBar({ configuration = 'Image Default', width = 1134, onAction }: ActionBarProps) {
  const video = configuration.startsWith('Video')
  const loading = configuration.endsWith('Loading')
  const [announcement, setAnnouncement] = useState('')
  const action = (name: ImageAction) => { onAction?.(name); setAnnouncement(`${name} selected`) }
  const button = (name: ImageAction, icon: ControlIconName, label: boolean, buttonWidth: number) => <button key={name} type="button" aria-label={name} title={name} disabled={loading} onClick={() => action(name)} style={{ ...baseButton, width: buttonWidth, height: 36, borderRadius: 8, color: blue, opacity: loading ? .3 : 1, fontSize: video ? 14 : 13, fontWeight: 700, lineHeight: '20px', cursor: loading ? 'default' : 'pointer' }}><ControlIcon name={icon} />{label && <span>{name}</span>}</button>
  return <div data-figma-node={configuration === 'Image Default' ? '437:83588' : configuration === 'Image Loading' ? '437:83604' : configuration === 'Video' ? '437:83620' : '437:83630'} style={{ display: 'flex', alignItems: 'center', gap: 4, width, height: 36, fontFamily: font, flexShrink: 0, color: blue }}>
    {button('Share', 'share', video, video ? 97 : 36)}{button('Download', 'download', video, video ? 123 : 36)}
    {!video && button('Add to collection', 'collection', false, 36)}
    <div aria-hidden="true" style={{ width: 16, height: 20, paddingLeft: 12, paddingRight: 4, flexShrink: 0 }}><div style={{ borderLeft: '1px solid rgba(0,0,0,.2)', height: 20 }} /></div>
    {!video && <>{button('Set as wallpaper', 'wallpaper', true, 145)}{button('Edit image', 'edit', true, 110)}{button('Recreate', 'recreate', true, 101)}<span style={{ flex: 1 }} /><button type="button" onClick={() => action('Explore templates')} style={{ ...baseButton, width: 125, height: 26, color: blue, fontSize: 13, fontWeight: 400 }}>Explore templates</button></>}
    <span role="status" style={srOnly}>{announcement}</span>
  </div>
}

export const PROMPT_IDEAS = [
  'Cute fluffy bear in a fairy meadow, glowing flowers, dreamy fantasy lighting',
  'Cat astronaut floating in space, colorful nebula, playful sci-fi style',
  'Cozy treehouse in a magical forest, warm lantern lights, fantasy illustration',
  'Dreamy butterfly garden at sunset, glowing butterflies, soft pastel atmosphere',
] as const
export const COMPOSER_MODES = [
  { name: 'Vivid storytelling', description: 'MAI-Image-2.5-Flash: Detailed & dynamic' },
  { name: 'Stylized illustration', description: 'MAI-Image-2e: Good for quick, stylized art' },
] as const
export const COMPOSER_PLACEHOLDER = 'Describe the image you want created or select try a prompt’ to get inspired!'
export const COMPOSER_TYPED_PROMPT = 'A cute bear with big sparkling eyes, sitting on a green meadow surrounded by flowers and sun rays. Bright colors, fairy-tale style, soft shadows'
export type ComposerState = 'empty' | 'Model menu' | 'image uploaded' | 'typing'
export type ComposerMode = typeof COMPOSER_MODES[number]['name']
export interface CreationComposerProps { state?: ComposerState; prompt?: string; mode?: ComposerMode; onLive?: LiveReporter; onGenerate?: (prompt: string, mode: ComposerMode) => void; onClose?: () => void }

export function CreationComposer({ state = 'empty', prompt, mode = 'Vivid storytelling', onLive, onGenerate, onClose }: CreationComposerProps) {
  const [currentState, setCurrentState] = useState<ComposerState>(state)
  const [text, setText] = useState(prompt || (state === 'typing' ? COMPOSER_TYPED_PROMPT : ''))
  const [selectedMode, setSelectedMode] = useState<ComposerMode>(mode)
  const [menuOpen, setMenuOpen] = useState(state === 'Model menu')
  const [uploaded, setUploaded] = useState(state === 'image uploaded')
  const [ideasOpen, setIdeasOpen] = useState(state === 'empty' || state === 'Model menu')
  const [ideaOffset, setIdeaOffset] = useState(0)
  const [closed, setClosed] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  useEffect(() => { setCurrentState(state); setText(prompt || (state === 'typing' ? COMPOSER_TYPED_PROMPT : '')); setMenuOpen(state === 'Model menu'); setUploaded(state === 'image uploaded'); setIdeasOpen(state === 'empty' || state === 'Model menu'); setClosed(false) }, [state, prompt])
  useEffect(() => setSelectedMode(mode), [mode])
  const compact = currentState === 'image uploaded' || currentState === 'typing'
  const sourceWidth = compact ? 580 : 648
  const factor = compact ? 580 / 648 : 1
  const report = (nextText = text, nextMode = selectedMode, nextState: ComposerState = currentState) => { setCurrentState(nextState); onLive?.({ state: nextState, prompt: nextText, mode: nextMode }) }
  const setPrompt = (value: string) => { setText(value); report(value, selectedMode, uploaded ? 'image uploaded' : value ? 'typing' : 'empty') }
  if (closed) return <button type="button" style={{ ...baseButton, color: blue, padding: 12, fontSize: 13 }} onClick={() => setClosed(false)}>Reopen creation composer</button>
  return <div data-figma-node={currentState === 'empty' ? '542:32053' : currentState === 'Model menu' ? '551:34584' : currentState === 'typing' ? '542:32051' : '542:32052'} style={{ width: sourceWidth, fontFamily: font, fontSize: 14 * factor, lineHeight: `${22 * factor}px`, color: '#111', flexShrink: 0, padding: `${8 * factor}px ${12 * factor}px ${(currentState === 'image uploaded' ? 12 : 16) * factor}px`, borderRadius: 16 * factor, background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,.14), 0 0 0 1px rgba(0,0,0,.05)', position: 'relative', boxSizing: 'border-box' }}>
    <div style={{ height: 36 * factor, display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 12 * factor }}><strong style={{ fontSize: 14 * factor }}>{uploaded ? 'Edit your image' : 'Create new'}</strong><button type="button" aria-label="Close composer" style={{ ...baseButton, width: 36 * factor, height: 36 * factor }} onClick={() => { setClosed(true); onClose?.() }}><ControlIcon name="close" size={28 * factor} /></button></div>
    <div style={{ marginTop: 4 * factor, height: 80 * factor, padding: `0 ${4 * factor}px ${16 * factor}px`, display: 'flex', gap: 16 * factor }}>
      <button type="button" aria-label={uploaded ? 'Remove reference image' : 'Add reference image'} onClick={() => { const next = !uploaded; setUploaded(next); report(text, selectedMode, next ? 'image uploaded' : 'empty') }} style={{ ...baseButton, width: 64 * factor, height: 64 * factor, border: '1px solid rgba(0,0,0,.1)', borderRadius: 8 * factor, overflow: 'hidden', color: primary, flexShrink: 0 }}>{uploaded ? <img src={figmaImage('78c3724e4f1be49e35f2f5b02bc334feb500041e')} width={64 * factor} height={64 * factor} alt="Reference bear in a forest" style={{ objectFit: 'cover' }} /> : <span style={{ fontSize: 32 * factor, fontWeight: 200 }}>+</span>}</button>
      <textarea aria-label="Describe the image" value={text} onChange={event => setPrompt(event.target.value)} placeholder={COMPOSER_PLACEHOLDER} rows={3} style={{ flex: 1, minWidth: 0, border: 0, resize: 'none', outlineOffset: 2, background: 'transparent', color: text ? '#111' : '#b3b3b3', fontFamily: font, fontSize: 14 * factor, lineHeight: `${22 * factor}px`, padding: 0 }} />
    </div>
    <div style={{ height: 38 * factor, marginTop: 4 * factor, display: 'flex', alignItems: 'center', gap: 8 * factor, position: 'relative' }}>
      <button type="button" aria-haspopup="menu" aria-expanded={menuOpen} disabled={uploaded} onClick={() => { setMenuOpen(value => !value); report(text, selectedMode, menuOpen ? 'empty' : 'Model menu') }} style={{ ...baseButton, height: 36 * factor, padding: `0 ${12 * factor}px`, fontSize: 13 * factor, fontWeight: 700, color: blue, opacity: uploaded ? .3 : 1 }}>Mode: {selectedMode}<span style={{ marginLeft: 4, fontSize: 9 }}>▾</span></button>
      <span aria-hidden="true" style={{ height: 24 * factor, borderLeft: '1px solid rgba(0,0,0,.1)' }} />
      <button type="button" aria-label="Aspect ratio 1:1" title="Source aspect ratio: 1:1" style={{ ...baseButton, height: 36 * factor, padding: `0 ${12 * factor}px`, fontSize: 13 * factor, fontWeight: 700, color: blue }}>1:1 <span style={{ marginLeft: 4, fontSize: 9 }}>▾</span></button>
      <span style={{ flex: 1 }} /><span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 13 * factor, fontWeight: 700, color: blue, whiteSpace: 'nowrap' }}><ControlIcon name="credits" size={16 * factor} />15 left</span>
      <button type="button" disabled={!text.trim()} onClick={() => { onGenerate?.(text, selectedMode); setAnnouncement('Generate selected') }} style={{ ...baseButton, height: 38 * factor, padding: `0 ${12 * factor}px`, fontSize: 13 * factor, background: primary, opacity: text.trim() ? 1 : .3, color: '#fff', borderRadius: 8 * factor, marginLeft: 8 * factor }}>Generate</button>
      {menuOpen && <div role="menu" aria-label="Creation mode" style={{ position: 'absolute', zIndex: 10, left: 4, top: 40 * factor, width: 200, borderRadius: 8, background: '#fff', padding: '0 4px', boxShadow: '0 4px 16px rgba(0,0,0,.14)' }}>{COMPOSER_MODES.map(item => <button type="button" role="menuitemradio" aria-checked={selectedMode === item.name} key={item.name} onClick={() => { setSelectedMode(item.name); setMenuOpen(false); report(text, item.name, text ? 'typing' : 'empty') }} style={{ ...baseButton, width: 192, height: 56, textAlign: 'left', justifyContent: 'flex-start', gap: 8, padding: 8, borderRadius: 8, background: selectedMode === item.name ? '#f5f5f5' : '#fff' }}><span style={{ color: blue, width: 16, flexShrink: 0 }}>{selectedMode === item.name ? '✓' : ''}</span><span style={{ minWidth: 0, width: 152 }}><span style={{ display: 'block', fontSize: 13, lineHeight: '20px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span><span style={{ display: 'block', fontSize: 13, lineHeight: '20px', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description}</span></span></button>)}</div>}
    </div>
    {!compact && <><div style={{ borderTop: '1px solid rgba(0,0,0,.1)', marginTop: 16, marginBottom: 16 }} /><div style={{ height: 36, display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 12 }}><button type="button" aria-expanded={ideasOpen} onClick={() => setIdeasOpen(value => !value)} style={{ ...baseButton, fontSize: 16, fontWeight: 700, gap: 8 }}>Prompt ideas <span style={{ fontSize: 10 }}>▾</span></button><button type="button" aria-label="Refresh prompt ideas" style={{ ...baseButton, width: 24, height: 24 }} onClick={() => setIdeaOffset(value => (value + 1) % PROMPT_IDEAS.length)}><ControlIcon name="recreate" size={16} /></button></div>{ideasOpen && <div style={{ marginTop: 8, padding: '0 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>{PROMPT_IDEAS.map((_, index) => { const idea = PROMPT_IDEAS[(index + ideaOffset) % PROMPT_IDEAS.length]; return <button type="button" key={idea} onClick={() => setPrompt(idea)} style={{ ...baseButton, textAlign: 'left', justifyContent: 'flex-start', height: 26, gap: 8, fontSize: 14, lineHeight: '22px', color: '#444' }}><ControlIcon name="sparkle" size={20} /><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{idea}</span></button> })}</div>}</>}
    <span role="status" style={srOnly}>{announcement}</span>
  </div>
}
