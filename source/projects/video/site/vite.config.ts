import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { cp, mkdir } from 'node:fs/promises'
import { resolve, relative, sep } from 'node:path'

// As in MM_ACF, a relative base and HashRouter support static sub-path hosting.
export default defineConfig({
  plugins: [react(), {
    name: 'copy-runtime-figma-assets',
    async closeBundle() {
      const root = resolve('public/figma')
      await mkdir(resolve('dist/figma'), { recursive: true })
      // Full-resolution extraction archives remain available locally for QA.
      // They are not shipped as part of the runtime component library.
      await cp(root, resolve('dist/figma'), { recursive: true, filter: source => !['export', 'images'].includes(relative(root, source).split(sep)[0]) })
      await cp(resolve('licenses'), resolve('dist/licenses'), { recursive: true })
    },
  }],
  base: './',
  build: { copyPublicDir: false },
})
