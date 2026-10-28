import { join } from 'node:path'
import { lstat } from 'node:fs/promises'
import { root, systems, run } from './lib.mjs'

for (const system of systems) {
  const cwd = join(root, 'projects', system, 'site')
  const existing = await lstat(join(cwd, 'node_modules')).catch(() => null)
  if (existing?.isSymbolicLink()) {
    throw new Error(`${system}: node_modules is a local development symlink. Remove that symlink before npm run setup; the script will not change shared dependencies.`)
  }
  await run(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['ci'], { cwd })
}
