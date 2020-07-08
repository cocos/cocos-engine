'use strict';

const Path = require('path');
allowReturnOutsideFunctionInBrowserifyTransform();
const Fs = require('fs');
const Del = require('del');

const dropPureExport = require('./drop-pure-export');
const inlineProp = require('./inline-prop');
const polyfillPromisify = require('./polyfill-node-promisify');

const preludePath = Path.resolve(__dirname, '../browserify_prelude.js');
const prelude = Fs.readFileSync(preludePath, 'utf8');

function allowReturnOutsideFunctionInBrowserifyTransform () {
    var paths = [
        'browserify/node_modules/syntax-error/node_modules/acorn',
        'syntax-error/node_modules/acorn',
        'acorn'
    ];
    function patch (path) {
        var acorn = require(path);
        var parse = acorn.parse;
        if (typeof parse === 'function') {
            if (acorn.parse.name !== 'monkeyPatchedParse') {
                acorn.parse = function monkeyPatchedParse(input, options) {
                    if (options) {
                        options.allowReturnOutsideFunction = true;
                    }
                    else {
                        options = {
                            allowReturnOutsideFunction: true
                        };
                    }
                    return parse(input, options);
                };
            }
        }
        else {
            console.error('Can not find acorn.parse to patch');
        }
    }

    var patched = false;
    for (var i = 0; i < paths.length; i++) {
        try {
            patch(paths[i]);
            patched = true;
        }
        catch (e) {
        }
    }
    if (!patched) {
        console.error('Can not find acorn to patch');
    }
}

/*
 * @param [options.sourcemaps = true]
 * @param [options.babelifyOpt]
 * @param [options.aliasifyConfig]
 */
module.exports = function createBundler(entryFiles, options) {

    // Ignore IDE compiled JavaScript files
    Del.sync('./cocos2d/core/platform/deserialize-compiled.js');
    Del.sync('./cocos2d/core/value-types/*.js');

    // https://github.com/substack/node-browserify#methods
    var browserifyOpt = {
        extensions: ['.js', '.json', '.ts'],
        entries: [].concat(entryFiles),
        debug: (options && 'sourcemaps' in options) ? options.sourcemaps : true,
        detectGlobals: false,    // dont insert `process`, `global`, `__filename`, and `__dirname`
        bundleExternal: !!(options && options.bundleExternal) || false,   // dont bundle external modules
        //standalone: 'engine-framework',
        //basedir: tempScriptDir

        // define custom prelude to optimize script evaluate time
        prelude: prelude,
        preludePath: Path.relative(process.cwd(), preludePath),
    };

    var presets = [
        [
            require('@babel/preset-env'),
            {
                "loose": true,
                // "bugfixes": true, since babel 7.9
            }
        ],
        {
            plugins: [
                [
                    require('@babel/plugin-proposal-decorators'),
                    { legacy: true },
                ],
                [
                    require('@babel/plugin-proposal-class-properties'),
                    { loose: true },
                ],
            ]
        },
        [
            require('@babel/preset-typescript'),
            {
                allowDeclareFields: true,
            }
        ],
    ];

    var plugins = [
    //     // < 6.16.0
    //     [ 'babel-plugin-parser-opts', { allowReturnOutsideFunction: true } ]
        [
            require('babel-plugin-const-enum'),
            { transform: "constObject" },
        ],
        [
            require('babel-plugin-add-module-exports'),
        ],
    ];

    var Babelify;
    try {
        Babelify = require('babelify');
    } catch (e) {
        console.error('Please run "npm install babelify".');
        throw e;
    }
    var aliasify;
    try {
        aliasify = require('aliasify');
    } catch (e) {
        console.error('Please run "npm install aliasify".');
        throw e;
    }

    var b;
    if (options && options.cacheDir) {
        // https://github.com/royriojas/persistify
        const Persistify = require('persistify');
        b = Persistify(browserifyOpt, {
            recreate: false,
            cacheId: require('../../package.json').version + entryFiles,
            cacheDir: options.cacheDir
        });
    }
    else {
        const Browserify = require('browserify');
        b = new Browserify(browserifyOpt);
    }

    b = b.exclude(Path.join(__dirname, '../../package.json'));

    if (browserifyOpt.bundleExternal) {
        b = b.transform(polyfillPromisify);
    }

    return b
        .transform(dropPureExport)
        .transform(inlineProp.inlineConst)
        .transform(Babelify, (options && options.babelifyOpt) || {
            extensions: ['.ts', '.js'],
            presets: (options && options.presets) || presets,
            plugins: (options && options.plugins && options.plugins.concat(plugins)) || plugins,

            // >= 6.16.0
            // parserOpts: {
            //     allowReturnOutsideFunction: true,
            // },

            comments: true,
            ast: false,
            babelrc: false,
            highlightCode: false,
            sourceMaps: true,
            compact: false
        })
        .transform(inlineProp.inlineEnum)
        .transform(aliasify, (options && options.aliasifyConfig) || {});
};
