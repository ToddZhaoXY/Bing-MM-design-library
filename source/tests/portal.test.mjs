import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Script } from 'node:vm';
import { once } from 'node:events';
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { root, systems, filesIn, sha256, sourceFilter } from '../scripts/lib.mjs';
import { createStaticServer } from '../scripts/serve.mjs';
import { entryScript, makeLibraryPage } from '../scripts/library-page.mjs';

test('all original library content and source assets remain byte-identical', async () => {
  const manifest = JSON.parse(await readFile(join(root, 'ORIGINALS.json'), 'utf8'));
  for (const entry of manifest.files) assert.equal(await sha256(join(root, entry.path)), entry.sha256, entry.path);
});
test('the first-visit entry is a readable overview with three native links and no frames', async () => {
  const html = await readFile(join(root, 'dist/index.html'), 'utf8');
  assert.doesNotMatch(html, /<iframe\b|type="module"/i);
  for (const id of systems) assert.match(html, new RegExp(`href="\\./${id}\\.html`));
  assert.match(html, /<h1[\s>]/);
  assert.match(html, /showcase\//);
});
test('root and nested library entries retain resource bases and normal cross-library navigation', async () => {
  for (const id of systems) {
    const original = await readFile(join(root, 'projects', id, 'site/dist/index.html'), 'utf8');
    for (const alias of [false, true]) {
      const output = await readFile(join(root, 'dist', alias ? `${id}.html` : `systems/${id}/index.html`), 'utf8');
      assert.equal(output, makeLibraryPage(original, id, { alias }));
      assert.doesNotMatch(output, /<iframe\b|type="module"|\bcrossorigin\b/);
      assert.match(output, /id="root"/);
      assert.match(output, /id="library-startup"/);
      assert.match(output, /<noscript>/);
      for (const target of systems) assert.ok(output.includes(`href="../../${target}.html#/"`));
    }
  }
});
test('every emitted app bundle parses as classic JavaScript and the original assets remain intact', async () => {
  for (const id of systems) {
    const source = join(root, 'projects', id, 'site/dist');
    const target = join(root, 'dist/systems', id);
    const script = entryScript(await readFile(join(source, 'index.html'), 'utf8')).replace(/^\.\//, '');
    const transformed = script.replace(/\.js$/, '-classic.js');
    new Script(await readFile(join(target, transformed), 'utf8'));
    for (const file of await filesIn(source)) {
      if (file !== 'index.html' && file !== script) assert.equal(await sha256(join(source, file)), await sha256(join(target, file)), `${id}/${file}`);
    }
  }
});
test('the production manifest covers every file and has no development fixtures', async () => {
  const manifest = JSON.parse(await readFile(join(root, 'dist/BUILD-MANIFEST.json'), 'utf8'));
  assert.equal(manifest.navigation, 'standalone-pages');
  assert.deepEqual((await filesIn(join(root, 'dist'))).filter(f => f !== 'BUILD-MANIFEST.json'), Object.keys(manifest.files).sort());
  for (const [file, hash] of Object.entries(manifest.files)) {
    assert.equal(await sha256(join(root, 'dist', file)), hash, file);
    assert.doesNotMatch(file, /(^|\/)(node_modules|qa|tests|projects)\//);
  }
});
test('source package excludes dependency links and includes locks and font licenses', async () => {
  const files = await filesIn(root, sourceFilter);
  assert.ok(files.includes('projects/video/site/licenses/Roboto-LICENSE.txt'));
  for (const id of systems) assert.ok(files.includes(`projects/${id}/site/package-lock.json`));
  assert.ok(!files.some(file => /node_modules|\.git\//.test(file)));
});
test('theme still adds no inherited custom properties to exported component snapshots', async () => {
  const css = await readFile(join(root, 'dist/theme/index.css'), 'utf8');
  assert.doesNotMatch(css, /--hub-|@import/);
});

function request(port, path) {
  return new Promise((resolve, reject) => {
    http.get({ hostname: '127.0.0.1', port, path }, response => {
      const chunks = []; response.on('data', data => chunks.push(data));
      response.on('end', () => resolve({ status: response.statusCode, headers: response.headers, body: Buffer.concat(chunks).toString() }));
    }).on('error', reject);
  });
}
test('all root and subdirectory entries/resources resolve under frame-restricted hosting', async () => {
  const base = '/published/design/';
  const server = await createStaticServer({ base });
  server.prependListener('request', (_request, response) => {
    response.setHeader('Content-Security-Policy', "frame-src 'none'; base-uri 'self'");
    response.setHeader('X-Frame-Options', 'DENY');
  });
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  const port = server.address().port;
  try {
    for (const file of await filesIn(join(root, 'dist'))) {
      const result = await request(port, base + file.split('/').map(encodeURIComponent).join('/'));
      assert.equal(result.status, 200, file);
    }
    for (const file of ['index.html', ...systems.flatMap(id => [`${id}.html`, `systems/${id}/index.html`])]) {
      const pageUrl = `http://127.0.0.1:${port}${base}${file}`;
      const result = await request(port, new URL(pageUrl).pathname);
      assert.equal(result.headers['x-frame-options'], 'DENY');
      const declaredBase = /<base href="([^"]+)"/.exec(result.body)?.[1];
      const documentBase = new URL(declaredBase || '.', pageUrl);
      for (const [, reference] of result.body.replace(/<base\b[^>]*>/g, '').matchAll(/(?:href|src)="([^"]+)"/g)) {
        if (/^https?:|^data:|^mailto:|^#/.test(reference)) continue;
        const url = new URL(reference, documentBase);
        assert.equal((await request(port, url.pathname)).status, 200, `${file}: ${reference}`);
      }
    }
  } finally { await new Promise(resolve => server.close(resolve)); }
});
