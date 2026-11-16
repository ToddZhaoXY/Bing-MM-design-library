// MM-specific components share the existing documentation shell and interactions.
const mmBasePage=renderPageExample;
const mmDescriptions={
 image:'This feature adds visual previews of the destination content to a search result. It complements the title and snippet with relevant imagery, helping users understand the content at a glance and evaluate its relevance before clicking.',
 video:'This feature enriches a search result with a video thumbnail and supporting metadata. It helps users recognize video content, understand its subject, and assess its relevance and length before choosing to watch.'
};
const mmSnippet='Oct 26, 2018 · Snippet lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, ipsum nostrud exercitation ullamco laboris sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
Object.keys(variants).forEach(key=>delete variants[key]);
variants.image1={label:'Image Caption',description:mmDescriptions.image};
variants.video={label:'Video Caption',description:mmDescriptions.video};
$('typeControl').innerHTML=Object.entries(variants).map(([value,item])=>`<option value="${value}">${item.label}</option>`).join('');
$('heroDescription').textContent='MM algo blocks add image and video previews to search results.';
document.title='MM Algo Block — Algo Design Library';
state.type='image1';state.interaction='default';
state.imageCount=1;
const mmCountRow=document.createElement('label');
mmCountRow.innerHTML='Image count<select id="imageCountControl" aria-label="Image count"><option value="1">1 image</option><option value="2">2 images</option><option value="3">3 images</option></select>';
$('typeControl').closest('label').after(mmCountRow);
$('imageCountControl').addEventListener('change',event=>{state.imageCount=Number(event.target.value);render()});
const mmPin=index=>`<button type="button" class="pin" data-index="${index}" aria-label="${index+1}. ${activeAnatomy()[index][0]}" aria-describedby="anatomyDescription"><svg class="pin-number" viewBox="0 0 22 22" aria-hidden="true"><text x="11" y="11" text-anchor="middle" dominant-baseline="central">${index+1}</text></svg></button>`;
const mmPart=(index,name,content,annotated)=>`<div class="part part-${name}">${annotated?mmPin(index):''}${content}</div>`;
activeAnatomy=function(){
 if(state.device==='mobile')return mmMobileAnatomy();
 const items=anatomy.slice(0,4);
 if(state.type==='video'){
  items[3]=['Video Snippet','Descriptive text to the right of the thumbnail that provides context about the video.'];
  items.push(['Video Thumbnail','A visual preview positioned below the title, to the left of the snippet.']);
  items.push(['Video Metadata','The author’s name and view count displayed below the snippet, helping users identify the creator and understand the video’s reach.']);
 }else items.push(['Image Caption','Positioned to the right of the result text, supporting one, two, or three images']);
 return items;
};
const mmMuteMarkup='<button type="button" class="mm-mute" aria-label="Unmute preview" aria-pressed="true"><svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M2 6h3l3-3v10l-3-3H2Z"/><path class="mm-mute-cross" d="m11 6 4 4m0-4-4 4"/><path class="mm-sound-waves" d="M11 5a4 4 0 0 1 0 6"/></svg></button>';
const mmMedia=(type,annotated)=>{
 if(type==='video')return mmPart(4,'media',`<div class="mm-video"><img src="algo-public-assets-mm-video-figma-placeholder.png" alt="Video thumbnail placeholder" width="231" height="130"><span class="mm-duration">99:99</span><span class="mm-preview-label">Preview</span>${mmMuteMarkup}<button type="button" class="mm-play" aria-label="Preview video">▶</button></div>`,annotated);
 const count=state.imageCount;return mmPart(4,'media',`<div class="mm-images mm-images-${count}">${Array.from({length:count},(_,index)=>'<span class="mm-image-slot"><img src="algo-public-assets-figma-placeholder-original.png" alt="Visual content placeholder" width="108" height="108"></span>').join('')}</div>`,annotated);
};
placeholderMarkup=function(type=state.type,annotated=false,interactive=false){
 if(state.device==='mobile')return mmMobilePlaceholder(type,annotated,interactive);
 const attribution=`<div class="attribution">${mmPart(0,'favicon','<span class="favicon"><img src="algo-public-assets-placeholder-thumbnail.png" alt="" width="16" height="16"></span>',annotated)}${mmPart(1,'source','<span class="source"><span>Site name lorem ipsum</span><small>www.algoloremipsum-attribution.com › ... › ipsum</small></span>',annotated)}<span class="mm-overflow-space" aria-hidden="true"></span></div>`;
 const title=mmPart(2,'title','<a class="result-title" href="#playground">Title Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed</a>',annotated);
 const snippet=mmPart(3,'snippet',`<p class="snippet">${mmSnippet}</p>`,annotated);
 const content=type==='video'?`${attribution}${title}<div class="mm-video-row">${mmMedia(type,annotated)}<div class="mm-video-copy">${snippet}${mmPart(5,'metadata','<div class="mm-metadata"><span><b>Author:</b> Author name</span><span><b>Views:</b> 22M</span></div>',annotated)}</div></div>`:`<div class="mm-image-copy">${attribution}${title}${snippet}</div>${mmMedia(type,annotated)}`;
 return `<article class="algo mm-algo ${type==='video'?'mm-video-algo':'mm-image-algo'} ${annotated?'annotated':''}" data-state="${interactive||annotated?state.interaction:'default'}">${content}</article>`;
};
previewMarkup=function(){return placeholderMarkup(state.type,false,true)};
updateCodeSample=function(){
 $('codeSample').textContent='<link rel="stylesheet" href="algo-algo-block.css">\n<link rel="stylesheet" href="algo-mm-algo.css">\n'+(state.device==='mobile'?'<link rel="stylesheet" href="algo-mm-mobile.css">\n':'')+(state.device==='desktop'?'<link rel="stylesheet" href="algo-desktop-figma.css">\n':'<link rel="stylesheet" href="algo-mobile-figma.css">\n')+'<link rel="stylesheet" href="algo-component-responsive.css">\n'+placeholderMarkup(state.type).replace(/></g,'>\n<');
 if(typeof applyMosaicSDL==='function')applyMosaicSDL('mm',state.device,state.type,state.imageCount);
};
const mmFavicons={'Avatar':'avatar.png','Facebook':'facebook.png','China Highlights':'china-highlights.png','aboutchina.info':'aboutchina.png','Mountain Field Guide':'mountain-field-guide.png','eastchinatrip.com':'eastchinatrip.png','Britannica':'britannica.png'};
const mmSource=(name,url,icon=mmFavicons[name]?'algo-public-assets-mm-'+mmFavicons[name]:'')=>`<div class="attribution"><span class="favicon">${icon?`<img src="${icon}" alt="" width="16" height="16">`:globe}</span><span class="source"><span>${name}</span><small>${url}</small></span><span class="mm-overflow-space" aria-hidden="true"></span></div>`;
const mmResult=(name,url,title,snippet,img='',icon)=>`<article class="algo mm-algo ${img?'mm-image-algo':''}"><div class="mm-image-copy">${mmSource(name,url,icon)}<a class="result-title" href="#example-result">${title}</a><p class="snippet">${snippet}</p></div>${img?`<div class="mm-images"><span class="mm-image-slot"><img src="algo-public-assets-mm-${img}" alt="${name} destination preview" width="108" height="108"></span></div>`:''}</article>`;
const mmAvatar=()=>{
 const count=state.imageCount;
 const assets=[['avatar-characters','Jake and Neytiri in Avatar'],['avatar-pandora','Avatar landscape of Pandora'],['avatar-landscape','Floating mountains of Pandora']];
 const media=`<div class="mm-images mm-images-${count}">${assets.slice(0,count).map(([asset,alt])=>`<span class="mm-image-slot"><img src="algo-public-assets-mm-${asset}.png" alt="${alt}" width="108" height="108"></span>`).join('')}</div>`;
 return `<article class="algo mm-algo mm-image-algo"><div class="mm-image-copy">${mmSource('Avatar','https://www.avatar.com › movies › avatar')}<a class="result-title" href="#example-result">Avatar (2009) | Avatar.com</a><p class="snippet">Dec 18, 2009 · From Academy Award® winning director James Cameron comes “Avatar,” set in the year 2154, in which former Marine Jake Sully is recruited for a mission on Pandora, a distant moon where a corporate consortium is mining a rare mineral that is key to solving Earth’s energy crisis.</p></div>${media}</article>`;
};
const mmVideoResult=()=>`<article class="algo mm-algo mm-video-algo">${mmSource('Facebook','https://www.facebook.com')}<a class="result-title" href="#example-result">A stunning sea of clouds enveloped the top of Mount Tai, creating a fairyland for visitors</a><div class="mm-video-row"><div class="mm-video"><img src="algo-public-assets-mm-video-card.png" alt="Sunrise over the clouds at Mount Tai" width="231" height="130"><span class="mm-duration">99:99</span><span class="mm-preview-label">Preview</span>${mmMuteMarkup}<a class="mm-play" href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Open video on Facebook">▶</a></div><div class="mm-video-copy"><p class="snippet">${mmSnippet}</p><div class="mm-metadata"><span><b>Author:</b> Author name</span><span><b>Views:</b> 22M</span></div></div></div></article>`;
const mmCarousel=(kind,items)=>`<div class="mm-carousel"><div class="mm-${kind}-track" tabindex="0">${items}</div><button class="mm-carousel-next" aria-label="Show more ${kind}">›</button></div>`;
const mmShorts=()=>`<section class="mm-answer"><h3>Shorts videos of Mount Tai ›</h3>${mmCarousel('shorts',['Climbing Mount Taishan: A Sacred Journey','Scenic Mount Tai in China: A Stunning Natural Wonder','#This is Mount Tai','A stunning sea of clouds','This breathtaking view'].map((title,i)=>`<a class="mm-short" href="${i===3?'https://www.facebook.com':'https://www.tiktok.com'}" target="_blank" rel="noopener noreferrer"><img src="algo-public-assets-mm-tok-video${i?'-'+i:''}.png" alt="${title}" width="120" height="160"><span class="mm-short-play">▶</span><div><small>${i===3?'Facebook':i===4?'Bilibili':'TikTok'} · https://…</small><b>${title}</b></div></a>`).join(''))}</section>`;
const mmGallery=()=>{
 const titles=['Guide To Climbing Mt Tai, The Most Sacred Of China’s Five Great Mountains!','Top 13 Must-See China Mountains for All Nature Lovers','Mount Tai: The Mysterious Source of National Unity and…','Guide To Climbing Mt Tai, The Most Sacred…','','','',''];
 const widths=[193,114,193,140,114,193,193,114];
 const row=indices=>`<div class="mm-gallery-row">${indices.map(i=>`<a href="#example-result" style="--image-width:${widths[i]}px"><img src="algo-public-assets-mm-image${i?'-'+i:''}.png" alt="Mount Tai landscape ${i+1}" width="${widths[i]}" height="148">${titles[i]?`<span>${titles[i]}</span>`:''}</a>`).join('')}</div>`;
 return `<section class="mm-answer"><h3>Images of Mount Tai ›</h3><div class="mm-chip-carousel"><div class="mm-image-chips">${['China','Steps','Mount Taishan','Facts','Cartoon','Cartoon'].map((name,i)=>`<button><img src="algo-public-assets-mm-container${i?'-'+Math.min(i,4):''}.png" alt="" width="28" height="28">${name}</button>`).join('')}</div><button class="mm-carousel-next" aria-label="Show more image categories">›</button></div>${mmCarousel('gallery',row([0,1,2,3])+row([4,5,6,7]))}</section>`;
};
renderPageExample=function(){
 const type=state.type;
 mmCountRow.hidden=type==='video';
 const page=document.querySelector('.search-page');
 page.classList.toggle('mobile-serp',state.device==='mobile');
 if(state.device==='desktop')page.classList.remove('mm-mobile-component-example');
 if(state.device==='mobile'){renderMMMobileExample(page);return}
 if(!page.querySelector('#relatedResults'))page.innerHTML=desktopPageTemplate;
 document.querySelector('.search-viewport').hidden=false;$('expandExample').disabled=false;$('resetExample').disabled=false;
 document.querySelector('.mm-page-pending')?.remove();
 if(type!=='video'){
  state.type='list';mmBasePage();state.type=type;
  $('exampleMount').innerHTML=listOverviewMarkup()+mmAvatar();

 }else{
  document.querySelector('.search-page').dataset.variant='video';
  $('searchQuery').textContent='Mount Tai';
  $('contextMount').innerHTML='<div class="mm-results-count"><span class="mm-result-source-icons"><img src="algo-public-assets-mm-wikipedia.png" alt="Wikipedia" width="16" height="16"><img src="algo-public-assets-mm-britannica.png" alt="Britannica" width="16" height="16"><img src="algo-public-assets-mm-mobile.png" alt="Mobile results" width="16" height="16"></span>20,000 results</div>';
  $('exampleMount').innerHTML=mmVideoResult();
  $('supportResults').innerHTML=mmResult('China Highlights','https://www.chinahighlights.com › mount-tai','Mount Tai — Your Travel Guide for the Renowned China Peak','Mar 30, 2024 · Mount Tai is a famous mountain in Shandong province, China, with a history of 3,000 years and a cultural and natural …')+mmResult('Britannica','https://www.britannica.com › place › Mount-Tai','Mount Tai - Encyclopedia Britannica','Mount Tai is a mountain mass in Shandong province, eastern China. It is considered to be one of China’s …','frame-2147239418.png')+mmShorts()+mmResult('aboutchina.info','https://aboutchina.info › mount-tai-taishan-the-most…','Mount Tai (Taishan): The Most Sacred Mountain in China — …','Jul 24, 2026 · For over 3,000 years, Chinese emperors climbed a single mountain to prove they had the right to rule. That mountain …')+mmResult('Mountain Field Guide','https://mountainfieldguide.com › mount-tai','Mount Tai: China’s Sacred Eastern Mountain','Mount Tai is located in central Shandong Province, immediately north of the city of Tai’an and south of the …','frame-2147239419.png')+mmResult('eastchinatrip.com','https://www.eastchinatrip.com › mount-tai-travel-guide','Mount Tai Travel Guide 2026: Hiking Routes, Tickets','Aug 5, 2026 · Learn about the history, culture, and natural beauty of Mount Tai, one of China’s Five Great …','frame-631242.png')+mmGallery();
  $('relatedTitle').textContent='Deep dive into Mount Tai';
  $('relatedResults').innerHTML=['jade emperor peak','best time to visit','hiking trails','temples and monasteries','china','taishan','sunrise'].map(text=>`<span>${searchSvg}<span>mount tai <b>${text}</b></span></span>`).join('');
 }
 document.querySelector('.search-page').dataset.variant=type;
};
document.addEventListener('click',event=>{
 const mute=event.target.closest('.mm-mute');
 if(mute){const muted=mute.getAttribute('aria-pressed')==='true';mute.setAttribute('aria-pressed',String(!muted));mute.setAttribute('aria-label',muted?'Mute preview':'Unmute preview');}
 const play=event.target.closest('button.mm-play');
 if(play){const video=play.closest('.mm-video');if(play.closest('.mm-mobile')){const active=video.classList.toggle('is-previewing');play.setAttribute('aria-label',active?'Close preview':'Preview video');play.setAttribute('aria-pressed',String(active));}else video.classList.add('is-previewing');}
});
// External video destinations keep their link behavior rather than becoming visited-only demos.
document.querySelector('.search-page').addEventListener('click',event=>{
 const link=event.target.closest('a[target="_blank"]');if(link)event.stopImmediatePropagation();
 const next=event.target.closest('.mm-carousel-next');if(next)next.previousElementSibling.scrollBy({left:340,behavior:'smooth'});
},true);
render();
