import test from 'node:test'
import assert from 'node:assert/strict'
import { build, transform } from 'esbuild'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import vm from 'node:vm'

const root = fileURLToPath(new URL('../', import.meta.url))
const bundle = await build({
  stdin: { contents: `
    import * as React from 'react';
    import { renderToStaticMarkup } from 'react-dom/server';
    import { SlideShow } from './src/components/SlideShow';
    import { slideshowSizes, slideshowSources, slideshowSlides, slideIndex } from './src/data/slideshow';
    import { RENDERERS, TAGS } from './src/pages/ComponentPage';
    import { components, byTier, selectOptions, updatePropValue } from './src/data/components';
    import { defaults, jsxProps } from './src/components/Workbench';
    import { generateMosaicComponent, generateMosaicPage } from './src/mosaic/generators';
    export { React, renderToStaticMarkup, SlideShow, slideshowSizes, slideshowSources, slideshowSlides, slideIndex, RENDERERS, TAGS, components, byTier, selectOptions, updatePropValue, defaults, jsxProps, generateMosaicComponent, generateMosaicPage };
  `, resolveDir: root },
  bundle: true, platform: 'node', format: 'cjs', write: false, jsx: 'automatic', loader: { '.css': 'empty' },
})
const mod = { exports: {} }
new Function('require', 'module', 'exports', bundle.outputFiles[0].text)(createRequire(import.meta.url), mod, mod.exports)
const api = mod.exports
const source = JSON.parse(await readFile(join(root, '../design/slideshow/specification.json'), 'utf8'))
const def = api.components.find(c => c.slug === 'slideshow')

test('one independent SlideShow Cell covers every source configuration at measured dimensions', () => {
  assert.equal(def.name, 'SlideShow')
  assert.ok(api.byTier('Cell').includes(def))
  assert.equal(def.partOf, undefined)
  assert.equal(def.variantCount, 15)
  assert.equal(api.slideshowSources.length, 15)
  assert.deepEqual(api.defaults(def.props), { size: '3:4', pagination: 'Bottom bars', state: 'Default' })
  for (const variant of source.variants) {
    const entry = api.slideshowSources.find(s => s.nodeId === variant.figmaNodeId)
    assert.deepEqual(entry.values, { size: variant.size, pagination: variant.pagination, state: variant.state })
    assert.deepEqual(api.slideshowSizes[variant.size], { width: variant.dimensions.width, height: variant.dimensions.height })
  }
})

test('every copied JSX selection matches the page renderer, including restored live index', async () => {
  for (const source of api.slideshowSources) for (const index of [0, 2]) {
    const live = { initialIndex: index }
    const jsx = `<SlideShow ${api.jsxProps(def, source.values, live).join(' ')} />`
    const compiled = await transform(`globalThis.result = ${jsx}`, { loader: 'tsx', jsx: 'transform', jsxFactory: 'React.createElement' })
    const context = { React: api.React, SlideShow: api.SlideShow }
    vm.runInNewContext(compiled.code, context)
    const markup = api.renderToStaticMarkup(api.RENDERERS.slideshow(source.values, () => {}, live))
    assert.equal(api.renderToStaticMarkup(context.result), markup)
    assert.ok(markup.includes(`data-source-node="${source.nodeId}"`))
    assert.ok(markup.includes(`data-slide-index="${index}"`))
    assert.ok(!markup.includes('figma.com/api/mcp/asset'))
  }
})

test('Hover is only selectable for Bottom bars; moving between pagination modes normalizes it', () => {
  for (const pagination of ['Bottom arrows', 'Top bars', 'Bottom bars', 'Bottom bars + arrows']) {
    const next = api.updatePropValue(def.props, { size: '5:4', pagination: 'Bottom bars', state: 'Hover' }, 'pagination', pagination)
    assert.equal(next.state, pagination === 'Bottom bars' ? 'Hover' : 'Default')
    assert.deepEqual(api.selectOptions(def.props[2], next), pagination === 'Bottom bars' ? ['Default', 'Hover'] : ['Default'])
  }
})

