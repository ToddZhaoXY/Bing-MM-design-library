import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, mkdtemp, rename, rm } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { root, systems, filesIn, fileManifest, isMain } from './lib.mjs';
import { entryScript, makeLibraryPage } from './library-page.mjs';
import { compileThemeCss, readThemeTokens } from './theme.mjs';
import { emitAlgoLibrary } from './algo-library.mjs';
import { emitTokensLibrary } from './tokens-library.mjs';
import { makeHomePage } from './library-chrome.mjs';
import { buildClassicChunks } from './classic-chunks.mjs';

const digest = text => createHash('sha256').update(text).digest('hex').slice(0, 12);
export { assetLiteral, rewriteBundleAssets } from './asset-paths.mjs';
import { flatName, assetLiteral, rewriteCssAssets } from './asset-paths.mjs';

export function compatPage(original, id, { script, css, boot, theme, nav, switcher }) {
  let html = makeLibraryPage(original, id, { alias: true });
  html = html.replace(/\s*<base\b[^>]*>/g, '');
  html = html.replace(/<script defer src="\.\/assets\/[^\"]+-classic\.js"><\/script>/,
    `<script id="library-app" defer src="./${script}"></script>`);
  html = html.replace(/<link rel="stylesheet" href="\.\/assets\/[^\"]+\.css">/,
    `<link rel="stylesheet" href="./${css}">`);
  html = html.replace('src="../../library-switcher.js"', `src="./${switcher}"`)
    .replace('src="../../library-boot.js"', `src="./${boot}"`)
    .replace('href="../../theme/index.css"', `href="./${theme}"`)
    .replace('href="../../library-nav.css"', `href="./${nav}"`)
    .replaceAll('href="../../', 'href="./');
  html = html.replace('<a href="./index.html#/">Open alternate entry</a>',
    `<a href="./${script}" target="_blank" rel="noopener">Open app script</a>`);
  html = html.replace(/(href|src)="((?:\.\/)?figma\/[^"]+)"/g,
    (_match, attribute, value) => `${attribute}="./${assetLiteral(value, id)}"`);
  if (/<base\b|\.\.\/|src="\.\/assets\//.test(html)) throw new Error(`Unresolved entry path: ${id}`);
  return html;
}

export async function buildCompat() {
  const staging = await mkdtemp(join(root, '.build-compat-'));
  const assets = {};
  const names = new Set();
  async function emit(name, content) {
    if (name.includes('/') || names.has(name)) throw new Error(`Output collision: ${name}`);
    names.add(name);
    await writeFile(join(staging, name), content);
    return name;
  }
  try {
    const navContent = await readFile(join(root, 'shared/library-nav.css'), 'utf8');
    const nav = await emit(`library-nav-${digest(navContent)}.css`, navContent);
    const switcherContent = await readFile(join(root, 'shared/library-switcher.js'), 'utf8');
    const switcher = await emit(`library-switcher-${digest(switcherContent)}.js`, switcherContent);
    // Generate the homepage entry links, then flatten its image URLs.
    const homeFiles = await filesIn(join(root, 'portal'));
    const homeMap = Object.fromEntries(homeFiles.map(file => [file, file.replaceAll('/', '-') ]));
    for (const file of homeFiles) {
      let content = await readFile(join(root, 'portal', file));
      if (file === 'index.html') {
        let html = makeHomePage(content.toString()).replace('./library-switcher.js', `./${switcher}`);
        for (const [path, target] of Object.entries(homeMap)) html = html.replaceAll(`./${path}`, `./${target}`);
        content = html;
      }
      await emit(homeMap[file], content);
    }
    const bootContent = await readFile(join(root, 'shared/compat-boot.js'), 'utf8');
    const boot = await emit(`library-boot-${digest(bootContent)}.js`, bootContent);
    const tokens = readThemeTokens(await readFile(join(root, 'theme/tokens.css'), 'utf8'));
    const themeContent = compileThemeCss(`${await readFile(join(root, 'theme/documentation.css'), 'utf8')}\n${await readFile(join(root, 'theme/workbench.css'), 'utf8')}`, tokens);
    const theme = await emit(`library-theme-${digest(themeContent)}.css`, themeContent);
    const entries = { tokens: await emitTokensLibrary(emit, { nav, switcher, theme }) };
    for (const id of systems) {
      const directory = join(root, 'projects', id, 'site/dist');
      const files = new Set(await filesIn(directory));
      const original = await readFile(join(directory, 'index.html'), 'utf8');
      const sourceScript = entryScript(original).replace(/^\.\//, '');
      const styles = [...original.matchAll(/<link\b[^>]*href="\.\/([^\"]+\.css)"[^>]*>/g)].map(match => match[1]);
      if (styles.length !== 1) throw new Error(`Unexpected stylesheets: ${id}`);
      const chunks = await buildClassicChunks(id, { flat: true });
      const bundle = chunks.bootstrap;
      for (const [file, content] of Object.entries(chunks.files)) await emit(file, content);
      const script = await emit(`${id}-app-${digest(bundle)}.js`, bundle);
      const style = rewriteCssAssets(await readFile(join(directory, styles[0]), 'utf8'), id, styles[0], files);
      const css = await emit(`${id}-style-${digest(style)}.css`, style);
      for (const file of files) {
        if (file.endsWith('.js') || ['index.html', sourceScript, ...styles].includes(file)) continue;
        const target = flatName(id, file);
        await emit(target, await readFile(join(directory, file)));
        assets[`${id}/${file}`] = target;
      }
      await emit(`${id}.html`, compatPage(original, id, { script, css, boot, theme, nav, switcher }));
      entries[id] = { html: `${id}.html`, script, css, ...chunks.metadata };
    }
    entries.algo = await emitAlgoLibrary(emit, { nav, switcher });
    const manifest = { format: 3, navigation: 'standalone-pages', packaging: 'flat-no-base', builtAt: new Date().toISOString(), entries, assets, files: await fileManifest(staging) };
    await emit('BUILD-MANIFEST.json', JSON.stringify(manifest, null, 2) + '\n');
    const delivery = join(dirname(root), 'Design-Systems-Portal-Compat-delivery');
    await mkdir(delivery, { recursive: true });
    const target = join(delivery, `site-${digest(JSON.stringify(manifest.files))}`);
    try { await rename(staging, target); }
    catch (error) {
      if (!['EEXIST', 'ENOTEMPTY'].includes(error.code)) throw error;
      // A content-identical prior build is reusable; never overwrite a release.
      for (const [file, hash] of Object.entries(manifest.files)) {
        const actual = createHash('sha256').update(await readFile(join(target, file))).digest('hex');
        if (actual !== hash) throw new Error(`Existing build differs: ${file}`);
      }
    }
    console.log(`Compatibility build: ${target}`);
    return { directory: target, manifest };
  } finally { await rm(staging, { recursive: true, force: true }); }
}

if (isMain(import.meta.url)) await buildCompat();
