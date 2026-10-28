(function () {
  'use strict';
  var startedAt = Date.now();
  var timer;
  var failure = '';
  var stopped = false;

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
      return;
    }
    if (failure || Date.now() - startedAt > 8000) {
      status.classList.add('library-startup--error');
      status.querySelector('.startup-title').textContent = 'This library did not start';
      detail.textContent = failure || 'Loading took longer than expected. Check that all files were uploaded, or try the alternate entry below.';
      status.setAttribute('role', 'alert');
      // A slow successful render can still dismiss the notice. Poll at a low
      // rate for at most one minute; never hide usable content behind a layer.
      if (Date.now() - startedAt > 60000) { clearInterval(timer); stopped = true; }
    }
  }

  window.addEventListener('error', function (event) {
    if (!stopped) { failure = describeFailure(event); check(); }
  }, true);
  window.addEventListener('securitypolicyviolation', function (event) {
    if (!stopped && /script-src|base-uri/.test(event.effectiveDirective || '')) { failure = describeFailure(event); check(); }
  });
  document.getElementById('startup-retry').addEventListener('click', function () { location.reload(); });
  window.addEventListener('pagehide', function () { clearInterval(timer); });
  window.addEventListener('load', check);
  window.addEventListener('pageshow', function () {
    if (stopped) return;
    clearInterval(timer);
    timer = setInterval(check, 250);
    check();
  });
  timer = setInterval(check, 250);
  check();
}());
