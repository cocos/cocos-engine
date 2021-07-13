'use strict';

const chalk = require('chalk');
const path = require("path");
const { existsSync, removeSync } = require('fs-extra');

// npm run clear-platform
let externalDir = path.join(__dirname, "../external");
let failed = false;

main();

function main() {
    clearUselessPlatform();
}

function clearUselessPlatform() {
    console.log(chalk.magenta(`==== Remove useless 3rd-libs for current platform ====`));
    console.log(`  ${chalk.green('current platform: ')} ${process.platform}`);
    console.log(`  ${chalk.green('3rd-libs directory: ')} ${externalDir}`);
    if (process.platform === 'darwin') {
        // remove win32 related 3rd-libs
        console.log(chalk.magenta(`==== Remove win32 related 3rd-libs ====`));
        let clearDirectory = path.join(externalDir, "./win32");
        console.log(`  ${chalk.green('Remove directory: ')} ${clearDirectory}`);
        ensureRemove(clearDirectory);
        clearDirectory = path.join(externalDir, "./win64");
        console.log(`  ${chalk.green('Remove directory: ')} ${clearDirectory}`);
        ensureRemove(clearDirectory);
    } else {
        // remove apple related 3rd-libs
        console.log(chalk.magenta(`==== Remove apple related 3rd-libs ====`));
        let clearDirectory = path.join(externalDir, "./mac");
        console.log(`  ${chalk.green('Remove directory: ')} ${clearDirectory}`);
        ensureRemove(clearDirectory);
        clearDirectory = path.join(externalDir, "./ios");
        console.log(`  ${chalk.green('Remove directory: ')} ${clearDirectory}`);
        ensureRemove(clearDirectory);
        clearDirectory = path.join(externalDir, "./ios-m1-simulator");
        console.log(`  ${chalk.green('Remove directory: ')} ${clearDirectory}`);
        ensureRemove(clearDirectory);
    }
    // abnormal exit 
    if (failed) {
        process.exit(-1);
    }
}

function ensureRemove(clearDirectory) {
    try {
        if (existsSync(clearDirectory)) {
            removeSync(clearDirectory);
            console.log(`  ${chalk.green('Success')}`);
        } else {
            console.log(`  ${chalk.yellow('Directory does not exist: skip')}`);
        }
    } catch (error) {
        failed = true;
        console.log(`  ${chalk.red('Failure')}`);
        console.log(error);
    }
}
