import test from 'node:test'
import assert from 'node:assert/strict'
import { build, transform } from 'esbuild'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'

const bundled = await build({ entryPoints: [fileURLToPath(new URL('../src/components/Workbench.tsx', import.meta.url))], bundle: true, platform: 'node', format: 'esm', write: false })
const { toJSX, jsxProps } = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`)
const def = { slug: 'fixture', name: 'Fixture', tier: 'Molecule', nodeId: 'test:1', bin: 'TBD', verified: false, overview: 'Test fixture only', props: [
  { name: 'title', kind: 'text', default: '' },
  { name: 'visible', kind: 'boolean', default: true },
  { name: 'size', kind: 'select', values: ['8', '16'], default: '8', numeric: true },
] }

async function decodedProps(jsx) {
  const compiled = await transform(`globalThis.result = ${jsx}`, { loader: 'tsx', jsx: 'transform', jsxFactory: 'h' })
  const context = { Fixture: 'Fixture', h: (_tag, props) => props }
  vm.runInNewContext(compiled.code, context)
  return context.result
}

test('copied JSX preserves arbitrary text without introducing additional props', async () => {
  const title = 'A "quote", apostrophe\'s, \\ slash\n<markup> & {code} onClick="oops"'
  const result = await decodedProps(toJSX(def, { title, visible: false, size: '16' }, 'Fixture', {}))
  assert.equal(result.title, title)
  assert.equal(result.visible, false)
  assert.equal(result.size, 16)
  assert.deepEqual(Object.keys(result).sort(), ['size', 'title', 'visible'])
})

test('live values override the same property only once', async () => {
  const props = jsxProps(def, { title: 'Initial', visible: true, size: '8' }, { title: 'Live "value"' })
  assert.equal(props.filter(prop => prop.startsWith('title=')).length, 1)
  const result = await decodedProps(`<Fixture ${props.join(' ')} />`)
  assert.equal(result.title, 'Live "value"')
  assert.equal(result.visible, true)
})
