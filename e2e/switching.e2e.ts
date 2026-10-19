import { expect, test, type Page } from "playwright/test";

const STATE = "lernappsState";

const stateOf = (page: Page) =>
  page
    .locator(".interactive-app")
    .evaluate((element, property) => Reflect.get(element, property) as Record<string, unknown>, STATE);

async function open(page: Page): Promise<void> {
  await page.goto("./app/?seed=1#klasse-5-6");
  await expect(page.locator(".interactive-app")).toHaveAttribute("data-mounted", "");
}

const markAWord = async (page: Page): Promise<void> => {
  await page.getByRole("button", { name: "Variante", exact: true }).click();
  await page.getByRole("listbox").getByRole("option").nth(3).click();
  await expect(page.getByText("1 markiert", { exact: true })).toBeVisible();
};

test.describe("Switching the age group or the mode", () => {
  test("starts a new round with a new seed, so that the same text does not come back", async ({ page }) => {
    await open(page);
    await page.getByLabel("Modus").selectOption("choose");
    await expect.poll(async () => (await stateOf(page))["route"]).toBe("klasse-5-6-original");
    await expect.poll(async () => (await stateOf(page))["seed"]).not.toBe(1);
    const second = (await stateOf(page))["seed"];
    await page.getByLabel("Modus").selectOption("mark");
    await expect.poll(async () => (await stateOf(page))["route"]).toBe("klasse-5-6");
    await expect.poll(async () => (await stateOf(page))["seed"]).not.toBe(second);
    expect(await stateOf(page)).toMatchObject({ phase: "marking" });
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("asks first when words are marked, and goes on with the round when the learner stays", async ({ page }) => {
    await open(page);
    await markAWord(page);
    await page.getByLabel("Altersstufe").selectOption("klasse-7-8");
    const dialog = page.getByRole("dialog", { name: "Neue Runde beginnen?" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Bleiben" }).click();
    await expect(dialog).toBeHidden();
    expect(await stateOf(page)).toMatchObject({ route: "klasse-5-6", seed: 1 });
    await expect(page.getByLabel("Altersstufe")).toHaveValue("klasse-5-6");
    await expect(page.getByText("1 markiert", { exact: true })).toBeVisible();
  });

  test("goes on with the round when the dialog is closed with Escape", async ({ page }) => {
    await open(page);
    await markAWord(page);
    await page.getByLabel("Modus").selectOption("choose");
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
    expect(await stateOf(page)).toMatchObject({ route: "klasse-5-6", seed: 1 });
    await expect(page.getByLabel("Modus")).toHaveValue("mark");
  });

  test("starts the new round, without the marks, when the learner changes", async ({ page }) => {
    await open(page);
    await markAWord(page);
    await page.getByLabel("Altersstufe").selectOption("klasse-7-8");
    await page.getByRole("dialog").getByRole("button", { name: "Wechseln" }).click();
    await expect.poll(async () => (await stateOf(page))["route"]).toBe("klasse-7-8");
    await expect.poll(async () => (await stateOf(page))["seed"]).not.toBe(1);
    expect(await stateOf(page)).toMatchObject({ marked: [], phase: "marking" });
    await expect(page.getByLabel("Altersstufe")).toHaveValue("klasse-7-8");
  });
});
