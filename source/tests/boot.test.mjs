import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const script = await readFile(new URL('../shared/library-boot.js', import.meta.url), 'utf8');
function boot() {
  const handlers = new Map();
  const intervals = new Map();
  const root = { children: [] };
  const title = { textContent: '' };
  const status = { hidden: false, role: 'status', error: false, classList: { add() { status.error = true; } }, querySelector: () => title, setAttribute(_key, value) { status.role = value; } };
  const detail = { textContent: '' };
  let now = 0;
  let reloads = 0;
  let retry;
  const elements = { root, 'library-startup': status, 'startup-detail': detail, 'startup-retry': { addEventListener(_name, fn) { retry = fn; } } };
  runInNewContext(script, {
    document: { getElementById: id => elements[id] },
    window: { addEventListener(name, fn) { handlers.set(name, fn); } },
    location: { reload() { reloads++; } },
    Date: { now: () => now },
    setInterval(fn) { const id = intervals.size + 1; intervals.set(id, fn); return id; },
    clearInterval(id) { intervals.delete(id); },
  });
  return { root, status, detail, title, intervals, handlers, retry: () => retry(), reloads: () => reloads,
    tick(ms) { now = ms; for (const fn of [...intervals.values()]) fn(); } };
}

test('an empty #root does not count as a successfully loaded library', () => {
  const state = boot(); state.tick(9000);
  assert.equal(state.status.hidden, false);
  assert.equal(state.status.error, true);
  assert.equal(state.status.role, 'alert');
  assert.match(state.detail.textContent, /longer than expected/);
});
test('rendered content dismisses startup immediately without reading any iframe', () => {
  const state = boot(); state.root.children.push({}); state.tick(250);
  assert.equal(state.status.hidden, true);
  assert.equal(state.intervals.size, 0);
  assert.doesNotMatch(script, /contentWindow|parent\.|createElement\(['"]iframe/);
});
test('missing JavaScript has an actionable bounded failure, not endless loading', () => {
  const state = boot(); state.handlers.get('error')({ target: { tagName: 'SCRIPT' } });
  assert.match(state.detail.textContent, /JavaScript file could not load/);
  state.retry(); assert.equal(state.reloads(), 1);
  state.tick(61000); assert.equal(state.intervals.size, 0);
});
test('security policy failures are explained and a slow successful render can recover', () => {
  const state = boot();
  state.handlers.get('securitypolicyviolation')({ type: 'securitypolicyviolation', effectiveDirective: 'script-src-elem' });
  assert.match(state.detail.textContent, /security policy/);
  state.root.children.push({}); state.tick(10000);
  assert.equal(state.status.hidden, true);
});
test('page lifecycle clears pending work and can resume a not-yet-rendered page', () => {
  const state = boot(); state.handlers.get('pagehide')(); assert.equal(state.intervals.size, 0);
  state.handlers.get('pageshow')(); assert.equal(state.intervals.size, 1);
});
