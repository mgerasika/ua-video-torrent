/* eslint-disable no-undef */
const path = require('path');

/* eslint-disable no-undef */
module.exports = {
    roots: ['<rootDir>'],
    setupFiles: ['<rootDir>/setup-test.js'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx'],
    testPathIgnorePatterns: ['<rootDir>/cypress/', '<rootDir>/common/'],
    transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(ts|tsx)$'],
    transform: {
        '^.+\\.(ts|tsx)$': ['babel-jest', { configFile: path.resolve(__dirname, 'jest.babelrc') }],
        '\\.(less|.scss|css)$': 'jest-less-loader',
    },
    moduleNameMapper: {
        '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'identity-obj-proxy',
        '^@common(.*)$': '<rootDir>/common/src/$1',
        '^@src(.*)$': '<rootDir>/src/$1',
    },
};
