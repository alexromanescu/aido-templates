---
section: conventions-stack
stack: node
version: 3
target: CLAUDE.md
order: 20
---
## Shared Stack Conventions

- Follow the project's established validator, naming, exports, and type organization. Remove code made unused by your change.
- Validate untrusted data at system boundaries; rely on established internal contracts. Prefer `unknown` to `any` for unknown values, and explain unavoidable type escapes.
- For new code without established conventions, prefer kebab-case filenames, named exports, and module-local types. Use the existing validation library; introducing one is a project decision, not a consequence of Node detection.
