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

An externally owned realization uses external provenance with an explicit
delivery shape. `{ "kind": "direct" }` means the realization occupies its own
harness slot. A plugin-delivered skill or MCP uses
`{ "kind": "plugin", "pluginNativeId": "<parent>" }`. Delivery is identity
metadata only: never put commands, configuration bodies, paths, environment
values, headers, or credentials in it. Provider, locator, and version policy
describe acquisition intent; the realization's existing `nativeId` remains
the harness-native occupant ID. A plugin itself always uses direct delivery.
Co-selected direct-parent declarations and plugin-delivered children naming the
same scoped parent address must declare the same provider, locator, and version
policy, so planning can coalesce parent work without guessing. Unselected
alternatives and isolated global/project addresses may carry different intent.

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

## External capability inventory

`standard` records a small inventory of known external capabilities, not a
marketplace mirror and not a recommendation about their live state. Claude and
Codex realizations are selected explicitly; a shared source does not imply
harness parity.

External requirements in `standard` are inventory records: each is optional
with unmanaged installation and activation. Selecting an external inventory
record does not recommend installing, enabling, disabling, or removing it.
The records give the app stable identities for observing and explaining the
current Claude and Codex setup. A project declaration may state a deliberate
desired state for its own requirement when the owner wants the app to plan a
change.

Current state is never inferred from the catalog. The app observes Claude and
Codex configuration and installation locations plus the selected project
folders on each assessment. Cache-only material is not an installed-capability
registry, and neither SQLite nor an action receipt becomes capability state.
Supported external changes enter Apply/Retry only through the Governance
workflow after explicit review, and success requires fresh semantic
re-observation of those native sources.

Documented alternatives stay out of the selected catalog until they have both a
stable harness identity and a policy reason to replace the current route.
Examples are direct Claude Playwright MCP, Codex desktop Browser, Playwright CLI
skills, and Context7 wrapper plugins. A missing harness peer, such as
code-simplifier on Codex, is represented by no realization rather than an
invented unavailable record.

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
owned by the reconciler; a direct external skill shares that same case-folded
skill slot because provenance does not create another harness occupant.
Plugin-delivered skills remain distinct by their parent. Other external
addresses use harness, scope, artifact kind, delivery, native ID, and the parent
plugin ID when applicable. Provider, locator, and version policy do not create
a second occupant at the same address. Project targets that would override a
different global governed occupant are reported as shadows. A conflicted or
invalid estate produces no partial executable plan.

## Migration and mutation boundary

Resolution is read-only: reading policy never installs, enables, writes, or
mutates a harness or repository. Editing a catalog or declaration changes only
the next deterministic plan. It does not trigger reconciliation, alter current
state, or prove that a realization is compatible with an installed harness.

Migration proceeds through observation, deterministic planning, explicit owner
review where required, and only then reconciliation. Use the reconciliation
service's Preview/Apply/Retry/Verify boundary. Host capability changes belong
only to aido's `/skills/governance` surface; `/skills` remains source authoring
and read-only physical observation. A reviewed Governance action may use a
supported direct adapter or a tracked agent action, then must re-observe the
native harness or project source before reporting success. Preserve occupants
and unknown artifacts, and review destructive cleanup path by path. Do not add
a fallback cache registry, a second configuration writer, or SQLite capability
state. Editing policy or reviewing a plan never authorizes a live Claude or
Codex change.
