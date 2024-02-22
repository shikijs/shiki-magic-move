import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/vue',
    'src/core',
    {
      builder: 'mkdist',
      outDir: 'dist',
      input: './src',
      pattern: ['**/*.css'],
    },
  ],
  declaration: true,
  clean: true,
})
