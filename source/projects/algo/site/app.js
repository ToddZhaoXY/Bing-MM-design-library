const variants={
 "standard": {
  "label": "Standard",
  "description": "A standard web result combines website attribution, a linked title, and a snippet to help users assess the destination before opening it."
 },
 "fact": {
  "label": "With Fact",
  "description": "Adds structured facts below the snippet so users can scan key details before opening the result."
 },
 "list": {
  "label": "With List",
  "description": "Previews entries from the destination page, with optional dates and links, so users can scan the content before opening it."
 }
};
const anatomy=[
 ['Favicon','This is the small icon displayed next to the attribution and represents the destination website. It helps users recognize familiar sites and quickly distinguish between sources when scanning results. The icon is typically pulled from the website’s favicon. When unavailable, a generic fallback icon is displayed.'],
 ['Attribution','This is the “display URL” and tells you where the title click will take you. It may have breadcrumbs or abbreviations to make it more readable. Breadcrumb attribution is on all mobile results.'],
 ['Title','This is the title of the destination document (A website, form or PDF). The Desktop title stays on one line and uses pixel-based truncation with an ellipsis when it exceeds the available width.'],
 ['Snippet','A snippet is 140–180 characters and displayed as 2–4 lines of text. The content comes from the destination and pulled from “metadata” in the header, or from the page content.']
];
const brief={Favicon:'Identifies the destination website.',Attribution:'Shows the destination URL or breadcrumbs.',Title:'Linked document title, truncated to one line with an ellipsis.',Snippet:'A 140–180 character preview of the destination.',Fact:'Label–value pairs below the snippet.','List Title':'Introduces the entries below the snippet.','List Item':'An entry name with an optional short description.'};
const globe='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><circle cx="10" cy="10" r="7"/><ellipse cx="10" cy="10" rx="3" ry="7"/><path d="M3 10h14"/></svg>';
const siteImages={PrepScholar:'prepscholar.png','Harvard College':'harvard-college.png',Faurit:'faurit.png','Rotten Tomatoes':'rotten-tomatoes.png',Careers360:'careers360.png','College Essay Guy':'college-essay-guy.png',IMDb:'imdb.png',MovieWeb:'movieweb.png'};
function siteImage(name){const file=siteImages[name];return file?`<img class="site-image" src="public/assets/sites/${file}" alt="" width="16" height="16">`:globe}
const sourceUrls={Faurit:'https://faurit.com','College Essay Guy':'https://www.collegeessayguy.com',Careers360:'https://www.careers360.com',IMDb:'https://www.imdb.com',MovieWeb:'https://movieweb.com'};
function citationMarkup(name,label=name){return `<a class="source-citation" href="${sourceUrls[name]}" target="_blank" rel="noopener noreferrer" aria-label="Source: ${label}">${siteImage(name)}<span>${label}</span></a>`}
const copilotImage='<img class="copilot-image" src="public/assets/sites/copilot.png" alt="" width="14" height="13">';
const searchSvg='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><circle cx="8" cy="8" r="5"/><path d="m12 12 5 5"/></svg>';
const desktopPageTemplate=document.querySelector('.search-page').innerHTML;
const state={device:document.querySelector('.device-picker')&&new URLSearchParams(location.search).get('device')==='mobile'?'mobile':'desktop',listLinks:'plain',type:'standard',interaction:'default',exampleVisited:false,anatomy:false,treatment:'t1'};
const visitedResults=new Set();
const $=id=>document.getElementById(id);
function resultMarkup(type=state.type,interaction=state.interaction,anatomyOn=state.anatomy){
 const mobile=state.device==='mobile';
 const extra=type==='fact'?`<div class="facts"><span><b>Admission Rate:</b><span class="fact-value">4.2%</span></span><span><b>Application Fee:</b><span class="fact-value">$95 or fee waiver</span></span><span><b>Competitive SAT Target:</b><span class="fact-value">1580+</span></span><span><b>Average GPA:</b><span class="fact-value">4.2</span></span></div>`:type==='list'?`<div class="list-title">Top picks</div><ol class="result-list"><li><span>The Shawshank Redemption: Widely known as the highest-rated film of all time, The …</span><small>1994</small></li><li><span>The Godfather: The Godfather is one of the greatest films of all time, and this is a statement …</span><small>1972</small></li><li><span>The Dark Knight: Revered as Modern Cinema’s Masterpiece, Nolan’s interpretation of a …</span><small>2008</small></li></ol><a href="#example-result" class="more-link">See full list on movieweb.com</a>`:'';
 const content=type==='list'?{icon:'M',source:'MovieWeb',url:'https://movieweb.com',title:'The Top 20 Movies of All Time',snippet:'Aug 26, 2026 · This is it - the top 20 of all time. No genres or years... just 20 of the most watchable and thoroughly enjoyable movies of all time.'}:{icon:'P',source:'PrepScholar',url:'https://www.prepscholar.com › sat › colleges › Harvard...',title:'What You Need For Harvard: Admission Requirements - PrepScholar',snippet:'Harvard University is a private Ivy League research university in Cambridge, Massachusetts, United States. Founded in 1636, and named Harvard College in 1639 in honor of its first benefactor, Puritan clergyman John Harvard, it is the oldest institution of higher learning in the United States. Its influence, wealth, and rankings have made it one of the most prestigious univ'};
 const mobileExtra=mobile?extra.replace(/<span><b>Application Fee:<\/b>.*?<\/span><\/span>/,'').replace(/<span><b>Average GPA:<\/b>.*?<\/span><\/span>/,'').replace('<div class="list-title">Top picks</div>','').replace(/<li><span>(.*?)<\/span>/g,'<li><span><a href="#example-result">$1</a></span>'):extra;
 return `<article class="algo ${mobile?'algo-mobile':''} ${mobile&&type==='list'?'list-linked':''} ${anatomyOn?'show-anatomy':''}" data-state="${interaction}"><div class="attribution"><span class="favicon">${siteImage(content.source)}</span><span class="source"><span>${content.source}</span><small>${content.url}</small></span></div><a class="result-title" href="#result">${content.title}</a><p class="snippet">${content.snippet}</p>${mobileExtra}</article>`;
}
function placeholderMarkup(type=state.type,annotated=false,interactive=false){
 const items=activeAnatomy();
 const mobile=state.device==='mobile';
 const pin=(i)=>annotated?(interactive?`<button class="pin" data-index="${i}" aria-label="${i+1}. ${items[i][0]}" aria-expanded="false" aria-controls="inlineAnatomyPopover"><svg class="pin-number" viewBox="0 0 22 22" aria-hidden="true"><text x="11" y="11" text-anchor="middle" dominant-baseline="central">${i+1}</text></svg></button>`:`<button type="button" class="pin" data-index="${i}" aria-label="${i+1}. ${items[i][0]}" aria-describedby="anatomyDescription"><svg class="pin-number" viewBox="0 0 22 22" aria-hidden="true"><text x="11" y="11" text-anchor="middle" dominant-baseline="central">${i+1}</text></svg></button>`):'';
 const part=(i,name,content)=>`<div class="part part-${name}">${pin(i)}${content}</div>`;
 let extra=type==='fact'?part(4,'fact','<div class="facts"><span><b>Title lorem ipsum:</b><span class="fact-value">Value</span></span><span><b>Title lorem ipsum:</b><span class="fact-value">Value</span></span><span><b>Title lorem ipsum:</b><span class="fact-value">Value</span></span><span><b>Title lorem ipsum:</b><span class="fact-value">Value</span></span></div>'):type==='list'&&!mobile?part(4,'listTitle','<div class="list-title">Title</div>')+part(5,'listItem','<ol class="result-list"><li><span>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</span><small>Mmm DD. YYYY</small></li><li><span>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</span><small>Mmm DD. YYYY</small></li><li><span>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</span><small>Mmm DD. YYYY</small></li></ol><a href="https://lorem.com" class="more-link">See full list on lorem.com</a>'):'';
 if(!mobile&&type==='list'&&state.listLinks==='linked')extra=extra.replace(/<li><span>(.*?)<\/span>/g,'<li><span><a href="#playground">$1</a></span>');
 if(mobile){
  if(type==='fact')extra=part(4,'fact','<div class="facts"><span><b>Title lorem ipsum:</b><span class="fact-value">Value</span></span><span><b>Title lorem ipsum:</b><span class="fact-value">Value</span></span></div>');
  if(type==='list'){
   const entry='Lorem ipsum dolor sit amet, consectetur adipisicing elit.';
   const text=state.listLinks==='linked'?`<a href="#playground">${entry}</a>`:entry;
   extra=part(4,'listItem',`<ol class="result-list">${Array.from({length:3},()=>`<li><span>${text}</span><small>Mmm DD. YYYY</small></li>`).join('')}</ol><a href="https://lorem.com" class="more-link">See full list on lorem.com</a>`);
  }
 }
 return `<article class="algo placeholder-result ${mobile?'algo-mobile':''} ${type==='list'&&state.listLinks==='linked'?'list-linked':''} ${annotated?'annotated':''}" data-state="${interactive||annotated||mobile?state.interaction:'default'}"><div class="attribution">${part(0,'favicon',`<span class="favicon"><img src="public/assets/placeholder-thumbnail.png" alt="" width="16" height="16"></span>`)}${part(1,'source','<span class="source"><span>Site name lorem ipsum</span><small>www.algoloremipsum-attribution.com › ... › ipsum</small></span>')}</div>${part(2,'title','<a class="result-title" href="#playground">Title lorem ipsum dolor consectatur</a>')}${part(3,'snippet','<p class="snippet">Oct 26, 2018 · Snippet lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, ipsum nostrud exercitation ullamco laboris sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Snippet Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt. Snippet Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>')}${extra}</article>`;
}
function previewMarkup(){return placeholderMarkup(state.type,state.treatment==='t2'&&state.anatomy,true)}
function activeAnatomy(){const items=state.device==='mobile'?mobileAnatomy.map(item=>item.slice()):anatomy.slice(0,4);if(state.type==='fact')items.push(['Fact','This highlights key information about the destination content as label–value pairs below the snippet. Each fact has a bold label followed by a regular-weight value. It helps users quickly scan important details and assess the result’s relevance without opening the page.']);if(state.type==='list'){if(state.device!=='mobile')items.push(['List Title','A bold heading below the snippet that introduces the list and provides context for its entries.']);items.push(['List Item','Numbered entries that preview individual items, including a name and, where available, a short description. Long entries are truncated with an ellipsis. Items may be clickable links or plain text, depending on the variant.']);}return items}
let cleanupAnatomy=()=>{};
function anatomyTooltipTarget(part){
 // Rich carousel arrows are absolutely positioned: their static annotation
 // wrapper has no height, so use a visible control's geometry instead.
 if(part.matches?.('.rich-carousel > .part-navigation')){
  return part.querySelector('.rich-next:not([hidden])')||part.querySelector('.rich-prev:not([hidden])')||part;
 }
 if(part.matches?.('.part-snRail'))return part.querySelector('.sn-rail-heading')||part;
 if(part.matches?.('.part-snMore'))return part.querySelector('.sn-toggle')||part;
 return part;
}
function positionAnatomyTooltip(description,part,pin){
 const edge=12,gap=12,viewportWidth=document.documentElement.clientWidth,viewportHeight=window.innerHeight;
 const main=pin.closest('main').getBoundingClientRect();
 const minLeft=Math.max(edge,main.left+edge),maxRight=Math.min(viewportWidth-edge,main.right-edge);
 const header=document.querySelector('.topbar').getBoundingClientRect();
 const minTop=Math.max(edge,header.bottom+gap),maxBottom=viewportHeight-edge;
 // Keep the callout inside the document column, clear of both navigation panels.
 description.style.width=`${Math.min(320,Math.max(0,maxRight-minLeft))}px`;
 description.style.maxHeight=`${Math.max(32,maxBottom-minTop)}px`;
 const target=part.getBoundingClientRect(),badge=pin.getBoundingClientRect(),box=description.getBoundingClientRect();
 const alignLeft=Math.max(minLeft,Math.min(badge.left,maxRight-box.width));
 const candidates=[
  {left:alignLeft,top:target.top-gap-box.height},
  {left:alignLeft,top:target.bottom+gap},
  {left:target.right+gap,top:badge.top},
  {left:target.left-gap-box.width,top:badge.top}
 ].filter(pos=>pos.left>=minLeft&&pos.left+box.width<=maxRight&&pos.top>=minTop&&pos.top+box.height<=maxBottom)
  .filter(pos=>Math.hypot(Math.max(pos.left-badge.right,badge.left-pos.left-box.width,0),Math.max(pos.top-badge.bottom,badge.top-pos.top-box.height,0))<=120);
 // Stay next to this annotation. Prefer an adjacent gap when one is available.
 const neighbours=[...pin.closest('.anatomy-layout').querySelectorAll('.part')]
  .filter(node=>node!==part&&!node.contains(part)&&!part.contains(node))
  .map(node=>node.getBoundingClientRect());
 const overlap=pos=>neighbours.reduce((sum,r)=>sum+Math.max(0,Math.min(pos.left+box.width,r.right)-Math.max(pos.left,r.left))*Math.max(0,Math.min(pos.top+box.height,r.bottom)-Math.max(pos.top,r.top)),0);
 const choice=candidates.find(pos=>overlap(pos)===0)||candidates[0]||{left:alignLeft,top:badge.bottom+gap};
 const {left,top}=choice;
 description.style.left=`${Math.max(minLeft,Math.min(left,maxRight-box.width))}px`;
 description.style.top=`${Math.max(minTop,Math.min(top,maxBottom-box.height))}px`;
}

