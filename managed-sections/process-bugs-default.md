---
section: process-bugs
stack: default
version: 1
target: docs/process/bugs.md
order: 10
---
# Bug-Fix Process

Bugs live in `docs/roadmap.md` → `## Bugs` as `BUG-NNN: <title>` rows (the aido UI prefills the next `NNN`; statuses per `docs/process/roadmap.md` — `next` when filed, `doing` while being fixed, `blocked` if waiting).

## Procedure

1. **Reproduce and trace the real root cause first** — don't test against a guess.
2. **Write `tests/bugs/bug-NNN-<slug>.test.ts`** reproducing the user-visible symptom, not the patch's code path. Its header docstring is the bug's permanent record (symptom / root cause / fix).
3. **Run it — confirm it fails for the documented root cause**, not a typo/import/fixture error. If the failure doesn't match the report, stop and investigate before patching.
4. **Fix the bug.**
5. **Run it — confirm it passes**, then run the full suite for regressions.
6. **In the same commit that lands the fix**, mark the `## Bugs` row `done` and move it (with its `Done` date) into `## Phase 99: Continuous Improvements`.

## Test shape

- Assert on observable behavior at the natural level of abstraction, not the patch's internal shape — spying on a specific call breaks on refactor; pin to what the caller sees.
- If the defect depends on event ordering or concurrent mutation (state machines, races, merges, lifecycle hooks), write the regression test as a simulation — load the `testing-by-simulation` skill.
- Where a permanent `tests/bugs/` regression test is impractical (e.g. requires live external credentials), say so in the roadmap row before closing it.
