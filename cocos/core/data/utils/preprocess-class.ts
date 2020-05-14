/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { error, errorID, warn, warnID } from '../../platform/debug';
import * as js from '../../utils/js';
import { PrimitiveType } from './attribute';
import { DEV, EDITOR, TEST } from 'internal:constants';
import { legacyCC } from '../../global-exports';

// 增加预处理属性这个步骤的目的是降低 CCClass 的实现难度，将比较稳定的通用逻辑和一些需求比较灵活的属性需求分隔开。

const SerializableAttrs = {
    url: {
        canUsedInGet: true,
    },
    default: {},
    serializable: {},
    editorOnly: {},
    formerlySerializedAs: {},
};

const TYPO_TO_CORRECT_DEV = DEV && {
    extend: 'extends',
    property: 'properties',
    static: 'statics',
    constructor: 'ctor',
};

/**
 * 预处理 notify 等扩展属性
 */
function parseNotify (val, propName, notify, properties) {
    if (val.get || val.set) {
        if (DEV) {
            warnID(5500);
        }
        return;
    }
    if (val.hasOwnProperty('default')) {
        // 添加新的内部属性，将原来的属性修改为 getter/setter 形式
        // （以 _ 开头将自动设置property 为 visible: false）
        const newKey = '_N$' + propName;

        val.get = function () {
            return this[newKey];
        };
        val.set = function (value) {
            const oldValue = this[newKey];
            this[newKey] = value;
            notify.call(this, oldValue);
        };

        const newValue = {};
        properties[newKey] = newValue;
        // 将不能用于get方法中的属性移动到newValue中
        // tslint:disable: forin
        for (const attr in SerializableAttrs) {
            const v = SerializableAttrs[attr];
            if (val.hasOwnProperty(attr)) {
                newValue[attr] = val[attr];
                if (!v.canUsedInGet) {
                    delete val[attr];
                }
            }
        }
    }
    else if (DEV) {
        warnID(5501);
    }
}

/**
 * 检查 url
 */
function checkUrl (val, className, propName, url) {
    if (Array.isArray(url)) {
        if (url.length > 0) {
            url = url[0];
        }
        else if (EDITOR) {
            return errorID(5502, className, propName);
        }
    }
    if (EDITOR) {
        if (url == null) {
            return warnID(5503, className, propName);
        }
        if (typeof url !== 'function' || !js.isChildClassOf(url, legacyCC.RawAsset)) {
            return errorID(5504, className, propName);
        }
        if (url === legacyCC.RawAsset) {
            warn('Please change the definition of property \'%s\' in class \'%s\'. Starting from v1.10,\n' +
                    'the use of declaring a property in CCClass as a URL has been deprecated.\n' +
                    'For example, if property is cc.RawAsset, the previous definition is:\n' +
                    '    %s: cc.RawAsset,\n' +
                    '    // or:\n' +
                    '    %s: {\n' +
                    '      url: cc.RawAsset,\n' +
                    '      default: ""\n' +
                    '    },\n' +
                    '    // and the original method to get url is:\n' +
                    '    `this.%s`\n' +
                    'Now it should be changed to:\n' +
                    '    %s: {\n' +
                    '      type: cc.Asset,     // use \'type:\' to define Asset object directly\n' +
                    '      default: null,      // object\'s default value is null\n' +
                    '    },\n' +
                    '    // and you must get the url by using:\n' +
                    '    `this.%s.nativeUrl`\n' +
                    '(This helps us to successfully refactor all RawAssets at v2.0, ' +
                    'sorry for the inconvenience. \uD83D\uDE30 )',
                    propName, className, propName, propName, propName, propName, propName);
        }
        else if (js.isChildClassOf(url, legacyCC.Asset)) {
            return errorID(5505, className, propName, legacyCC.js.getClassName(url));
        }
        if (val.type) {
            return warnID(5506, className, propName);
        }
    }
    val.type = url;
}

/**
 * 解析类型
 */
