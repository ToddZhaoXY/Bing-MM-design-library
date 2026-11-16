(() => {
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  const storageKey = 'algo-library-theme';
  const fontKey = 'algo-library-font';
  try { localStorage.setItem(fontKey, 'source'); } catch {}
  root.dataset.font = 'source';
  // Restore preferences before first layout and warm only the selected fonts.
  const documentationFonts = ['Regular','Semibold','Bold'].map(weight=>'algo-public-assets-fonts-source-sans-pro-SourceSansPro-'+weight+'.ttf');
  const componentPage = !location.pathname.endsWith('algo.html') && !location.pathname.endsWith('/');
  const mobile = new URLSearchParams(location.search).get('device') === 'mobile';
  const componentFonts = componentPage ? (mobile ? ['Roboto-Variable'] : ['Roboto-Regular','Roboto-Bold']).map(name=>'algo-public-assets-fonts-roboto-'+name+'.ttf') : [];
  for (const href of [...documentationFonts,...componentFonts]) {
    const hint = document.createElement('link');
    hint.rel='preload';hint.as='font';hint.type='font/ttf';hint.crossOrigin='anonymous';hint.href=href;
    document.head.append(hint);
  }
  // Reveal once selected local faces are ready; a failed load cannot trap the page.
  root.dataset.fontLoading='';
  const guard=document.createElement('style');
  guard.textContent='html[data-font-loading] body{visibility:hidden}';
  document.head.append(guard);
  const reveal=()=>{delete root.dataset.fontLoading;guard.remove();};
  const fontTimeout=setTimeout(reveal,1600);
  let preference = null;
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'light' || saved === 'dark') preference = saved;
  } catch {}

  function applyTheme(theme) {
    root.dataset.theme = theme;
    const button = document.querySelector('.theme-icon');
    if (!button) return;
    const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    button.setAttribute('aria-label', label);
    button.setAttribute('aria-pressed', String(theme === 'dark'));
    button.title = label;
  }

  applyTheme(preference || (system.matches ? 'dark' : 'light'));
  system.addEventListener('change', event => {
    if (!preference) applyTheme(event.matches ? 'dark' : 'light');
  });
  document.addEventListener('DOMContentLoaded', () => {
    const faces=['400 14px "Source Sans Pro"','600 14px "Source Sans Pro"','700 14px "Source Sans Pro"'];
    if(componentPage)faces.push(...(mobile?['420 14px "Algo Roboto Variable"','660 14px "Algo Roboto Variable"']:['400 14px "Algo Roboto"','700 14px "Algo Roboto"']));
    Promise.allSettled(faces.map(face=>document.fonts.load(face))).then(()=>requestAnimationFrame(()=>{
      clearTimeout(fontTimeout);reveal();
    }));
    applyTheme(root.dataset.theme);
    document.querySelector('.theme-icon').addEventListener('click', () => {
      preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(preference);
      try { localStorage.setItem(storageKey, preference); } catch {}
    });
  });
})();
