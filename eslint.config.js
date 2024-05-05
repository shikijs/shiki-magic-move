// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu()
  .overrideRules({
    // Not compatible with ESLint 9 yet
    'react-hooks/exhaustive-deps': 'off',
  })
