/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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
 */

import { EDITOR, DEV, TEST } from 'internal:constants';
import { warnID, error, errorID } from '../platform/debug';
import IDGenerator from './id-generator';

const tempCIDGenerator = new IDGenerator('TmpCId.');

const aliasesTag = typeof Symbol === 'undefined' ? '__aliases__' : Symbol('[[Aliases]]');
const classNameTag = '__classname__';
const classIdTag = '__cid__';

/**
 * @en
 * Check the object whether is number or not
 * If a number is created by using 'new Number(10086)', the typeof it will be "object"...
 * Then you can use this function if you care about this case.
 * @zh
 * 检查对象是否是 number 类型，如果通过 'new Number(10086)' 创建了一个数字，则使用 typeof 判断此数字时，将返回 'object' 类型，此时你可以通过此方法来进行判断
 * @param object object to be checked
 * @return whether this object is number or not
 */
export function isNumber (object: any) {
    return typeof object === 'number' || object instanceof Number;
}

/**
 * @en
 * Check the object whether is string or not.
 * If a string is created by using 'new String("blabla")', the typeof it will be "object"...
 * Then you can use this function if you care about this case.
 * @zh
 * 检查对象是否是 string 类型，如果通过 'new String("blabla")' 创建了一个字符串，则使用 typeof 判断此字符串时，将返回 'object' 类型，此时你可以通过此方法来进行判断
 * @param object object to be checked
 * @return whether this object is string or not
 */
export function isString (object: any) {
    return typeof object === 'string' || object instanceof String;
}

/**
 * @en
 * Checks if the object `obj` does not have one or more enumerable properties (including properties from proto chain).
 * @zh
 * 检查此对象是否为空对象
 * @param obj The object.
 * @returns The result. Note that if the `obj` is not of type `'object'`, `true` is returned.
 */
export function isEmptyObject (obj: any) {
    for (const key in obj) {
        return false;
    }
    return true;
}

/**
 * @en
 * Define value, just help to call Object.defineProperty.<br>
 * The configurable will be true.
 * @zh
 * 定义值，帮助调用 Object.defineProperty.
 * 该属性默认可读写
 * @param [writable=false]
 * @param [enumerable=false]
 */
export const value = (() => {
    const descriptor: PropertyDescriptor = {
        value: undefined,
        enumerable: false,
        writable: false,
        configurable: true,
    };
    return (object: Record<string | number, any>, propertyName: string, value_: any, writable?: boolean, enumerable?: boolean) => {
        descriptor.value = value_;
        descriptor.writable = writable;
        descriptor.enumerable = enumerable;
        Object.defineProperty(object, propertyName, descriptor);
        descriptor.value = undefined;
    };
})();

/**
 * @en
 * Define get set accessor, just help to call Object.defineProperty(...).
 * @zh
 * 定义 get set 访问器，帮助调用 Object.defineProperty()
 * @param [setter=null]
 * @param [enumerable=false]
 * @param [configurable=false]
 */
export const getset = (() => {
    const descriptor: PropertyDescriptor = {
        get: undefined,
        set: undefined,
        enumerable: false,
    };
    return (object: Record<string | number, any>, propertyName: string, getter: Getter, setter?: Setter | boolean, enumerable = false, configurable = false) => {
        if (typeof setter === 'boolean') {
            enumerable = setter;
            setter = undefined;
        }
        descriptor.get = getter;
        descriptor.set = setter;
        descriptor.enumerable = enumerable;
        descriptor.configurable = configurable;
        Object.defineProperty(object, propertyName, descriptor);
        descriptor.get = undefined;
        descriptor.set = undefined;
    };
})();

/**
 * @en
 * Define get accessor, just help to call Object.defineProperty(...).
 * @zh
 * 定义 get 访问器，帮助调用 Object.defineProperty()
 * @param [enumerable=false]
 * @param [configurable=false]
 */
export const get = (() => {
    const descriptor: PropertyDescriptor = {
        get: undefined,
        enumerable: false,
        configurable: false,
    };
    return (object: Record<string | number, any>, propertyName: string, getter: Getter, enumerable?: boolean, configurable?: boolean) => {
        descriptor.get = getter;
        descriptor.enumerable = enumerable;
        descriptor.configurable = configurable;
        Object.defineProperty(object, propertyName, descriptor);
        descriptor.get = undefined;
    };
})();

