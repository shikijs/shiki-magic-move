import { expect, it } from 'vitest'
import { getHighlighter } from 'shiki/bundle/web'
import type { KeyedTokensInfo } from '../src/core'
import { codeToKeyedTokens, syncTokenKeys } from '../src/core'

it('diff1', async () => {
  const code1 = `const a = 1`
  const code2 = `const a = ref(1 + 1)`
  const code3 = `const b = ref(2)`

  const theme = 'vitesse-light'
  const lang = 'js'
  const highlighter = await getHighlighter({
    themes: [theme],
    langs: [lang],
  })

  const tokens1 = codeToKeyedTokens(highlighter, code1, { lang, theme })
  const tokens2 = codeToKeyedTokens(highlighter, code2, { lang, theme })
  const tokens3 = codeToKeyedTokens(highlighter, code3, { lang, theme })

  normalizeKeys(tokens1, '1')
  normalizeKeys(tokens2, '2')
  normalizeKeys(tokens3, '3')

  const originKeys1 = tokens1.tokens.map(t => t.key)
  const originKeys2 = tokens2.tokens.map(t => t.key)
  const originKeys3 = tokens3.tokens.map(t => t.key)

  syncTokenKeys(tokens1, tokens2)
  syncTokenKeys(tokens2, tokens3)

  const syncedKeys1 = tokens1.tokens.map(t => t.key)
  const syncedKeys2 = tokens2.tokens.map(t => t.key)
  const syncedKeys3 = tokens3.tokens.map(t => t.key)

  expect(syncedKeys1).toEqual(originKeys1)
  expect(syncedKeys2).not.toEqual(originKeys2)
  expect(syncedKeys3).not.toEqual(originKeys3)

  expect(printDiff(tokens2, originKeys2)).toMatchInlineSnapshot(`
    "
    1-0                  const
            2-1           
    1-2                  a
            2-3           
    1-4                  =
            2-5           
            2-6          ref
            2-7          (
    1-6                  1
            2-9           
            2-10         +
            2-11          
            2-12         1
            2-13         )
            2-14         ⏎
    "
  `)

  expect(printDiff(tokens3, originKeys3)).toMatchInlineSnapshot(`
    "
    1-0                  const
            3-1           
            3-2          b
            3-3           
    1-4                  =
            3-5           
    2-6                  ref
    2-7                  (
            3-8          2
    2-13                 )
            3-10         ⏎
    "
  `)
})

it('diff2', async () => {
  const code1 = `
<template>
  <p class="">{{ greeting }}</p>
</template>
`.trim()
  const code2 = `
<template>
  <p class="a">{{ greeting }}</p>
</template>
`.trim()
  const code3 = code1

  const theme = 'vitesse-light'
  const lang = 'vue'
  const highlighter = await getHighlighter({
    themes: [theme],
    langs: [lang],
  })

  const tokens1 = codeToKeyedTokens(highlighter, code1, { lang, theme })
  const tokens2 = codeToKeyedTokens(highlighter, code2, { lang, theme })
  const tokens3 = codeToKeyedTokens(highlighter, code3, { lang, theme })

  normalizeKeys(tokens1, '1')
  normalizeKeys(tokens2, '2')
  normalizeKeys(tokens3, '3')

  const originKeys1 = tokens1.tokens.map(t => t.key)
  const originKeys2 = tokens2.tokens.map(t => t.key)
  const originKeys3 = tokens3.tokens.map(t => t.key)

  syncTokenKeys(tokens1, tokens2)
  syncTokenKeys(tokens2, tokens3)

  const syncedKeys1 = tokens1.tokens.map(t => t.key)
  const syncedKeys2 = tokens2.tokens.map(t => t.key)
  const syncedKeys3 = tokens3.tokens.map(t => t.key)

  expect(syncedKeys1).toEqual(originKeys1)
  expect(syncedKeys2).not.toEqual(originKeys2)
  expect(syncedKeys3).not.toEqual(originKeys3)

  expect(printDiff(tokens2, originKeys2)).toMatchInlineSnapshot(`
    "
    1-0                  <
    1-1                  template
    1-2                  >
            2-3          ⏎
            2-4            
    1-5                  <
    1-6                  p
            2-7           
    1-8                  class
    1-9                  =
            2-10         "
            2-11         a
            2-12         "
    1-11                 >{{
            2-14          
    1-13                 greeting
            2-16          
    1-15                 }}</
    1-16                 p
    1-17                 >
            2-20         ⏎
    1-19                 </
    1-20                 template
    1-21                 >
            2-24         ⏎
    "
  `)

  expect(printDiff(tokens3, originKeys3)).toMatchInlineSnapshot(`
    "
    1-0                  <
    1-1                  template
    1-2                  >
            3-3          ⏎
            3-4            
    1-5                  <
    1-6                  p
            3-7           
    1-8                  class
    1-9                  =
            3-10         ""
    1-11                 >{{
            3-12          
    1-13                 greeting
            3-14          
    1-15                 }}</
    1-16                 p
    1-17                 >
            3-18         ⏎
    1-19                 </
    1-20                 template
    1-21                 >
            3-22         ⏎
    "
  `)
})

function printDiff(info: KeyedTokensInfo, keys: string[]) {
  const text = info.tokens
    .map((t, i) => {
      if (t.key === keys[i])
        return `${`        ${t.key}`.padEnd(20, ' ')} ${t.content.replace(/\n/g, '⏎')}`
      return `${`${t.key}`.padEnd(20, ' ')} ${t.content.replace(/\n/g, '⏎')}`
    })
    .join('\n')
  return `\n${text}\n`
}

function normalizeKeys(info: KeyedTokensInfo, name: string) {
  info.tokens.forEach((t) => {
    t.key = t.key.replace(info.hash, name)
  })
}
