/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
 ****************************************************************************/

const js = require('./js');
const Attrs = require('./attribute');

// 增加预处理属性这个步骤的目的是降低 CCClass 的实现难度，将比较稳定的通用逻辑和一些需求比较灵活的属性需求分隔开。

var SerializableAttrs = {
    url: {
        canUsedInGet: true
    },
    default: {},
    serializable: {},
    editorOnly: {},
    formerlySerializedAs: {}
};

var TYPO_TO_CORRECT_DEV = CC_DEV && {
    extend: 'extends',
    property: 'properties',
    static: 'statics',
    constructor: 'ctor'
};

// 预处理 notify 等扩展属性
function parseNotify (val, propName, notify, properties) {
    if (val.get || val.set) {
        if (CC_DEV) {
            cc.warnID(5500);
        }
        return;
    }
    if (val.hasOwnProperty('default')) {
        // 添加新的内部属性，将原来的属性修改为 getter/setter 形式
        // （以 _ 开头将自动设置property 为 visible: false）
        var newKey = "_N$" + propName;

        val.get = function () {
            return this[newKey];
        };
        val.set = function (value) {
            var oldValue = this[newKey];
            this[newKey] = value;
            notify.call(this, oldValue);
        };

        if (CC_EDITOR) {
            val.notifyFor = newKey;
        }

        var newValue = {};
        properties[newKey] = newValue;
        // 将不能用于get方法中的属性移动到newValue中
        for (var attr in SerializableAttrs) {
            var v = SerializableAttrs[attr];
            if (val.hasOwnProperty(attr)) {
                newValue[attr] = val[attr];
                if (!v.canUsedInGet) {
                    delete val[attr];
                }
            }
        }
    }
    else if (CC_DEV) {
        cc.warnID(5501);
    }
}

