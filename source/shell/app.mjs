import { systems, parseRoute, formatRoute, normalizeChildRoute, nextTabIndex } from './routing.mjs';

const tabs = [...document.querySelectorAll('[role="tab"]')];
const mounted = new Map();
let activeId;

function updateAddress(id, route, method = 'replaceState') {
  const hash = formatRoute(id, route);
  if (location.hash !== hash) history[method](null, '', hash);
}

function mount(system, route) {
  const panel = document.getElementById(`panel-${system.id}`);
  const frame = document.createElement('iframe');
  frame.className = 'system-frame';
  frame.title = `${system.label} component library`;
  frame.dataset.system = system.id;
  // These are trusted, unchanged local applications. Sandboxing would break
  // their native file exports, clipboard, storage and independent routing.
  frame.allow = 'clipboard-write; fullscreen';
  const source = new URL(`./systems/${system.id}/index.html`, location.href);
  source.hash = route;

  const status = document.createElement('div');
  status.className = 'loading-status';
  status.setAttribute('role', 'status');
  const message = document.createElement('p');
  message.textContent = `Loading ${system.label}…`;
  const fallback = document.createElement('a');
  fallback.href = source.href;
  fallback.textContent = `Open ${system.label} directly`;
  status.append(message, fallback);

  const entry = { frame, route, ready: false };
  mounted.set(system.id, entry);
  const syncRoute = () => {
    entry.route = normalizeChildRoute(frame.contentWindow.location.hash);
    if (activeId === system.id) updateAddress(system.id, entry.route);
  };
  frame.addEventListener('load', () => {
    // Keep child documents isolated; never inject or rewrite their components.
    const child = frame.contentWindow;
    if (!child.document.getElementById('root')) {
      message.textContent = `${system.label} could not load. Check that all deployment files were uploaded.`;
      return;
    }
    entry.ready = true;
    status.hidden = true;
    // React Router writes hash routes with history.pushState/replaceState,
    // which do not emit a native hashchange event. Bridge only that browser
    // API; the applications' React trees, styles and source files stay intact.
    for (const method of ['pushState', 'replaceState']) {
      const original = child.history[method];
      child.history[method] = function (...args) {
        const result = original.apply(this, args);
        syncRoute();
        return result;
      };
    }
    child.addEventListener('hashchange', syncRoute);
    child.addEventListener('popstate', syncRoute);
    syncRoute();
  });
  frame.addEventListener('error', () => {
    message.textContent = `${system.label} could not load. Try opening it directly.`;
  });
  frame.src = source.href;
  panel.append(frame, status);
  return entry;
}

function activate(id, route, push = false) {
  const system = systems.find(item => item.id === id);
  activeId = id;
  let entry = mounted.get(id);
  const targetRoute = normalizeChildRoute(route ?? entry?.route ?? '/');
  if (!entry) entry = mount(system, targetRoute);
  // Do not unmount inactive applications: their canvas, inspector and scroll
  // position belong to the user and must survive a system switch.
  for (const tab of tabs) {
    const selected = tab.dataset.system === id;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    panel.hidden = !selected;
    panel.inert = !selected;
  }
  document.title = `${system.label} · Design Systems`;
  updateAddress(id, targetRoute, push ? 'pushState' : 'replaceState');
  if (entry.route !== targetRoute) {
    entry.route = targetRoute;
    if (entry.ready) {
      const url = new URL(entry.frame.contentWindow.location.href);
      url.hash = targetRoute;
      entry.frame.contentWindow.location.replace(url.href);
    } else {
      const url = new URL(entry.frame.src);
      url.hash = targetRoute;
      entry.frame.src = url.href;
    }
  }
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activate(tab.dataset.system, undefined, true));
  tab.addEventListener('keydown', event => {
    const next = nextTabIndex(index, event.key);
    if (next === null) return;
    event.preventDefault();
    tabs[next].focus();
    activate(tabs[next].dataset.system, undefined, true);
  });
});

function restoreFromAddress() {
  const { id, route } = parseRoute(location.hash);
  activate(id, route);
}
window.addEventListener('popstate', restoreFromAddress);
window.addEventListener('hashchange', restoreFromAddress);
restoreFromAddress();
