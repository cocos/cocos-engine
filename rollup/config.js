import * as fsJetpack from 'fs-jetpack';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import commonjs from 'rollup-plugin-commonjs';

const dest = './bin';
const file = 'cocos-3d.dev';
const moduleName = 'cocos3d';

fsJetpack.dir(dest);

export default {
    input: './index.js',

    output: [{
        file: `${dest}/${file}.js`,
        format: 'iife',
        name: moduleName,
        sourcemap: true
    }],

    plugins: [
        resolve({
            jsnext: true,

            main: true,

            extensions: ['.js', '.ts', '.json'],
        }),

        json({
            preferConst: true,
        }),

        babel({
            highlightCode: true,

            extensions: ['.js', '.ts'],

            presets: [
                '@babel/preset-env',
                '@babel/preset-typescript'
            ],

            plugins: [
                //'./rollup/babel-plugin-mix-ts-js',
                ['@babel/plugin-proposal-decorators', {
                    legacy: true
                }],
                ['@babel/plugin-proposal-class-properties', {
                    loose: true
                }],
            ],

            ignore: [
                'node_modules/**'
            ]
        }),

        commonjs({
            namedExports: {
                'cannon': ['CANNON']
            }
        }),
    ]
};
