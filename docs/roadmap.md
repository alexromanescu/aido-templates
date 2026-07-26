# aido-templates — Roadmap

<!-- roadmap-meta
updated: 2026-07-26
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
| Claude 5 template slimming | Templates | M | done | Cut 4.x-era anti-laziness/verification prodding that backfires on Claude 5 models (per Anthropic migration guidance): conventions v42 (scope bullet now guards both under- and over-delivery, harness-duplicate bullet deleted, done+report bullets merged, deferred-work sweep removed, typos), testing v17 (absolutism softened, aligned with process-bugs escape), conventions-stack-node v2 (ecosystem defaults cut, 8→4 bullets), worker-system (war story cut, red-check scoped to bug fixes/load-bearing, sections compressed, new 3-line finish-your-turns guard against mid-task stopping), teamlead-core (red-demonstration dropped, marker/divergence/roadmap-hygiene sections compressed), residuals-review skill (13-row excuse table + duplicate termination section → single 4-line termination contract). Net −82 lines (160 deleted, 78 added — additions are the compressed rewrites plus the 3-line guard). | 2026-07-25 |
| Claude 5 residuals + cross-project CLAUDE.md sweep | Templates | S | done | Post-slimming residuals per the Opus 5 / Fable 5 migration guidance: testing v18 (subagent-gate bullet made literal, "is mandatory" dropped), conventions v43 (harness-duplicate "re-read before editing" clause cut); stale `~/Apps/aido/templates` editing-flow path in this repo's CLAUDE.md corrected. v43/v18 hand-propagated byte-identical to aido, mara, q1dms, q1erp (verified, zero drift). Same sweep delivered unmanaged-section cleanups outside this repo: q1dms (bug post-mortem lore trimmed to rules), hn (Komodo secret externalized to `~/.config/komodo/claude.env`, resolved-incident stories relocated to learnings), cliplus (init-era doc compressed + conventions block adopted), aido-ops (hand-forked conventions replaced with managed conventions + conventions-stack blocks). | 2026-07-26 |
| Managed-block harmonization pass | Templates | S | done | Opus 5 re-read of the in-use blocks: testing v20 ("real surface" pinned to the tier that fits the change per `docs/tests.md`, explicitly not necessarily E2E — the prior wording pulled agents toward E2E on trivial changes, contradicting the tests.md tier table), conventions v45 (the `'Checkpoint' = commit and continue` rule now states that it overrides the harness default to commit only when asked). Then conventions v46 (worktree rule now states it is a standing owner instruction that holds even when a harness/launcher configured the session to work in place — a background job with `bgIsolation: none` otherwise reads "work in place" and lands dev work on the default branch; "main" generalized to "the repo's default branch"; already-isolated agents explicitly stay put) and active-work v6 (markdown bug fix: no blank line before the closing italic meant it rendered inside the "Never relegate" bullet; plus verbosity trims, −6%. Deeper compression was drafted and rejected — it saved only 14% while cutting two clauses that carry unique meaning). | 2026-07-26 |
| Post-superpowers gap fill | Templates | S | done | Superpowers plugin evaluated against the Claude 5 runcards and retired (autonomy conflicts, unrequested commits, SDD token overhead, 4.x-era pressure prompting); the three gaps it left filled: new `debugging` skill (root-cause-first, one hypothesis at a time, boundary instrumentation, three-failed-fixes escalation), testing v19 (a new test must be seen to fail — write-first or revert-check), conventions v44 (verify review feedback against the codebase before implementing). Skill installed to `~/.claude/skills/debugging/`; v19/v44 to propagate to consuming projects via drift. | 2026-07-26 |

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
