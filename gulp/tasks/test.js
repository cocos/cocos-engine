/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var Fs = require('fire-fs');
var gulp = require('gulp');
var fb = require('gulp-fb');
var shell = require('gulp-shell');

var TimeOutInSeconds = 5;

gulp.task('unit-runner', function() {
    var js = paths.test.src;
    var dest = paths.outDir;
    var libs = [paths.test.dest];
    var title = 'Cocos2d-JS Test Suite';
    if (Fs.existsSync(paths.test.destEditorExtends)) {
        libs.push(paths.test.destEditorExtends);
        title += ' (Editor Extends Included)'
    }
    return gulp.src(js, { read: false, base: './' })
        .pipe(fb.toFileList())
        .pipe(fb.generateRunner(paths.test.runner, dest, title, libs))
        .pipe(gulp.dest(dest));
});

function test () {
    var qunit;
    try {
        qunit = require('gulp-qunit');
    }
    catch (e) {
        console.error('Please run "npm install gulp-qunit" before running "gulp test".');
        throw e;
    }
    return gulp.src('bin/qunit-runner.html', { read: false })
        .pipe(qunit({ timeout: TimeOutInSeconds }));
}

gulp.task('test', ['build-test', 'unit-runner'], test);
gulp.task('visual-test', ['build-test'], shell.task([
    'sh ./test/visual-tests/run.sh'
]));
gulp.task('test-no-build', test);
