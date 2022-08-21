module.exports = {
    'env': {
        'es2021': true,
        'node': true,
        'browser': false,
        'mocha': true,
    },
    'extends': 'standard-with-typescript',
    'plugins': [
        '@typescript-eslint/eslint-plugin',
        'eslint-plugin-tsdoc',
    ],
    'overrides': [
    ],
    'parserOptions': {
        'ecmaVersion': 'latest',
        'project': './tsconfig.json',
    },
    'rules': {
        'indent': 'off',
        'quotes': 'off',
        'no-unused-vars': 'off',
        'comma-dangle': 'off',
        'quote-props': ['error', 'always'],
        '@typescript-eslint/indent': ['warn', 4],
        '@typescript-eslint/quotes': ['warn', 'single'],
        '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
        '@typescript-eslint/no-unused-vars': ['warn'],
        'tsdoc/syntax': ['warn'],
    },
    'ignorePatterns': [
        'dist/',
        'test/samples/',
    ],
}
