#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = path.join(ROOT, 'assets', 'workbench');
const COWORK_URL = process.env.RONIN_CAPTURE_URL || 'http://127.0.0.1:3006/';
const requireFromHost = createRequire('/home/glen3/.cache/ronin-host-tools/package.json');
const { chromium } = requireFromHost('playwright');

const sessions = [
  { name: 'claude-demo', windows: 1, attached: false, created: 1, tags: ['paper-garden'], leads: [], session_role: 'OddJob', provider: 'Claude', project_root: 'paper-garden' },
  { name: 'codex-demo', windows: 1, attached: false, created: 2, tags: ['paper-garden'], leads: [], session_role: 'OddJob', provider: 'Codex', project_root: 'paper-garden' },
];
const transcripts = {
  'claude-demo': ['CLAUDE  ·  claude-demo', 'Worktree: paper-garden-claude', 'Task: Group the four sample flowers', 'Done: BRIEF.md and flowers.csv reviewed'],
  'codex-demo': ['CODEX  ·  codex-demo', 'Worktree: paper-garden-codex', 'Task: Format the field guide', 'Done: FIELD_GUIDE.md formatted'],
};

const jsonFor = (pathname) => {
  if (pathname === '/api/sessions') return sessions;
  if (pathname === '/api/version') return { version: 'seeded-demo', services: [], stream: false, stream_off: true };
  if (pathname === '/api/team-rosters') return [{ name: 'paper-garden', title: 'Paper Garden', team_role: 'development', objective: 'Build an imaginary field guide', state: 'active' }];
  if (pathname === '/api/campaigns') return [];
  if (pathname === '/api/settei') return { needed: [], set: {}, complete: true };
  if (pathname.includes('/project-root')) return { project_root: 'paper-garden' };
  if (pathname.includes('/control')) return { control: 'private' };
  if (pathname.includes('/note')) return { note: '' };
  if (pathname.includes('/teams')) return { teams: [] };
  if (pathname.includes('/team_lead')) return { teams: [] };
  if (pathname.includes('/session_role')) return { session_role: 'OddJob' };
  return [];
};

async function installIsolation(page) {
  await page.route('**/api/**', async (route) => {
    const url = new URL(route.request().url());
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(jsonFor(url.pathname)) });
  });
  await page.route('**/events', (route) => route.fulfill({ status: 204, body: '' }));
}

