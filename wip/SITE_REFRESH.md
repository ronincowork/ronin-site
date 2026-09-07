# Site refresh

## Goal

Make the public Ronin website answer its clearest visitor questions in a deliberate journey,
while preserving the useful core of **Launch and go / Manage the edges**. Treat the recovered
landing-page commit as workshop material, not an approved design. Keep this release independent
of Setup and stage every material choice for Glen before implementation or promotion.

## Current constraints

- Work only in `ronin-site`, on the managed `team/site-refresh/site_refresh_lead` desk.
- The desk was cut from global `dev` at `32499cbd8b`; do not modify global `dev` directly.
- Recovered commit `61e2e8fe42186a30d67d7a1aec084d2e97228c60` is present as private commit
  `90a49bb`.
- Do not mix this work with `setup-execution`, and do not Git push.
- Planning precedes implementation. Glen reviews the synthesis before code changes continue.
- Use no more than two visible supporting Ronin sessions. Each keeps its own work record and
  buildout, and returns only concise recommendations.

## Inventory to complete

### Current public site

- Map each public page, its promised job, entry points, exits, and repeated calls to action.
- Trace the likely first-time visitor journey from landing through proof, installation, and
  deeper explanation.
- Record the current information hierarchy and visual hierarchy, including responsive behavior.
- Separate the deployable public site from the template-library payload and installed-product UI.

### Recovered landing delta

- Compare `61e2e8f` with its global-`dev` parent and identify what becomes clearer or weaker.
- Check the two-job structure against the rest of the landing page and the supporting pages.
- Test whether the headline, proof, calls to action, terminology, and visual rhythm form one
  coherent journey.
- Retain, revise, or reject individual recovered choices with reasons; do not accept the commit
  as a unit.

## Initial inventory — 2026-09-07

### What the public site currently asks visitors to do

The deployable site has four distinct public jobs:

1. **Understand Ronin** — the landing page explains the product, ownership boundary, Services,
   technical shape, and host choices.
2. **Load Ronin** — `load-ronin.html` is the conversion handoff, with three routes: run the
   command, hand the install to an Agent, or prepare a Hetzner VM first.
3. **Investigate a question** — the explainer index leads to product-model, coordination,
   persistence, remote-access, VM, and Git-worktree explanations.
4. **Browse ready-made work** — the template library shows Teams and Agents available through
   Services and explains how they enter an installed Ronin.

The documented owner journey is broader than this repository:

`landing page → Load Ronin → installer → cowork setup → coworkspace`

The public repository owns only the first two surfaces plus optional supporting explanations and
the template shop window. Installation and product setup must remain outside the site refresh.

### Current landing journey

The recovered landing now reads, in order:

1. Hero: **Launch and go. Manage the edges.** with primary **Load Ronin** and secondary
   **What is Ronin Cowork?** actions.
2. Two jobs: launch a provider Agent; add persistence and coordination around it.
3. Reasons to trust the model: owner machine, open source, existing accounts, owned work,
   coordination without control.
4. Services beta: work records, transcripts, Stats, voice, and gbrain.
5. Stack placement: what Ronin does and does not replace.
6. Technical proof: terminal CLIs, tmux persistence, host reachability, remote access, and
   supported-provider facts.
7. Final **Load Ronin** call to action.

This is logically progressive, but it makes one page carry product definition, differentiation,
paid-service catalogue, architecture, host education, and conversion. The header likewise offers
six choices (three in-page subjects, Templates, Explainers, Load Ronin), so the primary path is
present but competes with several taxonomic paths.

### Supporting-page relationship

- **Load Ronin** has a clear single job and should remain the main conversion destination.
- **Explainers** are useful question-led proof, but the index presents eleven peers. It needs a
  clearer first path than a flat catalogue if it participates in the primary journey.
- **Templates** demonstrates concrete uses, but its Teams/Agents and project/people axes are not
  introduced by the landing page before the visitor reaches the catalogue.
- **tmux**, **Tailscale**, and **VM** pages are supporting answers, not required setup steps; the
  site contract explicitly protects that distinction.
- Several legacy use-case/customization URLs remain intentionally unlinked because their old role
  vocabulary is migration debt. They should not be restored to navigation during this refresh
  without a separate truth review.

### Recovered delta: retain / test / revise

**Retain as the working spine**

