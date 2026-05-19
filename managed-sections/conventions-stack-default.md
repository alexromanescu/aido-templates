---
section: conventions-stack
stack: default
version: 1
target: CLAUDE.md
order: 20
---
## Stack-specific conventions

- **No dead code.** Delete commented-out blocks, unused imports, orphan helpers.
- **Validate at boundaries.** Check user input, external API responses, and untrusted data at the edges. Trust internal code.
