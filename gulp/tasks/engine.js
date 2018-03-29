/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

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

const Utils = require('../util/utils');
const createBundler = require('../util/create-bundler');
const Path = require('path');

const Source = require('vinyl-source-stream');
const Gulp = require('gulp');
const Buffer = require('vinyl-buffer');
const Sourcemaps = require('gulp-sourcemaps');
const EventStream = require('event-stream');
const Chalk = require('chalk');
const HandleErrors = require('../util/handleErrors');
const Optimizejs = require('gulp-optimize-js');

var jsbSkipModules = [
    '../../cocos2d/core/CCGame',
    '../../cocos2d/core/load-pipeline/audio-downloader',
    '../../cocos2d/core/platform/CCInputManager.js',
    '../../cocos2d/core/platform/CCVisibleRect.js',
    '../../cocos2d/core/graphics/helper.js',
    '../../cocos2d/audio/CCAudio',
    '../../external/box2d/box2d.js',
];

exports.buildCocosJs = function (sourceFile, outputFile, excludes, opt_macroFlags, callback) {
    if (typeof opt_macroFlags === 'function') {
        callback = opt_macroFlags;
        opt_macroFlags = null;
    }

    var outDir = Path.dirname(outputFile);
    var outFile = Path.basename(outputFile);
    var bundler = createBundler(sourceFile);

    excludes && excludes.forEach(function (file) {
        bundler.ignore(file);
    });

    bundler = bundler.bundle();
    bundler = bundler.pipe(Source(outFile));
    bundler = bundler.pipe(Buffer());
    bundler = bundler.pipe(Sourcemaps.init({loadMaps: true}));
    bundler = bundler.pipe(Utils.uglify('build', Object.assign({ debug: true }, opt_macroFlags)));
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

exports.buildCocosJsMin = function (sourceFile, outputFile, excludes, opt_macroFlags, callback, createMap) {
    if (typeof opt_macroFlags === 'function') {
        callback = opt_macroFlags;
        opt_macroFlags = null;
    }

    var outDir = Path.dirname(outputFile);
    var outFile = Path.basename(outputFile);
    var bundler = createBundler(sourceFile);

    excludes && excludes.forEach(function (file) {
        bundler.ignore(file);
    });

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
    bundler = bundler.pipe(Utils.uglify('build', opt_macroFlags));
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

exports.buildPreview = function (sourceFile, outputFile, callback, devMode) {
    var cacheDir = devMode && Path.resolve(Path.dirname(outputFile), '.cache/preview-compile-cache');
    var outFile = Path.basename(outputFile);
    var outDir = Path.dirname(outputFile);

    var bundler = createBundler(sourceFile, {
        cacheDir: cacheDir,
        sourcemaps: !devMode
    });
    var bundler = bundler
        .bundle()
        .on('error', HandleErrors.handler)
        .pipe(HandleErrors())
        .pipe(Source(outFile))
        .pipe(Buffer());
    if (!devMode) {
        bundler = bundler
            .pipe(Sourcemaps.init({loadMaps: true}))
            .pipe(Utils.uglify('preview'))
            .pipe(Optimizejs({
                sourceMap: false
            }))
            .pipe(Sourcemaps.write('./', {
                sourceRoot: '../',
                includeContent: false,
                addComment: true
            }));
    }
    bundler
        .pipe(Gulp.dest(outDir))
        .on('end', callback);
};

exports.buildJsbPreview = function (sourceFile, outputFile, excludes, callback) {
    var FixJavaScriptCore = require('../util/fix-jsb-javascriptcore');
    var CheckInstanceof = require('../util/check-jsb-instanceof');

    var outFile = Path.basename(outputFile);
    var outDir = Path.dirname(outputFile);

    excludes = excludes.concat(jsbSkipModules);

    var bundler = createBundler(sourceFile);
    excludes.forEach(function (module) {
        bundler.ignore(require.resolve(module));
    });
    bundler.transform(CheckInstanceof)
        .bundle()
        .on('error', HandleErrors.handler)
        .pipe(HandleErrors())
        .pipe(Source(outFile))
        .pipe(Buffer())
        .pipe(FixJavaScriptCore())
        .pipe(Utils.uglify('preview', { jsb: true }))
        .pipe(Optimizejs({
            sourceMap: false
        }))
        .pipe(Gulp.dest(outDir))
        .on('end', callback);
};

exports.buildJsb = function (sourceFile, outputFile, excludes, opt_macroFlags, callback) {
    if (typeof opt_macroFlags === 'function') {
        callback = opt_macroFlags;
        opt_macroFlags = null;
    }

    var FixJavaScriptCore = require('../util/fix-jsb-javascriptcore');

    var outFile = Path.basename(outputFile);
    var outDir = Path.dirname(outputFile);

    var aliasifyConfig = {
        replacements: {
            '(.*)render-engine(.js)?': './cocos2d/core/renderer/render-engine.jsb'
        },
        verbose: false
    }

    var bundler = createBundler(sourceFile, null, aliasifyConfig);
    excludes = excludes.concat(jsbSkipModules);
    excludes.forEach(function (module) {
        bundler.ignore(require.resolve(module));
    });
    bundler.bundle()
        .on('error', HandleErrors.handler)
        .pipe(HandleErrors())
        .pipe(Source(outFile))
        .pipe(Buffer())
        .pipe(FixJavaScriptCore())
        .pipe(Utils.uglify('build', Object.assign({ jsb: true, debug: true }, opt_macroFlags)))
        .pipe(Optimizejs({
            sourceMap: false
        }))
        .pipe(Gulp.dest(outDir))
        .on('end', callback);
};

exports.buildJsbMin = function (sourceFile, outputFile, excludes, opt_macroFlags, callback) {
    if (typeof opt_macroFlags === 'function') {
        callback = opt_macroFlags;
        opt_macroFlags = null;
    }

    var FixJavaScriptCore = require('../util/fix-jsb-javascriptcore');

    var outFile = Path.basename(outputFile);
    var outDir = Path.dirname(outputFile);

    var aliasifyConfig = {
        replacements: {
            '(.*)render-engine(.js)?': './cocos2d/core/renderer/render-engine.jsb'
        },
        verbose: false
    }

    var bundler = createBundler(sourceFile, null, aliasifyConfig);
    excludes = excludes.concat(jsbSkipModules);
    excludes.forEach(function (module) {
        bundler.ignore(require.resolve(module));
    });
    bundler.bundle()
        .on('error', HandleErrors.handler)
        .pipe(HandleErrors())
        .pipe(Source(outFile))
        .pipe(Buffer())
        .pipe(FixJavaScriptCore())
        .pipe(Utils.uglify('build', Object.assign({ jsb: true }, opt_macroFlags)))
        .pipe(Optimizejs({
            sourceMap: false
        }))
        .pipe(Gulp.dest(outDir))
        .on('end', callback);
};

exports.jsbSkipModules = jsbSkipModules;
