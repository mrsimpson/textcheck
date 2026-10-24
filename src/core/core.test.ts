import { describe, expect, it } from "vitest";
import { PACKS } from "./data.ts";
import { hintWaitAfter, start, step, tick, type State } from "./index.ts";
import { classesOf, KINDS, placeOf, roundRoute, ROUTES, rulesOf, STAGES } from "./stages.ts";

const route = "text-2";
const languages = [...new Set(PACKS.map((pack) => pack.language))].sort();
const rounds = ROUTES.filter((id) => placeOf(id)?.page === "round");
const action = (name: string, value?: unknown) =>
  ({ kind: "action", name, ...(value === undefined ? {} : { value }) }) as never;
/** A round after the reading tip, ready to mark. */
const marking = (seed: number, id: string, language = "de"): State => {
  const state = start(seed, id, language);
  return state.phase === "tip" ? step(state, action("begin")) : state;
};
const wordsOf = (state: State, slot: string): number[] =>
  state.tokens.filter((token) => token.slot === slot).map((token) => token.id);

describe("the routes", () => {
  it("name the choice, the stages of each exercise and every stage's rounds", () => {
    expect(ROUTES).toEqual([
      "start",
      "text",
      "text-1",
      "text-2",
      "text-3",
      "quelle",
      "quelle-1",
      "quelle-2",
      "quelle-3",
    ]);
    expect(placeOf("start")).toEqual({ page: "choose" });
    expect(placeOf("quelle")).toEqual({ page: "stages", kind: "quelle" });
    expect(placeOf("text-3")).toEqual({ page: "round", kind: "text", stage: 3 });
    expect(placeOf("klasse-5-6")).toBeNull();
    expect(placeOf("text-4")).toBeNull();
  });

  it("start in every language, with the page each names", () => {
    for (const language of languages)
      for (const id of ROUTES) {
        const state = start(1, id, language);
        expect(state.route).toBe(id);
        expect(state.phase).toBe(
          { choose: "choose", stages: "stages", round: state.phase }[placeOf(id)?.page ?? "choose"],
        );
      }
  });
});

describe("the choice and the stages", () => {
  it("show no round", () => {
    const state = start(1, "start");
    expect([state.phase, state.kind, state.cards, state.tokens]).toEqual(["choose", null, [], []]);
  });

  it("have a card per stage, derived from the rules and the texts", () => {
    for (const language of languages)
      for (const kind of KINDS) {
        const { cards, phase } = start(1, kind, language);
        expect(phase).toBe("stages");
        expect(cards.map((card) => card.stage)).toEqual(STAGES[kind].map((_, index) => index + 1));
        for (const card of cards) {
          const rules = rulesOf(kind, card.stage);
          expect(card.route).toBe(roundRoute(kind, card.stage));
          expect(card.adds).toEqual(rules.adds);
          expect(card.errors).toBe(rules.errors);
          expect([...card.before, ...card.adds]).toEqual(classesOf(kind, card.stage));
          expect(card.texts, `${language} ${kind} ${card.stage}`).toBeGreaterThanOrEqual(2);
          expect(card.wordsFrom).toBeGreaterThan(0);
          expect(card.wordsTo).toBeGreaterThanOrEqual(card.wordsFrom);
          expect(card.sentencesTo).toBeGreaterThanOrEqual(card.sentencesFrom);
        }
      }
  });

  it("get longer texts with every stage", () => {
    for (const kind of KINDS) {
      const cards = start(1, kind).cards;
      const words = cards.map((card) => card.wordsTo);
      expect(words).toEqual([...words].sort((a, b) => a - b));
      // the ranges of two stages may touch at the limit, never cross
      for (const [index, card] of cards.entries())
        expect(card.wordsFrom).toBeGreaterThanOrEqual((cards[index - 1]?.wordsTo ?? 0) - 10);
    }
  });
});

