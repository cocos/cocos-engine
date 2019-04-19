
import * as fs from 'fs-extra';
import { rollup } from 'rollup';
// @ts-ignore
import babel from 'rollup-plugin-babel';
// @ts-ignore
import commonjs from 'rollup-plugin-commonjs';
// @ts-ignore
import json from 'rollup-plugin-json';
// @ts-ignore
import resolve from 'rollup-plugin-node-resolve';
import { minify } from 'uglify-js';

const { excludes } = require('../plugin/rollup-plugin-excludes');

export interface IBuildOptions {
    inputPath: string;
    outputPath: string;
    globalDefines: object;
    excludes?: string[];
    compress?: boolean;
    sourcemap?: boolean;
}

export async function build (options: IBuildOptions) {
    console.log(`Options: ${JSON.stringify(options)}`);
    const result = await _doBundle(options);
    if (!result) {
        return;
    }
    fs.writeFileSync(options.outputPath, result.code);
}

async function _doBundle (options: IBuildOptions) {
    let code = '';
    const rollupPlugins = [
        excludes({
            modules: options.excludes
        }),

        resolve({
            extensions: ['.js', '.ts', '.json'],
            jsnext: true,
            main: true,
        }),

        json({
            preferConst: true,
        }),

        babel({
            extensions: ['.js', '.ts'],
            highlightCode: true,
            ignore: [
                'node_modules/**',
            ],
            plugins: [
                ['@babel/plugin-proposal-decorators', {
                    legacy: true,
                }],
                ['@babel/plugin-proposal-class-properties', {
                    loose: true,
                }],
            ],
            presets: [
                '@babel/preset-env',
                '@babel/preset-typescript',
            ],
        }),

        commonjs({
            namedExports: {
                cannon: ['CANNON', 'Shape'],
            },
        }),
    ];

    const rollupBuild = await rollup({
        input: options.inputPath,
        plugins: rollupPlugins,
    });

    const generated = await rollupBuild.generate({
        format: 'iife',
        name: 'cc_modular',
        sourcemap: true,
    });

    code = generated.code;

    console.log(`Doing uglify...`);

    const minifyOutput = minify(code, {
        compress: {
            global_defs: options.globalDefines,
            // sequences     : true,  // join consecutive statemets with the “comma operator”
            // properties    : true,  // optimize property access: a["foo"] → a.foo
            // dead_code     : true,  // discard unreachable code
            // drop_debugger : true,  // discard “debugger” statements
            // unsafe        : false, // some unsafe optimizations (see below)
            // conditionals  : true,  // optimize if-s and conditional expressions
            // comparisons   : true,  // optimize comparisons
            // evaluate      : true,  // evaluate constant expressions
            // booleans      : true,  // optimize boolean expressions
            // loops         : true,  // optimize loops
            // unused        : true,  // drop unused variables/functions
            // hoist_funs    : true,  // hoist function declarations
            // hoist_vars    : false, // hoist variable declarations
            // if_return     : true,  // optimize if-s followed by return/continue
            // join_vars     : true,  // join var declarations
            // side_effects  : true,  // drop side-effect-free statements
            // warnings      : true,  // warn about potentially dangerous optimizations/code
        },
        mangle: false,
        keep_fnames: true,
        output: {
            beautify: true,
        },
        sourceMap: true,
    });
    if (minifyOutput.error) {
        console.error(minifyOutput.error.stack);
        return null;
    } else {
        code = minifyOutput.code;
    }

    return {
        code,
    };
}