- The two-job framing is substantially easier to scan than the previous six equal feature cards.
- **Launch and go / Manage the edges** describes a useful progression from immediate value to
  optional operating structure.
- Saying provider Agents retain their accounts, tools, reasoning, and conversations sharpens the
  boundary more precisely than the former general “coworkspace around” sentence.
- The host-availability clarification closes a real ambiguity in persistence claims.

**Test with the discussion group**

- Whether “Launch” incorrectly sounds like Ronin is merely a CLI launcher rather than a persistent
  coworkspace.
- Whether “edges” is meaningful on first contact or only after the page explains it.
- Whether the provider-line fragment adds clarity or reads as campaign copy without a subject.
- Whether removing the six cards also removed the fastest concrete picture of what a visitor gets.

**Likely revise before implementation**

- The two-job copy currently jumps from “native terminal conversation” to internal coordination
  nouns such as wipeboard and reviewed file handoffs before showing the workbench or a concrete
  use case.
- The hero has no compact proof or visual of the coworkspace, leaving the slogan to carry the first
  screen alone.
- Page navigation reflects site taxonomy rather than a visitor decision sequence; **Ronin
  Cowork / Services / Tech Talk / Templates / Explainers / Load Ronin** gives all subjects similar
  prominence.
- The main page repeats the two-job language without yet giving each job an obvious next step:
  install now, see it working, inspect ownership, or browse a useful starting point.

### Primary journey hypothesis for discussion

The clearest first-time route appears to be:

1. **Recognition:** I can use Claude, Codex, Gemini, or another terminal Agent through my own
   account.
2. **Immediate job:** Ronin gives me a persistent browser place to launch and return to that work.
3. **Expansion job:** when one session becomes several, Ronin manages the coordination edges
   without taking over the Agents.
4. **Trust:** it runs on a machine I control; the work, accounts, and native conversations stay
   mine.
5. **Proof or action:** see the coworkspace and a concrete working loop, or go straight to
   **Load Ronin**.

Services, templates, and technical explainers should support this route at the moment their
question naturally arises, rather than each becoming an equal first-level journey.

## Recommended refresh direction

The landing page should answer one story rather than present the product taxonomy: use the AI
Agents and accounts you already chose; work across providers in one persistent coworkspace; add
coordination only where work crosses their boundaries.

### Three-leg proposition

> **Launch and go. Work across providers. Manage the edges.**

1. **Launch and go** — use each supported provider Agent through its existing CLI and account.
2. **Work across providers** — keep provider Agents side by side in one persistent coworkspace and
   choose the one that fits the work.
3. **Manage the edges** — add visible Teams, shared documents, work records, messages, and safe
   file handoffs without replacing how each Agent works.

“Work across providers” is preferable to “run multiple model providers side by side”: it is
shorter, describes the owner's benefit, and leaves the concrete mechanism to the supporting line.
The page must nevertheless say plainly what it means rather than asking the slogan to carry the
claim alone.

### Answer the central objection early

The page should directly acknowledge that individual provider products already run Agents well:

> Claude and Codex can each run Agents on their own. Ronin is for the work that crosses those
> boundaries — different providers, persistent sessions, shared projects, and coordination you
> control.

This belongs immediately after the first product explanation. Ronin is not presented as a better
Claude or Codex interface; its differentiated job is the owner-controlled operating layer across
provider boundaries.

### Why several provider Agents are useful

Collapse the practical reasons into three durable benefits rather than a long defensive list:

1. **Choose by strength.** Models behave differently, and their relative strengths change. Keep
   several available, then assign work according to the task rather than committing the whole
   project to one provider. Avoid permanent product claims such as “Codex is better at X” in
   house voice. Glen's experience can be identified as such: he often prefers Codex for
   coordinating Agents and Claude for complex execution across a codebase; the durable point is
   freedom to choose, not declaring a winner.
2. **Switch without starting over.** Provider outages, subscription usage limits, and newly
   released models should not strand the working environment. The project and coworkspace remain
   available while workload moves to another supported Agent. This makes resilience, capacity,
   model adoption, and reduced provider lock-in one coherent benefit.
3. **See and direct the Team.** Provider-native subagents may be hidden inside one conversation.
   Ronin Teams use separate visible sessions that the owner can open, address, inspect, and
   coordinate directly. This is stronger than “several chat windows”: it is an observable Team
   whose edges the owner controls.

