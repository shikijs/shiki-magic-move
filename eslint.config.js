// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu({
  svelte: true,
})
  .append({
    files: ['**/*.svelte'],
    rules: {
      'no-use-before-define': 'off',
    },
  })
  .overrideRules({
    // Not compatible with ESLint 9 yet
    'react-hooks/exhaustive-deps': 'off',
  })
