---
section: process-doc-sync
stack: default
version: 1
target: docs/process/doc-sync.md
order: 10
---
# Documentation-Sync Process

**When you change code that a document describes, update the document in the same commit.** This file defines which documents exist, when each must be updated, and the conventions that keep them honest.

## Standard documents

aido-managed projects maintain a conventional set of docs under `docs/`. Update any that exist and that your change affects:

| File | Covers | Update when... |
|------|--------|----------------|
| `docs/architecture.md` | System structure, modules, data flow, adapters | Architectural or structural changes, new modules |
| `docs/frontend.md` | Components, routing, layouts, UI patterns, styling tokens | Any frontend structural change |
| `docs/api-reference.md` | Backend API, procedures, data shapes, auth, error codes | Any API, entity field, or auth change |
| `docs/tests.md` | Test inventory, running commands, testing conventions | Tests added/removed/changed, testing strategy changes |
| `docs/seeding.md` | Seed script, data scenarios, reset procedure | New entities, tables, or relationships |
| `docs/help.md` | Help system content and architecture | Help content or help infrastructure changes |
| `docs/devops.md` | Dev setup, topology, infrastructure, ops commands (human reference) | Setup changes, new ops commands, infra changes |
| `docs/deploy.md` | Claude-executable deploy procedure, read by the agent that deploys the app to a pre-agreed pre-production area | Deploy steps change, new pre/post-deploy checks |
| `docs/roadmap.md` | What's built, what's planned, active phases | Any feature completed, started, or reorganized (see `docs/process/roadmap.md`) |

Missing files are skipped. Projects may add their own docs (e.g. `security.md`, `meta/reflections.md`, `product/prd.md`) and should list them in the non-managed area of `CLAUDE.md` (outside any `<!-- managed:* -->` block).

## Generated inventory sections

An **inventory section** is a sentinel-delimited, generator-owned region inside an otherwise hand-written doc:

```
<!-- generated:NAME -->
...generator output — never edit by hand...
<!-- /generated:NAME -->
```

Three pieces make it trustworthy:

1. A `gen:<name>` package script that regenerates the region from the code itself.
2. A committed **parity test** that regenerates and diffs — the build fails on drift with the message "run `gen:<name>`".
3. The exemption: generated regions need **no manual sync** — when the parity test fails, run the printed command; never hand-edit inside the sentinels.

Hand-maintained inventories measurably decay at scale; recommended adoption (per project, at its own pace) for: API/procedure inventories, test inventories, module indexes. Reference implementation: q1dms `gen:api-reference` + `api-reference-parity.test.ts`.

## Optional: generated modules index

For modular backends (roughly >15 modules), a generated `docs/modules-index.md` gives agents a deterministic per-module entry point: one row per module → doc anchors (architecture/api-reference/frontend), procedure count, test globs. Build it as a generated inventory per the standard above. Optional — adopt when module count makes hand navigation unreliable.

## Routing table ("When to read what")

Projects are encouraged to keep a ~15-line routing table in the **project-owned** area of `CLAUDE.md`: one row per activity → which doc/skill to load **before starting** → what to update on the way out. aido standardizes the existence and shape, not the contents. Example shape:

```
| When you... | Read first | Update when done |
|---|---|---|
| Fix a bug | docs/process/bugs.md | tests/bugs/, roadmap Bugs row |
| Change an API procedure | docs/api-reference.md | run gen:api-reference |
| Touch the seed or schema | docs/seeding.md | seed script + docs/seeding.md |
```

## Subdirectories

When a topic has multiple standalone deep-dive docs (topic-specific docs separate from the topic's entry-point doc), group them under `docs/<topic>/`; the entry-point stays at top level. (E.g., a `docs/operations.md` entry-point with multiple `docs/operations/<runbook>.md` deep-dives below it.) Process docs like this one live under `docs/process/`.
