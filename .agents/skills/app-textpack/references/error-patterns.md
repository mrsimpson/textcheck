# Error slots: patterns per class

A **slot** is a word or phrase of the rendition (`correct`) with one or more **variants** (wrong versions). Each variant
has `errorClass`, `basis`, `conspicuousness`, `explanation`. Classes come from `src/data/error-classes.json`; use only
classes that `src/data/stages.json` gives to a stage (the stages build on each other; a text of the exercise without a source needs places of the classes of that exercise, a text for the comparison with a source needs places of the other classes).

Status in the file: **documented** = a source we read names the pattern; **derived** = our own inference from
competency descriptions. The patterns below are craft advice for building variants; the status of each class is in the
error-class file and the page "Wie diese Übung begründet ist" (do not claim more).

## How many

- At least 3 classes, at least 6 slots; enough slots so that a round's errors (`errors` of the stage in `stages.json`) can be chosen with
  two in reserve, and at least one slot of a class the stage adds (the pack check says what a pack lacks). 2-3 variants for slots that allow it, from different classes where sensible.
- `conspicuousness` 1 (obvious) to 3 (subtle): spread the values; a pack with only 3s is frustrating, with only 1s
  trivial.
- A variant must keep the sentence grammatical (the pilot learned: "ein Jungtier" -> "zwei Jungtiere", not "ein" ->
  "zwei" before "Jungtier"). A variant must not cause a second, unplanned error.
- Make a slot that is not corrupted still fine: a sentence must not depend on another slot's wrong variant.

## Patterns per class

Form (basis `text`):
- **spelling_rule**: rule-based misspellings in the topics of the IQB lists: Auslautverhärtung (*vergeplich),
  Konsonantverdopplung (*könten), z/tz (*Fußspizen), ie/i, Dehnung, Groß-/Kleinschreibung. Use a rule the school
  years know; the misspelling must be one a pupil makes.
- **slip**: a word typed twice, a missing letter or word, swapped letters (*jetz, *nieman). Documented as separate from rule errors.
- **real_word**: another real word that a spell checker would not flag: das/dass, wieder/wider, Mal/mal, seid/seit.
- **punctuation**: missing or extra comma only where a rule applies (grade 5+: Nebensatz, Aufzählung).

Deviation from the Original (basis `comparison`, give `evidence`):
- **number_name_date**: change a figure, name or date to a plausible other one; keep the unit; stay within what a
  learner might mistake. Not to a silly value unless conspicuousness 1.
- **factual_error**: a statement that contradicts the Original in content (other animal, other place, opposite property).
  If it can be found without the Original, label basis `prior_knowledge` or `comparison` honestly.
- **added_claim**: a sentence or clause the Original does not contain (plausible, but not in the text). Often an
  insertion slot with `correct: ""`; no tolerance there.

Logic (grade 5-7+):
- **connective_negation**: wrong connective (weil/obwohl, deshalb/trotzdem) or a negation that flips the meaning.
- **contradiction**: a statement that contradicts another sentence of the same text; the other sentence must stay
  correct and be quotable.
- **quantity_degree** (7+): "einige" -> "alle", "oft" -> "immer", "meist" -> "nie".
- **overgeneralization** (7+): from one case to all.
- **faulty_inference** (7+): a "daher" or "also" that the text does not carry; cause and effect swapped.

Stance (7+ / 10+; harmless topics only):
- **opinion_as_fact** (7+): a judgement stated as a fact ("ist eindeutig das schönste Tier").
- **false_authority** (10+): "Experten sagen" without name or evidence.
- **loaded_language** (10+): emotional wording where the Original is neutral.

## Tolerance

- Only for slots of three words or more, and only if the same sentence has words next to the slot. Value: how many
  neighbouring words (in the same sentence) may be marked without penalty. Single words: none.

## Explanations

- 1-3 short sentences, plain language of the school years, in the pack's language. Quote the Original in "..." and say
  what is different. For logic and stance classes name the technique once, briefly ("Hier wird aus einem Fall ein
  Gesetz gemacht").
- Never shame the learner; do not use the words "falsch gemacht".

## Constructed misspellings

- Real examples of spelling errors (IQB, Schmellentin & Lindauer) tell what is typical; the pack's misspellings are
  constructed on those patterns. Say so in `notes`.

## English packs

The same classes, the same school years; only the patterns of the form family differ. Wording of a variant and of its
explanation is English; the explanation quotes the Original in "..." as in German.

- **spelling_rule**: rule-based misspellings a pupil makes: ie/ei (*recieve), doubled consonants (*begining, *occured),
  silent letters (*wich, *neigbour), -able/-ible, -ant/-ent. Not the German rules.
- **slip**: a word typed twice, a missing letter or word, swapped letters (*teh, *becuase). Same as German.
- **real_word**: another real word a spell checker passes: their/there/they're, its/it's, than/then, affect/effect,
  to/too, lose/loose, were/where.
- **punctuation**: a missing or extra comma only where a rule applies (list, after an introductory clause, before a
  non-defining relative clause); a missing apostrophe in a possessive. Remember that English has fewer comma rules than
  German: pick places where a reader would notice.
- All other classes: as above, with English connectives (because/although, therefore/nevertheless) and quantifiers
  (some/all, often/always, mostly/never).
- Keep British or American spelling as the source has it, in the whole pack.
