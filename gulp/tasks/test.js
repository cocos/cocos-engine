/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 https://www.cocos.com/

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

const UGLIFY = false;

'use strict';

const Path = require('path');
const Fs = require('fs');
const Source = require('vinyl-source-stream');
const Gulp = require('gulp');
const Fb = require('gulp-fb');
const Babel = require('gulp-babel');
const Buffer = require('vinyl-buffer');
const HandleErrors = require('../util/handleErrors');
const Es = require('event-stream');

const Sourcemaps = require('gulp-sourcemaps');

const Utils = require('../util/utils');
const createBundler = require('../util/create-bundler');

exports.build = function (sourceFile, outputFile, sourceFileForExtends, outputFileForExtends, sourcemaps, callback) {
    var cacheDir = Path.resolve(Path.dirname(outputFile), '.cache/test-compile-cache');
    var engine = createBundler(sourceFile, {
        sourcemaps: sourcemaps,
        cacheDir: cacheDir
    })
        .bundle()
        .on('error', HandleErrors.handler)
        .pipe(HandleErrors())
        .pipe(Source(Path.basename(outputFile)))
        .pipe(Buffer());

    if (UGLIFY) {
        if (sourcemaps) {
            engine = engine.pipe(Sourcemaps.init({loadMaps: true}));
        }

        // remove `...args` used in CC_JSB
        engine = engine.pipe(Utils.uglify('test'));

        if (sourcemaps) {
            engine = engine.pipe(Sourcemaps.write('./', {
                sourceRoot: '../',
                includeContent: false,
                addComment: true
            }));
        }
    }

    engine = engine.pipe(Gulp.dest(Path.dirname(outputFile)));

    if (Fs.existsSync(sourceFileForExtends)) {
        var engineExtends = createBundler(sourceFileForExtends,
            {
                sourcemaps: sourcemaps,
                babelifyOpt: {
                    presets: ['env'],
                    ast: false,
                    babelrc: false,
                    highlightCode: false,
                    sourceMaps: true,
                    compact: false
                },
                cacheDir: cacheDir
            })
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

exports.unit = function (outDir, libs, callback) {
    var title = 'CocosCreator Engine Test Suite';
    if (Fs.existsSync('./bin/cocos2d-js-extends-for-test.js')) {
        libs.push('./bin/cocos2d-js-extends-for-test.js');
        title += ' (Editor Extends Included)';
    }
    return Gulp.src(['test/qunit/unit-es5/**/*.js', './bin/test/**/*.js'], { read: false, base: './' })
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
        console.error('Please run "npm install gulp-qunit@2.0.1 -g" before running "gulp test".');
        throw e;
    }
    return Gulp.src('bin/qunit-runner.html')
        .pipe(qunit({ timeout: 10 }))
        .on('end', callback);
};

exports.buildTestCase = function (outDir, callback) {
    return Gulp.src('test/qunit/unit/**/*.js')
        .pipe(Babel({
            presets: ['env'],
            plugins: [
                // make sure that transform-decorators-legacy comes before transform-class-properties.
                'transform-decorators-legacy',
                'transform-class-properties',
            ],
            ast: false,
            babelrc: false,
            highlightCode: false,
            sourceMaps: true,
            compact: false
        }))
        .pipe(Gulp.dest(outDir))
        .on('end', callback);
};
