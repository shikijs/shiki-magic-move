import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { svelte as Svelte } from '@sveltejs/vite-plugin-svelte'
import Solid from 'vite-plugin-solid'

export default defineConfig({
  resolve: {
    alias: {
      'shiki-magic-move/core': fileURLToPath(new URL('../src/core.ts', import.meta.url)),
      'shiki-magic-move/renderer': fileURLToPath(new URL('../src/renderer.ts', import.meta.url)),
    },
  },
  plugins: [
    Vue(),
    UnoCSS(),
    Svelte(),
    Solid({ include: ['*/solid/*.tsx', 'solid.tsx'] }),
    // React({ exclude: 'solid/solid.tsx' }),
  ],
})
