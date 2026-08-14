<!-- managed:process-bugs v=4 -->
# Bug-Fix Process

Bugs live in `docs/roadmap.md` → `## Bugs` as `BUG-NNN: <title>` rows (the aido UI prefills the next `NNN`; statuses per `docs/process/roadmap.md` — `next` when filed, `doing` while being fixed, `blocked` if waiting).

## Procedure

1. **Reproduce and trace the real root cause first** — don't test against a guess. If causality stays unclear or a previous fix already failed, load the `debugging` skill (where available) before touching production code.
2. **Write `tests/bugs/bug-NNN-<slug>`** at the project's regression layer and in its test language, reproducing the user-visible symptom, not the patch's code path. Its header docstring is the bug's permanent record (symptom / root cause / fix).
3. **Run it — confirm it fails for the documented root cause**, not a typo/import/fixture error. If the failure doesn't match the report, stop and investigate before patching.
4. **Fix the bug with the smallest durable correction.**
5. **Run it — confirm it passes**, then run the full suite for regressions.
6. **In the same commit that lands the fix**, mark the `## Bugs` row `done` and move it (with its `Done` date) into `## Phase 99: Continuous Improvements`.

## Test shape

- If the defect depends on event ordering or concurrent mutation (state machines, races, merges, lifecycle hooks), write the regression test as a simulation — load the `testing-by-simulation` skill.
- Where a permanent regression test is genuinely impractical (e.g. live external credentials), record the concrete constraint and the strongest repeatable substitute in the roadmap row before closing — "not testable" without a reason is not accepted.
<!-- /managed:process-bugs -->