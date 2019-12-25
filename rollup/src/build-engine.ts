import { existsSync } from 'fs';
import fs from 'fs-extra';
import { dirname, join, normalize, relative } from 'path';
import { rollup, ModuleFormat } from 'rollup';
// @ts-ignore
import babel from 'rollup-plugin-babel';
// @ts-ignore
import commonjs from 'rollup-plugin-commonjs';
// @ts-ignore
import json from 'rollup-plugin-json';
// @ts-ignore
import multiEntry from 'rollup-plugin-multi-entry';
// @ts-ignore
import resolve from 'rollup-plugin-node-resolve';
// @ts-ignore
import { uglify } from 'rollup-plugin-uglify';
// @ts-ignore
import { excludes } from '../plugin/rollup-plugin-excludes';
import { terser } from 'rollup-plugin-terser';
// @ts-ignore
import babelPresetEnv from '@babel/preset-env';
import babelPresetCc from '@cocos/babel-preset-cc';
import { writeFile, ensureDir } from 'fs-extra';

interface IBaseOptions {
    moduleEntries: string[];

    /**
     * 指定输出路径。
     * 你仍应该自己写入生成代码到此文件中。
     */
    outputPath: string;

    /**
     * 输出模块格式。
     * @default ModuleOption.system
     */
    moduleFormat?: ModuleOption;

    /**
     * 排除的模块。
     * @default []
     */
    excludes?: string[];

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
    sourcemap?: boolean | 'inline';

    /**
     * 若 `sourcemap` 为 `true`，此选项指定了 source map 的路径。
     * 此选项只是为了在生成的结果代码中说明 source map 的相对位置，
     * 所以你仍应该自己写入 source map 的内容到此文件中。
     * @default `${outputPath.map}`
     */
    sourcemapFile?: string;

    watchFiles?: boolean;
}

interface IAdvancedOptions extends IBaseOptions {
    globalDefines: object;
}

export interface IBuildOptions extends IBaseOptions {
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
    flags?: IFlags;
}

export async function build (options: IBuildOptions) {
    _checkPhysicsFlag(options);
    _ensureUniqueModules(options);

    const globalDefines = getGlobalDefs(options);
    return await _internalBuild(Object.assign(options, {globalDefines}));
}

function resolveModuleEntry (moduleEntry: string) {
    return normalize(`${__dirname}/../../exports/${moduleEntry}.ts`);
}

interface IModuleInfo {
    requiredFlags: string[];
}

