import { expect, test, type Page } from "playwright/test";
import { CLOCK, open } from "./helpers.ts";

/** Lets `count` ticks of 20 ms pass on the tests' clock of the page, where no other time passes. */
async function pass(page: Page, count: number): Promise<void> {
  await page.evaluate(
    ({ count, property }) => (Reflect.get(globalThis, property) as { tick(count: number): void }).tick(count),
    { count, property: CLOCK },
  );
}

async function openWithClock(page: Page, route: string): Promise<void> {
  await page.addInitScript((property) => Reflect.set(globalThis, property, {}), CLOCK);
  await open(page, `./app/?seed=2#${route}`);
}

test.describe("Hints", () => {
  test("wait, name the kinds of error, then mark the sentences, and then there are no more", async ({ page }) => {
    await openWithClock(page, "text-3");
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

  test("do not run while the reading tip shows, and start with the round", async ({ page }) => {
    await openWithClock(page, "text-2");
    await expect(page.getByRole("button", { name: "Hinweis", exact: true })).toHaveCount(0);
    await pass(page, 750);
    await page.getByRole("button", { name: "Verstanden, los" }).click();
    await expect(page.getByRole("button", { name: "Hinweis in 15 s" })).toBeDisabled();
  });
});
