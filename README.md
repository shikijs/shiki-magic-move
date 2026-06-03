# shiki-magic-move

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

> [!IMPORTANT]
> **`shiki-magic-move` has been renamed to [`@shikijs/magic-move`](https://www.npmjs.com/package/@shikijs/magic-move).**
>
> Starting with `v4.2.0`, this package is a thin re-export of `@shikijs/magic-move` and will receive no further development here — all future work happens in the [`shikijs/shiki`](https://github.com/shikijs/shiki/tree/main/packages/magic-move) monorepo.
>
> **Please migrate to `@shikijs/magic-move`:**
>
> ```bash
> npm uninstall shiki-magic-move
> npm install @shikijs/magic-move
> ```
>
> Then update every import path, e.g. `shiki-magic-move/vue` → `@shikijs/magic-move/vue`. The API surface is identical, so no other code changes are needed. See the [`@shikijs/magic-move` documentation](https://shiki.style/packages/magic-move) for the latest docs.

Smoothly animated code blocks with Shiki. [Online Demo](https://shiki-magic-move.netlify.app/).

Shiki Magic Move is a low-level library for animating code blocks, and uses [Shiki](https://shiki.style/) as the syntax highlighter. You usually want to use it with a high-level integration like [Slidev](https://sli.dev/guide/syntax#shiki-magic-move).

At the core of the package is a framework-agnostic core and renderer — there are also framework wrappers for Vue, React, Solid, and Svelte.

Each of the framework wrappers provides the following components:

- `ShikiMagicMove` - the main component to wrap the code block
- `ShikiMagicMovePrecompiled` - animations for compiled tokens, without the dependency on Shiki
- `ShikiMagicMoveRenderer` - the low-level renderer component

The `ShikiMagicMove` component requires you to provide a Shiki highlighter instance, and the styles are also required, and provided by the package. Whenever the `code` changes, the component will animate the changes.

## Installation

```bash
npm i @shikijs/magic-move shiki
```

> If you are still on `shiki-magic-move`, the same examples below work with the `shiki-magic-move/*` subpath imports — they just delegate to `@shikijs/magic-move/*` under the hood.

## Usage

### Vue

Import `@shikijs/magic-move/vue`, and pass the highlighter instance to the `ShikiMagicMove` component.

```vue
<script setup>
import { ShikiMagicMove } from '@shikijs/magic-move/vue'
import { createHighlighter } from 'shiki'
import { ref } from 'vue'

import '@shikijs/magic-move/style.css'

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

Import `@shikijs/magic-move/react`, and pass the highlighter instance to the `ShikiMagicMove` component.

```tsx
import type { HighlighterCore } from 'shiki'
import { ShikiMagicMove } from '@shikijs/magic-move/react'
import { useEffect, useState } from 'react'
import { createHighlighter } from 'shiki'

import '@shikijs/magic-move/style.css'

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

Import `@shikijs/magic-move/solid`, and pass the highlighter instance to the `ShikiMagicMove` component.

```tsx
import { ShikiMagicMove } from '@shikijs/magic-move/solid'
import { createHighlighter, } from 'shiki'
import { createResource, createSignal } from 'solid-js'

import '@shikijs/magic-move/style.css'

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

Import `@shikijs/magic-move/svelte`, and pass the highlighter instance to the `ShikiMagicMove` component.

```svelte
<script lang='ts'>
  import { ShikiMagicMove } from '@shikijs/magic-move/svelte'
  import { createHighlighter } from 'shiki'

  import '@shikijs/magic-move/style.css'

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
import { ShikiMagicMovePrecompiled } from '@shikijs/magic-move/vue'
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
import { codeToKeyedTokens, createMagicMoveMachine } from '@shikijs/magic-move/core'
import { createHighlighter } from 'shiki'

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
    <img src="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg" alt="Sponsors"/>
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
