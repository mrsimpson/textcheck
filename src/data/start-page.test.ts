import { placeOf, ROUTES, STAGES, firstStageOf, KINDS } from "../core/stages.ts";
import { parse } from "yaml";
import { describe, expect, it } from "vitest";
import appYaml from "../app.yaml?raw";
import readme from "../../README.md?raw";
import classes from "./error-classes.json" with { type: "json" };
import de from "../messages/de.json" with { type: "json" };
import en from "../messages/en.json" with { type: "json" };

type Text = Record<string, string>;

interface Description {
  languages: string[];
  routes: { id: string; title: Text; description: Text }[];
}

const app = parse(appYaml) as Description;
const messages: Record<string, Record<string, string>> = { de, en };
/** How a line of the README's list of the error classes names the status and the place of a class (German). */
const line = (status: "documented" | "derived", kind: string, stage: number): { status: string; place: string } => ({
  status: status === "documented" ? "belegt" : "abgeleitet",
  place: `${de[`kind.${kind}` as keyof typeof de]}, Stufe ${stage}`,
});

describe("the README", () => {
  const list = readme.slice(readme.indexOf("Die Fehlerarten:"), readme.indexOf("Was wir nicht belegen können:"));

  it("lists every error class with its status and the exercise and stage that adds it, as the data say", () => {
    for (const [id, info] of Object.entries(classes)) {
      const name = de[`errorClass.${id}` as keyof typeof de];
      expect(name, `a name for ${id} in src/messages/de.json`).toBeDefined();
      const kind = KINDS.find((candidate) => firstStageOf(candidate, id) !== null) ?? "";
      const { status, place } = line(
        info.status as "documented" | "derived",
        kind,
        firstStageOf(kind as "text" | "quelle", id) ?? 0,
      );
      const row = list.split("\n").find((entry) => entry.includes(`**${name}**`));
      expect(row, `a line for ${name} in the README`).toBeDefined();
      expect(row, `${name}: status and place`).toContain(`**, ${status}, ${place}:`);
    }
  });

  it("has no line for a class that does not exist", () => {
    const rows = list.split("\n").filter((entry) => entry.startsWith("- **"));
    expect(rows).toHaveLength(Object.keys(classes).length);
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
