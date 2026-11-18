import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { root, filesIn } from './lib.mjs';
import { libraryHeader, libraryRail, libraryName } from './library-chrome.mjs';

export const tokensRoot = join(root, 'projects/tokens');
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const digest = value => createHash('sha256').update(value).digest('hex').slice(0, 12);
const route = id => id === 'introduction' ? '#/' : `#/${id}`;
const categories = [['color', 'Color', 285], ['modes', 'Modes', 2], ['type', 'Typography', 23], ['shape', 'Radius', 31], ['spacing', 'Spacing', 48], ['depth', 'Elevation', 20], ['motion', 'Motion', 16], ['effects', 'Effects', 3]];
const copyIcon = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><rect x="6" y="6" width="10" height="11" rx="2"/><path d="M12 6V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2"/></svg>';
function link(label, href, className = '') { return `<a class="${className}" href="${escape(href)}"${href.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : ''}>${escape(label)}</a>`; }
function image(item, className = '') { return `<img class="${className}" src="./tokens-${escape(item.src)}" alt="${escape(item.alt)}" loading="lazy" decoding="async">`; }
function chips(items) { return `<div class="meta">${items.map(item => `<span class="chip">${escape(item)}</span>`).join('')}</div>`; }
function section(title, content, className = '') { return `<section class="section ${className}"><h2 class="section__title">${escape(title)}</h2>${content}</section>`; }
function page(id, title, description, body, meta = []) {
  return `<main class="main token-page" id="page-${id}" data-token-page="${id}"${id === 'introduction' ? '' : ' hidden'}><header class="page-header"><h1 tabindex="-1">${escape(title)}</h1>${chips(meta)}</header>${section('Overview', `<p class="overview">${escape(description)}</p>`, 'token-intro')}${body}</main>`;
}
function table(headers, rows, className = '') { return `<div class="table-scroll"><table class="props ${className}"><thead><tr>${headers.map(h => `<th scope="col">${escape(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${escape(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`; }
function descriptions(items) { return `<dl class="token-descriptions">${items.map(item => `<div><dt>${escape(item.title)}</dt><dd>${escape(item.description)}</dd></div>`).join('')}</dl>`; }
function sourceLinks(data) { return `<div class="token-actions">${data.intro.links.map((item, index) => link(item.label, item.href, index ? 'token-button' : 'token-button token-button--primary')).join('')}${link('View source website', data.source.url, 'token-source-link')}</div>`; }
function navGroup(id, title, items) {
  return `<section class="nav__group"><button type="button" class="nav__section-toggle" aria-expanded="true" aria-controls="tokens-nav-${id}" data-nav-group><span>${title}</span><span class="nav__chevron" aria-hidden="true"></span></button><ul class="nav__list" id="tokens-nav-${id}">${items.map(([id, name, count]) => `<li class="nav__node"><div class="nav__row${id === 'introduction' ? ' nav__row--active' : ''}"><a class="nav__item" href="${route(id)}" data-token-link="${id}"${id === 'introduction' ? ' aria-current="page"' : ''}>${name}${count ? `<span class="token-nav-count">${count}</span>` : ''}</a></div></li>`).join('')}</ul></section>`;
}
function navigation() {
  return `<nav class="nav nav--tree tokens-nav" aria-label="Tokens navigation"><div id="tokens-navigation"><div class="nav__brand"><h2>Tokens</h2><p>Bing · ACF design system</p></div>${navGroup('overview', 'Overview', [['introduction', 'Introduction'], ['catalog', 'Token catalog']])}${navGroup('system', 'Token system', categories)}${navGroup('architecture', 'Architecture', [['namespaces', 'Core namespaces'], ['catalogs', 'Lookup catalogs'], ['reference', 'Reference system']])}${navGroup('resources', 'Resources', [['scenarios', 'Scenarios'], ['cases', 'Case studies'], ['value', 'Workflow'], ['tips', 'Tips'], ['future', 'Future']])}</div></nav>`;
}
function swatch(value) { return `<span class="token-swatch" style="background:${escape(value)}" aria-hidden="true"></span><code>${escape(value)}</code>`; }
function preview(id, name, value) {
  const size = value.match(/^(\d+(?:\.\d+)?)px/);
  if (id === 'shape' && size) return `<span class="token-radius-sample" style="border-radius:${size[1]}px" aria-hidden="true"></span>`;
  if (id === 'spacing' && size) return `<span class="token-spacing-sample" style="width:${size[1]}px" aria-hidden="true"></span>`;
  if (id === 'depth') return `<span class="token-shadow-sample" style="box-shadow:${escape(value)}" aria-hidden="true"></span>`;
  if (id === 'type') {
    const typography = value.match(/(\d{3}) · (\d+)px\/(\d+)px/);
    if (typography) return `<span class="token-type-sample${name.endsWith("-mono") ? " token-type-sample--mono" : ""}" style="font-weight:${typography[1]};font-size:${typography[2]}px;line-height:${typography[3]}px" aria-hidden="true">Aa</span>`;
    return '<span class="token-type-sample" aria-hidden="true">Aa</span>';
  }
  if (id === 'motion') {
    const duration = /^\d+ms$/.test(value) ? value : '800ms';
    const curve = value.startsWith('cubic-bezier(') ? value : 'linear';
    return `<button type="button" class="token-motion" aria-label="Replay ${escape(name)}" title="Replay motion" style="--duration:${duration};--curve:${escape(curve)}"><span aria-hidden="true"></span><span class="token-motion-label">Play</span></button>`;
  }
  if (id === 'effects') {
    // Resolve only the two named stops already present in the imported color table.
    const effect = value.replace('var(--bing-smtc-ctrl-highlight-ring-stroke-stop-1)', '#0078d4').replace('var(--bing-smtc-ctrl-highlight-ring-stroke-stop-2)', '#00487f');
    return `<span class="token-effect-sample" style="background:${escape(effect)}" aria-hidden="true"></span>`;
  }
  return '';
}
function tokenTable(panel) {
  const isColor = panel.id === 'color';
  const rows = panel.rows.map(([name, value]) => {
    const nameCell = `<td><button class="token-copy" type="button" data-copy="${escape(name)}" aria-label="Copy ${escape(name)}"><code>${escape(name)}</code>${copyIcon}</button></td>`;
    let cells;
    if (isColor) {
      const pair = value.split(' / ');
      cells = pair.length === 2 ? pair.map(v => `<td><div class="token-color-value">${swatch(v)}</div></td>`).join('') : `<td colspan="2"><span class="token-mapping">${escape(value)}</span></td>`;
    } else cells = `<td><div class="token-preview">${preview(panel.id, name, value)}</div></td><td><code>${escape(value)}</code></td>`;
    return `<tr data-token-row>${nameCell}${cells}</tr>`;
  }).join('');
  return `<div class="token-toolbar"><label class="token-search"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5"/><path d="m13 13 4 4"/></svg><input type="search" placeholder="Search token names or values" aria-label="Search ${escape(panel.label.toLowerCase())} tokens" data-token-search><button type="button" class="token-search-clear" aria-label="Clear search" hidden>×</button></label><span class="token-results" role="status" aria-live="polite">${panel.rows.length} tokens</span></div><p class="token-table-note">${isColor ? 'Light and Dark values are shown side by side. Reference-mapped tokens retain their source guidance.' : ['shape', 'spacing', 'type'].includes(panel.id) ? 'Paired values are Desktop / Mobile. Previews use the desktop value.' : 'Previews use the resolved values from the source catalog.'} Select a token name to copy it.</p><div class="table-scroll"><table class="props token-table"><thead><tr><th scope="col">Token</th><th scope="col">${isColor ? 'Light' : 'Preview'}</th><th scope="col">${isColor ? 'Dark' : 'Resolved value'}</th></tr></thead><tbody>${rows}</tbody></table></div><div class="token-empty" hidden><h3>No matching tokens</h3><p>Try a shorter name, a value, or a namespace such as smtc.</p><button class="token-button" type="button" data-clear-search>Clear search</button></div>`;
}
function caseStudies(data) {
  const { generation, exploration } = data.cases;
  const examples = `<div class="token-example-tabs" role="group" aria-label="Generated examples">${generation.examples.map((item, i) => `<button class="token-button" type="button" data-example="${i}" aria-pressed="${i === 0}">${escape(item.label)}</button>`).join('')}</div>${generation.examples.map((item, i) => `<figure class="token-example" data-example-panel="${i}"${i ? ' hidden' : ''}>${image(item.image)}<figcaption>${escape(item.description)}</figcaption></figure>`).join('')}`;
  const steps = exploration.steps.map((item, i) => `<section class="token-case-step"><div class="token-step-number" aria-hidden="true">${i + 1}</div><div><h3>${escape(item.title)}</h3><p>${escape(item.description)}</p>${item.images.map((img, j) => `<figure class="token-example">${image(img)}${item.captions[j] ? `<figcaption>${escape(item.captions[j])}</figcaption>` : ''}</figure>`).join('')}</div></section>`).join('');
  return section(generation.title, `<p>${escape(generation.description)}</p>${examples}`) + section(exploration.title, `<p>${escape(exploration.description)}</p>${steps}`);
}
export function renderTokensPage(data, { nav, switcher, theme, css, script }) {
  const panels = Object.fromEntries(data.panels.map(p => [p.id, p]));
  const authors = `<div class="token-authors">${data.intro.authors.map(author => `<div>${image(author)}<span>${escape(author.name)}</span></div>`).join('')}</div>`;
  const browse = `<div class="token-category-index">${categories.filter(([id]) => id !== 'modes').map(([id, label, count]) => `<a href="${route(id)}"><span>${label}</span><span>${count}<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="m8 5 5 5-5 5"/></svg></span></a>`).join('')}</div>`;
  let content = page('introduction', 'ACF basic design tokens', data.intro.description,
    section('Token catalog', `<p>${escape(panels.overview.description)}</p>${browse}<div class="token-inline-links">${link('View all 12 categories', route('catalog'))}${link('Explore Light and Dark', route('modes'))}</div>`) +
    section('A reference for the Bing / ACF design system', `<p>${escape(data.intro.title)}</p>${descriptions(data.reference.uses)}${sourceLinks(data)}${authors}`), ['426 tokens', '12 categories', '2 color modes']);
  content += page('catalog', 'Token catalog', 'One source of truth for every production token. The latest ACF skill consolidates Bing’s token system into a shipped JSON catalog with semantic categories, light and dark values, and direct lookup paths for both people and agents.', section(panels.overview.title, table(panels.overview.headers, panels.overview.rows)) + section('Browse the system', browse), ['426 shipped tokens', '3 core namespaces', '3 lookup catalogs']);
  for (const [id, label] of categories) {
    const p = panels[id];
    let body;
    if (id === 'modes') {
      const sample = panels.color.rows.find(([name]) => name === '--bing-smtc-background-ctrl-brand-rest');
      const pair = sample[1].split(' / ');
      body = section('Mode coverage', table(p.headers, p.rows)) + section('The same semantic token, two values', `<code class="token-mode-name">${escape(sample[0])}</code><div class="token-mode-comparison">${pair.map((v, i) => `<div class="token-mode ${i ? 'token-mode--dark' : ''}"><span>${i ? 'Dark' : 'Light'}</span><div class="token-mode-swatch" style="background:${escape(v)}"></div><code>${escape(v)}</code></div>`).join('')}</div><p class="token-table-note">This pair comes from the source catalog. Use semantic variables with explicit fallbacks.</p>`);
    } else body = section(p.title, tokenTable(p), 'token-catalog-section');
    content += page(id, label, p.description, body, [id === 'modes' ? '2 modes' : `${p.rows.length} tokens`]);
  }
  for (const id of ['namespaces', 'catalogs']) {
    const p = panels[id];
    let body = table(p.headers, p.rows);
    if (id === 'catalogs') body += `<div class="token-inline-links">${link('Open catalog repository', data.intro.links[0].href)}</div>`;
    content += page(id, p.title, p.description, section(p.label, body));
  }
  content += page('reference', 'Reference system', data.reference.title, section('System architecture', table(data.reference.headers, data.reference.rows)) + section('How it is used', descriptions(data.reference.uses)) + section('Non-negotiable principles', `<ul class="token-principles">${data.reference.principles.map(p => `<li>${escape(p)}</li>`).join('')}</ul>`));
  content += page('scenarios', 'Scenarios', 'Where the skill delivers the most value.', section('Recommended scenarios', descriptions(data.scenarios)));
  content += page('cases', 'Case studies', data.cases.title, caseStudies(data));
  content += page('value', 'Workflow', 'How the skill transforms your workflow.', section('From design intent to implementation', table(['Area', 'Before', 'With the skill'], data.value.map(v => [v.label, v.before, v.after]))));
  content += page('tips', 'Tips', 'Getting the most from your skill.', section('Working with the skill', descriptions(data.tips)));
  content += page('future', 'Future', 'What comes next.', section('Future directions', descriptions(data.future)));
  content += page('not-found', 'Page not found', 'This Tokens page does not exist.', section('Continue exploring', link('Back to Tokens', '#/', 'token-button')));
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="Bing ACF design tokens, foundations, architecture and examples in the AIXA Bing Design Library."><title>Tokens — ${libraryName}</title><link rel="stylesheet" href="./${theme}"><link rel="stylesheet" href="./${nav}"><link rel="stylesheet" href="./${css}"><script defer src="./${switcher}"></script><script defer src="./${script}"></script><noscript><style>#root > .app{display:block}.token-page[hidden]{display:block!important}.token-toolbar{display:none!important}.tokens-nav{display:none!important}</style></noscript></head><body data-hub-system="tokens" class="feature-nav-expanded"><a class="token-skip" href="#tokens-content">Skip to content</a>${libraryHeader()}${libraryRail('tokens')}<div id="root"><div class="app" id="tokens-content" tabindex="-1">${navigation()}${content}</div></div><div class="token-toast" role="status" aria-live="polite" hidden></div></body></html>\n`;
}
export async function emitTokensLibrary(emit, { nav = 'library-nav.css', switcher = 'library-switcher.js', theme = 'theme/index.css' } = {}) {
  const data = JSON.parse(await readFile(join(tokensRoot, 'content.json'), 'utf8'));
  const style = await readFile(join(tokensRoot, 'tokens.css'), 'utf8');
  const runtime = await readFile(join(tokensRoot, 'tokens.js'), 'utf8');
  const css = `tokens-style-${digest(style)}.css`;
  const script = `tokens-app-${digest(runtime)}.js`;
  await emit(css, style); await emit(script, runtime);
  for (const file of await filesIn(join(tokensRoot, 'assets'))) await emit(`tokens-${file}`, await readFile(join(tokensRoot, 'assets', file)));
  await emit('tokens.html', renderTokensPage(data, { nav, switcher, theme, css, script }));
  return { html: 'tokens.html', script, css, tokenCount: 426, source: data.source };
}
