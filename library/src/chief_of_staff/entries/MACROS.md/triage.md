## triage
- **class:** session_macro.workflow
- **label:** +triage:
- **blurb:** Sort what landed in the inbox folder into reply now, delegate, later and ignore, with a draft under every reply — nothing sent.
The inbox lane's procedure; the book is `sops:chief_of_staff`. Read only `inbox/` and
`out/`. Every reply is a draft in the document; you send nothing and you never open a mail
client. An item for another lane goes under *delegate*, by name, for the lead.

Params: `since` (optional — a date; bare `+triage:` is everything not yet in a triage document).

| # | Action | With |
|---|---|---|
| 1 | read-work-record | the last `out/triage-*.md`, so nothing is sorted twice |
| 2 | list-doc | write `out/triage-<date>.md`: reply now (draft under each) · delegate · later · ignore |
| 3 | propose-and-confirm | anything that must go out today — show the draft in the tile and wait for the yes |
| 4 | report-outcome | counts per pile, and how many drafts wait on the owner |
