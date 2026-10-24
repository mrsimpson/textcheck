<script setup lang="ts">
// A round: the question of the exercise, the goal line, and the material. A text has one sheet. A comparison with a
// source shows the source first, with one button to turn to the rendition; the buttons that check stand only under the
// rendition, where the words are marked (the sheets are never side by side, so the eye cannot compare them at a glance).
// On the last stage the source is a link to the whole article. After checking, the result follows. It holds no state of
// its own but whether the reading tip is open; what the learner does goes back as input or as a route to open.
import { computed, ref } from "vue";
import type { Input } from "@lernapps/app-templates/interactive";
import { classesOf, placeOf, stagesRoute } from "../core/stages.ts";
import type { State } from "../core/types.ts";
import HintButton from "./HintButton.vue";
import HintNote from "./HintNote.vue";
import ResultView from "./ResultView.vue";
import WordList from "./WordList.vue";
import { hintTags } from "./hints.ts";
import { translatorOf } from "./messages.ts";
import { questionOf, tipLines } from "./reading-tip.ts";

const props = defineProps<{ state: State; lang: string }>();
const emit = defineEmits<{ input: [input: Input]; open: [route: string] }>();
const t = translatorOf(props.lang);
const words = ref<InstanceType<typeof WordList> | null>(null);
const tipOpen = ref(false);

const kind = computed(() => props.state.kind ?? "text");
const stage = computed(() => props.state.stage ?? 1);
const checking = computed(() => props.state.phase === "result");
const material = computed(() => props.state.rules?.material ?? "none");
const onSource = computed(() => material.value === "sheet" && props.state.view === "source" && !checking.value);
const sectionNames = computed(() => props.state.sections.map((name) => `„${name}“`).join(", "));
const pdf = computed(() => {
  const path = props.state.source?.pdf;
  // the PDFs lie at the site root; the app page is one level below its language's root
  return path === undefined ? null : `${props.lang === "de" ? "../" : "../../"}${path}`;
});

const goal = computed(() => {
  const count = props.state.corruptions.length;
  return props.state.announced === null
    ? t("goalHidden", { count })
    : t("goalNamed", { count, classes: props.state.announced.map((id) => t(`errorClass.${id}` as never)).join(", ") });
});
const sheetLabel = computed(() => t(kind.value === "text" ? "sheetText" : "sheetRendition"));
const say = (name: string, value?: string): void =>
  emit("input", { kind: "action", name, ...(value ? { value } : {}) });

defineExpose({ focusWords: () => words.value?.focus() });

/** The stage after this one, as the number its title shows. */
const nextStage = computed(() => {
  const route = props.state.result?.advice.next;
  const place = route === null || route === undefined ? null : placeOf(route);
  return place?.page === "round" ? place.stage : null;
});
</script>

