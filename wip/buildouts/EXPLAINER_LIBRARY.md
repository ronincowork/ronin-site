# EXPLAINER_LIBRARY build-out — library index, root footnote, Job Roles / Session Tasks explainer

> Build-out plan for `wip/handoffs/EXPLAINER_LIBRARY.md`. Opened 2026-08-22 after the
> owner approved the understanding report and ruled the QuarterBack question.
>
> **Dies when:** the explainer library index is live behind a footnote link on the root
> page, tmux and Tailscale read as members of it, and the Job Roles / Session Tasks
> explainer teaches the three-axes model without contradicting KOTOBA or claiming
> unshipped behavior.

## Rulings this plan is built on

1. **QuarterBack is a `session_task`, not a `job_role`** (owner, 2026-08-22, this
   session). `job_role: developer` is the durable hat; running as quarterback is a mode
   of work the Developer moves into. This reverses the shipped
   `ronin_catalogs/job_roles/quarterback.md` and the KOTOBA § JOB ROLES row that cites
   quarterback as "the role that proved the axis."
   - The product-side edits (KOTOBA rows, R17 prose, catalog files, launcher fixtures)
     belong to `ronin-cowork` / `role_task_cut`, **not this repo**. This site plan only
     records the ruling and writes copy consistent with it.
   - The task's **token spelling is not yet ruled** (tasks are verb+object CamelCase;
     "Quarterbacking" is a gerund, which KOTOBA reserves for michi). Until KOTOBA names
     it, site prose says "run as quarterback" in plain words and prints no token for it.
2. **Public titles**: "Job Roles" and "Session Tasks" — never "Session Jobs", "Job
   Group", or "job class" (KOTOBA R17).
3. **Delivery rule** (owner): commit cohesive progress to local `dev` regularly, push
   `dev` to the remote as soon as possible, and open/update a `dev` → `master` PR.
   Merging to `master` (= deploying) stays with the owner.

## Information architecture

```text
/                                    root page: footer footnote → Explainers; stale
                                     "Session jobs" wording retired (see leg 3)
/explainers/                         library index — tmux, Tailscale, Job Roles,
                                     Session Tasks as one collection
/tmux_serve/                         existing, URL unchanged, listed as a member
/vpn_tailscale/                      existing, URL unchanged, listed as a member
/explainers/job_roles/               Job Roles: the concept + the role catalog
/explainers/session_tasks/           Session Tasks: the concept + the task catalog
/explainers/job_roles/<role>/        leaf landing pages — later increments
/explainers/session_tasks/<task>/    leaf landing pages — later increments
```

- Role and task branches are **siblings** so the URL hierarchy never implies a task is
  owned by a role. A task page has one canonical URL under `session_tasks/`; role pages
  link to tasks ("tasks this role moves between") and task pages link back to roles
  ("commonly used by") — cross-links, not ownership. This mirrors the product law: the
  role manifest owns membership, a task never names a role.
- Each page carries the smallest useful navigation: parent, sibling, related. Leaves do
  not need a link back to the library index.
- Existing explainer URLs do not move. Membership is by linking from `/explainers/`.

## Page pattern (from the two existing explainers)

Every explainer is one static `index.html` in its own directory, reusing
`ronin-tokens.css` and (only when it has a copyable brief) `site-shell.js`:

1. `<head>`: search-shaped `<title>… | Ronin Cowork`, meta description, keywords where
   they earn it; stylesheet via the correct number of `../`.
2. Standard header: brand link home, "Load Ronin" nav.
3. Eyebrow + display headline + lede.
4. Optional callout (`.no-setup` pattern) for the one fact that pre-empts a wrong
   assumption.
5. Optional `.session-brief` copyable prompt — only when the reader has a Ronin session
   to point at the question.
6. Numbered `.explainer` sections; `.terms` cards for vocabulary.
7. FAQ `<details>` where real questions exist.
8. `.finish` card → Load Ronin; footer with one relevant external link.

The library index uses the same shell with a linked list of members (title, one-line
hook, link) — no framework, no generator, no shared includes. Adding explainer N+1 is
"copy a page, edit the content, add one line to the index."

## Content plan for the new pages

**`/explainers/` — "Explainers"** (browser title "Ronin Cowork Explainers"). Short lede:
these pages explain the technology and concepts Ronin builds on. Members: tmux,
Tailscale, Job Roles, Session Tasks.

