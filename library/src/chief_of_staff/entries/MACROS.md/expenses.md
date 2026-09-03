## expenses
- **class:** session_macro.workflow
- **label:** +expenses:
- **blurb:** Turn the receipts folder into a categorised ledger, flag what is missing or odd, and at month end write the report the accountant would ask for.
The money-and-admin lane's procedure; the book is `sops:chief_of_staff`. Read `receipts/`
only. Categories are the ledger's existing ones; a receipt that fits none is flagged, not
guessed into one. You move no money and file nothing anywhere but `out/`.

Params: `month` (optional — `2026-08` closes that month with a report; bare `+expenses:` brings the ledger current).

| # | Action | With |
|---|---|---|
| 1 | read-work-record | `out/ledger.md` as it stands — the last entry is where you start |
| 2 | list-doc | update `out/ledger.md`; with a month named, write `out/report-<month>.md` and list it |
| 3 | propose-and-confirm | any correction to an existing ledger line — show it, wait for the yes |
| 4 | report-outcome | entries added, entries flagged, and whether a report was written |
