---
section: conventions-stack
stack: node
version: 1
target: CLAUDE.md
order: 20
---
## Stack-specific conventions

- **No dead code.** Delete commented-out blocks, unused imports, unused types, orphan helpers.
- **Validate at boundaries.** Zod at API boundaries (user input, external API responses, untrusted data); trust internal calls.
- **TypeScript strict mode.** No `any` without a comment. Prefer `unknown` when the type is genuinely unknown.
- **Prefer `const` over `let`; never `var`.** `let` only when reassignment is intentional.
- **`async/await` over raw Promises.** Chain `.then()` only at the outermost edge.
- **kebab-case for filenames.** Follow the codebase's existing component-file convention.
- **Named exports over default exports.**
- **Types co-located with their module,** not in a global `types.ts` dump.
