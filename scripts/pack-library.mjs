#!/usr/bin/env node
/**
 * pack-library — library/src/<name>/ → dist/library/index.json + dist/library/bundles/<name>.json (HQ's)
 *                                       + library/index.html (the site's shop window)
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

const KIND_WORDS = { coding: 'Code', work: 'Work', personal: 'Yourself', household: 'The house', social: 'Friends and family', school: 'School' };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const holdsWords = (holds) => Object.entries(holds).map(([k, n]) => `${n} ${({ teams: 'team', agents: 'agent', routines: 'Routine', sops: 'SOP', ways: 'way', library: 'page', macros: 'macro', actions: 'action', tools: 'tool' })[k] ?? k}${n === 1 ? '' : (k === 'routines' ? 's' : 's')}`).join(' · ');

const HEAD = (title, description, depth) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="description" content="${esc(description)}" />
    <title>${esc(title)}</title>
    <link rel="icon" href="/nin-mark.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="${depth}ronin-tokens.css" />
    <link rel="stylesheet" href="${depth}library/library.css" />
  </head>
  <body>
    <header class="site-header">
      <div class="site-header__inner">
        <a class="brand" href="${depth}index.html"
          ><img src="${depth}nin-mark.svg" alt="Ronin" /><span class="brand-name"
            ><span>RONIN</span><span class="brand-cowork">COWORK</span></span
          ></a
        >
        <nav class="site-nav">
          <a href="${depth}library/">Templates</a><a href="${depth}explainers/">Explainers</a><a href="${depth}load-ronin.html">Load Ronin</a>
        </nav>
      </div>
    </header>
`;
const FOOT = (depth) => `
    <footer class="site-footer">
      <span>Ronin · a coworkspace that runs on your machine</span>
      <a href="${depth}index.html">ronincowork.com</a>
    </footer>
  </body>
</html>
`;
const HOW = `      <section class="how" aria-label="How a template gets into Ronin">
        <h2>How one gets into your Ronin</h2>
        <p>
          Not from here. With Ronin Services on, open the Campaign page in your Ronin
          coworkspace, place <strong>Templates</strong> in a workspace, press
          <strong>Check the library</strong>, and Ronin shows this same shelf. Pick one;
          Ronin shows everything it holds and what it would write into your stores, and
          writes nothing until you press <strong>Install</strong>. Without Services the
          shelf is there but opaque; the handful of templates that ship inside Ronin are
          yours either way, and so is making your own.
        </p>
      </section>`;

const KIND_ICONS = { coding: '⌨', work: '💼', personal: '🎩', household: '🏠', social: '🎪', school: '🎓' };
const HOLD_WORD = { teams: 'team', agents: 'agent', routines: 'Routine', sops: 'SOP', ways: 'way', library: 'page', macros: 'macro', actions: 'action', tools: 'tool' };

/**
 * The shelf is a library utility, not a web page (owner, 2026-09-03): a compact list you
 * scan and click, with the app's kinds as a row of chips above it. One row per bundle —
 * art, name, what it holds, its kinds — opening its view page. A dozen lines of inline
 * script hide rows not of the picked kind; with scripts off, every row shows.
 */
