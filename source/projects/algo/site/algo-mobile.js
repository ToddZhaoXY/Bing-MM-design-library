/* Mobile component content from the supplied Algo Block screenshots. */
const mobileAnatomy = [
 ['Favicon', 'A small site icon beside the source information helps users quickly recognize the destination website.'],
 ['Attribution', 'The site name and breadcrumb URL appear on two lines, helping users identify the source and understand where the result leads.'],
 ['Title', 'The title uses larger blue text to stand out as the main link to the destination page.'],
 ['Snippet', 'Smaller neutral text beneath the title shows the date and a short content preview, helping users judge whether the result is relevant.']
];

const mobileMovies = [
 ['Floating Weeds', '1959 · Family reunion', 'floating-weeds'],
 ['2001: A Space Odyssey', '1968 · Cosmic journey', '2001-space-odyssey'],
 ['Gates of Heaven', '1978 · Pet cemetery', 'gates-of-heaven'],
 ['Notorious', '1946 · Spy romance', 'notorious'],
 ['28 Up', '1984', '28-up'],
 ['Raging Bull', '1980', 'raging-bull']
];

function mobileMovieMarkup() {
 return `<section class="mobile-movies" aria-label="Movie recommendations"><h3>Best movies of all time</h3><span class="mobile-movie-info" aria-label="About these recommendations">ⓘ</span><p>Acclaimed films spanning decades and genres</p><div class="mobile-movie-scroll" tabindex="0" aria-label="Movie posters, swipe for more"><div class="mobile-movie-grid">${mobileMovies.map(([title, detail, asset]) => `<article><div class="mobile-poster"><img src="public/assets/mobile-algo/${asset}.png" alt="${title} poster" width="376" height="564"></div><b>${title}</b><small>${detail}</small></article>`).join('')}</div></div><div class="mobile-movie-footer"><button type="button" class="mobile-movie-more" aria-label="See more movie recommendations">See more <span aria-hidden="true">⌄</span></button></div></section>`;
}

function mobileSearchChrome(isList) {
 return `<div class="search-chrome"><span class="ms" aria-label="Microsoft"><i></i><i></i><i></i><i></i></span><span class="mobile-serp-menu" role="img" aria-label="Search menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 5h18M3 12h18M3 19h18"/></svg></span><div class="searchbox">${searchSvg}<span id="searchQuery">${isList ? 'The Top 20 Movies' : 'Harvard university application requirements'}</span><span class="search-tools" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="8" y="2" width="4" height="10" rx="2"/><path d="M5 8v2a5 5 0 0 0 10 0V8M10 15v3"/></svg><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 7V3h4m6 0h4v4m0 6v4h-4m-6 0H3v-4"/><circle cx="10" cy="10" r="3"/></svg></span></div></div><div class="search-tabs" tabindex="0" aria-label="Search categories"><span>ALL</span><span class="mobile-ai-tab">${copilotImage} AI MODE</span><span>IMAGES</span><span>VIDEOS</span><span>MAPS</span><span>NEWS</span><span>SHOPPING</span></div>`;
}

function mobileListOverviewMarkup() {
 return `<section class="list-overview answer-context"><small class="copilot-heading">AI Overview</small><h3>Here are the top 20 movies of all time according to IMDb and MovieWeb rankings, celebrated for their storytelling, performances, and cultural impact.</h3><h4>Top 20 Movies</h4><ol><li><b>Braveheart (1995)</b> – A historical epic about William Wallace leading Scotland’s rebellion against English rule, known for its emotional depth and iconic battle scenes ${citationMarkup('IMDb')}.</li><li class="overview-extra" hidden><b>The Godfather (1972)</b> – Francis Ford Coppola’s masterpiece chronicling the Corleone crime family, a benchmark in cinematic storytelling. ${citationMarkup('MovieWeb')}</li></ol><button class="show-more" aria-expanded="false">Show more ⌄</button><div class="overview-sources"><a href="#example-result"><small>${siteImage('IMDb')}<span>IMDb</span></small><b>20 Greatest Movies of ALL TIME</b></a><button type="button" class="mobile-show-sources"><span>${siteImage('IMDb')}${siteImage('MovieWeb')}</span><b>Show all</b></button></div></section>`;
}

function mobileSupportMarkup(isList) {
 const results = isList ? [
  ['IMDb', 'https://www.imdb.com › list', 'The Best 20 Movies Of All Time - IMDb', "I'm a great movie fan and here is my top 20. not only by there status, but also by there originality and good acting."],
  ['IMDb', 'https://www.imdb.com › chart › top', 'IMDb Top 250 movies', 'The top rated movie list only includes feature films. Learn more.']
 ] : [
  ['Harvard College', 'https://college.harvard.edu › admissions › apply › first...', 'First-Year Applicants | Harvard', 'Oct 26, 2018 · You may apply to Harvard under either our Restrictive Early Action (REA) or our Regular Decision (RD) …'],
  ['Faurit', 'https://faurit.com › article › what-you-need-for-harvard-admission-requirements', 'What You Need For Harvard: Admission Requirements (2026)', '9 hours ago · In this guide we’ll cover what you need to get into Harvard and build a strong application. School location: Cambridge, …']
 ];
 return results.map(([name, url, title, snippet]) => `<article class="algo algo-mobile support-result"><div class="attribution"><span class="favicon">${siteImage(name)}</span><span class="source"><span>${name}</span><small>${url}</small></span></div><a class="result-title" href="#example-result">${title}</a><p class="snippet">${snippet}</p></article>`).join('');
}

function renderMobilePage(page) {
 const isList = state.type === 'list';
 page.dataset.variant = state.type;
 page.innerHTML = `${mobileSearchChrome(isList)}<div id="contextMount">${isList ? mobileMovieMarkup() + mobileListOverviewMarkup() : ''}</div><div class="mobile-result-stack"><div id="exampleMount">${resultMarkup(state.type, 'default', false)}</div><div id="supportResults">${mobileSupportMarkup(isList)}</div></div>`;
 const seeMore = page.querySelector('.mobile-movie-more');
 if (seeMore) seeMore.onclick = () => {
  const row=page.querySelector('.mobile-movie-scroll');
  row.scrollBy({left:row.clientWidth*.9,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
 };
 const sources = page.querySelector('.mobile-show-sources');
 if (sources) sources.onclick = () => {
  $('allSources').innerHTML = [['IMDb', '20 Greatest Movies of ALL TIME'], ['MovieWeb', 'The Top 20 Movies of All Time']].map(([name, title]) => `<a href="${sourceUrls[name]}" target="_blank" rel="noopener noreferrer"><span>${title}</span><small>${name}</small></a>`).join('');
  $('sourcesDialog').showModal();
 };
}
