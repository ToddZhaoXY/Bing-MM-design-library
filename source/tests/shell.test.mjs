import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { systems, parseRoute, formatRoute, normalizeChildRoute, nextTabIndex } from '../shell/routing.mjs';

test('the only three systems are MM Image, AIGC and Video, in that order', () => {
  assert.deepEqual(systems.map(system => system.label), ['MM Image', 'AIGC', 'Video']);
});

test('all systems support home and deep links with query strings', () => {
  for (const { id } of systems) {
    for (const route of ['/', '/playground', '/c/image-tile', '/c/example?mode=a%20b']) {
      assert.deepEqual(parseRoute(formatRoute(id, route)), { id, route });
    }
    assert.deepEqual(parseRoute(`#/${id}`), { id, route: '/' });
  }
});

test('unknown hashes fall back to MM Image without navigating off site', () => {
  for (const hash of ['', '#/', '#/other/playground', '#video', '#/video-evil/', '#https://example.org']) {
    assert.deepEqual(parseRoute(hash), { id: 'mm-image', route: '/' });
  }
  for (const route of ['//example.org', 'https://example.org', 'javascript:alert(1)', '']) {
    assert.equal(normalizeChildRoute(route), '/');
  }
  assert.equal(normalizeChildRoute('#/playground'), '/playground');
  assert.throws(() => formatRoute('unknown'));
});

test('arrow keys wrap and Home/End activate boundary tabs', () => {
  assert.equal(nextTabIndex(2, 'ArrowRight'), 0);
  assert.equal(nextTabIndex(0, 'ArrowLeft'), 2);
  assert.equal(nextTabIndex(0, 'ArrowRight'), 1);
  assert.equal(nextTabIndex(2, 'Home'), 0);
  assert.equal(nextTabIndex(0, 'End'), 2);
  assert.equal(nextTabIndex(1, 'Tab'), null);
});

test('HTML has paired tabs/panels, relative assets and initially inert hidden panels', async () => {
  const html = await readFile(new URL('../shell/index.html', import.meta.url), 'utf8');
  for (const { id } of systems) {
    assert.ok(html.includes(`id="tab-${id}"`));
    assert.ok(html.includes(`aria-controls="panel-${id}"`));
    assert.ok(html.includes(`aria-labelledby="tab-${id}"`));
  }
  assert.equal((html.match(/hidden inert/g) ?? []).length, 2);
  assert.equal((html.match(/aria-selected="true"/g) ?? []).length, 1);
  assert.ok(html.includes('src="./app.mjs"'));
  assert.ok(html.includes('href="./styles.css"'));
});
