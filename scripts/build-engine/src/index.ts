
import fs from 'fs-extra';
import ps from 'path';
import rpBabel, { RollupBabelInputPluginOptions } from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser as rpTerser } from 'rollup-plugin-terser';
import babelPresetEnv from '@babel/preset-env';
import type { Options as babelPresetEnvOptions } from '@babel/preset-env';
import babelPresetCc from '@cocos/babel-preset-cc';
// @ts-ignore
import babelPluginTransformForOf from '@babel/plugin-transform-for-of';
import * as rollup from 'rollup';
// @ts-ignore
import rpProgress from 'rollup-plugin-progress';
// @ts-ignore
import rpVirtual from '@rollup/plugin-virtual';
import { ModuleOption, enumerateModuleOptionReps, parseModuleOption } from './module-option';
import { generateCCSource } from './make-cc';
import nodeResolve from 'resolve';
import { getModuleName } from './module-name';
import tsConfigPaths from './ts-paths';
import JSON5 from 'json5';
import { getPlatformConstantNames, IBuildTimeConstants } from './build-time-constants';
import removeDeprecatedFeatures from './remove-deprecated-features';
import babelPluginDynamicImportVars from '@cocos/babel-plugin-dynamic-import-vars';

export { ModuleOption, enumerateModuleOptionReps, parseModuleOption };

function makePathEqualityKey (path: string) {
    return process.platform === 'win32' ? path.toLocaleLowerCase() : path;
}

async function build (options: build.Options) {
    console.debug(`Build-engine options: ${JSON.stringify(options, undefined, 2)}`);

    let moduleEntries: string[];
    if (!options.moduleEntries || options.moduleEntries.length === 0) {
        console.debug(`No module entry specified, default module entries will be used.`);
        moduleEntries = await getDefaultModuleEntries(options.engine);
    } else {
        moduleEntries = options.moduleEntries;
    }

    _ensureUniqueModules(options);

    return await _doBuild({
        moduleEntries,
        options,
    });
}

namespace build {
    export interface Options {
        /**
         * 引擎仓库目录。
         */
        engine: string;

        /**
         * 模块入口。
         */
        moduleEntries?: string[];

        /**
         * 输出目录。
         */
        out: string;

        /**
         * 输出模块格式。
         * @default ModuleOption.system
         */
        moduleFormat?: ModuleOption;

        /**
         * 是否对生成结果进行压缩。
         * @default false
         */
        compress?: boolean;

        /**
         * 是否生成 source map。
         * 若为 `inline` 则生成内联的 source map。
         * @default false
         */
        sourceMap?: boolean | 'inline';

        /**
         * 若 `sourceMap` 为 `true`，此选项指定了 source map 的路径。
         * @default `${outputPath.map}`
         */
        sourceMapFile?: string;

        /**
         * 若为 `true`，分割出 **所有** 引擎子模块。
         * 否则，`.moduleEntries` 指定的所有子模块将被合并成一个单独的 `"cc"` 模块。
         * @default false
         */
        split?: boolean;

        /**
         * 使用的 ammo.js 版本，也即 `@cocos/ammo` 映射到的版本。
         * - 为 `true` 时使用 WebAssembly 版本的 ammo.js；
         * - 为 `false` 时使用 asm.js 版本的 ammo.js；
         * - 为 `'fallback` 时同时在结果中包含两个版本的 ammo.js，并自动根据环境 fallback 选择。
         * 
         * 注意，`'fallback'` 只有在 SystemJS 和 Async functions 同时支持时才有效。
         * @default false
         */
        ammoJsWasm?: boolean | 'fallback';

        /**
         * If true, all deprecated features/API are excluded.
         * You can also specify a version range(in semver range) to exclude deprecations in specified version(s).
         * @default false
         */
        noDeprecatedFeatures?: string | boolean;

        /**
         * Experimental.
         */
        incremental?: string;

        progress?: boolean;

        /**
         * BrowsersList targets.
         */
        targets?: string | string[] | Record<string, string>;

