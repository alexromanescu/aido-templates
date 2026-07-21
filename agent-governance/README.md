# Agent governance authoring

This directory owns portable desired policy for Claude Code and Codex CLI.
`catalog.json` is the portable desired-policy authority. It describes semantic
capabilities, explicit harness realizations, their allowed scopes and
provenance, and named profiles. It contains desired policy only: never add live
host paths, observed state, caches, credentials, commands, environment values,
or evidence that an installed harness currently works.

The catalog and project declarations are inputs to planning. They are not
installation manifests and do not grant filesystem, Git, process, network, or
harness mutation authority.

## Catalog and profiles

Keep `schemaVersion`, `defaultProfile`, `capabilities`, and `profiles` explicit.
A profile is a complete named policy selection, not an environment label or a
partial overlay. Add a new production profile only for an evidenced policy
difference; do not duplicate `standard` merely to demonstrate that several
profiles are supported.

Every realization belongs to one semantic capability and declares its own
`id`, `harness`, artifact `kind`, `ownership`, native ID, allowed scopes, and
provenance. Claude and Codex realizations are selected explicitly; a shared
source does not imply harness parity. A templates-backed custom realization
uses a normalized repository-relative source such as `skills/program-prep`.
The source must exist, and its folder and `SKILL.md` frontmatter name must match
the realization's native ID.

Every requirement is a complete record: `capabilityId`, `harness`,
`realizationId`, `disposition`, `scope`, and both `desired.installation` and
`desired.activation` are explicit. Do not introduce capability-only shorthand,
implicit peer harnesses, inherited desired state, or an external path. Profiles
may contain both global and project-scoped requirements; only global
requirements form the estate baseline, while profile project requirements
apply to each selecting project. The current `verify` realizations stay out of
`standard` and are selected explicitly by aido's project declaration.

## Project declarations

A project may own the fixed file
`.aido/agent-governance/requirements.json`. It contains exactly
`schemaVersion`, `profile`, and `requirements`, for example:

```json
{
  "schemaVersion": 1,
  "profile": "standard",
  "requirements": [
    {
      "capabilityId": "aido-running-app-verification",
      "harness": "claude",
      "realizationId": "aido-running-app-verification.claude-skill",
      "disposition": "required",
      "scope": "project",
      "desired": {
        "installation": "present",
        "activation": "enabled"
      }
    }
  ]
}
```

A missing project declaration selects `defaultProfile`; it does not mean an
empty profile. A present declaration selects its named profile. A present
malformed, unreadable, unsafe, or unresolved declaration is an error, never
absence; a missing project is also an error. Never copy the profile's global
baseline into a project declaration. Project requirements may
add a realization or replace a selected profile realization, and every
project-owned record uses `scope: "project"`. Replacement occurs only when a
project requirement matches a profile project requirement by capability and
harness; otherwise it is an addition. Global profile requirements remain
global and cannot be overridden by project content.

Write one complete project requirement for each harness that the project
actually selects. Do not infer a Claude requirement from a Codex record, or the
reverse. Project policy must not contain a source path, provenance, command,
environment, host assignment, observed version, or physical action.

## Resolution and conflicts

A ready resolution emits one estate-wide global variant and only
project-scoped targets inside each logical project's plan. Identical complete
global sets coalesce and retain every origin. Different global sets remain
visible as incompatible variants; they are not unioned, intersected,
prioritized, or selected by input order.

Unresolved references, incompatible profile variants, collisions, and shadows
block the plan; resolution never guesses policy or adapter-native identity.
Custom-skill collisions use the portable harness/scope/native address already
owned by the reconciler. Plugin and MCP address equivalence remains undefined
until their adapters own it. A conflicted or invalid estate produces no partial
executable plan.

## Migration and mutation boundary

Resolution is read-only: reading policy never installs, enables, writes, or
mutates a harness or repository. Editing a catalog or declaration changes only
the next deterministic plan. It does not trigger reconciliation, alter current
state, or prove that a realization is compatible with an installed harness.

Migration proceeds through observation, deterministic planning, explicit owner
review where required, and only then a later reconciliation phase. Preserve
occupants and unknown artifacts, review destructive cleanup path by path, and
use the owning adapter's preview/apply/verify contract when that later phase is
available. Until then, author policy and review its plan without changing live
Claude or Codex state.
