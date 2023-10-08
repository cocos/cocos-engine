/*
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

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

import { cclegacy } from '@base/global';
import { IDGenerator } from './id-generator';
import {
    _idToClass,
    _nameToClass,
    _getClassById,
    _getClassId,
    _setClassId,
    addon,
    clear,
    createMap,
    extend,
    formatStr,
    get,
    getClassByName,
    getClassById,
    getClassName,
    getClassId,
    getPropertyDescriptor,
    getset,
    getSuper,
    isChildClassOf,
    isNumber,
    isString,
    isEmptyObject,
    mixin,
    obsolete,
    obsoletes,
    set,
    setClassName,
    setClassAlias,
    shiftArguments,
    unregisterClass,
    value,
} from './js-typed';
import { Pool } from './pool';
import * as array from './array';

export * from './js-typed';
export { IDGenerator } from './id-generator';
export { Pool } from './pool';
export { array };

/**
 * @en Inserts a new element into a map. All values corresponding to the same key are stored in an array.
 * @zh 往 map 插入一个元素。同一个关键字对应的所有值存储在一个数组里。
 * @param map @en The map to insert element. @zh 插入元素的 map。
 * @param key @en The key of new element. @zh 新插入元素的关键字。
 * @param value @en The value of new element. @zh 新插入元素的值。
 * @param pushFront @en Whether to put new value in front of the vector if key exists. @zh 如果关键字已经存在，是否把新插入的值放到数组第一个位置。
 *
 * @example
 * ```ts
 * import { js, log } from 'cc';
 *
 * let a = { b: 1 };
 * js.pushToMap(a, 'b', 2, false);
 * log(a);  // { b: [1, 2] }
 * ```
 */
export function pushToMap (map: Record<string, unknown>, key: string, value: unknown, pushFront: boolean): void {
    const exists = map[key];
    if (exists) {
        if (Array.isArray(exists)) {
            if (pushFront) {
                exists.push(exists[0]);
                exists[0] = value;
            } else {
                exists.push(value);
            }
        } else {
            map[key] = (pushFront ? [value, exists] : [exists, value]);
        }
    } else {
        map[key] = value;
    }
}

/**
 * @deprecated since v3.7.0, `js.js` is deprecated, please access `js` directly instead.
 */
export const js = {
    IDGenerator,
    Pool,
    array,
    isNumber,
    isString,
    isEmptyObject,
    getPropertyDescriptor,
    addon,
    mixin,
    extend,
    getSuper,
    isChildClassOf,
    clear,
    value,
    getset,
    get,
    set,
    unregisterClass,
    getClassName,
    setClassName,
    setClassAlias,
    getClassByName,
    getClassById,
    /**
     * @en All classes registered in the engine, indexed by name.
     * @zh 引擎中已注册的所有类型，通过名称进行索引。
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     * @example
     * ```
     * import { js } from 'cc';
     * // save all registered classes before loading scripts
     * let builtinClassIds = js._registeredClassIds;
     * let builtinClassNames = js._registeredClassNames;
     * // load some scripts that contain CCClass
     * ...
     * // clear all loaded classes
     * js._registeredClassIds = builtinClassIds;
     * js._registeredClassNames = builtinClassNames;
     * ```
     *
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    get _registeredClassNames (): typeof _nameToClass {
        return { ..._nameToClass };
    },
    set _registeredClassNames (value: typeof _nameToClass) {
        clear(_nameToClass);
        Object.assign(_nameToClass, value);
    },
    /**
     * @en All classes registered in the engine, indexed by ID.
     * @zh 引擎中已注册的所有类型，通过 ID 进行索引。
     * @example
     * ```
     * import { js } from 'cc';
     * // save all registered classes before loading scripts
     * let builtinClassIds = js._registeredClassIds;
     * let builtinClassNames = js._registeredClassNames;
     * // load some scripts that contain CCClass
     * ...
     * // clear all loaded classes
     * js._registeredClassIds = builtinClassIds;
     * js._registeredClassNames = builtinClassNames;
     * ```
     *
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    get _registeredClassIds (): typeof _idToClass {
        return { ..._idToClass };
    },
    set _registeredClassIds (value: typeof _idToClass) {
        clear(_idToClass);
        Object.assign(_idToClass, value);
    },
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _getClassId,
    getClassId,
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _setClassId,
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _getClassById,
    obsolete,
    obsoletes,
    formatStr,
    shiftArguments,
    createMap,
};

/**
 * @en This module provides some JavaScript utilities. All members can be accessed via `import { js } from 'cc'`.
 * @zh 这个模块封装了 JavaScript 相关的一些实用函数，你可以通过 `import { js } from 'cc'` 来访问这个模块。
 */
cclegacy.js = js;