**`/explainers/job_roles/` — "Job Roles"** (title like "Job Roles for AI agent
sessions | Ronin Cowork"). Teaches: a role is WHO the session is — optional, chosen at
launch, fixed for the session's life, carrying stronger reading and launch defaults.
Opens with the compact three-axes model (`project_root` where · `job_role` who ·
`session_task` what now; task defaults override role defaults override system defaults;
blank is valid). Shows the shipped roles (Developer, Personal Assistant, Mika Assist) as
what exists today, and **HeadCoach** as the owner-defined example: the coach stays the
coach while its task moves between nutrition, workouts, recovery, equipment, and race
planning. Prominent sibling link to Session Tasks.

**`/explainers/session_tasks/` — "Session Tasks"** (title like "Session Tasks: what an
AI agent session is doing now | Ronin Cowork"). Teaches: a task is WHAT the session is
doing right now — optional, mutable, shown as the tile mark; changing it injects that
task's reading into the running session. Shows the shipped catalog (riff on it, draft
plan, cut code, chase bug, check work, odd job, open shell) with labels leading and
tokens shown as identity details. Uses the **Developer** composition per the ruling:
one Developer session that riffs, plans, cuts, debugs, checks — and can run as
quarterback — without becoming a different agent. States reusability plainly: a task
may appear under several roles; the association is navigation, not ownership. Sibling
link to Job Roles.

**Truthfulness constraints on both pages:**

- Grounded in the shipped catalogs; the HeadCoach composition is framed as "a role you
  can define," with no claim that an authoring UI exists (it is explicitly the next
  product build-out). How-to-define stays off the page until authoring lands.
- Custom-example task names render as labels ("race planning"); tokens are shown only
  for shipped definitions, spelled exactly (`developer` lowercase, `CutCode` CamelCase).
- No "run as quarterback" token is printed until KOTOBA rules its spelling.

## Legs

1. **Library index + root footnote.** Create `/explainers/index.html`; add the footnote
   link to the root footer (matching the existing one-link footer convention on the
   explainer pages). **Done when:** the index lists all four members, the root footer
   links to it unobtrusively, and both existing explainers are unchanged.
2. **The two branch pages.** Write `/explainers/job_roles/` and
   `/explainers/session_tasks/` per the content plan, with cross-links both ways and up
   to the index. **Done when:** each page stands alone, states the whole model
   compactly, uses KOTOBA terms exactly, and neither claims unshipped behavior.
3. **Retire stale vocabulary on existing pages.** Root page feature 04 ("Session
   jobs"), the "Make Ronin your own" card, the Services memory card ("session job"),
   and the tmux explainer's passing "jobs" become Job Roles / Session Tasks wording.
   **Done when:** grep over the site finds "session job" nowhere.
4. **Verify.** Local preview (`python3 -m http.server 8080`): every page reachable by
   ordinary links; relative assets and navigation correct from depth-2 paths; phone and
   desktop widths; light and dark; `docs/azure.md` payload checks pass. **Done when:**
   the verification list in the handoff is checked off.
5. **Release.** Keep the `dev` → `master` PR current; the owner merges. **Done when:**
   merged and the production URLs answer, or the PR is standing ready at the owner's
   discretion (see sequencing note).

Delivery cadence per the owner's rule: each leg that lands coherently is committed to
`dev` and pushed; the PR is opened with leg 0 (this plan) and updated as legs land.

## Sequencing and publication notes

- **`role_task_cut` timing.** The install's own tooling already speaks `session_task`,
  but the cut may not be fully landed or released. The branch pages are written to be
  true of the model, not of a release date; if the owner merges to `master` before the
  product release, the copy still must not name behavior that does not exist in the
  shipped Cowork. Final wording check happens at PR review.
- **`wip/` becomes public if merged to `master`.** The Azure workflow uploads the whole
  repo (`app_location: "/"`, no `staticwebapp.config.json`), so committed `wip/` and
  `docs/` files are served at their paths (unlinked, but fetchable). `docs/` is already
  tracked, so precedent exists. Recommendation: commit `wip/` to `dev` per the delivery
  rule, and add a minimal `staticwebapp.config.json` excluding `/wip/*` before the
  merge — owner to confirm, since adding any config is a deliberate change under the
  static-site boundary. If declined, the alternative is keeping `wip/` untracked.

## Open items for the owner

1. Token spelling for the quarterback task (verb+object suggestion: `RunPoint` or
   `CoordinateWork`; or keep `QuarterBack` as a ruled exception like `OddJob`) — a
   KOTOBA ruling, needed before any site page prints the token.
2. Whether HeadCoach's five task labels should also get ruled tokens now (`PlanRace`,
   `DesignWorkout`, …) or stay label-only on the site until an owner actually defines
   them.
3. The `/wip/*` exclusion decision above.
4. Whether `docs/azure.md`'s payload check list should grow the new files
   (`test -f explainers/index.html`, …) — proposed yes, in leg 4.
