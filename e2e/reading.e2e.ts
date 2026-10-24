import { expect, test, type Page } from "playwright/test";
import { openRound } from "./helpers.ts";

async function open(page: Page): Promise<void> {
  await openRound(page, "./app/?seed=1#text-1");
}

const textStyle = (page: Page, property: string): Promise<string> =>
  page
    .locator(".words p")
    .first()
    .evaluate((element, name) => getComputedStyle(element).getPropertyValue(name), property);

test.describe("Settings for reading", () => {
  test("loads the bundled font, and sets style, size and spacing for the texts", async ({ page }) => {
    await open(page);
    await expect.poll(() => page.evaluate(() => document.fonts.check('16px "Recursive TC"'))).toBe(true);
    await page.getByRole("button", { name: "Schrift", exact: true }).click();
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
    await page.getByRole("button", { name: "Schrift", exact: true }).click();
    await page.getByLabel("Strichstärke").fill("700");
    await expect.poll(() => textStyle(page, "font-weight")).toBe("700");
    await page.reload();
    await expect(page.locator(".interactive-app")).toHaveAttribute("data-mounted", "");
    await page.getByRole("button", { name: "Verstanden, los" }).click();
    await expect.poll(() => textStyle(page, "font-weight")).toBe("700");
    await page.getByRole("button", { name: "Schrift", exact: true }).click();
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
    await page.getByRole("button", { name: "Schrift", exact: true }).click();
    await page.getByLabel("Strichstärke").fill("600");
    await expect.poll(() => textStyle(page, "font-weight")).toBe("600");
  });

  test("keeps the settings out of the way: one small button, a dialog that closes with Done or Escape", async ({
    page,
  }) => {
    await open(page);
    const button = page.getByRole("button", { name: "Schrift", exact: true });
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await button.click();
    const dialog = page.getByRole("dialog", { name: "Schrift und Lesen" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Fertig" }).click();
    await expect(dialog).toBeHidden();
    await expect(button).toBeFocused();
    await button.click();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(button).toBeFocused();
    expect((await button.boundingBox())?.height ?? 99).toBeLessThan(60);
  });

  test("puts the button in the line of the heading, at its right edge, and leaves one heading", async ({ page }) => {
    await open(page);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Textcheck");
    const heading = await page.getByRole("heading", { level: 1 }).boundingBox();
    const button = await page.getByRole("button", { name: "Schrift", exact: true }).boundingBox();
    const column = await page.locator(".interactive").boundingBox();
    const middle = (box: { y: number; height: number } | null): number => (box?.y ?? 0) + (box?.height ?? 0) / 2;
    expect(Math.abs(middle(heading) - middle(button))).toBeLessThan(6);
    expect((column?.x ?? 0) + (column?.width ?? 0) - ((button?.x ?? 0) + (button?.width ?? 0))).toBeLessThan(24);
  });
});
