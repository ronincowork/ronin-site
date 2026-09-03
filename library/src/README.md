# library/src — where a bundle is written

One directory per bundle, mirroring the stores it lands in:

```text
library/src/<name>/BUNDLE.json                 the face: name, label, art, blurb, kinds, version
library/src/<name>/files/<store>/<path>        whole files — catalogs/…, sops/, ways/, library/, tools/
library/src/<name>/entries/<CATALOG>/<name>.md one `## name` block (MACROS.md, ACTIONS.md) or one table row (TOOLS.md)
```

`node scripts/pack-library.mjs --write` turns these into `dist/library/bundles/<name>.json` and
`dist/library/index.json` (HQ's to serve; 404 on this site) and the shop-window page `library/index.html`; `scripts/check-site.mjs` fails when the committed output is stale. The
format is `ronin-bundle/1`, documented in the app at `docs/templates.md` — the app's
`bin/ronin-bundle pack` writes the same document from an install.