describe("a round", () => {
  it("is the same for the same seed and route, and differs for another seed", () => {
    expect(start(7, route)).toEqual(start(7, route));
    expect(start(7, route).corruptions).not.toEqual(start(8, route).corruptions);
  });

  it("has the errors of its stage, each of a class the stage holds, in the order of the text", () => {
    for (const id of rounds) {
      const place = placeOf(id);
      if (place?.page !== "round") continue;
      const rules = rulesOf(place.kind, place.stage);
      for (let seed = 1; seed <= 30; seed++) {
        const state = start(seed, id);
        expect(state.corruptions, id).toHaveLength(rules.errors);
        for (const corruption of state.corruptions) {
          expect(classesOf(place.kind, place.stage), `${id} ${corruption.errorClass}`).toContain(corruption.errorClass);
          expect(wordsOf(state, corruption.slot).length).toBeGreaterThan(0);
        }
        const firsts = state.corruptions.map((corruption) => wordsOf(state, corruption.slot)[0] ?? -1);
        expect(firsts).toEqual([...firsts].sort((a, b) => a - b));
      }
    }
  });

  it("shows what is new: at least one error of the classes the stage adds", () => {
    for (const id of rounds) {
      const place = placeOf(id);
      if (place?.page !== "round") continue;
      const adds = rulesOf(place.kind, place.stage).adds;
      for (let seed = 1; seed <= 30; seed++)
        expect(
          start(seed, id).corruptions.filter((c) => adds.includes(c.errorClass)).length,
          `${id} ${seed}`,
        ).toBeGreaterThanOrEqual(1);
    }
  });

  it("uses only texts of its stage and language", () => {
    for (const language of languages)
      for (const id of rounds) {
        const pack = PACKS.find((candidate) => candidate.id === start(3, id, language).packId);
        expect(pack?.language).toBe(language);
      }
  });

  it("names the classes of the round where the stage says so, and no class where it hides them", () => {
    const named = start(3, "text-1");
    expect(named.announced).toEqual([...new Set(named.corruptions.map((corruption) => corruption.errorClass))]);
    expect(start(3, "text-3").announced).toBeNull();
    expect(start(3, "quelle-3").announced).toBeNull();
  });

  it("holds only numbers, names, dates and places in the first stage of the comparison with a source", () => {
    for (let seed = 1; seed <= 30; seed++)
      for (const corruption of start(seed, "quelle-1").corruptions)
        expect(corruption.errorClass).toBe("number_name_date");
  });
});

