// The logic of Textcheck: the choice of an exercise (find errors in a text, or compare a rendition with its source), the
// stages of an exercise, the reading tip, and a round: the text of a stage, the seed deciding which slots are corrupted and
// with which variant; the learner marks words, then checks, and the core says which errors were found, how every word
// counts and what to do next. Pure TypeScript without DOM; the runtime keeps the state and calls start and step
// (@lernapps/app-templates/interactive). Every input is an action; unknown ones leave the state as it is.
import type { Input } from "@lernapps/app-templates/interactive";
import { evaluate } from "./evaluate.ts";
import { buildRound, hintSentencesOf } from "./round.ts";
import { cardsOf, classesOf, packsFor, placeOf, roundRoute, rulesOf, STAGES } from "./stages.ts";
import type { Advice, HintStage, Kind, Phase, Result, State, Token } from "./types.ts";

export type { State } from "./types.ts";

/** The language a round starts in; the page sets its own by the action "language" (see `step`). */
const DEFAULT_LANGUAGE = "de";

/** In the comparison with a source: this many right words marked earn the advice that other words are no error. */
const OVERMARKED = 3;

/** The wait before hint `taken + 1`, in milliseconds: 10 s plus 5 s for every hint that is next in line (15 s, 20 s). */
export function hintWaitAfter(taken: number): number {
  return (10 + 5 * (taken + 1)) * 1000;
}

/** A state that shows no round: the choice of the exercise or the stages of one. */
function page(seed: number, route: string, language: string, phase: Phase, kind: Kind | null): State {
  return {
    seed,
    route,
    phase,
    language,
    kind,
    stage: null,
    cards: kind === null ? [] : cardsOf(kind, language),
    rules: null,
    packId: "",
    title: "",
    source: null,
    excerpt: [],
    sections: [],
    view: "rendition",
    tokens: [],
    corruptions: [],
    announced: null,
    marked: [],
    cursor: 0,
    changed: -1,
    hintStages: [],
    hintClasses: [],
    hintSentences: [],
    hintLevel: 0,
    hintWait: 0,
    result: null,
    last: "start",
  };
}

/**
 * The state of a route. A round starts with the reading tip when its stage has one, unless `tipSeen`: the learner
 * is in the next round of the same stage.
 */
export function start(seed: number, route: string, language: string = DEFAULT_LANGUAGE, tipSeen = false): State {
  const place = placeOf(route);
  if (place === null) throw new Error(`no route ${route}`);
  if (place.page === "choose") return page(seed, route, language, "choose", null);
  if (place.page === "stages") return page(seed, route, language, "stages", place.kind);
  const { kind, stage } = place;
  const rules = rulesOf(kind, stage);
  const classes = classesOf(kind, stage);
  const { pack, tokens, corruptions } = buildRound(packsFor(language, kind, stage), classes, rules, seed);
  const names = [...new Set(corruptions.map((corruption) => corruption.errorClass))];
  const hintSentences = hintSentencesOf(pack, corruptions, tokens);
  const hintClasses = [...new Set(hintSentences.flatMap((entry) => entry.classes))];
  // the classes are a hint only where the stage hides them; a stage with nothing to show is left out
  const hintStages: HintStage[] = [
    ...(rules.announce || hintClasses.length === 0 ? [] : (["classes"] as const)),
    ...(hintSentences.length === 0 ? [] : (["sentences"] as const)),
  ];
  const sheet = rules.material === "sheet";
  return {
    ...page(seed, route, language, "marking", kind),
    stage,
    cards: [],
    rules,
    phase: rules.tip !== "none" && !tipSeen ? "tip" : "marking",
    packId: pack.id,
    title: pack.title,
    source: pack.source,
    excerpt: sheet ? pack.excerpt.map((entry) => entry.text) : [],
    sections: rules.material === "link" ? [...new Set(pack.excerpt.flatMap((entry) => entry.section ?? []))] : [],
    view: sheet ? "source" : "rendition",
    tokens,
    corruptions,
    announced: rules.announce ? names : null,
    hintStages,
    hintClasses,
    hintSentences,
    hintWait: hintWaitAfter(0),
  };
}

