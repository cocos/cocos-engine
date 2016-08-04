var gulp = require('gulp');
var Watchify = require('watchify');
var Browserify = require('browserify');
var Fs = require('fs');

function watchFile(opts) {
    var bundler = new Browserify(opts.entries, {
        cache: {},
        packageCache: {},
        debug: true,
        detectGlobals: false,    // dont insert `process`, `global`, `__filename`, and `__dirname`
        bundleExternal: false,   // dont bundle external modules
        plugin: [Watchify]
    });
     
    bundler.on('update', bundle);

    if (opts.skips) {
        var skips = opts.skips;
        for (var i = 0; i < skips.length; ++i) {
            var file = require.resolve(skips[i]);
            bundler.ignore(file);
        }    
    }
     
    function bundle() {
        var name = new Date().toTimeString() + ' : browserify for ' + opts.dest + '.   ';
        console.time(name);

        var w = Fs.createWriteStream(opts.dest);
        if (opts.prefix) {
            if (typeof opts.prefix === 'function') {
                w.write(opts.prefix());
            }
            else if (typeof opts.prefix === 'string') {
                w.write(opts.prefix);
            }
        }

        return bundler.bundle(function () {
            console.timeEnd(name);
        }).pipe(w);
    }
    
    return bundle();
}

exports.preview = function (sourceFile, outputFile) {
    return watchFile({
        entries: sourceFile,
        dest: outputFile,
        prefix: 'CC_DEV = true;\n'
    });
};

exports.jsbPolyfill = function (sourceFile, outputFile, skipModules) {
    return watchFile({
        entries: sourceFile,
        dest: outputFile,
        prefix: function () {
            var prefix = 'CC_DEV = true;\n';
            prefix += 'CC_JSB = true;\n';

            return prefix;
        },
        skips: skipModules
    });
};