# Ronin Cowork site

The public website for [ronincowork.com](https://ronincowork.com).

The site carries the public Ronin Cowork story, the installation handoff, and an explainer
library (`explainers/`): how agent teams work with family roles and session tasks plus the
use-case pages, customization, Tailscale private access, and tmux-backed persistent agent
terminals. Cowork setup and application screens belong to the installed local application,
not this public domain. Keep the
hosting shape simple; do not build a framework or content system around it.

The site is deliberately static HTML, CSS, JavaScript, and SVG, with no application server,
database, client framework, tracking script, or runtime dependency. Azure Static Web Apps serves
the `master` branch. Work lands on `dev`; reviewed releases merge from `dev` to `master`.

## Local preview

```bash
python3 -m http.server 8080
```

Then open `http://127.0.0.1:8080/`.

## Deployment

See [`docs/azure.md`](docs/azure.md).

## Documentation

- [`docs/site.md`](docs/site.md) — ownership, page sequence, design-system contract, and how
  work moves from the landing workshop into this deployable repository.
- [`docs/azure.md`](docs/azure.md) — the live Azure resource, DNS shape, release, verification,
  and rollback.
