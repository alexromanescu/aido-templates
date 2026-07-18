---
name: program-prep
description: Use when an owner hands over a roadmap, a task list, or a large feature/program and wants it prepared for slice-by-slice execution across independent sessions (different agents, no shared memory) — before any spec, plan, or code is written. Also use when asked to "set up active-work", "slice this up", or "prepare this so sessions/a teamlead can run it".
---

# Program Prep

## Overview

Turn scope into a sliced program carried entirely by repo files, so any future session — human-launched or launched by an orchestrator/teamlead — executes the next slice with high autonomy and consistent architecture. **The contract is files, not chat**; if a session dies, the only loss is its unmerged tail.

## When NOT to use

- A single small task → just do it.
- An active focus already mid-flight → don't re-prep; advance it.

## The artifact contract (one job per file — never duplicate across them)

| Artifact | Its ONLY job |
|---|---|
| North-star doc (only for program scale w/ deferred horizons) | Cross-slice **seam contracts** — the interfaces later programs plug into, so slices can't drift the architecture |
| Program doc | Append-only **decision log** + one **brief per slice** |
| `active-work.md` focus (or the project's equivalent cursor) | Where we are: goal, guardrails, sequence w/ S/M/L sizes, run-it commands, a blockers line, next-session prompt |
| Roadmap rows | Slice status, in the project's tracker format (read its process doc first) |

## Brief anatomy (the heart of the prep)

One brief per slice, **constraint-level, not design-level**:
- **Direction** — the approach in 2–4 bullets, citing the seam it serves.
- **Hard constraints** — mechanism-level invariants ("no progress-tick commit ever reaches the audited tree", "byte-parity: existing goldens must not move"), each verifiable.
- **Pitfalls + YAGNI line** — what tempts overbuild; where the slice stops.
- **Done when** — observable exit criteria incl. the test layers.

**The JIT rule:** briefs are written up-front because constraints are stable; **specs and plans are NOT pre-written** — each slice session writes its own against the *current* code, because every slice reshapes the ground the next one specs against. State this rule inside the program doc so slice sessions see it.

**The ground-truth rule:** never pre-decide implementation choices (libraries, data-model mechanics, thresholds) the slice session can only validate against real code. Pin the invariant; leave the mechanism to the slice. If prep is tempted to write "the first session must confirm this guess" — delete the guess, write the constraint.

## Structure the sequence

- Dependency-ordered; foundational/design-language slices first (later surfaces built once, in the final language); the riskiest cross-cutting slice **last** and checkpointed.
- Every sequence item is one executable slice with a size marker — no opaque "Phase N (5 tasks)" lines.
- Owner touchpoints: only direction picks, scope changes, irreversibles. List them explicitly; everything else is decided and logged.

## Review layers (encode conditionally, by what's available)

1. **In-slice adversarial/whole-branch review** — always; the slice session's own gate before merge.
2. **Scheduled specialist acceptance reviews** — an independent specialist reviews against the briefs at 2–4 milestones plus program end, but only when one is available. These reviews are not the project's ordinary checkpoint/commit rule. If no specialist is available, say so in guardrails and lean on layer 1 plus owner spot-checks. Add a **"Blockers for <specialist>"** line to the focus either way: a design-level surprise mid-slice is logged and routed around, never improvised.
3. **Teamlead/orchestrator supervision** (if one runs the sessions) — process only: flow followed, docs updated, budget; never code or direction.

Specialist reviews append findings to the decision log and refresh remaining briefs against what actually shipped.

## Process

1. Ground truth: read the project's cursor/roadmap/process docs; survey what exists (delegate a codebase inventory if large).
2. Decompose into slices; get the owner's touchpoint decisions (direction/scope) — nothing else.
3. Write the artifacts per the contract above; commit.
4. End state: the cursor's next-session prompt says exactly: *read your slice's brief first, then brainstorm → spec → plan (independent tasks, each with test scenario + verification command) → execute → verify → tick roadmap, rewrite cursor, append decisions to the log.*

## Common mistakes

| Mistake | Fix |
|---|---|
| One monolithic architecture spec, no per-slice briefs | Split: seams → north-star; per-slice direction/constraints/done-when → briefs |
| Pre-deciding mechanisms without ground truth ("session 1 must confirm") | Write the constraint, not the guess |
| Pre-writing all specs/plans | JIT rule — briefs only |
| No decision log | Owner delegation only works if decisions are findable; append-only log in the program doc |
| Cursor duplicates program-doc content | One job per file; the cursor cites, never copies |
| Phase-level opaque sequence lines | One line per executable slice, sized |
| No review structure | Encode the three layers, conditionally on availability |
