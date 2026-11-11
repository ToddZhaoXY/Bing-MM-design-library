// Isolated verification of self-authored build files. No server, user browser,
// existing profile, or network origin is read or controlled.
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { rewriteBundleAssets } from '../scripts/build-compat.mjs'
export const repo = fileURLToPath(new URL('../../', import.meta.url))
const require = createRequire(path.join(repo,'source/projects/mm-image/site/package.json'))
const { build } = require('esbuild')
const files = new Set(await fs.readdir(repo))
const cache = new Map()
const mime = {'.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg','.gif':'image/gif','.woff2':'font/woff2','.woff':'font/woff'}
async function data(file) {
 file = file.replace(/^\.\//,'')
 if (!cache.has(file)) cache.set(file, `data:${mime[path.extname(file)] || 'application/octet-stream'};base64,${(await fs.readFile(path.join(repo,file))).toString('base64')}`)
 return cache.get(file)
}
export async function inlinePage(library, initialPath = "/") {
 let html = await fs.readFile(path.join(repo, library+'.html'),'utf8')
 const site=path.join(repo,'source/projects',library,'site')
 const bundled=await build({stdin:{resolveDir:site,loader:'tsx',contents:`
  import React from 'react';
  import {createRoot} from 'react-dom/client';
  import {MemoryRouter,Routes,Route,useNavigate,useLocation} from 'react-router-dom';
  import {Nav} from './src/components/Nav';
  import {components} from './src/data/components';
  window.__qaComponents=components.map(({slug,name,tier,partOf})=>({slug,name,tier,partOf}));
  import {Home} from './src/pages/Home';
  import {ComponentPage} from './src/pages/ComponentPage';
  import {Playground} from './src/pages/Playground';
  function Probe(){const navigate=useNavigate();const location=useLocation();React.useLayoutEffect(()=>{window.__qaNavigate=navigate;window.__qaLocation=location.pathname+location.search});return null;}
  createRoot(document.getElementById('root')).render(<MemoryRouter initialEntries={[${JSON.stringify(initialPath)}]}><Probe/><div className="app"><Nav/><Routes><Route path="/" element={<Home/>}/><Route path="/c/:slug" element={<ComponentPage/>}/><Route path="/playground" element={<Playground/>}/></Routes></div></MemoryRouter>);
 `},bundle:true,platform:'browser',format:'iife',write:false,jsx:'automatic',loader:{'.css':'empty'},define:{'process.env.NODE_ENV':'"production"','import.meta.env.DEV':'false','import.meta.env.BASE_URL':'"./"'}})
 let code = rewriteBundleAssets(bundled.outputFiles[0].text,library)
 for (const tag of [...html.matchAll(/<script\b[^>]*src="([^"]+)"[^>]*><\/script>/g)]) {
  html = html.replace(tag[0], '')
 }
 for (const tag of [...html.matchAll(/<link\b[^>]*href="([^"]+\.css)"[^>]*>/g)]) {
  let css=await fs.readFile(path.join(repo,tag[1]),'utf8')
  for (const m of [...css.matchAll(/url\(["']?([^"')]+)["']?\)/g)]) {
   if (files.has(m[1].replace(/^\.\//,''))) css=css.replaceAll(m[0], `url("${await data(m[1])}")`)
  }
  html=html.replace(tag[0],`<style>${css}</style>`)
 }
 for (const match of [...code.matchAll(/(["'])((?:\.\/)?[\w.-]+\.(?:png|svg|webp|jpg|gif|woff2?))\1/g)]) {
  if (files.has(match[2].replace(/^\.\//,''))) code=code.replaceAll(match[0], JSON.stringify(await data(match[2])))
 }
 html=html.replace(/<link\b[^>]*rel="icon"[^>]*>/g,'').replace(/<aside id="library-startup"[\s\S]*?<\/aside>/,'')
 return html.replace('</body>', () => `<script>${code.replaceAll('</script','<\\/script')}</script></body>`)
}
