# Workbench media privacy and QA matrix

Status: fail-closed review checklist for every proposed still, poster, and motion frame.

Record `PASS`, `FAIL`, or `N/A` with evidence for every row. Any unexplained `N/A`, any
`FAIL`, or any blank row blocks asset handoff. Review decoded exports and their metadata,
not only the capture page.

## Privacy and provenance

| Check | Pass condition | Evidence to record |
|---|---|---|
| Seed provenance | Every visible value resolves to the reviewed `paper-garden` fixture. | fixture version and source checksum |
| Sessions | Only `claude-demo` and `codex-demo` appear; no live session was captured. | full-frame text inventory |
| Projects and paths | Only `paper-garden` and the three approved relative filenames appear; no absolute path, username, home marker, repository name, or remote appears. | OCR plus manual inspection |
| Host and network | No hostname, IP address, URL with private parameters, port, browser chrome, Wi-Fi detail, or machine identifier appears. | full-frame inspection |
| Identity and accounts | No real name, email, avatar, provider account, organization, billing detail, or sign-in state appears. | full-frame inspection |
| Secrets | No token, credential, cookie, authorization header, environment value, QR code, or secret-shaped string appears. | OCR/secret scan plus manual inspection |
| Prompts and history | Only approved synthetic task/result text appears; no shell history, scrollback, clipboard, notification, or real prompt appears. | visible-string diff against fixture |
| Metadata | EXIF/XMP/comments and filenames reveal no person, machine, path, application history, or account. | metadata-tool output and filename review |
| Motion frames | Every decoded frame independently passes all privacy rows; poster-only review is insufficient. | frame count, contact sheet, reviewer record |
| Source chain | Export checksum maps to one reviewed source record and capture settings. | SHA-256 manifest |

## Truth and visual meaning

| Check | Pass condition | Evidence to record |
|---|---|---|
| Current implementation | Capture uses the canonical current Workbench, not a stale route or visual mockup. | source commit and route |
| Base boundary | No Services-only work record, recording, Stats, Voice, gbrain, or house-agent capability is visible or implied. | capability inventory |
| Provider distinction | Claude and Codex are plainly labeled and occupy separate workspaces. | desktop and narrow review |
| Still evidence boundary | The still claims only visible coexistence/layout: two labeled providers, two numbered workspaces, one current Workbench frame. | claim review |
| Independence/non-mutation | Any such claim is supported by current tested contract evidence or an approved motion sequence; the still alone is not cited. | test reference and/or motion review |
| Account/reasoning boundary | Any such statement appears only in explainer text with a named authority; no media is cited as proof. | copy and authority review |
| Still-first meaning | The poster/still communicates the essential point with motion disabled. | reviewer sentence describing the scene |
| Vocabulary | Public-facing words agree with current KOTOBA/glossary; no house-only term leaks. | vocabulary review date and authority commit |
| Claim boundary | Caption, alt text, transcript, and adjacent copy claim only what the visual proves. | copy diff and claim owner |

## Accessibility and responsive rendering

| Check | Pass condition | Evidence to record |
|---|---|---|
| Alt text | Meaningful, concise, no “image of,” and provider/workspace relationship is available without pixels. | final alt text |
| Adjacent route | A visible text link offers the same destination as the linked image. | rendered link and target |
| Images off | Surrounding text still answers the question and exposes the destination. | screenshot or DOM record |
| Reduced motion | Site honors `prefers-reduced-motion`; essential meaning remains in the poster/still. | computed behavior |
| Transcript/captions | Approved motion has a transcript; audio, if ever added, also has captions. | transcript/caption path |
| Keyboard | Media link and controls are reachable, ordered, visible on focus, and operable. | tab-order record |
| Screen reader structure | Figure/media naming, link purpose, heading order, and landmarks are unambiguous. | accessibility tree or audit |
| Narrow layout | At 390 × 844 labels and both workspace relationships remain legible without horizontal page scrolling. | narrow render |
| Zoom | Essential page content and media route survive 200% browser zoom. | zoom render |

## Route, performance, and file integrity

| Check | Pass condition | Evidence to record |
|---|---|---|
| Production destination | Image and adjacent link resolve to the same approved production explainer; no Lab or preview URL. | final resolved URLs |
| Route continuation | Explainer has one useful next action; Agent docs do not require the site. | route walk |
| GitHub rendering | Default-branch README works signed out at desktop/narrow widths with images on and off. | rendered checks |
| Direct site route | Explainer works from a direct URL without JavaScript for essential content. | no-JS route check |
| Redirects | Any moved published URL has a permanent redirect; new URL spelling matches the owner ruling. | redirect response |
| Byte budget | Each export is at or below the budget in `SEEDED_DEMO.md`. | byte count |
| Dimensions | Decoded dimensions match the approved export target; no accidental upscale. | media probe |
| Decode | File decodes without warning in target browsers and media tools. | browser/tool results |
| Checksum | SHA-256 matches the reproduction record and the paired README/site source id. | checksum comparison |
| Slow path | README still appears promptly on a throttled connection; motion is not required for first meaning. | throttled-load record |
| Links | Image, adjacent text, index, related-next, Agent-doc, and Load Ronin links return the intended public pages. | link audit |

## Review record template

```text
asset/source id:
source commit:
fixture version:
export path:
sha256:
dimensions / bytes:
reviewed at (UTC):
privacy reviewer:
claim/vocabulary reviewer:
accessibility/route reviewer:
motion frame count (if any):
result: PASS | FAIL
failures handed to:
wipeboard post reference:
```
