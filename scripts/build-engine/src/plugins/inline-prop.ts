
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

import { createFilter } from 'rollup-pluginutils';

const COMMENT_ANNOTATION = `/*@__DROP_PURE_EXPORT__*/`;
const CONST_OBJ_REG = /^[ \t]*\/\*@__DROP_PURE_EXPORT__\*\/[\w\s]*?\s+([A-Za-z_$][0-9A-Za-z_$]*)\s*=\s*({[\n\s\S]*?})/gm;
const CONST_NUM_REG = /^[ \t]*const[ \t]+([A-Z_$][0-9A-Z_$]*)[ \t]*=[ \t]*(\d{1,2});?$/gm;

function matchAll (str: string, reg: RegExp, callback: any) {
    // the easiest matchAll polyfill ; )
    if (!reg.global) {
        throw new Error('Can not matchAll if the global property is false.');
    }

    // Supports arguments by disabling arrow function
    // tslint:disable-next-line:only-arrow-functions
    str.replace(reg, function (m) {
        callback.apply(null, arguments);
        return m;
    });
}

export function inlineEnum (options: any = {}) {
    const filter = createFilter(options.include, options.exclude);
    return {
        name: 'ts',
        transform (code: string, id: string) {
            if (!filter(id)) return null;
            if (!id.endsWith('.ts')) return null;

            if (code.includes(COMMENT_ANNOTATION)) { // fast test
                let error = null;
                let transformed = false;
                matchAll(code, CONST_OBJ_REG, (match: string, obj: string, body: any) => {
                    try {
                        body = Function(`return ${body}`)();
                    }
                    catch (e) {
                        error = new Error(`Failed to inline property "${obj}" in "${id}", ${e}`);
                        return;
                    }
                    for (const key in body) {
                        const reg = new RegExp(`\\b${obj}\\.${key}\\b`, 'g');
                        const replaced = code.replace(reg, body[key]);
                        if (replaced !== code) {
                            code = replaced;
                            transformed = true;
                            console.debug(`[inline-prop] '${obj}.${key}' is inlined with ${body[key]}`);
                        }
                    }
                });
                if (error) {
                    throw error;
                }
                if (transformed) {
                    return {
                        code,
                        map: { mappings: '' }
                    };
                }
            }
            return null;
        }
    };
}

export function inlineConst (options: any = {}) {
    const filter = createFilter(options.include, options.exclude);
    return {
        name: 'ts',
        transform (code: string, id: string) {
            if (!filter(id)) return null;
            if (!id.endsWith('.ts')) return null;

            if (code.includes(COMMENT_ANNOTATION)) { // fast test
                matchAll(code, CONST_NUM_REG, (match: string, name: string, value: string) => {
                    const reg = new RegExp(`([{,]\\s*|\\btypeof[ \\t]+)?(\\b${name}\\b)(?![ \\t]*=)`, 'g');  // not support negative lookbehind...
                    const replaced = code.replace(reg, (m, g1, g2) => {
                        if (m === g2) {
                            return value;
                        }
                        else {
                            return m;
                        }
                    });
                    if (replaced !== code) {
                        code = replaced;
                        console.debug(`[inline-prop] '${name}' is inlined with ${value}`);
                    }
                });
                return {
                    code,
                    map: { mappings: '' }
                };
            }
            return null;
        }
    };
}
