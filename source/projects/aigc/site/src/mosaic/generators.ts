import { figmaImage } from '../data/assets'
import { AIGC_LANDSCAPE_HASHES, AIGC_SQUARE_HASHES, AIGC_PORTRAIT_HASH, AIGC_HISTORY_SINGLE_HASH, AIGC_SOURCE_PROMPT } from '../components/AigcMolecules'
import { ERROR_CONTENT, SIGN_IN_CONTENT, STYLE_ITEMS, COMPOSER_MODES, PROMPT_IDEAS, COMPOSER_PLACEHOLDER, COMPOSER_TYPED_PROMPT, REWARDS_NOTICE } from '../components/AigcControls'
import assemblySource from '../data/assembly-source.json'
import { basic, button, caption, card, col, finish, image, node, row, text, title, unwrapBasic } from './builders'
import type { MosaicGeneration, MosaicGenerator, MosaicLiveProps, MosaicSdlNode, MosaicValues } from './types'

export interface MosaicAdapter {
  status: 'available' | 'partial' | 'candidate' | 'gap' | 'product-only'
  identity: string
  componentTypes: string[]
  notes: string[]
  generate: MosaicGenerator
}

const productActionWarning = 'Product navigation, authentication, download, generation and mutations are omitted until the host supplies typed ActionConfig contracts.'
const localAssetWarning = 'Images reference the extracted local Figma assets. Publish these assets at reachable product/CDN URLs before using this SDL outside the local workbench.'
const imagePresentationWarning = 'The catalog has no verified blur, image-overlay or hover contract. SDL keeps source artwork and prompt content in normal flow; backdrop blur and overlay placement require a product renderer.'
const selectionWarning = 'Selection is a static snapshot using a catalog border/background; changing selection requires a host action. Exact Figma border paint is not covered by the catalog.'

function effective(values: MosaicValues, live: MosaicLiveProps): MosaicLiveProps { return { ...values, ...live } }
function string(props: MosaicLiveProps, key: string, fallback = ''): string { return typeof props[key] === 'string' ? props[key] as string : fallback }
function boolean(props: MosaicLiveProps, key: string, fallback = false): boolean { return typeof props[key] === 'boolean' ? props[key] as boolean : fallback }
function sourceEntry<T extends object>(source: T, key: string, fallback: keyof T): T[keyof T] {
  return source[Object.prototype.hasOwnProperty.call(source, key) ? key as keyof T : fallback]
}
function index(props: MosaicLiveProps, key: string, count: number): number {
  const number = Number(props[key] ?? 0)
  return Number.isInteger(number) ? Math.min(count - 1, Math.max(0, number)) : 0
}
function icon(name: string, ariaLabel?: string): MosaicSdlNode {
  return node('Icon', { name, size: 'md', ...(ariaLabel ? { ariaLabel } : { ariaHidden: true }) })
}

// Native image-paint hashes from Components/MainImage, Strip and HistoryRail.
// See design/molecule-specs.json and the retained node JSON for traceability.
const landscape = AIGC_LANDSCAPE_HASHES
const square = AIGC_SQUARE_HASHES
const bearPrompt = AIGC_SOURCE_PROMPT

function mainImageNode(ratio: string, hover = false, hash?: string, prompt = bearPrompt, mode = 'Vivid storytelling'): MosaicSdlNode {
  const portraitRatio = ratio === '2:3'
  const squareRatio = ratio === '1:1'
  const width = squareRatio ? 608 : portraitRatio ? 404 : 909
  const source = hash ?? (squareRatio ? square[0] : portraitRatio ? AIGC_PORTRAIT_HASH : landscape[0])
  const children = [image(figmaImage(source), 'Generated bear in a flower meadow', { width, height: 608, maxWidth: '100%', fit: 'contain' })]
  if (hover) children.push(col([
    row([caption(`Mode: ${mode}`), caption(ratio)], { gap: 4, justify: 'between' }),
    text(prompt, { size: 'md' }),
    row([
      button('', { iconStart: 'edit', ariaLabel: 'Edit prompt', variant: 'ghost', size: 'sm' }),
      button('', { iconStart: 'thumbs-up', ariaLabel: 'Like image', variant: 'ghost', size: 'sm' }),
      button('', { iconStart: 'thumbs-down', ariaLabel: 'Dislike image', variant: 'ghost', size: 'sm' }),
    ], { gap: 2 }),
  ], { gap: 2, padding: 4, width: '100%' }))
  return col(children, { width: ratio === '3:2' ? 909 : 982, maxWidth: '100%', align: 'center', background: 'surface-secondary' })
}

