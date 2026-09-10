---
section: conventions-stack
stack: node
version: 4
target: CLAUDE.md
order: 20
---
## Shared Stack Conventions

- Follow the project's established validator, naming, exports, and type organization. Prefer `unknown` to `any` for unknown values and explain unavoidable type escapes.
- For new code without an established convention, prefer kebab-case filenames, named exports, and module-local types. Use the existing validation library; adding one is a project decision.
