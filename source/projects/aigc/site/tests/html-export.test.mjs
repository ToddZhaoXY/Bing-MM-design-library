import test from 'node:test'
import assert from 'node:assert/strict'
import { build } from 'esbuild'
import { fileURLToPath } from 'node:url'

const compiled = await build({ entryPoints: [fileURLToPath(new URL('../src/data/exportHtml.ts', import.meta.url))], bundle: true, write: false, platform: 'node', format: 'esm' })
const { createAssetEmbedder, rewriteCssUrls, embeddedRobotoCss } = await import('data:text/javascript;base64,' + Buffer.from(compiled.outputFiles[0].text).toString('base64'))
const base = 'http://127.0.0.1:5173/library/'
const imageBytes = Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10])

test('portable image embedding deduplicates concurrent DOM and CSS references', async () => {
  const requests = []
  const embedder = createAssetEmbedder(base, async (url, init) => {
    requests.push({ url, init })
    return new Response(imageBytes, { headers: { 'content-type': 'image/png' } })
  })
  const [first, second, fragment] = await Promise.all([
    embedder.embed('figma/image.png', 'image'),
    embedder.embed(base + 'figma/image.png', 'image'),
    embedder.embed('figma/image.png#crop', 'image'),
  ])
  assert.equal(requests.length, 1)
  assert.equal(first, second)
  assert.equal(fragment, first + '#crop')
  assert.deepEqual(Buffer.from(first.split(',')[1], 'base64'), Buffer.from(imageBytes))
  assert.equal(embedder.embeddedAssets, 1)
  assert.deepEqual(embedder.warnings, [])
  assert.equal(requests[0].init.credentials, 'omit')
  assert.equal(requests[0].init.mode, 'same-origin')
  assert.equal(requests[0].init.redirect, 'error')
  assert.equal(requests[0].init.referrerPolicy, 'no-referrer')
})

test('embedding never fetches another origin, a private API route or credential-bearing URL', async () => {
  let requests = 0
  const embedder = createAssetEmbedder(base, async () => { requests += 1; throw new Error('Must not fetch') })
  const inputs = ['https://external.example/image.png', 'http://127.0.0.1:3846/image.png', '/api/private-image', 'http://name:secret@127.0.0.1:5173/image.png', 'file:///tmp/image.png']
  for (const input of inputs) await embedder.embed(input, 'image')
  assert.equal(requests, 0)
  assert.equal(embedder.warnings.length, inputs.length)
  assert.ok(embedder.warnings.every(warning => !warning.includes('secret')))
})

test('already embedded assets and local SVG paint references need no requests', async () => {
  let requests = 0
  const embedder = createAssetEmbedder(base, async () => { requests += 1; throw new Error('Must not fetch') })
  const existing = 'data:image/png;base64,aGVsbG8='
  assert.equal(await embedder.embed(existing, 'image'), existing)
  assert.equal(await embedder.embed('#gradient', 'image'), '#gradient')
  assert.equal(await embedder.embed(base + '#gradient', 'image'), '#gradient')
  assert.equal(requests, 0)
  assert.equal(embedder.warnings.length, 0)
})

test('failed or invalid responses preserve the source address and an explicit deduplicated warning', async () => {
  let requests = 0
  const embedder = createAssetEmbedder(base, async url => {
    requests += 1
    if (url.endsWith('missing.png')) return new Response('Missing', { status: 404 })
    if (url.endsWith('redirect.png')) return { ok: true, redirected: true, url: 'https://external.example/redirect.png' }
    return new Response('<html>SPA fallback</html>', { headers: { 'content-type': 'text/html' } })
  })
  assert.equal(await embedder.embed('missing.png', 'image'), base + 'missing.png')
  assert.equal(await embedder.embed('missing.png', 'image'), base + 'missing.png')
  await embedder.embed('fallback.png', 'image')
  await embedder.embed('redirect.png', 'image')
  assert.equal(requests, 3)
  assert.equal(embedder.embeddedAssets, 0)
  assert.equal(embedder.warnings.length, 3)
  assert.ok(embedder.warnings.some(value => value.includes('HTTP 404')))
  assert.ok(embedder.warnings.some(value => value.includes('text/html')))
  assert.ok(embedder.warnings.some(value => value.includes('redirected response')))
})

