import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { root, systems, isMain } from './lib.mjs'

export async function syncNavigation({ projectRoot = root, check = false } = {}) {
  for (const file of ['LibraryNav.tsx', 'LibraryNav.css']) {
   const canonical = await readFile(join(projectRoot, 'ui', file), 'utf8')
   for (const system of systems) {
    const destination = join(projectRoot, 'projects', system, 'site/src/components', file)
    const existing = await readFile(destination, 'utf8').catch(error => {
      if (error.code === 'ENOENT') return null
      throw error
    })
    if (existing === canonical) continue
    if (check) throw new Error(`Shared navigation is out of sync: ${system}. Run npm run sync:navigation.`)
    await writeFile(destination, canonical)
   }
  }
}
if (isMain(import.meta.url)) await syncNavigation({ check: process.argv.includes('--check') })
