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
      globals: {
        ...globals.node,
        describe: 'readonly',
        context: 'readonly',
        beforeEach: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        assert: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        Cypress: 'readonly',
        cy: 'readonly',
      },
    },
  },
]
