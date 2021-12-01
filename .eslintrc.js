module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json',
    extraFileExtensions: ['.html'],
  },
  plugins: [
    '@typescript-eslint',
    'chai-friendly',
    'eslint-plugin-import',
    'html',
    'import',
    'jsdoc',
    'lit-a11y',
    'simple-import-sort',
  ],
  extends: [
    '@open-wc/eslint-config',
    'eslint-config-prettier',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:chai-friendly/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:lit/recommended',
    'plugin:lit-a11y/recommended',
    'plugin:prettier/recommended',
    'plugin:wc/recommended',
  ],
  settings: {
    wc: {
      elementBaseClasses: ['LitElement'],
    },
  },
  ignorePatterns: ['**/*.snap.js'],
  rules: {
    '@typescript-eslint/await-thenable': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    "@typescript-eslint/unbound-method": [
      "error",
      {
        "ignoreStatic": true
      }
    ],
    'import/no-unresolved': 'off',
    'import/extensions': [
      'error',
      'always',
      {
        ignorePackages: true,
      },
    ],
    'jsdoc/no-undefined-types': 'warn',
    'sort-imports': 'off',
    'import/order': 'off',
    'import/no-duplicates': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'prettier/prettier': 'error',
    'no-console': [
      "error",
      {
        allow: [
          "warn",
          "error"
        ]
      }
    ]
  },
  overrides: [
    {
      files: ['test/**/*'],
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true,
          },
        ],
      },
    },
    {
      files: ['index.html'],
      rules: {
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
      }
    }
  ],
};
