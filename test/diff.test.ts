import { expect, it } from 'vitest'
import { getHighlighter } from 'shiki/bundle/web'
import { diffTokens, flattenTokens } from '../src/core'

it('exported', async () => {
  const before = `
<script>
export default {
  data() {
    return {
      greeting: 'Hello World!'
    }
  }
}
</script>

<template>
  <p class="greeting">{{ greeting }}</p>
</template>

<style>
.greeting {
  color: red;
  font-weight: bold;
}
</style>`

  const after = `
<script setup>
import { ref } from 'vue'
const greeting = ref('Hello World!')
</script>

<template>
  <p class="greeting">{{ greeting }}</p>
</template>

<style>
.greeting {
  color: red;
  font-weight: bold;
}
</style>`

  const highlighter = await getHighlighter({
    themes: ['vitesse-light'],
    langs: ['vue'],
  })

  const from = flattenTokens(
    before,
    highlighter.codeToTokens(before, {
      lang: 'vue',
      theme: 'vitesse-light',
    }).tokens,
  )

  const to = flattenTokens(
    after,
    highlighter.codeToTokens(after, {
      lang: 'vue',
      theme: 'vitesse-light',
    }).tokens,
  )

  expect(diffTokens(from, to).tokensMap.slice(0, 10)).toMatchInlineSnapshot(`
    [
      [
        {
          "color": "#999999",
          "content": "<",
          "fontStyle": 0,
          "offset": 1,
        },
        {
          "color": "#999999",
          "content": "<",
          "fontStyle": 0,
          "offset": 1,
        },
      ],
      [
        {
          "color": "#1E754F",
          "content": "script",
          "fontStyle": 0,
          "offset": 2,
        },
        {
          "color": "#1E754F",
          "content": "script",
          "fontStyle": 0,
          "offset": 2,
        },
      ],
      [
        {
          "color": "#999999",
          "content": ">",
          "fontStyle": 0,
          "offset": 8,
        },
        {
          "color": "#999999",
          "content": ">",
          "fontStyle": 0,
          "offset": 14,
        },
      ],
      [
        {
          "color": "#998418",
          "content": "greeting",
          "fontStyle": 0,
          "offset": 57,
        },
        {
          "color": "#B07D48",
          "content": "greeting",
          "fontStyle": 0,
          "offset": 48,
        },
      ],
      [
        {
          "color": "#B5695999",
          "content": "'",
          "fontStyle": 0,
          "offset": 67,
        },
        {
          "color": "#B5695999",
          "content": "'",
          "fontStyle": 0,
          "offset": 63,
        },
      ],
      [
        {
          "color": "#B56959",
          "content": "Hello World!",
          "fontStyle": 0,
          "offset": 68,
        },
        {
          "color": "#B56959",
          "content": "Hello World!",
          "fontStyle": 0,
          "offset": 64,
        },
      ],
      [
        {
          "color": "#B5695999",
          "content": "'",
          "fontStyle": 0,
          "offset": 80,
        },
        {
          "color": "#B5695999",
          "content": "'",
          "fontStyle": 0,
          "offset": 76,
        },
      ],
      [
        {
          "color": "#999999",
          "content": "</",
          "fontStyle": 0,
          "offset": 94,
        },
        {
          "color": "#999999",
          "content": "</",
          "fontStyle": 0,
          "offset": 79,
        },
      ],
      [
        {
          "color": "#1E754F",
          "content": "script",
          "fontStyle": 0,
          "offset": 96,
        },
        {
          "color": "#1E754F",
          "content": "script",
          "fontStyle": 0,
          "offset": 81,
        },
      ],
      [
        {
          "color": "#999999",
          "content": ">",
          "fontStyle": 0,
          "offset": 102,
        },
        {
          "color": "#999999",
          "content": ">",
          "fontStyle": 0,
          "offset": 87,
        },
      ],
    ]
  `)
})
