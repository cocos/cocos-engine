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

var Path = require('path');
var Fs = require('fire-fs');
var Del = require('del');

var gulp = require('gulp');
var mirror = require('gulp-mirror');
var pipe = require('multipipe');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var es = require('event-stream');
var size = require('gulp-size');
var chalk = require('chalk');

var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var handleErrors = require('../util/handleErrors');
//var babelify = require('babelify');

require('./build-cocos2d');

function getUglifyOptions (minify, global_defs) {
    if (minify) {
        return {
            compress: {
                global_defs: global_defs,
            }
        };
    }
    else {
        var compress = {
            // http://lisperator.net/uglifyjs/compress
            global_defs: global_defs,
            sequences: false,  // join consecutive statements with the “comma operator”
            properties: false,  // optimize property access: a["foo"] → a.foo
            //dead_code: true,  // discard unreachable code
            drop_debugger: false,  // discard “debugger” statements
            unsafe: false, // some unsafe optimizations (see below)
            conditionals: false,  // optimize if-s and conditional expressions
            comparisons: false,  // optimize comparisons
            //evaluate: true,  // evaluate constant expressions
            booleans: false,  // optimize boolean expressions
            loops: false,  // optimize loops
            unused: false,  // drop unused variables/functions
            hoist_funs: false,  // hoist function declarations
            hoist_vars: false, // hoist variable declarations
            if_return: false,  // optimize if-s followed by return/continue
            join_vars: false,  // join var declarations
            cascade: false,  // try to cascade `right` into `left` in sequences
            side_effects: false  // drop side-effect-free statements
            //warnings: true  // warn about potentially dangerous optimizations/code
        };
        return {
            mangle: false,
            //preserveComments: 'all',
            output: {
                // http://lisperator.net/uglifyjs/codegen
                beautify: true,
                bracketize: true
            },
            compress: compress
        };
    }
}

function printSizes (sizeGetter, minSizeGetter, zippedSizeGetter) {
    return es.through(null, function () {
        console.log('Size of web engine: zipped: ' + chalk.cyan(zippedSizeGetter.size.toLocaleString() + 'B') +
                    ', minimized: ' + chalk.cyan(minSizeGetter.size.toLocaleString() + 'B') +
                    ', raw: ' + chalk.cyan(sizeGetter.size.toLocaleString() + 'B') +
                    ', compression ratio: ' + chalk.magenta((zippedSizeGetter.size / sizeGetter.size * 100).toFixed(2) + '%'));
        this.emit('end');
    });
}

function rebundle_html_dev_min(bundler) {
    console.log('Compiling ' + paths.outFileDev + ' and ' + paths.outFile + ' ...');

    function createSizeGetter (gzip) {
        return size({
            gzip: gzip,
            pretty: false,
            showTotal: false,
            showFiles: false,
        });
    }

    var sizeGetter = createSizeGetter(false);
    var minSizeGetter = createSizeGetter(false);
    var zippedSizeGetter = createSizeGetter(true);

    var devPipes = [
        uglify(getUglifyOptions(false, {
            CC_EDITOR: false,
            CC_DEV: true,
            CC_TEST: false,
            CC_JSB: false
        })),
        sizeGetter
    ];
    var minPipes = [
        rename(paths.outFile),
        uglify(getUglifyOptions(true, {
            CC_EDITOR: false,
            CC_DEV: false,
            CC_TEST: false,
            CC_JSB: false
        })),
        minSizeGetter,
        zippedSizeGetter,
    ];

    return bundler.bundle()
        .on('error', handleErrors.handler)
        .pipe(handleErrors())
        .pipe(source(paths.outFileDev))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(mirror(pipe(devPipes), pipe(minPipes)))
        .pipe(printSizes(sizeGetter, minSizeGetter, zippedSizeGetter))
        .pipe(sourcemaps.write('./', {sourceRoot: './', addComment: true}))
        .pipe(gulp.dest(paths.outDir));
}

