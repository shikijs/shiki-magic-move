import { diff_match_patch as DMP } from 'diff-match-patch'
import type { CodeToTokensOptions, HighlighterCore, ThemedToken, TokensResult } from 'shiki/core'

export type Range = [number, number]

export interface MatchedRanges {
  from: Range
  to: Range
  content: string
}

export function matchText(a: string, b: string) {
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

interface TokenizeResult {
  code: string
  result: TokensResult
  flatten: ThemedToken[]
}

export function getTokenizeResult(
  highlighter: HighlighterCore,
  code: string,
  options: CodeToTokensOptions,
): TokenizeResult {
  const result = highlighter.codeToTokens(code, options)
  let lastOffset = 0
  const flatten = result.tokens.flatMap((line): ThemedToken[] => {
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
  return { code, result, flatten }
}

export function tokenizeWithDiff(
  highlighter: HighlighterCore,
  codeFrom: string,
  codeTo: string,
  options: CodeToTokensOptions,
) {
  const matches = matchText(codeFrom, codeTo)
  const from = getTokenizeResult(highlighter, codeFrom, options)
  const to = getTokenizeResult(highlighter, codeTo, options)

  const tokensMap: [ThemedToken, ThemedToken][] = []

  matches.forEach((match) => {
    const rangeFrom = from.flatten.filter(t => t.offset >= match.from[0] && t.offset + t.content.length <= match.from[1] && !isWhitespace(t.content))
    const rangeTo = to.flatten.filter(t => t.offset >= match.to[0] && t.offset + t.content.length <= match.to[1] && !isWhitespace(t.content))

    if (rangeFrom.length === rangeTo.length) {
      rangeFrom.forEach((token, i) => {
        tokensMap.push([token, rangeTo[i]])
      })
    }
    else {
      console.warn('Mismatched tokens', rangeFrom, rangeTo)
    }
  })

  return {
    matches,
    from,
    to,
    tokensMap,
  }
}

function isWhitespace(c: string) {
  return c.match(/^\s*$/)
}
