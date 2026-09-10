<!-- managed:active-work v=16 -->
# Active Work

Guidance lives in this managed block; the live focus is everything below it. Read the focus when resuming work. Keep it under about 80 lines and rewrite rather than append.

- Record the **goal**, **constraints**, an **ordered sequence** of session-sized slices each marked `(S)`, `(M)`, or `(L)`, the **next action**, and the commands to run and verify the focus. Link to roadmap rows and briefs instead of copying them. Preserve owner constraints across every rewrite unless the owner changes them.
- For aido Program execution, keep exactly one `## Goal` and one `## Guardrails` heading, the sequence, and every `<!-- aido:work-item … -->` identity, brief reference, dependency, and completion gate. Follow the program's ownership rules for cursor updates, including completion clearing.
- Keep only the latest outcome needed to resume. History, technical evidence, and lessons go to the roadmap, decision log, or subsystem doc.
- Complete the assigned slice before moving on. If blocked, keep the unfinished part visible as the next step and name the blocker; recording it does not replace work that can be completed now.
- **When the focus is fully complete, delete everything below this block** and record completion in the roadmap. Block-only means no active focus: never leave a "done" note below it, and never clear it while work remains.

A small non-Program focus may hold only a goal, a sized sequence, and a next action. An unrelated quick fix need not change this file.
<!-- /managed:active-work -->
## Goal
Roll out lean guidance v2 (merged to `main` on 2026-09-10) to every aido-managed project so each carries the 3 CLAUDE.md blocks, 2 process docs, and 4 standard skills, with no orphan blocks or files left behind. Roadmap row: Quick Updates → "Roll out lean guidance v2 to consuming projects".

## Guardrails
- Version updates for existing keys go through aido sync (`/dashboard` drift), not hand edits. Only orphan blocks and orphan files are removed by hand, and only after the sync has landed, so no consumed block points at a deleted file.
- One commit per project, verified before moving to the next. Never push; the owner pushes.
- Do not restyle or trim project-owned content while there.

## Sequence
1. aido: sync the 7 drifted sections first, then remove the orphan `documentation-sync` block and `docs/process/{bugs,doc-sync}.md` (aido is a node project, so its `conventions-stack` block stays); add `structural-invariant-testing` (claude+codex, project scope) to `.aido/agent-governance/requirements.json` and extend `expectedProjectTargets` in `tests/integration/agent-governance-project-policy.test.ts` accordingly; run `npm test`. (M)
2. aido-ops, mara, q1dms, q1erp: same sync + orphan removal (`documentation-sync`, `help`, `seeding`, non-node `conventions-stack`, `docs/process/{bugs,doc-sync,help-sync}.md`); run each project's required checks. (M)
3. This repo: sync its own CLAUDE.md, docs/tests.md, docs/active-work.md, docs/process/*.md blocks to current versions. (S)
4. Governance: open `/skills/governance`, preview the plan (expect: install `test-design` + `debugging`; retire `frontend-tests`, `testing-by-simulation`, `test-hardening`, `structural-tests` from the global slot), apply, re-observe. (S)
5. Close the roadmap row with its Done date and delete this focus. (S)

Blockers for rollout: none

## Next action
Start with step 1 in a worktree under `~/Work/Projects/aido/.worktrees/`.

## Run it
This repo: `node --test tests/**/*.test.mjs` · aido: `AIDO_TEMPLATES_ROOT=<templates checkout> npm test`