async function compose(page) {
  await page.goto(`${COWORK_URL.replace(/\/$/, '')}/#/team/paper-garden`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !document.documentElement.classList.contains('boot-pending'));
  await page.waitForSelector('.wk-workbench-layout:visible');
  const shape = page.locator('#shapecycle:visible');
  if (await shape.count() && await shape.textContent() !== '2') await shape.click();

  for (const [index, entry] of [{ name: 'claude-demo', label: 'Claude Demo' }, { name: 'codex-demo', label: 'Codex Demo' }].entries()) {
    const workspace = `workspace${index + 1}`;
    await page.locator(`.wk-workbench-cell[data-workspace="${workspace}"]:visible`).click();
    const card = page.locator(`.wk-card:visible`, { hasText: entry.label }).first();
    await card.waitFor({ timeout: 8_000 }).catch(async (error) => {
      throw new Error(`${entry.name}: ${error.message}\nVISIBLE PAGE:\n${(await page.locator('body').innerText()).slice(0, 4000)}`);
    });
    await card.click();
  }

  await page.waitForTimeout(250);
  await page.addStyleTag({ content: `
    *, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }
    .capture-terminal { box-sizing: border-box; height: 100%; padding: 28px 30px; color: #f1eee7; background: #101314;
      font: 600 18px/1.65 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; letter-spacing: .01em; }
    .capture-terminal p { margin: 0 0 14px; }
    .capture-terminal p:first-child { color: #d3a84d; font-size: 16px; letter-spacing: .08em; }
    @media (max-width: 680px) {
      .wk-workbench-layout[data-responsive='workbench'] { overflow: hidden !important; scroll-snap-type: none !important; gap: 6px !important; }
      .wk-workbench-layout[data-responsive='workbench'] > .wk-layout-surface { flex: 0 0 auto !important; min-height: 0 !important; }
      .wk-workbench-layout[data-responsive='workbench'] > .wk-layout-surface:nth-child(1),
      .wk-workbench-layout[data-responsive='workbench'] > .wk-layout-surface:nth-child(3) { height: 258px !important; }
      .wk-workbench-layout[data-responsive='workbench'] > .wk-layout-surface:nth-child(2) { height: 210px !important; }
      .wk-workbench-selector-cards { display: grid !important; grid-template-columns: 1fr 1fr !important; padding: 8px !important; gap: 6px !important; overflow: hidden !important; }
      .wk-workbench-selector-cards > :first-child, .wk-workbench-selector-cards > :last-child { display: none !important; }
      .capture-terminal { padding: 12px 16px; font-size: 12px; line-height: 1.35; }
      .capture-terminal p { margin: 0 0 7px; }
      .capture-terminal p:first-child { font-size: 12px; }
    }
  ` });
  await page.evaluate((lines) => {
    for (const node of document.querySelectorAll('body *')) {
      if (![...node.childNodes].some((child) => child.nodeType === Node.TEXT_NODE && child.textContent.includes('workbench_docs'))) continue;
      const shellTab = node.closest('[class*="tab"]') || node.parentElement;
      if (shellTab) shellTab.remove();
    }
    for (const [name, copy] of Object.entries(lines)) {
      const display = name === 'claude-demo' ? 'Claude Demo' : 'Codex Demo';
      const card = [...document.querySelectorAll('.wk-workbench-cell')].find((cell) => cell.textContent.includes(display));
      if (!card) throw new Error(`seeded workspace missing ${name}`);
      const mount = card.querySelector('.terminal-host,.term-host,.xterm') || card.querySelector('.tile-body') || card;
      mount.replaceChildren();
      const box = document.createElement('div');
      box.className = 'capture-terminal';
      for (const line of copy) { const p = document.createElement('p'); p.textContent = line; box.append(p); }
      mount.append(box);
    }
    document.querySelectorAll('[data-session],.tile').forEach((node) => {
      const text = node.textContent || '';
      if (text.includes('claude-demo')) node.setAttribute('data-capture-provider', 'Claude');
      if (text.includes('codex-demo')) node.setAttribute('data-capture-provider', 'Codex');
    });
  }, transcripts);
  await page.evaluate(() => { const layout = document.querySelector('.wk-workbench-layout'); if (layout) layout.scrollTop = 0; });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

async function capture(browser, spec) {
  const context = await browser.newContext({
    viewport: spec.viewport, deviceScaleFactor: 1, colorScheme: 'dark', reducedMotion: 'reduce', locale: 'en-US', timezoneId: 'UTC',
  });
  const page = await context.newPage();
  await installIsolation(page);
  await compose(page);
  const body = page.locator('body');
  await body.screenshot({ path: spec.path, type: 'webp', quality: 82, animations: 'disabled' });
  const visible = await page.locator('body').innerText();
  for (const required of ['claude-demo', 'codex-demo', 'paper-garden']) if (!visible.includes(required)) throw new Error(`${spec.id}: missing ${required}`);
  await context.close();
}

fs.mkdirSync(OUT, { recursive: true });
const exports_ = [
  { id: 'desktop', viewport: { width: 1440, height: 900 }, path: path.join(OUT, 'workbench-desktop.webp'), budget: 500_000 },
  { id: 'narrow', viewport: { width: 390, height: 844 }, path: path.join(OUT, 'workbench-narrow.webp'), budget: 300_000 },
];
const browser = await chromium.launch({ headless: true });
try { for (const spec of exports_) await capture(browser, spec); } finally { await browser.close(); }

const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const packageJson = requireFromHost('playwright/package.json');
for (const item of exports_) {
  item.bytes = fs.statSync(item.path).size;
  item.sha256 = hash(item.path);
  item.file = path.relative(ROOT, item.path);
  delete item.path;
  if (item.bytes > item.budget) throw new Error(`${item.id}: ${item.bytes} exceeds ${item.budget}`);
}
const record = {
  source_id: 'workbench-paper-garden-v1', fixture_schema: 1,
  capture_source: 'capture/workbench/capture.mjs', source_sha256: hash(fileURLToPath(import.meta.url)),
  playwright: packageJson.version, chromium: browser.version(), locale: 'en-US', timezone: 'UTC', color_scheme: 'dark', reduced_motion: 'reduce', device_scale_factor: 1,
  exports: exports_.map(({ budget, ...entry }) => entry),
};
fs.writeFileSync(path.join(OUT, 'capture-record.json'), `${JSON.stringify(record, null, 2)}\n`);
console.log(JSON.stringify(record, null, 2));
