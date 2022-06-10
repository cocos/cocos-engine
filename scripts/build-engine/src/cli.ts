import * as fs from 'fs-extra';
import * as ps from 'path';
import yargs from 'yargs';
import { getBuildModeConstantNames, getPlatformConstantNames, setupBuildTimeConstants } from './build-time-constants';
import { ModeType, PlatformType } from './constant-manager';
import {
    build,
    enumerateModuleOptionReps,
    parseModuleOption,
} from './index';
import { StatsQuery } from './stats-query';

async function main () {
    yargs.parserConfiguration({
        'boolean-negation': false,
    });
    yargs.help();
    yargs.options('engine', {
        type: 'string',
        demandOption: true,
        description: 'Path to the engine repo.',
    });
    yargs.option('build-mode', {
        type: 'string',
        alias: 'b',
        description: `Target build-mode. Predefined values: [${getBuildModeConstantNames().join(',')}]`,
    });
    yargs.option('platform', {
        type: 'string',
        alias: 'p',
        description: `Target platform. Predefined values: [${getPlatformConstantNames().join(',')}]`,
        demandOption: true,
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
    yargs.option('ammojs-wasm', {
        choices: [true, 'fallback'],
    });
    yargs.option('no-deprecated-features', {
        description: `Whether to remove deprecated features. You can specify boolean or a version string(in semver)`,
        type: 'string',
        coerce: (arg: string | boolean) => (typeof arg !== 'string'
            ? arg
            : ((arg === 'true' || arg.length === 0) ? true : (
                arg === 'false' ? false : arg
            ))),
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
        description: 'Output directory.',
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
    yargs.option('split', {
        type: 'boolean',
        default: false,
        description: 'Whether to generate modular engine.',
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
    yargs.option('visualize', {
        type: 'boolean',
        default: false,
        description: 'Visualize build result. Dev-mode is needed.',
    });
    yargs.option('visualize-file', {
        type: 'string',
        description: 'Visualizing file. This options implies --visualize.',
    });
    yargs.option('meta-file', {
        type: 'string',
        description: 'Meta out file.',
    });

    const flags: Record<string, boolean> = {};
    const argvFlags = yargs.argv.flags as (string[] | undefined);
    if (argvFlags) {
        argvFlags.forEach((argvFlag) => flags[argvFlag] = true);
    }

    const sourceMap = yargs.argv.sourcemap === 'inline' ? 'inline' : !!yargs.argv.sourcemap;
    const engineRoot = yargs.argv.engine as string;

    const statsQuery = await StatsQuery.create(engineRoot);
    const buildTimeConstants = statsQuery.constantManager.genBuildTimeConstants({
        mode: yargs.argv.buildMode as ModeType,
        platform: yargs.argv.platform as PlatformType,
        flags,
    });

    const noDeprecatedFeatures = yargs.argv.noDeprecatedFeatures as (boolean | string | undefined);

    const options: build.Options = {
        engine: engineRoot,
        split: yargs.argv.split as boolean,
        features: yargs.argv._ as (string[] | undefined) ?? [],
        compress: yargs.argv.compress as (boolean | undefined),
        out: yargs.argv.out as string,
        sourceMap,
        progress: yargs.argv.progress as (boolean | undefined),
        incremental: yargs.argv['watch-files'] as (string | undefined),
        ammoJsWasm: yargs.argv['ammojs-wasm'] as (boolean | undefined | 'fallback'),
        noDeprecatedFeatures,
        buildTimeConstants,
    };
    if (yargs.argv.module) {
        options.moduleFormat = parseModuleOption(yargs.argv.module as string);
    }

    if (yargs.argv.visualize) {
        options.visualize = true;
    }
    if (yargs.argv['visualize-file']) {
        if (typeof options.visualize !== 'object') {
            options.visualize = {};
        }
        options.visualize.file = yargs.argv['visualize-file'] as string;
    }

    await fs.ensureDir(options.out);
    const result = await build(options);
    const metaFile = yargs.argv['meta-file'] as string | undefined;
    if (metaFile) {
        await fs.ensureDir(ps.dirname(metaFile));
        await fs.writeJson(metaFile, result, { spaces: 2 });
    }

    return result.hasCriticalWarns ? 1 : 0;
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
    const retVal = await main();
    process.exit(retVal);
})();
