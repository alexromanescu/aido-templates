---
name: test-hardening
description: Use when tests may pass without exercising the intended behavior; when validating safeguards for permissions, persisted-data integrity, concurrency, recovery, or other critical invariants; or when asked to harden a test suite. Not a prerequisite for every passing test run.
---

# Test Hardening

Choose a targeted technique for the suspected gap. These are alternatives or complements, not a mandatory checklist for every change.

For behavior changes involving permissions, persisted-data integrity, concurrency, or recovery, identify the affected safeguards and their failure scenarios before choosing checks. Examples include denied access, partial writes, overlapping updates, and interrupted work followed by recovery. Exercise the scenarios relevant to the change, using existing coverage where it proves them. Keep this evidence in the test or project record; a small diff does not make these risks routine.

## Demonstrate a useful failure

For a regression test or critical invariant, confirm the test fails when the guarded behavior is broken: run against the unfixed code or apply a targeted mutation. The failure must come from the defect, not an import, fixture, or syntax error. Confirm a mutation actually applied before interpreting its result, and confirm restoration afterwards. A demonstrated regression failure need not be followed by a redundant mutation of the same behavior.

## Mutation testing

When false-green coverage remains a concern, scope a mutation tool to the relevant behavior or module. Inspect surviving mutations: some reveal missing assertions or unexercised behavior; others are equivalent changes that cannot affect the contract. Strengthen tests for meaningful survivors. Do not chase every mutant or a global score, and do not couple assertions to implementation details merely to kill a mutant.

## Branch and condition coverage

Use coverage to locate unexercised decisions in risky logic. Test meaningful outcomes and boundary cases. Distinguish legitimate unreachable paths from missed cases; do not add a universal coverage threshold merely because a file changed.

## Render warnings and accessibility

When UI tests hide relevant warnings, make unexpected warnings fail in the render harness. Keep explicit exceptions for known benign messages; do not blanket-mute output. Add accessible-role, label, and state assertions or an accessibility checker where they address the changed behavior. DOM checks cannot prove real browser layout.

## Finish

Run the improved tests and relevant project checks. Stop when the identified gap is covered. Source-invariant questions that tests cannot settle may warrant `residuals-review`; ordinary test hardening does not require a separate audit.
