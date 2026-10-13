---
section: testing
stack: default
version: 37
target: CLAUDE.md
order: 70
---
## Testing & Verification

- **Run the project's required checks before committing or claiming completion.** Cover changed behavior at the lowest layer that faithfully proves it, extending existing tests before adding new ones; prose-only changes get structure and reference checks, not wording tests. Once checks pass, rerun or broaden them only for changed code, a failure, or a concrete concern. `docs/tests.md` holds commands, isolation rules, and layer guidance.
- **A bug fix ships with a regression test seen to fail for the reported defect** (write it first, or revert the fix and watch it fail). Reference the bug row and close it in the same commit as `docs/process/roadmap.md` specifies.
- **High-risk changes need more.** Permissions, persisted-data integrity, concurrency, and failure recovery are high-risk even in a small diff: test their failure scenarios and get an independent review of the diff before merging; new workflows and changes to a contract shared across modules get that review too. Verify findings against the code and act on confirmed defects and unmet acceptance criteria; style preferences do not warrant another cycle. If a review fix touches a high-risk area, re-review the full change against the original base. Docs get one review pass. Do not overdo. Some risks can be contained rather than eliminated (eg: low occurance probability can be contained with an error message or ask for the user to redo a certain step, instead of building overcomplicated machinery - as long as it is not hidden).
- **Fix what you find.** Fix defects your change caused, defects blocking the agreed outcome, and unrelated ones you can fix quickly and safely; record the rest in the roadmap. Investigate flaky tests; never hide failures with blanket retries or unexplained skips.
- **Keep the tests up to date.** Remove tests that are no longer required.
