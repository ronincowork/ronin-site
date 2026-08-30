# Workbench seeded demonstration specification

Status: proposed capture source; no capture is approved by this document.

## Question and evidence boundary

The demonstration answers one question: **what does it look like to place a Claude Agent
and a Codex Agent side by side in one Workbench?** It may show only base Cowork behavior:
the shared Workbench frame, its discovery column, two independently rendered workspaces,
and two plainly labeled terminal tiles. It must not show or imply Services-only work
records, recordings, Stats, Voice, gbrain, or house-agent behavior.

The still must make only these visible facts understandable without animation:

- Claude and Codex are different Agent providers in separate workspaces.
- The two terminal tiles sit in the same current Workbench frame, one in each numbered
  workspace.

The still is not evidence that workspace state is independent or non-mutating. Those facts
require current tested contract evidence or, if approved, a motion sequence that visibly
demonstrates the interaction. Account and reasoning boundaries belong in explainer text
with a named authority; neither still nor motion proves them. The capture is also not
evidence of access isolation, provider security, Agent behavior, or worktree security.
Public copy and alt text must not promote it into evidence of any of those claims.

## Disposable fixture

Create the fixture only in a temporary directory outside every real project root. Give it
the public-safe display name `paper-garden`; never render its filesystem path.

The fixture contains three small text files with synthetic content:

| File | Seed content | Visible Agent task |
|---|---|---|
| `BRIEF.md` | “Make a tiny field guide for four imaginary paper flowers.” | shared harmless context |
| `flowers.csv` | four invented flower names, colors, and one-line descriptions | Claude groups the entries into two sections |
| `FIELD_GUIDE.md` | heading and two empty sections | Codex formats the supplied entries into the guide |

No network request, repository remote, git identity, provider account screen, or real
prompt history is part of the fixture. The terminal transcript is pre-seeded display
content, not a recording of an interactive provider session. It contains exactly these
public-safe labels and outcomes:

- session `claude-demo`, provider label `Claude`, task `Group the four sample flowers`;
- session `codex-demo`, provider label `Codex`, task `Format the field guide`;
- root label `paper-garden`, with no absolute or home-relative path;
- synthetic success lines that refer only to the three fixture filenames above.

Do not launch Claude, Codex, a shell with inherited history, or any real Ronin session to
make the public media. A reviewer may approve a purpose-built local fixture adapter that
feeds these records through the current Workbench implementation. A hand-built imitation
of the Workbench is not acceptable.

## Canonical scene

Use the current Cowork Workbench route and current shared shell. Select the two-workspace
shape. Keep enough of the discovery column visible to identify the two seeded sessions.
Place `claude-demo` in Workspace 1 and `codex-demo` in Workspace 2. Both permanent surface
heads, both provider labels, both workspace numbers, and the Workbench context must remain
legible.

The scene is quiet: each tile shows one short task line and one short synthetic result.
There is no cursor blink, progress spinner, rapid terminal output, notification, account
menu, browser chrome, or optional Services indicator.

## Deterministic capture settings

| Setting | Desktop | Narrow |
|---|---:|---:|
| CSS viewport | 1440 × 900 | 390 × 844 |
| device scale factor | 1 | 1 |
| color scheme | dark | dark |
| reduced motion | reduce | reduce |
| locale / timezone | `en-US` / `UTC` | `en-US` / `UTC` |
| browser | repository-supported Playwright Chromium | same build |

Wait for `document.fonts.ready`, the removal of `boot-pending`, and two stable animation
frames after fixture placement. Disable caret and transition animation through capture-only
CSS. Do not crop away context after capture; use an explicitly composed narrow scene when
the desktop composition cannot remain legible.

## Proposed exports and budgets

| Export | Format | Maximum bytes | Required dimensions |
|---|---|---:|---:|
| README desktop still | WebP, with PNG fallback only if review finds text degradation | 350,000 | 1440 × 900 |
| Site desktop still/poster | WebP | 500,000 | 1440 × 900 |
| README narrow still | WebP | 220,000 | 390 × 844 |
| Site narrow still | WebP | 300,000 | 390 × 844 |
| Optional loop | WebM for site; GIF considered separately for GitHub | 1,500,000 site / 2,000,000 GitHub | at most 6 seconds |

Ship no motion unless it demonstrates placement or independent workspace state more
clearly than the still, and pair any non-mutation claim with current tested contract
evidence. Motion must have a poster, a transcript, no audio, and an equivalent non-motion
path.

## Accessible text

Proposed alt text:

> Ronin Workbench with Claude in Workspace 1 and Codex in Workspace 2, each showing a
> separate task in the disposable paper-garden demonstration.

Proposed adjacent-link sentence (destination remains gated by the site owner):

> See how two independent Agent providers work side by side in the Workbench.

Motion transcript, if approved:

> The discovery column lists Claude and Codex demonstration sessions. Claude is placed in
> Workspace 1, then Codex is placed in Workspace 2. Both terminal tiles remain visible in
> their own workspaces.

## Reproduction record and checksums

The capture runner must write a machine-readable record beside staged exports containing:
source commit, fixture-schema version, Playwright and Chromium versions, viewport, device
scale factor, color scheme, locale, timezone, reduced-motion value, capture timestamp, and
SHA-256 for every source and export. A reviewer compares those values to this recipe and
the privacy matrix before an asset is handed off.

README exports belong in the Cowork desk only after visual approval. Site exports and this
capture source remain in the site desk. Neither path authorizes editing a README, explainer,
index, manifest, or other publication file.

## Freshness triggers

Recapture or review is required when the Workbench layout or shared shell changes; the
workspace/surface contract changes; terminal tile heads or discovery cards change; Claude
or Codex labels change; the seeded fixture changes; fonts, theme tokens, capture engine, or
encoding settings change; an asset checksum drifts; or the public claim/alt text changes.
