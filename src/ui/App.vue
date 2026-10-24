<script setup lang="ts">
// The root component. The core's state says which page shows: the choice of the exercise, the stages of one, the reading
// tip, or a round with its result. The address is the round (`?seed=<n>#<route>`) and the only place the seed is taken
// from. Without a seed in the address the page works one out, writes it into the address, and takes it from there like
// any other. A round can be reloaded and shared, and the back and forward buttons of the browser lead from page to page.
// Every step that opens a page or starts a round writes the address first and then applies it; when the browser
// changes the address, it is applied as it stands. Applying means telling the core the round the address names. The
// component announces every change for screen readers, moves the focus (to the heading of a page, the heading of the
// result, the words) and remembers the stages passed. The runtime gives it the core's state; what the learner does goes
// back as input. It holds no state of its own.
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { announce, moveFocus } from "@lernapps/tooling/a11y";
import type { Input } from "@lernapps/app-templates/interactive";
import { placeOf } from "../core/stages.ts";
import type { State } from "../core/index.ts";
import ChoosePage from "./ChoosePage.vue";
import RoundView from "./RoundView.vue";
import StagesPage from "./StagesPage.vue";
import TipPage from "./TipPage.vue";
import { hintTextsOf } from "./hints.ts";
import { markPassed } from "./progress.ts";
import { translatorOf } from "./messages.ts";
import { readingStyle } from "./reading.ts";

const props = defineProps<{ state: State; lang: string }>();
const emit = defineEmits<{ input: [input: Input] }>();
const t = translatorOf(props.lang);
const round = ref<InstanceType<typeof RoundView> | null>(null);
const root = ref<HTMLElement | null>(null);

// whether the learner has moved by now: the page that opens with the address takes no focus, a page the learner opens does
let moved = false;
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
      route: placeOf(route) === null ? null : route,
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
    moved = true;
    write(newSeed(), route, true);
    apply();
  };
  nextRound = () => {
    moved = true;
    const { seed, route } = addressOf();
    write((seed ?? newSeed()) + 1, route ?? props.state.route, true);
    apply();
  };
  // the page was opened: a seed or a route the address lacks is added (the route the runtime opened, if none)
  const opened = addressOf();
  write(opened.seed ?? newSeed(), opened.route ?? props.state.route, false);
  apply();
  const follow = (): void => {
    moved = true;
    apply();
  };
  addEventListener("popstate", follow);
  addEventListener("hashchange", follow);
  stopListening = () => {
    removeEventListener("popstate", follow);
    removeEventListener("hashchange", follow);
  };
});
onUnmounted(() => stopListening());

// the runtime starts the core without the page's language, and again at every route change: tell it, so that the round
// is of the texts of this language
watch(
  () => props.state.language,
  (language) => {
    if (language !== props.lang) emit("input", { kind: "action", name: "language", value: props.lang });
  },
  { immediate: true },
);

// the next round is a round of the address too: the seed after the one in the address
function onInput(input: Input): void {
  moved = true;
  if (input.kind === "action" && input.name === "again") nextRound();
  else emit("input", input);
}

