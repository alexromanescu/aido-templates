# Looping — explicit multi-cycle audits

Mechanics for the explicit-request loops described in [../SKILL.md](../SKILL.md). The change-targeted "cycle until clean" default lives there; this file governs open-ended audit loops over evolving targets.

## When a loop is meaningful

An explicit loop is for open-ended audits whose scope outlives one pass — whole-codebase sweeps, path audits under a standing mandate, or a target the user keeps editing between passes. A bounded change that picked up fixes re-cycles under the change-targeted default in [../SKILL.md](../SKILL.md) (terminate on the first clean pass) — that is not this loop. For static targets nobody is editing, one cycle is the typical scope.

Loop only when the request or invoking context asks for it ("keep auditing", a standing loop mandate). Never self-start a loop in a supervised engagement — there, each pass is user-triggered. Before an authorized loop, read the governing project's pause/checkpoint policy; if it defines none, use the fifth-cycle cost-control fallback below.

**An authorized loop runs autonomously between cycles** — after one cycle's review and any authorized fix/record, start the next without asking. Follow the governing project's pause policy; when it defines none, pause at the fifth-cycle fallback. Natural termination is two consecutive zero-finding reviews.

## Working checklist

Create the recurring checklist in the harness's native task/plan tracker when one is available; otherwise keep a concise working checklist:

- "Cycle N: read prior commit and audit"
- "Cycle N: write failing tests for findings when authorized"
- "Cycle N: apply fixes when authorized"
- "Cycle N: record findings and commit when authorized"
- "Cycle N: termination check"

## After each cycle

1. **Termination check**: was this cycle's findings count zero? If yes AND the previous cycle was also zero → **TERMINATE** and summarize; commit only when the task authorizes a change.

2. **Project policy or fallback cost boundary**: follow the governing project's pause/checkpoint policy. If it defines none, every fifth cycle **pause and ask the user** with:
   - Cycles completed in this run
   - Findings tally per cycle (e.g., 5/3/2/2/0)
   - Estimated cost so far (rough — token budget consumed)
   - Items left deferred (for context)
   - Ask: "Continue, pause, or terminate manually?"
   - Wait for user response before proceeding.

3. **Otherwise**: start the next cycle.

## Termination is mechanical

The loop ends or pauses only on: (1) two consecutive zero-finding cycles → terminate and announce; (2) a governing-project pause or, when none is defined, the fifth-cycle fallback → pause and summarize; (3) a hard infrastructure error → report and pause. Nothing else — not diminishing findings, a small commit, or token concerns — ends it early. Equally, do not manufacture findings to keep the loop alive: a clean review is a real signal.

## Cost-curve awareness

Findings should DECREASE across cycles; they can rise when a deeper proxy opens, but the long-run curve converges to two zeros. As findings shrink:

- **Cheap + concrete + shape-mirror**: fix in-cycle when authorized; otherwise report it.
- **Architectural + cross-module**: defer with roadmap entry. Don't cram refactors into a residuals cycle.
- **Speculative (no current sites)**: defer with grep citation. Don't manufacture findings to keep the cycle going.

A clean review is a real signal, not a failure. Don't fight termination.

## Restart conditions

Once a loop terminates, restart only when:

1. An allow-list / classification table is modified
2. A new mutation/pattern shape appears in the codebase (e.g., new fs import shape, new generic function form)
3. A new structural test is added (its scaffolding needs a canary too)
4. A real bug surfaces in production tied to one of the deferred items
