import { expect, test, type Page } from "playwright/test";

const CLOCK = "lernappsClock";

/** Lets `count` ticks of 20 ms pass on the tests' clock of the page, where no other time passes. */
async function pass(page: Page, count: number): Promise<void> {
  await page.evaluate(
    ({ count, property }) => (Reflect.get(globalThis, property) as { tick(count: number): void }).tick(count),
    { count, property: CLOCK },
  );
}

async function open(page: Page, route: string): Promise<void> {
  await page.addInitScript((property) => Reflect.set(globalThis, property, {}), CLOCK);
  await page.goto(`./app/?seed=2#${route}`);
  await expect(page.locator(".interactive-app")).toHaveAttribute("data-mounted", "");
}

test.describe("Hints", () => {
  test("wait, name the kinds of error, then mark the sentences, and then there are no more", async ({ page }) => {
    await open(page, "klasse-9-10");
    await page.getByRole("button", { name: "Variante", exact: true }).click();
    const button = page.getByRole("button", { name: /^Hinweis|^Keine weiteren Hinweise/ });
    await expect(button).toBeDisabled();
    await expect(button).toHaveText("Hinweis in 15 s");
    await pass(page, 750);
    await expect(button).toBeEnabled();
    await button.click();
    await expect(page.getByText("Hinweis: In dieser Runde stecken diese Fehlerarten im Text")).toBeVisible();
    await expect(button).toHaveText("Hinweis in 20 s");
    await pass(page, 1000);
    await button.click();
    await expect(page.locator("[data-tag]").first()).toBeVisible();
    await expect(button).toHaveText("Keine weiteren Hinweise");
    await expect(button).toBeDisabled();
  });

  test("mark the same sentences in both texts in the mode Original erkennen", async ({ page }) => {
    await open(page, "klasse-9-10-original");
    await pass(page, 750);
    await page.getByRole("button", { name: "Hinweis", exact: true }).click();
    await pass(page, 1000);
    await page.getByRole("button", { name: "Hinweis", exact: true }).click();
    const tagged = async (name: string): Promise<number> => {
      await page.getByRole("button", { name, exact: true }).first().click();
      return page.locator(".panel:visible [data-tag]").count();
    };
    const a = await tagged("Text A");
    const b = await tagged("Text B");
    expect(a).toBeGreaterThan(0);
    expect(b).toBeGreaterThan(0);
  });
});
