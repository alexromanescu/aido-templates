<!-- managed:active-work v=15 -->
# Active Work

The permanent guidance is inside this managed block; the live focus is everything below it. Read the focus when resuming work. Keep it within approximately 80 lines, rewriting rather than appending.

- Record the **goal**, **constraints**, **ordered sequence**, **next action**, and **essential references**. Preserve owner constraints across every rewrite unless the owner changes them. Include the commands needed to run and verify this focus, or a direct reference to where they are documented. Link to roadmap rows and detailed briefs instead of copying them.
- Each sequence item is one session-sized slice: related work that can be implemented, verified, reviewed when required, and merged together. Keep each `(S)/(M)/(L)` size marker. For aido Program execution, retain exactly one `## Goal` and one `## Guardrails` heading, the sequence, and every `<!-- aido:work-item … -->` identity, brief reference, dependency, and completion gate. Follow the program's ownership rules for cursor updates, including completion clearing.
- Keep only the latest outcome needed to resume. Put history, technical evidence, and lessons in the roadmap, decision log, or relevant subsystem doc. A completed item needs at most one short outcome and a pointer.
- Complete the assigned slice before moving on. If blocked, keep the unfinished part visible as the next step and state the blocker; recording it is not a substitute for work that can be completed now.
- **When the focus is fully complete, delete everything below this block** and record completion in the roadmap. Block-only means no active focus; never leave a "done" note below it or clear it while work remains.

A small non-Program focus may contain only a goal, sized sequence, and next action when there are no additional constraints or execution details to carry. An unrelated quick fix need not change this file.
<!-- /managed:active-work -->
## Goal
Roll out lean guidance v2 (commit on `main`, 2026-09-10) to every aido-managed project so each carries the 3 CLAUDE.md blocks, 2 process docs, and 4 standard skills, with no orphan blocks or files left behind. Roadmap row: Quick Updates → "Roll out lean guidance v2 to consuming projects".

## Guardrails
- Version updates for existing keys go through aido sync (`/dashboard` drift), not hand edits. Only orphan blocks and orphan files are removed by hand.
- One commit per project, verified before moving to the next. Never push; the owner pushes.
- Do not restyle or trim project-owned content while there.

## Sequence
1. aido: sync 7 drifted sections; remove orphan `conventions-stack` (aido is node, keep it), `documentation-sync` block, `docs/process/{bugs,doc-sync}.md`; add `structural-invariant-testing` (claude+codex, project scope) to `.aido/agent-governance/requirements.json` and extend `expectedProjectTargets` in `tests/integration/agent-governance-project-policy.test.ts` accordingly; run `npm test`. (M)
2. aido-ops, mara, q1dms, q1erp: same sync + orphan removal (`documentation-sync`, `help`, `seeding`, non-node `conventions-stack`, `docs/process/{bugs,doc-sync,help-sync}.md`); run each project's required checks. (M)
3. This repo: sync its own CLAUDE.md, docs/tests.md, docs/active-work.md, docs/process/*.md blocks to current versions. (S)
4. Governance: open `/skills/governance`, preview the plan (expect: install `test-design` + `debugging`; retire `frontend-tests`, `testing-by-simulation`, `test-hardening`, `structural-tests` from the global slot), apply, re-observe. (S)
5. Close the roadmap row with its Done date and delete this focus. (S)

Blockers for rollout: none

## Next action
Start with step 1 in a worktree under `~/Work/Projects/aido/.worktrees/`.

## Run it
This repo: `node --test tests/**/*.test.mjs` · aido: `AIDO_TEMPLATES_ROOT=<templates checkout> npm test`
