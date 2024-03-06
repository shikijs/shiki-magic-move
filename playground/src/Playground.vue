<script setup lang="ts">
import type { Highlighter } from 'shiki'
import { getHighlighter } from 'shiki'
import { bundledThemesInfo } from 'shiki/themes'
import { bundledLanguagesInfo } from 'shiki/langs'
import { ref, shallowRef, watch, watchEffect } from 'vue'
import { toRefs, useLocalStorage } from '@vueuse/core'
import { vueAfter, vueBefore } from './fixture'
import type { RendererFactoryOptions, RendererFactoryResult, RendererType, RendererUpdatePayload } from './renderer/types'
import { createRendererVue } from './renderer/vue'

const defaultOptions = {
  theme: 'vitesse-dark',
  lang: 'vue',
  autoCommit: true,
  duration: 750,
  code: vueBefore,
  useDebugStyles: false,
  stagger: 3,
  rendererType: 'vue' as RendererType,
}

const options = useLocalStorage('shiki-magic-move-options', defaultOptions, { mergeDefaults: true })

const {
  theme,
  lang,
  code,
  duration,
  autoCommit,
  useDebugStyles,
  stagger,
  rendererType,
} = toRefs(options)

const example = ref(vueBefore)
const input = ref(code.value)
const highlighter = ref<Highlighter>()
const isAnimating = ref(false)
const rendererContainer = ref<HTMLElement>()

let renderer: RendererFactoryResult

const loadingPromise = shallowRef<Promise<void> | undefined>(
  getHighlighter({
    themes: [theme.value],
    langs: [lang.value],
  }).then((h) => {
    highlighter.value = h
    loadingPromise.value = undefined
  }),
)

const rendererOptions: RendererFactoryOptions = {
  onEnd() {
    isAnimating.value = false
  },
  onStart() {
    isAnimating.value = true
  },
}

watch(
  rendererType,
  () => {
    if (renderer) {
      renderer?.dispose()
      renderer = undefined as any
    }
    rendererUpdate()
  },
  { flush: 'sync' },
)

function rendererUpdate() {
  if (!rendererContainer.value || !highlighter.value || loadingPromise.value)
    return

  const payload: RendererUpdatePayload = {
    highlighter: highlighter.value,
    theme: theme.value,
    lang: lang.value,
    code: code.value,
    class: 'font-mono w-fit p-4 border border-gray:20 shadow-xl rounded of-hidden',
    options: {
      duration: duration.value,
      stagger: stagger.value,
    },
  }

  if (!renderer) {
    renderer = createRendererVue(rendererOptions)
    renderer.mount(rendererContainer.value, payload)
  }
  else {
    renderer.update(payload)
  }
}

const samplesCache = new Map<string, Promise<string>>()

async function fetchSample(id: string): Promise<string> {
  if (!samplesCache.has(id)) {
    samplesCache.set(id, fetch(`https://raw.githubusercontent.com/shikijs/textmate-grammars-themes/main/samples/${id}.sample`)
      .then(r => r.text())
      .catch((e) => {
        console.error(e)
        return `ERROR: ${e.message}`
      }))
  }
  return samplesCache.get(id)!
}

async function reset() {
  if (lang.value === 'vue')
    example.value = example.value === vueBefore ? vueAfter : vueBefore
  else
    example.value = await fetchSample(lang.value)
  input.value = example.value
  code.value = example.value
}

async function resetOptions() {
  Object.assign(options.value, defaultOptions)
  example.value = defaultOptions.code
  input.value = defaultOptions.code
}

function commit() {
  code.value = input.value
}

let timer: ReturnType<typeof setTimeout> | undefined

watchEffect(
  () => rendererUpdate(),
  { flush: 'post' },
)

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
  {
    flush: 'sync',
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
      <div class="of-hidden flex flex-col gap-4">
        <div class="flex-none flex flex-wrap gap-4 items-center mb--2px">
          <button class="border border-gray:20 rounded px3 py1" @click="reset">
            {{ lang === 'vue' ? 'Toggle Examples' : 'Reset Example' }}
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
        </div>
        <textarea
          v-model="input"
          class="font-mono w-full h-full flex-auto p-4 border border-gray:20 rounded bg-transparent"
          @keydown.meta.enter.prevent="commit"
        />
        <div class="flex-none flex flex-wrap gap-6 items-center">
          <label class="flex flex-col gap-1">
            <div class="flex items-center justify-between">
              Duration
              <span class="op50 text-sm">{{ duration }}ms</span>
            </div>
            <input
              v-model="duration"
              type="range" min="100" max="20000"
              class="w-50"
            >
          </label>
          <label class="flex flex-col gap-1">
            <div class="flex items-center justify-between">
              Stagger
              <span class="op50 text-sm">{{ stagger }}ms</span>
            </div>
            <input
              v-model="stagger"
              type="range" min="0" max="20"
              class="w-50"
            >
          </label>
          <label>
            <input
              v-model="useDebugStyles"
              type="checkbox"
            >
            Style for debugging
          </label>
          <div class="flex-auto" />
          <button class="border border-gray:20 rounded px3 py1" @click="resetOptions">
            Reset Options
          </button>
        </div>
      </div>
      <div class="of-auto flex flex-col gap-4" :class="useDebugStyles ? 'magic-move-debug-style' : ''">
        <div class="flex-none flex flex-wrap gap-4 items-center">
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
          Renderer:
          <select
            v-model="rendererType"
            class="border border-gray:20 rounded px2 py1 ml--2"
          >
            <option value="vue">
              Vue
            </option>
          </select>
          <div v-if="isAnimating" class="animate-pulse text-green">
            Animating...
          </div>
        </div>
        <div ref="rendererContainer" />
      </div>
    </div>
  </div>
</template>

<style>
.magic-move-debug-style .shiki-magic-move-move {
  background: #8883;
}
.magic-move-debug-style .shiki-magic-move-enter-active {
  background: rgba(92, 183, 47, 0.3);
}
.magic-move-debug-style .shiki-magic-move-leave-active {
  background: rgba(183, 47, 47, 0.533);
}
</style>
