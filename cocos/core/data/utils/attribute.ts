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

// tslint:disable:only-arrow-functions
// tslint:disable:one-variable-per-declaration

import { errorID, log, warnID } from '../../platform/CCDebug';
import * as js from '../../utils/js';
import { formatStr } from '../../utils/js';
import { isPlainEmptyObj_DEV } from '../../utils/misc';

export const DELIMETER = '$_$';

export function createAttrsSingle (owner: Object, ownerConstructor: Function, superAttrs?: any) {
    let AttrsCtor;
    if (CC_DEV && CC_SUPPORT_JIT) {
        let ctorName = ownerConstructor.name;
        if (owner === ownerConstructor) {
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

/**
 * @param subclass Should not have '__attrs__'.
 */
export function createAttrs (subclass: any) {
    let superClass: any;
    const chains: any[] = cc.Class.getInheritanceChain(subclass);
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
/**
 * Tag the class with any meta attributes, then return all current attributes assigned to it.
 * This function holds only the attributes, not their implementations.
 * @param constructor The class or instance. If instance, the attribute will be dynamic and only available for the specified instance.
 * @param propertyName The name of property or function, used to retrieve the attributes.
 * @param [newAttributes] The attribute table to mark, new attributes will merged with existed attributes.
 * Attribute whose key starts with '_' will be ignored.
 * @private
 */
export function attr (constructor: any, propertyName: string): { [propertyName: string]: any; };

export function attr (constructor: any, propertyName: string, newAttributes: Object): void;

export function attr (constructor: any, propertyName: string, newAttributes?: Object) {
    let attrs: any, setter: any;
    if (typeof constructor === 'function') {
        // Attributes shared between instances.
        attrs = getClassAttrs(constructor);
        setter = attrs.constructor.prototype;
    } else {
        // Attributes in instance.
        const instance = constructor;
        attrs = instance.__attrs__;
        if (!attrs) {
            constructor = instance.constructor;
            const clsAttrs = getClassAttrs(constructor);
            attrs = createAttrsSingle(instance, constructor, clsAttrs);
        }
        setter = attrs;
    }

    if (typeof newAttributes === 'undefined') {
        // Get.
        const prefix = propertyName + DELIMETER;
        const ret = {};
        for (const key in attrs) {
            if (key.startsWith(prefix)) {
                ret[key.slice(prefix.length)] = attrs[key];
            }
        }
        return ret;
    } else {
        // Set.
        if (typeof newAttributes === 'object') {
            for (const key in newAttributes) {
                if (key.charCodeAt(0) !== 95 /* _ */) {
                    setter[propertyName + DELIMETER + key] = newAttributes[key];
                }
            }
        }
        else if (CC_DEV) {
            errorID(3629);
        }
    }
}

/**
 * Returns a readonly meta object.
 */
export function getClassAttrs (constructor: any) {
    return (constructor.hasOwnProperty('__attrs__') && constructor.__attrs__) || createAttrs(constructor);
}

/**
 * Returns a writable meta object, used to set multi attributes.
 */
export function getClassAttrsProto (constructor: Function) {
    return getClassAttrs(constructor).constructor.prototype;
}

export function setClassAttr (ctor, propName, key, value) {
    const proto = getClassAttrsProto(ctor);
    proto[propName + DELIMETER + key] = value;
}

/**
 * Specify that the input value must be integer in Inspector.
 * Also used to indicates that the elements in array should be type integer.
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
export const CCInteger = 'Integer';
cc.Integer = CCInteger;

/**
 * Indicates that the elements in array should be type double.
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
export const CCFloat = 'Float';
cc.Float = CCFloat;

if (CC_EDITOR) {
    js.get(cc, 'Number', function () {
        warnID(3603);
        return CCFloat;
    });
}

/**
 * Indicates that the elements in array should be type boolean.
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
export const CCBoolean = 'Boolean';
cc.Boolean = CCBoolean;

/**
 * Indicates that the elements in array should be type string.
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
export const CCString = 'String';
cc.String = CCString;

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

export function getTypeChecker (type: string, attributeName: string) {
    return function (constructor: Function, mainPropertyName: string) {
        const propInfo = '"' + js.getClassName(constructor) + '.' + mainPropertyName + '"';
        const mainPropAttrs = attr(constructor, mainPropertyName);
        if (!mainPropAttrs.saveUrlAsAsset) {
            let mainPropAttrsType = mainPropAttrs.type;
            if (mainPropAttrsType === CCInteger || mainPropAttrsType === CCFloat) {
                mainPropAttrsType = 'Number';
            }
            if (mainPropAttrsType !== type) {
                warnID(3604, propInfo);
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
                        warnID(3605, propInfo, js.getClassName(mainPropAttrs.ctor));
                    }
                    else {
                        return;
                    }
                }
                else if (type !== 'Number') {
                    warnID(3606, attributeName, propInfo, type);
                }
            }
        }
        else if (defaultType !== 'function') {
            if (type === CCString && defaultVal == null) {
                if (!js.isChildClassOf(mainPropAttrs.ctor, cc.RawAsset)) {
                    warnID(3607, propInfo);
                }
            }
            else if (mainPropAttrs.ctor === String && (defaultType === 'string' || defaultVal == null)) {
                mainPropAttrs.type = CCString;
                warnID(3608, propInfo);
            }
            else if (mainPropAttrs.ctor === Boolean && defaultType === 'boolean') {
                mainPropAttrs.type = CCBoolean;
                warnID(3609, propInfo);
            }
            else if (mainPropAttrs.ctor === Number && defaultType === 'number') {
                mainPropAttrs.type = CCFloat;
                warnID(3610, propInfo);
            }
            else {
                warnID(3611, attributeName, propInfo, defaultType);
            }
        }
        else {
            return;
        }
        delete mainPropAttrs.type;
    };
}

export function ObjectType (typeCtor) {
    return {
        type: 'Object',
        ctor: typeCtor,
        _onAfterProp: !CC_DEV ? undefined : function (classCtor, mainPropName) {
            getTypeChecker('Object', 'type')(classCtor, mainPropName);
            // check ValueType
            const defaultDef = getClassAttrs(classCtor)[mainPropName + DELIMETER + 'default'];
            const defaultVal = cc.Class.getDefault(defaultDef);
            if (!Array.isArray(defaultVal) && js.isChildClassOf(typeCtor, cc.ValueType)) {
                const typename = js.getClassName(typeCtor);
                const info = formatStr('No need to specify the "type" of "%s.%s" because %s is a child class of ValueType.',
                    js.getClassName(classCtor), mainPropName, typename);
                if (defaultDef) {
                    log(info);
                }
                else {
                    warnID(3612, info, typename, js.getClassName(classCtor), mainPropName, typename);
                }
            }
        },
    };
}
