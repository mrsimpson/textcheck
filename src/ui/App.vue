<script setup lang="ts">
// The round: the goal line, the Original and the Variante (like two sheets, one on top of the other: a switch turns
// from one to the other, so the eye cannot compare them side by side; the source PDF stands next to the Variante on a wide screen,
// in a wider frame, and elsewhere only its button stands above the Variante), the words to mark, the keyboard hint and the buttons (both
// below the sheets, so that the sheets are of the same height), and after checking the result. It announces every
// change for screen readers and moves the focus to the result (and scrolls to its heading, with the button for the next round right below) and back to the words. The runtime gives it the core's state; what the learner does goes back
// as input. The only state of its own is which panel is shown.
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { announce, moveFocus } from "@lernapps/tooling/a11y";
import type { Input } from "@lernapps/app-templates/interactive";
import { LEVELS, parseRoute, routeOf } from "../core/data.ts";
import { markable, type State } from "../core/index.ts";
import type { Mode } from "../core/types.ts";
import ChooseView from "./ChooseView.vue";
import HintButton from "./HintButton.vue";
import HintNote from "./HintNote.vue";
import ResultView from "./ResultView.vue";
import WordList from "./WordList.vue";
import { translatorOf } from "./messages.ts";
import { hintTags, hintTextsOf } from "./hints.ts";
import { readingStyle } from "./reading.ts";

const props = defineProps<{ state: State; lang: string }>();
const emit = defineEmits<{ input: [input: Input] }>();
const t = translatorOf(props.lang);
const view = ref<"original" | "rendition">("original");
const words = ref<InstanceType<typeof WordList> | null>(null);
const choose = ref<InstanceType<typeof ChooseView> | null>(null);
const root = ref<HTMLElement | null>(null);

// how the learner wants to read (set in the controls of the heading line, kept on the device): applied to the texts as
// CSS custom properties of the root element

// the source PDF is embedded only where a PDF shows well in a frame: a wide screen with a mouse; elsewhere the link
// to a new tab is all there is
const WIDE = "(min-width: 1300px) and (pointer: fine)";
const embed = ref(false);
let query: MediaQueryList | null = null;
const onChange = (): void => {
  embed.value = query?.matches ?? false;
};
// The address is the round: ?seed=<n>#<route>, and the only place the seed is taken from. Without a seed in the address
// the page works one out, writes it into the address, and takes it from there like any other. A round can be reloaded
// and shared, and the back and forward buttons of the browser lead from round to round. Every step that starts a round
// (a new age group or mode, the next round) writes the address first and then applies it; when the browser changes the
// address, it is applied as it stands. Applying means telling the core the round the address names. The address and the
// history only inside onMounted.
let openRound: (route: string) => void = () => undefined;
let nextRound: () => void = () => undefined;
let stopListening: () => void = () => undefined;
const newSeed = (): number => 1 + Math.floor(Math.random() * (2 ** 31 - 1));
onMounted(() => {
  /** The round the address names: the seed if it is a whole positive number, the route if the app has it. */
  const addressOf = (): { seed: number | null; route: string | null } => {
    const url = new URL(location.href);
    const seed = Number(url.searchParams.get("seed"));
    const route = decodeURIComponent(url.hash.slice(1));
    return {
      seed: Number.isInteger(seed) && seed > 0 ? seed : null,
      route: LEVELS[parseRoute(route).level] === undefined ? null : route,
    };
  };
  const write = (seed: number, route: string, push: boolean): void => {
    const url = new URL(location.href);
    url.searchParams.set("seed", String(seed));
    url.hash = route;
    if (url.href === location.href) return;
    if (push) history.pushState(null, "", url);
    else history.replaceState(history.state, "", url);
  };
  const apply = (): void => {
    const { seed, route } = addressOf();
    if (seed !== null && route !== null) emit("input", { kind: "action", name: "round", value: { seed, route } });
  };
  openRound = (route) => {
    write(newSeed(), route, true);
    apply();
  };
  nextRound = () => {
    const { seed, route } = addressOf();
    write((seed ?? newSeed()) + 1, route ?? props.state.route, true);
    apply();
  };
  // the page was opened: a seed or a route the address lacks is added (the route the runtime opened, if none)
  const opened = addressOf();
  write(opened.seed ?? newSeed(), opened.route ?? props.state.route, false);
  apply();
  addEventListener("popstate", apply);
  addEventListener("hashchange", apply);
  stopListening = () => {
    removeEventListener("popstate", apply);
    removeEventListener("hashchange", apply);
  };
  query = matchMedia(WIDE);
  onChange();
  query.addEventListener("change", onChange);
});
onUnmounted(() => {
  query?.removeEventListener("change", onChange);
  stopListening();
});
// the app page is one level below its language's root (German at the site root, every other language below /<lang>/),
// the PDFs lie at the site root
const pdfUrl = computed(() =>
  props.state.pdf === null ? null : `${props.lang === "de" ? "../" : "../../"}${props.state.pdf}`,
);

