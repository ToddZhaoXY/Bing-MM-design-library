(function () {
  'use strict';
  var startedAt = Date.now();
  var stopped = false;
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
    if (root.children.length) { status.hidden = true; stopped = true; clearInterval(timer); return; }
    if (failure || policy || Date.now() - startedAt > 8000) {
      status.classList.add('library-startup--error');
      status.querySelector('.startup-title').textContent = 'This library did not start';
      document.getElementById('startup-detail').textContent =
        (failure || 'Loading took longer than expected.') + ' App script: ' + expected + '. ' + policy + ' ' + diagnostic;
      status.setAttribute('role', 'alert');
      if (Date.now() - startedAt > 60000) { clearInterval(timer); stopped = true; }
    }
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
  window.addEventListener('pagehide', function () { clearInterval(timer); });
  window.addEventListener('pageshow', function () {
    if (!stopped) { clearInterval(timer); timer = setInterval(check, 250); check(); }
  });
  window.addEventListener('load', check);
  timer = setInterval(check, 250);
  check();
}());
