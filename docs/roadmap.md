# aido-templates — Roadmap

<!-- roadmap-meta
updated: 2026-06-10
-->

**Format reference:** this file is parsed by the aido app — the exact phase-heading shape, task-table columns, statuses, and section lifecycles are defined in [docs/process/roadmap.md](process/roadmap.md). Read it before editing this file by hand; the aido `/project/:name/roadmap` page follows it for you.

## Quick Updates
| Task | Area | Size | Status | Description |
|------|------|------|--------|-------------|

## Bugs
| Task | Area | Size | Status | Description |
|------|------|------|--------|-------------|

## Phase 99: Continuous Improvements — COMPLETE

### Features
| Task | Area | Size | Status | Description | Done |
|------|------|------|--------|-------------|------|
| Lean managed blocks + docs/process rollout | Templates | L | done | CLAUDE.md managed content cut from ~182 to ≤55 body lines per project: per-turn invariants + trigger-shaped pointers inline; procedures moved to new `process-*` whole-doc managed sections (`docs/process/{doc-sync,roadmap,bugs,help-sync}.md`). Generated-inventory + routing-table standards added to the doc-sync process doc. Rolled out and verified across q1dms, aido, mara, elmed, and this repo. | 2026-06-10 |

## Distant Roadmap
| Task | Area | Size | Status | Description |
|------|------|------|--------|-------------|

## Potential Improvements
| Task | Area | Size | Status | Description |
|------|------|------|--------|-------------|
| syncAll section gating per project | Templates | M | postponed | May improve: `syncAll` currently offers every section to every project (drift shows "missing" for blocks a project deliberately lacks, e.g. aido-templates without `testing`); a per-project section allow-list would make "missing" meaningful and prevent an accidental full-sync from injecting `help`/`seeding` into docs-only repos. Cost: M (schema or per-project config + UI). Not done now: out of scope for the 2026-06-10 lean-blocks rollout, which only touched content, not sync machinery. |

## Completed Work
| Phase / Feature | Summary |
|----------------|---------|
| Lean managed blocks + docs/process rollout (2026-06-10) | Managed CLAUDE.md diet across all aido-managed projects; process-* section family introduced. |
