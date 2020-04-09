import * as fs from 'fs-extra';
import * as ps from 'path';
import yargs from 'yargs';
import {
    build,
    enumeratePhysicsReps,
    enumerateBuildModeReps,
    enumeratePlatformReps,
    BuildFlags,
    parsePhysics,
    parseBuildMode,
    enumerateModuleOptionReps,
    parseModuleOption,
    parsePlatform,
} from './index';

async function main() {
    yargs.help();
    yargs.options('engine', {
        type: 'string',
        demandOption: true,
    });
    yargs.option('buildmode', {
        type: 'string',
        alias: 'b',
        description: 'Target buildmode.',
        demandOption: true,
        choices: enumerateBuildModeReps(),
    });
    yargs.option('platform', {
        type: 'string',
        alias: 'p',
        description: 'Target platform.',
        demandOption: true,
        choices: enumeratePlatformReps(),
    });
    yargs.option('flags', {
        type: 'array',
        alias: 'f',
        description: 'Engine flags.',
    });
    yargs.option('module', {
        choices: enumerateModuleOptionReps(),
        description: 'Output module format. If not specified, IIFE will be used.',
    });
    yargs.option('destination', {
        type: 'string',
        alias: 'd',
        description: '(Removal) Output path. Note, this argument has been removal since V3.0.',
    });
    yargs.option('out', {
        type: 'string',
        alias: 'o',
        demandOption: true,
    });
    yargs.option('excludes', {
        type: 'array',
        alias: 'e',
        description: '(Expired!)',
    });
    yargs.options('sourcemap', {
        choices: [
            'inline',
            true,
        ],
        description: 'Source map generation options',
    });
    yargs.option('compress', {
        type: 'boolean',
        description: 'Whether to compress compiled engine.',
    });
    yargs.option('progress', {
        type: 'boolean',
        default: false,
        description: 'Whether to show build progress.',
    });
    yargs.option('watch-files', {
        type: 'string',
        description: '(INTERNAL/EXPERIMENTAL) Write built file list as a record with file path as key and mtime as value, into specified file, in JSON format.',
    });

    const flags: BuildFlags = {};
    const argvFlags = yargs.argv.flags as (string[] | undefined);
    if (argvFlags) {
        argvFlags.forEach((argvFlag) => flags[argvFlag as keyof BuildFlags] = true);
    }

    const sourceMap = yargs.argv.sourcemap === 'inline' ? 'inline' : !!yargs.argv.sourcemap;

    const options: build.Options = {
        engine: yargs.argv.engine as string,
        moduleEntries: yargs.argv._ as (string[] | undefined),
        compress: yargs.argv.compress as (boolean | undefined),
        out: yargs.argv.out as string,
        sourceMap,
        flags,
        progress: yargs.argv.progress as (boolean | undefined),
        incremental: yargs.argv['watch-files'] as (string | undefined),
    };
    if (yargs.argv.module) {
        options.moduleFormat = parseModuleOption(yargs.argv['module'] as unknown as string);
    }
    if (yargs.argv.buildmode) {
        options.mode = parseBuildMode(yargs.argv.buildmode as unknown as string);
    }
    if (yargs.argv.platform) {
        options.platform = parsePlatform(yargs.argv.platform as unknown as string);
    }

    await fs.ensureDir(options.out);
    await build(options);
}

(async () => {
    await main();
})();
