---
section: conventions-stack
stack: node
version: 2
target: CLAUDE.md
order: 20
---
## Stack-specific conventions

- **No dead code.** Delete commented-out blocks, unused imports, unused types, orphan helpers.
- **Zod at API boundaries** (user input, external API responses, untrusted data); trust internal calls.
- **No `any` without a comment.** Prefer `unknown` when the type is genuinely unknown.
- **kebab-case filenames, named exports, types co-located with their module** (no global `types.ts` dump).
