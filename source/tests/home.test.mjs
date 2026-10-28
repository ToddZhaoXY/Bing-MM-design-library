import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const script = await readFile(new URL('../portal/home.js', import.meta.url), 'utf8');
const html = await readFile(new URL('../portal/index.html', import.meta.url), 'utf8');
const css = await readFile(new URL('../portal/home.css', import.meta.url), 'utf8');

class Element {
  constructor(kind, height = 0) {
    this.kind = kind; this.height = height; this.width = 220; this.children = [];
    this.dataset = {}; this.attributes = new Map(); this.events = new Map(); this.styles = new Map();
    this.style = { setProperty: (name, value) => this.styles.set(name, value) };
    this.classes = new Set();
    this.classList = { toggle: (name, active) => active ? this.classes.add(name) : this.classes.delete(name) };
  }
  appendChild(child) { child.parent = this; this.children.push(child); }
  remove() { this.parent.children = this.parent.children.filter(child => child !== this); }
  setAttribute(key, value) { this.attributes.set(key, value); }
  addEventListener(name, handler) { this.events.set(name, handler); }
  contains(node) { return node === this || this.children.some(child => child.contains(node)); }
  querySelectorAll(selector) {
    const matches = node => selector.startsWith('.') ? node.kind === selector.slice(1) : node.attributes.has(selector.slice(1, -1));
    return this.children.flatMap(child => [...(matches(child) ? [child] : []), ...child.querySelectorAll(selector)]);
  }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  getBoundingClientRect() {
    return { width: this.width, height: this.kind === 'flow-group' ? this.children.reduce((sum, node) => sum + node.height + 22, 0) : this.height };
  }
  cloneNode(deep) {
    const copy = new Element(this.kind, this.height);
    copy.dataset = { ...this.dataset }; copy.attributes = new Map(this.attributes);
    if (deep) this.children.forEach(child => copy.appendChild(child.cloneNode(true)));
    return copy;
  }
}

function createHome({ hash = '', reduced = false, mediaSupport = true, legacyMediaApi = false, missing = null, hiddenColumn = false } = {}) {
  const waterfall = new Element('waterfall'); waterfall.dataset.motion = 'static';
  const column = new Element('flow-column'); column.dataset = { speed: '24', phase: '.25', direction: 'up' };
  const track = new Element('flow-track'); const group = new Element('flow-group');
  [200, 240, 120].forEach(height => {
    const tile = new Element('tile', height);
    tile.setAttribute('href', './aigc.html#/c/display-image');
    group.appendChild(tile);
  });
  track.appendChild(group); column.appendChild(track); waterfall.appendChild(column);
  if (hiddenColumn) column.width = 0;
  const toggle = new Element('button'); toggle.hidden = true;
  const handlers = new Map(); const redirects = []; const timers = new Map();
  const query = { matches: reduced };
  let mediaListener;
  if (legacyMediaApi) query.addListener = handler => { mediaListener = handler; };
  else query.addEventListener = (_event, handler) => { mediaListener = handler; };
  const document = {
    hidden: false,
    querySelector: () => missing === 'waterfall' ? null : waterfall,
    getElementById: () => missing === 'toggle' ? null : toggle,
    addEventListener: (name, fn) => handlers.set(name, fn),
  };
  const window = { innerHeight: 720, location: { hash, replace: url => redirects.push(url) }, addEventListener: (name, fn) => handlers.set(name, fn) };
  if (mediaSupport) window.matchMedia = value => { assert.equal(value, '(prefers-reduced-motion: reduce)'); return query; };
  runInNewContext(script, { document, window, setTimeout: fn => { const id = timers.size + 1; timers.set(id, fn); return id; }, clearTimeout: id => timers.delete(id) }, { timeout: 1000 });
  return { waterfall, column, track, group, toggle, handlers, redirects, timers,
    click() { toggle.events.get('click')?.(); },
    preference(value) { query.matches = value; mediaListener?.(); },
    visibility(value) { document.hidden = value; handlers.get('visibilitychange')?.(); },
    resize(height) { window.innerHeight = height; handlers.get('resize')?.(); for (const fn of timers.values()) fn(); timers.clear(); },
  };
}

