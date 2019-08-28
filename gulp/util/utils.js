
const PLATFORM_MACROS = ['CC_EDITOR', 'CC_PREVIEW', 'CC_BUILD', 'CC_TEST'];
const FLAGS = ['support_jit', 'jsb', 'runtime', 'debug', 'nativeRenderer', 'minigame'];

// generate macros for uglify's global_defs
// available platforms: 'editor' | 'preview' | 'build' | 'test'
// available keys of flags: 'jsb' | 'runtime' | 'minigame' | 'debug' | 'nativeRenderer'
exports.getMacros = function (platform, flags) {
    // platform macros
    var platformMacro = 'CC_' + platform.toUpperCase();
    if (PLATFORM_MACROS.indexOf(platformMacro) === -1) {
        throw new Error('Unknown platform: ' + platform);
    }
    var res = {};
    for (let i = 0; i < PLATFORM_MACROS.length; i++) {
        let macro = PLATFORM_MACROS[i];
        res[macro] = (macro === platformMacro);
    }

    // flag macros
    if (flags) {
        for (let flag in flags) {
            if (flags.hasOwnProperty(flag) && flags[flag]) {
                if (FLAGS.indexOf(flag) === -1) {
                    throw new Error('Unknown flag: ' + flag);
                }
            }
        }
    }
    for (let i = 0; i < FLAGS.length; i++) {
        let flag = FLAGS[i];
        let macro = 'CC_' + flag.toUpperCase();
        res[macro] = !!(flags && flags[flag]);
    }

    // debug macros
    res['CC_DEV'] = res['CC_EDITOR'] || res['CC_PREVIEW'] || res['CC_TEST'];
    res['CC_DEBUG'] = res['CC_DEBUG'] || res['CC_DEV'];
    res['CC_SUPPORT_JIT'] = !(res['CC_RUNTIME'] || res['CC_MINIGAME']);
    res['CC_NATIVERENDERER'] = res['CC_JSB'] && true;
    return res;
};

// see https://github.com/mishoo/UglifyJS2/tree/harmony#compress-options
exports.getUglifyOptions = function (platform, flags) {
    var global_defs = exports.getMacros(platform, flags);
    var releaseMode = !global_defs['CC_DEBUG'];

    var optimizeForJSC = releaseMode && global_defs['CC_JSB'];
    if (optimizeForJSC) {
        return {
            parse: {
                bare_returns: true
            },
            toplevel: false,
            compress: {
                global_defs: global_defs,
                negate_iife: false,
                sequences: false,
                keep_infinity: true,    // reduce jsc file size
                typeofs: false,
                inline: 1,              // workaround mishoo/UglifyJS2#2842
                reduce_funcs: false,
            },
            output: {
                beautify: true,         // really preserve_lines
                indent_level: 0,        // reduce jsc file size
            }
        };
    }

    if (releaseMode) {
        return {
            parse: {
                bare_returns: true
            },
            toplevel: false,
            compress: {
                global_defs: global_defs,
                negate_iife: false,
                inline: 1,              // workaround mishoo/UglifyJS2#2842
                reduce_funcs: false,    // keep single-use functions being cached
            },
            output: {
                ascii_only: true,
            }
        };
    }
    else {
        return {
            parse: {
                bare_returns: true
            },
            toplevel: false,
            compress: {
                global_defs: global_defs,
                negate_iife: false,
                sequences: false,  // join consecutive statements with the “comma operator”
                properties: false,  // optimize property access: a["foo"] → a.foo
                // dead_code: true,  // discard unreachable code
                drop_debugger: false,  // discard “debugger” statements
                // ecma: 5, // transform ES5 code into smaller ES6+ equivalent forms
                // evaluate: true,  // evaluate constant expressions
                unsafe: false, // some unsafe optimizations (see below)
                // computed_props: true,
                // conditionals: false,  // optimize if-s and conditional expressions
                comparisons: false,  // optimize comparisons
                booleans: false,  // optimize boolean expressions
                typeofs: false,  // Transforms typeof foo == "undefined" into foo === void 0. Note: recommend to set this value to false for IE10 and earlier versions due to known issues.
                loops: false,  // optimize loops
                unused: false,  // drop unused variables/functions
                hoist_funs: false,  // hoist function declarations
                hoist_props: false,
                hoist_vars: false, // hoist variable declarations
                if_return: false,  // optimize if-s followed by return/continue
                inline: false,  // embed simple functions
                join_vars: false,  // join var declarations
                collapse_vars: false,   // Collapse single-use non-constant variables - side effects permitting.
                reduce_funcs: false,
                reduce_vars: false, // Improve optimization on variables assigned with and used as constant values.
                //warnings: true,
                pure_getters: false,
                pure_funcs: null,
                drop_console: false,
                // expression: false, // Pass true to preserve completion values from terminal statements without return, e.g. in bookmarklets.
                keep_fargs: true,
                keep_fnames: true,
                keep_infinity: true,  // Pass true to prevent Infinity from being compressed into 1/0, which may cause performance issues on Chrome.
                side_effects: false,  // drop side-effect-free statements
            },
            mangle: false,
            //preserveComments: 'all',
            output: {
                // http://lisperator.net/uglifyjs/codegen
                beautify: true,
                indent_level: 2,
                ascii_only: true,
            },
        };
    }
};

exports.uglify = function (platform, isJSB, isDebugBuild) {
    const Composer = require('gulp-uglify/composer');
    const Uglify = require('uglify-es');
    const minify = Composer(Uglify);
    return minify(exports.getUglifyOptions(platform, isJSB, isDebugBuild));
};
