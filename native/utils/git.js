'use strict';

var Fs = require('fs');
var Path = require('path');
var Chalk = require('chalk');
var Spawn = require('child_process').spawn;
var treekill = require('tree-kill');
var Async = require('async');

function exec(cmdArgs, path, cb, options) {
    var timeout = (options && options.timeout) || 600000;
    var autoRetry = options && options.autoRetry;
    var autoKill = !options || (options.autoKill !== false);

    console.log(Chalk.yellow('git ' + cmdArgs.join(' ')), 'in', Chalk.magenta(path));

    var child = Spawn('git', cmdArgs, {
        cwd: path,
        stdio: [0, 'pipe', 'pipe']
    });

    var offbranch = false;
    var aborted = false;
    var timerId = -1;

    function retry () {
        console.log(Chalk.yellow(`restart "${cmdArgs[0]}": ${Path.basename(path)}`));
        exec(cmdArgs, path, cb, options); // Object.assign({}, options, { autoRetry: false })
    }

    function onConnectionError () {
        aborted = true;
        clearTimeout(timerId);
        console.log(Chalk.yellow(`connection timeout/error: ${Path.basename(path)}`));
        treekill(child.pid);
        if (autoRetry && !offbranch) {
            retry();
        }
        else {
            // console.log('+++send callback from connection timeout: ' + Path.basename(path));
            cb(null, { offbranch });
        }
    }

    timerId = setTimeout(onConnectionError, timeout);

    child.stdout.on('data', function (data) {
        if (aborted) return;

        var text = path + ' ' + data.toString().trim();

        // git stash pop
        if (text.indexOf('CONFLICT (content): Merge conflict in') !== -1) {
            console.error(Chalk.red(text));
            process.exit(1);
        }
    });
    child.stderr.on('data', function(data) {
        if (aborted) return;

        var text = path + ' ' + data.toString().trim();

        // git checkout ("overwritten by checkout")
        // git pull ("overwritten by merge")
        if (text.includes('Your local changes to the following files would be overwritten by')) {
            if (!autoKill) {
                console.log(Chalk.yellow(text));
                clearTimeout(timerId);
                aborted = true;
                return cb(new Error(text));
            }
        }

        // git pull ("error: cannot lock ref '...': ... (unable to update local ref)")
        if (text.includes('error: cannot lock ref')) {
            console.log(Chalk.yellow(text));
            aborted = true;
            setTimeout(retry, 500);
            return;
        }

        if (text.includes('Aborting') || text.includes('fatal')) {
            if (
                text.indexOf('Invalid refspec') === -1 &&
                text.indexOf('Couldn\'t find remote ref') === -1 &&
                text.indexOf('remote fireball already exists') === -1
            ) {
                if (text.includes('Could not read from remote repository') ||
                    text.includes('The remote end hung up unexpectedly')
                ) {
                    console.log(Chalk.yellow(text));
                    onConnectionError();
                }
                else {
                    console.error(Chalk.red(text));
                    process.exit(1);
                }
                return;
            }

            offbranch = true;
        }

        // normal message, not error
        console.log(text);
    });
    if (cb) {
        child.on('close', function (code, signal) {
            if (aborted) return;
            // console.log(`====closing process: ${Path.basename(path)}, code: ${code}, signal: ${signal}`);
            clearTimeout(timerId);
            // console.log('+++send callback from close event: ' + Path.basename(path));
            cb (null, { offbranch });
        });
    }
}

function commit( repo, message, cb ) {
    exec(['commit', '-m', message], repo, cb);
}

function updateExternal( repo, tag, cb ) {
    var Async = require('async');
    var dir = Path.join(__dirname, '../external');
    Async.series([
        function ( next ) {
            if (!Fs.existsSync(dir)) {
                exec(['clone', repo, './external'], '..', next);
            } else {
                next();
            }
        },

        function ( next ) {
            exec(['fetch', '--all'], dir, next );
        },

        function ( next ) {
            exec(['stash'], dir, next );
        },

        function ( next ) {
            exec(['rev-parse', `tags/${tag}`], dir, next);
        },
    ], function ( err ) {
        if ( err ) {
            console.error(Chalk.red('Failed to update ' + repo + '. Message: ' + err.message ));
            if (cb) cb (err);
            return;
        }
        if (cb) cb();
    });
}

