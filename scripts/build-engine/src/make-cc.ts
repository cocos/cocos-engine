
import * as babel from '@babel/core';
// @ts-ignore
import babelPresetEnv from '@babel/preset-env';
import { ModuleOption } from './module-option';

export function generateCCSource (moduleRequests: string[]) {
    return moduleRequests.map(moduleRequest => `export * from '${moduleRequest}';`).join('\n');
}

export async function generateCCSourceTransformed (moduleRequests: string[], moduleOption: ModuleOption) {
    const babelFormat = moduleOptionsToBabelEnvModules(moduleOption);
    const source = generateCCSource(moduleRequests);
    const babelFileResult = await babel.transformAsync(source, {
        presets: [[babelPresetEnv, {modules: babelFormat }]],
    });
    if (!babelFileResult || !babelFileResult.code) {
        throw new Error(`Failed to transform!`);
    }
    return babelFileResult.code;
}

function moduleOptionsToBabelEnvModules (moduleOptions: ModuleOption):
| false
| 'commonjs'
| 'amd'
| 'umd'
| 'systemjs'
| 'auto'
{
    switch (moduleOptions) {
        case ModuleOption.cjs: return 'commonjs';
        case ModuleOption.system: return 'systemjs';
        case ModuleOption.iife:
        case ModuleOption.esm: return false;
        default: throw new Error(`Unknown module format ${moduleOptions}`);
    }
}