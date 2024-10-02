/** @jsxImportSource solid-js */
/* eslint-disable no-console */
import { shallowReactive, watch } from 'vue'
import { createEffect, createSignal } from 'solid-js'
import { render } from 'solid-js/web'
import { ShikiMagicMove } from '../../../src/solid'
import type { RendererFactory, RendererFactoryResult } from './types'

export const createRendererSolid: RendererFactory = (options): RendererFactoryResult => {
  const props = shallowReactive<any>({
    onStart: options.onStart,
    onEnd: options.onEnd,
  })

  function App() {
    // TODO: make Solid not render twice
    const [count, setCounter] = createSignal(0)

    createEffect(() => {
      console.log('Solid effect')
      watch(props, () => {
        // Force Solid to re-render
        setCounter(c => c + 1)
      })
    })

    console.log('Solid rendering', count())

    return <ShikiMagicMove {...props} class={props.class} />
  }

  let dispose = () => {}

  return {
    mount: (element, payload) => {
      Object.assign(props, payload)
      dispose = render(
        () => <App />,
        element,
      )
    },

    update: (payload) => {
      Object.assign(props, payload)
    },
    dispose: () => {
      dispose?.()
    },
  }
}
