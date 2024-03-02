<script setup lang="ts">
import type { Highlighter } from 'shiki'
import { getHighlighter } from 'shiki'
import { bundledThemesInfo } from 'shiki/themes'
import { bundledLanguagesInfo } from 'shiki/langs'
import { ref, shallowRef, watch } from 'vue'
import { ShikiMagicMove } from '../../src/vue'
import { vueAfter, vueBefore } from './fixture'

const theme = ref('vitesse-dark')
const lang = ref('vue')

const highlighter = ref<Highlighter>()

const isAnimating = ref(false)

const loadingPromise = shallowRef<Promise<void> | undefined>(
  getHighlighter({
    themes: [theme.value],
    langs: [lang.value],
  }).then((h) => {
    highlighter.value = h
    loadingPromise.value = undefined
  }),
)

const samplesCache = new Map<string, Promise<string | undefined>>()

function fetchSample(id: string) {
  if (!samplesCache.has(id)) {
    samplesCache.set(id, fetch(`https://raw.githubusercontent.com/shikijs/textmate-grammars-themes/main/samples/${id}.sample`)
      .then(r => r.text())
      .catch((e) => {
        console.error(e)
        return undefined
      }))
  }
  return samplesCache.get(id)!
}

const example = ref(vueBefore)
const code = ref(example)
const input = ref(code.value)
const autoCommit = ref(true)
const duration = ref(500)

function reset() {
  if (lang.value === 'vue')
    example.value = example.value === vueBefore ? vueAfter : vueBefore
  input.value = example.value
  code.value = example.value
}

function commit() {
  code.value = input.value
}

let timer: ReturnType<typeof setTimeout> | undefined

watch(
  input,
  () => {
    if (timer)
      clearTimeout(timer)
    if (autoCommit.value)
      timer = setTimeout(commit, 300)
  },
)

watch(
  [theme, lang],
  (n, o) => {
    const previous = loadingPromise.value || Promise.resolve()

    loadingPromise.value = previous.then(() => {
      const promises: Promise<void>[] = []
      if (!highlighter.value!.getLoadedLanguages().includes(lang.value))
        promises.push(highlighter.value!.loadLanguage(lang.value as any))
      if (!highlighter.value!.getLoadedThemes().includes(theme.value))
        promises.push(highlighter.value!.loadTheme(theme.value as any))
      if (n[1] !== o[1]) {
        promises.push(fetchSample(lang.value).then((code) => {
          example.value = code || 'ERROR'
          reset()
        }))
      }
      return Promise.all(promises)
    })
      .then(() => {
        loadingPromise.value = undefined
      })
  },
)
</script>

<template>
  <div class="h-screen flex flex-col font-sans max-h-screen px4 py4 gap-4">
    <div class="flex flex-col items-center flex-none  text-center">
      <span class="text-2xl font-200 bg-gradient-to-r from-teal to-orange inline-block text-transparent bg-clip-text">
        <span>Shiki</span>
        <span class="font-800 mx1">Magic</span>
        <span class="italic font-serif">Move</span>
      </span>
      <div class="text-stone:75">
        Smoothly animated code blocks with <a href="https://github.com/shikijs/shiki" target="_blank" class="underline">Shiki</a>.
        <a href="https://github.com/shikijs/shiki-magic-move" target="_blank" class="underline">GitHub</a>
      </div>
    </div>
    <div class="grid md:grid-cols-2 gap-4 flex-auto of-hidden">
      <div class="of-hidden">
        <textarea
          v-model="input"
          class="font-mono w-full h-full flex-auto p-4 border border-gray:20 rounded bg-transparent"
          @keydown.meta.enter.prevent="commit"
        />
      </div>
      <div class="of-auto">
        <ShikiMagicMove
          v-if="highlighter && !loadingPromise"
          :highlighter="highlighter"
          :code="code"
          :lang="lang"
          :theme="theme"
          :options="{ duration }"
          class="font-mono p-4 border border-gray:20 shadow-xl rounded"
          @start="isAnimating = true"
          @end="isAnimating = false"
        />
        <div
          v-else
          class="font-mono w-full h-full p-4 border border-gray:20 shadow-xl rounded"
        >
          <span class="animate-pulse">Loading...</span>
        </div>
        <!-- Events is not yet working well -->
        <!-- <div v-if="isAnimating" class="py2 animate-pulse text-green">
          Animating...
        </div> -->
      </div>
    </div>
    <div class="flex-none flex flex-wrap gap-4 items-center">
      <button class="border border-gray:20 rounded px3 py1" @click="reset">
        Reset Example
      </button>
      <label>
        <input
          v-model="autoCommit"
          type="checkbox"
        >
        Auto Commit
      </label>
      <button v-if="!autoCommit" class="border border-gray:20 rounded px3 py1" @click="commit">
        Commit Changes
      </button>
      <label class="flex gap-2">
        Duration
        <input
          v-model="duration"
          type="range" min="100" max="5000"
          class="border border-gray:20 rounded px2 py1"
        >
        {{ duration }}ms
      </label>

      <div class="flex-auto" />
      <select
        v-model="theme"
        class="border border-gray:20 rounded px2 py1"
      >
        <option
          v-for="t of bundledThemesInfo"
          :key="t.id"
          :value="t.id"
        >
          {{ t.displayName }}
        </option>
      </select>
      <select
        v-model="lang"
        class="border border-gray:20 rounded px2 py1"
      >
        <option
          v-for="l of bundledLanguagesInfo"
          :key="l.id"
          :value="l.id"
        >
          {{ l.name }}
        </option>
      </select>
    </div>
  </div>
</template>
