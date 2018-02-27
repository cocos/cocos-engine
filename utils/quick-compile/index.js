const Fs             = require('fire-fs');
const Path           = require('fire-path');
const Mdeps          = require('module-deps');
const JSONStream     = require('JSONStream');
const Concat         = require('concat-stream');
const BrowserResolve = require('browser-resolve');
const Async          = require('async');
const Del            = require('del');
const xtend          = require('xtend');
const builtins       = require('browserify/lib/builtins.js');
const Lodash         = require('lodash');

const babelPlugin    = require('./plugins/babel');
const modulePlugin   = require('./plugins/module');

const TEMP_NODE_MODULE_PATH = '__node_modules';
const COMBINE_COMPILE_SCRIPTS_TIMEOUT = 100;

function formatPath (path) {
    return path.replace(/\\/g, '/');
}

function Compiler () {

    // all parsed scripts 
    this._scriptsCache = [];

    // the scripts already parsed
    this._parsedScripts = [];
    
    // the scripts need to recompile passed from watcher
    this._scriptsToCompile = [];

    // the scripts missing modules
    // when add file, we should recompile these scripts
    this._missingScripts = [];

    this._watchedScripts = [];

    // script modify time
    this._mtimes = [];

    this.state = 'idle';
    
    this.plugins = [];

    this.globals = {
        // process: function () { return "require('_process')" }
    };

    this.exludes = [];
}

