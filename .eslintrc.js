module.exports = {
    'env': {
        'es2021': true,
        'node': true,
    },
    'extends': 'standard-with-typescript',
    'overrides': [
    ],
    'parserOptions': {
        'ecmaVersion': 'latest',
        'project': './tsconfig.json',
    },
    'rules': {
        'indent': 'off',
        '@typescript-eslint/indent': ['warn', 4],
        'quote-props': ['error', 'always'],
        'quotes': 'off',
        '@typescript-eslint/quotes': ['warn', 'single'],
        'comma-dangle': ['error', 'always-multiline'],
    },
    'ignorePatterns': [
        'dist/',
        'test/samples/',
    ],
}
