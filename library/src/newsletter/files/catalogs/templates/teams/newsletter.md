# Ship the Newsletter
- **label:** Ship the Newsletter
- **art:** 📰
- **blurb:** One issue, from the list of what happened to the sent email.
- **order:** 55
- **kinds:** work, social
- **objective:** Ship one issue of the newsletter: decide what goes in, write it in the house style, check every claim, and send it on the day.
- **behaviours:** sops:newsletter_style
- **routines_off:** ronin_worktrees

## agents

### editor
- **team_lead:** yes
- **instructions:** Decide what goes in this issue and in what order, keep the writer to the style guide, and hold the send until the checker has signed off every claim.
- **mandate:** execute · staff agents · an artifact

### writer
- **instructions:** Write the issue from the editor's list, in the house style — short, concrete, one idea per item.
- **mandate:** execute · nobody · an artifact

### fact checker
- **instructions:** Check every claim, number, name and link in the draft against its source; mark each one confirmed or not, and say what would confirm it.
- **mandate:** execute · nobody · an artifact

### sender
- **instructions:** Prepare the send: subject line, preview text, the list, the test send to the owner, and the scheduled time. Send only when the editor says so.
- **mandate:** execute · nobody · an artifact