<template>
  <div class="round">
    <button type="button" class="tc-back" @click="emit('open', stagesRoute(kind))">{{ t("backToStages") }}</button>
    <div class="head">
      <span class="tc-badge" :class="kind">
        {{ t(`kindShort.${kind}` as never) }} · {{ t(`stageTitle.${stage}` as never) }}
      </span>
      <button type="button" class="tc-btn small" :aria-expanded="tipOpen" @click="tipOpen = !tipOpen">
        {{ t("howTo") }}
      </button>
    </div>
    <h2 id="page-heading" tabindex="-1">{{ questionOf(t, kind, classesOf(kind, stage)) }}</h2>
    <div v-if="tipOpen" class="tipbox">
      <ol>
        <li v-for="line in tipLines(kind, 'full')" :key="line">{{ t(line as never) }}</li>
      </ol>
    </div>
    <p class="goal">{{ goal }}</p>

    <div v-if="material === 'link' && !checking" class="linkbox">
      <p>
        <strong>{{ t("linkHeading") }}</strong>
      </p>
      <p>
        {{ t("linkText") }}
        <template v-if="state.sections.length > 0">{{ t("linkSections", { sections: sectionNames }) }}</template>
      </p>
      <p>
        <a class="tc-btn" :href="state.source?.url ?? ''" target="_blank" rel="noopener noreferrer">
          {{ t("linkOpen") }} ↗
        </a>
      </p>
      <p class="note">{{ t("linkStand", { date: state.source?.retrieved ?? "" }) }}</p>
      <p v-if="pdf !== null" class="note">
        <a :href="pdf" target="_blank" rel="noopener noreferrer">{{ t("linkPdf") }}</a>
      </p>
    </div>

    <section v-if="onSource" :key="'source'" class="sheet turn" aria-labelledby="sheet-source">
      <h3 id="sheet-source" tabindex="-1" class="label">{{ t("sheetSource") }}</h3>
      <h3 class="text-title">{{ state.title }}</h3>
      <p v-for="(sentence, index) in state.excerpt" :key="index" class="text">{{ sentence }}</p>
    </section>
    <section
      v-else
      :key="'rendition'"
      class="sheet"
      :class="{ turn: material === 'sheet' }"
      aria-labelledby="sheet-words"
    >
      <h3 id="sheet-words" class="label">{{ sheetLabel }}</h3>
      <h3 class="text-title">{{ state.title }}</h3>
      <p v-if="kind === 'quelle'" class="note">{{ t("renditionNote") }}</p>
      <WordList
        ref="words"
        :tokens="state.tokens"
        :marked="state.marked"
        :cursor="state.cursor"
        :checking="checking"
        :status="state.result?.status ?? []"
        :label="sheetLabel"
        :lang="lang"
        :tags="hintTags(state, t)"
        @input="(input) => emit('input', input)"
      />
    </section>
    <p v-if="state.source !== null && !onSource" class="source">
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
    <p v-if="onSource" class="source">
      {{ t("source") }} {{ state.source?.title }}, {{ state.source?.license }}
      <template v-if="state.source?.licenseUrl">
        ·
        <a :href="state.source.licenseUrl" target="_blank" rel="noopener noreferrer">{{ t("license") }}</a>
      </template>
      <template v-if="state.source?.authorsUrl">
        ·
        <a :href="state.source.authorsUrl" target="_blank" rel="noopener noreferrer">{{ t("authors") }}</a>
      </template>
    </p>

    <div v-if="onSource" class="bar">
      <button type="button" class="tc-btn primary" @click="say('view', 'rendition')">{{ t("toRendition") }}</button>
    </div>
    <template v-else-if="!checking">
      <HintNote :state="state" :lang="lang" />
      <p id="words-hint" class="hint">{{ t("hint") }}</p>
      <div class="bar">
        <span class="count" aria-hidden="true">{{ t("marked", { count: state.marked.length }) }}</span>
        <span class="buttons">
          <button v-if="material === 'sheet'" type="button" class="tc-btn" @click="say('view', 'source')">
            {{ t("toSource") }}
          </button>
          <HintButton :state="state" :lang="lang" @input="(input) => emit('input', input)" />
          <button type="button" class="tc-btn" @click="say('clear')">{{ t("clear") }}</button>
          <button type="button" class="tc-btn primary" @click="say('check')">{{ t("check") }}</button>
        </span>
      </div>
    </template>

    <ResultView
      v-if="state.result !== null"
      :result="state.result"
      :tokens="state.tokens"
      :kind="kind"
      :stage="stage"
      :next-stage="nextStage"
      :hints="state.hintLevel"
      :lang="lang"
      @input="(input) => emit('input', input)"
      @open="(route) => emit('open', route)"
    />
  </div>
</template>

<style scoped>
.head {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 0.75rem;
  align-items: center;
  margin-bottom: 0.5rem;
}

.small {
  min-height: 2.25rem;
  padding: 0.2rem 0.7rem;
  font-size: 0.9rem;
}

h2 {
  margin: 0 0 0.75rem;
  font-size: 1.3rem;
}

.tipbox {
  margin: 0 0 0.75rem;
  padding: 0.6rem 1rem;
  border: 1px solid var(--tc-line);
  border-radius: 10px;
  background: var(--tc-card);
}

.tipbox ol {
  margin: 0;
  padding-left: 1.3rem;
}

.goal {
  margin: 0 0 1rem;
  padding: 0.6rem 0.8rem;
  border-left: 4px solid var(--tc-accent);
  background: var(--tc-card);
}

.linkbox {
  display: grid;
  gap: 0.2rem;
  margin: 0 0 1rem;
  padding: 0.8rem 1rem;
  border: 2px dashed var(--tc-kind-quelle);
  border-radius: 12px;
  background: var(--tc-card);
}

.linkbox p {
  margin: 0 0 0.4rem;
}

/* one sheet shows at a time: the sheet that comes up turns over from its left edge */
.sheet {
  padding: 0.75rem 1rem;
  border: 1px solid var(--tc-line);
  border-radius: 12px;
  background: var(--tc-card);
  transform-origin: left center;
}

.turn {
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
  .turn {
    animation: none;
  }
}

.label {
  margin: 0 0 0.25rem;
  color: var(--tc-muted);
  font-size: 0.9rem;
  font-weight: 650;
}

.text-title {
  margin: 0 0 0.5rem;
  font-size: 1.3rem;
  line-height: 1.3;
}

.text {
  margin: 0 0 0.6em;
  font-size: var(--tc-font-size);
  line-height: var(--tc-line-height);
  font-weight: var(--tc-font-weight);
  font-variation-settings: var(--tc-font-variation);
}

.note,
.source,
.hint {
  color: var(--tc-muted);
  font-size: 0.85rem;
  line-height: 1.5;
}

.note {
  font-style: italic;
}

.bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.75rem;
}

.bar:has(> .tc-btn:only-child) {
  justify-content: flex-end;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>
