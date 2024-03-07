/* eslint-disable no-console */
import React from 'react'
import type { Root } from 'react-dom/client'
import ReactDOM from 'react-dom/client'
import { shallowReactive, watch } from 'vue'
import { ShikiMagicMove } from '../../../src/react'
import type { RendererFactory, RendererFactoryResult } from './types'

export const createRendererReact: RendererFactory = (options): RendererFactoryResult => {
  let app: Root | undefined

  const props = shallowReactive<any>({
    onStart: options.onStart,
    onEnd: options.onEnd,
  })

  function App() {
    // TODO: make React not render twice
    const [count, setCounter] = React.useState(0)

    React.useEffect(() => {
      watch(props, () => {
        // Force React to re-render
        setCounter(c => c + 1)
      })
    }, [])

    console.log('React rendering', count)

    // eslint-disable-next-line react/prop-types
    return <ShikiMagicMove {...props} className={props.class} />
  }

  return {
    mount: (element, payload) => {
      Object.assign(props, payload)
      app = ReactDOM.createRoot(element)
      app.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>,
      )

      console.log('React renderer mounted')
    },

    update: (payload) => {
      Object.assign(props, payload)
    },

    dispose: () => {
      app?.unmount()
      app = undefined
    },
  }
}
