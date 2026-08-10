/**
 * BUG-712
 * Symptom: A fresh Program teamlead treated a provider-native sandbox denial as
 * an unavailable aido tool surface, stopped before dispatch, and told the owner
 * to Revive/Reopen the engagement.
 * Root cause: The generic "Reopened program" recovery paragraph did not require
 * surfaced reopen context or an aido invocation failure in the current turn.
 * Fix: Fresh launches dispatch the surfaced next action; reopen recovery is
 * gated by both surfaced reopen context and a current-turn aido call failure,
 * while native read-only/sandbox denials are explicitly unrelated.
 */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const prompt = await readFile(
  new URL("../../prompts/teamlead-program.md", import.meta.url),
  "utf8",
);

const reopenedHeading = "## Reopened program";
const reopenedOffset = prompt.indexOf(reopenedHeading);
assert.notEqual(reopenedOffset, -1, "the Program prompt must retain reopen recovery");

const normalProgram = prompt.slice(0, reopenedOffset);
const reopenedProgram = prompt.slice(reopenedOffset);
const compactNormalProgram = normalProgram.replace(/\s+/g, " ");
const compactReopenedProgram = reopenedProgram.replace(/\s+/g, " ");

test("a fresh Program launch dispatches the surfaced next-actionable item", () => {
  assert.match(
    normalProgram,
    /fresh engagement[\s\S]{0,500}next-actionable[\s\S]{0,500}`aido\.spawnWorker`/i,
  );
  assert.doesNotMatch(normalProgram, /please use\s+Revive\/Reopen/i);
});

test("reopen recovery requires surfaced reopen context and a current-turn aido failure", () => {
  assert.match(
    compactReopenedProgram,
    /use this recovery.{0,80}surfaced.{0,160}Reopened.{0,80}Revived/i,
  );
  assert.match(
    compactNormalProgram,
    /never claim.{0,160}rejected, missing, or disconnected.{0,160}advise Revive\/Reopen.{0,80}unless an actual `aido\.\*` invocation in the current turn returned.{0,120}failure/i,
  );
  assert.match(reopenedProgram, /Revive\/Reopen/i);
  assert.doesNotMatch(reopenedProgram, /confirm your tools reconnected/i);
});

test("a provider-native denial is not evidence that aido MCP is unavailable", () => {
  assert.match(
    compactNormalProgram,
    /provider-native.{0,120}(?:read-only|sandbox).{0,180}does not.{0,120}aido MCP availability/i,
  );
  assert.match(
    compactNormalProgram,
    /native host actions.{0,120}never claim.{0,120}(?:rejected|missing|disconnected)/i,
  );
});
