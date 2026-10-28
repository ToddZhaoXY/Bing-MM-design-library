import test from 'node:test'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
// Normal use resolves the site's Vite dependency. A local reference toolchain
// may be supplied while the standalone site's dependencies are not installed.
const { build } = await import(process.env.VIDEO_ESBUILD_MODULE ?? 'esbuild')

// Compile the real TS implementation and bundled catalog, entirely in memory.
const bundle = await build({
  stdin: {
    contents: "export * from './src/mosaic/validate.ts'; export * from './src/mosaic/builders.ts';",
    resolveDir: fileURLToPath(new URL('../', import.meta.url)),
  },
  bundle: true, platform: 'node', format: 'esm', write: false,
})
const api = await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`)
const { validateMosaicSdl: validate, basic, row, text, image, button, node, finish } = api

test('retains the reference catalog contract and validates a flattened component tree', () => {
  assert.equal(api.mosaicCatalogSnapshot.componentCount, 32)
  assert.equal(api.mosaicCatalogSnapshot.mosaicCliVersion, '1.0.969')
  const result = validate(basic([row([text('A source caption'), image('/video/source.png', 'Source image')], { gap: 2 })]))
  assert.equal(result.valid, true)
  assert.equal(result.nodeCount, 4)
  assert.deepEqual(result.componentTypes, ['Basic', 'Image', 'Row', 'Text'])
  assert.equal(result.coverage.opaqueProperties.length, 0)
})

test('rejects unknown components, nested props, and undeclared properties', () => {
  for (const candidate of [null, [], { type: 'VideoPrivateThing' }, { type: 'toString' }, { type: 'Text', props: { value: 'text' } }, { type: 'Text', value: 'text', invented: true }]) {
    assert.equal(validate(candidate).valid, false, JSON.stringify(candidate))
  }
})

test('requires catalog-mandated properties and rejects undefined required values', () => {
  for (const candidate of [{ type: 'Text' }, { type: 'Image' }, { type: 'Icon' }, { type: 'Text', value: undefined }]) {
    assert.equal(validate(candidate).valid, false)
  }
  assert.ok(validate({ type: 'Text' }).issues.some(issue => issue.path === '$.value'))
})

test('checks enum, union, literal, and finite-number contracts', () => {
  assert.equal(validate(image('/video/source.png', '', { radius: 'md', width: '100%' })).valid, true)
  assert.equal(validate(image('/video/source.png', '', { radius: 'not-a-radius' })).valid, false)
  assert.equal(validate(text('text', { editable: false })).valid, true)
  assert.equal(validate(text('text', { editable: true })).valid, false)
  assert.equal(validate(row([], { width: NaN })).valid, false)
  assert.equal(validate(row([], { width: Infinity })).valid, false)
  assert.equal(validate(button('Go', { disabled: 'false' })).valid, false)
})

test('rejects children on leaf components and non-array or sparse children', () => {
  assert.equal(validate(node('Text', { value: 'text' }, [text('nested')])).valid, false)
  assert.equal(validate({ type: 'Basic', children: {} }).valid, false)
  assert.equal(validate({ type: 'Basic', children: new Array(1) }).valid, false)
})

test('labels opaque action and option contracts as outer-shape checks only', () => {
  const result = finish(basic([
    button('Create', { onClickAction: { unknownActionContract: true } }),
    node('Select', { name: 'style', options: [{ unknownOptionContract: true }] }),
  ]))
  assert.equal(result.validation.valid, true)
  assert.deepEqual(result.validation.coverage.opaqueProperties.map(prop => prop.path), [
    '$.children[0].onClickAction', '$.children[1].options',
  ])
  assert.ok(result.warnings.some(warning => warning.includes('outer-shape')))
  assert.equal(validate(button('Create', { onClickAction: 'invalid outer type' })).valid, false)
})

test('detects child cycles while permitting an acyclic reused node', () => {
  const cyclic = basic([])
  cyclic.children.push(cyclic)
  const invalid = validate(cyclic)
  assert.equal(invalid.valid, false)
  assert.ok(invalid.issues.some(issue => issue.message.includes('circular')))
  const repeated = text('Shared immutable node')
  assert.equal(validate(basic([repeated, repeated])).valid, true)
})

test('builders preserve discriminator, supplied assets, and reference spacing conversion', () => {
  assert.equal(node('Text', { type: 'Wrong', value: 'text' }).type, 'Text')
  assert.equal(image('/video/actual-image.png', 'alt').src, '/video/actual-image.png')
  assert.equal(api.spacing(16), 4)
  assert.equal(api.spacing(2), 0.5)
  assert.equal(api.spacing('invalid'), 0)
  assert.deepEqual(api.unwrapBasic(finish(basic([text('text')]))), [text('text')])
})
