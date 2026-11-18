import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require('/Users/toddzhao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out=fileURLToPath(new URL('.',import.meta.url));
const base='http://127.0.0.1:5198/Bing-MM-design-library/';
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const report={checks:[],errors:[]};
try {
 for(const reducedMotion of ['reduce','no-preference']) {
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion});
  const page=await context.newPage();
  page.on('pageerror',e=>report.errors.push(e.message));
  let release;
  const gate=new Promise(resolve=>release=resolve);
  await page.route('**/aigc-app-*.js',async route=>{await gate;await route.continue();});
  await page.goto(base+'aigc.html#/',{waitUntil:'commit'});
  await page.waitForFunction(()=>{const e=document.getElementById('library-startup');return e&&getComputedStyle(e).visibility==='visible';});
  assert.equal(await page.locator('#library-startup').getAttribute('role'),'status');
  assert.equal(await page.locator('.startup-actions').isVisible(),false);
  assert.equal(await page.locator('#root').textContent(),'');
  if(reducedMotion==='reduce') {
   await page.screenshot({path:join(out,'normal-loading.png')});
   await page.waitForFunction(()=>document.querySelector('.startup-title')?.textContent==='Still loading…',{},{timeout:12000});
   assert.equal(await page.locator('#library-startup').getAttribute('role'),'status');
   assert.equal(await page.locator('#library-startup').evaluate(el=>el.classList.contains('library-startup--error')),false);
   assert.equal(await page.locator('.startup-actions').isVisible(),true);
   report.checks.push('After eight seconds, slow loading stays informational rather than becoming an error');
  }
  release();
  await page.locator('#root > .app').waitFor();
  await page.waitForFunction(()=>document.getElementById('library-startup').hidden);
  assert.equal(await page.locator('#library-startup').isVisible(),false);
  report.checks.push(`${reducedMotion}: loading appears after the reveal delay; normal load has no recovery controls; app mount clears it`);
  await context.close();
 }
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await context.newPage();
 let fail=true;
 await page.route('**/aigc-app-*.js',route=>fail?route.fulfill({status:404,contentType:'text/plain',body:'Missing fixture script'}):route.continue());
 await page.goto(base+'aigc.html#/',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>document.getElementById('startup-detail')?.textContent.includes('HTTP 404'));
 assert.equal(await page.locator('#library-startup').getAttribute('role'),'alert');
 assert.equal(await page.locator('.startup-actions').isVisible(),true);
 await page.screenshot({path:join(out,'real-failure.png')});
 fail=false;await page.getByRole('button',{name:'Try again',exact:true}).click();
 await page.locator('#root > .app').waitFor();
 assert.equal(await page.locator('#library-startup').isVisible(),false);
 report.checks.push('A real missing script retains its HTTP 404 diagnostic and retry recovers');
 await context.close();
 assert.deepEqual(report.errors,[]);
 report.passed=true;
} finally {await writeFile(join(out,'fault-check.json'),JSON.stringify(report,null,2)+'\n');await browser.close();}
console.log(JSON.stringify(report));
