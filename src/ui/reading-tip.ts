// What the reading tip says, from the stage's rules: the question of the exercise (with the extra question of a class the
// stage holds that has one) and the lines of the tip, as keys of the messages.
import type { Kind, Tip } from "../core/types.ts";
import type { translatorOf } from "./messages.ts";

type T = ReturnType<typeof translatorOf>;

/** The error classes that bring an extra question of their own. */
const EXTRA_QUESTIONS = ["contradiction"] as const;

/** The question of an exercise at a stage, given the classes the stage holds. */
export function questionOf(t: T, kind: Kind, classes: readonly string[]): string {
  const extra = EXTRA_QUESTIONS.filter((id) => classes.includes(id)).map((id) => t(`questionPlus.${id}` as never));
  return [t(`question.${kind}` as never), ...extra].join(" ");
}

/** The message keys of the lines of a tip: all three, or the last one. */
export function tipLines(kind: Kind, tip: Tip): string[] {
  const all = [1, 2, 3].map((index) => `tip.${kind}.${index}`);
  return tip === "full" ? all : all.slice(-1);
}
