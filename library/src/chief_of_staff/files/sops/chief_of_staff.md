# chief_of_staff — how this office runs

> Installed from the template library. Your own copy in the sops store (`ronin-store sops`
> → `chief_of_staff.md`) replaces this file whole. It is written to be replaced: the folders,
> the lanes and the approval rule are yours to change.
> **Voice: agent.** Written for the chief of staff and its lanes, to follow themselves.

This is the "chief of staff on top, a specialist per lane" shape that always-on bot teams
made fashionable, kept honest about what an Agent on this machine can do. Two facts shape
everything below:

- **A lane reads through gbrain when it is connected, and from folders the owner owns
  when it is not — and produces documents either way.** gbrain (`sops:gbrain`) is the
  house's brain: the owner's people, projects and meetings, and, once the owner has
  authorised an integration recipe, the door to mail and calendar. Where the brain reaches,
  a lane reads there first. Where it does not, what the owner drops into the project root
  is the input. What a lane writes back is a document; a draft stays a document until the
  owner sends it themselves.
- **Nothing leaves the house without the owner's yes.** A reply, a message, an invoice, a
  payment, a calendar change that other people see — every one is a `propose-and-confirm`,
  in the tile, and the owner's word in the tile is the only yes that counts.

## The office

The project root is the office. The lead makes these folders on its first day if they are
not there, and says so in the brief:

```text
<project root>/
  inbox/        what came in — exported mail, pasted messages, forwarded threads, one file each
  calendar/     the week ahead — an exported calendar, or one file per meeting
  receipts/     receipts and statements, as they arrive
  pipeline/     the ideal-customer profile (icp.md), the pipeline sheet (pipeline.md), and notes
  out/          what the lanes produced: drafts, briefs, the ledger, the report — listed on ▧ Docs
```

A lane reads only its folder and `out/`; it never reads another lane's inbox. The lead reads
everything.

## With gbrain connected

The Routine map turns gbrain on for every row; where the machine has no brain the lanes
are simply born without it and use the folders — never a refusal, the birth receipt says
so. When it is up:

- **inbox triage** reads mail through the brain's mail integration and writes the triage
  document exactly as before. It still never sends: a send is the owner's hand, or a
  `propose-and-confirm` the owner answered in the tile.
- **meeting prep** reads the calendar and, for every attendee, `search`es the brain for
  who they are and what happened last time — the brain is a memory, not a thinker: the
  synthesis is the lane's own, from search results.
- **every lane** captures what the owner would want remembered — a decision, a contact, a
  date — as a page in the brain, never a secret and never another session's unpublished
  work. Working state stays in the work record.
- **opening a new door** — a mail account, a calendar, a CRM — follows `sops:gbrain` §
  integrations to the letter: name the door, the owner authorises, then and only then the
  recipe runs. The chief of staff asks; a lane never opens a door on its own.

## The lanes

| Lane | Reads | Writes to `out/` | Macro |
|---|---|---|---|
| inbox triage | `inbox/` | `triage-<date>.md` — reply now · delegate · later · ignore, with a draft under each reply-now item | `+triage:` |
| meeting prep | `calendar/`, `out/` | `prep-<date>-<meeting>.md` — one page: who, why now, last time, open threads, three questions | `+prep:` |
| money and admin | `receipts/` | `ledger.md` kept current; `report-<month>.md` at month end; `admin.md` the recurring checklist | `+expenses:` |
| pipeline research | `pipeline/` | `pipeline.md` kept honest; `touch-<contact>.md` one draft per contact worth touching | `+prospects:` |

The lead's own output is `brief-<date>.md`: one page, from `+brief:`, every morning.

## Handoffs

- A lane hands work to another lane **through the lead**, never sideways: it names the item
  in its output under *delegate* and the lead assigns it. The wipeboard is for collisions —
  two lanes touching one thing — not for status.
- The lead reads lanes through their work records (`tejun-brief`), not by asking them. A
  lane that kept no record is reported as such in the brief, by name.
- A new lane — recruiting, bug reports, a second inbox — is staffed by the lead as a new
  specialist with its own folder and macro, on the same rules. Say what was staffed in the
  brief.

## Providers

Every row of the cast can be born on a different provider and model; that is the point of
running this shape here rather than inside one vendor's bot. As a default: triage and money
are pattern work and run well on a cheap, fast model; meeting prep and pipeline research
are judgement and deserve the strong one; the lead is the strong one. The owner sets
this on each row of the New Team form, and the letter each Agent is born with says which
it got.

## The brief

One page, every morning, in this order: what each lane finished yesterday (by document
name), what is waiting on the owner (every pending yes, as a list they can answer in one
word each), what is stuck and why, and what today's lanes will do. No narration. The owner
should be able to read it on a phone in the time the kettle takes.