describe("the reading tip and the sheets", () => {
  it("comes first where the stage has one, and the round starts after it", () => {
    for (const id of rounds) {
      const place = placeOf(id);
      if (place?.page !== "round") continue;
      const state = start(1, id);
      expect(state.phase).toBe(rulesOf(place.kind, place.stage).tip === "none" ? "marking" : "tip");
    }
    const tip = start(1, "text-1");
    expect(step(tip, action("mark"))).toBe(tip);
    expect(step(tip, action("toggle", 0))).toBe(tip);
    expect(step(tip, action("begin")).phase).toBe("marking");
    expect(step(tip, action("begin")).last).toBe("begin");
  });

  it("is skipped in the next round of the same stage and by the round of an address of the same route", () => {
    const state = marking(1, "text-1");
    expect(step(state, action("again")).phase).toBe("marking");
    expect(step(state, action("round", { seed: 9, route: "text-1" })).phase).toBe("marking");
    expect(step(state, action("round", { seed: 9, route: "text-2" })).phase).toBe("tip");
  });

  it("starts a comparison with a sheet on the source, and switches to the rendition and back", () => {
    let state = marking(1, "quelle-1");
    expect(state.view).toBe("source");
    expect(state.excerpt.length).toBeGreaterThan(0);
    expect(markableWords(state)).toBe(0);
    expect(step(state, action("toggle", 0))).toBe(state);
    expect(step(state, action("check"))).toBe(state);
    state = step(state, action("view", "rendition"));
    expect([state.view, state.last]).toEqual(["rendition", "view"]);
    expect(step(state, action("view", "rendition"))).toBe(state);
    state = step(state, action("toggle", 3));
    expect(state.marked).toEqual([3]);
    expect(step(state, action("view", "source")).view).toBe("source");
  });

  it("has no sheet in a text, and a link and sections instead of the excerpt on the last stage of the comparison", () => {
    const text = marking(1, "text-2");
    expect([text.view, text.excerpt]).toEqual(["rendition", []]);
    expect(step(text, action("view", "source"))).toBe(text);
    const link = marking(1, "quelle-3");
    expect([link.view, link.excerpt]).toEqual(["rendition", []]);
    expect(link.source?.url).toMatch(/^https:\/\//);
    expect(step(link, action("view", "source"))).toBe(link);
  });
});

const markableWords = (state: State): number => (state.view === "rendition" ? state.tokens.length : 0);

describe("marking and checking", () => {
  it("marks and unmarks a word, keeping the marks in order", () => {
    let state = marking(1, route);
    state = step(state, action("toggle", 5));
    state = step(state, action("toggle", 2));
    expect(state.marked).toEqual([2, 5]);
    expect(state.cursor).toBe(2);
    expect(state.last).toBe("mark");
    state = step(state, action("toggle", 5));
    expect(state.marked).toEqual([2]);
    expect(state.last).toBe("unmark");
    state = step(state, action("clear"));
    expect(state.marked).toEqual([]);
  });

  it("ignores what it does not know and returns the same state", () => {
    const state = marking(1, route);
    expect(step(state, { kind: "key", key: "a" })).toBe(state);
    expect(step(state, action("toggle", 99999))).toBe(state);
    expect(step(state, action("toggle", 1.5))).toBe(state);
    expect(step(state, action("nothing"))).toBe(state);
    expect(step(state, action("move", "sideways"))).toBe(state);
  });

  it("moves the cursor by word and by sentence, and stops at the ends", () => {
    let state = marking(1, route);
    state = step(state, action("move", "next"));
    expect(state.cursor).toBe(1);
    state = step(state, action("move", "prev"));
    state = step(state, action("move", "prev"));
    expect(state.cursor).toBe(0);
    state = step(state, action("move", "next-sentence"));
    expect(state.tokens[state.cursor]?.sentence).toBe(state.tokens.find((token) => token.sentence > 0)?.sentence);
    state = step(state, action("move", "last"));
    expect(state.cursor).toBe(state.tokens.length - 1);
    expect(step(state, action("move", "next"))).toBe(state);
  });

  it("finds an error when any word of its slot is marked, and counts the others", () => {
    let state = marking(1, route);
    const [first] = state.corruptions;
    expect(first).toBeDefined();
    const ids = wordsOf(state, first?.slot ?? "");
    state = step(state, action("toggle", ids[ids.length - 1] ?? 0));
    state = step(state, action("check"));
    expect(state.phase).toBe("result");
    expect(state.result?.found).toBe(1);
    expect(state.result?.total).toBe(state.corruptions.length);
    const status = state.result?.status ?? [];
    for (const id of ids) expect(status[id]).toBe(id === ids[ids.length - 1] ? "found" : "part");
  });

  it("counts a right word that is marked as wrong, and one next to a long error in the same sentence as tolerated", () => {
    // tolerance belongs to long errors, which the comparison with a source has
    const id = "quelle-2";
    let seed = 1;
    let state = step(marking(seed, id), action("view", "rendition"));
    while (!state.corruptions.some((corruption) => corruption.tolerance > 0) && seed < 400)
      state = step(marking(++seed, id), action("view", "rendition"));
    const corruption = state.corruptions.find((entry) => entry.tolerance > 0);
    expect(corruption).toBeDefined();
    const ids = wordsOf(state, corruption?.slot ?? "");
    const first = ids[0] ?? 0;
    const sentence = state.tokens[first]?.sentence;
    const neighbour = state.tokens[first - 1];
    expect(neighbour?.sentence).toBe(sentence);
    expect(neighbour?.slot).not.toBe(corruption?.slot);
    state = step(state, action("toggle", neighbour?.id ?? 0));
    const stranger = state.tokens.find(
      (token) => token.sentence !== sentence && !state.corruptions.some((c) => c.slot === token.slot),
    );
    state = step(state, action("toggle", stranger?.id ?? 0));
    state = step(state, action("check"));
    expect(state.result?.status[neighbour?.id ?? 0]).toBe("tolerated");
    expect(state.result?.status[stranger?.id ?? 0]).toBe("false");
    expect(state.result?.tolerated).toBe(1);
    expect(state.result?.wrong).toBe(1);
  });

  it("does not mark after checking", () => {
    const state = step(marking(4, route), action("check"));
    expect(step(state, action("toggle", 0))).toBe(state);
  });
});

describe("the advice after checking", () => {
  const solved = (id: string, extra: number[] = []): State => {
    let state = marking(5, id);
    if (state.view === "source") state = step(state, action("view", "rendition"));
    for (const corruption of state.corruptions)
      state = step(state, action("toggle", wordsOf(state, corruption.slot)[0]));
    for (const word of extra) state = step(state, action("toggle", word));
    return step(state, action("check"));
  };

  it("passes with all errors found and at most one right word marked, and points to the next stage", () => {
    const passed = solved(route).result?.advice;
    expect(passed).toEqual({ passed: true, next: "text-3", missed: null, overmarked: false });
    expect(solved("text-3").result?.advice.next).toBeNull();
    expect(solved("quelle-1").result?.advice.next).toBe("quelle-2");
  });

  it("names the class of the first error missed", () => {
    const state = step(marking(5, route), action("check"));
    expect(state.result?.advice).toEqual({
      passed: false,
      next: "text-3",
      missed: state.corruptions[0]?.errorClass,
      overmarked: false,
    });
  });

  it("notes many right words marked in the comparison with a source, and never in a text", () => {
    const state = marking(5, "quelle-1");
    const right = state.tokens
      .filter((token) => token.slot === null)
      .slice(0, 4)
      .map((token) => token.id);
    expect(solved("quelle-1", right).result?.advice.overmarked).toBe(true);
    const text = marking(5, route);
    const rightWords = text.tokens
      .filter((token) => token.slot === null)
      .slice(0, 4)
      .map((token) => token.id);
    expect(solved(route, rightWords).result?.advice.overmarked).toBe(false);
  });
});

describe("the round of an address", () => {
  it("is started with the action round, in the language the page has", () => {
    const state = step(marking(3, route), action("toggle", 2));
    const next = step(state, action("round", { seed: 99, route: "quelle-2" }));
    expect(next).toEqual(start(99, "quelle-2"));
    expect(next.marked).toEqual([]);
    const english = start(3, "text-3", "en");
    expect(step(english, action("round", { seed: 99, route })).language).toBe("en");
  });

  it("opens the choice and the stages too", () => {
    expect(step(marking(3, route), action("round", { seed: 4, route: "start" })).phase).toBe("choose");
    expect(step(marking(3, route), action("round", { seed: 4, route: "quelle" })).cards).toHaveLength(3);
  });

  it("leaves the state as it is for the round it shows, an unknown route, or a seed that is not a whole positive number", () => {
    const state = marking(3, route);
    const give = (value: unknown) => step(state, action("round", value));
    for (const value of [
      { seed: 3, route },
      { seed: 4, route: "klasse-5-6" },
      { seed: 4, route: "text-9" },
      { seed: 0, route },
      { seed: -4, route },
      { seed: 1.5, route },
      { seed: "7", route },
      { seed: 7 },
      { route },
      [7, route],
      null,
      7,
    ])
      expect(give(value)).toBe(state);
  });

  it("starts the next round with the action again, from any phase of a round, and nothing from the choice", () => {
    const state = step(marking(4, route), action("check"));
    const next = step(state, action("again"));
    expect(next.seed).toBe(5);
    expect(next.phase).toBe("marking");
    expect(next.marked).toEqual([]);
    const choice = start(1, "start");
    expect(step(choice, action("again"))).toBe(choice);
  });
});

describe("the language", () => {
  it("has two or more texts for every stage of every exercise in every language", () => {
    for (const language of languages)
      for (const id of rounds) expect(() => start(1, id, language), `${language} ${id}`).not.toThrow();
  });

  it("is set by the action language: the same seed and route, the texts of the language", () => {
    for (const language of languages) {
      const state = step(marking(3, route), action("language", language));
      expect(state.language).toBe(language);
      expect([state.seed, state.route]).toEqual([3, route]);
      expect(PACKS.find((pack) => pack.id === state.packId)?.language).toBe(language);
    }
  });

  it("is kept in the next round", () => {
    const english = step(marking(1, "quelle-2"), action("language", "en"));
    expect(step(english, action("again")).language).toBe("en");
  });

  it("stays as it is for a language without texts, and for the language it already has", () => {
    const state = marking(1, route);
    expect(step(state, action("language", "xx"))).toBe(state);
    expect(step(state, action("language", "de"))).toBe(state);
    expect(step(state, action("language"))).toBe(state);
  });

  it("changes the language after checking, too, with a new round of the same seed", () => {
    const checked = step(marking(1, route), action("check"));
    expect(checked.phase).toBe("result");
    const english = step(checked, action("language", "en"));
    expect(english.phase).toBe("marking");
    expect(english.language).toBe("en");
  });
});

describe("hints", () => {
  const waited = (state: State): State => tick(state, state.hintWait);

  it("start with nothing shown and a wait of 15 s, then 20 s", () => {
    const state = marking(1, route);
    expect([state.hintLevel, state.hintWait]).toEqual([0, 15000]);
    expect(hintWaitAfter(1)).toBe(20000);
  });

  it("are refused until the wait is over, and the wait runs down by the ticks", () => {
    const state = marking(1, route);
    expect(step(state, action("hint"))).toBe(state);
    expect(tick(state, 20).hintWait).toBe(14980);
    expect(step(tick(state, 14980), action("hint"))).toEqual(tick(state, 14980));
    expect(step(waited(state), action("hint")).hintLevel).toBe(1);
  });

  it("do not run while the reading tip shows", () => {
    const state = start(1, "text-1");
    expect(tick(state, 20)).toBe(state);
  });

  it("give one stage each, wait longer for the next, and stop after the last", () => {
    let state = marking(1, "text-3");
    const stages = state.hintStages.length;
    expect(stages).toBeGreaterThan(0);
    for (let taken = 1; taken <= stages; taken++) {
      state = step(waited(state), action("hint"));
      expect([state.hintLevel, state.last, state.hintWait]).toEqual([taken, "hint", hintWaitAfter(taken)]);
    }
    expect(step(waited(state), action("hint"))).toEqual(waited(state));
  });

  it("name the classes only where the stage hides them, and the sentences always", () => {
    for (let seed = 1; seed <= 30; seed++)
      for (const id of rounds) {
        const state = start(seed, id);
        expect(state.hintStages.includes("classes")).toBe(state.announced === null && state.hintClasses.length > 0);
        expect(state.hintStages.includes("sentences")).toBe(state.hintSentences.length > 0);
      }
  });

  it("point only at sentences that say something the source says, never at inserted ones", () => {
    for (let seed = 1; seed <= 60; seed++) {
      const state = start(seed, "quelle-2");
      const pack = PACKS.find((candidate) => candidate.id === state.packId);
      for (const entry of state.hintSentences) {
        expect(pack?.rendition[entry.sentence]?.evidence).toBeDefined();
        expect(entry.classes.length).toBeGreaterThan(0);
      }
    }
  });

  it("stand still after checking, and a new round starts without them", () => {
    let state = step(waited(marking(1, route)), action("hint"));
    state = step(state, action("check"));
    expect(tick(state, 20)).toBe(state);
    expect(step(state, action("hint"))).toBe(state);
    expect(step(state, action("again")).hintLevel).toBe(0);
  });
});