function renderAnatomy(){
 cleanupAnatomy();
 const items=activeAnatomy();
 $('anatomyMount').innerHTML=placeholderMarkup(state.type,true);
 const mount=$('anatomyMount'),description=$('anatomyDescription');
 description.replaceChildren();description.setAttribute('aria-hidden','true');
 let closeTimer;
 const hide=()=>{clearTimeout(closeTimer);description.setAttribute('aria-hidden','true');mount.querySelectorAll('.is-highlighted').forEach(part=>part.classList.remove('is-highlighted'))};
 const show=pin=>{
  hide();const index=Number(pin.dataset.index),item=items[index];
  pin.closest('.part').classList.add('is-highlighted');
  const heading=document.createElement('strong'),text=document.createElement('p');
  heading.textContent=`${index+1}. ${item[0]}`;text.textContent=item[1];
  description.replaceChildren(heading,text);description.setAttribute('aria-hidden','false');
  positionAnatomyTooltip(description,anatomyTooltipTarget(pin.closest('.part')),pin);
 };
 const scheduleHide=()=>{clearTimeout(closeTimer);closeTimer=setTimeout(()=>{if(!mount.contains(document.activeElement))hide()},180)};
 mount.querySelectorAll('.pin').forEach(pin=>{
  pin.addEventListener('pointerenter',()=>show(pin));
  pin.addEventListener('pointerleave',scheduleHide);
  pin.addEventListener('focus',()=>show(pin));
  pin.addEventListener('blur',scheduleHide);
  pin.addEventListener('click',()=>show(pin));
  pin.addEventListener('keydown',event=>{if(event.key==='Escape'){hide();event.stopPropagation()}});
 });
 description.onpointerenter=()=>clearTimeout(closeTimer);
 description.onpointerleave=scheduleHide;
 const onScroll=event=>{if(!description.contains(event.target))hide()};
 const onEscape=event=>{if(event.key==='Escape')hide()};
 const onOutside=event=>{if(!event.target.closest('#anatomyMount .pin')&&!description.contains(event.target))hide()};
 document.addEventListener('pointerdown',onOutside);
 window.addEventListener('scroll',onScroll,true);window.addEventListener('resize',hide);document.addEventListener('keydown',onEscape);
 cleanupAnatomy=()=>{hide();document.removeEventListener('pointerdown',onOutside);window.removeEventListener('scroll',onScroll,true);window.removeEventListener('resize',hide);document.removeEventListener('keydown',onEscape)};
}

