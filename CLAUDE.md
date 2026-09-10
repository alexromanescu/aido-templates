# aido-templates — Template Content & Authoring Guide

This repo contains the template content distributed by the aido app: managed sections, project scaffolds, governed skill sources, and stack-detection rules. The aido app reads from this folder at runtime and edits it via its `/templates` page UI. It is an **external repo, independent of the aido source tree** — aido locates it per-instance via `AIDO_TEMPLATES_ROOT` env var, the `templatesFolder` SQLite setting (set in `/settings → General`), or the default `~/Work/Projects/aido-templates`. The intent is to keep logical agent guidance and its referenced docs in sync across applications and propagate learnings between them, supporting structured agent-driven development across multiple apps.

Logical agent guidance has one physical `CLAUDE.md` authority and a portable `AGENTS.md -> CLAUDE.md` compatibility alias. That shared guidance is distinct from harness-specific runtime prompts, room protocols, provider/CLI behavior, and session material; preserve those native distinctions instead of generalizing them through the alias.

## Layout

- `managed-sections/` — Sectioned Markdown blocks injected into projects' `CLAUDE.md` (or other target files via frontmatter `target:`). One file per section + per stack variant.
- `*-default.md` (repo root) — Project scaffolds (`claudemd`, `roadmap`, `deploy`, `active-work`, `agent-card`, `tests`). Written into a project at creation/init time.
- `skills/` — Canonical governed custom-skill sources. Every immediate skill folder is registered in `agent-governance/catalog.json`; one source may back one or more explicitly selected harness realizations.
- `agent-governance/catalog.json` — Portable desired-policy catalog for semantic capabilities, harness realizations, and profiles. It contains no live host observations and does not itself install or enable anything.
- `stacks.json` — Stack-detection rules and metadata; gates which managed-section variants are offered to each project.

## Managed sections

Each file under `managed-sections/` contains the body of one managed block. The aido app injects it between markers in the target file:

    <!-- managed:<key> v=<N> -->
    ...body...
    <!-- /managed:<key> -->

### Frontmatter

Every managed-section file MUST start with YAML frontmatter declaring at least `section`, `stack`, and `version`; `target:` is optional.

```yaml
---
section: testing
stack: default
version: 4
target: CLAUDE.md
---
```

- `section` — the managed-block key written to the marker (`<!-- managed:testing v=4 -->`). Must match the filename prefix.
- `stack` — `default` is the fallback; any other value (`node`, `go`, `rust`, `python`, …) is a stack-specific override picked by the projects module after stack detection.
- `version` — bump on every meaningful content change. Bumping triggers drift propagation across every aido-managed project on the next sync — that is the intended flow, so bump aggressively and let the per-project drift surface (in `/dashboard`) decide when to absorb the new version.
- `target` — destination path inside each consuming project (relative to the project root). Defaults to `CLAUDE.md`. May point at a docs subfolder; the consuming project just needs the file to exist (or willingness to create it during sync).

### Stack variants

Add a `-<stack>.md` suffix (e.g., `conventions-node.md`) to override the default for a detected stack. The `-default.md` file is the fallback when no stack-specific variant matches the project.

A new stack value (`-deno.md`, `-elixir.md`, …) is only useful once a matching entry exists in `stacks.json` — without it, no project will ever match that variant.

### Avoiding heading collisions with project content

The H2 heading in a managed section's body becomes a visible H2 in every consuming project's target file. Choose a heading specific enough that no project would naturally name a free-form section the same thing — otherwise two H2s with the same name end up side by side after sync, confusing TOC, navigation, and readers.

Rule of thumb: prefer a qualifier that names the *source* of the rules (e.g., `## General Conventions` for the cross-project shared standards) over a bare domain word a project would pick for its own section (`## Conventions`, `## Notes`, `## Conventions and guidelines`). Projects keep their own section as-is; the managed one carries the qualifier.

Worked example: the `conventions` section was renamed from `## Conventions` to `## General Conventions` in v19 because projects like mara and q1dms already had their own `## Conventions` block (touch-target rules, UUID format, domain-specific conventions) that don't belong in the shared template. The qualifier lets both coexist cleanly in the same `CLAUDE.md`.

### Whole-doc process sections (`process-*`)

The `process-*` sections (`process-roadmap`, `process-git-workflow`) each target a file under `docs/process/` and own the **entire** file: the H1 title and all content live inside the managed block, and there is no scaffold — `syncSection` creates the target file (including the directory) when it doesn't exist. They hold activity-scoped procedure the lean CLAUDE.md blocks point at with trigger-shaped one-liners ("Read `docs/process/roadmap.md` before editing it"). Keep that division: per-turn invariants stay in the CLAUDE.md block; multi-step, activity-triggered procedure goes in the `process-*` doc. Add a new process doc only for procedure that is both multi-step and app-parsed or safety-critical; everything else belongs in a skill (loaded by trigger, no pointer needed) or in one line of the block.

