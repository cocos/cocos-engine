const { StatsQuery } = require('@cocos/ccbuild');
const ps = require('path');
const fsExt = require('fs-extra');
const chalk = require('chalk').default;

const engineRoot = ps.join(__dirname, '../../../');
const pkgRoot = ps.join(__dirname, '../');
const targetConstFile = ps.join(pkgRoot, `./lib/consts.d.ts`);

console.log(chalk.green(`\nGenerate consts.d.ts: ${targetConstFile}\n`));

StatsQuery.create(engineRoot).then(statsQuery => {
    const ic = statsQuery.constantManager.genInternalConstants();
    const source =
          `/**\n` +
          ` * This is an auto-generated declaration file for constants internally used in engine.\n` +
          ` * You may regenerate it by running cli command \`npm run build-const\`.\n` +
          ` */\n` +
          `\n` +
          ic.replace(/\t/g, '    ');
    fsExt.outputFileSync(targetConstFile, source, 'utf8');
});
