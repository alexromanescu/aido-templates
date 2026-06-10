# Lean Managed Blocks + docs/process Rollout — Implementation Plan

> Executed end-to-end by the rollout agent (autonomous; see `aido-templates-system-update-proposal.md` in q1dms for the full spec). This file is the decision record.

**Goal:** shrink aido-managed CLAUDE.md content from ~182 to ≤~60 lines per project by moving activity-scoped procedures into `docs/process/*.md` (new managed whole-doc sections), keeping only per-turn invariants + trigger-shaped pointers inline.

**Mechanism findings (aido dev repo, src/modules/templates):**
- Marker serialization: `<!-- managed:KEY v=N -->\n<body, trailing \n stripped>\n<!-- /managed:KEY -->` (`managed-doc-serializer.ts:13`).
- `syncSection` creates missing target files (incl. `mkdir -p`) — so managed sections targeting `docs/process/*.md` need no new machinery and no scaffolds (`sync.ts:99`).
- Drift = pure `v=N` comparison (`drift.ts:60`); a hand-applied block at the template version reads as `current`, future sync = `no_change`. Hand-applying everything is safe; expected owner checklist: empty.
- Section keys must match `^[a-z0-9-]+$` (`router.ts:19`); scaffolds + sections are discovered by folder scan.

**Version bumps:** conventions 32→33 (typo/tightening), documentation-sync 9→10, roadmap 15→16, help 3→4, seeding 1→2, testing 15→16, tests 7→8. conventions-stack unchanged (v1). New sections at v1: `process-doc-sync`, `process-roadmap`, `process-bugs`, `process-help-sync` → target `docs/process/{doc-sync,roadmap,bugs,help-sync}.md`, whole file inside the block (active-work pattern).

**Content moves:**
- documentation-sync: standard-docs table + subdirs → `process-doc-sync`; adds generated-inventory standard (sentinel + `gen:<name>` + parity test), modules-index standard, routing-table convention.
- roadmap: format reference (from roadmap-default scaffold, the most current copy) + all lifecycles → `process-roadmap`; lean block keeps the active-work session-start trigger (2 lines).
- testing: bug-fix procedure → `process-bugs` (resolves latent v15 contradiction: "delete the Bugs row" vs roadmap's "move to Phase 99" — canonical: mark done + move to Phase 99 in the fix commit); design-for-testability + delete-stale-tests + assert-on-behavior → `tests` v8 (docs/tests.md block); layer list deleted (skills own it; tiers table in tests v8 remains).
- help checklist → `process-help-sync`.
- seeding rules compressed to one inline line + pointer at docs/seeding.md.

**Scaffold changes:** roadmap-default.md format header → 2-line pointer at `docs/process/roadmap.md`; tests-default.md tail mentions the generated-inventory option; claudemd-default.md gains a "When to read what" routing-table placeholder.

**Rollout order (invariant: process docs land before/with lean blocks, per project, one commit):** q1dms → aido → mara → elmed → aido-templates (itself; also creates its missing docs/roadmap.md). Per project: write docs/process/*.md with `v=1` markers mirroring the project's block set; shrink roadmap.md header to pointer; replace managed blocks in place (script, marker-preserving); prune now-redundant project-owned lines; verify (link-check script, zero tolerance + project test gate + marker integrity); commit `aido: lean managed blocks + docs/process rollout`.

**Step 3:** fresh-agent activity simulation on q1dms (bug fix + doc-sync change) before declaring done.