Object.assign(Compiler.prototype, {
    watch (opts, cb) {
        this.build(opts, () => {
            this._createWatcher(opts);
            if (cb) cb();
        });
    },

    _createWatcher (opts) {
        console.log('watching...');

        const Chokidar = require('chokidar');

        this.watching = true;
        
        let exts = opts.exts || ['.js'];
        let pattern = exts.map(extname => {
            return Path.join(this.root, '**/*' + extname);
        });

        let watcher = Chokidar.watch(pattern, {
            ignored: Path.join(this.out, '**'),
            ignoreInitial: true
        });
        
        watcher.on('all', (event, path) => {
            path = formatPath(path);

            if (event === 'add') {
                path = [path].concat(this._missingScripts);
                this.compileScripts(path);
                return;
            }

            let find = this._scriptsCache.find(s => s.src === path);
            if (!find) return;

            if (event === 'change') {
                if (opts.onlyRecordChanged) {
                    this._watchedScripts = Lodash.union(this._watchedScripts, [path]);
                }
                else {
                    this.compileScripts(path);
                }
            }
            else if (event === 'unlink') {
                this.removeScripts(path);
            }
        });

        if (this.watcher) {
            this.watcher.close();
        }
        this.watcher = watcher;
    },

    build (opts, cb) {        
        if (!opts.entries || opts.entries.length === 0) {
            console.error('Please specify the entries');
            return cb();
        }
        this.entries = opts.entries.map(formatPath);

        let root = opts.root;
        if (!root) {
            console.error('Please specify the root directory');
            return cb();
        }
        this.root = root;

        let out = opts.out;
        if (!out) {
            out = './quick-compile-temp'
        }
        this.out = out;
        
        if (opts.clear) {
            try {
                Del.sync(out, {force: true});
            }
            catch(err) {
                Editor.error(err);
            }
        }

        if (opts.plugins && Array.isArray(opts.plugins)) {
            this.plugins = opts.plugins.concat(this.plugins);
        }

        if (opts.exludes && Array.isArray(opts.exludes)) {
            this.exludes = opts.exludes.concat(this.exludes);
        }

        if (opts.globals) {
            Object.assign(this.globals, opts.globals);
        }

        this.rebuild(cb);
    },

    rebuild (cb) {        
        this.updateState('compiling');

        if (this.watching) {
            console.time('QuickCompiler watching rebuild finished');
            if (this._watchedScripts.length === 0) {
                console.timeEnd('QuickCompiler watching rebuild finished');
                return cb();
            }

            Async.each(this._watchedScripts, (path, done) => {
                this._parseEntry(path, false, done);
                this._parsedScripts.length = 0;
                this._watchedScripts.length = 0;
            }, err => {
                if (err) {
                    console.error(err);
                }
                console.timeEnd('QuickCompiler watching rebuild finished');
                cb();
            });
        }
        else {
            console.time('QuickCompiler rebuild finished');

            Async.each(this.entries, (entry, done) => {
                this._parseEntry(entry, true, done);
                this._parsedScripts.length = 0;
            }, err => {
                if (err) {
                    console.error(err);
                }
    
                console.timeEnd('QuickCompiler rebuild finished');
                this._compileFinished(cb);
            });
        }
    },

    getRelativePath (path) {
        return formatPath( Path.relative(this.root, path) );
    },

    getDstPath (path) {
        if (this.isNodeModulePath(path)) {
            return this.getNodeModuleDstPath(path);
        }
        let relative = this.getRelativePath(path);
        return formatPath( Path.join(this.out, Path.stripExt(relative) + '.js') );
    },

    isNodeModulePath (path) {
        return formatPath(path).indexOf('/node_modules/') !== -1;
    },

    getNodeModuleDstPath (path) {
        let relative = Path.join(TEMP_NODE_MODULE_PATH, path.slice(path.indexOf('/node_modules/')+'/node_modules/'.length));
        relative = Path.stripExt(relative) + '.js';
        return Path.join(this.out, relative);
    },

    updateState (state) {
        this.state = state;
    },

    compileScripts (paths, cb) {
        if (!Array.isArray(paths)) {
            paths = [paths];
        }

        this._scriptsToCompile = Lodash.union(this._scriptsToCompile, paths);
        this._compileScripts(cb);
    },

    _compileScripts (cb) {
        this.updateState('compiling');

        console.time('compileScript');
        Async.each(this._scriptsToCompile, (path, done) => {
            this._parseEntry(path, false, done);
        }, err => {
            if (err) {
                console.error(err);
            }

            this._scriptsToCompile.length = 0;
            this._parsedScripts.length = 0;

            this._compileFinished(() => {
                console.timeEnd('compileScript');
                if (cb) cb();
            });
        });
    },

    removeScripts (paths, uuids) {
        if (!Array.isArray(paths)) {
            paths = [paths];
        }

        let dstPaths = paths.map(path => {
            let tempPath = this.getDstPath(path);
            
            if (Fs.existsSync(tempPath)) {
                Del.sync(tempPath, {force: true});
            }

            let tempInfoPath = tempPath + '.info.json';
            if (Fs.existsSync(tempInfoPath)) {
                Del.sync(tempInfoPath, {force: true});
            }

            return tempPath;
        });

        this._scriptsToCompile = Lodash.pullAll(this._scriptsToCompile, paths);
        this._scriptsCache = this._scriptsCache.filter(script => dstPaths.indexOf(script.src) === -1);

        this._compileFinished();
    },

    _transform (path) {
        if (this.watching) {
            console.time('_transform: ' + path)
        }
        path = formatPath(path);

        let exlude = this.exludes.find(exlude => {
            return path.match(exlude);
        });
        if (exlude) {
            return '';
        }

        let parsed = this._parsedScripts.find(s => {
            return s.src === path;
        });
        if (parsed) {
            return parsed.source;
        }

        let script = {
            src: path,
            dst: this.getDstPath(path)
        }

        let stats = Fs.statSync(path);
        let statsPath = script.dst + '.info.json';
        if (Fs.existsSync(statsPath)) {
            let oldStats = JSON.parse(Fs.readFileSync(statsPath, 'utf8'));
            if (oldStats.mtime === stats.mtime.toJSON() && Fs.existsSync(script.dst)) {
                script.source = Fs.readFileSync(script.dst, 'utf8');
                return script.source;
            }
        }

        try {
            script.source = Fs.readFileSync(path, 'utf8');
        }
        catch (err) {
            console.error(err);
            return;
        }

        this.plugins.forEach(plugin => {
            if (this.isNodeModulePath(path) && !plugin.nodeModule && !plugin.transform) {
                return;
            }
            try {
                plugin.transform(script, this);
            }
            catch (err) {
                console.error(err);
            }
        });

        Fs.ensureDirSync(Path.dirname(script.dst));
        Fs.writeFileSync(script.dst, script.source);
        Fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));

        if (this.watching) {
            console.timeEnd('_transform: ' + path)
        }
        
        this._parsedScripts.push(script);
        return script.source;
    },

    _isFileInCache (path) {
        return this._scriptsCache.find(s => {
            return s.src === path;
        });
    },

    _refineScript (script) {
        script.src = script.file.replace(/\\/g, '/');
        script.dst = this.getDstPath(script.src);

        delete script.file;
        
        for (let key in script.deps) {
            script.deps[key] = script.deps[key].replace(/\\/g, '/');
        }
    },

    _parseEntry (path, deep, cb) {        
        let source = this._transform(path);

        console.time('parse modules')
        let concat = Concat(buf => {
            console.timeEnd('parse modules');
            let str = buf.toString();
            str = `{"scripts": ${str}}`;

            let scripts = [];
            try {
                scripts = JSON.parse(str).scripts;
            }
            catch (err) {
                Editor.error(err);
            }

            let cache = this._scriptsCache;

            Async.each(scripts, (script, done) => {
                this._refineScript(script);

                if (!deep && script.src !== path) {
                    return done();
                }


                let index = cache.findIndex(s => {
                    return s.src === script.src;
                });

                if (index === -1) {
                    cache.push(script);
                }
                else {
                    cache.splice(index, 1, script);
                }

                done();
            }, err => {
                cb(err);
            });
        });

        var mopts = {
            extensions: [ '.js', '.json' ],

            // ignore missing module, or it will break analyse process。
            ignoreMissing: true
        };

        mopts.resolve = (id, parent, cb) => {
            parent.paths = require.main.paths.concat(parent.paths);
            BrowserResolve(id, parent, (err, path) => {
                if (!err && (deep || !this._isFileInCache(path))) {
                    this._transform(path);
                }
                cb(err, path);
            });
        };

        mopts.modules = xtend(builtins);

        mopts.persistentCache = (
            file,       // the path to the file that is loaded
            id,         // the id that is used to reference this file
            pkg,        // the package that this file belongs to fallback
            fallback,   // async fallback handler to be called if the cache doesn't hold the given file 
            cb) => {
            
            process.nextTick(function () {
                if (!deep && file !== path) {
                    fallback('module.exports = {};', cb);
                }
                else {
                    fallback(null, cb);
                }
            });
        };

        if (Object.keys(this.globals).length !== 0) {
            let insertGlobals = require('insert-module-globals');
            mopts.globalTransform = file => {
                return insertGlobals(file, {
                    vars: this.globals
                });
            };
        }

        mopts.fileCache = {};
        mopts.fileCache[path] = source
        
        var md = new Mdeps(mopts);
        md.pipe(JSONStream.stringify()).pipe(concat);
        md.write({ file: path });
        md.end();

        md.on('missing', (id, parent) => {
            console.log(`Cannot resolve module [${id}] when parse [${parent.filename}]`);
            this._missingScripts = Lodash.union(this._missingScripts, [formatPath(parent.filename)]);
        });
    },

    _compileFinished (cb) {
        this._scriptsCache = Lodash.sortBy(this._scriptsCache, 'file');

        Async.each(this.plugins, (plugin, done) => {
            if (!plugin.compileFinished) {
                return done();
            }

            plugin.compileFinished(this, done);
        }, err => {
            if (err) {
                console.error(err);
            }

            if (this.onCompileFinished) {
                this.onCompileFinished(err);
            }

            this.updateState('idle');
            if (cb) cb();
        });
    },
});

Compiler.prototype._compileScripts = Lodash.debounce(Compiler.prototype._compileScripts, COMBINE_COMPILE_SCRIPTS_TIMEOUT);

module.exports = Compiler;
