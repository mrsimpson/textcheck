// What the learner can set for reading: the style of the font (Recursive, bundled with the app), the weight, the size
// and the line spacing. The values are kept on the device through the tooling's storage; where that is blocked, the
// defaults hold and the settings work for this visit only.
import { createStorage } from "@lernapps/tooling/storage";
import { computed, ref, watch } from "vue";

export type FontStyle = "normal" | "round" | "mono";

export interface Reading {
  style: FontStyle;
  /** The weight of the font, 300 to 900. */
  weight: number;
  /** The size of the texts in rem. */
  size: number;
  /** The line height as a multiple of the size; null: the app's own (higher on a touch screen). */
  spacing: number | null;
}

export const DEFAULT_READING: Reading = { style: "normal", weight: 400, size: 1.125, spacing: null };

export const LIMITS = {
  weight: { min: 300, max: 900, step: 50 },
  size: { min: 0.9, max: 1.8, step: 0.05 },
  spacing: { min: 1.6, max: 2.8, step: 0.1 },
} as const;

const KEY = "reading";
const storage = createStorage("textcheck");

const inRange = (value: unknown, limit: { min: number; max: number }): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= limit.min && value <= limit.max;

function isReading(value: unknown): value is Reading {
  if (typeof value !== "object" || value === null) return false;
  const { style, weight, size, spacing } = value as Record<string, unknown>;
  return (
    (style === "normal" || style === "round" || style === "mono") &&
    inRange(weight, LIMITS.weight) &&
    inRange(size, LIMITS.size) &&
    (spacing === null || inRange(spacing, LIMITS.spacing))
  );
}

/** The settings saved on this device, or the defaults. */
export function loadReading(): Reading {
  return storage.load(KEY, isReading) ?? { ...DEFAULT_READING };
}

/** Keeps the settings on this device; false where the browser does not let the app store them. */
export function saveReading(reading: Reading): boolean {
  return storage.save(KEY, reading);
}

/** The settings as CSS custom properties of the app's root element. */
export function styleOf(reading: Reading): Record<string, string> {
  const style: Record<string, string> = {
    "--tc-font-size": `${reading.size}rem`,
    "--tc-font-weight": String(reading.weight),
    "--tc-font-variation": `"MONO" ${reading.style === "mono" ? 1 : 0}, "CASL" ${reading.style === "round" ? 1 : 0}`,
  };
  if (reading.spacing !== null) style["--tc-line-height"] = String(reading.spacing);
  return style;
}

/**
 * The settings of this visit, one for every component that shows them: the root component (the texts) and the controls
 * in the heading line, which the runtime mounts apart from it. A change is kept on the device.
 */
export const reading = ref<Reading>(loadReading());
watch(reading, (value) => saveReading(value), { deep: true });

/** The settings as CSS custom properties. */
export const readingStyle = computed(() => styleOf(reading.value));
