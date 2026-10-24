import { expect, test, type Page } from "playwright/test";
import { open, stateOf } from "./helpers.ts";

/** Opens the app page of a language; the console errors it raises are collected in the list. */
async function openCollecting(page: Page, path: string): Promise<string[]> {
  const errors: string[] = [];
  page.on("console", (entry) => {
    if (entry.type() === "error") errors.push(entry.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await open(page, path);
  return errors;
}

test.describe("the English app page", () => {
  test("plays a round of an English text in English", async ({ page }) => {
    const errors = await openCollecting(page, "./en/app/?seed=1#text-2");
    await expect.poll(async () => (await stateOf(page))["language"]).toBe("en");
    expect(await stateOf(page)).toMatchObject({ route: "text-2", seed: 1, phase: "tip" });
    await page.getByRole("button", { name: "Got it, start" }).click();
    await expect(page.getByRole("button", { name: "Check" })).toBeVisible();
    await page.getByRole("listbox").getByRole("option").first().click();
    await page.getByRole("button", { name: "Check" }).click();
    await expect(page.getByRole("heading", { name: "Result" })).toBeVisible();
    expect(errors, "no console error").toEqual([]);
  });

  test("shows the choice and the stages in English, and keeps the language when a stage opens and a new round starts", async ({
    page,
  }) => {
    await openCollecting(page, "./en/app/?seed=1#start");
    await expect.poll(async () => (await stateOf(page))["language"]).toBe("en");
    await expect(page.getByText("What do you want to practise?")).toBeVisible();
    await page.locator(".choose .card").nth(1).click();
    await expect.poll(async () => (await stateOf(page))["route"]).toBe("quelle");
    await expect(page.locator(".stages article").first()).toContainText("Stage 1 · easy");
    await page.getByRole("button", { name: "Practise Stage 1" }).click();
    await expect.poll(async () => (await stateOf(page))["route"]).toBe("quelle-1");
    await expect.poll(async () => (await stateOf(page))["language"]).toBe("en");
    await page.getByRole("button", { name: "Got it, start" }).click();
    await page.getByRole("button", { name: "On to the rendition" }).click();
    await page.getByRole("button", { name: "Check" }).click();
    await page.getByRole("button", { name: "Another round" }).click();
    await expect.poll(async () => (await stateOf(page))["seed"]).not.toBe(1);
    expect(await stateOf(page)).toMatchObject({ language: "en", route: "quelle-1" });
  });

  test("links the English PDF of the source from the English page", async ({ page }) => {
    await openCollecting(page, "./en/app/?seed=1#quelle-3");
    const link = page.getByRole("link", { name: /source as a PDF/ });
    await expect(link).toBeAttached();
    const response = await page.request.get(await link.evaluate((a) => (a as HTMLAnchorElement).href));
    expect(response.status(), "the PDF").toBe(200);
    expect(response.headers()["content-type"]).toContain("pdf");
  });

  test("leaves the German page German", async ({ page }) => {
    await openCollecting(page, "./app/?seed=1#text-3");
    expect(await stateOf(page)).toMatchObject({ language: "de" });
    await expect(page.getByRole("button", { name: "Prüfen" })).toBeVisible();
  });
});
