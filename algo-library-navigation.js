// Shared documentation navigation, including the library landing page.
(()=>{
 function previewTitle(componentName,variantLabel){
  const name=componentName.trim(),variant=variantLabel.trim();
  if(!variant||variant.toLowerCase()===name.toLowerCase())return name;
  if(/^standard$/i.test(variant))return 'Standard '+name;
  if(/^with\s/i.test(variant))return name+' '+variant[0].toLowerCase()+variant.slice(1);
  return name+' · '+variant;
 }
 const sideNav=document.querySelector('.side-nav');
 if(!sideNav)return;
 // The parent library navigation uses a compact rail with optional inline labels.
 // Cross-library destinations will be connected when the shared links are ready.
 if(typeof document.body?.prepend==='function'){
  const header=document.querySelector('.topbar');
  const updateHeader=()=>header.classList.toggle('is-scrolled',window.scrollY>24);
  window.addEventListener('scroll',updateHeader,{passive:true});updateHeader();
  document.querySelector('.page-nav')?.setAttribute('hidden','');

  const breadcrumb=document.querySelector('main>.hero>.breadcrumb');
  if(breadcrumb){
   const labels=breadcrumb.textContent.split('/').map(label=>label.trim()).filter(Boolean);
   if(labels[0]!=='Algo')labels.unshift('Algo');
   const trail=document.createElement('nav');trail.className='breadcrumb';trail.setAttribute('aria-label','Breadcrumb');
   const list=document.createElement('ol');
   labels.forEach((label,index)=>{
    const item=document.createElement('li');
    if(index)item.innerHTML='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m6 4 4 4-4 4"/></svg>';
    const text=document.createElement(index?'span':'a');text.textContent=label;
    if(!index)text.setAttribute('href','algo.html');
    item.append(text);list.append(item);
   });
   trail.append(list);breadcrumb.replaceWith(trail);
  }
 }
 sideNav.querySelector('a.active')?.setAttribute('aria-current','page');
 const mobileNav=document.getElementById('mobileNavItems');

 // The narrow-screen menu overlays the document instead of pushing it down.
 if(mobileNav?.closest){
  const drawer=document.createElement('dialog');
  drawer.className='nav-drawer';drawer.id='libraryNavigationDrawer';
  drawer.setAttribute('aria-labelledby','navigationDrawerHeading');
  drawer.innerHTML='<div class="nav-drawer-heading"><h2 id="navigationDrawerHeading">Browse library</h2><button class="nav-drawer-close" type="button" aria-label="Close navigation">×</button></div>'+(document.querySelector('.feature-nav')?.outerHTML||'')+'<nav class="nav nav--tree aixa-algo-drawer-nav" data-algo-nav aria-label="Library navigation">'+sideNav.innerHTML+'</nav>';
  document.body.append(drawer);
  const trigger=document.createElement('button');
  trigger.className='mobile-nav-trigger';trigger.type='button';
  trigger.setAttribute('aria-label','Open navigation');trigger.setAttribute('aria-haspopup','dialog');
  trigger.setAttribute('aria-controls',drawer.id);trigger.setAttribute('aria-expanded','false');
  trigger.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';
  document.querySelector('.topbar').prepend(trigger);
  trigger.addEventListener('click',()=>{
   drawer.showModal();document.body.classList.add('nav-drawer-open');trigger.setAttribute('aria-expanded','true');
  });
  drawer.querySelector('.nav-drawer-close').addEventListener('click',()=>drawer.close());
  drawer.addEventListener('click',event=>{
   if(event.target!==drawer)return;
   const rect=drawer.getBoundingClientRect();
   if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)drawer.close();
  });
  drawer.addEventListener('close',()=>{
   document.body.classList.remove('nav-drawer-open');trigger.setAttribute('aria-expanded','false');
   if(window.matchMedia('(width < 900px)').matches)trigger.focus();
  });
  window.matchMedia('(width >= 900px)').addEventListener('change',event=>{if(event.matches&&drawer.open)drawer.close();});

  const main=document.querySelector('main'),mount=document.getElementById('resultMount');
  if((document.body.dataset.component||document.body.dataset.cell)&&main&&mount){
   if(document.body.dataset.component)main.classList.add('doc-organism');
   const demo=main.querySelector('.demo-shell');
   const introduction=demo?.querySelector('.overview-intro');
   const controls=demo?.querySelector('.controls');
   if(introduction&&controls){
    const layout=document.createElement('div');layout.className='overview-layout';
    const options=document.createElement('div');options.className='overview-options';options.setAttribute('role','group');options.setAttribute('aria-label','Preview options');
    const devicePicker=introduction.querySelector('.device-picker');
    demo.insertBefore(layout,introduction);
    if(devicePicker){
     const deviceRow=document.createElement('div');deviceRow.className='device-control';
     const deviceLabel=document.createElement('span');deviceLabel.id='previewDeviceLabel';deviceLabel.textContent='Device';
     devicePicker.setAttribute('aria-labelledby',deviceLabel.id);
     deviceRow.append(deviceLabel,devicePicker);options.append(deviceRow);
    }
    options.append(controls);layout.append(introduction,options);
    const title=document.getElementById('overviewHeading'),variantHeading=document.getElementById('variantHeading'),componentName=main.querySelector('.hero h1').textContent.trim();
    const updatePreviewTitle=()=>{
     const variantControl=controls.querySelector('#cellVariant');
     const variantLabel=variantHeading?.textContent||variantControl?.selectedOptions[0]?.textContent||'';
     title.textContent=previewTitle(componentName,variantLabel);
    };
    if(variantHeading){
     variantHeading.hidden=true;
     new MutationObserver(updatePreviewTitle).observe(variantHeading,{childList:true,subtree:true,characterData:true});
    }
    controls.addEventListener('change',()=>queueMicrotask(updatePreviewTitle));
    updatePreviewTitle();
    const updateOptionRows=()=>options.classList.toggle('has-preview-options',!controls.hidden&&getComputedStyle(controls).display!=='none'&&[...controls.querySelectorAll(':scope>label:not(.switch-row):not([hidden])')].some(label=>getComputedStyle(label).display!=='none'));
    updateOptionRows();
    new MutationObserver(updateOptionRows).observe(controls,{attributes:true,childList:true,subtree:true,attributeFilter:['hidden','style','class']});
    window.addEventListener('resize',updateOptionRows,{passive:true});
   }
   const stage=mount.closest('.stage');
   if(stage&&document.body.dataset.component){
    mount.tabIndex=0;mount.setAttribute('role','region');
    let queued=false;
    const measure=()=>{
     queued=false;
     const label=document.body.dataset.device==='mobile'?'Mobile preview':'Desktop preview';
     mount.setAttribute('aria-label',label);
     stage.classList.toggle('is-overflowing',mount.scrollWidth>mount.clientWidth+1);
    };
    const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(measure);}};
    new ResizeObserver(schedule).observe(mount);
    window.addEventListener('resize',schedule);
    new MutationObserver(schedule).observe(mount,{childList:true,subtree:true,attributes:true,characterData:true});
    new MutationObserver(schedule).observe(document.body,{attributes:true,attributeFilter:['data-device']});
    document.fonts?.ready.then(schedule);schedule();
   }
  }
 }
 for(const button of document.querySelectorAll('[data-close-dialog]'))button.addEventListener('click',()=>button.closest('dialog').close());
})();

