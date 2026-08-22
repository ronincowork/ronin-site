# EXPLAINER_LIBRARY build-out — library index, root footnote, agent-teams explainer + use cases

> Build-out plan for `wip/handoffs/EXPLAINER_LIBRARY.md`. Opened 2026-08-22; reshaped the
> same day after the owner redirected the middle of the cascade: **one general explainer
> on how agents work together (a role, then tasks within it), then quickly into linked
> use-case pages** — not per-axis catalog pages, and no explainer per session task.
>
> **Dies when:** the explainer library index is live behind a footnote link on the root
> page, tmux and Tailscale read as members of it, and the agent-teams explainer plus its
> first use-case pages teach the role/task model without contradicting KOTOBA or claiming
> unshipped behavior.

## Rulings and directions this plan is built on

1. **QuarterBack is a `session_task`, not a `job_role`** (owner, 2026-08-22).
   `job_role: developer` is the durable hat; running as quarterback is a mode of work the
   Developer moves into. Product-side edits (KOTOBA rows, R17 prose, catalog files)
   belong to `ronin-cowork` / `role_task_cut`, not this repo. The task's token spelling
   is unruled; site prose says "run as quarterback" and prints no token for it.
2. **One explainer, then use cases** (owner, 2026-08-22). No standalone Session Tasks
   explainer and no Job Roles catalog page. One page gives the generic understanding —
   a role, and tasks within that — and hands off fast to use-case pages that are real
   links: **Developer team**, **fitness team**, **home management team**. The use cases
   are where the model is shown live (the quarterback appears under the Developer team).
