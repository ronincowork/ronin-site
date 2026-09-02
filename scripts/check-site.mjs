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
  'assets/workbench/workbench-desktop.webp',
  'assets/workbench/workbench-narrow.webp',
  'staticwebapp.config.json',
  'ronin-tokens.css',
  'site-shell.js',
  'community-popup.js',
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

for (const file of tracked.filter((name) => /\.(?:html|css|js|json|md|yml|yaml|sh)$/.test(name))) {
  const body = readFileSync(path.join(root, file), 'utf8');
  if (/^(?:<{7}|={7}|>{7})(?: |$)/m.test(body)) fail('conflict-markers', file);
}
if (!failures.some((x) => x.startsWith('conflict-markers:'))) ok('conflict-markers');

if (failures.length) {
  for (const finding of failures) process.stderr.write(`  FAIL  ${finding}\n`);
  process.exit(1);
}