        /**
         * Enable loose compilation.
         */
        loose?: boolean;

        visualize?: boolean | {
            file?: string;
        };

        buildTimeConstants: IBuildTimeConstants;
    }

    export interface Result {
        /**
         * 模块名与实际模块文件的映射，例如：
         * ```js
         * {
         *   "cc.core": "./cc.core.js",
         *   "cc.gfx-webgl": "./cc.gfx-webgl.js",
         * }
         * ```
         */
        exports: Record<string, string>;


        dependencyGraph?: Record<string, string[]>;
    }
}

export { build };

function _ensureUniqueModules (options: build.Options) {
    const uniqueModuleEntries: string[] = [];
    for (const moduleEntry of options.moduleEntries!) {
        if (uniqueModuleEntries.indexOf(moduleEntry) < 0) {
            uniqueModuleEntries.push(moduleEntry);
        }
    }
    options.moduleEntries = uniqueModuleEntries;
}

async function getEngineEntries (
    engine: string,
    moduleEntries?: string[],
) {
    const result: Record<string, string> = {};
    const entryRootDir = ps.join(engine, 'exports');
    const entryFileNames = await fs.readdir(entryRootDir);
    for (const entryFileName of entryFileNames) {
        const entryExtName = ps.extname(entryFileName);
        if (!entryExtName.toLowerCase().endsWith('.ts')) {
            continue;
        }
        const entryBaseNameNoExt = ps.basename(entryFileName, entryExtName);
        if (moduleEntries && !moduleEntries.includes(entryBaseNameNoExt)) {
            continue;
        }
        const entryFile = ps.join(entryRootDir, entryFileName);
        const entryName = getModuleName(entryBaseNameNoExt, engine);
        result[entryName] = entryFile;
    }
    return result;
}

interface CCConfig {
    platforms?: Record<string, {
        moduleOverrides?: Record<string, string>;
    }>;
}

