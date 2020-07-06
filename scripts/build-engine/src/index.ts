
import fs from 'fs-extra';
import ps from 'path';
// @ts-ignore
import babel from 'rollup-plugin-babel';
// @ts-ignore
import multiEntry from 'rollup-plugin-multi-entry';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
// @ts-ignore
import babelPresetEnv from '@babel/preset-env';
import babelPresetCc from '@cocos/babel-preset-cc';
// @ts-ignore
import babelPluginTransformForOf from '@babel/plugin-transform-for-of';
import * as rollup from 'rollup';
// @ts-ignore
import rpProgress from 'rollup-plugin-progress';
// @ts-ignore
import rpVirtual from '@rollup/plugin-virtual';

async function build (options: build.Options) {
    if (!options.moduleEntries || options.moduleEntries.length === 0) {
        console.debug(`No module entry specified, default module entries will be used.`);
        options.moduleEntries = await getDefaultModuleEntries(options.engine);
    }

    _ensureUniqueModules(options);

    const buildTimeConstants = populateBuildTimeConstants(options);
    return await _doBuild(Object.assign(options, { buildTimeConstants }));
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
         * 指定输出路径。
         */
        outputPath: string;

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
         * 构建模式。
         */
        mode?: Mode;

        /**
         * 目标平台。
         */
        platform?: Platform;

        /**
         * 引擎标志。
         */
        flags?: BuildFlags;

        /**
         * Experimental.
         */
        incremental?: string;

        progress?: boolean;

        /**
         * `options.targets` of @babel/preset-env.
         */
        targets?: string | string[] | Record<string, string>;
    }
}

export { build };

function resolveModuleEntry (moduleEntry: string, engine: string) {
    return ps.normalize(ps.join(engine, 'exports', `${moduleEntry}.ts`));
}

const moduleInfoTable: Record<string, {
    requiredFlags: string[];
}> = {
    'physics-builtin': {
        requiredFlags: ['CC_PHYSICS_BUILTIN'],
    },
    'physics-cannon': {
        requiredFlags: ['CC_PHYSICS_CANNON'],
    },
    'physics-ammo': {
        requiredFlags: ['CC_PHYSICS_AMMO'],
    },
};

function _ensureUniqueModules (options: build.Options) {
    const uniqueModuleEntries: string[] = [];
    for (const moduleEntry of options.moduleEntries!) {
        if (uniqueModuleEntries.indexOf(moduleEntry) < 0) {
            uniqueModuleEntries.push(moduleEntry);
        }
    }
    options.moduleEntries = uniqueModuleEntries;
}

