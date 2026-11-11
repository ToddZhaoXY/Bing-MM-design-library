import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { createRequire } from 'node:module'
import { root, systems } from '../scripts/lib.mjs'
import { syncNavigation } from '../scripts/sync-navigation.mjs'

const require = createRequire(join(root, 'projects/mm-image/site/package.json'))
const { build } = require('esbuild')

test('all standalone libraries use the canonical navigation component without drift', async () => {
  await syncNavigation({ check: true })
  const source = await readFile(join(root, 'ui/LibraryNav.tsx'), 'utf8')
  assert.ok(!source.includes('↳'))
  for (const system of systems) {
    assert.equal(await readFile(join(root, 'projects', system, 'site/src/components/LibraryNav.tsx'), 'utf8'), source)
    assert.equal(await readFile(join(root, 'projects', system, 'site/src/components/LibraryNav.css'), 'utf8'), await readFile(join(root, 'ui/LibraryNav.css'), 'utf8'))
  }
})

test('navigation preserves all component routes, including cross-tier children', async () => {
  for (const system of systems) {
    const result = await build({
      stdin: { resolveDir: join(root, 'projects', system, 'site'), contents: `
        import React from 'react';
        import { renderToStaticMarkup } from 'react-dom/server';
        import { MemoryRouter } from 'react-router-dom';
        import { Nav } from './src/components/Nav';
        import { components } from './src/data/components';
        export { components };
        export function render(path) { return renderToStaticMarkup(React.createElement(MemoryRouter, { initialEntries: [path] }, React.createElement(Nav))); }
      ` }, bundle: true, platform: 'node', format: 'cjs', write: false, jsx: 'automatic',
      define: { 'process.env.NODE_ENV': '"production"' }, loader: { '.css': 'empty' },
    })
    const mod = { exports: {} }
    new Function('require', 'module', 'exports', result.outputFiles[0].text)(require, mod, mod.exports)
    const { components, render } = mod.exports
    const html = render('/')
    const links = [...html.matchAll(/href="\/c\/([^"]+)"/g)].map(match => match[1])
    assert.deepEqual(links.sort(), components.map(component => component.slug).sort(), system)
    assert.equal(links.length, new Set(links).size, `${system}: duplicate routes`)
    assert.equal((html.match(/class="nav__group-title nav__section-toggle"/g) ?? []).length, 4)
    const parents = new Set(components.filter(component => component.partOf).map(component => component.partOf))
    assert.equal((html.match(/class="nav__branch-toggle"/g) ?? []).length, parents.size)
    for (const part of components.filter(component => component.partOf)) {
      const nested = render(`/c/${part.slug}`)
      assert.equal((nested.match(/aria-current="page"/g) ?? []).length, 1)
      const parent = components.find(component => component.slug === part.partOf)
      assert.ok(nested.includes(`aria-label="Collapse ${parent.name.replaceAll('&', '&amp;')}"`), `${system}: active branch hidden`)
      assert.match(nested, /nav__node--ancestor/)
    }
  }
})
