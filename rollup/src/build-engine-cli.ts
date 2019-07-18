
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
