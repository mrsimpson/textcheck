import { expect, test, type Page } from "playwright/test";

async function open(page: Page): Promise<void> {
  await page.goto("./app/?seed=1#klasse-5-6");
  await expect(page.locator(".interactive-app")).toHaveAttribute("data-mounted", "");
}

const textStyle = (page: Page, property: string): Promise<string> =>
  page
    .locator(".panel.original p")
    .first()
    .evaluate((element, name) => getComputedStyle(element).getPropertyValue(name), property);

test.describe("Settings for reading", () => {
  test("loads the bundled font, and sets style, size and spacing for the texts", async ({ page }) => {
    await open(page);
    await expect.poll(() => page.evaluate(() => document.fonts.check('16px "Recursive TC"'))).toBe(true);
    await page.getByText("Schrift und Lesen", { exact: true }).click();
    await page.getByRole("radio", { name: "Festbreite" }).check();
    await expect.poll(() => textStyle(page, "font-variation-settings")).toContain('"MONO" 1');
    await page.getByRole("radio", { name: "Rund" }).check();
    await expect.poll(() => textStyle(page, "font-variation-settings")).toContain('"CASL" 1');
    await page.getByLabel("Größe").fill("1.5");
    await expect.poll(() => textStyle(page, "font-size")).toBe("24px");
    await page.getByLabel("Zeilenabstand").fill("2.5");
    await expect.poll(() => textStyle(page, "line-height")).toBe("60px");
  });

  test("keeps the settings on the device, and goes back to the defaults", async ({ page }) => {
    await open(page);
    await page.getByText("Schrift und Lesen", { exact: true }).click();
    await page.getByLabel("Strichstärke").fill("700");
    await expect.poll(() => textStyle(page, "font-weight")).toBe("700");
    await page.reload();
    await expect(page.locator(".interactive-app")).toHaveAttribute("data-mounted", "");
    await expect.poll(() => textStyle(page, "font-weight")).toBe("700");
    await page.getByText("Schrift und Lesen", { exact: true }).click();
    await page.getByRole("button", { name: "Zurücksetzen" }).click();
    await expect.poll(() => textStyle(page, "font-weight")).toBe("400");
    await expect(page.getByRole("button", { name: "Zurücksetzen" })).toBeDisabled();
  });

  test("works when the browser blocks storage", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, "localStorage", {
        get() {
          throw new Error("blocked");
        },
      });
    });
    await open(page);
    await page.getByText("Schrift und Lesen", { exact: true }).click();
    await page.getByLabel("Strichstärke").fill("600");
    await expect.poll(() => textStyle(page, "font-weight")).toBe("600");
  });
});
