import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  jsxA11y.flatConfigs.recommended,
  {
    plugins: { 'react-hooks': reactHooksPlugin },
    settings: {
      react: { version: '19.0' },
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
    },
  },
  { ignores: ['dist/', 'website/build/', 'examples/*/dist/', 'demo/dist/'] },
)