// the runtime starts the core without the page's language, and again at every route change: tell it, so that the round
// is of the packs of this language
watch(
  () => props.state.language,
  (language) => {
    if (language !== props.lang) emit("input", { kind: "action", name: "language", value: props.lang });
  },
  { immediate: true },
);

// the two selects: the age group and the mode; a change starts a new round (see below)
const levelOptions = Object.entries(LEVELS)
  .sort(([, a], [, b]) => a.grades.from - b.grades.from)
  .map(([id, level]) => ({ id, label: t("levelOption", { from: level.grades.from, to: level.grades.to }) }));
const modeOptions: { id: Mode; label: string }[] = [
  { id: "mark", label: t("modeMark") },
  { id: "source", label: t("modeSource") },
  { id: "choose", label: t("modeChoose") },
];
const picked = computed(() => parseRoute(props.state.route));
const levelSelect = ref<HTMLSelectElement | null>(null);
const modeSelect = ref<HTMLSelectElement | null>(null);
const sourceMode = computed(() => props.state.mode === "source");
// the PDF stands next to the Variante only where it is embedded (a wide screen with a mouse: it needs about 700 px to
// read); where it is not, the button that opens it stands above the Variante, which has the whole width
const sideBySide = computed(() => sourceMode.value && embed.value && pdfUrl.value !== null);
const linkOnly = computed(() => sourceMode.value && !sideBySide.value);

// A new age group or mode starts a new round with a new seed: with the same seed the round would be the same text with
// the same errors, and switching to the mode "Original erkennen" and back would show which text is the Original. Marks
// that are set are lost, so the learner is asked first.
const dialog = ref<HTMLDialogElement | null>(null);
let pending: string | null = null;
let switching = false;
const showPicked = (): void => {
  if (levelSelect.value !== null) levelSelect.value.value = picked.value.level;
  if (modeSelect.value !== null) modeSelect.value.value = picked.value.mode;
};
function onPick(): void {
  if (levelSelect.value === null || modeSelect.value === null) return;
  const route = routeOf(levelSelect.value.value, modeSelect.value.value as Mode);
  if (route === props.state.route) return;
  if (props.state.phase === "marking" && props.state.marked.length > 0) {
    pending = route;
    dialog.value?.showModal();
  } else openRound(route);
}
function confirmSwitch(): void {
  const route = pending;
  pending = null;
  switching = true;
  dialog.value?.close();
  if (route !== null) openRound(route);
}
function cancelSwitch(): void {
  pending = null;
  dialog.value?.close();
}
// closed without the switch (button or Escape): the selects show the round that goes on
function onDialogClose(): void {
  if (!switching) showPicked();
  switching = false;
  pending = null;
}
// the next round is a round of the address too: the seed after the one in the address
function onResultInput(input: Input): void {
  if (input.kind === "action" && input.name === "again") nextRound();
  else emit("input", input);
}

const goal = computed(() =>
  props.state.mode === "choose"
    ? props.state.announced === null
      ? t("goalChoose", { count: props.state.corruptions.length })
      : t("goalChooseNamed", {
          count: props.state.corruptions.length,
          classes: props.state.announced.map((id) => t(`errorClass.${id}` as never)).join(", "),
        })
    : props.state.announced === null
      ? t("goalHidden", { count: props.state.corruptions.length })
      : t("goalNamed", {
          count: props.state.corruptions.length,
          classes: props.state.announced.map((id) => t(`errorClass.${id}` as never)).join(", "),
        }),
);