function stripNode(ratio: string, selected = 0, hashes?: readonly string[]): MosaicSdlNode {
  const width = ratio === '3:2' ? 223 : 150
  return col((hashes ?? (ratio === '3:2' ? landscape : square)).map((hash, item) => col([
    image(figmaImage(hash), `Generated image ${item + 1}`, { width, height: 150.5, fit: 'cover' }),
  ], { width, height: 150.5, border: item === selected ? 2 : 0, ariaLabel: `Generated image ${item + 1}${item === selected ? ', selected' : ''}` })), { width, gap: 0.5, role: 'list', ariaLabel: 'Generated image thumbnails' })
}

function historyTile(kind: string, selected: boolean, hashes?: readonly string[]): MosaicSdlNode {
  let children: MosaicSdlNode[]
  if (kind === 'Loading') {
    children = [col([], { width: 46, height: 46, radius: 'sm', background: 'surface-tertiary', role: 'progressbar', ariaLabel: 'Creation loading' })]
  } else if (kind === 'Multi') {
    const sources = hashes ?? [square[3], square[2], square[0], square[1]]
    children = [col([0, 2].map(offset => row(sources.slice(offset, offset + 2).map((hash, item) => image(figmaImage(hash), `Creation thumbnail ${offset + item + 1}`, { width: 22, height: 22 })), { gap: 0.5 })), { gap: 0.5 })]
  } else {
    children = [image(figmaImage(hashes?.[0] ?? AIGC_HISTORY_SINGLE_HASH), kind === 'Video' ? 'Video creation thumbnail' : 'Previous creation', { width: 46, height: 46, radius: 'sm' })]
    // No verified catalog layering contract: retain the video indicator in flow.
    if (kind === 'Video') children.push(icon('play', 'Video'))
  }
  return col(children, { width: 54, minHeight: 54, padding: 1, radius: 'md', border: selected ? 1.2528 : 0, align: 'center', ariaLabel: `${kind} creation${selected ? ', selected' : ''}` })
}

function mainContentNode(props: MosaicLiveProps): MosaicSdlNode {
  const variant = string(props, 'property1', 'Image3:2')
  if (variant === 'loading status') return col([
    image(figmaImage(assemblySource.loading.illustration.imageHash), '', { width: assemblySource.loading.illustration.width, height: assemblySource.loading.illustration.height, ariaHidden: true, fit: 'contain' }),
    title(assemblySource.loading.title, { size: 'lg' }),
    text('Analyze your prompt “an astronaut sits in a poppy field, working on a laptop”'),
    text('Create video characters, scene, camera language, etc...'),
    text('Almost there! Artwork always take time'),
  ], { width: 1134, height: 608, maxWidth: '100%', gap: 4, align: 'center', justify: 'center', background: 'surface-secondary', role: 'region', ariaLabel: 'Image generation progress' })
  if (variant === 'Single Image') return col([
    image(figmaImage(assemblySource.singleImage), 'Single restyled image result', { width: 909, height: 608, maxWidth: '100%', fit: 'contain' }),
  ], { width: 1134, maxWidth: '100%', align: 'center', background: 'surface-secondary' })
  const ratio = variant === 'Image1:1' ? '1:1' : variant === 'Image2:3' ? '2:3' : '3:2'
  const selected = index(props, 'selectedIndex', 4)
  const source = assemblySource.content[ratio]
  const hash = selected === 0 ? source.main : source.images[selected]
  return row([mainImageNode(ratio, string(props, 'mainStatus', 'Default') === 'hover', hash), stripNode(ratio, selected, source.images)], { width: 1134, maxWidth: '100%', gap: 0.5, align: 'start' })
}

