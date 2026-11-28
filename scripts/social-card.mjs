#!/usr/bin/env node
// node scripts/social-card.mjs — draws social/card.html into social/ronin-hosted.png (1200x630),
// the picture every page's og:image names. Needs playwright-core (RONIN host tools carry it).
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(process.env.PLAYWRIGHT_FROM || `${process.env.HOME}/.cache/ronin-host-tools/node_modules/`);
const { chromium } = require('playwright-core');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto('file://' + path.join(root, 'social/card.html'));
await page.screenshot({ path: path.join(root, 'social/ronin-hosted.png') });
await browser.close();
console.log('wrote social/ronin-hosted.png');
