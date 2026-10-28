import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { root, systems, sha256 } from '../scripts/lib.mjs';
import { applyTheme, removeTheme, readThemeTokens, compileThemeCss } from '../scripts/theme.mjs';

test('theme injection is strictly reversible and does not rewrite original text or scripts', () => {
  const html = '<!doctype html><html><head><title>Untouched</title></head><body><div id="root"></div><script src="./assets/app.js"></script></body></html>';
  for (const id of systems) {
    const themed = applyTheme(html, id);
    assert.equal(removeTheme(themed, id), html);
    assert.equal((themed.match(/data-hub-theme=/g) ?? []).length, 1);
    assert.throws(() => applyTheme(themed, id));
  }
  assert.throws(() => applyTheme(html, 'unknown'));
});

test('all original content, React, SDL, assets and switching logic are frozen', async () => {
  const baseline = JSON.parse(await readFile(join(root, 'BASELINE.json'), 'utf8'));
  let count = 0;
  for (const [file, hash] of Object.entries(baseline.files)) {
    if ((file.startsWith('projects/') && !file.includes('/dist/')) ||
        ['shell/index.html', 'shell/app.mjs', 'shell/routing.mjs'].includes(file)) {
      assert.equal(await sha256(join(root, file)), hash, file);
      count++;
    }
  }
  assert.ok(count >= 362);
});

test('theme tokens are independently namespaced and CSS has no generated replacement text', async () => {
  for (const file of ['tokens.css', 'documentation.css', 'workbench.css']) {
    const css = await readFile(join(root, 'theme', file), 'utf8');
    for (const declaration of css.matchAll(/(?:^|[;{])\s*(--[a-z][\w-]*)\s*:/gm)) {
      assert.ok(declaration[1].startsWith('--hub-'), `${file}: ${declaration[1]} overrides a specimen variable`);
    }
    assert.doesNotMatch(css, /content\s*:\s*["'][^"']+/, `${file}: content must not be added/replaced`);
    assert.doesNotMatch(css, /@font-face/, 'Specimen fonts must remain untouched');
  }
});

test('published CSS is token-free so component HTML exports gain no inherited theme metadata', async () => {
  const tokens = readThemeTokens(await readFile(join(root, 'theme/tokens.css'), 'utf8'));
  const documentation = await readFile(join(root, 'theme/documentation.css'), 'utf8');
  const workbench = await readFile(join(root, 'theme/workbench.css'), 'utf8');
  const expected = compileThemeCss(`${documentation}\n${workbench}`, tokens);
  const output = await readFile(join(root, 'dist/theme/index.css'), 'utf8');
  assert.equal(output, expected);
  assert.doesNotMatch(output, /--hub-/);
  assert.doesNotMatch(output, /@import/);
  const shellOutput = await readFile(join(root, 'dist/styles.css'), 'utf8');
  assert.equal(shellOutput, compileThemeCss(await readFile(join(root, 'shell/styles.css'), 'utf8'), tokens));
  assert.doesNotMatch(shellOutput, /--hub-|@import/);
  assert.throws(() => compileThemeCss('color: var(--hub-missing)', tokens));
});

test('reading, navigation and selected-control text colors meet WCAG AA contrast', async () => {
  const tokens = readThemeTokens(await readFile(join(root, 'theme/tokens.css'), 'utf8'));
  function luminance(hex) {
    const linear = hex.slice(1).match(/../g).map(value => {
      const channel = parseInt(value, 16) / 255;
      return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
    });
    return linear[0] * .2126 + linear[1] * .7152 + linear[2] * .0722;
  }
  for (const [fg, bg] of [['ink', 'paper'], ['muted', 'nav'], ['accent', 'accent-soft'], ['ink', 'surface']]) {
    const a = luminance(tokens[`--hub-${fg}`]);
    const b = luminance(tokens[`--hub-${bg}`]);
    const ratio = (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
    assert.ok(ratio >= 4.5, `${fg}/${bg}: ${ratio.toFixed(2)}`);
  }
});
