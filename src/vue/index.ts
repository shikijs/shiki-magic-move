import type { App } from 'vue'
import ShikiMagicMove from './ShikiMagicMove.vue'

export * from './types'
export * from '../core'

export { ShikiMagicMove }

export function install(app: App<any>) {
  app.component('ShikiMagicMove', ShikiMagicMove)
}
