
import * as fs from 'fs-extra';
import * as ps from 'path';
import yargs from 'yargs';
import { build, IBuildOptions, IFlags, Physics, Platform } from './build-engine';

yargs.option('platform', { type: 'string', alias: 'p' });
yargs.option('physics', { type: 'string', alias: 'py' });
yargs.option('flags', { type: 'array', alias: 'f' });
yargs.option('destination', { type: 'string', alias: 'd' });
yargs.option('excludes', { type: 'array', alias: 'e' });
yargs.options('sourcemap', {});
yargs.boolean('compress');

const flags: IFlags = {};
const argvFlags = yargs.argv.flags as (string[] | undefined);
if (argvFlags) {
    argvFlags.forEach((argvFlag) => flags[argvFlag as keyof IFlags] = true);
}

const sourceMap = yargs.argv.sourcemap === 'inline' ? 'inline' : !!yargs.argv.sourcemap;

const options: IBuildOptions = {
    compress: yargs.argv.compress as (boolean | undefined),
    inputPath: './index.ts',
    outputPath: yargs.argv.destination as string,
    excludes: yargs.argv.excludes as string[],
    sourcemap: sourceMap,
    flags,
    platform: yargs.argv.platform as (Platform | undefined),
    physics: yargs.argv.physics as (Physics | undefined),
};

build(options).then(
    (result) => {
        console.log(`Build successful.`);
        fs.ensureDirSync(ps.dirname(options.outputPath));
        fs.writeFileSync(options.outputPath, result.code);
        console.log(`With map? ${!!result.map}`);
        if (result.map) {
            fs.writeFileSync(`${options.outputPath}.map`, result.map);
        }
    },
    (reason: any) => {
        console.error(`Build failed, reason:\n ${reason.stack}`);
    },
);

type Platform = 'any' | 'editor' | 'preview' | 'build' | 'test';

type Physics = 'cannon' | 'ammo' | 'builtin';
interface IFlags {
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
function getGlobalDefs (platform: Platform, physics: Physics, flags?: IFlags): object {
    const PLATFORM_MACROS = ['CC_EDITOR', 'CC_PREVIEW', 'CC_BUILD', 'CC_TEST'];

    const FLAGS = ['jsb', 'runtime', 'wechatgame', 'wechatgameSub', 'qqplay', 'debug', 'nativeRenderer'];

    const platformMacro = 'CC_' + platform.toUpperCase();
    if (PLATFORM_MACROS.indexOf(platformMacro) === -1 && platform !== 'any') {
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
        case 'cannon':
            result.CC_PHYSICS_CANNON = true;
            result.CC_PHYSICS_AMMO = false;
            result.CC_PHYSICS_BUILT_IN = false;
            break;

        case 'ammo':
            result.CC_PHYSICS_CANNON = false;
            result.CC_PHYSICS_AMMO = true;
            result.CC_PHYSICS_BUILT_IN = false;
            break;

        case 'builtin':
            result.CC_PHYSICS_CANNON = false;
            result.CC_PHYSICS_AMMO = false;
            result.CC_PHYSICS_BUILT_IN = true;
            break;

        default:
            throw new Error(`Unknown physics ${physics}.`);
            break;
    }

    return result;
}
