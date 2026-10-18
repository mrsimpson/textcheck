// The logic of Textcheck: a round of a text pack for the school years of the route, the seed deciding which slots are
// corrupted and with which variant; the learner marks words, then checks, and the core says which errors were found
// and how every word counts. Pure TypeScript without DOM; the runtime keeps the state and calls start and step
// (@lernapps/app-templates/interactive). Every input is an action; unknown ones leave the state as it is.
import type { Input } from "@lernapps/app-templates/interactive";
import { levelOf, packsFor, parseRoute } from "./data.ts";
import { evaluate } from "./evaluate.ts";
import { buildRound } from "./round.ts";
import type { State } from "./types.ts";

export type { State } from "./types.ts";

/** The language of version 1; a later version sets it by the action "language". */
const DEFAULT_LANGUAGE = "de";

export function start(seed: number, route: string, language: string = DEFAULT_LANGUAGE): State {
  const level = levelOf(route);
  const { mode } = parseRoute(route);
  const { pack, tokens, corruptions } = buildRound(packsFor(language, level), level, seed);
  const classes = [...new Set(corruptions.map((corruption) => corruption.errorClass))];
  return {
    seed,
    route,
    mode,
    language,
    packId: pack.id,
    title: pack.title,
    source: pack.source,
    pdf: mode === "source" ? (pack.source.pdf ?? null) : null,
    original: pack.excerpt.map((entry) => entry.text),
    tokens,
    corruptions,
    announced: level.announceClasses ? classes : null,
    marked: [],
    cursor: 0,
    changed: -1,
    phase: "marking",
    result: null,
    last: "start",
  };
}

/** The id of the first word of the sentence `offset` sentences from the one the cursor is in, else the cursor. */
function sentenceStep(state: State, offset: number): number {
  const here = state.tokens[state.cursor]?.sentence;
  if (here === undefined) return state.cursor;
  const sentences = [...new Set(state.tokens.map((token) => token.sentence))];
  const target = sentences[sentences.indexOf(here) + offset];
  return target === undefined
    ? state.cursor
    : (state.tokens.find((token) => token.sentence === target)?.id ?? state.cursor);
}

/** The cursor after a move: "next" and "prev" by word, "next-sentence" and "prev-sentence", "first", "last". */
function moved(state: State, how: unknown): number {
  const last = state.tokens.length - 1;
  switch (how) {
    case "next":
      return Math.min(state.cursor + 1, last);
    case "prev":
      return Math.max(state.cursor - 1, 0);
    case "next-sentence":
      return sentenceStep(state, 1);
    case "prev-sentence":
      return sentenceStep(state, -1);
    case "first":
      return 0;
    case "last":
      return last;
    default:
      return state.cursor;
  }
}

export function step(state: State, input: Input): State {
  if (input.kind !== "action") return state;
  if (input.name === "again") return start(state.seed + 1, state.route, state.language);
  if (state.phase !== "marking") return state;
  switch (input.name) {
    case "toggle": {
      const id = input.value;
      if (typeof id !== "number" || !Number.isInteger(id) || state.tokens[id] === undefined) return state;
      const on = state.marked.includes(id);
      const marked = on ? state.marked.filter((other) => other !== id) : [...state.marked, id].sort((a, b) => a - b);
      return { ...state, marked, cursor: id, changed: id, last: on ? "unmark" : "mark" };
    }
    case "move": {
      const cursor = moved(state, input.value);
      return cursor === state.cursor ? state : { ...state, cursor };
    }
    case "clear":
      return state.marked.length === 0 ? state : { ...state, marked: [], changed: -1, last: "clear" };
    case "check":
      return {
        ...state,
        phase: "result",
        result: evaluate(state.tokens, state.corruptions, state.marked),
        last: "check",
      };
    default:
      return state;
  }
}
