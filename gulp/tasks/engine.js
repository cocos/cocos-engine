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

const Utils = require('../util/utils');
const createBundler = require('../util/create-bundler');
const Path = require('path');

const Source = require('vinyl-source-stream');
const Gulp = require('gulp');
const Buffer = require('vinyl-buffer');
const Minifier = require('gulp-uglify/minifier');
const UglifyHarmony = require('uglify-js-harmony');
const Sourcemaps = require('gulp-sourcemaps');
const EventStream = require('event-stream');
const Chalk = require('chalk');
const HandleErrors = require('../util/handleErrors');
const Optimizejs = require('gulp-optimize-js');

exports.buildCocosJs = function (sourceFile, outputFile, excludes, callback) {
    var outDir = Path.dirname(outputFile);
    var outFile = Path.basename(outputFile);
    var bundler = createBundler(sourceFile);

    excludes && excludes.forEach(function (file) {
        bundler.ignore(file);
    });

    var uglifyOption = Utils.getUglifyOptions('build', false, true);

    bundler = bundler.bundle();
    bundler = bundler.pipe(Source(outFile));
    bundler = bundler.pipe(Buffer());
    bundler = bundler.pipe(Sourcemaps.init({loadMaps: true}));
    bundler = bundler.pipe(Minifier(uglifyOption, UglifyHarmony));
    bundler = bundler.pipe(Optimizejs({
        sourceMap: false
    }));
    bundler = bundler.pipe(Sourcemaps.write('./', {
        sourceRoot: './',
        includeContent: true,
        addComment: true
    }));
    bundler = bundler.pipe(Gulp.dest(outDir));
    return bundler.on('end', callback);
};

exports.buildCocosJsMin = function (sourceFile, outputFile, excludes, callback, createMap) {
    var outDir = Path.dirname(outputFile);
    var outFile = Path.basename(outputFile);
    var bundler = createBundler(sourceFile);

    excludes && excludes.forEach(function (file) {
        bundler.ignore(file);
    });

    var uglifyOption = Utils.getUglifyOptions('build', false, false);

    var Size = null;
    try {
        Size = require('gulp-size');
    } catch (error) {
        Size = null;
    }

    if (Size) {
        var rawSize = Size({ gzip: false, pretty: false, showTotal: false, showFiles: false });
        var zippedSize = Size({ gzip: true, pretty: false, showTotal: false, showFiles: false });
    }

    bundler = bundler.bundle();
    bundler = bundler.pipe(Source(outFile));
    bundler = bundler.pipe(Buffer());
    if (createMap) {
        console.error('Can not use sourcemap with optimize-js');
        bundler = bundler.pipe(Sourcemaps.init({loadMaps: true}));
    }
    bundler = bundler.pipe(Minifier(uglifyOption, UglifyHarmony));
    bundler = bundler.pipe(Optimizejs({
        sourceMap: false
    }));

    if (Size) {
        bundler = bundler.pipe(rawSize);
        bundler = bundler.pipe(zippedSize);
        bundler = bundler.pipe(EventStream.through(null, function () {
            var raw = rawSize.size;
            var zipped = zippedSize.size;
            var percent = ((zipped / raw) * 100).toFixed(2);
            console.log(`Size of ${outputFile}: minimized: ${Chalk.cyan(raw)}B zipped: ${Chalk.cyan(zipped)}B, compression ratio: ${percent}%`);
            this.emit('end');
        }));
    }
    if (createMap) {
        bundler = bundler.pipe(Sourcemaps.write('./', {
            sourceRoot: './',
            includeContent: true,
            addComment: true
        }));
    }
    bundler = bundler.pipe(Gulp.dest(outDir));
    return bundler.on('end', callback);
};

exports.buildPreview = function (sourceFile, outputFile, callback) {
    var outFile = Path.basename(outputFile);
    var outDir = Path.dirname(outputFile);

    var bundler = createBundler(sourceFile);
    bundler.bundle()
        .on('error', HandleErrors.handler)
        .pipe(HandleErrors())
        .pipe(Source(outFile))
        .pipe(Buffer())
        .pipe(Sourcemaps.init({loadMaps: true}))
        .pipe(Minifier(Utils.getUglifyOptions('preview', false, false), UglifyHarmony))
        .pipe(Optimizejs({
            sourceMap: false
        }))
        .pipe(Sourcemaps.write('./', {
            sourceRoot: '../',
            includeContent: false,
            addComment: true
        }))
        .pipe(Gulp.dest(outDir))
        .on('end', callback);
};

exports.buildJsbPreview = function (sourceFile, outputFile, jsbSkipModules, callback) {
    var outFile = Path.basename(outputFile);
    var outDir = Path.dirname(outputFile);

    var bundler = createBundler(sourceFile);
    jsbSkipModules.forEach(function (module) {
        bundler.ignore(require.resolve(module));
    });
    bundler.bundle()
        .on('error', HandleErrors.handler)
        .pipe(HandleErrors())
        .pipe(Source(outFile))
        .pipe(Buffer())
        .pipe(Minifier(Utils.getUglifyOptions('preview', true, false), UglifyHarmony))
        .pipe(Optimizejs({
            sourceMap: false
        }))
        .pipe(Gulp.dest(outDir))
        .on('end', callback);
};

exports.buildJsb = function (sourceFile, outputFile, jsbSkipModules, callback) {
    var FixJavaScriptCore = require('../util/fix-jsb-javascriptcore');

    var outFile = Path.basename(outputFile);
    var outDir = Path.dirname(outputFile);

    var bundler = createBundler(sourceFile);
    jsbSkipModules.forEach(function (module) {
        bundler.ignore(require.resolve(module));
    });
    bundler.bundle()
        .on('error', HandleErrors.handler)
        .pipe(HandleErrors())
        .pipe(Source(outFile))
        .pipe(Buffer())
        .pipe(FixJavaScriptCore())
        .pipe(Minifier(Utils.getUglifyOptions('build', true, true), UglifyHarmony))
        .pipe(Optimizejs({
            sourceMap: false
        }))
        .pipe(Gulp.dest(outDir))
        .on('end', callback);
};

exports.buildJsbMin = function (sourceFile, outputFile, jsbSkipModules, callback) {
    var FixJavaScriptCore = require('../util/fix-jsb-javascriptcore');

    var outFile = Path.basename(outputFile);
    var outDir = Path.dirname(outputFile);

    var bundler = createBundler(sourceFile);
    jsbSkipModules.forEach(function (module) {
        bundler.ignore(require.resolve(module));
    });
    bundler.bundle()
        .on('error', HandleErrors.handler)
        .pipe(HandleErrors())
        .pipe(Source(outFile))
        .pipe(Buffer())
        .pipe(FixJavaScriptCore())
        .pipe(Minifier(Utils.getUglifyOptions('build', true, false), UglifyHarmony))
        .pipe(Optimizejs({
            sourceMap: false
        }))
        .pipe(Gulp.dest(outDir))
        .on('end', callback);
};
