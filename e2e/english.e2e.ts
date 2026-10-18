import { expect, test, type Page } from "playwright/test";

const STATE = "lernappsState";

/** The core's state, which the runtime keeps on the app element. */
const stateOf = (page: Page) =>
  page
    .locator(".interactive-app")
    .evaluate((element, property) => Reflect.get(element, property) as Record<string, unknown>, STATE);

/** Opens the app page of a language at a route and a seed; the console errors it raises are collected in the list. */
async function open(page: Page, path: string): Promise<string[]> {
  const errors: string[] = [];
  page.on("console", (entry) => {
    if (entry.type() === "error") errors.push(entry.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(path);
  await expect(page.locator(".interactive-app")).toHaveAttribute("data-mounted", "");
  return errors;
}

test.describe("the English app page", () => {
  test("plays a round of an English pack in English", async ({ page }) => {
    const errors = await open(page, "./en/app/?seed=1#klasse-5-6");
    await expect.poll(async () => (await stateOf(page))["language"]).toBe("en");
    expect(await stateOf(page)).toMatchObject({ route: "klasse-5-6", seed: 1, phase: "marking" });
    await expect(page.getByRole("button", { name: "Check" })).toBeVisible();
    await expect(page.getByLabel("Age group")).toBeVisible();
    await page.getByRole("listbox").getByRole("option").first().click();
    await page.getByRole("button", { name: "Check" }).click();
    await expect(page.getByRole("heading", { name: "Result" })).toBeVisible();
    expect(errors, "no console error").toEqual([]);
  });

  test("keeps the language when the route changes, and when a new round starts", async ({ page }) => {
    await open(page, "./en/app/?seed=1#klasse-5-6");
    await expect.poll(async () => (await stateOf(page))["language"]).toBe("en");
    await page.getByLabel("Mode").selectOption("choose");
    await expect.poll(async () => (await stateOf(page))["route"]).toBe("klasse-5-6-original");
    await expect.poll(async () => (await stateOf(page))["language"]).toBe("en");
    await expect(page.getByRole("button", { name: "Text A has the errors" })).toBeVisible();
    await page.getByLabel("Age group").selectOption("klasse-11-13");
    await expect.poll(async () => (await stateOf(page))["route"]).toBe("klasse-11-13-original");
    await expect.poll(async () => (await stateOf(page))["language"]).toBe("en");
  });

  test("links the English PDF of the source from the English page", async ({ page }) => {
    await open(page, "./en/app/?seed=1#klasse-9-10-quelle");
    const link = page.locator("a.open");
    await expect(link).toBeAttached();
    const response = await page.request.get(await link.evaluate((a) => (a as HTMLAnchorElement).href));
    expect(response.status(), "the PDF").toBe(200);
    expect(response.headers()["content-type"]).toContain("pdf");
  });

  test("leaves the German page German", async ({ page }) => {
    await open(page, "./app/?seed=1#klasse-5-6");
    expect(await stateOf(page)).toMatchObject({ language: "de", packId: "fledermaeuse" });
    await expect(page.getByRole("button", { name: "Prüfen" })).toBeVisible();
  });
});
