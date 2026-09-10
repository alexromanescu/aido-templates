<!-- managed:process-bugs v=6 -->
# Bug-Fix Process

Track bugs as `BUG-NNN: <title>` rows in the roadmap, following `docs/process/roadmap.md`. Fix defects needed for the assigned outcome now; record unrelated defects without expanding the assignment.

1. **Reproduce and trace the cause.** If causality remains unclear or an earlier fix failed, use the `debugging` skill when available.
2. **Add or extend a regression test** at the project's normal test location and layer. Reference the bug ID and reproduce the observable symptom. Run it against the unfixed behavior and confirm it fails for the reported defect, not a fixture or import error.
3. **Apply the smallest durable correction.** Check for nearby instances of the same cause when there is evidence of a shared defect.
4. **Verify the fix.** Run the regression test and the relevant project checks. Broaden testing when the affected dependencies or results justify it.
5. **Close the bug in the same commit.** Move its completed row and `Done` date to Phase 99 as the roadmap process specifies. Keep technical evidence in the test or project record, and report the practical outcome to the user.

For ordering-dependent defects, prefer a deterministic simulation and use `testing-by-simulation` when available. If an automated regression is impractical, record the specific constraint and run the strongest repeatable substitute. Close only if that establishes the required outcome; otherwise keep the verification blocker visible. Do not hand testing to the user.
<!-- /managed:process-bugs -->