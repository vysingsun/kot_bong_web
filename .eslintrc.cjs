module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        es2021: true,
        'vue/setup-compiler-macros': true,
    },
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
        ecmaVersion: 2020,
        extraFileExtensions: ['.vue'],
    },
    extends: [
        'eslint:recommended',
        'plugin:vue/vue3-recommended',
        'prettier',
        'plugin:@typescript-eslint/recommended',
        '@vue/typescript',
    ],
    plugins: ['vue', 'prettier', '@typescript-eslint'],
    rules: {
        'vue/multi-word-component-names': 'off',
        'prettier/prettier': ['error'],
        'vue/require-default-prop': 0,
        'vue/html-indent': ['error', 4],
        'vue/singleline-html-element-content-newline': 0,
        'vue/component-name-in-template-casing': ['error', 'PascalCase'],
        '@typescript-eslint/no-explicit-any': ['off'],
    },
    globals: {
        _: true,
    },
}
