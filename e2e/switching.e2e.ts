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

  test("shows the seed of the round in the address, and a reload gives the same round", async ({ page }) => {
    await open(page);
    expect(new URL(page.url()).searchParams.get("seed")).toBe("1");
    await page.getByLabel("Modus").selectOption("choose");
    await expect.poll(async () => (await stateOf(page))["route"]).toBe("klasse-5-6-original");
    const seed = String((await stateOf(page))["seed"]);
    expect(seed).not.toBe("1");
    expect(new URL(page.url()).searchParams.get("seed")).toBe(seed);
    expect(new URL(page.url()).hash).toBe("#klasse-5-6-original");
    await page.reload();
    await expect(page.locator(".interactive-app")).toHaveAttribute("data-mounted", "");
    expect(await stateOf(page)).toMatchObject({ route: "klasse-5-6-original", seed: Number(seed) });
  });

  test("puts the seed of the next round in the address, also where none was given", async ({ page }) => {
    await page.goto("./app/#klasse-5-6");
    await expect(page.locator(".interactive-app")).toHaveAttribute("data-mounted", "");
    const first = String((await stateOf(page))["seed"]);
    expect(new URL(page.url()).searchParams.get("seed")).toBe(first);
    await page.getByRole("button", { name: "Variante", exact: true }).click();
    await page.getByRole("button", { name: "Prüfen" }).click();
    await page.getByRole("button", { name: "Neue Runde" }).click();
    await expect.poll(async () => String((await stateOf(page))["seed"])).toBe(String(Number(first) + 1));
    expect(new URL(page.url()).searchParams.get("seed")).toBe(String(Number(first) + 1));
  });

  test("scrolls to the button for the next round after checking, above the explanations", async ({ page }) => {
    await open(page);
    await page.getByRole("button", { name: "Variante", exact: true }).click();
    await page.getByRole("button", { name: "Prüfen" }).click();
    const again = page.getByRole("button", { name: "Neue Runde" });
    await expect(again).toBeInViewport();
    const [again_, first] = await Promise.all([
      again.boundingBox(),
      page.locator(".result .class").first().boundingBox(),
    ]);
    expect(again_!.y).toBeLessThan(first!.y);
  });

  test("leads from round to round with the back and forward buttons of the browser", async ({ page }) => {
    await open(page);
    await page.getByLabel("Modus").selectOption("choose");
    await expect.poll(async () => (await stateOf(page))["route"]).toBe("klasse-5-6-original");
    const second = (await stateOf(page))["seed"];
    expect(second).not.toBe(1);
    await page.goBack();
    await expect.poll(async () => (await stateOf(page))["route"]).toBe("klasse-5-6");
    expect(await stateOf(page)).toMatchObject({ seed: 1 });
    expect(new URL(page.url()).searchParams.get("seed")).toBe("1");
    await expect(page.getByLabel("Modus")).toHaveValue("mark");
    await page.goForward();
    await expect.poll(async () => (await stateOf(page))["route"]).toBe("klasse-5-6-original");
    expect(await stateOf(page)).toMatchObject({ seed: second });
    await expect(page.getByLabel("Modus")).toHaveValue("choose");
  });

  test("leads back from the next round to the round before", async ({ page }) => {
    await open(page);
    await page.getByRole("button", { name: "Variante", exact: true }).click();
    await page.getByRole("button", { name: "Prüfen" }).click();
    await page.getByRole("button", { name: "Neue Runde" }).click();
    await expect.poll(async () => (await stateOf(page))["seed"]).toBe(2);
    await page.goBack();
    await expect.poll(async () => (await stateOf(page))["seed"]).toBe(1);
    expect(new URL(page.url()).searchParams.get("seed")).toBe("1");
  });

  test("opens the round of a shared address", async ({ page }) => {
    await page.goto("./app/?seed=5#klasse-7-8-original");
    await expect(page.locator(".interactive-app")).toHaveAttribute("data-mounted", "");
    expect(await stateOf(page)).toMatchObject({ seed: 5, route: "klasse-7-8-original" });
    await expect(page.getByLabel("Altersstufe")).toHaveValue("klasse-7-8");
    await expect(page.getByLabel("Modus")).toHaveValue("choose");
  });

  test("takes the seed from the address only: without a valid one, it works one out, writes it, and plays it", async ({
    page,
  }) => {
    for (const address of ["./app/#klasse-5-6", "./app/?seed=abc#klasse-5-6", "./app/?seed=-3#klasse-5-6", "./app/"]) {
      await page.goto(address);
      await expect(page.locator(".interactive-app")).toHaveAttribute("data-mounted", "");
      const written = new URL(page.url());
      const seed = Number(written.searchParams.get("seed"));
      expect(Number.isInteger(seed) && seed > 0, address).toBe(true);
      expect(written.hash, address).toMatch(/^#klasse-/);
      expect(await stateOf(page), address).toMatchObject({ seed });
    }
  });

  test("plays the round of the address, whatever seed the page would have drawn", async ({ page }) => {
    await page.goto("./app/?seed=424242#klasse-5-6");
    await expect(page.locator(".interactive-app")).toHaveAttribute("data-mounted", "");
    expect(await stateOf(page)).toMatchObject({ seed: 424242, route: "klasse-5-6" });
    await page.getByRole("button", { name: "Variante", exact: true }).click();
    await page.getByRole("button", { name: "Prüfen" }).click();
    await page.getByRole("button", { name: "Neue Runde" }).click();
    await expect.poll(async () => (await stateOf(page))["seed"]).toBe(424243);
    expect(new URL(page.url()).searchParams.get("seed")).toBe("424243");
  });
});