function parseType (val, type, className, propName) {
    if (Array.isArray(type)) {
        if ((EDITOR || TEST) && 'default' in val) {
            if (!legacyCC.Class.isArray(val.default)) {
                warnID(5507, className, propName);
            }
        }
        if (type.length > 0) {
            if (legacyCC.RawAsset.isRawAssetType(type[0])) {
                val.url = type[0];
                delete val.type;
                return;
            } else {
                val.type = type = type[0];
            }
        } else {
            return errorID(5508, className, propName);
        }
    }
    if (EDITOR || TEST) {
        if (typeof type === 'function') {
            if (legacyCC.RawAsset.isRawAssetType(type)) {
                warnID(5509, className, propName, js.getClassName(type));
            } else if (type === String) {
                val.type = legacyCC.String;
                warnID(3608, `"${className}.${propName}"`);
            } else if (type === Boolean) {
                val.type = legacyCC.Boolean;
                warnID(3609, `"${className}.${propName}"`);
            } else if (type === Number) {
                val.type = legacyCC.Float;
                warnID(3610, `"${className}.${propName}"`);
            }
        } else {
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
    }
}

function postCheckType (val, type, className, propName) {
    if (EDITOR && typeof type === 'function') {
        if (legacyCC.Class._isCCClass(type) && val.serializable !== false && !js._getClassId(type, false)) {
            warnID(5512, className, propName, className, propName);
        }
    }
}

function getBaseClassWherePropertyDefined_DEV (propName, cls) {
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

// tslint:disable: no-shadowed-variable

export function getFullFormOfProperty (options, propname_dev?, classname_dev?) {
    const isLiteral = options && options.constructor === Object;
    if ( !isLiteral ) {
        if (Array.isArray(options) && options.length > 0) {

            const type = options[0];
            return {
                default: [],
                type: options,
                _short: true,
            };
        } else if (typeof options === 'function') {
            const type = options;
            if (!legacyCC.RawAsset.isRawAssetType(type)) {
                return {
                    default: js.isChildClassOf(type, legacyCC.ValueType) ? new type() : null,
                    type,
                    _short: true,
                };
            }
            return {
                default: '',
                url: type,
                _short: true,
            };
        } else if (options instanceof PrimitiveType) {
            return {
                default: options.default,
                _short: true,
            };
        } else {
            return {
                default: options,
                _short: true,
            };
        }
    }
    return null;
}

export function preprocessAttrs (properties, className, cls, es6) {
    for (const propName in properties) {
        let val = properties[propName];
        const fullForm = getFullFormOfProperty(val, propName, className);
        if (fullForm) {
            val = properties[propName] = fullForm;
        }
        if (val) {
            if (EDITOR) {
                if ('default' in val) {
                    if (val.get) {
                        errorID(5513, className, propName);
                    }
                    else if (val.set) {
                        errorID(5514, className, propName);
                    }
                    else if (legacyCC.Class._isCCClass(val.default)) {
                        val.default = null;
                        errorID(5515, className, propName);
                    }
                }
                else if (!val.get && !val.set) {
                    const maybeTypeScript = es6;
                    if (!maybeTypeScript) {
                        errorID(5516, className, propName);
                    }
                }
            }
            if (DEV && !val.override && cls.__props__.indexOf(propName) !== -1) {
                // check override
                const baseClass = js.getClassName(getBaseClassWherePropertyDefined_DEV(propName, cls));
                warnID(5517, className, propName, baseClass, propName);
            }
            const notify = val.notify;
            if (notify) {
                if (DEV && es6) {
                    error('not yet support notify attribute for ES6 Classes');
                }
                else {
                    parseNotify(val, propName, notify, properties);
                }
            }

            if ('type' in val) {
                parseType(val, val.type, className, propName);
            }

            if ('url' in val) {
                checkUrl(val, className, propName, val.url);
            }

            if ('type' in val) {
                postCheckType(val, val.type, className, propName);
            }
        }
    }
}

const CALL_SUPER_DESTROY_REG_DEV = /\b\._super\b|destroy.*\.call\s*\(\s*\w+\s*[,|)]/;
export function doValidateMethodWithProps_DEV (func, funcName, className, cls, base) {
    if (cls.__props__ && cls.__props__.indexOf(funcName) >= 0) {
        // find class that defines this method as a property
        const baseClassName = js.getClassName(getBaseClassWherePropertyDefined_DEV(funcName, cls));
        errorID(3648, className, funcName, baseClassName);
        return false;
    }
    if (funcName === 'destroy' &&
        js.isChildClassOf(base, legacyCC.Component) &&
        !CALL_SUPER_DESTROY_REG_DEV.test(func)
    ) {
        // tslint:disable-next-line: max-line-length
        error(`Overwriting '${funcName}' function in '${className}' class without calling super is not allowed. Call the super function in '${funcName}' please.`);
    }
}

export function validateMethodWithProps (func, funcName, className, cls, base) {
    if (DEV && funcName === 'constructor') {
        errorID(3643, className);
        return false;
    }
    if (typeof func === 'function' || func === null) {
        if (DEV) {
            doValidateMethodWithProps_DEV(func, funcName, className, cls, base);
        }
    }
    else {
        if (DEV) {
            if (func === false && base && base.prototype) {
                // check override
                const overrided = base.prototype[funcName];
                if (typeof overrided === 'function') {
                    const baseFuc = js.getClassName(base) + '.' + funcName;
                    const subFuc = className + '.' + funcName;
                    warnID(3624, subFuc, baseFuc, subFuc, subFuc);
                }
            }
            const correct = TYPO_TO_CORRECT_DEV[funcName];
            if (correct) {
                warnID(3621, className, funcName, correct);
            }
            else if (func) {
                errorID(3622, className, funcName);
            }
        }
        return false;
    }
    return true;
}
