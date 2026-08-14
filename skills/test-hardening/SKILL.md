---
name: test-hardening
description: Use when adding tests for risky logic, when you need to catch false-green / tautological tests, before relying on a green suite, when asked to harden a test suite, or to catch what standard tests miss.
---

# Test hardening — catch what a green suite hides

A passing suite proves the tests ran, not that they would have caught the
bug. Standard tests answer "does the code do X?"; they do not answer "would
this test have failed if the code stopped doing X?". That second question is
where false-green tests hide. The four methods below are **mechanical** — a
tool or a script gives the verdict, so they scale and don't rely on judgement.
Apply them to load-bearing logic (anything where a silent regression is
expensive) as the baseline *before* you trust a green run.

## 1. Mutation testing — the automated red-check

**What it catches.** False-green / tautological tests — the single
highest-value class. A mutation tool rewrites the code under test (flips an
operator `+`→`-`, `<`→`<=`; negates a condition; replaces a return with a
constant; deletes a statement) and re-runs the suite against each mutant. Any
mutant that survives — the suite still passes with the behaviour broken — is a
test that does not actually exercise that behaviour.

**Why standard tests miss it.** A test can assert on the wrong thing, assert a
value the code returns regardless of the path, or never reach the branch it
names — and still be green forever. Nothing in a normal run distinguishes "this
test guards the behaviour" from "this test happens to pass". Mutation testing
directly measures the *guarding*, not the passing.

**How to apply.** Run a mutation tool scoped to the changed module (a full-repo
run is slow; scope it). Tools: **Stryker** (JS/TS), **mutmut** or
**cosmic-ray** (Python), **PIT** (JVM); equivalents exist for most stacks — the
workflow is tool-agnostic. Read the survived-mutant report, and for each
survivor strengthen or add a test until the mutant is killed. A surviving
mutant on load-bearing logic is a finding, not a statistic. Aim to kill all
survivors on the changed code; don't chase a global mutation score.

## 2. Branch / condition coverage gate on changed files

**What it catches.** Untaken branches — an `if` whose `else` never runs, a
guard whose failure path is never triggered, a fallback / dead-letter cleanup
that no test reaches. These are real gaps: the untested path is exactly where
the next regression lands unnoticed.

**Why standard tests miss it.** *Line* coverage counts a line as covered the
moment any execution touches it, so a one-line `if (x) doA(); else doB();`
reads as 100% line-covered while `doB()` was never executed. Line coverage is
the most common metric and the most misleading one — it hides every untaken
branch behind a green number.

**How to apply.** Turn on **branch / condition** coverage (most coverage tools
have a branch mode — e.g. `--coverage` with `branches` thresholds, `coverage.py
--branch`, JaCoCo branch counters) and **gate on the changed files, not a
global percentage**. A global % lets a well-covered codebase absorb a new
untested branch; a per-changed-file gate forces every new branch to be
exercised. Read the report as pairs: each branch point should show both the
taken and the not-taken side hit. A branch with one side at zero is a
never-exercised path — write the test that drives it, or justify in a comment
why it is unreachable.

## 3. a11y / DOM-correctness lint promoted to failures

**What it catches.** Real frontend defects that the render harness already
detects but reports as console noise: invalid DOM nesting (a `<button>` inside
a `<button>`, a `<div>` inside a `<p>`), dialogs missing an accessible label or
`aria-describedby`, controls with no accessible name, and React `act()`
warnings that signal state updates escaping the test's control.

**Why standard tests miss it.** jsdom / happy-dom and the UI framework *emit*
these as `console.error` / `console.warn` during a render test, but the test
still passes — the warning is swallowed as log spam and nobody reads thousands
of lines of it. The defect is detected and then discarded.

**How to apply.** Promote the warnings to hard failures: install a console spy
in the render harness's setup that fails the test if `console.error` /
`console.warn` fires (allow-list the handful of known-benign messages
explicitly, never blanket-mute). Add an accessibility assertion pass to
component render tests (e.g. an axe-style checker, or framework-native a11y
queries) so missing labels / roles fail the test instead of passing silently.
Once promoted, every new invalid-DOM or missing-aria defect turns the suite
red at the point it is introduced.

## 4. Red-check discipline per test

**What it catches.** The same false-green class as mutation testing, applied by
hand to a single load-bearing test: a test you *believe* guards a behaviour but
which would stay green if the behaviour broke.

**Why standard tests miss it.** Writing a test and seeing it pass tells you
nothing about whether it can fail for the right reason. A test written
green-first is unverified until you have seen it red for the documented cause.

**How to apply.** For every load-bearing test, once: break the behaviour it
guards — revert the fix, or mutate the single line under test — confirm the
test goes **red for that exact reason** (not a typo, a missing import, or an
unrelated error), then restore. This is the cheap manual form of mutation
testing: one targeted mutation on the one path you care about. It is
**mandatory for load-bearing tests** and is the discipline behind every
"reproduce first, then fix" bug workflow — the failing run is the proof the
test pins the real defect.

## When to still run residuals

These four methods are mechanical: they prove a test *exercises* its code and
that a green run is trustworthy. They cannot judge *claims*. The separate
`residuals-review` skill stays for the semantic / claim-level review a tool
can't do — overstated invariants ("every caller goes through X"), doc drift,
cross-cutting blindspots, and proxy evasions where a test binds to a shape that
only approximates the real property. Run these four as the **baseline** so
residuals isn't doing automation's job; run residuals on top for the
human-judgement layer above what mutation, coverage, and lint can reach.
