# Ronin Cowork site

The public website for [ronincowork.com](https://ronincowork.com).

The current page is a temporary launch presence and is expected to be replaced. Keep the hosting
shape simple; do not build a framework or content system around this version.

The site is deliberately static: `index.html` plus local assets, with no application server,
database, client framework, tracking script, or runtime dependency. Azure Static Web Apps serves
the `master` branch. Work lands on `dev`; reviewed releases merge from `dev` to `master`.

## Local preview

```bash
python3 -m http.server 8080
```

Then open `http://127.0.0.1:8080/`.

## Deployment

See [`docs/azure.md`](docs/azure.md).
