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

import { EDITOR } from 'internal:constants';
import { log, warnID } from '../../platform/debug';
import { formatStr, get, getClassName, isChildClassOf, value } from '../../utils/js';
import { isPlainEmptyObj_DEV } from '../../utils/misc';
import { legacyCC } from '../../global-exports';

export const DELIMETER = '$_$';

export function createAttrsSingle (owner: Object, superAttrs?: any): any {
    const attrs = superAttrs ? Object.create(superAttrs) : {};
    value(owner, '__attrs__', attrs);
    return attrs;
}

/**
 * @param subclass Should not have '__attrs__'.
 */
export function createAttrs (subclass: any): any {
    if (typeof subclass !== 'function') {
        // attributes only in instance
        const instance = subclass;
        return createAttrsSingle(instance, getClassAttrs(instance.constructor));
    }
    let superClass: any;
    const chains: any[] = legacyCC.Class.getInheritanceChain(subclass);
    for (let i = chains.length - 1; i >= 0; i--) {
        const cls = chains[i];
        const attrs = cls.hasOwnProperty('__attrs__') && cls.__attrs__;
        if (!attrs) {
            superClass = chains[i + 1];
            createAttrsSingle(cls, superClass && superClass.__attrs__);
        }
    }
    superClass = chains[0];
    createAttrsSingle(subclass, superClass && superClass.__attrs__);
    return subclass.__attrs__;
}

// /**
//  * @class Class
//  */
/**
 * Tag the class with any meta attributes, then return all current attributes assigned to it.
 * This function holds only the attributes, not their implementations.
 * @param constructor The class or instance. If instance, the attribute will be dynamic and only available for the specified instance.
 * @param propertyName The name of the property or function, used to retrieve the attributes.
 * @private
 */
export function attr (constructor: any, propertyName: string): { [attributeName: string]: any; } {
    const attrs = getClassAttrs(constructor);
    const prefix = propertyName + DELIMETER;
    const ret = {};
    for (const key in attrs) {
        if (key.startsWith(prefix)) {
            ret[key.slice(prefix.length)] = attrs[key];
        }
    }
    return ret;
}

/**
 * Returns a read-only meta-object.
 */
export function getClassAttrs (constructor: any): any {
    return (constructor.hasOwnProperty('__attrs__') && constructor.__attrs__) || createAttrs(constructor);
}

export function setClassAttr (ctor, propName, key, value): void {
    getClassAttrs(ctor)[propName + DELIMETER + key] = value;
}

export class PrimitiveType<T> {
    public name: string;

    public default: T;

    constructor (name: string, defaultValue: T) {
        this.name = name;
        this.default = defaultValue;
    }

    public toString (): string {
        return this.name;
    }
}

/**
 * @en
 * Indicates that the editor should treat this property or array element as an Integer value.
 * @zh
 * 指定编辑器以整数形式对待该属性或数组元素。
 * @example
 * ```ts
 * import { CCInteger, _decorator } from "cc";
 *
 * // in the class definition:
 *
 * @_decorator.property({type: CCInteger})
 * count = 0;
 *
 * @_decorator.property({type: [CCInteger]})
 * array = [];
 * ```
 */
export const CCInteger = new PrimitiveType('Integer', 0);
legacyCC.Integer = CCInteger;
legacyCC.CCInteger = CCInteger;

/**
 * @en
 * Indicates that the editor should treat this property or array element as a Float value.
 * @zh
 * 指定编辑器以浮点数形式对待该属性或数组元素。
 * @example
 * ```ts
 * import { CCFloat, _decorator } from "cc";
 *
 * // in the class definition:
 *
 * @_decorator.property({type: CCFloat})
 * x = 0;
 *
 * @_decorator.property({type: [CCFloat]})
 * array = [];
 * ```
 */
export const CCFloat = new PrimitiveType('Float', 0.0);
legacyCC.Float = CCFloat;
legacyCC.CCFloat = CCFloat;

if (EDITOR) {
    get(legacyCC, 'Number', () => {
        warnID(3603);
        return CCFloat;
    });
}

/**
 * @en
 * Indicates that the editor should treat this property or array element as a Boolean value.
 * @zh
 * 指定编辑器以布尔值形式对待该属性或数组元素。
 *
 * @example
 * ```ts
 * import { CCBoolean, _decorator } from "cc";
 * // in the class definition
 * @_decorator.property({type: CCBoolean})
 * isTrue = false;
 *
 * @_decorator.property({type: [CCBoolean]})
 * array = [];
 * ```
 */
export const CCBoolean = new PrimitiveType('Boolean', false);
legacyCC.Boolean = CCBoolean;
legacyCC.CCBoolean = CCBoolean;

/**
 * @en
 * Indicates that the editor should treat this property or array element as a String value.
 * @zh
 * 指定编辑器以字符串形式对待该属性或数组元素。
 * @example
 * ```ts
 * import { CCString, _decorator } from "cc";
 *
 * // in the class definition
 *
 * @_decorator.property({type: CCString})
 * name = '';
 *
 * @_decorator.property({type: [CCString]})
 * array = [];
 * ```
 */
export const CCString = new PrimitiveType('String', '');
legacyCC.String = CCString;
legacyCC.CCString = CCString;

// Ensures the type matches its default value
export function getTypeChecker_ET (type: string, attributeName: string) {
    return function (constructor: Function, mainPropertyName: string): void {
        const propInfo = `"${getClassName(constructor)}.${mainPropertyName}"`;
        const mainPropAttrs = attr(constructor, mainPropertyName);
        let mainPropAttrsType = mainPropAttrs.type;
        if (mainPropAttrsType === CCInteger || mainPropAttrsType === CCFloat) {
            mainPropAttrsType = 'Number';
        } else if (mainPropAttrsType === CCString || mainPropAttrsType === CCBoolean) {
            mainPropAttrsType = `${mainPropAttrsType}`;
        }
        if (mainPropAttrsType !== type) {
            warnID(3604, propInfo);
            return;
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
            if (type_lowerCase === 'object') {
                if (defaultVal && !(defaultVal instanceof mainPropAttrs.ctor)) {
                    warnID(3605, propInfo, getClassName(mainPropAttrs.ctor));
                } else {
                    return;
                }
            } else if (type !== 'Number') {
                warnID(3606, attributeName, propInfo, type);
            }
        } else if (defaultType !== 'function') {
            if (type === CCString.default && defaultVal == null) {
                warnID(3607, propInfo);
            } else {
                warnID(3611, attributeName, propInfo, defaultType);
            }
        } else {
            return;
        }
        delete mainPropAttrs.type;
    };
}

// Ensures the type matches its default value
export function getObjTypeChecker_ET (typeCtor) {
    return function (classCtor, mainPropName): void {
        getTypeChecker_ET('Object', 'type')(classCtor, mainPropName);
        // check ValueType
        const defaultDef = getClassAttrs(classCtor)[`${mainPropName + DELIMETER}default`];
        const defaultVal = legacyCC.Class.getDefault(defaultDef);
        if (!Array.isArray(defaultVal) && isChildClassOf(typeCtor, legacyCC.ValueType)) {
            const typename = getClassName(typeCtor);
            const info = formatStr('No need to specify the "type" of "%s.%s" because %s is a child class of ValueType.',
                getClassName(classCtor), mainPropName, typename);
            if (defaultDef) {
                log(info);
            } else {
                warnID(3612, info, typename, getClassName(classCtor), mainPropName, typename);
            }
        }
    };
}
