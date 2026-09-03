#!/usr/bin/env node
/**
 * pack-library — library/src/<name>/ → library/bundles/<name>.json + library/index.json
 *
 *   node scripts/pack-library.mjs           # print what would change; exit 1 if stale
 *   node scripts/pack-library.mjs --write   # regenerate the committed output
 *
 * A bundle is `ronin-bundle/1` and the index `ronin-library/1` — the formats the installed
 * app reads (its docs/templates.md). This is a dev tool: its OUTPUT is what the site serves,
 * committed as static files, and scripts/check-site.mjs fails when the output no longer
 * matches the sources. No dependencies, no build step at deploy.
 */
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const BUNDLE_FORMAT = 'ronin-bundle/1';
export const LIBRARY_FORMAT = 'ronin-library/1';
const STORES = ['catalogs', 'sops', 'ways', 'library', 'tools'];
const CATALOGS = ['MACROS.md', 'ACTIONS.md', 'TOOLS.md'];
const CATALOG_DIRS = ['templates/agents', 'templates/teams', 'routines', 'session_roles', 'role_families', 'desk_profiles', 'lexicons'];
const KINDS = ['coding', 'work', 'personal', 'household', 'social', 'school'];
const TOKEN = /^[a-z0-9][a-z0-9_-]{0,63}$/;

const sha256 = (text) => createHash('sha256').update(text).digest('hex');

function walk(dir, rel = '') {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const name of readdirSync(dir).sort()) {
    const full = path.join(dir, name);
    const r = rel ? `${rel}/${name}` : name;
    if (statSync(full).isDirectory()) out.push(...walk(full, r));
    else out.push(r);
  }
  return out;
}

function holdsOf(bundle) {
  const holds = {};
  const bump = (k) => { holds[k] = (holds[k] ?? 0) + 1; };
  for (const f of bundle.files) {
    if (f.store === 'catalogs') bump(f.path.startsWith('templates/teams/') ? 'teams' : f.path.startsWith('templates/agents/') ? 'agents' : f.path.split('/')[0]);
    else bump(f.store);
  }
  for (const e of bundle.entries) bump(e.catalog === 'MACROS.md' ? 'macros' : e.catalog === 'ACTIONS.md' ? 'actions' : 'tools');
  return holds;
}

/** One bundle document from its source directory, held to the format's rules. */
export function buildBundle(srcDir) {
  const face = JSON.parse(readFileSync(path.join(srcDir, 'BUNDLE.json'), 'utf8'));
  const name = String(face.name ?? '');
  if (!TOKEN.test(name)) throw new Error(`${srcDir}: BUNDLE.json name "${name}" is not a token`);
  if (path.basename(srcDir) !== name) throw new Error(`${srcDir}: directory and BUNDLE.json name differ`);
  const files = [];
  for (const rel of walk(path.join(srcDir, 'files'))) {
    const [store, ...rest] = rel.split('/');
    const p = rest.join('/');
    if (!STORES.includes(store)) throw new Error(`${name}: files/${rel} — store is one of ${STORES.join(', ')}`);
    if (store === 'tools' ? !(rest.length === 1 && TOKEN.test(p)) : !p.endsWith('.md')) throw new Error(`${name}: files/${rel} — a tool is one bare command; a book is a .md file`);
    if (store === 'catalogs' && !CATALOG_DIRS.includes(rest.slice(0, -1).join('/'))) throw new Error(`${name}: files/${rel} — a catalog file sits on one of ${CATALOG_DIRS.join(', ')}`);
    const entry = { store, path: p, text: readFileSync(path.join(srcDir, 'files', rel), 'utf8') };
    if (store === 'tools') entry.executable = true;
    files.push(entry);
  }
  const entries = [];
  for (const rel of walk(path.join(srcDir, 'entries'))) {
    const [catalog, file] = rel.split('/');
    if (!CATALOGS.includes(catalog) || !file?.endsWith('.md')) throw new Error(`${name}: entries/${rel} — <CATALOG>/<name>.md under one of ${CATALOGS.join(', ')}`);
    const entryName = file.slice(0, -3);
    const text = readFileSync(path.join(srcDir, 'entries', rel), 'utf8').trimEnd();
    const first = text.split('\n')[0] ?? '';
    const ok = catalog === 'TOOLS.md'
      ? new RegExp(`^\\|\\s*\`${entryName}\`\\s*\\|\\s*[a-z-]+\\s*\\|.+\\|\\s*$`).test(text)
      : new RegExp(`^##\\s+\`?${entryName}\`?(?:\\s.*)?$`).test(first);
    if (!ok) throw new Error(`${name}: entries/${rel} — opens with \`## ${entryName}\` (or, for TOOLS.md, is one \`| \`${entryName}\` | action | usage |\` row)`);
    entries.push({ catalog, name: entryName, text });
  }
  if (!files.length && !entries.length) throw new Error(`${name} holds nothing`);
  return {
    format: BUNDLE_FORMAT,
    name,
    label: String(face.label ?? name),
    art: String(face.art ?? ''),
    blurb: String(face.blurb ?? ''),
    kinds: (Array.isArray(face.kinds) ? face.kinds : []).filter((k) => KINDS.includes(k)),
    version: String(face.version ?? ''),
    files,
    entries,
  };
}

/** Every bundle under library/src, and the index that lists them — as the texts the site serves. */
export function buildLibrary(root) {
  const srcRoot = path.join(root, 'library', 'src');
  const bundles = new Map();
  const cards = [];
  for (const name of readdirSync(srcRoot).sort()) {
    const dir = path.join(srcRoot, name);
    if (!statSync(dir).isDirectory()) continue;
    const bundle = buildBundle(dir);
    const text = `${JSON.stringify(bundle, null, 2)}\n`;
    bundles.set(name, text);
    cards.push({
      name: bundle.name, label: bundle.label, art: bundle.art, blurb: bundle.blurb, kinds: bundle.kinds, version: bundle.version,
      url: `bundles/${bundle.name}.json`, sha256: sha256(text), bytes: Buffer.byteLength(text, 'utf8'), holds: holdsOf(bundle),
    });
  }
  const index = `${JSON.stringify({ format: LIBRARY_FORMAT, bundles: cards }, null, 2)}\n`;
  return { index, bundles };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
  const write = process.argv.includes('--write');
  const { index, bundles } = buildLibrary(root);
  const outputs = [['library/index.json', index], ...[...bundles].map(([name, text]) => [`library/bundles/${name}.json`, text])];
  let stale = 0;
  for (const [rel, text] of outputs) {
    const full = path.join(root, rel);
    const current = existsSync(full) ? readFileSync(full, 'utf8') : null;
    if (current === text) { console.log(`  ok    ${rel}`); continue; }
    stale++;
    if (write) { mkdirSync(path.dirname(full), { recursive: true }); writeFileSync(full, text); console.log(`  wrote ${rel}`); }
    else console.log(`  STALE ${rel}`);
  }
  if (stale && !write) { console.error(`pack-library: ${stale} stale — run with --write`); process.exit(1); }
}
