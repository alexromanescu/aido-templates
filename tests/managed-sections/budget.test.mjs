import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

const ROOT = new URL("../../", import.meta.url).pathname;
const SECTIONS_DIR = join(ROOT, "managed-sections");

// Budgets are deliberate ceilings, not targets. Raising one is a policy change:
// justify it in the commit and in CLAUDE.md's "Budgets" section.
const CLAUDE_MD_DEFAULT_TOTAL_BODY_WORDS = 750;
const SINGLE_SECTION_BODY_WORDS = 700;

function parseSection(filename, text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  assert.ok(m, `${filename}: missing frontmatter`);
  const fm = Object.fromEntries(
    m[1].split("\n").filter(Boolean).map((line) => {
      const i = line.indexOf(":");
      return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
    }),
  );
  const body = m[2];
  const words = body.split(/\s+/).filter(Boolean).length;
  return { filename, fm, body, words };
}

async function loadSections() {
  const files = (await readdir(SECTIONS_DIR)).filter((f) => f.endsWith(".md")).sort();
  return Promise.all(files.map(async (f) => parseSection(f, await readFile(join(SECTIONS_DIR, f), "utf8"))));
}

async function walkMarkdown(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "node_modules" || entry.name === "tests") continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walkMarkdown(path, out);
    else if (entry.name.endsWith(".md")) out.push(path);
  }
  return out;
}

test("every managed section declares section/stack/version and matches its filename", async () => {
  for (const s of await loadSections()) {
    assert.match(s.fm.version ?? "", /^\d+$/, `${s.filename}: version`);
    assert.equal(`${s.fm.section}-${s.fm.stack}.md`, s.filename, `${s.filename}: section/stack must match filename`);
  }
});

test("always-loaded CLAUDE.md guidance stays within the word budget", async () => {
  const sections = await loadSections();
  const claudeDefault = sections.filter((s) => (s.fm.target ?? "CLAUDE.md") === "CLAUDE.md" && s.fm.stack === "default");
  const total = claudeDefault.reduce((n, s) => n + s.words, 0);
  const detail = claudeDefault.map((s) => `${s.fm.section}=${s.words}`).join(", ");
  assert.ok(
    total <= CLAUDE_MD_DEFAULT_TOTAL_BODY_WORDS,
    `CLAUDE.md default blocks total ${total} body words (${detail}); budget ${CLAUDE_MD_DEFAULT_TOTAL_BODY_WORDS}`,
  );
  for (const s of sections) {
    assert.ok(s.words <= SINGLE_SECTION_BODY_WORDS, `${s.filename}: ${s.words} body words; budget ${SINGLE_SECTION_BODY_WORDS}`);
  }
});

test("every docs/process pointer resolves to an existing process-* section", async () => {
  const sections = await loadSections();
  const processTargets = new Set(sections.map((s) => s.fm.target).filter((t) => t?.startsWith("docs/process/")));
  const files = [
    ...(await walkMarkdown(join(ROOT, "managed-sections"))),
    ...(await walkMarkdown(join(ROOT, "skills"))),
    ...(await walkMarkdown(join(ROOT, "prompts"))),
    ...(await walkMarkdown(join(ROOT, "rooms"))),
    ...(await readdir(ROOT)).filter((f) => f.endsWith("-default.md")).map((f) => join(ROOT, f)),
  ];
  const dangling = [];
  for (const file of files) {
    const text = await readFile(file, "utf8");
    for (const m of text.matchAll(/docs\/process\/[a-z-]+\.md/g)) {
      if (!processTargets.has(m[0])) dangling.push(`${file.slice(ROOT.length)} -> ${m[0]}`);
    }
  }
  assert.deepEqual(dangling, [], `dangling process-doc pointers:\n${dangling.join("\n")}`);
});

test("no template, skill, or prompt names a skill that no longer exists", async () => {
  const existing = new Set((await readdir(join(ROOT, "skills"), { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name));
  const retired = ["frontend-tests", "testing-by-simulation", "test-hardening"].filter((n) => !existing.has(n));
  const files = [
    ...(await walkMarkdown(join(ROOT, "managed-sections"))),
    ...(await walkMarkdown(join(ROOT, "skills"))),
    ...(await walkMarkdown(join(ROOT, "prompts"))),
    ...(await walkMarkdown(join(ROOT, "rooms"))),
  ];
  const hits = [];
  for (const file of files) {
    const text = await readFile(file, "utf8");
    for (const name of retired) {
      if (new RegExp(`\`${name}\``).test(text)) hits.push(`${file.slice(ROOT.length)} names \`${name}\``);
    }
  }
  assert.deepEqual(hits, []);
});
