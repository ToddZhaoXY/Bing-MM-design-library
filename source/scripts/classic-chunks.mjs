import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { join, basename } from 'node:path';
import { Script } from 'node:vm';
import { root } from './lib.mjs';
import { rewriteBundleAssets } from './asset-paths.mjs';
const require=createRequire(join(root,'projects/aigc/site/package.json'));
const {build,transform}=require('esbuild');
const ts=require('typescript');

export async function buildClassicChunks(id,{flat=false,projectRoot=root}={}) {
 const site=join(projectRoot,'projects',id,'site');
 const result=await build({absWorkingDir:site,entryPoints:['src/main.tsx'],bundle:true,splitting:true,format:'esm',platform:'browser',target:'es2020',outdir:'.aixa-chunks',entryNames:'entry-[hash]',chunkNames:'chunk-[hash]',write:false,metafile:true,jsx:'automatic',loader:{'.css':'empty'},define:{'import.meta.env':JSON.stringify({BASE_URL:'./',DEV:false,PROD:true,MODE:'production'}),'process.env.NODE_ENV':'"production"'},legalComments:'inline'});
 const outputs=Object.entries(result.metafile.outputs).filter(([file])=>file.endsWith('.js'));
 const entry=basename(outputs.find(([,meta])=>meta.entryPoint==='src/main.tsx')[0]);
 const graph=Object.fromEntries(outputs.map(([file,meta])=>[basename(file),{file:`${id}-lazy-${basename(file)}`,dependencies:meta.imports.filter(item=>item.kind==='import-statement'&&!item.external).map(item=>basename(item.path))}]));
 const initial=new Set();
 function visit(name){if(initial.has(name))return;initial.add(name);graph[name].dependencies.forEach(visit);}
 visit(entry);
 const definitions={};
 for(const output of result.outputFiles){
  if(!output.path.endsWith('.js'))continue;
  const name=basename(output.path);
  let source=flat?rewriteBundleAssets(output.text,id):output.text;
  const parsed=ts.createSourceFile(name,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);
  const rewritten=ts.transform(parsed,[context=>{
   function visit(node){
    if(ts.isCallExpression(node)&&node.expression.kind===ts.SyntaxKind.ImportKeyword&&ts.isStringLiteral(node.arguments[0])&&graph[basename(node.arguments[0].text)])return context.factory.updateCallExpression(node,context.factory.createIdentifier('__import'),node.typeArguments,node.arguments);
    return ts.visitEachChild(node,visit,context);
   }
   return node=>ts.visitNode(node,visit);
  }]);
  try {source=ts.createPrinter().printFile(rewritten.transformed[0]);}finally{rewritten.dispose();}
  const cjs=await transform(source,{format:'cjs',target:'es2020',minify:true,legalComments:'inline'});
  definitions[name]=`window.__AIXA_CHUNKS__[${JSON.stringify(id)}].define(${JSON.stringify(name)},function(module,exports,require,__import){${cjs.code}\n});`;
 }
 for(const name of initial) graph[name].file = null;
 const files={};
 for(const [name,code] of Object.entries(definitions))if(!initial.has(name)){new Script(code);files[graph[name].file]=code;}
 const template=await readFile(join(root,'scripts/classic-runtime.js'),'utf8');
 const bootstrap=template.replace('__SCOPE__',()=>JSON.stringify(id)).replace('__GRAPH__',()=>JSON.stringify(graph)).replace('__INITIAL__',()=>[...initial].map(name=>definitions[name]).join('\n')).replace('__ENTRY__',()=>JSON.stringify(entry));
 if (/\b__(?:SCOPE|GRAPH|INITIAL|ENTRY)__\b/.test(bootstrap)) throw new Error('Unresolved classic-loader template');
 const minified=await transform(bootstrap,{minify:true,target:'es2020',legalComments:'inline'});
 new Script(minified.code);
 return {bootstrap:minified.code,files,metadata:{initialModules:[...initial],initialBytes:Buffer.byteLength(minified.code),deferredFiles:Object.keys(files),graph}};
}
