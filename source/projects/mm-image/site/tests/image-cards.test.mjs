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
    import * as cards from './src/components/ImageCards';
    import { imageCardGroups, imageCardSlug, imageCardTag } from './src/data/image-cards';
    import { RENDERERS, TAGS } from './src/pages/ComponentPage';
    import { components, byTier, selectOptions, updatePropValue } from './src/data/components';
    import { migrateImageCardBlock } from './src/data/image-cards';
    import { defaults, jsxProps } from './src/components/Workbench';
    import { generateMosaicComponent, generateMosaicPage } from './src/mosaic/generators';
    export { React, renderToStaticMarkup, cards, imageCardGroups, imageCardSlug, imageCardTag, RENDERERS, TAGS, components, byTier, selectOptions, updatePropValue, migrateImageCardBlock, defaults, jsxProps, generateMosaicComponent, generateMosaicPage };
  `, resolveDir: root },
  bundle: true, platform: 'node', format: 'cjs', write: false, jsx: 'automatic',
  loader: { '.css': 'empty' },
})
const mod = { exports: {} }
new Function('require', 'module', 'exports', bundle.outputFiles[0].text)(createRequire(import.meta.url), mod, mod.exports)
const api = mod.exports
const source = JSON.parse(await readFile(join(root, '../design/fy25-cards/inventory.json'), 'utf8'))

test('all 49 source examples are covered once, in their 13 measured size families', () => {
  assert.equal(api.imageCardGroups.length, 13)
  const actual = api.imageCardGroups.flatMap(group => group.variants.map(variant => ({ id: variant.nodeId, width: group.width, height: group.height, size: group.size })))
  assert.equal(actual.length, 49)
  assert.equal(new Set(actual.map(item => item.id)).size, 49)
  assert.deepEqual(actual.sort((a,b) => a.id.localeCompare(b.id)), source.map(({id,width,height,size}) => ({id,width,height,size})).sort((a,b) => a.id.localeCompare(b.id)))
})

test('every selectable variant renders identically through copied JSX and its workbench', async () => {
  for (const group of api.imageCardGroups) {
    const slug = 'image-cards'
    const def = api.components.find(c => c.slug === slug)
    assert.ok(def, slug)
    assert.equal(def.fileKey, '9yILIRLGDWRBLMqbs5hkoZ')
    assert.equal(typeof api.cards[api.TAGS[slug]], 'function')
    for (const variant of group.variants) {
      const values = { ...api.defaults(def.props), size: group.size, variant: variant.label }
      const jsx = `<${api.TAGS[slug]} ${api.jsxProps(def, values, {}).join(' ')} />`
      const compiled = await transform(`globalThis.result = ${jsx}`, { loader: 'tsx', jsx: 'transform', jsxFactory: 'React.createElement' })
      const context = { React: api.React, ...api.cards }
      vm.runInNewContext(compiled.code, context)
      const preview = api.renderToStaticMarkup(api.RENDERERS[slug](values, () => {}))
      assert.equal(api.renderToStaticMarkup(context.result), preview, `${slug}/${variant.label}`)
      assert.ok(preview.includes(`data-source-node="${variant.nodeId}"`))
      assert.ok(!preview.includes('figma.com/api/mcp/asset'))
    }
  }
})

test('all variants and a multi-card page produce valid SDL without omitted blocks', () => {
  const blocks = []
  for (const group of api.imageCardGroups) for (const variant of group.variants) {
    const slug = 'image-cards'
    const values = { size: group.size, variant: variant.label }
    const result = api.generateMosaicComponent(slug, values)
    assert.ok(result)
    assert.equal(result.validation.valid, true, `${slug}/${variant.label}: ${JSON.stringify(result.validation.issues)}`)
    assert.ok(result.validation.componentTypes.includes('Image'))
    assert.ok(result.warnings.some(warning => warning.includes('URLs')))
    blocks.push({slug, values, live:{}})
  }
  const page = api.generateMosaicPage(blocks, 'blank', 1208)
  assert.equal(page.validation.valid, true, JSON.stringify(page.validation.issues))
  assert.ok(!page.warnings.some(warning => warning.includes('omitted')))
})

test('every static image reference resolves to a nonempty local source asset', async () => {
  const paths = new Set()
  function walk(node) { if(node.kind === 'image') { assert.ok(node.src?.startsWith('./figma/'), node.src); paths.add(node.src) } (node.children ?? []).forEach(walk) }
  api.imageCardGroups.forEach(group => group.variants.forEach(variant => walk(variant.tree)))
  assert.ok(paths.size > 1, 'source imagery and source icons should both be included')
  for (const path of paths) assert.ok((await stat(join(root, 'public', path))).size > 0, path)
})

test('SDL inherits the white foreground of on-image black actions', () => {
  const result = api.generateMosaicComponent('image-cards', { size: '2x2', variant: 'Single image' })
  const nodes = []
  function visit(node) { nodes.push(node); (node.children ?? []).forEach(visit) }
  visit(result.node)
  const caption = nodes.find(node => node.type === 'Text' && node.value === 'All image')
  assert.ok(caption)
  assert.equal(caption.color, '#fff')
})


test('one Image cards entry is last in Molecules with exactly 49 legal configurations', () => {
  assert.equal(api.components.length, 19)
  assert.equal(api.components.filter(c => c.slug.startsWith('image-card')).length, 1)
  const entry = api.byTier('Molecule').at(-1)
  assert.equal(entry.slug, 'image-cards')
  assert.equal(entry.name, 'Image cards')
  assert.equal(entry.variantCount, 49)
  assert.deepEqual(entry.props.map(p => p.name), ['size', 'variant'])
  assert.equal(entry.props[0].values.length, 13)
})

test('size changes reconcile dependent layout controls for every size and starting layout', () => {
  const def = api.components.find(c => c.slug === 'image-cards')
  const prop = def.props.find(p => p.name === 'variant')
  for (const from of api.imageCardGroups) for (const variant of from.variants) for (const to of api.imageCardGroups) {
    const values = api.updatePropValue(def.props, { size: from.size, variant: variant.label }, 'size', to.size)
    const options = api.selectOptions(prop, values)
    assert.deepEqual(options, to.variants.map(item => item.label))
    assert.ok(options.includes(values.variant))
    assert.equal(values.variant, options.includes(variant.label) ? variant.label : options[0])
  }
})

test('saved individual-size blocks migrate to the unified component without losing their selected layout', () => {
  for (const group of api.imageCardGroups) for (const variant of group.variants) {
    const before = { id: 3, slug: api.imageCardSlug(group.size), values: { variant: variant.label }, live: {} }
    const after = api.migrateImageCardBlock(before)
    assert.equal(after.slug, 'image-cards')
    assert.deepEqual(after.values, { size: group.size, variant: variant.label })
    assert.equal(after.id, before.id)
  }
  const unrelated = { slug: 'badge', values: { property1: 'Time' } }
  assert.equal(api.migrateImageCardBlock(unrelated), unrelated)
})
