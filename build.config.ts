import fs from 'node:fs/promises'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/vue',
    'src/react',
    'src/core',
    'src/types',
    'src/renderer',
    {
      builder: 'mkdist',
      outDir: 'dist',
      input: './src',
      pattern: ['**/*.css'],
    },
    {
      builder: 'mkdist',
      input: 'src/svelte',
      outDir: 'dist/svelte',
      format: 'esm',
      pattern: ['**/*'],
    },
  ],
  declaration: true,
  clean: true,
  rollup: {
    inlineDependencies: true,
  },
  hooks: {
    'mkdist:done': async () => {
      await fs.writeFile('dist/svelte.mjs', 'export * from "./svelte/index.mjs"\n', 'utf-8')
      await fs.writeFile('dist/svelte.d.ts', 'export * from "./svelte/index.mjs"\n', 'utf-8')
      await fs.writeFile('dist/svelte.d.mts', 'export * from "./svelte/index.mjs"\n', 'utf-8')
    },
  },
})