(function () {
  'use strict';
  document.querySelectorAll('[data-algo-nav]').forEach(function (nav, index) {
    // The drawer is a second view of the same menu: keep its IDs independent.
    if (index) {
      nav.querySelectorAll('[id]').forEach(function (element) { element.id += '-drawer'; });
      nav.querySelectorAll('[aria-controls]').forEach(function (element) { element.setAttribute('aria-controls', element.getAttribute('aria-controls') + '-drawer'); });
    }
    nav.addEventListener('click', function (event) {
      var button = event.target.closest('button[data-algo-disclosure]');
      if (!button || !nav.contains(button)) return;
      var id = button.getAttribute('aria-controls');
      var target = nav.querySelector('[id="' + id + '"]');
      if (!target) return;
      var expanded = button.getAttribute('aria-expanded') !== 'true';
      target.hidden = !expanded;
      nav.querySelectorAll('[aria-controls="' + id + '"]').forEach(function (control) {
        control.setAttribute('aria-expanded', String(expanded));
        var label = control.getAttribute('data-label');
        if (label) control.setAttribute('aria-label', (expanded ? 'Collapse ' : 'Expand ') + label);
      });

    });
  });
  requestAnimationFrame(function () {
    var nav = document.querySelector('.side-nav.nav');
    var current = nav && nav.querySelector('[aria-current="page"]');
    if (!current || !current.getClientRects().length) return;
    var outer = nav.getBoundingClientRect(), inner = current.getBoundingClientRect();
    if (inner.bottom > outer.bottom - 12) nav.scrollTop += inner.bottom - outer.bottom + 12;
  });
}());
