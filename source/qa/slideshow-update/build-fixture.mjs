import {readFile,writeFile} from 'node:fs/promises'
import {fileURLToPath} from 'node:url'
import {join} from 'node:path'
import {createRequire} from 'node:module'
import {rewriteBundleAssets} from '../../scripts/build-compat.mjs'
const repo=fileURLToPath(new URL('../../../',import.meta.url))
const require=createRequire(join(repo,'source/projects/mm-image/site/package.json'))
const {build}=require('esbuild')
const manifest=JSON.parse(await readFile(join(repo,'BUILD-MANIFEST.json'),'utf8'))
const result=await build({stdin:{resolveDir:join(repo,'source/projects/mm-image/site'),loader:'tsx',contents:`
import React from 'react';import{createRoot}from'react-dom/client';import{SlideShow}from'./src/components/SlideShow';import{slideshowSources}from'./src/data/slideshow';
const selector=document.getElementById('variant');for(const entry of slideshowSources){const o=document.createElement('option');o.value=entry.nodeId;o.textContent=entry.label;selector.appendChild(o)}
const root=createRoot(document.getElementById('specimen'));
function render(){const entry=slideshowSources.find(s=>s.nodeId===selector.value);root.render(<SlideShow key={entry.nodeId} {...entry.values} onSeeMore={()=>{document.getElementById('result').textContent='See more activated'}}/>);document.getElementById('result').textContent=''}
selector.value=new URLSearchParams(location.search).get('variant')||'2608:1516';selector.onchange=render;render();
`},bundle:true,format:'iife',platform:'browser',write:false,jsx:'automatic',loader:{'.css':'empty'},define:{'process.env.NODE_ENV':'"production"'}})
let script=rewriteBundleAssets(result.outputFiles[0].text,'mm-image')
for(const target of Object.values(manifest.assets))script=script.replaceAll(JSON.stringify(target),JSON.stringify('../../../'+target))
// Badge assets use a shared directory prefix instead of a complete literal path.
script=script.replaceAll('"mm-image-figma-icon-"','"../../../mm-image-figma-icon-"')
await writeFile(new URL('./fixture.js',import.meta.url),script)
await writeFile(new URL('./index.html',import.meta.url),`<!doctype html><html><head><meta charset="utf-8"><title>SlideShow source comparison</title><link rel="stylesheet" href="../../../${manifest.entries['mm-image'].css}"><style>body{margin:0;background:#fff}header{font:14px/20px system-ui;display:flex;align-items:center;gap:12px;padding:12px;border-bottom:1px solid #ddd}select{font:inherit;padding:8px;max-width:90vw}#specimen{margin:24px;width:max-content}#result{font:14px system-ui;margin:24px}</style></head><body><header><label for="variant">Source variant</label><select id="variant"></select></header><main id="specimen"></main><p id="result" role="status"></p><script src="./fixture.js"></script></body></html>`)
console.log('Interactive SlideShow fixture built.')
