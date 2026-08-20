# Azure deployment

This site is an independent Azure Static Web App. It does not share resources, deployment, or
runtime with SHIWAKE or another Azure application.

## Standing shape

- GitHub repository: `ronincowork/ronin-site`
- Production branch: `master`
- Development branch: `dev`
- App location: `/`
- Output location: `/`
- Build: none; the repository is already the deployable static payload
- Azure tier: Free

Resource names, the generated hostname, workflow name, and custom-domain records are recorded here
after Azure creates them. Never place deployment tokens or Azure credentials in this document.

## Verify the payload before release

```bash
test -f index.html
test -f assets/roster.png
test -f assets/grid.png
rg -n 'src="assets/' index.html
```

Preview locally and inspect both light and dark modes before merging `dev` to `master`.

## Release

Push work to `dev`, open a `dev` to `master` pull request, and merge after review. Azure's GitHub
workflow deploys `master`. Do not deploy by copying files into Azure manually.

## Verify production

```bash
curl -fsSI https://<generated-hostname>/
curl -fsSI https://ronincowork.com/
curl -fsSI https://www.ronincowork.com/
```

Confirm HTTPS, a successful response, and both local images in a browser. DNS changes must preserve
the existing Google MX records, `hq` SHIWAKE records, and `mg` Mailgun records.

## Rollback

Revert the release commit on `dev`, merge the normal `dev` to `master` PR, and let the workflow
redeploy. Do not rewrite `master` or deploy an unrecorded local directory.

## Azure CLI access

Shared authentication and safety instructions live at
`ronin-lab/landing/azure/README.md` on the dohyo workspace.
