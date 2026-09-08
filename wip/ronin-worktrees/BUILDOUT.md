# Ronin Blog: one Worktrees explainer, topic plus how-to

Editorial buildout for consolidating the site's worktree explainers into one page. Owner:
`worktrees_explainer_fable` (site-refresh team, desk
`team/site-refresh/worktrees_explainer_fable`). Status: **draft for Glen's review**.
Nothing here is public; `/wip/*` answers 404 in production.

- Draft page: `wip/ronin-worktrees/index.html`.
- Proposed public route: **replace** `explainers/ronin-worktrees/` with this page and
  **absorb** `explainers/checkouts-and-worktrees/` into it. The checkouts URL stays alive
  (site contract: keep published URLs stable) as a one-paragraph pointer to the
  consolidated page, or as a hosting redirect if Glen prefers one; either way the index
  and the landing quilt list one worktrees entry, not two.

## Glen's direction (2026-09-08)

The blog needs two kinds of explainer: a **topical** piece, and a **drill-down with
instructions** where the topic has a procedure. Worktrees should not be split across a
"worktrees in general" page and a "how we deal with it" page, and the team journey is a
component of the worktrees explainer, not a page of its own. This draft follows that: one
page, two halves, with in-page anchors `#topic` and `#howto` so the index and the landing
quilt can point at either half.

## Page shape

1. **Hero**: the two questions in one kicker, a lede that states the problem and both
   halves, and a two-card pointer to the halves.
2. **The topic**: one folder shows one branch (the collision problem); the two models side
   by side with their diagrams, chosen once per repository; the two branches that are the
   truth and everything else on loan. Carried over from Checkouts and Worktrees, tightened.
3. **How to use it in Ronin · setup**: the two switches, per repository. Carried over from
   Ronin Worktrees.
4. **How to use it · the journey**: the read-only "where does my Team's work stand" brief,
   the six-station strip, what to notice, then one section per station (mark a lead;
   worktree at birth; commit and hand in; when two hand-ins disagree; review, verify,
   promote; close when told; you approve the release), each with a short "where the tools
   or macros help" note, and an "in short" who-does-what list.
5. **Boundary** and **next explanation** (Agent coordination).

Dropped from the two existing pages, deliberately: the three-Teams rails diagram, the
five-verbs comparison table, the separate "who cleans up" section (its substance is one
sentence in the branches section and one in the close station), and the repeated
setup-and-loop summary. They were the overlap Glen pointed at.

## The job of the how-to half

The two existing pages answer *what* (the two switches and the loop) and *which* (choose
a model per repository). Neither walks a person through the whole journey as a sequence
of people and moments. The how-to half is that walk, in plain language, for someone who
has just watched a Team work on their repository and wants to know where the work is and
who decides what next.

Question the page answers: **Several Agents just worked on my repository. How does their
work reach my stable branch, and who decides what along the way?**

## Evidence map

Authoritative sources read for this draft, in the order of authority the packet gives:

