import * as React from 'react'
import type { HighlighterCore } from 'shiki/core'
import { codeToKeyedTokens, createMagicMoveMachine } from '../core'
import type { KeyedTokensInfo, MagicMoveDifferOptions, MagicMoveRenderOptions } from '../types'
import { ShikiMagicMoveRenderer } from './ShikiMagicMoveRenderer'

export interface ShikiMagicMoveProps {
  highlighter: HighlighterCore
  lang: string
  theme: string
  code: string
  options?: MagicMoveRenderOptions & MagicMoveDifferOptions
  onStart?: () => void
  onEnd?: () => void
  className?: string
}

export function ShikiMagicMove(props: ShikiMagicMoveProps) {
  const codeToTokens = React.useRef<(code: string) => KeyedTokensInfo>()
  codeToTokens.current = code => codeToKeyedTokens(props.highlighter, code, {
    lang: props.lang,
    theme: props.theme,
  })

  const machine = React.useRef<ReturnType<typeof createMagicMoveMachine>>()
  machine.current = machine.current || createMagicMoveMachine(
    code => codeToTokens.current!(code),
  )

  const result = React.useMemo(
    () => {
      if (
        props.code === machine.current!.current.code
        && props.theme === machine.current!.current.themeName
        && props.lang === machine.current!.current.lang
      )
        return machine.current!

      return machine.current!.commit(props.code, props.options)
    },
    [props.code, props.options, props.theme, props.lang],
  )

  return (
    <ShikiMagicMoveRenderer
      tokens={result.current}
      options={props.options}
      previous={result.previous}
      onStart={props.onStart}
      onEnd={props.onEnd}
      className={props.className}
    />
  )
}
