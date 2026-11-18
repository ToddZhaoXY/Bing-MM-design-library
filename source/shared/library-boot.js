(function () {
  'use strict';
  var startedAt = Date.now();
  var timer;
  var failure = '';
  var stopped = false;
  var observer;

  function describeFailure(event) {
    var target = event.target;
    if (target && target.tagName === 'SCRIPT') {
      return 'A required JavaScript file could not load. Re-upload the full package and check the host’s script permissions.';
    }
    if (event.type === 'securitypolicyviolation') {
      return 'The hosting security policy blocked a required resource. Check script-src and base-uri for this site.';
    }
    return 'The library could not finish starting. Try again, or check the browser console and the host’s resource paths.';
  }

  function check() {
    if (stopped) return;
    var root = document.getElementById('root');
    var status = document.getElementById('library-startup');
    var detail = document.getElementById('startup-detail');
    if (!root || !status) return;
    // Check rendered DOM, not merely the presence of an empty #root element.
    if (root.children.length > 0) {
      status.hidden = true;
      stopped = true;
      clearInterval(timer);
      if (observer) observer.disconnect();
      return;
    }
    var elapsed = Date.now() - startedAt;
    var actions = status.querySelector('.startup-actions');
    if (failure) {
      status.classList.add('library-startup--error');
      status.querySelector('.startup-title').textContent = 'This library did not start';
      detail.textContent = failure;
      status.setAttribute('role', 'alert');
      if (actions) actions.hidden = false;
    } else if (elapsed > 8000) {
      status.classList.add('library-startup--slow');
      status.querySelector('.startup-title').textContent = 'Still loading…';
      detail.textContent = 'Loading is taking longer than usual. You can keep waiting or try again.';
      if (actions) actions.hidden = false;
    }
    if (elapsed > 60000) clearInterval(timer);
  }

  function watchRoot() {
    var root = document.getElementById('root');
    if (!root || typeof MutationObserver !== 'function') return;
    if (!observer) observer = new MutationObserver(check);
    observer.observe(root, { childList: true });
  }

  window.addEventListener('error', function (event) {
    if (!stopped) { failure = describeFailure(event); check(); }
  }, true);
  window.addEventListener('securitypolicyviolation', function (event) {
    if (!stopped && /script-src|base-uri/.test(event.effectiveDirective || '')) { failure = describeFailure(event); check(); }
  });
  document.getElementById('startup-retry').addEventListener('click', function () { location.reload(); });
  window.addEventListener('pagehide', function () { clearInterval(timer); if (observer) observer.disconnect(); });
  window.addEventListener('load', check);
  window.addEventListener('pageshow', function () {
    if (stopped) return;
    watchRoot();
    clearInterval(timer);
    timer = setInterval(check, 250);
    check();
  });
  watchRoot();
  timer = setInterval(check, 250);
  check();
}());
