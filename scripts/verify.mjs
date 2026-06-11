import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const OUT = (process.env.TEMP || '/tmp') + '/pf-next';
mkdirSync(OUT, { recursive: true });
const URL = process.env.URL || 'http://localhost:3000/';

const browser = await chromium.launch();
const errors = [];
const results = [];

// 1) Responsive screenshots
for (const vp of [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(`[${vp.name}] ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`[${vp.name}] ${m.text()}`); });
  await page.goto(URL, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(1500);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  results.push(`${vp.name}: overflow=${overflow}`);
  await page.screenshot({ path: `${OUT}/${vp.name}-top.png` });
  await page.screenshot({ path: `${OUT}/${vp.name}-full.png`, fullPage: true });
  await ctx.close();
}

// 2) Terminal command tests
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
page.on('pageerror', (e) => errors.push(`[term] ${e.message}`));
await page.goto(URL, { waitUntil: 'load', timeout: 60000 });
await page.locator('#terminal').scrollIntoViewIfNeeded();
// Boot sequence types out on scroll-into-view; clicking fast-forwards it.
await page.waitForTimeout(600);
await page.locator('#terminal .bg-ink, #terminal [class*="bg-ink"]').first().click();
const input = page.getByLabel(/Terminal input/);
await input.waitFor({ state: 'attached', timeout: 8000 });
await input.click();

const expect = async (cmd, needle) => {
  await input.fill(cmd);
  await input.press('Enter');
  await page.waitForTimeout(150);
  const text = await page.locator('#terminal').innerText();
  const ok = needle ? text.includes(needle) : true;
  results.push(`term ${cmd.padEnd(14)} ${ok ? 'PASS' : 'FAIL (missing: ' + needle + ')'}`);
  return ok;
};

await expect('help', 'available commands');
await expect('whoami', 'Shrijal Goswami — AI/ML Engineer');
await expect('skills', 'XGBoost');
await expect('projects', 'Explainable RAG QA');
await expect('experience', 'Pinnacle Labs');
await expect('education', 'VIT Bhopal');
await expect('contact', 'GITHUB_URL');
await expect('ls', 'resume.json');
await expect('cat resume', '"name": "Shrijal Goswami"');
await expect('nonsense', "command not found: nonsense");

// history: ArrowUp should restore last command
await input.press('ArrowUp');
const histVal = await input.inputValue();
results.push(`term history-up    ${histVal === 'nonsense' ? 'PASS' : 'FAIL (' + histVal + ')'}`);
await input.fill('');

// tab completion: 'who' + Tab -> 'whoami'
await input.fill('who');
await input.press('Tab');
const tabVal = await input.inputValue();
results.push(`term tab-complete ${tabVal === 'whoami' ? 'PASS' : 'FAIL (' + tabVal + ')'}`);

// clear
await input.fill('clear');
await input.press('Enter');
await page.waitForTimeout(150);
const after = await page.locator('#terminal').innerText();
results.push(`term clear        ${!after.includes('available commands') ? 'PASS' : 'FAIL'}`);

await page.locator('#terminal').screenshot({ path: `${OUT}/terminal.png` });
await ctx.close();
await browser.close();

console.log(results.join('\n'));
console.log('\nERRORS: ' + (errors.length ? '\n' + errors.join('\n') : 'NONE'));
console.log('shots: ' + OUT);
