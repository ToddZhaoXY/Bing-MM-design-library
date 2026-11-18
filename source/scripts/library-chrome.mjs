// Icons, proportions and active marker come from Algo V8's feature navigation.
export const libraryName = 'AIXA Bing Design Library';
export const libraries = [
  ['tokens', 'Tokens', 'Tokens', '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/>'],
  ['mm-image', 'Image', 'Image', '<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="8" cy="9" r="1.5"/><path d="m4 17 5-5 4 4 3-3 4 4"/>'],
  ['aigc', 'AIGC', 'AIGC', '<path d="m4 18 10-10 3 3L7 21l-3-3Z"/><path d="m11 11 3 3M5 4v4M3 6h4M17 2v4M15 4h4M20 8v4M18 10h4"/>'],
  ['video', 'Video', 'Video', '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="m10 8 6 4-6 4Z"/>'],
  ['algo', 'Algo', 'Algo', '<path d="M5 7V4h14v3M12 4v16M8 20h8"/>'],
];

export function libraryRail(active, prefix = './') {
  const links = libraries.map(([id, label, name, icon]) =>
    `<a class="feature-nav-item${id === active ? ' active' : ''}" href="${prefix}${id}.html#/" aria-label="${name} library" title="${name}"${id === active ? ' aria-current="page"' : ''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon}</svg><span class="feature-nav-label">${label}</span></a>`).join('');
  return `<nav class="feature-nav" aria-label="Design libraries">${links}<button class="feature-nav-toggle" type="button" aria-label="Collapse library navigation" aria-expanded="true"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="3" y="3" width="14" height="14" rx="2"/><path d="M7 3v14"/></svg><span class="feature-nav-tooltip" role="tooltip">Collapse navigation</span></button></nav>`;
}

export function libraryHeader(prefix = './') {
  return `<header class="library-header"><a class="library-home" href="${prefix}index.html" aria-label="Back to all libraries"><span class="library-home__name">${libraryName}</span></a></header>`;
}

export function makeHomePage(source) {
  const links = libraries.map(([id, , name]) => `<a href="./${id}.html#/">${name}</a>`).join('');
  return source.replace('<!-- library-chrome -->', `<header class="portal-header"><nav class="header-links" aria-label="Libraries">${links}</nav></header>`);
}
