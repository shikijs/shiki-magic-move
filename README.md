# shiki-magic-move

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

Smoothly animated code blocks with Shiki. [Online Demo](https://shiki-magic-move.netlify.app/).

Shiki Magic Move is a low-level library for animating code blocks, and uses [Shiki](https://shiki.style/) as the syntax highlighter. You usually want to use it with a high-level integration like [Slidev](https://sli.dev/guide/syntax#shiki-magic-move).

At the core of the `shiki-magic-move` package is a framework-agnostic [core](./src/core.ts), and [renderer](./src/renderer.ts) — there are also framework wrappers for [Vue](./src/vue), [React](./src/react), and [Svelte](./src/svelte).

Each of the framework wrappers provides the following components:

- `ShikiMagicMove` - the main component to wrap the code block
- `ShikiMagicMovePrecompiled` - animations for compiled tokens, without the dependency on Shiki
- `ShikiMagicMoveRenderer` - the low-level renderer component

The `ShikiMagicMove` component requires you to provide a Shiki highlighter instance, and the styles are also required, and provided by `shiki-magic-move`. Whenever the `code` changes, the component will animate the changes.

## Installation

You're going to need Shiki Magic Move for animating the code blocks, and Shiki for syntax highlighting.

```bash
npm i shiki-magic-move shiki
```

## Usage

### Vue

Import `shiki-magic-move/vue`, and pass the highlighter instance to the `ShikiMagicMove` component.

```vue
<script setup>
import { createHighlighter } from 'shiki'
import { ShikiMagicMove } from 'shiki-magic-move/vue'
import { ref } from 'vue'

import 'shiki-magic-move/dist/style.css'

const highlighter = await createHighlighter({
  themes: ['nord'],
  langs: ['javascript', 'typescript'],
})

const code = ref(`const hello = 'world'`)

function animate() {
  code.value = `let hi = 'hello'`
}
</script>

<template>
  <ShikiMagicMove
    lang="ts"
    theme="nord"
    :highlighter="highlighter"
    :code="code"
    :options="{ duration: 800, stagger: 0.3, lineNumbers: true }"
  />
  <button @click="animate">
    Animate
  </button>
</template>
```

### React

Import `shiki-magic-move/react`, and pass the highlighter instance to the `ShikiMagicMove` component.

```tsx
import type { HighlighterCore } from 'shiki'
import { useEffect, useState } from 'react'
import { createHighlighter } from 'shiki'
import { ShikiMagicMove } from 'shiki-magic-move/react'

import 'shiki-magic-move/dist/style.css'

function App() {
  const [code, setCode] = useState(`const hello = 'world'`)
  const [highlighter, setHighlighter] = useState<HighlighterCore>()

  useEffect(() => {
    async function initializeHighlighter() {
      const highlighter = await createHighlighter({
        themes: ['nord'],
        langs: ['javascript', 'typescript'],
      })
      setHighlighter(highlighter)
    }
    initializeHighlighter()
  }, [])

  function animate() {
    setCode(`let hi = 'hello'`)
  }

  return (
    <div>
      {highlighter && (
        <>
          <ShikiMagicMove
            lang="ts"
            theme="nord"
            highlighter={highlighter}
            code={code}
            options={{ duration: 800, stagger: 0.3, lineNumbers: true }}
          />
          <button onClick={animate}>Animate</button>
        </>
      )}
    </div>
  )
}
```

### Solid

Import `shiki-magic-move/solid`, and pass the highlighter instance to the `ShikiMagicMove` component.

```tsx
import { createHighlighter, } from 'shiki'
import { ShikiMagicMove } from 'shiki-magic-move/solid'
import { createResource, createSignal } from 'solid-js'

import 'shiki-magic-move/dist/style.css'

function App() {
  const [code, setCode] = createSignal(`const hello = 'world'`)

  const [highlighter] = createResource(async () => {
    const newHighlighter = await createHighlighter({
      themes: Object.keys(bundledThemes),
      langs: Object.keys(bundledLanguages),
    })

    return newHighlighter
  })

  function animate() {
    setCode(`let hi = 'hello'`)
  }

  return (
    <div>
      <Show when={highlighter()}>
        {highlighter => (
          <>
            <ShikiMagicMove
              lang="ts"
              theme="nord"
              highlighter={highlighter()}
              code={code()}
              options={{ duration: 800, stagger: 0.3, lineNumbers: true }}
            />
            <button onClick={animate}>Animate</button>
          </>
        )}
      </Show>
    </div>
  )
}
```

### Svelte

Import `shiki-magic-move/svelte`, and pass the highlighter instance to the `ShikiMagicMove` component.

```svelte
<script lang='ts'>
  import { createHighlighter } from 'shiki'
  import { ShikiMagicMove } from 'shiki-magic-move/svelte'

  import 'shiki-magic-move/dist/style.css'

  const highlighter = createHighlighter({
    themes: ['nord'],
    langs: ['javascript', 'typescript'],
  })

  let code = $state(`const hello = 'world'`)

  function animate() {
    code = `let hi = 'hello'`
  }
</script>

{#await highlighter then highlighter}
  <ShikiMagicMove
    lang='ts'
    theme='nord'
    {highlighter}
    {code}
    options={{ duration: 800, stagger: 0.3, lineNumbers: true }}
  />
  <button onclick={animate}>Animate</button>
{/await}
```

### `ShikiMagicMovePrecompiled`

`ShikiMagicMovePrecompiled` is a lighter version of `ShikiMagicMove` that doesn't require Shiki. It's useful when you want to animate the compiled tokens directly. For example, in Vue:

```vue
<script setup>
import { ShikiMagicMovePrecompiled } from 'shiki-magic-move/vue'
import { ref } from 'vue'

const step = ref(1)
const compiledSteps = [/* Compiled token steps */]
</script>

<template>
  <ShikiMagicMovePrecompiled
    :steps="compiledSteps"
    :step="step"
  />
  <button @click="step++">
    Next
  </button>
</template>
```

To get the compiled tokens, you can run this somewhere else and serialize them into the component:

```ts
import { createHighlighter } from 'shiki'
import { codeToKeyedTokens, createMagicMoveMachine } from 'shiki-magic-move/core'

const shiki = await createHighlighter({
  theme: 'nord',
  langs: ['javascript', 'typescript'],
})

const codeSteps = [
  `const hello = 'world'`,
  `let hi = 'hello'`,
]

const machine = createMagicMoveMachine(
  code => codeToKeyedTokens(shiki, code, {
    lang: 'ts',
    theme: 'nord',
  }),
  {
    // options
  }
)

const compiledSteps = codeSteps.map(code => machine.commit(code).current)

// Pass `compiledSteps` to the precompiled component
// If you do this on server-side or build-time, you can serialize `compiledSteps` into JSON
```

## How it works

You can read [The Magic In Shiki Magic Move](https://antfu.me/posts/shiki-magic-move) to understand how Shiki Magic Move works.

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg'/>
  </a>
</p>

## License

[MIT](./LICENSE) License © 2023-PRESENT [Anthony Fu](https://github.com/antfu)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/shiki-magic-move?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/shiki-magic-move
[npm-downloads-src]: https://img.shields.io/npm/dm/shiki-magic-move?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/shiki-magic-move
[bundle-src]: https://img.shields.io/bundlephobia/minzip/shiki-magic-move?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=shiki-magic-move
[license-src]: https://img.shields.io/github/license/shikijs/shiki-magic-move.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/shikijs/shiki-magic-move/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/shiki-magic-move