function historyNode(props: MosaicLiveProps): MosaicSdlNode {
  const variant = string(props, 'property1', 'full')
  const items = variant === 'half' ? assemblySource.history.half : variant === 'unsigned in' ? assemblySource.history['unsigned in'] : assemblySource.history.full
  const selected = index(props, 'selectedIndex', items.length)
  const tiles = items.map((item, itemIndex) => historyTile(item.kind, selected === itemIndex, item.images))
  return col([
    button('New creation', { iconStart: 'add', variant: 'ghost', size: 'sm' }),
    col(tiles, { gap: 2 }),
    ...(variant !== 'unsigned in' ? [button('See all', { variant: 'ghost', size: 'sm' })] : []),
  ], { width: 54, minHeight: 608, gap: 4, align: 'center', ariaLabel: 'Creation history' })
}

const categories = ['All', 'Line drawing', 'Styles & aesthetics', 'Photo transform', 'Stickers', 'Editing tools']
// Visible template-card image paints in canonical SERP_Carousel 598:39314.
const templates = assemblySource.carousel
const carouselWarning = 'The source supplies one six-card template set. Category selection changes its visual state only; no alternative category dataset or filtering behavior is asserted. Overlay thumbnails are in normal flow and scrolling depends on the host.'
function carouselNode(props: MosaicLiveProps): MosaicSdlNode {
  const category = string(props, 'category', 'All')
  return col([
    title(string(props, 'heading', 'Get started with templates'), { size: 'md' }),
    row(categories.map(label => button(label, { variant: category === label ? 'solid' : 'ghost', color: 'secondary', size: 'sm' })), { gap: 2, scrollable: true }),
    row(templates.map(({ label, image: hash, original }) => col([
      image(figmaImage(hash), label, { width: 200, height: 170, radius: 'lg' }),
      row([image(figmaImage(original), `Original for ${label}`, { width: 48, height: 48, radius: 'sm' }), caption(label, { size: 'md' })], { gap: 2 }),
    ], { width: 200, minWidth: 200, gap: 2 })), { gap: 3, scrollable: true, role: 'list', ariaLabel: 'Image generation templates' }),
  ], { width: 1208, maxWidth: '100%', gap: 4 })
}

const sourceArt = (name: string) => `${import.meta.env?.BASE_URL ?? './'}figma/controls/${name}.png`
const modalWarning = 'The catalog has no dialog/flyout placement, focus-trap or dismissal contract. SDL exports a normal-flow card; the host must provide modal behavior and authentication.'
function errorNode(props: MosaicLiveProps): MosaicSdlNode {
  const state = string(props, 'state', 'not_signed_in')
  const item = sourceEntry(ERROR_CONTENT, state, 'not_signed_in')
  const artwork = item.hash
    ? image(figmaImage(item.hash), '', { width: 264, height: 242, fit: 'fill', ariaHidden: true })
    : state === 'Access suspended' ? icon('lock') : image(sourceArt('guest-lock-error'), '', { width: 153, height: 138, ariaHidden: true })
  return col([
    artwork,
    col([
      title(item.title, { size: 'lg', weight: 'bold', textAlign: 'center', ...(state === 'Access suspended' ? { color: 'warning' } : {}) }),
      text(item.body, { size: 'sm', color: 'secondary', textAlign: 'center' }),
      ...(item.action ? [button(item.action, { variant: 'soft', color: 'primary', size: 'sm' })] : []),
    ], { width: 500, maxWidth: '100%', align: 'center', gap: 2 }),
  ], { width: 1134, height: 608, maxWidth: '100%', align: 'center', justify: 'center', gap: 4, padding: 4, background: 'surface-secondary', radius: 'lg', border: 1, role: 'region', ariaLabel: item.title })
}

