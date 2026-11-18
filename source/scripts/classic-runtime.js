// Build-time template. Deferred code uses ordinary same-origin scripts; no eval,
// module entry, iframe, inline HTML script, or server routing is required.
(function (global) {
  'use strict';
  var scope = __SCOPE__;
  var graph = __GRAPH__;
  var base = new URL('.', document.currentScript.src);
  var factories = Object.create(null);
  var modules = Object.create(null);
  var pending = Object.create(null);
  function resolve(name) { return name.replace(/^\.\//, ''); }
  function define(name, factory) { factories[name] = factory; }
  function requireModule(specifier) {
    var name = resolve(specifier);
    if (modules[name]) return modules[name].exports;
    if (!factories[name]) throw new Error('View dependency is not ready: ' + name);
    var module = { exports: {} }; modules[name] = module;
    try { factories[name](module, module.exports, requireModule, importModule); }
    catch (error) { delete modules[name]; throw error; }
    return module.exports;
  }
  function load(name) {
    if (factories[name]) return Promise.resolve();
    if (pending[name]) return pending[name];
    var record = graph[name];
    if (!record || !record.file) return Promise.reject(new Error('Unknown view resource: ' + name));
    pending[name] = new Promise(function (resolvePromise, reject) {
      var script = document.createElement('script');
      var timer = setTimeout(function () { finish(new Error('Loading this view took too long.')); }, 20000);
      function finish(error) {
        clearTimeout(timer); script.onload = script.onerror = null;
        if (error) { delete pending[name]; script.remove(); reject(error); }
        else resolvePromise();
      }
      script.src = new URL(record.file, base).href;
      script.async = true;
      script.onload = function () { finish(factories[name] ? null : new Error('The requested view could not be opened.')); };
      script.onerror = function () { finish(new Error('A view resource could not load.')); };
      document.head.appendChild(script);
    });
    return pending[name];
  }
  function importModule(specifier) {
    var name = resolve(specifier);
    var needed = new Set();
    function visit(id) {
      if (needed.has(id)) return;
      if (!graph[id]) throw new Error('Unknown view dependency: ' + id);
      needed.add(id); graph[id].dependencies.forEach(visit);
    }
    try { visit(name); } catch (error) { return Promise.reject(error); }
    // Fetch the whole missing dependency graph concurrently, not one round trip per edge.
    return Promise.all(Array.from(needed, load)).then(function () { return requireModule(name); });
  }
  global.__AIXA_CHUNKS__ = global.__AIXA_CHUNKS__ || Object.create(null);
  global.__AIXA_CHUNKS__[scope] = { define: define };
  __INITIAL__
  requireModule(__ENTRY__);
}(window));
