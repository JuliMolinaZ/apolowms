module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.base.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint', 'import', 'react', 'react-hooks', '@next/next', '@nestjs'],
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:@next/next/recommended',
    'plugin:@nestjs/recommended',
    'prettier',
  ],
  ignorePatterns: ['node_modules', 'dist'],
  settings: {
    react: {
      version: 'detect',
    },
  },
};
