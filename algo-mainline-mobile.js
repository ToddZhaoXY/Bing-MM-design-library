// Mainline Mobile examples reuse their Desktop content and keep the same mount IDs.
const mainlineDesktopChrome=document.querySelector('.search-chrome').outerHTML;
const mainlineDesktopTabs=document.querySelector('.search-tabs').outerHTML;
function mainlineExampleDevice(){
 const page=document.querySelector('.search-page'),mobile=state.device==='mobile';
 // algo-app.js renders once before the page-specific module has initialized.
 if(!page.querySelector('.search-layout'))page.innerHTML=desktopPageTemplate;
 if(page.classList.contains('mainline-mobile-serp')!==mobile){
  const shell=document.createElement('div');
  shell.innerHTML=mobile?mobileSearchChrome(false):mainlineDesktopChrome+mainlineDesktopTabs;
  page.querySelector('.search-chrome').replaceWith(shell.querySelector('.search-chrome'));
  page.querySelector('.search-tabs').replaceWith(shell.querySelector('.search-tabs'));
 }
 page.classList.toggle('mobile-serp',mobile);
 page.classList.toggle('mainline-mobile-serp',mobile);
 return mobile;
}
