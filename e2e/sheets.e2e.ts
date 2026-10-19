import { expect, test, type Page } from "playwright/test";

const DESKTOP = { width: 1280, height: 800 };

async function open(page: Page, path: string): Promise<void> {
  await page.setViewportSize(DESKTOP);
  await page.goto(path);
  await expect(page.locator(".interactive-app")).toHaveAttribute("data-mounted", "");
}

test.describe("Original and Variante as sheets on a wide screen", () => {
  test("shows one sheet at a time and turns between them", async ({ page }) => {
    await open(page, "./app/?seed=1#klasse-5-6");
    const original = page.locator(".panel.original");
    const rendition = page.locator(".panel.rendition");
    // the round starts with the Original
    await expect(original).toBeVisible();
    await expect(rendition).toBeHidden();
    await expect(page.getByRole("button", { name: "Original", exact: true })).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "Variante", exact: true }).click();
    await expect(rendition).toBeVisible();
    await expect(original).toBeHidden();
    await page.getByRole("button", { name: "Original", exact: true }).click();
    await expect(original).toBeVisible();
    await expect(rendition).toBeHidden();
  });

  test("gives the Original and the Variante the same height, and one keyboard hint below them", async ({ page }) => {
    await open(page, "./app/?seed=1#klasse-5-6");
    const lineHeights = await page.evaluate(() => {
      const variant = document.querySelector(".panel.rendition .words p");
      return variant ? getComputedStyle(variant).lineHeight : "";
    });
    const originalLine = await page.evaluate(() => {
      const el = document.querySelector(".panel.original p");
      return el ? getComputedStyle(el).lineHeight : "";
    });
    expect(lineHeights).toBe(originalLine);
    // the hint is below the sheets, not between the heading and the text
    await page.waitForTimeout(500);
    const hint = await page.locator("#words-hint").boundingBox();
    const sheet = await page.locator(".panel.rendition").boundingBox();
    expect((hint?.y ?? 0) >= (sheet?.y ?? 0) + (sheet?.height ?? 0)).toBe(true);
  });

  test("keeps the switch on top while a sheet turns, so a quick tap hits the button", async ({ page }) => {
    await open(page, "./app/?seed=1#klasse-5-6");
    await page.getByRole("button", { name: "Variante", exact: true }).click();
    // the sheet swings out over the switch for 0.4 s; at no moment may it take the place of the button under a finger
    for (let step = 0; step < 10; step++) {
      const top = await page.evaluate(() => {
        const button = document.querySelectorAll(".switch button")[1];
        if (!button) return "no button";
        const box = button.getBoundingClientRect();
        const element = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2);
        return element?.closest(".switch") ? "button" : "sheet";
      });
      expect(top).toBe("button");
      await page.waitForTimeout(40);
    }
  });

  test("never shows both sheets, and keeps the marks when turning", async ({ page }) => {
    await open(page, "./app/?seed=1#klasse-5-6");
    await page.getByRole("button", { name: "Variante", exact: true }).click();
    await page.getByRole("listbox").getByRole("option").nth(3).click();
    await expect(page.getByText("1 markiert", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Original", exact: true }).click();
    await page.getByRole("button", { name: "Variante", exact: true }).click();
    await expect(page.getByText("1 markiert", { exact: true })).toBeVisible();
    await expect(page.getByRole("listbox").getByRole("option").nth(3)).toHaveAttribute("aria-selected", "true");
    // the Original is not in the page while the Variante shows: no side by side, no tab into it, no screen reader text
    await expect(page.locator(".panel.original")).toBeHidden();
    await expect(page.locator(".panel.original")).toHaveCSS("display", "none");
  });

  test("turns with a short animation, and without it when the system asks for less motion", async ({ page }) => {
    await open(page, "./app/?seed=1#klasse-5-6");
    await expect(page.locator(".panel.rendition")).toHaveCSS("animation-duration", "0.4s");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator(".panel.rendition")).toHaveCSS("animation-name", "none");
  });

  test("lays the two texts of Original erkennen like sheets too", async ({ page }) => {
    await open(page, "./app/?seed=1#klasse-5-6-original");
    const a = page.locator(".panel.a");
    const b = page.locator(".panel.b");
    await expect(a).toBeVisible();
    await expect(b).toBeHidden();
    await page.getByRole("button", { name: "Text B", exact: true }).click();
    await expect(b).toBeVisible();
    await expect(a).toBeHidden();
    await page.getByRole("button", { name: "Text B hat die Fehler" }).click();
    await page.getByRole("button", { name: "Text A", exact: true }).click();
    await page.getByRole("button", { name: "Text B", exact: true }).click();
    await expect(page.getByRole("button", { name: "Text B hat die Fehler" })).toHaveAttribute("aria-pressed", "true");
  });

  test("puts the source PDF next to the Variante where it is embedded, and its button above the Variante where it is not", async ({
    page,
  }) => {
    await open(page, "./app/?seed=1#klasse-5-6-quelle");
    await page.setViewportSize({ width: 1440, height: 1000 });
    const embedded = await page.evaluate(() => matchMedia("(min-width: 1300px) and (pointer: fine)").matches);
    // no switch for the PDF, in either case
    await expect(page.locator(".switch")).toHaveCount(0);
    await expect(page.locator(".panel.rendition")).toBeVisible();
    if (embedded) {
      const pdf = page.locator(".panel.original");
      await expect(pdf).toBeVisible();
      expect((await pdf.boundingBox())?.width ?? 0).toBeGreaterThanOrEqual(700);
      expect((await page.locator(".panel.rendition").boundingBox())?.width ?? 0).toBeGreaterThanOrEqual(480);
    } else {
      await expect(page.locator(".panel.original")).toHaveCount(0);
      const link = await page.locator("a.open").boundingBox();
      const sheet = await page.locator(".panel.rendition").boundingBox();
      expect((link?.y ?? 1) < (sheet?.y ?? 0)).toBe(true);
      const column = await page.locator(".interactive").boundingBox();
      expect((sheet?.width ?? 0) >= (column?.width ?? 1) - 40).toBe(true);
    }
  });
});
