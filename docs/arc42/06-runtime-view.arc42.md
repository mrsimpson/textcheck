# Runtime View

<!-- From @lernapps/app-templates 5df0763 (the generic part and the interactive extension): lernapps update replaces this file except the app sections, between <!-- app: begin … --> and <!-- app: end … -->, which hold the app's own architecture. -->

Six scenarios every app shares: opening its pages, learning in the browser, an error path of the device storage,
the assistant working with the skills, building with the checks, and the end-to-end tests before a push and in CI. Each extension adds its archetype's own
scenarios (the explainer's include asking the tutor).

## Opening the pages

A learner, teacher or parent opens `lernapps.net/<app>/`. The host serves static pages the build rendered from what
the creator wrote; what a page shows without JavaScript depends on the archetype and is in its extension (an
interactive app's app page shows only a `<noscript>` note). The language switch and the alternates are plain links to
the same page in the other language tree; an address the app does not have gets the 404 page, which leads to the
start page.

```arc42
:::runtime-scenario
id: scenario-pages
title: Opening the pages
trigger: A learner, teacher or parent opens the app's address
involves: bb-render, bb-runtime
:::
```

## Learning in the browser

The page loads the app's client module; `src/main.ts` calls the archetype's start function, which takes a seed from
the address where the archetype draws anything at random, shows the learner's progress, announces changes through the
live region and moves the focus to the feedback. Its texts come in the page's language.

```arc42
:::runtime-scenario
id: scenario-learn
title: Learning in the browser
trigger: The learner opens a page with JavaScript and answers, practises or plays
involves: bb-shell, bb-tooling
:::
```

## Remembering on the device, storage blocked or full

An app that remembers something loads and saves JSON values through the storage wrapper, under its own prefix in
`localStorage`. When the browser blocks storage or it is full, `load` gives nothing and `save` returns false; the app
keeps working and remembers nothing. The decided quota of 100 kB, beyond which `save` refuses, is not built yet.

```arc42
:::runtime-scenario
id: scenario-device-storage
title: Remembering on the device, storage blocked or full
trigger: The archetype's code loads or saves a value
involves: bb-shell, bb-tooling
:::
```

## Working with the skills

The creator's assistant loads the skills the app commits under `.agents/skills/` (`lernapps-app`, the archetype's
skill, the content skills and the app's own `app-content`), writes what the archetype lets it write and runs
`lernapps check`. `lernapps update` replaces the `lernapps-*` skills with those of the tooling.

```arc42
:::runtime-scenario
id: scenario-skills
title: Working with the skills
trigger: The creator's assistant starts work on the app
involves: bb-skills, bb-tooling
:::
```

## Building with the checks

`vp build` (and `vp dev` on each request) runs the archetype's plugin inside the tooling preset. It validates what
the creator wrote, runs the archetype's checks (the component rules on any Vue components, the examples through the
checker where the archetype has them), and only then writes every page in every language, with the shared page trees
and the runtime's texts, and the 404 page. Any problem fails the build with one line per problem.

```arc42
:::runtime-scenario
id: scenario-build
title: Building with the checks
trigger: The creator, a git hook or CI runs the build
involves: bb-tooling, bb-archetype-runtime, bb-build, bb-validation, bb-render, bb-runtime-texts, bb-runtime
:::
```

## End-to-end tests before a push

`lernapps check --pre-push`, run by the pre-push hook and by CI, serves the built app on a free port and runs the
archetype's tests in Chromium at desktop width and at 360 px, with reduced motion, with cases derived from what the
creator wrote. `lernapps check` adds axe, the width check and the request check on the pages it visits.

```arc42
:::runtime-scenario
id: scenario-e2e
title: End-to-end tests before a push
trigger: The pre-push hook or CI runs lernapps check --pre-push
involves: bb-tooling, bb-e2e, bb-render, bb-shell, bb-runtime-texts
:::
```


The interactive archetype's own scenarios, besides the generic ones.

## Playing on the app page

The learner opens `app/`, possibly with `?seed=<n>` and `#<route>`. `src/main.ts` calls `startInteractive`, which
takes the seed from the address (else a random one) and the route from the hash (else the first route), starts the
core and mounts the root component with the state and the page's language. Components translate any device input
(pointer, touch, …) into typed inputs for `step` (`dec-typed-input`): the shell gives every key typed on the page to
`step` as a key input, except keys on links, buttons and form fields or with Ctrl, Alt or Meta, and steps every input
the root component emits as `input`; a key that changes the state loses its default. When the core
has `tick`, the shell calls it every 20 ms. A new route in the hash starts the core again with the same seed and marks
the current route link. The components only show the state, take their texts through the translator and announce
changes through the live region.

```arc42
:::runtime-scenario
id: scenario-play
title: Playing on the app page (input, ticks, route change)
trigger: The learner opens the app page, gives an input, or follows a route link
involves: bb-render, bb-shell, bb-interactive-core, bb-interactive-data, bb-interactive-ui, bb-interactive-messages, bb-tooling
:::
```

## Building with the playthroughs

The `interactive()` plugin validates `src/app.yaml` and the playthroughs, runs the component rules on the UI, loads
the core in a Vite server of its own, checks its exports and that every route starts, and plays every playthrough
twice, each step's inputs and then its ticks, comparing the two plays and the expected states, before it writes the start page and the app
page with the runtime's texts.

```arc42
:::runtime-scenario
id: scenario-interactive-build
title: Building with the playthroughs
trigger: The creator, a git hook or CI runs the build
involves: bb-build, bb-validation, bb-component-rules, bb-interactive-description, bb-interactive-core, bb-interactive-playthroughs, bb-render, bb-runtime-texts
:::
```

## Browser playthroughs

`interactiveTests()` checks the start page and the app page without JavaScript in every language, then opens each
playthrough at `app/?seed=<seed>#<route>` on the test clock, gives its inputs (keys pressed on the keyboard, actions
emitted by the root component) and its ticks, and compares, after each step, the state read from `lernappsState` and the announcement of the polite live region.

```arc42
:::runtime-scenario
id: scenario-browser-playthroughs
title: Browser playthroughs in the end-to-end tests
trigger: The pre-push hook or CI runs lernapps check --pre-push
involves: bb-e2e, bb-interactive-description, bb-interactive-playthroughs, bb-shell, bb-interactive-core, bb-interactive-ui, bb-runtime-texts, bb-tooling
:::
```

<!-- app: begin -->

## Playing a round of Textcheck

The learner opens `app/#klasse-5-6`, possibly with `?seed=<n>`. The core takes the pack of the route's school years from
the data access, lets the round builder pick the slots to corrupt and the variants from the seed, and splits the Variante
into words. The root component shows the Original, the Variante and the goal line, the word list takes marks and arrow
keys and hands them back as actions, and the core keeps the marks. When the learner checks, the evaluation says which
errors were found and how every word counts, and the root component shows the result view and moves the focus to it.
Every change is announced through the live region, and every learner text comes from the message file through the
translator.

The route names the mode: `app/#klasse-5-6-quelle` plays the same round with the source PDF instead of the Original,
`app/#klasse-5-6-original` shows two texts, A and B, and the learner first picks the text with the errors and then
marks the words there; the result says whether the pick was right.

The app has pages per language, German at the root and English below `/en/`, with the frame's language switcher. The
runtime starts the core with the seed and the route only, so the root component tells it the page's language by the
action `language`, on the first state and again after every route change; the core then starts the same round, the same
seed and route, with a pack of that language. The source PDFs lie at the site root, so the link from `/en/app/` goes
two levels up.

The learner can press the button "Schrift" in the heading line at any time, which opens the dialog "Schrift und Lesen", and change the style of the font, its weight, the size and the line
spacing; the texts change at once, and the settings are kept on the device (through the storage of the tooling, under
the app's own prefix) for the next visit.

The learner can take hints. The button "Hinweis" waits: the runtime's ticks run the core's wait down (15 s after the round
starts, then 20 s after each hint), and the button shows the seconds left. The first hint names the kinds of error of the
round where the level hides them; the next marks the sentences with an error, in the mode Original erkennen in both
texts. When every error is found, the result shows fireworks without a hint and confetti with one.

```arc42
:::runtime-scenario
id: scenario-textcheck-round
title: Playing a round of Textcheck
trigger: The learner opens a route, marks words, checks, and asks for the next round
involves: bb-shell, bb-tooling, bb-textcheck-root, bb-textcheck-wordlist, bb-textcheck-choose, bb-textcheck-result, bb-textcheck-ui-texts, bb-textcheck-controls, bb-textcheck-reading, bb-textcheck-hint-button, bb-textcheck-hint-note, bb-textcheck-hints, bb-textcheck-state, bb-textcheck-round, bb-textcheck-evaluate, bb-textcheck-data-access, bb-textcheck-packs, bb-textcheck-tables
:::
```

## Checking a text pack

Whoever writes a pack, and the unit tests in the pre-commit and pre-push checks, run the pack checks over every file under
`src/data/packs/`: the schema first, then what a schema cannot say, with the round builder telling how many slots each
level can corrupt. An error fails the tests; warnings are read and justified in the pack's notes.

```arc42
:::runtime-scenario
id: scenario-textcheck-pack-check
title: Checking a text pack
trigger: A pack is written or changed, or the tests run
involves: bb-textcheck-pack-check, bb-textcheck-round, bb-textcheck-data-access, bb-textcheck-packs, bb-textcheck-tables
:::
```
<!-- app: end -->
