'use strict';

const Path = require('path');
const Browserify = require('browserify');

exports.uglifyOptions = function (minify, global_defs) {
    if (minify) {
        return {
            compress: {global_defs: global_defs}
        };
    }

    return {
        mangle: false,
        //preserveComments: 'all',
        output: {
            // http://lisperator.net/uglifyjs/codegen
            beautify: true,
            bracketize: true
        },
        compress: {
            // https://github.com/mishoo/UglifyJS2#compressor-options
            global_defs: global_defs,
            sequences: false,  // join consecutive statements with the “comma operator”
            properties: false,  // optimize property access: a["foo"] → a.foo
            //dead_code: true,  // discard unreachable code
            drop_debugger: false,  // discard “debugger” statements
            unsafe: false, // some unsafe optimizations (see below)
            //conditionals: false,  // optimize if-s and conditional expressions
            //comparisons: false,  // optimize comparisons
            //evaluate: true,  // evaluate constant expressions
            booleans: false,  // optimize boolean expressions
            loops: false,  // optimize loops
            unused: false,  // drop unused variables/functions
            hoist_funs: false,  // hoist function declarations
            hoist_vars: false, // hoist variable declarations
            if_return: false,  // optimize if-s followed by return/continue
            join_vars: false,  // join var declarations
            cascade: false,  // try to cascade `right` into `left` in sequences
            collapse_vars: false,
            //warnings: true,
            negate_iife: false,
            pure_getters: false,
            pure_funcs: null,
            drop_console: false,
            keep_fargs: true,
            keep_fnames: true,
            side_effects: false  // drop side-effect-free statements
        }
    };
};

exports.createBundler = function createBundler(entryFiles) {
    // https://github.com/substack/node-browserify#methods
    var options = {
        debug: true, //temporarily disable due to an asar packing bug
        detectGlobals: false,    // dont insert `process`, `global`, `__filename`, and `__dirname`
        bundleExternal: false    // dont bundle external modules
        //standalone: 'engine-framework',
        //basedir: tempScriptDir
    };
    return new Browserify(entryFiles, options)
        .exclude(Path.join(__dirname, '../../package.json'));
};