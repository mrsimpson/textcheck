import Ajv2020 from "ajv/dist/2020.js";
import { describe, expect, it } from "vitest";
import schema from "../data/textpack.v1.schema.json" with { type: "json" };
import classes from "../data/error-classes.json" with { type: "json" };
import { PACKS } from "./data.ts";
import { checkPack } from "./pack-check.ts";
import type { TextPack } from "./types.ts";

const validate = new Ajv2020({ allErrors: true, validateFormats: false }).compile(schema);
const copy = (pack: TextPack): TextPack => structuredClone(pack);

describe("the text packs", () => {
  it("has at least one pack", () => {
    expect(PACKS.length).toBeGreaterThan(0);
  });

  for (const pack of PACKS) {
    it(`${pack.id} follows the schema`, () => {
      expect(validate(pack), JSON.stringify(validate.errors)).toBe(true);
    });

    it(`${pack.id} passes the pack checks`, () => {
      const report = checkPack(pack);
      expect(report.errors).toEqual([]);
    });

    it(`${pack.id} has its source filled in and verified`, () => {
      expect(pack.source.verified).toBe(true);
      for (const field of ["title", "url", "revision", "license", "licenseUrl", "authorsUrl", "retrieved"] as const) {
        expect(pack.source[field], field).toBeTruthy();
      }
    });
  }
});

describe("the error classes", () => {
  it("are the ones the schema allows", () => {
    const allowed = (schema.$defs.errorClass.enum as string[]).sort();
    expect(Object.keys(classes).sort()).toEqual(allowed);
  });
});

describe("the pack checks", () => {
  const pack = PACKS.find((candidate) => candidate.id === "fledermaeuse");
  if (pack === undefined) return;

  it("reject a quote that is not in the excerpt", () => {
    const bad = copy(pack);
    const entry = bad.rendition[0];
    if (entry !== undefined) entry.evidence = { quote: "Fledermäuse leben nur in Australien und sind groß." };
    expect(checkPack(bad).errors.join("\n")).toContain("not verbatim");
  });

  it("reject a slot that stands nowhere in the rendition", () => {
    const bad = copy(pack);
    bad.slots["orphan"] = {
      correct: "x",
      variants: [
        { text: "y", errorClass: "slip", basis: "text", conspicuousness: 1, explanation: "Ein Buchstabe fehlt hier." },
      ],
    };
    expect(checkPack(bad).errors.join("\n")).toContain("0 times");
  });

  it("reject an error class that starts after the pack's school years", () => {
    const bad = copy(pack);
    bad.grades = { from: 3, to: 4 };
    expect(checkPack(bad).errors.join("\n")).toContain("starts at grade");
  });

  it("reject more than two school years", () => {
    const bad = copy(pack);
    bad.grades = { from: 5, to: 9 };
    expect(checkPack(bad).errors.join("\n")).toContain("adjacent");
  });

  it("reject a tolerance on a slot that has no neighbouring words", () => {
    const bad = copy(pack);
    const last = bad.slots["s11"];
    const variant = last?.variants[0];
    if (variant !== undefined) variant.tolerance = 2;
    expect(checkPack(bad).errors.join("\n")).toContain("no neighbouring words");
  });
});