function signInNode(props: MosaicLiveProps): MosaicSdlNode {
  const state = string(props, 'state', 'reach limit')
  const item = sourceEntry(SIGN_IN_CONTENT, state, 'reach limit')
  const topRight = state === 'top right'
  const art = topRight
    ? row([
      image(figmaImage('695922851b93d8ead5afba8b8ec1148f9423abf1'), '', { width: 56, height: 56, radius: 'lg', ariaHidden: true }),
      image(figmaImage('9c4e15b4ec0e09835e84006bf9ede7c5d266bf4f'), '', { width: 30, height: 30, radius: 'md', ariaHidden: true }),
    ], { gap: 1, align: 'center' })
    : state === 'unlock uploads'
      ? image(figmaImage('484f886c2b263be7e732227f503c54f144f4a495'), '', { width: 209, height: 144, fit: 'contain', ariaHidden: true })
      : image(sourceArt('guest-lock-modal'), '', { width: 125, height: state === 'unlcok models' ? 113 : 117, fit: 'contain', ariaHidden: true })
  const children = [
    row([title(item.title, { size: 'sm', weight: 'bold' }), button('', { iconStart: 'dismiss', ariaLabel: 'Close sign-in prompt', variant: 'ghost', size: 'sm' })], { gap: 2, justify: 'between', align: 'start' }),
    text(item.body, { size: 'sm', color: 'secondary', textAlign: topRight ? 'start' : 'center' }),
    art,
    button(item.action, { color: 'primary', size: 'sm', pill: false }),
  ]
  if (!topRight) children.push(caption(REWARDS_NOTICE, { size: 'sm', textAlign: 'center' }), caption('Privacy | Rewards Terms | Image Creator Terms', { size: 'sm', textAlign: 'center' }))
  return col([card([col(children, { gap: 3, align: 'center' })], { padding: 5 })], { width: item.width, maxWidth: '100%', minHeight: item.height })
}

function styleNode(props: MosaicLiveProps): MosaicSdlNode {
  const selected = string(props, 'selectedStyle', 'Sketch')
  return col([card([
    row([title('Choose a style', { size: 'sm', weight: 'bold' }), button('', { iconStart: 'arrow-refresh', ariaLabel: 'Reset style selection', variant: 'ghost', size: 'sm' })], { align: 'center', justify: 'between' }),
    col(STYLE_ITEMS.map(item => row([
      image(figmaImage(item.hash), '', { width: 36, height: 36, radius: 'md', ariaHidden: true }),
      button(item.name, { variant: 'ghost', size: 'sm', ariaLabel: `${item.name}${selected === item.name ? ', selected' : ''}` }),
    ], { gap: 2, align: 'center', radius: 'md', background: selected === item.name ? 'surface-tertiary' : 'surface' })), { gap: 2 }),
    ...(boolean(props, 'showMore') ? [button('View more', { variant: 'ghost', size: 'sm' })] : []),
  ], { padding: 3 })], { width: 184 })
}

function actionsNode(props: MosaicLiveProps): MosaicSdlNode {
  const configuration = string(props, 'configuration', 'Image Default')
  const video = configuration.startsWith('Video')
  const loading = configuration.endsWith('Loading')
  const item = (label: string, iconStart: string, showLabel: boolean) => button(showLabel ? label : '', { iconStart, ariaLabel: label, disabled: loading, variant: 'ghost', color: 'primary', size: 'sm', pill: false })
  const children = [item('Share', 'share', video), item('Download', 'download', video)]
  if (!video) children.push(item('Add to collection', 'collections', false))
  children.push(icon('vertical-divider'))
  if (!video) children.push(
    item('Set as wallpaper', 'desktop', true), item('Edit image', 'edit', true), item('Recreate', 'arrow-refresh', true),
    col([], { flex: 1 }), button('Explore templates', { variant: 'ghost', color: 'primary', size: 'sm' }),
  )
  return row(children, { width: 1134, maxWidth: '100%', gap: 1, align: 'center', role: 'toolbar', ariaLabel: video ? 'Video actions' : 'Image actions' })
}