3. **Public vocabulary**: "Job Roles"/"Session Tasks" wording per KOTOBA R17 — never
   "Session Jobs", "Job Group", "job class". "Team" is a plain-English reading-face word
   (legal under KOTOBA's plain-English rule for owner-facing words), not a proposed
   token; flagged in open items for the owner to veto.
4. **Delivery rule** (owner): commit cohesive progress to local `dev` regularly, push
   `dev` promptly, keep the `dev` → `master` PR (#8) updated. Merging = deploying stays
   with the owner.

## Information architecture

```text
/                                     root page: footer footnote → Explainers; stale
                                      "Session jobs" wording retired (leg 3)
/explainers/                          library index — tmux, Tailscale, and the
                                      agent-teams explainer as one collection
/tmux_serve/                          existing, URL unchanged, listed as a member
/vpn_tailscale/                       existing, URL unchanged, listed as a member
/explainers/agent_teams/              THE explainer: how agents work together —
                                      a job role (who), session tasks within it
                                      (what now), project root (where); then
                                      prominent links to the use cases
/explainers/agent_teams/developer_team/        use case: the Developer team
/explainers/agent_teams/fitness_team/          use case: the fitness team (HeadCoach)
/explainers/agent_teams/home_management_team/  use case: the home management team
```

- The cascade is: root footnote → library → one concept page → use cases. Use cases are
  actual links from the explainer, placed early ("really quickly get into use cases"),
  not buried after the theory.
- Each use-case page stands alone for a narrow search or campaign, opens with the
  outcome, and links up to the agent-teams explainer. Tasks are presented **inside** the
  use-case pages; a task does not get its own page in this increment.
- Task reusability is still stated, not shown structurally: the explainer says plainly
  that a task may serve several roles, and use-case pages may cross-link where the same
  task genuinely appears twice. If per-task landing pages return later, they get their
  own sibling branch then; nothing in this shape blocks it.
- Existing explainer URLs do not move. Membership is by linking from `/explainers/`.

## Page pattern (unchanged, from the two existing explainers)

One static `index.html` per directory, reusing `ronin-tokens.css` (and `site-shell.js`
only where a page carries a copyable session brief): search-shaped `<title>… | Ronin
Cowork`; standard header; eyebrow + display + lede; optional callout; numbered sections;
`.terms` cards for vocabulary; FAQ where real questions exist; `.finish` → Load Ronin;
footer with one relevant link. The library index is the same shell with a linked member
list. No framework, no generator; adding explainer N+1 is copy-a-page plus one index
line. Depth-2 pages (`explainers/agent_teams/developer_team/`) use `../../../`-rooted
asset paths — verified in leg 4.

## Content plan

**`/explainers/` — "Explainers."** Short lede: pages that explain the technology and
concepts Ronin builds on. Members: tmux, Tailscale, How agent teams work.

**`/explainers/agent_teams/` — the one general explainer.** Working title: **"How agent
teams work"**. Teaches, compactly and once:

- a **job role** is who the agent is — chosen at launch, fixed for the session's life,
  carrying its own reading and defaults;
- **session tasks** are what it is doing right now — optional, mutable, switched as the
  work moves, each bringing its own reading;
- the **project root** is where it works — always required;
- task settings override role settings override system defaults; blank is valid;
- a task may serve several roles — the role organizes tasks, it does not own them.

Then, high on the page, the use-case links with one-line hooks: Developer team, fitness
team, home management team. The page stays generic; the live detail lives in the use
cases.

**`/explainers/agent_teams/developer_team/` — "The Developer team."** The role is
`developer` (shipped today). Tasks shown as the work moves: riff on it, draft plan, cut
code, chase bug, check work — and running as quarterback to coordinate other sessions,
per ruling 1. Grounded entirely in shipped definitions except the quarterback task,
which is described in prose until the product cut lands its token.

**`/explainers/agent_teams/fitness_team/` — "The fitness team."** The owner-defined
example: `job_role: HeadCoach` (label "Head Coach"), whose task moves between nutrition,
workouts, recovery, equipment, and race planning. Framed as a role you define; task
names render as labels only.

**`/explainers/agent_teams/home_management_team/` — "The home management team."**
Composition not yet specified by the owner. Placeholder proposal for review: a
`HouseManager` role whose tasks move between meal planning, grocery runs, maintenance
scheduling, and bills & budget — labels only, same owner-defined framing as fitness.
**Owner input wanted before this page is written** (open item 2).

**Truthfulness constraints on every page:** grounded in shipped catalogs where they
exist; owner-defined compositions framed as "a role you can define" with no claim that
an authoring UI exists; tokens printed only for shipped definitions and spelled exactly
(`developer`, `CutCode`); no quarterback token until KOTOBA rules it.

## Legs

1. **Library index + root footnote.** Create `/explainers/index.html`; add the footnote
   link to the root footer. **Done when:** the index lists all members, the root footer
   links to it unobtrusively, and both existing explainers are unchanged.
2. **The agent-teams explainer.** Write `/explainers/agent_teams/` per the content plan,
   use-case links prominent and early. **Done when:** the page teaches the whole model
   compactly, uses KOTOBA terms exactly, links all three use cases, and claims nothing
   unshipped.
3. **Use-case pages.** Developer team and fitness team; home management team once the
   owner settles its composition. Retire stale "Session jobs"/"session job"/"jobs"
   wording on the root page and tmux explainer in the same pass. **Done when:** each
   use-case page stands alone, links upward, and grep finds "session job" nowhere in the
   site.
4. **Verify.** Local preview: every page reachable by ordinary links; depth-2 asset and
   nav paths correct; phone and desktop widths; light and dark; `docs/azure.md` payload
   checks (extended with the new files) pass. **Done when:** the handoff's verification
   list is checked off.
5. **Release.** Keep PR #8 current; the owner merges. **Done when:** merged and
   production answers, or the PR stands ready at the owner's discretion.

## Sequencing and publication notes

- **`role_task_cut` timing.** Pages are written to be true of the model, not a release
  date; final wording check at PR review against what has actually shipped.
- **`wip/` becomes public if merged.** The Azure workflow uploads the whole repo (no
  `staticwebapp.config.json`), and PR staging environments serve it too. Recommendation
  stands: a minimal config excluding `/wip/*` before merge — owner to confirm (a
  deliberate change under the static-site boundary); alternative is untracking `wip/`.
- **Syncthing**: the dohyo checkout syncs continuously; verified 2026-08-22 at 100%
  completion to the connected device. Git remains the release mechanism.

## Open items for the owner

1. Quarterback task token spelling (`RunPoint` / `CoordinateWork` / ruled-exception
   `QuarterBack`) — a KOTOBA ruling; site prose says "run as quarterback" until then.
2. The home management team's composition: role name and task list (placeholder
   proposal above).
3. The `/wip/*` exclusion decision.
4. "Team" as the public framing word — plain-English reading face, no token proposed;
   veto if unwanted.
5. `docs/azure.md` payload checklist grows the new files — proposed yes, in leg 4.
