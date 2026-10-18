import { parseRoute } from "../core/data.ts";
import { parse } from "yaml";
import { describe, expect, it } from "vitest";
import appYaml from "../app.yaml?raw";
import classes from "./error-classes.json" with { type: "json" };
import levels from "./levels.json" with { type: "json" };
import messages from "../messages/de.json" with { type: "json" };

interface Description {
  routes: { id: string }[];
  sections: { id: string; text: string }[];
}

const app = parse(appYaml) as Description;
const names = messages as Record<string, string>;

describe("the start page", () => {
  const section = app.sections.find((entry) => entry.id === "begruendung")?.text ?? "";

  it("lists every error class with its status and its first school year, as the data say", () => {
    for (const [id, info] of Object.entries(classes)) {
      const name = names[`errorClass.${id}`];
      expect(name, `a name for ${id} in src/messages/de.json`).toBeDefined();
      const status = info.status === "documented" ? "belegt" : "abgeleitet";
      const line = section.split("\n").find((row) => row.includes(`**${name}**`));
      expect(line, `a line for ${name} in the section begruendung`).toBeDefined();
      expect(line, `${name}: status`).toContain(`**, ${status}, ab Klasse ${info.fromGrade}:`);
    }
  });

  it("has no line for a class that does not exist", () => {
    const lines = section.split("\n").filter((row) => row.startsWith("- **") && row.includes(", ab Klasse "));
    expect(lines).toHaveLength(Object.keys(classes).length);
  });

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

describe("the messages", () => {
  it("name every error class and every detection basis", () => {
    for (const id of Object.keys(classes)) expect(names[`errorClass.${id}`]).toBeTruthy();
    for (const basis of ["text", "comparison", "prior_knowledge"]) expect(names[`basis.${basis}`]).toBeTruthy();
  });
});
