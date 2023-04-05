const path = require('path');

module.exports = {
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  plugins: ['markdown'],
  overrides: [
    // eslint-plugin-markdown has been disabled because of out-standing issues, see https://github.com/eslint/eslint-plugin-markdown/issues/214
    {
      files: ['**/*.md'],
      processor: 'markdown/markdown',
    },
    {
      files: ['**/*.md/*.js', '**/*.md/*.javascript'],
      parserOptions: {
        ecmaFeatures: {
          impliedStrict: true,
        },
        sourceType: 'module', // required to allow "import" statements
        ecmaVersion: 'latest', // required to allow top-level await
      },
      rules: {
        'no-undef': 'off',
        'no-unused-expressions': 'off',
        'no-unused-vars': 'off',
        'no-redeclare': 'off',
      },
    },
  ],
  rules: {
    'no-underscore-dangle': 0,
    'arrow-body-style': 0,
    'no-unused-expressions': 1,
    'no-plusplus': 0,
    'no-console': 0,
    'func-names': 0,
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
      },
    ],
    'no-prototype-builtins': 0,
    'prefer-destructuring': 0,
    'no-else-return': 1,
    'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    curly: ['error', 'all'],
    'padding-line-between-statements': [
      'warn',
      {
        blankLine: 'always',
        prev: '*',
        next: 'return', // add blank line *before* all returns (if there are statements before)
      },
      {
        blankLine: 'always',
        prev: '*',
        next: 'if', // add blank line *before* all ifs
      },
      {
        blankLine: 'always',
        prev: 'if',
        next: '*', // add blank line *after* all ifs
      },
      {
        blankLine: 'any',
        prev: 'if',
        next: 'if', // allow blank line between ifs, but not enforce either
      },
      {
        blankLine: 'always',
        prev: '*',
        next: ['function', 'class'], // add blank line *before* all functions and classes
      },
      {
        blankLine: 'always',
        prev: ['function', 'class'],
        next: '*', // add blank line *after* all functions and classes
      },
      {
        blankLine: 'always',
        prev: '*',
        next: 'import', // add blank line *before* all imports
      },
      {
        blankLine: 'always',
        prev: 'import',
        next: '*', // add blank line *after* all imports
      },
      {
        blankLine: 'never',
        prev: 'import',
        next: 'import', // dont allow blank line between imports
      },
    ],
  },
  env: {
    node: true,
    jest: true,
  },
};
