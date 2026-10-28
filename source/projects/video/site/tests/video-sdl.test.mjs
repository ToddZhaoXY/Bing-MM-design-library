import test from 'node:test'
import assert from 'node:assert/strict'
import { access } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

const bundle = await build({
  stdin: {
    contents: "export * from './src/mosaic/generators.ts'; export { components } from './src/data/components.ts'; export { SURFACES } from './src/data/pageState.ts';",
    resolveDir: fileURLToPath(new URL('../', import.meta.url)),
  },
  bundle: true, platform: 'node', format: 'esm', write: false,
  define: { 'import.meta.env.BASE_URL': '"/"' },
})
const api = await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`)
const defaults = component => Object.fromEntries(component.props.map(prop => [prop.name, prop.default]))
const allNodes = root => [root, ...(root.children ?? []).flatMap(allNodes)]
const content = root => allNodes(root).flatMap(node => [node.value, node.label, node.defaultValue].filter(value => typeof value === 'string'))
const generate = (slug, values = {}, live = {}) => api.mosaicAdapter(slug).generate({ ...defaults(api.components.find(item => item.slug === slug)), ...values }, live)
const gaps = new Set(['serp-video-answer-go-wide', 'vrp-whole-page'])
const assets = new Set()

function verify(slug, result, values) {
  assert.equal(result.validation.valid, true, `${slug} ${JSON.stringify(values)}: ${JSON.stringify(result.validation.issues)}`)
  assert.deepEqual(JSON.parse(JSON.stringify(result.node)), result.node, `${slug} must be JSON serializable`)
  assert.equal(result.validation.coverage.mode, 'catalog-snapshot')
  for (const node of allNodes(result.node)) {
    assert.equal('props' in node, false, `${slug} must use flattened SDL v2`)
    assert.equal('onClickAction' in node, false, `${slug} must not fabricate a product action`)
    assert.equal('onChangeAction' in node, false, `${slug} must not fabricate a product action`)
    if (node.type === 'Image') {
      assert.equal(typeof node.src, 'string')
      assert.match(node.src, /^\/figma\//, `${slug} must use extracted source artwork`)
      assert.equal(typeof node.alt, 'string')
      assets.add(node.src)
    }
  }
}

test('every registered Video entry has a catalog-valid adapter with explicit coverage', () => {
  assert.ok(api.components.length > 0)
  assert.deepEqual(api.mosaicCoverage.map(item => item.slug).sort(), api.components.map(item => item.slug).sort())
  for (const component of api.components) {
    const adapter = api.mosaicAdapter(component.slug)
    assert.ok(adapter, component.slug)
    const result = generate(component.slug)
    verify(component.slug, result, defaults(component))
    assert.equal(adapter.status, gaps.has(component.slug) ? 'gap' : 'partial')
    assert.ok(result.warnings.length > 0, `${component.slug} must document its limits`)
    if (!gaps.has(component.slug)) assert.ok(result.validation.nodeCount > 1, component.slug)
  }
})

test('all registry select and boolean combinations remain valid and serializable', t => {
  let count = 0
  for (const component of api.components) {
    let combinations = [defaults(component)]
    for (const prop of component.props) {
      const branches = prop.kind === 'select' ? prop.values : prop.kind === 'boolean' ? [true, false] : []
      if (branches.length) combinations = combinations.flatMap(values => branches.map(value => ({ ...values, [prop.name]: value })))
    }
    for (const values of combinations) {
      verify(component.slug, generate(component.slug, values), values)
      count += 1
    }
  }
  t.diagnostic(`${count} source property combinations checked`)
})

test('all SDL source assets exist in the distributable public directory', async () => {
  assert.ok(assets.size > 0)
  for (const src of assets) await access(fileURLToPath(new URL(`../public${src}`, import.meta.url)))
})

test('empty and reference-only source pages never fabricate a portable results layout', () => {
  for (const slug of gaps) {
    const output = generate(slug)
    assert.deepEqual(output.node, { type: 'Basic', children: [] })
    assert.match(output.warnings.join(' '), /empty|reference-only|Cover \/ WIP/)
    assert.equal(api.mosaicAdapter(slug).status, 'gap')
  }
})

test('live text edits replace stale property values and remain literal content', () => {
  const edited = '用户标题 "quoted" <script>literal</script>\nsecond line'
  for (const component of api.components.filter(item => item.props.some(prop => prop.name === 'title' && prop.kind === 'text'))) {
    const output = generate(component.slug, { title: 'Stale title' }, { title: edited })
    assert.ok(content(output.node).includes(edited), `${component.slug} must retain the live title`)
    assert.ok(!content(output.node).includes('Stale title'), `${component.slug} must drop the stale title`)
  }
})

test('selected group item, preview state and source-reference details survive SDL snapshots', () => {
  const selected = generate('video-group', {}, { selectedIndex: 2, state: 'Preview' })
  assert.ok(allNodes(selected.node).some(node => node.ariaLabel === 'Video 3, selected'))
  assert.ok(content(selected.node).includes('Preview'))
  const overview = generate('video-magazine-zone', {}, { expanded: true, showSources: true })
  assert.ok(content(overview.node).includes('Show less'))
  assert.ok(content(overview.node).includes('Sources shown in this design'))
})

test('mainline source footers, visible Mobile Hero cards and hero description remain source-accurate', () => {
  const folded = generate('serp-video-answer-mainline', { configuration: 'Desktop Hero folded' })
  assert.ok(content(folded.node).includes('See more video'))
  for (const configuration of ['Desktop Generics', 'Desktop Hero expanded', 'Desktop Hero + Shorts', 'Mobile Generics', 'Mobile Hero']) {
    const output = generate('serp-video-answer-mainline', { configuration })
    assert.ok(content(output.node).includes('See all video'), configuration)
    assert.ok(!content(output.node).includes('See less video'), configuration)
  }
  const mobile = generate('serp-video-answer-mainline', { configuration: 'Mobile Hero' })
  const mobileCards = allNodes(mobile.node).filter(node => /^Video \d+(?:, selected)?$/.test(node.ariaLabel ?? ''))
  assert.equal(mobileCards.length, 3, 'Mobile Hero shows its hero and two generic rows')
  const desktop = generate('serp-video-answer-mainline', { configuration: 'Desktop Hero expanded' })
  const description = allNodes(desktop.node).find(node => node.type === 'Text' && node.maxLines === 4)
  assert.equal(description.value, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore')
})

test('magazine child interaction values are retained independently from tabs, questions and query', () => {
  const output = generate('serp-video-magazine-page', {}, {
    magazineState: 'Preview', magazineSelectedIndex: 1, overviewExpanded: true,
    showSources: true, selectedIndex: 2, activeTab: 'Awards', openQuestion: 2, query: 'Live magazine query',
  })
  const nodes = allNodes(output.node)
  assert.equal(content(output.node).filter(value => value === 'Preview').length, 2, 'The magazine card and lower video selection both remain active')
  assert.ok(content(output.node).includes('Show less'))
  assert.ok(content(output.node).includes('Sources shown in this design'))
  assert.ok(content(output.node).includes('Live magazine query'))
  assert.ok(nodes.some(node => node.ariaLabel === 'Awards, selected'))
  assert.ok(nodes.some(node => node.ariaLabel === 'Magazine video 3, selected'))
  assert.equal(nodes.filter(node => node.ariaLabel === 'Accordion header, expanded').length, 1)
  const hiddenShell = generate('serp-video-magazine-page', { pageShell: false }, { selectedIndex: 2, openQuestion: 2 })
  assert.equal(allNodes(hiddenShell.node).some(node => String(node.ariaLabel).startsWith('Magazine video')), false)
  assert.equal(content(hiddenShell.node).includes('People also ask'), false)
})

test('page generation respects each surface padding and rejects unknown adapters', () => {
  for (const surface of api.SURFACES) {
    const blocks = surface.preset.map(slug => ({ slug, values: defaults(api.components.find(item => item.slug === slug)), live: {} }))
    const result = api.generateMosaicPage(blocks, surface.id, 1024)
    assert.equal(result.validation.valid, true, surface.id)
    assert.equal(result.node.children[0].width, 1024)
    assert.equal(result.node.children[0].padding, surface.padding / 4)
  }
  const missing = api.generateMosaicPage([{ slug: 'unknown-video-component', values: {}, live: {} }], 'blank')
  assert.equal(missing.validation.valid, false)
  assert.ok(missing.validation.issues.some(issue => issue.message.includes('unknown-video-component')))
  assert.equal(api.mosaicAdapter('toString'), undefined)
})
