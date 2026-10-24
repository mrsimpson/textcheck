// What the hints show, from the core's state: the sentence of each hint taken, and the label of every sentence marked
// by the stage "sentences". The core holds the answers; this decides what is visible by the number of hints taken.
import { hintShown } from "../core/index.ts";
import type { State } from "../core/types.ts";
import type { translatorOf } from "./messages.ts";

type T = ReturnType<typeof translatorOf>;

const className = (t: T, id: string): string => t(`errorClass.${id}` as never);

/** The sentences of the hints taken so far, in the order they were given. */
export function hintTextsOf(state: State, t: T): string[] {
  if (state.phase !== "marking") return [];
  return state.hintStages
    .slice(0, state.hintLevel)
    .map((stage) =>
      stage === "classes"
        ? t("tipClasses", { classes: state.hintClasses.map((id) => className(t, id)).join(", ") })
        : t("tipSentences"),
    );
}

/** The label of each marked sentence once the stage "sentences" is given: the error classes in it, by sentence index. */
export function hintTags(state: State, t: T): Record<number, string> {
  const names = new Map<number, Set<string>>();
  if (state.phase === "marking" && hintShown(state, "sentences")) {
    for (const entry of state.hintSentences) {
      const held = names.get(entry.sentence) ?? new Set<string>();
      for (const id of entry.classes) held.add(className(t, id));
      names.set(entry.sentence, held);
    }
  }
  return Object.fromEntries([...names].map(([key, held]) => [key, [...held].join(", ")]));
}
