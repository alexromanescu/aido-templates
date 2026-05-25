---
category: system
description: Bug-hunt session prompt — copied to the clipboard by the "Bug Hunt" button on the Project page; drives a multi-agent failing-test-first sweep.
variables: [projectName, claudeMd, roadmapSummary, testCommand, date]
---
# Bug Hunting Session — {{projectName}}

Run a thorough bug hunt on this project using an agent team. Find real bugs — not style issues or hypothetical concerns. Every bug must be proven with a failing test.

This session runs on the **main working tree** (not a worktree) so the report is immediately visible. The flow has two phases separated by a human gate:

1. **Hunt** — spawn hunters, collect failing tests, write the report, commit.
2. **Pause** — stop and wait for the human to review the report.
3. **Fix** (only if approved) — apply fixes in this same session; don't start a new one.

## Project Context

{{claudeMd}}

## Roadmap State

{{roadmapSummary}}

## Instructions

1. **Create a team** called `bug-hunt`

2. **Create tasks** for three hunting passes:
   - **Unit hunting** — probe services, utilities, pure functions with edge cases, boundary conditions, malformed input (empty strings, nulls, special characters), error paths the existing tests miss
   - **Integration hunting** — trace API endpoints end-to-end (input validation → service → response), test sequences (create → read → update → delete), concurrent mutations, error propagation between layers
   - **E2E hunting** — simulate full user workflows through the API, test failure modes, state inconsistencies after partial failures, file system edge cases (missing dirs, concurrent access)

3. **Spawn three teammates** (general-purpose agents): `unit-hunter`, `integration-hunter`, `e2e-hunter` — assign each their task

4. **Each hunter** should:
   - Run existing tests first to confirm a clean baseline: `{{testCommand}}`
   - Read the code for their scope to understand what it does — including nearby comments, git blame on the suspicious lines, and existing tests that cover the area. Code that looks wrong often reflects a deliberate choice the author made for reasons that aren't visible at first glance.
   - Before flagging a suspected bug, satisfy **both** checks:
     - **Intent check** — is this actually broken behavior, or a deliberate design decision? Signs of intent: tests that lock in the current behavior, comments explaining the choice, a commit message justifying it, a defensive guard that exists precisely to handle this case. If the behavior is *intended*, it is not a bug — skip it.
     - **Fragility check** — would a naive fix destabilize something carefully engineered nearby? Note any tight coupling, ordering constraints, invariants, or subtle interactions with other code. This goes into the report's root-cause column so the fix session knows what to be careful of.
   - Write failing tests to `tests/bugs/bug-NNN-description.test.ts` — each with this header:
     ```typescript
     /**
      * BUG-N: [Title]
      * Problem: [What's broken]
      * Reproduction: [Input/steps that trigger it]
      * Expected: [What should happen]
      * Actual: [What happens instead]
      * Root cause: [Why it happens — and any nearby fragility a fix must respect]
      * File: [path/to/file.ts:line]
      */
     ```
   - Only report bugs they can prove with a failing test AND that pass both intent/fragility checks
   - Don't modify source code — only add test files
   - Mark their task complete when done

5. **After all hunters finish**, compile findings into `docs/bug-reports/{{date}}.md` (create the directory if it doesn't exist):

   ```markdown
   # Bug Report — {{date}}

   ## Summary
   Found N bugs: X critical, Y important, Z minor.

   ## Overview

   | ID | Severity | Description | Root Cause |
   |----|----------|-------------|------------|
   | BUG-1 | Critical | One-line what's broken | One-line why, + any fragility nearby |
   | BUG-2 | Important | ... | ... |

   ## Bugs

   ### [BUG-1] Short title
   **Severity:** Critical | Important | Minor
   **Location:** \`path/to/file.ts:line\`
   **Description:** One-sentence what's broken.
   **Impact:** What goes wrong for the user.
   **Root cause:** Why it happens. Call out any careful-but-not-careful-enough engineering nearby that a fix needs to preserve.
   **Test:** \`tests/bugs/bug-001-description.test.ts\`

   ## Fix Priority
   1. **[BUG-X]** — fix first, highest impact
   2. **[BUG-Y]** — fix next
   3. **[BUG-Z]** — fix when convenient
   ```

6. Commit the report + all failing tests together, then shut down the team.

7. **Pause for human review.** Print the Overview table to the terminal and ask:
   > I found N bugs. Review `docs/bug-reports/{{date}}.md`, then reply with one of:
   > - `fix all` — apply fixes for every bug
   > - `fix BUG-X, BUG-Y, …` — apply fixes for specific bugs only
   > - `done` — stop here, no fixes
   >
   > Any bug you want to **dismiss** (disagree with the finding, or decide it's intended behavior), tell me — I'll delete its test file and mark it in the report.

   Do not proceed past this step without an explicit response.

8. **Fix phase (only if the user approved fixes).**
   - For each approved bug:
     1. Read the failing test and the report's root cause + fragility notes.
     2. **Run the bug test first and confirm it fails for the documented root cause** — not for a typo, missing import, stale fixture, or unrelated error. The hunter wrote this test in a different session; you must verify the RED is the *right* RED before patching. If the failure mode doesn't match the report, stop and investigate — re-read the code, update the report, or escalate. Do not patch a test that's failing for the wrong reason.
     3. Apply the minimal fix that makes the test pass without breaking the fragile engineering around it.
     4. Run `{{testCommand}}` — the bug test plus the full suite must pass.
     5. Commit with message `fix: BUG-N <short title>`.
   - For each dismissed bug: delete the test file and edit the report to mark the row `Dismissed: <one-line reason>`.
   - When all approved bugs are fixed, run the full test suite one last time and report the result.

## What counts as a bug
Wrong results, crashes on edge input, data corruption, race conditions, security issues (path traversal, injection), API contracts that don't match behavior, silent swallowed errors — **and only if the behavior is unintended**.

## What is NOT a bug
Missing features, style preferences, theoretical issues without a failing test, patterns you disagree with but that work, behavior that is deliberate (tests, comments, or commit history show it's by design).
