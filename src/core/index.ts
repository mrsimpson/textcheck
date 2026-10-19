// The logic of Textcheck: a round of a text pack for the school years of the route, the seed deciding which slots are
// corrupted and with which variant; the learner marks words, then checks, and the core says which errors were found
// and how every word counts. Pure TypeScript without DOM; the runtime keeps the state and calls start and step
// (@lernapps/app-templates/interactive). Every input is an action; unknown ones leave the state as it is.
import type { Input } from "@lernapps/app-templates/interactive";
import { ERROR_CLASSES, LEVELS, levelOf, packsFor, parseRoute } from "./data.ts";
import { evaluate } from "./evaluate.ts";
import { random } from "./random.ts";
import { buildRound, hintSentencesOf, originalTokensOf } from "./round.ts";
import type { HintStage, Side, State, Token } from "./types.ts";

export type { State } from "./types.ts";

/** The language a round starts in; the page sets its own by the action "language" (see `step`). */
const DEFAULT_LANGUAGE = "de";

/** The wait before hint `taken + 1`, in milliseconds: 10 s plus 5 s for every hint that is next in line (15 s, 20 s). */
export function hintWaitAfter(taken: number): number {
  return (10 + 5 * (taken + 1)) * 1000;
}

export function start(seed: number, route: string, language: string = DEFAULT_LANGUAGE): State {
  const { mode } = parseRoute(route);
  // Original erkennen compares two texts, where a misspelling would give the Variante away: no errors of the form family
  const base = levelOf(route);
  const level =
    mode === "choose"
      ? { ...base, classes: base.classes.filter((name) => ERROR_CLASSES[name]?.family !== "form") }
      : base;
  const { pack, tokens, corruptions } = buildRound(packsFor(language, level), level, seed);
  // the side of the Variante in the mode `choose` comes from its own draw, so that every mode plays the same round
  const variantSide: Side = random((seed ^ 0x5bd1e995) >>> 0)() < 0.5 ? "a" : "b";
  const classes = [...new Set(corruptions.map((corruption) => corruption.errorClass))];
  const hintSentences = hintSentencesOf(pack, corruptions, tokens);
  const hintClasses = [...new Set(hintSentences.flatMap((entry) => entry.classes))];
  // the classes are a hint only where the level hides them; a stage with nothing to show is left out
  const hintStages: HintStage[] = [
    ...(level.announceClasses || hintClasses.length === 0 ? [] : (["classes"] as const)),
    ...(hintSentences.length === 0 ? [] : (["sentences"] as const)),
  ];
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
    originalTokens: mode === "choose" ? originalTokensOf(pack) : [],
    variantSide,
    choice: null,
    tokens,
    corruptions,
    announced: level.announceClasses ? classes : null,
    marked: [],
    cursor: 0,
    changed: -1,
    hintStages,
    hintClasses,
    hintSentences,
    hintLevel: 0,
    hintWait: hintWaitAfter(0),
    phase: "marking",
    result: null,
    last: "start",
  };
}

/**
 * The words the learner may mark: the Variante, or in the mode `choose` the text chosen as having the errors (none
 * before the choice).
 */
export function markable(state: State): readonly Token[] {
  if (state.mode !== "choose") return state.tokens;
  if (state.choice === null) return [];
  return state.choice === state.variantSide ? state.tokens : state.originalTokens;
}

/** The id of the first word of the sentence `offset` sentences from the one the cursor is in, else the cursor. */
function sentenceStep(state: State, offset: number): number {
  const words = markable(state);
  const here = words[state.cursor]?.sentence;
  if (here === undefined) return state.cursor;
  const sentences = [...new Set(words.map((token) => token.sentence))];
  const target = sentences[sentences.indexOf(here) + offset];
  return target === undefined ? state.cursor : (words.find((token) => token.sentence === target)?.id ?? state.cursor);
}

