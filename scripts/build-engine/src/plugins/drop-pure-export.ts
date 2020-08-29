
//  Drop unused `export` syntax to indicate that the object will only be used inside the module at runtime.
//  So the expression can be evaluated by uglify.
//
//  Replace:
//      /*@__DROP_PURE_EXPORT__*/
//      export xxx
//  As:
//      /*@__DROP_PURE_EXPORT__*/
//      xxx

import { createFilter } from 'rollup-pluginutils';

const COMMENT_ANNOTATION = `/*@__DROP_PURE_EXPORT__*/`;
const REG = /(\/\*@__DROP_PURE_EXPORT__\*\/\s*)(export\s+)?/g;

export default function (options: any = {}) {
    const filter = createFilter(options.include, options.exclude);

    return {
        name: 'ts',
        transform (code: string, id: string) {
            if (!filter(id)) return null;
            if (!id.endsWith('.ts')) return null;

            if (code.includes(COMMENT_ANNOTATION)) { // fast test
                let error = false;
                code = code.replace(REG, (match, g1, g2) => {
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
                    throw new Error(`Uncaptured comment annotation "${COMMENT_ANNOTATION}" in "${id}", please use it in the correct way.`);
                }

                return {
                    code,
                    map: { mappings: '' }
                };
            }
            return null;
        }
    };
}