A compact supporting line can carry all three:

> Use the Agent that fits the task. Keep working when providers or limits change. Build a visible
> Team you can direct yourself.

### Concrete landing-page change

Reshape the page into this order:

1. **Hero:** the three-leg proposition, one plain-language supporting sentence, a primary **Load
   Ronin** action, and a secondary **See how it works** action.
2. **Product proof:** a real workbench image or compact demonstration showing provider Agents as
   separate visible sessions. The visitor should not have to infer the product from a slogan.
3. **Why across providers:** three concise cards — **Choose by strength**, **Switch without
   starting over**, and **See and direct the whole Team**.
4. **How Ronin manages the edges:** restore the most concrete benefits lost when the old six-card
   feature grid became two abstractions — persistence, side-by-side providers, optional
   coordination, and collision-safe parallel file work.
5. **Trust boundary:** accounts, native conversations, files, and machine remain the owner's;
   Ronin coordinates rather than replacing the Agents.
6. **One working example:** show an intelligible multi-Agent job from launch through direct review
   and handoff. Link onward to Templates as more examples of useful work.
7. **Optional Services:** summarize the paid layer after the core product is understood. Do not
   make the Services catalogue part of the definition of Ronin.
8. **Action:** one final **Load Ronin** conversion, with supporting technical questions routed to
   the explainer library.

Reduce the header to three visitor decisions: **See how it works**, **Explore examples**, and
**Load Ronin**. Move Services, tmux, host, Tailscale, VM, and detailed architecture into contextual
links or the explainer library rather than giving them equal weight in the primary journey.

### Copy and terminology rules

- Lead with Agent, session, work, project, files, and provider.
- Explain “edges” immediately: persistence, visibility, communication, shared records, and file
  handoffs between otherwise independent Agents.
- Introduce Workbench, Services, wipeboard, Routines, and Worktrees only at the point where the
  visitor needs the named feature.
- Do not name unsupported providers merely for breadth; examples on the page must match current
  product support.
- Keep **Load Ronin** as the sole primary conversion action. Supporting links may answer questions
  but should not compete with it.

## Proposed discussion group

Raise only after Glen approves the roles:

1. **Journey editor** — inventory information architecture and the first-time visitor path;
   return a short recommended page order, primary journey, and the few navigation changes that
   matter most.
2. **Copy and hierarchy editor** — critique concise copy and visual priority around **Launch and
   go / Manage the edges**; return a short hierarchy, cuts, and wording risks, not replacement
   page code.

Each session will work read-only in its own managed desk, keep a work record, list its own
buildout, post concise recommendations to the `site-refresh` wipeboard, and stop. The lead will
compare those recommendations with repository evidence and place one synthesis here.

## Decision gate

Before implementation, Glen reviews:

- the current-site and recovered-delta inventory;
- the two concise specialist recommendations;
- the lead's proposed jobs, journey, page scope, and hierarchy;
- explicit retain / revise / reject calls for the recovered material;
- the planned verification and independent promotion boundary.

No implementation begins until Glen resolves that synthesis.

## Remaining build legs

1. Complete the evidence inventory and add it here.
2. Obtain Glen's approval for the two proposed supporting sessions, then raise them one at a time.
3. Collect concise recommendations and synthesize a single proposed site journey.
4. Stop at the owner decision gate.
5. After approval, implement only the agreed scope and remove completed legs from this document.
6. Run focused site checks, then the repository's full verification.
7. Stage the result on the team line for owner review and promote independently of Setup; never
   Git push.

## Verification

- `node scripts/check-site.mjs`
- `node scripts/pack-library.mjs --check`
- `npm run verify` if the repository defines it at implementation time
- Browser review at desktop and phone widths for navigation, content order, focus behavior,
  overflow, and visual hierarchy
- Link and social-metadata inspection across changed public pages

## Definition of done

- The public site has one legible primary journey and clear jobs for each page.
- The landing page makes the provider-Agent relationship, local host, persistence, and optional
  coordination understandable without front-loading house vocabulary.
- **Launch and go / Manage the edges** survives as the core direction in an owner-approved form.
- Supporting pages and calls to action reinforce rather than compete with the landing journey.
- Verification passes, Glen has reviewed the staged result, and site work is promoted on the
  `site-refresh` timeline without Setup commits or a Git push.
