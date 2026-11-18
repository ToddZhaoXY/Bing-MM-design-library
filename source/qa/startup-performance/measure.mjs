import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync, brotliCompressSync } from 'node:zlib';
const require = createRequire(import.meta.url);
const { chromium } = require('/Users/toddzhao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const repo = fileURLToPath(new URL('../../../', import.meta.url));
const out = fileURLToPath(new URL('.', import.meta.url));
const phase = process.argv[2] || 'before';
const base = 'http://127.0.0.1:5198/Bing-MM-design-library/';
const manifest = JSON.parse(await readFile(join(repo, 'BUILD-MANIFEST.json'), 'utf8'));
const report = { phase, origin: 'localhost only', profiles: [], payloads: [] };
for (const id of ['mm-image','aigc','video']) {
 const file = manifest.entries[id].script; const bytes = await readFile(join(repo, file));
 report.payloads.push({ id, file, bytes: bytes.length, gzip: gzipSync(bytes).length, brotli: brotliCompressSync(bytes).length });
}
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
try {
 for (const profile of [{name:'local-cold',latency:0,bandwidth:-1,cpu:1},{name:'simulated-slow-cold',latency:150,bandwidth:200000,cpu:4}]) {
  const context = await browser.newContext({ viewport:{width:1440,height:1000},colorScheme:'light',reducedMotion:'reduce' });
  const page = await context.newPage();
  const session = await context.newCDPSession(page);
  await session.send('Network.enable');
  await session.send('Network.setCacheDisabled',{cacheDisabled:true});
  await session.send('Network.emulateNetworkConditions',{offline:false,latency:profile.latency,downloadThroughput:profile.bandwidth,uploadThroughput:profile.bandwidth});
  await session.send('Emulation.setCPUThrottlingRate',{rate:profile.cpu});
  await page.addInitScript(() => {
   const probe=window.__startupProbe={rootReady:null,statusVisible:null,statusHidden:null,statusFrames:0,actionsBeforeReady:false,longTasks:[],events:[]};
   new PerformanceObserver(list=>probe.longTasks.push(...list.getEntries().map(e=>({start:e.startTime,duration:e.duration})))).observe({type:'longtask',buffered:true});
   const frame=()=>{
    const root=document.querySelector('#root > .app');
    const status=document.getElementById('library-startup');
    const visible=status&&!status.hidden&&getComputedStyle(status).display!=='none'&&getComputedStyle(status).visibility!=='hidden'&&status.getBoundingClientRect().height>0;
    if(root&&probe.rootReady===null)probe.rootReady=performance.now();
    if(visible){if(probe.statusVisible===null)probe.statusVisible=performance.now();probe.statusFrames++;const actions=status.querySelector('.startup-actions');if(!root&&actions&&!actions.hidden&&getComputedStyle(actions).display!=='none')probe.actionsBeforeReady=true;}
    if(root&&!visible){probe.statusHidden=performance.now();return;}
    requestAnimationFrame(frame);
   };requestAnimationFrame(frame);
  });
  const results=[];
  for(const id of ['mm-image','aigc','video']) {
   await page.goto(base+id+'.html#/',{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>window.__startupProbe?.statusHidden!==null);
   const data=await page.evaluate(()=>({probe:window.__startupProbe,navigation:performance.getEntriesByType('navigation')[0].toJSON(),resources:performance.getEntriesByType('resource').map(e=>({name:e.name.split('/').pop(),type:e.initiatorType,start:e.startTime,end:e.responseEnd,duration:e.duration,transfer:e.transferSize,encoded:e.encodedBodySize,decoded:e.decodedBodySize})),paint:performance.getEntriesByType('paint').map(e=>({name:e.name,time:e.startTime}))}));
   results.push({id,...data});
   console.log(JSON.stringify({profile:profile.name,id,rootMs:Math.round(data.probe.rootReady),statusFirstMs:data.probe.statusVisible&&Math.round(data.probe.statusVisible),statusHiddenMs:Math.round(data.probe.statusHidden),statusFrames:data.probe.statusFrames,actionsBeforeReady:data.probe.actionsBeforeReady,appEndMs:Math.round(data.resources.find(e=>e.name.startsWith(id+'-app-'))?.end||0)}));
  }
  report.profiles.push({...profile,results});await context.close();
 }
} finally { await mkdir(out,{recursive:true});await writeFile(join(out,phase+'.json'),JSON.stringify(report,null,2)+'\n');await browser.close(); }