### Budgets (enforced by `tests/managed-sections/budget.test.mjs`)

Every clause in an always-loaded block costs every turn in every project. The three CLAUDE.md-targeted default blocks stay under **800 body words combined** (they landed at ~770 after the 2026-09-10 review restored five dropped rules; the ceiling is not headroom to fill); no single managed section exceeds **700 body words**. Before adding a clause, remove one, move the material into a skill, or replace it with a mechanism (a hook, a parity check, an app-owned format). The same test file checks that every `docs/process/*.md` pointer in templates, scaffolds, and skills resolves to an existing `process-*` section, that `agent-governance/catalog.json` and `skills/` agree exactly, and that no retired skill name survives outside this repo's own consumed blocks. When authoring here, the vendored `writing-for-agents` skill under `.claude/skills/` (from mattpocock/skills, MIT) is the reference for pointer wording and progressive disclosure.

## Scaffolds

Files at the repo root named `<key>-default.md` are project scaffolds — written into a new project at creation or init time. They are NOT managed sections: no version number, no drift propagation. Once written into a project they belong to that project's owner to edit freely.

### Frontmatter

```yaml
---
target: docs/agent-card.md
description: Outward-facing agent identity for cross-project rooms
variables: [name]
init: true
---
```

- `target` — destination path inside the project (relative to project root).
- `description` — short, human-facing label shown in the aido `/templates` editor.
- `variables` — list of `{{var}}` names the body uses. Currently the renderer supports `name`, `today`, `description`. Listing them in frontmatter is documentation only; the renderer substitutes by what the body contains.
- `init: true` — the file is also writable on demand from a project's "Initialize" UI (re-runnable). If `false` or absent, the scaffold is only written at project creation.

### Variable substitution

Scaffold bodies support `{{name}}`, `{{today}}`, `{{description}}` — substituted at render time. Values are inserted verbatim; the renderer does no escaping, so never compose protocol markers, command-line flags, or shell quoting from `{{var}}` content. Treat any externally-supplied value as crossing a security boundary.

### Referencing managed sections in scaffolds

A doc that hosts a managed section — a doc other than `CLAUDE.md`, such as `docs/tests.md` — has a scaffold whose body carries an empty, version-less marker pair for that section (`<!-- managed:KEY -->` immediately followed by `<!-- /managed:KEY -->`), never a copy of the section content. The scaffold owns the doc's structure (frontmatter, title, intro, where the block sits, the project-specific tail); the `managed-sections/` template is the single source of truth for the block's content.

At project init aido writes the scaffold, then runs sync, which fills every empty marker pair with the current managed-section content by reference. Thereafter the block is drift-tracked and kept current by sync like any managed block. This is the same path that populates `CLAUDE.md` itself — `claudemd-default.md` carries no managed blocks at all; its sections are inserted by sync at their canonical `order`.

- **Version-less marker.** Write `<!-- managed:KEY -->` with no `v=N`. Sync treats a version-less block as "needs fill"; a version would let sync's skip-guard mistake the empty block for already-current and never fill it.
- **Never embed a copy.** One source of truth — the `managed-sections/` template. `tests/modules/templates/scaffold-alignment.test.ts` enforces it: every `<!-- managed:* -->` block in a scaffold must be empty.
- The empty pair also pins *where* the section lands (e.g. between the intro and a project-specific tail). `tests-default.md` is the working example: frontmatter + title + intro + an empty `<!-- managed:tests -->` pair + a project-owned tail (runners, commands, isolation, test-doc links).
- **When the host doc's *emptiness* is a runtime signal, put everything permanent (title, intro, guidance) *inside* the block and keep the scaffold a bare marker pair** — otherwise the title/intro left outside the block read as content and defeat the signal. `active-work-default.md` is the working example: aido treats `docs/active-work.md` as "no active focus" when nothing remains after stripping managed blocks (`roadmap.getActiveWork` isEmpty + the `composeActiveWorkFromTasks` guard), so the title + guidance live in the `active-work` managed section and the scaffold is just the empty `<!-- managed:active-work -->` pair. The live focus is the text written *below* the block; it's wiped on completion (`completePass` cleared), leaving the block.

## Engine prompts and room templates live in aido, not here

The `prompts/` and `rooms/` folders moved into the aido repo (2026-09-10) as
`engine/prompts/` and `engine/rooms/`. They are engine contracts — the system
prompts the teamlead and workers receive, and the room-protocol prose in JOIN
payloads and message envelopes — consumed by nothing but aido, so they are
versioned, tested, and deployed with the code that reads them. A save in a UI
can no longer change a deployed engine without a test run and a deploy.

