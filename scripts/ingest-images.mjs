import fs from "node:fs/promises";
const sets = [
  ["assets/fold-manifest.json", "fold-house"],
  ["/private/tmp/section-foundry-assets/manifest.json", "foundry-hall"],
  ["/private/tmp/section-common-assets/manifest.json", "common-ground"],
  ["/private/tmp/section-collection-assets/manifest.json", null],
];
const combined = [];
for (const [file, defaultSlug] of sets) {
  const data = JSON.parse(await fs.readFile(file, "utf8"));
  const counts = {};
  for (const a of data.assets || data.images) {
    const slug = defaultSlug || a.slug;
    const order = (counts[slug] = (counts[slug] || 0) + 1);
    const src = a.output_path || a.path || a.source_path;
    const original = `assets/originals/${slug}-${order}.png`;
    await fs.copyFile(src, original);
    combined.push({
      slug,
      order,
      original,
      source: src,
      prompt: a.exact_prompt || a.prompt,
      caption: a.caption || "",
      generator: "Built-in image_gen",
      usage:
        "Original fictional architectural visualization generated for this portfolio concept; not documentary photography.",
    });
  }
}
await fs.writeFile(
  "assets/image-manifest.json",
  JSON.stringify(combined, null, 2),
);
console.log(`Ingested ${combined.length} images.`);
