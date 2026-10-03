# aido cursor contract

The full launch contract and a worked example for the cursor described in [../SKILL.md](../SKILL.md) § Machine-legible sequence.

Where the project executes its programs through aido, the cursor is **parsed as well as read** — a sequence that reads perfectly but carries no markers is refused at launch. What a preparer must hit:

- **Annotate every sequence item** with an `<!-- aido:work-item … -->` marker on the *same physical line* as the item, and bind each brief in the program doc with `<!-- aido:brief {"version":1,"briefRef":"<id>"} -->` immediately before its heading.
- **`workItemId` is the stable identity** — dispatch, attempts, and strikes hang off it, so they survive renumbering and retitling. **`briefRef`** binds the item to its brief. Valid known identity remains required: every `workItemId` is unique and every `briefRef` resolves unambiguously to a bound brief. **`dependencies`** order the work; each entry's `gate` is `completed`, `merged`, or `artifact`.
- **Completion is never inferred from prose.** At least one completion gate is required: declare `"gates":{"review":"required","acceptance":"required","owner":"none"}` on a visible `Checkpoint <n>` item. At most one review or acceptance verdict-bearing gate is allowed. Additional owner-only holds are valid and are not verdict-bearing. Connect the work that checkpoint covers through dependencies. Uncovered completion-gate chains are advisory warnings rather than launch refusal.
- **Compatibility drift warns, it does not disable dispatch.** Unknown marker keys and marker-version drift produce warnings rather than blocking launch. Keep markers minimal anyway: tolerated metadata is not consumed authority.
- **The focus still needs** exactly one `## Goal` section, exactly one `## Guardrails` section, and exactly one `(S|M|L)` size marker per item.
- **Keep the `Blockers for <name>: none` line** this skill already teaches. It is a convention, not a launch requirement — a cursor without one launches fine. What it buys is the other direction: a *live* blocker written on that line does block launch, so a worker who hits a design-level surprise mid-slice has somewhere to park it instead of improvising.

Anything past this minimum — the tolerant parse rules, how slice titles are read, the checkpoint outcome forms — is aido's contract, written up in its `docs/programs.md`. Go there for the detail, and **if that page and this section ever disagree, that page wins.**

Worked example — the machine markers illustrate the aido launch contract; project choices and prose are examples, not additional global rules:

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
- Quality bar: the project's relevant checks and review gates, documentation
  kept accurate, and roadmap rows closed with the work.
- Worktree per slice; checkpoint = commit locally; never push.

## Sequence
1. Export job model + durable queue (M) <!-- aido:work-item {"version":1,"workItemId":"job-model","briefRef":"job-model"} -->
2. Format writers behind one port (M) <!-- aido:work-item {"version":1,"workItemId":"format-writers","briefRef":"format-writers","dependencies":[{"workItemId":"job-model","gate":"merged"}]} -->
3. Progress + download UI (M) <!-- aido:work-item {"version":1,"workItemId":"progress-ui","briefRef":"progress-ui","dependencies":[{"workItemId":"job-model","gate":"merged"}]} -->
4. Retention sweep for expired exports (S) <!-- aido:work-item {"version":1,"workItemId":"retention-sweep","briefRef":"retention-sweep","dependencies":[{"workItemId":"format-writers","gate":"merged"}]} -->
5. Checkpoint 1 — acceptance review of the whole program (S) [role:specialist] <!-- aido:work-item {"version":1,"workItemId":"acceptance-checkpoint","briefRef":"acceptance-checkpoint","role":"specialist","dependencies":[{"workItemId":"format-writers","gate":"merged"},{"workItemId":"progress-ui","gate":"merged"},{"workItemId":"retention-sweep","gate":"merged"}],"gates":{"review":"required","acceptance":"required","owner":"none"}} -->

Blockers for specialist: none

## Export constraints
No secret is written to an export artifact. Use the project's established
validation and UI testing conventions.

## Run it
`npm run dev` · `npm test` · focused: `npm test -- export`

## Resume prompt
Read the assigned brief and inspect current code. Complete and verify the slice
under the project's review and merge rules. Record its result and next action;
follow the program runtime's ownership rules for cursor changes.

## Key references
`docs/programs/2026-09-01-export-pipeline.md` (briefs + decision log) ·
`docs/architecture.md` · the export subsystem map.
```
