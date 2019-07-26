import { existsSync } from 'fs';
import { dirname, join, normalize, relative } from 'path';
import { rollup } from 'rollup';
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

interface IBaseOptions {
    moduleEntries: string[];

    /**
     * 指定输出路径。
     * 你仍应该自己写入生成代码到此文件中。
     */
    outputPath: string;

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
}

interface IAdvancedOptions extends IBaseOptions {
    globalDefines: object;
}

export interface IBuildOptions extends IBaseOptions {
    /**
     * 目标平台。
     */
    platform?: Platform;

    /**
     * 使用的物理引擎。
     */
    physics?: Physics;

    /**
     * 引擎标志。
     */
    flags?: IFlags;
}

export async function build (options: IBuildOptions) {
    _checkPhysicsFlag(options);
    const globalDefines = getGlobalDefs(options.platform, options.physics, options.flags);
    return await _internalBuild(Object.assign(options, {globalDefines}));
}

function resolveModuleEntry (moduleEntry: string) {
    return normalize(`${__dirname}/../../exports/${moduleEntry}.ts`);
}

function _checkPhysicsFlag (options: IBuildOptions) {
    const physicsModulesMap = {
        [Physics.builtin]: `physics-builtin`,
        [Physics.cannon]: `physics-cannon`,
        [Physics.ammo]: `physics-ammo`,
    };
    const allowedPhysicsModules = Object.values(physicsModulesMap);

    if (options.moduleEntries.some(
        (moduleEntry) => allowedPhysicsModules.includes(moduleEntry))) {
        console.warn(
            `You shall not specify physics module explicitly. ` +
            `Use 'physics' option instead.`);
        options.moduleEntries = options.moduleEntries.filter(
            (moduleEntry) => !allowedPhysicsModules.includes(moduleEntry));
    }

    const physics = options.physics === undefined ? Physics.cannon : options.physics;
    options.moduleEntries.push(physicsModulesMap[physics]);

    // direct push physics-framework for now
    options.moduleEntries.push(`physics-framework`);
}

async function _internalBuild (options: IAdvancedOptions) {
    console.log(`Build-engine options: ${JSON.stringify(options, undefined, 2)}`);
    const doUglify = !!options.compress;
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
                'node_modules/cannon/**',
                'node_modules/tween.js/**',
            ],
            plugins: [
                ['@babel/plugin-proposal-decorators', {
                    legacy: true,
                }],
                ['@babel/plugin-proposal-class-properties', {
                    loose: true,
                }],
                ['@babel/plugin-transform-for-of', {
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
                'cannon': ['CANNON', 'Shape'],
                'tween.js': ['TWEEN'],
            },
        }),

        uglify({
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
            mangle: doUglify,
            keep_fnames: !doUglify,
            output: {
                beautify: !doUglify,
            },
            sourcemap: options.sourcemap === 'inline' ? { url: 'inline' } : !!options.sourcemap,
        }),
    ];

    const outputPath = options.outputPath;
    const sourcemapFile = options.sourcemapFile || `${options.outputPath}.map`;

    const moduleEntries = options.moduleEntries.map(resolveModuleEntry);
    for (const moduleEntry of moduleEntries) {
        if (!existsSync(moduleEntry)) {
            console.error(`Cannot find engine module ${moduleEntry}`);
        }
    }
    const rollupBuild = await rollup({
        input: moduleEntries,
        plugins: rollupPlugins,
    });
    const generated = await rollupBuild.generate({
        format: 'iife',
        name: 'cc_modular',
        sourcemap: options.sourcemap,
        sourcemapFile,
    });

    const chunk0 = generated.output[0];
    if (options.sourcemap === true && chunk0.map) {
        const sourceMappingUrl = relative(dirname(outputPath), sourcemapFile);
        return {
            code: `${chunk0.code}\n//# sourceMappingURL=${sourceMappingUrl}`,
            map: chunk0.map.toString(),
        };
    } else if (options.sourcemap === 'inline' && chunk0.map) {
        return {
            code: `${chunk0.code}\n//# sourceMappingURL=${chunk0.map.toUrl()}`,
        };
    } else {
        return {
            code: chunk0.code,
        };
    }
}

export enum Platform {
    universal,
    editor,
    preview,
    build,
    test,
}

export function enumeratePlatformReps () {
    return Object.values(Platform).filter((value) => typeof value === 'string');
}

export function parsePlatform (rep: string) {
    return Reflect.get(Platform, rep);
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

export interface IFlags {
    jsb?: boolean;
    runtime?: boolean;
    wechatgame?: boolean;
    qqplay?: boolean;
    debug?: boolean;
    nativeRenderer?: boolean;
}

interface IGlobaldefines {
    // Platform macros
    CC_EDITOR?: boolean;
    CC_PREVIEW?: boolean;
    CC_BUILD?: boolean;
    CC_TEST?: boolean;

    // Flag macros
    CC_JSB?: boolean;
    CC_RUNTIME?: boolean;
    CC_WECHATGAME?: boolean;
    CC_WECHATGAMESUB?: boolean;
    CC_QQPLAY?: boolean;
    CC_DEBUG?: boolean;
    CC_NATIVERENDERER?: boolean;

    // Debug macros
    CC_DEV?: boolean;
    CC_SUPPORT_JIT?: boolean;

    // Physics macros
    CC_PHYSICS_CANNON?: boolean;
    CC_PHYSICS_AMMO?: boolean;
    CC_PHYSICS_BUILT_IN?: boolean;
}

// tslint:disable-next-line: no-shadowed-variable
function getGlobalDefs (platform?: Platform, physics?: Physics, flags?: IFlags): object {
    platform = platform || Platform.universal;

    const PLATFORM_MACROS = ['CC_EDITOR', 'CC_PREVIEW', 'CC_BUILD', 'CC_TEST'];

    const FLAGS = ['jsb', 'runtime', 'wechatgame', 'wechatgameSub', 'qqplay', 'debug', 'nativeRenderer'];

    const platformMacro = ('CC_' + Platform[platform]).toUpperCase();
    if (PLATFORM_MACROS.indexOf(platformMacro) === -1 && platform !== Platform.universal) {
        throw new Error(`Unknown platform ${platform}.`);
    }
    const result: IGlobaldefines = {};
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

    result.CC_DEV = result.CC_EDITOR || result.CC_PREVIEW || result.CC_TEST;
    result.CC_DEBUG = result.CC_DEBUG || result.CC_DEV;
    result.CC_SUPPORT_JIT = !(result.CC_WECHATGAME || result.CC_QQPLAY || result.CC_RUNTIME);

    // default
    result.CC_PHYSICS_CANNON = true;
    result.CC_PHYSICS_AMMO = false;
    result.CC_PHYSICS_BUILT_IN = false;

    switch (physics) {
        case Physics.cannon:
            result.CC_PHYSICS_CANNON = true;
            result.CC_PHYSICS_AMMO = false;
            result.CC_PHYSICS_BUILT_IN = false;
            break;

        case Physics.ammo:
            result.CC_PHYSICS_CANNON = false;
            result.CC_PHYSICS_AMMO = true;
            result.CC_PHYSICS_BUILT_IN = false;
            break;

        case Physics.builtin:
            result.CC_PHYSICS_CANNON = false;
            result.CC_PHYSICS_AMMO = false;
            result.CC_PHYSICS_BUILT_IN = true;
            break;
    }

    return result;
}
