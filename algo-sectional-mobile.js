// Shared Mobile example chrome; the original Sectional desktop DOM stays intact.
const sectionalDesktopChrome=document.querySelector('.search-chrome').outerHTML;
const sectionalDesktopTabs=document.querySelector('.search-tabs').outerHTML;
function sectionalExampleDevice(){
 const page=document.querySelector('.search-page'),mobile=state.device==='mobile';
 if(page.classList.contains('sectional-mobile-serp')!==mobile){
  const shell=document.createElement('div');
  shell.innerHTML=mobile?mobileSearchChrome(false):sectionalDesktopChrome+sectionalDesktopTabs;
  page.querySelector('.search-chrome').replaceWith(shell.querySelector('.search-chrome'));
  page.querySelector('.search-tabs').replaceWith(shell.querySelector('.search-tabs'));
 }
 page.classList.toggle('mobile-serp',mobile);
 page.classList.toggle('sectional-mobile-serp',mobile);
 const footer=page.querySelector('.sectional-mobile-footer');
 if(mobile&&!footer)page.insertAdjacentHTML('beforeend','<div class="sectional-mobile-footer"><nav aria-label="Example search pages"><span aria-current="page">1</span><span>2</span><span>3</span><span aria-hidden="true">›</span></nav><div>Terms &nbsp;&nbsp; Privacy</div></div>');
 if(!mobile&&footer)footer.remove();
}

function sectionalMoreResultsButton(){return '<button type="button" class="sectional-results-more" aria-expanded="false">Show more <span aria-hidden="true">⌄</span></button>'}
document.addEventListener('click',event=>{
 const button=event.target.closest('.sectional-results-more');
 if(!button)return;
 const expanded=button.getAttribute('aria-expanded')!=='true';
 button.setAttribute('aria-expanded',String(expanded));
 button.closest('#supportResults').classList.toggle('support-results-expanded',expanded);
 button.innerHTML=expanded?'Show less <span aria-hidden="true">⌃</span>':'Show more <span aria-hidden="true">⌄</span>';
});
