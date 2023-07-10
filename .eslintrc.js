module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true
  },
  // parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    parser: '@babel/eslint-parser',
    ecmaFeatures: {
      jsx: true
    }
  },
  extends: [
    'react-app',
    'airbnb',
    'plugin:jsx-a11y/recommended',
    'prettier',
    'prettier/react'
  ],
  plugins: ['prettier'],
  rules: {
    eqeqeq: 'error',
    'no-unused-vars': 'off'
  },
  overrides: []
}
