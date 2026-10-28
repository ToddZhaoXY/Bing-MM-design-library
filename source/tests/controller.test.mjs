import { test } from 'node:test';
import assert from 'node:assert/strict';

test('controller mounts lazily, preserves frames and synchronizes tab/child/history navigation', async () => {
  const { systems } = await import('../shell/routing.mjs');
  const elements = new Map();
  let focused;
  class Element extends EventTarget {
    constructor() {
      super();
      this.dataset = {};
      this.attributes = new Map();
      this.children = [];
    }
    setAttribute(name, value) { this.attributes.set(name, value); }
    getAttribute(name) { return this.attributes.get(name); }
    append(...children) { this.children.push(...children); }
    focus() { focused = this; }
  }
  const tabs = systems.map(({ id }) => {
    const tab = new Element();
    tab.dataset.system = id;
    tab.setAttribute('aria-controls', `panel-${id}`);
    elements.set(`panel-${id}`, new Element());
    return tab;
  });
  const documentMock = {
    title: '',
    querySelectorAll: () => tabs,
    getElementById: id => elements.get(id),
    createElement(tag) {
      const element = new Element();
      if (tag === 'iframe') {
        const child = new EventTarget();
        child.document = { getElementById: () => ({ id: 'root' }) };
        let url = new URL('about:blank');
        child.location = {
          get href() { return url.href; },
          get hash() { return url.hash; },
          replace(value) {
            url = new URL(value);
            child.dispatchEvent(new Event('hashchange'));
          },
        };
        child.history = {
          pushState(_state, _title, hash) { url.hash = hash; },
          replaceState(_state, _title, hash) { url.hash = hash; },
        };
        element.contentWindow = child;
        Object.defineProperty(element, 'src', {
          get: () => url.href,
          set(value) { url = new URL(value); },
        });
      }
      return element;
    },
  };
  const locationMock = new URL('http://127.0.0.1:5190/nested/');
  const historyEntries = [];
  const historyMock = {
    replaceState(_state, _title, hash) { locationMock.hash = hash; },
    pushState(_state, _title, hash) { historyEntries.push(hash); locationMock.hash = hash; },
  };
  const windowMock = new EventTarget();
  const originals = Object.fromEntries(['document', 'location', 'history', 'window'].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  const replacement = { document: documentMock, location: locationMock, history: historyMock, window: windowMock };
  for (const [key, value] of Object.entries(replacement)) Object.defineProperty(globalThis, key, { configurable: true, value });
  try {
    await import('../shell/app.mjs');
    const frames = id => elements.get(`panel-${id}`).children.filter(child => child.contentWindow);
    const imageFrame = frames('mm-image')[0];
    assert.equal(imageFrame.src, 'http://127.0.0.1:5190/nested/systems/mm-image/index.html#/');
    assert.equal(frames('aigc').length, 0);
    assert.equal(frames('video').length, 0);
    imageFrame.dispatchEvent(new Event('load'));
    imageFrame.contentWindow.history.pushState({}, '', '#/playground');
    assert.equal(locationMock.hash, '#/mm-image/playground');

    tabs[1].dispatchEvent(new Event('click'));
    const aigcFrame = frames('aigc')[0];
    aigcFrame.dispatchEvent(new Event('load'));
    assert.equal(elements.get('panel-mm-image').hidden, true);
    assert.equal(elements.get('panel-mm-image').inert, true);
    assert.equal(elements.get('panel-aigc').hidden, false);
    assert.equal(tabs[1].getAttribute('aria-selected'), 'true');
    tabs[0].dispatchEvent(new Event('click'));
    assert.equal(frames('mm-image')[0], imageFrame);
    assert.equal(frames('mm-image').length, 1);
    assert.equal(locationMock.hash, '#/mm-image/playground');
    assert.equal(documentMock.title, 'MM Image · Design Systems');

    const keyboard = new Event('keydown', { cancelable: true });
    Object.defineProperty(keyboard, 'key', { value: 'End' });
    tabs[0].dispatchEvent(keyboard);
    assert.equal(keyboard.defaultPrevented, true);
    assert.equal(focused, tabs[2]);
    const videoFrame = frames('video')[0];
    videoFrame.dispatchEvent(new Event('load'));
    assert.equal(locationMock.hash, '#/video/');

    locationMock.hash = '#/aigc/c/example';
    windowMock.dispatchEvent(new Event('popstate'));
    assert.equal(tabs[1].getAttribute('aria-selected'), 'true');
    assert.equal(aigcFrame.contentWindow.location.hash, '#/c/example');
    assert.equal(frames('aigc')[0], aigcFrame);
    assert.deepEqual(historyEntries, ['#/aigc/', '#/mm-image/playground', '#/video/']);
    assert.equal(tabs.filter(tab => tab.tabIndex === 0).length, 1);
  } finally {
    for (const [key, descriptor] of Object.entries(originals)) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  }
});
