/** @jsxImportSource solid-js */

import type { RendererFactory, RendererFactoryResult } from './types'
import { createSignal } from 'solid-js'
import { render } from 'solid-js/web'
import { ShikiMagicMove } from '../../../src/solid'

type ShikiMagicMoveProps = Parameters<typeof ShikiMagicMove>[0]

export const createRendererSolid: RendererFactory = (options): RendererFactoryResult => {
  const [props, setProps] = createSignal({
    onStart: options.onStart,
    onEnd: options.onEnd,
  } as ShikiMagicMoveProps)

  let dispose: (() => void) | undefined

  return {
    mount: (element, payload) => {
      setProps(props => ({ ...props, ...payload }))
      dispose = render(
        () => <ShikiMagicMove {...props()} />,
        element,
      )
    },

    update: (payload) => {
      setProps(props => ({ ...props, ...payload }))
    },
    dispose: () => {
      if (dispose) {
        dispose()
        dispose = undefined
      }
    },
  }
}
