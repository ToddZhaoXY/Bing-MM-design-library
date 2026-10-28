export const themeLink = '    <link rel="stylesheet" href="../../theme/index.css" data-hub-theme="refined">\n';

export function readThemeTokens(css) {
  return Object.fromEntries([...css.matchAll(/(--hub-[\w-]+)\s*:\s*([^;]+);/g)]
    .map(([, name, value]) => [name, value.trim()]));
}

export function compileThemeCss(css, tokens) {
  const compiled = css.replace(/@import\s+url\(['"]\.\/theme\/tokens\.css['"]\);\s*/g, '')
    .replace(/var\(\s*(--hub-[\w-]+)\s*\)/g, (_match, name) => {
      if (!Object.hasOwn(tokens, name)) throw new Error(`Unknown theme token: ${name}`);
      return tokens[name];
    });
  if (/var\(\s*--hub-/.test(compiled)) throw new Error('Unresolved theme token syntax');
  return compiled;
}

export function applyTheme(html, system) {
  if (!['mm-image', 'aigc', 'video'].includes(system)) throw new Error('Unknown system');
  if (!html.includes('</head>') || !html.includes('<body>')) throw new Error('Unexpected application entry HTML');
  if (html.includes('data-hub-theme')) throw new Error('Theme already applied');
  return html.replace('</head>', `${themeLink}</head>`)
    .replace('<body>', `<body data-hub-system="${system}">`);
}

export function removeTheme(html, system) {
  return html.replace(themeLink, '').replace(`<body data-hub-system="${system}">`, '<body>');
}
