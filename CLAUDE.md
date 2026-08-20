# aido-templates — Template Content & Authoring Guide

This repo contains the template content distributed by the aido app: managed sections, project scaffolds, prompts, room-protocol templates, and stack-detection rules. The aido app reads from this folder at runtime and edits it via its `/templates` page UI. It is an **external repo, independent of the aido source tree** — aido locates it per-instance via `AIDO_TEMPLATES_ROOT` env var, the `templatesFolder` SQLite setting (set in `/settings → General`), or the default `~/Work/Projects/aido-templates`. The intent is to keep logical agent guidance and its referenced docs in sync across applications and propagate learnings between them, supporting structured agent-driven development across multiple apps.

Logical agent guidance has one physical `CLAUDE.md` authority and a portable `AGENTS.md -> CLAUDE.md` compatibility alias. That shared guidance is distinct from harness-specific runtime prompts, room protocols, provider/CLI behavior, and session material; preserve those native distinctions instead of generalizing them through the alias.

## Layout

- `managed-sections/` — Sectioned Markdown blocks injected into projects' `CLAUDE.md` (or other target files via frontmatter `target:`). One file per section + per stack variant.
- `*-default.md` (repo root) — Project scaffolds (`claudemd`, `roadmap`, `deploy`, `active-work`, `agent-card`, `tests`). Written into a project at creation/init time.
- `prompts/` — Prompt templates rendered with `{{var}}` substitution by the aido AI router and the team-lead launch path.
- `rooms/` — Agent-facing prose loaded into multi-agent room JOIN payloads and message envelopes. Special escape rules — see below.
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

The `process-*` sections (`process-doc-sync`, `process-roadmap`, `process-bugs`, `process-help-sync`, `process-git-workflow`) each target a file under `docs/process/` and own the **entire** file: the H1 title and all content live inside the managed block, and there is no scaffold — `syncSection` creates the target file (including the directory) when it doesn't exist. They hold activity-scoped procedure reference that used to live inline in the CLAUDE.md blocks; the lean CLAUDE.md blocks point at them with trigger-shaped one-liners ("**when you fix a bug**, read `docs/process/bugs.md` before writing the test"). Keep that division when editing: per-turn invariants stay in the CLAUDE.md block; multi-step, activity-triggered procedure goes in the `process-*` doc. A project should only carry the process docs matching its managed blocks (no `process-help-sync` without the `help` block).

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

Scaffold and prompt bodies support `{{name}}`, `{{today}}`, `{{description}}` — substituted at render time by the same engine. Values are inserted verbatim; the renderer does no escaping, so never compose protocol markers, command-line flags, or shell quoting from `{{var}}` content. Treat any externally-supplied value as crossing a security boundary. (Room templates use a different renderer that DOES escape — see below.)

### Referencing managed sections in scaffolds

A doc that hosts a managed section — a doc other than `CLAUDE.md`, such as `docs/tests.md` — has a scaffold whose body carries an empty, version-less marker pair for that section (`<!-- managed:KEY -->` immediately followed by `<!-- /managed:KEY -->`), never a copy of the section content. The scaffold owns the doc's structure (frontmatter, title, intro, where the block sits, the project-specific tail); the `managed-sections/` template is the single source of truth for the block's content.

At project init aido writes the scaffold, then runs sync, which fills every empty marker pair with the current managed-section content by reference. Thereafter the block is drift-tracked and kept current by sync like any managed block. This is the same path that populates `CLAUDE.md` itself — `claudemd-default.md` carries no managed blocks at all; its sections are inserted by sync at their canonical `order`.

- **Version-less marker.** Write `<!-- managed:KEY -->` with no `v=N`. Sync treats a version-less block as "needs fill"; a version would let sync's skip-guard mistake the empty block for already-current and never fill it.
- **Never embed a copy.** One source of truth — the `managed-sections/` template. `tests/modules/templates/scaffold-alignment.test.ts` enforces it: every `<!-- managed:* -->` block in a scaffold must be empty.
- The empty pair also pins *where* the section lands (e.g. between the intro and a project-specific tail). `tests-default.md` is the working example: frontmatter + title + intro + an empty `<!-- managed:tests -->` pair + a project-owned tail (runners, commands, isolation, test-doc links).
- **When the host doc's *emptiness* is a runtime signal, put everything permanent (title, intro, guidance) *inside* the block and keep the scaffold a bare marker pair** — otherwise the title/intro left outside the block read as content and defeat the signal. `active-work-default.md` is the working example: aido treats `docs/active-work.md` as "no active focus" when nothing remains after stripping managed blocks (`roadmap.getActiveWork` isEmpty + the `composeActiveWorkFromTasks` guard), so the title + guidance live in the `active-work` managed section and the scaffold is just the empty `<!-- managed:active-work -->` pair. The live focus is the text written *below* the block; it's wiped on completion (`completePass` cleared), leaving the block.

