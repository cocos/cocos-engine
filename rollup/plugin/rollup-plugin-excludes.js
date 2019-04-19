const Path = require('path');
const FIELD_BRACE_REG = /\{(.*?)\}/;
const SKIP_FORMAT = ['.json'];

function getExcludeFields (codes, excludes, id) {
    let excludeFields = [], baseName = Path.basename(id);
    for (let i = 0; i < codes.length; ++i) {
        let code = codes[i];
        //-- 分割 api 
        let splitCodes = code.split('*/');
        if (splitCodes.length > 1) {
            code = splitCodes[1];
        }

        if (baseName !== 'index.ts') {
            if ((code.indexOf('import ') === -1 && code.indexOf('export ') === -1) ||
                code.indexOf('export class ') !== -1 ||
                code.indexOf('export abstract ') !== -1 ||
                code.indexOf('export function ') !== -1 ||
                code.indexOf('export const ') !== -1 ||
                code.indexOf('export interface ') !== -1 ||
                code.indexOf('export enum ') !== -1 ||
                code.indexOf('export let ') !== -1 ||
                code.indexOf('export default ') !== -1 || 
                code.indexOf('export type') !== -1) {
                continue;
            }
        }

        for (let i = 0; i < excludes.length; ++i) {
            if (code.toLowerCase().indexOf(excludes[i]) > -1) {
                excludeFields.push(code.trim());
                break;
            }
        }
    }
    return excludeFields;
}

exports.excludes = function (options = {}) {
    let exclude_modules = options.modules || [];
    return {
        name: 'excludes',
        transform(code, id) {
            if (exclude_modules.length === 0 || SKIP_FORMAT.indexOf(Path.extname(id)) !== -1) {
                return;
            }

            // -- 分割 Copyright 提示
            let splitCodes = code.split('*/');
            let tempCode = splitCodes.length > 1 ? splitCodes[1] : code;
            splitCodes = tempCode.split(';');
            let tempFields = getExcludeFields(splitCodes, exclude_modules, id);
            let moduleNames = [];

            for (let i = 0; i < tempFields.length; ++i) {
                let field = tempFields[i];
                //-- 获取 import { foo } from './foo' || export { foo } from './foo';
                // console.log('获取:' + field); 
                let result = field.match(FIELD_BRACE_REG);
                if (!result) {
                    let tempSplitCodes = field.split(',');
                    if (tempSplitCodes.length > 1) {
                        //-- 排查 export { foo, bar, file } 该类型的模块
                        // console.log('多行：' + field);
                        moduleNames = moduleNames.concat(getExcludeFields(tempSplitCodes, exclude_modules, id));
                    }
                    else {
                        //-- 剔除单行包含剔除模块的字段
                        // console.log('剔除：' + field);
                        code = code.replace(new RegExp(`${field};`, 'g'), '');
                    }
                }
                else {
                    //-- 剔除单行包含剔除模块的字段
                    // console.log('剔除：' + field);
                    code = code.replace(new RegExp(`${field};`, 'g'), '');
                }
            }

            //-- 剔除 export { foo, bar, file } 该类型的模块
            moduleNames.forEach(moduleName => {
                code = code.replace(new RegExp(`${moduleName},`, 'g'), '');
            });

            // console.log(code);
            return {
                code: code,
                map: {mappings: ''},
            };
        }
    };
};
