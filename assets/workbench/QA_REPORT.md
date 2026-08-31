# Workbench asset QA report

Result: **PASS for handoff** on 2026-08-31 UTC.

Source id: `workbench-paper-garden-v1`. The exports were rendered from the canonical
Cowork Workbench and terminal-tile implementation with every `/api/` and event request
intercepted before navigation. Only the disposable fixture entered the page. The capture
contains no real Agent transcript or interactive provider session.

## Approved assets

| Asset | Dimensions | Bytes | SHA-256 |
|---|---:|---:|---|
| `workbench-desktop.webp` | 1440 × 900 | 32,238 | `28591d2a3e25915e68a4d296b54105fea9b62d1b192a8469d46175b7b5c2cb77` |
| `workbench-narrow.webp` | 390 × 844 | 20,956 | `131cde2366dd44b450421b27f2fe0e457ea7592ec4f7c533d09f1e4e8098bffb` |

Both decode in capture Chromium 151.0.7922.34, remain below their 500 KB/300 KB site
budgets and 350 KB/220 KB README budgets, and are still images with no motion/audio
alternative required.

## Approved accessible text

Alt text:

> Ronin Workbench with Claude and Codex side by side in separate workspaces, each showing
> a task in its own disposable paper-garden worktree.

Adjacent link:

> See how two independent Agent providers work side by side in the Workbench.

Destination: `/explainers/workbench` (production publication remains the site owner's
action).

## Review evidence

- Desktop visibly shows Claude and Codex terminal identities, separate numbered Workbench
  placements, and `paper-garden-claude` / `paper-garden-codex` worktree labels.
- Narrow is a deliberate stacked treatment at 390 × 844. Both complete terminal heads,
  provider identities, worktree labels, tasks, and results are simultaneously legible.
- Manual original-resolution review found only approved fixture/session/project strings.
  The real shell tab chip found in the rejected first export was removed before recapture.
- A raw-byte scan found no `workbench_docs`, `/home/`, `glen3`, tailnet address, token,
  cookie, or authorization literals in either final WebP.
- The adapter does not request or capture real `/api/` data. It blocks animation, waits
  for fonts and two stable frames, fixes locale/timezone/theme/reduced motion, and records
  source/export SHA-256 values.
- No Services-only work record contents, recordings, Stats, Voice, gbrain, or house-agent
  behavior is claimed. The visible “View Work Record” control is inert base UI chrome and
  no work-record content is shown.
- The still proves only visible coexistence/layout and the displayed separate worktree
  labels. It is not cited as proof of account/reasoning boundaries, access isolation,
  Agent behavior, or workspace non-mutation.

Reproduction details and machine-readable checksums are in `capture-record.json`; the
full fail-closed review criteria are in `../../capture/workbench/PRIVACY_QA_MATRIX.md`.
