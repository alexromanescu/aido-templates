---
section: process-roadmap
stack: default
version: 9
target: docs/process/roadmap.md
order: 10
---
# Roadmap Process

`docs/roadmap.md` is parsed by the aido app. The format below is strict: phases or rows that do not match are silently dropped. The aido `/project/:name/roadmap` page follows it for you; follow it exactly when editing by hand.

## Format

Phase heading, level 2, exact shape:

```
## Phase <N>: <Name> — <STATE>
```

`<STATE>` is `COMPLETE`, `IN PROGRESS`, or `PLANNED`: uppercase, em-dash `—`, and the last thing on the line. No dates or notes in the heading; closeout dates go in `roadmap-meta`. For a phase with rows the app derives the state from the rows and corrects a stale token on save; you must still write a valid one. Free-form text and level-3 subsections may sit between the heading and the task table while the phase is open.

Each phase holds one or more level-3 sections, each with one task table:

```
### Features
| Task | Area | Size | Status | Description | Dependencies |
| ---- | ---- | ---- | ------ | ----------- | ------------ |
| Short task name | Backend | M | next | One-line description | Other task name |
```

- `Task` (required): short, human-readable, and the identity key, so renaming creates a new task. Escape pipes as `\|`.
- `Area` (required): free-form tag; keep a small vocabulary per project.
- `Size` (required): `S`, `M`, or `L`.
- `Status` (required): `done`, `doing`, `next`, `blocked`, `planned`, or `postponed`. There is no `open`.
- `Description` (required): one line; newlines are stripped.
- `Dependencies` (optional): comma-separated task names. Omit the column when no row uses it.
- `Done` (optional): ISO date `YYYY-MM-DD` set when a row reaches `done`; the UI stamps it, agents may backdate inline. Omit the column when no row has a date.

Top-level sections outside any phase, level 2, exact names, in this order: `## Quick Updates` and `## Bugs` above the first phase (task tables; bug rows are named `BUG-NNN: <title>`); `## Phase 99: Continuous Improvements — COMPLETE` as the permanent last phase; then `## Distant Roadmap` (task table, unscheduled intended work); `## Potential Improvements` (task table, speculative parking lot); `## Completed Work` (two columns, `Phase / Feature | Summary`, one row per shipped feature). An optional `<!-- roadmap-meta ... -->` comment at the top holds single-line `key: value` entries such as `updated:`.

## Lifecycles

- **Open work only.** When a phase reaches `COMPLETE`, move the whole phase (heading, narrative, tables) to `docs/roadmap-completed.md` in the same commit, creating the file if missing, and leave one `Phase N: <name>` row with a one-line summary in `## Completed Work`. Archive any `COMPLETE` phase you find inline. Never reuse an archived phase number; `## Completed Work` and `roadmap-completed.md` are the registry. A feature that ships before its phase completes gets the same treatment: details to `roadmap-completed.md`, one summary row in `## Completed Work`. A dependency on a task in an archived phase counts as satisfied. Phase 99 is never archived.
- **Off-phase completions.** When a row in `## Quick Updates`, `## Bugs`, or `## Distant Roadmap` reaches `done`, move it with its `Done` date into Phase 99 in the same commit as the work. A bug is `next` when filed, `doing` while fixed, `blocked` while waiting; it ships with a regression test.
- **Deferring is not finishing.** Work needed for the agreed outcome is done now when it can be; if a real dependency or missing authorization blocks it, record the blocker and next action here and keep it visible in the active focus. Record unrelated findings as separate rows without expanding the assignment.
- **Potential Improvements** holds ideas deliberately not acted on now, default `Status: postponed`, never required work. Each `Description` states the benefit, the honest impact (who, how often, correctness versus polish), the cost, and why it waited. Promote by moving the row to `## Distant Roadmap` or a phase.
