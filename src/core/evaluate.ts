// Checks a round: which errors the learner found, and how every word counts. A hit is any marked word of the slot; a
// right word that is marked counts as wrong, unless it lies within the tolerance of an error, in the same sentence.
import { ERROR_CLASSES } from "./data.ts";
import type { ClassResult, Corruption, Result, Status, Token } from "./types.ts";

export function evaluate(
  tokens: readonly Token[],
  corruptions: readonly Corruption[],
  marked: readonly number[],
): Result {
  const isMarked = new Set(marked);
  const spans = new Map<string, Token[]>();
  for (const corruption of corruptions) {
    spans.set(
      corruption.slot,
      tokens.filter((token) => token.slot === corruption.slot),
    );
  }
  const foundSlots = new Set(
    corruptions.filter((c) => (spans.get(c.slot) ?? []).some((token) => isMarked.has(token.id))).map((c) => c.slot),
  );
  // the words next to an error that may be marked without penalty: the same sentence only
  const tolerated = new Set<number>();
  for (const corruption of corruptions) {
    const span = spans.get(corruption.slot) ?? [];
    const first = span[0];
    const last = span[span.length - 1];
    if (first === undefined || last === undefined) continue;
    for (const token of tokens) {
      if (
        token.sentence === first.sentence &&
        token.id >= first.id - corruption.tolerance &&
        token.id <= last.id + corruption.tolerance
      ) {
        tolerated.add(token.id);
      }
    }
  }
  const status: Status[] = tokens.map((token): Status => {
    const marks = isMarked.has(token.id);
    if (token.slot !== null && spans.has(token.slot)) {
      if (marks) return "found";
      return foundSlots.has(token.slot) ? "part" : "missed";
    }
    if (!marks) return "plain";
    return tolerated.has(token.id) ? "tolerated" : "false";
  });
  const classes: ClassResult[] = Object.keys(ERROR_CLASSES)
    .map((errorClass) => {
      const items = corruptions
        .filter((corruption) => corruption.errorClass === errorClass)
        .map((corruption) => ({
          slot: corruption.slot,
          found: foundSlots.has(corruption.slot),
          basis: corruption.basis,
          text: corruption.text,
          correct: corruption.correct,
          explanation: corruption.explanation,
          evidence: corruption.evidence,
        }));
      return { errorClass, found: items.filter((item) => item.found).length, total: items.length, items };
    })
    .filter((entry) => entry.total > 0);
  return {
    total: corruptions.length,
    found: foundSlots.size,
    wrong: status.filter((value) => value === "false").length,
    tolerated: status.filter((value) => value === "tolerated").length,
    status,
    classes,
    chosenRight: null,
  };
}
