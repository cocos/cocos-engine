import { warnID } from '../platform/CCDebug';

const tempCIDGenerator = new IDGenerator('TmpCId.');
import IDGenerator from './id-generator';

type Getter = () => any;

type Setter = (value: any) => void;

/**
 * Check the object whether is number or not
 * If a number is created by using 'new Number(10086)', the typeof it will be "object"...
 * Then you can use this function if you care about this case.
 */
export function isNumber (object: any) {
    return typeof object === 'number' || object instanceof Number;
}

/**
 * Check the object whether is string or not.
 * If a string is created by using 'new String("blabla")', the typeof it will be "object"...
 * Then you can use this function if you care about this case.
 */
export function isString (object: any) {
    return typeof object === 'string' || object instanceof String;
}

/**
 * Define value, just help to call Object.defineProperty.<br>
 * The configurable will be true.
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
    return (object: Object, propertyName: string, value_: any, writable?: boolean, enumerable?: boolean) => {
        descriptor.value = value_;
        descriptor.writable = writable;
        descriptor.enumerable = enumerable;
        Object.defineProperty(object, propertyName, descriptor);
        descriptor.value = undefined;
    };
})();

/**
 * Define get set accessor, just help to call Object.defineProperty(...).
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
    return (object: Object, propertyName: string, getter: Getter, setter?: Setter, enumerable?: boolean, configurable?: boolean) => {
        if (typeof setter !== 'function') {
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
 * Define get accessor, just help to call Object.defineProperty(...).
 * @param [enumerable=false]
 * @param [configurable=false]
 */
export const get = (() => {
    const descriptor: PropertyDescriptor = {
        get: undefined,
        enumerable: false,
        configurable: false,
    };
    return (object: Object, propertyName: string, getter: Getter, enumerable?: boolean, configurable?: boolean) => {
        descriptor.get = getter;
        descriptor.enumerable = enumerable;
        descriptor.configurable = configurable;
        Object.defineProperty(object, propertyName, descriptor);
        descriptor.get = undefined;
    };
})();

/**
 * Define set accessor, just help to call Object.defineProperty(...).
 * @param [enumerable=false]
 * @param [configurable=false]
 */
export const set = (() => {
    const descriptor: PropertyDescriptor = {
        set: undefined,
        enumerable: false,
        configurable: false,
    };
    return (object: Object, propertyName: string, setter: Setter, enumerable?: boolean, configurable?: boolean) => {
        descriptor.set = setter;
        descriptor.enumerable = enumerable;
        descriptor.configurable = configurable;
        Object.defineProperty(object, propertyName, descriptor);
        descriptor.set = undefined;
    };
})();

/**
 * !#en
 * A simple wrapper of `Object.create(null)` which ensures the return object have no prototype (and thus no inherited members).
 * So we can skip `hasOwnProperty` calls on property lookups.
 * It is a worthwhile optimization than the `{}` literal when `hasOwnProperty` calls are necessary.
 * !#zh
 * 该方法是对 `Object.create(null)` 的简单封装。
 * `Object.create(null)` 用于创建无 prototype （也就无继承）的空对象。
 * 这样我们在该对象上查找属性时，就不用进行 `hasOwnProperty` 判断。
 * 在需要频繁判断 `hasOwnProperty` 时，使用这个方法性能会比 `{}` 更高。
 *
 * @param [forceDictMode=false] Apply the delete operator to newly created map object.
 * This causes V8 to put the object in "dictionary mode" and disables creation of hidden classes
 * which are very expensive for objects that are constantly changing shape.
 */
export function createMap (forceDictMode?: boolean) {
    const map = Object.create(null);
    if (forceDictMode) {
        const INVALID_IDENTIFIER_1 = '.';
        const INVALID_IDENTIFIER_2 = '/';
        map[INVALID_IDENTIFIER_1] = true;
        map[INVALID_IDENTIFIER_2] = true;
        delete map[INVALID_IDENTIFIER_1];
        delete map[INVALID_IDENTIFIER_2];
    }
    return map;
}

/**
 * Get class name of the object, if object is just a {} (and which class named 'Object'), it will return "".
 * (modified from <a href="http://stackoverflow.com/questions/1249531/how-to-get-a-javascript-objects-class">the code from this stackoverflow post</a>)
 * @param objOrCtor instance or constructor
 */
