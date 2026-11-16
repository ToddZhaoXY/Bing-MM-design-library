// V4 Sectional Expansion. Original documentation copy is preserved per type.
Object.keys(variants).forEach(key=>delete variants[key]);
variants.fact={label:'Fact Layout',description:'The Fact Layout pairs a primary result with concise fact cards. Facts highlight key information and figures; hover reveals additional details and a Continue reading link. All-image, mixed-image, and text-only layouts are supported.'};
variants.wiki={label:'Wiki',description:'Sectional Expansion pairs an overview result with topic cards. Hover over a topic card to preview additional details, then continue reading on the linked page. The final design supports all-image, mixed-image, and text-only layouts.'};
state.type=typeof location!=='undefined'&&new URLSearchParams(location.search).get('layout')==='wiki'?'wiki':'fact';state.images='all';state.interaction='default';
$('typeControl').innerHTML=Object.entries(variants).map(([key,item])=>`<option value="${key}">${item.label}</option>`).join('');
$('stateControl').innerHTML='<option value="default">Default</option><option value="hover">Hover</option>';
$('typeControl').value=state.type;
$('heroDescription').textContent='Sectional Expansion combines a primary web result with expandable fact or topic cards.';
activeAnatomy=function(){return [
 ['Section title','The section title introduces the primary result and its related cards.'],
 ['Primary result','A primary result card with attribution, a linked title, a snippet, and a call to action.'],
 [state.type==='fact'?'Fact cards':'Topic cards',state.type==='fact'?`Four fact cards highlight key information and figures. ${state.device==='mobile'?'Tap':'Hover'} reveals additional details and a Continue reading link.`:`Four topic cards preview related content. ${state.device==='mobile'?'Tap':'Hover'} reveals additional details and a Continue reading link.`]
]};
for(const mount of [$('resultMount'),$('anatomyMount')])mount.addEventListener('click',event=>{if(event.target.closest('a')){event.preventDefault();event.stopPropagation()}},true);
const seAssetRoot='algo-public-assets-sectional-expansion-';
const seAssets={placeholder:'algo-public-assets-placeholder-thumbnail.png',favicon:'algo-public-assets-placeholder-thumbnail.png',wiki:'algo-public-assets-mm-wikipedia.png',britannica:'algo-public-assets-mm-britannica.png',spruce:seAssetRoot+'spruce.png',nwf:seAssetRoot+'nwf.png',toms:seAssetRoot+'toms.png',flytrap:seAssetRoot+'flytrap.png',trap:seAssetRoot+'trap.png',potted:seAssetRoot+'potted.png',habitat:seAssetRoot+'habitat.png',cultivation:seAssetRoot+'cultivation.png',conservation:seAssetRoot+'conservation.png',flytrapVideo:seAssetRoot+'flytrap-video.png',map:seAssetRoot+'map.png',visit:seAssetRoot+'visit-iceland.png',capital:seAssetRoot+'reykjavik.png',summer:seAssetRoot+'summer.png',language:seAssetRoot+'icelandic.png',currency:seAssetRoot+'currency.png',coast:seAssetRoot+'iceland-coast.png',video1:seAssetRoot+'iceland-video-1.png',video2:seAssetRoot+'iceland-video-2.png',video3:seAssetRoot+'iceland-video-3.png',golden:seAssetRoot+'golden-circle.png',volcano:seAssetRoot+'volcano.png',aurora:seAssetRoot+'northern-lights.png',world:seAssetRoot+'worldatlas.png',tripadvisor:seAssetRoot+'tripadvisor.png',guide:'algo-public-assets-sectional-rich-guide-to-iceland.png'};
const seArrow='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';
const seChevron='<svg class="se-chevron" viewBox="0 0 12 16" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="m4 4 4 4-4 4"/></svg>';
const sePin=index=>`<button type="button" class="pin" data-index="${index}" aria-label="${index+1}. ${activeAnatomy()[index][0]}" aria-describedby="anatomyDescription"><svg class="pin-number" viewBox="0 0 22 22" aria-hidden="true"><text x="11" y="11" text-anchor="middle" dominant-baseline="central">${index+1}</text></svg></button>`;
const sePart=(index,name,content,on)=>`<div class="part part-${name}">${on?sePin(index):''}${content}</div>`;
const seImage=(src,alt,cls,size)=>`<img class="${cls}" src="${src}" alt="${alt}" width="${size}" height="${size}">`;
function seSource(name,url,icon){return `<div class="attribution"><span class="favicon">${seImage(icon,'','',16)}</span><span class="source"><span>${name}</span><small>${url}</small></span></div>`}
let seMarkupId=0;
function seMarkup(data,{annotated=false,images=state.images,interaction=state.interaction,type=state.type}={}){
 const prefix='se-'+(++seMarkupId);
 const cards=data.cards.map((item,index)=>{
  return AlgoCells.wikiFactItem(item,{id:prefix+'-'+index,open:interaction==='hover'&&index===0,type,images,device:state.device,href:data.href,renderImage:seImage,chevron:seChevron,arrow:seArrow});
 }).join('');
 return `<section class="sectional-expansion${state.device==='mobile'?' sectional-mobile':''}" data-layout="${type}" data-images="${images}">${sePart(0,'seHeading',`<h3 class="se-title">${data.heading}</h3>`,annotated)}<div class="se-grid">${sePart(1,'sePrimary',`<article class="algo se-primary">${seSource(data.name,data.url,data.icon)}${state.device==='mobile'?`<a class="result-title" href="${data.href}" target="_blank" rel="noopener noreferrer">${data.title}</a>`:''}<div class="se-primary-content"><div class="se-primary-copy">${state.device!=='mobile'?`<a class="result-title" href="${data.href}" target="_blank" rel="noopener noreferrer">${data.title}</a>`:''}<p class="snippet">${data.snippet}</p></div>${images==='some'?seImage(data.image,data.imageAlt||data.title,'se-main-image',88):''}</div><a class="se-action" href="${data.href}" target="_blank" rel="noopener noreferrer">${seArrow}${data.action}</a></article>`,annotated)}${sePart(2,'seCards',`<div class="se-cards">${cards}</div>`,annotated)}</div></section>`;
}
function sePlaceholder(type){return {heading:'Section title lorem ipsum',name:'Site name lorem ipsum',url:'www.algoloremipsum-attribution.com'+(state.device==='mobile'?' › ... › ipsum':''),icon:seAssets.favicon,title:'Title lorem ipsum dolor consectatur',href:'https://example.com',snippet:state.device==='mobile'?'Oct 26, 2018 · Snippet lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, ipsum nostrud exercitation ullamco laboris.':'Snippet lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',action:'Learn more',image:seAssets.placeholder,imageAlt:'Thumbnail placeholder',cards:Array.from({length:4},()=>({title:type==='fact'?'Value lorem ipsum':'Title lorem ipsum',summary:type==='fact'?'Label lorem ipsum':'Snippet lorem ipsum dolor sit amet.',description:'Snippet lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',image:seAssets.placeholder,imageAlt:'Thumbnail placeholder'}))}}
placeholderMarkup=function(type=state.type,annotated=false){return seMarkup(sePlaceholder(type),{type,annotated})};
previewMarkup=function(){return placeholderMarkup()};
updateCodeSample=function(){$('codeSample').textContent='<link rel="stylesheet" href="algo-algo-block.css">\n<link rel="stylesheet" href="algo-sectional-expansion.css">\n'+(state.device==='mobile'?'<link rel="stylesheet" href="algo-sectional-mobile.css">\n':'')+(state.device==='desktop'?'<link rel="stylesheet" href="algo-desktop-figma.css">\n':'<link rel="stylesheet" href="algo-mobile-figma.css">\n')+'<link rel="stylesheet" href="algo-component-responsive.css">\n'+seMarkup(sePlaceholder(state.type),{interaction:'default'}).replace(/></g,'>\n<');if(typeof applyMosaicSDL==='function')applyMosaicSDL('sectional-expansion',state.device,state.type,state.images)};
const seExampleBand=document.createElement('div');seExampleBand.className='se-example-band';document.querySelector('.search-layout').before(seExampleBand);seExampleBand.append($('exampleMount'));
renderPageExample=function(){
 if(typeof sectionalExampleDevice==='function')sectionalExampleDevice();
 const wiki=state.type==='wiki';
 document.querySelector('.search-page').dataset.variant='sectional-expansion';
 $('searchQuery').textContent=wiki?'Venus flytrap':'Guide to Iceland';
 $('contextMount').innerHTML=seExampleContext(wiki);
 $('exampleMount').innerHTML=seMarkup(seExampleData(wiki));
 $('supportResults').innerHTML='<h3 class="se-more-heading">More Results</h3>'+seSupportResults(wiki)+(state.device==='mobile'?sectionalMoreResultsButton():'');
 $('relatedTitle').textContent=state.device==='mobile'?'Related searches':'Deep dive into '+(wiki?'Venus flytrap':'Guide to Iceland');
 if(state.device==='mobile')$('variantDescription').textContent=wiki?'Tap a topic card to preview additional details, then continue reading on the linked page.':'Tap a fact card to preview additional details, then continue reading on the linked page.';
 const base=wiki?'venus flytrap':'Iceland',suffixes=wiki?['care guide','scientific name','facts and information','plant images','facts','habitat','feeding tips']:['map','population','country','history','capital','geography','best time to visit'];
 $('relatedResults').innerHTML=suffixes.map(text=>`<span>${searchSvg}<span>${base} <b>${text}</b></span></span>`).join('');
};
$('imageControl').addEventListener('change',event=>{state.images=event.target.value;render()});
function seSetOpen(card,open){if(open)card.closest('.se-cards').querySelectorAll('.se-card.is-open').forEach(other=>{if(other!==card){other.classList.remove('is-open','is-pinned');other.querySelector('.se-card-toggle').setAttribute('aria-expanded','false')}});card.classList.toggle('is-open',open);if(!open)card.classList.remove('is-pinned');card.querySelector('.se-card-toggle').setAttribute('aria-expanded',String(open))}
// Delegate once, so controls, reset and full-size view retain their interactions.
document.addEventListener('pointerover',event=>{const card=event.target.closest('.se-card');if(state.device==='mobile'||!card||card.contains(event.relatedTarget))return;seSetOpen(card,true)});
document.addEventListener('pointerout',event=>{const card=event.target.closest('.se-card');if(state.device==='mobile'||!card||card.contains(event.relatedTarget)||card.contains(document.activeElement))return;seSetOpen(card,false)});
document.addEventListener('focusin',event=>{const card=event.target.closest('.se-card');if(card&&state.device!=='mobile')seSetOpen(card,true)});
document.addEventListener('focusout',event=>{const card=event.target.closest('.se-card');if(card&&!card.contains(event.relatedTarget)&&!card.matches(':hover'))seSetOpen(card,false)});
document.addEventListener('click',event=>{const toggle=event.target.closest('.se-card-toggle');if(toggle){const card=toggle.closest('.se-card');if(state.device==='mobile'||event.detail===0||event.pointerType==='touch')seSetOpen(card,!card.classList.contains('is-pinned'));card.classList.toggle('is-pinned',card.classList.contains('is-open'))}});
document.addEventListener('keydown',event=>{if(event.key!=='Escape')return;document.querySelectorAll('.se-card.is-open').forEach(card=>{seSetOpen(card,false);card.classList.remove('is-pinned')})});
// Actual example links open their sources; no synthetic visited state is applied.
document.querySelector('.search-page').addEventListener('click',event=>{if(event.target.closest('a[target="_blank"]'))event.stopPropagation()},true);
$('resetExample').onclick=()=>{renderPageExample();document.querySelectorAll('#exampleMount .se-card').forEach(card=>seSetOpen(card,false))};
render();
