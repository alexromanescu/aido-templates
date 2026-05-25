---
name: structural-tests
description: Use when adding a new structural test (regex or AST scan over source), extending an existing allow-list, auditing structural-test scaffolding for decay, or deciding whether an invariant of the form "every X must also Y" deserves a structural test versus code review alone. Covers when to add (and when not to), the four-piece anatomy (mutation patterns, allow-list, verification pointers, canaries), discipline around stale reasons and universal-language claims, and the adversarial-review cycle that catches alias/wildcard import evasions.
---

# Structural tests

Structural tests scan source code itself (regex or AST) and assert on
shape. They enforce architectural invariants that behavioral tests
can't: "every X must also Y" rules where adding a new X without the Y
is a class of bug rather than a single bug.

**Structural tests are brittle scaffolding.** Regex over source breaks
on refactors (alias imports, named imports, partial qualification).
AST walkers carry their own correctness burden. They catch a class of
real bugs but introduce a class of false positives. Add them sparingly
and only when the invariant clears the bar below.

## When to add one

Add a structural test when:

- An invariant of the form "every X must also Y" exists and is
  currently enforced by convention only.
- A bug has happened where someone added a new X without the Y.
- Code review finds itself repeatedly saying "did you remember to…".
- The cost of forgetting is high (data corruption, security, silent
  data loss) — not "we'll catch it in QA".

DON'T add one when:

- The invariant has 1–2 sites total (just code-review it).
- Behavioral tests already cover every site (no proxy needed).
- The invariant is too fuzzy to encode in regex or AST queries.

## Anatomy

Every structural test has four pieces:

1. **Mutation patterns** — regex or AST queries that find every site of
   the "X" half of the invariant. Example: `\bgit\.commit\(` finds
   every git commit call.
2. **An allow-list / classification table** — explicit entries that
   classify each `(file, category)` pair the patterns find. New site
   not in the list = test fails.
3. **Verification pointers** — `verifiedByTests: ["..."]` per
   classified entry, naming the behavioral or integration test that
   pins the claim.
4. **Canaries** — meta-tests that assert the verification pointers
   actually exist on disk and that the regex still matches expected
   sites (catches scaffolding decay).

## Discipline

- **Every allow-list `reason` is a re-auditable claim.** Stale reasons
  are decay. Re-audit periodically.
- **`verifiedByTests` is required for the active classifications.**
  The integration test pins the claim; removing the claim breaks the
  test first.
- **Scaffolding is software too.** Extractors, regex helpers, AST
  walkers — add unit tests covering canonical hard-case inputs.
- **Universal-language claims are suspect.** "Every caller does X" /
  "All sites are classified" — verify with grep before believing.
- **"No current sites; deferred" requires a grep citation.** Without
  the citation, the deferral is optimism, not discipline.

## Adversarial review

Each closeout claim ("we've added the structural test for X") is a
proxy for the invariant. Proxies decay. Run a fresh-eyes review
periodically: list the proxies the target relies on, grep for shapes
that match the invariant but evade the regex (alias imports, wildcard
imports, alternative APIs, mirror-form variants), re-read each
allow-list reason against the file's current behavior, write failing
tests for real findings or cite grep for deferred blindspots.

The `residuals-review` skill implements this cycle and auto-terminates
when two consecutive reviews find nothing.

## Common pitfalls

- **Regex catches the shape but not the behavior.** Example: `\bawait
  writeFile\(` matches direct calls but not aliased ones (`writeFile
  as fs1`) or wildcard-imported ones (`fsp.writeFile`). Audit alias
  shapes per file when the import surface allows aliasing.
- **Allow-list classifications drift from reality.** A `bump-here`
  entry written against `saveFile` becomes dishonest when `saveFile`
  is refactored away. Re-audit reasons.
- **Scaffolding bugs hide real evasions.** An extractor that mishandles
  a signature shape silently passes affected files. Unit-test the
  scaffolding against canonical hard cases.
- **Convergence claims overstate.** "All callers go through X" is
  rarely true on first inspection — peer entry points hide the truth.
  Make convergence structural (delegation, type-system enforcement)
  not honor-system.
