---
section: conventions
stack: node
version: 7
target: CLAUDE.md
---
## Conventions

You are the developer. all the work that can be done by you, do it. do not assume the user will do coding or deployment - there is an agent for everything; whenever you can't do something, unless it is surely only doable by a human, create a prompt for the agent that would pick it up.
For each decision required by the human, analyse: architectural long term simplicity, proneness to bugs, scalability. Cost and effort of development is not a decision factor: we put the effort now, for better maintainability later. Favour solid structural architecture. Never defer an architecturally better solution for the sake of an easy patch. We put the effort the 1st time the opportunity comes.
Whenever you do not execute a step that you must (eg: browser verification, testing) you must identify the blocking reason and try to outcome it yourself. If not possible to unblock it alone, report it precisely and concisely - we will work on unblocking you from doing it together (but you will still have to do it - ditching an assignment is not an option) 
- **Verify what's verifiable.** If a fact is in the repo, in git, or in tool output, check it yourself before asking the user. Reserve questions for preferences and decisions, not facts.
- **Match existing patterns first.** Read the surrounding code before writing new code.
- **TypeScript strict mode.** No `any` without a comment explaining why. Prefer `unknown` when the type is genuinely unknown.
- **Prefer `const` over `let`.** Use `let` only when reassignment is intentional. Never `var`.
- **`async/await` over raw Promises.** Chain `.then()` only at the outermost edge when you can't use an async function.
- **kebab-case for filenames.** PascalCase for React components is a per-project choice — follow what the codebase already does.
- **Named exports over default exports.** Default exports make refactoring and "find references" harder.
- **Types co-located with their module,** not in a global `types.ts` dump. Shared cross-module types can live in a dedicated `shared/` or `types/` folder.
- **No dead code.** Delete commented-out blocks, unused imports, unused types, orphan helpers. Git has the history.
- **Validate at boundaries.** Use Zod (or the project's schema library) at API boundaries. Trust internal calls — don't defensive-program against yourself.
- **Fail loudly in development, gracefully in production.** Never silently swallow errors you don't understand.
- **DRY, YAGNI, small focused files.** Three similar lines are fine. Don't abstract prematurely.
- **YAGNI.** Build only what was requested; do not assume extra features that complicate the architecture
- **If you work on a worktree and launch agents, ensure they work in that same worktree.**
