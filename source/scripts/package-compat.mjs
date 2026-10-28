import { join, dirname } from 'node:path';
import { writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { buildCompat } from './build-compat.mjs';
import { root, filesIn, run, sha256 } from './lib.mjs';

const { directory } = await buildCompat();
await run(process.execPath, ['--test', 'tests/compat.test.mjs'], { cwd: root, env: { ...process.env, COMPAT_DIR: directory } });
const delivery = dirname(directory);
const name = `MM-Design-Libraries-compat-${directory.split('site-').pop()}.zip`;
const zip = join(delivery, name);
const files = await filesIn(directory);
await new Promise((resolve, reject) => {
  const child = spawn('zip', ['-q', '-X', zip, '-@'], { cwd: directory, stdio: ['pipe', 'inherit', 'inherit'] });
  child.once('error', reject); child.once('close', code => code === 0 ? resolve() : reject(new Error(`zip exited ${code}`)));
  child.stdin.end(files.join('\n') + '\n');
});
await run('unzip', ['-tq', zip]);
await writeFile(`${zip}.sha256`, `${await sha256(zip)}  ${name}\n`);
console.log(`Verified compatibility ZIP: ${zip}`);
