# aido-templates — Tests

Test entry point. The managed block is synced by aido; everything after it is project-owned.

<!-- managed:tests v=15 -->
## Shared Test Guidance

Keep the project's runners, commands, required gates, isolation setup, and links to deeper test docs in the project-owned area below this block.

- **Choose the lowest layer that faithfully proves the behavior.** Unit for pure logic; integration for real composition across storage, service, or external boundaries; simulation for deterministic event ordering against the real subject with a controlled clock; render for UI behavior through the nearest stable render boundary; end-to-end only for real browser or runtime behavior lower layers cannot prove; structural source scans only for mechanically checkable invariants that need coverage of future sites. The `test-design` skill covers layer choice and the simulation pattern.
- **Exercise the real subject and assert observable behavior.** Mock dependencies, not the behavior under test. Expected values come from an independent source (a known-good literal, a worked example, the spec), never recomputed the way the code computes them. Type fixtures against the live schema; avoid type escapes that hide invalid fixtures. Make skipped or environment-dependent coverage explicit with a reason. Remove obsolete tests.
- **Tests never write to live development or production data.** Document the separate databases, filesystem roots, and cleanup below. Add the smallest seam testability needs, such as an injected clock or storage adapter; do not add production APIs or redesign a feature to satisfy a checklist. If automation is impractical, record the constraint, run the strongest repeatable substitute, and keep the work blocked rather than claiming full verification.
- **Browser evidence.** When browser proof is required, retain the exact executable script and its report output. Disclose every fake or intercepted network and data boundary; an intercepted flow is not end-to-end evidence. Exercise genuine responsive breakpoints; forcing a desktop media query at phone viewport width cannot establish mobile acceptance.
<!-- /managed:tests -->
## Runners & commands

| Tier | Runner |
|------|--------|
| Structural (guidance budgets, pointer integrity, catalog parity, prompt contracts) | `node --test` |

```
node --test tests/**/*.test.mjs
```

No database or server. Consumers' behavior is verified in the aido repo: `AIDO_TEMPLATES_ROOT=<this checkout> npm test` there exercises the live templates, and its clean-checkout gate requires this repo to be committed first.

## Test isolation

Tests read this checkout only; nothing is written.
