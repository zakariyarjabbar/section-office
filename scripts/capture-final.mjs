import fs from "node:fs/promises";
import { chromium, expect } from "@playwright/test";
const origin = process.env.TEST_ORIGIN || "http://localhost:3000";
const browser = await chromium.launch({
  headless: true,
  args: ["--disable-gpu"],
});
await fs.mkdir(".impeccable/review", { recursive: true });
import { captureSettled } from "./screenshot.mjs";

for (const [width, label] of [
  [1440, "desktop"],
  [390, "mobile"],
  [509, "user-509"],
]) {
  const context = await browser.newContext({
    viewport: { width, height: width === 1440 ? 1000 : 844 },
  });
  for (const [route, name] of [
    ["/", "home"],
    ["/work/fold-house/", "fold-house"],
    ["/work/", "work"],
    ["/start-a-project/", "brief"],
    ["/studio/", "studio"],
  ]) {
    const page = await context.newPage();
    await page.goto(origin + route);
    await expect(page.locator("h1")).toBeVisible();
    await captureSettled(page, `docs/screenshots/${name}-${label}.png`);
    if (name === "home" || name === "fold-house")
      await captureSettled(
        page,
        `docs/screenshots/${name}-${label}-opening.png`,
        false,
      );
    if (name === "home")
      await fs.copyFile(
        `docs/screenshots/home-${label}.png`,
        `.impeccable/review/${label}.png`,
      );
    if (name === "work") {
      await page
        .getByRole("button", { name: "List view", exact: true })
        .click();
      await expect(page.locator(".work-list-row")).toHaveCount(8);
      await captureSettled(page, `docs/screenshots/work-list-${label}.png`);
    }
    await page.close();
  }
  await context.close();
  console.log(`Captured ${label} at ${width}px`);
}
await browser.close();