/** The words the learner may mark: those of the rendition, once the sheet of the rendition shows. */
export function markable(state: State): readonly Token[] {
  return state.phase === "marking" && state.view === "rendition" ? state.tokens : [];
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

/** Whether the app has texts for a route in a language: the pages of the choice and the stages always, a round if a text fits. */
function playable(route: string, language: string): boolean {
  const place = placeOf(route);
  if (place === null) return false;
  return place.page !== "round" || packsFor(language, place.kind, place.stage).length > 0;
}

/**
 * The same round (seed and route) in another language: the page tells the core its language, because the runtime starts
 * the core without one. A language without a text for the stage leaves the state as it is.
 */
function inLanguage(state: State, language: unknown): State {
  if (typeof language !== "string" || language === state.language) return state;
  if (!playable(state.route, language)) return state;
  return start(state.seed, state.route, language, state.phase !== "tip");
}

/**
 * The round of an address (`?seed=<n>#<route>`): the page tells the core when the address names another round, whether
 * the learner picked an exercise or a stage, asked for the next round, or went back or forward in the history. The
 * round the state already shows, an unknown route and a seed that is no whole positive number leave the state as it is.
 * The reading tip comes only when the stage changes: the next round of the same stage starts at once.
 */
function inRound(state: State, round: unknown): State {
  if (typeof round !== "object" || round === null || Array.isArray(round)) return state;
  const { seed, route } = round as Record<string, unknown>;
  if (typeof seed !== "number" || !Number.isInteger(seed) || seed <= 0 || typeof route !== "string") return state;
  if (seed === state.seed && route === state.route) return state;
  if (!playable(route, state.language)) return state;
  return start(seed, route, state.language, route === state.route);
}

/** Whether the hint of `stage` has been taken. */
export function hintShown(state: State, stage: HintStage): boolean {
  const index = state.hintStages.indexOf(stage);
  return index >= 0 && state.hintLevel > index;
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

/** What the learner is told after checking. */
function adviceOf(state: State, result: Omit<Result, "advice">): Advice {
  const foundSlots = new Set(
    result.classes.flatMap((entry) => entry.items.filter((item) => item.found).map((item) => item.slot)),
  );
  const missed = state.corruptions.find((corruption) => !foundSlots.has(corruption.slot));
  const { kind, stage } = state;
  const hasNext = kind !== null && stage !== null && stage < STAGES[kind].length;
  return {
    passed: result.found === result.total && result.wrong <= 1,
    next: hasNext ? roundRoute(kind, stage + 1) : null,
    missed: missed?.errorClass ?? null,
    overmarked: kind === "quelle" && result.wrong >= OVERMARKED,
  };
}

export function step(state: State, input: Input): State {
  if (input.kind !== "action") return state;
  if (input.name === "again") {
    return state.phase === "marking" || state.phase === "result"
      ? start(state.seed + 1, state.route, state.language, true)
      : state;
  }
  if (input.name === "language") return inLanguage(state, input.value);
  if (input.name === "round") return inRound(state, input.value);
  if (input.name === "begin") return state.phase === "tip" ? { ...state, phase: "marking", last: "begin" } : state;
  if (state.phase !== "marking") return state;
  switch (input.name) {
    case "view": {
      const view = input.value;
      if (state.rules?.material !== "sheet" || (view !== "source" && view !== "rendition") || view === state.view)
        return state;
      return { ...state, view, cursor: 0, last: "view" };
    }
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
      if (state.view !== "rendition") return state;
      const counted = evaluate(state.tokens, state.corruptions, state.marked);
      const result = { ...counted, advice: adviceOf(state, counted) };
      return { ...state, phase: "result", result, last: "check" };
    }
    default:
      return state;
  }
}
