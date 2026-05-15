# aidev-templates — Template Content & Authoring Guide

This repo contains the template content distributed by the aidev app: managed sections, project scaffolds, prompts, room-protocol templates, and stack-detection rules. The deployed aidev app at `~/Apps/aidev/` reads from this folder at runtime and edits it via its `/templates` page UI.

You are most likely here because you opened this folder with Claude Code to author or revise a template. The rules below describe what each kind of file does and how to write or modify one without breaking downstream consumers.

## Layout

- `managed-sections/` — Sectioned Markdown blocks injected into projects' `CLAUDE.md` (or other target files via frontmatter `target:`). One file per section + per stack variant.
- `*-default.md` (repo root) — Project scaffolds (`claudemd`, `roadmap`, `deploy`, `active-work`, `agent-card`, `tests`, `structural-tests`, `testing-by-simulation`). Written into a project at creation/init time.
- `prompts/` — Prompt templates rendered with `{{var}}` substitution by the aidev AI router and the team-lead launch path.
- `rooms/` — Agent-facing prose loaded into multi-agent room JOIN payloads and message envelopes. Special escape rules — see below.
- `stacks.json` — Stack-detection rules and metadata; gates which managed-section variants are offered to each project.

## Managed sections

Each file under `managed-sections/` contains the body of one managed block. The aidev app injects it between markers in the target file:

    <!-- managed:<key> v=<N> -->
    ...body...
    <!-- /managed:<key> -->

### Frontmatter

Every managed-section file MUST start with YAML frontmatter declaring at least `section`, `stack`, and `version`. Optional `target:` selects the destination file (defaults to `CLAUDE.md`); use it for sections that belong elsewhere (e.g., `target: docs/testing/structural-tests.md`).

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
- `version` — bump on every meaningful content change. Bumping triggers drift propagation across every aidev-managed project on the next sync — that is the intended flow, so bump aggressively and let the per-project drift surface (in `/dashboard`) decide when to absorb the new version.
- `target` — destination path inside each consuming project (relative to the project root). Defaults to `CLAUDE.md`. May point at a docs subfolder; the consuming project just needs the file to exist (or willingness to create it during sync).

### Stack variants

Add a `-<stack>.md` suffix (e.g., `testing-node.md`, `conventions-node.md`) to override the default for a detected stack. The `-default.md` file is the fallback when no stack-specific variant matches the project.

A new stack value (`-deno.md`, `-elixir.md`, …) is only useful once a matching entry exists in `stacks.json` — without it, no project will ever match that variant.

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
- `description` — short, human-facing label shown in the aidev `/templates` editor.
- `variables` — list of `{{var}}` names the body uses. Currently the renderer supports `name`, `today`, `description`. Listing them in frontmatter is documentation only; the renderer substitutes by what the body contains.
- `init: true` — the file is also writable on demand from a project's "Initialize" UI (re-runnable). If `false` or absent, the scaffold is only written at project creation.

### Variable substitution

Scaffold bodies and prompt templates support `{{name}}`, `{{today}}`, `{{description}}` — substituted at render time by the same engine used for prompt templates. Values are inserted verbatim. Do NOT use scaffolds for content that crosses a security boundary; the renderer does no escaping (rooms templates are different — see below).

### Embedding managed sections in scaffolds

A scaffold may embed a managed-section block by including the marker pair literally in the body. At init time the section is rendered fresh from its current managed-section template; thereafter it stays in sync via drift detection like any other managed block. Look at `structural-tests-default.md` for a working example — the file is a scaffold whose body wraps a managed block of the same `section` key.

When you do this, keep the embedded body byte-identical to the upstream managed-section template. The aidev test suite enforces this alignment (`tests/modules/templates/scaffold-alignment.test.ts`) — drift here means projects start out marked as already-out-of-date.

## Prompts

Prompt templates under `prompts/` use the same `{{var}}` substitution as scaffolds. They are loaded by the aidev AI router (advice, generate-prompt, parallelism analysis, bug-hunt) and the team-lead launch path.

