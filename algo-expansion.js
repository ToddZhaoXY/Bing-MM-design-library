// Expansion is part of V4; the archived V3 package remains unchanged.
const expansionDescription='This feature organizes content from a destination page into expandable sections beneath a search result. It helps users scan key topics and expand relevant sections to read more detail directly on the results page, with links back to the source.';
Object.keys(variants).forEach(key=>delete variants[key]);
variants.single={label:'Single Image',description:'One thumbnail appears beside the main result, while the section rows remain text-only.'};
variants.multiple={label:'Multiple Images',description:'Each section has its own thumbnail positioned to the left of the text.'};
state.type=typeof location!=='undefined'&&new URLSearchParams(location.search).get('layout')==='multiple'?'multiple':'single';state.summary='keyword';state.interaction='default';state.expansionOpenIndex=0;
$('heroDescription').textContent=expansionDescription;
$('typeControl').innerHTML=Object.entries(variants).map(([key,item])=>`<option value="${key}">${item.label}</option>`).join('');
$('typeControl').value=state.type;
$('typeControl').closest('label').firstChild.textContent='Layout';
$('stateControl').innerHTML='<option value="default">Default</option><option value="hover">Hover</option><option value="expanded">Expanded</option><option value="visited">Visited</option>';
const expansionSummaryControl=document.createElement('label');
expansionSummaryControl.innerHTML='Summary<select id="summaryControl"><option value="default">Default</option><option value="keyword">Keyword</option><option value="sentence">Sentence</option></select>';
$('typeControl').closest('label').after(expansionSummaryControl);
$('summaryControl').onchange=event=>{
 const value=event.target.value;
 if(value!=='default')state.summary=value;
 state.interaction=value==='default'?'default':'expanded';
 $('stateControl').value=state.interaction;
 render();
};
const expansionPlaceholder='algo-public-assets-mm-image-placeholder-square.png';
const expansionSnippet='Oct 26, 2018 · Snippet lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, ipsum nostrud exercitation ullamco laboris sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
const expansionBody="Snippet lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, ipsum nostrud exercitation ullamco laboris sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Snippet Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt. Snippet Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
const expansionSummary='Summary lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
const expansionArrow='<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg>';
activeAnatomy=function(){return [...(state.device==='mobile'?mobileAnatomy.map(item=>item.slice()):anatomy.slice(0,4)),state.type==='multiple'?['Section Thumbnail','Each section has its own thumbnail positioned to the left of the text.']:['Image Caption',state.device==='mobile'?'An 88px thumbnail sits beside the snippet, below the attribution and title. Section rows remain text-only.':'One thumbnail appears beside the main result, while the section rows remain text-only. The size is aligned with the Image Caption.'],['Section Title','A label identifying the topic of each expandable section.'],['Section Summary','A concise preview beneath the section title, available in either keyword or sentence format.']]};
const expansionPin=index=>`<button type="button" class="pin" data-index="${index}" aria-label="${index+1}. ${activeAnatomy()[index][0]}" aria-describedby="anatomyDescription"><svg class="pin-number" viewBox="0 0 22 22" aria-hidden="true"><text x="11" y="11" text-anchor="middle" dominant-baseline="central">${index+1}</text></svg></button>`;
const expansionPart=(index,name,content,on)=>`<div class="part part-${name}">${on?expansionPin(index):''}${content}</div>`;
const expansionImage=(src,alt,size=108)=>`<img class="expansion-thumbnail" src="${src}" alt="${alt}" width="${size}" height="${size}">`;
let expansionMarkupId=0;
function expansionRows(items,{type,annotated=false,openIndex=-1,missing='',summary=state.summary}={}){
 if(missing==='both'&&state.device!=='mobile')return '';
 const prefix='expansion-'+(++expansionMarkupId);
 return `<div class="expansion-rows">${items.map((item,index)=>{
  return AlgoCells.deeplinkItem(item,{id:prefix+'-'+index,open:index===openIndex,type,missing,summary,annotated:annotated&&index===0,renderPart:expansionPart,renderPin:expansionPin,renderImage:expansionImage,arrow:expansionArrow,device:state.device});
 }).join('')}</div>`;
}
const expansionPlaceholderItems=count=>Array.from({length:count},()=>({title:'Section Title',summary:expansionSummary.replace('Summary','Snippet'),keyword:'Keyword',sentence:'Sentence lorem ipsum dolor sit amet, consectetur adipisicing elit',body:expansionBody,image:state.device==='mobile'?'algo-public-assets-mm-image-placeholder-square.png':expansionPlaceholder,imageAlt:'Visual content placeholder'}));
placeholderMarkup=function(type=state.type,annotated=false,interactive=false,missing=''){
 const images=missing!=='images'&&missing!=='both';
 const attribution=`<div class="attribution">${expansionPart(0,'favicon','<span class="favicon"><img src="algo-public-assets-placeholder-thumbnail.png" alt="" width="16" height="16"></span>',annotated)}${expansionPart(1,'source','<span class="source"><span>Site name lorem ipsum</span><small>www.algoloremipsum-attribution.com › ... › ipsum</small></span>',annotated)}</div>`;
 const title=expansionPart(2,'title',`<a class="result-title" href="#playground">${state.device==='mobile'&&type==='single'?'Title Lorem ipsum dolor sit amet':'Title lorem ipsum dolor consectatur'}</a>`,annotated);
 const snippet=expansionPart(3,'snippet',`<p class="snippet">${expansionSnippet}</p>`,annotated);
 const mainImage=type==='single'&&images?expansionPart(4,'mainMedia',expansionImage(expansionPlaceholder,'Visual content placeholder'),annotated):'';
 const items=expansionPlaceholderItems(missing==='summaries'||(state.device==='mobile'&&missing==='both')?4:3);
 if(missing==='summaries')items.forEach(item=>item.title=state.device==='mobile'?'Section Title':'Section');
 return `<article class="algo expansion-algo ${state.device==='mobile'?'algo-mobile mainline-mobile':''} ${annotated?'annotated':''}" data-layout="${type}"${state.device==='mobile'?` data-missing="${missing}"`:''} data-state="${interactive||annotated?state.interaction:'default'}">${state.device==='mobile'?`${attribution}${title}<div class="expansion-main"><div class="expansion-main-copy">${snippet}</div>${mainImage}</div>`:`<div class="expansion-main"><div class="expansion-main-copy">${attribution}${title}${snippet}</div>${mainImage}</div>`}${expansionRows(items,{type,annotated,missing,openIndex:(interactive||annotated)&&state.interaction==='expanded'?state.expansionOpenIndex:-1})}</article>`;
};
previewMarkup=function(){return placeholderMarkup(state.type,false,true)};
updateCodeSample=function(){$('summaryControl').value=state.interaction==='expanded'?state.summary:'default';$('codeSample').textContent='<link rel="stylesheet" href="algo-algo-block.css">\n<link rel="stylesheet" href="algo-expansion.css">\n'+(state.device==='mobile'?'<link rel="stylesheet" href="algo-mainline-mobile.css">\n':'')+(state.device==='desktop'?'<link rel="stylesheet" href="algo-desktop-figma.css">\n':'<link rel="stylesheet" href="algo-mobile-figma.css">\n')+'<link rel="stylesheet" href="algo-component-responsive.css">\n'+placeholderMarkup(state.type,false,state.device==='mobile').replace(/></g,'>\n<');if(typeof applyMosaicSDL==='function')applyMosaicSDL('expansion',state.device,state.type,state.summary)};
function renderExpansionFallback(){$('bothFallbackDescription').textContent=state.device==='mobile'?'Retain section titles and expansion controls in a text-only list when images and summaries are unavailable.':'The recommended fallback is to remove the expansion layout and display only the standard search result, including the favicon, attribution, title, and snippet.';$('fallbackMount').innerHTML=placeholderMarkup(state.type,false,false,$('fallbackControl').value)}
$('fallbackControl').onchange=renderExpansionFallback;
const mountTaiBody='Mount Tai (Chinese: 泰山; pinyin: Tài Shān) or Taishan is a mountain of historical and cultural significance located north of the city of Tai’an. It is the highest point in Shandong province, China. The tallest peak is the Jade Emperor Peak (simplified Chinese: 玉皇顶; traditional Chinese: 玉皇頂; pinyin: Yùhuáng Dǐng), which is commonly reported as being 1,545 meters (5,069 ft) tall.';
const expansionTaiItems=[
 {title:'Height',summary:'1,545M',keyword:'1,545M',sentence:'The tallest peak is the Jade Emperor Peak, at 1,545 meters.',body:mountTaiBody,image:'algo-public-assets-expansion-height.png',imageAlt:'Mount Tai summit',href:'https://en.wikipedia.org/wiki/Mount_Tai'},
 {title:'History',summary:'Imperial sacrifice site',keyword:'Imperial sacrifice site',sentence:'Mount Tai is a site of historical and cultural significance.',body:'Mount Tai has been a place of worship for at least 3,000 years. Its cultural landscape includes temples, stone inscriptions, and monuments associated with imperial ceremonies.',image:'algo-public-assets-expansion-history.png',imageAlt:'Mount Tai steps and temples',href:'https://en.wikipedia.org/wiki/Mount_Tai#History'},
 {title:'Location',summary:'Tai’an, China',keyword:'Tai’an, China',sentence:'Located north of Tai’an in Shandong province, China.',body:'Mount Tai is located north of the city of Tai’an in Shandong province, China. It is the highest point in the province.',image:'algo-public-assets-expansion-location.png',imageAlt:'Mount Tai landscape',href:'https://en.wikipedia.org/wiki/Mount_Tai#Geography'}
];
renderPageExample=function(){
 const mobile=mainlineExampleDevice();
 if(mobile)$('exampleHelp').textContent='Tap a section to expand or collapse it. Tap a result title to mark it visited.';
 $('searchQuery').textContent='Mount Tai Wikipedia';
 document.querySelector('.search-page').dataset.variant='expansion';
 $('contextMount').innerHTML='<div class="mm-results-count"><span class="mm-result-source-icons"><img src="algo-public-assets-mm-wikipedia.png" alt="Wikipedia" width="16" height="16"><img src="algo-public-assets-mm-britannica.png" alt="Britannica" width="16" height="16"><img src="algo-public-assets-mm-mobile.png" alt="Mobile results" width="16" height="16"></span>20,000 results</div>';
 const image=state.type==='single'?expansionImage(expansionTaiItems[0].image,'Mount Tai summit'):'';
 const source=mmSource('Wikipedia','https://en.wikipedia.org › wiki › Mount_Tai','algo-public-assets-mm-wikipedia.png');
 const title='<a class="result-title" href="https://en.wikipedia.org/wiki/Mount_Tai">Mount Tai - Wikipedia</a>';
 const snippet=`<p class="snippet">${mountTaiBody}</p>`;
 const primary=mobile?`${source}${title}<div class="expansion-main"><div class="expansion-main-copy">${snippet}</div>${image}</div>`:`<div class="expansion-main"><div class="expansion-main-copy">${source}${title}${snippet}</div>${image}</div>`;
 $('exampleMount').innerHTML=`<article class="algo expansion-algo ${mobile?'algo-mobile mainline-mobile':''}" data-layout="${state.type}">${primary}${expansionRows(expansionTaiItems,{type:state.type,openIndex:0})}</article>`;
 $('supportResults').innerHTML=mmShorts()+mmResult('China Highlights','https://www.chinahighlights.com › mount-tai','Mount Tai — Your Travel Guide for the Renowned China Peak','Mar 30, 2024 · Mount Tai is a famous mountain in Shandong province, China, with a history of 3,000 years and a cultural and natural …')+mmResult('Britannica','https://www.britannica.com › place › Mount-Tai','Mount Tai - Encyclopedia Britannica','Mount Tai is a mountain mass in Shandong province, eastern China. It is considered to be one of China’s …','frame-2147239418.png')+mmResult('aboutchina.info','https://aboutchina.info › mount-tai-taishan-the-most…','Mount Tai (Taishan): The Most Sacred Mountain in China — …','Jul 24, 2026 · For over 3,000 years, Chinese emperors climbed a single mountain to prove they had the right to rule. That mountain …')+mmResult('Mountain Field Guide','https://mountainfieldguide.com › mount-tai','Mount Tai: China’s Sacred Eastern Mountain','Mount Tai is located in central Shandong Province, immediately north of the city of Tai’an and south of the …','frame-2147239419.png')+mmResult('eastchinatrip.com','https://www.eastchinatrip.com › mount-tai-travel-guide','Mount Tai Travel Guide 2026: Hiking Routes, Tickets','Aug 5, 2026 · Learn about the history, culture, and natural beauty of Mount Tai, one of China’s Five Great …','frame-631242.png')+mmGallery();
 if(mobile){
  $('contextMount').innerHTML='';
  $('supportResults').innerHTML=mmResult('Wikipedia','https://simple.wikipedia.org › wiki › Mount_Tai','Mount Tai - Simple English Wikipedia, the free encyclopedia','Mount Tai (Chinese: 泰山; pinyin: Tài Shān) is a mountain in Shandong province, China. It is very important in Chinese culture. It is 1,545 meters (5,069 ft) tall. [2] Cangdi is the …','','algo-public-assets-mm-wikipedia.png').replace('algo mm-algo','algo mm-algo support-result');
 }
 $('relatedTitle').textContent='Deep dive into Mount Tai';
 $('relatedResults').innerHTML=['jade emperor peak','best time to visit','hiking trails','temples and monasteries','china','taishan','sunrise'].map(text=>`<span>${searchSvg}<span>mount tai <b>${text}</b></span></span>`).join('');
 renderExpansionFallback();
};
$('resetExample').onclick=renderPageExample;
document.addEventListener('click',event=>{
 const toggle=event.target.closest('.expansion-toggle');
 if(toggle){
  const row=toggle.closest('.expansion-row'),open=toggle.getAttribute('aria-expanded')!=='true';
  toggle.setAttribute('aria-expanded',String(open));row.classList.toggle('is-open',open);
  $(toggle.getAttribute('aria-controls')).hidden=!open;
 }
 if(toggle&&toggle.closest('#resultMount')){
  const rows=[...$('resultMount').querySelectorAll('.expansion-row')];
  const selected=toggle.closest('.expansion-row');
  state.expansionOpenIndex=rows.indexOf(selected);
  state.interaction=toggle.getAttribute('aria-expanded')==='true'?'expanded':'default';
  if(state.interaction==='expanded')for(const other of rows){
   if(other===selected)continue;
   other.classList.remove('is-open');
   const otherToggle=other.querySelector('.expansion-toggle');
   otherToggle.setAttribute('aria-expanded','false');
   $(otherToggle.getAttribute('aria-controls')).hidden=true;
  }
  $('stateControl').value=state.interaction;
  updateCodeSample();renderAnatomy();
 }
 const next=event.target.closest('.mm-carousel-next');
 if(next)next.previousElementSibling.scrollBy({left:340,behavior:'smooth'});
});
// Keep source links functional despite the shared search-result visited-state demo.
document.querySelector('.search-page').addEventListener('click',event=>{
 if(event.target.closest('a[target="_blank"]'))event.stopImmediatePropagation();
},true);
render();
