import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { root } from './lib.mjs';

/** Keep the original import ledger immutable; record subsequent content work separately. */
export async function sourceUpdates() {
  const ledger = JSON.parse(await readFile(join(root, 'SOURCE-UPDATES.json'), 'utf8'));
  const updates = new Map();
  // User-requested Magazine positioning and text-clipping corrections (2026-11-10).
  // Keep the import ledger immutable and permit only the reviewed Video files.
  const videoCorrections = new Set([
    'projects/video/site/src/components/VideoMolecules.tsx',
    'projects/video/site/src/video-molecules.css',
    'projects/video/site/src/video-cells.css',
    'projects/video/site/src/video-organisms.css',
    'projects/video/site/tests/video-molecules.test.mjs',
  ]);
  for (const entry of ledger.files) {
    const allowed = entry.path.startsWith('projects/mm-image/site/') ||
      /^projects\/(aigc|video)\/site\/src\/components\/Nav\.tsx$/.test(entry.path) ||
      videoCorrections.has(entry.path)
    if (!allowed || updates.has(entry.path) ||
        !/^[a-f0-9]{64}$/.test(entry.before) || !/^[a-f0-9]{64}$/.test(entry.after)) {
      throw new Error(`Invalid source update: ${entry.path}`);
    }
    updates.set(entry.path, entry);
  }
  return (path, originalHash) => {
    const update = updates.get(path);
    if (!update) return originalHash;
    if (update.before !== originalHash) throw new Error(`Source update ancestry mismatch: ${path}`);
    return update.after;
  };
}
