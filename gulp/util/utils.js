
const PLATFORM_MACROS = ['CC_EDITOR', 'CC_PREVIEW', 'CC_BUILD', 'CC_TEST'];

// generate macros for uglify's global_defs
// platform: editor | preview | build | test
exports.getMacros = function (platform, isJSB, isDebugBuild) {
    var platformMacro = 'CC_' + platform.toUpperCase();
    if (PLATFORM_MACROS.indexOf(platformMacro) === -1) {
        throw new Error('Unknown platform: ' + platform);
    }
    var res = {};
    for (var i = 0; i < PLATFORM_MACROS.length; i++) {
        var macro = PLATFORM_MACROS[i];
        res[macro] = (macro === platformMacro);
    }
    res['CC_DEV'] = res['CC_EDITOR'] || res['CC_PREVIEW'] || res['CC_TEST'];
    res['CC_DEBUG'] = res['CC_DEV'] || !!isDebugBuild;
    res['CC_JSB'] = !!isJSB;
    return res;
};

exports.getUglifyOptions = function (platform, isJSB, isDebugBuild) {
    var global_defs = exports.getMacros(platform, isJSB, isDebugBuild);
    if (!global_defs['CC_DEBUG']) {
        return {
            compress: {
                global_defs: global_defs,
                // keep_infinity: true
            }
        };
    }

    return {
        mangle: false,
        //preserveComments: 'all',
        output: {
            // http://lisperator.net/uglifyjs/codegen
            beautify: true,
            bracketize: true,
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
            comparisons: false,  // optimize comparisons
            //evaluate: true,  // evaluate constant expressions
            booleans: false,  // optimize boolean expressions
            typeofs: false,  // Transforms typeof foo == "undefined" into foo === void 0. Note: recommend to set this value to false for IE10 and earlier versions due to known issues.
            loops: false,  // optimize loops
            unused: false,  // drop unused variables/functions
            hoist_funs: false,  // hoist function declarations
            hoist_vars: false, // hoist variable declarations
            if_return: false,  // optimize if-s followed by return/continue
            inline: false,  // embed simple functions
            join_vars: false,  // join var declarations
            cascade: false,  // try to cascade `right` into `left` in sequences
            collapse_vars: false,   // Collapse single-use non-constant variables - side effects permitting.
            reduce_vars: false, // Improve optimization on variables assigned with and used as constant values.
            //warnings: true,
            negate_iife: false,
            pure_getters: false,
            pure_funcs: null,
            drop_console: false,
            // expression: false, // Pass true to preserve completion values from terminal statements without return, e.g. in bookmarklets.
            keep_fargs: true,
            keep_fnames: true,
            // keep_infinity: false,  // Pass true to prevent Infinity from being compressed into 1/0, which may cause performance issues on Chrome.
            side_effects: false  // drop side-effect-free statements
        }
    };
};
