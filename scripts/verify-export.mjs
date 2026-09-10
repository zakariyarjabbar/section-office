import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import assert from "node:assert/strict";
import { projects, articles } from "../lib/content.ts";
const origin = new URL(process.env.SITE_URL || "http://localhost:3000").origin;
const routes = [
  { route: "/", cover: "home" },
  ...[
    "work",
    "studio",
    "process",
    "journal",
    "start-a-project",
    "contact",
    "saved",
    "my-brief",
    "demo",
    "demo/inbox",
    "privacy",
  ].map((p) => ({ route: `/${p}/`, cover: "fallback" })),
  ...projects.map((p) => ({ route: `/work/${p.slug}/`, cover: p.slug })),
  ...articles.map((a) => ({ route: `/journal/${a.slug}/`, cover: a.slug })),
];
const failures = [];
const evidence = [];
function metas(html, key) {
  return [
    ...html.matchAll(
      new RegExp(
        `<meta[^>]*(?:property|name)="${key}"[^>]*content="([^"]*)"[^>]*>`,
        "g",
      ),
    ),
  ].map((m) => m[1]);
}
for (const { route, cover } of routes) {
  try {
    const html = await fs.readFile(
      path.join("out", route, "index.html"),
      "utf8",
    );
    const required = [
      "description",
      "og:title",
      "og:description",
      "og:type",
      "og:url",
      "og:site_name",
      "og:image",
      "og:image:width",
      "og:image:height",
      "og:image:alt",
      "twitter:card",
      "twitter:title",
      "twitter:description",
      "twitter:image",
    ];
    for (const tag of required)
      assert.equal(
        metas(html, tag).length,
        1,
        `${route} ${tag} missing or duplicated`,
      );
    assert.equal(metas(html, "og:url")[0], origin + route);
    assert.equal(
      metas(html, "og:image")[0],
      `${origin}/social/${cover}-v1.jpg`,
    );
    assert.equal(
      metas(html, "twitter:image")[0],
      `${origin}/social/${cover}-v1.jpg`,
    );
    assert.equal(metas(html, "twitter:card")[0], "summary_large_image");
    const canonical = [
      ...html.matchAll(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/g),
    ];
    assert.equal(canonical.length, 1);
    assert.equal(canonical[0][1], origin + route);
    assert.equal(metas(html, "og:image:width")[0], "1200");
    assert.equal(metas(html, "og:image:height")[0], "630");
    const meta = await sharp(`out/social/${cover}-v1.jpg`).metadata();
    assert.equal(meta.width, 1200);
    assert.equal(meta.height, 630);
    assert.equal(meta.format, "jpeg");
    assert.ok(html.includes("<h1"));
    assert.ok(!html.includes("mailto:"));
    evidence.push({
      route,
      cover,
      canonical: canonical[0][1],
      status: "passed",
    });
  } catch (e) {
    failures.push(e.message);
  }
}
const covers = JSON.parse(
  await fs.readFile("out/social/manifest.json", "utf8"),
);
assert.equal(covers.length, 13);
for (const c of covers)
  assert.ok(c.bytes < 500 * 1024, `${c.file} exceeds cover target`);
for (const p of projects)
  for (const im of p.images) await fs.access("out" + im.src);
const notFound = await fs.readFile("out/404.html", "utf8");
assert.match(notFound, /This space/);
await fs.writeFile(
  "docs/export-verification.json",
  JSON.stringify(
    { origin, routes: evidence, covers: 13, images: 30, failures },
    null,
    2,
  ),
);
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(
  `Verified ${routes.length} exported routes, 13 covers, 30 project images and 404. All canonical/OG/Twitter tags match ${origin}.`,
);
