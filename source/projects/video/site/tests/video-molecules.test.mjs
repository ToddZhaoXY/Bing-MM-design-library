import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { build } from 'esbuild'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const root = resolve(import.meta.dirname, '..')
const result = await build({ entryPoints: [resolve(root, 'src/components/VideoMolecules.tsx')], bundle: true, write: false, format: 'esm', platform: 'node', packages: 'external', loader: { '.css': 'empty' } })
const compiled = result.outputFiles[0].text.replaceAll('from "react"', `from ${JSON.stringify(import.meta.resolve('react'))}`).replaceAll('from "react/jsx-runtime"', `from ${JSON.stringify(import.meta.resolve('react/jsx-runtime'))}`)
const api = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)
const specs = JSON.parse(readFileSync(resolve(root, '../design/molecule-specs.json'), 'utf8')).components
const render = (name, props = {}) => renderToStaticMarkup(React.createElement(api[name], props))

test('all source molecule defaults and every documented selection render valid local imagery', () => {
  for (const spec of specs) {
    const defaults = Object.fromEntries(spec.props.map(p => [p.name, p.default]))
    for (const props of [defaults, ...spec.props.filter(p => p.kind === 'select').flatMap(p => p.values.map(value => ({ ...defaults, [p.name]: value })))]) {
      const html = render(spec.tag, props)
      assert.ok(html.length > 20, spec.slug)
      assert.doesNotMatch(html, /api\/mcp\/asset|\/Users\/simran|undefined|NaN/, spec.slug)
      for (const match of html.matchAll(/src="(figma\/[^"]+)"/g)) {
        const file = resolve(root, 'public', match[1])
        assert.ok(existsSync(file) && statSync(file).size > 0, `${spec.slug}: ${match[1]}`)
      }
    }
  }
})

test('portrait source dimensions, VRP normalization and explicit media sizing stay distinct', () => {
  const defaultHtml = render('ShortCard')
  assert.match(defaultHtml, /width:178.5px;height:312px/)
  assert.match(defaultHtml, /height:238px/)
  const vrp = render('ShortCard', { state: 'VRP-Default', ratio: '2:3', metadataPosition: 'Overlay' })
  assert.match(vrp, /width:162px;height:312px/)
  assert.match(vrp, /data-ratio="3:4"/)
  assert.match(vrp, /10K views/)
  const mobile = render('ShortCard', { width: 160, thumbnailHeight: 238, height: 312 })
  assert.match(mobile, /width:160px;height:312px/)
  assert.match(mobile, /height:238px/)
})

test('landscape cards accept independent media width and height for source compositions', () => {
  const html = render('VideoCard', { metadataPosition: 'Inline', width: 690, thumbnailHeight: 200, thumbnailWidth: 355.625 })
  assert.match(html, /width:690px;height:200px/)
  assert.match(html, /width:355.625px/)
  assert.match(html, /height:200px/)
  const hero = render('VideoHeroCard', { size: 'Super wide', width: 588, thumbnailHeight: 329.28 })
  assert.match(hero, /height:329.28px/)
})

test('source metadata uses node overrides rather than inherited recipe placeholders', () => {
  const html = render('VideoMetadata')
  assert.match(html, /10K views/)
  assert.match(html, /Nov 08, 2025/)
  assert.doesNotMatch(html, /45 min|6 servs|Chicken drumettes/)
})

test('content is escaped, optional empty metadata stays empty, and activation has accessible names', () => {
  const html = render('VideoCard', { title: '<script>alert(1)</script>', channel: '', source: '', views: '', date: '' })
  assert.doesNotMatch(html, /<script>/)
  assert.match(html, /&lt;script&gt;/)
  assert.doesNotMatch(html, /Channel|10K views|Nov 08/)
  assert.match(html, /aria-label="Play /)
})

test('all 10 malformed-source Playlist tuples and 13 supplemental samples remain independently selectable', () => {
  const playlist = specs.find(c => c.slug === 'playlist-card')
  const supplemental = specs.find(c => c.slug === 'video-supplemental-card')
  assert.equal(playlist.props[0].values.length, 10)
  assert.equal(supplemental.props[0].values.length, 13)
  assert.match(render('PlaylistCard', { configuration: 'List view / Tall / Default' }), /height:424px/)
  assert.match(render('VideoSupplementalCard', { configuration: 'Related / Tall' }), /width:200px;height:424px/)
})
