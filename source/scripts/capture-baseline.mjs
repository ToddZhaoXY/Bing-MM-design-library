import { writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { root, fileManifest } from './lib.mjs';

// One-time read-only capture of the user-approved original project.
const original = join(dirname(root), 'Design-Systems-Hub');
const manifest = await fileManifest(original, path => !path.split('/').some(part =>
  ['node_modules', '.git', '.DS_Store'].includes(part) || part.startsWith('.build-')) && !path.endsWith('.tsbuildinfo'));
await writeFile(join(root, 'BASELINE.json'), JSON.stringify({
  originalProject: 'Design-Systems-Hub', capturedDate: '2026-10-20', files: manifest,
}, null, 2) + '\n');
console.log(`Recorded ${Object.keys(manifest).length} original files without modifying the original.`);
