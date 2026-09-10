---
section: testing
stack: default
version: 35
target: CLAUDE.md
order: 70
---
## Testing & Verification

- **Run the project's required checks before committing or claiming completion.** Cover changed behavior at the lowest layer that faithfully proves it, extending existing tests before adding new ones. Prose-only changes get structure and reference checks, not wording tests. `docs/tests.md` holds the project's commands, isolation rules, and layer guidance.
- **A bug fix ships with a regression test seen to fail for the reported defect** (write it first, or revert the fix and watch it fail). Reference the bug row and close it in the same commit as `docs/process/roadmap.md` specifies.
- **High-risk changes need more.** Permissions, persisted-data integrity, concurrency, and failure recovery are high-risk even in a small diff: test their failure scenarios and obtain an independent review of the diff before merging. New workflows and behavior changes across modules also get that review. Verify findings against the code before acting; if a review fix touches a high-risk area, re-review the full change against the original base. Docs and guidance get one review pass.
- **Resolve failures within scope.** Fix defects your change caused or that block the agreed outcome; record unrelated defects in the roadmap. Investigate flaky tests; never hide failures with blanket retries or unexplained skips.
