#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const failures = [];
const fail = (gate, detail) => failures.push(`${gate}: ${detail}`);
const ok = (gate) => process.stdout.write(`  ok    ${gate}\n`);

const required = [
  'index.html',
  'load-ronin.html',
  'vpn_tailscale/index.html',
  'tmux_serve/index.html',
  'explainers/index.html',
  'explainers/workbench/index.html',
  'explainers/agent-coordination/index.html',
  'explainers/cowork-and-services/index.html',
  'explainers/ai-agents-virtual-machine/index.html',
  'explainers/public-content.json',
  'library/index.html',
  'library/index.json',
  'assets/workbench/workbench-desktop.webp',
  'assets/workbench/workbench-narrow.webp',
  'staticwebapp.config.json',
  'ronin-tokens.css',
  'site-shell.js',
  'nin-mark.svg',
];
for (const file of required) if (!existsSync(path.join(root, file))) fail('required-static-payload', `missing ${file}`);
if (!failures.some((x) => x.startsWith('required-static-payload:'))) ok('required-static-payload');

const tracked = execFileSync('git', ['ls-files'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const htmlFiles = tracked.filter((file) => file.endsWith('.html'));
const localTarget = (owner, raw) => {
  const value = raw.trim().split(/\s+/)[0].replace(/[?#].*$/, '');
  if (!value || value.startsWith('#') || /^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(value)) return null;
  const relative = value.startsWith('/') ? value.slice(1) : path.join(path.dirname(owner), value);
  const normalized = path.normalize(relative);
  if (normalized.startsWith('..')) return `OUTSIDE:${value}`;
  return value.endsWith('/') ? path.join(normalized, 'index.html') : normalized;
};
for (const file of htmlFiles) {
  const body = readFileSync(path.join(root, file), 'utf8');
  for (const match of body.matchAll(/\b(?:href|src|srcset)\s*=\s*["']([^"']+)["']/gi)) {
    const target = localTarget(file, match[1]);
    if (!target) continue;
    if (target.startsWith('OUTSIDE:')) fail('local-links-and-media', `${file} escapes the site: ${target.slice(8)}`);
    else if (!existsSync(path.join(root, target))) fail('local-links-and-media', `${file} -> ${match[1]} (${target} missing)`);
  }
}
if (!failures.some((x) => x.startsWith('local-links-and-media:'))) ok('local-links-and-media');

try {
  const manifest = JSON.parse(readFileSync(path.join(root, 'explainers/public-content.json'), 'utf8'));
  if (!Array.isArray(manifest.entries) || manifest.entries.length === 0) fail('public-content-manifest', 'entries must be a non-empty array');
  for (const entry of manifest.entries ?? []) {
    if (!entry.id || !entry.public_url || !entry.status || !Array.isArray(entry.evidence_authorities)) {
      fail('public-content-manifest', `entry ${entry.id || '<unnamed>'} is incomplete`);
    }
  }
  const workbench = manifest.entries?.find((entry) => entry.id === 'workbench');
  if (!workbench) fail('public-content-manifest', 'workbench entry missing');
  for (const [file, expected] of Object.entries(workbench?.asset_checksums ?? {})) {
    const full = path.join(root, file);
    if (!existsSync(full)) fail('public-content-manifest', `checksum target missing: ${file}`);
    else {
      const actual = createHash('sha256').update(readFileSync(full)).digest('hex');
      if (actual !== expected) fail('public-content-manifest', `${file} checksum ${actual} != ${expected}`);
    }
  }
} catch (error) {
  fail('public-content-manifest', error instanceof Error ? error.message : String(error));
}
if (!failures.some((x) => x.startsWith('public-content-manifest:'))) ok('public-content-manifest');

// THE TEMPLATE LIBRARY: the committed JSON is exactly what library/src/ packs to, every
// card's url exists with the sha256 the index promises, and the human page SHOWS each
// bundle the index lists without linking its file — the shelf is read here, the download
// happens inside Ronin (owner, 2026-09-03) — so page and index cannot drift apart.
try {
  const { buildLibrary } = await import('./pack-library.mjs');
  const built = buildLibrary(root);
  const outputs = [['library/index.json', built.index], ...[...built.bundles].map(([name, text]) => [`library/bundles/${name}.json`, text])];
  for (const [rel, text] of outputs) {
    const full = path.join(root, rel);
    if (!existsSync(full)) fail('template-library', `${rel} missing — node scripts/pack-library.mjs --write`);
    else if (readFileSync(full, 'utf8') !== text) fail('template-library', `${rel} is stale — node scripts/pack-library.mjs --write`);
  }
  const index = JSON.parse(readFileSync(path.join(root, 'library/index.json'), 'utf8'));
  if (index.format !== 'ronin-library/1' || !Array.isArray(index.bundles) || !index.bundles.length) fail('template-library', 'index.json is not a non-empty ronin-library/1');
  const page = readFileSync(path.join(root, 'library/index.html'), 'utf8');
  for (const card of index.bundles ?? []) {
    const full = path.join(root, 'library', card.url ?? '');
    if (!card.url || !existsSync(full)) { fail('template-library', `${card.name}: url ${card.url} missing`); continue; }
    const actual = createHash('sha256').update(readFileSync(full, 'utf8')).digest('hex');
    if (actual !== card.sha256) fail('template-library', `${card.name}: sha256 ${actual} != ${card.sha256}`);
    if (!page.includes(`data-bundle="${card.name}"`)) fail('template-library', `library/index.html does not show ${card.name}`);
    if (page.includes(`href="${card.url}"`)) fail('template-library', `library/index.html hands out ${card.url} — the download happens inside Ronin (owner, 2026-09-03)`);
    if (JSON.parse(readFileSync(full, 'utf8')).format !== 'ronin-bundle/1') fail('template-library', `${card.url} is not ronin-bundle/1`);
  }
} catch (error) {
  fail('template-library', error instanceof Error ? error.message : String(error));
}
if (!failures.some((x) => x.startsWith('template-library:'))) ok('template-library');

for (const file of tracked.filter((name) => /\.(?:html|css|js|json|md|yml|yaml|sh)$/.test(name))) {
  const body = readFileSync(path.join(root, file), 'utf8');
  if (/^(?:<{7}|={7}|>{7})(?: |$)/m.test(body)) fail('conflict-markers', file);
}
if (!failures.some((x) => x.startsWith('conflict-markers:'))) ok('conflict-markers');

if (failures.length) {
  for (const finding of failures) process.stderr.write(`  FAIL  ${finding}\n`);
  process.exit(1);
}
