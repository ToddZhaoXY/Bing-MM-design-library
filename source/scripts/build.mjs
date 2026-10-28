import { access, chmod, cp, mkdir, mkdtemp, readFile, rename, rm, unlink, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { root, systems, run, fileManifest, isMain } from './lib.mjs'
import { compileThemeCss, readThemeTokens } from './theme.mjs'
import { makeLibraryPage, classicBundle, entryScript } from './library-page.mjs'

export async function build({ reuseBuilds = false, projectRoot = root } = {}) {
  await access(join(projectRoot, 'portal', 'index.html'))
  if (!reuseBuilds) {
    for (const system of systems) {
      console.log(`Building ${system}…`)
      await run(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build'], {
        cwd: join(projectRoot, 'projects', system, 'site'),
      })
    }
  }
  for (const system of systems) await access(join(projectRoot, 'projects', system, 'site', 'dist', 'index.html'))
  const staging = await mkdtemp(join(projectRoot, '.build-'))
  try {
    await cp(join(projectRoot, 'portal'), staging, { recursive: true })
    await cp(join(projectRoot, 'shared'), staging, { recursive: true })
    const tokens = readThemeTokens(await readFile(join(projectRoot, 'theme', 'tokens.css'), 'utf8'))
    const documentation = await readFile(join(projectRoot, 'theme', 'documentation.css'), 'utf8')
    const workbench = await readFile(join(projectRoot, 'theme', 'workbench.css'), 'utf8')
    await mkdir(join(staging, 'theme'))
    // Resolve authoring tokens at build time. New inherited custom properties
    // would otherwise be serialized by the original HTML snapshot exporters.
    await writeFile(join(staging, 'theme', 'index.css'), compileThemeCss(`${documentation}\n${workbench}`, tokens))
    await mkdir(join(staging, 'systems'), { recursive: true })
    for (const system of systems) {
      await cp(join(projectRoot, 'projects', system, 'site', 'dist'), join(staging, 'systems', system), { recursive: true })
      const entry = join(staging, 'systems', system, 'index.html')
      const original = await readFile(entry, 'utf8')
      const script = entryScript(original)
      const bundleFile = join(staging, 'systems', system, script)
      await writeFile(bundleFile.replace(/\.js$/, '-classic.js'), await classicBundle(await readFile(bundleFile, 'utf8')))
      await unlink(bundleFile)
      await writeFile(entry, makeLibraryPage(original, system))
      await writeFile(join(staging, `${system}.html`), makeLibraryPage(original, system, { alias: true }))
    }
    const manifest = { format: 2, navigation: 'standalone-pages', builtAt: new Date().toISOString(), systems, files: await fileManifest(staging) }
    await writeFile(join(staging, 'BUILD-MANIFEST.json'), JSON.stringify(manifest, null, 2) + '\n')
    await chmod(staging, 0o755)
    const target = join(projectRoot, 'dist')
    await rm(target, { recursive: true, force: true })
    await rename(staging, target)
    console.log(`Combined ${Object.keys(manifest.files).length} files → ${target}`)
    return manifest
  } finally {
    await rm(staging, { recursive: true, force: true })
  }
}
if (isMain(import.meta.url)) {
  const args = process.argv.slice(2)
  if (args.some(arg => arg !== '--reuse-builds')) throw new Error('Usage: node scripts/build.mjs [--reuse-builds]')
  await build({ reuseBuilds: args.includes('--reuse-builds') })
}
