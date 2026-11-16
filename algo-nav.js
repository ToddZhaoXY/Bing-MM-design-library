// V4 Mainline Nav. Archived V3 files remain unchanged.
const navDescription='Nav combines a web result with direct links to key pages within the site. Each link includes a destination label and a trailing chevron.';
Object.keys(variants).forEach(key=>delete variants[key]);
variants.mainline={label:'Nav',description:navDescription};
state.type='mainline';state.interaction='default';
$('heroDescription').textContent=navDescription;
$('typeControl').innerHTML='<option value="mainline">Mainline</option>';
$('typeControl').closest('label').hidden=true;
state.navLayout='full';
const navLayoutControl=document.createElement('label');
navLayoutControl.innerHTML='Layout<select id="navLayoutControl"><option value="full">Full · 6 links</option><option value="compact">Compact · 4 links</option></select>';
$('typeControl').closest('label').after(navLayoutControl);
$('navLayoutControl').onchange=event=>{state.navLayout=event.target.value;render()};
document.querySelector('.mobile-component-nav>summary').textContent='Mainline / Nav';
activeAnatomy=function(){return [...(state.device==='mobile'?mobileAnatomy.map(item=>item.slice()):anatomy.slice(0,4)),['Deeplink','Deeplinks point to key pages within the same site, letting users jump directly to the content they need without visiting the homepage first.']]};
const navPin=index=>`<button type="button" class="pin" data-index="${index}" aria-label="${index+1}. ${activeAnatomy()[index][0]}" aria-describedby="anatomyDescription"><svg class="pin-number" viewBox="0 0 22 22" aria-hidden="true"><text x="11" y="11" text-anchor="middle" dominant-baseline="central">${index+1}</text></svg></button>`;
const navPart=(index,name,content,on)=>`<div class="part part-${name}">${on?navPin(index):''}${content}</div>`;
const navChevron='<svg class="nav-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m6 3.5 4.5 4.5L6 12.5"/></svg>';
function navLinksMarkup(items,domain,annotated=false,compact=state.device==='mobile'&&state.navLayout==='compact'){
 const visible=compact?items.slice(0,4):items;
 const rows=visible.map((item,index)=>AlgoCells.navLinkItem(item,{annotated:annotated&&index===0,renderPart:navPart,chevron:navChevron})).join('');
 if(state.device==='mobile')return `<nav class="nav-links${compact?' is-compact':''}" aria-label="Website destinations">${rows}</nav>${compact?`<div class="nav-compact-footer"><button type="button" class="nav-see-more" aria-expanded="false">Show more ${navChevron}</button></div>`:''}`;
 return `<nav class="nav-links" aria-label="Website destinations">${rows}</nav>${navPart(6,'navMore',`<a class="nav-more" href="https://www.bing.com/search?q=site%3A${domain}">More results from ${domain}</a>`,false)}`;
}
const navPlaceholderItems=Array.from({length:6},(_,index)=>({label:'Lorem ipsum dolor consectatur',href:'#nav-destination-'+(index+1)}));
placeholderMarkup=function(type=state.type,annotated=false,interactive=false){
 return `<article class="algo nav-result ${state.device==='mobile'?'algo-mobile mainline-mobile':''} ${annotated?'annotated':''}" data-state="${interactive||annotated||state.device==='mobile'?state.interaction:'default'}"><div class="attribution">${navPart(0,'favicon','<span class="favicon"><img src="algo-public-assets-placeholder-thumbnail.png" alt="" width="16" height="16"></span>',annotated)}${navPart(1,'source','<span class="source"><span>Site name lorem ipsum</span><small>www.algoloremipsum-attribution.com › ... › ipsum</small></span>',annotated)}</div>${navPart(2,'title','<a class="result-title" href="#nav-result">Title lorem ipsum dolor consectatur</a>',annotated)}${navPart(3,'snippet','<p class="snippet">Oct 26, 2018 · Snippet lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, ipsum nostrud exercitation ullamco laboris sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>',annotated)}${navLinksMarkup(state.device==='mobile'?navPlaceholderItems.map(item=>({...item,label:'Deeplink'})):navPlaceholderItems,'algoloremipsum-attribution.com',annotated)}</article>`;
};
previewMarkup=function(){return placeholderMarkup(state.type,false,true)};
const navBaseRender=render;
render=function(){
 navBaseRender();
 const compact=state.device==='mobile'&&state.navLayout==='compact';
 $('variantHeading').textContent=compact?'Compact · 4 links':'Full · 6 links';
 $('variantDescription').textContent=compact?'Four website links are shown below the result. Tap Show more to reveal the remaining destinations.':'Six website links are shown below the result. Each link has a destination label and a chevron; select a link to open its page.';
};
updateCodeSample=function(){navLayoutControl.hidden=state.device!=='mobile';$('navLayoutControl').value=state.navLayout;$('codeSample').textContent='<link rel="stylesheet" href="algo-algo-block.css">\n<link rel="stylesheet" href="algo-nav.css">\n'+(state.device==='mobile'?'<link rel="stylesheet" href="algo-mainline-mobile.css">\n':'')+(state.device==='desktop'?'<link rel="stylesheet" href="algo-desktop-figma.css">\n':'<link rel="stylesheet" href="algo-mobile-figma.css">\n')+'<link rel="stylesheet" href="algo-component-responsive.css">\n'+placeholderMarkup(state.type,false,state.device==='mobile').replace(/></g,'>\n<');if(typeof applyMosaicSDL==='function')applyMosaicSDL('nav',state.device,state.type)};
const navWalmartItems=[
 {label:'Work at Walmart',href:'https://careers.walmart.com/'},
 {label:'See all Departments',href:'https://www.walmart.com/all-departments'},
 {label:'Groceries & Essentials',href:'https://www.walmart.com/cp/food/976759'},
 {label:'Find a nearby store',href:'https://www.walmart.com/store-finder'},
 {label:'Download App',href:'https://www.walmart.com/cp/walmart-app/1087865'},
 {label:'App',href:'https://www.walmart.com/cp/walmart-app/1087865'}
];
function navSource(name,url,icon){return `<div class="attribution"><span class="favicon"><img src="${icon}" alt="" width="16" height="16"></span><span class="source"><span>${name}</span><small>${url}</small></span></div>`}
function navSupportResult(name,url,title,snippet,icon,href){return `<article class="algo nav-result support-result">${navSource(name,url,icon)}<a class="result-title" href="${href}">${title}</a><p class="snippet">${snippet}</p></article>`}
renderPageExample=function(){
 const mobile=mainlineExampleDevice();
 document.querySelector('.search-page').dataset.variant='nav';
 $('searchQuery').textContent='Walmart';
 $('contextMount').innerHTML='<div class="nav-results-count"><span class="nav-result-source-icons"><img src="algo-public-assets-nav-cnn.png" alt="CNN" width="16" height="16"><img src="algo-public-assets-mm-wikipedia.png" alt="Wikipedia" width="16" height="16"><img src="algo-public-assets-mm-facebook.png" alt="Facebook" width="16" height="16"></span>About 999,999 result</div>';
 $('exampleMount').innerHTML=`<article class="algo nav-result ${state.device==='mobile'?'algo-mobile mainline-mobile':''}">${navSource('Walmart','https://www.walmart.com','algo-public-assets-nav-walmart.png')}<a class="result-title" href="https://www.walmart.com/">Walmart | Save Money. Live better.</a><p class="snippet"><b>Walmart</b> | Save Money. Live better. Walmart+ members get more! Want Free Delivery, Gas Savings &amp; more ways to save? Try Walmart+ for $1Try ...</p>${navLinksMarkup(navWalmartItems,'walmart.com',false,false)}</article>`;
 $('supportResults').innerHTML=navSupportResult('MyStore411','https://www.mystore411.com › store › list_city','Walmart Locations &amp; Hours in Beijing, Beijing, China - MyStore411','Explore Walmart locations in Beijing, China, with store addresses, opening hours, holiday hours, phone numbers, and available services. Find a nearby store and plan your next shopping trip.','algo-public-assets-nav-mystore411.png','https://www.mystore411.com/')+navSupportResult('Walmart','https://corporate.walmart.com › about › contact','Contact Walmart','Contact Walmart to share feedback or ask a question about your local store or corporate headquarters. Find contact information and support resources for shopping, store services, and general inquiries.','algo-public-assets-nav-walmart.png','https://corporate.walmart.com/about/contact')+navSupportResult('Beijing Tours Guide','http://www.beijingtoursguide.com › beijingshopping › wal-mart-in-beijing.html','Walmart in Beijing: Store Addresses &amp; Supermarket Shopping Guide','Explore Walmart shopping options in Beijing, from groceries and fresh produce to clothing, household essentials, and everyday supplies. Find store addresses and useful information to help plan your shopping trip.','algo-public-assets-nav-beijing-tours-guide.png','http://www.beijingtoursguide.com/beijingshopping/wal-mart-in-beijing.html');
 if(mobile){
  $('contextMount').innerHTML='';
  $('supportResults').innerHTML=navSupportResult('Walmart','https://www.walmart.com','Walmart | Save Money. Live better.','Walmart | Save Money. Live better. Walmart+ members get more! Want Free Delivery, Gas Savings &amp; more ways to save? Try Walmart+ for $1Try ...','algo-public-assets-nav-walmart.png','https://www.walmart.com/');
 }
 $('relatedTitle').textContent='Deep dive into Walmart';
 $('relatedResults').innerHTML=['careers online application','electronics','shopping online','store locator','login my account','official website','jobs'].map(text=>`<span>${searchSvg}<span>Walmart <b>${text}</b></span></span>`).join('');
};
$('resetExample').onclick=()=>{visitedResults.clear();renderPageExample()};
document.addEventListener('click',event=>{
 const more=event.target.closest('.nav-see-more');
 if(more){state.navLayout='full';render();return}
 const link=event.target.closest('#resultMount .nav-deeplink,#resultMount .nav-more,#anatomyMount .nav-deeplink,#anatomyMount .nav-more');
 if(!link)return;
 event.preventDefault();link.classList.add('is-visited');
});
render();
