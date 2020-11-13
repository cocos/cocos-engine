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
import { ModuleOption, enumerateModuleOptionReps, parseModuleOption } from './module-option';
import { generateCCSource } from './make-cc';
import tsConfigPaths from './ts-paths';
import removeDeprecatedFeatures from './remove-deprecated-features';
import overrideModules from './override-modules';
import { filePathToModuleRequest } from './utils';
import type { ConfigContext } from '../../who-am-i/lib/contextual-build-config';

export { ModuleOption, enumerateModuleOptionReps, parseModuleOption };

async function build (options: build.Options) {
    console.debug(`Build-engine options: ${JSON.stringify(options, undefined, 2)}`);

    let moduleEntries: string[];
    if (!options.moduleEntries || options.moduleEntries.length === 0) {
        console.debug('No module entry specified, default module entries will be used.');
        moduleEntries = await getDefaultModuleEntries(options.engine);
    } else {
        moduleEntries = options.moduleEntries;
    }

    if (moduleEntries) {
        moduleEntries = Array.from(new Set(moduleEntries));
    }

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

        mode?: string;

        platform?: string;

        debug?: boolean;

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

        buildTimeConstants?: Record<string, string>;
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

async function _doBuild ({
    moduleEntries,
    options,
}: {
    moduleEntries?: string[];
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

    const doUglify = !!options.compress;
    const split = options.split ?? false;
    const engineRoot = ps.resolve(options.engine);

    const moduleOption = options.moduleFormat ?? ModuleOption.iife;
    const rollupFormat = moduleOptionsToRollupFormat(moduleOption);

    let { ammoJsWasm } = options;
    if (ammoJsWasm === 'fallback'
        && moduleOption !== ModuleOption.system) {
        console.warn('--ammojs-wasm=fallback is only available under SystemJS target.');
        ammoJsWasm = false;
    }

    const rpVirtualOptions: Record<string, string> = {};

    // Let's import some stuffs in lib 'who-am-i'.
    const libWhoAmI = ps.join(engineRoot, 'scripts', 'who-am-i', 'lib');
    const [
        { getPublicModules, getForceStandaloneModules },
        { generateBuildTimeConstants },
        { default: buildConfigFunction },
    ] = await Promise.all([
        import(`${libWhoAmI}/public-modules`) as Promise<typeof import('../../who-am-i/lib/public-modules')>,
        import(`${libWhoAmI}/build-time-constants`) as Promise<typeof import('../../who-am-i/lib/build-time-constants')>,
        import(`${libWhoAmI}/contextual-build-config`) as Promise<typeof import('../../who-am-i/lib/contextual-build-config')>,
    ]);

    // The modules included in this build.
    const includedPublicModules = await filterIncludedPublicModules();

    // Make up 'internal:constants'.
    await makeUpInternalConstantsModule();

    // Build config.
    const config = await getConfig();

    // Rollup inputs.
    const rollupInput = getRollupInput(includedPublicModules);

    // Rollup plugins.
    const rollupPlugins = await collectRollupPlugins();

    const rollupOptions: rollup.InputOptions = {
        input: rollupInput,
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
        await writeIncrementalFile(rollupBuild, incrementalFile);
    }

    const rollupOutput = await rollupBuild.write(getRollupOutputOptions());

    const result: build.Result = {
        exports: {},
    };

    await writeMetadata(rollupOutput);

    if (ammoJsWasm === 'fallback' || ammoJsWasm === true) {
        await fs.copy(
            ps.join(ammoJsWasmModule, '..', 'ammo.wasm.wasm'),
            ps.join(options.out, 'ammo.wasm.wasm'),
        );
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
                    r(resolved as string);
                }
            });
        });
    }

    interface BabelOverrides {
        overrides?: Array<{
            test: RegExp | string;
        } & babel.TransformOptions>,
    }

    async function getConfig () {
        const configContext: ConfigContext = {
            mode: options.mode,
            platform: options.platform,
            entries: Object.keys(includedPublicModules),
        };

        const config = await buildConfigFunction(configContext);

        return config;
    }

    async function filterIncludedPublicModules () {
        const publicModules = await getPublicModules(engineRoot) as Record<string, string>;

        if (split) {
            return publicModules;
        }

        return (moduleEntries ?? []).reduce((result, entry) => {
            const id = `cc.${entry}`; // TODO: `moduleEntries` should be module ids.
            if (!(id in publicModules)) {
                console.warn(`${id} is not a module`);
            } else {
                result[id] = publicModules[id];
            }
            return result;
        }, {} as Record<string, string>);
    }

    async function makeUpInternalConstantsModule () {
        const buildTimeConstants = await getBuildTimeConstants();

        const vmInternalConstants = getModuleSourceInternalConstants(buildTimeConstants);
        console.debug(`Module source "internal-constants":\n${vmInternalConstants}`);
        rpVirtualOptions['internal:constants'] = vmInternalConstants;
    }

    async function getBuildTimeConstants () {
        return options.buildTimeConstants ?? (async () =>
            /* eslint-disable-next-line */
             await generateBuildTimeConstants({
                mode: options.mode,
                platform: options.platform,
                debug: options.debug,
            })
        )();
    }

    function getRollupInput (includedPublicModules: Record<string, string>) {
        let rollupEntries: NonNullable<rollup.RollupOptions['input']> | undefined;
        if (split) {
            rollupEntries = { ...includedPublicModules };
        } else {
            rollupEntries = {
                cc: 'cc',
            };
            const forceStandaloneModules = getForceStandaloneModules();
            const bundledModules = [];
            for (const [moduleName, moduleFile] of Object.entries(includedPublicModules)) {
                if (forceStandaloneModules.includes(moduleName)) {
                    rollupEntries[moduleName] = moduleFile;
                } else {
                    bundledModules.push(filePathToModuleRequest(moduleFile));
                }
            }

            rpVirtualOptions.cc = generateCCSource(bundledModules);
            rollupEntries.cc = 'cc';

            console.debug(`Module source "cc":\n${rpVirtualOptions.cc}`);
        }

        return rollupEntries;
    }

    function getRollupOutputOptions () {
        const rollupOutputOptions: rollup.OutputOptions = {
            format: rollupFormat,
            sourcemap: options.sourceMap,
            sourcemapFile: options.sourceMapFile,
            name: (rollupFormat === 'iife' ? 'ccm' : undefined),
            dir: options.out,
            // minifyInternalExports: false,
            // preserveEntrySignatures: "allow-extension",
        };
        return rollupOutputOptions;
    }

    async function collectRollupPlugins () {
        const rollupPlugins: rollup.Plugin[] = [];

        if (options.noDeprecatedFeatures) {
            rollupPlugins.push(removeDeprecatedFeatures(
                typeof options.noDeprecatedFeatures === 'string' ? options.noDeprecatedFeatures : undefined,
            ));
        }

        if (config.moduleOverrides) {
            rollupPlugins.push(overrideModules(engineRoot, config.moduleOverrides));
        }

        rollupPlugins.push(
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

            rpBabel(getBabelOptions()),
        );

        if (options.progress) {
            rollupPlugins.unshift(rpProgress());
        }

        if (doUglify) { // TODO: tree-shaking not clear!
            rollupPlugins.push(rpTerser(getTerserOptions()));
        }

        const visualizePlugin = await handleVisualizeOption();
        if (visualizePlugin) {
            await handleVisualizeOption();
        }

        return rollupPlugins;
    }

    function getBabelOptions () {
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

        const babelOptions: RollupBabelInputPluginOptions & BabelOverrides = {
            babelHelpers: 'bundled',
            extensions: ['.js', '.ts'],
            exclude: config.transformExcludes,
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
        return babelOptions;
    }

    function getTerserOptions () {
        return {
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
        };
    }

    async function handleVisualizeOption () {
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
                return rpVisualizer({
                    filename: visualizeFile,
                    title: 'Cocos Creator 3D build visualizer',
                    template: 'treemap',
                }) as rollup.Plugin;
            }
        }
    }

    async function writeIncrementalFile (
        rollupBuild: rollup.RollupBuild,
        incrementalFile: string,
    ) {
        const watchFiles: Record<string, number> = {};
        const files = rollupBuild.watchFiles.concat([
        ]);
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

    async function writeMetadata (rollupOutput: rollup.RollupOutput) {
        const validEntryChunks: Record<string, string> = {};
        for (const output of rollupOutput.output) {
            if (output.type === 'chunk') {
                if (output.isEntry) {
                    const chunkName = output.name;
                    if (chunkName in includedPublicModules || chunkName === 'cc') {
                        validEntryChunks[chunkName] = output.fileName;
                    }
                }
            }
        }

        Object.assign(result.exports, validEntryChunks);

        result.dependencyGraph = {};
        for (const output of rollupOutput.output) {
            if (output.type === 'chunk') {
                result.dependencyGraph[output.fileName] = output.imports.concat(output.dynamicImports);
            }
        }
    }
}

function getModuleSourceInternalConstants (buildTimeConstants: Record<string, any>) {
    return Object.entries(buildTimeConstants).map(([k, v]) => `export const ${k} = ${v};`).join('\n');
}

function moduleOptionsToRollupFormat (moduleOptions: ModuleOption): rollup.ModuleFormat {
    switch (moduleOptions) {
    case ModuleOption.cjs: return 'cjs';
    case ModuleOption.esm: return 'esm';
    case ModuleOption.system: return 'system';
    case ModuleOption.iife: return 'iife';
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
