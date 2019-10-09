
// fix `typeof constructor` on JavaScriptCore

const ES = require('event-stream');
const Path = require('path');

const getRealTypeOfObj = (function __realTypeOfObj (obj) {
    if (obj) {
        if (obj.toString) {
            if (obj.toString() === '[object CallbackConstructor]')
                return 'function';
        }
        else {
            // "Cannot convert object to primitive value"
        }
    }
    return 'object';
}).toString();

const TYPEOF_SHIM = `\n${getRealTypeOfObj}\nvar __typeofVal = "";`;

const TYPEOF_REG = /typeof\s+([$A-Za-z_][0-9A-Za-z_$\.\[\]]*)([\s!=;\)])/g;
const TYPEOF_REPLACEMENT = '(__typeofVal = typeof $1, __typeofVal === "object" ? __realTypeOfObj($1) : __typeofVal)$2';

const SUPPORT_JSC = false;

module.exports = function () {
    return ES.through(function (file) {
        if (Path.extname(file.path) === '.js' && SUPPORT_JSC) {
            var content = file.contents.toString();

            content = content.replace(TYPEOF_REG, TYPEOF_REPLACEMENT);
            content += TYPEOF_SHIM;

            // make shim as local variables so that variable names will be mangled
            content = '(function () {' + content + '})();';

            file.contents = new Buffer(content);
        }
        this.emit('data', file);
    });
};