function renderPageExample(){
 // Sectional pages supply their own complete examples after initialization.
 if(['sectional-rich','sectional-expansion','sectional-nav'].includes(document.body.dataset.component))return;
 const page=document.querySelector('.search-page');
 page.classList.toggle('mobile-serp',state.device==='mobile');
 if(state.device==='mobile'){renderMobilePage(page);return}
 if(!page.querySelector('#relatedResults'))page.innerHTML=desktopPageTemplate;
 const isList=state.type==='list',isFact=state.type==='fact';
 document.querySelector('.search-page').dataset.variant=state.type;
 $('searchQuery').textContent=isList?'The Top 20 Movies':'Harvard university application requirements';
 $('contextMount').innerHTML=isList?`<div class="movie-context"><h3>Top 20 movies</h3><span class="movie-info" role="img" aria-label="About these movie recommendations" title="Movie recommendations"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="10" cy="10" r="7.5"/><path d="M10 9v5M10 5.5v1.5"/></svg></span><p>Iconic films spanning decades and genres, reflecting cultural impact and cinematic excellence</p><div class="poster-carousel"><div class="poster-row" tabindex="0" aria-label="Movie posters">${[['The Lord of the Rings: The Fellowship of the Ring','2001 · Epic quest'],['The Godfather','1972 · Mafia epic'],['The Dark Knight','2008 · Hero vs chaos'],['The Shawshank Redemption','1994 · Prison drama'],['Jaws','1975 · Shark thriller'],['Pulp Fiction','1994 · Crime anthology'],['Avengers: Infinity War','2018 · Superhero showdown']].map(([title,detail],i)=>`<div><img src="public/assets/movies/${['fellowship-of-the-ring','the-godfather','the-dark-knight','the-shawshank-redemption','jaws','pulp-fiction','avengers-infinity-war'][i]}.png?v=2" alt="${title} poster" width="168" height="252"><b>${title}</b><small>${detail}</small></div>`).join('')}</div><button class="poster-prev" aria-label="Previous movies" hidden><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg></button><button class="poster-next" aria-label="Next movies"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m10 6 6 6-6 6"/></svg></button></div></div>`:`<div class="serp-overview"><div class="answer-context"><small class="copilot-heading">${copilotImage}<span>Copilot Search</span></small><h3>To apply to Harvard University, you need a strong academic record, high standardized test scores, compelling essays, letters of recommendation, and adherence to application deadlines.</h3><h4>Academic Requirements</h4><p>Harvard is highly selective, with an acceptance rate of around 3%. ${citationMarkup('Faurit','faurit.com +1')} Applicants are expected to have <b>exceptional academic performance</b>, typically with a GPA between <b>3.9 and 4.1</b> for first-year applicants. ${citationMarkup('College Essay Guy')} For international students, a <b>bachelor’s degree equivalent</b> is required for graduate programs, and transcripts must demonstrate strong academic achievement. ${citationMarkup('Careers360')}</p><h4>Standardized Tests</h4><p class="muted-line">Undergraduate applicants: SAT scores between 1500–1600 or ACT scores of 34+ are competitive.</p><button class="read-all" aria-expanded="false">Read all <span aria-hidden="true">⌄</span></button></div><div class="source-cards"><article><small>${siteImage('Faurit')}<span>faurit.com › article › what-you-need-for-harvard-admission-</span></small><b>What You Need For Harvard: Admission Requirements (2026)</b></article><article><small>${siteImage('Careers360')}<span>Careers360 › articles › harvard-university-admission-</span></small><b>Harvard University Admission Requirements for International Students 2025</b></article><article class="source-card-with-image"><small>${siteImage('College Essay Guy')}<span>College Essay Guy › blog › harvard-admission-</span></small><b>Getting Into Harvard: Admission Requirements 2024/2025</b><img class="source-card-thumbnail" src="public/assets/harvard-container.png" alt="Harvard campus" width="60" height="60"></article><button>Show All</button></div><div class="query-chips"><span>Tips to improve Harvard admission chances</span><span>GPA tips for Harvard admission</span><span>High School Courses for Harvard</span></div></div>`;
 if(isList){
  const carousel=$('contextMount').querySelector('.poster-carousel'),row=carousel.querySelector('.poster-row');
  const previous=carousel.querySelector('.poster-prev'),next=carousel.querySelector('.poster-next');
  const update=()=>{const hasPrevious=row.scrollLeft>1,hasNext=row.scrollLeft+row.clientWidth<row.scrollWidth-1;previous.hidden=!hasPrevious;next.hidden=!hasNext;carousel.classList.toggle('has-next',hasNext)};
  previous.onclick=()=>row.scrollBy({left:-552,behavior:'smooth'});
  next.onclick=()=>row.scrollBy({left:552,behavior:'smooth'});
  row.addEventListener('scroll',update,{passive:true});update();
 }
 $('supportResults').innerHTML=isList?`<article class="algo support-result"><div class="support-source"><i>R</i><span>Rotten Tomatoes<small>https://editorial.rottentomatoes.com › guide › popular-movies</small></span></div><a>30 Most Popular Movies Right Now: What to Watch In Theaters and …</a><p>1 day ago · Discover the top, most popular movies available now, along with what’s stoking early buzz and hype! Across theaters, …</p></article>`:`<article class="algo support-result"><div class="support-source"><i>H</i><span>Harvard College<small>https://college.harvard.edu › admissions › apply › first...</small></span></div><a>First-Year Applicants | HarvardFirst-Year Applicants | Harvard</a><p>Oct 26, 2018 · You may apply to Harvard under either our Restrictive Early Action (REA) or our Regular Decision (RD) …</p></article><article class="algo support-result"><div class="support-source"><i>F</i><span>Faurit<small>https://faurit.com › article › what-you-need-for-harvard-admission-requirements</small></span></div><a>What You Need For Harvard: Admission Requirements (2026)</a><p>9 hours ago · In this guide we’ll cover what you need to get into Harvard and build a strong application. School location: Cambridge, …</p></article>`;
 $('relatedTitle').textContent=isList?'Deep dive into The Top 20 Movies':'Deep dive into Harvard university applications';
 const related=isList?['top 100 movies','best movies','top 20 movies right now','top 20 best movies of all time','top 20 greatest movies','top 20 movies on netflix','best 20 movies of all time']:['Harvard university online application 2026','Harvard university application deadline 2026','Harvard fall 2026 application','Applying for Harvard university admission','Harvard admission 2026','Harvard university prospectus 2026','can you get into Harvard quiz'];
 document.querySelectorAll('#supportResults .support-result').forEach(article=>{
  const source=article.querySelector('.support-source');source.className='attribution';
  const icon=source.querySelector('i');icon.className='favicon';icon.innerHTML=siteImage(source.querySelector('span').firstChild.textContent.trim());
  const text=source.querySelector('span');text.className='source';const name=document.createElement('span');name.textContent=text.firstChild.textContent;text.firstChild.replaceWith(name);
  const link=article.querySelector('a');link.className='result-title';link.href='#example-result';
  article.querySelector('p').className='snippet';
 });
 $('relatedResults').innerHTML=related.map(x=>`<span>${searchSvg}${x}</span>`).join('');
}
function listOverviewMarkup(){return `<div class="list-overview answer-context"><small class="copilot-heading">${copilotImage}<span>AI Overview</span></small><h3>Here are the top 20 movies of all time according to IMDb and MovieWeb rankings, celebrated for their storytelling, performances, and cultural impact.</h3><h4>Top 20 Movies</h4><ol><li><b>Braveheart (1995)</b> – A historical epic about William Wallace leading Scotland’s rebellion against English rule, known for its emotional depth and iconic battle scenes. ${citationMarkup('IMDb')}</li><li><b>The Godfather (1972)</b> – Francis Ford Coppola’s masterpiece chronicling the Corleone crime family, a benchmark in cinematic storytelling. ${citationMarkup('MovieWeb')}</li><li class="overview-extra" hidden><b>The Shawshank Redemption (1994)</b> – A tale of hope and friendship set in a prison.</li></ol><button class="show-more" aria-expanded="false">Show more ⌄</button><div class="overview-sources"><a href="#example-result"><small>${siteImage('IMDb')}<span>IMDb</span></small><b>20 Greatest Movies of ALL TIME</b></a><a href="#example-result"><small>${siteImage('MovieWeb')}<span>MovieWeb</span></small><b>The Top 20 Movies of All Time, According</b></a></div></div>`}
function updateCodeSample(){
 const markup=placeholderMarkup(state.type,false,true).replace(' href="#playground"',' href="https://example.com"').replace(' data-state="default"','').replace(/></g,'>\n<');
 $('codeSample').textContent='<link rel="stylesheet" href="algo-block.css">\n'+(state.device==='desktop'?'<link rel="stylesheet" href="desktop-figma.css">\n':'<link rel="stylesheet" href="mobile-figma.css">\n')+'<link rel="stylesheet" href="component-responsive.css">\n'+markup;
 if(typeof applyMosaicSDL==='function')applyMosaicSDL('algo',state.device,state.type,state.listLinks);
}
function render(){
 document.body.dataset.device=state.device;
 document.querySelectorAll('[data-device]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.device===state.device)));
 if($('listLinkOptions'))$('listLinkOptions').hidden=state.type!=='list';
 const hoverOption=$('stateControl').querySelector('[value=hover]');if(hoverOption)hoverOption.hidden=hoverOption.disabled=state.device==='mobile';
 $('stateControl').value=state.interaction;
 if($('anatomyHelp'))$('anatomyHelp').textContent=state.device==='mobile'?'Hover, focus or tap a numbered badge to explore each part.':'Hover or focus a numbered badge to explore each part.';
 if($('exampleHelp'))$('exampleHelp').textContent=state.device==='mobile'?'Tap a title or list link to mark it visited. Reset clears visited states.':'Hover the title to preview its hover state. Click it to mark it visited.';
 $('variantHeading').textContent=variants[state.type].label;
 $('variantDescription').textContent=variants[state.type].description;
 $('exampleHeading').textContent='Example';
 $('resultMount').innerHTML=previewMarkup();
 renderPageExample();
 const exampleMount=$('exampleMount');
 if(state.device==='desktop'&&(!document.body.dataset.component||document.body.dataset.component==='algo')&&exampleMount)exampleMount.innerHTML=(state.type==='list'?listOverviewMarkup():'')+resultMarkup(state.type,state.exampleVisited?'visited':'default',false);
 document.querySelectorAll('.search-page a').forEach(link=>link.classList.toggle('is-visited',visitedResults.has(state.device+':'+state.type+':'+link.textContent)));
 updateCodeSample();
 document.querySelectorAll('#resultMount .pin').forEach(pin=>pin.addEventListener('click',()=>{
  const pop=$('inlineAnatomyPopover'),item=activeAnatomy()[Number(pin.dataset.index)],wasOpen=pin.getAttribute('aria-expanded')==='true';
  closeAnatomy(); if(wasOpen)return;
  pin.setAttribute('aria-expanded','true');pop.innerHTML=`<button aria-label="Close explanation">×</button><strong>${Number(pin.dataset.index)+1}. ${item[0]}</strong><p>${brief[item[0]]}</p>`;pop.hidden=false;
  pop.querySelector('button').onclick=()=>{closeAnatomy();pin.focus()};
 }));
 document.querySelectorAll(document.body.dataset.component?.startsWith('sectional-')?'#resultMount .result-list a':'#resultMount .result-title, #resultMount .result-list a').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();if(link.closest('.result-list')){link.classList.add('is-visited');return}state.interaction='visited';$('stateControl').value='visited';link.closest('.algo').dataset.state='visited';updateCodeSample();if(state.device==='mobile')renderAnatomy()}));
 document.querySelectorAll('.page-nav a[href="#anatomy"]').forEach(a=>a.hidden=state.treatment==='t2');
 renderAnatomy();
}
function closeAnatomy(){ $('inlineAnatomyPopover').hidden=true;document.querySelectorAll('.pin[aria-expanded]').forEach(p=>p.setAttribute('aria-expanded','false'));}
document.querySelectorAll('[data-device]').forEach(button=>button.addEventListener('click',()=>{
 if(state.device===button.dataset.device)return;
 closeAnatomy();state.device=button.dataset.device;
 if(state.device==='mobile'&&['hover','card-hover'].includes(state.interaction))state.interaction='default';
 const url=new URL(location.href);if(state.device==='mobile')url.searchParams.set('device','mobile');else url.searchParams.delete('device');
 history.replaceState(null,'',url);render();
}));
$('listLinkControl')?.addEventListener('change',event=>{state.listLinks=event.target.value;closeAnatomy();render()});
$('typeControl').addEventListener('change',e=>{state.type=e.target.value;state.exampleVisited=false;$('inlineAnatomyPopover').hidden=true;render()});
$('stateControl').addEventListener('change',e=>{state.interaction=e.target.value;closeAnatomy();render()});
$('anatomyControl').addEventListener('change',e=>{state.anatomy=e.target.checked;$('inlineAnatomyPopover').hidden=true;render()});
$('resetExample').addEventListener('click',()=>{for(const key of visitedResults){if(key.startsWith(state.device+':'+state.type+':'))visitedResults.delete(key)}document.querySelectorAll('.search-page .is-visited').forEach(a=>a.classList.remove('is-visited'))});
document.querySelectorAll('.treatment-picker [data-treatment]').forEach(button=>button.addEventListener('click',()=>{closeAnatomy();state.treatment=button.dataset.treatment;state.anatomy=false;$('anatomyControl').checked=false;document.querySelectorAll('.treatment-picker [data-treatment]').forEach(b=>(b.classList.toggle('active',b===button),b.setAttribute('aria-pressed',String(b===button))));document.body.dataset.treatment=state.treatment;render()}));
document.body.dataset.treatment='t1';
$('copyButton').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('codeSample').textContent);$('copyButton').textContent='Copied'}catch{$('copyButton').textContent='Select code to copy';const r=document.createRange();r.selectNodeContents($('codeSample'));getSelection().removeAllRanges();getSelection().addRange(r)}setTimeout(()=>$('copyButton').textContent='Copy code',1600)});
render();

