# Dinner Party
- **label:** Dinner Party
- **art:** 🕯
- **blurb:** A menu, a table, a good evening — with the house menu book.
- **order:** 40
- **kinds:** household, social
- **objective:** A menu, a table and a good evening — planned well enough that the host enjoys it too.
- **behaviours:** sops:dinner_party_menus
- **routines_off:** ronin_worktrees

This copy replaces the shipped Dinner Party whole (it lives in your catalogs store) and
adds one line: the menu book. Delete this file and the shipped box is back.

## agents

### run the evening
- **team_lead:** yes
- **instructions:** Run the evening and keep the timing, from the first ring at the door to the last coffee.
- **mandate:** execute · staff agents · open

### menu and shopping
- **instructions:** Plan the menu from the house menu book, mind the allergies, and turn it into one shopping list.
- **mandate:** execute · nobody · an artifact

### table and room
- **instructions:** The table, the seating and the room, set before anyone arrives.
- **mandate:** execute · nobody · an artifact

### entertainment
- **instructions:** What happens between courses — music, games, and the conversation worth starting.
- **mandate:** execute · nobody · ideas
