---
name: program-prep
description: Use when an owner hands over a roadmap, a task list, or a large feature/program and wants it prepared for slice-by-slice execution across independent sessions (different agents, no shared memory) — before any spec, plan, or code is written. Also use when asked to "set up active-work", "slice this up", or "prepare this so sessions/a teamlead can run it". Not for a single small task (just do it) or an already-mid-flight focus (advance it, don't re-prep).
---

# Program Prep

## Overview

Turn scope into a sliced program carried entirely by repo files, so any future session — human-launched or launched by an orchestrator/teamlead — executes the next slice with high autonomy and consistent architecture. **The contract is files, not chat**; if a session dies, the only loss is its unmerged tail.

## The artifact contract (one job per file — never duplicate across them)

| Artifact | Its ONLY job |
|---|---|
| North-star doc (only for program scale w/ deferred horizons) | Cross-slice **seam contracts** — the interfaces later programs plug into, so slices can't drift the architecture |
| Program doc | Append-only **decision log** + one **brief per slice** |
| `active-work.md` focus (or the project's equivalent cursor) | Where we are: goal, guardrails, sequence w/ S/M/L sizes, run-it commands, a blockers line, resume prompt |
| Roadmap rows | Slice status, in the project's tracker format (read its process doc first) |

When the program works one subsystem, durable *as-built* boundary knowledge lands in that subsystem's **map** (its entry-point doc, per the project's doc-sync process where it keeps one) — the decision log records deltas, the map holds current state; forward-looking cross-slice seam contracts stay in the north-star doc.

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
- Every sequence item is one executable slice with a size marker — no opaque "Phase N (5 tasks)" lines. Size a slice to one session: as much as a single session can spec, build, verify, and merge — batch steps that share context (same subsystem/files); split where shared context stops paying for itself or the diff outgrows one review.
- Owner touchpoints: only direction picks, scope changes, irreversibles. List them explicitly; everything else is decided and logged.

**Say what each slice needs — in prose, never as a tag.** Where the project runs
its programs through aido, the teamlead picks the runtime for every dispatch
from what is actually installed on the machine that runs it. Help it by naming
the *need* on the slice — "mechanical, keep it cheap", "this one deserves the
deepest reasoning on offer" — as a short em-dash clause **on the slice's own
line in the cursor**, and put any engagement-wide preference in `## Guardrails`.
Both of those reach the teamlead that makes the choice; a hint written only in
the program doc's brief does not, because brief bodies are resolved into the
assignee's package after the dispatch has already happened. Repeat it in the
brief if it helps the assignee, but never only there. Do not name a model or a
reasoning setting, and do not invent a tag or a marker key for one: the
validator warns on unknown marker keys and marker-version drift rather than
making the cursor unlaunchable, but nothing reads an invented key; an invented
bracket tag likewise survives into the slice's visible title while nothing
reads it. Prose travels to any machine; a named model does not. aido's own
contract for this is `docs/programs.md`, section "Per-slice runtime intent is
prose, never a tag".

## Machine-legible sequence (when aido runs the program)

Where the project executes its programs through aido, the cursor is **parsed as well as read** — a sequence that reads perfectly but carries no markers is refused at launch. What a preparer must hit:

- **Annotate every sequence item** with an `<!-- aido:work-item … -->` marker on the *same physical line* as the item, and bind each brief in the program doc with `<!-- aido:brief {"version":1,"briefRef":"<id>"} -->` immediately before its heading.
- **`workItemId` is the stable identity** — dispatch, attempts, and strikes hang off it, so they survive renumbering and retitling. **`briefRef`** binds the item to its brief. Valid known identity remains required: every `workItemId` is unique and every `briefRef` resolves unambiguously to a bound brief. **`dependencies`** order the work; each entry's `gate` is `completed`, `merged`, or `artifact`.
- **Completion is never inferred from prose.** At least one completion gate is required: declare `"gates":{"review":"required","acceptance":"required","owner":"none"}` on a visible `Checkpoint <n>` item. At most one review or acceptance verdict-bearing gate is allowed. Additional owner-only holds are valid and are not verdict-bearing. Connect the work that checkpoint covers through dependencies. Uncovered completion-gate chains are advisory warnings rather than launch refusal.
- **Compatibility drift warns, it does not disable dispatch.** Unknown marker keys and marker-version drift produce warnings rather than blocking launch. Keep markers minimal anyway: tolerated metadata is not consumed authority.
- **The focus still needs** exactly one `## Goal` section, exactly one `## Guardrails` section, and exactly one `(S|M|L)` size marker per item.
- **Keep the `Blockers for <name>: none` line** this skill already teaches. It is a convention, not a launch requirement — a cursor without one launches fine. What it buys is the other direction: a *live* blocker written on that line does block launch, so a worker who hits a design-level surprise mid-slice has somewhere to park it instead of improvising.

Anything past this minimum — the tolerant parse rules, how slice titles are read, the checkpoint outcome forms — is aido's contract, written up in its `docs/programs.md`. Go there for the detail, and **if that page and this section ever disagree, that page wins.**

Worked example — the same text aido launches through its own Program gate:

```md
<!-- managed:active-work -->
# Active Work

_The managed guidance block, synced by aido and elided here. Every managed block
is stripped before the focus is parsed, so nothing inside one is part of the
program cursor._
<!-- /managed:active-work -->

## Goal
Ship the export pipeline end to end: an operator schedules an export, watches it
run, and downloads the result. Program doc (briefs + decision log):
`docs/programs/2026-09-01-export-pipeline.md`.

## Guardrails
- Owner touchpoints: the archive format (slice 2) and the retention default
  (slice 4). Everything else is decided in-slice and appended to the decision log.
- Quality bar per slice: red-first regression test, fresh-eyes review before
  merge, docs synced, roadmap row ticked.
- Worktree per slice; checkpoint = commit locally; never push.

## Sequence
1. Export job model + durable queue (M) <!-- aido:work-item {"version":1,"workItemId":"job-model","briefRef":"job-model"} -->
2. Format writers behind one port (M) <!-- aido:work-item {"version":1,"workItemId":"format-writers","briefRef":"format-writers","dependencies":[{"workItemId":"job-model","gate":"merged"}]} -->
3. Progress + download UI (M) <!-- aido:work-item {"version":1,"workItemId":"progress-ui","briefRef":"progress-ui","dependencies":[{"workItemId":"job-model","gate":"merged"}]} -->
4. Retention sweep for expired exports (S) <!-- aido:work-item {"version":1,"workItemId":"retention-sweep","briefRef":"retention-sweep","dependencies":[{"workItemId":"format-writers","gate":"merged"}]} -->
5. Checkpoint 1 — acceptance review of the whole program (S) [role:specialist] <!-- aido:work-item {"version":1,"workItemId":"acceptance-checkpoint","briefRef":"acceptance-checkpoint","role":"specialist","dependencies":[{"workItemId":"format-writers","gate":"merged"},{"workItemId":"progress-ui","gate":"merged"},{"workItemId":"retention-sweep","gate":"merged"}],"gates":{"review":"required","acceptance":"required","owner":"none"}} -->

Blockers for specialist: none

## Cross-cutting bar
Zod at every new boundary; no `any` without a comment; a render test for every
visible UI change; no secret ever written to an export artifact.

## Run it
`npm run dev` · `npm test` · focused: `npm test -- export`

## Resume prompt
Re-establish ground truth (`pwd`, branch, `git status`, worktree) → read your
slice's brief in the program doc first → brainstorm → spec → plan (independent
tasks, each with a test scenario + verification command) → execute red-first →
verify → fresh-eyes review → merge → tick the roadmap row, rewrite this cursor
(strike the slice, flag the next), append to the decision log.

## Key references
`docs/programs/2026-09-01-export-pipeline.md` (briefs + decision log) ·
`docs/architecture.md` · the export subsystem map.
```

## Review layers (encode conditionally, by what's available)

1. **In-slice adversarial/whole-branch review** — always; the slice session's own gate before merge.
2. **Scheduled specialist acceptance reviews** — an independent specialist reviews against the briefs at 2–4 milestones plus program end, but only when one is available. These reviews are not the project's ordinary checkpoint/commit rule. If no specialist is available, say so in guardrails and lean on layer 1 plus owner spot-checks. Add a **"Blockers for <specialist>"** line to the focus either way: a design-level surprise mid-slice is logged and routed around, never improvised.
3. **Teamlead/orchestrator supervision** (if one runs the sessions) — process only: flow followed, docs updated, budget; never code or direction.

Specialist reviews append findings to the decision log and refresh remaining briefs against what actually shipped.

## Process

1. Ground truth: read the project's cursor/roadmap/process docs; survey what exists (delegate a codebase inventory if large).
2. Decompose into slices; get the owner's touchpoint decisions (direction/scope) — nothing else.
3. Write the artifacts per the contract above; commit.
4. End state: the cursor's resume prompt says exactly: *read your slice's brief first, then brainstorm → spec → plan (independent tasks, each with test scenario + verification command) → execute → verify → tick roadmap, rewrite cursor, append decisions to the log.*

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
| Unannotated sequence | aido refuses to launch it; annotate every item, keep identities valid and known, and declare at least one completion gate |
