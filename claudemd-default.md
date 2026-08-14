---
target: CLAUDE.md
description: Shared root guidance authority (CLAUDE.md; Codex reads it via the AGENTS.md alias). Written to new projects on creation.
variables: [name, description]
init: true
---
# {{name}}

{{description}}

## Project Structure

_Describe your project layout here._

## Commands

```
# Add common commands here
```

## When to read what

_Routing table for activity-scoped docs (shape per `docs/process/doc-sync.md`); add rows as the project grows._

| When you... | Read first | Update when done |
|---|---|---|
| Pick up current work | `docs/active-work.md` | refresh it on the way out |
| Branch / commit / merge / clean up | `docs/process/git-workflow.md` | — |
| Fix a bug | `docs/process/bugs.md` | `tests/bugs/`, roadmap Bugs row |
| Choose or run tests | `docs/tests.md` | — |
| Edit `docs/roadmap.md` | `docs/process/roadmap.md` | — |
