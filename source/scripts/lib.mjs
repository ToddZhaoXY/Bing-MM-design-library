import { createHash } from 'node:crypto'
import { readdir, readFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'

export const root = dirname(dirname(fileURLToPath(import.meta.url)))
export const systems = ['mm-image', 'aigc', 'video']
export const sourceExcludedNames = new Set(['node_modules', 'dist', '.git', '.DS_Store'])
export function sourceFilter(path) {
  const parts = path.replaceAll('\\', '/').split('/')
  return !parts.some(part => sourceExcludedNames.has(part) || part.startsWith('.build-'))
    && !path.endsWith('.tsbuildinfo') && !path.endsWith('.log')
}
export async function filesIn(directory, filter = () => true, prefix = '') {
  const files = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const key = prefix ? `${prefix}/${entry.name}` : entry.name
    if (!filter(key) || entry.isSymbolicLink()) continue
    if (entry.isDirectory()) files.push(...await filesIn(join(directory, entry.name), filter, key))
    else if (entry.isFile()) files.push(key)
  }
  return files.sort()
}
export async function sha256(file) {
  return createHash('sha256').update(await readFile(file)).digest('hex')
}
export async function fileManifest(directory, filter) {
  const result = {}
  for (const path of await filesIn(directory, filter)) result[path] = await sha256(join(directory, path))
  return result
}
export function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', ...options })
    child.once('error', reject)
    child.once('close', code => code === 0 ? resolve() : reject(new Error(`${command} exited ${code}`)))
  })
}
export function isMain(url) {
  return process.argv[1] && relative(fileURLToPath(url), process.argv[1]) === ''
}
