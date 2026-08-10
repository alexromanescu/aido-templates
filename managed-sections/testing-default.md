---
section: testing
stack: default
version: 24
target: CLAUDE.md
order: 70
---
## Testing & Verification

- **Every change ships with an automated test that drives the user workflow on the real surface and passes** — the real component, endpoint, or entry point, at the tier that fits the change (`docs/tests.md`), not necessarily E2E. A green type-check, clean console, or passing unit suite is not by itself verification. If a change can't be tested automatically, restructure so it can where reasonable — otherwise record why in the roadmap row.
- **A new test must be seen to fail**: write it before the change, or verify it fails with the change reverted. A test that is green by design (a narrowness or idempotence guard) must instead be seen to fail under a mutation of the exact line it guards — a guard no mutation can red is deleted, not kept.
- **The mirror check, before commit**: every guard, constant, or branch the change adds must make at least one test fail when broken. Red-first proves each test is real; this proves each new line is watched — different checks, and the gap between them is where dead guards ship.
- **A failing test is never left silently.** Caused by your change or related → fix before claiming done. Pre-existing and unrelated → file as a bug and flag it. Flaky = a real bug — fix, never blanket-retry. No `skip` without a referenced roadmap entry. A test that CANNOT fail — dead guard, unreachable arm, vacuous assertion, a header contradicting the shipped code — is broken code, not review debt: fix or delete it in the cycle that finds it, yours or a review's, in scope by definition and without a roadmap row; file a row only when the repair requires a production design decision. Row-less repairs still owe a class check: sweep for siblings of the same defect shape and record the command + count in the commit message; a recurring shape is a structural problem — surface it as a row naming the pattern, never spot-fix it N times.
- **A production defect discovered mid-assignment is fixed in the same cycle** when the fix is S-sized and confined to files the assignment already touches — and related small fixes sharing that context may ride the same verification round when combined risk stays low. Full discipline applies (red-first, mutation check, class sweep); never a drive-by patch. File a row instead only when the fix is bigger, outside those files, or needs a product ruling — and name which reason in the report.
- **Don't take a subagent's word for it:** run the automated verification yourself before any done or merge claim.
- **When you fix a bug**, read `docs/process/bugs.md` before writing the test and follow the regression-test procedure.
- **When you choose a test layer or write component / structural / simulation tests**, load the matching skill: `frontend-tests`, `structural-tests`, `testing-by-simulation`.
- Commands, inventory, isolation, design-for-testability, fixtures: `docs/tests.md`.
