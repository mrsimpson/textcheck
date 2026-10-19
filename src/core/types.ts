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
  grades: { from: number; to: number };
  topic: string;
  source: Source;
  excerpt: { text: string; section?: string }[];
  rendition: RenditionSentence[];
  slots: Record<string, Slot>;
  notes?: string[];
}

/** What a school-year pair gets: the error classes and bases it may use, how many errors a round has. */
export interface Level {
  grades: { from: number; to: number };
  classes: string[];
  bases: Basis[];
  errors: number;
  /** Whether the goal line names the error classes of the round. */
  announceClasses: boolean;
}

export interface ErrorClass {
  family: string;
  status: "documented" | "derived";
  statusNote: string;
  usualBasis: Basis[];
  fromGrade: number;
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
  /** In the mode `choose`: whether the learner picked the text with the errors; else null. */
  chosenRight: boolean | null;
}

/** How a route plays: mark errors against the Original, against the source PDF, or choose the text with errors first. */
export type Mode = "mark" | "source" | "choose";

/** What the last input changed; the root component announces it. */
export type Last = "start" | "mark" | "unmark" | "clear" | "check" | "choose" | "hint";

/** What a hint shows: the error classes of the round, or the sentences that hold an error. */
export type HintStage = "classes" | "sentences";

/**
 * A sentence of the Variante that holds an error and has a counterpart in the Original (inserted sentences have none and
 * are no part of the hints): its index in the rendition, the index of the Original's sentence it renders, and the error
 * classes in it.
 */
export interface HintSentence {
  sentence: number;
  original: number;
  classes: string[];
}

/** The two texts of the mode `choose`. */
export type Side = "a" | "b";

export interface State {
  seed: number;
  route: string;
  /** The mode of the route; `source` shows the PDF of the source instead of the Original. */
  mode: Mode;
  language: string;
  packId: string;
  title: string;
  source: Source;
  /** The path of the source PDF relative to the site root, when the mode is `source` and the pack has one, else null. */
  pdf: string | null;
  /** The sentences of the Original, as shown. */
  original: string[];
  /** The words of the Original, in the mode `choose` (else empty): the learner may mark them there too. */
  originalTokens: Token[];
  /** In the mode `choose`: which text, a or b, is the Variante (the other is the Original). */
  variantSide: Side;
  /** In the mode `choose`: the text the learner says has the errors; else null. */
  choice: Side | null;
  /** The words of the Variante; each sentence is a run of tokens with the same `sentence`. */
  tokens: Token[];
  /** The errors of the round; the answers, which the component shows only after checking. */
  corruptions: Corruption[];
  /** The error classes of the round when the level names them, else null. */
  announced: string[] | null;
  /** The ids of the marked tokens, ascending. */
  marked: number[];
  /** The token the keyboard is on. */
  cursor: number;
  /** The token the last mark or unmark changed, else -1. */
  changed: number;
  /** The hints of this round, in the order they are given; hint n shows the first n stages. */
  hintStages: HintStage[];
  /** The error classes of the round that stand in sentences with a counterpart in the Original. */
  hintClasses: string[];
  hintSentences: HintSentence[];
  /** How many hints the learner has taken. */
  hintLevel: number;
  /** The milliseconds until the next hint can be taken; 0 when it can. */
  hintWait: number;
  phase: "marking" | "result";
  result: Result | null;
  last: Last;
}
