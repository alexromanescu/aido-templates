---
section: active-work
stack: default
version: 5
target: docs/active-work.md
order: 10
---
# Active Work

_Cross-session re-entry point: any agent reads this to pick up the current focus mid-stream. **This guidance block is permanent; the live focus is everything written below it.** While a focus is active, keep it a fresh one-screen snapshot — rewrite it, never append (git is the history). **When the focus is fully done with nothing left to carry over, delete everything below this block** and record what shipped in `docs/roadmap.md` / `roadmap-completed.md`. The block-only state (no focus below) is the signal that the project is free to compose a new focus from the roadmap — so never leave a "done" note as the focus, and never clear a focus just because work iterated across several sessions: if anything remains, keep it here, rewritten to what's left._

_**This file is the forward cursor, not a history tracker.** It is loaded by every future session, so every byte here is a recurring token tax. Carry only what future execution needs; postmortems, changelogs, and lesson essays live in the plan/program doc, the roadmap, and git — pointed to, never copied here._

**A good focus, written below, covers (in roughly this order — not every slot every time):**

- **Goal (north star)** — the durable outcome this batch drives toward.
- **Guardrails / quality bar** — any standing owner directive for this batch (the quality bar, scope limits). Pin it first; it governs every session and survives each rewrite.
- **Last shipped** — what landed and was verified this block: simple, high level and related to the tasks that were given - no changelogs.
- **Sequence** — the ordered path to the goal; strike done steps in place, flag the next; cite roadmap rows / `BUG-NNN` ids rather than copying them. **Keep each item's `(S)/(M)/(L)` size marker** — aido sums them for the engagement budget, so a rewrite that drops them silently under-budgets the work (it falls back to a single L). **A struck item keeps at most one short outcome clause plus a pointer** (decision-log entry, roadmap row, or commit) — the full postmortem goes to the plan/program doc or the roadmap row, never onto the struck line.
- **Cross-cutting bar** — constraints that apply to *every* step (e.g. design, i18n, tests, a11y); state them once here instead of per step.
- **Run it** — the exact commands to launch and test the app against this focus, so any session verifies without rediscovering them.
- **Next-session prompt** — copy-paste resume: re-establish ground truth (branch, status, tests) → which roadmap rows → which deferred items / bugs to fold in → which skill/approach to open with → where to start.
- **Key references** — the few docs / specs an agent needs for this focus.
- **Never relegate an unfinished part of the active item to Distant Roadmap / Potential Improvements.** A partially-done item is rewritten to show what shipped and keeps the unfinished part as the next step — it is not marked done.
_A small focus may be just Goal + Sequence + Next-session prompt. A trivial quick-fix may legitimately leave the focus untouched; that's expected, not a bug._
