
import * as fs from 'fs-extra';
import * as ps from 'path';
import yargs from 'yargs';
import { build, enumeratePhysicsReps, enumeratePlatformReps, IBuildOptions, IFlags, parsePhysics, parsePlatform } from './build-engine';

yargs.help();
yargs.option('platform', {
    type: 'string',
    alias: 'p',
    description: 'Target platform.',
    demandOption: true,
    choices: enumeratePlatformReps(),
});
yargs.option('physics', {
    type: 'string',
    alias: 'py',
    description: 'Physics engine to use.',
    choices: enumeratePhysicsReps(),
});
yargs.option('flags', {
    type: 'array',
    alias: 'f',
    description: 'Engine flags.',
});
yargs.option('destination', {
    type: 'string',
    alias: 'd',
    description: 'Output path.',
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

const flags: IFlags = {};
const argvFlags = yargs.argv.flags as (string[] | undefined);
if (argvFlags) {
    argvFlags.forEach((argvFlag) => flags[argvFlag as keyof IFlags] = true);
}

const sourceMap = yargs.argv.sourcemap === 'inline' ? 'inline' : !!yargs.argv.sourcemap;

const moduleEntries = yargs.argv._;
if (moduleEntries.length === 0) {
    console.log(`No module entry specified, default module entries will be used.`);
    moduleEntries.push(...getDefaultModuleEntries());
}

const options: IBuildOptions = {
    moduleEntries,
    compress: yargs.argv.compress as (boolean | undefined),
    outputPath: yargs.argv.destination as string,
    excludes: yargs.argv.excludes as string[],
    sourcemap: sourceMap,
    flags,
};
if (yargs.argv.platform) {
    options.platform = parsePlatform(yargs.argv.platform as unknown as string);
}
if (yargs.argv.physics) {
    options.physics = parsePhysics(yargs.argv.physics as unknown as string);
}

build(options).then(
    (result) => {
        console.log(`Build successful.`);
        fs.ensureDirSync(ps.dirname(options.outputPath));
        fs.writeFileSync(options.outputPath, result.code);
        if (result.map) {
            fs.writeFileSync(`${options.outputPath}.map`, result.map);
        }
    },
    (reason: any) => {
        console.error(`Build failed, reason:\n ${reason.stack}`);
    },
);

function getDefaultModuleEntries () {
    type ModuleDivision = any; // import('../../scripts/module-division/tools/division-config').ModuleDivision;
    type GroupItem = any; // import('../../scripts/module-division/tools/division-config').GroupItem;
    type Item = any; // import('../../scripts/module-division/tools/division-config').Item;

    const isGroupItem = (item: Item): item is GroupItem => {
        return 'options' in item;
    };

    const divisionConfig: ModuleDivision = require('../../scripts/module-division/division-config.json');
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
