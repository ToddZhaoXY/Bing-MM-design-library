import { createRequire } from 'node:module';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { root, systems, isMain } from './lib.mjs';
const require=createRequire(join(root,'projects/aigc/site/package.json'));
const {build}=require('esbuild');
export async function generateOverview({check=false,projectRoot=root}={}) {
 for(const id of systems){
  const site=join(projectRoot,'projects',id,'site');
  const extra=id==='mm-image'?`import {imageCardGroups,figmaCardUrl} from './src/data/image-cards'; const extra={imageCardSummaries:imageCardGroups.map(({size,width,height,variants})=>({size,width,height,variantCount:variants.length})),imageCardsFigmaUrl:figmaCardUrl('2216:1178')};`:id==='video'?`import source from './src/data/source-catalog.json'; const extra={sourcePageCount:source.pages.length};`:'const extra={};';
  const result=await build({stdin:{resolveDir:site,contents:`import {components} from './src/data/components'; import {mosaicCoverage} from './src/mosaic/generators'; import {mosaicCatalogSnapshot} from './src/mosaic/validate'; ${extra} export default {components:components.map(({slug,name,tier,partOf})=>({slug,name,tier,partOf:partOf||null})),mosaicCoverage,mosaicCatalogSnapshot,...extra};`},bundle:true,platform:'node',format:'cjs',write:false,jsx:'automatic',loader:{'.css':'empty'},define:{'import.meta.env.BASE_URL':'"./"','import.meta.env.DEV':'false','process.env.NODE_ENV':'"production"'}});
  const mod={exports:{}};new Function('require','module','exports',result.outputFiles[0].text)(require,mod,mod.exports);
  const content=JSON.stringify(mod.exports.default,null,2)+'\n';
  const file=join(site,'src/data/overview-summary.json');
  if(check){if(await readFile(file,'utf8')!==content)throw new Error(`Stale overview metadata: ${id}`);}else await writeFile(file,content);
 }
}
if(isMain(import.meta.url))await generateOverview({check:process.argv.includes('--check')});
