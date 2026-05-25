---
name: residuals-review
description: Run an adversarial fresh-eyes-review cycle on a specified target — defaulting to the most recent commit but accepting any of: a specific commit (`HEAD~3`), a commit range (`main..HEAD`), a PR (`#42`), a branch comparison (current vs main), the working-tree (uncommitted changes), a module/path (`packages/server/src/modules/auth`), or the whole codebase (no scope). Hunts for proxy evasions, shape-mirror bugs, and unverified universal claims. Applies red-then-green fixes for real findings; defers structural blindspots with grep citations. Auto-loops until two consecutive zero-finding reviews terminate, with a checkpoint every 5 cycles for cost control. Use when the user says "residuals review", "fresh-eyes review", "audit this PR/branch/module", "find what's wrong before I merge", "find what was missed", "audit for invariant decay", or after a non-trivial change to invariant-sensitive code.
---

# Residuals Review — Adversarial Fresh-Eyes Cycle

You are conducting one (or more) **adversarial reviews** of the most recent commit on the current branch. The goal is to find **proxy evasions** — places where a test or invariant binds to a syntactic shape that *approximates* the real invariant but doesn't fully encode it. Each cycle walks one level deeper.

## Core principle

Every test is a **proxy** for the property it's meant to enforce. A proxy is correct only if every shape it scans corresponds to the invariant, AND every violation of the invariant produces a shape it scans. As code evolves, both directions decay.

The discipline: **the next reviewer assumes nothing**. Every closeout claim from the prior commit is suspect until grep-verified.

## Target selection (what is being reviewed)

The user's request determines the **target** — the body of code/claims under audit. Six invocation shapes:

| Invocation | Target | What "the proxies" are |
|---|---|---|
| (default) | Most recent commit (`HEAD`) | The commit message's claims; the diff itself |
| `audit HEAD~5..HEAD` | A range of commits | The cumulative claims across the range |
| `audit PR #42` / `audit this PR` | A GitHub PR | `gh pr view 42 --json files,body,title,commits` — the PR description's claims, the cumulative diff, the linked issue's claims |
| `audit this branch` / `before I merge` | Current branch vs base (usually `dev` / `main`) | `git diff <base>...HEAD` — the divergence's claims; the branch name itself often signals intent |
| `audit my uncommitted work` | Working tree | `git diff` (staged + unstaged) — what the user is *about to* claim |
| `audit modules/auth` / `find gaps in X` | A path | The current state of that module against its invariants — bootstrap mode, no commit to bind to |
| (none specified) | The whole codebase | The structural tests' claims (allow-lists, exhaustiveness scans) and the project's documented invariants |

**Pick the right target by listening to the user's verb**:
- "review", "what was missed", "another cycle" → default to most recent commit unless they specify
- "audit", "find gaps in", "check" → user usually means the named scope (PR, branch, module)
- "is this safe to merge", "before I push" → branch comparison
- "what should I worry about in X" → path-scoped audit

If unclear, **ask once** then proceed: "I'll review HEAD by default — or did you mean the whole feature branch / a specific PR?"

## Single-cycle workflow

1. **Establish the target.** Use the table above. For commit-based targets, `git log` and `git show --stat` to scope. For PR-based, `gh pr view <N>`. For branches, `git diff <base>...HEAD`. For working-tree, `git status` + `git diff`. For path-based, read the module's structural tests and reflections to find the invariants.