function rebundle(bundler, name, options) {
    var macros = options && options.macros;     // default false
    // only if macros                           // default false
    var sourceMaps = !!((options && ('sourceMaps' in options)) ? options.sourceMaps : macros);
    var minify = !!(options && options.minify); // default false

    var bundle = bundler.bundle()
        .on('error', handleErrors.handler)
        .pipe(handleErrors())
        .pipe(source(name))
        .pipe(buffer());

    if (macros) {
        console.log('Compiling ' + name + ' ...');
        if (sourceMaps) {
            bundle = bundle.pipe(sourcemaps.init({loadMaps: true}));
        }
        bundle = bundle.pipe(uglify(getUglifyOptions(minify, macros)));
        if (sourceMaps) {
            bundle = bundle.pipe(sourcemaps.write('./', {sourceRoot: './', addComment: true}));
        }
    }
    bundle = bundle.pipe(gulp.dest(paths.outDir));

    return bundle;
}

function createBundler(entryFiles) {
    // https://github.com/substack/node-browserify#methods
    var options = {
        debug: true, //temporarily disable due to an asar packing bug
        detectGlobals: false,    // dont insert `process`, `global`, `__filename`, and `__dirname`
        bundleExternal: false    // dont bundle external modules
        //standalone: 'engine-framework',
        //basedir: tempScriptDir
    };
    return new browserify(entryFiles, options)
        .exclude('package.json');
}

gulp.task('build-html5', ['build-modular-cocos2d'], function () {
    return rebundle_html_dev_min(createBundler(paths.jsEntry));
});

gulp.task('clean-test', function (done) {
    Del([paths.test.destEditorExtends, paths.test.dest],
        // sometimes it may need to delay 100ms to ensure build-test will be execute...
        setTimeout(function () {
            done();
        }, 100));
});

gulp.task('build-test', ['build-modular-cocos2d', 'clean-test'], function () {
    var engine = rebundle(createBundler(paths.jsEntry), Path.basename(paths.test.dest));
    if (Fs.existsSync(paths.test.jsEntryEditorExtends)) {
        var bundler = createBundler(paths.test.jsEntryEditorExtends);
        //bundler = bundler.transform(babelify.configure({
        //    presets: ["es2015"]
        //}));
        var editorExtends = rebundle(bundler, Path.basename(paths.test.destEditorExtends));
        return es.merge(engine, editorExtends);
    }
    else {
        // not in editor, skip editor extend
        return engine;
    }
});

gulp.task('build-preview', ['build-modular-cocos2d'], function () {
    return rebundle(createBundler(paths.jsEntry), Path.basename(paths.preview.dest), {
        macros: {
            CC_EDITOR: false,
            CC_DEV: true,
            CC_TEST: false,
            CC_JSB: false
        },
        sourceMaps: true
    });
});

function rebundle_jsb(bundler, name, minify) {
    var skips = paths.jsb.skipModules;
    for (var i = 0; i < skips.length; ++i) {
        bundler.ignore(require.resolve(skips[i]));
    }
    rebundle(bundler, name, {
        minify: minify,
        macros: {
            CC_EDITOR: false,
            CC_DEV: false,
            CC_TEST: false,
            CC_JSB: true
        }
    });
}

gulp.task('build-jsb-extends-min', function () {
    var jsbPolyfill = rebundle_jsb(createBundler(paths.jsb.entries), paths.jsb.outFile, true);
    return jsbPolyfill;
});
gulp.task('build-jsb-extends-dev', function () {
    var jsbPolyfill = rebundle_jsb(createBundler(paths.jsb.entries), paths.jsb.outFileDev, false);
    return jsbPolyfill;
});

gulp.task('build', ['build-html5', 'build-preview', 'build-jsb-extends-min', 'build-jsb-extends-dev']);
gulp.task('build-min', ['build-html5', 'build-jsb-extends-min']);
gulp.task('build-dev', ['build-preview', 'build-jsb-extends-dev'], function (done) {
    // make dist version dirty
    Del(['./bin/cocos2d-js.js', './bin/cocos2d-js-min.js', './bin/jsb_polyfill.js'], done);
});