/**
 * @en
 * Define set accessor, just help to call Object.defineProperty(...)
 * @zh
 * 定义 set 访问器，帮助调用 Object.defineProperty
 * @param [enumerable=false]
 * @param [configurable=false]
 */
export const set = (() => {
    const descriptor: PropertyDescriptor = {
        set: undefined,
        enumerable: false,
        configurable: false,
    };
    return (object: Record<string | number, any>, propertyName: string, setter: Setter, enumerable?: boolean, configurable?: boolean) => {
        descriptor.set = setter;
        descriptor.enumerable = enumerable;
        descriptor.configurable = configurable;
        Object.defineProperty(object, propertyName, descriptor);
        descriptor.set = undefined;
    };
})();

/**
 * @en
 * A simple wrapper of `Object.create(null)` which ensures the return object have no prototype (and thus no inherited members).
 * This eliminates the need to make `hasOwnProperty` judgments when we look for values by key on the object,
 * which is helpful for performance in this case.
 * @zh
 * 该方法是对 `Object.create(null)` 的简单封装。
 * `Object.create(null)` 用于创建无 prototype （也就无继承）的空对象。
 * 这样我们在该对象上查找属性时，就不用进行 `hasOwnProperty` 判断，此时对性能提升有帮助。
 *
 * @param [forceDictMode=false] Apply the delete operator to newly created map object.
 * This causes V8 to put the object in "dictionary mode" and disables creation of hidden classes
 * which are very expensive for objects that are constantly changing shape.
 */
export function createMap (forceDictMode?: boolean): any {
    const map = Object.create(null);
    if (forceDictMode) {
        const INVALID_IDENTIFIER_1 = '.';
        const INVALID_IDENTIFIER_2 = '/';
        // assign dummy values on the object
        map[INVALID_IDENTIFIER_1] = 1;
        map[INVALID_IDENTIFIER_2] = 1;
        delete map[INVALID_IDENTIFIER_1];
        delete map[INVALID_IDENTIFIER_2];
    }
    return map;
}

/**
 * @en
 * Get class name of the object, if object is just a {} (and which class named 'Object'), it will return "".
 * (modified from <a href="http://stackoverflow.com/questions/1249531/how-to-get-a-javascript-objects-class">the code from this stackoverflow post</a>)
 * @zh
 * 获取对象的类型名称，如果对象是 {} 字面量，将会返回 ""
 * @param objOrCtor instance or constructor
 */
export function getClassName (objOrCtor: any): string {
    if (typeof objOrCtor === 'function') {
        const prototype = objOrCtor.prototype;
        // eslint-disable-next-line no-prototype-builtins
        if (prototype && prototype.hasOwnProperty(classNameTag) && prototype[classNameTag]) {
            return prototype[classNameTag] as string;
        }
        let retval = '';
        //  for browsers which have name property in the constructor of the object, such as chrome
        if (objOrCtor.name) {
            retval = objOrCtor.name;
        }
        if (objOrCtor.toString) {
            let arr;
            const str = objOrCtor.toString();
            if (str.charAt(0) === '[') {
                // str is "[object objectClass]"
                // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
                arr = /\[\w+\s*(\w+)\]/.exec(str);
            } else {
                // str is function objectClass () {} for IE Firefox
                // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
                arr = /function\s*(\w+)/.exec(str);
            }
            if (arr && arr.length === 2) {
                retval = arr[1];
            }
        }
        return retval !== 'Object' ? retval : '';
    } else if (objOrCtor && objOrCtor.constructor) {
        return getClassName(objOrCtor.constructor);
    }
    return '';
}

/**
 * @en
 * Defines a polyfill field for obsoleted codes.
 * @zh
 * 为废弃代码定义一个填充字段
 * @param object - YourObject or YourClass.prototype
 * @param obsoleted - "OldParam" or "YourClass.OldParam"
 * @param newExpr - "NewParam" or "YourClass.NewParam"
 * @param  [writable=false]
 */
export function obsolete (object: any, obsoleted: string, newExpr: string, writable?: boolean) {
    const extractPropName = /([^.]+)$/;
    const oldProp = extractPropName.exec(obsoleted)![0];
    const newProp = extractPropName.exec(newExpr)![0];
    function getter (this: any) {
        if (DEV) {
            warnID(5400, obsoleted, newExpr);
        }
        return this[newProp] as unknown;
    }
    function setter (this: any, value_: any) {
        if (DEV) {
            warnID(5401, obsoleted, newExpr);
        }
        this[newProp] = value_;
    }

    if (writable) {
        getset(object, oldProp, getter, setter);
    } else {
        get(object, oldProp, getter);
    }
}