/** The cursor after a move: "next" and "prev" by word, "next-sentence" and "prev-sentence", "first", "last". */
function moved(state: State, how: unknown): number {
  const last = markable(state).length - 1;
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

/** The learner picks the text with the errors; earlier marks belonged to the other text and go. */
function choose(state: State, side: unknown): State {
  if (state.mode !== "choose" || (side !== "a" && side !== "b") || side === state.choice) return state;
  return { ...state, choice: side, marked: [], cursor: 0, changed: -1, last: "choose" };
}

/**
 * The same round (seed and route) in another language: the page tells the core its language, because the runtime starts
 * the core without one. A language without a pack for the route's school years leaves the state as it is.
 */
function inLanguage(state: State, language: unknown): State {
  if (typeof language !== "string" || language === state.language) return state;
  if (packsFor(language, levelOf(state.route)).length === 0) return state;
  return start(state.seed, state.route, language);
}

/**
 * The round of an address (`?seed=<n>#<route>`): the page tells the core when the address names another round, whether
 * the learner picked a new age group or mode (with a new seed: the same seed would give the same text with the same
 * errors in the next mode and show which text is the Original), asked for the next round, or went back or forward in the
 * history. The round the state already shows, an unknown route and a seed that is no whole positive number leave the
 * state as it is.
 */
function inRound(state: State, round: unknown): State {
  if (typeof round !== "object" || round === null || Array.isArray(round)) return state;
  const { seed, route } = round as Record<string, unknown>;
  if (typeof seed !== "number" || !Number.isInteger(seed) || seed <= 0 || typeof route !== "string") return state;
  if (seed === state.seed && route === state.route) return state;
  const level = LEVELS[parseRoute(route).level];
  if (level === undefined || packsFor(state.language, level).length === 0) return state;
  return start(seed, route, state.language);
}

/** The learner takes the next hint, once the wait is over; each hint shows one more stage and stays until the round ends. */
function hint(state: State): State {
  if (state.hintWait > 0 || state.hintLevel >= state.hintStages.length) return state;
  const hintLevel = state.hintLevel + 1;
  return { ...state, hintLevel, hintWait: hintWaitAfter(hintLevel), last: "hint" };
}

/** Time passes: the wait before the next hint runs down while the learner marks; otherwise the state is the same. */
export function tick(state: State, dt: number): State {
  if (state.phase !== "marking" || state.hintWait === 0 || state.hintLevel >= state.hintStages.length) return state;
  return { ...state, hintWait: Math.max(0, state.hintWait - dt) };
}

export function step(state: State, input: Input): State {
  if (input.kind === "key") {
    // 1 and 2 pick the text in the mode `choose`; the root component does not use other keys
    if (state.phase !== "marking") return state;
    return input.key === "1" ? choose(state, "a") : input.key === "2" ? choose(state, "b") : state;
  }
  if (input.kind !== "action") return state;
  if (input.name === "again") return start(state.seed + 1, state.route, state.language);
  if (input.name === "language") return inLanguage(state, input.value);
  if (input.name === "round") return inRound(state, input.value);
  if (state.phase !== "marking") return state;
  switch (input.name) {
    case "choose":
      return choose(state, input.value);
    case "toggle": {
      const id = input.value;
      if (typeof id !== "number" || !Number.isInteger(id) || markable(state)[id] === undefined) return state;
      const on = state.marked.includes(id);
      const marked = on ? state.marked.filter((other) => other !== id) : [...state.marked, id].sort((a, b) => a - b);
      return { ...state, marked, cursor: id, changed: id, last: on ? "unmark" : "mark" };
    }
    case "move": {
      const cursor = moved(state, input.value);
      return cursor === state.cursor ? state : { ...state, cursor };
    }
    case "hint":
      return hint(state);
    case "clear":
      return state.marked.length === 0 ? state : { ...state, marked: [], changed: -1, last: "clear" };
    case "check": {
      if (state.mode === "choose" && state.choice === null) return state;
      const result = evaluate(markable(state), state.corruptions, state.marked);
      const chosenRight = state.mode === "choose" ? state.choice === state.variantSide : null;
      return { ...state, phase: "result", result: { ...result, chosenRight }, last: "check" };
    }
    default:
      return state;
  }
}
