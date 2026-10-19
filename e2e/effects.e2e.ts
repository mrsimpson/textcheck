import { expect, test, type Page } from "playwright/test";

const STATE = "lernappsState";
const CLOCK = "lernappsClock";

type Round = { tokens: { id: number; slot: string | null }[]; corruptions: { slot: string }[] };

/** Opens a round, marks the first word of every error and checks; with `hint`, takes the first hint before. */
async function playAllFound(page: Page, hint: boolean): Promise<void> {
  await page.addInitScript((property) => Reflect.set(globalThis, property, {}), CLOCK);
  await page.goto("./app/?seed=2#klasse-9-10");
  await expect(page.locator(".interactive-app")).toHaveAttribute("data-mounted", "");
  await page.getByRole("button", { name: "Variante", exact: true }).click();
  if (hint) {
    await page.evaluate(
      (property) => (Reflect.get(globalThis, property) as { tick(count: number): void }).tick(750),
      CLOCK,
    );
    await page.getByRole("button", { name: "Hinweis", exact: true }).click();
  }
  const round = await page
    .locator(".interactive-app")
    .evaluate((element, property) => Reflect.get(element, property) as Round, STATE);
  for (const { slot } of round.corruptions) {
    const first = round.tokens.find((token) => token.slot === slot);
    await page.locator(`#word-${first?.id}`).click();
  }
  await page.getByRole("button", { name: "Prüfen", exact: true }).click();
  await expect(page.locator("#result-heading")).toBeVisible();
}

test.describe("Effects when every error is found", () => {
  test("fireworks without a hint", async ({ page }) => {
    await playAllFound(page, false);
    await expect(page.locator(".fireworks")).toHaveCount(1);
    await expect(page.locator(".confetti")).toHaveCount(0);
    await expect(page.getByText("Du hast Hinweise genutzt")).toHaveCount(0);
  });

  test("confetti and an encouraging sentence with a hint", async ({ page }) => {
    await playAllFound(page, true);
    await expect(page.locator(".confetti")).toHaveCount(1);
    await expect(page.locator(".fireworks")).toHaveCount(0);
    await expect(page.getByText("Beim nächsten Mal klappt es vielleicht auch ohne.")).toBeVisible();
  });
});
