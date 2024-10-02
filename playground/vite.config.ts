import { fileURLToPath } from 'node:url'
import { svelte as Svelte } from '@sveltejs/vite-plugin-svelte'
import Vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

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
  ],
})
