import { expect, test } from "playwright/test";
import { open, openRound, stateOf } from "./helpers.ts";

const DESKTOP = { width: 1440, height: 1000 };

test.describe("Source and rendition as sheets, one at a time", () => {
  test("starts on the source, with one button to turn to the rendition and no button that checks", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await openRound(page, "./app/?seed=1#quelle-1");
    await expect(page.getByRole("heading", { name: "Quelle (Ausschnitt)" })).toBeVisible();
    await expect(page.getByRole("listbox")).toHaveCount(0);
    await expect(page.locator(".bar button")).toHaveCount(1);
    await expect(page.getByRole("button", { name: "Weiter zur Wiedergabe" })).toBeVisible();
    for (const name of ["Prüfen", "Markierungen löschen", "Quelle ansehen", "Hinweis"])
      await expect(page.getByRole("button", { name })).toHaveCount(0);
    expect(await stateOf(page)).toMatchObject({ view: "source" });
  });

  test("never shows both sheets, not even on a wide screen: one sheet in the page, at the width of the column", async ({
    page,
  }) => {
    await page.setViewportSize(DESKTOP);
    await openRound(page, "./app/?seed=1#quelle-1");
    await expect(page.locator(".sheet")).toHaveCount(1);
    // measured by layout, not by the box: while a sheet turns, its box is narrower
    const width = (selector: string): Promise<number> =>
      page.locator(selector).evaluate((element) => (element as HTMLElement).offsetWidth);
    const column = await width(".interactive");
    expect(await width(".sheet")).toBeGreaterThanOrEqual(column - 80);
    await page.getByRole("button", { name: "Weiter zur Wiedergabe" }).click();
    await expect(page.locator(".sheet")).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "Quelle (Ausschnitt)" })).toHaveCount(0);
    expect(await width(".sheet")).toBeGreaterThanOrEqual(column - 80);
  });

  test("puts the buttons that check only under the rendition, with one to go back to the source", async ({ page }) => {
    await openRound(page, "./app/?seed=1#quelle-1");
    await page.getByRole("button", { name: "Weiter zur Wiedergabe" }).click();
    await expect(page.getByRole("button", { name: "Prüfen" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Markierungen löschen" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Quelle ansehen" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Weiter zur Wiedergabe" })).toHaveCount(0);
    const buttons = await page.locator(".bar").boundingBox();
    const sheet = await page.locator(".sheet").boundingBox();
    expect((buttons?.y ?? 0) >= (sheet?.y ?? 0) + (sheet?.height ?? 0)).toBe(true);
  });

  test("keeps the marks when turning back to the source and on again", async ({ page }) => {
    await openRound(page, "./app/?seed=1#quelle-1");
    await page.getByRole("button", { name: "Weiter zur Wiedergabe" }).click();
    await page.getByRole("listbox").getByRole("option").nth(3).click();
    await expect(page.getByText("1 markiert", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Quelle ansehen" }).click();
    await expect(page.getByRole("heading", { name: "Quelle (Ausschnitt)" })).toBeFocused();
    await page.getByRole("button", { name: "Weiter zur Wiedergabe" }).click();
    await expect(page.getByText("1 markiert", { exact: true })).toBeVisible();
    await expect(page.getByRole("listbox").getByRole("option").nth(3)).toHaveAttribute("aria-selected", "true");
  });

  test("turns with a short animation, and without it when the system asks for less motion", async ({ page }) => {
    await openRound(page, "./app/?seed=1#quelle-1");
    await page.getByRole("button", { name: "Weiter zur Wiedergabe" }).click();
    await expect(page.locator(".sheet")).toHaveCSS("animation-duration", "0.4s");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator(".sheet")).toHaveCSS("animation-name", "none");
  });

  test("gives the text exercise one sheet, with the buttons below it and no way to the source", async ({ page }) => {
    await openRound(page, "./app/?seed=1#text-1");
    await expect(page.locator(".sheet")).toHaveCount(1);
    await expect(page.getByRole("button", { name: "Quelle ansehen" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Prüfen" })).toBeVisible();
  });

  test("gives the last stage the link to the article and the rendition together, and the PDF as a reserve", async ({
    page,
  }) => {
    await open(page, "./app/?seed=1#quelle-3");
    expect(await stateOf(page)).toMatchObject({ phase: "marking", view: "rendition" });
    const link = page.getByRole("link", { name: /Quelle öffnen/ });
    await expect(link).toHaveAttribute("href", /^https:\/\//);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(page.getByText(/Du siehst die Fassung vom/)).toBeVisible();
    await expect(page.getByRole("listbox")).toBeVisible();
    await expect(page.getByRole("button", { name: "Quelle ansehen" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: /Quelle als PDF/ })).toHaveAttribute("href", /quellen\/de\/.+\.pdf$/);
    const response = await page.request.get(
      await page.getByRole("link", { name: /Quelle als PDF/ }).evaluate((a) => (a as HTMLAnchorElement).href),
    );
    expect(response.status(), "the PDF").toBe(200);
  });
});
