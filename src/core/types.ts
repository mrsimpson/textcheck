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
  /** One status per token, in token order. */
  status: Status[];
  classes: ClassResult[];
}

/** What the last input changed; the root component announces it. */
export type Last = "start" | "mark" | "unmark" | "clear" | "check";

export interface State {
  seed: number;
  route: string;
  language: string;
  packId: string;
  title: string;
  source: Source;
  /** The sentences of the Original, as shown. */
  original: string[];
  /** The words of the Fassung; each sentence is a run of tokens with the same `sentence`. */
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
  phase: "marking" | "result";
  result: Result | null;
  last: Last;
}
