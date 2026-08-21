# Site ownership and design contract

This repository is the deployable public site for `ronincowork.com`. It owns what production
serves. `ronin-lab/landing/` is the workshop: positioning, journey discussion, page concepts,
identity studies, and alternatives stay there until the owner chooses one to ship.

## The site walk

The public journey is discussed as five named surfaces:

```text
landing_page → load_ronin → install_ronin → cowork_setup → cowork
```

This repository serves `landing_page`, `load_ronin`, and the public owner-walk preview.
`install_ronin` is the terminal handoff into the released Cowork installer. The
`cowork_setup` and `cowork` pages here are clearly marked previews of surfaces that belong to
the installed `ronin-cowork` application.

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

## Syncthing

The dohyo checkout at `/home/glen3/dohyo/ronin-site` is a configured Syncthing send/receive
folder and contains its `.stfolder` marker. Syncthing moves the working tree between the owner's
machines; Git remains the release and history mechanism.
