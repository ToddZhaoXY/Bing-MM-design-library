(function () {
  'use strict';
  var rail = document.querySelector('body > .feature-nav');
  if (!rail) return;
  var button = rail.querySelector('.feature-nav-toggle');
  var key = 'aixa-library-navigation-expanded';
  function apply(expanded) {
    document.body.classList.toggle('feature-nav-expanded', expanded);
    button.setAttribute('aria-expanded', String(expanded));
    button.setAttribute('aria-label', expanded ? 'Collapse library navigation' : 'Expand library navigation');
    button.querySelector('.feature-nav-tooltip').textContent = expanded ? 'Collapse navigation' : 'Expand navigation';
  }
  var expanded = true;
  try { expanded = localStorage.getItem(key) !== 'false'; } catch (_) {}
  apply(expanded);
  button.addEventListener('click', function () {
    // Restore saved width instantly on load; animate only deliberate toggles.
    document.body.classList.toggle('feature-nav-animated', true);
    expanded = !document.body.classList.contains('feature-nav-expanded');
    apply(expanded);
    try { localStorage.setItem(key, String(expanded)); } catch (_) {}
  });
}());

// Warm only an explicitly targeted library. Never prefetch every library at once.
(function () {
  'use strict';
  if (typeof window === 'undefined' || typeof window.fetch !== 'function' || typeof document.addEventListener !== 'function') return;
  var connection = navigator.connection;
  if (connection && (connection.saveData || /(^|-)2g$/.test(connection.effectiveType || ''))) return;
  var requested = new Set();
  var hinted = new Set();
  var timer;
  var controllers = new Set();
  function linkFor(target) {
    var link = target && target.closest ? target.closest('.feature-nav a, .header-links a') : null;
    if (!link || link.hasAttribute('aria-current')) return null;
    var url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !/\/(tokens|mm-image|aigc|video|algo)\.html$/.test(url.pathname) || url.pathname === location.pathname) return null;
    url.hash = '';
    return url;
  }
  function warm(url) {
    var startup = document.getElementById('library-startup');
    if (document.visibilityState === 'hidden' || (startup && !startup.hidden) || document.querySelector('.aixa-route-loading') || requested.has(url.href) || requested.size >= 2) return;
    requested.add(url.href);
    var controller = new AbortController();
    controllers.add(controller);
    var abort = setTimeout(function () { controller.abort(); }, 5000);
    fetch(url.href, { credentials: 'same-origin', cache: 'force-cache', signal: controller.signal }).then(function (response) {
      if (!response.ok || response.url && new URL(response.url).origin !== location.origin || !/text\/html/.test(response.headers.get('content-type') || '')) throw new Error('Unusable prefetch');
      return response.text();
    }).then(function (html) {
      var parsed = new DOMParser().parseFromString(html, 'text/html');
      var declared = parsed.querySelector('base[href]');
      var resourceBase = declared ? new URL(declared.getAttribute('href'), url) : url;
      if (resourceBase.origin !== location.origin) return;
      var loaded = new Set(performance.getEntriesByType('resource').map(function (entry) { return entry.name; }));
      Array.from(parsed.querySelectorAll('script[src], link[rel="stylesheet"][href]')).slice(0, 8).forEach(function (element) {
        var resource = new URL(element.getAttribute('src') || element.getAttribute('href'), resourceBase);
        if (resource.origin !== location.origin || !/\.(js|css)$/.test(resource.pathname) || loaded.has(resource.href) || hinted.has(resource.href)) return;
        hinted.add(resource.href);
        var hint = document.createElement('link');
        hint.rel = 'prefetch'; hint.as = element.tagName === 'SCRIPT' ? 'script' : 'style'; hint.href = resource.href;
        document.head.appendChild(hint);
      });
    }).catch(function () { /* Prefetch is optional; normal links always remain usable. */ }).finally(function () { clearTimeout(abort); controllers.delete(controller); });
  }
  function schedule(event) {
    clearTimeout(timer);
    var url = linkFor(event.target);
    if (url) timer = setTimeout(function () { warm(url); }, event.type === 'focusin' ? 0 : 160);
  }
  document.addEventListener('pointerover', schedule);
  document.addEventListener('focusin', schedule);
  document.addEventListener('pointerout', function (event) { if (!event.relatedTarget || !event.target.closest('a')?.contains(event.relatedTarget)) clearTimeout(timer); });
  window.addEventListener('pagehide', function () { clearTimeout(timer); controllers.forEach(function (controller) { controller.abort(); }); });
}());
