import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';
import { root, filesIn, sha256 } from '../scripts/lib.mjs';
import { algoRoot, algoName, rewriteAlgoText } from '../scripts/algo-library.mjs';
import { libraries } from '../scripts/library-chrome.mjs';

const files = await filesIn(algoRoot);

test('Algo V8 import is complete and byte-identical to its pinned upstream ledger', async () => {
  const ledger = JSON.parse(await readFile(join(root, 'projects/algo/UPSTREAM.json'), 'utf8'));
  assert.deepEqual(files, Object.keys(ledger.files).sort());
  for (const [file, hash] of Object.entries(ledger.files)) assert.equal(await sha256(join(algoRoot, file)), hash, file);
  assert.equal(files.filter(file => file.endsWith('.html')).length, 22);
});

test('flat Algo asset paths retain templates, query strings, and external destinations', () => {
  const source = `const name='yahoo'; const richMobileAssetNames=new Set(['yahoo']);
    const dynamic=\`public/assets/\${richMobileAssetNames.has(name)?'mobile-rich':'rich'}/\${name}.png\`;
    const icon='public/assets/mm/'+name+'.png';
    const page='sectional-nav.html?device=mobile#playground';
    const external='https://example.com/sectional-nav.html';
    const home='index.html';
    globalThis.result=[dynamic,icon,page,external,home];`;
  const context = {};
  runInNewContext(rewriteAlgoText(source, files), context);
  assert.deepEqual(Array.from(context.result), ['algo-public-assets-mobile-rich-yahoo.png', 'algo-public-assets-mm-yahoo.png', 'algo-sectional-nav.html?device=mobile#playground', 'https://example.com/sectional-nav.html', 'algo.html']);
});

test('every Algo documentation page has real five-way links and a separate global home destination', async () => {
  const docPages = files.filter(file => file.endsWith('.html'));
  for (const file of docPages) {
    const html = await readFile(join(root, 'dist', algoName(file)), 'utf8');
    if (!html.includes('class="topbar"')) continue; // Three upstream redirect aliases.
    assert.match(html, /<a class="brand" href="\.\/index.html"/);
    for (const [id] of libraries) assert.ok(html.includes(`href="./${id}.html#/"`), `${file}: ${id}`);
    assert.match(html, /feature-nav-item active[^>]+aria-current="page"/);
    assert.doesNotMatch(html, /data-algo-collapse|class="nav__toggle"/);
    assert.ok(html.includes('href="algo.html"'), `${file}: Algo intro link`);
  }
});

test('navigation expansion survives switching libraries and unavailable browser storage', async () => {
  const script = await readFile(join(root, 'shared/library-switcher.js'), 'utf8');
  for (const saved of [null, 'false', 'true', 'throw']) {
    const attrs = {}; const bodyClasses = new Set(); const listeners = {}; const tooltip = {};
    const button = { setAttribute: (key, value) => attrs[key] = value, querySelector: () => tooltip, addEventListener: (key, value) => listeners[key] = value };
    const storage = new Map(saved == null ? [] : [['aixa-library-navigation-expanded', saved]]);
    const context = {
      document: { querySelector: () => ({ querySelector: () => button }), body: { classList: {
        toggle: (key, value) => value ? bodyClasses.add(key) : bodyClasses.delete(key), contains: key => bodyClasses.has(key),
      } } },
      localStorage: { getItem: key => { if (saved === 'throw') throw Error('disabled'); return storage.get(key); }, setItem: (key, value) => { if (saved === 'throw') throw Error('disabled'); storage.set(key, value); } },
    };
    runInNewContext(script, context);
    assert.equal(attrs['aria-expanded'], String(saved !== 'false'));
    assert.equal(bodyClasses.has('feature-nav-animated'), false);
    listeners.click();
    assert.equal(bodyClasses.has('feature-nav-animated'), true);
    assert.equal(attrs['aria-expanded'], String(saved === 'false'));
    assert.equal(tooltip.textContent, saved === 'false' ? 'Collapse navigation' : 'Expand navigation');
    if (saved !== 'throw') assert.equal(storage.get('aixa-library-navigation-expanded'), String(saved === 'false'));
  }
});
