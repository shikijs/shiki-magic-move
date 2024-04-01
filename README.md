# shiki-magic-move

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

Smoothly animated code blocks with Shiki. [Online Demo](https://shiki-magic-move.netlify.app/).

## Usage

This is a rather low-level library, you usually want to use it with a high-level integrations like [Slidev](https://sli.dev/guide/syntax#shiki-magic-move).

The package provides framework-agnostic [core](./src/core.ts) and [renderer](./src/renderer.ts) and framework wrappers for [Vue](./src/vue) and [React](./src/react).

Each of the framework wrappers provides the following components:

- `ShikiMagicMove` - the main component to wrap the code block
- `ShikiMagicMovePrecompiled` - animations for compiled tokens, without the dependency on Shiki
- `ShikiMagicMoveRenderer` - the low-level renderer component

### `ShikiMagicMove`

`ShikiMagicMove` requires you to provide a Shiki highlighter instance. For example, in Vue:

```vue
<script setup>
import { ShikiMagicMove } from 'shiki-magic-move/vue'
import { getHighlighter } from 'shiki'
import { ref } from 'vue'

const highlighter = await getHighlighter({
  theme: 'nord',
  langs: ['javascript', 'typescript'],
})

const code = ref(`const hello = 'world'`)

function animate() {
  code.value = `let hi = 'hello'`
}
</script>

<template>
  <ShikiMagicMove :highlighter="highlighter" lang="ts" :code="code" />
  <button @click="animate">
    Animate
  </button>
</template>
```

Whenever the `code` changes, the component will animate the changes.

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
import { codeToKeyedTokens, createMagicMoveMachine } from 'shiki-magic-move/core'
import { getHighlighter } from 'shiki'

const shiki = await getHighlighter({
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

Check [this blog post](https://antfu.me/posts/shiki-magic-move).

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
