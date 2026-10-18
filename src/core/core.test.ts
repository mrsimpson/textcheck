import { describe, expect, it } from "vitest";
import { ERROR_CLASSES, LEVELS, parseRoute, routeOf } from "./data.ts";
import { start, step, type State } from "./index.ts";

const route = "klasse-5-6";
const action = (name: string, value?: number | string) =>
  ({ kind: "action", name, ...(value === undefined ? {} : { value }) }) as const;
const wordsOf = (state: State, slot: string): number[] =>
  state.tokens.filter((token) => token.slot === slot).map((token) => token.id);

describe("a round", () => {
  it("is the same for the same seed and route, and differs for another seed", () => {
    expect(start(7, route)).toEqual(start(7, route));
    expect(start(7, route).corruptions).not.toEqual(start(8, route).corruptions);
  });

  it("has the errors of its level, each of an allowed class and basis, in the order of the text", () => {
    const level = LEVELS[route];
    expect(level).toBeDefined();
    for (let seed = 1; seed <= 40; seed++) {
      const state = start(seed, route);
      expect(state.corruptions).toHaveLength(level?.errors ?? -1);
      for (const corruption of state.corruptions) {
        expect(level?.classes).toContain(corruption.errorClass);
        expect(level?.bases).toContain(corruption.basis);
        expect(wordsOf(state, corruption.slot).length).toBeGreaterThan(0);
      }
      const firsts = state.corruptions.map((corruption) => wordsOf(state, corruption.slot)[0] ?? -1);
      expect(firsts).toEqual([...firsts].sort((a, b) => a - b));
    }
  });

  it("names the classes of the round when the level says so", () => {
    const state = start(3, route);
    expect(state.announced).toEqual([...new Set(state.corruptions.map((corruption) => corruption.errorClass))]);
  });
});

describe("marking and checking", () => {
  it("marks and unmarks a word, keeping the marks in order", () => {
    let state = start(1, route);
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
    const state = start(1, route);
    expect(step(state, { kind: "key", key: "a" })).toBe(state);
    expect(step(state, action("toggle", 99999))).toBe(state);
    expect(step(state, action("toggle", 1.5))).toBe(state);
    expect(step(state, action("nothing"))).toBe(state);
    expect(step(state, action("move", "sideways"))).toBe(state);
  });

  it("moves the cursor by word and by sentence, and stops at the ends", () => {
    let state = start(1, route);
    state = step(state, action("move", "next"));
    expect(state.cursor).toBe(1);
    state = step(state, action("move", "prev"));
    state = step(state, action("move", "prev"));
    expect(state.cursor).toBe(0);
    state = step(state, action("move", "next-sentence"));
    expect(state.tokens[state.cursor]?.sentence).toBe(
      state.tokens[0] === undefined ? -1 : (state.tokens.find((t) => t.sentence > 0)?.sentence ?? -1),
    );
    state = step(state, action("move", "last"));
    expect(state.cursor).toBe(state.tokens.length - 1);
    expect(step(state, action("move", "next"))).toBe(state);
  });

  it("finds an error when any word of its slot is marked, and counts the others", () => {
    let state = start(1, route);
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
    let state = start(1, route);
    const withTolerance = state.corruptions.find((corruption) => corruption.tolerance > 0);
    // seed 1 may not hold a slot with tolerance: look for a seed that does
    let seed = 1;
    while (withTolerance === undefined && seed < 200) {
      seed++;
      state = start(seed, route);
      if (state.corruptions.some((corruption) => corruption.tolerance > 0)) break;
    }
    const corruption = state.corruptions.find((entry) => entry.tolerance > 0);
    expect(corruption).toBeDefined();
    const ids = wordsOf(state, corruption?.slot ?? "");
    const first = ids[0] ?? 0;
    const sentence = state.tokens[first]?.sentence;
    const neighbour = state.tokens[first - 1];
    expect(neighbour?.sentence).toBe(sentence);
    expect(neighbour?.slot).not.toBe(corruption?.slot);
    state = step(state, action("toggle", neighbour?.id ?? 0));
    // a word of another sentence is wrong
    const stranger = state.tokens.find(
      (token) =>
        (token.sentence !== sentence && token.slot === null) ||
        (token.sentence !== sentence && !state.corruptions.some((c) => c.slot === token.slot)),
    );
    state = step(state, action("toggle", stranger?.id ?? 0));
    state = step(state, action("check"));
    expect(state.result?.status[neighbour?.id ?? 0]).toBe("tolerated");
    expect(state.result?.status[stranger?.id ?? 0]).toBe("false");
    expect(state.result?.tolerated).toBe(1);
    expect(state.result?.wrong).toBe(1);
  });

  it("starts the next round with the action again, from any phase", () => {
    const state = step(start(4, route), action("check"));
    const next = step(state, action("again"));
    expect(next.seed).toBe(5);
    expect(next.phase).toBe("marking");
    expect(next.marked).toEqual([]);
  });

  it("does not mark after checking", () => {
    const state = step(start(4, route), action("check"));
    expect(step(state, action("toggle", 0))).toBe(state);
  });
});

