import { expect, type Page } from "playwright/test";

export const STATE = "lernappsState";
export const CLOCK = "lernappsClock";

/** The core's state, which the runtime keeps on the app element. */
export const stateOf = (page: Page) =>
  page
    .locator(".interactive-app")
    .evaluate((element, property) => Reflect.get(element, property) as Record<string, unknown>, STATE);

/** Opens an address of the app and waits until the app is mounted. */
export async function open(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await expect(page.locator(".interactive-app")).toHaveAttribute("data-mounted", "");
}

/** Opens a round of the app: the reading tip is read, so that the words show (the German page). */
export async function openRound(page: Page, path: string): Promise<void> {
  await open(page, path);
  const go = page.getByRole("button", { name: /^(Verstanden, los|Got it, start)$/ });
  if (await go.isVisible()) await go.click();
}

type Round = { tokens: { id: number; slot: string | null }[]; corruptions: { slot: string }[] };

/** Marks the first word of every error of the round, in the rendition. */
export async function markAllErrors(page: Page): Promise<void> {
  const round = (await stateOf(page)) as unknown as Round;
  for (const { slot } of round.corruptions) {
    const first = round.tokens.find((token) => token.slot === slot);
    await page.locator(`#word-${first?.id}`).click();
  }
}
