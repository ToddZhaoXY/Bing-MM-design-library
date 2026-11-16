// Rich Nav Carousel reuses the established documentation shell.
const richDescription='This feature presents related content in a horizontally browsable row within a search result. It combines visual previews with concise text, helping users scan multiple items and discover relevant content without clicking into the website.';
const richOptions={title:'Title',fact:'Title + Fact',snippet:'Title + Snippet',url:'Title + URL',factUrl:'Title + Fact + URL',snippetUrl:'Title + Snippet + URL'};
Object.keys(variants).forEach(key=>delete variants[key]);
const richVariantDescriptions={
 title:'Each carousel item shows an image and a title. Use the thumbnail options to compare the available treatments, then browse the row to explore more items.',
 fact:'Each carousel item adds a concise fact line below its image and title. Use this option when a short detail helps people compare destinations.',
 snippet:'Each carousel item adds a short description below its image and title. Use this option when a destination needs more context before opening it.',
 url:'Each carousel item shows its destination URL with an image and title. Use this option when the source helps people decide which item to open.',
 factUrl:'Each carousel item combines an image, title, concise fact line, and destination URL. Compare the items using both their details and their sources.',
 snippetUrl:'Each carousel item combines an image, title, short description, and destination URL. Browse the row to compare context and sources before opening an item.'
};
for(const [key,label] of Object.entries(richOptions))variants[key]={label,description:richVariantDescriptions[key]};
$('typeControl').innerHTML=Object.entries(richOptions).map(([key,label])=>`<option value="${key}">${label}</option>`).join('');
$('typeControl').closest('label').firstChild.textContent='Content';
$('heroDescription').textContent=richDescription;
state.type='title';state.accessory='default';
const richAccessoryRow=document.createElement('label');richAccessoryRow.innerHTML='Thumbnail<select id="richAccessory"><option value="default">Default</option><option value="rating">Rating</option><option value="video">Video</option></select>';$('typeControl').closest('label').after(richAccessoryRow);
$('richAccessory').onchange=event=>{state.accessory=event.target.value;render()};
const richPin=index=>`<button type="button" class="pin" data-index="${index}" aria-label="${index+1}. ${activeAnatomy()[index][0]}" aria-describedby="anatomyDescription"><svg class="pin-number" viewBox="0 0 22 22" aria-hidden="true"><text x="11" y="11" text-anchor="middle" dominant-baseline="central">${index+1}</text></svg></button>`;
const richPart=(index,name,content,on)=>`<div class="part part-${name}">${on?richPin(index):''}${content}</div>`;
activeAnatomy=function(){if(state.device==='mobile')return richMobileAnatomy();return [...anatomy.slice(0,4),['Carousel Title','A bold heading below the snippet that introduces the group of items.'],['Item Row','A horizontal arrangement of items using a cardless design, without individual card borders or backgrounds.'],['Navigation Control','An arrow button at the edge of the carousel that lets users browse additional items horizontally.']]};
const richCard=(data={},accessory=state.accessory)=>AlgoCells.richContentItem(data,{accessory});
const richCarousel=(cards,annotated=false)=>state.device==='mobile'?richMobileCarousel(cards,annotated):`<div class="rich-carousel">${richPart(5,'carousel',`<div class="rich-track" tabindex="0" aria-label="Related content">${cards}</div>`,annotated)}${richPart(6,'navigation',AlgoCells.carouselNavigation(),annotated)}</div>`;
function richPlaceholderData(type){
 const data={title:type==='title'?'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor':'Title lorem ipsum dolor consectatur'};
 if(type.toLowerCase().includes('url')||type==='url')data.url='lorem.com';
 if(type.toLowerCase().includes('fact'))data.fact='Fact · Fact · Fact';
 if(type.toLowerCase().includes('snippet'))data.snippet='Snippet lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do';
 return data;
}
$('richVariationMount').innerHTML=Object.entries(richOptions).map(([type,label])=>`<div class="rich-variation" data-content="${type}">${richCard(richPlaceholderData(type),'default')}<p>${label}</p></div>`).join('');
placeholderMarkup=function(type=state.type,annotated=false,interactive=false){
 const data=richPlaceholderData(type);
 return `<article data-content="${type}" class="algo rich-result ${state.device==='mobile'?'algo-mobile rich-mobile':''} ${annotated?'annotated':''}" data-state="${interactive||annotated?state.interaction:'default'}"><div class="attribution">${richPart(0,'favicon',AlgoCells.favicon(),annotated)}${richPart(1,'source',AlgoCells.attribution({name:'Site name lorem ipsum',url:'www.algoloremipsum-attribution.com › ... › ipsum'}),annotated)}</div>${richPart(2,'title',AlgoCells.resultTitle({title:'Title lorem ipsum dolor consectatur',href:'#playground'}),annotated)}${richPart(3,'snippet',AlgoCells.resultSnippet({snippet:'Oct 26, 2018 · Snippet lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, ipsum nostrud exercitation ullamco laboris sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}),annotated)}${richPart(4,'carouselTitle',`<h3 class="rich-carousel-title">${state.device==='mobile'?'Title Lorem ipsum dolor sit amet':'Title'}</h3>`,annotated)}${richCarousel(Array.from({length:5},()=>richCard(data)).join(''),annotated)}</article>`;
};
previewMarkup=function(){return placeholderMarkup(state.type,false,true)};
const richBaseRender=render;
render=function(){richBaseRender();renderRichMobileAccessories();if(state.device==='mobile')$('exampleHelp').textContent='Swipe to browse cards. Tap a title or card to mark it visited. Reset starts again.';requestAnimationFrame(()=>document.querySelectorAll('.rich-track').forEach(richUpdateArrows))};
updateCodeSample=function(){
 $('codeSample').textContent='<link rel="stylesheet" href="algo-block.css">\n<link rel="stylesheet" href="rich-nav-carousel.css">\n'+(state.device==='mobile'?'<link rel="stylesheet" href="rich-mobile.css">\n':'')+(state.device==='desktop'?'<link rel="stylesheet" href="desktop-figma.css">\n':'<link rel="stylesheet" href="mobile-figma.css">\n')+'<link rel="stylesheet" href="component-responsive.css">\n'+placeholderMarkup().replace(/></g,'>\n<');
 if(typeof applyMosaicSDL==='function')applyMosaicSDL('rich',state.device,state.type,state.accessory);
};
const richExamples={
 article:{label:'Article',name:'Iceland Travel',url:'https://www.icelandtravel.is',title:'Iceland Travel – Your DMC in Iceland | Iceland Travel',snippet:'Iceland Travel is a leading travel company, tour operator, and destination management company (DMC) in Iceland, offering expertly planned self-drive trips, guided tours, and tailor-made adventures. Discover Iceland through local expertise and thoughtfully crafted travel experiences.',heading:'Top Attractions in Iceland',cards:[['Blue Lagoon Geothermal Spa & Lava Landscapes','From ISK 11,990 · 2–3 hrs'],['Seljalandsfoss Waterfall & Walk-Behind Trail','Free entry · 45–60 min'],['Reynisfjara Black Sand Beach & Basalt Columns','Free entry · 45–60 min']]},
 posts:{label:'Posts',name:'Instagram',url:'https://www.instagram.com/ladygaga/',title:'Lady Gaga (@ladygaga) • Instagram photos and videos',snippet:'61M Followers, 119 Following, 3,845 Posts – Explore Lady Gaga’s Instagram for photos, videos, music updates, performance highlights, and behind-the-scenes moments. @hauslabs @austinn @btwfoundation',heading:'Recent Posts',cards:[['A little backstage magic before the show ✨','2 days ago · 428K likes'],['On stage, feeling every moment with you ❤️','5 days ago · 1.2M likes'],['Music, makeup, and a little self-expression 💄','1 week ago · 356K likes']]},
 news:{label:'News',name:'BBC',url:'https://www.bbc.com/news',title:'BBC News – Breaking news, video and the latest top stories from the…',snippet:'Visit BBC News for the latest news, breaking news, video, audio and analysis. BBC News provides trusted World, U.S. and U.K. news, covering politics, business, technology, science, health and more.',heading:'Top Stories',cards:[['Thick fog to create dangerous driving conditions for UK commuters','BBC News · 2h'],['Luxury cruise passengers stranded in Cambodia due to soaring fuel costs','BBC News · 2h'],['Neil Young again sues Trump campaign over use of his song at rally','BBC News · 3h'],['How artificial intelligence is changing the way we work and live','BBC News · 1h'],['The race to return humans to the Moon and build a lasting presence','BBC News · 1h']]},
 products:{label:'Products',name:'nike.in',url:'https://www.nike.in/men/men-s-shoes',title:'Nike – Official Online Store for Athletic Shoes, Clothing & Gear',snippet:'Shop the latest Nike athletic shoes, clothing and sports gear. Explore running shoes, everyday sneakers and performance essentials for men, women and kids, with styles designed for sport and everyday comfort.',heading:'Featured Shoes',accessory:'rating',cards:[['Nike Air Force 1 ’07 Men’s Classic Low-Top Sneakers','$115.00','4.6'],['Nike Dunk Low Retro Men’s Basketball-Inspired Sneakers','$115.00','4.5'],['Nike Air Max 90 Men’s Cushioned Everyday Sneakers','$135.00','4.8']]},
 video:{label:'Video',name:'YouTube',url:'https://www.youtube.com',title:'YouTube – Watch Videos, Enjoy Music & Share Your Stories',snippet:'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.',heading:'Popular Videos',accessory:'video',cards:[['I Spent 7 Days Exploring Japan’s Most Beautiful Hidden Towns','2.4M views · 3 days ago','18:42'],['30-Minute Recipes That Make Weeknight Dinners So Much Easier','856K views · 1 week ago','12:35'],['Inside the Incredible Technology Shaping Our Future','1.8M views · 5 days ago','15:08']]}
};
const richAssetGroups={article:['iceland','blue-lagoon','seljalandsfoss','reynisfjara'],posts:['instagram','gaga-backstage','gaga-onstage','gaga-portrait'],news:['bbc','bbc-fog','bbc-cruise','bbc-neil-young'],products:['nike','nike-air-force','nike-dunk','nike-air-max'],video:['youtube','japan-towns','dinner-recipes','technology']};
const richExampleControl=document.createElement('select');richExampleControl.id='richExampleControl';richExampleControl.setAttribute('aria-label','Example');richExampleControl.innerHTML=Object.entries(richExamples).map(([key,item])=>`<option value="${key}">${item.label}</option>`).join('');document.querySelector('.example-actions').prepend(richExampleControl);richExampleControl.onchange=()=>renderPageExample();
const richExampleViewport=document.querySelector('.search-viewport');richExampleViewport.innerHTML='<div id="richExampleMount"></div>';
renderPageExample=function(){
 const key=richExampleControl.value||'article';if(state.device==='mobile'){renderRichMobileExample(key);return}const item=richExamples[key],assets=richAssetGroups[key];
 const cards=item.cards.slice(0,assets.length-1).map(([title,fact,badge],i)=>richCard({title,fact,rating:badge,duration:badge,image:'public/assets/rich/'+assets[i+1]+'.png',alt:title},item.accessory||'default')).join('');
 $('richExampleMount').innerHTML=`<article class="algo rich-result" data-example="${key}"><div class="attribution"><span class="favicon"><img src="public/assets/rich/${assets[0]}.png" alt="" width="16" height="16"></span><span class="source"><span>${item.name}</span><small>${item.url}</small></span></div><a class="result-title" href="#rich-example">${item.title}</a><p class="snippet">${item.snippet}</p><h3 class="rich-carousel-title">${item.heading}</h3>${richCarousel(cards)}</article>`;
 requestAnimationFrame(()=>{$('richExampleMount').querySelectorAll('.rich-track').forEach(richUpdateArrows)});
};
function richTrackEnd(track){const last=track.querySelector('.rich-card:last-child');return last?Math.max(0,track.scrollLeft+last.getBoundingClientRect().right-track.getBoundingClientRect().right):0}
function richUpdateArrows(track){const carousel=track.closest('.rich-carousel');if(!carousel.querySelector('.rich-prev')||!carousel.querySelector('.rich-next'))return;carousel.querySelector('.rich-prev').hidden=track.scrollLeft<2;carousel.querySelector('.rich-next').hidden=track.scrollLeft>=richTrackEnd(track)-16;}
document.addEventListener('scroll',event=>{if(event.target.matches?.('.rich-track'))richUpdateArrows(event.target)},true);
window.addEventListener('resize',()=>document.querySelectorAll('.rich-track').forEach(richUpdateArrows));
document.addEventListener('click',event=>{
 const arrow=event.target.closest('.rich-next,.rich-prev');
 if(arrow){const track=arrow.closest('.rich-carousel').querySelector('.rich-track');track.scrollTo({left:Math.max(0,Math.min(richTrackEnd(track),track.scrollLeft+(arrow.matches('.rich-prev')?-1:1)*470)),behavior:'smooth'});return}
 const card=event.target.closest('.rich-card');if(card){event.preventDefault();card.classList.add('is-visited')}
 const result=event.target.closest('#richExampleMount .result-title');if(result){event.preventDefault();result.classList.add('is-visited')}
});
$('resetExample').onclick=()=>renderPageExample();
render();
