import type { App } from 'vue'
import { ShikiMagicMove } from './components/ShikiMagicMove'

export * from './types'
export * from '../core'

export { ShikiMagicMove }
export { TokensRenderer } from './components/TokensRenderer'

export function install(app: App<any>) {
  app.component('ShikiMagicMove', ShikiMagicMove)
}
