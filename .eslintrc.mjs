export const env = {
    browser: true,
    es2021: true,
};
export const extendsConfig = [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
];
export const parser = '@typescript-eslint/parser';
export const parserOptions = {
    ecmaFeatures: {
        jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
};
export const plugins = [
    'react',
    '@typescript-eslint',
];
export const rules = {
    'no-unused-vars': ['warn', { 'vars': 'all', 'args': 'after-used', 'ignoreRestSiblings': false }],
    // You can also disable the rule entirely if needed
    // 'no-unused-vars': 'off',
};