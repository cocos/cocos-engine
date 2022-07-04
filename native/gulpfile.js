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
var ExecSync = require('child_process').execSync;
var spawn = require('child_process').spawn;
var Path = require('path');
var fs = require('fs-extra');
const which = require('which');
const del = require('del');

function absolutePath(relativePath) {
    return Path.join(__dirname, relativePath);
}

function execSync(cmd, workPath) {
    var execOptions = {
        cwd: workPath || '.',
        stdio: 'inherit'
    };
    ExecSync(cmd, execOptions);
}

gulp.task('init', function (cb) {
    execSync('node ./utils/download-deps.js');
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
            args.push('Visual Studio 16 2019','-A','x64');
        } 
        else {
            args.push('Xcode');
        }
        args.push('-DCC_DEBUG_FORCE=ON','-DUSE_V8_DEBUGGER_FORCE=ON');
        args.push(absolutePath('./tools/simulator/frameworks/runtime-src/'));
        const newEnv = {};
        Object.assign(newEnv, process.env);
        Object.keys (newEnv).filter (x => x.toLowerCase().startsWith( 'npm_')). forEach(e => delete newEnv[e]);
        let cmakeProcess = spawn(cmakeBin, args, {
            cwd: simulatorProject,
            env: newEnv,
        });
        cmakeProcess.on('close', () => {
            console.log('cmake finished!');
            resolve();
        });
        cmakeProcess.on('error', err => {
            console.error(err);
            reject();
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
            makeArgs = makeArgs.concat(['--config', 'Release', '--', '-quiet', '-arch', 'x86_64']);
        } else {
            makeArgs = makeArgs.concat(['--config', 'Release']);
        }
        const newEnv = {};
        Object.assign(newEnv, process.env);
        Object.keys (newEnv).filter (x => x.toLowerCase().startsWith( 'npm_')). forEach(e => delete newEnv[e]);
        let buildProcess = spawn(cmakeBin, makeArgs, {
            cwd: simulatorProject,
            env: newEnv,
        });
        buildProcess.on('close', () => {
            console.log('cmake finished!');
            resolve();
        });
        buildProcess.on('error', err => {
            console.error(err);
            reject();
        });
        buildProcess.stderr.on('data', err => {
            console.error(err.toString ? err.toString() : err);
        });
        buildProcess.stdout.on('data', data => {
            console.log(data.toString ? data.toString() : data);
        });
    });
});

function formatPath(p) {
    return p.replace(/\\/g, '/');
}

gulp.task('clean-simulator', async function () {
    console.log('=====================================\n');
    console.log('clean project\n');
    console.log('=====================================\n');
    let isWin32 = process.platform === 'win32';
    let delPatterns = [
        formatPath(Path.join(__dirname, './simulator/*')),
        formatPath(`!${Path.join(__dirname, './simulator/Release')}`),
    ];
    if (!isWin32) {
        delPatterns.push(formatPath(Path.join(__dirname, './simulator/Release/libsimulator.a')));
    }
    console.log('delete patterns: ', JSON.stringify(delPatterns, undefined, 2));
    await del(delPatterns, { force: true });
    //check if target file exists
    let ok = true;
    if (isWin32) {
        ok = fs.existsSync(Path.join(__dirname, './simulator/Release/SimulatorApp-Win32.exe'));
    }
    else {
        ok = fs.existsSync(Path.join(__dirname, './simulator/Release/SimulatorApp-Mac.app'));
    }
    if (!ok) {
        console.log('=====================================\n');
        console.error('failed to find target executable file\n');
        console.log('=====================================\n');
        throw new Error(`Build process exit with 1`);
    }
});

gulp.task('gen-simulator-release', gulp.series('gen-simulator', 'clean-simulator'));
