// Mobile Sectional Nav uses the same content parts in the supplied vertical order.
function snMobileMarkup(data,{annotated,type,images,interaction},left,id,expanded){
 const magazine=type==='magazine';
 const more=magazine?snMoreMarkup(id,expanded,annotated):'';
 const rail=snRailMarkup(data,images,magazine,annotated);
 return `<section class="sectional-nav sectional-mobile sn-mobile" data-layout="${type}" data-state="${interaction}">${snPart(0,'snHeading',`<h3 class="sn-heading">${data.heading}</h3>`,annotated&&!magazine)}<div class="sn-grid">${left}${more}${rail}</div></section>`;
}
function snMobileControls(){
 const option=$('stateControl').querySelector('option[value="card-hover"]');
 if(option)option.hidden=option.disabled=state.device==='mobile';
}
function snMobileSupportResults(magazine){
 if(!magazine){
  const adobe=snAssets.adobeIcon;
  const items=[
   ['Adobe','https://www.adobe.com/products/photoshop/plans','Adobe Photoshop Pricing &amp; Membership Plans','Explore the Photoshop Single App, Photography, and Creative Cloud Pro plans. Compare standalone Photoshop access with photography tools or a subscription that includes creative apps.',adobe],
   ['Adobe','https://www.adobe.com/products/photoshop/free-trial-download.html','Photoshop Free Trial &amp; Free Download','Get Photoshop free with a 7-day trial. Explore generative AI tools, retouch photos, combine images, and create original artwork in Photoshop.',adobe],
   ['Gizmodo','https://gizmodo.com/download/adobe-photoshop','Download Adobe Photoshop for Windows','Oct 26, 2026 · Explore Adobe Photoshop’s photo editing and design tools, including layers, masks, and retouching. Find download information for desktop and mobile...',snAssets.gizmodo],
   ['Adobe Support Community','https://community.adobe.com','Photoshop 27.11: Enhance Edge, GPT Image 2, and more!','Oct 5, 2026 · Join the community discussion about Photoshop 27.11, including Enhance Edge for cleaner selections and GPT Image 2 for AI image generation.',adobe],
   ['TechSpot','https://www.techspot.com/downloads','Adobe Photoshop CC 2026 Download','Oct 20, 2026 · Find download information for Adobe Photoshop 27.11. Learn how to browse, preview, and place Adobe Stock assets directly in a Photoshop document.',null],
   ['Adobe Help Center','https://helpx.adobe.com/photoshop','Photoshop Desktop Help | Create Projects','Learn how to create projects, add files, and organize your work in Adobe Photoshop on desktop.',adobe]
  ];
  return items.map(([name,url,title,snippet,icon])=>`<article class="algo support-result">${icon?snSource(name,url,icon):`<div class="attribution"><span class="favicon">${globe}</span><span class="source"><span>${name}</span><small>${url}</small></span></div>`}${snLink(url,'result-title',title)}<p class="snippet">${snippet}</p></article>`).join('');
 }
 const extra=`<article class="algo support-result">${snSource('Microsoft Investor Relations','microsoft.com/en-us/investor/default',snAssets.apps)}${snLink('https://www.microsoft.com/en-us/Investor/default.aspx','result-title','Microsoft Investor Relations | Stock Information')}</article>`;
 return snSupportResults(true).replace(`<article class="algo support-result">${snSource('MarketBeat','https://www.marketbeat.com/stocks/NASDAQ/MSFT/',snAssets.beat)}</article>`, `<article class="algo support-result">${snSource('MarketBeat','marketbeat.com/stocks/NASDAQ/MSFT/news',snAssets.beat)}${snLink('https://www.marketbeat.com/stocks/NASDAQ/MSFT/news/','result-title','MSFT News Today | Why Did Microsoft Stock Move?')}<p class="snippet">Follow the latest Microsoft (NASDAQ: MSFT) stock news and market analysis. Explore the headlines, earnings updates, and business developments that may be driving...</p></article>`)+extra;
}
