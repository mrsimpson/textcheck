// The types of the app's data (text packs, levels, error classes) and of the core's state. The data files are JSON;
// the unit tests check them against the schema in src/data/textpack.v1.schema.json, so the types here say what the
// schema guarantees. Pure types, no behaviour.

/** What a learner needs to detect an error. */
export type Basis = "text" | "comparison" | "prior_knowledge";

/** One wrong wording of a slot. */
export interface Variant {
  text: string;
  errorClass: string;
  basis: Basis;
  /** 1 inconspicuous to 3 conspicuous; a setting of the author, not measured. */
  conspicuousness: number;
  /** Neighbouring words on each side, in the same sentence, that may be marked without penalty. */
  tolerance?: number;
  /** For the learner, in the language of the pack. */
  explanation: string;
  /** Verbatim passage of the excerpt that shows what is right. */
  evidence?: string;
}

/** A place of the rendition that can be corrupted: its correct wording and the wrong variants. */
export interface Slot {
  correct: string;
  variants: Variant[];
}

/** A part of a sentence: plain text, or the slot that stands there. */
export type SentencePart = string | { slot: string };

export interface RenditionSentence {
  sentence: SentencePart[];
  evidence?: { quote: string };
}

export interface Source {
  title: string | null;
  url: string | null;
  revision: string | null;
  license: string | null;
  licenseUrl: string | null;
  authorsUrl: string | null;
  retrieved: string | null;
  pdf?: string;
  verified: boolean;
}

/** A text pack: the excerpt of a source, the rendition learners check, and the slots that can be corrupted. */
export interface TextPack {
  id: string;
  title: string;
  isExample?: boolean;
  language: string;
  topic: string;
  source: Source;
  excerpt: { text: string; section?: string }[];
  rendition: RenditionSentence[];
  slots: Record<string, Slot>;
  notes?: string[];
}

/** The two kinds of exercise: find errors in one text, or compare a rendition with its source. */
export type Kind = "text" | "quelle";

/** How the source shows: not at all (a text alone), as a sheet with the excerpt, or as a link to the whole article. */
export type Material = "none" | "sheet" | "link";

/** The reading tip before a round: all of it, the short one, or none (only on request). */
export type Tip = "full" | "short" | "none";

/** What a stage of one kind of exercise holds: the error classes it adds, and how it plays. The stages build on each other. */
export interface StageRules {
  /** The error classes this stage adds to those of the stages before it. */
  adds: string[];
  /** Errors in a round. */
  errors: number;
  /** Whether the goal line names the error classes of the round. */
  announce: boolean;
  tip: Tip;
  material: Material;
  /** The most words a text may have to belong to this stage; null for the last stage. */
  maxWords: number | null;
}

/** What learners see on the card of a stage, all derived from the rules and from the texts of the stage. */
export interface StageCard {
  stage: number;
  /** The route of the stage's rounds. */
  route: string;
  /** The classes of the stages before, and the classes this stage adds. */
  before: string[];
  adds: string[];
  errors: number;
  announce: boolean;
  tip: Tip;
  material: Material;
  /** Texts of this stage in the page's language, and their average length in words, sentences and the longest sentence. */
  texts: number;
  words: number;
  sentences: number;
  longest: number;
}

export interface ErrorClass {
  status: "documented" | "derived";
  statusNote: string;
  usualBasis: Basis[];
  languages: string[];
  source: string;
}

/** A word of the rendition as learners see it. `slot` names the slot whose text the word overlaps, else null. */
export interface Token {
  id: number;
  text: string;
  /** The index of the sentence in the rendition; tolerance never crosses it. */
  sentence: number;
  slot: string | null;
}

/** An error built into this round: the variant chosen for a slot. */
export interface Corruption {
  slot: string;
  errorClass: string;
  basis: Basis;
  /** The wrong wording shown, and the correct one. */
  text: string;
  correct: string;
  tolerance: number;
  explanation: string;
  evidence: string | null;
}

/** How a word counts after checking. */
export type Status = "plain" | "found" | "part" | "missed" | "false" | "tolerated";

export interface ItemResult {
  slot: string;
  found: boolean;
  basis: Basis;
  text: string;
  correct: string;
  explanation: string;
  evidence: string | null;
}

export interface ClassResult {
  errorClass: string;
  found: number;
  total: number;
  items: ItemResult[];
}

/** The result of checking: counts, how each word counts, and the errors grouped by class. */
export interface Result {
  total: number;
  found: number;
  /** Words marked that are right and not within a tolerance. */
  wrong: number;
  /** Words marked that are right but within the tolerance of an error. */
  tolerated: number;
  /** One status per token of the checked text, in token order. */
  status: Status[];
  classes: ClassResult[];
  advice: Advice;
}

/** What the last input changed; the root component announces it. */
export type Last = "start" | "mark" | "unmark" | "clear" | "check" | "hint" | "begin" | "view";

/** What a hint shows: the error classes of the round, or the sentences that hold an error. */
export type HintStage = "classes" | "sentences";

/**
 * A sentence of the rendition that holds an error and says something the source says (inserted sentences have no
 * evidence quote and are no part of the hints): its index in the rendition and the error classes in it.
 */
export interface HintSentence {
  sentence: number;
  classes: string[];
}

/** The page of the app a state shows: the choice of the exercise, the stages of one, the reading tip, a round, its result. */
export type Phase = "choose" | "stages" | "tip" | "marking" | "result";

/** The sheet of a round with a source sheet: the source or the rendition. */
export type View = "source" | "rendition";

/** What the learner is told after checking, derived from the result. */
export interface Advice {
  /** All errors found and at most one right word marked. */
  passed: boolean;
  /** The route of the next stage of this kind of exercise, null on the last. */
  next: string | null;
  /** The class of the first error missed, else null. */
  missed: string | null;
  /** In the comparison with a source: so many right words marked that the learner is told that other words are no error. */
  overmarked: boolean;
}

export interface State {
  seed: number;
  route: string;
  phase: Phase;
  language: string;
  /** The kind of exercise and the stage of the route, null on the choice of the exercise. */
  kind: Kind | null;
  stage: number | null;
  /** On the page of the stages: one card per stage; else empty. */
  cards: StageCard[];
  /** The rules of the stage of a round, else null. */
  rules: StageRules | null;
  packId: string;
  title: string;
  source: Source | null;
  /** The sentences of the source excerpt, shown on the sheet of a comparison with `material: sheet`; else empty. */
  excerpt: string[];
  /** The sections of the source article the round's text is from, for the link to the whole article. */
  sections: string[];
  /** Which sheet shows, with a source sheet: the round starts on the source. */
  view: View;
  /** The words of the rendition; each sentence is a run of tokens with the same `sentence`. */
  tokens: Token[];
  /** The errors of the round; the answers, which the component shows only after checking. */
  corruptions: Corruption[];
  /** The error classes of the round when the stage names them, else null. */
  announced: string[] | null;
  /** The ids of the marked tokens, ascending. */
  marked: number[];
  /** The token the keyboard is on. */
  cursor: number;
  /** The token the last mark or unmark changed, else -1. */
  changed: number;
  /** The hints of this round, in the order they are given; hint n shows the first n stages. */
  hintStages: HintStage[];
  /** The error classes of the round that stand in sentences that may carry a hint. */
  hintClasses: string[];
  hintSentences: HintSentence[];
  /** How many hints the learner has taken. */
  hintLevel: number;
  /** The milliseconds until the next hint can be taken; 0 when it can. */
  hintWait: number;
  result: Result | null;
  last: Last;
}
