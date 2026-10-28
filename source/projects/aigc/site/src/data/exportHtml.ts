import { ROBOTO_LICENSE } from './robotoLicense'

export interface HtmlExportOpts { surface: string; width: number; baseUrl?: string }

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!)
}

/** Resolve source-host assets while rejecting script URLs in a static export. */
export function resolveAssetUrl(value: string, baseUrl: string): string {
  if (!value || value.startsWith('#')) return value
  try {
    const url = new URL(value, baseUrl)
    return ['http:', 'https:', 'data:', 'blob:', 'mailto:', 'tel:'].includes(url.protocol) ? url.href : ''
  } catch { return '' }
}

/** Clone the current DOM and computed styles; never mutate the live canvas. */
export function exportHtml(frame: HTMLElement, opts: HtmlExportOpts): string {
  const base = opts.baseUrl ?? frame.ownerDocument.baseURI
  const clone = frame.cloneNode(true) as HTMLElement
  const chrome = Array.from(clone.querySelectorAll('.pg__block-chrome, [data-playground-chrome], script, iframe, object, embed'))
  const originals = [frame, ...Array.from(frame.querySelectorAll<HTMLElement>('*'))]
  const copies = [clone, ...Array.from(clone.querySelectorAll<HTMLElement>('*'))]
  originals.forEach((original, index) => {
    const copy = copies[index]
    if (!copy) return
    const computed = frame.ownerDocument.defaultView?.getComputedStyle(original)
    if (computed) {
      for (let propertyIndex = 0; propertyIndex < computed.length; propertyIndex++) {
        const property = computed[propertyIndex]
        if (property.startsWith('animation') || property.startsWith('transition')) continue
        copy.style.setProperty(property, computed.getPropertyValue(property))
      }
    }
    for (const attribute of Array.from(copy.attributes)) {
      if (/^on/i.test(attribute.name) || attribute.name.startsWith('data-react')) copy.removeAttribute(attribute.name)
    }
    for (const attribute of ['src', 'href', 'xlink:href', 'poster']) {
      const value = original.getAttribute(attribute)
      if (value !== null) copy.setAttribute(attribute, resolveAssetUrl(value, base))
    }
    if (original instanceof HTMLImageElement && copy instanceof HTMLImageElement) {
      copy.src = resolveAssetUrl(original.currentSrc || original.src, base)
      copy.removeAttribute('srcset'); copy.removeAttribute('sizes')
      copy.loading = 'eager'
    }
    if (original instanceof HTMLInputElement && copy instanceof HTMLInputElement) {
      copy.setAttribute('value', original.value)
      copy.toggleAttribute('checked', original.checked)
    }
    if (original instanceof HTMLTextAreaElement && copy instanceof HTMLTextAreaElement) copy.textContent = original.value
    if (original instanceof HTMLOptionElement && copy instanceof HTMLOptionElement) copy.toggleAttribute('selected', original.selected)
    if (copy.classList.contains('pg__block')) { copy.style.cursor = 'default'; copy.removeAttribute('tabindex'); copy.removeAttribute('role'); copy.removeAttribute('aria-label') }
    const classes = [...copy.classList].filter(value => !value.startsWith('pg__'))
    if (classes.length) copy.setAttribute('class', classes.join(' ')); else copy.removeAttribute('class')
  })
  chrome.forEach(node => node.remove())
  // Viewing scale and editor positioning are not part of the exported design.
  clone.style.transform = 'none'; clone.style.position = 'relative'; clone.style.top = 'auto'; clone.style.left = 'auto'
  clone.style.width = `${opts.width}px`; clone.style.boxShadow = 'none'
  const origin = new URL(base).origin
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(`AIGC ACF — ${opts.surface}`)}</title>
<style>*{box-sizing:border-box}body{margin:0;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;padding:24px}.aigc-snapshot{width:${opts.width}px;margin:0 auto;background:#fff}.export-note{font:12px/1.5 'Segoe UI',Arial,sans-serif;max-width:80ch;margin:20px auto;color:#555}</style>
</head><body>
<div class="aigc-snapshot">${clone.outerHTML}</div>
<p class="export-note">Static DOM snapshot. Interactive behavior is not included. Image and font assets may reference ${escapeHtml(origin)} and require that host to remain available; this file is not an offline asset bundle.</p>
</body></html>`
}

export interface PortableHtmlResult { html: string; warnings: string[]; embeddedAssets: number }
export type AssetKind = 'image' | 'font'
export type AssetFetcher = (input: string, init?: RequestInit) => Promise<Response>
export interface AssetEmbedder {
  embed: (value: string, kind: AssetKind, resourceBase?: string) => Promise<string>
  warn: (message: string) => void
  warnings: string[]
  readonly embeddedAssets: number
}

const IMAGE_TYPES: Record<string, string> = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp', avif: 'image/avif', svg: 'image/svg+xml', ico: 'image/x-icon' }
const FONT_TYPES: Record<string, string> = { woff2: 'font/woff2', woff: 'font/woff', ttf: 'font/ttf', otf: 'font/otf' }

function dataUrl(bytes: ArrayBuffer, mime: string): string {
  const data = new Uint8Array(bytes)
  const chunks: string[] = []
  for (let start = 0; start < data.length; start += 0x8000) chunks.push(String.fromCharCode(...data.subarray(start, start + 0x8000)))
  return `data:${mime};base64,${btoa(chunks.join(''))}`
}

/** Fetch only static resources on the current document's origin; no cookies or redirects. */
export function createAssetEmbedder(documentBase: string, fetcher: AssetFetcher = globalThis.fetch.bind(globalThis)): AssetEmbedder {
  const documentUrl = new URL(documentBase)
  const cache = new Map<string, Promise<string | null>>()
  const warnings: string[] = []
  const seenWarnings = new Set<string>()
  let embeddedAssets = 0
  const warn = (message: string) => { if (!seenWarnings.has(message)) { seenWarnings.add(message); warnings.push(message) } }

  async function embed(value: string, kind: AssetKind, resourceBase = documentBase): Promise<string> {
    const trimmed = value.trim()
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('data:')) return trimmed
    let url: URL
    try { url = new URL(trimmed, resourceBase) } catch { warn(`Could not resolve a ${kind} asset URL.`); return value }
    // Computed SVG paint references can become absolute document URLs. Keep them local.
    if (url.hash && url.origin === documentUrl.origin && url.pathname === documentUrl.pathname && url.search === documentUrl.search) return url.hash
    const label = `${url.origin}${url.pathname}`
    if (!['http:', 'https:'].includes(url.protocol) || url.origin !== documentUrl.origin) {
      warn(`Not embedded: ${kind} asset outside the current host (${label}).`)
      return url.href
    }
    if (url.username || url.password) { warn(`Not embedded: credential-bearing ${kind} URL.`); return url.href }
    const extension = url.pathname.split('.').pop()?.toLowerCase() ?? ''
    const expected = (kind === 'image' ? IMAGE_TYPES : FONT_TYPES)[extension]
    if (!expected) { warn(`Not embedded: ${kind} URL is not a supported static asset (${label}).`); return url.href }
    const fragment = url.hash
    url.hash = ''
    const key = `${kind}:${url.href}`
    if (!cache.has(key)) {
      cache.set(key, (async () => {
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), 20000)
        try {
          const response = await fetcher(url.href, { credentials: 'omit', mode: 'same-origin', redirect: 'error', referrerPolicy: 'no-referrer', cache: 'force-cache', signal: controller.signal })
          if (!response.ok) throw new Error(`HTTP ${response.status}`)
          // Custom fetch implementations must also not return redirected content.
          if (response.redirected || (response.url && new URL(response.url).origin !== documentUrl.origin)) throw new Error('redirected response')
          const contentType = response.headers.get('content-type')?.split(';')[0].trim().toLowerCase()
          const genericType = !contentType || contentType === 'application/octet-stream'
          const acceptedType = kind === 'image' ? contentType?.startsWith('image/') : contentType?.startsWith('font/') || ['application/font-woff', 'application/x-font-woff', 'application/x-font-ttf', 'application/vnd.ms-opentype'].includes(contentType ?? '')
          if (!genericType && !acceptedType) throw new Error(`unexpected content type ${contentType}`)
          const bytes = await response.arrayBuffer()
          if (!bytes.byteLength) throw new Error('empty file')
          embeddedAssets += 1
          return dataUrl(bytes, genericType ? expected : contentType!)
        } catch (error) {
          const reason = error instanceof Error ? error.message : 'fetch failed'
          warn(`Could not embed ${kind} asset ${label}: ${reason}.`)
          return null
        } finally { clearTimeout(timer) }
      })())
    }
    const embedded = await cache.get(key)!
    return embedded ? embedded + fragment : url.href + fragment
  }
  return { embed, warn, warnings, get embeddedAssets() { return embeddedAssets } }
}

function unescapeCssUrl(value: string): string {
  return value.replace(/\\([0-9a-f]{1,6}\s?|\r\n|[\n\r\f]|.)/gi, (_, escape: string) => {
    if (/^[0-9a-f]/i.test(escape)) {
      const code = Number.parseInt(escape.trim(), 16)
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : '\uFFFD'
    }
    return /^[\n\r\f]/.test(escape) ? '' : escape
  })
}

/** Supports quoted/unquoted CSS URLs, escapes, multiple layers and local SVG fragments. */
export async function rewriteCssUrls(value: string, rewrite: (url: string) => Promise<string>): Promise<string> {
  const pattern = /url\(\s*(?:"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)'|((?:\\.|[^)\\])*?))\s*\)/gi
  const matches = [...value.matchAll(pattern)]
  if (!matches.length) return value
  const replacements = await Promise.all(matches.map(async match => {
    const url = unescapeCssUrl((match[1] ?? match[2] ?? match[3] ?? '').trim())
    return `url(${JSON.stringify(await rewrite(url))})`
  }))
  let result = ''; let offset = 0
  matches.forEach((match, index) => { result += value.slice(offset, match.index) + replacements[index]; offset = match.index! + match[0].length })
  return result + value.slice(offset)
}

export interface RobotoUsage { weight: string; style: string }
interface FontFaceSource { cssText: string; style: CSSStyleDeclaration; base: string }

function weightValue(value: string): number { return value === 'bold' ? 700 : value === 'normal' || !value ? 400 : Number.parseInt(value, 10) }
function faceMatches(style: CSSStyleDeclaration, usage: readonly RobotoUsage[]): boolean {
  if (style.getPropertyValue('font-family').replace(/["']/g, '').trim().toLowerCase() !== 'roboto') return false
  const weights = (style.getPropertyValue('font-weight') || 'normal').trim().split(/\s+/).map(weightValue)
  const min = weights[0]; const max = weights[1] ?? min
  const faceStyle = (style.getPropertyValue('font-style') || 'normal').trim()
  return usage.some(item => weightValue(item.weight) >= min && weightValue(item.weight) <= max && (item.style || 'normal') === faceStyle)
}

/** Read only already-loaded same-origin CSSOM; stylesheet imports never initiate a fetch here. */
export async function embeddedRobotoCss(source: Pick<Document, 'styleSheets' | 'baseURI'>, usage: readonly RobotoUsage[], embedder: AssetEmbedder): Promise<string> {
  if (!usage.length) return ''
  const origin = new URL(source.baseURI).origin
  const seenSheets = new Set<CSSStyleSheet>()
  const seenFaces = new Set<string>()
  const faces: FontFaceSource[] = []
  function sheetRules(sheet: CSSStyleSheet, inheritedBase: string) {
    if (seenSheets.has(sheet)) return
    seenSheets.add(sheet)
    const base = sheet.href ? new URL(sheet.href, inheritedBase).href : inheritedBase
    if (new URL(base).origin !== origin) { embedder.warn('A font stylesheet outside the current host was not read or embedded.'); return }
    let rules: CSSRuleList
    try { rules = sheet.cssRules } catch { embedder.warn('A font stylesheet could not be read from the current document CSSOM.'); return }
    visitRules(rules, base)
  }
  function visitRules(rules: CSSRuleList, base: string) {
    for (const rule of Array.from(rules)) {
      if (rule.type === 5) {
        const face = rule as CSSFontFaceRule
        if (faceMatches(face.style, usage) && !seenFaces.has(face.cssText)) {
          seenFaces.add(face.cssText); faces.push({ cssText: face.cssText, style: face.style, base })
        }
      } else if (rule.type === 3) {
        const imported = (rule as CSSImportRule).styleSheet
        if (imported) sheetRules(imported, base)
      } else if ('cssRules' in rule) {
        try { visitRules((rule as CSSGroupingRule).cssRules, base) } catch { embedder.warn('A grouped font rule could not be read from the current CSSOM.') }
      }
    }
  }
  for (const sheet of Array.from(source.styleSheets)) sheetRules(sheet, source.baseURI)
  for (const item of usage) if (!faces.some(face => faceMatches(face.style, [item]))) embedder.warn(`Roboto ${item.weight} ${item.style || 'normal'} has no matching readable local font-face rule; the viewer may use a fallback font.`)
  const blocks = await Promise.all(faces.map(async face => {
    const properties: string[] = []
    for (let index = 0; index < face.style.length; index++) {
      const name = face.style[index]
      const value = face.style.getPropertyValue(name)
      const output = name === 'src' ? await rewriteCssUrls(value, url => embedder.embed(url, 'font', face.base)) : value
      properties.push(`${name}: ${output}${face.style.getPropertyPriority(name) ? ' !important' : ''};`)
    }
    return `@font-face { ${properties.join(' ')} }`
  }))
  return blocks.join('\n')
}

/** Portable counterpart to exportHtml; the synchronous snapshot API remains unchanged. */
export async function exportPortableHtml(frame: HTMLElement, opts: HtmlExportOpts): Promise<PortableHtmlResult> {
  const sourceDocument = frame.ownerDocument
  const base = opts.baseUrl ?? sourceDocument.baseURI
  const source = exportHtml(frame, opts)
  const headMarkup = source.match(/<head>([\s\S]*?)<\/head>/)?.[1]
  const bodyMarkup = source.match(/<body>([\s\S]*)<\/body>/)?.[1]
  if (headMarkup === undefined || bodyMarkup === undefined) throw new Error('The canvas snapshot could not be parsed.')
  // Template content is inert: parsing src/style URLs here does not load remote assets.
  const template = sourceDocument.createElement('template')
  template.innerHTML = bodyMarkup
  const snapshot = template.content
  const embedder = createAssetEmbedder(sourceDocument.baseURI)
  const usage = new Map<string, RobotoUsage>()
  const pending: Promise<void>[] = []
  // A picture's selected source is already captured in its img.currentSrc by exportHtml.
  snapshot.querySelectorAll('picture source').forEach(node => node.remove())
  for (const element of Array.from(snapshot.querySelectorAll<HTMLElement>('[style]'))) {
    const families = element.style.fontFamily.split(',').map(family => family.replace(/["']/g, '').trim().toLowerCase())
    if (families.includes('roboto')) {
      const item = { weight: element.style.fontWeight || '400', style: element.style.fontStyle || 'normal' }
      usage.set(`${item.weight}:${item.style}`, item)
    }
    for (let index = 0; index < element.style.length; index++) {
      const property = element.style[index]
      const value = element.style.getPropertyValue(property)
      if (!/url\(/i.test(value)) continue
      const priority = element.style.getPropertyPriority(property)
      pending.push(rewriteCssUrls(value, url => embedder.embed(url, 'image', base)).then(next => { element.style.setProperty(property, next, priority) }))
    }
  }
  for (const [selector, attribute] of [['img[src]', 'src'], ['input[type="image"][src]', 'src'], ['video[poster]', 'poster'], ['svg image[href]', 'href'], ['svg image[xlink\\:href]', 'xlink:href']] as const) {
    for (const image of Array.from(snapshot.querySelectorAll(selector))) {
      const value = image.getAttribute(attribute)
      if (value) pending.push(embedder.embed(value, 'image', base).then(next => { image.setAttribute(attribute, next) }))
    }
  }
  const fontCss = await embeddedRobotoCss(sourceDocument, [...usage.values()], embedder)
  await Promise.all(pending)
  let fontMarkup = ''
  if (fontCss) {
    const style = sourceDocument.createElement('style')
    style.setAttribute('data-portable-fonts', 'Roboto')
    style.textContent = fontCss
    fontMarkup = style.outerHTML + `<template data-font-license="Roboto">${escapeHtml(ROBOTO_LICENSE)}</template>`
  }
  const note = snapshot.querySelector('.export-note')
  if (note) note.textContent = embedder.warnings.length
    ? 'Static snapshot with export warnings. Some assets could not be embedded and may require the original host. Interactive behavior is not included.'
    : 'Standalone static snapshot. Image assets and used Roboto fonts are embedded for offline viewing. Interactive behavior is not included.'
  if (embedder.warnings.length) {
    const section = sourceDocument.createElement('section')
    section.className = 'export-note'
    section.setAttribute('aria-label', 'Export warnings')
    const title = sourceDocument.createElement('strong'); title.textContent = 'Export warnings'
    const list = sourceDocument.createElement('ul')
    for (const warning of embedder.warnings) { const item = sourceDocument.createElement('li'); item.textContent = warning; list.appendChild(item) }
    section.append(title, list); snapshot.appendChild(section)
  }
  return { html: `<!doctype html>\n<html lang="en"><head>${headMarkup}${fontMarkup}</head><body>${template.innerHTML}</body></html>`, warnings: [...embedder.warnings], embeddedAssets: embedder.embeddedAssets }
}

export function downloadText(text: string, filename: string, mime = 'text/plain;charset=utf-8'): void {
  const blob = new Blob([text], { type: mime })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url; anchor.download = filename
  document.body.appendChild(anchor); anchor.click(); anchor.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
export function downloadHtml(html: string, filename: string): void { downloadText(html, filename, 'text/html;charset=utf-8') }
