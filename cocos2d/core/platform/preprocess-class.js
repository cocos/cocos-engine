/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

// 增加预处理属性这个步骤的目的是降低 CCClass 的实现难度，将比较稳定的通用逻辑和一些需求比较灵活的属性需求分隔开。

var SerializableAttrs = {
    url: {
        canUsedInGet: true
    },
    default: {},
    serializable: {},
    editorOnly: {},
    rawType: {},
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
        if (typeof url !== 'function' || !cc.isChildClassOf(url, cc.RawAsset)) {
            return cc.errorID(5504, className, propName);
        }
        if (cc.isChildClassOf(url, cc.Asset)) {
            return cc.errorID(5505, className, propName, cc.js.getClassName(url));
        }
        if (val.type) {
            return cc.warnID(5506, className, propName);
        }
    }
    val.type = url;
}

function parseType (val, type, className, propName) {
    if (Array.isArray(type)) {
        if (CC_EDITOR) {
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
    if (CC_EDITOR) {
        if (typeof type === 'function') {
            if (cc.RawAsset.isRawAssetType(type)) {
                cc.warnID(5509, className, propName,
                    cc.js.getClassName(type));
            }
        }
        else if (type === 'Number') {
            cc.warnID(5510, className, propName);
        }
        else if (type == null) {
            cc.warnID(5511, className, propName);
        }
    }
}

function postCheckType (val, type, className, propName) {
    if (CC_EDITOR && typeof type === 'function') {
        if (cc.Class._isCCClass(type) && val.serializable !== false && !cc.js._getClassId(type, false)) {
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

exports.getFullFormOfProperty = function (options) {
    var isLiteral = options && options.constructor === Object;
    if ( !isLiteral ) {
        if (Array.isArray(options) && options.length > 0) {
            return {
                default: [],
                type: options,
                _short: true
            };
        }
        else if (typeof options === 'function') {
            var type = options;
            if (cc.RawAsset.isRawAssetType(type)) {
                return {
                    default: '',
                    url: type,
                    _short: true
                };
            }
            else {
                return {
                    default: cc.isChildClassOf(type, cc.ValueType) ? new type() : null,
                    type: type,
                    _short: true
                };
            }
        }
        else {
            return {
                default: options,
                _short: true
            };
        }
    }
    return null;
};

exports.preprocessAttrs = function (properties, className, cls, es6) {
    for (var propName in properties) {
        var val = properties[propName];
        var fullForm = exports.getFullFormOfProperty(val);
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
                var baseClass = cc.js.getClassName(getBaseClassWherePropertyDefined_DEV(propName, cls));
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

module.exports.validateMethod = function (func, funcName, className, cls, base) {
    if (CC_DEV && funcName === 'constructor') {
        cc.errorID(3643, className);
        return false;
    }
    if (typeof func === 'function' || func === null) {
        if (CC_DEV && cls.__props__ && cls.__props__.indexOf(funcName) >= 0) {
            // find class that defines this method as a property
            var baseClassName = cc.js.getClassName(getBaseClassWherePropertyDefined_DEV(funcName, cls));
            cc.errorID(3648, className, funcName, baseClassName);
            return false;
        }
    }
    else {
        if (CC_DEV) {
            if (func === false && base && base.prototype) {
                // check override
                var overrided = base.prototype[funcName];
                if (typeof overrided === 'function') {
                    var baseFuc = cc.js.getClassName(base) + '.' + funcName;
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