function checkout( repo, branch, fetch, cb ) {
    var Async = require('async');
    Async.series([
        function ( next ) {
            if (!fetch) return next();
            exec(['fetch', '--all'], repo, next );
        },

        function ( next ) {
            exec(['checkout', branch], repo, next);
        },
    ], function ( err ) {
        if ( err ) {
            console.error(Chalk.red('Failed to checkout ' + repo + '. Message: ' + err.message ));
            if (cb) cb (err);
            return;
        }
        if (cb) cb();
    });
}

function fetch( branch, repo, callback) {
    exec(['fetch', 'fireball', branch], repo, callback, { autoRetry: true, timeout: 30000 } );
}

function checkoutTrack( branch, repo, callback) {
    exec(['checkout', '-B', branch, '--track', 'fireball/' + branch], repo, callback, { autoRetry: true, timeout: 30000, autoKill: false } );
}

// 检查 git 的错误信息，看看是否可以通过调用指定的重置方法进行文件重置操作
function resetFiles (repo, log, resetFunctions) {
    var fileListRE = /overwritten by \w+:\s*\n((?:\s+.*\n)*\s+.*)/;
    var matches = fileListRE.exec(log);
    if (matches) {
        // pending changes detected
        var filesToReset = matches[1].split(/\r\n|\r|\n/).map(x => x.trimLeft()).filter(x => resetFunctions[x]);
        if (filesToReset.length > 0) {
            // auto reset
            var postProcesses = [];
            for (var i = 0; i < filesToReset.length; ++i) {
                var filename = filesToReset[i];
                var postProcess = resetFunctions[filename](repo, Path.join(repo, filename));
                if (postProcess) {
                    postProcesses.push(postProcess);
                }
            }

            var postProcessAll = postProcesses.length > 0 ? function () {
                for (var i = postProcesses.length - 1; i >= 0; --i) {
                    postProcesses[i]();
                }
            } : (function () {});

            return { changed: true, postProcess: postProcessAll };
        }
    }

    return { changed: false };
}

// autoResetFiles - 可选字典，用于指定要自动重置的文件。key 是文件名，例如 "package.json"
// value 是重置用的回调函数。回调函数调用时会传入要重置的文件路径以及重置后的回调函数。
function checkoutRemoteBranch (repo, branch, autoResetFiles, cb) {
    if (typeof autoResetFiles === 'function') {
        cb = autoResetFiles;
        autoResetFiles = null;
    }
    Async.series([
        function ( next ) {
            fetch( branch, repo, next);
        },

        function ( next ) {
            checkoutTrack(branch, repo, autoResetFiles ? function (err) {
                if (!err) {
                    return next();
                }
                var res = resetFiles(repo, err.message, autoResetFiles);
                if (res.changed) {
                    // retry after reset
                    checkoutTrack(branch, repo, (err) => {
                        res.postProcess(err);
                        next(err);
                    });
                }
                else {
                    next(err);
                }
            } : next);
        }
    ], function ( err ) {
        if ( err ) {
            console.error(Chalk.red('Failed to checkout ' + repo + '. Message: ' + err.message ));
            if (cb) cb (err);
            return;
        }
        if (cb) cb();
    });
}

function pull (repo, remote, branch, autoResetFiles, cb) {
    if (!cb) {
        cb = autoResetFiles;
        autoResetFiles = null;
    }
    exec(['pull', remote, branch], repo, function (err, result) {
        if (result && result.offbranch) {
            console.log(Chalk.red(`Skip repos that has custom local branch checkout: "${repo}"`));
        }
        else if (err && autoResetFiles) {
            var res = resetFiles(repo, err.message, autoResetFiles);
            if (res.changed) {
                // retry after reset
                pull(repo, remote, branch, (err, result) => {
                    res.postProcess(err, result);
                    cb(err, result);
                });
                return;
            }
        }
        cb(err);
    }, { autoRetry: true, timeout: 50000, autoKill: !autoResetFiles });
}