| Claim area | Authority |
|---|---|
| Agent contract: three verbs, four boundaries, finish the assignment | `ronin-cowork/ronin_session_boot/routine/ronin_worktrees/WORKTREES.md` (the birth reading) |
| Resolution (repository + Agent), lines, boundaries table, lifecycle direction | `ronin-cowork/docs/worktrees.md` |
| Registry, open, hand-in mechanics, lead notice, no-lead behaviour, close/discard | `ronin-cowork/docs/desks.md` |
| Promotion flow, lock, recovery, NO-LEAD, the release PR | `ronin-cowork/docs/team-promotion.md`; `src/commands/promotion.ts`; `src/promotion/pr.ts` |
| Lead designation is by hand | `ronin-cowork/docs/team-workspace.md` (人 toggled from a tile's menu); `KOTOBA_GLOSSARY.md` row `team_lead` |
| Macro and action wording | `ronin-cowork/ronin_catalogs/MACROS.md` (`cutcode`, `land`, `delete`, `tell`, `wipeboard`); `ronin_catalogs/ACTIONS.md` (`cut-code`, `open-pr`, `land-work`, `desk-*`, `hand-in`, `check-clean`); `ronin_catalogs/TOOLS.md` row `tejun-desk` |
| Public wording law | `ronin-cowork/KOTOBA_GLOSSARY.md`: say *hand in*, never *push*; *commit* publishes nothing; *Git push* is remote only; *team lead · 人*; *desk* is rendered as the plain word |
| Site contract | `docs/site.md` (explainer reading order, template, no framework), `wip/explainer-template/index.html`, `scripts/check-site.mjs` |
| Existing public pages this must not contradict | `explainers/ronin-worktrees/`, `explainers/checkouts-and-worktrees/`, `explainers/agent-coordination/` |

## Corrections to the brief, from repository evidence

The assignment's own summary of the journey is close. These are the places where the
repository says something more precise, and the draft follows the repository.

1. **"A Team needs a designated lead."** A lead is the better arrangement, not a hard
   prerequisite, and it is *never inferred*: the owner marks one by hand from a tile
   ("人 make team lead"). Without one, a hand-in still succeeds and tells the handing-in
   session it holds the lead's job for that hand-in; promotion refuses with `NO-LEAD`
   and asks the owner to mark one ("a coordinator that writes no code does fine"), and
   only `--anyway` promotes on the owner's word. The draft says: mark a lead before
   parallel work starts, and here is what a lead is for; it also says plainly what Ronin
   does when nobody is marked. (Note for ronin-cowork, not for this site: `docs/desks.md`
   says promotion "is not restricted to a designated lead"; the promotion command refuses
   without one unless `--anyway`. The draft follows the command.)
2. **"The lead assigns isolated desks/worktrees to Agents."** The lead does not hand out
   worktrees one by one. A coding Agent born onto a Team gets its worktree at launch,
   before its first prompt, wherever the repository enables Worktrees and the Agent
   carries the Worktrees Routine. What the lead *can* choose centrally is the starting
   point for a named Agent: current accepted work (`dev`) for fresh work, or the Team's
   own line when joining work already in flight (`tejun-desk assign`). An Agent may also
   open its own worktree for a repository its brief did not list.
3. **"Close finished desks so code is not orphaned."** Closing is real, but the safety
   comes from refusals, not diligence. Close removes only a clean worktree whose work is
   already on its line, never makes a WIP commit for you, and a session's ending
   preflight names any worktree with unsaved files or unhanded commits. The only thing
   that deletes unresolved work is an explicit discard with an exact confirmation. Also:
   a worktree is *finished when promotion says so*, not when hand-in is accepted, and
   promotion tells each contributor itself.
4. **"The lead adjudicates conflicts."** True in the sense that the lead *rules*; the
   fix happens at the Agent's worktree. A conflicting hand-in is contained in the
   throwaway candidate, the Team line is untouched, the worktree is marked blocked, the
   lead is told and decides which side wins; the Agent updates, resolves, commits, and
   hands in again on the same worktree. The lead does not edit the line. (This team's own
   wipeboard on 2026-09-07 shows exactly that shape: an adjudication post, then a second
   hand-in from the same desk.)
5. **"Verifies the combined Team line and promotes it to local dev."** Correct, with two
   details worth saying: full repository verification is the lead's responsibility at
   promotion (hand-in runs only merge and admission checks), and promotion for a
   repository that does not drive a live app records the restart and health steps as
   skipped rather than running them. Promotion writes its receipt before anything moves,
   advances `dev` by compare-and-swap, then posts the outcome on the Team wipeboard and
   tells each contributor its worktree may close.
6. **"The owner approves and merges the release pull request."** Correct. The release
   action pushes the working line and opens or updates *one* rolling pull request from
   `dev` to the stable branch with the promotion receipt in its body; CI verifies the head
   against that receipt; merging is the owner's hand. That push is the only Git push in
   the whole journey, and it belongs to the release step, never to an Agent's hand-in.

Two smaller wording points: the Team's review line is local, as the brief says; and
"commit coherent checkpoints" is the birth reading's own phrase.

## Editorial decisions

- **Vocabulary.** *Worktree* throughout, with one sentence that Ronin's status output
  calls it a *desk*. *Hand in*, never push. *Team line* / *the Team's review line*.
  *Working line* (`dev`) and *stable line* (`master`) as the Checkouts explainer already
  uses them. *Team lead* with the 人 mark, as the app shows it. *Macros* for `+name:`
  workflows, per the glossary. No internal system names.
- **Commands.** Kept to the few a reader will meet: `tejun-desk` verbs already on the
  public Checkouts page, and the promotion and release commands the lead and owner run.
  Each appears once, in mono, beside the moment it serves. The page is a journey, not a
  reference; the birth reading and the docs stay the reference.
- **Macros.** Named by their tile spelling (`+cutcode:`, `+land:`, `+delete:`, `+tell:`,
  `+wipeboard:`) in one short section, described by what they do for the person at the
  tile. No recipe tables.
- **Shape.** The site's explainer order: question, short answer, the visual (a
  six-station journey with who acts at each), what to notice, the explanation station by
  station, the boundary, one action, one related page. Local CSS only for the journey
  strip. Everything essential is HTML; no script beyond the shared copy helper.
