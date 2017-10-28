var Watchify = require('watchify');
var Browserify = require('browserify');
var Fs = require('fs');

var Path = require('path');
var through = require('through');

var Engine = require('./engine');

// var source = require('vinyl-source-stream');
// var buffer = require('vinyl-buffer');
// var sourcemaps = require('gulp-sourcemaps');

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

        // append prefix to index.js
        var prefix = '';
        if (opts.prefix) {
            if (typeof opts.prefix === 'function') {
                prefix = opts.prefix();
            }
            else if (typeof opts.prefix === 'string') {
                prefix = opts.prefix;
            }
        }

        bundler.transform(function (file) {
            var data = '';
            
            if (Path.basename(file) === 'index.js') {
                data += prefix;
            }

            return through(write, end);

            function write (buf) { data += buf; }
            function end () {
                this.queue(data);
                this.queue(null);
            }
            return;
        });

        // do bundle
        var b = bundler.bundle();

        b.on('end', function () {
            console.timeEnd(name);
        });

        b = b.pipe(Fs.createWriteStream(opts.dest));

        // fixed chinese character in source maps
        // b = b.pipe(source(Path.basename(opts.dest)))
        //     .pipe(buffer())
        //     .pipe(sourcemaps.init({loadMaps: true}))
        //     .pipe(sourcemaps.write('./'))
        //     .pipe(gulp.dest(Path.dirname(opts.dest)));
        
        return b;
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

exports.jsbPolyfill = function (sourceFile, outputFile) {
    return watchFile({
        entries: sourceFile,
        dest: outputFile,
        prefix: function () {
            var prefix = 'CC_DEV = true;\n';
            prefix += 'CC_JSB = true;\n';

            return prefix;
        },
        skips: Engine.jsbSkipModules
    });
};