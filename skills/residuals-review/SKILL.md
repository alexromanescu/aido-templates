---
name: residuals-review
description: Use when the user says "residuals review", "fresh-eyes review", "audit this PR/branch/module", "find what's wrong before I merge", "find what was missed", or "audit for invariant decay", or after a non-trivial change to invariant-sensitive code. Runs an adversarial fresh-eyes cycle against a commit, range, PR, branch, working tree, path, or whole codebase; hunts proxy evasions, shape-mirror bugs, and unverified universal claims; applies red-then-green fixes; and loops until two consecutive zero-finding reviews terminate.
---

# Residuals Review — Adversarial Fresh-Eyes Cycle

Conduct one or more **adversarial reviews** of the selected target. The goal is to find **proxy evasions** — places where a test or invariant binds to a syntactic shape that *approximates* the real invariant but doesn't fully encode it. Each cycle walks one level deeper.

## Core principle

Every test is a **proxy** for the property it's meant to enforce. A proxy is correct only if every shape it scans corresponds to the invariant, AND every violation of the invariant produces a shape it scans. As code evolves, both directions decay.

The discipline: **the next reviewer assumes nothing**. Every closeout claim from the prior commit is suspect until grep-verified.

## Target selection (what is being reviewed)

The user's request determines the **target** — the body of code/claims under audit. Seven invocation shapes:

| Invocation | Target | What "the proxies" are |
|---|---|---|
| (default) | Most recent commit (`HEAD`) | The commit message's claims; the diff itself |
| `audit HEAD~5..HEAD` | A range of commits | The cumulative claims across the range |
| `audit PR #42` / `audit this PR` | A GitHub PR | The available GitHub integration (or authenticated `gh` fallback) — the PR description's claims, cumulative diff, commits, and linked issue |
| `audit this branch` / `before I merge` | Current branch vs base (usually `dev` / `main`) | `git diff <base>...HEAD` — the divergence's claims; the branch name itself often signals intent |
| `audit my uncommitted work` | Working tree | `git diff` (staged + unstaged) — what the user is *about to* claim |
| `audit modules/auth` / `find gaps in X` | A path | The current state of that module against its invariants — bootstrap mode, no commit to bind to |
| `audit the codebase` / `whole-codebase audit` | The whole codebase | The structural tests' claims (allow-lists, exhaustiveness scans) and the project's documented invariants |

**Pick the right target by listening to the user's verb**:
- "review", "what was missed", "another cycle" → default to most recent commit unless they specify
- "audit", "find gaps in", "check" → user usually means the named scope (PR, branch, module)
- "is this safe to merge", "before I push" → branch comparison
- "what should I worry about in X" → path-scoped audit

If unclear, **ask once** then proceed: "I'll review HEAD by default — or did you mean the whole feature branch / a specific PR?"

## Single-cycle workflow

1. **Establish the target.** Use the table above. For commit-based targets, use `git log` and `git show --stat`. For PR-based targets, use the available GitHub integration; fall back to `gh` only when it is installed and authenticated. For branches, use `git diff <base>...HEAD`; for the working tree, `git status` plus staged/unstaged diffs. For path-based targets, read the module's structural tests and reflections to find the invariants.

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
   - **P0/P1 (real bug, fix now)** — concrete demonstrator (grep finds a current site that exhibits the evasion). Write a failing test against the unmodified target/base state, apply the fix, confirm green.
   - **P2 cheap+concrete (fix preemptively)** — small cost (regex tweak, single-line fix) AND clear shape-mirror of an existing fix. Apply.
   - **P2 architectural (defer with roadmap entry)** — multi-module move, scope creep risk. Add roadmap entry; cite grep showing current state.
   - **P2 speculative (defer with grep citation)** — no current sites, structural blindspot only. Document in spec; do not fix preemptively.

5. **Apply fixes with red-then-green discipline:**
   - Write the failing test FIRST. Run it against the unmodified target/base state; confirm it fails.
   - Apply the fix.
   - Run the test; confirm it passes.
   - Run the broader test suite to confirm no regression.
   - **No exceptions.** A fix without a regression-guarding test is not landed.

6. **Update the project's established review/reflections record if one exists.** Do not create a new project-specific documentation convention merely for this skill. Be honest:
   - What proxy did the prior session bind to?
   - What evasion did this session find?
   - What's the discipline correction?
   - Cite the grep that confirms claims.

7. **Commit on the working branch when the task authorizes commits.** Follow the project's established commit convention; do not invent a new one for this skill. Capture finding labels, repro, fix shape, and verification in the commit or the project's review record.

## Multi-cycle (auto-loop) workflow

