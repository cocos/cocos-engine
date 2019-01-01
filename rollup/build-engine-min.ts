
import yargs from 'yargs';
import { build } from './build-engine';

yargs.option('destination', { type: 'string', alias: 'd' });

build({
    inputPath: './index.js',
    outputPath: yargs.argv.destination as string,
    globalDefines: {
        CC_EDITOR:false,
        CC_PREVIEW:false,
        CC_DEV:false,
        CC_DEBUG:false,
        CC_BUILD:true,
        CC_JSB:false,
    }
}).then(
    () => {
        console.log(`OK.`);
    },
    (error) => {
        console.error(`Error. ${error}`);
    },
);
