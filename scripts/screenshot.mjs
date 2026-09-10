import sharp from "sharp";

// Chromium's captureBeyondViewport can omit decoded images. Join actual viewport
// captures instead; every pixel comes from the browser at the requested width.
export async function captureSettled(page, path, fullPage = true) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForLoadState("networkidle");
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images]
        .filter((i) => !i.closest("dialog"))
        .map((i) => {
          i.loading = "eager";
          return i.decode();
        }),
    );
  });
  const { width, height: viewportHeight } = page.viewportSize();
  const height = fullPage
    ? await page.evaluate(() => document.documentElement.scrollHeight)
    : viewportHeight;
  const tiles = [];
  for (let top = 0; top < height; top += viewportHeight) {
    const scroll = await page.evaluate((y) => {
      scrollTo({ top: y, behavior: "instant" });
      return scrollY;
    }, top);
    await page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
    );
    const screenshot = await page.screenshot({ fullPage: false });
    const offset = top - scroll;
    const tileHeight = Math.min(viewportHeight - offset, height - top);
    tiles.push({
      input: await sharp(screenshot)
        .extract({ left: 0, top: offset, width, height: tileHeight })
        .toBuffer(),
      left: 0,
      top,
    });
  }
  await sharp({ create: { width, height, channels: 3, background: "#F1F2F0" } })
    .composite(tiles)
    .png()
    .toFile(path);
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
}
