import { expect, test } from "playwright/test";
import { markAllErrors, open, openRound, stateOf } from "./helpers.ts";

test.describe("The way through the app: exercise, stage, tip, round", () => {
  test("starts with the choice of the exercise: two cards, each with its question", async ({ page }) => {
    await open(page, "./app/?seed=1#start");
    expect(await stateOf(page)).toMatchObject({ phase: "choose" });
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Textcheck");
    const cards = page.locator(".choose .card");
    await expect(cards).toHaveCount(2);
    await expect(cards.nth(0)).toContainText("Fehler im Text finden");
    await expect(cards.nth(0)).toContainText("Ist das richtig geschrieben?");
    await expect(cards.nth(1)).toContainText("Mit der Quelle vergleichen");
    await expect(cards.nth(1)).toContainText("Sagt die Quelle das wirklich so?");
  });

  test("opens the page of an unknown or old address on the choice", async ({ page }) => {
    await open(page, "./app/?seed=1#klasse-5-6");
    expect(await stateOf(page)).toMatchObject({ phase: "choose", route: "start" });
  });

  test("shows three stages with what each holds, and marks the kinds of error a stage adds as new", async ({
    page,
  }) => {
    await open(page, "./app/?seed=1#start");
    await page.locator(".choose .card").first().click();
    await expect.poll(async () => (await stateOf(page))["route"]).toBe("text");
    const cards = page.locator(".stages article");
    await expect(cards).toHaveCount(3);
    await expect(cards.nth(0)).toContainText("Stufe 1 · leicht");
    await expect(cards.nth(0).locator(".chip.added")).toHaveCount(0);
    await expect(cards.nth(1).locator(".chip.added")).toHaveCount(2);
    await expect(cards.nth(1).locator(".chip.added").first()).toContainText("neu");
    await expect(cards.nth(2).locator(".chip.added")).toHaveCount(1);
    await expect(cards.nth(2).locator(".chip.added")).toContainText("Widerspruch im Text");
    // the older kinds of error stay on the card, so a stage shows all it holds
    await expect(cards.nth(2).locator(".chip")).toHaveCount(5);
    await expect(cards.nth(0)).toContainText("Wörter in");
    await expect(cards.nth(2)).toContainText("Die Aufgabe nennt die Fehlerarten nicht.");
    await expect(cards.nth(0)).toContainText("Ein Lesetipp vorab.");
  });

  test("gives the stages of the comparison with a source a sheet, then a link", async ({ page }) => {
    await open(page, "./app/?seed=1#quelle");
    const cards = page.locator(".stages article");
    await expect(cards.nth(0)).toContainText("Ausschnitt der Quelle liegt als eigenes Blatt dabei");
    await expect(cards.nth(2)).toContainText("Die Quelle ist der echte Artikel als Link");
  });

  test("reads the reading tip first, as a list on the first stage and as a sentence on the second, and none on the third", async ({
    page,
  }) => {
    await open(page, "./app/?seed=1#text-1");
    await expect(page.getByRole("heading", { name: "So liest du hier" })).toBeVisible();
    await expect(page.locator(".tip li")).toHaveCount(3);
    await open(page, "./app/?seed=1#text-2");
    await expect(page.getByRole("heading", { name: "So liest du hier" })).toBeVisible();
    await expect(page.locator(".tip li")).toHaveCount(0);
    await expect(page.locator(".tip .box p")).toHaveCount(2);
    await open(page, "./app/?seed=1#text-3");
    expect(await stateOf(page)).toMatchObject({ phase: "marking" });
    await expect(page.getByRole("button", { name: "Wie lese ich hier?" })).toBeVisible();
  });

  test("starts the round after the tip, and the question of the exercise stands above the text", async ({ page }) => {
    await open(page, "./app/?seed=1#text-1");
    await page.getByRole("button", { name: "Verstanden, los" }).click();
    expect(await stateOf(page)).toMatchObject({ phase: "marking", stage: 1 });
    await expect(page.getByRole("heading", { name: "Ist das richtig geschrieben?" })).toBeFocused();
    await expect(page.getByRole("listbox")).toBeVisible();
    await page.getByRole("button", { name: "Wie lese ich hier?" }).click();
    await expect(page.locator(".tipbox li")).toHaveCount(3);
  });

  test("asks the extra question of a contradiction on the third stage of the text exercise", async ({ page }) => {
    await open(page, "./app/?seed=1#text-3");
    await expect(page.getByRole("heading", { level: 2 }).first()).toContainText("Passt das zu dem, was vorher stand?");
  });

  test("takes the learner through the page with buttons, and the address follows each page", async ({ page }) => {
    await open(page, "./app/?seed=1#start");
    await page.locator(".choose .card").nth(1).click();
    await expect.poll(async () => (await stateOf(page))["route"]).toBe("quelle");
    expect(new URL(page.url()).hash).toBe("#quelle");
    await page.getByRole("button", { name: "Stufe 2 üben" }).click();
    await expect.poll(async () => (await stateOf(page))["route"]).toBe("quelle-2");
    expect(new URL(page.url()).hash).toBe("#quelle-2");
    expect(await stateOf(page)).toMatchObject({ phase: "tip" });
    await page.getByRole("button", { name: "← Stufe wählen" }).click();
    await expect.poll(async () => (await stateOf(page))["route"]).toBe("quelle");
    await page.getByRole("button", { name: "← Andere Übung wählen" }).click();
    await expect.poll(async () => (await stateOf(page))["route"]).toBe("start");
  });

  test("leads from page to page with the back and forward buttons of the browser", async ({ page }) => {
    await open(page, "./app/?seed=1#start");
    await page.locator(".choose .card").first().click();
    await expect.poll(async () => (await stateOf(page))["route"]).toBe("text");
    await page.getByRole("button", { name: "Stufe 3 üben" }).click();
    await expect.poll(async () => (await stateOf(page))["route"]).toBe("text-3");
    await page.goBack();
    await expect.poll(async () => (await stateOf(page))["route"]).toBe("text");
    await page.goBack();
    await expect.poll(async () => (await stateOf(page))["route"]).toBe("start");
    await page.goForward();
    await expect.poll(async () => (await stateOf(page))["route"]).toBe("text");
  });

  test("opens the round of a shared address", async ({ page }) => {
    await open(page, "./app/?seed=5#quelle-2");
    expect(await stateOf(page)).toMatchObject({ seed: 5, route: "quelle-2", stage: 2, kind: "quelle" });
  });

  test("takes the seed from the address only: without a valid one, it works one out, writes it, and plays it", async ({
    page,
  }) => {
    for (const address of ["./app/#text-3", "./app/?seed=abc#text-3", "./app/?seed=-3#text-3", "./app/"]) {
      await open(page, address);
      const written = new URL(page.url());
      const seed = Number(written.searchParams.get("seed"));
      expect(Number.isInteger(seed) && seed > 0, address).toBe(true);
      expect(await stateOf(page), address).toMatchObject({ seed });
    }
  });

  test("puts the seed of the next round in the address, starts it without the tip, and leads back with the back button", async ({
    page,
  }) => {
    await openRound(page, "./app/?seed=424242#text-1");
    await page.getByRole("button", { name: "Prüfen" }).click();
    await page.getByRole("button", { name: "Noch eine Runde" }).click();
    await expect.poll(async () => (await stateOf(page))["seed"]).toBe(424243);
    expect(new URL(page.url()).searchParams.get("seed")).toBe("424243");
    expect(await stateOf(page)).toMatchObject({ phase: "marking", route: "text-1" });
    await page.goBack();
    await expect.poll(async () => (await stateOf(page))["seed"]).toBe(424242);
  });

  test("scrolls to what to do next after checking, above the explanations", async ({ page }) => {
    await openRound(page, "./app/?seed=1#text-1");
    await page.getByRole("button", { name: "Prüfen" }).click();
    const again = page.getByRole("button", { name: "Noch eine Runde" });
    await expect(again).toBeInViewport();
    const [button, first] = await Promise.all([
      again.boundingBox(),
      page.locator(".result .class").first().boundingBox(),
    ]);
    expect(button!.y).toBeLessThan(first!.y);
  });

  test("gives a tick to a stage passed, and advises the next stage", async ({ page }) => {
    await openRound(page, "./app/?seed=3#text-1");
    await markAllErrors(page);
    await page.getByRole("button", { name: "Prüfen" }).click();
    await expect(page.getByText("Du bist bereit für Stufe 2.")).toBeVisible();
    await page.getByRole("button", { name: "Weiter mit Stufe 2" }).click();
    await expect.poll(async () => (await stateOf(page))["route"]).toBe("text-2");
    await page.getByRole("button", { name: "← Stufe wählen" }).click();
    await expect(page.locator(".stages article").nth(0)).toContainText("geschafft");
    await expect(page.locator(".stages article").nth(1)).not.toContainText("geschafft");
    await page.reload();
    await expect(page.locator(".interactive-app")).toHaveAttribute("data-mounted", "");
    await expect(page.locator(".stages article").nth(0)).toContainText("geschafft");
  });

  test("advises another round with a tip for what was missed", async ({ page }) => {
    await openRound(page, "./app/?seed=3#text-1");
    await page.getByRole("button", { name: "Prüfen" }).click();
    await expect(page.getByText("Probier noch eine Runde auf dieser Stufe.")).toBeVisible();
    await expect(page.getByText(/^Tipp: /)).toBeVisible();
  });
});