watch(
  () =>
    [
      props.state.last,
      props.state.marked.length,
      props.state.seed,
      props.state.phase,
      props.state.choice,
      props.state.hintLevel,
    ] as const,
  () => {
    const { state } = props;
    const word = state.tokens[state.changed]?.text ?? "";
    const count = state.marked.length;
    if (state.last === "start") announce(t("announceStart", { count: state.corruptions.length }));
    else if (state.last === "mark") announce(t("announceMark", { word, count }));
    else if (state.last === "unmark") announce(t("announceUnmark", { word, count }));
    else if (state.last === "clear") announce(t("announceClear"));
    else if (state.last === "hint") announce(hintTextsOf(state, t).at(-1) ?? "");
    else if (state.last === "choose")
      announce(t("announceChoose", { name: t(state.choice === "a" ? "textA" : "textB") }));
    else if (state.result !== null)
      announce(t("announceCheck", { found: state.result.found, total: state.result.total, wrong: state.result.wrong }));
  },
);

// the next hint is ready: tell it once, not every second of the wait
watch(
  () => props.state.hintWait === 0 && props.state.hintLevel < props.state.hintStages.length,
  (ready, before) => {
    if (ready && !before) announce(t("announceTipReady"));
  },
);

// after checking the focus goes to the result's heading, after a new round back to the words
watch(
  () => [props.state.phase, props.state.seed] as const,
  async ([phase], [before]) => {
    await nextTick();
    if (phase === "result") {
      const heading = root.value?.querySelector<HTMLElement>("#result-heading");
      if (heading) {
        moveFocus(heading);
        // the heading is the top of what is shown, the button for the next round stands right below it (and the praise)
        heading.scrollIntoView({ block: "start" });
      }
    } else if (before === "result") (words.value ?? choose.value)?.focus();
  },
);

const checking = computed(() => props.state.phase === "result");

/** The words of the checked text and, in the mode `choose`, the sentence about the pick. */
const checked = computed(() => markable(props.state));
const choiceNote = computed(() => {
  const { result, variantSide } = props.state;
  if (result === null || result.chosenRight === null) return null;
  const params = {
    original: t(variantSide === "a" ? "textB" : "textA"),
    variant: t(variantSide === "a" ? "textA" : "textB"),
  };
  return result.chosenRight ? t("chosenRight", params) : t("chosenWrong", params);
});
</script>