document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAnatomy()});
document.querySelector('.search-page').addEventListener('click',e=>{const link=e.target.closest('a');if(link&&!link.classList.contains('source-citation')){e.preventDefault();visitedResults.add(state.device+':'+state.type+':'+link.textContent);link.classList.add('is-visited')}const button=e.target.closest('.read-all');if(button){const para=button.previousElementSibling;const expanded=button.getAttribute('aria-expanded')==='true';button.setAttribute('aria-expanded',String(!expanded));para.classList.toggle('muted-line',expanded);para.classList.toggle('expanded-answer',!expanded);button.textContent=expanded?'Read all ⌄':'Collapse ⌃'}});

const exampleViewport=document.querySelector('.search-viewport');


const exampleHome=exampleViewport.parentElement;
$('expandExample').onclick=()=>{$('pageDialogTitle').textContent=variants[state.type].label+' example';$('pageDialogMount').append(exampleViewport);$('pageDialog').showModal();};
$('pageDialog').addEventListener('close',()=>{exampleHome.append(exampleViewport);$('expandExample').focus()});
document.querySelector('.search-page').addEventListener('click',event=>{
 const more=event.target.closest('.show-more');if(more){const expanded=more.getAttribute('aria-expanded')==='true';more.setAttribute('aria-expanded',String(!expanded));more.closest('.list-overview').querySelector('.overview-extra').hidden=expanded;more.textContent=expanded?'Show more ⌄':'Show less ⌃'}
 if(event.target.closest('.source-cards>button')){
  const sources=[['Faurit','What You Need For Harvard: Admission Requirements (2026)','https://faurit.com'],['Careers360','Harvard University Admission Requirements for International Students 2025','https://www.careers360.com'],['College Essay Guy','Getting Into Harvard: Admission Requirements 2024/2025','https://www.collegeessayguy.com']];
  $('allSources').replaceChildren();for(const [name,title,url] of sources){const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';const text=document.createElement('span');text.textContent=title;const source=document.createElement('small');source.textContent=name;a.append(text,source);$('allSources').append(a)}$('sourcesDialog').showModal();
 }
});
