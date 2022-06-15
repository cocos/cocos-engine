const { StatsQuery } = require('@cocos/build-engine');
const ps = require('path');
const fsExt = require('fs-extra');
const chalk = require('chalk').default;

const engineRoot = ps.join(__dirname, '../');
const targetConstFile = ps.join(engineRoot, `./@types/consts.d.ts`);

console.log(chalk.green(`\nGenerate consts.d.ts: ${targetConstFile}\n`));

StatsQuery.create(engineRoot).then(statsQuery => {
    const ic = statsQuery.constantManager.genInternalConstants();
    fsExt.outputFileSync(targetConstFile, ic, 'utf8');
});
