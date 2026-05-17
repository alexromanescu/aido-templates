---
section: documentation-sync
stack: default
version: 5
target: CLAUDE.md
---
## Documentation Sync

**What CLAUDE.md is for:** current architectural facts, rules, and procedures a Claude session needs while working in the code. It is read by Claude, not by humans browsing a repo — so prefer dense text over visual aids (ASCII diagrams, art, layout flourishes cost tokens for less information than a tight bulleted list would carry), and skip historical narration (phase numbers, dates, "extracted in Phase X (YYYY-MM-DD)", "renamed from Y", "added after incident Z") that doesn't change what's true now. If a rule stands on its own merits, drop the historical attribution; if it doesn't, the rule probably needs rewriting. Phase/incident history lives in `docs/roadmap-completed.md` and `docs/meta/reflections.md`.

When you change code that a document describes, update the document **in the same commit**. Don't defer documentation updates — they get forgotten.

### Standard documents

aido-managed projects maintain a conventional set of docs under `docs/`. Update any that exist and that your change affects:

| File | Covers | Update when... |
|------|--------|----------------|
| `docs/architecture.md` | System structure, modules, data flow, adapters | Architectural or structural changes, new modules |
| `docs/frontend.md` | Components, routing, layouts, UI patterns, styling tokens | Any frontend structural change |
| `docs/api-reference.md` | Backend API, procedures, data shapes, auth, error codes | Any API, entity field, or auth change |
| `docs/tests.md` | Test inventory, running commands, testing conventions | Tests added/removed/changed, testing strategy changes |
| `docs/seeding.md` | Seed script, data scenarios, reset procedure | New entities, tables, or relationships |
| `docs/help.md` | Help system content and architecture | Help content or help infrastructure changes |
| `docs/devops.md` | Dev setup, topology, infrastructure, ops commands (human reference) | Setup changes, new ops commands, infra changes |
| `docs/deploy.md` | **Claude-executable** deploy procedure read by the in-app Deploy button | Deploy steps change, new pre/post-deploy checks |
| `docs/roadmap.md` | What's built, what's planned, active phases | Any feature completed, started, or reorganized |

**Note on `devops.md` vs `deploy.md`:** `devops.md` is human-readable reference (topology, systemd service file, initial setup, useful commands). `deploy.md` is Claude-executable: a numbered procedure the deploy feature reads verbatim and executes step by step. A project may have one, both, or neither — `deploy.md` is what the "Deploy" button in the app needs; `devops.md` is what a new teammate reads to understand how the project is operated.

**Missing files are skipped.** Projects can add their own docs (e.g., `security.md`, `meta/reflections.md`, `product/prd.md`) in the freeform section of `CLAUDE.md` alongside this managed section.

### Rule

**If you changed code that a doc describes, update the doc in the same commit or PR.** Don't leave doc updates for a separate pass — they become stale knowledge no one trusts.

### Topical subdirectories

When a topic accumulates ≥3 standalone deep-dive docs, group them under a
topic subdirectory (e.g., `docs/testing/`, `docs/operations/`,
`docs/security/`). The threshold counts deep-dive docs only — the topic's
**entry-point doc stays at top level** and references the subdirectory.
Concretely: `docs/tests.md` is the entry point and stays at `docs/`;
`docs/testing/testing-by-simulation.md`, `docs/testing/structural-tests.md`,
`docs/testing/<more>.md` live in the subdirectory. The entry point itself
does NOT count toward the ≥3 threshold.

This avoids two bad shapes: collapsing the entry point into the subdir
(uglier reference paths from CLAUDE.md), and creating an empty subdir
during the awkward 1–2 deep-dive transition.

Managed-doc targets follow the same rule. A managed section's `target`
field can point at a subdirectory file (`target: docs/<topic>/<file>.md`)
when the deep-dive doc is itself versioned upstream.

### Referencing user-level resources

When a doc references a user-level resource (a Claude skill, a globally
installed CLI tool, an environment-specific file), frame the reference as
**conditional on availability**, not a hard prerequisite:

> If your environment has the `residuals-review` skill installed (lives at
> `~/.claude/skills/residuals-review/SKILL.md`), it implements the
> adversarial-review cycle…

This way, agents whose environment lacks the resource read the doc
without breaking on the reference, and the doc remains internally
consistent regardless of installation state.
