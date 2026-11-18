import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script } from 'node:vm';

export const repository = dirname(dirname(fileURLToPath(import.meta.url)));
export async function verifySite(directory = repository) {
  const manifest = JSON.parse(await readFile(join(directory, 'BUILD-MANIFEST.json'), 'utf8'));
  assert.equal(manifest.packaging, 'flat-no-base');
  for (const entry of ['index.html', 'tokens.html', 'mm-image.html', 'aigc.html', 'video.html', 'algo.html']) {
    assert.ok(Object.hasOwn(manifest.files, entry), `Missing entry: ${entry}`);
  }
  for (const [id, entry] of Object.entries(manifest.entries)) {
    if (!entry.graph) continue;
    const deferred = Object.values(entry.graph).map(module => module.file).filter(Boolean).sort();
    assert.deepEqual(deferred, [...entry.deferredFiles].sort(), `${id}: inconsistent deferred manifest`);
    for (const file of deferred) assert.ok(Object.hasOwn(manifest.files, file), `${id}: missing deferred script ${file}`);
    for (const [name, module] of Object.entries(entry.graph)) {
      for (const dependency of module.dependencies) assert.ok(Object.hasOwn(entry.graph, dependency), `${id}/${name}: unknown dependency ${dependency}`);
      if (!module.file) assert.ok(entry.initialModules.includes(name), `${id}: unbundled initial module ${name}`);
    }
  }
  let references = 0;
  for (const [file, expected] of Object.entries(manifest.files)) {
    assert.match(file, /^[A-Za-z0-9][A-Za-z0-9_.-]*$/, `Invalid flat file: ${file}`);
    const content = await readFile(join(directory, file));
    assert.equal(createHash('sha256').update(content).digest('hex'), expected, file);
    if (file.endsWith('.js')) new Script(content.toString(), { filename: file });
    if (!/\.(html|css)$/.test(file)) continue;
    const text = content.toString();
    if (file.endsWith('.html')) assert.doesNotMatch(text, /<base\b|<iframe\b/);
    const refs = file.endsWith('.html')
      ? [...text.matchAll(/(?:href|src)="([^"]+)"/g)].map(match => match[1])
      : [...text.matchAll(/url\(["']?([^)'"\s]+)["']?\)/g)].map(match => match[1]);
    for (const ref of refs) {
      if (/^(?:https?:|data:|#|mailto:|\/\/)/.test(ref)) continue;
      for (const base of ['/', '/Bing-MM-design-library/']) {
        const url = new URL(ref, `https://example.test${base}${file}`);
        assert.ok(url.pathname.startsWith(base), `Resource escaped site prefix: ${ref}`);
        const target = decodeURIComponent(url.pathname.slice(base.length));
        assert.ok(Object.hasOwn(manifest.files, target), `${file}: missing ${ref}`);
        references++;
      }
    }
  }
  return { manifest, references };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { manifest, references } = await verifySite();
  await access(join(repository, '.nojekyll'));
  console.log(`Verified ${Object.keys(manifest.files).length} files, six library/home entries and ${references} root/subpath resource references.`);
}
