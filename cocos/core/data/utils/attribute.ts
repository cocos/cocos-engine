/****************************************************************************
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
 ****************************************************************************/

import * as js from '../../utils/js';
import { isPlainEmptyObj_DEV } from '../../utils/misc';

export const DELIMETER = '$_$';

export function createAttrsSingle (owner, ownerCtor, superAttrs) {
    let AttrsCtor;
    if (CC_DEV && CC_SUPPORT_JIT) {
        let ctorName = ownerCtor.name;
        if (owner === ownerCtor) {
            ctorName += '_ATTRS';
        }
        else {
            ctorName += '_ATTRS_INSTANCE';
        }
        AttrsCtor = Function('return (function ' + ctorName + '(){});')();
    }
    else {
        AttrsCtor = function () { };
    }
    if (superAttrs) {
        js.extend(AttrsCtor, superAttrs.constructor);
    }
    const attrs = new AttrsCtor();
    js.value(owner, '__attrs__', attrs);
    return attrs;
}

// subclass should not have __attrs__
export function createAttrs (subclass) {
    let superClass;
    const chains = cc.Class.getInheritanceChain(subclass);
    for (let i = chains.length - 1; i >= 0; i--) {
        const cls = chains[i];
        const attrs = cls.hasOwnProperty('__attrs__') && cls.__attrs__;
        if (!attrs) {
            superClass = chains[i + 1];
            createAttrsSingle(cls, cls, superClass && superClass.__attrs__);
        }
    }
    superClass = chains[0];
    createAttrsSingle(subclass, subclass, superClass && superClass.__attrs__);
    return subclass.__attrs__;
}

// /**
//  * @class Class
//  */

//  *
//  * Tag the class with any meta attributes, then return all current attributes assigned to it.
//  * This function holds only the attributes, not their implementations.
//  *
//  * @method attr
//  * @param {Function|Object} ctor - the class or instance. If instance, the attribute will be dynamic and only available for the specified instance.
//  * @param {String} propName - the name of property or function, used to retrieve the attributes
//  * @param {Object} [newAttrs] - the attribute table to mark, new attributes will merged with existed attributes. Attribute whose key starts with '_' will be ignored.
//  * @static
//  * @private
export function attr (ctor, propName, newAttrs) {
    let attrs, setter, key;
    if (typeof ctor === 'function') {
        // attributes shared between instances
        attrs = getClassAttrs(ctor);
        setter = attrs.constructor.prototype;
    }
    else {
        // attributes in instance
        const instance = ctor;
        attrs = instance.__attrs__;
        if (!attrs) {
            ctor = instance.constructor;
            const clsAttrs = getClassAttrs(ctor);
            attrs = createAttrsSingle(instance, ctor, clsAttrs);
        }
        setter = attrs;
    }

    if (typeof newAttrs === 'undefined') {
        // get
        const prefix = propName + DELIMETER;
        const ret = {};
        for (key in attrs) {
            if (key.startsWith(prefix)) {
                ret[key.slice(prefix.length)] = attrs[key];
            }
        }
        return ret;
    }
    else {
        // set
        if (typeof newAttrs === 'object') {
            for (key in newAttrs) {
                if (key.charCodeAt(0) !== 95 /* _ */) {
                    setter[propName + DELIMETER + key] = newAttrs[key];
                }
            }
        }
        else if (CC_DEV) {
            cc.errorID(3629);
        }
    }
}

// returns a readonly meta object
export function getClassAttrs (ctor) {
    return (ctor.hasOwnProperty('__attrs__') && ctor.__attrs__) || createAttrs(ctor);
}

// returns a writable meta object, used to set multi attributes
export function getClassAttrsProto (ctor) {
    return getClassAttrs(ctor).constructor.prototype;
}

export function setClassAttr (ctor, propName, key, value) {
    const proto = getClassAttrsProto(ctor);
    proto[propName + DELIMETER + key] = value;
}

/**
 * @module cc
 */

/**
 * Specify that the input value must be integer in Inspector.
 * Also used to indicates that the elements in array should be type integer.
 * @property {string} Integer
 * @readonly
 * @example
 * // in cc.Class
 * member: {
 *     default: [],
 *     type: cc.Integer
 * }
 * // ES6 ccclass
 * @cc._decorator.property({
 *     type: cc.Integer
 * })
 * member = [];
 */
cc.Integer = 'Integer';

/**
 * Indicates that the elements in array should be type double.
 * @property {string} Float
 * @readonly
 * @example
 * // in cc.Class
 * member: {
 *     default: [],
 *     type: cc.Float
 * }
 * // ES6 ccclass
 * @cc._decorator.property({
 *     type: cc.Float
 * })
 * member = [];
 */
cc.Float = 'Float';

if (CC_EDITOR) {
    js.get(cc, 'Number', function () {
        cc.warnID(3603);
        return cc.Float;
    });
}

