/* Mobile carousel layout and original asset overrides from the supplied exports. */
function richMobileAnatomy(){return [...mobileAnatomy.map(item=>item.slice()),['Carousel Title','A heading below the snippet introduces the related content.'],['Item Row','Swipe horizontally to browse image cards. Each card includes a title and may include facts, a snippet, a URL, a rating or a video duration.']]}
function richMobileCarousel(cards,annotated=false){return `<div class="rich-carousel rich-mobile-carousel">${richPart(5,'carousel',`<div class="rich-track" tabindex="0" aria-label="Related content; swipe or use arrow keys to browse">${cards}</div>`,annotated)}</div>`}
function renderRichMobileAccessories(){
 const section=$('thumbnail-accessories');if(!section)return;
 section.hidden=state.device!=='mobile';
 if(!section.hidden)$('richAccessoryMount').innerHTML=['default','rating','video'].map(accessory=>`<div class="rich-variation" data-content="fact">${richCard(richPlaceholderData('fact'),accessory)}<p>${{default:'Default',rating:'Rating',video:'Video'}[accessory]}</p></div>`).join('');
}
const richMobileAssetNames=new Set(['blue-lagoon','seljalandsfoss','gaga-backstage','gaga-onstage','bbc-fog','bbc-cruise','bbc-ai','bbc-moon','nike','nike-air-force','nike-dunk','japan-towns','dinner-recipes']);
function richMobileAsset(name){return `algo-public-assets-${richMobileAssetNames.has(name)?'mobile-rich':'rich'}-${name}.png`}
function renderRichMobileExample(key){
 const item=richExamples[key],assets=key==='news'?[...richAssetGroups.news,'bbc-ai','bbc-moon']:richAssetGroups[key];
 const cards=item.cards.slice(0,assets.length-1).map(([title,fact,badge],i)=>richCard({title,...(key==='news'?{}:{fact}),rating:badge,duration:badge,image:richMobileAsset(assets[i+1]),alt:title},item.accessory||'default')).join('');
 $('richExampleMount').innerHTML=`<article class="algo algo-mobile rich-result rich-mobile" data-example="${key}"><div class="attribution"><span class="favicon"><img src="${richMobileAsset(assets[0])}" alt="" width="16" height="16"></span><span class="source"><span>${item.name}</span><small>${item.url}</small></span></div><a class="result-title" href="#rich-example">${item.title}</a><p class="snippet">${item.snippet}</p><h3 class="rich-carousel-title">${item.heading}</h3>${richMobileCarousel(cards)}</article>`;
}
