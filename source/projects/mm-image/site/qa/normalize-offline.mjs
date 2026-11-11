// Isolated verification of self-authored build files. No server, user browser,
// existing profile, or network origin is read or controlled.
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'
import { build } from 'esbuild'
import { rewriteBundleAssets } from '../../../../scripts/build-compat.mjs'
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright')
const repo = fileURLToPath(new URL('../../../../../', import.meta.url))
const output = path.join(repo, 'source/projects/mm-image/design/fy25-cards/qa/normalized')
await fs.mkdir(output, {recursive: true})
const files = new Set(await fs.readdir(repo))
const cache = new Map()
const mime = {'.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg','.gif':'image/gif','.woff2':'font/woff2','.woff':'font/woff'}
async function data(file) {
 file = file.replace(/^\.\//,'')
 if (!cache.has(file)) cache.set(file, `data:${mime[path.extname(file)] || 'application/octet-stream'};base64,${(await fs.readFile(path.join(repo,file))).toString('base64')}`)
 return cache.get(file)
}
async function inlinePage(library) {
 let html = await fs.readFile(path.join(repo, library+'.html'),'utf8')
 const site=path.join(repo,'source/projects',library,'site')
 const bundled=await build({stdin:{resolveDir:site,loader:'tsx',contents:`
  import React from 'react';
  import {createRoot} from 'react-dom/client';
  import {MemoryRouter,Routes,Route,useNavigate,useLocation} from 'react-router-dom';
  import {Nav} from './src/components/Nav';
  import {Home} from './src/pages/Home';
  import {ComponentPage} from './src/pages/ComponentPage';
  import {Playground} from './src/pages/Playground';
  function Probe(){const navigate=useNavigate();const location=useLocation();React.useLayoutEffect(()=>{window.__qaNavigate=navigate;window.__qaLocation=location.pathname+location.search});return null;}
  createRoot(document.getElementById('root')).render(<MemoryRouter><Probe/><div className="app"><Nav/><Routes><Route path="/" element={<Home/>}/><Route path="/c/:slug" element={<ComponentPage/>}/><Route path="/playground" element={<Playground/>}/></Routes></div></MemoryRouter>);
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
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true})
const context=await browser.newContext({viewport:{width:1440,height:1100}})
const blockedRequests=[]
await context.route('**/*', route=>{blockedRequests.push(route.request().url());return route.abort()})
const page=await context.newPage()
const errors=[]
page.on('pageerror',e=>errors.push(e.message))
await page.setContent(await inlinePage('mm-image'),{waitUntil:'load'})
await page.waitForSelector('.nav', {timeout: 5000}).catch(error=>{console.log(JSON.stringify({errors,blockedRequests}));throw error})
async function route(hash) {
 await page.evaluate(hash=>{window.__qaNavigate(hash)}, hash)
 await page.waitForTimeout(50)
}
await route('/c/image-cards')
await page.waitForSelector('#f-size')
const nav=page.locator('.nav__group').filter({has:page.locator('.nav__group-title',{hasText:'Molecules'})})
const entries=await nav.locator('a').allTextContents()
assert.equal(entries.at(-1),'Image cards')
assert.equal(entries.filter(s=>s==='Image cards').length,1)
assert.equal(await page.locator('.nav a[href*="image-card-"]').count(),0)
const dimensions={'2x2':[200,200],'3x2':[312,200],'4x2':[424,200],'5x2':[536,200],'2x4':[200,424],'3x4':[312,424],'4x4':[424,424],'5x4':[536,424],'6x4':[648,424],'8x4':[872,424],'9x4':[984,424],'11x4':[1208,424],'11x2':[1208,200]}
const cases=[]
for (const [size,[width,height]] of Object.entries(dimensions)) {
 await page.locator('#f-size').selectOption(size)
 const choices=await page.locator('#f-variant option').allTextContents()
 for (const variant of choices) {
  await page.locator('#f-variant').selectOption(variant)
  await page.waitForFunction(()=>[...document.querySelectorAll('[data-image-card] img')].every(img=>img.complete&&img.naturalWidth>0))
  const geometry=await page.locator('[data-image-card]').evaluate(el=>({size:el.dataset.imageCard,node:el.dataset.sourceNode,width:el.offsetWidth,height:el.offsetHeight,images:el.querySelectorAll('img').length}))
  assert.equal(geometry.size,size);assert.equal(geometry.width,width);assert.equal(geometry.height,height)
  const code=await page.locator('.code pre').first().textContent()
  assert.ok(code.includes('<ImageCards'));assert.ok(code.includes(`size="${size}"`));assert.ok(code.includes(`variant="${variant}"`))
  const source=await page.getByRole('link',{name:'View in Figma'}).getAttribute('href')
  assert.ok(source.includes(geometry.node.replace(':','-')))
  cases.push({...geometry,variant})
 }
}
assert.equal(cases.length,49)
await page.locator('#f-size').selectOption('3x4')
await page.locator('#f-variant').selectOption({index:0})
await page.evaluate(()=>window.scrollTo(0,0))
await page.screenshot({path:path.join(output,'image-cards-desktop.png')})
const selectStyle=await page.locator('#f-size').evaluate(el=>{const s=getComputedStyle(el);return {font:s.font,border:s.border,borderRadius:s.borderRadius,padding:s.padding,color:s.color,background:s.backgroundColor}})
const buttonStyle=await page.getByRole('button',{name:'Fit',exact:true}).evaluate(el=>{const s=getComputedStyle(el);return {border:s.borderTop,font:s.font,color:s.color,background:s.backgroundColor,radius:s.borderTopLeftRadius}})
await route('/c/image-tile')
const oldStyle=await page.locator('#f-layout').evaluate(el=>{const s=getComputedStyle(el);return {font:s.font,border:s.border,borderRadius:s.borderRadius,padding:s.padding,color:s.color,background:s.backgroundColor}})
assert.deepEqual(selectStyle,oldStyle)
const video=await context.newPage()
await video.setContent(await inlinePage('video'),{waitUntil:'load'})
await video.evaluate(()=>{window.__qaNavigate('/c/short-card')})
await video.waitForSelector('.preview-toolbar button')
const videoButton=await video.getByRole('button',{name:'Fit',exact:true}).evaluate(el=>{const s=getComputedStyle(el);return {border:s.borderTop,font:s.font,color:s.color,background:s.backgroundColor,radius:s.borderTopLeftRadius}})
assert.deepEqual(buttonStyle,videoButton)
await video.close()
const legacy=[]
for (const size of Object.keys(dimensions)) {
 await route('/c/image-card-'+size)
 await page.waitForFunction(()=>window.__qaLocation.includes('/c/image-cards?size='))
 assert.equal(await page.locator('#f-size').inputValue(),size)
 legacy.push(size)
}
await route('/playground')
await page.locator('.pg__surface').filter({hasText:'Blank'}).click()
await page.locator('.pg__add').filter({hasText:'Image cards'}).click()
assert.equal(await page.locator('.pg__add').filter({hasText:'Image cards'}).count(),1)
await page.locator('#pg-size').selectOption('3x2')
await page.locator('#pg-variant').selectOption('Image carousel')
await page.locator('[data-card-action="scroll"]').click()
await page.waitForTimeout(350)
const scrolled=await page.locator('[data-image-card]').evaluate(el=>[...el.querySelectorAll('*')].some(n=>n.scrollLeft>0))
assert.ok(scrolled)
await page.locator('#pg-size').selectOption('5x4')
assert.ok((await page.locator('#pg-variant option').allTextContents()).includes(await page.locator('#pg-variant').inputValue()))
page.once('dialog',d=>d.accept(JSON.stringify({version:1,surface:'blank',blocks:[{id:42,slug:'image-card-3x4',values:{variant:'Single portrait image'},live:{}}],items:[],suggestions:[]})))
await page.getByRole('button',{name:'Load state',exact:true}).click()
await page.locator('.pg__block').click({position:{x:1,y:1}})
assert.equal(await page.locator('#pg-size').inputValue(),'3x4')
assert.equal(await page.locator('#pg-variant').inputValue(),'Single portrait image')
assert.equal(await page.locator('.pg__block-name').textContent(),'Image cards')
await route('/c/image-cards?size=11x4')
await page.setViewportSize({width:390,height:844})
await page.evaluate(()=>window.scrollTo(0,0))
await page.screenshot({path:path.join(output,'image-cards-mobile.png'),fullPage:true})
const mobile=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth}))
assert.equal(mobile.viewport,mobile.document)
assert.deepEqual(errors,[])
assert.deepEqual(blockedRequests,[])
const report={mode:'Isolated about:blank fixture: production components with MemoryRouter and built CSS, no network or existing browser access',cases,legacy,entries,selectStyle,oldStyle,buttonStyle,videoButton,scrolled,mobile,errors,blockedRequests}
await fs.writeFile(path.join(output,'report.json'),JSON.stringify(report,null,2))
console.log(JSON.stringify({cases:cases.length,legacy:legacy.length,entries,selectsMatch:true,buttonsMatch:true,scrolled,mobile,errors,blockedRequests}))
await browser.close()
