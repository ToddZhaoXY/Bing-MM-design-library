import test from 'node:test'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'

const { build } = await import(process.env.AIGC_ESBUILD_MODULE ?? 'esbuild')
const bundle = await build({
  stdin: {
    contents: "export * from './src/mosaic/generators.ts'; export { components } from './src/data/components.ts';",
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

test('every scoped AIGC component has a source-backed adapter and catalog-valid defaults', () => {
  assert.equal(api.components.length, 17)
  assert.equal(api.mosaicCoverage.length, 17)
  for (const component of api.components) {
    const adapter = api.mosaicAdapter(component.slug)
    assert.ok(adapter, component.slug)
    const result = generate(component.slug)
    assert.equal(result.validation.valid, true, `${component.slug}: ${JSON.stringify(result.validation.issues)}`)
    assert.ok(result.validation.nodeCount > 1, component.slug)
    assert.equal(result.validation.coverage.mode, 'catalog-snapshot')
    for (const node of allNodes(result.node)) {
      assert.equal('props' in node, false, `${component.slug} must use flattened SDL v2`)
      assert.equal('onClickAction' in node, false, `${component.slug} must not fabricate a product action`)
      assert.equal('onChangeAction' in node, false, `${component.slug} must not fabricate a product action`)
    }
  }
})

test('all registered select and boolean combinations stay valid and JSON serializable', () => {
  for (const component of api.components) {
    let combinations = [defaults(component)]
    for (const prop of component.props) {
      const branches = prop.kind === 'select' ? prop.values : prop.kind === 'boolean' ? [true, false] : []
      if (branches.length) combinations = combinations.flatMap(values => branches.map(value => ({ ...values, [prop.name]: value })))
    }
    for (const values of combinations) {
      const result = generate(component.slug, values)
      assert.equal(result.validation.valid, true, `${component.slug} ${JSON.stringify(values)}: ${JSON.stringify(result.validation.issues)}`)
      assert.deepEqual(JSON.parse(JSON.stringify(result.node)), result.node)
    }
  }
})

test('all exported source artwork uses local extracted Figma assets', () => {
  let imageCount = 0
  for (const component of api.components) {
    const result = generate(component.slug)
    for (const node of allNodes(result.node).filter(node => node.type === 'Image')) {
      imageCount += 1
      assert.match(node.src, /^\/figma\/(?:(?:optimized-)?images\/[a-f0-9]{40}\.(?:png|jpg|jpeg|webp|gif|svg|avif)|controls\/guest-lock-(?:error|modal)\.png)$/)
      assert.equal(typeof node.alt, 'string')
    }
  }
  assert.ok(imageCount >= 20)
})

test('live prompt and heading edits replace the source defaults without interpreting markup', () => {
  const prompt = 'A "quoted" bear <script>literal</script>\n新提示词'
  const composer = generate('creation-composer', { prompt: 'old' }, { prompt })
  assert.ok(content(composer.node).includes(prompt))
  assert.ok(!content(composer.node).includes('old'))
  const heading = '新模板 "gallery"'
  assert.ok(content(generate('serp-carousel', { heading: 'old' }, { heading }).node).includes(heading))
  const main = generate('main-image-area', { status: 'hover', mode: 'Original' }, { prompt, mode: 'Updated mode' })
  assert.ok(content(main.node).includes(prompt))
  assert.ok(content(main.node).includes('Mode: Updated mode'))
})

test('source image ratios, live thumbnail selection, loading and history variants change output', () => {
  const imageOf = result => allNodes(result.node).find(node => node.type === 'Image')
  assert.equal(imageOf(generate('main-image-area', { property1: '1:1' })).width, 608)
  assert.equal(imageOf(generate('main-image-area', { property1: '2:3' })).width, 404)
  assert.notEqual(imageOf(generate('main-content-area')).src, imageOf(generate('main-content-area', {}, { selectedIndex: 1 })).src)
  assert.ok(content(generate('main-content-area', { property1: 'loading status' }).node).includes('We are generating the image for you...'))
  assert.equal(content(generate('history-panel', { property1: 'unsigned in' }).node).includes('See all'), false)
  assert.equal(content(generate('history-panel', { property1: 'full' }).node).includes('See all'), true)
  const strip = generate('image-display-list', {}, { selectedIndex: 2 })
  assert.ok(allNodes(strip.node).some(node => node.ariaLabel === 'Generated image 3, selected'))
  assert.ok(allNodes(generate('history-panel-images', { property1: 'Loading' }).node).some(node => node.role === 'progressbar'))
})

test('nested Components-page helpers retain source labels, dimensions and long prompt copy', () => {
  assert.ok(content(generate('prompt-template-card', { property1: 'Original' }).node).includes('Original'))
  assert.ok(content(generate('prompt-template-card', { property1: 'Template' }).node).includes('Sketch'))
  assert.equal(generate('checkmark-circle', { property1: 'Default' }).node.children[0].width, 28)
  assert.equal(generate('checkmark-circle', { property1: 'Variant2' }).node.children[0].width, 24)
  const longFooter = allNodes(generate('main-image-footer', { property1: '4 lines' }).node).find(node => node.type === 'Text')
  assert.equal(longFooter.value.length, 493)
  assert.ok(longFooter.value.endsWith('sitting on a green me...'))
  assert.equal(longFooter.maxLines, 4)
  const selected = generate('display-image', { property1: 'selected', property2: '1:1' })
  assert.equal(selected.node.children[0].width, 150)
  assert.equal(selected.node.children[0].ariaLabel, 'Generated image, selected')
  assert.ok(content(generate('serp-template-card').node).includes('Product Spotlight'))
})

test('composition keeps source blocks, product gaps, and missing adapters explicit', () => {
  const component = api.components.find(item => item.slug === 'creation-composer')
  const result = api.generateMosaicPage([{ slug: component.slug, values: defaults(component), live: { prompt: 'Live assembly prompt' } }], 'creator', 960)
  assert.equal(result.validation.valid, true)
  assert.ok(content(result.node).includes('Live assembly prompt'))
  assert.ok(result.warnings.length > 0)
  assert.equal(result.node.children[0].width, 960)
  const missing = api.generateMosaicPage([{ slug: 'unknown-source', values: {}, live: {} }], 'blank')
  assert.equal(missing.validation.valid, false)
  assert.ok(missing.validation.issues.some(issue => issue.message.includes('unknown-source')))
  assert.equal(api.mosaicAdapter('toString'), undefined)
})
