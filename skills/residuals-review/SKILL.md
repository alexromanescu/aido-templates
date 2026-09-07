---
name: residuals-review
description: Use when asked for a residuals review or invariant-decay audit, or when a substantial change risks breaking source invariants, allow-lists, or structural-test coverage. General code review alone does not require this specialized audit. Read-only unless fixes are authorized.
---

# Residuals Review

Audit whether an implementation and its checks still enforce their claimed invariants. Look for valid cases rejected by a check and violations it fails to detect. This supplements general code review; it does not replace it.

## Scope and authority

Use the target named by the user or current assignment:

| Target | Evidence |
|---|---|
| Commit or range | Diff and commit claims |
| Branch or PR | Full change against its merge base, including related fixes |
| Uncommitted work | Staged and unstaged changes against the starting state |
| Path or codebase | Current implementation, relevant invariants, and existing tests |

Infer the target from the active task where clear; ask only if different interpretations would materially change the review. In a read-only review, report without editing, committing, or changing project records. A path or codebase audit is one bounded pass unless more is requested.

## Safety

- Derive every scratch, backup, and temporary path from your own task/worktree identity, never a shared literal. Do not overwrite pre-existing work. Clean up only what you created and verify removal.
- If authorized to mutate code as a probe, verify the mutation is present before testing and absent after restoration. Use isolated copies when necessary to preserve existing changes.

## Review procedure

1. Establish the target and comparison base from current repository state. For a pending merge, retain the original base so fixes remain part of the review context.
2. Identify the relevant claims, structural scans, classification tables, and entry points. Follow [references/proxy-patterns.md](references/proxy-patterns.md) when choosing probes for these shapes.
3. Look for paths or source forms that evade the claimed invariant, and valid cases incorrectly rejected. Check peer entry points and interactions across the affected boundaries.
4. Verify each candidate against the implementation and existing evidence. Consider counterexamples and intended behavior. Report a confirmed finding only with a concrete location, trigger, and consequence; distinguish unresolved questions from defects. Neither confirmation nor refutation is a default verdict.
5. When fixes are authorized, complete those needed for the agreed outcome, using a regression test for behavioral defects. For prose, validate structure, references, and meaning instead of pinning wording. If automation is impractical, record the specific constraint and strongest repeatable verification. Record unrelated findings without expanding scope; a large required fix is not automatically deferred.
6. Keep detailed evidence in the existing review record or commit when record changes are authorized. Report the practical result and any decision needed in plain language. Do not create a new documentation convention solely for the review.

## Completion

After authorized fixes, review the affected behavior and its interactions in the context of the original change. Expand to the full diff again if the fixes alter shared assumptions or invalidate the earlier review. Do not mistake a clean latest commit for review of the complete change.

Finish when no material findings remain within the agreed review scope. Docs and guidance receive one review pass with findings addressed; do not cycle for editorial polish. In read-only mode, report the findings and stop. With no relevant invariant surface, state that result rather than inventing tests or starting a new audit program.

Only an explicit request starts a continuing audit loop. For that workflow, read [references/looping.md](references/looping.md).