function push( repo, remote, branch, cb ) {
    var Async = require('async');
    Async.series([
        function ( next ) {
            exec(['push', remote, branch], repo, next );
        },

        function ( next ) {
            exec(['push', remote, '--tags'], repo, next );
        },
    ], function ( err ) {
        if ( err ) {
            console.error(Chalk.red('Failed to push ' + repo + '. Message: ' + err.message ));
            if (cb) cb (err);
            return;
        }
        if (cb) cb ();
    });
}

function getCurrentBranch( path ) {
    var spawnSync = require('child_process').spawnSync;
    var output = spawnSync('git', ['symbolic-ref', '--short', '-q', 'HEAD'], {
        cwd: path,
    });
    // console.log(output);
    return output.stdout.toString().trim().replace(/^heads\//, '');
}

function getCurrentCommit( path, cb ) {
    var child = Spawn('git', ['rev-parse', 'HEAD'], {
        cwd: path,
    });
    var commit, err;
    child.stdout.on('data', function(data) {
        commit = data.toString().trim();
    });
    child.stderr.on('data', function(data) {
        err =  data.toString();
    });
    child.on('close', function() {
        cb(err, commit);
    });
    // console.log(output);
    // return output.stdout.toString().trim();
}

function reportStatus( path, cb ) {
    var output = '';
    var Async = require('async');
    Async.series([
        function( next ) {
            var statusOut = Spawn('git', ['status', '-s'], {
                cwd: path,
            });
            statusOut.stdout.on('data', function(data) {
                output += Chalk.yellow(data.toString());
            });
            statusOut.on('close', function() {
                next();
            });
        },
        // function( next ) {
        //     var cherryOut = Spawn('git', ['cherry', '-v'], {
        //         cwd: path,
        //     });
        //     cherryOut.stdout.on('data', function(data) {
        //         output += data.toString();
        //     });
        //     cherryOut.on('close', function() {
        //         next();
        //     });
        // }
    ], function ( err ) {
        if ( err ) {
            console.error(Chalk.red('Failed to report status in ' + path + '. Message: ' + err.message ));
            if (cb) cb (err);
            return;
        }
        if (cb) cb (null, output);
    });
}

function parseRepo( category, name ) {
    var orgName = '';
    var branch = '';
    var localFolder = '';

    switch(category) {
        case 'fireball':
            return {
                name: 'fireball',
                branch: '',
                localPath: '.',
                url: ''
            };
        case 'builtin':
            orgName = 'cocos-creator-packages';
            localFolder = 'builtin';
            break;
        case 'hosts':
            orgName = 'cocos-creator';
            break;
    }

    var nameList = name.split('/');
    if (nameList.length === 2) {
        orgName = nameList[0];
        name = nameList[1];
    }

    var branchList = name.split('#');
    if (branchList.length === 2) {
        name = branchList[0];
        branch = branchList[1];
    }

    var url = 'git@github.com:' + orgName + '/' + name;
    var localPath = Path.join(localFolder, name);
    if (!branch) branch = 'master';
    var repoInfo = {
        name: name,
        branch: branch,
        url: url,
        localPath: localPath
    };
    return repoInfo;
}

function updateOriginUrl(path, newRemote, cb) {
    var newUrl = 'git@github.com:' + newRemote + '/' + Path.basename(path);
    exec(['remote', 'set-url', 'origin', newUrl], path, cb);
}

module.exports = {
  exec: exec,
  checkout: checkout,
  checkoutRemoteBranch: checkoutRemoteBranch,
  commit: commit,
  pull: pull,
  push: push,
  getCurrentBranch: getCurrentBranch,
  getCurrentCommit: getCurrentCommit,
  reportStatus: reportStatus,
  parseRepo: parseRepo,
  updateOriginUrl: updateOriginUrl,
  updateExternal: updateExternal,
};
