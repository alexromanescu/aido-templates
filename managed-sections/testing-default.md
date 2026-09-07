---
section: testing
stack: default
version: 33
target: CLAUDE.md
order: 70
---
## Testing & Verification

- **Run the project's required checks before committing or claiming completion.** Choose the lowest test layer that faithfully exercises the changed behavior; existing coverage counts. Pure logic may be verified by unit tests, UI interactions by render tests, and browser-specific behavior by browser tests. For prose-only changes, validate structure and references and review meaning; do not add tests that merely pin wording.
- **Bug fixes need a regression test demonstrated to fail for the reported defect.** Read `docs/process/bugs.md` before writing it. Use targeted mutation checks for critical invariants or suspected ineffective tests, not every changed line.
- **Resolve failures within scope.** Fix defects caused by the change or preventing the agreed outcome. Nearby small fixes may be included when they directly support that outcome and keep risk low. Record unrelated defects in the roadmap. Investigate flaky tests; never hide failures with blanket retries or unexplained skips.
- **Obtain an independent review before merging substantial or high-risk changes.** Verify findings against the implementation before acting. After fixes, review the affected behavior and its interactions; finish when no material findings remain. Docs and guidance receive one review pass. Use `residuals-review` for invariant audits; add automated guards only for reliably checkable invariants.
- **Use `docs/tests.md` for commands, isolation, and test-layer guidance.** Run the relevant verification yourself. Once required checks pass, repeat or broaden them only for changed code, failures, or a concrete unresolved concern.
