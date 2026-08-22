# Explainer library and Job Roles / Session Tasks explainer

> expires: when the explainer library, its root-page entry point, and the first new explainer have landed

## Goal

Build a small, extensible library of explainer landing pages on RoninCowork.com. The site
already has standalone explainers for tmux and Tailscale. Treat those as the beginning of
one coherent explainer collection rather than unrelated pages.

For the first increment:

1. establish a nested library structure and repeatable page patterns from the existing
   tmux and Tailscale explainers;
2. add a low-key footnote link at the bottom of the root Ronin landing page that leads to
   the explainer library;
3. add a new explainer about **Job Roles and Session Tasks**: the kinds of developers,
   systems, assistants, or other roles an owner can define, and the tasks a session can
   perform or move between;
4. explain how owners define and use these concepts, grounded in the role/task system now
   being built by the `role_task_cut` session.

## A nesting doll, not a flat directory

The library must be able to descend from a broad explanation into concrete, independently
addressable use cases. Each useful role or task may warrant its own landing page, both to
teach the product and to support a focused search or advertising campaign.

A likely shape to evaluate is:

```text
Explainers
  -> Job Roles                               what roles are, plus the role catalog
      -> Personal Trainer                    one role's landing page
  -> Session Tasks                           what tasks are, plus the task catalog
      -> Workout Session                     one task's landing page
```

The root page can link to the explainer library; the library can link to **Job Roles** or
**Session Tasks**; each catalog can link to its individual definitions. This is a cascade,
not a requirement that every leaf page link directly back to the library. Give each page
the smallest useful parent/related navigation so a visitor can move naturally through
the hierarchy.

For example, **“Have your agent be a personal training assistant”** should work as a
standalone landing page. It should explain the outcome, a little relevant background,
and the procedures the assistant follows without exposing implementation machinery. It
can then show the concrete configuration in plain terms, likely:

- `job_role: PersonalTrainer` — who the agent remains across the session;
- `session_task: WorkoutSession` — what it is doing at that moment.

In the product, session tasks are reusable and may appear under several job roles. Keep
role and task catalogs as sibling branches so the URL/navigation hierarchy does not imply
that a task is technically owned by one role. A role detail page may link to compatible or
illustrative task pages, and a task detail page may link to roles that commonly use it;
those are cross-links, not ownership.

Every lower-level page should be capable of standing on its own for a narrowly phrased
question or campaign while still leading upward to the conceptual explainer and sideways
to related roles/tasks. Avoid thin programmatic SEO pages: each page needs a real outcome,
audience, explanation, operating procedure, and next step.

### Canonical worked example

Use this concrete composition to explain the distinction:

- `job_role: HeadCoach`
- associated `session_task`s:
  - Nutritionist
  - Workouts
  - Recovery
  - Equipment
  - Race Planning

The Head Coach role remains who the agent is. Its task changes according to what the
session is doing: discussing nutrition, designing a workout, managing recovery, choosing
equipment, or planning a race. The Head Coach detail page can act as a use-case hub for
these tasks. Each task can also have an independently addressable explainer and may be
shown under another compatible job role later; the association is navigation and
recommendation, not technical ownership.

A second owner-provided composition is:

- `job_role: Developer`
- associated `session_task`s:
  - Quarterbacking
  - Cutting Code
  - Debugging
  - Application Management

This example sharpens the axis: Developer is the durable professional identity, while
coordination, implementation, diagnosis, and application management are modes of work it
can move between.

It also conflicts with the current KOTOBA/catalog treatment of `QuarterBack` as a fixed
`job_role`. Do not silently resolve or conceal that conflict in site copy. Identify it in
the understanding report and build-out plan so the owner can rule whether QuarterBack
remains a role, becomes Quarterbacking as a task under Developer, or legitimately exists
on both axes with distinct meanings.

## Taxonomy and product model

KOTOBA is law. Read `/home/glen3/dohyo/ronin-cowork/KOTOBA.md`, especially `job_role`,
`session_task`, session launch, and RIREKI terminology. The product model is:

- `job_role`: who the session is; fixed after launch, with stronger reading and launch
  defaults. Examples may include Developer and Personal Assistant.
- `session_task`: what the session is doing now; optional and mutable. Examples include
  planning, riffing, cutting code, debugging, and checking work.
- tasks may appear under multiple job roles and are not hard-linked to one role;
- a blank role/task is valid and adds no custom reading;
- both definitions can carry reading and launch defaults, with task defaults overriding
  role defaults, which override system defaults;
- `project_root` remains required.

Do not revive `session_job` as the current category. The owner described the desired page
as “Session Jobs and Session Tasks,” but the ruled current term is **Job Roles and Session
Tasks**. Flag any proposed public title against KOTOBA rather than inventing a synonym.

Use these current design sources, while recognizing that `role_task_cut` may still be
implementing them:

- `/home/glen3/dohyo/ronin-lab/wip/buildouts/ROLE_TASK.md`
- `/home/glen3/dohyo/ronin-lab/wip/handoffs/ROLE_TASK_EXECUTION.md`
- `/home/glen3/dohyo/ronin-cowork/ronin_catalogs/job_roles/`
- `/home/glen3/dohyo/ronin-cowork/ronin_catalogs/session_tasks/`

## Existing site material

Work in `/home/glen3/dohyo/ronin-site`. Inspect before proposing changes:

- `index.html` — root landing page and footer/footnote conventions;
- `tmux_serve/index.html` — existing tmux explainer;
- `vpn_tailscale/index.html` — existing Tailscale explainer;
- `ronin-tokens.css` and `site-shell.js` — shared visual language;
- `README.md` and `docs/site.md` — build/deployment facts.

Preserve the site’s existing design language. The library should make adding another
explainer straightforward without prematurely building a framework or CMS.

## First response and stop condition

First read this handoff and the named sources. Then report, in your own words:

- what you believe should be built;
- what you will not do yet;
- the proposed information architecture and likely public title;
- any ambiguity or conflict you find.

Do **not** edit code, build, commit, or deploy until the owner says go. Wait after the
understanding report. When authorized, begin with a build-out plan unless the owner
explicitly directs implementation.

## Verification for eventual implementation

- every explainer and the library index is reachable by ordinary links;
- the root landing page has the requested unobtrusive bottom link;
- relative assets and navigation work from nested page paths;
- responsive behavior is checked at phone and desktop widths;
- the new page uses `job_role` and `session_task` consistently with KOTOBA;
- existing tmux and Tailscale pages remain reachable and visually intact;
- repository-provided checks, if any, pass;
- no commit, push, or deployment without explicit owner authorization.

## Definition of done

The site has a discoverable explainer-library entry point, the existing explainers are
presented as members of it, and a clear Job Roles / Session Tasks explainer teaches the
new session model without contradicting KOTOBA or claiming unfinished behavior has
already shipped.
