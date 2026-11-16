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
    expanded = !document.body.classList.contains('feature-nav-expanded');
    apply(expanded);
    try { localStorage.setItem(key, String(expanded)); } catch (_) {}
  });
}());
