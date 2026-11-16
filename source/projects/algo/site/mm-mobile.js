/* Mobile MM compositions follow the supplied Image / Video Caption specimens. */
function mmMobileAnatomy(){
 const items=mobileAnatomy.map(item=>item.slice());
 if(state.type==='video'){
  items[3]=['Video Snippet','Descriptive text below the video provides context about its content.'];
  items.push(['Video Thumbnail','A full-width visual preview below the title, with a duration and play control.']);
  items.push(['Video Metadata','The author’s name and view count appear on separate lines below the snippet.']);
 }else items.push(['Image Caption',state.imageCount===1?'A single visual preview sits beside the snippet.':'A full-width image collage sits below the title and above the snippet.']);
 return items;
}
function mmMobileImages(annotated=false){
 return mmPart(4,'media',`<div class="mm-images mm-images-${state.imageCount}">${Array.from({length:state.imageCount},(_,index)=>`<span class="mm-image-slot"><img src="public/assets/figma-placeholder-original.png" alt="Visual content placeholder" width="512" height="${state.imageCount===3&&index>0?289:512}"></span>`).join('')}</div>`,annotated);
}
function mmMobileVideo(actual=false){
 return `<div class="mm-video"><img src="public/assets/mm/${actual?'video-card.png':'video-figma-placeholder.png'}" alt="${actual?'Sunrise over the clouds at Mount Tai':'Mountain lake video preview'}" width="480" height="270"><span class="mm-duration">99:99</span><span class="mm-preview-label">Preview</span>${mmMuteMarkup}<button type="button" class="mm-play" aria-label="Preview video" aria-pressed="false">▶</button>${actual?'':`<div class="mm-mobile-video-caption"><b>Title Lorem ipsum dolor sit amet consectetur.</b><span><img src="public/assets/rich/youtube.png" alt="YouTube" width="16" height="16">Source · https://www.lorem.com</span></div>`}</div>`;
}
function mmMobilePlaceholder(type,annotated=false,interactive=false){
 const source=`<div class="attribution">${mmPart(0,'favicon','<span class="favicon"><img src="public/assets/placeholder-thumbnail.png" alt="" width="16" height="16"></span>',annotated)}${mmPart(1,'source','<span class="source"><span>Site name lorem ipsum</span><small>www.algoloremipsum-attribution.com › ... › ipsum</small></span>',annotated)}</div>`;
 const title=mmPart(2,'title',`<a class="result-title" href="#playground">${type==='video'?'Mutual Funds and Mutual Fund Investing':'Title Lorem ipsum dolor sit amet'}</a>`,annotated);
 const snippet=mmPart(3,'snippet',`<p class="snippet">${mmSnippet}</p>`,annotated);
 const metadata=type==='video'?mmPart(5,'metadata','<div class="mm-metadata"><span><b>Author:</b> Author name</span><span><b>Views:</b> 22M</span></div>',annotated):'';
 const content=type==='video'?`${mmPart(4,'media',mmMobileVideo(),annotated)}${snippet}${metadata}`:state.imageCount===1?`<div class="mm-mobile-row">${snippet}${mmMobileImages(annotated)}</div>`:`${mmMobileImages(annotated)}${snippet}`;
 return `<article class="algo algo-mobile mm-algo mm-mobile mm-mobile-${type==='video'?'video':'image-'+state.imageCount} ${annotated?'annotated':''}" data-state="${interactive||state.device==='mobile'?state.interaction:'default'}">${source}${title}${content}</article>`;
}
function mmMobileAvatar(){
 const count=state.imageCount;
 const media=`<div class="mm-images mm-images-${count}">${['avatar-characters','avatar-pandora','avatar-landscape'].slice(0,count).map((asset,i)=>`<span class="mm-image-slot"><img src="public/assets/mm/${asset}.png" alt="${['Jake and Neytiri in Avatar','Avatar landscape of Pandora','Floating mountains of Pandora'][i]}"></span>`).join('')}</div>`;
 const snippet='<p class="snippet">Dec 18, 2009 · From Academy Award® winning director James Cameron comes “Avatar,” set in the year 2154, in which former Marine Jake Sully is recruited for a mission on Pandora, a distant moon where a corporate consortium is mining a rare mineral that is key to solving Earth’s energy crisis.</p>';
 return `<article class="algo algo-mobile mm-algo mm-mobile mm-mobile-image-${count}">${mmSource('Avatar','https://www.avatar.com › movies › avatar')}<a class="result-title" href="#example-result">Avatar (2009) | Avatar.com</a>${count===1?`<div class="mm-mobile-row">${snippet}${media}</div>`:media+snippet}</article>`;
}
function renderMMMobileExample(page){
 if(state.type==='video'){
  page.dataset.variant='video';
  page.classList.add('mm-mobile-component-example');
  page.innerHTML=`<div class="mobile-result-stack"><div id="exampleMount"><article class="algo algo-mobile mm-algo mm-mobile mm-mobile-video">${mmSource('Facebook','https://www.facebook.com')}<a class="result-title" href="#example-result">A stunning sea of clouds enveloped the top of Mount Tai, creating a fairyland for visitors</a>${mmMobileVideo(true)}<p class="snippet">${mmSnippet}</p><div class="mm-metadata"><span><b>Author:</b> Author name</span><span><b>Views:</b> 22M</span></div></article></div></div>`;
 }else{
  page.classList.remove('mm-mobile-component-example');
  const type=state.type;
  state.type='list';renderMobilePage(page);state.type=type;
  page.dataset.variant=type;
  $('exampleMount').innerHTML=mmMobileAvatar();
  $('supportResults').innerHTML=`<article class="algo algo-mobile support-result"><div class="attribution"><span class="favicon">${siteImage('IMDb')}</span><span class="source"><span>IMDb</span><small>https://www.imdb.com › chart › top</small></span></div><a class="result-title" href="#example-result">IMDb Top 250 movies</a><p class="snippet">The top rated movie list only includes feature films. Learn more.</p></article>`;
 }
}