test('foreground is only the wordmark, exact requested description, three entries and accessible pause', () => {
  assert.match(html, /<h1 id="home-title">MM Design Libraries<\/h1>/);
  assert.ok(html.includes('Explore the components behind image, creation and video experiences. Inspect variants, assemble a page, and take the React JSX and Mosaic SDL with you.'));
  assert.equal((html.match(/<a href=/g) || []).length, 3);
  assert.doesNotMatch(html, /<footer|library-entry|intro-context|A closer look/);
  assert.match(html, /class="waterfall" data-motion="static" role="region" aria-label="Explore library components"/);
  assert.doesNotMatch(html, /\binert\b/);
  assert.match(html, /id="motion-toggle"[^>]*hidden/);
});
test('all eighteen previews are native named links to nine real component routes', async () => {
  const links = [...html.matchAll(/<a class="tile [^"]+" href="\.\/(mm-image|aigc|video)\.html#\/c\/([\w-]+)" aria-label="([^"]+)"/g)];
  assert.equal(links.length, 18);
  assert.equal(new Set(links.map(link => `${link[1]}/${link[2]}`)).size, 9);
  for (const [, library, slug, label] of links) {
    const file = library === 'mm-image' ? 'components.ts' : 'component-registry.json';
    const source = await readFile(new URL(`../projects/${library}/site/src/data/${file}`, import.meta.url), 'utf8');
    assert.ok(source.includes(`'${slug}'`) || source.includes(`"${slug}"`), `Unknown ${library} component: ${slug}`);
    assert.ok(label.length > 10);
  }
});
test('mirrors and fillers remain clickable without repeated tab stops or screen-reader links', () => {
  const state = createHome();
  const originals = state.group.children.filter(tile => !tile.attributes.has('data-loop-fill'));
  assert.equal(originals.length, 3);
  for (const original of originals) {
    assert.equal(original.attributes.has('tabindex'), false);
    assert.equal(original.attributes.has('aria-hidden'), false);
  }
  const fillers = state.group.querySelectorAll('[data-loop-fill]');
  const mirrors = state.track.children[1].querySelectorAll('.tile');
  assert.ok(fillers.length && mirrors.length);
  for (const link of [...fillers, ...mirrors]) {
    assert.equal(link.attributes.get('tabindex'), '-1');
    assert.equal(link.attributes.get('href'), './aigc.html#/c/display-image');
    assert.equal(link.attributes.has('inert'), false);
  }
  for (const fill of fillers) assert.equal(fill.attributes.get('aria-hidden'), 'true');
});
test('wide-screen wordmark and fog are capped, while overlays let clicks through', () => {
  assert.match(css, /font-size: clamp\(3\.25rem, 7\.5vw, 5rem\)/);
  assert.match(css, /\.canvas-mist \{[^}]*width: min\(108vw, 1280px\); height: 480px;[^}]*pointer-events: none/);
  assert.match(css, /\.hero \{[^}]*pointer-events: none/);
  assert.doesNotMatch(css, /\.waterfall \{[^}]*pointer-events: none/);
  assert.match(css, /\.flow-column:has\(\.tile:focus-visible\) \.flow-track \{ animation: none !important; transform: none !important/);
});
test('leaving keyboard browsing resets only that column scroll position', () => {
  const state = createHome();
  state.column.scrollTop = 320;
  state.column.events.get('focusout')({ relatedTarget: state.group.children[1] });
  assert.equal(state.column.scrollTop, 320);
  state.column.events.get('focusout')({ relatedTarget: state.toggle });
  assert.equal(state.column.scrollTop, 0);
});
test('no media-query API keeps the background static and native links usable', () => {
  const state = createHome({ mediaSupport: false });
  assert.equal(state.waterfall.dataset.motion, 'static');
  assert.equal(state.toggle.hidden, true);
});
test('a full repeated group covers the viewport and its exact copy makes a seamless loop', () => {
  const state = createHome();
  assert.equal(state.waterfall.dataset.motion, 'running');
  assert.equal(state.track.children.length, 2);
  assert.ok(state.group.getBoundingClientRect().height >= 840);
  assert.equal(state.group.getBoundingClientRect().height, state.track.children[1].getBoundingClientRect().height);
  assert.equal(state.track.children[1].attributes.get('aria-hidden'), 'true');
  assert.equal(state.toggle.attributes.get('aria-label'), 'Pause animation');
});
test('motion has a measured visible linear velocity, not 24px drift or hover-to-pause', () => {
  const state = createHome();
  const distance = parseFloat(state.track.styles.get('--loop-distance'));
  const duration = parseFloat(state.track.styles.get('--loop-duration'));
  assert.equal(distance / duration, 24);
  assert.match(css, /linear infinite/);
  assert.doesNotMatch(css, /masonry:hover|waterfall:hover|flow-column:hover|column-drift/);
  assert.match(css, /animation-direction: reverse/);
});
test('pause and resume change real motion state and accessible icon labels together', () => {
  const state = createHome(); state.click();
  assert.equal(state.waterfall.dataset.motion, 'paused');
  assert.equal(state.toggle.attributes.get('aria-pressed'), 'true');
  assert.equal(state.toggle.attributes.get('aria-label'), 'Resume animation');
  state.click();
  assert.equal(state.waterfall.dataset.motion, 'running');
  assert.equal(state.toggle.attributes.get('aria-label'), 'Pause animation');
});
test('reduced-motion is respected without losing the user pause preference', () => {
  const state = createHome({ reduced: true });
  assert.equal(state.waterfall.dataset.motion, 'static'); assert.equal(state.toggle.hidden, true);
  state.preference(false); state.click(); state.preference(true); state.preference(false);
  assert.equal(state.waterfall.dataset.motion, 'paused');
});
test('resize remeasures groups without accumulating mirrors or fillers', () => {
  const state = createHome(); const initial = state.group.children.length;
  state.resize(1800);
  assert.ok(state.group.getBoundingClientRect().height >= 1920);
  assert.equal(state.track.children.length, 2);
  state.resize(720);
  assert.equal(state.group.children.length, initial);
  assert.equal(state.track.children.length, 2);
});
test('hidden responsive columns wait until visible before building their loops', () => {
  const state = createHome({ hiddenColumn: true });
  assert.equal(state.track.children.length, 1);
  state.column.width = 220; state.resize(720);
  assert.equal(state.track.children.length, 2);
});
test('background visibility pauses independently of explicit pause', () => {
  const state = createHome(); state.visibility(true);
  assert.equal(state.waterfall.classes.has('is-background'), true);
  state.click(); state.visibility(false);
  assert.equal(state.waterfall.classes.has('is-background'), false);
  assert.equal(state.waterfall.dataset.motion, 'paused');
});
test('legacy system hashes still migrate to same-directory library pages', () => {
  for (const id of ['mm-image', 'aigc', 'video']) {
    for (const route of ['', '/', '/playground', '/c/short-card', '//other.example']) {
      const state = createHome({ hash: `#/${id}${route}` });
      assert.deepEqual(state.redirects, [`./${id}.html#${route || '/'}`]);
      assert.equal(new URL(state.redirects[0], 'https://host.test/nested/index.html').origin, 'https://host.test');
    }
  }
});
test('unknown fragments stay on the overview and legacy media listeners work', () => {
  for (const hash of ['', '#/', '#/unknown/', '#/video-evil/', '#https://other.test']) assert.deepEqual(createHome({ hash }).redirects, []);
  const state = createHome({ legacyMediaApi: true }); state.preference(true);
  assert.equal(state.waterfall.dataset.motion, 'static');
});
test('missing optional DOM remains safe', () => {
  for (const missing of ['waterfall', 'toggle']) assert.equal(createHome({ missing }).waterfall.dataset.motion, 'static');
});
