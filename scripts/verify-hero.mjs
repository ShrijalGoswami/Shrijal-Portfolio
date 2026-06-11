import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const OUT = (process.env.TEMP || '/tmp') + '/pf-hero';
mkdirSync(OUT, { recursive: true });
const URL = process.env.URL || 'http://localhost:3000/';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

await page.goto(URL, { waitUntil: 'load', timeout: 60000 });
await page.waitForTimeout(2000);

// Confirm a WebGL canvas mounted.
const hasCanvas = await page.locator('section#top canvas').count();
console.log('canvas present:', hasCanvas > 0);

// Move the cursor to trigger magnetism, then screenshot the opening state.
await page.mouse.move(720, 380);
await page.mouse.move(820, 300, { steps: 10 });
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}/00-open.png` });

// Map hero-section progress (0..1) to an absolute scroll position.
const range = await page.evaluate(() => {
  const s = document.querySelector('section#top');
  const top = s.getBoundingClientRect().top + window.scrollY;
  return { top, dist: s.offsetHeight - window.innerHeight };
});
const stops = [0.12, 0.36, 0.52, 0.68, 0.78, 0.95];
for (const f of stops) {
  await page.evaluate((y) => window.scrollTo(0, y), Math.round(range.top + range.dist * f));
  await page.waitForTimeout(1100); // let Lenis + scene settle
  await page.mouse.move(640 + f * 200, 360, { steps: 6 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/p${String(Math.round(f * 100)).padStart(2, '0')}.png` });
}

await ctx.close();
await browser.close();
console.log('ERRORS:', errors.length ? '\n' + errors.join('\n') : 'NONE');
console.log('shots:', OUT);
