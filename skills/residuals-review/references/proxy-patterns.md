# Proxy patterns — what to hunt and how

Patterns and examples for the review procedure in [../SKILL.md](../SKILL.md).

## Proxies to identify

- **Structural-test regexes** over source code (extractors, allow-list scanners). The regex's capture set is the proxy; the invariant is whatever it's meant to enforce.
- **Allow-lists / classification tables** (`bump-here` / `metadata-only` / `port-adapter` / etc.). Each entry's `reason` is a claim that should be re-audited for honesty — not just "is it in the list" but "is the classification accurate today."
- **Convergence claims** ("all callers go through X", "single source of truth for Y"). Often overstated — there's usually a peer entry-point.
- **Universal-language claims** ("every", "all", "any future") in commit messages or reflections. Tend to be overstated because the writer reasons about tested cases, not future cases.
- **Defensive observability lost in a refactor.** When a delegation/inlining change removes a `throw new Error(...)`, an assert, a `log.warn(...)` — audit whether the new code still surfaces the failure mode. The throw was theatrical against current code but real against future regression.
- **"No current sites; deferred" claims** without a grep citation — the deferred-fact-check error mode.

## The shape one level shallower

- **Shape-mirroring**: if PARAMS were fixed, look for RETURN TYPES. If `*` attached to keyword was fixed, look for `*` attached to name. If one entry-point got a filter, look for peer entry-points without it.
- **Universal-claim mirror**: an "all callers" claim may miss a peer entry point. Search for the construct and inspect the results.
- **Deferred-fact-check**: every "no current sites" claim must be re-grepped. The grep is the audit trail.
- **Visibility/scope**: a fix at the function level might miss the cross-module level. A fix in one package might miss the others.
- **Defensive observability**: every refactor that removes a throw/assert must explicitly justify it.

## Project-specific calibration

Different projects have different invariant surfaces. On first use in a new project, read:

- The reflections doc (or equivalent) to find prior cycles
- The structural test files (look for `*.exhaustiveness.test.ts`, `*-coverage.test.*`, regex-over-source tests)
- The allow-list / classification tables
- The recent commit history for the phase/area in scope

If these do not exist, inspect the in-scope implementation for relevant invariants. Do not create new audit infrastructure merely to have something to review.

## Worked examples by target

- **`residuals-review` with no explicit target** (after a commit lands) — review `HEAD` if that is the active change; follow the skill's completion rule after authorized fixes.
- **`audit PR #42`** — use the available GitHub integration (or authenticated `gh` fallback) to read claims and the cumulative diff; treat the PR description as the closeout claim. Apply findings only when the task authorizes branch changes.
- **`audit this branch before I merge`** — `git diff <base>...HEAD`; the divergence's claims live in the branch's commit messages. Apply findings only when authorized; follow the assignment's merge ownership.
- **`audit my uncommitted work`** — `git diff` (staged + unstaged); the user's *intended* commit message is the closeout claim. Apply findings to the working tree only when changes are authorized.
- **`audit modules/auth for invariant decay`** — inspect the module's implementation and relevant existing checks in one bounded pass. Missing tests alone do not authorize new infrastructure.
- **`audit the codebase`** — inspect relevant structural checks and classifications across the requested codebase. This is a bounded audit; continued loops require an explicit request.
