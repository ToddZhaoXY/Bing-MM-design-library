import { createRequire } from 'node:module';
import { root } from './lib.mjs';
import { join } from 'node:path';
import { Script } from 'node:vm';

const labels = { 'mm-image': 'MM Image', aigc: 'AIGC', video: 'Video' };
const require = createRequire(join(root, 'projects/aigc/site/package.json'));

export async function classicBundle(source) {
  const { transform } = require('esbuild');
  const result = await transform(source, { format: 'iife', target: 'es2020', minify: true, legalComments: 'inline' });
  // React Router includes optional dynamic-import branches even when every
  // registered route is eagerly bundled. Classic scripts may contain import();
  // validate actual script syntax instead of rejecting that dormant code.
  new Script(result.code);
  return result.code;
}

export function makeLibraryPage(original, id, { alias = false } = {}) {
  if (!Object.hasOwn(labels, id)) throw new Error(`Unknown library ${id}`);
  let scripts = 0;
  let html = original.replace(/<script\b[^>]*\bsrc="([^"]+\.js)"[^>]*><\/script>/g, (_tag, src) => {
    scripts++;
    return `<script defer src="${src.replace(/\.js$/, '-classic.js')}"></script>`;
  });
  html = html.replace(/\s+crossorigin(?:="[^"]*")?/g, '');
  if (scripts !== 1 || !html.includes('<body>')) throw new Error('Unexpected Vite entry HTML');
  const links = Object.entries(labels).map(([key, label]) => `<a class="library-switch${id === key ? ' is-current' : ''}" href="../../${key}.html#/"${id === key ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  // Place the base before every relative resource. Each alias can sit at the
  // hosting root while all source images and export helpers retain their base.
  const base = `<base href="${alias ? `./systems/${id}/` : './'}">`;
  html = html.replace('<head>', `<head>\n    ${base}\n    <script defer src="../../library-boot.js"></script>`);
  html = html.replace('</head>', '    <link rel="stylesheet" href="../../theme/index.css">\n    <link rel="stylesheet" href="../../library-nav.css">\n  </head>');
  const chrome = `<header class="library-header"><a class="library-home" href="../../index.html" aria-label="Back to all libraries"><span aria-hidden="true">←</span> All libraries</a><nav class="library-switches" aria-label="Design libraries">${links}</nav></header>`;
  const status = `<aside id="library-startup" class="library-startup" role="status" aria-live="polite"><p class="startup-title">Opening ${labels[id]}</p><p id="startup-detail">The library is starting. If this message remains, check that the complete deployment package was uploaded.</p><div class="startup-actions"><button id="startup-retry" type="button">Try again</button><a href="../../index.html">Back to all libraries</a><a href="./index.html#/">Open alternate entry</a></div><noscript>This React library requires JavaScript. The overview and navigation links remain available.</noscript></aside>`;
  return html.replace('<body>', `<body data-hub-system="${id}">\n${chrome}\n${status}`);
}

export function entryScript(html) {
  const matches = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+\.js)"[^>]*><\/script>/g)];
  if (matches.length !== 1 || !/^\.\/assets\/[\w.-]+\.js$/.test(matches[0][1])) throw new Error('Unexpected bundle path');
  return matches[0][1];
}
