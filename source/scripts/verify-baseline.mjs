import { access, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { root, sha256 } from './lib.mjs';
import { sourceUpdates } from './source-provenance.mjs';

const baseline = JSON.parse(await readFile(join(root, 'BASELINE.json'), 'utf8'));
const expected = await sourceUpdates();
let checked = 0;
for (const [file, hash] of Object.entries(baseline.files)) {
  if ((file.startsWith('projects/') && !file.includes('/dist/')) ||
      ['shell/index.html', 'shell/app.mjs', 'shell/routing.mjs', 'shell/favicon.svg'].includes(file)) {
    if (await sha256(join(root, file)) !== expected(file, hash)) throw new Error(`Unrecorded content or behavior change: ${file}`);
    checked++;
  }
}
console.log(`Verified ${checked} source/content/behavior files against the baseline and recorded library updates.`);
const original = join(dirname(root), baseline.originalProject);
let originalExists = true;
try { await access(original); } catch { originalExists = false; }
if (originalExists) {
  for (const [file, hash] of Object.entries(baseline.files)) {
    if (await sha256(join(original, file)) !== hash) throw new Error(`Original approved project changed: ${file}`);
  }
  console.log(`Original approved project unchanged: ${Object.keys(baseline.files).length} files verified.`);
} else console.log('Original project is not present on this machine; copied content verification completed.');