async function _doBuild ({
    moduleEntries,
    options,
}: {
    moduleEntries?: string[];
    options: build.Options;
}): Promise<build.Result> {
    const doUglify = !!options.compress;
    const split = options.split ?? false;
    const engineRoot = ps.resolve(options.engine);

    const moduleOption = options.moduleFormat ?? ModuleOption.iife;
    const rollupFormat = moduleOptionsToRollupFormat(moduleOption);

    let { ammoJsWasm } = options;
    if (ammoJsWasm === 'fallback' &&
        moduleOption !== ModuleOption.system) {
        console.warn(`--ammojs-wasm=fallback is only available under SystemJS target.`);
        ammoJsWasm = false;
    }

    const ccConfigFile = ps.join(engineRoot, 'cc.config.json');
    const ccConfig: CCConfig = JSON5.parse(await fs.readFile(ccConfigFile, 'utf8'));

    const engineEntries = await getEngineEntries(
        engineRoot,
        split ? undefined : moduleEntries,
    );

    const rpVirtualOptions: Record<string, string> = {};
    const vmInternalConstants = getModuleSourceInternalConstants(options.buildTimeConstants);
    console.debug(`Module source "internal-constants":\n${vmInternalConstants}`);
    rpVirtualOptions['internal:constants'] = vmInternalConstants;

    const forceStandaloneModules = [ 'cc.wait-for-ammo-instantiation', 'cc.decorator' ];

    let rollupEntries: NonNullable<rollup.RollupOptions['input']> | undefined;
    if (split) {
        rollupEntries = Object.assign({}, engineEntries);
    } else {
        rollupEntries = {
            'cc': 'cc',
        };
        const bundledModules = [];
        for (const moduleName of Object.keys(engineEntries)) {
            const moduleEntryFile = engineEntries[moduleName];
            if (forceStandaloneModules.includes(moduleName)) {
                rollupEntries[moduleName] = moduleEntryFile;
            } else {
                bundledModules.push(filePathToModuleRequest(moduleEntryFile));
            }
        }

        rpVirtualOptions['cc'] = generateCCSource(bundledModules);
        rollupEntries['cc'] = 'cc';

        console.debug(`Module source "cc":\n${rpVirtualOptions['cc']}`);
    }

    const presetEnvOptions: babelPresetEnvOptions = {
        loose: options.loose ?? true,
    };
    if (options.targets !== undefined) {
        presetEnvOptions.targets = options.targets;
    }

    const babelPlugins: any[] = [];
    if (options.targets === undefined) {
        babelPlugins.push([babelPluginTransformForOf, {
            loose: true,
        }]);
    }

    babelPlugins.push(
        [babelPluginDynamicImportVars, {
            resolve: {
                forwardExt: 'resolved',
            },
        }],
    );

    const babelOptions: RollupBabelInputPluginOptions = {
        babelHelpers: 'bundled',
        extensions: ['.js', '.ts'],
        exclude: [
            /node_modules[\/\\]@cocos[\/\\]ammo/g,
            /node_modules[\/\\]@cocos[\/\\]cannon/g,
        ],
        highlightCode: true,
        plugins: babelPlugins,
        presets: [
            [babelPresetEnv, presetEnvOptions],
            [babelPresetCc, {
                allowDeclareFields: true,
            } as babelPresetCc.Options],
        ],
    };

    const moduleRedirects: Record<string, string> = {};
    const platformConstant = getPlatformConstantNames().find((name) => options.buildTimeConstants[name] === true);
    if (platformConstant) {
        const moduleOverrides = ccConfig.platforms?.[platformConstant]?.moduleOverrides;
        if (moduleOverrides) {
            for (const [source, override] of Object.entries(moduleOverrides)) {
                const normalizedSource = makePathEqualityKey(ps.resolve(engineRoot, source));
                const normalizedOverride = ps.resolve(engineRoot, override);
                moduleRedirects[normalizedSource] = normalizedOverride;
            }
        }
    }

    const rollupPlugins: rollup.Plugin[] = [];
    if (options.noDeprecatedFeatures) {
        rollupPlugins.push(removeDeprecatedFeatures(
            typeof options.noDeprecatedFeatures === 'string' ? options.noDeprecatedFeatures : undefined));
    }

    rollupPlugins.push(
        {
            name: '@cocos/build-engine|module-overrides',
            load: function (this, id: string) {
                const key = makePathEqualityKey(id);
                if (!(key in moduleRedirects)) {
                    return null;
                }
                const replacement = moduleRedirects[key];
                console.debug(`Redirect module ${id} to ${replacement}`);
                return `export * from '${filePathToModuleRequest(replacement)}';`;
            },
        },

        rpVirtual(rpVirtualOptions),

        tsConfigPaths({
            configFileName: ps.resolve(options.engine, 'tsconfig.json'),
        }),

        resolve({
            extensions: ['.js', '.ts', '.json'],
        }),

        json({
            preferConst: true,
        }),

        commonjs({}),

        rpBabel(babelOptions),
    );

    if (options.progress) {
        rollupPlugins.unshift(rpProgress());
    }

    if (doUglify) { // TODO: tree-shaking not clear!
        rollupPlugins.push(rpTerser({
            // see https://github.com/terser/terser#compress-options
            compress: {
                reduce_funcs: false, // reduce_funcs not suitable for ammo.js
                keep_fargs: false,
                unsafe_Function: true,
                unsafe_math: true,
                unsafe_methods: true,
                passes: 2,  // first: remove deadcodes and const objects, second: drop variables
            },
            mangle: doUglify,
            keep_fnames: !doUglify,
            output: {
                beautify: !doUglify,
            },
            sourcemap: !!options.sourceMap,
    
            // https://github.com/rollup/rollup/issues/3315
            // We only do this for CommonJS.
            // Especially, we cannot do this for IIFE.
            toplevel: rollupFormat === 'cjs',
        }));
    }

    const visualizeOptions = typeof options.visualize === 'object' ?
        options.visualize:
        (options.visualize ? {} : undefined);
    if (visualizeOptions) {
        let rpVisualizer;
        try {
            rpVisualizer = require('rollup-plugin-visualizer');
        } catch {
            console.warn(`Visualizing needs 'rollup-plugin-visualizer' to be installed. It's installed as dev-dependency.`);
        }
        if (rpVisualizer) {
            const visualizeFile = visualizeOptions.file ?? ps.join(options.out, 'visualize.html');
            rollupPlugins.push(rpVisualizer({
                filename: visualizeFile,
                title: 'Cocos Creator 3D build visualizer',
                template: 'treemap',
            }));
        }
    }

    const rollupOptions: rollup.InputOptions = {
        input: rollupEntries,
        plugins: rollupPlugins,
        cache: false,
    };

    const ammoJsAsmJsModule = await nodeResolveAsync('@cocos/ammo/builds/ammo.full.js');
    const ammoJsWasmModule = await nodeResolveAsync('@cocos/ammo/builds/ammo.wasm.js');
    if (ammoJsWasm === 'fallback') {
        rpVirtualOptions['@cocos/ammo'] = `
let ammo;
let isWasm = false;
if (typeof WebAssembly === 'undefined') {
    ammo = await import('${filePathToModuleRequest(ammoJsAsmJsModule)}');
} else {
    ammo = await import('${filePathToModuleRequest(ammoJsWasmModule)}');
    isWasm = true;
}
export default ammo.default;
export { isWasm };
`;
    } else if (ammoJsWasm === true) {
        rpVirtualOptions['@cocos/ammo'] = `
import Ammo from '${filePathToModuleRequest(ammoJsWasmModule)}';
export default Ammo;
const isWasm = false;
export { isWasm };
`;
    }

    const rollupBuild = await rollup.rollup(rollupOptions);

    const { incremental: incrementalFile } = options;
    if (incrementalFile) {
        const watchFiles: Record<string, number> = {};
        for (const watchFile of rollupBuild.watchFiles.concat([
            ccConfigFile,
        ])) {
            try {
                const stat = await fs.stat(watchFile);
                watchFiles[watchFile] = stat.mtimeMs;
            } catch {
                // the `watchFiles` may contain non-fs modules.
            }
        }
        await fs.ensureDir(ps.dirname(incrementalFile));
        await fs.writeFile(incrementalFile, JSON.stringify(watchFiles, undefined, 2));
    }

    const result: build.Result = {
        exports: {},
    };

    const rollupOutputOptions: rollup.OutputOptions = {
        format: rollupFormat,
        sourcemap: options.sourceMap,
        sourcemapFile: options.sourceMapFile,
        name: (rollupFormat === 'iife' ? 'ccm' : undefined),
        dir: options.out,
        // minifyInternalExports: false,
        // preserveEntrySignatures: "allow-extension",
    };

    const rollupOutput = await rollupBuild.write(rollupOutputOptions);

    const validEntryChunks: Record<string, string> = {};
    for (const output of rollupOutput.output) {
        if (output.type === 'chunk') {
            if (output.isEntry) {
                const chunkName = output.name;
                if (chunkName in engineEntries || chunkName === 'cc') {
                    validEntryChunks[chunkName] = output.fileName;
                }
            }
        }
    }

    Object.assign(result.exports, validEntryChunks);

    // // 构造模块 `"cc"`
    // let ccModuleRequests: string[] | undefined;
    // if (options.cc === 'bare') {
    //     ccModuleRequests = [];
    //     ccModuleRequests.push(...Object.keys(validEntryChunks));
    // } else if (options.cc === 'unmapped') {
    //     ccModuleRequests = [];
    //     ccModuleRequests.push(...Object.values(validEntryChunks).map(fileName => `./${fileName}`));
    // }
    // if (ccModuleRequests !== undefined) {
    //     let code = await makeModuleSourceCC(ccModuleRequests, moduleOption);
    //     if (options.compress) {
    //         code = terser.minify(code).code!;
    //     }
    //     const moduleCCFileName = 'cc.js';
    //     await fs.ensureDir(options.out);
    //     await fs.writeFile(ps.join(options.out, moduleCCFileName), code);
    //     result.exports['cc'] = moduleCCFileName;
    // }

    result.dependencyGraph = {};
    for (const output of rollupOutput.output) {
        if (output.type === 'chunk') {
            result.dependencyGraph[output.fileName] = output.imports;
        }
    }

    if (ammoJsWasm === 'fallback' || ammoJsWasm === true) {
        await fs.copy(
            ps.join(ammoJsWasmModule, '..', 'ammo.wasm.wasm'),
            ps.join(options.out, 'ammo.wasm.wasm'));
    }

    return result;

    async function copy (src: string) {
        const rel = ps.relative(options.engine, src);
        const target = ps.join(options.out, rel);
        await fs.ensureDir(ps.dirname(target));
        await fs.copy(src, target);
    }

    async function nodeResolveAsync (specifier: string) {
        return new Promise<string>((r, reject) => {
            nodeResolve(specifier, {
                basedir: engineRoot,
            }, (err, resolved, pkg) => {
                if (err) {
                    reject(err);
                } else {
                    r(resolved);
                }
            });
        });
    }
}

