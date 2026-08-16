<!-- managed:active-work v=12 -->
# Active Work

_Cross-session re-entry point: any agent reads this to pick up the current focus mid-stream. **This guidance block is permanent; the live focus is everything written below it.** Keep the focus within one screen (~80 lines) — rewrite it, never append (git is the history). **When the focus is fully done with nothing left to carry over, delete everything below this block** and record what shipped in `docs/roadmap.md` / `roadmap-completed.md`. Block-only (no focus below) is the signal that the project is free to compose a new focus from the roadmap — so never leave a "done" note as the focus, and never clear one while anything remains: rewrite it to what's left._

_**This file is the forward cursor, not a history tracker.** It is reloaded every session — every byte is a recurring token tax. Carry only what future execution needs; postmortems, changelogs, and lessons live in the plan/program doc, the roadmap, and git — pointed to, never copied here. A rule or warning that recurs across sessions moves to the reference doc it belongs to — the subsystem map first, where the project keeps one (see `docs/process/doc-sync.md`) — or better, becomes a machine check: a gate test costs a session zero reading and cannot be skimmed past. A focus outgrowing its screen is restructured, not extended; an oversized focus is a real failure mode, not a style issue — tooling has silently truncated one._

**A good focus, written below, covers (roughly this order — not every slot every time):**

- **Goal (north star)** — the durable outcome this batch drives toward.
- **Guardrails / quality bar** — standing owner directives for this batch (quality bar, scope limits). Pin first; they govern every session and survive each rewrite.
- **Last shipped** — what landed and was verified this block: high level, and related to the tasks that were given.
- **Sequence** — the ordered path to the goal, one **slice** per item: as much related work as one session can take to done (group by shared context and files; split where the context a session builds stops paying off). Strike done slices in place, flag the next; cite roadmap rows / `BUG-NNN` ids rather than copying them. **Keep each item's `(S)/(M)/(L)` size marker** — aido sums them for the engagement budget, so a rewrite that drops them silently under-budgets the work. A long sequence stays one line per slice (id + size) — the detail moves to the plan/program doc, the sized line never does. **A struck item keeps at most one short outcome clause plus a pointer** (decision-log entry, roadmap row, or commit) — the full postmortem goes to the plan/program doc or the roadmap row, never onto the struck line.
- **A slice is one assignment.** The session that picks it up runs it end-to-end to done — verified, reviewed, and merged per the project's conventions — then refreshes this file and reports once. Steps inside a slice are waypoints, not report points.
- **Cross-cutting bar** — constraints that apply to *every* step (design, i18n, tests, a11y); state them once here instead of per step.
- **Run it** — the exact commands to launch and test the app against this focus, so any session verifies without rediscovering them.
- **Resume prompt** — copy-paste resume: re-establish ground truth (branch, status, tests) → which roadmap rows → which deferred items / bugs to fold in → which skill/approach to open with → where to start. (Writing it is not an exit.)
- **Key references** — the few docs / specs an agent needs for this focus; the subsystem map first, where one exists.
- **Never relegate an unfinished part of the active item to Distant Roadmap / Potential Improvements.** A partially-done item is rewritten to show what shipped and keeps the unfinished part as the next step — it is not marked done.

_A small focus may be just Goal + Sequence + Resume prompt. A trivial quick-fix may legitimately leave the focus untouched; that's expected, not a bug._
<!-- /managed:active-work -->