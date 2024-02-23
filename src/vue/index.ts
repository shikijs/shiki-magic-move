import type { App } from 'vue'
import { ShikiMagicMove } from './components/ShikiMagicMove'

export * from './types'

export { ShikiMagicMove }
export { ShikiMagicMoveCompiled } from './components/ShikiMagicMoveCompiled'
export { TokensRenderer } from './components/TokensRenderer'

export function install(app: App<any>) {
  app.component('ShikiMagicMove', ShikiMagicMove)
}
