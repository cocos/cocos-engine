
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

export interface IBuildOptions {
    inputPath: string;
    outputPath: string;
    globalDefines: object;
    excludes?: string[];
}

export async function build(options: IBuildOptions) {
    console.log(`Options: ${JSON.stringify(options)}`);
    const result = await _doBundle(options);
    if (!result) {
        return;
    }
    fs.writeFileSync(options.outputPath, result.code);
}

async function _doBundle(options: IBuildOptions) {
    let code = '';

    const rollupPlugins = [
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
        name: 'cc',
        sourcemap: true,
    });

    code = generated.code;

    console.log(`Doing uglify...`);

    const minifyOutput = minify(code, {
        compress: {
            global_defs: options.globalDefines,
        },
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
