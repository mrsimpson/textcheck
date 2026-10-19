# Draft: excerpt and rendition

## Beginning and title (every text)

- The learner reads a heading, then the text. The pack's `title` is the heading, shown above the Original and above the
  Variante: a short noun phrase as a reader would say it ("Biber", "Der Marshallplan"), no subtitle, no colon.
- The excerpt **begins with the introduction of the article**: its first sentence, verbatim (add the second one if the
  first only names the topic). It must say what the text is about; a text never starts in the middle of an article
  ("Die erste Zeit für Nachwuchs ist der Januar" was such a start). A long first sentence of a Wikipedia article is
  allowed from grade 7 on; in lower grades take the first simple sentences of the introduction.
- The rendition begins with the same introduction in own words and names the topic. Check it with
  `node .agents/skills/app-textpack/scripts/check-lead.mjs src/data/packs/de/<grades>/<id>.json` (the first excerpt
  sentence must stand at the start of the article in the source PDF).
- Every later sentence must be understood by a reader who knows only the text: no "sie", "dort", "dies" without a
  noun before it in the text, no sentence that needs the part of the article you left out.

## Excerpt (the Original)

- Verbatim sentences of the source, in the source's order. The creator allowed light smoothing for hard first
  sentences (grade 7-8 packs: foreign words, brackets, a side clause left out or explained). Do it only where a sentence
  would not be understood otherwise, keep the beginning of the sentence, and say in `notes` what you changed (the check
  `check-lead.mjs` and the PDF comparison then show those sentences as not verbatim; that is known). You may leave out whole sentences, never edit
  words. No headings, lists or tables unless they are sentences.
- Size: pilot (grades 5-6) uses 10 sentences. Guide: grade 3-4 about 6-8 short sentences, 5-6 about 10, 7+ increase by
  1-2 sentences or 20 % per pair. Every sentence must carry something that a variant can change. IGLU texts for grade 4
  have 500-850 words; our excerpts are shorter on purpose, because the task is to compare, not to read at length.
- Choose a stretch that stands on its own: no pronoun without antecedent, no "wie oben gesagt".

## Rendition (the Variante)

- A faithful retelling in own words, sentence by sentence. Not shorter on purpose, not an interpretation.
- One rendition sentence has one idea and rests on one or a few excerpt sentences. Each has `evidence.quote`: the
  verbatim passage of the excerpt that supports it. A claim without a quote does not belong in the Variante.
- Age: sentence length, word choice and sentence structure fit the school years (grades 3-4 main clauses, simple
  words; 7+ subordinate clauses, technical terms from the source). Keep terms from the source where learners must
  find them again.
- Do not copy the excerpt word by word; change order, words and sentence building, so that comparing is real
  comparing. Keep numbers, names and dates the same as the source.
- The correct Variante must be right everywhere: any error learners find must be one that a slot introduced.

## Pace and variety

- Spread places over the whole text; at most one error-bearing place per sentence, with two neighbouring places
  never needing the same knowledge.
- Prefer places that the text gives a reason to look at: numbers, names, connecting words, claims about "all", "never".
