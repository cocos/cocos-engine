const { spawnSync } = require('child_process');
const chalk = require('chalk');

const p = spawnSync('npm', ['-v']);
const currentVersion = p.stdout.toString().replace('\n', '');
const version = Number.parseInt(currentVersion.split('.')[0]);
if (version < 7) {
    console.error(chalk.red(`The current npm version is ${currentVersion}, please upgrade to at least 7.0.0.\nThe suggested node version is 18.17.0.\n`));
    process.exit(1);
}