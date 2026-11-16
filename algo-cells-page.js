// Documentation composes the same complete card renderers used by the Organisms.
(()=>{
 const image='algo-public-assets-mm-thumbnail-placeholder.png';
 const icon='algo-public-assets-placeholder-thumbnail.png';
 const figma=node=>'https://www.figma.com/design/FCnmkxLq92iz995JhyN5N1/Algo-Design-Library?node-id='+node;
 const candidateDefinitions=typeof AlgoCellCandidates==='undefined'?[]:AlgoCellCandidates.definitions;
 const definitions=[...candidateDefinitions,
  {id:'deeplink',name:'Deeplink Item',description:'A destination within a website. Standard links navigate directly; Expandable links reveal supporting details before continuing to the source.',source:'Mainline Expansion · Multiple Images',page:'algo-expansion.html',desktop:'277-6911',mobile:'867-32171',props:[['title','Section title'],['summary','Collapsed preview summary'],['image','Optional thumbnail'],['keyword, sentence','Expanded heading variants'],['body','Expanded content'],['href','Continue reading destination']]},
  {id:'favicon',name:'Favicon',description:'The site icon inside its circular container. Use it to identify the source of an Algo result.',source:'Mainline Rich Nav Carousel',page:'algo-rich-nav-carousel.html',desktop:'284-34561',mobile:'748-38472',props:[['icon','Site icon image']]},
  {id:'attribution',name:'Attribution',description:'A site name and displayed URL or breadcrumb. Pair it with a favicon to identify an Algo result source.',source:'Mainline Rich Nav Carousel',page:'algo-rich-nav-carousel.html',desktop:'284-34561',mobile:'748-38472',props:[['name','Site name'],['url','Displayed URL or breadcrumb; text, not a navigation target']]},
  {id:'image-card',name:'Image Card',description:'An image destination with an overlaid headline and source. Combine cards into a related-content group.',source:'Sectional Rich Nav Carousel',page:'algo-sectional-rich-nav.html',desktop:'308-14592',mobile:'904-29358',props:[['title','Destination headline'],['image','Preview image'],['name, url, icon','Source attribution'],['href','Destination URL']]},
  {id:'article-card',name:'Article Card',description:'An article recommendation with a headline and source, with an optional description. The whole card opens the article.',source:'Sectional Nav · With Magazine',page:'algo-sectional-nav.html',desktop:'304-5461',mobile:'902-19006',props:[['title','Article headline'],['description','Optional article summary'],['source, icon','Publisher and time'],['image','Optional thumbnail'],['href','Article URL']]},
  {id:'action-card',name:'Action Card',description:'A title, explanation, and labelled action for a task such as signing in. The action button opens the destination.',source:'Sectional Nav · Without Magazine',page:'algo-sectional-nav.html',desktop:'304-6458',mobile:'882-10635',props:[['title, description','Task and supporting explanation'],['action','Action label'],['image','Optional supporting image'],['href','Action destination URL']]},
  {id:'download-card',name:'Download Card',description:'An application summary and download action, with an optional application icon. Keep the platform in the action label.',source:'Sectional Nav · Without Magazine',page:'algo-sectional-nav.html',desktop:'304-6458',mobile:'882-10635',props:[['title, description','Application name and explanation'],['action','Download label and platform'],['image','Optional application icon'],['href','Download destination URL']]}
 ];
 const routes={'deeplink':'algo-cells-deeplink.html','favicon':'algo-cells-favicon.html','attribution':'algo-cells-attribution.html','image-card':'algo-cells.html','article-card':'algo-cells-article-card.html','action-card':'algo-cells-action-card.html','download-card':'algo-cells-download-card.html'};
 const cell=definitions.find(item=>item.id===document.body.dataset.cell);
 if(!cell)return;
 const candidate=candidateDefinitions.includes(cell)?cell:null;
 // Preserve links shared while Cells used a single-page catalog.
 const oldCell=location.hash.slice(1);
 if(cell.id==='image-card'&&routes[oldCell]&&oldCell!=='image-card'){
  location.replace(routes[oldCell]+location.search);return;
 }
 const options={kind:cell.id==='article-card'?'article':cell.id.split('-')[0],images:'with',open:false,summary:'keyword',variant:new URLSearchParams(location.search).get('variant')==='expandable'?'expandable':'standard',interaction:'default'};
 if(candidate)for(const control of candidate.controls)options[control.key]=control.defaultValue;
 let device=new URLSearchParams(location.search).get('device')==='mobile'?'mobile':'desktop';
 const sourceCell=['favicon','attribution'].includes(cell.id);
 const sourceUses=[
  ['Mainline · Algo Block','algo-algo-block.html'],
  ['Mainline · MM Algo Block','algo-mm-algo.html'],
  ['Mainline · Rich Nav Carousel','algo-rich-nav-carousel.html'],
  ['Mainline · Expansion','algo-expansion.html'],
  ['Mainline · Nav','algo-nav.html'],
  ['Sectional · Rich Nav Carousel','algo-sectional-rich-nav.html'],
  ['Sectional · Expansion','algo-sectional-expansion.html'],
  ['Sectional · Nav','algo-sectional-nav.html']
 ];
 const deeplink=cell.id==='deeplink';
 const standard=()=>deeplink&&options.variant==='standard';
 function sample(cell){
  if(candidate)return candidate.sample(options,device);
  if(standard())return {label:device==='mobile'?'Deeplink':'Deeplink lorem ipsum',href:'https://example.com'};
  if(deeplink)return {title:'Section Title',summary:'Snippet lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.',image:'algo-public-assets-mm-image-placeholder-square.png',keyword:'Keyword',sentence:'Sentence lorem ipsum dolor sit amet, consectetur adipisicing elit',body:'Snippet lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',href:'https://example.com'};
  if(sourceCell)return {icon,name:'Site name lorem ipsum',url:'www.algoloremipsum-attribution.com › ... › ipsum'};
  if(cell.id==='image-card')return {title:'Article title lorem ipsum',name:'Site name',url:'https://example.com',icon,href:'https://example.com',image:device==='mobile'?icon:image};
  return {kind:options.kind,title:cell.id==='download-card'?'Application name':cell.id==='action-card'?'Title lorem ipsum':'Title lorem ipsum dolor consectatur',
   ...(options.kind==='description'||cell.id!=='article-card'?{description:cell.id==='article-card'?'Snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet.':'Snippet lorem ipsum dolor sit amet.'}:{}),
   source:'Site name · 3h',icon,image:device==='mobile'?icon:image,href:'https://example.com',action:cell.id==='download-card'?'Download for Windows':'Sign in'};
 }
 function preview(cell){
  if(candidate)return candidate.preview(options,device);
  if(standard())return `<div class="cell-preview algo cell-wide-preview nav-result ${device==='mobile'?'algo-mobile mainline-mobile':''}" data-state="${options.interaction}"><nav class="nav-links" aria-label="Website destination">${AlgoCells.navLinkItem(sample(cell))}</nav></div>`;
  if(deeplink)return `<div class="cell-preview algo expansion-algo cell-deeplink-preview ${device==='mobile'?'algo-mobile mainline-mobile':''}" data-cell="deeplink"><div class="expansion-rows">${AlgoCells.deeplinkItem(sample(cell),{device,open:options.open,summary:options.summary,missing:options.images==='without'?'images':''})}</div></div>`;
  if(sourceCell)return `<div class="cell-preview algo cell-source-preview ${device==='mobile'?'algo-mobile':''}" data-cell="${cell.id}"><div class="attribution">${AlgoCells[cell.id](sample(cell))}</div></div>`;
  const scope=cell.id==='image-card'?'sectional-rich':'sectional-nav';
  const mobile=device==='mobile'?' sectional-mobile'+(cell.id==='image-card'?'':' sn-mobile'):'';
  const card=cell.id==='image-card'?AlgoCells.imageCard(sample(cell)):AlgoCells.supportCard(sample(cell),options);
  return `<div class="cell-preview ${scope}${mobile}" data-cell="${cell.id}">${card}</div>`;
 }
 function exportHTML(cell){
  const css=['algo-styles.css','algo-algo-block.css',...(candidate?candidate.styles:deeplink?[standard()?'algo-nav.css':'algo-expansion.css','algo-mainline-mobile.css']:[]),sourceCell?'algo-algo-mobile.css':cell.id==='image-card'?'algo-sectional-rich-nav.css':'algo-sectional-nav.css',...(device==='mobile'?['algo-sectional-mobile.css','algo-sectional-nav-mobile.css','algo-mobile-figma.css']:['algo-desktop-figma.css']),'algo-cells.css','algo-component-responsive.css'];
  return '<!-- Use with body data-device="'+device+'". Asset paths are relative to the library root. -->\n'+css.map(path=>`<link rel="stylesheet" href="${path}">`).join('\n')+'\n'+preview(cell);
 }
 const get=id=>document.getElementById(id);
 function row(prop,type,values,value){
  const tr=document.createElement('tr');
  for(const [index,text] of [prop,type,values,value].entries()){
   const td=document.createElement(index===0?'th':'td');
   if(index===0)td.scope='row';
   if(index===0||index===3){const code=document.createElement('code');code.textContent=text;td.append(code);}
   else td.textContent=text;
   if(index===3)td.className='properties-default';tr.append(td);
  }
  return tr;
 }
 function render(){
  document.body.dataset.device=device;
  if(deeplink)document.body.dataset.cellVariant=options.variant;
  get('resultMount').innerHTML=preview(cell);
  candidate?.afterRender?.(get('resultMount'),options,device);
  get('codeSample').textContent=exportHTML(cell);
  get('cellDesignSource').href=figma(standard()?(device==='mobile'?'900-51479':'866-3083'):candidate?.sourceNode?.(options,device)||cell[device]);
  get('cellDesignSource').textContent='View in Figma';
  get('cellCopyStatus').textContent='';
  document.querySelectorAll('[data-cell-device]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.cellDevice===device)));
  const sourceLayout=candidate?(candidate.sourceLayout?.(options)||''):deeplink?(standard()?'':'multiple'):sourceCell||cell.id==='image-card'?'':cell.id==='article-card'?'magazine':'actions';
  get('usedInLink').href=(standard()?'algo-nav.html':cell.page)+'?device='+device+(sourceLayout?'&layout='+sourceLayout:'')+'#playground';
  get('usedInLink').textContent=standard()?'Mainline · Nav':cell.source;
  if(sourceCell){
   get('usedInLink').textContent=sourceUses[0][0];
   get('usedInLink').href=sourceUses[0][1]+'?device='+device+'#playground';
   get('usedInAdditionalLinks').innerHTML=sourceUses.slice(1).map(([label,page])=>`<a class="cell-used-in-link" href="${page}?device=${device}#playground">${label}</a>`).join('');
  }
  get('usedInDescription').textContent=candidate?'Candidate extracted from '+candidate.source+'. View the full Organism for its surrounding composition.':deeplink?(standard()?'Standard: a destination row below the primary result in Mainline Nav.':'Expandable: a section with inline details below the primary result in Mainline Expansion.'):sourceCell?'Appears in the primary result source row of all eight Organisms below, on Desktop and Mobile. Card-specific source treatments are documented with their respective cards. The preview Figma link opens Mainline Rich Nav Carousel.':cell.id==='image-card'?
   'Appears alongside the primary web result as a related image destination.':
   device==='mobile'?'Appears below the website links as a supporting '+(cell.id==='article-card'?'article recommendation.':cell.id==='action-card'?'task entry.':'application download.'):
   'Appears in the supporting card rail beside the primary web result and website links.';
  const defaults=candidate?candidate.sample(Object.fromEntries(candidate.controls.map(control=>[control.key,control.defaultValue])),device):sample(cell);
  if(cell.id==='article-card')defaults.description='';
  const body=get('cellProperties');body.replaceChildren();
  if(candidate)for(const control of candidate.controls)body.append(row(control.key,'select',control.values.map(value=>value[1]).join(' · '),control.values.find(value=>value[0]===control.defaultValue)[1]));
  if(deeplink){
   body.append(row('variant','select','Standard · Expandable','Standard'));
   body.append(row('state','select',standard()?'Default · Hover · Visited':'Collapsed · Expanded',standard()?'Default':'Collapsed'));
   if(!standard())body.append(row('heading','select','Keyword · Sentence','Keyword'));
   get('cellStandardState').hidden=!standard();
   for(const id of ['cellExpandableState','cellExpandableHeading','cellImageOption'])get(id).hidden=standard();
  }
  if(cell.id==='article-card')body.append(row('content','select','Article · Article with description','Article'));
  if(!candidate&&!sourceCell&&cell.id!=='image-card'&&!standard())body.append(row('images','select','With image · Without image','With image'));
  for(const [names,description] of standard()?[['label','Destination label'],['href','Destination URL']]:cell.props)for(const prop of names.split(', ')){
   const value=prop==='image'&&!deeplink&&!candidate?device==='mobile'?icon:image:prop==='description'&&cell.id==='article-card'?'':defaults[prop]||'';
   body.append(row(prop,['href','image','icon'].includes(prop)?'URL':'text',description,String(value)));
  }
 }
 const controls=get('cellControls');
 controls.innerHTML=(deeplink?'<label>Variant<select id="cellVariant"><option value="standard">Standard</option><option value="expandable">Expandable</option></select></label><label id="cellStandardState">State<select id="cellInteraction"><option value="default">Default</option><option value="hover">Hover</option><option value="visited">Visited</option></select></label><label id="cellExpandableState">State<select id="cellOpen"><option value="collapsed">Collapsed</option><option value="expanded">Expanded</option></select></label><label id="cellExpandableHeading">Heading<select id="cellHeading"><option value="keyword">Keyword</option><option value="sentence">Sentence</option></select></label>':'')+(cell.id==='article-card'?'<label>Content<select id="cellContent"><option value="article">Article</option><option value="description">Article with description</option></select></label>':'')+
  (!sourceCell&&cell.id!=='image-card'?'<label id="cellImageOption">Image<select id="cellImages"><option value="with">With image</option><option value="without">Without image</option></select></label>':'');
 if(candidate)controls.innerHTML=candidate.controls.map(control=>`<label>${control.label}<select id="cellCandidate-${control.key}">${control.values.map(([value,label])=>`<option value="${value}">${label}</option>`).join('')}</select></label>`).join('');
 controls.hidden=candidate?candidate.controls.length===0:sourceCell||cell.id==='image-card';
 controls.addEventListener('change',event=>{
  if(candidate){const key=event.target.id.replace('cellCandidate-','');if(candidate.controls.some(control=>control.key===key)){options[key]=event.target.value;render();}return;}
  if(event.target.id==='cellVariant')options.variant=event.target.value;
  if(event.target.id==='cellInteraction')options.interaction=event.target.value;
  if(event.target.id==='cellContent')options.kind=event.target.value;
  if(event.target.id==='cellImages')options.images=event.target.value;
  if(event.target.id==='cellOpen')options.open=event.target.value==='expanded';
  if(event.target.id==='cellHeading')options.summary=event.target.value;render();
 });
 get('resultMount').addEventListener('click',event=>{
  if(candidate){const focusSelector=candidate.click?.(event,options,get('resultMount'));if(focusSelector){for(const control of candidate.controls)get('cellCandidate-'+control.key).value=options[control.key];render();get('resultMount').querySelector(focusSelector)?.focus();}return;}
  if(!deeplink||standard()||!event.target.closest('.expansion-toggle'))return;
  options.open=!options.open;get('cellOpen').value=options.open?'expanded':'collapsed';render();
  get('resultMount').querySelector('.expansion-toggle').focus();
 });
 document.querySelectorAll('[data-cell-device]').forEach(button=>button.addEventListener('click',()=>{device=button.dataset.cellDevice;render();}));
 get('copyButton').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(exportHTML(cell));get('cellCopyStatus').textContent='HTML copied.';}
  catch{const selection=getSelection(),range=document.createRange();range.selectNodeContents(get('codeSample'));selection.removeAllRanges();selection.addRange(range);get('cellCopyStatus').textContent='HTML selected. Press Ctrl+C or ⌘C to copy.';}
 });
 if(deeplink)get('cellVariant').value=options.variant;
 render();
})();
