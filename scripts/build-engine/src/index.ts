/* eslint-disable no-console */
import fs from 'fs-extra';
import ps from 'path';
import * as babel from '@babel/core';
import rpBabel, { RollupBabelInputPluginOptions } from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser as rpTerser } from 'rollup-plugin-terser';
import babelPresetEnv from '@babel/preset-env';
import type { Options as babelPresetEnvOptions } from '@babel/preset-env';
import babelPresetCc from '@cocos/babel-preset-cc';
// @ts-expect-error: No typing
import babelPluginTransformForOf from '@babel/plugin-transform-for-of';
import * as rollup from 'rollup';
// @ts-expect-error: No typing
import rpProgress from 'rollup-plugin-progress';
// @ts-expect-error: No typing
import rpVirtual from '@rollup/plugin-virtual';
import nodeResolve from 'resolve';
import babelPluginDynamicImportVars from '@cocos/babel-plugin-dynamic-import-vars';
import realFs from 'fs';
import { URL, pathToFileURL, fileURLToPath } from 'url';
import { ModuleOption, enumerateModuleOptionReps, parseModuleOption } from './module-option';
import tsConfigPaths from './ts-paths';
import { getPlatformConstantNames, IBuildTimeConstants } from './build-time-constants';
import removeDeprecatedFeatures from './remove-deprecated-features';
import { StatsQuery } from './stats-query';
import { filePathToModuleRequest } from './utils';
import { assetRef as rpAssetRef, pathToAssetRefURL } from './rollup-plugins/asset-ref';
import { codeAsset } from './rollup-plugins/code-asset';

export { ModuleOption, enumerateModuleOptionReps, parseModuleOption };

function equalPathIgnoreDriverLetterCase (lhs: string, rhs: string) {
    if (lhs.length !== rhs.length) {
        return false;
    }
    if (lhs.length < 2 || lhs[1] !== '.' || rhs[1] !== '.') {
        return lhs === rhs;
    }
    if (lhs[0].toLowerCase() !== rhs[0].toLowerCase()) {
        return false;
    }
    return lhs.indexOf(rhs.substr(2), 2) === 2;
}

const equalPath = process.platform === 'win32'
    ? equalPathIgnoreDriverLetterCase
    : (lhs: string, rhs: string) => lhs === rhs;

function makePathEqualityKey (path: string) {
    return process.platform === 'win32' ? path.toLocaleLowerCase() : path;
}

async function build (options: build.Options) {
    console.debug(`Build-engine options: ${JSON.stringify(options, undefined, 2)}`);
    return doBuild({
        options,
    });
}

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace build {
    export interface Options {
        /**
         * 引擎仓库目录。
         */
        engine: string;

        /**
         * 包含的功能。
         */
        features?: string[];

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

        mode?: string;

        platform?: string;

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

        /**
         * How to generate the URL of external assets.
         */
        assetURLFormat?: rpAssetRef.Format;

        visualize?: boolean | {
            file?: string;
        };

        buildTimeConstants: IBuildTimeConstants;
    }

    export interface Result {
        /**
         * Mappings between feature unit name and their actual chunk file, for example:
         * ```js
         * {
         *   "core": "./core.js",
         *   "gfx-webgl": "./gfx-webgl.js",
         * }
         * ```
         */
        exports: Record<string, string>;

        dependencyGraph?: Record<string, string[]>;

        hasCriticalWarns: boolean;
    }

    export async function transform (code: string, moduleOption: ModuleOption, loose?: boolean) {
        const babelFormat = moduleOptionsToBabelEnvModules(moduleOption);
        const babelFileResult = await babel.transformAsync(code, {
            presets: [[babelPresetEnv, { modules: babelFormat, loose: loose ?? true } as babelPresetEnv.Options]],
        });
        if (!babelFileResult || !babelFileResult.code) {
            throw new Error(`Failed to transform!`);
        }
        return {
            code: babelFileResult.code,
        };
    }
}

export { build };

