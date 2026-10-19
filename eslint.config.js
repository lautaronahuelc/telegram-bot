import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  { ignores: ['node_modules/'] },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'require-await': 'error',
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
    },
  },
  // Desactiva las reglas de estilo que se pisan con Prettier. Tiene que ir último.
  prettier,
];
