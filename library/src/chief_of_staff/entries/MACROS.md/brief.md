## brief
- **class:** session_macro.workflow
- **label:** +brief:
- **blurb:** The chief of staff's morning page: what each lane finished, what is waiting on you, what is stuck, and what today holds — read from the team's own records.
Owner-invoked, and the lead's alone. The book is `sops:chief_of_staff` § The brief: one
page, four parts, in that order, no narration. Read the lanes through their records, not
their tiles; a lane that kept no record is named as such.

Params: none. `+brief:` is today.

| # | Action | With |
|---|---|---|
| 1 | team-brief | `tejun-brief` — every lane's objective and current rung |
| 2 | read-work-record | each lane's latest document under `out/` — what actually finished |
| 3 | list-doc | write `out/brief-<date>.md` in the book's four parts and list it |
| 4 | report-outcome | one line: how many yeses are waiting on the owner, and where the page is |