function indexPage(cards) {
  const chips = [['open', '○', 'All'], ...Object.entries(KIND_ICONS).map(([k, icon]) => [k, icon, KIND_WORDS[k]])]
    .map(([k, icon, word]) => `        <button type="button" class="chip" data-kind="${k}" aria-pressed="${k === 'open'}"><i>${icon}</i>${esc(word)}</button>`).join('\n');
  // The second axis (owner, 2026-09-03): all, teams only, agents only.
  const shapes = [['all', '○', 'All'], ['team', '⛩', 'Teams'], ['agent', '人', 'Agents']]
    .map(([k, icon, word]) => `        <button type="button" class="chip" data-shape="${k}" aria-pressed="${k === 'all'}"><i>${icon}</i>${word}</button>`).join('\n');
  const isTeam = (c) => !!c.holds.teams;
  const row = (c) => `        <div class="row" data-bundle="${c.name}" data-kinds="${esc(c.kinds.join(' '))}">
          <i>${esc(c.art || '▤')}</i>
          <b>${esc(c.label)}</b>
          <span class="blurb">${esc(c.blurb)}</span>
          <span class="holds">${Object.entries(c.holds).map(([hk, n]) => `${n} ${HOLD_WORD[hk] ?? hk}${n === 1 ? '' : 's'}`).join(' · ')}</span>
          <span class="kinds">${c.kinds.map((k) => `${KIND_ICONS[k] ?? ''} ${esc(KIND_WORDS[k] ?? k)}`).join(' · ')}</span>
        </div>`;
  const shelf = (heading, rows, shapeKey) => rows.length ? `      <section class="shelf" data-shape="${shapeKey}">
        <h2>${esc(heading)}</h2>
${rows.map(row).join('\n')}
      </section>` : '';
  const sections = [shelf('Teams — projects', cards.filter(isTeam), 'team'), shelf('Agents — people', cards.filter((c) => !isTeam(c)), 'agent')].filter(Boolean).join('\n\n');
  const script = `    <script>
      (function () {
        var kind = 'open', shape = 'all';
        var kinds = document.querySelectorAll('.chip[data-kind]'), shapes = document.querySelectorAll('.chip[data-shape]');
        var rows = document.querySelectorAll('.row'), shelves = document.querySelectorAll('.shelf');
        function paint() {
          kinds.forEach(function (x) { x.setAttribute('aria-pressed', String(x.getAttribute('data-kind') === kind)); });
          shapes.forEach(function (x) { x.setAttribute('aria-pressed', String(x.getAttribute('data-shape') === shape)); });
          rows.forEach(function (r) { r.hidden = kind !== 'open' && (r.getAttribute('data-kinds') || '').split(' ').indexOf(kind) === -1; });
          shelves.forEach(function (s) { s.hidden = (shape !== 'all' && s.getAttribute('data-shape') !== shape) || !s.querySelector('.row:not([hidden])'); });
        }
        kinds.forEach(function (c) { c.addEventListener('click', function () { kind = c.getAttribute('data-kind'); paint(); }); });
        shapes.forEach(function (c) { c.addEventListener('click', function () { shape = c.getAttribute('data-shape'); paint(); }); });
      })();
    </script>`;
  return `${HEAD('Ronin Template Library', 'Templates for Ronin Cowork — a team, its agents, and the SOPs, macros and tools they read. See them here; get them inside your Ronin.', '../')}
    <main class="page page--library">
      <section class="library-head">
        <p class="eyebrow">Ronin Cowork · Template library</p>
        <h1 class="display">Teams and agents, ready to run.</h1>
        <p class="lede">
          A template is a team of AI agents that delivers a project — a cast with a lead —
          or a single agent you assign, with the instructions, procedures, macros and tools
          they read. A handful ship inside Ronin; the rest live on this shelf.
        </p>
        <p class="lede lede--how">
          The library is a <strong>Ronin Services</strong> feature: Ronin keeps it and grows
          it. Browse by kind here; inside your own Ronin — <strong>Campaign → Templates →
          Check the library</strong> — you see everything a template holds, then install it
          into your own stores. Nothing here is a file to save.
        </p>
      </section>

      <section class="kinds" aria-label="Show">
${shapes}
      </section>
      <section class="kinds" aria-label="Kind">
${chips}
      </section>

${sections}

${HOW}
    </main>
${script}
${FOOT('../')}`;
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
  const pages = new Map([['library/index.html', indexPage(cards)]]);
  return { index, bundles, pages };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
  const write = process.argv.includes('--write');
  const { index, bundles, pages } = buildLibrary(root);
  // THE DOCUMENTS ARE HQ'S (owner, 2026-09-03): dist/library/ is what HQ serves to an entitled
  // box; the site answers 404 for it (staticwebapp.config.json). The page is the shop window.
  const outputs = [['dist/library/index.json', index], ...[...bundles].map(([name, text]) => [`dist/library/bundles/${name}.json`, text]), ...pages];
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
