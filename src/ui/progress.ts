// What the learner has done: the stages passed (all errors found, at most one right word marked), kept on the device
// through the tooling's storage, so the cards of the stages can show a tick. Where storage is blocked the ticks hold
// for this visit only.
import { createStorage } from "@lernapps/tooling/storage";
import { ref } from "vue";

const KEY = "done";
const storage = createStorage("textcheck");

const isRoutes = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((entry) => typeof entry === "string");

/** The routes of the stages passed. */
export const passed = ref<string[]>(storage.load(KEY, isRoutes) ?? []);

/** Remembers a stage as passed. */
export function markPassed(route: string): void {
  if (passed.value.includes(route)) return;
  passed.value = [...passed.value, route];
  storage.save(KEY, passed.value);
}

/** Forgets the ticks of the given stages. */
export function clearPassed(routes: readonly string[]): void {
  passed.value = passed.value.filter((route) => !routes.includes(route));
  storage.save(KEY, passed.value);
}
