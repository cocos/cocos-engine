module.exports = {
    root: true,
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        // ES6 syntax
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: {
            modules: true,
        },
        // 'project': './tsconfig.json'
    },
    plugins: [
        '@typescript-eslint',
        // 'jsdoc',
        // 'prettier',
    ],
    rules: {
        'quote-props': ['error', 'as-needed'],
        // 'prettier/prettier': 'warn',
        'keyword-spacing': ['warn', {
            before: true,
            after: true,
        }],
        camelcase: ['warn', {
            properties: 'always',
        }],
        indent: ['error', 4, { SwitchCase: 1, CallExpression: { arguments: 'off' }, ArrayExpression: 'first' }],
        // 'no-else-return': 'error',
        'object-curly-spacing': ['error', 'always'],
        'array-bracket-spacing': ['error', 'never'],
        'semi-spacing': ['error', {
            before: false,
            after: true,
        }],
        'rest-spread-spacing': ['error', 'never'],
        'space-in-parens': ['error', 'never'],
        curly: 'error',
        semi: ['error', 'always'],
        'no-multi-spaces': ['error', { ignoreEOLComments: true }],
        'no-whitespace-before-property': 'error',
        'no-tabs': ['error', { allowIndentationTabs: true }],

        'no-unused-vars': ['warn', 'all'],
        'no-empty': ['error', { allowEmptyCatch: true }],
        'consistent-return': ['warn', { treatUndefinedAsUnspecified: true }],
        eqeqeq: ['warn', 'always'],
        // 'line-comment-position': ['warn', { 'position': 'above' }],
        'max-len': ['warn', {
            code: 180,
        }],
        'no-undef': 0,
        'no-constant-condition': ['warn', {
            checkLoops: false,
        }],
        'no-inner-declarations': ['warn'],
        'no-case-declarations': ['warn'],

        // 'jsdoc/check-alignment': 1,
        // 'jsdoc/check-param-names': 1,
        // 'jsdoc/check-tag-names': 1,
        // 'jsdoc/check-types': 1,
        // 'jsdoc/implements-on-classes': 1,
        // 'jsdoc/newline-after-description': 1,
        // 'jsdoc/no-undefined-types': 1,
        // 'jsdoc/require-jsdoc': 1,
        // 'jsdoc/require-param': 1,
        // 'jsdoc/require-param-description': 1,
        // 'jsdoc/require-param-name': 1,
        // 'jsdoc/require-param-type': 1,
        // 'jsdoc/require-returns': 1,
        // 'jsdoc/require-returns-check': 1,
        // 'jsdoc/require-returns-description': 1,
        // 'jsdoc/require-returns-type': 1,
        // 'jsdoc/valid-types': 1,

        // 行尾逗号
        'comma-style': ['error', 'last'],
        'comma-dangle': ['error', {
            arrays: 'always-multiline',
            objects: 'always-multiline',
            imports: 'always-multiline',
            exports: 'always-multiline',
            functions: 'only-multiline',
        }],
        'comma-spacing': ['error', {
            before: false,
            after: true,
        }],

        // 空格、空行约定
        'unicode-bom': ['warn', 'never'],
        'block-spacing': ['error', 'always'],
        'arrow-spacing': ['error', {
            before: true,
            after: true,
        }],
        'space-before-function-paren': ['error', {
            anonymous: 'never',
            named: 'never',
            asyncArrow: 'always',
        }],
        'space-before-blocks': ['error', 'always'],
        'space-infix-ops': ['warn'],
        'space-unary-ops': ['warn', {
            words: true,
            nonwords: false,
        }],
        'spaced-comment': ['warn', 'always', {
            line: {
                markers: ['/'],
                exceptions: ['/', '*'],
            },
        },
        ],
        'switch-colon-spacing': ['warn', {
            before: false,
            after: true,
        }],
        'eol-last': ['error', 'always'],
        'no-trailing-spaces': ['error', { ignoreComments: true }],
    },
};
