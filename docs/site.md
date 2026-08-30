# Site ownership and design contract

This repository is the deployable public site for `ronincowork.com`. It owns what production
serves. `ronin-lab/landing/` is the workshop: positioning, journey discussion, page concepts,
identity studies, and alternatives stay there until the owner chooses one to ship.

## The public site

The complete owner journey is discussed as five named surfaces:

```text
landing_page → load_ronin → install_ronin → cowork_setup → cowork
```

This repository serves `landing_page`, `load_ronin`, and the explainer library. The library
lives at `explainers/` (linked from the root header). Its currently indexed, verified members
are the standalone `vpn_tailscale` and `tmux_serve` guides at their original root paths.
`explainers/agent_teams/` and its use-case pages (`developer_team`, `fitness_team`,
`home_management_team`, `personal_assistant_team`), plus `explainers/customization/`, remain
reachable at their published URLs but are unlinked migration debt: their retired role vocabulary
must be reconciled with current product truth before the index promotes them again.
`install_ronin` is the terminal handoff into the released Cowork installer. Journey studies
remain in `ronin-lab`; `cowork_setup` and `cowork` belong to the installed `ronin-cowork`
application and must not be published here.

Supporting explainers answer a real question someone may search for, explain the underlying
technology in the context of AI agent work, and lead back to Ronin. They are not artificial stops
in the owner journey and they must not read as hidden setup requirements. When an explanation can
be grounded in the user's own machine, lead with a copyable brief for a session in their
coworkspace. The agent should inspect first, preserve owner approvals, and use read-only checks
when no change is required.

## Explainer page contract

New explainers start from `wip/explainer-template/index.html`. The hosting configuration returns
404 for `/wip/*`, so the scaffold can be reviewed locally without becoming a public destination.
Copy its semantic structure into the approved public route; do not publish the scaffold itself.

Every explainer follows the same reading order: the question, a short answer, the visual or
demonstration, what to notice, an appropriately detailed explanation, an explicit boundary on
what Ronin does not claim, one useful action, and one related explanation. The shared classes in
`ronin-tokens.css` provide breadcrumbs, hero, sections, accessible media framing, claim boundary,
actions, and related-next treatment. A page adds local CSS only for evidence-specific diagrams or
layouts.

Essential content is HTML, not JavaScript output. A page must retain a useful reading route when
scripts or images do not load, use descriptive alt text and captions or transcripts for media,
and work by keyboard at phone and desktop widths. Public pages also carry a unique title and
description plus their production canonical URL. Social metadata is added only when an approved
asset and claim exist.

The names are deliberate. Plain `setup` and `landing` are too ambiguous across a public site,
an installer, and an installed application.

## Moving work from lab to production

1. Settle the words and behavior in `ronin-lab/landing/`.
2. Review the relevant concept in `ronin-lab/landing/concepts/` on desktop and phone, light and
   dark.
3. Port the chosen pages and only their required local assets into this repository.
4. Check every public claim against shipped behavior.
5. Work on `dev`; release through the normal `dev` to `master` pull request.

Do not deploy directly from `ronin-lab`, and do not copy its whole concepts directory here.
The lab may contain rejected studies and private positioning arguments.

## Design system

The site uses the same semantic token pattern as Cowork's `docs/ui.md`: surfaces, edges, text,
meaning, spacing, corners, type, and focus. It does not invent another palette or rename the
same roles for the public site.

Shared tokens do not mean terminal styling everywhere. Public pages use ordinary UI type for
sentences, generous spacing, and mono only for commands, labels, and identity details. The
connection to Cowork should be visible in colour, rhythm, edges, and interaction—not through
terminal jargon or decorative command-line chrome.

The identity direction is a kaki hexagon containing **人**, the human/person character from
`浪人`. Latin `nin` lettering and the full `浪人` word are not the mark.

## Static-site boundary

Keep production static and inspectable: HTML, CSS, and local assets. Add no framework, build
system, analytics, account gate, or external asset request without a decision that changes this
document first.

The one piece of hosting configuration is `staticwebapp.config.json`, which returns 404 for
`/wip/*` so working documents committed to the repository are never publicly served (owner,
2026-08-22). It adds no build step and changes nothing else about serving.

## Syncthing

The dohyo checkout at `/home/glen3/dohyo/ronin-site` is a configured Syncthing send/receive
folder and contains its `.stfolder` marker. Syncthing moves the working tree between the owner's
machines; Git remains the release and history mechanism.
