
//  Drop unused `export` syntax to indicate that the object will only be used inside the module at runtime.
//  So the expression can be evaluated by uglify.
//
//  Replace:
//      /*@__DROP_PURE_EXPORT__*/
//      export xxx
//  As:
//      /*@__DROP_PURE_EXPORT__*/
//      xxx

const es = require('event-stream');
const stream = require('stream');

const COMMENT_ANNOTATION = `/*@__DROP_PURE_EXPORT__*/`;
const REG = /(\/\*@__DROP_PURE_EXPORT__\*\/\s*)(export\s+)?/g;

module.exports = function (filename) {
    if (filename.endsWith('.js') || filename.endsWith('.ts')) {
        return es.map(function (data, callback) {
            var content = data.toString();
            if (content.includes(COMMENT_ANNOTATION)) { // fast test
                let error = false;
                content = content.replace(REG, function (match, g1, g2) {
                    if (g2) {
                        return g1;
                    }
                    else {
                        // console.log(content);
                        error = true;
                        return match;
                    }
                });
                if (error) {
                    return callback(new Error(`Uncaptured comment annotation "${COMMENT_ANNOTATION}" in "${filename}", please use it in the correct way.`));
                }
                data = new Buffer(content);
            }
            callback(null, data);
        });
    }
    else {
        return stream.PassThrough();
    }
};
