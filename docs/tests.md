<!-- managed:tests v=13 -->
## Shared Test Guidance

Keep the project's runners, commands, required gates, isolation setup, and links to deeper test docs in the project-owned area below this block. List only tiers the project uses.

### Choose the layer

Use the lowest layer that faithfully proves the behavior:

- **Unit:** pure logic and narrow contracts.
- **Integration:** real composition across storage, service, or external-facing boundaries.
- **Simulation:** deterministic state/event ordering against the real subject with controlled time.
- **Render / component:** UI behavior through the nearest stable render boundary.
- **E2E:** real browser or runtime behavior lower layers cannot faithfully prove.
- **Structural:** mechanically expressible source invariants that need coverage of future sites.

Use `frontend-tests`, `testing-by-simulation`, or `structural-tests` when available for the corresponding test design. Required commands and run frequency are project-specific, not implied by the tier names.

### Isolation and testability

Tests must not write to live development or production data. Document separate databases, filesystem roots, fixtures, and cleanup in the project-owned area.

Make inputs constructable and outputs observable at the chosen test boundary. Add the smallest useful seam, such as an injected clock or storage adapter, when needed. Do not add production APIs or redesign a feature solely to satisfy a generic checklist. Record concrete automation constraints and verify with the strongest repeatable substitute. If that cannot establish the agreed outcome, keep the work blocked rather than claiming full verification.

### Assertions and fixtures

- Exercise the real subject and assert observable behavior. Mock dependencies, not the behavior being tested.
- In typed projects, type fixtures and mocks against the live schema or interface; avoid type escapes that conceal invalid fixtures.
- Use builders when repeated fixture setup warrants them.
- Make skipped or environment-dependent coverage explicit, with a reason and a tracked issue for unresolved gaps.
- Remove obsolete or ineffective tests; improve suspected coverage gaps using targeted checks from `test-hardening` when available.
<!-- /managed:tests -->