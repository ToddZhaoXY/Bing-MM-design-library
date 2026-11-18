window.__AIXA_CHUNKS__["mm-image"].define("chunk-Z64CWXKG.js",function(module,exports,require,__import){var ee=Object.defineProperty;var Te=Object.getOwnPropertyDescriptor;var Ie=Object.getOwnPropertyNames;var Be=Object.prototype.hasOwnProperty;var Me=(t,n)=>{for(var s in n)ee(t,s,{get:n[s],enumerable:!0})},Ue=(t,n,s,o)=>{if(n&&typeof n=="object"||typeof n=="function")for(let u of Ie(n))!Be.call(t,u)&&u!==s&&ee(t,u,{get:()=>n[u],enumerable:!(o=Te(n,u))||o.enumerable});return t};var De=t=>Ue(ee({},"__esModule",{value:!0}),t);var nt={};Me(nt,{Playground:()=>ke});module.exports=De(nt);var c=require("./chunk-BUJZHMNO.js"),k=require("./chunk-HZ4FPKGG.js");(0,k.init_define_import_meta_env)();var w=(0,k.__toESM)((0,k.require_react)(),1);(0,k.init_define_import_meta_env)();function Fe(t){try{return new URL(t).hostname.replace(/^www\./,"")}catch{return t.replace(/^https?:\/\//,"").split("/")[0]??t}}var qe="D41D8CD98F00B204E9800998ECF8427E1510C791";function Je(t,n){const s=new URLSearchParams({q:t,count:String(n),offset:"0",mkt:"en-US",safeSearch:"Moderate"});return k.define_import_meta_env_default.DEV?`/api/bing?${s}`:(s.set("appId",qe),`https://www.bingapis.com/api/v7/images/search?${s}`)}async function We(t,n=40,s=20){const o=t.trim();if(!o)return{images:[],suggestions:[]};const u=await fetch(Je(o,n));if(!u.ok)throw new Error(`Bing search failed: ${u.status}`);const p=await u.json(),h=Array.isArray(p.value)?p.value:[],v=new Set,l=[...p.relatedSearches??[],...p.queryExpansions??[]].map(d=>{const g=d.displayText||d.text||"";return!g||v.has(g)?null:(v.add(g),{label:g,query:d.text||g,thumbnail:d.thumbnail?.thumbnailUrl||""})}).filter(d=>d!==null).slice(0,s);return{images:h.map(d=>{const g=d.thumbnailUrl||d.contentUrl||"";if(!g)return null;const N=d.hostPageDisplayUrl||d.hostPageUrl||"";return{src:g,title:d.name||"",source:N?Fe(N):"",favicon:d.hostPageFavIconUrl||"",width:d.width&&d.width>0?d.width:4,height:d.height&&d.height>0?d.height:3}}).filter(d=>d!==null),suggestions:l}}(0,k.init_define_import_meta_env)();function ve(t){const n=t.under?`  (only meaningful when ${t.under} is true)`:"";if(t.kind==="select"){if(t.valuesByParent){const u=Object.entries(t.valuesByParent.options).map(([p,h])=>`      ${t.valuesByParent.prop}=${JSON.stringify(p)}: ${h.map(v=>JSON.stringify(v)).join(" | ")}`).join(`
`);return`    ${t.name}: choose only from the selected ${t.valuesByParent.prop} below
${u}`}const s=t.values.map(u=>JSON.stringify(u)).join(" | "),o=t.numeric?"  \u2014 numeric, but stored as a string":"";return`    ${t.name}: ${s}   default ${JSON.stringify(t.default)}${o}${n}`}return t.kind==="boolean"?`    ${t.name}: true | false   default ${t.default}${n}`:`    ${t.name}: string   default ${JSON.stringify(t.default)}${n}`}function He(t){const n=`- slug: "${t.slug}"   (${t.name} \xB7 ${t.tier}${t.partOf?` \xB7 part of ${t.partOf}`:""})`,s=`    ${t.overview}`,o=t.props.length?t.props.map(ve).join(`
`):"    (no props)";return[n,s,o].join(`
`)}function Ye(t){const n=c.components.find(o=>o.slug==="image-tile")?.props??[];return`You are assembling a page for the MMACF component library (Multimedia ACF \u2014
Bing Image Search design system). Your output is a single JSON object that the
library's Playground can load directly via its "Load state" button.

Reply with ONLY the JSON. No prose, no markdown fence, no explanation.

=============================================================
OUTPUT SHAPE
=============================================================

{
  "version": 1,
  "surface": "<surface id>",
  "query": "",
  "blocks": [
    { "id": 1, "slug": "<component slug>", "values": { ... }, "live": {} }
  ],
  "items": [],
  "suggestions": []
}

Rules:
- "id" is any unique integer per block. The Playground reissues them on load,
  so they only need to be distinct within your output.
- "values" holds that component's props. Omit a prop to accept its default.
  Every value is a JSON string, boolean, or number matching the prop's kind.
- "live" is always {} \u2014 it is runtime state the component fills in itself.
- "items" and "suggestions" are live Bing search payloads. Leave both as []
  unless you were given real ones; the canvas then shows the Figma default
  artwork, which is the correct placeholder.
- Block ORDER is page order, top to bottom.
- Never invent a slug. Only the slugs listed below exist; an unknown one makes
  the whole snapshot fail to parse.

=============================================================
SURFACES  (the "surface" field)
=============================================================

${t.map(o=>{const u=o.preset.length?o.preset.map(([p])=>`"${p}"`).join(" \u2192 "):"(empty)";return`- "${o.id}" \u2014 ${o.name}
    ${o.note}
    typical stack: ${u}`}).join(`
`)}

A surface sets the page frame, the content column width, and the Bing shell
chrome. Pick the one that matches what the user is describing; when they say
"SERP" or "image answer" use serp, when they say "IRP" or "the whole image
results page" use irp, and when they want components on a bare canvas use blank.

=============================================================
COMPONENTS  (the "slug" and "values" fields)
=============================================================

${c.components.map(He).join(`

`)}

=============================================================
CONTENT BLOCKS \u2014 extra fields
=============================================================

A "content" block may carry two optional keys beyond "values":

  "tileAll": { ... }              props applied to EVERY tile in that block
  "tileOne": { "0": { ... } }     props for one tile, keyed by tile index

Both take the Image Tile prop set:
${n.map(ve).join(`
`)}

A tile-level prop beats "tileAll", which beats the layout's own baseline.
Only add these when the user asks for a specific tile to differ \u2014 otherwise
leave them out entirely.

Multiple "content" blocks on one page are a real pattern (a long IRP is several
rows of grid). They render as one continuous waterfall: the second block picks
up where the first left off. You do not need to do anything for this.

=============================================================
EXAMPLES
=============================================================

User: "a SERP image answer with the header and a waterfall grid"

{
  "version": 1,
  "surface": "serp",
  "query": "",
  "blocks": [
    { "id": 1, "slug": "header", "values": { "title": "Image of Living Room", "showSubTitle": false }, "live": {} },
    { "id": 2, "slug": "content", "values": { "layout": "Waterfall" }, "live": {} },
    { "id": 3, "slug": "footer", "values": { "clickAction": "Expansion: See more" }, "live": {} }
  ],
  "items": [],
  "suggestions": []
}

User: "a long IRP \u2014 related searches on top, then two rows of dense grid"

{
  "version": 1,
  "surface": "irp",
  "query": "",
  "blocks": [
    { "id": 1, "slug": "rs-on-top", "values": {}, "live": {} },
    { "id": 2, "slug": "content", "values": { "layout": "Dense" }, "live": {} },
    { "id": 3, "slug": "content", "values": { "layout": "Dense" }, "live": {} }
  ],
  "items": [],
  "suggestions": []
}

=============================================================
NOW BUILD
=============================================================

The user's request follows. Read it, choose the surface, stack the blocks in
reading order, and emit the JSON object and nothing else.

REQUEST:
`}(0,k.init_define_import_meta_env)();var ze=[".pg__block-chrome"],Ge="pg__";async function Ve(t,n){if(!t.querySelector("[data-image-card], [data-slideshow]"))return ye(t,n);const s=t.cloneNode(!0),o=[t,...Array.from(t.querySelectorAll("*"))],u=[s,...Array.from(s.querySelectorAll("*"))];o.forEach((d,g)=>{(d.scrollLeft||d.scrollTop)&&(u[g].dataset.exportScrollX=String(d.scrollLeft),u[g].dataset.exportScrollY=String(d.scrollTop))});const p=new Map,h=d=>(p.has(d)||p.set(d,fetch(d).then(async g=>{if(!g.ok)throw new Error(`Could not embed asset (${g.status}): ${d}`);const N=await g.blob();return new Promise((x,C)=>{const R=new FileReader;R.onload=()=>x(String(R.result)),R.onerror=()=>C(new Error("Could not read export asset")),R.readAsDataURL(N)})})),p.get(d));await Promise.all(Array.from(s.querySelectorAll("img")).map(async d=>{d.src=await h(d.src),d.removeAttribute("srcset")})),await Promise.all(Array.from(s.querySelectorAll("[style]")).map(async d=>{const g=d.style.backgroundImage;if(!g.includes("url("))return;let N=g;for(const x of g.matchAll(/url\(["']?([^"')]+)["']?\)/g)){const C=await h(new URL(x[1],document.baseURI).href);N=N.replace(x[0],`url("${C}")`)}d.style.backgroundImage=N}));let l=(await Promise.all([h(new URL("mm-image-figma-fy25-fonts-roboto-400.woff2",document.baseURI).href),h(new URL("mm-image-figma-fy25-fonts-roboto-700.woff2",document.baseURI).href)])).map((d,g)=>`@font-face{font-family:'MM FY25 Roboto';src:url('${d}');font-weight:${g?700:400};}`).join("");if(t.querySelector("[data-slideshow]")){const d=await h(new URL("mm-image-figma-slideshow-fonts-alice-400.woff2",document.baseURI).href);l+=`@font-face{font-family:'MM SlideShow Alice';src:url('${d}');font-weight:400;}`}return ye(s,n).replace("</style>",`${l}
[data-image-card]{font-family:'MM FY25 Roboto',sans-serif!important;}
</style>`).replace("</body>",`<script>window.addEventListener('load',function(){document.querySelectorAll('[data-export-scroll-x]').forEach(function(el){el.scrollLeft=Number(el.dataset.exportScrollX);el.scrollTop=Number(el.dataset.exportScrollY);});});<\/script>
</body>`)}function ye(t,n){const s=t.cloneNode(!0);for(const p of ze)s.querySelectorAll(p).forEach(h=>h.remove());const o=[s,...Array.from(s.querySelectorAll("*"))];for(const p of o){const h=Array.from(p.classList).filter(v=>!v.startsWith(Ge));h.length?p.className=h.join(" "):p.removeAttribute("class"),p.removeAttribute("data-reactroot"),p.getAttribute("role")==="button"&&!p.getAttribute("aria-label")&&(p.removeAttribute("role"),p.removeAttribute("tabindex"))}s.style.boxShadow="";const u=`MMACF \u2014 ${n.surface}`;return`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${Xe(u)}</title>
<style>
  /* The only global rules. Everything else is inline on the elements, exported
     exactly as the component library rendered it. */
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: #f5f5f5;
    font-family: 'Segoe UI', Roboto, -apple-system, sans-serif;
    display: flex;
    justify-content: center;
    padding: 24px 0;
  }
  .mmacf-export { flex: 0 0 auto; background: #fff; }
  a { color: inherit; text-decoration: none; }
</style>
</head>
<body>
<div class="mmacf-export" style="width:${n.width}px">
${s.outerHTML}
</div>
</body>
</html>
`}function Xe(t){return t.replace(/[&<>"]/g,n=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[n])}function Ke(t,n){const s=new Blob([t],{type:"text/html;charset=utf-8"}),o=URL.createObjectURL(s),u=document.createElement("a");u.href=o,u.download=n,document.body.appendChild(u),u.click(),u.remove(),setTimeout(()=>URL.revokeObjectURL(o),0)}var e=(0,k.__toESM)((0,k.require_jsx_runtime)(),1),Qe=1;function Ze(t,n,s,o,u){return JSON.stringify({version:Qe,surface:t,query:n,blocks:s,items:o,suggestions:u},null,2)}function et(t){try{const n=JSON.parse(t);if(!n||typeof n!="object"||!Array.isArray(n.blocks)||!F.some(o=>o.id===n.surface))return null;const s=n.blocks.map(c.migrateImageCardBlock);return s.some(o=>!(0,c.bySlug)(o.slug))?null:{version:n.version??0,surface:n.surface,query:n.query??"",blocks:s.map(o=>({...o,values:(0,c.normalizePropValues)((0,c.bySlug)(o.slug).props,o.values)})),items:Array.isArray(n.items)?n.items:[],suggestions:Array.isArray(n.suggestions)?n.suggestions:[]}}catch{return null}}function I(){return(0,c.bySlug)("image-tile")}function we(t){if(!t)return{};const n={};for(const s of I().props){const o=t[s.name];o!==void 0&&(n[s.name]=s.kind==="select"&&s.numeric?Number(o):o)}return n}function be(t){if(!t)return"";const n=[];for(const s of I().props){const o=t[s.name];o!==void 0&&(s.kind==="boolean"?n.push(`${s.name}: ${o?"true":"false"}`):s.kind==="select"&&s.numeric?n.push(`${s.name}: ${o}`):n.push(`${s.name}: '${o}'`))}return n.join(", ")}var te=1,F=[{id:"serp",name:"SERP \xB7 Image Answer",note:"Bing shell + the MM block, left-anchored at x 160. Waterfall clipped to 1200 \xD7 424.",width:1440,column:{width:1280,marginLeft:160,padding:"16px 0",gap:16},preset:[["header",{title:"Image of Living Room",showSubTitle:!1}],["content",{layout:"Waterfall"}],["footer",{clickAction:"Expansion: See more"}]],chrome:["<BingShell />"],columnChrome:[]},{id:"irp",name:"IRP \xB7 Whole Page",note:"Bing shell with IMAGES scope + subcategories, RS on Top, then the dense grid. No Header/Footer on this surface.",width:1440,column:{width:1360,marginLeft:"auto",padding:"24px 0 16px",gap:16},contentWidth:1360,preset:[["rs-on-top",{}],["content",{layout:"Dense"}]],chrome:['<BingShell activeScope="IMAGES" subcategories query="Living Room" />'],columnChrome:[]},{id:"blank",name:"Blank",note:"No page shell. Stack anything, any width.",width:0,column:{width:0,marginLeft:"auto",padding:"0",gap:10},preset:[],chrome:[],columnChrome:[]}];function ne(t){return F.find(n=>n.id===t)}function je(t){return t.preset.map(([n,s])=>{const o=(0,c.bySlug)(n);return{id:te++,slug:n,values:{...(0,c.defaults)(o.props),...s},live:{}}})}function tt(t,n,s,o){const u=!!s&&s.length>0,p=u&&!!o&&o.length>0,h=t.map(x=>{const C=(0,c.bySlug)(x.slug),R=c.TAGS[x.slug]??C.name.replace(/\s/g,""),_=(0,c.jsxProps)(C,x.values,x.live);if(x.slug==="content"){n.contentWidth&&_.push(`width={${n.contentWidth}}`),u&&_.push("items={items}");const M=be(x.tileAll);M&&_.push(`tile={{ ${M} }}`);const D=Object.entries(x.tileOne??{}).map(([L,U])=>[L,be(U)]).filter(([,L])=>L!=="");D.length&&_.push(`tiles={{
${D.map(([L,U])=>`    ${L}: { ${U} },`).join(`
`)}
  }}`)}return x.slug==="rs-on-top"&&(n.contentWidth&&_.push(`width={${n.contentWidth-34}}`),p&&_.push("suggestions={suggestions}")),_.length?`<${R}
${_.map(M=>`  ${M}`).join(`
`)}
/>`:`<${R} />`}),v=(u?`const items = ${JSON.stringify(s,null,2)}

`:"")+(p?`const suggestions = ${JSON.stringify(o,null,2)}

`:"");if(n.id==="blank"){if(!h.length)return"<Page />";const x=h.map(C=>H(C,6)).join(`
`);return`${v}export function Page() {
  return (
    <div className="mm-page">
${x}
    </div>
  )
}`}const l=n.column,b=l.marginLeft==="auto"?"margin: '0 auto'":`marginLeft: ${l.marginLeft}`,d=n.chrome.map(x=>H(x,6)).join(`
`),g=n.columnChrome.map(x=>H(x,8)).join(`
`),N=h.map(x=>H(x,8)).join(`
`);return[`${v}export function Page() {`,"  return (",`    <div style={{ width: ${n.width}, background: '#fff', overflow: 'hidden' }}>`,d,"      <div","        style={{","          display: 'flex',","          flexDirection: 'column',","          alignItems: 'flex-start',",`          gap: ${l.gap},`,`          width: ${l.width},`,`          ${b},`,`          padding: '${l.padding}',`,"        }}","      >",g,N,"      </div>","    </div>","  )","}"].filter(x=>x!=="").join(`
`)}function H(t,n){const s=" ".repeat(n);return t.split(`
`).map(o=>s+o).join(`
`)}function ke(){const[t,n]=w.useState("serp"),s=ne(t),[o,u]=w.useState(()=>je(ne("serp"))),[p,h]=w.useState(null),[v,l]=w.useState(null),[b,d]=w.useState(!1),[g,N]=w.useState("jsx"),[x,C]=w.useState(!1),[R,_]=w.useState(null),[M,D]=w.useState(!1),L=w.useRef(null),[U,se]=w.useState(!0),[ae,oe]=w.useState(!0),[Y,le]=w.useState("Living Room"),[$,z]=w.useState([]),[q,G]=w.useState([]),[ie,V]=w.useState(null),[J,Ne]=w.useState(!0),X=w.useCallback(async a=>{le(a),V(null);try{const r=await We(a);z(r.images),G(r.suggestions)}catch(r){z([]),G([]),V(r instanceof Error?r.message:String(r))}},[]),_e=w.useMemo(()=>tt(o,s,J?$:void 0,J?q:void 0),[o,s,J,$,q]),O=w.useMemo(()=>(0,c.generateMosaicPage)(o,t,s.column.width||void 0),[o,s.column.width,t]),re=g==="sdl"?JSON.stringify(O.node,null,2):_e,A=o.find(a=>a.id===p)??null,W=A?(0,c.bySlug)(A.slug):null,$e=a=>{n(a),u(je(ne(a))),h(null),l(null)},ce=a=>{h(a),l(null)},Ce=a=>{const r=(0,c.bySlug)(a);if(!r)return;const i={id:te++,slug:a,values:(0,c.defaults)(r.props),live:{}};u(m=>[...m,i]),h(i.id)},K=a=>{u(r=>r.filter(i=>i.id!==a)),h(r=>r===a?null:r),l(null)},de=(a,r,i,m)=>{r!==null&&u(f=>f.map(y=>{if(y.id!==a)return y;if(r==="all"){const j=y.tileAll??(0,c.defaults)(I().props);return{...y,tileAll:{...j,[i]:m}}}const E=y.tileOne?.[r]??(0,c.defaults)(I().props);return{...y,tileOne:{...y.tileOne??{},[r]:{...E,[i]:m}}}}))},ue=(a,r)=>u(i=>{const m=i.findIndex(E=>E.id===a),f=m+r;if(m<0||f<0||f>=i.length)return i;const y=i.slice();return[y[m],y[f]]=[y[f],y[m]],y}),pe=(a,r,i)=>u(m=>m.map(f=>f.id===a?{...f,values:(0,c.updatePropValue)((0,c.bySlug)(f.slug).props,f.values,r,i),...f.slug==="slideshow"?{live:{}}:{}}:f)),me=(a,r,i,m)=>{const f=a.target;if(!f||f.isContentEditable)return;const y=(f.textContent??"").trim();if(!y)return;const E=o.find(S=>S.id===r);if(!E)return;const j=[];if(m!==null){const S=(m==="all"?E.tileAll:E.tileOne?.[m])??(0,c.defaults)(I().props);for(const T of I().props)T.kind==="text"&&String(S[T.name]??T.default).trim()===y&&j.push({scope:"tile",name:T.name})}for(const S of(0,c.bySlug)(i)?.props??[])S.kind==="text"&&String(E.values[S.name]??S.default).trim()===y&&j.push({scope:"block",name:S.name});const P=j[0];if(!P)return;a.stopPropagation(),a.preventDefault(),f.contentEditable="true",f.focus();const B=document.createRange();B.selectNodeContents(f);const ge=window.getSelection();ge?.removeAllRanges(),ge?.addRange(B);const Z=S=>{f.contentEditable="false",f.removeEventListener("blur",fe),f.removeEventListener("keydown",xe);const T=(f.textContent??"").trim();S&&T&&T!==y?P.scope==="tile"?de(r,m,P.name,T):pe(r,P.name,T):f.textContent=y},fe=()=>Z(!0),xe=S=>{S.key==="Enter"&&(S.preventDefault(),Z(!0)),S.key==="Escape"&&(S.preventDefault(),Z(!1))};f.addEventListener("blur",fe),f.addEventListener("keydown",xe)},Ae=w.useCallback(a=>r=>u(i=>i.map(m=>m.id===a?{...m,live:r}:m)),[]),Ee=async()=>{await navigator.clipboard.writeText(re),d(!0),setTimeout(()=>d(!1),1400)},Pe=async()=>{await navigator.clipboard.writeText(Ye(F)),D(!0),setTimeout(()=>D(!1),1400)},[he,Q]=w.useState(""),Re=async()=>{if(L.current){Q("Preparing HTML\u2026");try{const a=await Ve(L.current,{surface:s.name,width:s.width||L.current.offsetWidth});Ke(a,`mmacf-${t}-${o.length}blocks.html`),Q("HTML downloaded. Image cards and SlideShow include embedded assets; interactions are a visual snapshot.")}catch(a){Q(`Export failed: ${a instanceof Error?a.message:String(a)}`)}}},Le=async()=>{await navigator.clipboard.writeText(Ze(t,Y,o,$,q)),C(!0),setTimeout(()=>C(!1),1400)},Oe=()=>{const a=window.prompt("Paste page state JSON:");if(a===null)return;const r=et(a);if(!r){_("Could not parse that \u2014 not a valid page state JSON."),setTimeout(()=>_(null),3e3);return}n(r.surface),u(r.blocks.map(i=>({...i,id:te++}))),le(r.query),z(r.items),G(r.suggestions),h(null),l(null),V(null),_(null)};return(0,e.jsxs)("main",{className:"main",children:[(0,e.jsxs)("div",{className:"page-header",children:[(0,e.jsx)("h2",{children:"Playground"}),(0,e.jsxs)("div",{className:"meta",children:[(0,e.jsx)("span",{className:"chip chip--tier",children:"PAGE ASSEMBLY"}),(0,e.jsx)("span",{className:"chip",children:s.name}),(0,e.jsxs)("span",{className:"chip",children:[o.length," blocks"]}),$.length>0&&(0,e.jsxs)("span",{className:"chip",children:["live \xB7 ",$.length," images"]}),ie&&(0,e.jsxs)("span",{className:"chip",children:["search failed: ",ie]})]})]}),(0,e.jsx)("p",{className:"overview",children:"Start from a real surface, then add, reorder and retune blocks inside it. Copy the whole page when it looks right."}),(0,e.jsx)("div",{className:"pg__surfaces",children:F.map(a=>(0,e.jsxs)("button",{className:"pg__surface"+(a.id===t?" pg__surface--on":""),onClick:()=>$e(a.id),children:[(0,e.jsx)("strong",{children:a.name}),(0,e.jsx)("span",{children:a.note})]},a.id))}),(0,e.jsxs)("div",{className:"pg"+(U?"":" pg--no-l")+(ae?"":" pg--no-r"),children:[U?(0,e.jsxs)("aside",{className:"pg__palette",children:[(0,e.jsxs)("div",{className:"pg__panel-head",children:[(0,e.jsx)("h3",{children:"Add component"}),(0,e.jsx)("button",{className:"pg__collapse",onClick:()=>se(!1),"aria-label":"Hide component palette",children:"\u2039"})]}),c.components.filter(a=>c.RENDERERS[a.slug]).map(a=>{const r=o.filter(m=>m.slug===a.slug),i=r.length;return(0,e.jsxs)("button",{className:"pg__add"+(i?" pg__add--on":""),onClick:()=>Ce(a.slug),children:[(0,e.jsx)("span",{children:a.name}),i>0&&(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)("span",{className:"pg__add-count",children:i}),(0,e.jsx)("span",{role:"button",tabIndex:0,className:"pg__add-x","aria-label":`Remove ${a.name}`,onClick:m=>{m.stopPropagation(),K(r[i-1].id)},onKeyDown:m=>{(m.key==="Enter"||m.key===" ")&&(m.preventDefault(),m.stopPropagation(),K(r[i-1].id))},children:"\u2715"})]}),(0,e.jsx)("span",{className:"pg__add-tier",children:a.tier[0]})]},a.slug)})]}):(0,e.jsx)("button",{className:"pg__rail",onClick:()=>se(!0),"aria-label":"Show component palette",children:"Add \u203A"}),(0,e.jsx)("div",{className:"pg__canvas",children:(0,e.jsxs)("div",{className:"pg__frame",ref:L,style:s.width?{width:s.width,background:"#fff"}:void 0,children:[t==="serp"&&(0,e.jsx)(c.BingShell,{query:Y,onSearch:X}),t==="irp"&&(0,e.jsx)(c.BingShell,{activeScope:"IMAGES",subcategories:!0,query:Y,onSearch:X}),(0,e.jsx)("div",{className:"pg__column",style:s.width?{display:"flex",flexDirection:"column",alignItems:"flex-start",gap:s.column.gap,width:s.column.width,marginLeft:s.column.marginLeft,marginRight:s.column.marginLeft==="auto"?"auto":void 0,padding:s.column.padding,boxSizing:"border-box"}:void 0,children:o.length===0?(0,e.jsx)("div",{className:"callout",children:"Empty page. Add a component from the left."}):(()=>{const a=new Map;let r=0;for(const i of o){if(i.slug!=="content")continue;const m=(0,c.tileCount)(i.values.layout);a.set(i.id,$.slice(r,r+m)),r+=m}return o.map((i,m)=>{const f=c.RENDERERS[i.slug],y=(0,c.bySlug)(i.slug),E=i.id===p;return(0,e.jsxs)("div",{className:"pg__block"+(E?" pg__block--on":""),onClickCapture:y.previewSize||y.previewSizes?()=>ce(i.id):void 0,onClick:()=>ce(i.id),onDoubleClick:j=>me(j,i.id,i.slug,null),children:[(0,e.jsxs)("div",{className:"pg__block-chrome",children:[(0,e.jsx)("span",{className:"pg__block-name",children:y.name}),(0,e.jsx)("button",{onClick:j=>{j.stopPropagation(),ue(i.id,-1)},disabled:m===0,"aria-label":"Move up",children:"\u2191"}),(0,e.jsx)("button",{onClick:j=>{j.stopPropagation(),ue(i.id,1)},disabled:m===o.length-1,"aria-label":"Move down",children:"\u2193"}),(0,e.jsx)("button",{onClick:j=>{j.stopPropagation(),K(i.id)},"aria-label":"Remove",children:"\u2715"})]}),i.slug==="content"?(0,e.jsx)(c.Content,{layout:i.values.layout,width:s.contentWidth??1200,items:a.get(i.id)??$,gap:i.values.gap===void 0?16:Number(i.values.gap),tile:we(i.tileAll),tiles:Object.fromEntries(Object.entries(i.tileOne??{}).map(([j,P])=>[j,we(P)])),renderTile:(j,P)=>(0,e.jsx)("div",{className:"pg__tile"+(E&&(v===P||v==="all")?" pg__tile--on":""),onClick:B=>{B.stopPropagation(),h(i.id),l(P)},onDoubleClick:B=>{B.stopPropagation(),h(i.id),l(P),me(B,i.id,i.slug,P)},children:j})}):i.slug==="rs-on-top"?(0,e.jsx)(c.RSOnTop,{label:i.values.label,showGradient:i.values.showGradient!==!1,showScrollButton:i.values.showScrollButton!==!1,width:s.contentWidth?s.contentWidth-34:void 0,suggestions:q,onPick:X}):f(i.values,Ae(i.id),i.live)]},i.id)})})()})]})}),ae?(0,e.jsxs)("aside",{className:"panel pg__inspector",children:[(0,e.jsxs)("div",{className:"pg__panel-head",children:[(0,e.jsx)("span",{}),(0,e.jsx)("button",{className:"pg__collapse",onClick:()=>oe(!1),"aria-label":"Hide inspector",children:"\u203A"})]}),!A||!W?(0,e.jsx)("p",{className:"notes",style:{paddingLeft:0},children:"Select a block to edit its variants."}):(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)("h3",{children:W.name}),(0,e.jsx)(Se,{props:W.props,values:A.values,onSet:(a,r)=>pe(A.id,a,r)}),A.slug==="content"&&(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)("h3",{style:{marginTop:18},children:"Image Tiles"}),(0,e.jsxs)("div",{className:"field",children:[(0,e.jsx)("label",{className:"field__label",htmlFor:"pg-tile-target",children:"edit"}),(0,e.jsxs)("select",{id:"pg-tile-target",value:v===null?"":String(v),onChange:a=>l(a.target.value===""?null:a.target.value==="all"?"all":Number(a.target.value)),children:[(0,e.jsx)("option",{value:"",children:"\u2014 none \u2014"}),(0,e.jsx)("option",{value:"all",children:"All tiles"}),Array.from({length:(0,c.tileCount)(A.values.layout)}).map((a,r)=>(0,e.jsxs)("option",{value:r,children:["Tile #",r+1]},r))]})]}),v!==null&&(0,e.jsx)(Se,{idPrefix:"pgt-",props:I().props,values:(v==="all"?A.tileAll:A.tileOne?.[v])??(0,c.defaults)(I().props),onSet:(a,r)=>de(A.id,v,a,r)})]}),(0,e.jsx)("button",{className:"panel__reset",onClick:()=>u(a=>a.map(r=>r.id===A.id?{...r,values:(0,c.defaults)(W.props),live:{},tileAll:void 0,tileOne:void 0}:r)),children:"Reset to defaults"})]})]}):(0,e.jsx)("button",{className:"pg__rail",onClick:()=>oe(!0),"aria-label":"Show inspector",children:"\u2039 Edit"})]}),(0,e.jsxs)("div",{className:"section",children:[(0,e.jsxs)("div",{className:"code-toolbar",children:[(0,e.jsx)("div",{className:"section__title",style:{marginBottom:0},children:"Copy page"}),(0,e.jsxs)("div",{className:"code-tabs","aria-label":"Page output format",children:[(0,e.jsx)("button",{className:g==="jsx"?"code-tab code-tab--active":"code-tab",onClick:()=>N("jsx"),type:"button",children:"MM JSX"}),(0,e.jsx)("button",{className:g==="sdl"?"code-tab code-tab--active":"code-tab",onClick:()=>N("sdl"),type:"button",children:"Mosaic SDL"})]})]}),g==="jsx"&&(0,e.jsxs)("label",{style:{display:"flex",alignItems:"center",gap:8,margin:"0 0 8px",fontSize:13,opacity:$.length?1:.45,cursor:$.length?"pointer":"not-allowed"},children:[(0,e.jsx)("input",{type:"checkbox",checked:J&&$.length>0,disabled:$.length===0,onChange:a=>Ne(a.target.checked)}),"Include live data (",$.length," images) \u2014 uncheck to use the Figma default artwork and wire your own source"]}),(0,e.jsxs)("div",{className:"code",children:[(0,e.jsx)("pre",{children:re}),(0,e.jsx)("button",{className:"code__copy",onClick:Ee,children:b?"Copied \u2713":"Copy code"})]}),g==="sdl"&&(0,e.jsxs)("div",{className:"sdl-report",children:[(0,e.jsxs)("div",{className:"sdl-report__summary",children:[(0,e.jsx)("span",{className:O.validation.valid?"sdl-status sdl-status--valid":"sdl-status sdl-status--error",children:O.validation.valid?`\u2713 Catalog valid \xB7 ${O.validation.nodeCount} nodes`:`\u2715 ${O.validation.issues.length} validation errors`}),(0,e.jsxs)("span",{className:"sdl-report__catalog",children:["Mosaic full \xB7 CLI ",c.mosaicCatalogSnapshot.mosaicCliVersion," \xB7"," ",c.mosaicCatalogSnapshot.componentCount," components"]})]}),O.validation.issues.length>0&&(0,e.jsx)("ul",{className:"sdl-report__errors",children:O.validation.issues.map(a=>(0,e.jsxs)("li",{children:[(0,e.jsx)("code",{children:a.path})," \u2014 ",a.message]},`${a.path}-${a.message}`))}),O.warnings.length>0&&(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)("div",{className:"sdl-report__label",children:"Portable fallback / gaps"}),(0,e.jsx)("ul",{className:"sdl-report__warnings",children:O.warnings.map(a=>(0,e.jsx)("li",{children:a},a))})]})]}),(0,e.jsxs)("div",{className:"export-row",children:[(0,e.jsx)("button",{className:"btn",onClick:Le,children:x?"Copied \u2713":"Copy full state"}),(0,e.jsx)("button",{className:"btn",onClick:Oe,children:"Load state"}),(0,e.jsx)("span",{className:"export-row__note"+(R?" export-row__note--err":""),children:R??"Full snapshot JSON \u2014 paste it back into Load state to restore this canvas exactly."})]}),(0,e.jsxs)("div",{className:"export-row",children:[(0,e.jsx)("span",{role:"status",style:{fontSize:12},children:he}),(0,e.jsx)("button",{className:"btn",onClick:Re,disabled:he==="Preparing HTML\u2026",children:"Export HTML"}),(0,e.jsx)("span",{className:"export-row__note",children:"A single .html file \u2014 inline styles, no component library required. Send it to a PM or drop it in a deck."})]})]}),(0,e.jsxs)("div",{className:"section",children:[(0,e.jsx)("div",{className:"section__title",children:"Assemble with AI"}),(0,e.jsxs)("p",{style:{fontSize:13,lineHeight:"20px",margin:"0 0 10px",maxWidth:"68ch"},children:["Copy the prompt below into your own Copilot or Claude, describe the page you want in plain language (\u201Can IRP with related searches on top and two rows of dense grid\u201D), then paste the JSON it returns into ",(0,e.jsx)("strong",{children:"Load state"})," above \u2014 the canvas builds itself. The prompt is generated live from the component registry, so it can never drift from the real schema."]}),(0,e.jsxs)("div",{className:"export-row",style:{marginTop:0},children:[(0,e.jsx)("button",{className:"btn btn--primary",onClick:Pe,children:M?"Copied \u2713":"Copy AI prompt"}),(0,e.jsxs)("span",{className:"export-row__note",children:[c.components.length," components \xB7 ",F.length," surfaces \xB7 includes few-shot examples"]})]})]})]})}function Se({props:t,values:n,onSet:s,idPrefix:o="pg-"}){const u=l=>t.filter(b=>b.under===l),p=t.filter(l=>!l.under),h=l=>l.kind==="select"?(0,e.jsxs)("div",{className:"field",children:[(0,e.jsx)("label",{className:"field__label",htmlFor:`${o}${l.name}`,children:l.name}),(0,e.jsx)("select",{id:`${o}${l.name}`,value:String(n[l.name]),onChange:b=>s(l.name,b.target.value),children:(0,c.selectOptions)(l,n).map(b=>(0,e.jsx)("option",{value:b,children:b},b))})]},l.name):l.kind==="text"?(0,e.jsxs)("div",{className:"field",children:[(0,e.jsx)("label",{className:"field__label",htmlFor:`${o}${l.name}`,children:l.name}),(0,e.jsx)("input",{id:`${o}${l.name}`,type:"text",value:String(n[l.name]??""),onChange:b=>s(l.name,b.target.value)})]},l.name):(0,e.jsxs)("div",{className:"field--bool",children:[(0,e.jsx)("input",{id:`${o}${l.name}`,type:"checkbox",checked:!!n[l.name],onChange:b=>s(l.name,b.target.checked)}),(0,e.jsx)("label",{htmlFor:`${o}${l.name}`,children:l.name})]},l.name),v=l=>{const b=u(l.name);return b.length?(0,e.jsxs)("div",{children:[h(l),!!n[l.name]&&(0,e.jsx)("div",{className:"field__sub",children:b.map(h)})]},l.name):h(l)};return(0,e.jsxs)(e.Fragment,{children:[p.filter(l=>l.kind==="select").map(v),p.some(l=>l.kind==="text")&&(0,e.jsx)("h3",{style:{marginTop:18},children:"Content"}),p.filter(l=>l.kind==="text").map(v),p.some(l=>l.kind==="boolean")&&(0,e.jsx)("h3",{style:{marginTop:18},children:"Slots"}),p.filter(l=>l.kind==="boolean").map(v)]})}

});