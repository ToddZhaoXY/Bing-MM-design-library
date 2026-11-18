import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { root, filesIn } from '../scripts/lib.mjs';
import { libraries, libraryRail, makeHomePage } from '../scripts/library-chrome.mjs';
import { renderTokensPage, tokensRoot } from '../scripts/tokens-library.mjs';

const data = JSON.parse(await readFile(join(tokensRoot, 'content.json'), 'utf8'));
const html = renderTokensPage(data, { nav: 'library-nav.css', switcher: 'library-switcher.js', theme: 'theme.css', css: 'tokens.css', script: 'tokens.js' });
const tokenPanels = data.panels.filter(p => ['color', 'type', 'shape', 'spacing', 'depth', 'motion', 'effects'].includes(p.id));

test('all 426 source tokens are retained once, including explicit pairs and reference mappings', () => {
  const rows = tokenPanels.flatMap(p => p.rows);
  assert.equal(rows.length, 426);
  assert.equal(new Set(rows.map(([name]) => name)).size, 426);
  assert.equal((html.match(/data-token-row/g) || []).length, 426);
  const colors = data.panels.find(p => p.id === 'color').rows;
  assert.equal(colors.filter(([, value]) => value.includes(' / ')).length, 120);
  assert.equal(colors.filter(([, value]) => !value.includes(' / ')).length, 165);
  for (const [name] of rows) assert.ok(html.includes(`data-copy="${name}"`), name);
});
test('Tokens is first in every library rail and homepage and has one current link', () => {
  assert.deepEqual(libraries.map(([id]) => id), ['tokens', 'mm-image', 'aigc', 'video', 'algo']);
  for (const [id] of libraries) {
    const rail = libraryRail(id);
    assert.equal((rail.match(/aria-current="page"/g) || []).length, 1);
    assert.ok(rail.indexOf('tokens.html') < rail.indexOf('mm-image.html'));
  }
  assert.ok(makeHomePage('<!-- library-chrome -->').indexOf('tokens.html') < makeHomePage('<!-- library-chrome -->').indexOf('mm-image.html'));
});
test('every Tokens navigation destination exists, with no legacy content or remote image dependencies', async () => {
  assert.doesNotMatch(html, /data-nav-toggle|class="nav__toggle"|nav--collapsed/);
  for (const [, id] of html.matchAll(/data-token-link="([^"]+)"/g)) assert.ok(html.includes(`data-token-page="${id}"`), id);
  for (const [, id] of html.matchAll(/href="#\/([^"]+)"/g)) assert.ok(html.includes(`data-token-page="${id}"`), id);
  assert.doesNotMatch(html, /Legacy v1\.2|Showcase\.png|bing-design-skill-card-showcase|whats-inside-legacy|<iframe|<script>/i);
  const assets = await filesIn(join(tokensRoot, 'assets'));
  for (const [, name] of html.matchAll(/src="\.\/tokens-([^"]+\.png)"/g)) assert.ok(assets.includes(name), name);
  assert.equal(assets.length, 9);
  for (const id of ['scenarios', 'cases', 'value', 'tips', 'future', 'reference']) assert.ok(html.includes(`data-token-page="${id}"`));
});
test('combined build includes the static Tokens entry and its first-class manifest membership', async () => {
  const manifest = JSON.parse(await readFile(join(root, 'dist/BUILD-MANIFEST.json'), 'utf8'));
  assert.equal(manifest.systems[0], 'tokens');
  assert.ok(manifest.files['tokens.html']);
  const emitted = await readFile(join(root, 'dist/tokens.html'), 'utf8');
  assert.match(emitted, /data-hub-system="tokens"/);
  assert.match(emitted, /href="\.\/theme\/index.css"/);
});
