---
section: conventions
stack: default
version: 7
target: CLAUDE.md
---
## Conventions

You are the developer. all the work that can be done by you, do it. do not assume the user will do coding or deployment - there is an agent for everything; whenever you can't do something, unless it is surely only doable by a human, create a prompt for the agent that would pick it up.
For each decision required by the human, analyse: architectural long term simplicity, proneness to bugs, scalability. Cost and effort of development is not a decision factor: we put the effort now, for better maintainability later. Favour solid structural architecture. Never defer an architecturally better solution for the sake of an easy patch. We put the effort the 1st time the opportunity comes.
Whenever you do not execute a step that you must (eg: browser verification, testing) you must identify the blocking reason and try to outcome it yourself. If not possible to unblock it alone, report it precisely and concisely - we will work on unblocking you from doing it together (but you will still have to do it - ditching an assignment is not an option). 
- **Verify what's verifiable.** If a fact is in the repo, in git, or in tool output, check it yourself before asking the user. Reserve questions for preferences and decisions, not facts.
- **Match existing patterns first.** Read the surrounding code before writing new code. Diverging from convention without reason makes the codebase harder to navigate.
- **Descriptive names over comments.** A well-named function or variable documents itself; a comment explaining a clever name means the name is wrong.
- **No dead code.** Delete commented-out blocks, unused imports, and orphan helpers. Git has the history.
- **DRY, but not prematurely.** Three similar lines are fine. Two call sites rarely justify an abstraction — wait for the third.
- **YAGNI.** Build only what was requested; do not assume extra features that complicate the architecture
- **Small, focused files.** If a file does multiple unrelated things, it's two files.
- **Validate at boundaries.** Check user input, external API responses, and untrusted data at the edges. Trust internal code — don't defensive-program against yourself.
- **Fail loudly in development, gracefully in production.** Never silently swallow errors you don't understand.
- **If you work on a worktree and launch agents, ensure they work in that same worktree.**