const moduleInfoTable: Record<string, IModuleInfo> = {
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

function _checkPhysicsFlag (options: IBuildOptions) {
    // const physicsModulesMap = {
    //     [Physics.builtin]: `physics-builtin`,
    //     [Physics.cannon]: `physics-cannon`,
    //     [Physics.ammo]: `physics-ammo`,
    // };
    // const allowedPhysicsModules = Object.values(physicsModulesMap);

    // if (options.moduleEntries.some(
    //     (moduleEntry) => allowedPhysicsModules.includes(moduleEntry))) {
    //     console.warn(
    //         `You shall not specify physics module explicitly. ` +
    //         `Use 'physics' option instead.`);
    //     options.moduleEntries = options.moduleEntries.filter(
    //         (moduleEntry) => !allowedPhysicsModules.includes(moduleEntry));
    // }

    // const physics = options.physics === undefined ? Physics.cannon : options.physics;
    // options.moduleEntries.push(physicsModulesMap[physics]);

    // // direct push physics-framework for now
    // options.moduleEntries.push(`physics-framework`);
}

function _ensureUniqueModules (options: IBuildOptions) {
    const uniqueModuleEntries: string[] = [];
    for (const moduleEntry of options.moduleEntries) {
        if (uniqueModuleEntries.indexOf(moduleEntry) < 0) {
            uniqueModuleEntries.push(moduleEntry);
        }
    }
    options.moduleEntries = uniqueModuleEntries;
}

async function _internalBuild (options: IAdvancedOptions) {
    console.log(`Build-engine options: ${JSON.stringify(options, undefined, 2)}`);
    const doUglify = !!options.compress;

    let format: ModuleFormat = 'iife';
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

    const rollupPlugins = [
        multiEntry(),

        excludes({
            modules: options.excludes,
        }),

        resolve({
            extensions: ['.js', '.ts', '.json'],
        }),

        json({
            preferConst: true,
        }),

        babel({
            extensions: ['.js', '.ts'],
            highlightCode: true,
            ignore: [
                'node_modules/@cocos/cannon/**',
            ],
            plugins: [
                ['@babel/plugin-transform-for-of', {
                    loose: true,
                }],
            ],
            presets: [
                babelPresetEnv,
                babelPresetCc,
            ],
        }),

        commonjs({
            namedExports: {
                '@cocos/cannon': ['CANNON'],
            },
        }),
    ];

    if (format === 'esm') {
        rollupPlugins.push(terser({
            compress: {
                global_defs: options.globalDefines,
            },
            mangle: doUglify,
            keep_fnames: !doUglify,
            output: {
                beautify: !doUglify,
            },
            sourcemap: !!options.sourcemap,
        }));
    } else {
        rollupPlugins.push(uglify({
            compress: {
                global_defs: options.globalDefines,
            },
            mangle: doUglify,
            keep_fnames: !doUglify,
            output: {
                beautify: !doUglify,
            },
            sourcemap: !!options.sourcemap,
        }));
    }

    const outputPath = options.outputPath;
    const sourcemapFile = options.sourcemapFile || `${options.outputPath}.map`;

    const moduleEntries = options.moduleEntries.map(resolveModuleEntry).filter((moduleEntry) => {
        const exists = existsSync(moduleEntry);
        if (exists) {
            return true;
        } else {
            console.warn(`Cannot find engine module ${moduleEntry}. it's ignored.`);
            return false;
        }
    });

    const rollupBuild = await rollup({
        input: moduleEntries,
        plugins: rollupPlugins,
    });

    let watchFiles: Record<string, number> | undefined;
    if (options.watchFiles) {
        watchFiles = {};
        for (const watchFile of rollupBuild.watchFiles) {
            try {
                const stat = await fs.stat(watchFile);
                watchFiles[watchFile] = stat.mtimeMs;
            } catch {
                // the `watchFiles` may contain non-fs modules.
            }
        }
    }

    const generated = await rollupBuild.generate({
        format,
        sourcemap: options.sourcemap,
        sourcemapFile,
        name: (format === 'iife' ? 'ccm' : undefined),
    });

    const chunk0 = generated.output[0];
    if (options.sourcemap === true && chunk0.map) {
        const sourceMappingUrl = relative(dirname(outputPath), sourcemapFile);
        return {
            code: `${chunk0.code}\n//# sourceMappingURL=${sourceMappingUrl}`,
            map: chunk0.map.toString(),
            watchFiles,
        };
    } else if (options.sourcemap === 'inline' && chunk0.map) {
        return {
            code: `${chunk0.code}\n//# sourceMappingURL=${chunk0.map.toUrl()}`,
            watchFiles,
        };
    } else {
        return {
            code: chunk0.code,
            watchFiles,
        };
    }
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
}

export function enumerateModuleOptionReps () {
    return Object.values(ModuleOption).filter((value) => typeof value === 'string');
}

export function parseModuleOption (rep: string) {
    return Reflect.get(ModuleOption, rep);
}

export interface IFlags {
    jsb?: boolean;
    runtime?: boolean;
    wechatgame?: boolean;
    qqplay?: boolean;
    debug?: boolean;
    nativeRenderer?: boolean;
}

interface IGlobaldefines {
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

function getGlobalDefs (options: IBuildOptions): object {
    const buildmode = options.mode || Mode.universal;
    const platform = options.platform;
    const flags = options.flags;

    const BUILDMODE_MACROS = ['CC_EDITOR', 'CC_PREVIEW', 'CC_BUILD', 'CC_TEST'];
    const PLATFORM_MACROS = ['CC_HTML5', 'CC_WECHAT', 'CC_ALIPAY', 'CC_BAIDU', 'CC_XIAOMI', 'CC_OPPO', 'CC_VIVO', 'CC_HUAWEI', 'CC_NATIVE', 'CC_COCOSPLAY'];
    const FLAGS = ['debug'];

    const buildmodeMacro = ('CC_' + Mode[buildmode]).toUpperCase();
    if (BUILDMODE_MACROS.indexOf(buildmodeMacro) === -1 && buildmode !== Mode.universal) {
        throw new Error(`Unknown buildmode ${buildmode}.`);
    }
    const platformMacro = ('CC_' + Platform[platform!]).toUpperCase();
    if ( PLATFORM_MACROS.indexOf(platformMacro) === -1) {
        throw new Error(`Unknown platform ${platform}.`);
    }
    const result: IGlobaldefines = {};
    for (const macro of BUILDMODE_MACROS) {
        result[macro as keyof IGlobaldefines] = (macro === buildmodeMacro);
    }

    for (const macro of PLATFORM_MACROS) {
        result[macro as keyof IGlobaldefines] = (macro === platformMacro);
    }

    if (flags) {
        for (const flag in flags) {
            if (flags.hasOwnProperty(flag) && flags[flag as keyof IFlags]) {
                if (FLAGS.indexOf(flag) === -1) {
                    throw new Error('Unknown flag: ' + flag);
                }
            }
        }
    }
    for (const flag of FLAGS) {
        const macro = 'CC_' + flag.toUpperCase();
        result[macro as keyof IGlobaldefines] = !!(flags && flags[flag as keyof IFlags]);
    }

    result.CC_RUNTIME_BASED = false;
    result.CC_MINIGAME = false;
    result.CC_DEV = result.CC_EDITOR || result.CC_PREVIEW || result.CC_TEST;
    result.CC_DEBUG = result.CC_DEBUG || result.CC_DEV;
    result.CC_RUNTIME_BASED = result.CC_OPPO || result.CC_VIVO || result.CC_HUAWEI || result.CC_COCOSPLAY;
    result.CC_MINIGAME = result.CC_WECHAT || result.CC_ALIPAY || result.CC_XIAOMI || result.CC_BAIDU;
    result.CC_JSB = result.CC_NATIVE || result.CC_RUNTIME_BASED;
    result.CC_SUPPORT_JIT = !(result.CC_MINIGAME || result.CC_RUNTIME_BASED);
    result.CC_PHYSICS_BUILTIN = false;
    result.CC_PHYSICS_CANNON = false;
    result.CC_PHYSICS_AMMO = false;

    for (const moduleEntry of options.moduleEntries) {
        if (moduleEntry in moduleInfoTable) {
            for (const flag of moduleInfoTable[moduleEntry].requiredFlags) {
                // @ts-ignore
                result[flag] = true;
            }
        }
    }

    return result;
}
