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
const report={checks:[],errors:[],failedResources:[]};
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
try {
 for(const [id,slug] of [['mm-image','image-cards'],['aigc','creation-composer'],['video','short-card']]){
  const context=await browser.newContext({viewport:{width:1440,height:1000},colorScheme:'light',reducedMotion:'no-preference',acceptDownloads:true});
  const page=await context.newPage();const requests=[];
  await page.route('**/*.html', async route => { const response = await route.fetch(); await route.fulfill({ response, headers: { ...response.headers(), 'Content-Security-Policy': "script-src 'self'; base-uri 'none'; frame-src 'none'; object-src 'none'" } }); });
  page.on('pageerror',e=>report.errors.push(id+': '+e.message));
  page.on('request',r=>requests.push(r.url().split('/').pop()));
  page.on('response',r=>{if(r.status()>=400&&r.url().startsWith(base))report.failedResources.push(r.url());});
  await page.goto(base+id+'.html#/',{waitUntil:'networkidle'});
  await page.locator('.nav').waitFor({timeout:5000});
  assert.equal(await page.locator('.aixa-load-error').count(),0);
  assert.equal(requests.filter(x=>x.startsWith(id+'-lazy-')).length,0,id+' loaded deferred code on introduction');
  report.checks.push(`${id}: introduction requests no workbench/export chunks`);
  let release;const gate=new Promise(resolve=>release=resolve);
  await page.route('**/'+id+'-lazy-*.js',async route=>{await gate;await route.continue();});
  await page.locator(`.nav a[href$="#/c/${slug}"]`).click();
  await page.locator('.aixa-route-loading').waitFor();
  assert.equal(await page.locator('.nav').isVisible(),true);
  assert.equal(await page.locator('.aixa-route-loading .aixa-skeleton__title').evaluate(el=>getComputedStyle(el).animationName),'aixa-skeleton-pulse');
  if(id==='aigc'){
   await page.screenshot({path:join(out,'skeleton-route-desktop.png')});
   await page.emulateMedia({reducedMotion:'reduce'});
   assert.equal(await page.locator('.aixa-route-loading .aixa-skeleton__title').evaluate(el=>getComputedStyle(el).animationName),'none');
   await page.setViewportSize({width:390,height:900});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   await page.screenshot({path:join(out,'skeleton-route-mobile.png')});
   await page.setViewportSize({width:1440,height:1000});
  }
  release();await page.locator('.workbench').waitFor();await page.waitForLoadState('networkidle');
  assert.equal(await page.locator('.aixa-route-loading').count(),0);
  assert.ok((await page.locator('main .page-header h2').textContent()).length>0);
  await page.getByRole('button',{name:'Mosaic SDL',exact:true}).click();
  const sdl=await page.locator('.code pre').first().textContent();
  assert.ok(sdl.length>100);assert.ok(JSON.parse(sdl));
  report.checks.push(`${id}: lazy detail renders, skeleton settles, SDL is valid JSON`);
  await page.locator('.nav a[href$="#/playground"]').click();
  await page.locator('.pg').waitFor();await page.waitForLoadState('networkidle');
  assert.equal(await page.locator('.aixa-load-error').count(),0);
  const download=page.waitForEvent('download');
  await page.getByRole('button',{name:id==='mm-image'?'Export HTML':'Download HTML',exact:true}).click();
  const output=await download;const file=await output.path();const html=await readFile(file,'utf8');
  assert.match(html,/<!doctype html>/i);assert.ok(html.length>1000);
  report.checks.push(`${id}: lazy Playground exports an HTML file (${html.length} chars)`);
  const loadedBefore=requests.filter(x=>x.startsWith(id+'-lazy-')).length;
  await page.locator(`.nav a[href$="#/c/${slug}"]`).click();await page.locator('.workbench').waitFor();
  await page.locator('.nav a[href$="#/playground"]').click();await page.locator('.pg').waitFor();
  assert.equal(requests.filter(x=>x.startsWith(id+'-lazy-')).length,loadedBefore);
  if(id!=='mm-image'){
   await page.locator('.nav a[href$="#/source-catalog"]').click();await page.locator('main .page-header h2').waitFor();await page.waitForLoadState('networkidle');
   assert.equal(await page.locator('.aixa-load-error').count(),0);
  }
  if(id==='video'){
   await page.locator('.nav a[href$="#/foundations"]').click();await page.locator('main .page-header h2').waitFor();await page.waitForLoadState('networkidle');
   assert.equal(await page.locator('.aixa-load-error').count(),0);
  }
  // Intent warming downloads but does not execute the next library app.
  const target=id==='aigc'?'video':'aigc';
  await page.locator(`body > .feature-nav a[href="./${target}.html#/"]`).hover();
  await page.waitForFunction(target=>[...document.querySelectorAll('link[rel="prefetch"]')].some(el=>el.href.includes(target+'-app-')),target);
  assert.equal(await page.evaluate(target=>Boolean(window.__AIXA_CHUNKS__[target]),target),false);
  report.checks.push(`${id}: route reuse avoids duplicate downloads; intent prefetch does not execute another app`);
  await context.close();
 }
 // Deep-link failure remains recoverable through the normal boundary.
 const context=await browser.newContext({viewport:{width:1440,height:1000}});const page=await context.newPage();let fail=true;
 await page.route('**/aigc-lazy-*.js',route=>fail?route.fulfill({status:404,body:'Controlled missing chunk'}):route.continue());
 await page.goto(base+'aigc.html#/playground',{waitUntil:'domcontentloaded'});
 await page.locator('.aixa-load-error').waitFor();
 fail=false;await page.getByRole('button',{name:'Try again',exact:true}).click();await page.locator('.pg').waitFor();
 report.checks.push('Missing deferred script shows a recoverable error; reload retries successfully');
 await context.close();
 // The startup skeleton remains visible if the entry itself is delayed.
 const bootContext=await browser.newContext({viewport:{width:1440,height:1000}});const bootPage=await bootContext.newPage();let release;const hold=new Promise(resolve=>release=resolve);
 await bootPage.route('**/aigc-app-*.js',async route=>{await hold;await route.continue();});
 await bootPage.goto(base+'aigc.html#/',{waitUntil:'commit'});
 await bootPage.waitForFunction(()=>getComputedStyle(document.getElementById('library-startup')).visibility==='visible');
 assert.equal(await bootPage.locator('.aixa-startup-skeleton').isVisible(),true);
 assert.equal(await bootPage.locator('.startup-actions').isVisible(),false);
 await bootPage.screenshot({path:join(out,'skeleton-startup-desktop.png')});release();await bootPage.locator('main .page-header').waitFor();await bootContext.close();
 report.checks.push('Entry loading uses a page-shaped skeleton without failure buttons');
 const algoContext=await browser.newContext();const algoPage=await algoContext.newPage();let releaseFonts;const fonts=new Promise(resolve=>releaseFonts=resolve);
 await algoPage.route('**/*.ttf',async route=>{await fonts;await route.continue();});
 await algoPage.goto(base+'algo.html',{waitUntil:'domcontentloaded'});
 assert.equal(await algoPage.locator('body').evaluate(el=>getComputedStyle(el).visibility),'visible');
 assert.equal(await algoPage.locator('main').isVisible(),true);
 releaseFonts();await algoContext.close();
 report.checks.push('Algo static documentation stays visible while fonts are loading');
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.failedResources,[]);report.passed=true;
} finally {await writeFile(join(out,'lazy-check.json'),JSON.stringify(report,null,2)+'\n');await browser.close();}
console.log(JSON.stringify(report));
