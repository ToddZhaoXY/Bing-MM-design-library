import { readFile, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { root, filesIn, sourceFilter, sha256 } from './lib.mjs'

const destinations = {
  'mm-image': 'MM_ACF-review/MM_ACF-main',
  aigc: 'AIGC-ACF',
  video: 'Video-ACF',
}
const output = join(root, 'ORIGINALS.json')
if (process.argv.includes('--verify')) {
  const original = JSON.parse(await readFile(output, 'utf8'))
  for (const file of original.files) {
    if (await sha256(join(root, file.path)) !== file.sha256) throw new Error(`Changed source: ${file.path}`)
  }
  console.log(`Verified ${original.files.length} byte-identical copied source files against ORIGINALS.json.`)
} else {
  const files = []
  for (const [id, source] of Object.entries(destinations)) {
    for (const path of await filesIn(join(root, 'projects', id), sourceFilter)) {
      const copiedPath = `projects/${id}/${path}`
      const sourcePath = `${source}/${path}`
      const digest = await sha256(join(root, copiedPath))
      if (digest !== await sha256(join(dirname(root), sourcePath))) throw new Error(`Copy mismatch: ${copiedPath}`)
      files.push({ path: copiedPath, original: sourcePath, sha256: digest })
    }
  }
  await writeFile(output, JSON.stringify({
    format: 1, capturedAt: new Date().toISOString(), originalPathsRelativeTo: '..',
    excluded: ['.git', 'node_modules', 'dist', '*.tsbuildinfo', '.DS_Store', 'site/public/figma/export', 'site/public/figma/images', 'design/figma-export', 'design/INVENTORY.md', 'design/inventory.json', 'design/source-assets', 'design/figma-context', 'design/figma-pages'],
    files,
  }, null, 2) + '\n')
  console.log(`Recorded and compared ${files.length} source files.`)
}
