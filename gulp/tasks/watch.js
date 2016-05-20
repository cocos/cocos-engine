var gulp = require('gulp');
var watchify = require('watchify');
var browserify = require('browserify');
var Fs = require('fs');
var Path = require('path');

function watchFile(opts) {
    var bundler = new browserify(opts.entries, {
        cache: {},
        packageCache: {},
        debug: true,
        detectGlobals: false,    // dont insert `process`, `global`, `__filename`, and `__dirname`
        bundleExternal: false,   // dont bundle external modules
        plugin: [watchify]
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

gulp.task('watch-preview', function () {
    return watchFile({
        entries: paths.jsEntry,
        dest: paths.preview.dest,
        prefix: 'CC_DEV = true;\n'
    });
});

gulp.task('watch-jsb-polyfill', function () {
    return watchFile({
        entries: paths.jsb.entries,
        dest: Path.join(paths.outDir, paths.jsb.outFileDev),
        prefix: function () {
            var prefix = 'CC_DEV = true;\n';
            prefix += 'CC_JSB = true;\n';
            
            return prefix;
        },
        skips: paths.jsb.skipModules
    });
});

gulp.task('watch-dev-files', ['watch-preview', 'watch-jsb-polyfill']);