/**
 * @en
 * Defines all polyfill fields for obsoleted codes corresponding to the enumerable properties of props.
 * @zh
 * 为所有可废弃属性定义填充字段
 * @param obj - YourObject or YourClass.prototype
 * @param objName - "YourObject" or "YourClass"
 * @param props
 * @param [writable=false]
 */
export function obsoletes (obj, objName, props, writable) {
    for (const obsoleted in props) {
        const newName = props[obsoleted];
        obsolete(obj, `${objName}.${obsoleted}`, newName, writable);
    }
}

const REGEXP_NUM_OR_STR = /(%d)|(%s)/;
const REGEXP_STR = /%s/;

/**
 * @en
 * A string tool to construct a string with format string.
 * @zh
 * 通过格式字符串构造一个字符串
 * @param msg - A JavaScript string containing zero or more substitution strings (%s).
 * @param subst - JavaScript objects with which to replace substitution strings within msg.
 * This gives you additional control over the format of the output.
 * @example
 * ```
 * import { js } from 'cc';
 * js.formatStr("a: %s, b: %s", a, b);
 * js.formatStr(a, b, c);
 * ```
 */
export function formatStr (msg: string, ...subst: any[]) {
    if (arguments.length === 0) {
        return '';
    }
    if (subst.length === 0) {
        return `${msg}`;
    }

    const hasSubstitution = typeof msg === 'string' && REGEXP_NUM_OR_STR.test(msg);
    if (hasSubstitution) {
        for (const arg of subst) {
            const regExpToTest = typeof arg === 'number' ? REGEXP_NUM_OR_STR : REGEXP_STR;
            if (regExpToTest.test(msg)) {
                const notReplaceFunction = `${arg}`;
                msg = msg.replace(regExpToTest, notReplaceFunction);
            } else {
                msg += ` ${arg}`;
            }
        }
    } else {
        for (const arg of subst) {
            msg += ` ${arg}`;
        }
    }
    return msg;
}

