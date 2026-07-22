import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default tseslint.config(
  // Global ignores
  {
    ignores: [
      '**/dist/',
      '**/node_modules/',
      '**/*.js',
      '**/*.d.ts',
      '**/coverage/',
      '**/build/',
      '**/*.mjs',
      '**/*.cjs',
      '.ai-factory/',
      'scripts/',
      'cowagent/',
      'backend/data/',
      'backend/scripts/',
      'backend/setup/',
      'backend/tests/',
      'backend/vitest.config.*',
      'frontend/vite.config.*',
      'frontend/vitest.config.*',
    ],
  },
  // TypeScript + React config
  {
    files: ['**/*.ts', '**/*.tsx'],
    extends: [
      ...tseslint.configs.recommended,
      reactPlugin.configs.flat.recommended,
      reactPlugin.configs.flat['jsx-runtime'],
      reactHooksPlugin.configs.flat.recommended,
    ],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: ['./backend/tsconfig.json', './frontend/tsconfig.app.json'],
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'react-hooks/set-state-in-effect': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
);
