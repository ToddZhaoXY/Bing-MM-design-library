import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { root, filesIn } from './lib.mjs';
import { libraryRail } from './library-chrome.mjs';

export const algoRoot = join(root, 'projects/algo/site');
export const algoName = file => file === 'index.html' ? 'algo.html' : `algo-${file.replaceAll('/', '-')}`;
const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Preserve the upstream tree verbatim. Adapt only its integration boundaries at
// build time: URLs, the brand destination and the shared cross-library rail.
export function rewriteAlgoText(source, files) {
  let text = source;
  const names = files.filter(file => !file.includes('/'));
  const pattern = new RegExp(`(?<![\\w./:-])(?:\\./)?(${names.map(escapeRegex).join('|')})(?=[?#"'\x60\\s<>)]|$)`, 'g');
  text = text.replace(pattern, (_match, file) => algoName(file));
  text = text.replace(/(?<![\w:/.-])(?:\.\/)?public\/[\w./-]*/g, path => algoName(path.replace(/^\.\//, '')));
  // The upstream mobile helper interpolates a directory, then a file name.
  text = text.replace("${richMobileAssetNames.has(name)?'mobile-rich':'rich'}/${name}", "${richMobileAssetNames.has(name)?'mobile-rich':'rich'}-${name}");
  return text;
}

export async function emitAlgoLibrary(emit, { nav = 'library-nav.css', switcher = 'library-switcher.js' } = {}) {
  const files = await filesIn(algoRoot);
  const pages = [];
  for (const file of files) {
    let content = await readFile(join(algoRoot, file));
    if (/\.(html|css|js)$/.test(file)) {
      let text = content.toString();
      if (file === 'library-navigation.js') {
        const start = text.indexOf('  const featureNav=document.createElement');
        const end = text.indexOf("  const heading=document.createElement('p');", start);
        if (start < 0 || end < 0) throw new Error('Algo V8 navigation integration boundary changed');
        text = text.slice(0, start) + `  const header=document.querySelector('.topbar');
  const updateHeader=()=>header.classList.toggle('is-scrolled',window.scrollY>24);
  window.addEventListener('scroll',updateHeader,{passive:true});updateHeader();
  document.querySelector('.page-nav')?.setAttribute('hidden','');
` + text.slice(end);
      }
      text = rewriteAlgoText(text, files);
      if (file.endsWith('.html')) {
        pages.push(algoName(file));
        if (text.includes('class="topbar"')) {
          text = text.replace(/<body([^>]*)>/, '<body$1 class="feature-nav-expanded" data-library="algo">\n' + libraryRail('algo'));
          text = text.replace('</head>', `  <link rel="stylesheet" href="./${nav}">\n  <script defer src="./${switcher}"></script>\n</head>`);
          text = text.replace(/(<a class="brand" href=")[^"]+/, '$1./index.html');
        }
      }
      content = text;
    }
    await emit(algoName(file), content);
  }
  return { html: 'algo.html', pages, upstream: '5c18515471dc3b0fc941ed8d7cf6e86d785378a8' };
}