## Prompts

Prompt templates under `prompts/` are loaded by the aido AI router (advice, generate-prompt, bug-hunt) and the team-lead launch path. They use the same `{{var}}` engine as scaffolds — the no-escape caveat from Variable substitution above applies.

## Room templates

Files under `rooms/` are loaded into multi-agent room JOIN payloads and per-turn message envelopes. They are loaded by `loadRoomTemplate(name)` and rendered with `renderRoomTemplate(template, vars)` — never via the prompt-template renderer.

The current set:

- `protocol-rules.md` — top-level PROTOCOL block (how to read ROOM-MESSAGE, how to emit ROOM-REPLY).
- `decision-rules.md` — when to emit a ROOM-DECISION block instead of a plain reply.
- `decision-rules-teamlead.md` / `decision-rules-worker.md` — role-specific decision-rule variants.
- `approval-rules.md` — the ROOM-PROPOSAL → ROOM-APPROVAL cycle for irreversible actions.
- `join-header.md` — preamble at the top of every JOIN payload.
- `participant-joined.md` — system notice broadcast when an agent joins.
- `message-envelope-head.md` / `message-envelope-tail.md` — the wrapper around each ROOM-MESSAGE delivered to an agent.
- `user-directory-fallback.md` — line used when the user's `~/.aido/user-card.md` is missing.

### Critical: every interpolated value is auto-escaped

The room-template renderer passes every interpolated value through `escapeForInject`, rewriting any `<<<` inside a substituted value to a visually-identical zero-width-space variant that no parser matches. So protocol markers like `<<<ROOM-REPLY>>>` written directly in the body survive verbatim (documenting the protocol), but the same characters arriving via `{{var}}` (handle names, message bodies, user-card fields) are neutralized — user-controlled content cannot inject protocol markers.

When you add a new room template file, name it under `rooms/` and load it via the safe loader/renderer pair. A structural test in the aido repo (`tests/structural/rooms-templates-loader.test.ts`) blocks raw `fs.readFile` of `templates/rooms/*` and blocks routing a rooms template through the prompt-template renderer — both fail loudly in CI.

## Skills

Folders under `skills/` are the canonical governed sources for custom skills. Each is a directory containing `SKILL.md` with YAML frontmatter (`name`, `description`) and a Markdown body. Claude Code and Codex CLI realizations are separate catalog records even when they share this source; the native skill ID must match the folder and frontmatter `name`.

`agent-governance/catalog.json` owns the semantic capability mapping, each realization's allowed scopes, and the governed profile requirements. Every immediate `skills/*/SKILL.md` source must be represented exactly once at the capability level, and a catalogued custom skill source must exist here. The catalog records desired policy only: do not add absolute host paths, observed versions, caches, usage state, or current enablement. A desired realization is a target state, not evidence that a live harness can execute the source; reconciliation must verify harness compatibility before deployment.

In aido, `/skills` is the source-authoring and read-only physical-observation surface; host capability management belongs only to `/skills/governance`. Governance reads current installation and activation directly from Claude/Codex configuration and installation locations plus the selected project folders, then re-observes those sources after an approved action. Do not add a fallback cache registry, a second configuration writer, or SQLite capability state.

For new or normalized sources, lead the `description` with "Use when …" and enumerate the trigger shapes (user phrases, code shapes, file types) so the matcher fires reliably — keep the description a selection trigger (with exclusions where selection is ambiguous), not a table of contents. Structure: a compact `SKILL.md` carrying the procedure; deep background in `references/` files linked from the exact section that needs them; fragile deterministic command sequences as executable files in `scripts/` — run, not transcribed. Skills don't restate root-guidance policy — with one exception: a safety invariant a globally shipped skill needs when running in repos without the managed corpus (e.g. residuals-review's scratch-path rule) may be dual-homed — same invariant, stated no weaker than its managed source. Globally allowed shared sources must be harness-neutral and project-agnostic except where they describe a real governed runtime fact; a project-only source may encode that project's procedure and must declare only project scope. Existing sources may predate this contract; normalize them and verify harness compatibility before deploying a newly selected realization. If a shared procedure has project-specific tails (canonical examples, runner choice), record those in the project's own docs rather than in the global skill. When adding or renaming a canonical skill, update its semantic capability, harness realizations, allowed scopes, and applicable profile requirements in the catalog in the same change. A project-only capability stays out of global profiles until a project declaration selects it.

