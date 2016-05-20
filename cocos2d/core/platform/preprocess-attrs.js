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

// 预处理 notify 等扩展属性
function parseNotify (val, propName, notify, properties) {
    if (val.get || val.set) {
        if (CC_DEV) {
            cc.warn('"notify" can\'t work with "get/set" !');
        }
        return;
    }
    if (val.hasOwnProperty('default')) {
        // 添加新的内部属性，将原来的属性修改为 getter/setter 形式
        // 以 _ 开头将自动设置property 为 visible: false
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
        cc.warn('"notify" must work with "default" !');
    }
}

function checkUrl (val, className, propName, url) {
    if (Array.isArray(url)) {
        if (url.length > 0) {
            url = url[0];
        }
        else if (CC_EDITOR) {
            return cc.error('Invalid url of %s.%s', className, propName);
        }
    }
    if (CC_EDITOR) {
        if (url == null) {
            return cc.warn('The "url" attribute of "%s.%s" is undefined when loading script.', className, propName);
        }
        if (typeof url !== 'function' || !cc.isChildClassOf(url, cc.RawAsset)) {
            return cc.error('The "url" type of "%s.%s" must be child class of cc.RawAsset.', className, propName);
        }
        if (cc.isChildClassOf(url, cc.Asset)) {
            return cc.error('The "url" type of "%s.%s" must not be child class of cc.Asset, ' +
                       'otherwise you should use "type: %s" instead.', className, propName, cc.js.getClassName(url));
        }
        if (val.type) {
            return cc.warn('Can not specify "type" attribute for "%s.%s", because its "url" is already defined.', className, propName);
        }
    }
    val.type = url;
}

function parseType (val, type, className, propName) {
    if (Array.isArray(type)) {
        if (CC_EDITOR) {
            var isArray = require('./CCClass').isArray;   // require lazily to avoid circular require() calls
            if (!isArray(val.default)) {
                cc.warn('The "default" attribute of "%s.%s" must be an array', className, propName);
            }
        }
        if (type.length > 0) {
            val.type = type = type[0];
        }
        else {
            return cc.error('Invalid type of %s.%s', className, propName);
        }
    }
    if (CC_EDITOR) {
        if (typeof type === 'function') {
            if (cc.RawAsset.isRawAssetType(type)) {
                cc.warn('The "type" attribute of "%s.%s" must be child class of cc.Asset, ' +
                          'otherwise you should use "url: %s" instead', className, propName,
                    cc.js.getClassName(type));
            }
        }
        else if (type === 'Number') {
            cc.warn('The "type" attribute of "%s.%s" can not be "Number", use "Float" or "Integer" instead please.', className, propName);
        }
        else if (type == null) {
            cc.warn('The "type" attribute of "%s.%s" is undefined when loading script.', className, propName);
        }
    }
}

function postCheckType (val, type, className, propName) {
    if (CC_EDITOR && typeof type === 'function') {
        if (cc.Class._isCCClass(type) && val.serializable !== false && !cc.js._getClassId(type, false)) {
            cc.warn('Can not serialize "%s.%s" because the specified type is anonymous, please provide a class name or set the "serializable" attribute of "%s.%s" to "false".', className, propName, className, propName);
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

module.exports = function (properties, className, cls) {
    for (var propName in properties) {
        var val = properties[propName];
        var isLiteral = val && val.constructor === Object;

        if ( !isLiteral ) {
            if (Array.isArray(val) && val.length > 0) {
                val = {
                    default: [],
                    type: val
                };
            }
            else if (typeof val === 'function') {
                var type = val;
                if (cc.RawAsset.isRawAssetType(type)) {
                    val = {
                        default: '',
                        url: type
                    };
                }
                else {
                    val = cc.isChildClassOf(type, cc.ValueType) ? {
                        default: new type()
                    } : {
                        default: null,
                        type: val
                    };
                }
            }
            else {
                val = {
                    default: val
                };
            }
            properties[propName] = val;
        }
        if (val) {
            if (CC_EDITOR) {
                if ('default' in val) {
                    if (val.get) {
                        cc.error('The "default" value of "%s.%s" should not be used with a "get" function.',
                            className, propName);
                    }
                    else if (val.set) {
                        cc.error('The "default" value of "%s.%s" should not be used with a "set" function.',
                            className, propName);
                    }
                }
                else if (!val.get && !val.set) {
                    cc.error('Property "%s.%s" must define at least one of "default", "get" or "set".',
                        className, propName);
                }
            }
            if (CC_DEV && !val.override && cls.__props__.indexOf(propName) !== -1) {
                // check override
                var baseClass = cc.js.getClassName(getBaseClassWherePropertyDefined_DEV(propName, cls));
                cc.warn('"%s.%s" hides inherited property "%s.%s". To make the current property override that implementation, add the `override: true` attribute please.', className, propName, baseClass, propName);
            }
            var notify = val.notify;
            if (notify) {
                parseNotify(val, propName, notify, properties);
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
