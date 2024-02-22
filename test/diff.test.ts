import { expect, it } from 'vitest'
import { getHighlighter } from 'shiki/bundle/web'
import { diffTokens } from '../src/core'

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

  expect(diffTokens(
    highlighter,
    before,
    after,
    {
      theme: 'vitesse-light',
      lang: 'vue',
    },
  ).tokenMap).toMatchInlineSnapshot(`
    Map {
      {
        "color": "#999999",
        "content": "<",
        "fontStyle": 0,
        "offset": 1,
      } => {
        "color": "#999999",
        "content": "<",
        "fontStyle": 0,
        "offset": 1,
      },
      {
        "color": "#1E754F",
        "content": "script",
        "fontStyle": 0,
        "offset": 2,
      } => {
        "color": "#1E754F",
        "content": "script",
        "fontStyle": 0,
        "offset": 2,
      },
      {
        "color": "#393A34",
        "content": " ",
        "fontStyle": 0,
        "offset": 66,
      } => {
        "color": "#393A34",
        "content": " ",
        "fontStyle": 0,
        "offset": 56,
      },
      {
        "color": "#B5695999",
        "content": "'",
        "fontStyle": 0,
        "offset": 67,
      } => {
        "color": "#B5695999",
        "content": "'",
        "fontStyle": 0,
        "offset": 63,
      },
      {
        "color": "#B56959",
        "content": "Hello World!",
        "fontStyle": 0,
        "offset": 68,
      } => {
        "color": "#B56959",
        "content": "Hello World!",
        "fontStyle": 0,
        "offset": 64,
      },
      {
        "color": "#B5695999",
        "content": "'",
        "fontStyle": 0,
        "offset": 80,
      } => {
        "color": "#B5695999",
        "content": "'",
        "fontStyle": 0,
        "offset": 76,
      },
      {
        "color": "#999999",
        "content": "</",
        "fontStyle": 0,
        "offset": 94,
      } => {
        "color": "#999999",
        "content": "</",
        "fontStyle": 0,
        "offset": 79,
      },
      {
        "color": "#1E754F",
        "content": "script",
        "fontStyle": 0,
        "offset": 96,
      } => {
        "color": "#1E754F",
        "content": "script",
        "fontStyle": 0,
        "offset": 81,
      },
      {
        "color": "#999999",
        "content": ">",
        "fontStyle": 0,
        "offset": 102,
      } => {
        "color": "#999999",
        "content": ">",
        "fontStyle": 0,
        "offset": 87,
      },
      {
        "color": "#999999",
        "content": "<",
        "fontStyle": 0,
        "offset": 105,
      } => {
        "color": "#999999",
        "content": "<",
        "fontStyle": 0,
        "offset": 90,
      },
      {
        "color": "#1E754F",
        "content": "template",
        "fontStyle": 0,
        "offset": 106,
      } => {
        "color": "#1E754F",
        "content": "template",
        "fontStyle": 0,
        "offset": 91,
      },
      {
        "color": "#999999",
        "content": ">",
        "fontStyle": 0,
        "offset": 114,
      } => {
        "color": "#999999",
        "content": ">",
        "fontStyle": 0,
        "offset": 99,
      },
      {
        "color": "#393A34",
        "content": "  ",
        "fontStyle": 0,
        "offset": 116,
      } => {
        "color": "#393A34",
        "content": "  ",
        "fontStyle": 0,
        "offset": 101,
      },
      {
        "color": "#999999",
        "content": "<",
        "fontStyle": 0,
        "offset": 118,
      } => {
        "color": "#999999",
        "content": "<",
        "fontStyle": 0,
        "offset": 103,
      },
      {
        "color": "#1E754F",
        "content": "p",
        "fontStyle": 0,
        "offset": 119,
      } => {
        "color": "#1E754F",
        "content": "p",
        "fontStyle": 0,
        "offset": 104,
      },
      {
        "color": "#393A34",
        "content": " ",
        "fontStyle": 0,
        "offset": 120,
      } => {
        "color": "#393A34",
        "content": " ",
        "fontStyle": 0,
        "offset": 105,
      },
      {
        "color": "#B07D48",
        "content": "class",
        "fontStyle": 0,
        "offset": 121,
      } => {
        "color": "#B07D48",
        "content": "class",
        "fontStyle": 0,
        "offset": 106,
      },
      {
        "color": "#999999",
        "content": "=",
        "fontStyle": 0,
        "offset": 126,
      } => {
        "color": "#999999",
        "content": "=",
        "fontStyle": 0,
        "offset": 111,
      },
      {
        "color": "#B5695999",
        "content": """,
        "fontStyle": 0,
        "offset": 127,
      } => {
        "color": "#B5695999",
        "content": """,
        "fontStyle": 0,
        "offset": 112,
      },
      {
        "color": "#B56959",
        "content": "greeting",
        "fontStyle": 0,
        "offset": 128,
      } => {
        "color": "#B56959",
        "content": "greeting",
        "fontStyle": 0,
        "offset": 113,
      },
      {
        "color": "#B5695999",
        "content": """,
        "fontStyle": 0,
        "offset": 136,
      } => {
        "color": "#B5695999",
        "content": """,
        "fontStyle": 0,
        "offset": 121,
      },
      {
        "color": "#999999",
        "content": ">{{",
        "fontStyle": 0,
        "offset": 137,
      } => {
        "color": "#999999",
        "content": ">{{",
        "fontStyle": 0,
        "offset": 122,
      },
      {
        "color": "#393A34",
        "content": " ",
        "fontStyle": 0,
        "offset": 140,
      } => {
        "color": "#393A34",
        "content": " ",
        "fontStyle": 0,
        "offset": 125,
      },
      {
        "color": "#B07D48",
        "content": "greeting",
        "fontStyle": 0,
        "offset": 141,
      } => {
        "color": "#B07D48",
        "content": "greeting",
        "fontStyle": 0,
        "offset": 126,
      },
      {
        "color": "#393A34",
        "content": " ",
        "fontStyle": 0,
        "offset": 149,
      } => {
        "color": "#393A34",
        "content": " ",
        "fontStyle": 0,
        "offset": 134,
      },
      {
        "color": "#999999",
        "content": "}}</",
        "fontStyle": 0,
        "offset": 150,
      } => {
        "color": "#999999",
        "content": "}}</",
        "fontStyle": 0,
        "offset": 135,
      },
      {
        "color": "#1E754F",
        "content": "p",
        "fontStyle": 0,
        "offset": 154,
      } => {
        "color": "#1E754F",
        "content": "p",
        "fontStyle": 0,
        "offset": 139,
      },
      {
        "color": "#999999",
        "content": ">",
        "fontStyle": 0,
        "offset": 155,
      } => {
        "color": "#999999",
        "content": ">",
        "fontStyle": 0,
        "offset": 140,
      },
      {
        "color": "#999999",
        "content": "</",
        "fontStyle": 0,
        "offset": 157,
      } => {
        "color": "#999999",
        "content": "</",
        "fontStyle": 0,
        "offset": 142,
      },
      {
        "color": "#1E754F",
        "content": "template",
        "fontStyle": 0,
        "offset": 159,
      } => {
        "color": "#1E754F",
        "content": "template",
        "fontStyle": 0,
        "offset": 144,
      },
      {
        "color": "#999999",
        "content": ">",
        "fontStyle": 0,
        "offset": 167,
      } => {
        "color": "#999999",
        "content": ">",
        "fontStyle": 0,
        "offset": 152,
      },
      {
        "color": "#999999",
        "content": "<",
        "fontStyle": 0,
        "offset": 170,
      } => {
        "color": "#999999",
        "content": "<",
        "fontStyle": 0,
        "offset": 155,
      },
      {
        "color": "#1E754F",
        "content": "style",
        "fontStyle": 0,
        "offset": 171,
      } => {
        "color": "#1E754F",
        "content": "style",
        "fontStyle": 0,
        "offset": 156,
      },
      {
        "color": "#999999",
        "content": ">",
        "fontStyle": 0,
        "offset": 176,
      } => {
        "color": "#999999",
        "content": ">",
        "fontStyle": 0,
        "offset": 161,
      },
      {
        "color": "#999999",
        "content": ".",
        "fontStyle": 0,
        "offset": 178,
      } => {
        "color": "#999999",
        "content": ".",
        "fontStyle": 0,
        "offset": 163,
      },
      {
        "color": "#B07D48",
        "content": "greeting",
        "fontStyle": 0,
        "offset": 179,
      } => {
        "color": "#B07D48",
        "content": "greeting",
        "fontStyle": 0,
        "offset": 164,
      },
      {
        "color": "#393A34",
        "content": " ",
        "fontStyle": 0,
        "offset": 187,
      } => {
        "color": "#393A34",
        "content": " ",
        "fontStyle": 0,
        "offset": 172,
      },
      {
        "color": "#999999",
        "content": "{",
        "fontStyle": 0,
        "offset": 188,
      } => {
        "color": "#999999",
        "content": "{",
        "fontStyle": 0,
        "offset": 173,
      },
      {
        "color": "#393A34",
        "content": "  ",
        "fontStyle": 0,
        "offset": 190,
      } => {
        "color": "#393A34",
        "content": "  ",
        "fontStyle": 0,
        "offset": 175,
      },
      {
        "color": "#998418",
        "content": "color",
        "fontStyle": 0,
        "offset": 192,
      } => {
        "color": "#998418",
        "content": "color",
        "fontStyle": 0,
        "offset": 177,
      },
      {
        "color": "#999999",
        "content": ":",
        "fontStyle": 0,
        "offset": 197,
      } => {
        "color": "#999999",
        "content": ":",
        "fontStyle": 0,
        "offset": 182,
      },
      {
        "color": "#393A34",
        "content": " ",
        "fontStyle": 0,
        "offset": 198,
      } => {
        "color": "#393A34",
        "content": " ",
        "fontStyle": 0,
        "offset": 183,
      },
      {
        "color": "#A65E2B",
        "content": "red",
        "fontStyle": 0,
        "offset": 199,
      } => {
        "color": "#A65E2B",
        "content": "red",
        "fontStyle": 0,
        "offset": 184,
      },
      {
        "color": "#999999",
        "content": ";",
        "fontStyle": 0,
        "offset": 202,
      } => {
        "color": "#999999",
        "content": ";",
        "fontStyle": 0,
        "offset": 187,
      },
      {
        "color": "#393A34",
        "content": "  ",
        "fontStyle": 0,
        "offset": 204,
      } => {
        "color": "#393A34",
        "content": "  ",
        "fontStyle": 0,
        "offset": 189,
      },
      {
        "color": "#998418",
        "content": "font-weight",
        "fontStyle": 0,
        "offset": 206,
      } => {
        "color": "#998418",
        "content": "font-weight",
        "fontStyle": 0,
        "offset": 191,
      },
      {
        "color": "#999999",
        "content": ":",
        "fontStyle": 0,
        "offset": 217,
      } => {
        "color": "#999999",
        "content": ":",
        "fontStyle": 0,
        "offset": 202,
      },
      {
        "color": "#393A34",
        "content": " ",
        "fontStyle": 0,
        "offset": 218,
      } => {
        "color": "#393A34",
        "content": " ",
        "fontStyle": 0,
        "offset": 203,
      },
      {
        "color": "#A65E2B",
        "content": "bold",
        "fontStyle": 0,
        "offset": 219,
      } => {
        "color": "#A65E2B",
        "content": "bold",
        "fontStyle": 0,
        "offset": 204,
      },
      {
        "color": "#999999",
        "content": ";",
        "fontStyle": 0,
        "offset": 223,
      } => {
        "color": "#999999",
        "content": ";",
        "fontStyle": 0,
        "offset": 208,
      },
      {
        "color": "#999999",
        "content": "}",
        "fontStyle": 0,
        "offset": 225,
      } => {
        "color": "#999999",
        "content": "}",
        "fontStyle": 0,
        "offset": 210,
      },
      {
        "color": "#999999",
        "content": "</",
        "fontStyle": 0,
        "offset": 227,
      } => {
        "color": "#999999",
        "content": "</",
        "fontStyle": 0,
        "offset": 212,
      },
      {
        "color": "#1E754F",
        "content": "style",
        "fontStyle": 0,
        "offset": 229,
      } => {
        "color": "#1E754F",
        "content": "style",
        "fontStyle": 0,
        "offset": 214,
      },
      {
        "color": "#999999",
        "content": ">",
        "fontStyle": 0,
        "offset": 234,
      } => {
        "color": "#999999",
        "content": ">",
        "fontStyle": 0,
        "offset": 219,
      },
    }
  `)
})