async function _doBuild (options: build.Options & { buildTimeConstants: BuildTimeConstants; }) {
    console.debug(`Build-engine options: ${JSON.stringify(options, undefined, 2)}`);
    const doUglify = !!options.compress;

    let format: rollup.ModuleFormat = 'iife';
    switch (options.moduleFormat) {
        case ModuleOption.cjs:
            format = 'cjs';
            break;
        case ModuleOption.esm:
            format = 'esm';
            break;
        case ModuleOption.system:
            format = 'system';
            break;
    }

    const presetEnvOptions: any = {};
    if (options.targets !== undefined) {
        presetEnvOptions.targets = options.targets;
    }

    const babelPlugins: any[] = [];
    if (options.targets === undefined) {
        babelPlugins.push([babelPluginTransformForOf, {
            loose: true,
        }]);
    }

    const babelOptions = {
        extensions: ['.js', '.ts'],
        highlightCode: true,
        ignore: [
            ps.join(options.engine, 'node_modules/@cocos/ammo/**'),
            ps.join(options.engine, 'node_modules/@cocos/cannon/**'),
        ],
        plugins: babelPlugins,
        presets: [
            [babelPresetEnv, presetEnvOptions],
            [babelPresetCc, {
                allowDeclareFields: true,
            } as babelPresetCc.Options],
        ],
    };

    const rollupPlugins: rollup.Plugin[] = [
        multiEntry(),

        resolve({
            extensions: ['.js', '.ts', '.json'],
        }),

        json({
            preferConst: true,
        }),

        babel(babelOptions),

        commonjs({
            namedExports: {
                '@cocos/ammo': ['Ammo'],
                '@cocos/cannon': ['CANNON'],
            },
        }),
    ];

    if (options.progress) {
        rollupPlugins.unshift(rpProgress());
    }

    const vmInternalConstants = Object.entries(options.buildTimeConstants).map(([k, v]) => {
        const ck = k.startsWith('CC_') ? k.substr(3) : k;
        return `export const ${ck} = ${v};`;
    }).join('\n');
    console.debug(`Code of "internal-constants": ${vmInternalConstants}`);

    rollupPlugins.push(rpVirtual({
        'internal:constants': vmInternalConstants,
    }));

    /** adapt: reduce_funcs not suitable for ammo.js */
    const defines = options.buildTimeConstants as BuildTimeConstants;
    const isReduceFuncs = !defines.CC_PHYSICS_AMMO;

    rollupPlugins.push(terser({
        compress: {
            // global_defs: options.buildTimeConstants,
            reduce_funcs: isReduceFuncs
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
        toplevel: format === 'cjs',
    }));

    const moduleEntries = options.moduleEntries!.map((moduleEntry) => resolveModuleEntry(moduleEntry, options.engine)).filter((moduleEntry) => {
        const exists = fs.pathExistsSync(moduleEntry);
        if (exists) {
            return true;
        } else {
            console.warn(`Cannot find engine module ${moduleEntry}. it's ignored.`);
            return false;
        }
    });

    const rollupBuild = await rollup.rollup({
        input: moduleEntries,
        plugins: rollupPlugins,
    });

    const { incremental: incrementalFile } = options;
    if (incrementalFile) {
        const watchFiles: Record<string, number> = {};
        for (const watchFile of rollupBuild.watchFiles) {
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

    await rollupBuild.write({
        format,
        sourcemap: options.sourceMap,
        sourcemapFile: options.sourceMapFile,
        name: (format === 'iife' ? 'ccm' : undefined),
        file: options.outputPath,
    });
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

export enum Platform {
    HTML5,
    WECHAT,
    ALIPAY,
    BAIDU,
    XIAOMI,
    OPPO,
    VIVO,
    HUAWEI,
    NATIVE,
    COCOSPLAY,
}

export function enumeratePlatformReps () {
    return Object.values(Platform).filter((value) => typeof value === 'string') as Array<keyof typeof Platform>;
}

export function parsePlatform (rep: string) {
    return Reflect.get(Platform, rep);
}

export enum Mode {
    universal,
    editor,
    preview,
    build,
    test,
}

export function enumerateBuildModeReps () {
    return Object.values(Mode).filter((value) => typeof value === 'string') as Array<keyof typeof Mode>;
}

export function parseBuildMode (rep: string) {
    return Reflect.get(Mode, rep);
}

export enum Physics {
    cannon,
    ammo,
    builtin,
}

export function enumeratePhysicsReps () {
    return Object.values(Physics).filter((value) => typeof value === 'string');
}

export function parsePhysics (rep: string) {
    return Reflect.get(Physics, rep);
}

export enum ModuleOption {
    esm,
    cjs,
    system,
    iife,
}

export function enumerateModuleOptionReps () {
    return Object.values(ModuleOption).filter((value) => typeof value === 'string') as Array<keyof typeof ModuleOption>;
}

export function parseModuleOption (rep: string) {
    return Reflect.get(ModuleOption, rep);
}

export interface BuildFlags {
    jsb?: boolean;
    runtime?: boolean;
    wechatgame?: boolean;
    qqplay?: boolean;
    debug?: boolean;
    nativeRenderer?: boolean;
}

interface BuildTimeConstants {
    // BuildMode macros
    CC_EDITOR?: boolean;
    CC_PREVIEW?: boolean;
    CC_BUILD?: boolean;
    CC_TEST?: boolean;

    // Platform macros
    CC_HTML5?: boolean;
    CC_WECHAT?: boolean;
    CC_ALIPAY?: boolean;
    CC_BAIDU?: boolean;
    CC_XIAOMI?: boolean;
    CC_OPPO?: boolean;
    CC_VIVO?: boolean;
    CC_HUAWEI?: boolean;
    CC_NATIVE?: boolean;
    CC_COCOSPLAY?: boolean;

    // engine use platform macros
    CC_RUNTIME_BASED?: boolean;
    CC_MINIGAME?: boolean;
    CC_JSB?: boolean;

    // Flag macros
    CC_DEBUG?: boolean;

    // Debug macros
    CC_DEV?: boolean;
    CC_SUPPORT_JIT?: boolean;

    // Physics macros
    CC_PHYSICS_CANNON?: boolean;
    CC_PHYSICS_AMMO?: boolean;
    CC_PHYSICS_BUILTIN?: boolean;
}

function populateBuildTimeConstants (options: build.Options) {
    const buildMode = options.mode ?? Mode.universal;
    const platform = options.platform;
    const flags = options.flags;

    const BUILD_MODE_MACROS = ['CC_EDITOR', 'CC_PREVIEW', 'CC_BUILD', 'CC_TEST'];
    const PLATFORM_MACROS = ['CC_HTML5', 'CC_WECHAT', 'CC_ALIPAY', 'CC_BAIDU', 'CC_XIAOMI', 'CC_OPPO', 'CC_VIVO', 'CC_HUAWEI', 'CC_NATIVE', 'CC_COCOSPLAY'];
    const FLAGS = ['debug'];

    const buildModeMacro = ('CC_' + Mode[buildMode]).toUpperCase();
    if (BUILD_MODE_MACROS.indexOf(buildModeMacro) === -1 && buildMode !== Mode.universal) {
        throw new Error(`Unknown build mode ${buildMode}.`);
    }
    const platformMacro = ('CC_' + Platform[platform!]).toUpperCase();
    if ( PLATFORM_MACROS.indexOf(platformMacro) === -1) {
        throw new Error(`Unknown platform ${platform}.`);
    }
    const result: BuildTimeConstants = {};
    for (const macro of BUILD_MODE_MACROS) {
        result[macro as keyof BuildTimeConstants] = (macro === buildModeMacro);
    }

    for (const macro of PLATFORM_MACROS) {
        result[macro as keyof BuildTimeConstants] = (macro === platformMacro);
    }

    if (flags) {
        for (const flag in flags) {
            if (flags.hasOwnProperty(flag) && flags[flag as keyof BuildFlags]) {
                if (FLAGS.indexOf(flag) === -1) {
                    throw new Error('Unknown flag: ' + flag);
                }
            }
        }
    }
    for (const flag of FLAGS) {
        const macro = 'CC_' + flag.toUpperCase();
        result[macro as keyof BuildTimeConstants] = !!(flags && flags[flag as keyof BuildFlags]);
    }

    result.CC_RUNTIME_BASED = false;
    result.CC_MINIGAME = false;
    result.CC_DEV = result.CC_EDITOR || result.CC_PREVIEW || result.CC_TEST;
    result.CC_DEBUG = result.CC_DEBUG || result.CC_DEV;
    result.CC_RUNTIME_BASED = result.CC_OPPO || result.CC_VIVO || result.CC_HUAWEI || result.CC_COCOSPLAY;
    result.CC_MINIGAME = result.CC_WECHAT || result.CC_ALIPAY || result.CC_XIAOMI || result.CC_BAIDU;
    result.CC_JSB = result.CC_NATIVE;
    result.CC_SUPPORT_JIT = !(result.CC_MINIGAME || result.CC_RUNTIME_BASED);
    result.CC_PHYSICS_BUILTIN = false;
    result.CC_PHYSICS_CANNON = false;
    result.CC_PHYSICS_AMMO = false;

    for (const moduleEntry of options.moduleEntries!) {
        if (moduleEntry in moduleInfoTable) {
            for (const flag of moduleInfoTable[moduleEntry].requiredFlags) {
                // @ts-ignore
                result[flag] = true;
            }
        }
    }

    return result;
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
