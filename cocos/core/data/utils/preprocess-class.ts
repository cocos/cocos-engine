/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { DEV, EDITOR, TEST } from 'internal:constants';
import { error, errorID, warn, warnID } from '../../platform/debug';
import * as js from '../../utils/js';
import { PrimitiveType } from './attribute';
import { legacyCC } from '../../global-exports';

// 增加预处理属性这个步骤的目的是降低 CCClass 的实现难度，将比较稳定的通用逻辑和一些需求比较灵活的属性需求分隔开。

const SerializableAttrs = {
    default: {},
    serializable: {},
    editorOnly: {},
    formerlySerializedAs: {},
};

function parseType (val, type, className, propName): void {
    const STATIC_CHECK = (EDITOR && DEV) || TEST;

    if (Array.isArray(type)) {
        if (STATIC_CHECK && 'default' in val) {
            if (!legacyCC.Class.isArray(val.default)) {
                warnID(5507, className, propName);
            }
        }
        if (type.length > 0) {
            val.type = type = type[0];
        } else {
            return errorID(5508, className, propName);
        }
    }
    if (typeof type === 'function') {
        if (type === String) {
            val.type = legacyCC.String;
            if (STATIC_CHECK) {
                warnID(3608, `"${className}.${propName}"`);
            }
        } else if (type === Boolean) {
            val.type = legacyCC.Boolean;
            if (STATIC_CHECK) {
                warnID(3609, `"${className}.${propName}"`);
            }
        } else if (type === Number) {
            val.type = legacyCC.Float;
            if (STATIC_CHECK) {
                warnID(3610, `"${className}.${propName}"`);
            }
        }
    } else if (STATIC_CHECK) {
        switch (type) {
        case 'Number':
            warnID(5510, className, propName);
            break;
        case 'String':
            warn(`The type of "${className}.${propName}" must be CCString, not "String".`);
            break;
        case 'Boolean':
            warn(`The type of "${className}.${propName}" must be CCBoolean, not "Boolean".`);
            break;
        case 'Float':
            warn(`The type of "${className}.${propName}" must be CCFloat, not "Float".`);
            break;
        case 'Integer':
            warn(`The type of "${className}.${propName}" must be CCInteger, not "Integer".`);
            break;
        case null:
            warnID(5511, className, propName);
            break;
        }
    }

    if (EDITOR && typeof type === 'function') {
        if (legacyCC.Class._isCCClass(type) && val.serializable !== false && !js.getClassId(type, false)) {
            warnID(5512, className, propName, className, propName);
        }
    }
}

function getBaseClassWherePropertyDefined_DEV (propName, cls): any {
    if (DEV) {
        let res;
        for (; cls && cls.__props__ && cls.__props__.indexOf(propName) !== -1; cls = cls.$super) {
            res = cls;
        }
        if (!res) {
            error('unknown error');
        }
        return res;
    }
}

function _wrapOptions (isGetset: boolean, _default, type?: Function | Function[] | PrimitiveType<any>): {
    default?: any;
    _short?: boolean | undefined;
    type?: any;
} {
    const res: {
        default?: any,
        _short?: boolean,
        type?: any,
    } = isGetset || typeof _default === 'undefined' ? { _short: true } : { _short: true, default: _default };
    if (type) {
        res.type = type;
    }
    return res;
}

export function getFullFormOfProperty (options, isGetset): {
    default?: any;
    _short?: boolean | undefined;
    type?: any;
} | null {
    const isLiteral = options && options.constructor === Object;
    if (!isLiteral) {
        if (Array.isArray(options) && options.length > 0) {
            return _wrapOptions(isGetset, [], options);
        } else if (typeof options === 'function') {
            const type = options;
            return _wrapOptions(isGetset, js.isChildClassOf(type, legacyCC.ValueType) ? new type() : null, type);
        } else if (options instanceof PrimitiveType) {
            return _wrapOptions(isGetset, undefined, options);
        } else {
            return _wrapOptions(isGetset, options);
        }
    }
    return null;
}

export function preprocessAttrs (properties, className, cls): void {
    for (const propName in properties) {
        let val = properties[propName];
        const fullForm = getFullFormOfProperty(val, false);
        if (fullForm) {
            val = properties[propName] = fullForm;
        }
        if (val) {
            if (EDITOR) {
                if ('default' in val) {
                    if (val.get) {
                        errorID(5513, className, propName);
                    } else if (val.set) {
                        errorID(5514, className, propName);
                    } else if (legacyCC.Class._isCCClass(val.default)) {
                        val.default = null;
                        errorID(5515, className, propName);
                    }
                }
            }
            if (DEV && !val.override && cls.__props__.indexOf(propName) !== -1) {
                // check override
                const baseClass = js.getClassName(getBaseClassWherePropertyDefined_DEV(propName, cls));
                warnID(5517, className, propName, baseClass, propName);
            }
            if ('type' in val) {
                parseType(val, val.type, className, propName);
            }
        }
    }
}

const CALL_SUPER_DESTROY_REG_DEV = /\b\._super\b|destroy.*\.call\s*\(\s*\w+\s*[,|)]/;
export function validateOverrideMethods_DEV (cls, base, className): void {
    const proto = cls.prototype;
    const destroy = proto.destroy;
    if (destroy && proto.hasOwnProperty?.('destroy')) {
        if (js.isChildClassOf(base, legacyCC.Component)
            && !CALL_SUPER_DESTROY_REG_DEV.test(destroy)) {
            error(`Overwriting '${'destroy'}' function in '${className}' class without calling super is not allowed. Call the super function in '${'destroy'}' please.`);
        }
    }
}
