/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

'use strict';

var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');
var zip = require('gulp-zip');
var Ftp = require('ftp');
var ExecSync = require('child_process').execSync;
var spawn = require('child_process').spawn;
var Path = require('path');
var fs = require('fs-extra');
const which = require('which');
const del = require('del');

function absolutePath(relativePath) {
    return Path.join(__dirname, relativePath);
}

var program = require('commander');
program
    .option('-b, --bump [version]', 'bump to a new version, or +1')
    .parse(process.argv);

gulp.task('make-cocos2d-x', gulpSequence('gen-cocos2d-x', 'upload-cocos2d-x'));

if (process.platform === 'darwin') {
    gulp.task('publish', gulpSequence('update', 'init', 'bump-version', 'make-cocos2d-x', 'make-simulator'));
}
else {
    gulp.task('publish', gulpSequence('update', 'init', 'bump-version', 'make-simulator'));
}

function execSync(cmd, workPath) {
    var execOptions = {
        cwd: workPath || '.',
        stdio: 'inherit'
    };
    ExecSync(cmd, execOptions);
}

function upload2Ftp(localPath, ftpPath, config, cb) {
    var ftpClient = new Ftp();
    ftpClient.on('error', function (err) {
        if (err) {
            if (cb) {
                cb(err);
            }
            else {
                console.warn('Upload errored after destroy: ', ftpPath);
            }
        }
    });
    ftpClient.on('ready', function () {
        var dirName = Path.dirname(ftpPath);
        ftpClient.mkdir(dirName, true, function (err) {
            if (err) {
                return cb(err);
            }
            ftpClient.put(localPath, ftpPath, function (err) {
                if (err) {
                    return cb(err);
                }
                ftpClient.end();
                ftpClient.destroy();
                cb();
                cb = null;
            });
        });
    });

    // connect to ftp
    ftpClient.connect(config);
}

function uploadZipFile(zipFileName, path, cb) {
    var branch = getCurrentBranch();
    if (branch === 'develop') {
        branch = 'dev';
    }
    var remotePath = Path.join('TestBuilds', 'Fireball', 'cocos2d-x', branch, zipFileName);
    var zipFilePath = Path.join(path, zipFileName);
    upload2Ftp(zipFilePath, remotePath, {
        host: '192.168.52.109',
        user: process.env.ftpUser,
        password: process.env.ftpPass
    }, cb);
}

function getCurrentBranch() {
    var spawnSync = require('child_process').spawnSync;
    var output = spawnSync('git', ['symbolic-ref', '--short', '-q', 'HEAD']);
    // console.log(output);
    return output.stdout.toString().trim();
}

function formatPath(p) {
    return p.replace(/\\/g, '/');
}

gulp.task('update', function (cb) {
    const git = require('./utils/git');
    var branch = git.getCurrentBranch('.');
    git.pull('.', 'git@github.com:cocos-creator/cocos2d-x-lite.git', branch, cb);
});

gulp.task('init', function (cb) {
    execSync('node ./utils/download-deps.js');
    execSync('git submodule update --init');
    execSync('python download-bin.py --remove-download no', './tools/cocos2d-console');
    cb();
});

gulp.task('gen-cocos2d-x', function (cb) {
    execSync('./git-archive-all cocos2d-x.zip', './tools/make-package');
    cb();
});

