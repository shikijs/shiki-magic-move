import * as React from 'react'
import type { KeyedTokensInfo, MagicMoveDifferOptions, MagicMoveRenderOptions } from '../types'
import { syncTokenKeys, toKeyedTokens } from '../core'
import { ShikiMagicMoveRenderer } from './ShikiMagicMoveRenderer'
import { createCSSPropertiesFromString } from './utils'

/**
 * Component to render a compiled magic move step,
 * Where the tokens can be generated on build time.
 */
export function ShikiMagicMovePrecompiled(
  {
    steps,
    step = 0,
    animate = true,
    options,
    onStart,
    onEnd,
  }: {
    steps: KeyedTokensInfo[]
    step?: number
    animate?: boolean
    options?: MagicMoveRenderOptions & MagicMoveDifferOptions
    onStart?: () => void
    onEnd?: () => void
  },
) {
  const EMPTY = toKeyedTokens('', [])

  const [previous, setPrevious] = React.useState(EMPTY)
  const result = React.useMemo(() => {
    const res = syncTokenKeys(
      previous,
      steps[Math.min(step, steps.length - 1)],
      options,
    )
    setPrevious(res.to)
    return res
  }, [previous, steps, step, options])

  return (
    <ShikiMagicMoveRenderer
      tokens={result.to}
      previous={result.from}
      options={options}
      animate={animate}
      onStart={onStart}
      onEnd={onEnd}
      style={{
        ...createCSSPropertiesFromString(result.to.rootStyle),
        color: result.to.fg,
        backgroundColor: result.to.bg,
      }}
    />
  )
}
