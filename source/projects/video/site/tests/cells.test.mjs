import test from 'node:test'
import assert from 'node:assert/strict'
import { stat, readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const bundled = await build({ stdin: { contents: "export * from './src/components/VideoCells.tsx'; export * from './src/data/cell-data.ts';", resolveDir: fileURLToPath(new URL('../', import.meta.url)), loader: 'tsx' }, bundle: true, platform: 'node', format: 'cjs', write: false, external: ['react'], loader: { '.css': 'empty' } })
const module = { exports: {} }
new Function('require', 'module', 'exports', bundled.outputFiles[0].text)(createRequire(import.meta.url), module, module.exports)
const api = module.exports
const render = (component, props = {}) => renderToStaticMarkup(React.createElement(component, props))

test('vertical video source keeps its featured row, source Inline metadata and 648 px height', () => {
  const g = api.resolveVideoGroupGeometry()
  assert.equal(g.count, 4)
  assert.equal(g.width, 648)
  assert.equal(g.height, 648)
  assert.equal(g.cards[0].thumbnailHeight, 200)
  assert.equal(g.cards[1].thumbnailHeight, 392 / 3)
  assert.equal(g.metadataPosition, 'Inline')
  const html = render(api.VideoGroup)
  assert.equal((html.match(/vm-video-inline/g) || []).length, 4)
  assert.match(html, /data-acf-component="List View"/)
  assert.doesNotMatch(html, /vc-scroll-button/)
})

test('source horizontal video variants retain clipping, card count, gaps and native scroller affordance', () => {
  const below = api.resolveVideoGroupGeometry({ configuration: 'Horizontal / SERP / Below' })
  assert.equal(below.cards[0].width, 185.9)
  assert.equal(below.count, 6)
  assert.equal(below.gap, 24)
  const overlay = api.resolveVideoGroupGeometry({ configuration: 'Horizontal / SERP / Overlay' })
  assert.equal(overlay.height, 160)
  assert.equal(overlay.cards[0].thumbnailHeight, 200)
  assert.match(render(api.VideoGroup, { configuration: 'Horizontal / SERP / Overlay' }), /aria-label="Next videos"/)
  const vrp = api.resolveVideoGroupGeometry({ configuration: 'Horizontal / VRP' })
  assert.equal(vrp.count, 5)
  assert.equal(vrp.cards[0].width, 192)
  assert.doesNotMatch(render(api.VideoGroup, { configuration: 'Horizontal / VRP' }), /vc-scroll-button/)
})

test('shorts group configurations preserve actual 2:3 and 3:4 media geometry', () => {
  for (const configuration of api.SHORTS_GROUP_CONFIGURATIONS) {
    const g = api.resolveShortsGroupGeometry({ configuration })
    assert.equal(g.count, 9)
    assert.equal(g.gap, 16)
    assert.equal(g.height, configuration.endsWith('Overlay') ? 200 : 312)
    assert.ok(Math.abs(g.cards[0].width / g.cards[0].thumbnailHeight - (configuration.includes('2:3') ? 2 / 3 : 3 / 4)) < 1e-10)
    const html = render(api.ShortsGroup, { configuration })
    assert.equal((html.match(/vm-short-card/g) || []).length, 9)
    assert.match(html, /aria-label="Next short videos"/)
  }
})

test('group selected preview is reflected in exactly one child, including VRP-specific state', () => {
  const html = render(api.VideoGroup, { state: 'Preview', selectedIndex: 2 })
  assert.equal((html.match(/data-state="Preview"/g) || []).length, 1)
  assert.equal((html.match(/data-selected="true"/g) || []).length, 1)
  const shorts = render(api.ShortsGroup, { configuration: 'VRP / 3:4 / Below', state: 'Preview', selectedIndex: 1 })
  assert.equal((shorts.match(/data-state="VRP-preview"/g) || []).length, 1)
  const lastShort = render(api.ShortsGroup, { state: 'Preview', selectedIndex: 8 })
  assert.equal((lastShort.match(/data-state="Preview"/g) || []).length, 1)
})

test('custom content safely replaces placeholder copy and derives item count', () => {
  const html = render(api.VideoGroup, { items: [{ title: '<script>not markup</script>', thumbnailUrl: 'custom-one.png' }, { title: 'Second result', thumbnailUrl: 'custom-two.png' }] })
  assert.equal((html.match(/vm-video-inline/g) || []).length, 2)
  assert.match(html, /&lt;script&gt;not markup&lt;\/script&gt;/)
  assert.doesNotMatch(html, /<script>/)
  assert.match(html, /src="custom-two.png"/)
})

test('magazine columns follow source 12-column spans and source child composition', () => {
  assert.deepEqual(api.resolveMagazineGeometry().columns, [588, 282, 282])
  assert.deepEqual(api.resolveMagazineGeometry({ placement: 'VRP' }).columns, [486, 384, 282])
  const serp = render(api.VideoMagazineZone)
  assert.match(serp, /Overview/)
  assert.match(serp, /Tom Hanks - IMDb/)
  assert.match(serp, /height:329.28px/)
  assert.doesNotMatch(serp, /vm-playlist/)
  const vrp = render(api.VideoMagazineZone, { placement: 'VRP' })
  assert.match(vrp, /height:272.16px/)
  assert.match(vrp, /More videos/)
  assert.match(vrp, /Playlists/)
  assert.doesNotMatch(vrp, /vc-overview/)
})

test('source overview disclosure state round-trips without inventing target URLs', () => {
  const html = render(api.VideoMagazineZone, { expanded: true, showSources: true })
  assert.match(html, /vc-overview-content is-expanded/)
  assert.match(html, /Show less/)
  assert.match(html, /Sources shown in this design/)
  assert.match(html, /IMDb · Wikipedia/)
  assert.doesNotMatch(html, /href="https:/)
})

test('cell source images are nonempty local assets; source SVG dimensions remain intrinsic', async () => {
  for (const file of Object.values(api.cellAssets)) {
    const path = new URL(`../public/${file}`, import.meta.url)
    assert.ok((await stat(path)).size > 0, file)
  }
  for (const [key, size] of [['chevron', 20], ['arrow', 12], ['maximize', 16], ['link', 16]]) {
    const svg = await readFile(new URL(`../public/${api.cellAssets[key]}`, import.meta.url), 'utf8')
    assert.match(svg, new RegExp(`width="${size}" height="${size}"`))
  }
})

test('runtime input bounds keep the host finite and all card widths positive', () => {
  assert.equal(api.resolveVideoGroupGeometry({ width: NaN, itemCount: Infinity }).width, 648)
  assert.equal(api.resolveVideoGroupGeometry({ itemCount: 999 }).count, 30)
  assert.equal(api.resolveShortsGroupGeometry({ itemCount: -1 }).count, 9)
  assert.ok(api.resolveMagazineGeometry({ width: 1 }).columns.every(width => width > 0))
})
