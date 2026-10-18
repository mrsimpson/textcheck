// Loads the app's data: the error classes, the levels of the routes and every text pack under src/data/packs/. A new
// pack file is found by its place, no code changes. The data are imported as JSON modules, so they are bundled and
// built with the core.
import classes from "../data/error-classes.json" with { type: "json" };
import levels from "../data/levels.json" with { type: "json" };
import type { ErrorClass, Level, Mode, TextPack } from "./types.ts";

// The unit tests check every file against src/data/textpack.v1.schema.json, so these casts state what it guarantees.
export const ERROR_CLASSES = classes as unknown as Readonly<Record<string, ErrorClass>>;
export const LEVELS = levels as unknown as Readonly<Record<string, Level>>;

const modules = import.meta.glob<TextPack>("../data/packs/**/*.json", { eager: true, import: "default" });

/** Every text pack, in the order of its path, so that the same seed finds the same pack on every machine. */
export const PACKS: readonly TextPack[] = Object.keys(modules)
  .sort()
  .map((path) => modules[path] as TextPack);

/** The endings of a route that name a mode; a route without one plays the mode `mark`. */
const MODE_SUFFIXES: Readonly<Record<string, Mode>> = { "-quelle": "source", "-original": "choose" };

/** The level route and the mode of a route: `klasse-5-6-quelle` is the level `klasse-5-6` in the mode `source`. */
export function parseRoute(route: string): { level: string; mode: Mode } {
  for (const [suffix, mode] of Object.entries(MODE_SUFFIXES))
    if (route.endsWith(suffix)) return { level: route.slice(0, -suffix.length), mode };
  return { level: route, mode: "mark" };
}

/** The route of a level in a mode: the reverse of `parseRoute`. */
export function routeOf(level: string, mode: Mode): string {
  const suffix = Object.entries(MODE_SUFFIXES).find(([, value]) => value === mode)?.[0] ?? "";
  return `${level}${suffix}`;
}

/** The level of a route; throws for a route without one. */
export function levelOf(route: string): Level {
  const { level: name } = parseRoute(route);
  const level = LEVELS[name];
  if (level === undefined) throw new Error(`no level ${name} in src/data/levels.json`);
  return level;
}

/** The packs of a language whose school years are the level's. */
export function packsFor(language: string, level: Level): TextPack[] {
  return PACKS.filter(
    (pack) =>
      pack.language === language && pack.grades.from === level.grades.from && pack.grades.to === level.grades.to,
  );
}
