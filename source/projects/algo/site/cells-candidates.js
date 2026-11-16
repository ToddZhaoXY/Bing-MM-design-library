// Review candidates use the same renderers and CSS as their source Organisms.
const AlgoCellCandidates=(()=>{
 const image='public/assets/mm/thumbnail-placeholder.png';
 const title='Title lorem ipsum dolor consectatur';
 const contentOptions=[['title','Title'],['fact','Title + Fact'],['snippet','Title + Snippet'],['url','Title + URL'],['factUrl','Title + Fact + URL'],['snippetUrl','Title + Snippet + URL']];
 const select=(key,label,values,defaultValue=values[0][0])=>({key,label,values,defaultValue});
 const richSource={source:'Mainline Rich Nav Carousel',page:'rich-nav-carousel.html',desktop:'284-34561',mobile:'748-38472'};
 const wrap=(content,device,extra='',attrs='')=>`<div class="cell-preview algo cell-wide-preview ${extra} ${device==='mobile'?'algo-mobile':''}" ${attrs}>${content}</div>`;
 const richData=options=>({image,title:options.content==='title'?'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor':title,
  ...(options.content?.toLowerCase().includes('fact')?{fact:'Fact · Fact · Fact'}:{}),
  ...(options.content?.toLowerCase().includes('snippet')?{snippet:'Snippet lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do'}:{}),
  ...(options.content?.toLowerCase().includes('url')?{url:'lorem.com'}:{})});
 const definitions=[
  {...richSource,id:'rich-content-item',name:'Rich Content Item',description:'Candidate: one image-led item from the Mainline carousel, with optional facts, a snippet, URL, rating or video accessory.',props:[['title','Item headline'],['image','Thumbnail image'],['snippet, fact, url','Optional supporting content']],
   controls:[select('content','Content',contentOptions),select('accessory','Thumbnail',[['default','Default'],['rating','Rating'],['video','Video']])],styles:['rich-nav-carousel.css','rich-mobile.css'],
   sample:richData,preview:(options,device)=>wrap(AlgoCells.richContentItem(richData(options),{accessory:options.accessory}),device,'rich-result cell-rich-item '+(device==='mobile'?'rich-mobile':''),`data-content="${options.content}"`)},
  {id:'wiki-fact-item',name:'Wiki / Fact Item',description:'Candidate: one topic or fact item from Sectional Expansion. Desktop uses a card; Mobile uses a list row. Expand it to read the supporting details.',source:'Sectional Expansion',page:'sectional-expansion.html',desktop:'303-2279',mobile:'904-23450',props:[['title','Wiki title or fact value'],['summary','Wiki summary or fact label'],['description','Expanded details'],['image','Optional thumbnail'],['href','Continue reading destination']],
   controls:[select('layout','Content',[['wiki','Wiki'],['fact','Fact']]),select('state','State',[['collapsed','Collapsed'],['expanded','Expanded']]),select('images','Image',[['with','With image'],['without','Without image']])],styles:['sectional-expansion.css','sectional-mobile.css'],
   sample:options=>({title:options.layout==='fact'?'Value lorem ipsum':'Title lorem ipsum',summary:options.layout==='fact'?'Label lorem ipsum':'Snippet lorem ipsum dolor sit amet.',description:'Snippet lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',image:'public/assets/placeholder-thumbnail.png',href:'https://example.com'}),
   preview(options,device){return `<div class="cell-preview sectional-expansion cell-wiki-preview ${device==='mobile'?'sectional-mobile':''}" data-layout="${options.layout}"><div class="se-cards">${AlgoCells.wikiFactItem(this.sample(options),{device,type:options.layout,open:options.state==='expanded',images:options.images==='with'?'all':'none'})}</div></div>`},
   sourceLayout:options=>options.layout,sourceNode:(options,device)=>options.layout==='fact'?(device==='mobile'?'904-26031':'303-4470'):(device==='mobile'?'904-23450':'303-2279'),
   click(event,options,root){if(!event.target.closest('.se-card-toggle'))return false;options.state=options.state==='expanded'?'collapsed':'expanded';return '.se-card-toggle'}},
  {...richSource,id:'carousel-navigation',name:'Carousel Navigation',description:'Candidate: the Desktop previous and next controls, shown with their scrolling context. Mobile uses horizontal swipe and keyboard scrolling without arrow buttons.',props:[],
   controls:[],styles:['rich-nav-carousel.css','rich-mobile.css'],sample:()=>({}),
   preview(options,device){const buttons=AlgoCells.carouselNavigation();
    const cards=Array.from({length:5},(_,i)=>AlgoCells.richContentItem({image,title:'Related content '+(i+1)})).join('');
    return wrap(`<div class="rich-carousel ${device==='mobile'?'rich-mobile-carousel':''}"><div class="rich-track" tabindex="0" aria-label="Related content; scroll horizontally">${cards}</div>${device==='mobile'?'':buttons}</div>`,device,'rich-result cell-carousel-context '+(device==='mobile'?'rich-mobile':''),'data-content="title"')},
   afterRender(root,options,device){const track=root.querySelector('.rich-track');const previous=root.querySelector('.rich-prev'),next=root.querySelector('.rich-next');
    const sync=()=>{const max=Math.max(0,track.scrollWidth-track.clientWidth);if(previous)previous.hidden=track.scrollLeft<=1;if(next)next.hidden=track.scrollLeft>=max-1};
    track.scrollLeft=0;sync();track.addEventListener('scroll',sync);
    previous?.addEventListener('click',()=>track.scrollBy({left:-track.clientWidth,behavior:'smooth'}));next?.addEventListener('click',()=>track.scrollBy({left:track.clientWidth,behavior:'smooth'}));}
  }
 ];
 return Object.freeze({definitions});
})();
