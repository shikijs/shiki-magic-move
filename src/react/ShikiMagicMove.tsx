import * as React from 'react'
import type { HighlighterCore } from 'shiki/core'
import { codeToKeyedTokens, createMagicMoveMachine } from '../core'
import type { MagicMoveDifferOptions, MagicMoveRenderOptions } from '../types'
import { ShikiMagicMoveRenderer } from './ShikiMagicMoveRenderer'
import { createCSSPropertiesFromString } from './utils'

export function ShikiMagicMove(
  {
    highlighter,
    lang,
    theme,
    code,
    options,
    onStart,
    onEnd,
    className,
  }: {
    highlighter: HighlighterCore
    lang: string
    theme: string
    code: string
    options?: MagicMoveRenderOptions & MagicMoveDifferOptions
    onStart?: () => void
    onEnd?: () => void
    className?: string
  },
) {
  const machine = React.useMemo(
    () => createMagicMoveMachine(
      code => codeToKeyedTokens(highlighter, code, {
        lang,
        theme,
      }),
      options,
    ),
    // FIXME: we should not create new machines
    // Try to correct the dependency array if something goes wrong.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const result = React.useMemo(() => machine.commit(code), [code, machine])

  return (
    <ShikiMagicMoveRenderer
      tokens={result.current}
      options={options}
      previous={result.previous}
      onStart={onStart}
      onEnd={onEnd}
      className={className}
      style={{
        ...createCSSPropertiesFromString(result.current.rootStyle),
        color: result.current.fg,
        backgroundColor: result.current.bg,
      }}
    />
  )
}
