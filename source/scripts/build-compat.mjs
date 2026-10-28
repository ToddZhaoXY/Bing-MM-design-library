import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, mkdtemp, rename, rm } from 'node:fs/promises';
import { join, dirname, posix } from 'node:path';
import { root, systems, filesIn, fileManifest, isMain } from './lib.mjs';
import { classicBundle, entryScript, makeLibraryPage } from './library-page.mjs';
import { compileThemeCss, readThemeTokens } from './theme.mjs';

const require = createRequire(join(root, 'projects/aigc/site/package.json'));
const ts = require('typescript');
const digest = text => createHash('sha256').update(text).digest('hex').slice(0, 12);
export const flatName = (id, path) => `${id}-${path.replaceAll('/', '-')}`;

// Rewrite only asset-valued literals/template fragments. Explanatory prose,
// remote URLs, React logic and SDL contracts are not rewritten.
export function assetLiteral(value, id) {
  const flatten = path => flatName(id, path.replace(/^\.\//, ''));
  if (/^(?:\.\/)?figma\/[\w./-]*$/.test(value)) return flatten(value);
  return value.replace(/url\((['"]?)((?:\.\/)?figma\/[\w./-]+)\1\)/g,
    (_match, quote, path) => `url(${quote}${flatten(path)}${quote})`);
}

export function rewriteBundleAssets(source, id) {
  const file = ts.createSourceFile('bundle.js', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  if (file.parseDiagnostics.length) throw new Error(`Cannot parse ${id} bundle`);
  const result = ts.transform(file, [context => {
    const f = context.factory;
    const visit = node => {
      if (ts.isStringLiteral(node)) {
        const value = assetLiteral(node.text, id);
        if (value !== node.text) return f.createStringLiteral(value);
      }
      const factories = new Map([
        [ts.SyntaxKind.NoSubstitutionTemplateLiteral, text => f.createNoSubstitutionTemplateLiteral(text)],
        [ts.SyntaxKind.TemplateHead, text => f.createTemplateHead(text)],
        [ts.SyntaxKind.TemplateMiddle, text => f.createTemplateMiddle(text)],
        [ts.SyntaxKind.TemplateTail, text => f.createTemplateTail(text)],
      ]);
      if (factories.has(node.kind)) {
        const value = assetLiteral(node.text, id);
        if (value !== node.text) return factories.get(node.kind)(value);
      }
      return ts.visitEachChild(node, visit, context);
    };
    return node => ts.visitNode(node, visit);
  }]);
  try { return ts.createPrinter().printFile(result.transformed[0]); }
  finally { result.dispose(); }
}

export function rewriteCssAssets(css, id, file, knownFiles) {
  return css.replace(/url\(\s*(['"]?)([^)'"\s]+)\1\s*\)/g, (match, _quote, ref) => {
    if (/^(?:data:|https?:|\/\/|#)/.test(ref)) return match;
    const [, path, suffix = ''] = /^([^?#]+)([?#].*)?$/.exec(ref);
    const resolved = posix.normalize(posix.join(posix.dirname(file), path));
    if (!knownFiles.has(resolved)) throw new Error(`Missing CSS asset: ${id}/${resolved}`);
    return `url("./${flatName(id, resolved)}${suffix}")`;
  });
}

export function compatPage(original, id, { script, css, boot, theme, nav }) {
  let html = makeLibraryPage(original, id, { alias: true });
  html = html.replace(/\s*<base\b[^>]*>/g, '');
  html = html.replace(/<script defer src="\.\/assets\/[^\"]+-classic\.js"><\/script>/,
    `<script id="library-app" defer src="./${script}"></script>`);
  html = html.replace(/<link rel="stylesheet" href="\.\/assets\/[^\"]+\.css">/,
    `<link rel="stylesheet" href="./${css}">`);
  html = html.replace('src="../../library-boot.js"', `src="./${boot}"`)
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
    // The homepage stays byte-identical except for its flattened image URLs.
    const homeFiles = await filesIn(join(root, 'portal'));
    const homeMap = Object.fromEntries(homeFiles.map(file => [file, file.replaceAll('/', '-') ]));
    for (const file of homeFiles) {
      let content = await readFile(join(root, 'portal', file));
      if (file === 'index.html') {
        let html = content.toString();
        for (const [path, target] of Object.entries(homeMap)) html = html.replaceAll(`./${path}`, `./${target}`);
        content = html;
      }
      await emit(homeMap[file], content);
    }
    const bootContent = await readFile(join(root, 'shared/compat-boot.js'), 'utf8');
    const boot = await emit(`library-boot-${digest(bootContent)}.js`, bootContent);
    const navContent = await readFile(join(root, 'shared/library-nav.css'), 'utf8');
    const nav = await emit(`library-nav-${digest(navContent)}.css`, navContent);
    const tokens = readThemeTokens(await readFile(join(root, 'theme/tokens.css'), 'utf8'));
    const themeContent = compileThemeCss(`${await readFile(join(root, 'theme/documentation.css'), 'utf8')}\n${await readFile(join(root, 'theme/workbench.css'), 'utf8')}`, tokens);
    const theme = await emit(`library-theme-${digest(themeContent)}.css`, themeContent);
    const entries = {};
    for (const id of systems) {
      const directory = join(root, 'projects', id, 'site/dist');
      const files = new Set(await filesIn(directory));
      const original = await readFile(join(directory, 'index.html'), 'utf8');
      const sourceScript = entryScript(original).replace(/^\.\//, '');
      const styles = [...original.matchAll(/<link\b[^>]*href="\.\/([^\"]+\.css)"[^>]*>/g)].map(match => match[1]);
      if (styles.length !== 1) throw new Error(`Unexpected stylesheets: ${id}`);
      const bundle = await classicBundle(rewriteBundleAssets(await readFile(join(directory, sourceScript), 'utf8'), id));
      const script = await emit(`${id}-app-${digest(bundle)}.js`, bundle);
      const style = rewriteCssAssets(await readFile(join(directory, styles[0]), 'utf8'), id, styles[0], files);
      const css = await emit(`${id}-style-${digest(style)}.css`, style);
      for (const file of files) {
        if (['index.html', sourceScript, ...styles].includes(file)) continue;
        const target = flatName(id, file);
        await emit(target, await readFile(join(directory, file)));
        assets[`${id}/${file}`] = target;
      }
      await emit(`${id}.html`, compatPage(original, id, { script, css, boot, theme, nav }));
      entries[id] = { html: `${id}.html`, script, css };
    }
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
