---
section: testing
stack: default
version: 34
target: CLAUDE.md
order: 70
---
## Testing & Verification

- **Run the project's required checks before committing or claiming completion.** Add or extend automated coverage for changed behavior unless existing tests already exercise it. Choose the lowest layer that faithfully proves each behavior: unit tests for pure logic, render tests for UI interactions, and browser tests for browser-specific behavior. For prose-only changes, validate structure and references and review meaning; do not add tests that merely pin wording. Follow `docs/tests.md` for concrete automation constraints.
- **Bug fixes need a regression test demonstrated to fail for the reported defect.** Read `docs/process/bugs.md` before writing it. Treat behavior changes involving permissions, persisted-data integrity, concurrent updates, or failure recovery as high-risk even in a small diff: identify affected safeguards and test their failure scenarios. Use `test-hardening` when available to check that those tests detect broken safeguards; do not mutate every changed line.
- **Resolve failures within scope.** Fix defects caused by the change or preventing the agreed outcome. Nearby small fixes may be included when they directly support that outcome and keep risk low. Record unrelated defects in the roadmap. Investigate flaky tests; never hide failures with blanket retries or unexplained skips.
- **Obtain an independent review before merging a new workflow, behavior changes across modules, or high-risk changes.** Verify findings against the implementation before acting. After a review fix changes shared behavior, permissions, persisted-data integrity, concurrency, or recovery, obtain a fresh review of the entire change against the original base. For a local fix, review its behavior and interactions. Close only when confirmed defects and unmet acceptance criteria within scope are resolved; style preferences alone do not require another cycle. Docs and guidance receive one review pass. Use `residuals-review` for invariant audits; add automated guards only for reliably checkable invariants.
- **Use `docs/tests.md` for commands, isolation, and test-layer guidance.** Run the relevant verification yourself. Once required checks pass, repeat or broaden them only for changed code, failures, or a concrete unresolved concern.