<template>
  <section ref="root" class="textcheck" :style="readingStyle" :aria-label="t('region')">
    <div class="picker" @change="onPick">
      <label>
        {{ t("level") }}
        <select ref="levelSelect" :value="picked.level">
          <option v-for="option in levelOptions" :key="option.id" :value="option.id">{{ option.label }}</option>
        </select>
      </label>
      <label>
        {{ t("mode") }}
        <select ref="modeSelect" :value="picked.mode">
          <option v-for="option in modeOptions" :key="option.id" :value="option.id">{{ option.label }}</option>
        </select>
      </label>
    </div>
    <p class="goal">{{ goal }}</p>
    <p v-if="state.mode === 'choose'" class="hint note">{{ t("renditionNoteChoose") }}</p>
    <ChooseView
      v-if="state.mode === 'choose'"
      ref="choose"
      :state="state"
      :lang="lang"
      @input="(input) => emit('input', input)"
    />
    <div v-else-if="!sourceMode" class="switch" role="group" :aria-label="t('view')">
      <button type="button" :aria-pressed="view === 'original'" @click="view = 'original'">
        {{ t("original") }}
      </button>
      <button type="button" :aria-pressed="view === 'rendition'" @click="view = 'rendition'">
        {{ t("renditionTab") }}
      </button>
    </div>
    <div v-if="linkOnly" class="pdf-link">
      <p v-if="pdfUrl !== null">
        <a class="open" :href="pdfUrl" target="_blank" rel="noopener noreferrer">{{ t("openPdf") }}</a>
      </p>
      <p class="source">
        {{ t("source") }} {{ state.source.title }}, {{ state.source.license }}
        <template v-if="state.source.licenseUrl !== null">
          ·
          <a :href="state.source.licenseUrl" target="_blank" rel="noopener noreferrer">{{ t("license") }}</a>
        </template>
        <template v-if="state.source.authorsUrl !== null">
          ·
          <a :href="state.source.authorsUrl" target="_blank" rel="noopener noreferrer">{{ t("authors") }}</a>
        </template>
      </p>
    </div>
    <div
      v-if="state.mode !== 'choose'"
      class="panels"
      :class="sourceMode ? { side: sideBySide } : 'sheets'"
      :data-view="sourceMode ? undefined : view"
    >
      <section v-if="sideBySide" class="panel original pdf" aria-labelledby="original-heading">
        <h2 id="original-heading">{{ t("sourceHeading") }}</h2>
        <p v-if="pdfUrl !== null">
          <a class="open" :href="pdfUrl" target="_blank" rel="noopener noreferrer">{{ t("openPdf") }}</a>
        </p>
        <iframe v-if="embed && pdfUrl !== null" :src="pdfUrl" :title="t('pdfTitle', { title: state.title })"></iframe>
        <p class="source">
          {{ t("source") }} {{ state.source.title }}, {{ state.source.license }}
          <template v-if="state.source.licenseUrl !== null">
            ·
            <a :href="state.source.licenseUrl" target="_blank" rel="noopener noreferrer">{{ t("license") }}</a>
          </template>
          <template v-if="state.source.authorsUrl !== null">
            ·
            <a :href="state.source.authorsUrl" target="_blank" rel="noopener noreferrer">{{ t("authors") }}</a>
          </template>
        </p>
      </section>
      <section v-else-if="!sourceMode" class="panel original" aria-labelledby="original-heading">
        <h2 id="original-heading">{{ t("original") }}</h2>
        <h3 class="text-title">{{ state.title }}</h3>
        <p v-for="(sentence, index) in state.original" :key="index">{{ sentence }}</p>
        <p class="source">
          {{ t("source") }} {{ state.source.title }}, {{ state.source.license }}
          <template v-if="state.source.licenseUrl !== null">
            ·
            <a :href="state.source.licenseUrl" target="_blank" rel="noopener noreferrer">{{ t("license") }}</a>
          </template>
          <template v-if="state.source.authorsUrl !== null">
            ·
            <a :href="state.source.authorsUrl" target="_blank" rel="noopener noreferrer">{{ t("authors") }}</a>
          </template>
        </p>
      </section>
      <section class="panel rendition" aria-labelledby="rendition-heading">
        <h2 id="rendition-heading">{{ t("rendition") }}</h2>
        <h3 class="text-title">{{ state.title }}</h3>
        <p class="hint note">{{ t("renditionNote") }}</p>
        <WordList
          ref="words"
          :tokens="state.tokens"
          :marked="state.marked"
          :cursor="state.cursor"
          :checking="checking"
          :status="state.result?.status ?? []"
          :label="t('rendition')"
          :lang="lang"
          :tags="hintTags(state, t, false)"
          @input="(input) => emit('input', input)"
        />
      </section>
    </div>
    <HintNote v-if="state.mode !== 'choose' && !checking" :state="state" :lang="lang" />
    <p v-if="state.mode !== 'choose' && !checking" id="words-hint" class="hint">{{ t("hint") }}</p>
    <div v-if="state.mode !== 'choose' && !checking" class="bar">
      <span aria-hidden="true">{{ t("marked", { count: state.marked.length }) }}</span>
      <span class="buttons">
        <HintButton :state="state" :lang="lang" @input="(input) => emit('input', input)" />
        <button type="button" @click="emit('input', { kind: 'action', name: 'clear' })">{{ t("clear") }}</button>
        <button type="button" class="primary" @click="emit('input', { kind: 'action', name: 'check' })">
          {{ t("check") }}
        </button>
      </span>
    </div>
    <dialog ref="dialog" class="confirm" aria-labelledby="switch-title" @close="onDialogClose">
      <h2 id="switch-title">{{ t("switchTitle") }}</h2>
      <p>{{ t("switchText") }}</p>
      <div class="buttons">
        <button type="button" @click="cancelSwitch">{{ t("switchCancel") }}</button>
        <button type="button" class="primary" @click="confirmSwitch">{{ t("switchConfirm") }}</button>
      </div>
    </dialog>
    <ResultView
      v-if="state.result !== null"
      :result="state.result"
      :tokens="checked"
      :choice-note="choiceNote"
      :hints="state.hintLevel"
      :lang="lang"
      @input="onResultInput"
    />
  </section>
