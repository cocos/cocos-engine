
//  Replace node promisify for testing editor-extends.
//
//  Replace:
//      require('util')
//  As:
//      { promisify }

const es = require('event-stream');
const stream = require('stream');

const promisify = (function (handle) {
    return function (...args) {
        return new Promise(function (resolve, reject) {
            handle(...args, (err, res) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(res);
                }
            });
        });
    };
}).toString();

const REPLACE = /require\(['"]util['"]\)/g;
const AS = `{promisify:${promisify}}`;

module.exports = function (filename) {
    if (filename.endsWith('.js') || filename.endsWith('.ts')) {
        return es.map(function (data, callback) {
            var content = data.toString();
            if (REPLACE.test(content)) { // fast test
                content = content.replace(REPLACE, AS);
                data = new Buffer(content);
            }
            callback(null, data);
        });
    }
    else {
        return stream.PassThrough();
    }
};
