(function () {
  'use strict';
  document.querySelectorAll('[data-algo-nav]').forEach(function (nav, index) {
    // The drawer is a second view of the same menu: keep its IDs independent.
    if (index) {
      nav.querySelectorAll('[id]').forEach(function (element) { element.id += '-drawer'; });
      nav.querySelectorAll('[aria-controls]').forEach(function (element) { element.setAttribute('aria-controls', element.getAttribute('aria-controls') + '-drawer'); });
    }
    nav.addEventListener('click', function (event) {
      var button = event.target.closest('button[data-algo-disclosure]');
      if (!button || !nav.contains(button)) return;
      var id = button.getAttribute('aria-controls');
      var target = nav.querySelector('[id="' + id + '"]');
      if (!target) return;
      var expanded = button.getAttribute('aria-expanded') !== 'true';
      target.hidden = !expanded;
      nav.querySelectorAll('[aria-controls="' + id + '"]').forEach(function (control) {
        control.setAttribute('aria-expanded', String(expanded));
        var label = control.getAttribute('data-label');
        if (label) control.setAttribute('aria-label', (expanded ? 'Collapse ' : 'Expand ') + label);
      });

    });
  });
  requestAnimationFrame(function () {
    var nav = document.querySelector('.side-nav.nav');
    var current = nav && nav.querySelector('[aria-current="page"]');
    if (!current || !current.getClientRects().length) return;
    var outer = nav.getBoundingClientRect(), inner = current.getBoundingClientRect();
    if (inner.bottom > outer.bottom - 12) nav.scrollTop += inner.bottom - outer.bottom + 12;
  });
}());