// see https://github.com/petkaantonov/bluebird/issues/1389
export function shiftArguments () {
    const len = arguments.length - 1;
    const args = new Array(len);
    for (let i = 0; i < len; ++i) {
        args[i] = arguments[i + 1];
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return args;
}

/**
 * Get property descriptor in object and all its ancestors.
 */
export function getPropertyDescriptor (object: any, propertyName: string) {
    while (object) {
        const pd = Object.getOwnPropertyDescriptor(object, propertyName);
        if (pd) {
            return pd;
        }
        object = Object.getPrototypeOf(object);
    }
    return null;
}

function _copyprop (name: string, source: any, target: any) {
    const pd = getPropertyDescriptor(source, name);
    if (pd) {
        Object.defineProperty(target, name, pd);
    }
}

export function copyAllProperties (source: any, target: any, excepts: Array<string>) {
    const propertyNames: Array<string> = Object.getOwnPropertyNames(source);
    for (let i = 0, len = propertyNames.length; i < len; ++i) {
        const propertyName: string = propertyNames[i];
        if (excepts.indexOf(propertyName) !== -1) {
            continue;
        }

        _copyprop(propertyName, source, target);
    }
}

/**
 * @en
 * Copy all properties not defined in object from arguments[1...n].
 * @zh
 * 如果目标对象上没有该属性，则将源对象属性拷贝到目标对象上
 * @param object Object to extend its properties.
 * @param sources Source object to copy properties from.
 * @return The result object.
 */
export function addon (object?: Record<string | number, any>, ...sources: any[]) {
    object = object || {};
    for (const source of sources) {
        if (source) {
            if (typeof source !== 'object') {
                errorID(5402, source);
                continue;
            }
            for (const name in source) {
                if (!(name in object)) {
                    _copyprop(name, source, object);
                }
            }
        }
    }
    return object;
}

/**
 * @en
 * Copy all properties from arguments[1...n] to object.
 * @zh
 * 拷贝源对象所有属性到目标对象上，如果有属性冲突，则以源对象为准
 * @return The result object.
 */
export function mixin (object?: Record<string | number, any>, ...sources: any[]) {
    object = object || {};
    for (const source of sources) {
        if (source) {
            if (typeof source !== 'object') {
                errorID(5403, source);
                continue;
            }
            for (const name in source) {
                _copyprop(name, source, object);
            }
        }
    }
    return object;
}

/**
 * @en
 * Derive the class from the supplied base class.
 * Both classes are just native javascript constructors, not created by `Class`, so
 * usually you will want to inherit using [[CCClass]] instead.
 * @zh
 * 将一个类型继承另一个类型
 * 两个类型都需要是 javascript 的构建函数，而不是 `Class`, 所以你通常可以用 [[CCClass]] 来代替
 * @param base The baseclass to inherit.
 * @return The result class.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function extend (cls: Function, base: Function) {
    if (DEV) {
        if (!base) {
            errorID(5404);
            return;
        }
        if (!cls) {
            errorID(5405);
            return;
        }
        if (Object.keys(cls.prototype).length > 0) {
            errorID(5406);
        }
    }
    // eslint-disable-next-line no-prototype-builtins
    for (const p in base) { if (base.hasOwnProperty(p)) { cls[p] = base[p]; } }
    cls.prototype = Object.create(base.prototype, {
        constructor: {
            value: cls,
            writable: true,
            configurable: true,
        },
    });
    // eslint-disable-next-line consistent-return
    return cls;
}

/**
 * @en
 * Get super class.
 * @zh
 * 获取父类
 * @param constructor The constructor of subclass.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function getSuper (constructor: Function) {
    const proto = constructor.prototype; // binded function do not have prototype
    const dunderProto = proto && Object.getPrototypeOf(proto);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return dunderProto && dunderProto.constructor;
}

/**
 * @en
 * Checks whether subclass is child of superclass or equals to superclass.
 * @zh
 * 判断一类型是否是另一类型的子类或本身
 * @param subclass sub class to be checked
 * @param superclass super class to be checked
 * @return whether subclass is child of superclass
 */
export function isChildClassOf (subclass: unknown, superclass: unknown) {
    if (subclass && superclass) {
        if (typeof subclass !== 'function') {
            return false;
        }
        if (typeof superclass !== 'function') {
            if (DEV) {
                warnID(3625, superclass);
            }
            return false;
        }
        if (subclass === superclass) {
            return true;
        }
        for (; ;) {
            // eslint-disable-next-line @typescript-eslint/ban-types
            subclass = getSuper(subclass as Function);
            if (!subclass) {
                return false;
            }
            if (subclass === superclass) {
                return true;
            }
        }
    }
    return false;
}

/**
 * @en
 * Removes all enumerable properties from object.
 * @zh
 * 移除对象中所有可枚举属性
 */
export function clear (object: Record<string | number, any>) {
    for (const key of Object.keys(object)) {
        delete object[key];
    }
}

function isTempClassId (id) {
    return typeof id !== 'string' || id.startsWith(tempCIDGenerator.prefix);
}

// id registration
/**
 * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
 */
export const _idToClass: Record<string, Constructor> = createMap(true);
/**
 * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
 */
export const _nameToClass: Record<string, Constructor> = createMap(true);

function setup (tag: string, table: Record<string | number, any>) {
    return function (id: string, constructor: Constructor) {
        // deregister old
        // eslint-disable-next-line no-prototype-builtins
        if (constructor.prototype.hasOwnProperty(tag)) {
            delete table[constructor.prototype[tag]];
        }
        value(constructor.prototype, tag, id);
        // register class
        if (id) {
            const registered = table[id];
            if (registered && registered !== constructor) {
                let err = `A Class already exists with the same ${tag} : "${id}".`;
                if (TEST) {
                    // eslint-disable-next-line no-multi-str
                    err += ' (This may be caused by error of unit test.) \
If you dont need serialization, you can set class id to "". You can also call \
js.unregisterClass to remove the id of unused class';
                }
                error(err);
            } else {
                table[id] = constructor;
            }
            // if (id === "") {
            //    console.trace("", table === _nameToClass);
            // }
        }
    };
}

/**
 * @en
 * Register the class by specified id, if its classname is not defined, the class name will also be set.
 * @zh
 * 通过 id 注册类型
 * @method _setClassId
 * @param classId
 * @param constructor
 * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
 */
export const _setClassId = setup('__cid__', _idToClass);

const doSetClassName = setup('__classname__', _nameToClass);

/**
 * @en
 * Register the class by specified name manually
 * @zh
 * 通过指定的名称手动注册类型
 * @method setClassName
 * @param className
 * @param constructor
 */
export function setClassName (className: string, constructor: Constructor) {
    doSetClassName(className, constructor);
    // auto set class id
    // eslint-disable-next-line no-prototype-builtins
    if (!constructor.prototype.hasOwnProperty(classIdTag)) {
        const id = className || tempCIDGenerator.getNewId();
        if (id) {
            _setClassId(id, constructor);
        }
    }
}

/**
 * @en Set an alias name for class.
 * If `setClassAlias(target, alias)`, `alias` will be a single way short cut for class `target`.
 * If you try `js.getClassByName(alias)`, you will get target.
 * But `js.getClassName(target)` will return the original name of `target`, not the alias.
 * @zh 为类设置别名。
 * 当 `setClassAlias(target, alias)` 后，
 * `alias` 将作为类 `target`的“单向 ID” 和“单向名称”。
 * 因此，`_getClassById(alias)` 和 `getClassByName(alias)` 都会得到 `target`。
 * 这种映射是单向的，意味着 `getClassName(target)` 和 `_getClassId(target)` 将不会是 `alias`。
 * @param target Constructor of target class.
 * @param alias Alias to set. The name shall not have been set as class name or alias of another class.
 */
export function setClassAlias (target: Constructor, alias: string) {
    const nameRegistry = _nameToClass[alias];
    const idRegistry = _idToClass[alias];
    let ok = true;
    if (nameRegistry && nameRegistry !== target) {
        error(`"${alias}" has already been set as name or alias of another class.`);
        ok = false;
    }
    if (idRegistry && idRegistry !== target) {
        error(`"${alias}" has already been set as id or alias of another class.`);
        ok = false;
    }
    if (ok) {
        let classAliases = target[aliasesTag];
        if (!classAliases) {
            classAliases = [];
            target[aliasesTag] = classAliases;
        }
        classAliases.push(alias);
        _nameToClass[alias] = target;
        _idToClass[alias] = target;
    }
}

/**
 * @en
 * Unregister a class from cocos.
 *
 * If you dont need a registered class anymore, you should unregister the class so that cocos will not keep its reference anymore.
 * Please note that its still your responsibility to free other references to the class.
 * @zh
 * 取消注册类型，如果你不再需要一个注册的类，你应该取消注册这个类，这样 cocos 就不会再保留它的引用。
 * 请注意，你仍然有责任释放对该类的其他引用。
 *
 * @param ...constructor - the class you will want to unregister, any number of classes can be added
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function unregisterClass (...constructors: Function[]) {
    for (const constructor of constructors) {
        const p = constructor.prototype;
        const classId = p[classIdTag];
        if (classId) {
            delete _idToClass[classId];
        }
        const classname = p[classNameTag];
        if (classname) {
            delete _nameToClass[classname];
        }
        const aliases = p[aliasesTag];
        if (aliases) {
            for (let iAlias = 0; iAlias < aliases.length; ++iAlias) {
                const alias = aliases[iAlias];
                delete _nameToClass[alias];
                delete _idToClass[alias];
            }
        }
    }
}

/**
 * @en
 * Get the registered class by id
 * @zh
 * 通过 id 获取已注册的类型
 * @param classId
 * @return constructor
 * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
 */
export function _getClassById (classId) {
    return _idToClass[classId];
}

/**
 * @en
 * Get the registered class by name
 * @zh
 * 通过名字获取已注册的类型
 * @param classname
 * @return constructor of the class
 */
export function getClassByName (classname) {
    return _nameToClass[classname];
}

/**
 * @en
 * Get class id of the object
 * @zh
 * 获取对象的 class id
 * @param obj - instance or constructor
 * @param [allowTempId = true]   - can return temp id in editor
 * @return
 * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
 */
export function _getClassId (obj, allowTempId?: boolean) {
    allowTempId = (typeof allowTempId !== 'undefined' ? allowTempId : true);

    let res;
    // eslint-disable-next-line no-prototype-builtins
    if (typeof obj === 'function' && obj.prototype.hasOwnProperty(classIdTag)) {
        res = obj.prototype[classIdTag];
        if (!allowTempId && (DEV || EDITOR) && isTempClassId(res)) {
            return '';
        }
        return res as string;
    }
    if (obj && obj.constructor) {
        const prototype = obj.constructor.prototype;
        // eslint-disable-next-line no-prototype-builtins
        if (prototype && prototype.hasOwnProperty(classIdTag)) {
            res = obj[classIdTag];
            if (!allowTempId && (DEV || EDITOR) && isTempClassId(res)) {
                return '';
            }
            return res as string;
        }
    }
    return '';
}