function filePathToModuleRequest(path: string) {
    return path.replace(/\\/g, '\\\\');
}

function getModuleSourceInternalConstants (buildTimeConstants: IBuildTimeConstants) {
    return Object.entries(buildTimeConstants).map(([k, v]) => `export const ${k} = ${v};`).join('\n');
}

function moduleOptionsToRollupFormat(moduleOptions: ModuleOption): rollup.ModuleFormat {
    switch (moduleOptions) {
        case ModuleOption.cjs: return 'cjs';
        case ModuleOption.esm: return 'esm';
        case ModuleOption.system: return 'system';
        case ModuleOption.iife: return 'iife';
        default: throw new Error(`Unknown module format ${moduleOptions}`);
    }
}

export async function isSourceChanged(incrementalFile: string) {
    let record: Record<string, number>;
    try {
        record = await fs.readJSON(incrementalFile);
    } catch {
        console.debug(`Failed to read incremental file: ${incrementalFile} - rebuild is needed.`);
        return true;
    }
    for (const file of Object.keys(record)) {
        const mtime = record[file];
        try {
            const mtimeNow = (await fs.stat(file)).mtimeMs;
            if (mtimeNow !== mtime) {
                console.debug(`Source ${file} in watch files record ${incrementalFile} has a different time stamp - rebuild is needed.`);
                return true;
            }
        } catch {
            console.debug(`Failed to read source ${file} in watch files record ${incrementalFile} - rebuild is needed.`);
            return true;
        }
    }
    return false;
}

async function getDefaultModuleEntries (engine: string) {
    type ModuleDivision = any; // import('../../scripts/module-division/tools/division-config').ModuleDivision;
    type GroupItem = any; // import('../../scripts/module-division/tools/division-config').GroupItem;
    type Item = any; // import('../../scripts/module-division/tools/division-config').Item;

    const isGroupItem = (item: Item): item is GroupItem => {
        return 'options' in item;
    };

    const divisionConfig: ModuleDivision = await fs.readJSON(ps.join(engine, 'scripts', 'module-division', 'division-config.json'));
    const result: string[] = [];
    const addEntry = (entry: string | string[]) => {
        if (Array.isArray(entry)) {
            result.push(...entry);
        } else {
            result.push(entry);
        }
    };
    for (const groupOrItem of divisionConfig.groupOrItems) {
        const items = 'items' in groupOrItem ? groupOrItem.items : [groupOrItem];
        for (const item of items) {
            if (item.required || item.default) {
                if (isGroupItem(item)) {
                    addEntry(item.options[item.defaultOption || 0].entry);
                } else {
                    // @ts-ignore
                    addEntry(item.entry);
                }
            }
        }
    }
    return result;
}
