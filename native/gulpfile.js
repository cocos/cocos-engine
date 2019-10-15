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

var program = require('commander');
program
    .option('-b, --bump [version]', 'bump to a new version, or +1')
    .parse(process.argv);

gulp.task('make-cocos2d-x', gulpSequence('gen-cocos2d-x', 'upload-cocos2d-x'));
gulp.task('make-simulator', gulpSequence('gen-simulator', 'sign-simulator', 'update-simulator-config', 'update-simulator-dll', 'archive-simulator', 'upload-simulator'));

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

function downloadSimulatorDLL(callback) {
    var Download = require('download');
    var destPath = Path.join('simulator', 'win32');
    Download('http://192.168.52.109/TestBuilds/Fireball/simulator/dlls/dll.zip', destPath, {
        mode: '755',
        extract: true,
        strip: 0,
        agent: null,
    }).then(function(res) {
        callback();
    }).catch(callback);
}

function upload2Ftp(localPath, ftpPath, config, cb) {
    var ftpClient = new Ftp();
    ftpClient.on('error', function(err) {
        if (err) {
            if (cb) {
                cb(err);
            }
            else {
                console.warn('Upload errored after destroy: ', ftpPath);
            }
        }
    });
    ftpClient.on('ready', function() {
        var dirName = Path.dirname(ftpPath);
        ftpClient.mkdir(dirName, true, function(err) {
            if (err) {
                return cb(err);
            }
            ftpClient.put(localPath, ftpPath, function(err) {
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

gulp.task('update', function (cb) {
    const git = require('./utils/git');
    var branch = git.getCurrentBranch('.');
    git.pull('.', 'git@github.com:cocos-creator/cocos2d-x-lite.git', branch, cb);
});

gulp.task('init', function(cb) {
    execSync('python download-deps.py --remove-download no');
    execSync('git submodule update --init');
    execSync('python download-bin.py --remove-download no', './tools/cocos2d-console');
    cb();
});

gulp.task('gen-cocos2d-x', function(cb) {
    execSync('./git-archive-all cocos2d-x.zip', './tools/make-package');
    cb();
});

gulp.task('gen-simulator', function(cb) {
    var cocosConsoleRoot = './tools/cocos2d-console/bin';
    var cocosConsoleBin = Path.join(cocosConsoleRoot, process.platform === 'win32' ? 'cocos.bat' : 'cocos');
    var args;
    if (process.platform === 'darwin') {
        args = ['gen-simulator', '-m', 'debug', '-p', 'mac'];
    } else {
        args = ['gen-simulator', '-c', '-m', 'debug', '-p', 'win32', '--vs', '2017', '--ol', 'en'];
    }
    try {
        var child = spawn(cocosConsoleBin, args);
        child.stdout.on('data', function(data) {
            console.log(data.toString());
        });
        child.stderr.on('data', function(data) {
            console.error(data.toString());
        });
        child.on('close', (code) => {
            if (code !== 0) {
                cb('Generate simulator failed');
                return;
            }
            if (process.platform === 'darwin') {
                //reset project file to hide code sign information.
                execSync('git checkout -- ./tools/simulator/frameworks/runtime-src/proj.ios_mac/simulator.xcodeproj');
            }
            cb();
        });
        child.on('error', function() {
            cb('Generate simulator failed');
        });
    } catch (err) {
        cb(err);
    }
});

gulp.task('sign-simulator', function () {
    try {
        var cmd = fs.readFileSync(Path.join(process.env.HOME, '.ssh', 'codesignCmd_simulator.txt'), 'utf8');
        execSync(cmd);
    }
    catch (e) {
        console.warn('No need to run sign-simulator since v1.10.', e);
    }
});

gulp.task('update-simulator-config', function(cb) {
    var destPath = process.platform === 'win32' ? './simulator/win32/config.json' : './simulator/mac/Simulator.app/Contents/Resources/config.json';
    fs.copy('./tools/simulator/config.json', destPath, cb);
});

// 在 'sign-simulator' 之后执行，以保留这些 dll 来自第三方的签名
gulp.task('update-simulator-dll', function(cb) {
    if (process.platform === 'win32') {
        downloadSimulatorDLL(cb);
    } else {
        cb();
    }
});

gulp.task('archive-simulator', function() {
    return gulp.src('./simulator/**/*')
        .pipe(zip('simulator_' + process.platform + '.zip'))
        .pipe(gulp.dest('./'));
});

gulp.task('upload-cocos2d-x', function(cb) {
    var zipFileName = 'cocos2d-x.zip';
    uploadZipFile(zipFileName, './tools/make-package', cb);
});

gulp.task('upload-simulator', function(cb) {
    var zipFileName = 'simulator_' + process.platform + '.zip';
    uploadZipFile(zipFileName, '.', cb);
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
