import { createRequire } from 'node:module';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || '/Users/toddzhao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out = fileURLToPath(new URL('.', import.meta.url));
const repo = fileURLToPath(new URL('../../../', import.meta.url));
const base = process.env.LIBRARY_URL || 'http://127.0.0.1:5198/Bing-MM-design-library/';
const manifest = JSON.parse(await readFile(join(repo, 'BUILD-MANIFEST.json'), 'utf8'));
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const homeOnly = process.argv.includes('--home-only');
const report = { pages: [], interactions: [], errors: [], failedResources: [] };
await mkdir(out, { recursive: true });
try {
 const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'light', reducedMotion: 'reduce' });
 const page = await context.newPage();
 page.on('pageerror', error => report.errors.push({ url: page.url(), message: error.message }));
 page.on('response', response => { if (response.status() >= 400 && response.url().startsWith(base)) report.failedResources.push({ url: response.url(), status: response.status() }); });
 await page.route('**/*', route => route.request().url().startsWith(base) || route.request().url().startsWith('data:') ? route.continue() : route.abort());
 if (homeOnly) {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const width of [1440, 1024, 390, 320]) {
   await page.setViewportSize({ width, height: 900 });
   await page.goto(base + 'index.html', { waitUntil: 'networkidle' });
   await page.evaluate(() => document.fonts.ready);
   assert.equal(await page.locator('.header-links a').count(), 4);
   assert.equal(await page.locator('.feature-nav,.library-header').count(), 0);
   const metrics = await page.evaluate(() => {
    const canvas = document.querySelector('.home-canvas').getBoundingClientRect();
    const heading = document.querySelector('.hero h1').getBoundingClientRect();
    const links = [...document.querySelectorAll('.header-links a')].map(el => { const r = el.getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom }; });
    return { width: innerWidth, height: innerHeight, scroll: document.documentElement.scrollWidth, canvas: { left: canvas.left, width: canvas.width }, heading: { left: heading.left, right: heading.right, top: heading.top, bottom: heading.bottom }, links };
   });
   assert.equal(metrics.canvas.left, 0); assert.equal(metrics.canvas.width, width);
   assert.ok(metrics.scroll <= width + 1);
   assert.ok(metrics.heading.left >= 0 && metrics.heading.right <= width && metrics.heading.bottom <= metrics.height);
   assert.ok(metrics.links.every(r => r.left >= 0 && r.right <= width && r.bottom < metrics.heading.top));
   assert.equal(await page.locator('.waterfall').getAttribute('data-motion'), 'running');
   await page.getByRole('button', { name: 'Pause animation' }).click();
   assert.equal(await page.locator('.waterfall').getAttribute('data-motion'), 'paused');
   await page.getByRole('button', { name: 'Resume animation' }).click();
   assert.equal(await page.locator('.waterfall').getAttribute('data-motion'), 'running');
   report.pages.push({ entry: 'index.html', viewport: `${width}x900`, ...metrics });
   await page.screenshot({ path: join(out, `home-restored-${width}.png`) });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const name of ['MM Image','AIGC','Video','Algo']) {
   await page.goto(base + 'index.html', { waitUntil: 'networkidle' });
   await page.locator('.header-links').getByRole('link', { name, exact: true }).click();
   await page.waitForLoadState('networkidle');
   assert.equal(await page.locator('body > .feature-nav a').count(), 4);
   report.interactions.push(`Homepage ${name} link opens its library with vertical navigation`);
  }
 } else {
 const entries = ['index.html', 'mm-image.html#/c/image-cards', 'aigc.html#/c/creation-composer', 'video.html#/c/short-card', ...manifest.entries.algo.pages];
 for (const entry of entries) {
  await page.goto(base + entry, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const rail = page.locator(entry === 'index.html' ? '.header-links' : 'body > .feature-nav');
  await rail.waitFor();
  assert.equal(await rail.locator('a').count(), 4, entry);
  const metrics = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth, title: document.title, broken: [...document.images].filter(img => img.getAttribute('src') && !img.complete || img.complete && img.naturalWidth === 0 && img.getAttribute('src')).map(img => img.src) }));
  assert.ok(metrics.scroll <= metrics.width + 1, `${entry}: overflow ${metrics.scroll}`);
  assert.deepEqual(metrics.broken, [], entry);
  if (entry.startsWith('mm-image') || entry.startsWith('aigc') || entry.startsWith('video')) {
    assert.deepEqual(await page.locator('#root').evaluate(el => ['--feature-nav-width','--library-gutter'].map(name => getComputedStyle(el).getPropertyValue(name))), ['', ''], 'Navigation variables must not leak into exported specimens');
  }
  report.pages.push({ entry, viewport: '1440x1000', ...metrics });
  if (['index.html','mm-image.html#/c/image-cards','algo-algo-block.html','algo.html'].includes(entry)) await page.screenshot({ path: join(out, entry.startsWith('mm-image') ? 'desktop-image.png' : entry.replace('.html','') + '-desktop.png') });
 }
 // Switch via actual anchors, retain collapse preference and verify selected state.
 await page.goto(base + 'algo-algo-block.html');
 await page.getByRole('button', { name: 'Collapse library navigation', exact: true }).click();
 for (const [name, id] of [['MM Image library','mm-image'],['AIGC library','aigc'],['Video library','video'],['Algo library','algo']]) {
  await page.locator('body > .feature-nav').getByRole('link', { name, exact: true }).click();
  await page.waitForLoadState('networkidle');
  assert.equal(await page.locator('body > .feature-nav [aria-current="page"]').getAttribute('aria-label'), name);
  assert.equal(await page.locator('body > .feature-nav button').getAttribute('aria-expanded'), 'false');
  report.interactions.push(`Switch to ${id}, restore collapsed rail`);
 }
 await page.locator('body > .feature-nav button').click();
 await page.goto(base + 'algo-algo-block.html');
 await page.locator('#typeControl').selectOption('fact');
 await page.getByRole('button', { name: 'Mobile', exact: true }).click();
 assert.equal(await page.locator('body').getAttribute('data-device'), 'mobile');
 assert.ok((await page.locator('#codeSample').textContent()).length > 100);
 await page.locator('#expandExample').click();
 assert.equal(await page.locator('#pageDialog').evaluate(el => el.open), true);
 await page.getByRole('button', { name: 'Close full-size example' }).click();
 report.interactions.push('Algo type, Mobile preview, code sample, full-size example');
 for (const width of [1024, 390, 320]) {
  await page.setViewportSize({ width, height: 900 });
  for (const entry of ['index.html','mm-image.html#/c/image-cards','aigc.html#/c/creation-composer','video.html#/c/short-card','algo-algo-block.html','algo-sectional-nav.html','algo-cells.html']) {
   await page.goto(base + entry, { waitUntil: 'networkidle' });
   const metrics = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth }));
   assert.ok(metrics.scroll <= metrics.width + 1, `${width} ${entry}: overflow ${metrics.scroll}`);
   report.pages.push({ entry, viewport: `${width}x900`, ...metrics });
   if (width === 390 && ['index.html','mm-image.html#/c/image-cards','algo-algo-block.html'].includes(entry)) await page.screenshot({ path: join(out, entry.startsWith('mm-image') ? 'mobile-image.png' : entry.replace('.html','') + '-mobile.png') });
  }
 }
 await page.goto(base + 'algo-algo-block.html', { waitUntil: 'networkidle' });
 await page.getByRole('button', { name: 'Open navigation', exact: true }).click();
 assert.equal(await page.locator('#libraryNavigationDrawer').evaluate(el => el.open), true);
 await page.locator('#libraryNavigationDrawer').getByRole('link', { name: 'Video library', exact: true }).click();
 await page.waitForLoadState('networkidle');
 assert.ok(page.url().includes('video.html'));
 report.interactions.push('Algo mobile drawer switches to Video');
 }
 assert.deepEqual(report.errors, []);
 assert.deepEqual(report.failedResources, []);
 report.passed = true;
} finally {
 await writeFile(join(out, homeOnly ? 'homepage-results.json' : 'browser-results.json'), JSON.stringify(report, null, 2) + '\n');
 await browser.close();
}
console.log(`Checked ${report.pages.length} page/viewports and ${report.interactions.length} interactions.`);