async function doBuild ({
    options,
}: {
    options: build.Options;
}): Promise<build.Result> {
    const realpath = typeof realFs.realpath.native === 'function' ? realFs.realpath.native : realFs.realpath;
    const realPath = (file: string) => new Promise<string>((resolve, reject) => {
        realpath(file, (err, path) => {
            if (err && err.code !== 'ENOENT') {
                reject(err);
            } else {
                resolve(err ? file : path);
            }
        });
    });

    // default options value
    options.buildTimeConstants.UI_GPU_DRIVEN ??= false;

    const doUglify = !!options.compress;
    const engineRoot = ps.resolve(options.engine);

    const moduleOption = options.moduleFormat ?? ModuleOption.iife;
    const rollupFormat = moduleOptionsToRollupFormat(moduleOption);

    let { ammoJsWasm } = options;
    if (ammoJsWasm === 'fallback'
        && moduleOption !== ModuleOption.system) {
        console.warn('--ammojs-wasm=fallback is only available under SystemJS target.');
        ammoJsWasm = false;
    }

    const statsQuery = await StatsQuery.create(engineRoot);

    if (options.features) {
        for (const feature of options.features) {
            if (!statsQuery.hasFeature(feature)) {
                console.warn(`'${feature}' is not a valid feature.`);
            }
        }
    }

    let features: string[];
    let split = options.split ?? false;
    if (options.features && options.features.length !== 0) {
        features = options.features;
    } else {
        features = statsQuery.getFeatures();
        if (split !== true) {
            split = true;
            console.warn(
                `You did not specify features which implies 'split: true'. `
                + `Explicitly set 'split: true' to suppress this warning.`,
            );
        }
    }

    const moduleOverrides = Object.entries(statsQuery.evaluateModuleOverrides({
        mode: options.mode,
        platform: options.platform,
        buildTimeConstants: options.buildTimeConstants,
    })).reduce((result, [k, v]) => {
        result[makePathEqualityKey(k)] = v;
        return result;
    }, {} as Record<string, string>);

    const featureUnits = statsQuery.getUnitsOfFeatures(features);

    const rpVirtualOptions: Record<string, string> = {};
    const vmInternalConstants = statsQuery.evaluateEnvModuleSourceFromRecord({
        EXPORT_TO_GLOBAL: true,
        ...options.buildTimeConstants,
    });
    console.debug(`Module source "internal-constants":\n${vmInternalConstants}`);
    rpVirtualOptions['internal:constants'] = vmInternalConstants;

    const forceStandaloneModules = ['wait-for-ammo-instantiation', 'decorator'];

    let rollupEntries: NonNullable<rollup.RollupOptions['input']> | undefined;
    if (split) {
        rollupEntries = featureUnits.reduce((result, featureUnit) => {
            result[featureUnit] = statsQuery.getFeatureUnitFile(featureUnit);
            return result;
        }, {} as Record<string, string>);
    } else {
        rollupEntries = {
            cc: 'cc',
        };
        const selectedFeatureUnits = [];
        for (const featureUnit of featureUnits) {
            if (forceStandaloneModules.includes(featureUnit)) {
                rollupEntries[featureUnit] = statsQuery.getFeatureUnitFile(featureUnit);
            } else {
                selectedFeatureUnits.push(featureUnit);
            }
        }

        rpVirtualOptions.cc = statsQuery.evaluateIndexModuleSource(
            selectedFeatureUnits,
            (featureUnit) => filePathToModuleRequest(statsQuery.getFeatureUnitFile(featureUnit)),
        );
        rollupEntries.cc = 'cc';

        console.debug(`Module source "cc":\n${rpVirtualOptions.cc}`);
    }

    const presetEnvOptions: babelPresetEnvOptions = {
        loose: options.loose ?? true,
        // We need explicitly specified targets.
        // Ignore it to avoid the engine's parent dirs contain unexpected config.
        ignoreBrowserslistConfig: true,
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

    interface BabelOverrides {
        overrides?: Array<{
            test: RegExp | string;
        } & babel.TransformOptions>,
    }

    const babelOptions: RollupBabelInputPluginOptions & BabelOverrides = {
        babelHelpers: 'bundled',
        extensions: ['.js', '.ts'],
        exclude: [
            /node_modules[/\\]@cocos[/\\]ammo/,
            /node_modules[/\\]@cocos[/\\]cannon/,
            /node_modules[/\\]@cocos[/\\]physx/,
        ],
        comments: false, // Do not preserve comments, even in debug build since we have source map
        overrides: [{
            // Eliminates the babel compact warning:
            // 'The code generator has deoptimised the styling of ...'
            // that came from node_modules/@cocos
            test: /node_modules[/\\]@cocos[/\\]/,
            compact: true,
        }],
        plugins: babelPlugins,
        presets: [
            [babelPresetEnv, presetEnvOptions],
            [babelPresetCc, {
                allowDeclareFields: true,
            } as babelPresetCc.Options],
        ],
    };

    const rollupPlugins: rollup.Plugin[] = [];

    const codeAssetMapping: Record<string, string> = {};
    if (rollupFormat === 'system' || rollupFormat === 'systemjs') {
        // `@cocos/physx` is too big(~6Mb) and cause memory crash.
        // Our temporary solution: exclude @cocos/physx from bundling and connect it with source map.
        rollupPlugins.push(codeAsset({
            resultMapping: codeAssetMapping,
            include: [
                /node_modules[/\\]@cocos[/\\]physx/,
            ],
        }));
    }

    if (options.noDeprecatedFeatures) {
        rollupPlugins.push(removeDeprecatedFeatures(
            typeof options.noDeprecatedFeatures === 'string' ? options.noDeprecatedFeatures : undefined,
        ));
    }

    rollupPlugins.push(
        rpAssetRef({
            format: options.assetURLFormat,
        }),

        {
            name: '@cocos/build-engine|module-overrides',
            resolveId (source, importer) {
                if (moduleOverrides[source]) {
                    return source;
                } else {
                    return null;
                }
            },
            load (this, id: string) {
                const key = makePathEqualityKey(id);
                if (!(key in moduleOverrides)) {
                    return null;
                }
                const replacement = moduleOverrides[key];
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
            jail: await realPath(engineRoot),
            rootDir: engineRoot,
        }),

        json({
            preferConst: true,
        }),

        commonjs({
            include: [
                /node_modules[/\\]/,
            ],
            sourceMap: false,
        }),

        rpBabel({
            skipPreflightCheck: true,
            ...babelOptions,
        }),
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

            // https://github.com/rollup/rollup/issues/3315
            // We only do this for CommonJS.
            // Especially, we cannot do this for IIFE.
            toplevel: rollupFormat === 'cjs',
        }));
    }

    const visualizeOptions = typeof options.visualize === 'object'
        ? options.visualize
        : (options.visualize ? {} : undefined);
    if (visualizeOptions) {
        let rpVisualizer;
        try {
            // @ts-expect-error: No typing
            rpVisualizer = await import('rollup-plugin-visualizer');
        } catch {
            console.warn('Visualizing needs \'rollup-plugin-visualizer\' to be installed. It\'s installed as dev-dependency.');
        }
        if (rpVisualizer) {
            const visualizeFile = visualizeOptions.file ?? ps.join(options.out, 'visualize.html');
            rollupPlugins.push(rpVisualizer({
                filename: visualizeFile,
                title: 'Cocos Creator build visualizer',
                template: 'treemap',
            }));
        }
    }

    let hasCriticalWarns = false;

    const rollupWarningHandler: rollup.WarningHandlerWithDefault = (warning, defaultHandler) => {
        if (typeof warning !== 'string') {
            if (warning.code === 'CIRCULAR_DEPENDENCY') {
                hasCriticalWarns = true;
            } else if (warning.code === 'THIS_IS_UNDEFINED') {
                // TODO: It's really inappropriate to do this...
                // Let's fix these files instead of suppressing rollup.
                if (warning.id?.match(/(?:spine-core\.js$)|(?:dragonBones\.js$)/)) {
                    console.debug(`Rollup warning 'THIS_IS_UNDEFINED' is omitted for ${warning.id}`);
                    return;
                }
            }
        }

        defaultHandler(warning);
    };

    const rollupOptions: rollup.InputOptions = {
        input: rollupEntries,
        plugins: rollupPlugins,
        cache: false,
        onwarn: rollupWarningHandler,
    };

    const perf = true;

    if (perf) {
        rollupOptions.perf = true;
    }

    const bulletAsmJsModule = await nodeResolveAsync('@cocos/bullet/bullet.cocos.js');
    const wasmBinaryPath = ps.join(bulletAsmJsModule, '..', 'bullet.wasm.wasm');
    if (ammoJsWasm === true || ammoJsWasm === 'fallback') {
    rpVirtualOptions['@cocos/bullet'] = `
import wasmBinaryURL from '${pathToAssetRefURL(wasmBinaryPath)}';
export default wasmBinaryURL;
`;
    } else {
    rpVirtualOptions['@cocos/bullet'] = `
import Bullet from '${filePathToModuleRequest(bulletAsmJsModule)}';
export default Bullet;
`;
    }

    const rollupBuild = await rollup.rollup(rollupOptions);

    const timing = rollupBuild.getTimings?.();
    if (timing) {
        console.debug(`==== Performance ====`);
        console.debug(JSON.stringify(timing));
        console.debug(`====             ====`);
    }

    const { incremental: incrementalFile } = options;
    if (incrementalFile) {
        const watchFiles: Record<string, number> = {};
        const files = rollupBuild.watchFiles;
        await Promise.all(files.map(async (watchFile) => {
            try {
                const stat = await fs.stat(watchFile);
                watchFiles[watchFile] = stat.mtimeMs;
            } catch {
                // the `watchFiles` may contain non-fs modules.
            }
        }));
        await fs.ensureDir(ps.dirname(incrementalFile));
        await fs.writeFile(incrementalFile, JSON.stringify(watchFiles, undefined, 2));
    }

    const result: build.Result = {
        exports: {},
        hasCriticalWarns: false,
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
                if (chunkName in rollupEntries || chunkName === 'cc') {
                    validEntryChunks[chunkName] = output.fileName;
                }
            }
        }
    }

    Object.assign(result.exports, validEntryChunks);

    Object.assign(result.exports, codeAssetMapping);

    result.dependencyGraph = {};
    for (const output of rollupOutput.output) {
        if (output.type === 'chunk') {
            result.dependencyGraph[output.fileName] = output.imports.concat(output.dynamicImports);
        }
    }

    result.hasCriticalWarns = hasCriticalWarns;

    return result;

    async function nodeResolveAsync (specifier: string) {
        return new Promise<string>((r, reject) => {
            nodeResolve(specifier, {
                basedir: engineRoot,
            }, (err, resolved, pkg) => {
                if (err) {
                    reject(err);
                } else {
                    r(resolved as string);
                }
            });
        });
    }
}

function moduleOptionsToRollupFormat (moduleOptions: ModuleOption): rollup.ModuleFormat {
    switch (moduleOptions) {
    case ModuleOption.cjs: return 'cjs';
    case ModuleOption.esm: return 'esm';
    case ModuleOption.system: return 'system';
    case ModuleOption.iife: return 'iife';
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    default: throw new Error(`Unknown module format ${moduleOptions}`);
    }
}

function moduleOptionsToBabelEnvModules (moduleOptions: ModuleOption):
| false
| 'commonjs'
| 'amd'
| 'umd'
| 'systemjs'
| 'auto' {
    switch (moduleOptions) {
    case ModuleOption.cjs: return 'commonjs';
    case ModuleOption.system: return 'systemjs';
    case ModuleOption.iife:
    case ModuleOption.esm: return false;
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    default: throw new Error(`Unknown module format ${moduleOptions}`);
    }
}

export async function isSourceChanged (incrementalFile: string) {
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
            /* eslint-disable-next-line no-await-in-loop */
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

    const isGroupItem = (item: Item): item is GroupItem => 'options' in item;

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
                    // @ts-expect-error: By convention
                    addEntry(item.entry);
                }
            }
        }
    }
    return result;
}
