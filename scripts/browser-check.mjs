import { captureSettled } from "./screenshot.mjs";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
import { projects, articles } from "../lib/content.ts";
const origin = process.env.TEST_ORIGIN || "http://localhost:3000";
const key = "section-office:demo:v1";
const results = [];
const faults = [];
const screenshots = [];
await fs.mkdir("docs/screenshots", { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  permissions: ["clipboard-read", "clipboard-write"],
});
const page = await context.newPage();
page.setDefaultTimeout(7000);
page.on("pageerror", (e) => faults.push(e.message));
const routes = [
  "/",
  "/work/",
  "/studio/",
  "/process/",
  "/journal/",
  "/start-a-project/",
  "/contact/",
  "/saved/",
  "/my-brief/",
  "/demo/",
  "/demo/inbox/",
  "/privacy/",
  ...projects.map((p) => `/work/${p.slug}/`),
  ...articles.map((a) => `/journal/${a.slug}/`),
];
async function check(name, fn) {
  try {
    await fn();
    results.push({ name, status: "passed" });
    console.log("PASS", name);
  } catch (e) {
    results.push({ name, status: "failed", error: e.message });
    console.error("FAIL", name, e.message.slice(0, 650));
  }
}
async function loaded(p = page) {
  await p.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images]
        .filter((i) => !i.closest("dialog"))
        .map((i) => {
          i.loading = "eager";
          return i.decode().catch(() => {});
        }),
    );
    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(r)),
    );
  });
}
async function shot(p, name, fullPage = true) {
  await captureSettled(p, `docs/screenshots/${name}.png`, fullPage);
  screenshots.push(`${name}.png`);
}
await check(
  "Every public route supports direct static navigation and refresh; invalid slug returns 404",
  async () => {
    for (const r of routes) {
      const response = await page.goto(origin + r);
      assert.equal(response.status(), 200, r);
      await expect(page.locator("h1")).toBeVisible();
      const again = await page.reload();
      assert.equal(again.status(), 200, r);
      assert.equal(await page.locator("main").count(), 1);
    }
    const res = await page.goto(origin + "/work/does-not-exist/");
    assert.equal(res.status(), 404);
    await expect(
      page.getByRole("heading", { name: "This space isn’t here." }),
    ).toBeVisible();
  },
);
await check(
  "Filters use URL state, reset/no-results and browser back; list preference survives refresh",
  async () => {
    await page.goto(origin + "/work/");
    await expect(page.locator(".work-grid .project-card")).toHaveCount(8);
    await page
      .getByRole("button", { name: "Residential", exact: true })
      .click();
    await expect(page).toHaveURL(/category=Residential/);
    await expect(page.locator(".work-grid .project-card")).toHaveCount(1);
    await page.getByRole("button", { name: "Cultural", exact: true }).click();
    await expect(page).toHaveURL(/category=Cultural/);
    await page.goBack();
    await expect(
      page.getByRole("button", { name: "Residential", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "List view", exact: true }).click();
    await page.reload();
    await expect(page.locator(".work-list-row")).toHaveCount(1);
    await page
      .getByRole("textbox", { name: "Search projects and materials" })
      .fill("impossiblexyz");
    await page.getByRole("button", { name: "Search", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "No studies in this view." }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Reset filters" }).click();
    await expect(page.locator(".work-list-row")).toHaveCount(8);
    await page.getByRole("link", { name: "Fold House", exact: true }).click();
    await expect(page).toHaveURL(origin + "/work/fold-house/");
    await page.goBack();
    await expect(page).toHaveURL(origin + "/work/");
    await expect(page.locator(".work-list-row")).toHaveCount(8);
  },
);
await check(
  "Accessible gallery supports arrows, zoom, Escape and focus restoration",
  async () => {
    await page.goto(origin + "/work/fold-house/");
    const trigger = page.getByRole("button", { name: /Open image 1:/ });
    await trigger.focus();
    await page.keyboard.press("Enter");
    const box = page.locator("dialog[open]");
    await expect(box).toBeVisible();
    await expect(box.locator(".lightbox-top")).toContainText("1 OF 5");
    await page.keyboard.press("ArrowRight");
    await expect(box.locator(".lightbox-top")).toContainText("2 OF 5");
    await box.getByRole("button", { name: "Zoom in" }).click();
    await expect(box.locator(".lightbox-image")).toHaveClass(/zoomed/);
    await page.keyboard.press("ArrowLeft");
    await expect(box.locator(".lightbox-top")).toContainText("1 OF 5");
    await page.keyboard.press("Escape");
    await expect(page.locator("dialog[open]")).toHaveCount(0);
    await expect(trigger).toBeFocused();
  },
);
let briefId = "";
await check(
  "Saved references, draft recovery, validation, review and duplicate-proof local submission",
  async () => {
    await page.goto(origin + "/work/fold-house/");
    await page
      .getByRole("button", { name: "Save project", exact: true })
      .click();
    await page.reload();
    await expect(
      page.getByRole("button", { name: "Remove saved project" }),
    ).toHaveAttribute("aria-pressed", "true");
    await page.goto(origin + "/saved/");
    await expect(page.locator(".work-grid")).toContainText("Fold House");
    await page.getByRole("link", { name: /Use 1 in a brief/ }).click();
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await expect(page.locator("#type-error")).toBeVisible();
    await page.getByRole("button", { name: "Use sample details" }).click();
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await page
      .getByLabel("Broad project location", { exact: true })
      .fill("A quiet meadow edge");
    await page.reload();
    await expect(
      page.getByLabel("Broad project location", { exact: true }),
    ).toHaveValue("A quiet meadow edge");
    await page.getByLabel("Approximate area, m² (optional)").fill("-4");
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await expect(page.locator("#area-error")).toBeVisible();
    await expect(
      page.getByLabel("Broad project location", { exact: true }),
    ).toHaveValue("A quiet meadow edge");
    await page.getByLabel("Approximate area, m² (optional)").fill("145");
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await expect(page.getByLabel(/Fold House/)).toBeChecked();
    await page
      .getByLabel("Other reference links (optional)")
      .fill("javascript:alert(1)");
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await expect(page.locator("#urls-error")).toBeVisible();
    await page
      .getByLabel("Other reference links (optional)")
      .fill("https://example.com/reference");
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await page.getByLabel("Email", { exact: true }).fill("broken");
    await page
      .getByRole("button", { name: "Save demo brief", exact: true })
      .click();
    await expect(page.locator("#email-error")).toBeVisible();
    await page.getByLabel("Email", { exact: true }).fill("alex@example.com");
    await page.locator("#consent").check();
    await shot(page, "brief-review-desktop");
    await page
      .getByRole("button", { name: "Save demo brief", exact: true })
      .dblclick();
    await expect(
      page.getByRole("heading", { name: "Demo brief saved in this browser." }),
    ).toBeVisible();
    const stored = await page.evaluate(
      (k) => JSON.parse(localStorage.getItem(k)),
      key,
    );
    assert.equal(stored.briefs.filter((b) => b.kind === "submitted").length, 1);
    assert.deepEqual(stored.briefs[0].data.references, ["fold-house"]);
    briefId = stored.briefs[0].id;
    assert.equal(new URL(page.url()).searchParams.has("email"), false);
    await page.reload();
    const after = await page.evaluate(
      (k) => JSON.parse(localStorage.getItem(k)),
      key,
    );
    assert.equal(after.briefs.filter((b) => b.kind === "submitted").length, 1);
  },
);
await check(
  "Local inbox status/notes synchronize to visitor view and another same-origin tab",
  async () => {
    assert.ok(briefId, "Submission must exist");
    const second = await context.newPage();
    await second.goto(origin + `/my-brief/?id=${briefId}`);
    await page.goto(origin + "/demo/inbox/");
    await expect(page.locator(".inbox-item")).toHaveCount(1);
    await page.getByLabel("Local review status").selectOption("Reviewing");
    await page
      .getByLabel("Local studio notes")
      .fill("Explore the courtyard threshold and shared light.");
    await expect(second.locator(".status-tag")).toHaveText("Reviewing");
    await page.reload();
    await expect(page.getByLabel("Local studio notes")).toHaveValue(
      "Explore the courtyard threshold and shared light.",
    );
    await shot(page, "inbox-desktop");
    await second.close();
  },
);
await check(
  "Text download and printable summary contain the actual saved brief",
  async () => {
    assert.ok(briefId);
    await page.goto(origin + `/my-brief/?id=${briefId}`);
    const event = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download text summary" }).click();
    const download = await event;
    await download.saveAs("docs/screenshots/sample-brief.txt");
    const text = await fs.readFile("docs/screenshots/sample-brief.txt", "utf8");
    assert.match(text, /A quiet meadow edge/);
    assert.match(text, /alex@example.com/);
    assert.match(text, /Reviewing/);
    assert.match(text, /no message was sent/);
    await page.emulateMedia({ media: "print" });
    await page.pdf({
      path: "docs/screenshots/sample-brief.pdf",
      format: "A4",
      printBackground: true,
      margin: { top: "18mm", bottom: "18mm", left: "18mm", right: "18mm" },
    });
    await page.emulateMedia({ media: "screen" });
  },
);
await check(
  "Clean project link sharing excludes filters and visitor fields",
  async () => {
    await page.goto(origin + "/work/fold-house/?email=private&source=demo");
    await page.evaluate(() => {
      Object.defineProperty(navigator, "share", {
        value: undefined,
        configurable: true,
      });
    });
    await page.getByRole("button", { name: "Share project" }).click();
    await expect(
      page.getByText("Project link copied.", { exact: true }),
    ).toBeVisible();
    assert.equal(
      await page.evaluate(() => navigator.clipboard.readText()),
      origin + "/work/fold-house/",
    );
  },
);
await check(
  "Contact inquiry uses sample details and appears in the same local inbox",
  async () => {
    await page.goto(origin + "/contact/");
    await page.getByRole("button", { name: "Use sample details" }).click();
    await page.getByRole("button", { name: "Save demo inquiry" }).click();
    await expect(
      page.getByRole("heading", {
        name: "Demo inquiry saved in this browser.",
      }),
    ).toBeVisible();
    await page.goto(origin + "/demo/inbox/");
    await expect(page.locator(".inbox-item")).toHaveCount(2);
    await page
      .getByRole("textbox", { name: "Search inquiries" })
      .fill("nomatch");
    await expect(
      page.getByRole("heading", { name: "No matching inquiries." }),
    ).toBeVisible();
  },
);
await check("Isolated browser context has no local records", async () => {
  const c = await browser.newContext();
  const p = await c.newPage();
  await p.goto(origin + "/my-brief/");
  await expect(
    p.getByRole("heading", { name: "Room for an idea." }),
  ).toBeVisible();
  await c.close();
});
await check(
  "Corrupt storage remains intact; reset is scoped and sample seeding is idempotent",
  async () => {
    const c = await browser.newContext();
    const p = await c.newPage();
    await p.addInitScript((k) => {
      if (!sessionStorage.getItem("test-seeded")) {
        localStorage.setItem(k, "broken JSON");
        localStorage.setItem("other-app", "keep");
        sessionStorage.setItem("test-seeded", "1");
      }
    }, key);
    await p.goto(origin + "/demo/");
    await expect(p.locator(".storage-warning")).toBeVisible();
    assert.equal(
      await p.evaluate((k) => localStorage.getItem(k), key),
      "broken JSON",
    );
    p.on("dialog", (d) => d.accept());
    await p
      .getByRole("button", { name: "Reset this demo", exact: true })
      .click();
    assert.equal(
      await p.evaluate(() => localStorage.getItem("other-app")),
      "keep",
    );
    assert.equal(await p.evaluate((k) => localStorage.getItem(k), key), null);
    await p
      .getByRole("button", { name: "Add sample data", exact: true })
      .click();
    await expect(
      p.getByRole("button", { name: "Sample data is ready" }),
    ).toBeDisabled();
    await p.reload();
    assert.equal(
      (await p.evaluate((k) => JSON.parse(localStorage.getItem(k)), key)).briefs
        .length,
      1,
    );
    await c.close();
  },
);
await check(
  "Quota and disabled storage never claim persistent success; temporary mode is explicit",
  async () => {
    const c = await browser.newContext();
    const p = await c.newPage();
    await p.addInitScript(() => {
      Storage.prototype.setItem = function () {
        throw new DOMException("Quota exceeded", "QuotaExceededError");
      };
    });
    await p.goto(origin + "/contact/");
    await p.getByRole("button", { name: "Use sample details" }).click();
    await p.getByRole("button", { name: "Save demo inquiry" }).click();
    await expect(p.locator(".storage-warning")).toContainText("not saved");
    await expect(
      p.getByRole("heading", { name: "Demo inquiry saved in this browser." }),
    ).toHaveCount(0);
    await p.getByRole("button", { name: "Use temporary session" }).click();
    await p.getByRole("button", { name: "Save demo inquiry" }).click();
    await expect(
      p.getByRole("heading", { name: "Inquiry kept for this session." }),
    ).toBeVisible();
    await p.reload();
    await expect(
      p.getByRole("button", { name: "Save demo inquiry" }),
    ).toBeVisible();
    await c.close();
    const c2 = await browser.newContext();
    const p2 = await c2.newPage();
    await p2.addInitScript(() =>
      Object.defineProperty(window, "localStorage", {
        get() {
          throw new Error("Browser storage disabled");
        },
      }),
    );
    await p2.goto(origin + "/");
    await expect(p2.locator("h1")).toBeVisible();
    await expect(p2.locator(".storage-warning")).toContainText("disabled");
    await c2.close();
  },
);
await check(
  "Mobile navigation, touch controls and keyboard focus remain usable",
  async () => {
    const c = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const p = await c.newPage();
    await p.goto(origin + "/");
    await p.getByRole("button", { name: "Open navigation" }).tap();
    await expect(p.locator("dialog[open]")).toBeVisible();
    await p.keyboard.press("Escape");
    await expect(
      p.getByRole("button", { name: "Open navigation" }),
    ).toBeFocused();
    await p.getByRole("button", { name: "Open navigation" }).tap();
    await p
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: "Work", exact: true })
      .tap();
    await expect(p).toHaveURL(origin + "/work/");
    await p.getByRole("button", { name: "Residential", exact: true }).tap();
    await expect(p.locator(".project-card")).toHaveCount(1);
    await c.close();
  },
);
const a11y = [];
await check(
  "Representative axe WCAG 2.2 AA scans have no serious or critical violations",
  async () => {
    for (const r of [
      "/",
      "/work/",
      "/work/fold-house/",
      "/studio/",
      "/process/",
      "/journal/the-space-before-the-door/",
      "/start-a-project/",
      "/contact/",
      "/demo/inbox/",
    ]) {
      await page.goto(origin + r);
      await loaded();
      const report = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      a11y.push({
        route: r,
        violations: report.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          nodes: v.nodes.map((n) => ({
            target: n.target,
            summary: n.failureSummary,
          })),
        })),
      });
    }
    const serious = a11y.flatMap((r) =>
      r.violations
        .filter((v) => v.impact === "serious" || v.impact === "critical")
        .map((v) => `${r.route}: ${v.id}`),
    );
    assert.deepEqual(serious, []);
  },
);
await check(
  "Responsive layouts and loaded images at 360, 390, 509, 768, 1024 and 1440px",
  async () => {
    for (const width of [360, 390, 509, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: width < 600 ? 844 : 1000 });
      for (const r of [
        "/",
        "/work/",
        "/work/fold-house/",
        "/start-a-project/",
        "/studio/",
      ]) {
        await page.goto(origin + r);
        await loaded();
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        );
        assert.equal(overflow, false, `${r} at ${width}px`);
        assert.equal(
          await page
            .locator("img")
            .evaluateAll(
              (is) =>
                is.filter(
                  (i) =>
                    !i.closest("dialog") && (!i.complete || !i.naturalWidth),
                ).length,
            ),
          0,
          `${r} images`,
        );
      }
    }
    for (const [width, label] of [
      [1440, "desktop"],
      [390, "mobile"],
      [509, "user-509"],
    ]) {
      const captureContext = await browser.newContext({
        viewport: { width, height: width === 1440 ? 1000 : 844 },
      });
      for (const [r, name] of [
        ["/", "home"],
        ["/work/fold-house/", "fold-house"],
        ["/work/", "work"],
        ["/start-a-project/", "brief"],
        ["/studio/", "studio"],
      ]) {
        const capture = await captureContext.newPage();
        await capture.goto(origin + r);
        await shot(capture, `${name}-${label}`);
        if (name === "home" || name === "fold-house")
          await shot(capture, `${name}-${label}-opening`, false);
        if (name === "work") {
          await capture
            .getByRole("button", { name: "List view", exact: true })
            .click();
          await shot(capture, `work-list-${label}`);
        }
        await capture.close();
      }
      await captureContext.close();
    }
  },
);
await check(
  "200% text sizing and reduced motion preserve content",
  async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const r of ["/", "/work/", "/start-a-project/"]) {
      await page.goto(origin + r);
      await page.addStyleTag({ content: "html{font-size:200%}" });
      assert.ok(
        (await page
          .locator("p")
          .first()
          .evaluate((e) => parseFloat(getComputedStyle(e).fontSize))) >= 24,
        "Text actually enlarges",
      );
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        ),
        false,
        r,
      );
    }
    assert.equal(
      await page.evaluate(
        () => getComputedStyle(document.documentElement).scrollBehavior,
      ),
      "auto",
    );
  },
);
const perf = [];
await check(
  "Measure cold mobile homepage and project performance under stated conditions",
  async () => {
    for (const r of ["/", "/work/fold-house/"]) {
      const c = await browser.newContext({
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 1,
      });
      const p = await c.newPage();
      await p.addInitScript(() => {
        window.__metrics = { lcp: 0, cls: 0 };
        new PerformanceObserver((list) => {
          const last = list.getEntries().at(-1);
          window.__metrics.lcp = last.startTime;
        }).observe({ type: "largest-contentful-paint", buffered: true });
        new PerformanceObserver((list) => {
          for (const e of list.getEntries())
            if (!e.hadRecentInput) window.__metrics.cls += e.value;
        }).observe({ type: "layout-shift", buffered: true });
      });
      const cdp = await c.newCDPSession(p);
      await cdp.send("Network.enable");
      await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
      await cdp.send("Network.emulateNetworkConditions", {
        offline: false,
        latency: 100,
        downloadThroughput: 1600000 / 8,
        uploadThroughput: 750000 / 8,
      });
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
      await p.goto(origin + r);
      await p
        .locator("img")
        .first()
        .evaluate((i) => i.decode());
      await p.waitForTimeout(1800);
      const metrics = await p.evaluate(() => ({
        lcpMs: Math.round(window.__metrics.lcp),
        cls: window.__metrics.cls,
        domContentLoadedMs: Math.round(
          performance.getEntriesByType("navigation")[0]
            .domContentLoadedEventEnd,
        ),
        transferBytes: performance
          .getEntriesByType("resource")
          .reduce((s, r) => s + r.transferSize, 0),
        fontLoaded: document.fonts.check("16px archivo"),
      }));
      perf.push({ route: r, ...metrics });
      await c.close();
    }
  },
);
await check("No uncaught client runtime errors", async () =>
  assert.deepEqual(faults, []),
);
await fs.writeFile(
  "docs/browser-verification.json",
  JSON.stringify(
    {
      testedAt: new Date().toISOString(),
      origin,
      browser: await browser.version(),
      results,
      a11y,
      performance: {
        conditions:
          "Headless Chromium, 390×844, new isolated context per page, HTTP localhost static export, cache disabled, 1.6 Mbps download / 0.75 Mbps upload / 100ms latency, 4× CPU throttle; one run each, not Lighthouse or field data",
        measurements: perf,
      },
      screenshots,
      faults,
    },
    null,
    2,
  ),
);
await context.close();
await browser.close();
console.log(
  JSON.stringify(
    {
      passed: results.filter((r) => r.status === "passed").length,
      failed: results.filter((r) => r.status === "failed").length,
      performance: perf,
    },
    null,
    2,
  ),
);
if (results.some((r) => r.status === "failed")) process.exitCode = 1;