test('all source configurations export valid SDL and preserve a selected slide, including end card', () => {
  for (const { values } of api.slideshowSources) {
    const output = api.generateMosaicComponent('slideshow', values, { initialIndex: 2 })
    assert.ok(output.validation.valid, JSON.stringify(output.validation.issues))
    assert.ok(JSON.stringify(output.node).includes('3 of 4'))
    assert.ok(output.warnings.some(w => w.includes('URLs')))
  }
  const end = api.generateMosaicComponent('slideshow', { size: '3:4', pagination: 'Bottom arrows' }, { initialIndex: 4 })
  assert.ok(JSON.stringify(end.node).includes('See more'))
  assert.equal(api.slideIndex(-99, 4), 0)
  assert.equal(api.slideIndex(99, 4), 3)
  assert.equal(api.slideIndex('invalid', 4), 0)
})

test('combined pagination exposes all five slots, including the end card, without thumbnail hover', () => {
  for (const size of Object.keys(api.slideshowSizes)) {
    const slides = api.slideshowSlides(size, 'Bottom bars + arrows')
    assert.equal(slides.length, 5)
    assert.equal(slides.filter(slide => slide.seeMore).length, 1)
    for (const index of [0, 2, 4]) {
      const markup = api.renderToStaticMarkup(api.React.createElement(api.SlideShow, {
        size, pagination: 'Bottom bars + arrows', state: 'Hover', initialIndex: index,
      }))
      assert.equal((markup.match(/aria-label="Go to slide /g) ?? []).length, 5)
      assert.match(markup, /data-state="Default"/)
      assert.match(markup, new RegExp(`aria-label="Go to slide ${index + 1}" aria-pressed="true"`))
      assert.equal(/aria-label="Previous slide" disabled/.test(markup), index === 0)
      assert.equal(/aria-label="Next slide" disabled/.test(markup), index === 4)
      if (index === 4) {
        assert.match(markup, /See more/)
        const output = api.generateMosaicComponent('slideshow', { size, pagination: 'Bottom bars + arrows' }, { initialIndex: index })
        assert.ok(output.validation.valid)
        assert.ok(JSON.stringify(output.node).includes('See more'))
      }
    }
  }
})

test('updated source cards have no outer shadow and combined mode respects custom collection length', () => {
  for (const { values } of api.slideshowSources) {
    const markup = api.renderToStaticMarkup(api.RENDERERS.slideshow(values, () => {}))
    assert.doesNotMatch(markup.match(/<section[^>]*>/)[0], /box-shadow/)
  }
  const markup = api.renderToStaticMarkup(api.React.createElement(api.SlideShow, {
    pagination: 'Bottom bars + arrows', initialIndex: 99,
    slides: [{ src: 'first.png', alt: 'First', title: 'First title' }, { src: 'last.png', alt: 'Last', title: 'Last title' }],
  }))
  assert.match(markup, /data-slide-index="1"/)
  assert.equal((markup.match(/aria-label="Go to slide /g) ?? []).length, 2)
  assert.match(markup, /Last title/)
  assert.match(markup, /aria-label="Next slide" disabled/)
})

test('public image/content overrides work and every source image, icon and font exists locally', async () => {
  const markup = api.renderToStaticMarkup(api.React.createElement(api.SlideShow, { slides: [{src:'https://example.test/a.png',alt:'Custom photograph',title:'Custom title',description:'Custom description'}], imageCount:1 }))
  assert.ok(markup.includes('Custom title') && markup.includes('Custom description') && markup.includes('Custom photograph'))
  assert.ok(markup.includes('1 images'))
  const paths = new Set(['./figma/slideshow/fonts/alice-400.woff2'])
  for (const source of api.slideshowSources) {
    const markup = api.renderToStaticMarkup(api.RENDERERS.slideshow(source.values, () => {}))
    for (const [, path] of markup.matchAll(/src="([^"]+)"/g)) { assert.ok(path.startsWith('./figma/') || path.startsWith('figma/')); paths.add(path) }
  }
  for (const path of paths) assert.ok((await stat(join(root, 'public', path))).size > 0, path)
})