</template>

<style scoped>
.textcheck {
  /* one size and one line height for every text, so that the sheets are of the same height */
  --tc-font-size: 1.125rem;
  --tc-line-height: 2.1;
  --tc-font-weight: 400;
  --tc-font-variation: "MONO" 0, "CASL" 0;
  font-family: "Recursive TC", system-ui, sans-serif;
  color: var(--tc-ink);
}

@media (pointer: coarse) {
  .textcheck {
    --tc-line-height: 2.45; /* a word is at least 2.75 rem high with a finger */
  }
}

.picker {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
  margin: 0 0 1rem;
}

.picker label {
  box-sizing: border-box;
  flex: 1 1 14rem;
  min-width: 0;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-weight: 600;
}

.picker select {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  min-height: 2.75rem;
  padding: 0.4rem 0.6rem;
  border: 1px solid var(--tc-line);
  border-radius: 8px;
  background: var(--tc-card);
  color: var(--tc-ink);
  font: inherit;
  font-weight: 400;
}

.goal {
  margin: 0 0 1rem;
  padding: 0.6rem 0.8rem;
  border-left: 4px solid var(--tc-accent);
  background: var(--tc-card);
}

.switch {
  position: relative;
  z-index: 1; /* above the sheet that turns: it swings out over the buttons and must not take their taps */
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.pdf-link p {
  margin: 0 0 0.5rem;
}

.switch button {
  flex: 1;
  min-height: 2.75rem;
  border: 1px solid var(--tc-line);
  border-radius: 8px;
  background: var(--tc-card);
  color: var(--tc-ink);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.switch button[aria-pressed="true"] {
  border-color: var(--tc-accent);
  background: var(--tc-accent);
  color: var(--tc-on-accent);
}

/* two sheets: only one shows, the other is not in the page at all (no display of both, no focus in the hidden one);
   the sheet that comes up turns over from its left edge */
.panels {
  display: grid;
  grid-template-columns: 1fr;
  perspective: 1600px;
}

.panels.side {
  grid-template-columns: minmax(700px, 1.25fr) minmax(0, 1fr);
  gap: 1rem;
  align-items: start;
}

.panels.sheets[data-view="rendition"] > .original,
.panels.sheets[data-view="original"] > .rendition {
  display: none;
}

.panels.sheets > .panel {
  transform-origin: left center;
  animation: turn 0.4s ease-out;
}

@keyframes turn {
  from {
    transform: rotateY(-80deg);
    opacity: 0.3;
    box-shadow: 0 0 2rem rgb(0 0 0 / 0.35);
  }

  to {
    transform: none;
    opacity: 1;
    box-shadow: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .panels.sheets > .panel {
    animation: none;
  }
}

.panel {
  padding: 0.75rem 1rem;
  border: 1px solid var(--tc-line);
  border-radius: 12px;
  background: var(--tc-card);
}

h2 {
  margin: 0 0 0.5rem;
  font-size: 1.05rem;
}

.text-title {
  margin: 0 0 0.5rem;
  font-size: 1.3rem;
  line-height: 1.3;
}

.original p {
  margin: 0 0 0.6em;
  font-size: var(--tc-font-size);
  line-height: var(--tc-line-height);
  font-weight: var(--tc-font-weight);
  font-variation-settings: var(--tc-font-variation);
}

.open {
  display: inline-block;
  min-height: 2.75rem;
  padding: 0.6rem 1rem;
  border: 1px solid var(--tc-accent);
  border-radius: 8px;
  color: var(--tc-accent);
  font-weight: 600;
  text-decoration: none;
}

.pdf iframe {
  width: 100%;
  height: 80vh;
  min-height: 32rem;
  border: 1px solid var(--tc-line);
  border-radius: 8px;
  background: #ffffff;
}

.source,
.hint {
  color: var(--tc-muted);
  font-size: 0.85rem !important;
  line-height: 1.5 !important;
}

.confirm {
  max-width: min(28rem, calc(100vw - 2rem));
  padding: 1rem 1.25rem;
  border: 1px solid var(--tc-line);
  border-radius: 12px;
  background: var(--tc-card);
  color: var(--tc-ink);
}

.confirm::backdrop {
  background: rgb(0 0 0 / 0.45);
}

.confirm h2 {
  margin: 0 0 0.5rem;
}

.confirm p {
  margin: 0 0 1rem;
}

.confirm .buttons {
  justify-content: flex-end;
}

.bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.75rem;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.buttons button {
  min-height: 2.75rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--tc-line);
  border-radius: 8px;
  background: var(--tc-card);
  color: var(--tc-ink);
  font: inherit;
  cursor: pointer;
}

.buttons .primary {
  border-color: var(--tc-accent);
  background: var(--tc-accent);
  color: var(--tc-on-accent);
  font-weight: 700;
}
</style>

<style>
/* Recursive, a variable font (SIL Open Font License 1.1, see fonts/OFL.txt) cut to Latin and the axes weight, MONO
   and CASL; it is bundled with the app, nothing is loaded from elsewhere. */
@font-face {
  font-family: "Recursive TC";
  src: url("./fonts/recursive-textcheck.woff2") format("woff2");
  font-weight: 300 900;
  font-display: swap;
}

/* The two selects of the app replace the shell's list of route links; without JavaScript the list stays. */
body:has(.textcheck) .interactive-routes {
  display: none;
}

/* The start page lists every route (15 links). The selects of the app page do that job, so the list is left out. */
.interactive-section:has(> .interactive-route-list) {
  display: none;
}

/* The colours of the app stand on the main element of the page, so that the controls in the heading line, which the
   runtime mounts apart from the root component, have them too. */
.interactive {
  --tc-bg: #ffffff;
  --tc-card: #ffffff;
  --tc-ink: #1f2430;
  --tc-muted: #566074;
  --tc-line: #d5d8df;
  --tc-accent: #1d4ed8;
  --tc-on-accent: #ffffff;
  --tc-mark: #fde68a;
  --tc-mark-ink: #1f2430;
  --tc-found: #166534;
  --tc-found-bg: #dcfce7;
  --tc-missed: #9a3412;
  --tc-missed-bg: #ffedd5;
  --tc-false: #6b21a8;
  --tc-false-bg: #f3e8ff;
  --tc-tol: #1e3a8a;
  --tc-tol-bg: #dbeafe;
}

@media (prefers-color-scheme: dark) {
  .interactive {
    --tc-bg: #14161b;
    --tc-card: #1d2027;
    --tc-ink: #e8eaf0;
    --tc-muted: #a2abbd;
    --tc-line: #343a47;
    --tc-accent: #8ab4ff;
    --tc-on-accent: #0b1020;
    --tc-mark: #6b5b12;
    --tc-mark-ink: #fff6d1;
    --tc-found: #86efac;
    --tc-found-bg: #12301e;
    --tc-missed: #fdba74;
    --tc-missed-bg: #3a2210;
    --tc-false: #d8b4fe;
    --tc-false-bg: #2b1a3d;
    --tc-tol: #bfdbfe;
    --tc-tol-bg: #1e2f5a;
  }
}

/* The source PDF is an A4 page (about 794 px at 100 %) and needs about 700 px to read, the Variante next to it about
   500 px, but the frame of the page is 44 rem (704 px) wide. While the PDF stands next to the Variante, the frame is
   80 rem (header, page and footer alike); every other mode keeps the narrow column, where lines stay short enough to
   read. */
:root:has(.panels.side) {
  --interactive-max-width: 80rem;
}

/* The shell's page is light by default; follow the system setting so the dark card never sits on a white page. */
@media (prefers-color-scheme: dark) {
  :root {
    --interactive-text: #e8eaf0;
    --interactive-muted: #a2abbd;
    --interactive-background: #14161b;
    --interactive-surface: #1d2027;
    --interactive-accent: #8ab4ff;
    --interactive-on-accent: #0b1020;
    color-scheme: dark;
  }
}
</style>