describe("the modes of a route", () => {
  it("reads the mode from the end of the route and the level from the rest", () => {
    expect(parseRoute("klasse-5-6")).toEqual({ level: "klasse-5-6", mode: "mark" });
    expect(parseRoute("klasse-5-6-quelle")).toEqual({ level: "klasse-5-6", mode: "source" });
    expect(parseRoute("klasse-11-13-original")).toEqual({ level: "klasse-11-13", mode: "choose" });
  });

  it("plays the same round in the mode source, with the PDF of the source instead of the Original", () => {
    const marking = start(4, route);
    const source = start(4, `${route}-quelle`);
    expect(source.mode).toBe("source");
    expect(source.corruptions).toEqual(marking.corruptions);
    expect(source.tokens).toEqual(marking.tokens);
    expect(marking.pdf).toBeNull();
    expect(source.pdf).toMatch(/^quellen\/de\/.+\.pdf$/);
  });

  it("keeps the mode in the next round", () => {
    const next = step(start(4, `${route}-quelle`), action("again"));
    expect(next.route).toBe(`${route}-quelle`);
    expect(next.mode).toBe("source");
  });
});

describe("the mode choose", () => {
  const choose = `${route}-original`;

  it("hides which text is the Variante and builds no error of the form family", () => {
    const state = start(4, choose);
    expect(state.mode).toBe("choose");
    for (let seed = 1; seed <= 30; seed++)
      for (const level of Object.keys(LEVELS))
        for (const corruption of start(seed, `${level}-original`).corruptions)
          expect(ERROR_CLASSES[corruption.errorClass]?.family, `${level} seed ${seed}`).not.toBe("form");
    expect(state.originalTokens.length).toBeGreaterThan(0);
    expect(state.choice).toBeNull();
  });

  it("puts the Variante on both sides, depending on the seed", () => {
    const sides = new Set<string>();
    for (let seed = 1; seed <= 20; seed++) sides.add(start(seed, choose).variantSide);
    expect([...sides].sort()).toEqual(["a", "b"]);
  });

  it("lets the learner mark nothing before the pick, and checks only after it", () => {
    const state = start(1, choose);
    expect(step(state, action("toggle", 3))).toBe(state);
    expect(step(state, action("check")).phase).toBe("marking");
  });

  it("clears the marks when the pick changes", () => {
    const first = step(start(1, choose), action("choose", "a"));
    const marked = step(first, action("toggle", 2));
    expect(marked.marked).toEqual([2]);
    const other = step(marked, action("choose", first.choice === "a" ? "b" : "a"));
    expect(other.marked).toEqual([]);
  });

  it("counts a right pick with the errors found, a wrong pick as no error found and the marks as wrong", () => {
    const state = start(1, choose);
    const right = step(
      step(
        step(state, action("choose", state.variantSide)),
        action("toggle", wordsOf(state, state.corruptions[0]?.slot ?? "")[0]),
      ),
      action("check"),
    );
    expect(right.result?.chosenRight).toBe(true);
    expect(right.result?.found).toBe(1);
    const wrongSide = state.variantSide === "a" ? "b" : "a";
    const wrong = step(step(step(state, action("choose", wrongSide)), action("toggle", 0)), action("check"));
    expect(wrong.result?.chosenRight).toBe(false);
    expect(wrong.result?.found).toBe(0);
    expect(wrong.result?.wrong).toBe(1);
  });
});

describe("the routes", () => {
  it("are built and read back for every level and mode", () => {
    for (const level of Object.keys(LEVELS))
      for (const mode of ["mark", "source", "choose"] as const)
        expect(parseRoute(routeOf(level, mode))).toEqual({ level, mode });
  });

  it("give every mode enough errors in every level", () => {
    for (const level of Object.keys(LEVELS))
      for (const mode of ["mark", "source", "choose"] as const)
        expect(start(1, routeOf(level, mode)).corruptions.length, `${level} ${mode}`).toBe(LEVELS[level]?.errors);
  });
});