const composerWarning = 'The source composer becomes catalog Textarea and Buttons. Mode-menu positioning, reference upload, suggestion selection, credit balance and generation are product integrations; no service action is fabricated.'
function composerNode(props: MosaicLiveProps): MosaicSdlNode {
  const state = string(props, 'state', 'empty')
  const compact = state === 'image uploaded' || state === 'typing'
  const prompt = string(props, 'prompt', state === 'typing' ? COMPOSER_TYPED_PROMPT : '')
  const mode = string(props, 'mode', 'Vivid storytelling')
  const children = [
    row([title(state === 'image uploaded' ? 'Edit your image' : 'Create new', { size: 'sm', weight: 'bold' }), button('', { iconStart: 'dismiss', ariaLabel: 'Close composer', variant: 'ghost', size: 'sm' })], { justify: 'between', align: 'center' }),
    row([
      state === 'image uploaded'
        ? image(figmaImage(landscape[0]), 'Reference bear in a forest', { width: 64, height: 64, radius: 'md' })
        : button('', { iconStart: 'add', ariaLabel: 'Add reference image', variant: 'outline', size: 'lg' }),
      col([node('Textarea', { name: 'prompt', defaultValue: prompt, placeholder: COMPOSER_PLACEHOLDER, rows: 3, variant: 'soft', size: 'sm' })], { flex: 1 }),
    ], { gap: 4, align: 'start' }),
    row([
      button(`Mode: ${mode}`, { variant: 'ghost', color: 'primary', size: 'sm', disabled: state === 'image uploaded' }),
      button('1:1', { variant: 'ghost', color: 'primary', size: 'sm' }),
      caption('15 left', { size: 'md' }),
      button('Generate', { color: 'primary', size: 'sm', disabled: !prompt.trim(), pill: false }),
    ], { gap: 2, align: 'center', justify: 'between' }),
  ]
  if (state === 'Model menu') children.push(card([col(COMPOSER_MODES.map(item => col([
    button(item.name, { variant: mode === item.name ? 'soft' : 'ghost', color: 'secondary', size: 'sm' }),
    caption(item.description, { size: 'md' }),
  ], { gap: 1 })), { gap: 2 })], { padding: 3 }))
  if (!compact) children.push(node('Divider'), row([title('Prompt ideas', { size: 'sm', weight: 'bold' }), button('', { iconStart: 'arrow-refresh', ariaLabel: 'Refresh prompt ideas', variant: 'ghost', size: 'sm' })], { align: 'center', gap: 2 }), ...PROMPT_IDEAS.map(idea => button(idea, { iconStart: 'sparkle', variant: 'ghost', size: 'sm' })))
  return col([card([col(children, { gap: 3 })], { padding: 3 })], { width: compact ? 580 : 648, maxWidth: '100%' })
}

const shellWarning = 'Only the Bing Creator answer is portable. The surrounding Bing search header, navigation and search-result shell are product-owned and omitted; when pageShell is enabled, its query is retained only as context text.'
function answerNode(props: MosaicLiveProps): MosaicSdlNode {
  const error = string(props, 'state', 'Result') === 'Error'
  const query = string(props, 'query', bearPrompt)
  return col([
    title('Bing Creator', { size: 'lg', weight: 'bold' }),
    ...(boolean(props, 'pageShell', true) ? [text(query, { size: 'md' })] : []),
    row([
      col([error ? errorNode({ state: 'not_signed_in' }) : mainContentNode({ property1: string(props, 'imageVariant', 'Image3:2'), selectedIndex: props.selectedIndex }), actionsNode({ configuration: error || props.imageVariant === 'loading status' ? 'Image Loading' : 'Image Default' })], { gap: 4, width: 1134 }),
      historyNode({ property1: 'full', selectedIndex: props.historyIndex }),
    ], { gap: 5, align: 'start' }),
  ], { width: 1208, maxWidth: '100%', gap: 4 })
}

