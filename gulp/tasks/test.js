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

'use strict';

const Path = require('path');
const Fs = require('fs');
const Del = require('del');
const Source = require('vinyl-source-stream');
const Gulp = require('gulp');
const Fb = require('gulp-fb');
const Buffer = require('vinyl-buffer');
const HandleErrors = require('../util/handleErrors');
const Es = require('event-stream');

const Utils = require('./utils');

exports.build = function (sourceFile, outputFile, sourceFileForExtends, outputFileForExtends, callback) {
    var engine = Utils.createBundler(sourceFile)
        .ignore('./bin/modular-cocos2d-cut.js')
        .bundle()
        .on('error', HandleErrors.handler)
        .pipe(HandleErrors())
        .pipe(Source(Path.basename(outputFile)))
        .pipe(Buffer())
        .pipe(Gulp.dest(Path.dirname(outputFile)));

    if (Fs.existsSync(sourceFileForExtends)) {
        var engineExtends = Utils.createBundler(sourceFileForExtends, {
                presets: ["es2015"],
                ast: false,
                babelrc: false,
                highlightCode: false,
                sourceMaps: true,
                compact: false
            })
            .ignore('./bin/modular-cocos2d-cut.js')
            .bundle()
            .on('error', HandleErrors.handler)
            .pipe(HandleErrors())
            .pipe(Source(Path.basename(outputFileForExtends)))
            .pipe(Buffer())
            .pipe(Gulp.dest(Path.dirname(outputFileForExtends)));
        Es.merge(engine, engineExtends).on('end', callback);
    }
    else {
        engine.on('end', callback);
    }
};

exports.clean = function (list, callback) {
    Del(list, callback)
};

exports.unit = function (outDir, libs, callback) {
    var title = 'Cocos2d-JS Test Suite';
    if (Fs.existsSync('./bin/cocos2d-js-extends-for-test.js')) {
        libs.push('./bin/cocos2d-js-extends-for-test.js');
        title += ' (Editor Extends Included)';
    }
    return Gulp.src('test/qunit/unit/**/*.js', { read: false, base: './' })
        .pipe(Fb.toFileList())
        .pipe(Fb.generateRunner('test/qunit/lib/qunit-runner.html', outDir, title, libs))
        .pipe(Gulp.dest(outDir))
        .on('end', callback);
};

exports.test = function (callback) {
    var qunit;
    try {
        qunit = require('gulp-qunit');
    } catch (e) {
        console.error('Please run "npm install gulp-qunit" before running "gulp test".');
        throw e;
    }
    return Gulp.src('bin/qunit-runner.html')
        .pipe(qunit({ timeout: 5 }))
        .on('end', callback);
};