watch(
  [
    () => props.state.last,
    () => props.state.marked.length,
    () => props.state.seed,
    () => props.state.phase,
    () => props.state.view,
    () => props.state.hintLevel,
  ],
  () => {
    const { state } = props;
    const word = state.tokens[state.changed]?.text ?? "";
    const count = state.marked.length;
    const errors = state.corruptions.length;
    if (state.last === "start" && state.phase === "marking" && errors > 0)
      announce(t("announceStart", { count: errors }));
    else if (state.last === "begin") announce(t("announceBegin", { count: errors }));
    else if (state.last === "view")
      announce(t(state.view === "source" ? "announceViewSource" : "announceViewRendition"));
    else if (state.last === "mark") announce(t("announceMark", { word, count }));
    else if (state.last === "unmark") announce(t("announceUnmark", { word, count }));
    else if (state.last === "clear") announce(t("announceClear"));
    else if (state.last === "hint") announce(hintTextsOf(state, t).at(-1) ?? "");
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

// a stage passed is remembered, so that its card shows a tick
watch(
  () => props.state.result?.advice.passed === true,
  (passed) => {
    if (passed) markPassed(props.state.route);
  },
);

// the focus: after checking to the result's heading, to the heading of a page that opens, back to the words after a new
// round, and with the sheet that turns to what it shows
watch(
  [() => props.state.phase, () => props.state.route, () => props.state.seed],
  async ([phase, route], [before, beforeRoute]) => {
    if (!moved) return;
    await nextTick();
    if (phase === "result") {
      const heading = root.value?.querySelector<HTMLElement>("#result-heading");
      if (heading) {
        moveFocus(heading);
        // the heading is the top of what is shown, what to do next stands right below it (and the praise)
        heading.scrollIntoView({ block: "start" });
      }
    } else if (before === "result" && route === beforeRoute) {
      round.value?.focusWords();
    } else {
      const heading = root.value?.querySelector<HTMLElement>("#page-heading");
      if (heading) moveFocus(heading);
    }
  },
);
watch(
  () => props.state.view,
  async (view) => {
    await nextTick();
    if (props.state.last !== "view") return;
    if (view === "rendition") round.value?.focusWords();
    else {
      const heading = root.value?.querySelector<HTMLElement>("#sheet-source");
      if (heading) moveFocus(heading);
    }
  },
);
</script>

<template>
  <section ref="root" class="textcheck" :style="readingStyle" :aria-label="t('region')">
    <ChoosePage v-if="state.phase === 'choose'" :lang="lang" @open="(route) => openRound(route)" />
    <StagesPage v-else-if="state.phase === 'stages'" :state="state" :lang="lang" @open="(route) => openRound(route)" />
    <TipPage
      v-else-if="state.phase === 'tip'"
      :state="state"
      :lang="lang"
      @input="onInput"
      @open="(route) => openRound(route)"
    />
    <RoundView v-else ref="round" :state="state" :lang="lang" @input="onInput" @open="(route) => openRound(route)" />
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

/* The pages of the app replace the shell's list of route links; without JavaScript the list stays. */
body:has(.textcheck) .interactive-routes {
  display: none;
}

/* The start page lists every route (9 links). The choice of the app page does that job, so the list is left out. */
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
  --tc-kind-text: #0f766e;
  --tc-kind-quelle: #9a3412;
  --tc-kind-text-bg: #e3f4f2;
  --tc-kind-quelle-bg: #fbece3;
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
    --tc-kind-text: #5eead4;
    --tc-kind-quelle: #fdba74;
    --tc-kind-text-bg: #17302d;
    --tc-kind-quelle-bg: #3a261a;
  }
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

/* what the pages share: buttons, the back link and the badge of an exercise */
.textcheck .tc-btn {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--tc-line);
  border-radius: 8px;
  background: var(--tc-card);
  color: var(--tc-ink);
  font: inherit;
  text-decoration: none;
  cursor: pointer;
}

.textcheck .tc-btn.primary {
  border-color: var(--tc-accent);
  background: var(--tc-accent);
  color: var(--tc-on-accent);
  font-weight: 700;
}

.textcheck .tc-btn:disabled {
  opacity: 0.55;
  cursor: default;
}

.textcheck .tc-back {
  margin: 0 0 0.5rem;
  padding: 0.4rem 0;
  border: 0;
  background: none;
  color: var(--tc-accent);
  font: inherit;
  cursor: pointer;
}

.textcheck .tc-badge {
  display: inline-block;
  padding: 0.1rem 0.6rem;
  border-radius: 999px;
  background: var(--tc-kind-text-bg);
  color: var(--tc-kind-text);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.textcheck .tc-badge.quelle {
  background: var(--tc-kind-quelle-bg);
  color: var(--tc-kind-quelle);
}

.textcheck :focus-visible {
  outline: 3px solid var(--tc-accent);
  outline-offset: 2px;
}
</style>
