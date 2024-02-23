import { diff_match_patch as DMP } from 'diff-match-patch'
import type { HighlighterGeneric, ThemedToken, TokensResult } from 'shiki/core'
import { hash as getHash } from 'ohash'
import type { ArgumentsType } from 'vitest'

export type Range = [number, number]

export interface MatchedRanges {
  from: Range
  to: Range
  content: string
}

export interface KeyedToken extends ThemedToken {
  key: string
}

export interface KeyedTokensInfo extends Pick<TokensResult, 'bg' | 'fg' | 'rootStyle'> {
  code: string
  hash: string
  tokens: KeyedToken[]
}

export function codeToKeyedTokens<
  BundledLangKeys extends string,
  BundledThemeKeys extends string,
>(
  highlighter: HighlighterGeneric<BundledLangKeys, BundledThemeKeys>,
  code: string,
  options: ArgumentsType<HighlighterGeneric<BundledLangKeys, BundledThemeKeys>['codeToTokens']>[1],
): KeyedTokensInfo {
  const result = highlighter.codeToTokens(code, options)
  return {
    ...toKeyedTokens(
      code,
      result.tokens,
    ),
    bg: result.bg,
    fg: result.fg,
    rootStyle: result.rootStyle,
  }
}

export function toKeyedTokens(
  code: string,
  tokens: ThemedToken[][],
): KeyedTokensInfo {
  const hash = getHash(code)
  let lastOffset = 0
  return {
    code,
    hash,
    tokens: splitWhitespaceTokens(tokens)
      .flatMap((line): ThemedToken[] => {
        const lastEl = line[line.length - 1]
        if (!lastEl)
          lastOffset += 1
        else
          lastOffset = lastEl.offset + lastEl.content.length
        return [
          ...line,
          {
            content: '\n',
            offset: lastOffset,
          },
        ]
      })
      .map((token, idx) => {
        const t = token as KeyedToken
        t.key = `${hash}-${idx}`
        return t
      }),
  }
}

function splitWhitespaceTokens(tokens: ThemedToken[][]) {
  return tokens.map((line) => {
    return line.flatMap((token) => {
      if (token.content.match(/^\s+$/))
        return token
      const match = token.content.match(/^(\s*)(.*?)(\s*)$/)
      if (!match)
        return token
      const [, leading, content, trailing] = match
      if (!leading && !trailing)
        return token

      const expanded = [{
        ...token,
        offset: token.offset + leading.length,
        content,
      }]
      if (leading) {
        expanded.unshift({
          content: leading,
          offset: token.offset,
        })
      }
      if (trailing) {
        expanded.push({
          content: trailing,
          offset: token.offset + leading.length + content.length,
        })
      }
      return expanded
    })
  })
}

/**
 * Run diff on two sets of tokens,
 * and sync the keys from the first set to the second set if those tokens are matched
 */
export function syncTokenKeys(
  from: KeyedTokensInfo,
  to: KeyedTokensInfo,
) {
  // Run the diff and generate matches parts
  // In the matched parts, we override the keys with the same key so that the transition group can know they are the same element
  const matches = findTextMatches(from.code, to.code)
  matches.forEach((match) => {
    const tokensF = from.tokens.filter(t => t.offset >= match.from[0] && t.offset + t.content.length <= match.from[1] && !isWhitespace(t.content))
    const tokensT = to.tokens.filter(t => t.offset >= match.to[0] && t.offset + t.content.length <= match.to[1] && !isWhitespace(t.content))

    let idxF = 0
    let idxT = 0
    while (idxF < tokensF.length && idxT < tokensT.length) {
      if (!tokensF[idxF] || !tokensT[idxT])
        break
      if (tokensF[idxF].content === tokensT[idxT].content) {
        tokensT[idxT].key = tokensF[idxF].key
        idxF++
        idxT++
      }
      else if (tokensF[idxF + 1]?.content === tokensT[idxT].content) {
        // console.log('Token missing match', tokensF[idxF], undefined)
        idxF++
      }
      else if (tokensF[idxF].content === tokensT[idxT + 1]?.content) {
        // console.log('Token missing match', undefined, tokensT[idxT])
        idxT++
      }
      else {
        // console.log('Token missing match', tokensF[idxF], tokensT[idxT])
        idxF++
        idxT++
      }
    }
  })

  return to
}

/**
 * Find ranges of text matches between two strings
 * It uses `diff-match-patch` under the hood
 */
export function findTextMatches(a: string, b: string) {
  const differ = new DMP()
  const delta = differ.diff_main(a, b)

  let aContent = ''
  let bContent = ''

  const matched: MatchedRanges[] = []

  for (const [op, text] of delta) {
    if (op === 0) {
      matched.push({
        from: [aContent.length, aContent.length + text.length],
        to: [bContent.length, bContent.length + text.length],
        content: text,
      })
      aContent += text
      bContent += text
    }
    else if (op === -1) {
      aContent += text
    }
    else if (op === 1) {
      bContent += text
    }
  }

  if (aContent !== a || bContent !== b)
    throw new Error('Content mismatch')

  return matched
}

function isWhitespace(c: string) {
  return c.match(/^\s*$/)
}