- **Copyable brief.** A read-only "where does my Team's work stand" brief, per the site
  contract's rule to lead with a grounded brief when the machine can answer.
- **Not in the article.** Setup (two switches) and the model choice are linked, not
  repeated. Recovery commands (resume, abandon, revert, bisect), audit and settle tools,
  handoff between sessions, and the lock's stale-reclaim rules are left to the docs.

## Verification done on the draft

- `node scripts/check-site.mjs` passes with the draft tracked (it checks every tracked
  HTML file's local links, so the draft's relative paths resolve from `wip/`).
- Rendered with headless Chromium at 1280px and 390px widths: the journey strip is a
  three-column grid on desktop and stacks to one column on the phone; no horizontal
  overflow in either capture. Keyboard order and dark theme were not exercised in a real
  browser yet; that stays on the publication list.
- Every public claim above is traced to a file in the evidence map.
- Two defects found in the carried-over diagram markup and fixed here: at phone width the
  two model cards overflowed the viewport (the one-column grid used `1fr`, whose minimum
  is the diagram's 360px), and the "cut from dev" label sat on top of "local dev ·
  accepted". The live Checkouts and Worktrees page has the same two defects; absorbing it
  into this page retires them.

## Left for publication, if Glen approves

1. Replace `explainers/ronin-worktrees/index.html` with this page; change the stylesheet
   paths to `../../ronin-tokens.css` and `../pbs.css`; keep the existing canonical URL.
2. Turn `explainers/checkouts-and-worktrees/index.html` into a short pointer page (or add
   a redirect route in `staticwebapp.config.json`, Glen's call), and merge its manifest
   entry into the `ronin-worktrees` entry in `explainers/public-content.json`, adding the
   lead-designation and release-PR contracts to the review trigger.
3. Collapse the two worktree entries in `explainers/index.html` and the landing quilt
   into one, in whatever position the site-refresh journey gives it.
4. Check keyboard order and the dark theme in a real browser at both widths.
5. Rerun `node scripts/check-site.mjs`, then hand in on this desk for the lead's review.

## Open questions for Glen

- Confirm the route: replace `ronin-worktrees` and absorb `checkouts-and-worktrees`, with
  the old URL kept as a pointer or redirect.
- Whether the same topic-plus-how-to shape should become the pattern for other Ronin Blog
  pages that carry a procedure (the tmux and Tailscale guides already are).
- Whether the page should print any commands at all, or leave every command to the
  Checkouts page and the docs and stay purely narrative.
- Whether the "when nobody is marked lead" paragraph belongs on a public page or reads as
  an invitation to skip the lead.

## Work log

- 2026-09-08 · read packet, desk status, wipeboard, both worktree explainers, coordination
  explainers, site contract, template, checker, `worktrees.md`, `desks.md`,
  `team-promotion.md`, `desk-state.md`, catalog rows, promotion CLI and PR source.
- 2026-09-08 · wrote the buildout and a standalone journey draft; checked; committed.
- 2026-09-08 · Glen: one worktrees explainer, topic plus how-to, journey as a component.
  Consolidated both public pages and the journey into `wip/ronin-worktrees/index.html`;
  removed the standalone journey draft; checked; committed.