test('CSS rewriting handles layered backgrounds, quoted escapes and fragments', async () => {
  const urls = []
  const source = `linear-gradient(#0000,#0005), url("figma/a\\20 b.png"), url('figma/c\\)d.png'), url(#mask)`
  const result = await rewriteCssUrls(source, async url => { urls.push(url); return url.startsWith('#') ? url : 'data:image/png;base64,eA==' })
  assert.deepEqual(urls, ['figma/a b.png', 'figma/c)d.png', '#mask'])
  assert.ok(result.startsWith('linear-gradient(#0000,#0005)'))
  assert.equal((result.match(/data:image\/png/g) || []).length, 2)
  assert.ok(result.includes('url("#mask")'))
  assert.equal(await rewriteCssUrls('none', async () => { throw new Error('Must not run') }), 'none')
})

function mockStyle(properties) {
  const keys = Object.keys(properties)
  return Object.assign({ length: keys.length, getPropertyValue: name => properties[name] ?? '', getPropertyPriority: () => '' }, Object.fromEntries(keys.map((key, index) => [index, key])))
}
function face(weight, family = 'Roboto') {
  const style = mockStyle({ 'font-family': `'${family}'`, 'font-style': 'normal', 'font-display': 'swap', 'font-weight': String(weight), src: `url(./fonts/roboto-${weight}.woff2) format('woff2'),url(./fonts/roboto-${weight}.woff) format('woff')` })
  return { type: 5, style, cssText: `@font-face ${family} ${weight}` }
}

test('used Roboto faces are copied from same-origin CSSOM with CSS-relative font assets embedded', async () => {
  const requests = []
  const embedder = createAssetEmbedder(base, async url => {
    requests.push(url)
    return new Response(Uint8Array.from([1, 2, 3, 4]), { headers: { 'content-type': url.endsWith('woff2') ? 'font/woff2' : 'font/woff' } })
  })
  const source = { baseURI: base, styleSheets: [{ href: 'http://127.0.0.1:5173/assets/site.css', cssRules: [face(400), face(500), face(700), face(400, 'Other font')] }] }
  const css = await embeddedRobotoCss(source, [{ weight: '400', style: 'normal' }, { weight: '700', style: 'normal' }], embedder)
  assert.equal((css.match(/@font-face/g) || []).length, 2)
  assert.equal(requests.length, 4)
  assert.ok(requests.every(url => url.startsWith('http://127.0.0.1:5173/assets/fonts/')))
  assert.ok(requests.every(url => !url.includes('500')))
  assert.ok(css.includes('data:font/woff2;base64,AQIDBA=='))
  assert.ok(css.includes('data:font/woff;base64,AQIDBA=='))
  assert.ok(!css.includes('http://'))
  assert.equal(embedder.embeddedAssets, 4)
  assert.deepEqual(embedder.warnings, [])
})

test('font embedding traverses loaded same-origin imports without fetching stylesheets', async () => {
  const requests = []
  const embedder = createAssetEmbedder(base, async url => { requests.push(url); return new Response(Uint8Array.from([1]), { headers: { 'content-type': 'font/woff2' } }) })
  let readRemote = false
  const remote = { href: 'https://external.example/font.css', get cssRules() { readRemote = true; throw new Error('Forbidden') } }
  const imported = { href: 'http://127.0.0.1:5173/assets/imported.css', cssRules: [face(400)] }
  const source = { baseURI: base, styleSheets: [{ href: null, cssRules: [{ type: 3, styleSheet: imported }, { type: 4, cssRules: [face(700)] }] }, remote] }
  const css = await embeddedRobotoCss(source, [{ weight: '400', style: 'normal' }, { weight: '700', style: 'normal' }], embedder)
  assert.ok(css.includes('data:font/woff2'))
  assert.equal(readRemote, false)
  assert.ok(requests.every(url => !url.endsWith('.css') && !url.includes('external.example')))
  assert.ok(embedder.warnings.some(warning => warning.includes('outside the current host')))
})

test('missing Roboto faces and unavailable font bytes are reported rather than called offline-ready', async () => {
  const embedder = createAssetEmbedder(base, async () => new Response('Missing font', { status: 404 }))
  const source = { baseURI: base, styleSheets: [{ href: null, cssRules: [face(400)] }] }
  const css = await embeddedRobotoCss(source, [{ weight: '400', style: 'normal' }, { weight: '700', style: 'normal' }], embedder)
  assert.ok(css.includes(base + 'fonts/roboto-400.woff2'))
  assert.ok(embedder.warnings.some(warning => warning.includes('Roboto 700')))
  assert.ok(embedder.warnings.some(warning => warning.includes('Could not embed font asset')))
  assert.equal(embedder.embeddedAssets, 0)
})
