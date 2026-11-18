import { createRequire } from 'node:module';
import { join, posix } from 'node:path';
import { root } from './lib.mjs';

const require = createRequire(join(root, 'projects/aigc/site/package.json'));
const ts = require('typescript');
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

