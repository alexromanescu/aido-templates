---
section: active-work
stack: default
version: 20
target: docs/active-work.md
order: 10
---
# Active Work

Guidance lives in this managed block; the live focus is everything below it. Read the focus when resuming work. Keep it under about 100 lines and rewrite rather than append.

- Record the **goal**, **constraints**, an **ordered sequence** of session-sized slices each marked `(S)`, `(M)`, or `(L)`, the **next action**, and the commands to run and verify the focus. Link to roadmap rows and briefs instead of copying them. Preserve owner constraints across every rewrite unless the owner changes them.
- For aido Program execution, keep exactly one `## Goal` and one `## Guardrails` heading, the sequence, and every `<!-- aido:work-item … -->` identity, brief reference, dependency, and completion gate. Follow the program's ownership rules for cursor updates, including completion clearing.
- Keep only the latest outcome needed to resume. History, technical evidence, and lessons go to the roadmap, decision log, or subsystem doc.
- Finish each slice before the next starts: plan it just in time and split it before coding if it will not fit, build it on its own branch, have it reviewed with fresh eyes (never by whoever built or directed it), verify, merge, and record it, then refresh the next action so a session can end after any merge. Never stack unmerged slices. When agents do the building and no aido Program dispatches the slices, a session continues through the remaining assigned slices and stops only for an owner decision, a redesign under the patch-loop rule that would change the agreed direction, a blocking failure it cannot fix within the assignment, or low context or budget. A finished milestone, a progress summary, or a question that does not block the work is not a reason to stop: note it and continue.
- If blocked, keep the unfinished part visible as the next step and name the blocker; recording it does not replace work that can be completed now.
- **When the focus is fully complete, delete everything below this block** and record completion in the roadmap. Block-only means no active focus: never leave a "done" note below it, and never clear it while work remains.

A small non-Program focus may hold only a goal, a sized sequence, and a next action. An unrelated quick fix need not change this file.