function checkUrl (val, className, propName, url) {
    if (Array.isArray(url)) {
        if (url.length > 0) {
            url = url[0];
        }
        else if (CC_EDITOR) {
            return cc.errorID(5502, className, propName);
        }
    }
    if (CC_EDITOR) {
        if (url == null) {
            return cc.warnID(5503, className, propName);
        }
        if (typeof url !== 'function' || !js.isChildClassOf(url, cc.RawAsset)) {
            return cc.errorID(5504, className, propName);
        }
        if (url === cc.RawAsset) {
            cc.warn('Please change the definition of property \'%s\' in class \'%s\'. Starting from v1.10,\n' +
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
        else if (js.isChildClassOf(url, cc.Asset)) {
            if (cc.RawAsset.wasRawAssetType(url)) {
                if (!val._short) {
                    cc.warn('Please change the definition of property \'%s\' in class \'%s\'. Starting from v1.10,\n' +
                            'the use of declaring a property in CCClass as a URL has been deprecated.\n' +
                            'For example, if property is Texture2D, the previous definition is:\n' +
                            '    %s: cc.Texture2D,\n' +
                            '    // or:\n' +
                            '    %s: {\n' +
                            '      url: cc.Texture2D,\n' +
                            '      default: ""\n' +
                            '    },\n' +
                            'Now it should be changed to:\n' +
                            '    %s: {\n' +
                            '      type: cc.Texture2D, // use \'type:\' to define Texture2D object directly\n' +
                            '      default: null,      // object\'s default value is null\n' +
                            '    },\n' +
                            '(This helps us to successfully refactor all RawAssets at v2.0, ' +
                            'sorry for the inconvenience. \uD83D\uDE30 )',
                            propName, className, propName, propName, propName);
                }
            }
            else {
                return cc.errorID(5505, className, propName, cc.js.getClassName(url));
            }
        }
        if (val.type) {
            return cc.warnID(5506, className, propName);
        }
    }
    val.type = url;
}

function parseType (val, type, className, propName) {
    const STATIC_CHECK = (CC_EDITOR && CC_DEV) || CC_TEST;

    if (Array.isArray(type)) {
        if (STATIC_CHECK && 'default' in val) {
            var isArray = require('./CCClass').isArray;   // require lazily to avoid circular require() calls
            if (!isArray(val.default)) {
                cc.warnID(5507, className, propName);
            }
        }
        if (type.length > 0) {
            if (cc.RawAsset.isRawAssetType(type[0])) {
                val.url = type[0];
                delete val.type;
                return;
            }
            else {
                val.type = type = type[0];
            }
        }
        else {
            return cc.errorID(5508, className, propName);
        }
    }
    if (typeof type === 'function') {
        if (type === String) {
            val.type = cc.String;
            if (STATIC_CHECK) {
                cc.warnID(3608, `"${className}.${propName}"`);
            }
        }
        else if (type === Boolean) {
            val.type = cc.Boolean;
            if (STATIC_CHECK) {
                cc.warnID(3609, `"${className}.${propName}"`);
            }
        }
        else if (type === Number) {
            val.type = cc.Float;
            if (STATIC_CHECK) {
                cc.warnID(3610, `"${className}.${propName}"`);
            }
        }
        else if (STATIC_CHECK && cc.RawAsset.isRawAssetType(type)) {
            cc.warnID(5509, className, propName, js.getClassName(type));
        }
    }
    else if (STATIC_CHECK) {
        switch (type) {
        case 'Number':
            cc.warnID(5510, className, propName);
            break;
        case 'String':
            cc.warn(`The type of "${className}.${propName}" must be cc.String, not "String".`);
            break;
        case 'Boolean':
            cc.warn(`The type of "${className}.${propName}" must be cc.Boolean, not "Boolean".`);
            break;
        case 'Float':
            cc.warn(`The type of "${className}.${propName}" must be cc.Float, not "Float".`);
            break;
        case 'Integer':
            cc.warn(`The type of "${className}.${propName}" must be cc.Integer, not "Integer".`);
            break;
        case null:
            cc.warnID(5511, className, propName);
            break;
        }
    }
}

function postCheckType (val, type, className, propName) {
    if (CC_EDITOR && typeof type === 'function') {
        if (cc.Class._isCCClass(type) && val.serializable !== false && !js._getClassId(type, false)) {
            cc.warnID(5512, className, propName, className, propName);
        }
    }
}

function getBaseClassWherePropertyDefined_DEV (propName, cls) {
    if (CC_DEV) {
        var res;
        for (; cls && cls.__props__ && cls.__props__.indexOf(propName) !== -1; cls = cls.$super) {
            res = cls;
        }
        if (!res) {
            cc.error('unknown error');
        }
        return res;
    }
}

exports.getFullFormOfProperty = function (options, propname_dev, classname_dev) {
    var isLiteral = options && options.constructor === Object;
    if (isLiteral) {
        return null;
    }
    if (Array.isArray(options) && options.length > 0) {
        let type = options[0];
        if (CC_DEV && cc.RawAsset.wasRawAssetType(type)) {
            // deprecate `myProp: [cc.Texture2D]` since 1.10
            cc.warn('Please change the definition of property \'%s\' in class \'%s\'. Starting from v1.10,\n' +
                    'properties in CCClass can not be abbreviated if they are of type RawAsset.\n' +
                    'Please use the complete form.\n' +
                    'For example, if property is Texture2D\'s url array, the previous definition is:\n' +
                    '    %s: [cc.Texture2D],\n' +
                    'If you use JS, it should be changed to:\n' +
                    '    %s: {\n' +
                    '      type: cc.Texture2D, // use \'type:\' to define an array of Texture2D objects\n' +
                    '      default: []\n' +
                    '    },\n' +
                    'If you use TS, it should be changed to:\n' +
                    '    %s: {\n' +
                    '      type: cc.Texture2D, // use \'type:\' to define an array of Texture2D objects\n' +
                    '    }\n' +
                    '   %s: cc.Texture2D[] = [];\n'+
                    '(This helps us to successfully refactor all RawAssets at v2.0, ' +
                    'sorry for the inconvenience. \uD83D\uDE30 )',
                    propname_dev, classname_dev, propname_dev, propname_dev);
            return {
                default: [],
                url: options,
                _short: true
            };
        }
        return {
            default: [],
            type: options,
            _short: true
        };
    }
    else if (typeof options === 'function') {
        let type = options;
        if (!cc.RawAsset.isRawAssetType(type)) {
            if (cc.RawAsset.wasRawAssetType(type)) {
                // deprecate `myProp: cc.Texture2D` since 1.10
                if (CC_DEV) {
                    cc.warn('Please change the definition of property \'%s\' in class \'%s\'. Starting from v1.10,\n' +
                            'properties in CCClass can not be abbreviated if they are of type RawAsset.\n' +
                            'Please use the complete form.\n' +
                            'For example, if the type is Texture2D, the previous definition is:\n' +
                            '    %s: cc.Texture2D,\n' +
                            'If you use JS, it should be changed to:\n' +
                            '    %s: {\n' +
                            '      type: cc.Texture2D // use \'type:\' to define Texture2D object directly\n' +
                            '      default: null,     // object\'s default value is null\n' +
                            '    },\n' +
                            'If you use TS, it should be changed to:\n' +
                            '    %s: {\n' +
                            '      type: cc.Texture2D // use \'type:\' to define Texture2D object directly\n' +
                            '    }\n' +
                            '    %s: cc.Texture2D = null;\n'+
                            '(This helps us to successfully refactor all RawAssets at v2.0, ' +
                            'sorry for the inconvenience. \uD83D\uDE30 )',
                            propname_dev, classname_dev, propname_dev, propname_dev);
                }
            }
            else {
                return {
                    default: js.isChildClassOf(type, cc.ValueType) ? new type() : null,
                    type: type,
                    _short: true
                };
            }
        }
        return {
            default: '',
            url: type,
            _short: true
        };
    }
    else if (options instanceof Attrs.PrimitiveType) {
        return {
            default: options.default,
            _short: true
        };
    }
    else {
        return {
            default: options,
            _short: true
        };
    }
};

exports.preprocessAttrs = function (properties, className, cls, es6) {
    for (var propName in properties) {
        var val = properties[propName];
        var fullForm = exports.getFullFormOfProperty(val, propName, className);
        if (fullForm) {
            val = properties[propName] = fullForm;
        }
        if (val) {
            if (CC_EDITOR) {
                if ('default' in val) {
                    if (val.get) {
                        cc.errorID(5513, className, propName);
                    }
                    else if (val.set) {
                        cc.errorID(5514, className, propName);
                    }
                    else if (cc.Class._isCCClass(val.default)) {
                        val.default = null;
                        cc.errorID(5515, className, propName);
                    }
                }
                else if (!val.get && !val.set) {
                    var maybeTypeScript = es6;
                    if (!maybeTypeScript) {
                        cc.errorID(5516, className, propName);
                    }
                }
            }
            if (CC_DEV && !val.override && cls.__props__.indexOf(propName) !== -1) {
                // check override
                var baseClass = js.getClassName(getBaseClassWherePropertyDefined_DEV(propName, cls));
                cc.warnID(5517, className, propName, baseClass, propName);
            }
            var notify = val.notify;
            if (notify) {
                if (CC_DEV && es6) {
                    cc.error('not yet support notify attribute for ES6 Classes');
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
};

if (CC_DEV) {
    const CALL_SUPER_DESTROY_REG_DEV = /\b\._super\b|destroy\s*\.\s*call\s*\(\s*\w+\s*[,|)]/;
    exports.doValidateMethodWithProps_DEV = function (func, funcName, className, cls, base) {
        if (cls.__props__ && cls.__props__.indexOf(funcName) >= 0) {
            // find class that defines this method as a property
            var baseClassName = js.getClassName(getBaseClassWherePropertyDefined_DEV(funcName, cls));
            cc.errorID(3648, className, funcName, baseClassName);
            return false;
        }
        if (funcName === 'destroy' &&
            js.isChildClassOf(base, cc.Component) &&
            !CALL_SUPER_DESTROY_REG_DEV.test(func)
        ) {
            cc.error(`Overwriting '${funcName}' function in '${className}' class without calling super is not allowed. Call the super function in '${funcName}' please.`);
        }
    };
}

exports.validateMethodWithProps = function (func, funcName, className, cls, base) {
    if (CC_DEV && funcName === 'constructor') {
        cc.errorID(3643, className);
        return false;
    }
    if (typeof func === 'function' || func === null) {
        if (CC_DEV) {
            this.doValidateMethodWithProps_DEV(func, funcName, className, cls, base);
        }
    }
    else {
        if (CC_DEV) {
            if (func === false && base && base.prototype) {
                // check override
                var overrided = base.prototype[funcName];
                if (typeof overrided === 'function') {
                    var baseFuc = js.getClassName(base) + '.' + funcName;
                    var subFuc = className + '.' + funcName;
                    cc.warnID(3624, subFuc, baseFuc, subFuc, subFuc);
                }
            }
            var correct = TYPO_TO_CORRECT_DEV[funcName];
            if (correct) {
                cc.warnID(3621, className, funcName, correct);
            }
            else if (func) {
                cc.errorID(3622, className, funcName);
            }
        }
        return false;
    }
    return true;
};
