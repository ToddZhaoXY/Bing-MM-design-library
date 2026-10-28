import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Script, runInNewContext } from 'node:vm';
import { once } from 'node:events';
import { root, systems, filesIn, sha256 } from '../scripts/lib.mjs';
import { buildCompat, assetLiteral, rewriteBundleAssets } from '../scripts/build-compat.mjs';
import { createStaticServer } from '../scripts/serve.mjs';

const directory = process.env.COMPAT_DIR || (await buildCompat()).directory;
const manifest = JSON.parse(await readFile(join(directory, 'BUILD-MANIFEST.json'), 'utf8'));

test('compatibility package is completely flat, with no base, iframe or inline scripts', async () => {
  for (const file of await filesIn(directory)) assert.ok(!file.includes('/'), file);
  for (const id of systems) {
    const html = await readFile(join(directory, `${id}.html`), 'utf8');
    assert.doesNotMatch(html, /<base\b|<iframe\b|type="module"|\.\.\//);
    assert.match(html, /id="library-app" defer src="\.\/[^/]+\.js"/);
    assert.equal((html.match(/<script\b/g) || []).length, 2);
    for (const target of systems) assert.ok(html.includes(`href="./${target}.html#/"`));
    new Script(await readFile(join(directory, manifest.entries[id].script), 'utf8'));
  }
});

test('asset rewriting preserves dynamic paths, css masks and unrelated text', () => {
  const source = `
    const ICON = 'figma/icon/';
    const name = 'check.svg';
    globalThis.result = [ICON + name, \`figma/molecules/\${name}\`, './' + 'figma/img/photo.png',
      'url("figma/molecules/mask.svg")', 'Docs describe figma/img/photo.png', 'https://example.com/figma/img/photo.png'];
  `;
  const context = {};
  runInNewContext(rewriteBundleAssets(source, 'video'), context);
  assert.deepEqual(Array.from(context.result), [
    'video-figma-icon-check.svg', 'video-figma-molecules-check.svg', './video-figma-img-photo.png',
    'url("video-figma-molecules-mask.svg")', 'Docs describe figma/img/photo.png', 'https://example.com/figma/img/photo.png',
  ]);
  assert.equal(assetLiteral('data:image/svg+xml,figma/icon/', 'video'), 'data:image/svg+xml,figma/icon/');
});

test('every relocated media/font/license file is byte-identical and uniquely named', async () => {
  assert.equal(new Set(Object.values(manifest.assets)).size, Object.keys(manifest.assets).length);
  for (const [source, output] of Object.entries(manifest.assets)) {
    const [id, ...path] = source.split('/');
    assert.equal(await sha256(join(root, 'projects', id, 'site/dist', ...path)), await sha256(join(directory, output)), source);
  }
});

test('homepage styling, copy and motion are unchanged except image locations', async () => {
  assert.equal(await sha256(join(root, 'portal/home.css')), await sha256(join(directory, 'home.css')));
  assert.equal(await sha256(join(root, 'portal/home.js')), await sha256(join(directory, 'home.js')));
  const original = await readFile(join(root, 'portal/index.html'), 'utf8');
  const html = await readFile(join(directory, 'index.html'), 'utf8');
  assert.equal(html.replaceAll('./showcase-', './showcase/'), original);
});

test('manifest verifies every emitted file and has no hidden dependency on systems folders', async () => {
  assert.equal(manifest.packaging, 'flat-no-base');
  assert.deepEqual((await filesIn(directory)).filter(file => file !== 'BUILD-MANIFEST.json'), Object.keys(manifest.files).sort());
  for (const [file, hash] of Object.entries(manifest.files)) assert.equal(await sha256(join(directory, file)), hash);
});

test('all HTML and CSS resources resolve at root and subpath with base/frames forbidden and nested files unavailable', async () => {
  for (const base of ['/', '/published/design/']) {
    const server = await createStaticServer({ directory, base });
    server.prependListener('request', (request, response) => {
      response.setHeader('Content-Security-Policy', "base-uri 'none'; frame-src 'none'; script-src 'self'; object-src 'none'");
      response.setHeader('X-Frame-Options', 'DENY');
      if (request.url.slice(base.length).includes('/')) request.url = base + '__nested_not_supported__';
    });
    server.listen(0, '127.0.0.1'); await once(server, 'listening');
    const origin = `http://127.0.0.1:${server.address().port}`;
    try {
      for (const file of await filesIn(directory)) {
        const url = new URL(base + file, origin);
        const response = await fetch(url);
        assert.equal(response.status, 200, url.href);
        if (file.endsWith('.js')) assert.match(response.headers.get('content-type'), /javascript/);
        if (!/\.(html|css)$/.test(file)) { await response.arrayBuffer(); continue; }
        const text = await response.text();
        const references = file.endsWith('.html') ? [...text.matchAll(/(?:href|src)="([^"]+)"/g)].map(m => m[1]) :
          [...text.matchAll(/url\(["']?([^)'"\s]+)["']?\)/g)].map(m => m[1]);
        for (const ref of references) {
          if (/^(?:https?:|data:|#|mailto:)/.test(ref)) continue;
          const resource = new URL(ref, url);
          const result = await fetch(resource, { method: 'HEAD' });
          assert.equal(result.status, 200, `${file}: ${ref}`);
        }
      }
    } finally { await new Promise(resolve => server.close(resolve)); }
  }
});

const bootScript = await readFile(join(root, 'shared/compat-boot.js'), 'utf8');
function boot({ statusCode = 404, contentType = 'text/plain', redirected = false } = {}) {
  const events = new Map(); const timers = new Map();
  const app = { tagName: 'SCRIPT', src: 'https://host.test/design/aigc-app.js', getAttribute: () => './aigc-app.js' };
  const title = { textContent: '' }; const detail = { textContent: '' };
  const status = { hidden: false, classList: { add() {} }, querySelector: () => title, setAttribute() {} };
  const root = { children: [] }; let now = 0;
  const elements = { root, 'library-app': app, 'library-startup': status, 'startup-detail': detail, 'startup-retry': { addEventListener() {} } };
  const window = { addEventListener: (name, callback) => events.set(name, callback),
    fetch: async () => ({ status: statusCode, ok: statusCode === 200, type: redirected ? 'opaqueredirect' : 'basic', headers: { get: () => contentType } }) };
  runInNewContext(bootScript, {
    window, document: { getElementById: name => elements[name] },
    location: { href: 'https://host.test/design/aigc.html', origin: 'https://host.test', reload() {} }, URL, AbortController,
    Date: { now: () => now }, setTimeout: () => 1, clearTimeout() {},
    setInterval: fn => { timers.set(1, fn); return 1; }, clearInterval: id => timers.delete(id),
  });
  return { app, events, detail, root, status, fail: () => events.get('error')({ target: app }),
    tick: ms => { now = ms; for (const fn of timers.values()) fn(); }, settle: () => new Promise(resolve => setImmediate(resolve)) };
}

test('failure diagnostic distinguishes 404, HTML responses and authentication redirects', async () => {
  for (const [options, expected] of [[{}, /HTTP 404.*missing at this URL/], [{ statusCode: 200, contentType: 'text/html' }, /HTTP 200.*HTML was returned instead of JavaScript/], [{ redirected: true }, /request was redirected/]]) {
    const state = boot(options); state.fail(); await state.settle();
    assert.match(state.detail.textContent, /aigc-app\.js/);
    assert.match(state.detail.textContent, expected);
  }
});
test('policy failure is not overwritten by subsequent resource errors, and a late successful render dismisses the notice', async () => {
  const state = boot();
  state.events.get('securitypolicyviolation')({ effectiveDirective: 'script-src-elem' });
  state.fail(); await state.settle();
  assert.match(state.detail.textContent, /hosting security policy: script-src-elem/);
  state.root.children.push({}); state.tick(250);
  assert.equal(state.status.hidden, true);
});
