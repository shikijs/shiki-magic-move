import fs from 'node:fs/promises'
import path from 'node:path'
import { defineBuildConfig } from 'unbuild'

// Since 4.2.0, `shiki-magic-move` is a thin redirect to `@shikijs/magic-move`.
// Every source file is a one-line `export * from '@shikijs/magic-move/<sub>'`,
// so we use a single `mkdist` builder which transforms files 1:1 (no
// rollup-bundling, no babel) — keeping the emitted `.mjs` and `.d.ts`
// declarations as small and isolated as the sources.
export default defineBuildConfig({
  entries: [
    {
      builder: 'mkdist',
      input: './src',
      outDir: 'dist',
    },
  ],
  declaration: true,
  clean: true,
  externals: ['@shikijs/magic-move'],
  hooks: {
    // `mkdist` only emits `.d.ts`, but the package's `typesVersions` map and
    // upstream `@shikijs/magic-move` both expose `.d.mts`. Mirror every
    // `.d.ts` to a `.d.mts` so both module resolution modes resolve types.
    'mkdist:done': async () => {
      const distDir = 'dist'
      for (const entry of await fs.readdir(distDir)) {
        if (!entry.endsWith('.d.ts'))
          continue
        const src = path.join(distDir, entry)
        const dst = path.join(distDir, `${entry.slice(0, -'.d.ts'.length)}.d.mts`)
        await fs.copyFile(src, dst)
      }
    },
  },
})
