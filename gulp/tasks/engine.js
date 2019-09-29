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

'use strict';

const Utils = require('../util/utils');
const createBundler = require('../util/create-bundler');
const Path = require('path');
const Fs = require('fs-extra');

const Source = require('vinyl-source-stream');
const Gulp = require('gulp');
const Buffer = require('vinyl-buffer');
const Sourcemaps = require('gulp-sourcemaps');
const EventStream = require('event-stream');
const Chalk = require('chalk');
const HandleErrors = require('../util/handleErrors');
const Optimizejs = require('gulp-optimize-js');

var jsbSkipModules = [
    // modules need to skip in jsb
    '../../extensions/spine/skeleton-cache.js',
    '../../extensions/spine/vertex-effect-delegate.js',
    '../../extensions/spine/lib/spine.js',
    '../../extensions/dragonbones/lib/dragonBones.js',
    '../../extensions/dragonbones/ArmatureCache.js',
    '../../extensions/dragonbones/CCArmatureDisplay.js',
    '../../extensions/dragonbones/CCFactory.js',
    '../../extensions/dragonbones/CCSlot.js',
    '../../extensions/dragonbones/CCTextureData.js',

    // gfx
    '../../cocos2d/renderer/gfx/device.js',
    '../../cocos2d/renderer/gfx/enums.js',
    '../../cocos2d/renderer/gfx/frame-buffer.js',
    '../../cocos2d/renderer/gfx/index-buffer.js',
    '../../cocos2d/renderer/gfx/misc.js',
    '../../cocos2d/renderer/gfx/program.js',
    '../../cocos2d/renderer/gfx/render-buffer.js',
    '../../cocos2d/renderer/gfx/state.js',
    '../../cocos2d/renderer/gfx/texture-2d.js',
    '../../cocos2d/renderer/gfx/texture-cube.js',
    '../../cocos2d/renderer/gfx/texture.js',
    '../../cocos2d/renderer/gfx/vertex-buffer.js',
    '../../cocos2d/renderer/gfx/vertex-format.js',

    // renderer
    '../../cocos2d/renderer/core/base-renderer.js',
    '../../cocos2d/renderer/core/program-lib.js',
    '../../cocos2d/renderer/core/view.js',
    '../../cocos2d/renderer/renderers/forward-renderer.js',
    '../../cocos2d/renderer/scene/camera.js',
    '../../cocos2d/renderer/scene/light.js',
    '../../cocos2d/renderer/scene/scene.js',

    // buffer
    '../../cocos2d/core/renderer/webgl/model-batcher.js',
    '../../cocos2d/core/renderer/webgl/spine-buffer.js',
];
var jsbAliasify = {
    replacements: {
        // '(.*)render-engine(.js)?': require.resolve('../../cocos2d/core/renderer/render-engine.jsb')
    },
    verbose: false
};

exports.buildDebugInfos = require('./buildDebugInfos');