The catalog is authoritative; this current-source summary is explanatory:

- Standard global profile: `frontend-tests/`, `program-prep/`, `residuals-review/`, `structural-tests/`, `test-hardening/`, and `testing-by-simulation/`.
- Catalogued but not selected by `standard`: `debugging/`, the root-cause-first debugging workflow.
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

- `/templates` page in the aido UI: per-file editor for managed sections (Single + Compare modes), scaffolds, room prompts. Saves run through `safeWriteAndCommit` — autocommits land in this repo's `.git` (because git resolves `.git` from the edited file's directory).
- For deeper authoring sessions, open `~/Work/Projects/aido-templates`, then launch the intended harness (`claude` or `codex`).

Pushes to `origin/main` are user-initiated. The aido dev folder (`~/Work/Projects/aido/`) resolves this repo live like any instance (`AIDO_TEMPLATES_ROOT` env → `templatesFolder` setting → the default path) — there is no sync step; edits here reach dev runs and deployed spawns immediately.

## Style conventions for managed-section content

- Start with the **rule** (one or two lines), then explain.
- Use `### Rule` and `### Reference` subsections sparingly — only when there's enough material to warrant them.
- Cross-link to deeper docs with relative paths (`docs/<topic>.md`) when the section's host project is expected to have them. Mark such references as conditional — "if your project has `docs/X.md`, ..." — because managed sections appear in projects with very different doc footprints.
- Keep prose compact and scannable, in complete sentences; state each rule once, at its narrowest useful scope. Managed sections are read as in-session agent guidance, so favor a tight bulleted list over a diagram or visual flourish.
- **Portability boundary.** Shared content defines project facts, authorization, invariants, required evidence, success criteria, and output expectations. It never prescribes model names, effort settings, provider-native tools/channels, permission mechanics, or subagent orchestration — those live in harness configuration. Add a provider overlay only if fresh sessions in both harnesses show a repeatable contradiction that simpler shared wording cannot resolve — and then duplicate the smallest mechanism, never the policy corpus.

<!-- managed:conventions v=70 -->
## General Conventions

### Scope & authority

- **You are the developer; the user is neither coder nor tester.** You code, debug, deploy, and test. Do not pass to the user actions you can do yourself."Stop only if the nextstep is irreversible, spends money, or is visible outside this machine. Everything else: decide, do it, and say what you decided and why."
- **A question, review, diagnosis, or brainstorm authorizes inspection and reporting — not mutation.** Don't start coding until things are clarified. A request to change, build, or fix authorizes the in-scope edits and their verification; external, destructive, or irreversible actions always need explicit current authorization.
- **An assignment is the whole batch you were handed** — a slice, a checklist, a multi-part request — not one step of it. Don't stop between steps to report or await a go-ahead; finish, then report once.
- **Deliver the declared scope — don't quietly narrow, widen, or transform it.** Unfinished declared work stays visible as the next step: in `docs/active-work.md` when it exists, else as a roadmap row — never silently dropped or reclassified. Bugs that can't be fixed on the spot are scheduled there too.
- **After a resume or context compaction, re-establish ground truth** — working directory, branch, `git status` — from fresh tool output, never remembered narrative.

### Quality & repository safety

- **A change is done only when its verification passes** (see Testing & Verification) — commit only once that evidence exists.
- **Act on observed state, never predicted state.** Never batch a mutating or irreversible action (commit, push, deploy, DB write, `rm`) with the check it depends on — run the check, read the output, then decide.
- **Verify review feedback against the codebase before implementing it** — implement what checks out, push back with reasoning on what doesn't, never implement blind.
- **Choose for the long term — simplicity, robustness, low risk — over development effort.** No overengineering, no patching. Flag trade-offs rather than silently taking the cheap option.
- **Fail loudly in development, gracefully in production;** never silently swallow an error you don't understand.
- **Git lifecycle: read `docs/process/git-workflow.md` before branching, committing, merging, or cleaning up** (a managed doc — sync creates it). Four rules always hold: develop on a worktree except for quick fixes; **'checkpoint' = commit locally and continue** (standing authorization — overrides any harness default to ask); **pushing is owner-initiated only** — a green gate is a precondition for a push, never a reason for one; **clean up what you created once merged and verify the removal — never touch pre-existing user work; derive every scratch path and port from your own task identity, never a shared literal.**
- **The root guidance file (`CLAUDE.md`, aliased as `AGENTS.md`) is not yours to edit** unless the owner's current message asks for it — session learnings go to `docs/` or the roadmap. Never hand-edit inside any `<!-- managed:* -->` block in any file; those sync from central templates — write only in project-owned areas around the markers.