Treat them as untrusted content boundaries: any value passed in via `{{var}}` is inserted verbatim. Never compose protocol markers, command-line flags, or shell quoting from `{{var}}` content — the renderer does no escaping.

## Room templates

Files under `rooms/` are loaded into multi-agent room JOIN payloads and per-turn message envelopes. They are loaded by `loadRoomTemplate(name)` and rendered with `renderRoomTemplate(template, vars)` — never via the prompt-template renderer.

The current set:

- `protocol-rules.md` — top-level PROTOCOL block (how to read ROOM-MESSAGE, how to emit ROOM-REPLY).
- `decision-rules.md` — when to emit a ROOM-DECISION block instead of a plain reply.
- `approval-rules.md` — the ROOM-PROPOSAL → ROOM-APPROVAL cycle for irreversible actions.
- `join-header.md` — preamble at the top of every JOIN payload.
- `participant-joined.md` — system notice broadcast when an agent joins.
- `message-envelope-head.md` / `message-envelope-tail.md` — the wrapper around each ROOM-MESSAGE delivered to an agent.
- `user-directory-fallback.md` — line used when the user's `~/.aidev/user-card.md` is missing.

### Critical: every interpolated value is auto-escaped

The room-template renderer passes every interpolated value through `escapeForInject` so user-controlled content cannot accidentally inject `<<<...>>>` protocol markers. Documentation `<<<...>>>` written directly in template bodies is left untouched — it's only interpolated values that get escaped.

Practical consequences when you author a rooms template:

- Write `<<<ROOM-REPLY>>>` and friends directly in the body to document the protocol. They survive verbatim.
- Use `{{var}}` for any content that comes from outside (handle names, message bodies, user-card fields). The renderer rewrites any `<<<` inside the substituted value to a visually-identical zero-width-space variant that no parser matches.
- If you add a new room template file, name it under `rooms/` and load it via the safe loader/renderer pair. A structural test in the aidev repo (`tests/structural/rooms-templates-loader.test.ts`) blocks raw `fs.readFile` of `templates/rooms/*` and blocks routing a rooms template through the prompt-template renderer — both fail loudly in CI.

## stacks.json

Defines stack fingerprint rules. Each entry pairs a stack `name` with `detectFiles` — file paths whose presence in a project marks it as that stack. Example:

```json
{ "name": "node", "detectFiles": ["package.json"] }
```

The aidev projects module reads this file to decide which managed-section variants and scaffold bundles to offer. Add new stacks here; the matching `-<stack>.md` variant files under `managed-sections/` are picked up automatically once the stack name matches.

## Editing flow

The deployed aidev app at `~/Apps/aidev/` is the primary editor:

- `/templates` page in the aidev UI: per-file editor for managed sections (Single + Compare modes), scaffolds, room prompts. Saves run through `safeWriteAndCommit` — autocommits land in this repo's `.git` (because git resolves `.git` from the edited file's directory).
- For deeper authoring sessions, open this folder directly with Claude Code: `cd ~/Apps/aidev/templates && claude`. This `CLAUDE.md` is picked up automatically.

Pushes to `origin/main` are user-initiated. The dev folder (`~/Work/Projects/aidev/`) consumes this repo read-only via `npm run templates:sync` — it pulls the latest `main` on every test run, so changes pushed here become visible to the dev tooling on the next run.

## Style conventions for managed-section content

- Start with the **rule** (one or two lines), then explain.
- Use `### Rule` and `### Reference` subsections sparingly — only when there's enough material to warrant them.
- Cross-link to deeper docs with relative paths (`docs/<topic>.md`) when the section's host project is expected to have them. Mark such references as conditional — "if your project has `docs/X.md`, ..." — because managed sections appear in projects with very different doc footprints.
- Keep prose dense; managed sections are read by Claude in-session, so favor a tight bulleted list over a diagram or visual flourish.
