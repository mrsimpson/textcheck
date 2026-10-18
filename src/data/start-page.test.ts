import { parseRoute } from "../core/data.ts";
import { parse } from "yaml";
import { describe, expect, it } from "vitest";
import appYaml from "../app.yaml?raw";
import classes from "./error-classes.json" with { type: "json" };
import levels from "./levels.json" with { type: "json" };
import de from "../messages/de.json" with { type: "json" };
import en from "../messages/en.json" with { type: "json" };

type Text = Record<string, string>;

interface Description {
  languages: string[];
  routes: { id: string; title: Text; description: Text }[];
  sections: { id: string; text: Text }[];
}

const app = parse(appYaml) as Description;
const messages: Record<string, Record<string, string>> = { de, en };
/** How a line of the section "begruendung" names the status and the first grade of an error class, by language. */
const LINES: Record<string, (status: "documented" | "derived", grade: number) => { status: string; from: string }> = {
  de: (status, grade) => ({ status: status === "documented" ? "belegt" : "abgeleitet", from: `ab Klasse ${grade}` }),
  en: (status, grade) => ({ status, from: `from grade ${grade}` }),
};

describe.each(app.languages)("the start page in %s", (language) => {
  const names = messages[language] ?? {};
  const section = app.sections.find((entry) => entry.id === "begruendung")?.text[language] ?? "";

  it("lists every error class with its status and its first school year, as the data say", () => {
    for (const [id, info] of Object.entries(classes)) {
      const name = names[`errorClass.${id}`];
      expect(name, `a name for ${id} in src/messages/${language}.json`).toBeDefined();
      const { status, from } = LINES[language]?.(info.status as "documented" | "derived", info.fromGrade) ?? {
        status: "",
        from: "",
      };
      const line = section.split("\n").find((row) => row.includes(`**${name}**`));
      expect(line, `a line for ${name} in the section begruendung`).toBeDefined();
      expect(line, `${name}: status`).toContain(`**, ${status}, ${from}:`);
    }
  });

  it("has no line for a class that does not exist", () => {
    const marker = language === "de" ? ", ab Klasse " : ", from grade ";
    const lines = section.split("\n").filter((row) => row.startsWith("- **") && row.includes(marker));
    expect(lines).toHaveLength(Object.keys(classes).length);
  });
});

describe("the start page", () => {
  it("has a route for every level and a level for every route", () => {
    const ids = app.routes.map((route) => route.id);
    expect(ids.filter((id) => parseRoute(id).mode === "mark").sort()).toEqual(Object.keys(levels).sort());
    for (const id of ids) expect(Object.keys(levels), id).toContain(parseRoute(id).level);
  });

  it("has the routes of the modes source and choose for every level", () => {
    const ids = app.routes.map((route) => route.id);
    for (const level of Object.keys(levels)) {
      expect(ids, level).toContain(`${level}-quelle`);
      expect(ids, level).toContain(`${level}-original`);
    }
  });
});

describe.each(app.languages)("the messages in %s", (language) => {
  const names = messages[language] ?? {};

  it("name every error class and every detection basis", () => {
    for (const id of Object.keys(classes)) expect(names[`errorClass.${id}`]).toBeTruthy();
    for (const basis of ["text", "comparison", "prior_knowledge"]) expect(names[`basis.${basis}`]).toBeTruthy();
  });

  it("have the keys of the German messages, and the same placeholders", () => {
    const placeholders = (text: string): string[] =>
      [...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1] ?? "").sort();
    expect(Object.keys(names).sort()).toEqual(Object.keys(de).sort());
    for (const [key, text] of Object.entries(de))
      expect(placeholders(names[key] ?? ""), key).toEqual(placeholders(text));
  });
});
