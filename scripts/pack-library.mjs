#!/usr/bin/env node
/**
 * pack-library — library/src/<name>/ → library/bundles/<name>.json + library/index.json
 *                                       + library/index.html + library/view/<name>/index.html
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
          Not from here. Open the Campaign page in your Ronin coworkspace, place
          <strong>Templates</strong> in a workspace, press <strong>Check the library</strong>,
          and Ronin shows this same shelf. Pick one; Ronin shows what it would write into your
          stores and writes nothing until you press <strong>Install</strong>. There is no file
          to move from the internet to your computer to the app.
        </p>
      </section>`;

/** The shelf: one article per bundle, grouped by kind, each with a View link and nothing else. */
function indexPage(cards) {
  const groups = new Map();
  for (const c of cards) for (const k of (c.kinds.length ? c.kinds : ['work'])) { if (!groups.has(k)) groups.set(k, []); groups.get(k).push(c); }
  const sections = [...Object.keys(KIND_WORDS)].filter((k) => groups.has(k)).map((k) => `      <section class="members" aria-label="${esc(KIND_WORDS[k])}">
        <p class="eyebrow">${esc(KIND_WORDS[k])}</p>
${groups.get(k).map((c) => `        <article class="member" data-bundle="${c.name}">
          <span class="art" aria-hidden="true">${esc(c.art)}</span>
          <div>
            <h2>${esc(c.label)}</h2>
            <p>${esc(c.blurb)}</p>
            <ul class="holds">${Object.entries(c.holds).map(([hk, n]) => `<li>${n} ${esc(({ teams: 'team', agents: 'agent', routines: 'Routine', sops: 'SOP', ways: 'way of working', library: 'reference page', macros: 'macro', actions: 'action', tools: 'tool' })[hk] ?? hk)}${n === 1 ? '' : 's'}</li>`).join('')}</ul>
            <a class="go" href="view/${c.name}/">View →</a>
            <span class="version">${esc(c.version)}</span>
          </div>
        </article>`).join('\n')}
      </section>`).join('\n\n');
  return `${HEAD('Ronin Template Library', 'Templates for Ronin Cowork — a team, its agents, and the SOPs, macros and tools they read. See them here; get them inside your Ronin.', '../')}
    <main class="page">
      <section class="library-head">
        <p class="eyebrow">Template library</p>
        <h1 class="display">A team, and everything it reads.</h1>
        <p class="lede">
          A template is a cast that delivers a project, or a person you assign, with the
          SOPs, Routines, macros and tools they name. A handful ship inside Ronin; the rest
          are here. See what each one holds, then get it inside your Ronin —
          <strong>Templates → Check the library</strong> — where it lands on your own shelf.
        </p>
      </section>

${sections}

${HOW}
    </main>
${FOOT('../')}`;
}

/** One bundle, readable: its face, then every file and entry it carries, as written. */
function viewPage(bundle, card) {
  const part = (title, body) => `      <section class="part">
        <h2>${esc(title)}</h2>
        <pre>${esc(body)}</pre>
      </section>`;
  const parts = [
    ...bundle.files.map((f) => part(`${f.store}/${f.path}${f.executable ? '  (executable)' : ''}`, f.text)),
    ...bundle.entries.map((e) => part(`${e.catalog} · ${e.name}`, e.text)),
  ];
  // A view page sits at library/view/<name>/index.html: three levels below the root.
  return `${HEAD(`${bundle.label} — Ronin Template Library`, bundle.blurb, '../../../')}
    <main class="page">
      <section class="library-head">
        <p class="eyebrow"><a href="../../">Template library</a> · ${esc(KIND_WORDS[bundle.kinds[0]] ?? 'Templates')}</p>
        <h1 class="display">${esc(bundle.art)} ${esc(bundle.label)}</h1>
        <p class="lede">${esc(bundle.blurb)}</p>
        <p class="holds-line">${esc(holdsWords(card.holds))} · version ${esc(bundle.version)}</p>
        <p class="get">Get it inside your Ronin: <strong>Templates → Check the library → ${esc(bundle.label)}</strong>. Nothing here is a file to save.</p>
      </section>

${parts.join('\n\n')}
    </main>
${FOOT('../../../')}`;
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
  for (const [name, text] of bundles) pages.set(`library/view/${name}/index.html`, viewPage(JSON.parse(text), cards.find((c) => c.name === name)));
  return { index, bundles, pages };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
  const write = process.argv.includes('--write');
  const { index, bundles, pages } = buildLibrary(root);
  const outputs = [['library/index.json', index], ...[...bundles].map(([name, text]) => [`library/bundles/${name}.json`, text]), ...pages];
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
