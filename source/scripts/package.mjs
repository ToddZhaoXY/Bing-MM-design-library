import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { spawn } from 'node:child_process'
import { root, filesIn, sourceFilter, sha256, run } from './lib.mjs'

const delivery = join(dirname(root), 'Design-Systems-Portal-delivery')
await mkdir(delivery, { recursive: true })
await readFile(join(root, 'dist', 'index.html'))
const manifest = JSON.parse(await readFile(join(root, 'dist', 'BUILD-MANIFEST.json'), 'utf8'))
for (const [file, hash] of Object.entries(manifest.files)) {
  if (await sha256(join(root, 'dist', file)) !== hash) throw new Error(`Stale build: ${file}. Run npm run build first.`)
}
async function zipFiles(name, cwd, paths) {
  if (paths.some(path => /[\r\n]/.test(path))) throw new Error('Cannot package filenames containing newlines')
  const target = join(delivery, name)
  const temporary = join(delivery, `${name.replace(/\.zip$/, '')}.pending-${process.pid}.zip`)
  try {
    await new Promise((resolve, reject) => {
      const child = spawn('zip', ['-q', '-X', temporary, '-@'], { cwd, stdio: ['pipe', 'inherit', 'inherit'] })
      child.once('error', reject)
      child.once('close', code => code === 0 ? resolve() : reject(new Error(`zip exited ${code}`)))
      child.stdin.end(paths.join('\n') + '\n')
    })
    await run('unzip', ['-tq', temporary])
    await rename(temporary, target)
    return `${await sha256(target)}  ${name}`
  } finally {
    await rm(temporary, { force: true })
  }
}
const checksums = []
checksums.push(await zipFiles('Design-Systems-Portal-one-click-deploy.zip', join(root, 'dist'), await filesIn(join(root, 'dist'))))
checksums.push(await zipFiles('Design-Systems-Portal-source.zip', root, await filesIn(root, sourceFilter)))
await writeFile(join(delivery, 'SHA256SUMS.txt'), checksums.join('\n') + '\n')
console.log(`Verified deployment and source ZIPs → ${delivery}`)
