import type { ShikiMagicMove } from '../../../src/lit/ShikiMagicMove'
import type { RendererFactory, RendererFactoryResult, RendererUpdatePayload } from './types'

import '../../../src/lit/ShikiMagicMove'

declare global {
  interface HTMLElementTagNameMap {
    'shiki-magic-move': ShikiMagicMove
  }
}

export const createRendererLit: RendererFactory = (options): RendererFactoryResult => {
  let app: ShikiMagicMove | undefined

  return {
    mount: (element, payload) => {
      app = document.createElement('shiki-magic-move')

      app.addEventListener('onStart', options.onStart ?? (() => {}))
      app.addEventListener('onEnd', options.onEnd ?? (() => {}))

      Object.keys(payload).forEach((prop) => {
        // eslint-disable-next-line ts/ban-ts-comment
        // @ts-ignore
        app[prop as keyof RendererUpdatePayload] = payload[prop as keyof RendererUpdatePayload]
      })

      element.appendChild(app)

      // eslint-disable-next-line no-console
      console.log('Lit renderer mounted')
    },

    update: (payload) => {
      Object.keys(payload).forEach((prop) => {
        // eslint-disable-next-line ts/ban-ts-comment
        // @ts-ignore
        app[prop as keyof RendererUpdatePayload] = payload[prop as keyof RendererUpdatePayload]
      })
    },

    dispose: () => {
      if (!app)
        return
      app.remove()
      app = undefined

      // eslint-disable-next-line no-console
      console.log('Lit renderer disposed')
    },
  }
}
