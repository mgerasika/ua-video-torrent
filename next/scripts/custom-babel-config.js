// eslint-disable-next-line no-undef
module.exports = {
    plugins: [
        [
            'module-resolver',
            {
                root: ['.'],
                alias: {
                    '@common': './common/src',
                    '@src': './src',
                },
            },
        ],
    ],
    presets: ['@babel/preset-react', '@babel/env', '@babel/typescript'],
};
