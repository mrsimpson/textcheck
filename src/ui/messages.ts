// The learner texts of the UI by language, and the translator of one language. A language is added with its own file
// src/messages/<language>.json, complete (the unit tests compare the keys).
import { translator } from "@lernapps/tooling/i18n";
import de from "../messages/de.json";
import en from "../messages/en.json";

const MESSAGES = { de, en } as const;

/** The translator of `lang`, German for a language the app does not have. */
export function translatorOf(lang: string): (key: keyof typeof de, params?: Record<string, string | number>) => string {
  return translator(lang in MESSAGES ? MESSAGES[lang as keyof typeof MESSAGES] : de);
}
