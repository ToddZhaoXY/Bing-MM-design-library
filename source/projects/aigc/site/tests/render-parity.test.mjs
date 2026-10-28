import test from 'node:test'
import assert from 'node:assert/strict'
import { build, transform } from 'esbuild'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'

const bundle = await build({ stdin: { contents: `
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as publicComponents from './src/components/index';
import { RENDERERS, TAGS } from './src/components/renderers';
import { components, propertyCombinations } from './src/data/components';
import { defaults, toJSX } from './src/components/Workbench';
export { React, renderToStaticMarkup, publicComponents, RENDERERS, TAGS, components, propertyCombinations, defaults, toJSX };`, resolveDir: fileURLToPath(new URL('../', import.meta.url)) }, bundle: true, platform: 'node', format: 'cjs', write: false, define: { 'import.meta.env.BASE_URL': '"./"' } })
const module = { exports: {} }
new Function('require', 'module', 'exports', bundle.outputFiles[0].text)(createRequire(import.meta.url), module, module.exports)
const api = module.exports

test('displayed property combination counts include boolean axes', () => {
  assert.equal(api.propertyCombinations([{ kind: 'boolean', default: true }, { kind: 'select', values: ['a', 'b', 'c'], default: 'a' }, { kind: 'text', default: '' }]), 6)
  assert.equal(api.components.reduce((sum, component) => sum + api.propertyCombinations(component.props), 0), 695)
})

test('all published component defaults can render independently of the workbench', () => {
  assert.equal(api.components.length, 17)
  for (const def of api.components) {
    assert.equal(typeof api.publicComponents[api.TAGS[def.slug]], 'function', def.slug)
    const values = api.defaults(def.props)
    const jsxValues = Object.fromEntries(def.props.map(prop => [prop.name, prop.numeric ? Number(values[prop.name]) : values[prop.name]]))
    const preview = api.renderToStaticMarkup(api.RENDERERS[def.slug](values, () => {}))
    const standalone = api.renderToStaticMarkup(api.React.createElement(api.publicComponents[api.TAGS[def.slug]], jsxValues))
    assert.equal(standalone, preview, `${def.slug}: copied public API differs from preview`)
  }
})

test('generated JSX preserves source variant output including empty typing-prompt semantics', async () => {
  let checked = 0
  for (const def of api.components) {
    const base = api.defaults(def.props)
    const cases = [base, ...def.props.filter(prop => prop.kind === 'select').flatMap(prop => prop.values.map(value => ({ ...base, [prop.name]: value })))]
    for (const values of cases) {
      const code = api.toJSX(def, values, api.TAGS[def.slug])
      const compiled = await transform(`globalThis.copied = ${code}`, { loader: 'tsx', jsx: 'transform', jsxFactory: 'React.createElement' })
      const context = { React: api.React, ...api.publicComponents }
      vm.runInNewContext(compiled.code, context)
      const copied = api.renderToStaticMarkup(context.copied)
      const preview = api.renderToStaticMarkup(api.RENDERERS[def.slug](values, () => {}))
      assert.equal(copied, preview, `${def.slug} ${JSON.stringify(values)}`)
      checked++
    }
  }
  assert.ok(checked >= 100)
})
