/*
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

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

import * as jsarray from './array';
import IDGenerator from './id-generator';
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
    getClassName,
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
import Pool from './pool';

import { legacyCC } from '../global-exports';

export * from './js-typed';
export { default as IDGenerator } from './id-generator';
export { default as Pool } from './pool';
export const array = jsarray;

export const js = {
    IDGenerator,
    Pool,
    array: jsarray,
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
    /**
     * @en All classes registered in the engine, indexed by name.
     * @zh 引擎中已注册的所有类型，通过名称进行索引。
     * @marked_as_engine_private
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
     * @marked_as_engine_private
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
     * @marked_as_engine_private
     */
    get _registeredClassIds (): typeof _idToClass {
        return { ..._idToClass };
    },
    set _registeredClassIds (value: typeof _idToClass) {
        clear(_idToClass);
        Object.assign(_idToClass, value);
    },
    /**
     * @marked_as_engine_private
     */
    _getClassId,
    /**
     * @marked_as_engine_private
     */
    _setClassId,
    /**
     * @marked_as_engine_private
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
legacyCC.js = js;