// Canonical public helper components from the included Components page.
const helperIconWarning = 'The source checkmark vector is represented by the catalog check-circle-filled icon. Its exact path, 24/28px dimensions and source color tokens require renderer verification.'
function checkmarkNode(props: MosaicLiveProps): MosaicSdlNode {
  const compact = string(props, 'property1', 'Default') === 'Variant2'
  return col([node('Icon', { name: 'check-circle-filled', size: compact ? 'lg' : 'xl', color: 'accent-550', ariaLabel: 'Selected' })], { width: compact ? 24 : 28, height: compact ? 24 : 28, align: 'center', justify: 'center' })
}

function displayImageNode(props: MosaicLiveProps): MosaicSdlNode {
  const selected = string(props, 'property1', 'selected') === 'selected'
  const squareRatio = string(props, 'property2', '3:2') === '1:1'
  const source = (squareRatio ? square : landscape)[selected ? 0 : 1]
  const width = squareRatio ? 150 : 223
  return col([image(figmaImage(source), 'Generated image preview', { width, height: 150.5, fit: 'cover' })], { width, height: 150.5, border: selected ? 2 : 0, ariaLabel: `Generated image${selected ? ', selected' : ''}` })
}

function promptTemplateNode(props: MosaicLiveProps): MosaicSdlNode {
  const original = string(props, 'property1', 'Template') === 'Original'
  return col([
    image(figmaImage('ef79d4f453f2abe81aebe3638960ec536d09dafe'), original ? 'Original image' : 'Sketch template image', { width: 88, height: 88, radius: 'md' }),
    caption(original ? 'Original' : 'Sketch', { size: 'md' }),
  ], { width: 88, height: 116, gap: 2 })
}

function footerNode(props: MosaicLiveProps): MosaicSdlNode {
  const fourLines = string(props, 'property1', '2 lines') === '4 lines'
  // Exact canonical Footer 464:32758/59 text, including its supplied ellipsis.
  const sourcePrompt = fourLines
    ? bearPrompt.repeat(3) + 'A cute bear with big sparkling eyes, sitting on a green me...'
    : bearPrompt
  return col([
    row([caption('Mode: Vivid storytelling', { color: 'white' }), caption('3:2', { color: 'white' })], { gap: 2 }),
    row([
      text(string(props, 'prompt', '') || sourcePrompt, { size: 'sm', color: 'white', maxLines: fourLines ? 4 : 2 }),
      button('', { iconStart: 'edit', ariaLabel: 'Edit prompt', variant: 'ghost', size: 'sm' }),
      button('', { iconStart: 'thumbs-up', ariaLabel: 'Like image', variant: 'ghost', size: 'sm' }),
      button('', { iconStart: 'thumbs-down', ariaLabel: 'Dislike image', variant: 'ghost', size: 'sm' }),
    ], { gap: 4, align: 'center' }),
  ], { width: 909, minHeight: fourLines ? 152 : 108, maxWidth: '100%', gap: 2, padding: 4, background: 'neutral-900' })
}

function serpTemplateNode(): MosaicSdlNode {
  return col([
    image(figmaImage('819503ea34a4eb8c90ff9f3d881e28c600231765'), 'Product Spotlight', { width: 200, height: 170, radius: 'lg' }),
    row([
      image(figmaImage('e6ca6b7fd2e5249609839e3e7d27fb69d178a6f8'), 'Original product image', { width: 48, height: 48, radius: 'sm' }),
      caption('Product Spotlight', { size: 'md' }),
    ], { gap: 2, align: 'center' }),
  ], { width: 200, gap: 2 })
}

