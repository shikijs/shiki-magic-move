import type { App } from 'vue'
import { createApp, h, reactive, shallowReactive } from 'vue'
import { ShikiMagicMove } from '../../../src/vue'
import type { RendererFactory, RendererFactoryResult } from './types'

export const createRendererVue: RendererFactory = (options): RendererFactoryResult => {
  let app: App | undefined

  const props = shallowReactive({
    onStart: options.onStart,
    onEnd: options.onEnd,
  })

  return {
    mount: (element, payload) => {
      Object.assign(props, payload)
      if (app)
        return
      app = createApp({
        render: () => h(ShikiMagicMove, props as any),
      })
      app.mount(element)
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
