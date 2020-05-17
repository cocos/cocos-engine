
//  Force inline const enum.
//  We don't use terser >= 4.2.1 to do this because it obsoleted `reduce_funcs` option.
//
//  Replace:
//      /*@__DROP_PURE_EXPORT__*/
//      var aa = {
//          bb: 0,
//          cc: 1,
//      };
//      const UPPER_CASE = 2;
//      console.log(aa.bb, aa.cc, UPPER_CASE);
//
//  As:
//      /*@__DROP_PURE_EXPORT__*/
//      var aa = {
//          bb: 0,
//          cc: 1,
//      };
//      const UPPER_CASE = 2;
//      console.log(0, 1, 2);

const es = require('event-stream');
const stream = require('stream');

const COMMENT_ANNOTATION = `/*@__DROP_PURE_EXPORT__*/`;
const CONST_OBJ_REG = /^[ \t]*\/\*@__DROP_PURE_EXPORT__\*\/[\w\s]*?\s+([A-Za-z_$][0-9A-Za-z_$]*)\s*=\s*({[\n\s\S]*?})/gm;
const CONST_NUM_REG = /^[ \t]*const[ \t]+([A-Z_$][0-9A-Z_$]*)[ \t]*=[ \t]*(\d{1,2});?$/gm;

function matchAll (str, reg, callback) {
    // the easiest matchAll polyfill ; )
    if (!reg.global) {
        throw new Error('Can not matchAll if the global property is false.');
    }
    str.replace(reg, function (m) {
        callback.apply(null, arguments);
        return m;
    });
}

exports.inlineEnum = function (filename) {
    if (filename.endsWith('.js') || filename.endsWith('.ts')) {
        return es.map(function (data, callback) {
            var content = data.toString();
            if (content.includes(COMMENT_ANNOTATION)) { // fast test
                let error = null;
                matchAll(content, CONST_OBJ_REG, function (match, obj, body) {
                    try {
                        body = Function(`return ${body}`)();
                    }
                    catch (e) {
                        error = new Error(`Failed to inline property "${obj}" in "${filename}", ${e}`);
                        return;
                    }
                    for (const key in body) {
                        let reg = new RegExp(`\\b${obj}\\.${key}\\b`, 'g');
                        let replaced = content.replace(reg, body[key]);
                        if (replaced !== content) {
                            content = replaced;
                            console.log(`[inline-prop] '${obj}.${key}' is inlined with ${body[key]}`);
                        }
                    }
                });
                if (error) {
                    return callback(error);
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

exports.inlineConst = function (filename) {
    if (filename.endsWith('.js') || filename.endsWith('.ts')) {
        return es.map(function (data, callback) {
            var content = data.toString();
            if (content.includes(COMMENT_ANNOTATION)) { // fast test
                let error = null;
                matchAll(content, CONST_NUM_REG, function (match, name, value) {
                    let reg = new RegExp(`([{,]\\s*|\\btypeof[ \\t]+)?(\\b${name}\\b)(?![ \\t]*=)`, 'g');  // not support negative lookbehind...
                    let replaced = content.replace(reg, function (m, g1, g2) {
                        if (m === g2) {
                            return value;
                        }
                        else {
                            return m;
                        }
                    });
                    if (replaced !== content) {
                        content = replaced;
                        console.log(`[inline-prop] '${name}' is inlined with ${value}`);
                    }
                });
                if (error) {
                    return callback(error);
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
