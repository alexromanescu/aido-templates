import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const skill = await readFile(
  new URL("../../skills/program-prep/SKILL.md", import.meta.url),
  "utf8",
);
const compactSkill = skill.replace(/\s+/g, " ");

test("program prep keeps the minimum launch contract explicit", () => {
  assert.match(
    compactSkill,
    /annotate every sequence item.{0,160}aido:work-item/i,
  );
  assert.match(
    compactSkill,
    /bind each brief.{0,160}aido:brief/i,
  );
  assert.match(
    compactSkill,
    /valid known identity.{0,120}every `workItemId` is unique.{0,120}every `briefRef` resolves unambiguously to a bound brief/i,
  );
  assert.match(
    compactSkill,
    /at least one completion gate is required.{0,160}declare `"gates":\{"review":"required","acceptance":"required","owner":"none"\}`.{0,100}Checkpoint/i,
  );
  assert.match(
    compactSkill,
    /at most one review or acceptance verdict-bearing gate is (?:allowed|permitted).{0,160}owner-only holds.{0,100}(?:valid|allowed).{0,100}not verdict-bearing/i,
  );
});

test("unknown marker keys and marker-version drift warn without blocking launch", () => {
  assert.match(
    compactSkill,
    /unknown marker keys.{0,120}version drift.{0,160}warn/i,
  );
  assert.match(
    compactSkill,
    /(?:do not|does not|rather than|instead of).{0,100}(?:unlaunchable|refus(?:e|al)|block(?:ing)? launch)/i,
  );
  assert.doesNotMatch(
    compactSkill,
    /unknown key makes the whole cursor unlaunchable/i,
  );
});

test("uncovered completion-gate chains are advisory rather than launch refusal", () => {
  assert.match(
    compactSkill,
    /uncovered completion-gate chains?.{0,160}advisory warnings?/i,
  );
  assert.doesNotMatch(
    compactSkill,
    /every other non-deferred item must be a transitive dependency.{0,100}launch is refused/i,
  );
});