/**
 * Indicates that the elements in array should be type boolean.
 * @property {string} Boolean
 * @readonly
 * @example
 * // in cc.Class
 * member: {
 *     default: [],
 *     type: cc.Boolean
 * }
 * // ES6 ccclass
 * @cc._decorator.property({
 *     type: cc.Boolean
 * })
 * member = [];
 */
cc.Boolean = 'Boolean';

/**
 * Indicates that the elements in array should be type string.
 * @property {string} String
 * @readonly
 * @example
 * // in cc.Class
 * member: {
 *     default: [],
 *     type: cc.String
 * }
 * // ES6 ccclass
 * @cc._decorator.property({
 *     type: cc.String
 * })
 * member = [];
 */
cc.String = 'String';

/*
BuiltinAttributes: {
    default: defaultValue,
    _canUsedInSetter: false, (default false) (NYI)
}
Getter or Setter: {
    hasGetter: true,
    hasSetter: true,
}
Callbacks: {
    _onAfterProp: function (constructor, propName) {},
    _onAfterGetter: function (constructor, propName) {}, (NYI)
    _onAfterSetter: function (constructor, propName) {}, (NYI)
}
 */

export function getTypeChecker (type, attrName) {
    if (CC_DEV) {
        return function (constructor, mainPropName) {
            const propInfo = '"' + js.getClassName(constructor) + '.' + mainPropName + '"';
            const mainPropAttrs = attr(constructor, mainPropName);
            if (!mainPropAttrs.saveUrlAsAsset) {
                let mainPropAttrsType = mainPropAttrs.type;
                if (mainPropAttrsType === cc.Integer || mainPropAttrsType === cc.Float) {
                    mainPropAttrsType = 'Number';
                }
                if (mainPropAttrsType !== type) {
                    cc.warnID(3604, propInfo);
                    return;
                }
            }
            if (!mainPropAttrs.hasOwnProperty('default')) {
                return;
            }
            const defaultVal = mainPropAttrs.default;
            if (typeof defaultVal === 'undefined') {
                return;
            }
            const isContainer = Array.isArray(defaultVal) || isPlainEmptyObj_DEV(defaultVal);
            if (isContainer) {
                return;
            }
            const defaultType = typeof defaultVal;
            const type_lowerCase = type.toLowerCase();
            if (defaultType === type_lowerCase) {
                if (!mainPropAttrs.saveUrlAsAsset) {
                    if (type_lowerCase === 'object') {
                        if (defaultVal && !(defaultVal instanceof mainPropAttrs.ctor)) {
                            cc.warnID(3605, propInfo, js.getClassName(mainPropAttrs.ctor));
                        }
                        else {
                            return;
                        }
                    }
                    else if (type !== 'Number') {
                        cc.warnID(3606, attrName, propInfo, type);
                    }
                }
            }
            else if (defaultType !== 'function') {
                if (type === cc.String && defaultVal == null) {
                    if (!js.isChildClassOf(mainPropAttrs.ctor, cc.RawAsset)) {
                        cc.warnID(3607, propInfo);
                    }
                }
                else if (mainPropAttrs.ctor === String && (defaultType === 'string' || defaultVal == null)) {
                    mainPropAttrs.type = cc.String;
                    cc.warnID(3608, propInfo);
                }
                else if (mainPropAttrs.ctor === Boolean && defaultType === 'boolean') {
                    mainPropAttrs.type = cc.Boolean;
                    cc.warnID(3609, propInfo);
                }
                else if (mainPropAttrs.ctor === Number && defaultType === 'number') {
                    mainPropAttrs.type = cc.Float;
                    cc.warnID(3610, propInfo);
                }
                else {
                    cc.warnID(3611, attrName, propInfo, defaultType);
                }
            }
            else {
                return;
            }
            delete mainPropAttrs.type;
        };
    }
}

export function ObjectType (typeCtor) {
    return {
        type: 'Object',
        ctor: typeCtor,
        _onAfterProp: CC_DEV && function (classCtor, mainPropName) {
            getTypeChecker('Object', 'type')(classCtor, mainPropName);
            // check ValueType
            const defaultDef = getClassAttrs(classCtor)[mainPropName + DELIMETER + 'default'];
            const defaultVal = cc.Class.getDefault(defaultDef);
            if (!Array.isArray(defaultVal) && js.isChildClassOf(typeCtor, cc.ValueType)) {
                const typename = js.getClassName(typeCtor);
                const info = cc.js.formatStr('No need to specify the "type" of "%s.%s" because %s is a child class of ValueType.',
                    js.getClassName(classCtor), mainPropName, typename);
                if (defaultDef) {
                    cc.log(info);
                }
                else {
                    cc.warnID(3612, info, typename, js.getClassName(classCtor), mainPropName, typename);
                }
            }
        },
    };
}
