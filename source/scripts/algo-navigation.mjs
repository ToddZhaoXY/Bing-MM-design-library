import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { root } from './lib.mjs';
import { compileThemeCss, readThemeTokens } from './theme.mjs';

const escape = text => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const chevron = '<span class="nav__chevron" aria-hidden="true"></span>';
const links = fragment => [...fragment.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g)].map(([,href,label])=>({href,label}));

// Adapt the upstream link hierarchy to the same semantic classes as LibraryNav.
// This stays static HTML: Algo does not need a React runtime just for navigation.
export function normalizeAlgoNavigation(html, currentFile) {
  return html.replace(/<aside class="side-nav"[^>]*>([\s\S]*?)<\/aside>/, (_match, original) => {
    const overview = links(original.match(/<section\b[^>]*>[\s\S]*?<\/section>/)?.[0] || '');
    const cells = links(original.match(/<details class="doc-nav-section cells-nav"[^>]*>([\s\S]*?)<\/details>/)?.[1] || '');
    const branches = ['mainline','sectional'].map(id => ({ id, label: id === 'mainline' ? 'Mainline' : 'Sectional', items: links(original.match(new RegExp(`<div class="nav-group" data-cell-panel="${id}"[^>]*>([\\s\\S]*?)<\\/div>`))?.[1] || '') }));
    if (!overview.length || !cells.length || branches.some(branch => !branch.items.length)) throw new Error(`Unknown Algo navigation structure: ${currentFile}`);
    function item({href,label}, child=false) {
      const active=href.split(/[?#]/)[0]===currentFile;
      return `<li class="nav__node${child?' nav__node--child':''}"><div class="nav__row${active?' nav__row--active':''}"><a class="nav__item${active?' nav__item--active active':''}" href="${escape(href)}"${active?' aria-current="page"':''}>${label}</a></div></li>`;
    }
    function group(id,label,content) {
      return `<div class="nav__group"><button type="button" class="nav__group-title nav__section-toggle" data-algo-disclosure data-label="${label}" aria-label="Collapse ${label}" aria-expanded="true" aria-controls="algo-group-${id}"><span>${label}</span>${chevron}</button><ul id="algo-group-${id}" class="nav__list">${content}</ul></div>`;
    }
    const organisms=branches.map(branch=>{
      const active=branch.items.some(link=>link.href.split(/[?#]/)[0]===currentFile);
      return `<li class="nav__node nav__node--parent${active?' nav__node--ancestor':''}"><div class="nav__row"><button type="button" class="nav__item nav__folder" data-algo-disclosure data-label="${branch.label}" aria-expanded="${active}" aria-controls="algo-children-${branch.id}">${branch.label}</button><button type="button" class="nav__branch-toggle" data-algo-disclosure data-label="${branch.label}" aria-label="${active?'Collapse':'Expand'} ${branch.label}" aria-expanded="${active}" aria-controls="algo-children-${branch.id}">${chevron}</button></div><ul id="algo-children-${branch.id}" class="nav__children"${active?'':' hidden'}>${branch.items.map(link=>item(link,true)).join('')}</ul></li>`;
    }).join('');
    return `<aside class="side-nav nav nav--tree" data-algo-nav aria-label="Algo component library"><div id="algo-navigation"><div class="nav__brand"><h1>Algo</h1><p>Algo · component library</p></div>${group('overview','Overview',overview.map(link=>item(link)).join(''))}${group('cells','Cells',cells.map(link=>item(link)).join(''))}${group('organisms','Organisms',organisms)}<div class="nav__source"><a href="https://www.figma.com/design/FCnmkxLq92iz995JhyN5N1/Algo-Design-Library" target="_blank" rel="noreferrer">Open source Figma ↗</a></div></div></aside>`;
  });
}

export async function algoSidebarCss() {
  const tokens=readThemeTokens(await readFile(join(root,'theme/tokens.css'),'utf8'));
  const documentation=await readFile(join(root,'theme/documentation.css'),'utf8');
  const start=documentation.indexOf('#root > .app > .nav {');
  const end=documentation.indexOf('#root > .app > .main {');
  if(start<0||end<start)throw new Error('Shared sidebar style boundary changed');
  const canonical=documentation.slice(start,end).replaceAll('#root > .app > .nav','.side-nav.nav').replace(',\n.foundation-index > button:focus-visible','');
  return compileThemeCss(`/* Generated from the canonical documentation sidebar and theme tokens. */
${canonical}
body[data-library="algo"] { --component-nav-width: var(--hub-nav-width); --documentation-gap: var(--hub-space-2xl); --library-gutter: 24px; }
.side-nav.nav { width: var(--component-nav-width); height: calc(100dvh - 120px); overflow-y: auto; }
.nav .nav__brand > p { margin: 4px 0 0; }
.nav--tree .nav__folder { text-align: left; cursor: pointer; }
.aixa-algo-drawer-nav { padding: 0; font-family: var(--hub-font); color: var(--hub-ink); }
.aixa-algo-drawer-nav .nav__brand { padding-inline: var(--hub-space-md); }
@media (min-width: 900px) and (max-width: 1199px) { body[data-library="algo"] { --component-nav-width: 192px; --documentation-gap: var(--hub-space-xl); } }
@media (max-width: 899px) { .side-nav.nav { display: none; } }
@media (forced-colors: active) { .side-nav.nav { border: 1px solid CanvasText; } }
/* Keep Algo's existing dark mode readable without altering any specimen styles. */
:root[data-theme="dark"] :is(.side-nav.nav,.aixa-algo-drawer-nav) { background: var(--surface); color: var(--text); }
:root[data-theme="dark"] .nav :is(.nav__brand > h1,.nav__row--active > .nav__item) { color: var(--text); }
:root[data-theme="dark"] .nav :is(.nav__brand > p,.nav__section-toggle,.nav__branch-toggle,.nav__source) { color: var(--muted); }
:root[data-theme="dark"] .nav .nav__item { color: var(--secondary); }
:root[data-theme="dark"] .nav .nav__row--active::before { background: var(--text); }
`,tokens);
}
