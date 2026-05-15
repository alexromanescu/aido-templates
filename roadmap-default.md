---
target: docs/roadmap.md
description: Project roadmap. Written to new projects on creation.
variables: [name, today]
init: true
---
# {{name}} — Roadmap

<!-- roadmap-meta
updated: {{today}}
-->

**File format reference** — the parser is strict about this shape; follow it exactly when editing the file by hand. The aidev `/project/:name/roadmap` page does this for you.

Phases use a level-2 heading with this exact shape:

```
## Phase <N>: <Name> — <STATE>
```

`<STATE>` is one of `COMPLETE`, `IN PROGRESS`, `PLANNED` — uppercase, em-dash `—` (not a hyphen `-`), and **the state token is the last thing on the line**. No trailing dates, parentheticals, or notes — the closeout date belongs in `roadmap-meta:` at the top of the file, not in the heading. Other words (`DONE`, `SHIPPED`, `WIP`, `TODO`) are not recognized; phases that don't match this exact shape are silently dropped from the parsed roadmap.

Free-form explanatory text (paragraphs, lists, level-3 subsections like `### Outcome` or `### Background`) is permitted between a phase heading and its `### Features` table while the phase is not yet `COMPLETE` (i.e. `PLANNED` or `IN PROGRESS`). Once it reaches `COMPLETE`, that content must be moved to `docs/roadmap-completed.md` or deleted — the active roadmap should not accumulate stale narrative.

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
- `Status` (required) — one of `done`, `doing`, `next`, `blocked`, `planned` (lowercase).
- `Description` (required) — one-line summary; newlines are stripped on write.
- `Dependencies` (optional) — comma-separated task names this task depends on. The column may be omitted entirely from a table that has no dependencies.

**Special top-level sections** (outside any phase, level-2 headings, exact names):

- `## Distant Roadmap` — same task-table shape as a phase section; holds long-horizon items not yet scheduled into a phase.
- `## Completed Work` — a two-column summary table with headers `Phase / Feature | Summary`, one row per shipped feature (not per task).

The `roadmap-meta` block above is optional; use it for free-form `key: value` lines (e.g. `updated:`). Values must stay on a single line.

## Distant Roadmap
| Task | Area | Size | Status | Description |
|------|------|------|--------|-------------|

## Completed Work
| Phase / Feature | Summary |
|----------------|---------|
