---
name: debugging
description: Use when a fix didn't work, a test fails for an unclear reason, behavior contradicts your mental model, or an error surfaces deep in a multi-component system — before proposing or applying the next fix.
---

# Debugging

**Don't patch from a guess.** Reproduce, gather the evidence, and form
a falsifiable "X happens because Y" hypothesis before changing
production code; record the root cause once the evidence establishes
it. A fix applied to a guess is thrashing:
when it fails you've learned nothing, and when it passes you don't
know what you fixed.

## Establish the facts first

- **Reproduce before explaining.** If you can't trigger it reliably,
  gather more evidence — don't theorize from one occurrence.
- **Read the entire error**: full message, full stack trace, line
  numbers, exit codes. The answer is often literally printed there.
- **Diff what changed**: `git log`/`git diff` since it last worked,
  dependency bumps, config, environment. Most bugs are recent.

## One hypothesis at a time

State the hypothesis explicitly, make the smallest change that tests
it, run, read the actual output, then decide. Never stack candidate
fixes in one run — a green result won't tell you which change worked,
and a red one contaminates the next hypothesis. If the hypothesis
dies, revert its change before forming the next one.

## Multi-component failures

When the failure crosses boundaries (UI → API → service → DB,
CI → build → deploy), don't patch where the error *surfaces*.
Instrument the boundaries — log what enters and exits each layer —
and run once to locate the layer where good data turns bad. Then
investigate that layer only. Fix at the source, not at the symptom.

## The three-failed-fixes rule

Count your fix attempts for the same symptom. After the third failed
fix, stop — the bug is not where you think it is, and attempt #4 from
the same mental model will fail the same way. Signals the problem is
structural rather than local: each fix surfaces a new symptom
somewhere else; the fix keeps needing a wider refactor; you can't
explain why the previous attempt didn't work. At that point re-derive
the root cause from scratch or question the design itself, and report
the situation instead of continuing to patch — re-deriving is part of
the assignment, not a reason to abandon it.

## "No root cause" verdicts

Only after the above may you conclude the cause is external (flaky
environment, timing, third-party). Most such verdicts are incomplete
investigation. If it genuinely is external: handle it explicitly
(retry, timeout, surfaced error), and record what you ruled out.

## Exit

The fix ships with a regression test that fails for the documented
root cause and passes with the fix. If your project has
`docs/process/bugs.md`, follow its procedure and lifecycle.