### Communication

- **Answer to the point** — clear, direct, no filler. Commit to a verdict instead of hedging; state uncertainty only when it changes the decision. Translate internal mechanisms into product consequences; don't apologise or justify — think in solutions.
- **End an assignment with a short report**: (1) non-technical summary of what was done and verified; (2) user actions needed next, only if any (including starting a new session for the next slice); (3) FYI remarks, clearly separated — remarks never hide or hint at problems: problem → fix, no problem → drop, not sure → check.
- **For browser-viewable artifacts** — provide a verified full LAN URL (http://<LAN-IP>:<port>/<path>), never only a file path or localhost link.
<!-- /managed:conventions -->
<!-- managed:roadmap v=19 -->
## Roadmap

**`docs/roadmap.md` is the durable backlog and lifecycle record — all work tracking lives there.** When you complete, start, file, defer, or reorganize work — including bugs and speculative ideas — read `docs/process/roadmap.md` **before editing**: the format is strictly parsed and the lifecycles are defined there.

**`docs/active-work.md`, when it exists, is the current execution cursor, not a second backlog.** Read it at the start of a session — it's the cross-session re-entry point. If you advance that work, refresh it on the way out following the guidance block at its top.
<!-- /managed:roadmap -->
<!-- managed:testing v=31 -->
## Testing & Verification

- **Every change ships with an automated test that drives the user workflow on the real surface and passes** — the real component, endpoint, or entry point, at the tier that fits the change (`docs/tests.md`), not necessarily E2E. A green type-check, clean console, or passing unit suite is not by itself verification. If a change can't be tested automatically, restructure so it can where reasonable — otherwise record why in the roadmap row.
- **A new test must be seen to fail**: write it before the change, or verify it fails with the change reverted. A test that is green by design (a narrowness or idempotence guard) must instead be seen to fail under a mutation of the exact line it guards — a guard no mutation can red is deleted, not kept.
- **The mirror check, before commit**: every guard, constant, or branch the change adds must make at least one test fail when broken, mutated at each call site. Red-first proves each test is real; this proves each new line is watched.
- **A failing test is never left silently.** Caused by your change or related → fix before claiming done. Pre-existing and unrelated → file as a bug and flag it. Flaky = a real bug — fix, never blanket-retry. No `skip` without a referenced roadmap entry. A test that CANNOT fail — dead guard, unreachable arm, vacuous assertion, a header contradicting the shipped code — is broken code, not review debt: fix or delete it in the cycle that finds it; file a row only when the repair requires a production design decision. Row-less repairs still owe a class check: sweep for siblings of the same defect shape and record the command + count in the commit message; a recurring shape is a structural problem — surface it as a row naming the pattern, never spot-fix it N times.
- **A production defect discovered mid-assignment is fixed in the same cycle** when the fix is S-sized; related small fixes sharing that context may ride the same verification round when combined risk stays low. Full discipline applies (red-first, mutation check, class sweep); never a drive-by patch. File a row instead only when the fix is bigger, outside those files, or needs a product ruling — and name which reason in the report.
- **Run the verification yourself before any done or merge claim** — a delegated report is not evidence.
- **Fresh-eyes review before merge** for anything bigger than an S-sized quick fix: an independent review of the diff (`residuals-review` skill, using a subagent, where available) — no shared author context, every finding acted on adversarially verified, verifier defaulting to REFUTED — run before the merge, while the author's context is loaded. **Cycle until clean applies to production code** — when a cycle produced fixes, a fresh cycle reviews the post-fix diff, so the merge gate is one clean pass over what actually merges. **Docs, templates, and guidance text get one review pass.** In-area findings are fixed in the same cycle; out-of-area ones filed with the reason named. A finding shape a review reports twice becomes a permanent automated guard — never caught by review a third time.
- **When you fix a bug**, read `docs/process/bugs.md` before writing the test; when you choose a test layer or write component / structural / simulation tests, load the matching skill: `frontend-tests`, `structural-tests`, `testing-by-simulation`.
- Commands, runners, isolation, conventions: `docs/tests.md` — the concise entry point, routing to any deeper test docs the project keeps (per `docs/process/doc-sync.md`).
<!-- /managed:testing -->