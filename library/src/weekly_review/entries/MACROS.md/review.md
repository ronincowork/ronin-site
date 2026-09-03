## review
- **class:** session_macro.workflow
- **label:** +review:
- **blurb:** Look back over the week's records and documents, say what moved and what stalled, and shape next week into a short list you can strike or keep.
Owner-invoked. `+review:` runs the week just ended; `+review: 2026-08-24` runs the week
containing that date. The book is `sops:weekly_review`; follow its shape exactly — one
page, facts before plans, the owner strikes or keeps the last section.

Params: `date` (optional — any day in the week to review; bare `+review:` is this week).

| # | Action | With |
|---|---|---|
| 1 | week-range | `tejun-week [date]` — the Monday and Sunday go in the heading |
| 2 | read-work-record | every session on this team, `read_tegami --session <name>`; note who kept no record |
| 3 | list-doc | write the review as one document and list it, so ▧ Docs shows it |
| 4 | report-outcome | one line: the week, how many things moved, and where the page is |
