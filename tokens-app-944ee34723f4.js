(function () {
  'use strict';
  var pages = Array.from(document.querySelectorAll('[data-token-page]'));
  var links = Array.from(document.querySelectorAll('[data-token-link]'));
  var toast = document.querySelector('.token-toast');
  var toastTimer;
  function notify(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    toastTimer = setTimeout(function () { toast.hidden = true; }, 3500);
  }
  function showPage(focus) {
    var id = location.hash.replace(/^#\/?/, '') || 'introduction';
    // The skip link is a native focus destination, not a document route.
    if (id === 'tokens-content') return;
    var selected = pages.find(function (page) { return page.dataset.tokenPage === id; });
    if (!selected) selected = pages.find(function (page) { return page.dataset.tokenPage === 'not-found'; });
    pages.forEach(function (page) { page.hidden = page !== selected; });
    links.forEach(function (link) {
      var active = link.dataset.tokenLink === selected.dataset.tokenPage;
      link.parentElement.classList.toggle('nav__row--active', active);
      if (active) {
        link.setAttribute('aria-current', 'page');
        var list = link.closest('.nav__list');
        list.hidden = false;
        list.previousElementSibling.setAttribute('aria-expanded', 'true');
      } else link.removeAttribute('aria-current');
    });
    var title = selected.querySelector('h1').textContent;
    document.title = (title === 'Tokens' ? title : title + ' — Tokens') + ' — AIXA Bing Design Library';
    if (focus) {
      window.scrollTo(0, 0);
      selected.querySelector('h1').focus({ preventScroll: true });
    }
  }
  document.querySelectorAll('[data-nav-group]').forEach(function (button) {
    button.addEventListener('click', function () {
      var expanded = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(expanded));
      document.getElementById(button.getAttribute('aria-controls')).hidden = !expanded;
    });
  });
  window.addEventListener('hashchange', function () { showPage(true); });
  showPage(false);
  document.querySelectorAll('[data-token-search]').forEach(function (input) {
    var section = input.closest('.token-catalog-section');
    var rows = Array.from(section.querySelectorAll('[data-token-row]'));
    var terms = rows.map(function (row) { return row.textContent.toLowerCase(); });
    var count = section.querySelector('.token-results');
    var clear = section.querySelector('.token-search-clear');
    function filter() {
      var query = input.value.toLowerCase().trim();
      var visible = 0;
      rows.forEach(function (row, i) { row.hidden = !terms[i].includes(query); if (!row.hidden) visible++; });
      count.textContent = query ? visible + ' of ' + rows.length + ' tokens' : rows.length + ' tokens';
      clear.hidden = !input.value;
      section.querySelector('.token-empty').hidden = visible > 0;
      section.querySelector('.table-scroll').hidden = visible === 0;
    }
    input.addEventListener('input', filter);
    section.querySelectorAll('.token-search-clear, [data-clear-search]').forEach(function (button) {
      button.addEventListener('click', function () { input.value = ''; filter(); input.focus(); });
    });
  });
  document.querySelectorAll('[data-copy]').forEach(function (button) {
    button.addEventListener('click', async function () {
      try {
        if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(button.dataset.copy);
        notify('Token name copied');
      } catch (_) {
        var range = document.createRange(); range.selectNodeContents(button.querySelector('code'));
        var selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
        notify('Token selected. Use your keyboard’s Copy command.');
      }
    });
  });
  document.querySelectorAll('[data-example]').forEach(function (button) {
    button.addEventListener('click', function () {
      document.querySelectorAll('[data-example]').forEach(function (item) { item.setAttribute('aria-pressed', String(item === button)); });
      document.querySelectorAll('[data-example-panel]').forEach(function (item) { item.hidden = item.dataset.examplePanel !== button.dataset.example; });
    });
  });
  document.querySelectorAll('.token-motion').forEach(function (button) {
    var timer;
    button.addEventListener('click', function () {
      clearTimeout(timer);
      button.classList.remove('is-playing');
      void button.offsetWidth;
      button.classList.add('is-playing');
      timer = setTimeout(function () { button.classList.remove('is-playing'); }, parseFloat(button.style.getPropertyValue('--duration')) + 500);
    });
  });
}());
