## prospects
- **class:** session_macro.workflow
- **label:** +prospects:
- **blurb:** Score the pipeline against the ideal-customer profile, draft one first-touch message per contact worth touching, and keep the pipeline sheet honest.
The pipeline-research lane's procedure; the book is `sops:chief_of_staff`. Read
`pipeline/` — `icp.md` is the profile, `pipeline.md` the sheet. A score is a number with
the two reasons behind it. A draft is a document; it goes to the lead, and the lead to the
owner. You never send and you never contact anyone.

Params: `account` (optional — one account by name; bare `+prospects:` is every account not scored this week).

| # | Action | With |
|---|---|---|
| 1 | read-work-record | `pipeline/icp.md` and `pipeline/pipeline.md` as they stand |
| 2 | list-doc | update `pipeline/pipeline.md` (stage, score, last contact) and write `out/touch-<contact>.md` per draft; list them |
| 3 | propose-and-confirm | each draft, to the lead — shown in full, nothing sent |
| 4 | report-outcome | accounts scored, drafts written, and which wait on a yes |