// Controls and assembly adapters below use the same source contracts as React.
const adapters: Record<string, MosaicAdapter> = Object.create(null) as Record<string, MosaicAdapter>
function register(slug: string, identity: string, status: MosaicAdapter['status'], componentTypes: string[], notes: string[], generate: MosaicGenerator) {
  adapters[slug] = { identity, status, componentTypes, notes, generate }
}
register('main-image-area', 'MainImage → Col / Image / prompt footer', 'partial', ['Col', 'Image', 'Row', 'Caption', 'Text', 'Button'], [imagePresentationWarning, productActionWarning], (values, live) => {
  const props = effective(values, live)
  return finish(basic([mainImageNode(string(props, 'property1', '3:2'), string(props, 'status', 'Default') === 'hover', undefined, string(props, 'prompt', bearPrompt), string(props, 'mode', 'Vivid storytelling'))]), [imagePresentationWarning, localAssetWarning, productActionWarning])
})
register('image-display-list', 'Strip → Col / Image', 'partial', ['Col', 'Image'], [selectionWarning], (values, live) => {
  const props = effective(values, live)
  return finish(basic([stripNode(string(props, 'property1', '3:2'), index(props, 'selectedIndex', 4))]), [selectionWarning, localAssetWarning, productActionWarning])
})
register('history-panel-images', 'HistoryRail → Col / Row / Image', 'partial', ['Col', 'Row', 'Image', 'Icon'], [selectionWarning, 'Loading animation and the video play overlay use static catalog fallbacks.'], (values, live) => {
  const props = effective(values, live)
  return finish(basic([historyTile(string(props, 'property1', 'Multi'), string(props, 'property2', 'Default') === 'Selected')]), [selectionWarning, localAssetWarning, 'Loading animation and video-overlay positioning need a product renderer.'])
})
register('main-content-area', 'Main content → MainImage / Strip / generation state', 'partial', ['Col', 'Row', 'Image', 'Title', 'Text', 'Caption', 'Button'], [imagePresentationWarning, 'Generation progress is a source snapshot; no generation service is connected.'], (values, live) => finish(basic([mainContentNode(effective(values, live))]), [imagePresentationWarning, selectionWarning, productActionWarning, localAssetWarning]))
register('history-panel', 'Preview · History → history tiles and actions', 'partial', ['Col', 'Row', 'Image', 'Button'], [selectionWarning, productActionWarning], (values, live) => finish(basic([historyNode(effective(values, live))]), [selectionWarning, productActionWarning, localAssetWarning]))
register('serp-carousel', 'SERP_Carousel → title, categories and template cards', 'partial', ['Col', 'Row', 'Title', 'Image', 'Caption', 'Button'], [carouselWarning, productActionWarning], (values, live) => finish(basic([carouselNode(effective(values, live))]), [carouselWarning, localAssetWarning, productActionWarning]))
register('error-states', 'ErrorStatus → illustration, text and action', 'partial', ['Col', 'Image', 'Icon', 'Title', 'Text', 'Button'], ['All six canonical error states preserve their source copy and illustrations; absolute source layout is approximated in normal flow.', productActionWarning], (values, live) => finish(basic([errorNode(effective(values, live))]), [productActionWarning, localAssetWarning, 'Source absolute positioning is approximated by centered catalog layout.']))
register('sign-in-prompts', 'Signing flyout → normal-flow Card', 'candidate', ['Col', 'Row', 'Card', 'Title', 'Text', 'Caption', 'Image', 'Button'], [modalWarning, productActionWarning], (values, live) => finish(basic([signInNode(effective(values, live))]), [modalWarning, productActionWarning, localAssetWarning]))
register('style-menu', 'Restyle → source thumbnail rows', 'partial', ['Col', 'Row', 'Card', 'Title', 'Image', 'Button'], [selectionWarning, productActionWarning], (values, live) => finish(basic([styleNode(effective(values, live))]), [selectionWarning, productActionWarning, localAssetWarning]))
register('action-bar', 'Action row → catalog Button toolbar', 'partial', ['Row', 'Col', 'Button', 'Icon'], ['The four source image/video and loading configurations map to a semantic toolbar. Icon shapes and sizing use the catalog equivalents.', productActionWarning], (values, live) => finish(basic([actionsNode(effective(values, live))]), [productActionWarning]))
register('creation-composer', 'Composer → Card / Textarea / Buttons', 'candidate', ['Col', 'Row', 'Card', 'Title', 'Caption', 'Image', 'Button', 'Textarea', 'Divider'], [composerWarning, productActionWarning], (values, live) => {
  const props = effective(values, live)
  // Empty property-panel text means “use the source example”; a live empty
  // value means the user cleared the input and must remain empty in the SDL.
  if (props.prompt === '') delete props.prompt
  return finish(basic([composerNode(props)]), [composerWarning, productActionWarning, localAssetWarning])
})
register('serp-aigc-answer', 'SERP · AIGC Answer → answer content and history', 'candidate', ['Col', 'Row', 'Title', 'Text', 'Image', 'Button', 'Icon'], [shellWarning, imagePresentationWarning, productActionWarning], (values, live) => finish(basic([answerNode(effective(values, live))]), [shellWarning, imagePresentationWarning, selectionWarning, productActionWarning, localAssetWarning]))
register('prompt-template-card', 'Template card → Image / Caption', 'partial', ['Col', 'Image', 'Caption'], ['The visible opaque child image takes precedence over the Template variant’s covered parent image fill. Both canonical variants therefore retain the same foreground artwork with their source labels.'], (values, live) => finish(basic([promptTemplateNode(effective(values, live))]), [localAssetWarning, 'Nested source image fills are flattened to their visible foreground paint.']))
register('checkmark-circle', 'CheckmarkCircle → catalog Icon', 'partial', ['Col', 'Icon'], [helperIconWarning], (values, live) => finish(basic([checkmarkNode(effective(values, live))]), [helperIconWarning]))
register('main-image-footer', 'Footer → prompt text, badges and feedback controls', 'partial', ['Col', 'Row', 'Caption', 'Text', 'Button'], ['Both canonical two-line and four-line text variants retain their original copy. The source gradient becomes a solid dark background in normal flow.', productActionWarning], (values, live) => finish(basic([footerNode(effective(values, live))]), [imagePresentationWarning, productActionWarning]))
register('display-image', 'Display image → source thumbnail and selection border', 'partial', ['Col', 'Image'], [selectionWarning, 'The source checkmark overlay is represented by an accessible selected label and border because the catalog has no verified overlay positioning contract.'], (values, live) => finish(basic([displayImageNode(effective(values, live))]), [selectionWarning, imagePresentationWarning, localAssetWarning]))
register('serp-template-card', 'Template card → product image, source thumbnail and caption', 'partial', ['Col', 'Row', 'Image', 'Caption'], ['The 200 × 200 source card places its 48 × 48 original-image thumbnail over the main image. SDL keeps both original assets in normal flow.'], () => finish(basic([serpTemplateNode()]), [imagePresentationWarning, localAssetWarning]))