gulp.task('gen-simulator', async function () {
    console.log('remove old simulator project\n');
    await del(Path.join(__dirname, './simulator'));

    let isWin32 = process.platform === 'win32';
    // get the cmake path
    let cmakeBin = await new Promise((resolve, reject) => {
        which('cmake', (err, resolvedPath) => {
            if (err) {
                console.log('failed to resolve path for cmake, maybe you need to install cmake in the global environment\n');
                return reject(err);
            }
            resolve(resolvedPath);
        });
    });
    let simulatorProject = absolutePath('./simulator');
    await fs.ensureDir(simulatorProject);

    console.log('=====================================\n');
    console.log('make project\n');
    console.log('=====================================\n');
    await new Promise((resolve, reject) => {
        var args = [];
        args.push('-G');
        if (isWin32) {
            args.push('Visual Studio 15 2017','-A','x64');
        } 
        else {
            args.push('Xcode');
        }
        args.push(absolutePath('./tools/simulator/frameworks/runtime-src/'));
        let cmakeProcess = spawn(cmakeBin, args, {
            cwd: simulatorProject,
        });
        cmakeProcess.on('close', () => {
            console.log('cmake finished!');
            resolve();
        });
        cmakeProcess.on('error', err => {
            console.error(err);
        });
        cmakeProcess.stderr.on('data', err => {
            console.error(err.toString ? err.toString() : err);
        });
        cmakeProcess.stdout.on('data', data => {
            console.log(data.toString ? data.toString() : data);
        });
    });

    console.log('=====================================\n');
    console.log('build project\n');
    console.log('=====================================\n');
    await new Promise((resolve, reject) => {
        let makeArgs = ['--build', simulatorProject];
        if (!isWin32) {
            makeArgs = makeArgs.concat(['--', '-quiet', '-arch', 'x86_64']);
        }
        let buildProcess = spawn(cmakeBin, makeArgs, {
            cwd: simulatorProject,
        });
        buildProcess.on('close', () => {
            console.log('cmake finished!');
            resolve();
        });
        buildProcess.on('error', err => {
            console.error(err);
            process.exit(1);
        });
        buildProcess.stderr.on('data', err => {
            console.error(err.toString ? err.toString() : err);
            process.exit(1);
        });
        buildProcess.stdout.on('data', data => {
            console.log(data.toString ? data.toString() : data);
        });
    });
});

gulp.task('clean-simulator', async function () {
    console.log('=====================================\n');
    console.log('clean project\n');
    console.log('=====================================\n');
    let isWin32 = process.platform === 'win32';
    let delPatterns = [
        formatPath(Path.join(__dirname, './simulator/*')),
        formatPath(`!${Path.join(__dirname, './simulator/Debug')}`),
    ];
    if (!isWin32) {
        delPatterns.push(formatPath(Path.join(__dirname, './simulator/Debug/libcocos2d.a')));
        delPatterns.push(formatPath(Path.join(__dirname, './simulator/Debug/libsimulator.a')));
    }
    console.log('delete patterns: ', JSON.stringify(delPatterns, undefined, 2));
    await del(delPatterns, { force: true });
});

gulp.task('gen-simulator-release', gulp.series('gen-simulator', 'clean-simulator'));

gulp.task('upload-cocos2d-x', function (cb) {
    var zipFileName = 'cocos2d-x.zip';
    uploadZipFile(zipFileName, './tools/make-package', cb);
});

gulp.task('bump-version', function (cb) {
    let ver;
    if (!program.bump) {
        return cb();
    }
    let pjson = require('./package.json');
    if (typeof program.bump === 'string') {
        // new version
        ver = program.bump;
        if (!/^\d/.test(ver)) {
            return cb(`New version must starts with a digit`);
        }
    }
    else {
        // version +1
        ver = pjson.version.replace(/\d+$/, m => parseInt(m) + 1);
    }
    // update package.json
    console.log(`Bump version from ${pjson.version} to ${ver}`);
    pjson.version = ver;
    fs.writeFileSync('package.json', JSON.stringify(pjson, null, 2), 'utf8');

    // update cocos/cocos2d.cpp
    let filePath = Path.join('cocos', 'cocos2d.cpp');
    let content = fs.readFileSync(filePath, 'utf8');
    let re = /(cocos2dVersion(?:.|\n)*return\s+").+(";)/;
    content = content.replace(re, `$1${ver}$2`);
    fs.writeFileSync(filePath, content, 'utf8');

    cb();
});