Multi-cycle is meaningful when the target **evolves between cycles** — i.e., commit-based targets (the prior cycle's fix becomes the next cycle's target). For static targets (path-based audits, PRs that aren't being modified), one cycle is the typical scope unless the user keeps editing.

When invoked, default to **looping until termination**. Before the loop, read the governing project's pause/checkpoint policy. If it defines none, use the fifth-cycle cost-control fallback below.

**The loop runs autonomously between cycles.** Once one cycle's review → fix → commit/record is done, **immediately start the next cycle** without asking. Do not pause to ask "should I continue?", "want another cycle?", "is this enough?", or "shall I do a deeper sweep?" The sanctioned pauses are those required by governing project guidance, the fifth-cycle fallback when no such guidance exists, and natural termination at two consecutive zero-finding cycles.

One cycle is **never** a complete invocation of this skill in auto-loop mode. If you find yourself wrapping up after cycle 1 with a single zero, you are in violation — keep going.

Create the recurring checklist in the harness's native task/plan tracker when one is available; otherwise keep a concise working checklist:
- "Cycle N: read prior commit and audit"
- "Cycle N: write failing tests for findings"
- "Cycle N: apply fixes"
- "Cycle N: update reflections + commit"
- "Cycle N: termination check"

After each commit:

1. **Termination check**: was this cycle's findings count zero? If yes AND the previous cycle was also zero → **TERMINATE** with a summary commit (or just announce termination if no doc changes).

2. **Project policy or fallback cost boundary**: follow the governing project's pause/checkpoint policy. If it defines none, every fifth cycle **pause and ask the user** with:
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
- **User intervention** (at a policy-required pause, the fallback fifth-cycle boundary, or via direct message).
- **Hard cap reached** — if findings tally goes 0/0/0+ without termination signal, something is wrong; pause and report.

## Stopping early — rationalizations to override

After cycle 1, agents under loop pressure invent reasons to bail. **Every reason below is wrong.** If you find yourself thinking any of them, override and start the next cycle.

| Excuse | Reality |
|--------|---------|
| "Only one finding this cycle, must be near-done" | One finding is not zero. Continue. |
| "Zero findings this cycle, we're done" | One zero is not *two consecutive* zeros. Continue. |
| "Let me check with the user before another cycle" | Continue unless governing project guidance or the fallback fifth-cycle boundary requires a pause. |
| "The user probably didn't mean a full loop" | The skill spec IS the loop. If they wanted single-cycle they'd have said. Continue. |
| "Findings are getting speculative" | Then defer them with grep citations and continue. Termination is two zeros, not "feels diminishing". |
| "Context might be running low" | The harness compresses for you. Don't preemptively bail. Continue. |
| "This commit was small, one cycle suffices" | Cycle count scales to findings, not commit size. Continue. |
| "I might be wrong about further findings" | Then write the failing test and let it tell you. Continue. |
| "I already did the obvious sweep" | Cycles walk *deeper*, not wider. The next cycle's target is the prior cycle's fix. Continue. |
| "I want to be efficient / save tokens" | Stopping early after one cycle is the most expensive failure mode — the user re-invokes the skill. Continue. |
| "The remaining findings are all P2-deferred" | Deferring is part of the cycle, not a reason to end it. Continue. |
| "I'm tired / context is heavy / this is enough" | Fatigue is not a termination condition. Continue. |
| "Spirit of the rule is satisfied" | Two zeros or a policy/fallback pause — nothing else. Continue. |

**The only acceptable reasons to stop the loop before natural termination:**
1. **Two consecutive zero-finding cycles** → terminate, announce, exit.
2. **Governing guidance requires a pause, or the fallback fifth-cycle boundary is reached** → follow that policy; for the fallback, summarize tally/cost and ask the user.
3. **Hard infrastructure error** (tests can't run, target unparseable, git in a broken state) → report and pause.

Nothing else is grounds to stop. Treat "one and done" as a violation, not a judgment call.

## Cost-curve awareness

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

Different projects have different invariant surfaces. On first use in a new project, the reviewer should read:
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

- **`residuals-review` with no explicit target** (after a commit lands) — review `HEAD`; loop under project checkpoint guidance until termination.
- **`audit PR #42`** — use the available GitHub integration (or authenticated `gh` fallback) to read claims and the cumulative diff; treat the PR description as the closeout claim. Apply findings only when the task authorizes branch changes. Single-cycle by default; loop only as the target evolves.
- **`audit this branch before I merge`** — `git diff <base>...HEAD`; the divergence's claims live in the branch's commit messages. Findings get committed to the branch when authorized; loop until clean, then the user merges.
- **`audit my uncommitted work`** — `git diff` (staged + unstaged); the user's *intended* commit message is the closeout claim. Findings get applied directly to the working tree before the commit. Single-cycle.
- **`audit modules/auth for invariant decay`** — bootstrap mode: read the module's structural tests and reflections; if none exist, the first cycle establishes them; subsequent cycles audit them. Long-running, can span many sessions.
- **`audit the codebase`** — broadest sweep: walk all `*.exhaustiveness.test.ts` (or equivalent) and audit each one's allow-list for honest classifications. Multi-cycle, multi-session.

## Reference trajectory

One mature execution produced a **6/8/6/4/3/5/5/2/2/0/0** findings tally and terminated naturally. Treat the shape—not any particular project, path, or cycle count—as the lesson: findings can rise when a deeper proxy opens, but the long-run curve should converge to two zeros.
