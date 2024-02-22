import { diff_match_patch as DMP } from 'diff-match-patch'
import type { ThemedToken } from 'shiki/core'

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

export interface FlattenTokensCode {
  code: string
  tokens: ThemedToken[][]
  flatten: ThemedToken[]
}

export function flattenTokens(
  code: string,
  tokens: ThemedToken[][],
): FlattenTokensCode {
  let lastOffset = 0
  const flatten = tokens.flatMap((line): ThemedToken[] => {
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
  return { code, tokens, flatten }
}

export interface DiffTokenOptions {
  fromCode: string
  fromTokens: ThemedToken[][]
  toCode: string
  toTokens: ThemedToken[][]
}

export function diffTokens(
  from: FlattenTokensCode,
  to: FlattenTokensCode,
) {
  const matches = matchText(from.code, to.code)

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
