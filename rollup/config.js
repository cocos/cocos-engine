import * as fsJetpack from 'fs-jetpack';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import commonjs from 'rollup-plugin-commonjs';

const dest = './bin';
const file = 'cocos-3d.dev';
const moduleName = 'cc_modular';

fsJetpack.dir(dest);

export default {
    input: './index.ts',

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
                [
                    '@babel/preset-env',
                    // { targets: { "esmodules": true } }
                ],
                '@babel/preset-typescript'
            ],

            plugins: [
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
                'cannon': ['CANNON'],
            }
        }),
    ]
};
