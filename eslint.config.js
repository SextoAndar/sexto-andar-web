import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', {
        varsIgnorePattern: '^[A-Z_]',
        argsIgnorePattern: '^_|^[A-Z_]',
        caughtErrorsIgnorePattern: '^_',
      }],
    },
  },
  { // Override for vite.config.js specifically
    files: ['vite.config.js'],
    languageOptions: {
      // For vite.config.js, it's a Node.js context.
      globals: globals.node,    // Add Node.js globals
      ecmaVersion: 2020, // Keep consistent
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  }
])
