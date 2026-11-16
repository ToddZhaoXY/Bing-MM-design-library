// Document the same options used by each page's existing component controls.
// Defaults are captured once, so changing a preview never changes its defaults.
(()=>{
 const section=document.getElementById('properties');
 if(!section)return;
 const body=section.querySelector('tbody');
 const defaults=new Map([...document.querySelectorAll('.controls select')].map(control=>[control.id,control.value]));
 const component=document.body.dataset.component||'algo';
 const propNames={stateControl:'state',imageCountControl:'imageCount',richAccessory:'thumbnail',
  listLinkControl:'listLinks',summaryControl:'summary',imageControl:'images',navLayoutControl:'layout'};
 propNames.typeControl=component==='rich'?'content':['expansion','sectional-rich','sectional-nav'].includes(component)?'layout':'type';
 function cell(value,code=false){
  const td=document.createElement('td');
  if(code){const label=document.createElement('code');label.textContent=value;label.title=value;td.append(label);}
  else td.textContent=value;
  return td;
 }
 function renderProperties(){
  const rows=[];
  for(const control of document.querySelectorAll('.controls select')){
   if(!propNames[control.id]||control.closest('[hidden]'))continue;
   const options=[...control.options].filter(option=>!option.hidden&&!option.disabled);
   if(!options.length)continue;
   const initial=options.find(option=>option.value===defaults.get(control.id))||options[0];
   rows.push([propNames[control.id],'select',options.map(option=>option.textContent.trim()).join(' · '),initial.textContent.trim()]);
  }
  const preview=document.getElementById('resultMount');
  for(const [prop,selector] of [
   ['sectionTitle','.sectional-title, .se-title, .sn-heading'],
   ['title','.result-title'],['snippet','.snippet'],
   ['attribution','.source > span'],['url','.source small']
  ]){
   const content=preview?.querySelector(selector)?.textContent.trim();
   if(content)rows.push([prop,'text','free text',content]);
  }
  const fragment=document.createDocumentFragment();
  for(const [prop,type,values,defaultValue] of rows){
   const row=document.createElement('tr');
   const name=document.createElement('th');name.scope='row';
   const label=document.createElement('code');label.textContent=prop;name.append(label);
   const defaultCell=cell(defaultValue,true);defaultCell.className='properties-default';
   row.append(name,cell(type),cell(values),defaultCell);fragment.append(row);
  }
  body.replaceChildren(fragment);
 }
 const previousRender=render;
 render=function(...args){const result=previousRender(...args);renderProperties();return result;};
 renderProperties();
})();
