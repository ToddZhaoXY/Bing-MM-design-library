(function () {
  'use strict';
  var startedAt = Date.now();
  var stopped = false;
  var observer;
  var failure = '';
  var policy = '';
  var diagnostic = '';
  var probed = false;
  var app = document.getElementById('library-app');
  var expected = app ? app.getAttribute('src') : '(unknown app script)';
  var timer;

  function check() {
    if (stopped) return;
    var root = document.getElementById('root');
    var status = document.getElementById('library-startup');
    if (!root || !status) return;
    if (root.children.length) { status.hidden = true; stopped = true; clearInterval(timer); if (observer) observer.disconnect(); return; }
    var elapsed = Date.now() - startedAt;
    var actions = status.querySelector('.startup-actions');
    if (failure || policy) {
      status.classList.add('library-startup--error');
      status.querySelector('.startup-title').textContent = 'This library did not start';
      document.getElementById('startup-detail').textContent =
        (failure || 'A required resource was blocked.') + ' App script: ' + expected + '. ' + policy + ' ' + diagnostic;
      status.setAttribute('role', 'alert');
      if (actions) actions.hidden = false;
    } else if (elapsed > 8000) {
      status.classList.add('library-startup--slow');
      status.querySelector('.startup-title').textContent = 'Still loading…';
      document.getElementById('startup-detail').textContent = 'Loading is taking longer than usual. You can keep waiting or try again.';
      if (actions) actions.hidden = false;
    }
    // Stop polling after a minute, but retain the observer for a late success.
    if (elapsed > 60000) clearInterval(timer);
  }

  function probe() {
    if (probed || !app || typeof window.fetch !== 'function') return;
    probed = true;
    // A same-origin, bounded diagnostic only after failure. No response body,
    // cookies or telemetry are logged or sent to an external service.
    var url = new URL(app.src, location.href);
    if (url.origin !== location.origin) return;
    var controller = new AbortController();
    var timeout = setTimeout(function () { controller.abort(); }, 5000);
    window.fetch(url.href, { credentials: 'same-origin', cache: 'no-store', redirect: 'manual', signal: controller.signal })
      .then(function (response) {
        if (response.type === 'opaqueredirect') diagnostic = 'The script request was redirected; check sign-in or host routing.';
        else {
          var type = response.headers.get('content-type') || '(missing Content-Type)';
          diagnostic = 'Diagnostic response: HTTP ' + response.status + ', ' + type + '.';
          if (/text\/html/i.test(type)) diagnostic += ' HTML was returned instead of JavaScript; check the host rewrite/fallback rules.';
          else if (response.status === 404) diagnostic += ' The app script is missing at this URL. Publish all root files together.';
          else if (response.ok) diagnostic += ' A successful retry does not rule out a browser security policy or stale deployment.';
        }
        if (response.body) response.body.cancel().catch(function () {});
      })
      .catch(function () { diagnostic = 'HTTP details are unavailable (network, CSP or diagnostic timeout). Check the app script link.'; })
      .finally(function () { clearTimeout(timeout); check(); });
  }

  function watchRoot() {
    var root = document.getElementById('root');
    if (!root || typeof MutationObserver !== 'function') return;
    if (!observer) observer = new MutationObserver(check);
    observer.observe(root, { childList: true });
  }

  window.addEventListener('error', function (event) {
    if (stopped) return;
    if (event.target && event.target.tagName === 'SCRIPT') {
      if (event.target !== app) return;
      failure = 'A required JavaScript file could not load.';
      probe();
    } else if (event.target === window) {
      failure = 'The app raised a JavaScript error: ' + (event.message || 'See browser console.');
    } else return;
    check();
  }, true);
  window.addEventListener('securitypolicyviolation', function (event) {
    if (stopped || !/script-src|base-uri/.test(event.effectiveDirective || '')) return;
    policy = 'Blocked by hosting security policy: ' + event.effectiveDirective + '.';
    check();
  });
  document.getElementById('startup-retry').addEventListener('click', function () { location.reload(); });
  window.addEventListener('pagehide', function () { clearInterval(timer); if (observer) observer.disconnect(); });
  window.addEventListener('pageshow', function () {
    if (!stopped) { watchRoot(); clearInterval(timer); timer = setInterval(check, 250); check(); }
  });
  window.addEventListener('load', check);
  watchRoot();
  timer = setInterval(check, 250);
  check();
}());
