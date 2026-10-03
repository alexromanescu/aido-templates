---
name: program-prep
description: Use when asked to prepare a roadmap or large program for execution across independent sessions, "set up active-work", or "slice this up". Produces sized slices, a brief per slice, a decision log, and the active-work cursor. Not for a small task or continuing an already prepared focus.
---

# Program Prep

## Overview

Prepare bounded assignments and durable references so independent sessions can continue without reconstructing decisions from chat. Reuse existing project documents; create only what the program needs.

## The artifact contract (one job per file — never duplicate across them)

| Artifact | Its one job |
|---|---|
| North-star doc (only for program scale w/ deferred horizons) | Cross-slice **seam contracts** — the interfaces later programs plug into, so slices can't drift the architecture |
| Program doc | Append-only **decision log** + one **brief per slice** |
| `active-work.md` focus (or the project's equivalent cursor) | Where we are: goal, guardrails, sequence w/ S/M/L sizes, run-it commands, a blockers line, resume prompt |
| Roadmap rows | Slice status, in the project's tracker format (read its process doc first) |

When the program works one subsystem, durable *as-built* boundary knowledge lands in that subsystem's **map** (its entry-point doc, where the project keeps one) — the decision log records deltas, the map holds current state; forward-looking cross-slice seam contracts stay in the north-star doc.

## Brief anatomy (the heart of the prep)

One brief per slice, **constraint-level, not design-level**:
- **Direction** — the approach in 2–4 bullets, citing the seam it serves.
- **Hard constraints** — mechanism-level invariants ("no progress-tick commit ever reaches the audited tree", "byte-parity: existing goldens must not move"), each verifiable.
- **Pitfalls + YAGNI line** — what tempts overbuild; where the slice stops.
- **Done when** — observable exit criteria incl. the test layers.

Write briefs against known constraints. Leave implementation planning to the executing session against current code, and require a separate spec or plan only when complexity or unresolved decisions warrant it. Do not prescribe a brainstorm/spec/plan sequence for every slice.

**The ground-truth rule:** never pre-decide implementation choices (libraries, data-model mechanics, thresholds) the slice session can only validate against real code. Pin the invariant; leave the mechanism to the slice. If prep is tempted to write "the first session must confirm this guess" — delete the guess, write the constraint.

## Structure the sequence

- Order by dependencies and uncertainty. Resolve consequential unknowns early enough to inform dependent work; do not automatically leave the riskiest slice until last.
- Every sequence item is one executable slice with a size marker. Group related work a session can implement, verify, and finish; split when shared context no longer helps or the change outgrows one review.
- Owner touchpoints: only direction picks, scope changes, irreversibles. List them explicitly; everything else is decided and logged.

**Say what each slice needs in prose.** Where aido runs the program, the
teamlead picks the runtime for each dispatch from what is installed on the
machine that runs it. Write the slice's need as a short em-dash clause on the
slice's own line in the cursor, such as "— mechanical, keep it cheap" or
"— deserves the deepest reasoning on offer", and put engagement-wide
preferences in `## Guardrails`. The teamlead reads those two places before
dispatch; brief bodies reach only the assignee, after dispatch, so repeat a hint
there only as a copy. Describe the need in words rather than naming a model or a
reasoning setting, which may not exist on the machine that runs the slice, or
inventing a tag or marker key, which nothing reads. aido's contract is
`docs/programs.md`, section "Per-slice runtime intent is prose, never a tag".

## Machine-legible sequence (when aido runs the program)

Where the project runs its programs through aido, the cursor is parsed as well as read, and launch refuses a cursor that misses these minimums:

- exactly one `## Goal` section and exactly one `## Guardrails` section;
- every sequence item annotated with an `<!-- aido:work-item … -->` marker on the same line as the item, and every brief bound with an `<!-- aido:brief … -->` marker;
- a unique `workItemId` per item and a `briefRef` that resolves to one bound brief;
- exactly one `(S|M|L)` size marker per item;
- at least one completion gate, declared on a visible `Checkpoint <n>` item.

Read [references/aido-cursor.md](references/aido-cursor.md) before writing or editing an aido cursor; it holds the full marker rules and a worked example.

## Review and completion

Use the project's review gate for each slice; do not add another review layer automatically. For aido Program execution, preserve the required completion checkpoint described above and follow the runtime's specialist dispatch and outcome contract. Additional milestone checks need a program-specific reason.

Include the verification needed to establish that the whole program meets its briefs. The agent performs acceptance checks; do not make the user the tester. Record findings in the decision log and complete required fixes before declaring the program complete. Where review capabilities are unavailable, record the limitation and use the strongest available verification consistent with the project's required gates.

## Process

1. Read the current cursor, roadmap, and relevant project docs; inspect the existing implementation.
2. Decompose into slices; get the owner's touchpoint decisions (direction/scope) — nothing else.
3. Write the artifacts per the contract above; commit.
4. Leave a concrete next action and the references needed to execute it. The next session should complete the assigned slice, not restart program preparation.

## Common mistakes

| Mistake | Fix |
|---|---|
| One monolithic architecture spec, no per-slice briefs | Split: seams → north-star; per-slice direction/constraints/done-when → briefs |
| Pre-deciding mechanisms without ground truth ("session 1 must confirm") | Write the constraint, not the guess |
| Pre-writing all specs/plans | JIT rule — briefs only |
| No decision log | Owner delegation only works if decisions are findable; append-only log in the program doc |
| Cursor duplicates program-doc content | One job per file; the cursor cites, never copies |
| Phase-level opaque sequence lines | One line per executable slice, sized |
| No completion evidence | Define acceptance checks and required project/runtime review gates |
| Unannotated sequence | aido refuses to launch it; annotate every item, keep identities valid and known, and declare at least one completion gate |
