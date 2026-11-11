import {readFile, writeFile, mkdir} from 'node:fs/promises'
import {createRequire} from 'node:module'
import {fileURLToPath} from 'node:url'
import {join,resolve} from 'node:path'
const repo=fileURLToPath(new URL('../../../',import.meta.url))
const manifest=JSON.parse(await readFile(join(repo,'BUILD-MANIFEST.json'),'utf8'))
const require=createRequire(join(repo,'source/projects/video/site/package.json'))
const {build}=require('esbuild')
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
const summary=[]
for(const system of ['video','mm-image','aigc']) {
 const site=join(repo,'source/projects',system,'site')
 const renderer=system==='mm-image'?'./src/pages/ComponentPage':'./src/components/renderers'
 const extras=system==='video'?"import * as publicComponents from './src/components/index';":''
 const renderFunction=system==='video'?"return renderToStaticMarkup(React.createElement(publicComponents[components.find(d=>d.slug===slug).tag],{...Object.fromEntries(components.find(d=>d.slug===slug).props.map(p=>[p.name,p.numeric?Number(values[p.name]??p.default):values[p.name]??p.default])),...override}))":"return renderToStaticMarkup(RENDERERS[slug]({...values,...override},()=>{}))"
 const compiled=await build({stdin:{resolveDir:site,contents:`${extras} import React from 'react'; import {renderToStaticMarkup} from 'react-dom/server'; import {RENDERERS} from '${renderer}'; import {components} from './src/data/components'; import {defaults} from './src/components/Workbench'; export {components,defaults}; export function render(slug,values,override={}){${renderFunction}}`},bundle:true,format:'cjs',platform:'node',write:false,jsx:'automatic',loader:{'.css':'empty'},define:{'import.meta.env.BASE_URL':'"./"','import.meta.env.DEV':'false','process.env.NODE_ENV':'"production"'}})
 const mod={exports:{}};new Function('require','module','exports',compiled.outputFiles[0].text)(require,mod,mod.exports)
 const api=mod.exports, cases=[],seen=new Set()
 for(const def of api.components) {
  const base=api.defaults(def.props)
  const candidates=[['default',base]]
  for(const prop of def.props){
   if(prop.kind==='select')for(const val of prop.values){
    const values={...base,[prop.name]:val};
    for(const child of def.props.filter(p=>p.valuesByParent?.prop===prop.name)){
     for(const choice of child.valuesByParent.options?.[val]??[])candidates.push([`${prop.name}=${val}/${child.name}=${choice}`,{...values,[child.name]:choice}])
    }
    candidates.push([`${prop.name}=${val}`,values])
   }
   if(prop.kind==='boolean')candidates.push([`${prop.name}=${!base[prop.name]}`,{...base,[prop.name]:!base[prop.name]}])
  }
  if(system==='video'&&def.slug==='video-more-card')for(const layout of ['List','Grid'])for(const cardStyle of ['Split','Contained'])for(const size of ['Normal','Narrow'])candidates.push([`${layout}/${cardStyle}/${size}`,{...base,layout,cardStyle,size}])
  for(const [name,values]of candidates){
   const long={...values};let supportsLong=false;
   for(const prop of def.props)if(prop.kind==='text'&&/^(title|description|source|channel|prompt|label|heading)$/.test(prop.name)){long[prop.name]=`Long ${prop.name} `+'Explore beautiful places and discover more stories with detailed information. '.repeat(8);supportsLong=true}
   for(const [suffix,props]of [['',values],...(supportsLong?[[' / long text',long]]:[])]){
    const key=def.slug+JSON.stringify(props);if(seen.has(key))continue;seen.add(key)
    let html;try{html=api.render(def.slug,props)}catch(error){throw new Error(`${system}/${def.slug}/${name}: ${error.message}`)}
    for(const [source,target]of Object.entries(manifest.assets))if(source.startsWith(system+'/'))html=html.replaceAll(source.slice(system.length+1),`../../../${target}`)
    cases.push({id:`case-${cases.length}`,slug:def.slug,name:`${def.name} / ${name}${suffix}`,values:props,html})
   }
  }
 }
 if(system==='video')for(const [slug,property,values]of [['video-hero-card','size',['Normal','Wide','Super wide']],['playlist-card','configuration',api.components.find(c=>c.slug==='playlist-card').props.find(p=>p.name==='configuration').values]])for(const value of values){
  const def=api.components.find(c=>c.slug===slug),props={...api.defaults(def.props),[property]:value};
  let html=api.render(slug,props,{title:'A long title that describes a beautiful place and all of the stories behind it. '.repeat(5),description:'An extended description with many details about the scene and its history. '.repeat(12)});
  for(const [source,target]of Object.entries(manifest.assets))if(source.startsWith(system+'/'))html=html.replaceAll(source.slice(system.length+1),`../../../${target}`);
  cases.push({id:`case-${cases.length}`,slug,name:`${def.name} / ${value} / public long content`,values:props,html});
 }
 const options=cases.map(c=>`<option value="${c.id}">${escape(c.name)}</option>`).join('')
 const sections=cases.map(c=>`<section class="qa-case" id="${c.id}" data-slug="${c.slug}" data-name="${escape(c.name)}"><h2>${escape(c.name)}</h2><div class="qa-specimen">${c.html}</div></section>`).join('\n')
 const html=`<!doctype html><html><head><meta charset="utf-8"><title>${system} text clipping audit</title><link rel="stylesheet" href="../../../${manifest.entries[system].css}"><style>body{margin:0;background:#eee}header{position:sticky;top:0;z-index:10000;padding:12px;background:white;font:14px system-ui;display:flex;gap:12px}select{max-width:75vw}.qa-case{margin:20px;padding:20px;background:white;width:max-content;min-width:500px;scroll-margin-top:70px}.qa-case>h2{font:600 15px/1.5 system-ui;color:#555;margin:0 0 24px}.qa-specimen{display:flow-root;width:max-content;min-width:1px}.qa-case[hidden]{display:none}</style></head><body><header><label>Test case <select id="case-selector"><option value="all">All ${cases.length} cases</option>${options}</select></label><button id="show-all">Show all</button></header>${sections}<script>const select=document.querySelector('#case-selector');function show(id){select.value=id;document.querySelectorAll('.qa-case').forEach(el=>el.hidden=id!=='all'&&el.id!==id);window.scrollTo(0,0)}select.onchange=()=>show(select.value);document.querySelector('#show-all').onclick=()=>show('all');const initial=new URLSearchParams(location.search).get('case');if(initial)show(initial);</script></body></html>`
 await writeFile(join(repo,'source/qa/text-clipping',system+'.html'),html)
 await writeFile(join(repo,'source/qa/text-clipping',system+'-cases.json'),JSON.stringify(cases.map(({html,...c})=>c),null,2))
 summary.push({system,cases:cases.length,bytes:html.length})
}
console.log(JSON.stringify(summary))
