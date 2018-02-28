const Path = require('path');

const QuickCompiler = require('./index.js');
const babelPlugin = require('./plugins/babel');
const modulePlugin = require('./plugins/module');

function enginePath (path) {
    return Path.join(__dirname, '../../', path || '');
}

let buildEngine = (options, cb) => {
    let compiler = new QuickCompiler();

    let opts = {
        root: enginePath(),
        entries: [enginePath('index.js')],
        out: enginePath('bin/.cache/dev'),
        plugins: [
            babelPlugin(),
            modulePlugin({
                transformPath (src, dst, compiler) {
                    return Path.join('engine-dev', Path.relative(compiler.out, dst));
                }
            }),
        ],
        clear: false,
        onlyRecordChanged: true
    };

    if (options.enableWatch) {
        compiler.watch(opts, cb);
    }
    else {
        compiler.build(opts, cb);
    }

    return compiler;
};

module.exports = buildEngine;
