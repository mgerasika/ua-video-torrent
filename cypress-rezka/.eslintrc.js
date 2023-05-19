// eslint-disable-next-line no-undef
module.exports = {
    settings: {
        react: {
            version: 'detect',
        },
    },
    env: {
        browser: true,
    },
    ignorePatterns: ['chargebee.min.js', '*.json'],
    extends: [
        'plugin:react-hooks/recommended',
        'eslint:recommended',
        'plugin:react/recommended',
        // Uses the recommended rules from @eslint-plugin-react
        'plugin:@typescript-eslint/recommended',
        // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        'plugin:cypress/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: ['react', 'react-hooks', '@typescript-eslint', '@emotion', 'unicorn', 'no-only-tests', 'hooks-sort'],
    rules: {
        'hooks-sort/order': [
            2,
            {
                groups: ['useContext', 'useState', 'useEffect', 'useCallback'],
            },
        ],
        'react/display-name': 'off',
        'unicorn/no-unused-properties': 'error',
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                caughtErrorsIgnorePattern: '^_',
                ignoreRestSiblings: true,
            },
        ],
        '@emotion/import-from-emotion': 'error',
        '@emotion/styled-import': 'error',
        'react-hooks/exhaustive-deps': [
            'warn',
            {
                additionalHooks: 'useModal',
            },
        ],
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-empty-function': 'warn',
        'react/no-unescaped-entities': 'off',
        'no-extra-boolean-cast': 'warn',
        'no-empty-pattern': 'warn',
        'prefer-const': 'warn',
        '@typescript-eslint/no-extra-semi': 'warn',
        'react/prop-types': 'off',
        'react/jsx-key': 'warn',
        '@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',
        '@typescript-eslint/no-non-null-assertion': ['error'],
        '@typescript-eslint/no-inferrable-types': 'warn',
        'no-empty': 'warn',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/ban-types': 'warn',
        'no-var': 'warn',
        'no-useless-escape': 'warn',
        'no-async-promise-executor': 'warn',
        '@typescript-eslint/no-empty-interface': 'warn',
        'no-case-declarations': 'off',
        'linebreak-style': ['warn', 'unix'],
        semi: ['warn', 'always'],
        'no-debugger': ['warn'],
        curly: ['error'],
        'valid-typeof': 'error',
        'react/jsx-uses-react': 'error',
        'react/react-in-jsx-scope': 'error',
        'react/no-array-index-key': 'error',
        'no-duplicate-imports': 'error',
        'object-shorthand': ['error', 'always'],
        'no-only-tests/no-only-tests': 'error',
        'no-console': ['warn'],
        '@typescript-eslint/explicit-function-return-type': ['error'],
        quotes: [
            'error',
            'single',
            {
                avoidEscape: true,
                allowTemplateLiterals: true,
            },
        ],
        'no-restricted-imports': [
            'error',
            {
                // Warning!!! don't remove @common/index rule - webpack three shaking problem (performance)
                patterns: ['src*', '@common/index'],
            },
        ],
    },
};