2. **Identify the proxies the target relies on.** Patterns to look for:
   - **Structural-test regexes** over source code (extractors, allow-list scanners). The regex's capture set is the proxy; the invariant is whatever it's meant to enforce.
   - **Allow-lists / classification tables** (`bump-here` / `metadata-only` / `port-adapter` / etc.). Each entry's `reason` is a claim that should be re-audited for honesty — not just "is it in the list" but "is the classification accurate today."
   - **Convergence claims** ("all callers go through X", "single source of truth for Y"). Often overstated — there's usually a peer entry-point.
   - **Universal-language claims** ("every", "all", "any future") in commit messages or reflections. Tend to be overstated because the writer reasons about tested cases, not future cases.
   - **Defensive observability lost in a refactor.** When a delegation/inlining change removes a `throw new Error(...)`, an assert, a `log.warn(...)` — audit whether the new code still surfaces the failure mode. The throw was theatrical against current code but real against future regression. (Session 15's `bumpForFile` refactor lost a throw; Session 17 had to restore it.)
   - **"No current sites; deferred" claims** without a grep citation — the deferred-fact-check error mode.

3. **For each proxy, look for the shape one level shallower.** Common patterns (apply where relevant):
   - **Shape-mirroring**: if PARAMS were fixed, look for RETURN TYPES. If `*` attached to keyword was fixed, look for `*` attached to name. If one entry-point got a filter, look for peer entry-points without it.
   - **Universal-claim mirror**: every "all callers" claim has a peer the writer forgot. Grep for the construct and count.
   - **Deferred-fact-check**: every "no current sites" claim must be re-greppped. The grep is the audit trail.
   - **Visibility/scope**: a fix at the function level might miss the cross-module level. A fix in one package might miss the others.
   - **Defensive observability**: every refactor that removes a throw/assert must explicitly justify it.

4. **For each candidate finding**, classify:
   - **P0/P1 (real bug, fix now)** — concrete demonstrator (grep finds a current site that exhibits the evasion). Write a failing test on dev HEAD, apply the fix, confirm green.
   - **P2 cheap+concrete (fix preemptively)** — small cost (regex tweak, single-line fix) AND clear shape-mirror of an existing fix. Apply.
   - **P2 architectural (defer with roadmap entry)** — multi-module move, scope creep risk. Add roadmap entry; cite grep showing current state.
   - **P2 speculative (defer with grep citation)** — no current sites, structural blindspot only. Document in spec; do not fix preemptively.

5. **Apply fixes with red-then-green discipline:**
   - Write the failing test FIRST. Run it on dev HEAD; confirm it fails.
   - Apply the fix.
   - Run the test; confirm it passes.
   - Run the broader test suite to confirm no regression.
   - **No exceptions.** A fix without a regression-guarding test is not landed.

6. **Update the reflections doc** (project-specific location; usually `docs/meta/reflections.md` or similar). Add a new "level-N lesson" sub-section under the prior. Be honest:
   - What proxy did the prior session bind to?
   - What evasion did this session find?
   - What's the discipline correction?
   - Cite the grep that confirms claims.

7. **Commit on the working branch.** Use a structured message:
   - First line: `fix(<phase>): <one-line summary> (Session N)`
   - Body: P0/P1/P2 finding labels, repro lines, fix shapes, test counts, typecheck status.
   - End with `Co-Authored-By:` if applicable.

## Multi-cycle (auto-loop) workflow

Multi-cycle is meaningful when the target **evolves between cycles** — i.e., commit-based targets (the prior cycle's fix becomes the next cycle's target). For static targets (path-based audits, PRs that aren't being modified), one cycle is the typical scope unless the user keeps editing.

When invoked, default to **looping until termination** with a **checkpoint every 5 cycles**.

Initialize a TodoWrite list at the start with these recurring tasks (one per cycle):
- "Cycle N: read prior commit and audit"
- "Cycle N: write failing tests for findings"
- "Cycle N: apply fixes"
- "Cycle N: update reflections + commit"
- "Cycle N: termination check"

After each commit:

1. **Termination check**: was this cycle's findings count zero? If yes AND the previous cycle was also zero → **TERMINATE** with a summary commit (or just announce termination if no doc changes).

2. **Cost-control checkpoint**: every 5 cycles, **PAUSE and ask the user**:
   - Cycles completed in this run
   - Findings tally per cycle (e.g., 5/3/2/2/0)
   - Estimated cost so far (rough — token budget consumed)
   - Items left deferred (for context)
   - Ask: "Continue, pause, or terminate manually?"
   - Wait for user response before proceeding.

3. **Otherwise**: start the next cycle.

## Termination conditions

The cycle ends in one of these ways:
- **Two consecutive zero-finding reviews** (the natural termination).
- **User intervention** (at a 5-cycle checkpoint or via direct message).
- **Hard cap reached** — if findings tally goes 0/0/0+ without termination signal, something is wrong; pause and report.

## Cost-curve awareness (level-10 lesson from q1dms)

Findings should DECREASE across cycles. A typical trajectory: 8 → 5 → 5 → 2 → 2 → 0 → 0. As findings shrink:

- **Cheap + concrete + shape-mirror**: fix in-cycle.
- **Architectural + cross-module**: defer with roadmap entry. Don't cram refactors into a residuals cycle.
- **Speculative (no current sites)**: defer with grep citation. Don't manufacture findings to keep the cycle going.

A clean review is a real signal, not a failure. Don't fight termination.

## Restart conditions

Once a cycle terminates, restart only when:
1. An allow-list / classification table is modified
2. A new mutation/pattern shape appears in the codebase (e.g., new fs import shape, new generic function form)
3. A new structural test is added (its scaffolding needs a canary too)
4. A real bug surfaces in production tied to one of the deferred items

## Project-specific calibration

Different projects have different invariant surfaces. On first use in a new project, the model should read:
- The reflections doc (or equivalent) to find prior cycles
- The structural test files (look for `*.exhaustiveness.test.ts`, `*-coverage.test.*`, regex-over-source tests)
- The allow-list / classification tables
- The recent commit history for the phase/area in scope

If none of these exist yet, the cycle is BOOTSTRAPPING — first session establishes the proxies, subsequent sessions audit them.

## What this skill is NOT

- **Not a substitute for code review.** It hunts for proxy decay, not for general code quality.
- **Not for green-field code.** It needs structural tests / invariants to audit. Empty-codebase invocation should bootstrap them first.
- **Not for one-off bugs.** It catches systematic proxy evasions; one-off bugs need targeted debugging.

## Worked examples by target

- **`/residuals-review`** (no args, after a commit lands) — review HEAD; loop with checkpoints; the q1dms reference cycle.
- **`audit PR #42`** — `gh pr view 42` to read claims; `gh pr diff 42` for the diff; treat the PR description as the closeout claim. Findings get posted as PR review comments OR added as commits on the branch (ask user). Single-cycle by default; loop only if user keeps pushing.
- **`audit this branch before I merge`** — `git diff dev...HEAD` (or `main`, depending on policy); the divergence's claims live in the branch's commit messages. Findings get committed to the branch; loop until clean, then user merges.
- **`audit my uncommitted work`** — `git diff` (staged + unstaged); the user's *intended* commit message is the closeout claim. Findings get applied directly to the working tree before the commit. Single-cycle.
- **`audit modules/auth for invariant decay`** — bootstrap mode: read the module's structural tests and reflections; if none exist, the first cycle establishes them; subsequent cycles audit them. Long-running, can span many sessions.
- **`audit the codebase`** — broadest sweep: walk all `*.exhaustiveness.test.ts` (or equivalent) and audit each one's allow-list for honest classifications. Multi-cycle, multi-session.

## Reference: the q1dms cycle

The first 11-cycle execution of this discipline lives at `/home/alex/Work/Projects/q1dms/docs/meta/reflections.md` (see "Footgun decay" through "Discipline cycle terminates" sub-sections). The 11-level lesson history table at the bottom is the canonical worked example.

Findings tally for that cycle: **6/8/6/4/3/5/5/2/2/0/0** (12 commits, ~40 findings, terminated naturally).
