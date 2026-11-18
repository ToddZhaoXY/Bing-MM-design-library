import { createRequire } from 'node:module';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require('/Users/toddzhao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out=fileURLToPath(new URL('.',import.meta.url));
const repo=fileURLToPath(new URL('../../../',import.meta.url));
const base='http://127.0.0.1:5198/Bing-MM-design-library/';
const manifest=JSON.parse(await readFile(join(repo,'BUILD-MANIFEST.json'),'utf8'));
const report={pages:[],checks:[],errors:[],failedResources:[]};
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
try {
 const context=await browser.newContext({viewport:{width:1440,height:1000},colorScheme:'light',reducedMotion:'reduce'});
 const page=await context.newPage();
 page.on('pageerror',e=>report.errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400&&r.url().startsWith(base))report.failedResources.push(r.url());});
 const styles=async()=>page.locator('.nav--tree').first().evaluate(nav=>{
  const properties=['fontFamily','fontSize','fontWeight','lineHeight','paddingTop','paddingRight','paddingBottom','paddingLeft','borderRadius','color','backgroundColor'];
  const read=element=>Object.fromEntries(properties.map(p=>[p,getComputedStyle(element)[p]]));
  return {nav:{...read(nav),width:getComputedStyle(nav).width,height:getComputedStyle(nav).height},brand:read(nav.querySelector('.nav__brand h1')),group:read(nav.querySelector('.nav__section-toggle')),link:read(nav.querySelector('.nav__item')),toggle:read(nav.querySelector('.nav__toggle'))};
 });
 await page.goto(base+'aigc.html#/',{waitUntil:'networkidle'});await page.locator('.nav--tree').waitFor();
 const reference=await styles();
 await page.screenshot({path:join(out,'reference-aigc.png')});
 for(const entry of ['index.html','mm-image.html#/','video.html#/',...manifest.entries.algo.pages]){
  await page.goto(base+entry,{waitUntil:'networkidle'});
  assert.doesNotMatch(await page.locator('body').innerText(),/MM Image/);
  const globalNav=page.locator(entry==='index.html'?'.header-links':'body > .feature-nav');
  assert.equal(await globalNav.getByRole('link',{name:entry==='index.html'?'Image':'Image library',exact:true}).count(),1);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),entry);
  if(entry.startsWith('algo')){
   assert.equal(await page.locator('.side-nav [aria-current="page"]').count(),1,entry);
   assert.equal(await page.locator('.side-nav [aria-current="page"]').isVisible(),true,entry);
   assert.equal(await page.locator('.side-nav .library-nav-heading').count(),0);
   assert.equal(await page.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return ids.length===new Set(ids).size;}),true,'Duplicate IDs: '+entry);
  }
  report.pages.push(entry);
 }
 await page.goto(base+'algo.html',{waitUntil:'networkidle'});
 const actual=await styles();report.reference=reference;report.algo=actual;
 assert.deepEqual(actual,reference,'Algo menu differs from canonical menu');
 await page.screenshot({path:join(out,'algo-overview-desktop.png')});
 const side=page.locator('.side-nav');const url=page.url();
 await side.getByRole('button',{name:'Collapse Cells',exact:true}).click();
 assert.equal(await side.locator('#algo-group-cells').isVisible(),false);assert.equal(page.url(),url);
 await side.getByRole('button',{name:'Expand Cells',exact:true}).click();assert.equal(await side.locator('#algo-group-cells').isVisible(),true);
 await side.getByRole('button',{name:'Collapse navigation',exact:true}).click();
 assert.equal(await side.evaluate(el=>Math.round(el.getBoundingClientRect().width)),44);
 await side.getByRole('button',{name:'Expand navigation',exact:true}).click();
 await side.getByRole('button',{name:'Expand Sectional',exact:true}).click();
 await side.locator('a[href="algo-sectional-nav.html"]').click();await page.waitForLoadState('networkidle');
 assert.equal(await page.locator('.side-nav #algo-children-sectional').isVisible(),true);
 assert.equal(await page.locator('.side-nav [aria-current="page"]').textContent(),'Nav');
 await page.screenshot({path:join(out,'algo-component-desktop.png')});
 report.checks.push('Canonical styles match; group and whole-menu collapse work; current branch is visible after navigation');
 await page.getByRole('button',{name:'Switch to dark mode',exact:true}).click();
 const dark=await page.locator('.side-nav').evaluate(el=>({bg:getComputedStyle(el).backgroundColor,text:getComputedStyle(el).color}));
 assert.notEqual(dark.bg,'rgb(255, 255, 255)');assert.notEqual(dark.bg,dark.text);
 await page.screenshot({path:join(out,'algo-dark.png')});
 await page.getByRole('button',{name:'Switch to light mode',exact:true}).click();
 for(const width of [1024,390,320]){
  await page.setViewportSize({width,height:900});await page.goto(base+'algo-algo-block.html',{waitUntil:'networkidle'});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  if(width<900){
   await page.getByRole('button',{name:'Open navigation',exact:true}).click();
   const drawer=page.locator('#libraryNavigationDrawer');assert.equal(await drawer.isVisible(),true);
   await drawer.getByRole('button',{name:'Collapse Cells',exact:true}).click();
   assert.equal(await drawer.locator('#algo-group-cells-drawer').isVisible(),false);
   assert.equal(await page.locator('.side-nav #algo-group-cells').getAttribute('hidden'),null);
   await drawer.getByRole('button',{name:'Expand Cells',exact:true}).click();
   if(width===390)await page.screenshot({path:join(out,'algo-mobile-menu.png')});
   await drawer.locator('a[href="algo-cells-attribution.html"]').click();await page.waitForLoadState('networkidle');
   assert.ok(page.url().includes('algo-cells-attribution.html'));
  }
 }
 report.checks.push('Dark mode and 1024/390/320px layouts passed; drawer IDs and disclosure state remain independent');
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.failedResources,[]);report.passed=true;
}finally{await writeFile(join(out,'results.json'),JSON.stringify(report,null,2)+'\n');await browser.close();}
console.log(JSON.stringify({passed:report.passed,pages:report.pages.length,checks:report.checks}));
