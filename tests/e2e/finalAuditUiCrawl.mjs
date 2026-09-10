/**
 * UI route crawl for final audit (Playwright).
 * Evidence only — not part of CI smoke suite.
 */
import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:5173';

const ROUTES = [
  '/',
  '/about',
  '/solutions',
  '/solutions/web-services',
  '/solutions/custom-digital-solutions',
  '/customized',
  '/customized/gifts',
  '/customized/conference-kits',
  '/talks',
  '/portfolio',
  '/contact',
  '/start-project',
  '/privacy',
  '/terms',
  '/admin/login',
  '/admin/forgot-password',
  '/admin/dashboard',
  '/this-route-should-404',
];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const results = [];

  for (const route of ROUTES) {
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e.message)));
    const res = await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle', timeout: 60000 }).catch((e) => ({ ok: () => false, status: () => 0, _err: e.message }));
    const title = await page.title().catch(() => '');
    const h1 = await page.locator('h1').first().textContent().catch(() => null);
    const url = page.url();
    const status = typeof res?.status === 'function' ? res.status() : 0;
    let verdict = 'PASS';
    if (!res || res._err) verdict = 'FAIL';
    if (route === '/admin/dashboard' && !url.includes('/admin/login')) verdict = 'FAIL';
    if (route === '/admin/dashboard' && url.includes('/admin/login')) verdict = 'PASS';
    if (route === '/this-route-should-404' && !(h1 || '').toLowerCase().includes('not found')) verdict = 'PARTIAL';
    if (errors.length) verdict = verdict === 'PASS' ? 'PARTIAL' : verdict;
    results.push({ route, url, status, title, h1, pageErrors: errors, verdict });
    page.removeAllListeners('pageerror');
  }

  // Footer + nav link crawl from home
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  const hrefs = await page.$$eval('a[href]', (as) => [...new Set(as.map((a) => a.getAttribute('href')).filter(Boolean))]);
  const internal = hrefs.filter((h) => h.startsWith('/') && !h.startsWith('//'));
  const linkResults = [];
  for (const href of internal) {
    const r = await page.goto(`${BASE}${href}`, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch((e) => ({ _err: e.message }));
    const h1 = await page.locator('h1').first().textContent().catch(() => null);
    linkResults.push({
      href,
      url: page.url(),
      verdict: r?._err ? 'FAIL' : 'PASS',
      h1,
    });
  }

  // Silent fallback probe: portfolio with API down still shows content?
  await page.goto(`${BASE}/portfolio`, { waitUntil: 'networkidle' });
  const portfolioText = await page.locator('body').innerText();
  const hasProjects = /project|portfolio|selected/i.test(portfolioText);

  const out = {
    base: BASE,
    routes: results,
    navFooterLinks: linkResults,
    portfolioRendersWithoutApiGuarantee: hasProjects ? 'PARTIAL — content may be API or static fallback; cannot distinguish without network interception' : 'FAIL',
    skipLinkPresent: await page.goto(`${BASE}/`).then(async () => page.locator('a.skip-link').count()).then((n) => (n > 0 ? 'PASS' : 'FAIL')),
  };

  const outPath = path.resolve(__dirname, '../../docs/_audit-ui-evidence.json');
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log(JSON.stringify({ written: outPath, routePass: results.filter((r) => r.verdict === 'PASS').length, routeFail: results.filter((r) => r.verdict === 'FAIL').length, links: linkResults.length }, null, 2));
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
