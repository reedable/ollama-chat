module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    requireConfigFile: false,
    // babelOptions: ['@babel/preset-env', '@babel/preset-react'],
  },
  plugins: ['import', 'unused-imports'],
  rules: {
    'import/named': 'error',
    'import/default': 'error',
    'import/namespace': 'error',
    'import/no-unresolved': 'error',
    // 'import/order': [
    //   'warn',
    //   {
    //     groups: ['builtin', 'external', 'internal'],
    //     pathGroups: [
    //       {
    //         pattern: 'react',
    //         group: 'external',
    //         position: 'before',
    //       },
    //       {
    //         pattern: '**/*.scss',
    //         group: 'index',
    //       },
    //     ],
    //     pathGroupsExcludedImportTypes: ['react'],
    //     // 'newlines-between': 'always',
    //     alphabetize: {
    //       order: 'asc',
    //       caseInsensitive: true,
    //     },
    //   },
    // ],
    'import/extensions': [
      'error',
      'always',
      {
        css: 'never',
        js: 'never',
        jsx: 'never',
        yaml: 'never',
        yml: 'never',
      },
    ],
    'no-unused-vars': 'off',
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
        jsxBracketSameLine: false,
        printWidth: 80,
        tabWidth: 2,
      },
    ],
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack.config.js',
      },
    },
    react: {
      version: 'detect',
    },
  },
};
