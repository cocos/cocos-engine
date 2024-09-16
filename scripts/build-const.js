const { StatsQuery } = require('@cocos/ccbuild');
const { join } = require('path');
const { outputFileSync } = require('fs-extra');
const { magenta, green } = require('chalk');

const engineRoot = join(__dirname, '../');
const targetConstFile = join(engineRoot, `./@types/consts.d.ts`);

const prefix = ''.padStart(20, '=');
console.log(magenta(`${prefix} Build const ${prefix}`));

StatsQuery.create(engineRoot).then((statsQuery) => {
    const ic = statsQuery.constantManager.genInternalConstants();
    const source =          `/**\n`
          + ` * This is an auto-generated declaration file for constants internally used in engine.\n`
          + ` * You may regenerate it by running cli command \`npm run build-const\`.\n`
          + ` */\n`
          + `\n${
              ic.replace(/\t/g, '    ')}`;
    outputFileSync(targetConstFile, source, 'utf8');

    console.log(green(`\nGenerate consts.d.ts: ${targetConstFile}\n`));
});
