---
name: residuals-review
description: Use when the user says "residuals review", "fresh-eyes review", "audit this PR/branch/module", "find what's wrong before I merge", "find what was missed", or "audit for invariant decay", or after a non-trivial change to invariant-sensitive code. Read-only by default, fixes only when authorized. Change-targeted reviews cycle until one clean pass over the final state; open-ended audit loops run on explicit request only.
---

# Residuals Review — Adversarial Fresh-Eyes Cycle

Conduct one or more **adversarial reviews** of the selected target. The goal is to find **proxy evasions** — places where a test or invariant binds to a syntactic shape that *approximates* the real invariant but doesn't fully encode it. Each cycle walks one level deeper.

## Core principle

Every test is a **proxy** for the property it's meant to enforce. A proxy is correct only if every shape it scans corresponds to the invariant, AND every violation of the invariant produces a shape it scans. As code evolves, both directions decay.

The discipline: **the next reviewer assumes nothing**. Every closeout claim from the prior commit is suspect until grep-verified.

## Placement in the change lifecycle

The highest-value placement is at the close of the authoring change, before its merge: findings land while the author's context is loaded, small ones are fixed in the same cycle, and the mainline never carries a known-defective landing.

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

First-use calibration in a new project and worked examples per target: [references/proxy-patterns.md](references/proxy-patterns.md).

## Mode boundary

Respect the requested mode. In a read-only audit, report findings and demonstrations without editing, committing, posting comments, or changing project records. Apply red-then-green fixes only when the task authorizes changes.

## Operational safety rules

- **Derive every scratch, backup, and temp path from your own worktree or agent id — never a shared literal like `/tmp/w.bak`.** Two reviewers sharing one backup path restore each other's files, which has overwritten a production file with another module's contents. Parallel reviewers are the normal case, so treat any fixed path as a collision waiting to happen, and delete what you created once the cycle closes.
- **Before trusting any mutation probe's result, assert the mutation is actually present in the source (and absent after restore).** An unapplied mutation reads as a passing verification — grep the mutated line before running the probe, and grep again after the restore to confirm the original is back.

## Single-cycle workflow

1. **Establish the target.** Use the table above. For commit-based targets, use `git log` and `git show --stat`. For PR-based targets, use the available GitHub integration; fall back to `gh` only when it is installed and authenticated. For branches, use `git diff <base>...HEAD`; for the working tree, `git status` plus staged/unstaged diffs. For path-based targets, read the module's structural tests and reflections to find the invariants.

2. **Identify the proxies the target relies on** — structural-test regexes, allow-lists / classification tables, convergence claims, universal-language claims, defensive observability lost in a refactor, and "no current sites; deferred" claims without a grep citation. Pattern catalog and worked examples: [references/proxy-patterns.md](references/proxy-patterns.md).

3. **For each proxy, look for the shape one level shallower** — shape mirrors, peer entry points, cross-module scope, re-greps of deferred claims (same reference).

4. **For each candidate finding**, classify:
   - **P0/P1 (real bug; fix when authorized)** — concrete demonstrator (grep finds a current site that exhibits the evasion). In read-only mode, report the demonstration. When changes are authorized, write a failing test against the unmodified target/base state, apply the fix, and confirm green.
   - **P2 cheap+concrete (fix when authorized)** — small cost (regex tweak, single-line fix) AND clear shape-mirror of an existing fix. In read-only mode, report it; otherwise apply it.
   - **P2 architectural (defer with roadmap entry)** — multi-module move, scope creep risk. When changes are authorized, add the roadmap entry; otherwise report the proposed entry. Cite grep showing current state.
   - **P2 speculative (defer with grep citation)** — no current sites, structural blindspot only. When documentation changes are authorized, record it in the project's established location; otherwise report it. Do not fix preemptively.

   Before acting on any candidate, **adversarially verify it**: an independent check — fresh context where the harness provides it — attempts to refute the finding against the actual code, with REFUTED as the default verdict. Only findings that survive with concrete evidence are acted on or reported as confirmed.

5. **When changes are authorized, apply fixes with red-then-green discipline:**
   - Write the failing test FIRST. Run it against the unmodified target/base state; confirm it fails.
   - Apply the fix.
   - Run the test; confirm it passes.
   - Run the broader test suite to confirm no regression.
   - **No exceptions.** A fix without a regression-guarding test is not landed.

6. **When record changes are authorized, update the project's established review/reflections record if one exists.** In read-only mode, include the same facts in the report instead. Do not create a new project-specific documentation convention merely for this skill. Be honest: what proxy did the prior session bind to, what evasion did this session find, what's the discipline correction — and cite the grep that confirms claims.

7. **Commit on the working branch when the task authorizes commits.** Follow the project's established commit convention; do not invent a new one for this skill. Capture finding labels, repro, fix shape, and verification in the commit or the project's review record.

## Cycling until clean (change-targeted reviews)

When the review closes a change that is about to merge (a commit, branch, PR, or working tree) and a cycle produced authorized fixes, the fixed state is new unreviewed code: run a fresh cycle over the post-fix state. **Freeze the comparison base on the first cycle** — record the base ref (merge target, or the pre-review HEAD/stash state for a working tree) and review the complete `base..current` range every cycle, fix commits included. Never re-review only the latest fix commit or a now-empty working tree; a clean verdict on a partial range is not a clean pass over what merges. Terminate on the first cycle that reports zero findings over the full range. A clean first cycle terminates immediately. This is the default behavior and needs no explicit loop request — subject to the governing project's review-proportionality policy (e.g. docs/guidance-only changes may be single-pass); in read-only mode the findings are simply reported and no re-cycle is owed by this invocation — the change's author still holds the project's merge gate.

## Looping (explicit request only)

Open-ended audit loops ("keep auditing", a standing loop mandate, whole-codebase or path audits meant to span sessions) run only when explicitly requested — never self-started in a supervised engagement. Asking for a bounded change to be reviewed "until clean" is not a loop request — that is the change-targeted default above, terminating on the first clean pass. Explicit loops terminate on two consecutive zero-finding cycles, with a fifth-cycle cost checkpoint when the governing project defines no pause policy. Mechanics, cost-curve triage, and restart conditions: [references/looping.md](references/looping.md).

## What this skill is NOT

- **Not a substitute for code review.** It hunts for proxy decay, not for general code quality.
- **Not for green-field code.** It needs structural tests / invariants to audit. Empty-codebase invocation should bootstrap them first.
- **Not for one-off bugs.** It catches systematic proxy evasions; one-off bugs need targeted debugging.