export function getClassName (objOrCtor: Object | Function): string {
    if (typeof objOrCtor === 'function') {
        const prototype = objOrCtor.prototype;
        if (prototype && prototype.hasOwnProperty('__classname__') && prototype.__classname__) {
            return prototype.__classname__;
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
                arr = str.match(/\[\w+\s*(\w+)\]/);
            }
            else {
                // str is function objectClass () {} for IE Firefox
                arr = str.match(/function\s*(\w+)/);
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
 * Defines a polyfill field for obsoleted codes.
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
        if (CC_DEV) {
            warnID(5400, obsoleted, newExpr);
        }
        return this[newProp];
    }
    function setter (this: any, value_: any) {
        if (CC_DEV) {
            warnID(5401, obsoleted, newExpr);
        }
        this[newProp] = value_;
    }

    if (writable) {
        getset(object, oldProp, getter, setter);
    }
    else {
        get(object, oldProp, getter);
    }
}

/**
 * Defines all polyfill fields for obsoleted codes corresponding to the enumerable properties of props.
 * @method obsoletes
 * @param {any} obj - YourObject or YourClass.prototype
 * @param {any} objName - "YourObject" or "YourClass"
 * @param {Object} props
 * @param {Boolean} [writable=false]
 */
export function obsoletes (obj, objName, props, writable) {
    for (const obsoleted in props) {
        const newName = props[obsoleted];
        obsolete(obj, objName + '.' + obsoleted, newName, writable);
    }
}

const REGEXP_NUM_OR_STR = /(%d)|(%s)/;
const REGEXP_STR = /%s/;

/**
 * A string tool to construct a string with format string.
 * @param msg - A JavaScript string containing zero or more substitution strings (%s).
 * @param subst - JavaScript objects with which to replace substitution strings within msg.
 * This gives you additional control over the format of the output.
 * @example
 * cc.js.formatStr("a: %s, b: %s", a, b);
 * cc.js.formatStr(a, b, c);
 */
export function formatStr (msg: string | any, ...subst: any[]) {
    if (arguments.length === 0) {
        return '';
    }
    if (subst.length === 0) {
        return '' + msg;
    }

    const hasSubstitution = typeof msg === 'string' && REGEXP_NUM_OR_STR.test(msg);
    if (hasSubstitution) {
        for (const arg of subst) {
            const regExpToTest = typeof arg === 'number' ? REGEXP_NUM_OR_STR : REGEXP_STR;
            if (regExpToTest.test(msg)) {
                msg = msg.replace(regExpToTest, arg);
            }
            else {
                msg += ' ' + arg;
            }
        }
    } else {
        for (const arg of subst) {
            msg += ' ' + arg;
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

/**
 * Copy all properties not defined in object from arguments[1...n].
 * @param object Object to extend its properties.
 * @param sources Source object to copy properties from.
 * @return The result object.
 */
export function addon (object?: any, ...sources: any[]) {
    object = object || {};
    for (const source of sources) {
        if (source) {
            if (typeof source !== 'object') {
                cc.errorID(5402, source);
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
 * Copy all properties from arguments[1...n] to object.
 * @return The result object.
 */
export function mixin (object?: any, ...sources: any[]) {
    object = object || {};
    for (const source of sources) {
        if (source) {
            if (typeof source !== 'object') {
                cc.errorID(5403, source);
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
 * Derive the class from the supplied base class.
 * Both classes are just native javascript constructors, not created by cc.Class, so
 * usually you will want to inherit using {{#crossLink "cc/Class:method"}}cc.Class {{/crossLink}} instead.
 * @param base The baseclass to inherit.
 * @return The result class.
 */
export function extend (cls: Function, base: Function) {
    if (CC_DEV) {
        if (!base) {
            cc.errorID(5404);
            return;
        }
        if (!cls) {
            cc.errorID(5405);
            return;
        }
        if (Object.keys(cls.prototype).length > 0) {
            cc.errorID(5406);
        }
    }
    for (const p in base) { if (base.hasOwnProperty(p)) { cls[p] = base[p]; } }
    cls.prototype = Object.create(base.prototype, {
        constructor: {
            value: cls,
            writable: true,
            configurable: true,
        },
    });
    return cls;
}

/**
 * Get super class.
 * @param constructor The constructor of subclass.
 */
export function getSuper (constructor: Function) {
    const proto = constructor.prototype; // binded function do not have prototype
    const dunderProto = proto && Object.getPrototypeOf(proto);
    return dunderProto && dunderProto.constructor;
}

/**
 * Checks whether subclass is child of superclass or equals to superclass.
 */
export function isChildClassOf (subclass: Function, superclass: Function) {
    if (subclass && superclass) {
        if (typeof subclass !== 'function') {
            return false;
        }
        if (typeof superclass !== 'function') {
            if (CC_DEV) {
                warnID(3625, superclass);
            }
            return false;
        }
        if (subclass === superclass) {
            return true;
        }
        for (; ;) {
            subclass = getSuper(subclass);
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
 * Removes all enumerable properties from object.
 */
export function clear (object: {}) {
    for (const key of Object.keys(object)) {
        delete object[key];
    }
}

function isTempClassId (id) {
    return typeof id !== 'string' || id.startsWith(tempCIDGenerator.prefix);
}

// id 注册
export const _idToClass = {};
export const _nameToClass = {};

/**
 * Register the class by specified id, if its classname is not defined, the class name will also be set.
 * @method _setClassId
 * @param {String} classId
 * @param {Function} constructor
 * @private
 */
export function _setClassId (id, constructor) {
    const key = '__cid__';
    const table = _idToClass;
    // deregister old
    if (constructor.prototype.hasOwnProperty(key)) {
        delete table[constructor.prototype[key]];
    }
    value(constructor.prototype, key, id);
    // register class
    if (id) {
        const registered = table[id];
        if (registered && registered !== constructor) {
            let error = 'A Class already exists with the same ' + key + ' : "' + id + '".';
            if (CC_TEST) {
                error += ' (This may be caused by error of unit test.) \
If you dont need serialization, you can set class id to "". You can also call \
cc.js.unregisterClass to remove the id of unused class';
            }
            cc.error(error);
        }
        else {
            table[id] = constructor;
        }
        // if (id === "") {
        //    console.trace("", table === _nameToClass);
        // }
    }
}

function doSetClassName (id, constructor) {
    const key = '__classname__';
    const table = _nameToClass;
    // deregister old
    if (constructor.prototype.hasOwnProperty(key)) {
        delete table[constructor.prototype[key]];
    }
    value(constructor.prototype, key, id);
    // register class
    if (id) {
        const registered = table[id];
        if (registered && registered !== constructor) {
            let error = 'A Class already exists with the same ' + key + ' : "' + id + '".';
            if (CC_TEST) {
                error += ' (This may be caused by error of unit test.) \
If you dont need serialization, you can set class id to "". You can also call \
cc.js.unregisterClass to remove the id of unused class';
            }
            cc.error(error);
        }
        else {
            table[id] = constructor;
        }
        // if (id === "") {
        //    console.trace("", table === _nameToClass);
        // }
    }
}

/**
 * Register the class by specified name manually
 * @method setClassName
 * @param {String} className
 * @param {Function} constructor
 */
export function setClassName (className, constructor) {
    doSetClassName(className, constructor);
    // auto set class id
    if (!constructor.prototype.hasOwnProperty('__cid__')) {
        const id = className || tempCIDGenerator.getNewId();
        if (id) {
            _setClassId(id, constructor);
        }
    }
}

/**
 * Unregister a class from fireball.
 *
 * If you dont need a registered class anymore, you should unregister the class so that Fireball will not keep its reference anymore.
 * Please note that its still your responsibility to free other references to the class.
 *
 * @method unregisterClass
 * @param {Function} ...constructor - the class you will want to unregister, any number of classes can be added
 */
export function unregisterClass (...constructors: Function[]) {
    for (const constructor of constructors) {
        const p = constructor.prototype;
        const classId = p.__cid__;
        if (classId) {
            delete _idToClass[classId];
        }
        const classname = p.__classname__;
        if (classname) {
            delete _nameToClass[classname];
        }
    }
}

/**
 * Get the registered class by id
 * @method _getClassById
 * @param {String} classId
 * @return {Function} constructor
 * @private
 */
export function _getClassById (classId) {
    return _idToClass[classId];
}

/**
 * Get the registered class by name
 * @method getClassByName
 * @param {String} classname
 * @return {Function} constructor
 */
export function getClassByName (classname) {
    return _nameToClass[classname];
}

/**
 * Get class id of the object
 * @method _getClassId
 * @param {Object|Function} obj - instance or constructor
 * @param {Boolean} [allowTempId=true] - can return temp id in editor
 * @return {String}
 * @private
 */
export function _getClassId (obj, allowTempId) {
    allowTempId = (typeof allowTempId !== 'undefined' ? allowTempId : true);

    let res;
    if (typeof obj === 'function' && obj.prototype.hasOwnProperty('__cid__')) {
        res = obj.prototype.__cid__;
        if (!allowTempId && (CC_DEV || CC_EDITOR) && isTempClassId(res)) {
            return '';
        }
        return res;
    }
    if (obj && obj.constructor) {
        const prototype = obj.constructor.prototype;
        if (prototype && prototype.hasOwnProperty('__cid__')) {
            res = obj.__cid__;
            if (!allowTempId && (CC_DEV || CC_EDITOR) && isTempClassId(res)) {
                return '';
            }
            return res;
        }
    }
    return '';
}