Edit them in `~/Work/Projects/aido` under `engine/`; their contract tests live
there too (`tests/structural/engine-prompt-contract.test.ts`,
`tracked-review-contract.test.ts`, `rooms-templates-loader.test.ts`). aido's
`/prompts` page still shows them, read-only.

This repo keeps what propagates across applications: managed sections,
scaffolds (including `deploy-default.md`), governed skill sources with the
catalog, and `stacks.json`.

## Skills

Folders under `skills/` are the canonical governed sources for custom skills. Each is a directory containing `SKILL.md` with YAML frontmatter (`name`, `description`) and a Markdown body. Claude Code and Codex CLI realizations are separate catalog records even when they share this source; the native skill ID must match the folder and frontmatter `name`.

`agent-governance/catalog.json` owns the semantic capability mapping, each realization's allowed scopes, and the governed profile requirements. Every immediate `skills/*/SKILL.md` source must be represented exactly once at the capability level, and a catalogued custom skill source must exist here. The catalog records desired policy only: do not add absolute host paths, observed versions, caches, usage state, or current enablement. A desired realization is a target state, not evidence that a live harness can execute the source; reconciliation must verify harness compatibility before deployment.

In aido, `/skills` is the source-authoring and read-only physical-observation surface; host capability management belongs only to `/skills/governance`. Governance reads current installation and activation directly from Claude/Codex configuration and installation locations plus the selected project folders, then re-observes those sources after an approved action. Do not add a fallback cache registry, a second configuration writer, or SQLite capability state.

For new or normalized sources, lead the `description` with "Use when …" and enumerate the trigger shapes (user phrases, code shapes, file types) so the matcher fires reliably — keep the description a selection trigger (with exclusions where selection is ambiguous), not a table of contents. Structure: a compact `SKILL.md` carrying the procedure; deep background in `references/` files linked from the exact section that needs them; fragile deterministic command sequences as executable files in `scripts/` — run, not transcribed. Skills don't restate root-guidance policy — with one exception: a safety invariant a globally shipped skill needs when running in repos without the managed corpus (e.g. residuals-review's scratch-path rule) may be dual-homed — same invariant, stated no weaker than its managed source. Globally allowed shared sources must be harness-neutral and project-agnostic except where they describe a real governed runtime fact; a project-only source may encode that project's procedure and must declare only project scope. Existing sources may predate this contract; normalize them and verify harness compatibility before deploying a newly selected realization. If a shared procedure has project-specific tails (canonical examples, runner choice), record those in the project's own docs rather than in the global skill. When adding or renaming a canonical skill, update its semantic capability, harness realizations, allowed scopes, and applicable profile requirements in the catalog in the same change. A project-only capability stays out of global profiles until a project declaration selects it.

The catalog is authoritative; this current-source summary is explanatory:

- Standard global profile: `debugging/`, `test-design/`, `residuals-review/`, and `program-prep/`.
- Catalogued but not selected by `standard`: `structural-tests/` (select it per project where structural scans exist, such as aido).
- Project-only: `verify/`, selected by aido's project declaration for built running-app verification.

Skill directories may contain scripts, references, executables, or binary assets. Validate `SKILL.md` as text/frontmatter; hash and copy every other entry as opaque bytes.

## stacks.json

Defines stack fingerprint rules. Each entry pairs a stack `name` with `detectFiles` — file paths whose presence in a project marks it as that stack. Example:

```json
{ "name": "node", "detectFiles": ["package.json"] }
```

The aido projects module reads this file to decide which managed-section variants and scaffold bundles to offer. Add new stacks here.

## Editing flow

The deployed aido app at `~/Apps/aido/` is the primary editor:

- `/templates` page in the aido UI: per-file editor for managed sections (Single + Compare modes) and scaffolds. Saves run through `safeWriteAndCommit` — autocommits land in this repo's `.git` (because git resolves `.git` from the edited file's directory).
- For deeper authoring sessions, open `~/Work/Projects/aido-templates`, then launch the intended harness (`claude` or `codex`).

Pushes to `origin/main` are user-initiated. The aido dev folder (`~/Work/Projects/aido/`) resolves this repo live like any instance (`AIDO_TEMPLATES_ROOT` env → `templatesFolder` setting → the default path) — there is no sync step; edits here reach dev runs and deployed spawns immediately.

## Style conventions for managed-section content

- Start with the **rule** (one or two lines), then explain.
- Use `### Rule` and `### Reference` subsections sparingly — only when there's enough material to warrant them.
- Cross-link to deeper docs with relative paths (`docs/<topic>.md`) when the section's host project is expected to have them. Mark such references as conditional — "if your project has `docs/X.md`, ..." — because managed sections appear in projects with very different doc footprints.
- Keep prose compact and scannable, in complete sentences; state each rule once, at its narrowest useful scope. Managed sections are read as in-session agent guidance, so favor a tight bulleted list over a diagram or visual flourish.
- **Portability boundary.** Shared content defines project facts, authorization, invariants, required evidence, success criteria, and output expectations. It never prescribes model names, effort settings, provider-native tools/channels, permission mechanics, or subagent orchestration — those live in harness configuration. Add a provider overlay only if fresh sessions in both harnesses show a repeatable contradiction that simpler shared wording cannot resolve — and then duplicate the smallest mechanism, never the policy corpus.

