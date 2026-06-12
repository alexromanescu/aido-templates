<!-- managed:process-roadmap v=2 -->
# Roadmap Process

How aido-managed projects track work in `docs/roadmap.md`. The file is parsed by the aido app — the format below is strict; follow it exactly when editing by hand (the aido `/project/:name/roadmap` page does it for you). Phases or rows that don't match the expected shape are silently dropped from the parsed roadmap.

## File format reference

Phases use a level-2 heading with this exact shape:

```
## Phase <N>: <Name> — <STATE>
```

`<STATE>` is one of `COMPLETE`, `IN PROGRESS`, `PLANNED` — uppercase, em-dash `—` (not a hyphen `-`), and **the state token is the last thing on the line**. No trailing dates, parentheticals, or notes — the closeout date belongs in `roadmap-meta:` at the top of the file, not in the heading. Other words (`DONE`, `SHIPPED`, `WIP`, `TODO`) are not recognized.

For a phase **with rows**, `<STATE>` is now **derived from those rows by the app** (all `done` → COMPLETE, none started → PLANNED, otherwise IN PROGRESS); a task-less phase keeps the token you write. You must still write a valid `COMPLETE | IN PROGRESS | PLANNED` token — an invalid one drops the phase — but for a phase with rows the app corrects a stale token on the next save, so don't fight it.

Free-form explanatory text (paragraphs, lists, level-3 subsections like `### Outcome` or `### Background`) is permitted between a phase heading and its `### Features` table while the phase is `PLANNED` or `IN PROGRESS`. Once it reaches `COMPLETE`, move that content to `docs/roadmap-completed.md` or delete it — the active roadmap should not accumulate stale narrative.

Sections inside a phase use a level-3 heading and contain one task table:

```
### Features
| Task | Area | Size | Status | Description | Dependencies |
| ---- | ---- | ---- | ------ | ----------- | ------------ |
| Short task name | Backend | M | next | One-line description | Other task name |
```

**Column rules:**

- `Task` (required) — short, human-readable; also the identity key, so renaming is treated as a new task. Don't use pipes; escape as `\|` if you must.
- `Area` (required) — free-form tag (e.g. `Backend`, `UI`, `Infra`, `UI + Backend`). Pick a small vocabulary per project and reuse it.
- `Size` (required) — one of `S`, `M`, `L` (uppercase).
- `Status` (required) — one of `done`, `doing`, `next`, `blocked`, `planned`, `postponed` (lowercase). There is no `open` status.
- `Description` (required) — one-line summary; newlines are stripped on write.
- `Dependencies` (optional) — comma-separated task names this task depends on. Omit the column entirely from a table that has no dependencies.
- `Done` (optional) — ISO date `YYYY-MM-DD` recording when the task reached `done`. The aido UI auto-stamps this on the `*→done` transition; agents can backdate inline. Omit the column from tables where no row has a date.

**Special top-level sections** (outside any phase, level-2 headings, exact names):

- `## Quick Updates` — small ad-hoc improvements that don't belong in a phase. Same task-table shape. Lives **above** the first phase.
- `## Bugs` — open bugs, a normal task-table section, living **above** the first phase. Row name: `BUG-NNN: <title>`. See Bug lifecycle below.
- `## Distant Roadmap` — same task-table shape; long-horizon items not yet scheduled into a phase.
- `## Potential Improvements` — speculative parking lot; see lifecycle below. Lives **below** `## Distant Roadmap`.
- `## Completed Work` — a two-column summary table with headers `Phase / Feature | Summary`, one row per shipped feature (not per task).

**Continuous Improvements phase** — `## Phase 99: Continuous Improvements — COMPLETE` is a permanent always-`COMPLETE` phase at the end of the phase block, just above `## Distant Roadmap`. It is the permanent home for completed off-phase tasks; the high number keeps it pinned to the bottom of the phase list.

**`roadmap-meta` block** — an optional HTML comment at the top of the file (`<!-- roadmap-meta ... -->`) holding free-form `key: value` lines (e.g. `updated:`, closeout dates, links to master specs). Values must stay on a single line.

## Lifecycles

### Bugs

A newly-filed bug is `next`, `doing` while being fixed, `blocked` if waiting on something. When fixed, mark it `done` and **move the row (with its `Done` date) into `## Phase 99: Continuous Improvements` in the same commit that lands the fix** — the `## Bugs` section holds open bugs only. Ship every fix with a regression test where practical (see `docs/process/bugs.md` for the full bug-fix procedure).

### Deferred work

Record every deferred item in the roadmap. If a deferred item is genuinely needed for the current change to be correct and complete and isn't gated by other work, do it as part of the change; otherwise record it with a resume prompt for the next agent to pick up the work.

### Potential improvements

`## Potential Improvements` holds speculative ideas deliberately **not** acted on now — distinct from deferred work (needed, with a resume prompt) and from `## Distant Roadmap` (intended, just later). Rows default to `Status: postponed`. Each row's `Description` must state three things so a future reader can re-evaluate it: **what it may improve** (the benefit), **the cost** (use `Size` for the S/M/L estimate), and **why it wasn't done at the time**. Promote an idea by moving its row to `## Distant Roadmap` or a phase with an active status.

### Completed work

When a feature ships, move its full details to `docs/roadmap-completed.md` (if the project keeps one) and leave a one-line summary in `## Completed Work`. When a task in `## Quick Updates`, `## Bugs`, or `## Distant Roadmap` reaches `done`, move the row (with its `Done` date) into `## Phase 99: Continuous Improvements` so the active off-phase sections stay focused on pending work.
<!-- /managed:process-roadmap -->