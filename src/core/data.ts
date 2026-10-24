// Loads the app's data: the error classes and every text pack under src/data/packs/. A new pack file is found by its
// place, no code changes. The data are imported as JSON modules, so they are bundled and built with the core.
import classes from "../data/error-classes.json" with { type: "json" };
import type { ErrorClass, TextPack } from "./types.ts";

// The unit tests check every file against src/data/textpack.v1.schema.json, so these casts state what it guarantees.
export const ERROR_CLASSES = classes as unknown as Readonly<Record<string, ErrorClass>>;

const modules = import.meta.glob<TextPack>("../data/packs/**/*.json", { eager: true, import: "default" });

/** Every text pack, in the order of its path, so that the same seed finds the same pack on every machine. */
export const PACKS: readonly TextPack[] = Object.keys(modules)
  .sort()
  .map((path) => modules[path] as TextPack);
