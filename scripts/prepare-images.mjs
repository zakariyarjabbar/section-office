import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
const root = process.cwd();
await fs.mkdir("public/images", { recursive: true });
await fs.mkdir("assets/originals", { recursive: true });
const manifest = JSON.parse(
  await fs.readFile("assets/image-manifest.json", "utf8"),
);
for (const a of manifest) {
  const input = path.join(root, a.original);
  for (const width of [640, 960, 1536]) {
    const target = `public/images/${a.slug}-${a.order}${width === 1536 ? "" : `-${width}`}.webp`;
    try {
      await fs.access(target);
    } catch {
      await sharp(input)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 84, effort: 5 })
        .toFile(target);
    }
  }
}
console.log(
  `Optimized ${manifest.length} original visualizations in three responsive sizes.`,
);
