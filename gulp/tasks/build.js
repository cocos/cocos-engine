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
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var es = require('event-stream');

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

function rebundle(bundler) {
    var dev = uglify(getUglifyOptions(false, {
        CC_EDITOR: false,
        CC_DEV: false,
        CC_TEST: false,
        CC_JSB: false
    }));

    var min = rename({ suffix: '-min' });
    min.pipe(uglify(getUglifyOptions(true, {
            CC_EDITOR: false,
            CC_DEV: false,
            CC_TEST: false,
            CC_JSB: false
        })));

    return bundler.bundle()
        .on('error', handleErrors.handler)
        .pipe(handleErrors())
        .pipe(source(paths.outFile))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(mirror(dev, min))
        .pipe(sourcemaps.write('./', {sourceRoot: './', addComment: true}))
        .pipe(gulp.dest(paths.outDir));
}

function rebundle_test(bundler, suffix) {

    var PreProcess = false;
    var TestEditorExtends = true;   // if PreProcess
    var SourceMap = false;          // if PreProcess

    var bundle = bundler.bundle()
        .on('error', handleErrors.handler)
        .pipe(handleErrors())
        .pipe(source(paths.outFile))
        .pipe(buffer())
        .pipe(rename({ suffix: suffix }));

    if (PreProcess) {
        if (SourceMap) {
            bundle = bundle.pipe(sourcemaps.init({loadMaps: true}));
        }
        bundle = bundle.pipe(uglify(getUglifyOptions(false, {
                CC_EDITOR: TestEditorExtends,
                CC_DEV: TestEditorExtends || true,
                CC_TEST: true,
                CC_JSB: false
            })));
        if (SourceMap) {
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
    console.log('This will take some minutes...');
    return rebundle(createBundler(paths.jsEntry));
});


gulp.task('clean-test', function (done) {
    Del([paths.test.destEditorExtends, paths.test.dest],
        // sometimes it may need to delay 100ms to ensure build-test will be execute...
        setTimeout(function () {
            done();
        }, 100));
});

gulp.task('build-test', ['build-modular-cocos2d', 'clean-test'], function () {
    var engine = rebundle_test(createBundler(paths.jsEntry), '-for-test');
    if (Fs.existsSync(paths.test.jsEntryEditorExtends)) {
        var bundler = createBundler(paths.test.jsEntryEditorExtends);
        //bundler = bundler.transform(babelify.configure({
        //    presets: ["es2015"]
        //}));
        var editorExtends = rebundle_test(bundler, '-extends-for-test');
        return es.merge(engine, editorExtends);
    }
    else {
        // not in editor, skip editor extend
        return engine;
    }
});

function rebundle_jsb(bundler, minify, suffix) {
    var SourceMap = false;
    var skips = paths.JSBSkipModules;
    for (var i = 0; i < skips.length; ++i) {
        bundler.ignore(require.resolve(skips[i]));
    }
    var bundle = bundler.bundle()
        .on('error', handleErrors.handler)
        .pipe(handleErrors())
        .pipe(source(paths.JSBOutFile))
        .pipe(buffer())
        .pipe(rename({ suffix: suffix }));
    if (SourceMap) {
        bundle = bundle.pipe(sourcemaps.init({loadMaps: true}));
    }
    bundle = bundle.pipe(uglify(getUglifyOptions(minify, {
        CC_EDITOR: false,
        CC_DEV: false,
        CC_TEST: false,
        CC_JSB: true
    })));
    if (SourceMap) {
        bundle = bundle.pipe(sourcemaps.write('./', {sourceRoot: './', addComment: true}));
    }
    return bundle.pipe(gulp.dest(paths.outDir));
}

gulp.task('build-jsb-extends-min', function () {
    var jsbPolyfill = rebundle_jsb(createBundler(paths.JSBEntries), true, '_polyfill');
    return jsbPolyfill;
});

gulp.task('build-jsb-extends-dev', function () {
    var jsbPolyfill = rebundle_jsb(createBundler(paths.JSBEntries), false, '_polyfill.dev');
    return jsbPolyfill;
});


gulp.task('build', ['build-html5', 'build-jsb-extends-min', 'build-jsb-extends-dev']);

gulp.task('fast-build', ['build-dev'], function () {
    console.warn('[fast-build] is obsoleted, use [build-dev] instead please.');
});

gulp.task('build-dev', ['build-test', 'build-jsb-extends-min', 'build-jsb-extends-dev'], function (done) {
    Del(['./bin/cocos2d-js.js', './bin/cocos2d-js-min.js',], done);
});
