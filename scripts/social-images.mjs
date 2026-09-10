import fs from "node:fs/promises";
import sharp from "sharp";
import opentype from "opentype.js";
import { projects, articles } from "../lib/content.ts";
const font = opentype.parse(
  await fs.readFile(
    "node_modules/@fontsource/archivo/files/archivo-latin-500-normal.woff",
  ),
);
const regular = opentype.parse(
  await fs.readFile(
    "node_modules/@fontsource/archivo/files/archivo-latin-400-normal.woff",
  ),
);
function measure(text, size, f = font) {
  return [...text].reduce(
    (n, c) => n + ((f.charToGlyph(c).advanceWidth || 0) * size) / f.unitsPerEm,
    0,
  );
}
// Serialize source font contours without the optimizer mutating cached glyphs.
function contour(glyph) {
  return glyph.path.commands
    .map((c) => {
      switch (c.type) {
        case "M":
        case "L":
          return c.type + c.x + " " + c.y;
        case "Q":
          return "Q" + c.x1 + " " + c.y1 + " " + c.x + " " + c.y;
        case "C":
          return (
            "C" +
            c.x1 +
            " " +
            c.y1 +
            " " +
            c.x2 +
            " " +
            c.y2 +
            " " +
            c.x +
            " " +
            c.y
          );
        case "Z":
          return "Z";
        default:
          throw new Error("Unsupported glyph command " + c.type);
      }
    })
    .join(" ");
}
function lettering(text, x, y, size, fill = "#171A1B", f = font) {
  let markup = "";
  const scale = size / f.unitsPerEm;
  for (const c of text) {
    const glyph = f.charToGlyph(c);
    markup += `<path d="${contour(glyph)}" transform="translate(${x} ${y}) scale(${scale} -${scale})" fill="${fill}"/>`;
    x += (glyph.advanceWidth || 0) * scale;
  }
  return markup;
}
function lines(text, max = 23) {
  const result = [""];
  for (const w of text.split(" ")) {
    const last = result.length - 1;
    if ((result[last] + " " + w).trim().length > max && result[last])
      result.push(w);
    else result[last] = (result[last] + " " + w).trim();
  }
  return result;
}
await fs.mkdir("public/social", { recursive: true });
await fs.mkdir("docs/screenshots/covers", { recursive: true });
const entries = [
  {
    id: "home",
    title: "SECTION / OFFICE",
    image: projects[0].images[0].src,
    descriptor: "Architecture & Interiors",
  },
  {
    id: "fallback",
    title: "SECTION / OFFICE",
    image: projects[2].images[0].src,
    descriptor: "Architecture & Interiors",
  },
  ...projects.map((p) => ({
    id: p.slug,
    title: p.name,
    image: p.images[0].src,
    descriptor: "SECTION / OFFICE",
  })),
  ...articles.map((a) => ({
    id: a.slug,
    title: a.title,
    image: projects.find((p) => p.id === a.project).images[a.imageIndex].src,
    descriptor: "SECTION / OFFICE — JOURNAL",
  })),
];
const manifest = [];
for (const e of entries) {
  const photo = await sharp("public" + e.image)
    .resize(1200, 440, { fit: "cover", position: "centre" })
    .toBuffer();
  const titleLines = lines(e.title);
  let type = "";
  if (titleLines.length === 1) {
    let size = e.id === "home" || e.id === "fallback" ? 49 : 58;
    while (measure(e.title, size) > 605) size--;
    type += lettering(e.title, 300, 524, size);
    type += lettering(e.descriptor, 303, 578, 23, "#626969", regular);
  } else {
    type +=
      lettering(titleLines[0], 300, 495, 44) +
      lettering(titleLines[1], 300, 545, 44) +
      lettering(e.descriptor, 302, 600, 18, "#626969", regular);
  }
  const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect y="440" width="1200" height="190" fill="#F1F2F0"/><path d="M300 459h74" stroke="#244EFF" stroke-width="4"/><path d="M1050 540h35l39-65M1050 559h47l39-65" stroke="#244EFF" stroke-width="5" fill="none"/>${type}</svg>`;
  const filename = `${e.id}-v1.jpg`;
  await sharp({
    create: { width: 1200, height: 630, channels: 3, background: "#F1F2F0" },
  })
    .composite([
      { input: photo, left: 0, top: 0 },
      { input: Buffer.from(overlay) },
    ])
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(`public/social/${filename}`);
  const stat = await fs.stat(`public/social/${filename}`);
  manifest.push({
    id: e.id,
    file: `/social/${filename}`,
    title: e.title,
    image: e.image,
    width: 1200,
    height: 630,
    bytes: stat.size,
  });
  await sharp(`public/social/${filename}`)
    .resize(360, 189)
    .toFile(`docs/screenshots/covers/${e.id}-thumbnail.jpg`);
  await sharp(`public/social/${filename}`)
    .extract({ left: 285, top: 0, width: 630, height: 630 })
    .resize(360, 360)
    .toFile(`docs/screenshots/covers/${e.id}-square.jpg`);
}
await fs.writeFile(
  "public/social/manifest.json",
  JSON.stringify(manifest, null, 2),
);
console.log(
  `Created ${manifest.length} social covers (1200×630); largest ${(Math.max(...manifest.map((x) => x.bytes)) / 1024).toFixed(0)} KB.`,
);
