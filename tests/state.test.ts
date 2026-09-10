import test from "node:test";
import assert from "node:assert/strict";
import {
  emptyEnvelope,
  parseEnvelope,
  toggleSaved,
  validateBrief,
  sampleBrief,
  newBrief,
  saveBrief,
  parseFilters,
  validUrl,
  STORAGE_KEY,
  briefText,
} from "../lib/state";
import {
  hydrate,
  mutate,
  getSnapshot,
  resetStore,
  sessionMode,
} from "../lib/browser-store";
import { projects, articles, categories } from "../lib/content";
import { pageMetadata, validateOrigin } from "../lib/metadata";

test("filter parser rejects unknown categories, preserves decoded queries and bounds text", () => {
  assert.deepEqual(
    parseFilters(
      new URLSearchParams("category=Residential&q=oak+seat"),
      categories,
    ),
    { category: "Residential", query: "oak seat" },
  );
  assert.equal(
    parseFilters(new URLSearchParams("category=untrusted"), categories)
      .category,
    "",
  );
  assert.equal(
    parseFilters(new URLSearchParams("q=" + "x".repeat(500)), categories).query
      .length,
    100,
  );
});
test("saved toggles are stable, reversible and ignore obsolete fixtures", () => {
  let s = emptyEnvelope();
  s = toggleSaved(s, "fold-house");
  assert.deepEqual(s.saved, ["fold-house"]);
  s = toggleSaved(s, "fold-house");
  assert.deepEqual(s.saved, []);
  assert.equal(toggleSaved(s, "removed-project"), s);
});
test("schema hydration filters invalid IDs and malformed records without seeding over values", () => {
  const b = newBrief(sampleBrief());
  const s = {
    ...emptyEnvelope(),
    saved: ["fold-house", "old", "fold-house"],
    view: "list",
    briefs: [b, { id: "bad" }, b],
  };
  const parsed = parseEnvelope(JSON.stringify(s));
  assert.deepEqual(parsed.saved, ["fold-house"]);
  assert.equal(parsed.view, "list");
  assert.equal(parsed.briefs.length, 1);
  assert.equal(parsed.briefs[0].data.name, "Alex Example");
  assert.deepEqual(parseEnvelope(null), emptyEnvelope());
});
test("corruption and unsupported versions are explicit; v0 is deliberately migrated", () => {
  assert.throws(() => parseEnvelope("{broken"), /could not be read/);
  assert.throws(() => parseEnvelope('{"version":999}'), /unsupported/);
  assert.deepEqual(
    parseEnvelope(
      JSON.stringify({ version: 0, savedIds: ["fold-house"], view: "list" }),
    ).saved,
    ["fold-house"],
  );
});
test("brief validation preserves partial values and rejects unsafe links and false consent", () => {
  const d = sampleBrief();
  assert.ok(validateBrief(d).consent);
  d.consent = true;
  assert.deepEqual(validateBrief(d), {});
  d.area = "-4";
  d.urls = "javascript:alert(1)";
  const errors = validateBrief(d);
  assert.ok(errors.area);
  assert.ok(errors.urls);
  assert.equal(d.name, "Alex Example");
  assert.equal(validUrl("https://example.com/references"), true);
  assert.equal(validUrl("https://user:pass@example.com"), false);
  assert.equal(validUrl("data:text/html,hello"), false);
});
test("one draft creates one submitted reference; duplicate submit cannot add or mutate it", () => {
  const b = newBrief({ ...sampleBrief(), consent: true });
  let s = saveBrief(emptyEnvelope(), b);
  assert.equal(s.briefs[0].kind, "draft");
  s = saveBrief(s, b, true);
  assert.equal(s.briefs.length, 1);
  assert.equal(s.briefs[0].kind, "submitted");
  assert.ok(s.briefs[0].submittedAt);
  assert.equal(
    saveBrief(s, { ...b, data: { ...b.data, name: "Changed" } }, true),
    s,
  );
  assert.match(
    briefText(s.briefs[0]),
    /No message was sent|no message was sent/,
  );
});
test("storage adapter reads latest data, fails honestly, supports explicit session mode and scoped reset", () => {
  const values = new Map<string, string>();
  let blocked = false;
  const storage = {
    getItem: (k: string) => values.get(k) ?? null,
    setItem: (k: string, v: string) => {
      if (blocked) throw new Error("Quota exceeded");
      values.set(k, v);
    },
    removeItem: (k: string) => values.delete(k),
  };
  Object.defineProperty(globalThis, "window", {
    value: { localStorage: storage },
    configurable: true,
  });
  hydrate();
  assert.equal(getSnapshot().hydrated, true);
  storage.setItem(
    STORAGE_KEY,
    JSON.stringify({ ...emptyEnvelope(), saved: ["common-ground"] }),
  );
  assert.equal(
    mutate((s) => toggleSaved(s, "fold-house")),
    true,
  );
  assert.deepEqual(getSnapshot().state.saved, ["common-ground", "fold-house"]);
  blocked = true;
  assert.equal(
    mutate((s) => toggleSaved(s, "foundry-hall")),
    false,
  );
  assert.ok(getSnapshot().error.includes("not saved"));
  assert.equal(getSnapshot().state.saved.includes("foundry-hall"), false);
  sessionMode();
  assert.equal(
    mutate((s) => toggleSaved(s, "foundry-hall"), "Added"),
    true,
  );
  assert.ok(getSnapshot().notice.includes("Temporary session"));
  values.set("another-app", "keep");
  blocked = false;
  assert.equal(resetStore(), true);
  assert.equal(values.get("another-app"), "keep");
  assert.equal(values.has(STORAGE_KEY), false);
  values.set(STORAGE_KEY, "broken");
  hydrate();
  assert.ok(getSnapshot().error);
  assert.equal(values.get(STORAGE_KEY), "broken");
  resetStore();
  Object.defineProperty(globalThis, "window", {
    value: {
      get localStorage() {
        throw new Error("Storage disabled");
      },
    },
    configurable: true,
  });
  hydrate();
  assert.ok(getSnapshot().error.includes("disabled"));
  assert.equal(
    mutate((s) => s),
    false,
  );
  delete (globalThis as { window?: unknown }).window;
});
test("every public project and article maps to its own raster cover with full metadata", () => {
  assert.equal(projects.length, 8);
  assert.equal(projects.filter((p) => p.flagship).length, 3);
  assert.equal(
    projects.reduce((sum, p) => sum + p.images.length, 0),
    30,
  );
  for (const p of projects) {
    const m = pageMetadata(p.name, p.intro, `/work/${p.slug}/`, p.slug);
    assert.match(String(m.title), new RegExp(p.name));
    assert.equal(
      (m.openGraph?.images as { url: string }[])[0].url,
      `http://localhost:3000/social/${p.slug}-v1.jpg`,
    );
    assert.equal((m.twitter as { card: string })?.card, "summary_large_image");
  }
  assert.equal(articles.length, 3);
  for (const a of articles)
    assert.equal(
      (
        pageMetadata(a.title, a.subtitle, `/journal/${a.slug}/`, a.slug)
          .openGraph?.images as { url: string }[]
      )[0].url.endsWith(`/${a.slug}-v1.jpg`),
      true,
    );
});
test("public origin validation rejects credentials, paths, placeholders and insecure public hosts", () => {
  assert.equal(
    validateOrigin("http://localhost:3000"),
    "http://localhost:3000",
  );
  assert.equal(
    validateOrigin("https://portfolio.test"),
    "https://portfolio.test",
  );
  for (const u of [
    "https://user:secret@host.com",
    "https://host.com/path",
    "http://host.com",
    "https://example.com",
    "https://host.com/?private=1",
  ])
    assert.throws(() => validateOrigin(u));
});
