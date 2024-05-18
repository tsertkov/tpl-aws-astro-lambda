import js from '@eslint/js'
import globals from 'globals'

export default [
  js.configs.recommended,
  {
    rules: {
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
    },
    languageOptions: {
      globals: globals.node,
    },
  },
]