exports.buildCocosJs = function (sourceFile, outputFile, excludes, opt_macroFlags, callback, createMap) {
    if (typeof opt_macroFlags === 'function') {
        callback = opt_macroFlags;
        opt_macroFlags = null;
    }

    var opts = {
        sourcemaps: createMap !== false
    };
    var outDir = Path.dirname(outputFile);
    var outFile = Path.basename(outputFile);
    var bundler = createBundler(sourceFile, opts);

    excludes && excludes.forEach(function (file) {
        bundler.exclude(file);
    });

    bundler = bundler.bundle();
    bundler = bundler.pipe(Source(outFile));
    bundler = bundler.pipe(Buffer());

    if (createMap) {
        bundler = bundler.pipe(Sourcemaps.init({loadMaps: true}));
    }

    bundler = bundler.pipe(Utils.uglify('build', Object.assign({ debug: true }, opt_macroFlags)));
    bundler = bundler.pipe(Optimizejs({
        sourceMap: false
    }));

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

exports.buildCocosJsMin = function (sourceFile, outputFile, excludes, opt_macroFlags, callback, createMap) {
    if (typeof opt_macroFlags === 'function') {
        callback = opt_macroFlags;
        opt_macroFlags = null;
    }

    var opts = {
        sourcemaps: createMap !== false
    };
    var outDir = Path.dirname(outputFile);
    var outFile = Path.basename(outputFile);
    var bundler = createBundler(sourceFile, opts);

    excludes && excludes.forEach(function (file) {
        bundler.exclude(file);
    });

    bundler.exclude(Path.resolve(__dirname, '../../DebugInfos.json'));

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

    var outFile = Path.basename(outputFile);
    var outDir = Path.dirname(outputFile);

    excludes = excludes.concat(jsbSkipModules);

    var bundler = createBundler(sourceFile);
    excludes.forEach(function (module) {
        bundler.exclude(require.resolve(module));
    });
    bundler.bundle()
        .on('error', HandleErrors.handler)
        .pipe(HandleErrors())
        .pipe(Source(outFile))
        .pipe(Buffer())
        .pipe(FixJavaScriptCore())
        .pipe(Utils.uglify('preview', { jsb: true, nativeRenderer: true }))
        .pipe(Optimizejs({
            sourceMap: false
        }))
        .pipe(Gulp.dest(outDir))
        .on('end', callback);
};

exports.buildJsb = function (sourceFile, outputFile, excludes, opt_macroFlags, callback, createMap) {
    if (typeof opt_macroFlags === 'function') {
        callback = opt_macroFlags;
        opt_macroFlags = null;
    }

    var opts = {
        sourcemaps: createMap !== false
    };

    let flags = Object.assign({ jsb: true, debug: true }, opt_macroFlags);
    let macro = Utils.getMacros('build', flags);
    let nativeRenderer = macro["CC_NATIVERENDERER"];

    if (opt_macroFlags && nativeRenderer) {
        opts.aliasifyConfig = jsbAliasify;
    }

    var FixJavaScriptCore = require('../util/fix-jsb-javascriptcore');

    var outFile = Path.basename(outputFile);
    var outDir = Path.dirname(outputFile);

    var bundler = createBundler(sourceFile, opts);
    if (nativeRenderer) {
        excludes = excludes.concat(jsbSkipModules);
    }
    excludes.forEach(function (module) {
        bundler.exclude(require.resolve(module));
    });
    bundler.bundle()
        .on('error', HandleErrors.handler)
        .pipe(HandleErrors())
        .pipe(Source(outFile))
        .pipe(Buffer())
        .pipe(FixJavaScriptCore())
        .pipe(Utils.uglify('build', flags))
        .pipe(Optimizejs({
            sourceMap: false
        }))
        .pipe(Gulp.dest(outDir))
        .on('end', callback);
};

exports.buildJsbMin = function (sourceFile, outputFile, excludes, opt_macroFlags, callback, createMap) {
    if (typeof opt_macroFlags === 'function') {
        callback = opt_macroFlags;
        opt_macroFlags = null;
    }

    var opts = {
        sourcemaps: createMap !== false
    };

    let flags = Object.assign({ jsb: true }, opt_macroFlags);
    let macro = Utils.getMacros('build', flags);
    let nativeRenderer = macro["CC_NATIVERENDERER"];

    if (opt_macroFlags && nativeRenderer) {
        opts.aliasifyConfig = jsbAliasify;
    }
    
    var FixJavaScriptCore = require('../util/fix-jsb-javascriptcore');

    var outFile = Path.basename(outputFile);
    var outDir = Path.dirname(outputFile);

    var bundler = createBundler(sourceFile, opts);
    if (nativeRenderer) {
        excludes = excludes.concat(jsbSkipModules);
    }
    excludes.forEach(function (module) {
        bundler.exclude(require.resolve(module));
    });

    bundler.exclude(Path.resolve(__dirname, '../../DebugInfos.json'));

    bundler.bundle()
        .on('error', HandleErrors.handler)
        .pipe(HandleErrors())
        .pipe(Source(outFile))
        .pipe(Buffer())
        .pipe(FixJavaScriptCore())
        .pipe(Utils.uglify('build', flags))
        .pipe(Optimizejs({
            sourceMap: false
        }))
        .pipe(Gulp.dest(outDir))
        .on('end', callback);
};

exports.buildRuntime = function (sourceFile, outputFile, excludes, opt_macroFlags, callback, createMap) {
    if (typeof opt_macroFlags === 'function') {
        callback = opt_macroFlags;
        opt_macroFlags = null;
    }

    var opts = {
        sourcemaps: createMap !== false
    };

    let flags = Object.assign({ jsb: false, runtime: true, debug: true }, opt_macroFlags);
    let macro = Utils.getMacros('build', flags);
    let nativeRenderer = macro["CC_NATIVERENDERER"];

    if (opt_macroFlags && nativeRenderer) {
        opts.aliasifyConfig = jsbAliasify;
    }

    var FixJavaScriptCore = require('../util/fix-jsb-javascriptcore');

    var outFile = Path.basename(outputFile);
    var outDir = Path.dirname(outputFile);

    var bundler = createBundler(sourceFile, opts);
    excludes.forEach(function (module) {
        bundler.exclude(require.resolve(module));
    });

    bundler.bundle()
        .on('error', HandleErrors.handler)
        .pipe(HandleErrors())
        .pipe(Source(outFile))
        .pipe(Buffer())
        .pipe(FixJavaScriptCore())
        .pipe(Utils.uglify('build', flags))
        .pipe(Optimizejs({
            sourceMap: false
        }))
        .pipe(Gulp.dest(outDir))
        .on('end', callback);
};

exports.buildRuntimeMin = function (sourceFile, outputFile, excludes, opt_macroFlags, callback, createMap) {
    if (typeof opt_macroFlags === 'function') {
        callback = opt_macroFlags;
        opt_macroFlags = null;
    }

    var opts = {
        sourcemaps: createMap !== false
    };

    let flags = Object.assign({ jsb: false, runtime: true }, opt_macroFlags);
    let macro = Utils.getMacros('build', flags);
    let nativeRenderer = macro["CC_NATIVERENDERER"];

    if (opt_macroFlags && nativeRenderer) {
        opts.aliasifyConfig = jsbAliasify;
    }
    
    var FixJavaScriptCore = require('../util/fix-jsb-javascriptcore');

    var outFile = Path.basename(outputFile);
    var outDir = Path.dirname(outputFile);

    var bundler = createBundler(sourceFile, opts);
    excludes.forEach(function (module) {
        bundler.exclude(require.resolve(module));
    });

    bundler.exclude(Path.resolve(__dirname, '../../DebugInfos.json'));

    bundler.bundle()
        .on('error', HandleErrors.handler)
        .pipe(HandleErrors())
        .pipe(Source(outFile))
        .pipe(Buffer())
        .pipe(FixJavaScriptCore())
        .pipe(Utils.uglify('build', flags))
        .pipe(Optimizejs({
            sourceMap: false
        }))
        .pipe(Gulp.dest(outDir))
        .on('end', callback);
};

exports.excludeAllDepends = function (excludedModules) {
    let modules = Fs.readJsonSync(Path.join(__dirname, '../../modules.json'));
    if (modules && modules.length > 0) {
        function _excludeMudules (muduleName) {
            if (excMudules[muduleName]) {
                return;
            }
            for (let module of modules) {
                if (module.name === muduleName) {
                    excMudules[muduleName] = module;
                    break;
                }
            }

            modules.forEach(module => {
                if (module.dependencies && module.dependencies.indexOf(muduleName) !== -1) {
                    _excludeMudules(module.name);
                }
            });
        }

        // exclude all mudules
        let excMudules = Object.create(null);

        excludedModules.forEach(_excludeMudules);

        let excludes = [];
        for (let key in excMudules) {
            let module = excMudules[key];
            if (module.entries) {
                module.entries.forEach(function (file) {
                    let path = Path.join(__dirname, '..', '..', file);
                    if (excludes.indexOf(path) === -1) {
                        excludes.push(path);
                    }
                });
            }
        }
        return excludes;
    }
    else {
        return [];
    }
};

exports.jsbSkipModules = jsbSkipModules;
