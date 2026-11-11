() => {
 const px=value=>Number(value.replace('px',''));
 const issues=[],counts={cases:document.querySelectorAll('.qa-case:not([hidden])').length,clamped:0};
 for(const el of document.querySelectorAll('.qa-case:not([hidden]) .qa-specimen *')){
  if(el.namespaceURI!=='http://www.w3.org/1999/xhtml'||!el.getClientRects().length)continue;
  const s=getComputedStyle(el),lines=Number(s.getPropertyValue('-webkit-line-clamp')),lh=px(s.lineHeight);
  if(!(lines>0)||!(lh>0)||s.display==='none')continue;
  counts.clamped++;
  const contentHeight=el.clientHeight-px(s.paddingTop)-px(s.paddingBottom),limit=lines*lh;
  const item={case:el.closest('.qa-case').id,name:el.closest('.qa-case').dataset.name,selector:el.tagName.toLowerCase()+(el.className?'.'+String(el.className).trim().split(/\s+/).join('.'):''),lines,lineHeight:lh,contentHeight,scrollHeight:el.scrollHeight,flex:s.flex,text:el.textContent.slice(0,100)};
  if(contentHeight>limit+1&&el.scrollHeight>limit+1)issues.push({...item,type:'grows-past-clamp'});
  if(el.scrollHeight>el.clientHeight+1&&contentHeight>0&&contentHeight<limit-1&&Math.abs(contentHeight/lh-Math.round(contentHeight/lh))>.05)issues.push({...item,type:'partial-line'});
  const card=el.closest('.vm-magazine,.vm-card,.vc-answer-card');
  if(card){const r=el.getBoundingClientRect(),c=card.getBoundingClientRect(),cs=getComputedStyle(card);if(r.bottom>c.bottom-px(cs.paddingBottom)+1)issues.push({...item,type:'outside-card',overflow:r.bottom-(c.bottom-px(cs.paddingBottom))})}
 }
 for(const el of document.querySelectorAll('.qa-case:not([hidden]) :is(.vm-source,.vm-facts,.vc-imdb-source,.vm-playlist-copy>span)')){
  if(!el.getClientRects().length)continue;
  const s=getComputedStyle(el),lh=px(s.lineHeight),h=el.clientHeight-px(s.paddingTop)-px(s.paddingBottom);
  if(lh>0&&h>0&&el.scrollHeight>el.clientHeight+1&&Math.abs(h/lh-Math.round(h/lh))>.05)issues.push({case:el.closest('.qa-case').id,name:el.closest('.qa-case').dataset.name,selector:el.className,type:'partial-footer-line',height:h,lineHeight:lh});
  const card=el.closest('.vm-magazine,.vm-card,.vc-answer-card');
  if(card){const r=el.getBoundingClientRect(),c=card.getBoundingClientRect(),cs=getComputedStyle(card);if(r.bottom>c.bottom-px(cs.paddingBottom)+1)issues.push({case:el.closest('.qa-case').id,name:el.closest('.qa-case').dataset.name,selector:el.className,type:'footer-outside-card',overflow:r.bottom-(c.bottom-px(cs.paddingBottom))})}
 }
 counts.fixedText=0;
 for(const el of document.querySelectorAll('.qa-case:not([hidden]) .qa-specimen *')){
  if(el.namespaceURI!=='http://www.w3.org/1999/xhtml'||!el.getClientRects().length||![...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))continue;
  const s=getComputedStyle(el),lh=px(s.lineHeight);
  if(!(lh>0)||Number(s.getPropertyValue('-webkit-line-clamp'))>0)continue;
  const h=el.clientHeight-px(s.paddingTop)-px(s.paddingBottom);
  if(s.overflowY==='hidden'&&el.scrollHeight>el.clientHeight+1){counts.fixedText++;if(h>0&&Math.abs(h/lh-Math.round(h/lh))>.05)issues.push({case:el.closest('.qa-case').id,name:el.closest('.qa-case').dataset.name,selector:el.tagName+'.'+el.className,type:'unclamped-partial-line',height:h,lineHeight:lh});}
  const card=el.closest('.vm-magazine,.vm-card,.vc-answer-card,[data-aigc-component],[data-image-card]');
  if(card&&card!==el&&!el.closest('.vc-overview-content.is-expanded')){const r=el.getBoundingClientRect(),c=card.getBoundingClientRect();if(r.top<c.top-1||r.bottom>c.bottom+1)issues.push({case:el.closest('.qa-case').id,name:el.closest('.qa-case').dataset.name,selector:el.tagName+'.'+el.className,type:'raw-text-outside-card',top:r.top-c.top,bottom:r.bottom-c.bottom,text:el.textContent.slice(0,40)})}
 }
 return {counts,issues};
}
