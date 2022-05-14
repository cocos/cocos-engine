'use strict';

const chalk = require('chalk');
const path = require("path");
const fs = require('fs-extra');

// usage: npm run clear-platform
let externalDir = path.join(__dirname, "../external");
let failed = false;

let macUsefulDirs = ['android', 'cmake', 'emscripten', 'ios', 'ios-m1-simulator', 'mac', 'ohos', 'sources'];
let winUsefulDirs = ['android', 'cmake', 'emscripten', 'ohos', 'sources', 'win64'];
let linuxUsefulDirs = ['android', 'cmake', 'emscripten', 'linux', 'ohos', 'sources'];
let allDirs = [];

main();

function main() {
    fs.readdir(externalDir, function(err, files){
        (function iterator(i) {
          if(i == files.length) {
            console.log(chalk.green(`==== current exists 3rd-libs directories ====`));
            console.log(allDirs);
            cleanPlatform(process.platform);
            return;
          }
          fs.stat(path.join(externalDir, files[i]), function(err, data) {     
            if(data.isDirectory() && files[i].charAt(0) !== '.') {               
                allDirs.push(files[i]);
            }
            iterator(i+1);
           });   
        })(0);
    });
}

function cleanPlatform(platform) {
    if (platform === 'darwin') { // macOS
        let macUselessDirs = getArrDiff(allDirs, macUsefulDirs);
        if (macUselessDirs.length > 0) {
            console.log(chalk.magenta(`==== Remove darwin useless 3rd-libs ====`));
            console.log(macUselessDirs);
            for (let i = 0; i < macUselessDirs.length; i++) {
                let clearDirectory = path.join(externalDir, macUselessDirs[i]);
                console.log(`  ${chalk.green('Remove directory: ')} ${clearDirectory}`);
                ensureRemove(clearDirectory);
            }
        } else {
            console.log(chalk.green(`==== No useless 3rd-libs need to remove, skip ====`));
        }
    }
    else if (platform === 'win32') { // windows
        let winUselessDirs = getArrDiff(allDirs, winUsefulDirs);
        if (winUselessDirs.length > 0) {
            console.log(chalk.magenta(`==== Remove win32 useless 3rd-libs ====`));
            console.log(winUselessDirs);
            for (let i = 0; i < winDeleteDirs.length; i++) { 
                let clearDirectory = path.join(externalDir, winUselessDirs[i]);
                console.log(`  ${chalk.green('Remove directory: ')} ${clearDirectory}`);
                ensureRemove(clearDirectory);
            }
        } else {
            console.log(chalk.green(`==== No useless 3rd-libs need to remove, skip ====`));
        }
    }
    else if (platform === 'linux') { // linux
        let linuxUselessDirs = getArrDiff(allDirs, linuxUsefulDirs);
        if (linuxUselessDirs.length > 0) { 
            console.log(chalk.magenta(`==== Remove linux useless 3rd-libs ====`));
            console.log(linuxUselessDirs);
            for (let i = 0; i < linuxUselessDirs.length; i++) {
                let clearDirectory = path.join(externalDir, linuxUselessDirs[i]);
                console.log(`  ${chalk.green('Remove directory: ')} ${clearDirectory}`);
                ensureRemove(clearDirectory);
            }
        } else {
            console.log(chalk.green(`==== No useless 3rd-libs need to remove, skip ====`));
        }
    } else { // others
        console.log(chalk.red(`Platform ${platform} is not supported, skip`));
    }
    // abnormal exit 
    if (failed) {
        process.exit(-1);
    }
}

function ensureRemove(clearDirectory) {
    try {
        if (fs.existsSync(clearDirectory)) {
            fs.removeSync(clearDirectory);
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

function getArrDiff(arr1, arr2) {
    return arr1.concat(arr2).filter(function(v, i, arr) {
      return arr.indexOf(v) === arr.lastIndexOf(v);
    });
}
