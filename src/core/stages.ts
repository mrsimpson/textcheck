// The stages of the two kinds of exercise: their rules (src/data/stages.json), their routes, and which texts belong to
// which stage. Everything a stage card or a round shows about a stage is derived here, nothing is written out: the
// classes a stage adds are the new ones, the length of the texts is measured on the texts, and a text belongs to the
// stage whose length it fits and whose error classes it has enough places for.
import stages from "../data/stages.json" with { type: "json" };
import { PACKS } from "./data.ts";
import type { Kind, StageCard, StageRules, TextPack } from "./types.ts";

export const KINDS: readonly Kind[] = ["text", "quelle"];

// The unit tests check the file's shape; this cast states what they guarantee.
export const STAGES = stages as unknown as Readonly<Record<Kind, readonly StageRules[]>>;

/** The page of the app a route names: the choice of the exercise, the stages of one, or the rounds of one stage. */
export type Place = { page: "choose" } | { page: "stages"; kind: Kind } | { page: "round"; kind: Kind; stage: number };

/** The route of the choice of the exercise. */
export const START_ROUTE = "start";

/** The route of the stages of an exercise, and of one stage's rounds. */
export const stagesRoute = (kind: Kind): string => kind;
export const roundRoute = (kind: Kind, stage: number): string => `${kind}-${stage}`;

/** Every route of the app, in the order the start page lists them. */
export const ROUTES: readonly string[] = [
  START_ROUTE,
  ...KINDS.flatMap((kind) => [stagesRoute(kind), ...STAGES[kind].map((_, index) => roundRoute(kind, index + 1))]),
];

/** What a route names; null for an address the app does not have. */
export function placeOf(route: string): Place | null {
  if (route === START_ROUTE) return { page: "choose" };
  for (const kind of KINDS) {
    if (route === stagesRoute(kind)) return { page: "stages", kind };
    const stage = STAGES[kind].findIndex((_, index) => route === roundRoute(kind, index + 1)) + 1;
    if (stage > 0) return { page: "round", kind, stage };
  }
  return null;
}

/** The rules of a stage (counted from 1). */
export function rulesOf(kind: Kind, stage: number): StageRules {
  const rules = STAGES[kind][stage - 1];
  if (rules === undefined) throw new Error(`no stage ${stage} of ${kind} in src/data/stages.json`);
  return rules;
}

/** The error classes a stage holds: its own and those of the stages before it. */
export function classesOf(kind: Kind, stage: number): string[] {
  return STAGES[kind].slice(0, stage).flatMap((rules) => rules.adds);
}

/** The first stage that holds an error class in a kind of exercise, else null. */
export function firstStageOf(kind: Kind, errorClass: string): number | null {
  const index = STAGES[kind].findIndex((rules) => rules.adds.includes(errorClass));
  return index < 0 ? null : index + 1;
}

/** The words of each sentence of the rendition, with every slot in its correct wording. */
function sentenceLengths(pack: TextPack): number[] {
  return pack.rendition.map(
    (entry) =>
      entry.sentence
        .map((part) => (typeof part === "string" ? part : (pack.slots[part.slot]?.correct ?? "")))
        .join("")
        .split(/\s+/)
        .filter(Boolean).length,
  );
}

/** How long a text is: words, sentences, and the words of its longest sentence. */
export function lengthOf(pack: TextPack): { words: number; sentences: number; longest: number } {
  const lengths = sentenceLengths(pack);
  return {
    words: lengths.reduce((sum, count) => sum + count, 0),
    sentences: lengths.length,
    longest: Math.max(0, ...lengths),
  };
}

/** The slots of a text that can be corrupted with a class of a stage, each with the variants that fit. */
export function candidatesOf(pack: TextPack, classes: readonly string[]) {
  return Object.entries(pack.slots)
    .map(([slot, { variants }]) => ({ slot, variants: variants.filter((v) => classes.includes(v.errorClass)) }))
    .filter(({ variants }) => variants.length > 0);
}

/** Places left over after the errors of a round, so that two rounds of one text differ. */
export const RESERVE = 2;

/** The stage a text belongs to by its length: the first whose limit it does not exceed. */
export function lengthStageOf(pack: TextPack, kind: Kind): number {
  const { words } = lengthOf(pack);
  const index = STAGES[kind].findIndex((rules) => rules.maxWords === null || words <= rules.maxWords);
  return index + 1;
}

/**
 * Whether a text is for a stage: its length fits, it has enough places for the errors of the stage and a reserve, and
 * at least one for the classes the stage adds, so that a round shows what is new.
 */
export function fits(pack: TextPack, kind: Kind, stage: number): boolean {
  const rules = rulesOf(kind, stage);
  return (
    lengthStageOf(pack, kind) === stage &&
    candidatesOf(pack, classesOf(kind, stage)).length >= rules.errors + RESERVE &&
    candidatesOf(pack, rules.adds).length >= 1
  );
}

/** Errors of the classes a stage adds that a round aims at (fewer if its text has fewer places for them). */
export const MIN_NEW = 2;

/** The texts of a language for a stage, in the order of PACKS. */
export function packsFor(language: string, kind: Kind, stage: number): TextPack[] {
  return PACKS.filter((pack) => pack.language === language && fits(pack, kind, stage));
}

const mean = (values: number[]): number =>
  values.length === 0 ? 0 : Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);

/** The cards of the stages of a kind of exercise, for the texts of a language. */
export function cardsOf(kind: Kind, language: string): StageCard[] {
  return STAGES[kind].map((rules, index) => {
    const stage = index + 1;
    const lengths = packsFor(language, kind, stage).map(lengthOf);
    return {
      stage,
      route: roundRoute(kind, stage),
      before: classesOf(kind, stage - 1),
      adds: rules.adds,
      errors: rules.errors,
      announce: rules.announce,
      tip: rules.tip,
      material: rules.material,
      texts: lengths.length,
      words: mean(lengths.map((length) => length.words)),
      sentences: mean(lengths.map((length) => length.sentences)),
      longest: mean(lengths.map((length) => length.longest)),
    };
  });
}