export const mosaicAdapter = (slug: string): MosaicAdapter | undefined => Object.prototype.hasOwnProperty.call(adapters, slug) ? adapters[slug] : undefined
export const mosaicCoverage = Object.entries(adapters).map(([slug, adapter]) => ({ slug, status: adapter.status }))

export function generateMosaicPage(
  blocks: Array<{ slug: string; values: MosaicValues; live: MosaicLiveProps }>,
  surface: 'serp' | 'blank' | 'creator',
  width?: number,
): MosaicGeneration {
  const children: MosaicSdlNode[] = []
  const warnings: string[] = []
  const missing: string[] = []
  for (const block of blocks) {
    const adapter = mosaicAdapter(block.slug)
    if (!adapter) { missing.push(block.slug); continue }
    const result = adapter.generate(block.values, block.live, { surface, width })
    children.push(...unwrapBasic(result))
    warnings.push(...result.warnings.map(warning => `${block.slug}: ${warning}`))
  }
  const output = finish(basic([col(children, { gap: 4, width: width ?? '100%' })], { padding: 0 }), warnings)
  for (const slug of missing) output.validation.issues.push({ severity: 'error', path: '$.children', message: `No source-backed Mosaic adapter is registered for ${slug}.` })
  if (missing.length) output.validation.valid = false
  return output
}
