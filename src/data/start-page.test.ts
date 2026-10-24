import { placeOf, ROUTES, STAGES, firstStageOf, KINDS } from "../core/stages.ts";
import { parse } from "yaml";
import { describe, expect, it } from "vitest";
import appYaml from "../app.yaml?raw";
import classes from "./error-classes.json" with { type: "json" };
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
/** How a line of the section "begruendung" names the status and the place of an error class, by language. */
const LINES: Record<
  string,
  (
    status: "documented" | "derived",
    kind: string,
    stage: number,
    names: Record<string, string>,
  ) => { status: string; place: string }
> = {
  de: (status, kind, stage, names) => ({
    status: status === "documented" ? "belegt" : "abgeleitet",
    place: `${names[`kind.${kind}`]}, Stufe ${stage}`,
  }),
  en: (status, kind, stage, names) => ({ status, place: `${names[`kind.${kind}`]}, stage ${stage}` }),
};

describe.each(app.languages)("the start page in %s", (language) => {
  const names = messages[language] ?? {};
  const section = app.sections.find((entry) => entry.id === "begruendung")?.text[language] ?? "";

  it("lists every error class with its status and the exercise and stage that adds it, as the data say", () => {
    for (const [id, info] of Object.entries(classes)) {
      const name = names[`errorClass.${id}`];
      expect(name, `a name for ${id} in src/messages/${language}.json`).toBeDefined();
      const kind = KINDS.find((candidate) => firstStageOf(candidate, id) !== null) ?? "";
      const { status, place } = LINES[language]?.(
        info.status as "documented" | "derived",
        kind,
        firstStageOf(kind as "text" | "quelle", id) ?? 0,
        names,
      ) ?? { status: "", place: "" };
      const line = section.split("\n").find((row) => row.includes(`**${name}**`));
      expect(line, `a line for ${name} in the section begruendung`).toBeDefined();
      expect(line, `${name}: status and place`).toContain(`**, ${status}, ${place}:`);
    }
  });

  it("has no line for a class that does not exist", () => {
    const marker = language === "de" ? ", Stufe " : ", stage ";
    const lines = section.split("\n").filter((row) => row.startsWith("- **") && row.includes(marker));
    expect(lines).toHaveLength(Object.keys(classes).length);
  });
});

describe("the start page", () => {
  it("has a route for every route of the app and no other", () => {
    expect(app.routes.map((route) => route.id).sort()).toEqual([...ROUTES].sort());
    for (const route of app.routes) expect(placeOf(route.id), route.id).not.toBeNull();
  });

  it("names the stages of every exercise", () => {
    for (const kind of KINDS) expect(STAGES[kind]).toHaveLength(3);
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
