import { copyFile, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { buildCompat } from '../source/scripts/build-compat.mjs';
import { repository, verifySite } from './verify-site.mjs';

const { directory } = await buildCompat();
const { manifest } = await verifySite(directory);
const previous = await readFile(join(repository, 'BUILD-MANIFEST.json'), 'utf8')
  .then(JSON.parse).catch(error => { if (error.code === 'ENOENT') return { files: {} }; throw error; });
for (const file of Object.keys(previous.files)) {
  if (!/^[A-Za-z0-9][A-Za-z0-9_.-]*$/.test(file)) throw new Error(`Invalid old asset: ${file}`);
}
for (const file of Object.keys(manifest.files)) await copyFile(join(directory, file), join(repository, file));
for (const file of Object.keys(previous.files)) {
  if (!Object.hasOwn(manifest.files, file)) await rm(join(repository, file), { force: true });
}
await copyFile(join(directory, 'BUILD-MANIFEST.json'), join(repository, 'BUILD-MANIFEST.json'));
await writeFile(join(repository, '.nojekyll'), '');
await verifySite();
console.log('Updated the repository-root website. Commit and push these files to deploy.');
