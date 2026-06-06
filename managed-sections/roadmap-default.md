---
section: roadmap
stack: default
version: 14
target: CLAUDE.md
order: 40
---
## Roadmap

**Update `docs/roadmap.md` whenever work completes, starts, or is reorganized.** The format reference lives at the top of `docs/roadmap.md`; follow it when editing by hand.

### Cross-session continuity

If `docs/active-work.md` exists, read it at the start of a session — it's the project's agent-agnostic re-entry point for multi-session work: the current goal / north-star, what last shipped, the sequence, and a copy-paste resume prompt. If you advance that work, refresh it on the way out — rewrite it as a fresh one-screen snapshot (never append; git is the history).

### Deferred work

Record every deferred item in the roadmap. If a deferred item is genuinely needed for the current change to be correct and complete and isn't gated by other work, do it as part of the change; otherwise leave it recorded here with a resume prompt for the next agent to pick up the work.

### Bugs

`docs/roadmap.md`'s `## Bugs` is a **normal task-table section** — no special handling. Name the row `BUG-NNN: <title>` and use the standard statuses: a newly-filed bug is `next`, `doing` while it's being fixed, `blocked` if waiting on something. There is **no `open` status**. When fixed, mark it `done` and move it into the Continuous Improvements phase like any other off-phase done task; ship the fix with a regression test at `tests/bugs/bug-NNN-*.test.ts` where practical.

### Potential Improvements

`docs/roadmap.md`'s `## Potential Improvements` section is a parking lot for speculative ideas we are deliberately **not** acting on now — distinct from deferred work (needed, with a resume prompt) and from `## Distant Roadmap` (which we do intend to do, just later). Rows default to `Status: postponed`. When you add one, the `Description` must state three things so a future reader can re-evaluate it: **what it may improve** (the benefit), **the cost** (use `Size` for the S/M/L estimate), and **why it wasn't done at the time**. Promote an idea by moving its row to `## Distant Roadmap` or a phase with an active status.

### Completed work

When a feature ships, move its full details to `docs/roadmap-completed.md` (if the project keeps one) and leave a one-line summary in `docs/roadmap.md`'s `## Completed Work` table.

### Continuous Improvements

The `## Phase 99: Continuous Improvements — COMPLETE` phase is the permanent home for completed off-phase tasks. When a task in `## Quick Updates`, `## Bugs`, or `## Distant Roadmap` reaches `done`, move the row (with its `Done` date) into this phase. This keeps the active off-phase sections focused on pending work.
