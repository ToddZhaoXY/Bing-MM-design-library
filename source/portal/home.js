(function () {
  'use strict';
  var legacy = /^#\/(mm-image|aigc|video)(\/.*)?$/.exec(window.location.hash);
  if (legacy) {
    window.location.replace('./' + legacy[1] + '.html#' + (legacy[2] || '/'));
    return;
  }

  var waterfall = document.querySelector('.waterfall');
  var toggle = document.getElementById('motion-toggle');
  if (!waterfall || !toggle || typeof window.matchMedia !== 'function') return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var pausedByUser = false;
  var resizeTimer;
  var columns = Array.prototype.slice.call(waterfall.querySelectorAll('.flow-column'));
  columns.forEach(function (column) {
    column.addEventListener('focusout', function (event) {
      // Keyboard browsing can scroll a static column; restore the seamless
      // animation viewport when focus moves back to navigation/another column.
      if (!column.contains(event.relatedTarget)) column.scrollTop = 0;
    });
  });

  function updateMotion() {
    waterfall.dataset.motion = reduced.matches ? 'static' : pausedByUser ? 'paused' : 'running';
    waterfall.classList.toggle('is-background', document.hidden);
    toggle.hidden = reduced.matches;
    toggle.setAttribute('aria-pressed', String(pausedByUser));
    var label = pausedByUser ? 'Resume animation' : 'Pause animation';
    toggle.setAttribute('aria-label', label);
    toggle.setAttribute('title', label);
  }

  function buildLoops() {
    columns.forEach(function (column) {
      var track = column.querySelector('.flow-track');
      var group = track && track.querySelector('.flow-group');
      if (!group || column.getBoundingClientRect().width === 0) return;
      Array.prototype.slice.call(track.querySelectorAll('[data-loop-copy]')).forEach(function (copy) { copy.remove(); });
      Array.prototype.slice.call(group.querySelectorAll('[data-loop-fill]')).forEach(function (fill) { fill.remove(); });
      var originals = Array.prototype.slice.call(group.children);
      // Fixed image aspect ratios make this measurement independent of image
      // download timing. Ensure one full cycle covers even a tall viewport.
      for (var pass = 0; group.getBoundingClientRect().height < window.innerHeight + 120 && pass < 5; pass++) {
        originals.forEach(function (original) {
          var fill = original.cloneNode(true);
          fill.setAttribute('data-loop-fill', '');
          // Repeated cards retain native pointer/modifier-click navigation,
          // without duplicating the keyboard or screen-reader traversal.
          fill.setAttribute('aria-hidden', 'true');
          fill.setAttribute('tabindex', '-1');
          group.appendChild(fill);
        });
      }
      var height = group.getBoundingClientRect().height;
      var speed = Math.max(16, Math.min(32, Number(column.dataset.speed) || 24));
      var duration = height / speed;
      track.style.setProperty('--loop-distance', height + 'px');
      track.style.setProperty('--loop-duration', duration + 's');
      track.style.setProperty('--loop-delay', -(duration * (Number(column.dataset.phase) || 0)) + 's');
      var copy = group.cloneNode(true);
      copy.setAttribute('data-loop-copy', '');
      copy.setAttribute('aria-hidden', 'true');
      Array.prototype.slice.call(copy.querySelectorAll('.tile')).forEach(function (tile) {
        tile.setAttribute('tabindex', '-1');
      });
      track.appendChild(copy);
    });
    updateMotion();
  }

  toggle.addEventListener('click', function () { pausedByUser = !pausedByUser; updateMotion(); });
  document.addEventListener('visibilitychange', updateMotion);
  window.addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(buildLoops, 120); });
  window.addEventListener('pagehide', function () { clearTimeout(resizeTimer); });
  if (typeof reduced.addEventListener === 'function') reduced.addEventListener('change', updateMotion);
  else if (typeof reduced.addListener === 'function') reduced.addListener(updateMotion);
  buildLoops();
}());