<!-- managed:conventions v=83 -->
## General Conventions

### Ownership and scope

- **Own the work through completion.** The owner is not a developer or tester. Decide, build, resolve problems, and verify the result yourself. An assignment is the whole agreed batch; never replace work you can finish with recommendations or follow-up tasks.
- **Respect the requested mode.** Review, explanation, and planning requests get inspection and a report; implement only when asked. For implementation, proceed without routine permission checks. Ask only for missing essentials, a material scope decision, or authorization for an irreversible or costly action; given authorization holds for its agreed scope.
- **Keep unfinished work visible.** Record a blocked item and what it needs in `docs/active-work.md` when present, with durable work in the roadmap, and continue independent in-scope work. For a read-only request, report the blocker without editing records. Never mark incomplete work done or defer required work to close an assignment.

### Repository safety

- **Use current evidence.** After resumption or context compaction, check the working directory, branch, and Git status. Run a prerequisite check separately from the consequential command it guards.
- **Prefer the simplest durable solution.** Follow established project patterns, avoid speculative abstractions, remove code your change makes unused, handle failures explicitly, and validate untrusted data at system boundaries.
- **Follow `docs/process/git-workflow.md`** for isolation, checkpoints, merging, pushing, and cleanup. Pushes require an owner request.
- **Preserve guidance ownership.** Edit root guidance (`CLAUDE.md`, aliased by `AGENTS.md`) only when explicitly requested. Edit managed content in its canonical templates, never in consuming files; session learnings go to project docs.

### Communication

- **Report for the owner:** the practical result, what changed, and what happens next, in plain language they can act on without opening another document. Say whether work was investigated, implemented, or verified. Keep mechanisms, test counts, and review history in project records. Label estimates.
- **When the owner is needed** (scope, cost, risk, or product behavior), state what is blocked, the practical consequence, and a recommended decision; ask only for the missing input or authorization.
- **Close explicitly.** When the agreed work is complete and verified, report what now works, where it landed (commit, branch, deployment), that records are updated, and what a fresh session resumes from.
- **Give browser artifacts a verified full URL** (the LAN address for a LAN-hosted preview).
<!-- /managed:conventions -->
<!-- managed:roadmap v=21 -->
## Shared Work Tracking

- `docs/roadmap.md` is the durable backlog and completion record. Read `docs/process/roadmap.md` before editing it; the app parses its format.
- `docs/active-work.md`, when present, records the current focus and next action. Read it at session start and refresh it when advancing that work, following its guidance block. The assignment determines scope; the cursor does not authorize unrelated work.
- **Keep documentation true in the same commit**, in-app help and seed data included: correct whatever your change makes inaccurate or incomplete (new behavior, requirements, limitations) in the docs the project has, following `docs/help.md` or `docs/seeding.md` when present, and verify a fresh seed still supports required scenarios. A refactor that changes no documented behavior needs no prose edit. Regenerate `<!-- generated:NAME -->` regions with their documented command, guarded by a committed parity check that fails on drift; never hand-edit them. Create a new doc only when durable instructions have no existing home.
<!-- /managed:roadmap -->
<!-- managed:testing v=35 -->
## Testing & Verification

- **Run the project's required checks before committing or claiming completion.** Cover changed behavior at the lowest layer that faithfully proves it, extending existing tests before adding new ones; prose-only changes get structure and reference checks, not wording tests. Once checks pass, rerun or broaden them only for changed code, a failure, or a concrete concern. `docs/tests.md` holds commands, isolation rules, and layer guidance.
- **A bug fix ships with a regression test seen to fail for the reported defect** (write it first, or revert the fix and watch it fail). Reference the bug row and close it in the same commit as `docs/process/roadmap.md` specifies.
- **High-risk changes need more.** Permissions, persisted-data integrity, concurrency, and failure recovery are high-risk even in a small diff: test their failure scenarios and get an independent review of the diff before merging; new workflows and changes to a contract shared across modules get that review too. Verify findings against the code and act on confirmed defects and unmet acceptance criteria; style preferences do not warrant another cycle. If a review fix touches a high-risk area, re-review the full change against the original base. Docs get one review pass.
- **Resolve failures within scope.** Fix defects your change caused or that block the agreed outcome, including nearby small fixes that directly support it; record unrelated defects in the roadmap. Investigate flaky tests; never hide failures with blanket retries or unexplained skips.
<!-- /managed:testing -->